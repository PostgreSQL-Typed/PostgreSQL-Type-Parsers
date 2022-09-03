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

interface RangeObject<DataType> {
	lower: LowerRange;
	upper: UpperRange;
	value: [DataType, DataType] | null;
}

interface RawRangeObject<DataTypeObject> {
	lower: LowerRange;
	upper: UpperRange;
	value: [DataTypeObject, DataTypeObject] | null;
}

interface Range<DataType, DataTypeObject> {
	toString(): string;
	toJSON(): RawRangeObject<DataTypeObject>;
	equals(
		otherRange:
			| string
			| Range<DataType, DataTypeObject>
			| RangeObject<DataType>
			| RawRangeObject<DataTypeObject>
			| [DataType, DataType]
	): boolean;
	isWithinRange(value: DataType | DataTypeObject): boolean;

	lower: LowerRange;
	upper: UpperRange;
	value: [DataType, DataType] | null;
	readonly empty: boolean;
}

interface RangeConstructor<DataType, DataTypeObject> {
	from(value1: DataType, value2: DataType): Range<DataType, DataTypeObject>;
	from(value: [DataType, DataType]): Range<DataType, DataTypeObject>;
	from(
		data:
			| Range<DataType, DataTypeObject>
			| RangeObject<DataType>
			| RawRangeObject<DataTypeObject>
	): Range<DataType, DataTypeObject>;
	from(str: string): Range<DataType, DataTypeObject>;
	/**
	 * Returns `true` if `obj` is a `Range` of the same type as `this`, `false` otherwise.
	 */
	isRange(obj: any): obj is Range<DataType, DataTypeObject>;
}

const getRange = <
	DataType extends {
		equals(other: DataType): boolean;
		toString(): string;
		toJSON(): DataTypeObject;
	},
	DataTypeObject
