import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface BoxObject {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

interface Box {
	toString(): string;
	toJSON(): BoxObject;
	equals(otherBox: string | Box | BoxObject): boolean;

	x1: number;
	y1: number;
	x2: number;
	y2: number;
}

interface BoxConstructor {
	from(x1: number, y1: number, x2: number, y2: number): Box;
	from(data: Box | BoxObject): Box;
	from(str: string): Box;
	/**
	 * Returns `true` if `obj` is a `Box`, `false` otherwise.
	 */
	isBox(obj: any): obj is Box;
}

const Box: BoxConstructor = {
	from(arg: string | Box | BoxObject | number, y1?: number, x2?: number, y2?: number): Box {
		if (typeof arg === "string") {
			if (arg.match(/^\(\d+(\.\d+)?,\d+(\.\d+)?\),\(\d+(\.\d+)?,\d+(\.\d+)?\)$/)) {
				const [x1, y1, x2, y2] = arg.split(",").map(c => parseFloat(c.replace("(", "")));
				return new BoxClass({
					x1,
					y1,
					x2,
					y2,
				});
			}
			throw new Error("Invalid Box string");
		} else if (Box.isBox(arg)) return new BoxClass(arg.toJSON());
		else if (typeof arg === "number") {
			if (typeof y1 === "number" && typeof x2 === "number" && typeof y2 === "number") return new BoxClass({ x1: arg, y1, x2, y2 });
			else throw new Error("Invalid Box array, invalid numbers");
		} else {
			if (
				!("x1" in arg && typeof arg.x1 === "number") ||
				!("y1" in arg && typeof arg.y1 === "number") ||
				!("x2" in arg && typeof arg.x2 === "number") ||
				!("y2" in arg && typeof arg.y2 === "number")
			)
				throw new Error("Invalid Box object");
			return new BoxClass(arg);
		}
	},
	isBox(obj: any): obj is Box {
		return obj instanceof BoxClass;
	},
};

class BoxClass implements Box {
	private _x1: number;
	private _y1: number;
	private _x2: number;
	private _y2: number;

	constructor(data: BoxObject) {
		this._x1 = data.x1;
		this._y1 = data.y1;
		this._x2 = data.x2;
		this._y2 = data.y2;
	}

	toString(): string {
		return `(${this._x1},${this._y1}),(${this._x2},${this._y2})`;
	}

	toJSON(): BoxObject {
		return {
			x1: this._x1,
			y1: this._y1,
			x2: this._x2,
			y2: this._y2,
		};
	}

	equals(otherBox: string | Box | BoxObject): boolean {
		if (typeof otherBox === "string") return otherBox === this.toString();
		else if (Box.isBox(otherBox)) return otherBox.toString() === this.toString();
		else return otherBox.x1 === this._x1 && otherBox.y1 === this._y1 && otherBox.x2 === this._x2 && otherBox.y2 === this._y2;
	}

	get x1(): number {
		return this._x1;
	}

	set x1(x1: number) {
		this._x1 = x1;
	}

	get y1(): number {
		return this._y1;
	}

	set y1(y1: number) {
		this._y1 = y1;
	}

	get x2(): number {
		return this._x2;
	}

	set x2(x2: number) {
		this._x2 = x2;
	}

	get y2(): number {
		return this._y2;
	}

	set y2(y2: number) {
		this._y2 = y2;
	}
}

types.setTypeParser(DataType.box as any, parser(Box));
types.setTypeParser(DataType._box as any, arrayParser(Box, ";"));

export { Box, BoxObject };
