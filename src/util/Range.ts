import isEqual from "lodash.isequal";

import { ObjectFunction } from "../types/ObjectFunction";

enum LowerRange {
	include = "[",
	exclude = "("
}

const lowerRange = ["[", "("];

enum UpperRange {
	include = "]",
	exclude = ")"
}

const upperRange = ["]", ")"];

interface RangeObject<DataTypeObject> {
	lower: LowerRange;
	upper: UpperRange;
	value: {
		lower: DataTypeObject;
		upper: DataTypeObject;
	} | null;
}

interface Range<DataType, DataTypeObject> {
	toString(): string;
	toJSON(): RangeObject<DataTypeObject>;
	equals(
		otherRange:
			| string
			| Range<DataType, DataTypeObject>
			| RangeObject<DataTypeObject>
	): boolean;

	lower: LowerRange;
	upper: UpperRange;
	value: {
		lower: DataTypeObject;
		upper: DataTypeObject;
	} | null;

	isEmpty(): boolean;
	isWithinRange(value: DataType): boolean;

	readonly lowerValue: DataType | null;
	readonly upperValue: DataType | null;
}

interface RangeConstructor<DataType, DataTypeObject> {
	from(
		lower: LowerRange,
		upper: UpperRange,
		lowerValue: DataType,
		upperValue: DataType
	): Range<DataType, DataTypeObject>;
	from(
		lower: LowerRange,
		upper: UpperRange,
		value: {
			lower: DataTypeObject;
			upper: DataTypeObject;
		} | null
	): Range<DataType, DataTypeObject>;
	from(
		data: Range<DataType, DataTypeObject> | RangeObject<DataTypeObject>
	): Range<DataType, DataTypeObject>;
	from(str: string): Range<DataType, DataTypeObject>;
	/**
	 * Returns `true` if `obj` is a `Range` of the same type as `this`, `false` otherwise.
	 */
	isRange(obj: any): obj is Range<DataType, DataTypeObject>;
}

const getRange = <
	DataType extends {
		toString(): string;
		toJSON(): DataTypeObject;
	},
	DataTypeObject
