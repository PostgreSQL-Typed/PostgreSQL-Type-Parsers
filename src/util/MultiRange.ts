import { ObjectFunction } from "../types/ObjectFunction";
import { Range, RawRangeObject } from "./Range";

interface MultiRangeObject<DataType, DataTypeObject> {
	ranges: Range<DataType, DataTypeObject>[];
}

interface RawMultiRangeObject<DataTypeObject> {
	ranges: RawRangeObject<DataTypeObject>[];
}

interface MultiRange<DataType, DataTypeObject> {
	toString(): string;
	toJSON(): RawMultiRangeObject<DataTypeObject>;
	equals(
		otherMultiRange:
			| string
			| MultiRange<DataType, DataTypeObject>
			| MultiRangeObject<DataType, DataTypeObject>
			| RawMultiRangeObject<DataTypeObject>
			| Range<DataType, DataTypeObject>[]
	): boolean;

	ranges: Range<DataType, DataTypeObject>[];
}

interface MultiRangeConstructor<DataType, DataTypeObject> {
	from(range: Range<DataType, DataTypeObject>, ...ranges: Range<DataType, DataTypeObject>[]): MultiRange<DataType, DataTypeObject>;
	from(ranges: Range<DataType, DataTypeObject>[]): MultiRange<DataType, DataTypeObject>;
	from(
		data: MultiRange<DataType, DataTypeObject> | MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>
	): MultiRange<DataType, DataTypeObject>;
	from(str: string): MultiRange<DataType, DataTypeObject>;
	/**
	 * Returns `true` if `obj` is a `MultiRange` of the same type as `this`, `false` otherwise.
	 */
	isMultiRange(obj: any): obj is MultiRange<DataType, DataTypeObject>;
}

const getMultiRange = <
	DataType extends {
		equals(other: DataType): boolean;
		toString(): string;
		toJSON(): DataTypeObject;
	},
	DataTypeObject
>(
	object: any,
	isObjectFunc: (obj: any) => obj is Range<DataType, DataTypeObject>,
	identifier: string
) => {
	const Object = object as ObjectFunction<Range<DataType, DataTypeObject>, Range<DataType, DataTypeObject> | RawRangeObject<DataTypeObject> | string>,
		MultiRange: MultiRangeConstructor<DataType, DataTypeObject> = {
			from(
				arg:
					| string
					| MultiRange<DataType, DataTypeObject>
					| MultiRangeObject<DataType, DataTypeObject>
					| RawMultiRangeObject<DataTypeObject>
					| Range<DataType, DataTypeObject>
					| Range<DataType, DataTypeObject>[],
				...extraRanges: Range<DataType, DataTypeObject>[]
			): MultiRange<DataType, DataTypeObject> {
				if (typeof arg === "string") {
					const [begin, end] = [arg.at(0), arg.at(-1)];
					if (begin !== "{" || end !== "}") throw new Error(`Invalid ${identifier} string`);

					const halfRanges = arg.slice(1, -1).split(","),
						halfRangesEven = halfRanges.filter((_, i) => i % 2 === 0),
						halfRangesOdd = halfRanges.filter((_, i) => i % 2 === 1),
						ranges = halfRangesEven.map((range, i) => `${range},${halfRangesOdd[i]}`).map(Object.from);

					if (!ranges.length) throw new Error(`Invalid ${identifier} string`);

					return MultiRange.from(ranges);
				} else if (MultiRange.isMultiRange(arg)) return new MultiRangeClass(arg.toJSON());
				else if (Array.isArray(arg) || isObjectFunc(arg)) {
					if ([...(isObjectFunc(arg) ? [arg] : arg), ...extraRanges].every(isObjectFunc)) {
						return new MultiRangeClass({
							ranges: [...(isObjectFunc(arg) ? [arg] : arg), ...extraRanges],
						});
					} else throw new Error(`Invalid ${identifier} array, invalid ${identifier.replace("Multi", "")}s`);
				} else {
					if ("ranges" in arg && Array.isArray(arg.ranges)) {
						try {
							arg.ranges = arg.ranges.map(Object.from);
							return new MultiRangeClass(arg);
						} catch {
							throw new Error(`Invalid ${identifier} object`);
						}
					}
					throw new Error(`Invalid ${identifier} object`);
				}
			},
			isMultiRange(obj: any): obj is MultiRange<DataType, DataTypeObject> {
				//@ts-expect-error - This is a hack to get around the fact that the value is private
				return obj instanceof MultiRangeClass && obj._identifier === identifier;
			},
		};

	class MultiRangeClass implements MultiRange<DataType, DataTypeObject> {
		private _identifier = identifier;
		private _ranges: Range<DataType, DataTypeObject>[];

		constructor(data: MultiRangeObject<DataType, DataTypeObject> | RawMultiRangeObject<DataTypeObject>) {
			if ((data.ranges as unknown[]).every(isObjectFunc)) this._ranges = data.ranges as Range<DataType, DataTypeObject>[];
			else this._ranges = data.ranges.map(Object.from);
		}

		toString(): string {
			return `{${this._ranges.map(r => r.toString()).join(",")}}`;
		}

		toJSON(): RawMultiRangeObject<DataTypeObject> {
			return {
				ranges: this._ranges.map(r => r.toJSON()),
			};
		}

		equals(
			otherMultiRange:
				| string
				| MultiRange<DataType, DataTypeObject>
				| MultiRangeObject<DataType, DataTypeObject>
				| RawMultiRangeObject<DataTypeObject>
				| Range<DataType, DataTypeObject>[]
		): boolean {
			if (typeof otherMultiRange === "string") return otherMultiRange === this.toString();
			else if (MultiRange.isMultiRange(otherMultiRange)) return otherMultiRange.toString() === this.toString();
			else if (Array.isArray(otherMultiRange) && otherMultiRange.every(isObjectFunc)) {
				return (
					Array.isArray(this._ranges) &&
					otherMultiRange.length === this._ranges.length &&
					otherMultiRange.every((val, index) => val.equals(this._ranges[index]))
				);
			} else {
				return (
					!Array.isArray(otherMultiRange) &&
					Array.isArray(otherMultiRange.ranges) &&
					Array.isArray(this._ranges) &&
					otherMultiRange.ranges.length === this._ranges.length &&
					(otherMultiRange.ranges as (Range<DataType, DataTypeObject> | RawRangeObject<DataTypeObject>)[]).every((val, index) =>
						Object.from(val).equals(this._ranges[index])
					)
				);
			}
		}

		get ranges(): Range<DataType, DataTypeObject>[] {
			return this._ranges;
		}

		set ranges(ranges: Range<DataType, DataTypeObject>[]) {
			if (!ranges.every(isObjectFunc)) throw new Error("Invalid ranges");

			this._ranges = ranges;
		}
	}

	return MultiRange;
};

export { getMultiRange, MultiRangeConstructor, MultiRange, MultiRangeObject, RawMultiRangeObject };
