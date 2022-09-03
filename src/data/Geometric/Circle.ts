import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface CircleObject {
	x: number;
	y: number;
	radius: number;
}

interface Circle {
	toString(): string;
	toJSON(): CircleObject;
	equals(otherCircle: string | Circle | CircleObject): boolean;

	x: number;
	y: number;
	radius: number;
}

interface CircleConstructor {
	from(x: number, y: number, radius: number): Circle;
	from(data: Circle | CircleObject): Circle;
	from(str: string): Circle;
	/**
	 * Returns `true` if `obj` is a `Circle`, `false` otherwise.
	 */
	isCircle(obj: any): obj is Circle;
}

const Circle: CircleConstructor = {
	from(
		arg: string | Circle | CircleObject | number,
		y?: number,
		radius?: number
	): Circle {
		if (typeof arg === "string") {
			if (arg.match(/^<\(\d+(\.\d+)?,\d+(\.\d+)?\),\d+(\.\d+)?>$/)) {
				const [x, y, radius] = arg
					.slice(2, -1)
					.split(",")
					.map(c => parseFloat(c));
				return new CircleClass({
					x,
					y,
					radius
				});
			}
			throw new Error("Invalid circle string");
		} else if (Circle.isCircle(arg)) {
			return new CircleClass(arg.toJSON());
		} else if (typeof arg === "number") {
			if (typeof y === "number" && typeof radius === "number") {
				return new CircleClass({ x: arg, y, radius });
			} else {
				throw new Error("Invalid arguments");
			}
		} else {
			return new CircleClass(arg);
		}
	},
	isCircle(obj: any): obj is Circle {
		return obj instanceof CircleClass;
	}
};

class CircleClass implements Circle {
	private _x: number;
	private _y: number;
	private _radius: number;

	constructor(data: CircleObject) {
		this._x = data.x;
		this._y = data.y;
		this._radius = data.radius;
	}

	toString(): string {
		return `<(${this._x},${this._y}),${this._radius}>`;
	}

	toJSON(): CircleObject {
		return {
			x: this._x,
			y: this._y,
			radius: this._radius
		};
	}

	equals(otherCircle: string | Circle | CircleObject): boolean {
		if (typeof otherCircle === "string") {
			return otherCircle === this.toString();
		} else if (Circle.isCircle(otherCircle)) {
			return otherCircle.toString() === this.toString();
		} else {
			return (
				otherCircle.x === this._x &&
				otherCircle.y === this._y &&
				otherCircle.radius === this._radius
			);
		}
	}

	get x(): number {
		return this._x;
	}

	set x(x: number) {
		this._x = x;
	}

	get y(): number {
		return this._y;
	}

	set y(y: number) {
		this._y = y;
	}

	get radius(): number {
		return this._radius;
	}

	set radius(radius: number) {
		this._radius = radius;
	}
}

types.setTypeParser(DataType.circle as any, parser(Circle));
types.setTypeParser(DataType._circle as any, arrayParser(Circle));

export { Circle, CircleObject };