>(
	object: any,
	identifier: string
) => {
	const Object = object as ObjectFunction<DataType, DataTypeObject | string>;

	const Range: RangeConstructor<DataType, DataTypeObject> = {
		from(
			arg:
				| string
				| LowerRange
				| Range<DataType, DataTypeObject>
				| RangeObject<DataTypeObject>,
			upper?: UpperRange,
			value?:
				| {
						lower: DataTypeObject;
						upper: DataTypeObject;
				  }
				| DataType
				| null,
			upperValue?: DataType
		): Range<DataType, DataTypeObject> {
			if (typeof arg === "string" && !lowerRange.includes(arg)) {
				if (arg === "empty") {
					return new RangeClass({
						lower: LowerRange.include,
						upper: UpperRange.include,
						value: null
					});
				}

				const [lower, upper] = [arg.at(0), arg.at(-1)];
				if (
					!lower ||
					!lowerRange.includes(lower) ||
					!upper ||
					!upperRange.includes(upper)
				)
					throw new Error("Invalid range string");

				const value = arg.slice(1, -1).split(",").map(Object.from);

				return new RangeClass({
					lower: lower as LowerRange,
					upper: upper as UpperRange,
					value: {
						lower: value[0].toJSON(),
						upper: value[1].toJSON()
					}
				});
			} else if (Range.isRange(arg)) {
				return new RangeClass(arg.toJSON());
			} else if (typeof arg === "string") {
				if (
					typeof upper === "string" &&
					typeof value === "object" &&
					!!value &&
					"toJSON" in value &&
					typeof upperValue === "object" &&
					!!upperValue &&
					"toJSON" in upperValue
				) {
					return new RangeClass({
						lower: arg as LowerRange,
						upper: upper as UpperRange,
						value: {
							lower: value.toJSON(),
							upper: upperValue.toJSON()
						}
					});
				} else if (
					typeof upper === "string" &&
					typeof value === "object" &&
					(!value || !("toJSON" in value))
				) {
					if (!lowerRange.includes(arg) || !upperRange.includes(upper))
						throw new Error("Invalid range arguments");

					return new RangeClass({
						lower: arg as LowerRange,
						upper: upper as UpperRange,
						value
					});
				}
				throw new Error("Invalid range arguments");
			} else {
				return new RangeClass(arg);
			}
		},
		isRange(obj: any): obj is Range<DataType, DataTypeObject> {
			//@ts-expect-error - This is a hack to get around the fact that the value is private
			return obj instanceof RangeClass && obj._identifier === identifier;
		}
	};

	class RangeClass implements Range<DataType, DataTypeObject> {
		private _identifier = identifier;
		private _lower: LowerRange;
		private _upper: UpperRange;
		private _value: {
			lower: DataTypeObject;
			upper: DataTypeObject;
		} | null;

		constructor(data: RangeObject<DataTypeObject>) {
			this._lower = data.lower;
			this._upper = data.upper;
			this._value = data.value;

			if (
				this._value &&
				((this._lower === LowerRange.include &&
					this._upper === UpperRange.exclude) ||
					(this._lower === LowerRange.exclude &&
						this._upper === UpperRange.include)) &&
				isEqual(this._value.lower, this._value.upper)
			) {
				this._value = null;
			}
		}

		toString(): string {
			if (this._value === null) {
				return "empty";
			}
			return `${
				this._lower
			}${this.lowerValue?.toString()},${this.upperValue?.toString()}${
				this._upper
			}`;
		}

		toJSON(): RangeObject<DataTypeObject> {
			return {
				lower: this._lower,
				upper: this._upper,
				value: this._value
			};
		}

		equals(
			otherRange:
				| string
				| Range<DataType, DataTypeObject>
				| RangeObject<DataTypeObject>
		): boolean {
			if (typeof otherRange === "string") {
				return otherRange === this.toString();
			} else if (Range.isRange(otherRange)) {
				return otherRange.toString() === this.toString();
			} else {
				return (
					otherRange.lower === this._lower &&
					otherRange.upper === this._upper &&
					((otherRange.value === null && this._value === null) ||
						isEqual(otherRange.value, this._value))
				);
			}
		}

		get lower(): LowerRange {
			return this._lower;
		}

		set lower(lower: LowerRange) {
			this._lower = lower;
		}

		get upper(): UpperRange {
			return this._upper;
		}

		set upper(upper: UpperRange) {
			this._upper = upper;
		}

		get value(): {
			lower: DataTypeObject;
			upper: DataTypeObject;
		} | null {
			return this._value;
		}

		set value(
			value: {
				lower: DataTypeObject;
				upper: DataTypeObject;
			} | null
		) {
			this._value = value;
		}

		isEmpty(): boolean {
			return this._value === null;
		}

		private _isGreaterThan(
			value: DataType,
			otherValue: DataTypeObject
		): boolean {
			const otherValueObject = Object.from(otherValue);
			return value.toString() > otherValueObject.toString();
		}

		private _isLessThan(value: DataType, otherValue: DataTypeObject): boolean {
			const otherValueObject = Object.from(otherValue);
			return value.toString() < otherValueObject.toString();
		}

		private _isGreaterThanOrEqual(
			value: DataType,
			otherValue: DataTypeObject
		): boolean {
			const otherValueObject = Object.from(otherValue);
			return value.toString() >= otherValueObject.toString();
		}

		private _isLessThanOrEqual(
			value: DataType,
			otherValue: DataTypeObject
		): boolean {
			const otherValueObject = Object.from(otherValue);
			return value.toString() <= otherValueObject.toString();
		}

		isWithinRange(value: DataType): boolean {
			if (this.isEmpty() || this._value === null) return false;

			if (this._lower === LowerRange.include) {
				if (this._upper === UpperRange.include) {
					return (
						this._isGreaterThanOrEqual(value, this._value.lower) &&
						this._isLessThanOrEqual(value, this._value.upper)
					);
				} else {
					return (
						this._isGreaterThanOrEqual(value, this._value.lower) &&
						this._isLessThan(value, this._value.upper)
					);
				}
			} else {
				if (this._upper === UpperRange.include) {
					return (
						this._isGreaterThan(value, this._value.lower) &&
						this._isLessThanOrEqual(value, this._value.upper)
					);
				} else {
					return (
						this._isGreaterThan(value, this._value.lower) &&
						this._isLessThan(value, this._value.upper)
					);
				}
			}
		}

		get lowerValue(): DataType | null {
			if (this._value === null) {
				return null;
			}
			return Object.from(this._value.lower);
		}

		get upperValue(): DataType | null {
			if (this._value === null) {
				return null;
			}
			return Object.from(this._value.upper);
		}
	}

	return Range;
};

export {
	getRange,
	RangeConstructor,
	Range,
	RangeObject,
	LowerRange,
	UpperRange
};
