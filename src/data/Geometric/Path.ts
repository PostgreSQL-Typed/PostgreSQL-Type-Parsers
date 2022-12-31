import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { Point, PointObject } from "./Point";

interface PathObject {
	points: Point[];
	connection: "open" | "closed";
}

interface RawPathObject {
	points: PointObject[];
	connection: "open" | "closed";
}

interface Path {
	toString(): string;
	toJSON(): RawPathObject;
	equals(
		otherPath: string | Path | PathObject | RawPathObject | Point[]
	): boolean;

	points: Point[];
	connection: "open" | "closed";
}

interface PathConstructor {
	from(point: Point, ...points: Point[]): Path;
	from(points: Point[]): Path;
	from(data: Path | PathObject | RawPathObject): Path;
	from(str: string): Path;
	/**
	 * Returns `true` if `obj` is a `Path`, `false` otherwise.
	 */
	isPath(obj: any): obj is Path;
}

const Path: PathConstructor = {
	from(
		arg: string | Path | PathObject | RawPathObject | Point | Point[],
		...extraPoints: Point[]
	): Path {
		if (typeof arg === "string") {
			if (
				arg.match(
					/^\(\(\d+(\.\d+)?,\d+(\.\d+)?\)(,\(\d+(\.\d+)?,\d+(\.\d+)?\))*\)$/
				)
			) {
				const points = arg
					.slice(1, -1)
					.split("),(")
					.join("), (")
					.split(", ")
					.map(p => Point.from(p));
				return new PathClass({
					points,
					connection: "open"
				});
			} else if (
				arg.match(
					/^\[\(\d+(\.\d+)?,\d+(\.\d+)?\)(,\(\d+(\.\d+)?,\d+(\.\d+)?\))*\]$/
				)
			) {
				const points = arg
					.slice(1, -1)
					.split("),(")
					.join("), (")
					.split(", ")
					.map(p => Point.from(p));
				return new PathClass({
					points,
					connection: "closed"
				});
			}
			throw new Error("Invalid Path string");
		} else if (Path.isPath(arg)) {
			if (arg.points.length) return new PathClass(arg.toJSON());
			else throw new Error("Invalid Path object, too few points");
		} else if (Array.isArray(arg) || Point.isPoint(arg)) {
			if (![...(Point.isPoint(arg) ? [arg] : arg)].length)
				throw new Error("Invalid Path object, too few points");

			if (
				[...(Point.isPoint(arg) ? [arg] : arg), ...extraPoints].every(
					Point.isPoint
				)
			) {
				return new PathClass({
					points: [...(Point.isPoint(arg) ? [arg] : arg), ...extraPoints],
					connection: "open"
				});
			} else {
				throw new Error("Invalid Path array, invalid points");
			}
		} else {
			if (!("points" in arg)) throw new Error("Invalid Path object");
			if (!arg.points.length)
				throw new Error("Invalid Path object, too few points");
			if (!arg.points.every(Point.isPoint)) {
				try {
					arg.points = arg.points.map(Point.from);
				} catch {
					throw new Error("Invalid Path object, invalid points");
				}
			}
			if (arg.connection !== "open" && arg.connection !== "closed")
				throw new Error("Invalid Path object, invalid connection");
			return new PathClass(arg);
		}
	},
	isPath(obj: any): obj is Path {
		return obj instanceof PathClass;
	}
};

class PathClass implements Path {
	private _points: Point[];
	private _connection: "open" | "closed";

	constructor(data: PathObject | RawPathObject) {
		this._connection = data.connection;
		if (data.points.every(Point.isPoint)) {
			this._points = data.points as Point[];
		} else {
			this._points = data.points.map(Point.from);
		}
	}

	toString(): string {
		if (this._connection === "open") {
			return `(${this._points.map(p => p.toString()).join(",")})`;
		} else {
			return `[${this._points.map(p => p.toString()).join(",")}]`;
		}
	}

	toJSON(): RawPathObject {
		return {
			points: this._points.map(p => p.toJSON()),
			connection: this._connection
		};
	}

	equals(
		otherPath: string | Path | PathObject | RawPathObject | Point[]
	): boolean {
		if (typeof otherPath === "string") {
			return otherPath === this.toString();
		} else if (Path.isPath(otherPath)) {
			return otherPath.toString() === this.toString();
		} else if (Array.isArray(otherPath) && otherPath.every(Point.isPoint)) {
			return (
				Array.isArray(this._points) &&
				this._connection === "open" &&
				otherPath.length === this._points.length &&
				otherPath.every((val, index) => val.equals(this._points[index]))
			);
		} else {
			return (
				Array.isArray(otherPath.points) &&
				Array.isArray(this._points) &&
				otherPath.connection === this._connection &&
				otherPath.points.length === this._points.length &&
				otherPath.points.every((val, index) =>
					Point.from(val).equals(this._points[index])
				)
			);
		}
	}

	get points(): Point[] {
		return this._points;
	}

	set points(points: Point[]) {
		this._points = points;
	}

	get connection(): "open" | "closed" {
		return this._connection;
	}

	set connection(connection: "open" | "closed") {
		this._connection = connection;
	}
}

types.setTypeParser(DataType.path as any, parser(Path));
types.setTypeParser(DataType._path as any, arrayParser(Path));

export { Path, PathObject, RawPathObject };
