import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface Int4Object {
	Int4: number;
}

interface Int4 {
	toString(): string;
	toNumber(): number;
	toJSON(): Int4Object;
	equals(otherInt4: string | number | Int4 | Int4Object): boolean;

	Int4: number;
}

interface Int4Constructor {
	from(data: Int4 | Int4Object): Int4;
	from(str: string | number): Int4;
	/**
	 * Returns `true` if `obj` is a `Int4`, `false` otherwise.
	 */
	isInt4(obj: any): obj is Int4;
}

const Int4: Int4Constructor = {
	from(arg: string | number | Int4 | Int4Object): Int4 {
		if (typeof arg === "string") {
			arg = parseFloat(arg);
			if (!isNaN(arg) && arg % 1 === 0 && arg >= -2147483648 && arg <= 2147483647) {
				return new Int4Class({
					Int4: arg,
				});
			}
			throw new Error("Invalid Int4 string");
		} else if (typeof arg === "number") {
			if (arg % 1 === 0 && arg >= -2147483648 && arg <= 2147483647) {
				return new Int4Class({
					Int4: arg,
				});
			}
			throw new Error("Invalid Int4 number");
		} else if (Int4.isInt4(arg)) return new Int4Class(arg.toJSON());
		else {
			if (typeof arg === "object" && "Int4" in arg && typeof arg.Int4 === "number" && arg.Int4 % 1 === 0 && arg.Int4 >= -2147483648 && arg.Int4 <= 2147483647)
				return new Int4Class(arg);
			throw new Error("Invalid Int4 object");
		}
	},
	isInt4(obj: any): obj is Int4 {
		return obj instanceof Int4Class;
	},
};

class Int4Class implements Int4 {
	private _Int4: number;

	constructor(data: Int4Object) {
		this._Int4 = data.Int4;
	}

	toString(): string {
		return this._Int4.toString();
	}

	toNumber(): number {
		return this._Int4;
	}

	toJSON(): Int4Object {
		return {
			Int4: this._Int4,
		};
	}

	equals(otherInt4: string | number | Int4 | Int4Object): boolean {
		if (typeof otherInt4 === "string") return otherInt4 === this.toString();
		else if (typeof otherInt4 === "number") return otherInt4 === this._Int4;
		else if (Int4.isInt4(otherInt4)) return otherInt4.toString() === this.toString();
		else return otherInt4.Int4 === this._Int4;
	}

	get Int4(): number {
		return this._Int4;
	}

	set Int4(Int4: number) {
		if (Int4 % 1 === 0 && Int4 >= -2147483648 && Int4 <= 2147483647) this._Int4 = Int4;
		else throw new Error("Invalid Int4");
	}
}

types.setTypeParser(DataType.int4 as any, parser(Int4));
types.setTypeParser(DataType._int4 as any, arrayParser(Int4, ","));

export { Int4, Int4Object };