>(
	object: any,
	isObjectFunc: (obj: any) => obj is DataType,
	identifier: string
) => {
	const Object = object as ObjectFunction<
		DataType,
		DataType | DataTypeObject | string
	>;

	const Range: RangeConstructor<DataType, DataTypeObject> = {
		//@ts-expect-error - This is a hack to get around the error.
		from(
			arg:
				| string
				| Range<DataType, DataTypeObject>
				| RangeObject<DataType>
				| RawRangeObject<DataTypeObject>
				| DataType
				| [DataType, DataType],
			extraValue: DataType
		): Range<DataType, DataTypeObject> {
			if (typeof arg === "string") {
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

				if (value.length !== 2) throw new Error("Invalid range string");

				return new RangeClass({
					lower: lower as LowerRange,
					upper: upper as UpperRange,
					value: value as [DataType, DataType]
				});
			} else if (Range.isRange(arg)) {
				return new RangeClass(arg.toJSON());
			} else if (Array.isArray(arg) || isObjectFunc(arg)) {
				if (isObjectFunc(arg) && isObjectFunc(extraValue)) {
					return new RangeClass({
						lower: LowerRange.include,
						upper: UpperRange.exclude,
						value: [arg as DataType, extraValue]
					});
				} else if (
					Array.isArray(arg) &&
					arg.every(isObjectFunc) &&
					arg.length === 2
				) {
					return new RangeClass({
						lower: LowerRange.include,
						upper: UpperRange.exclude,
						value: arg as [DataType, DataType]
					});
				} else {
					throw new Error("Invalid arguments");
				}
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
		private _value: [DataType, DataType] | null;

		constructor(data: RangeObject<DataType> | RawRangeObject<DataTypeObject>) {
			this._lower = data.lower;
			this._upper = data.upper;
			if (data.value === null) {
				this._value = null;
			} else {
				if ((data.value as (DataType | DataTypeObject)[]).every(isObjectFunc)) {
					this._value = data.value as [DataType, DataType];
				} else {
					this._value = data.value.map(Object.from) as [DataType, DataType];
				}
			}

			if (
				this._value &&
				((this._lower === LowerRange.include &&
					this._upper === UpperRange.exclude) ||
					(this._lower === LowerRange.exclude &&
						this._upper === UpperRange.include)) &&
				this._value[0].equals(this._value[1])
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
			}${this._value[0].toString()},${this._value[1].toString()}${this._upper}`;
		}

		toJSON(): RawRangeObject<DataTypeObject> {
			return {
				lower: this._lower,
				upper: this._upper,
				value:
					(this._value?.map(v => v.toJSON()) as [
						DataTypeObject,
						DataTypeObject
					]) ?? null
			};
		}

		equals(
			otherRange:
				| string
				| Range<DataType, DataTypeObject>
				| RangeObject<DataType>
				| RawRangeObject<DataTypeObject>
				| [DataType, DataType]
		): boolean {
			if (typeof otherRange === "string") {
				return otherRange === this.toString();
			} else if (Range.isRange(otherRange)) {
				return otherRange.toString() === this.toString();
			} else if (Array.isArray(otherRange) && otherRange.every(isObjectFunc)) {
				return (
					Array.isArray(this._value) &&
					this._lower === LowerRange.include &&
					this._upper === UpperRange.exclude &&
					otherRange.length === this._value.length &&
					otherRange.every((val, index) =>
						val.equals((this._value as DataType[])[index])
					)
				);
			} else {
				return (
					otherRange.lower === this._lower &&
					otherRange.upper === this._upper &&
					((Array.isArray(otherRange.value) &&
						Array.isArray(this._value) &&
						otherRange.value.length === this._value.length &&
						(otherRange.value as (DataType | DataTypeObject)[]).every(
							(val, index) =>
								Object.from(val).equals((this._value as DataType[])[index])
						)) ||
						(otherRange.value === null && this._value === null))
				);
			}
		}

		private _greaterThan(value1: DataType, value2: DataType) {
			return value1.toString() > value2.toString();
		}

		private _greaterThanOrEqual(value1: DataType, value2: DataType) {
			return value1.toString() >= value2.toString();
		}

		private _lessThan(value1: DataType, value2: DataType) {
			return value1.toString() < value2.toString();
		}

		private _lessThanOrEqual(value1: DataType, value2: DataType) {
			return value1.toString() <= value2.toString();
		}

		isWithinRange(value: DataType | DataTypeObject): boolean {
			if (this._value === null) return false;
			const valueObj = isObjectFunc(value) ? value : Object.from(value);
			return (
				(this._lower === LowerRange.include
					? this._greaterThanOrEqual(valueObj, this._value[0])
					: this._greaterThan(valueObj, this._value[0])) &&
				(this._upper === UpperRange.include
					? this._lessThanOrEqual(valueObj, this._value[1])
					: this._lessThan(valueObj, this._value[1]))
			);
		}

		get lower(): LowerRange {
			return this._lower;
		}

		set lower(value: LowerRange) {
			if (!lowerRange.includes(value))
				throw new Error("Invalid lower range argument");
			this._lower = value;
		}

		get upper(): UpperRange {
			return this._upper;
		}

		set upper(value: UpperRange) {
			if (!upperRange.includes(value))
				throw new Error("Invalid upper range argument");
			this._upper = value;
		}

		get value(): [DataType, DataType] | null {
			return this._value;
		}

		set value(
			value: [DataType, DataType] | [DataTypeObject, DataTypeObject] | null
		) {
			if (value === null) {
				this._value = null;
			} else if ((value as (DataType | DataTypeObject)[]).every(isObjectFunc)) {
				this._value = value as [DataType, DataType];
			} else {
				this._value = value.map(Object.from) as [DataType, DataType];
			}
		}

		get empty(): boolean {
			return this._value === null;
		}
	}

	return Range;
};

export {
	getRange,
	RangeConstructor,
	Range,
	RangeObject,
	RawRangeObject,
	LowerRange,
	UpperRange
};
