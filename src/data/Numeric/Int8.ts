import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface Int8Object {
	int8: bigint;
}

interface Int8 {
	toString(): string;
	toBigint(): bigint;
	toJSON(): Int8Object;
	equals(otherInt8: string | number | bigint | Int8 | Int8Object): boolean;

	int8: bigint;
}

interface Int8Constructor {
	from(data: Int8 | Int8Object): Int8;
	from(str: string | number | bigint): Int8;
	/**
	 * Returns `true` if `obj` is a `Int8`, `false` otherwise.
	 */
	isInt8(obj: any): obj is Int8;
}

const Int8: Int8Constructor = {
	from(arg: string | number | bigint | Int8 | Int8Object): Int8 {
		if (typeof arg === "string" || typeof arg === "number") {
			const oldType = typeof arg;
			try {
				arg = BigInt(arg);
			} catch {
				throw new Error(`Invalid Int8 ${oldType}`);
			}
			if (arg >= BigInt("-9223372036854775808") && arg <= BigInt("9223372036854775807")) {
				return new Int8Class({
					int8: arg,
				});
			}
			throw new Error(`Invalid Int8 ${oldType}`);
		} else if (typeof arg === "bigint") {
			if (arg >= BigInt("-9223372036854775808") && arg <= BigInt("9223372036854775807")) {
				return new Int8Class({
					int8: arg,
				});
			}
			throw new Error("Invalid Int8 bigint");
		} else if (Int8.isInt8(arg)) return new Int8Class(arg.toJSON());
		else {
			if (
				typeof arg === "object" &&
				"int8" in arg &&
				typeof arg.int8 === "bigint" &&
				arg.int8 >= BigInt("-9223372036854775808") &&
				arg.int8 <= BigInt("9223372036854775807")
			)
				return new Int8Class(arg);
			throw new Error("Invalid Int8 object");
		}
	},
	isInt8(obj: any): obj is Int8 {
		return obj instanceof Int8Class;
	},
};

class Int8Class implements Int8 {
	private _int8: bigint;

	constructor(data: Int8Object) {
		this._int8 = data.int8;
	}

	toString(): string {
		return this._int8.toString();
	}

	toBigint(): bigint {
		return this._int8;
	}

	toJSON(): Int8Object {
		return {
			int8: this._int8,
		};
	}

	equals(otherInt8: string | number | bigint | Int8 | Int8Object): boolean {
		if (typeof otherInt8 === "string") return otherInt8 === this.toString();
		else if (typeof otherInt8 === "bigint") return otherInt8 === this._int8;
		else if (typeof otherInt8 === "number") return BigInt(otherInt8) === this._int8;
		else if (Int8.isInt8(otherInt8)) return otherInt8.toString() === this.toString();
		else return otherInt8.int8 === this._int8;
	}

	get int8(): bigint {
		return this._int8;
	}

	set int8(int8: bigint) {
		if (int8 >= BigInt("-9223372036854775808") && int8 <= BigInt("9223372036854775807")) this._int8 = int8;
		else throw new Error("Invalid Int8");
	}
}

types.setTypeParser(DataType.int8 as any, parser(Int8));
types.setTypeParser(DataType._int8 as any, arrayParser(Int8, ","));

export { Int8, Int8Object };
