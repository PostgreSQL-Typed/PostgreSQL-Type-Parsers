import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../util/arrayParser";
import { parser } from "../util/parser";

interface LineObject {
	a: number;
	b: number;
	c: number;
}

interface Line {
	toString(): string;
	toJSON(): LineObject;
	equals(otherLine: string | Line | LineObject): boolean;

	a: number;
	b: number;
	c: number;
}

interface LineConstructor {
	from(a: number, b: number, c: number): Line;
	from(data: Line | LineObject): Line;
	from(str: string): Line;
	/**
	 * Returns `true` if `obj` is a `Line`, `false` otherwise.
	 */
	isLine(obj: any): obj is Line;
}

const Line: LineConstructor = {
	from(arg: string | Line | LineObject | number, b?: number, c?: number): Line {
		if (typeof arg === "string") {
			if (arg.match(/^{\d+(\.\d+)?,\d+(\.\d+)?,\d+(\.\d+)?}$/)) {
				const [a, b, c] = arg
					.slice(1, -1)
					.split(",")
					.map(l => parseFloat(l));
				return new LineClass({
					a,
					b,
					c
				});
			}
			throw new Error("Invalid line string");
		} else if (Line.isLine(arg)) {
			return new LineClass(arg.toJSON());
		} else if (typeof arg === "number") {
			if (typeof b === "number" && typeof c === "number") {
				return new LineClass({ a: arg, b, c });
			} else {
				throw new Error("Invalid arguments");
			}
		} else {
			return new LineClass(arg);
		}
	},
	isLine(obj: any): obj is Line {
		return obj instanceof LineClass;
	}
};

class LineClass implements Line {
	private _a: number;
	private _b: number;
	private _c: number;

	constructor(data: LineObject) {
		this._a = data.a;
		this._b = data.b;
		this._c = data.c;
	}

	toString(): string {
		return `{${this._a},${this._b},${this._c}}`;
	}

	toJSON(): LineObject {
		return {
			a: this._a,
			b: this._b,
			c: this._c
		};
	}

	equals(otherLine: string | Line | LineObject): boolean {
		if (typeof otherLine === "string") {
			return otherLine === this.toString();
		} else if (Line.isLine(otherLine)) {
			return otherLine.toString() === this.toString();
		} else {
			return (
				otherLine.a === this._a &&
				otherLine.b === this._b &&
				otherLine.c === this._c
			);
		}
	}

	get a(): number {
		return this._a;
	}

	set a(a: number) {
		this._a = a;
	}

	get b(): number {
		return this._b;
	}

	set b(b: number) {
		this._b = b;
	}

	get c(): number {
		return this._c;
	}

	set c(c: number) {
		this._c = c;
	}
}

types.setTypeParser(DataType.line as any, parser(Line));
types.setTypeParser(DataType._line as any, arrayParser(Line));

export { Line, LineObject };
