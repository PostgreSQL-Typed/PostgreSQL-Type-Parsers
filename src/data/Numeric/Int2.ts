import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface Int2Object {
	int2: number;
}

interface Int2 {
	toString(): string;
	toNumber(): number;
	toJSON(): Int2Object;
	equals(otherInt2: string | number | Int2 | Int2Object): boolean;

	int2: number;
}

interface Int2Constructor {
	from(data: Int2 | Int2Object): Int2;
	from(str: string | number): Int2;
	/**
	 * Returns `true` if `obj` is a `Int2`, `false` otherwise.
	 */
	isInt2(obj: any): obj is Int2;
}

const Int2: Int2Constructor = {
	from(arg: string | number | Int2 | Int2Object): Int2 {
		if (typeof arg === "string") {
			arg = parseFloat(arg);
			if (!isNaN(arg) && arg % 1 === 0 && arg >= -32768 && arg <= 32767) {
				return new Int2Class({
					int2: arg,
				});
			}
			throw new Error("Invalid Int2 string");
		} else if (typeof arg === "number") {
			if (arg % 1 === 0 && arg >= -32768 && arg <= 32767) {
				return new Int2Class({
					int2: arg,
				});
			}
			throw new Error("Invalid Int2 number");
		} else if (Int2.isInt2(arg)) return new Int2Class(arg.toJSON());
		else {
			if (typeof arg === "object" && "int2" in arg && typeof arg.int2 === "number" && arg.int2 % 1 === 0 && arg.int2 >= -32768 && arg.int2 <= 32767)
				return new Int2Class(arg);
			throw new Error("Invalid Int2 object");
		}
	},
	isInt2(obj: any): obj is Int2 {
		return obj instanceof Int2Class;
	},
};

class Int2Class implements Int2 {
	private _int2: number;

	constructor(data: Int2Object) {
		this._int2 = data.int2;
	}

	toString(): string {
		return this._int2.toString();
	}

	toNumber(): number {
		return this._int2;
	}

	toJSON(): Int2Object {
		return {
			int2: this._int2,
		};
	}

	equals(otherInt2: string | number | Int2 | Int2Object): boolean {
		if (typeof otherInt2 === "string") return otherInt2 === this.toString();
		else if (typeof otherInt2 === "number") return otherInt2 === this._int2;
		else if (Int2.isInt2(otherInt2)) return otherInt2.toString() === this.toString();
		else return otherInt2.int2 === this._int2;
	}

	get int2(): number {
		return this._int2;
	}

	set int2(int2: number) {
		if (int2 % 1 === 0 && int2 >= -32768 && int2 <= 32767) this._int2 = int2;
		else throw new Error("Invalid Int2");
	}
}

types.setTypeParser(DataType.int2 as any, parser(Int2));
types.setTypeParser(DataType._int2 as any, arrayParser(Int2, ","));

export { Int2, Int2Object };
