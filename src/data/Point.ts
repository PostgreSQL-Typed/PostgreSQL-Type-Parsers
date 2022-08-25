import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../util/arrayParser";
import { parser } from "../util/parser";

interface PointObject {
	x: number;
	y: number;
}

interface Point {
	toString(): string;
	toJSON(): PointObject;
	equals(otherBuffer: string | Point | PointObject): boolean;

	x: number;
	y: number;
}

interface PointConstructor {
	from(x: number, y: number): Point;
	from(data: Point | PointObject): Point;
	from(str: string): Point;
	/**
	 * Returns `true` if `obj` is a `Point`, `false` otherwise.
	 */
	isPoint(obj: any): obj is Point;
}

const Point: PointConstructor = {
	from(arg: string | Point | PointObject | number, y?: number): Point {
		if (typeof arg === "string") {
			if (arg.match(/^\(\d+(\.\d+)?,\d+(\.\d+)?\)$/))
				return new PointClass({
					x: parseFloat(arg.slice(1, -1).split(",")[0]),
					y: parseFloat(arg.slice(1, -1).split(",")[1])
				});
			throw new Error("Invalid point string");
		} else if (Point.isPoint(arg)) {
			return new PointClass(arg.toJSON());
		} else if (typeof arg === "number") {
			if (typeof y === "number") {
				return new PointClass({ x: arg, y: y });
			} else {
				throw new Error("Invalid arguments");
			}
		} else {
			return new PointClass(arg);
		}
	},
	isPoint(obj: any): obj is Point {
		return obj instanceof PointClass;
	}
};

class PointClass implements Point {
	private _x: number;
	private _y: number;

	constructor(data: PointObject) {
		this._x = data.x;
		this._y = data.y;
	}

	toString(): string {
		return `(${this._x},${this._y})`;
	}

	toJSON(): PointObject {
		return {
			x: this._x,
			y: this._y
		};
	}

	equals(otherPoint: string | Point | PointObject): boolean {
		if (typeof otherPoint === "string") {
			return otherPoint === this.toString();
		} else if (Point.isPoint(otherPoint)) {
			return otherPoint.toString() === this.toString();
		} else {
			return otherPoint.x === this._x && otherPoint.y === this._y;
		}
	}

	get x(): number {
		return this._x;
	}

	get y(): number {
		return this._y;
	}

	set x(x: number) {
		this._x = x;
	}

	set y(y: number) {
		this._y = y;
	}
}

types.setTypeParser(DataType.point as any, parser(Point));
types.setTypeParser(DataType._point as any, arrayParser(Point));

export { Point, PointObject };
