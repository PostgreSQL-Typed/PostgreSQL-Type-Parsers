import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { Point, PointObject } from "./Point";

interface PolygonObject {
	points: Point[];
}

interface RawPolygonObject {
	points: PointObject[];
}

interface Polygon {
	toString(): string;
	toJSON(): RawPolygonObject;
	equals(
		otherPolygon: string | Polygon | PolygonObject | RawPolygonObject | Point[]
	): boolean;

	points: Point[];
}

interface PolygonConstructor {
	from(point: Point, ...points: Point[]): Polygon;
	from(points: Point[]): Polygon;
	from(data: Polygon | PolygonObject | RawPolygonObject): Polygon;
	from(str: string): Polygon;
	/**
	 * Returns `true` if `obj` is a `Polygon`, `false` otherwise.
	 */
	isPolygon(obj: any): obj is Polygon;
}

const Polygon: PolygonConstructor = {
	from(
		arg: string | Polygon | PolygonObject | RawPolygonObject | Point | Point[],
		...extraPoints: Point[]
	): Polygon {
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
				return new PolygonClass({
					points
				});
			}
			throw new Error("Invalid Polygon string");
		} else if (Polygon.isPolygon(arg)) {
			if (!arg.points.length)
				throw new Error("Invalid Polygon object, too few points");
			if (!arg.points.every(Point.isPoint))
				throw new Error("Invalid Polygon object, invalid points");
			return new PolygonClass(arg.toJSON());
		} else if (Array.isArray(arg) || Point.isPoint(arg)) {
			if (![...(Point.isPoint(arg) ? [arg] : arg)].length)
				throw new Error("Invalid Polygon array, too few points");

			if (
				[...(Point.isPoint(arg) ? [arg] : arg), ...extraPoints].every(
					Point.isPoint
				)
			) {
				return new PolygonClass({
					points: [...(Point.isPoint(arg) ? [arg] : arg), ...extraPoints]
				});
			} else {
				throw new Error("Invalid Polygon array, invalid points");
			}
		} else {
			if (!("points" in arg)) throw new Error("Invalid Polygon object");
			if (!arg.points.length)
				throw new Error("Invalid Polygon object, too few points");
			if (!arg.points.every(Point.isPoint)) {
				try {
					arg.points = arg.points.map(Point.from);
				} catch {
					throw new Error("Invalid Polygon object, invalid points");
				}
			}
			return new PolygonClass(arg);
		}
	},
	isPolygon(obj: any): obj is Polygon {
		return obj instanceof PolygonClass;
	}
};

class PolygonClass implements Polygon {
	private _points: Point[];

	constructor(data: PolygonObject | RawPolygonObject) {
		if (data.points.every(Point.isPoint)) {
			this._points = data.points as Point[];
		} else {
			this._points = data.points.map(Point.from);
		}
	}

	toString(): string {
		return `(${this._points.map(p => p.toString()).join(",")})`;
	}

	toJSON(): RawPolygonObject {
		return {
			points: this._points.map(p => p.toJSON())
		};
	}

	equals(
		otherPolygon: string | Polygon | PolygonObject | RawPolygonObject | Point[]
	): boolean {
		if (typeof otherPolygon === "string") {
			return otherPolygon === this.toString();
		} else if (Polygon.isPolygon(otherPolygon)) {
			return otherPolygon.toString() === this.toString();
		} else if (
			Array.isArray(otherPolygon) &&
			otherPolygon.every(Point.isPoint)
		) {
			return (
				Array.isArray(this._points) &&
				otherPolygon.length === this._points.length &&
				otherPolygon.every((val, index) => val.equals(this._points[index]))
			);
		} else {
			return (
				Array.isArray(otherPolygon.points) &&
				Array.isArray(this._points) &&
				otherPolygon.points.length === this._points.length &&
				otherPolygon.points.every((val, index) =>
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
}

types.setTypeParser(DataType.polygon as any, parser(Polygon));
types.setTypeParser(DataType._polygon as any, arrayParser(Polygon));

export { Polygon, PolygonObject, RawPolygonObject };
