import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../util/arrayParser";
import { parser } from "../util/parser";
import { Point, PointObject } from "./Point";

interface LineSegmentObject {
	a: Point;
	b: Point;
}

interface RawLineSegmentObject {
	a: PointObject;
	b: PointObject;
}

interface LineSegment {
	toString(): string;
	toJSON(): RawLineSegmentObject;
	equals(
		otherBuffer: string | LineSegment | LineSegmentObject | RawLineSegmentObject
	): boolean;

	a: Point;
	b: Point;
}

interface LineSegmentConstructor {
	from(a: Point, b: Point): LineSegment;
	from(
		data: LineSegment | LineSegmentObject | RawLineSegmentObject
	): LineSegment;
	from(str: string): LineSegment;
	/**
	 * Returns `true` if `obj` is a `LineSegment`, `false` otherwise.
	 */
	isLineSegment(obj: any): obj is LineSegment;
}

const LineSegment: LineSegmentConstructor = {
	from(
		arg:
			| string
			| LineSegment
			| LineSegmentObject
			| RawLineSegmentObject
			| Point,
		b?: Point
	): LineSegment {
		if (typeof arg === "string") {
			if (
				arg.match(
					/^\[\(\d+(\.\d+)?,\d+(\.\d+)?\),\(\d+(\.\d+)?,\d+(\.\d+)?\)\]$/
				)
			) {
				const [x1, y1] = arg.slice(1, -1).split("),(").join("), (").split(", ");
				return new LineSegmentClass({
					a: Point.from(x1),
					b: Point.from(y1)
				});
			}
			throw new Error("Invalid lseg (LineSegment) string");
		} else if (LineSegment.isLineSegment(arg)) {
			return new LineSegmentClass(arg.toJSON());
		} else if (Point.isPoint(arg)) {
			if (Point.isPoint(b)) {
				return new LineSegmentClass({ a: arg, b: b });
			} else {
				throw new Error("Invalid arguments");
			}
		} else if (
			"a" in arg &&
			"b" in arg &&
			Point.isPoint(arg.a) &&
			Point.isPoint(arg.b)
		) {
			return new LineSegmentClass(arg as LineSegmentObject);
		} else {
			return new LineSegmentClass({
				a: Point.from(arg.a),
				b: Point.from(arg.b)
			});
		}
	},
	isLineSegment(obj: any): obj is LineSegment {
		return obj instanceof LineSegmentClass;
	}
};

class LineSegmentClass implements LineSegment {
	private _a: Point;
	private _b: Point;

	constructor(data: LineSegmentObject | RawLineSegmentObject) {
		if (Point.isPoint(data.a) && Point.isPoint(data.b)) {
			this._a = data.a;
			this._b = data.b;
		} else {
			this._a = Point.from(data.a);
			this._b = Point.from(data.b);
		}
	}

	toString(): string {
		return `[${this._a.toString()},${this._b.toString()}]`;
	}

	toJSON(): RawLineSegmentObject {
		return {
			a: this._a.toJSON(),
			b: this._b.toJSON()
		};
	}

	equals(
		otherPoint: string | LineSegment | LineSegmentObject | RawLineSegmentObject
	): boolean {
		if (typeof otherPoint === "string") {
			return otherPoint === this.toString();
		} else if (LineSegment.isLineSegment(otherPoint)) {
			return otherPoint.toString() === this.toString();
		} else if ("equals" in otherPoint.a && "equals" in otherPoint.b) {
			return otherPoint.a.equals(this.a) && otherPoint.b.equals(this.b);
		} else {
			return (
				Point.from(otherPoint.a).equals(this.a) &&
				Point.from(otherPoint.b).equals(this.b)
			);
		}
	}

	get a(): Point {
		return this._a;
	}

	get b(): Point {
		return this._b;
	}

	set a(a: Point) {
		this._a = a;
	}

	set b(b: Point) {
		this._b = b;
	}
}

types.setTypeParser(DataType.lseg as any, parser(LineSegment));
types.setTypeParser(DataType._lseg as any, arrayParser(LineSegment));

export { LineSegment, LineSegmentObject, RawLineSegmentObject };
