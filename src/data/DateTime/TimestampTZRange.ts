import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { getRange, Range, RangeConstructor, RangeObject, RawRangeObject } from "../../util/Range";
import { TimestampTZ, TimestampTZObject } from "./TimestampTZ";

type TimestampTZRangeObject = RangeObject<TimestampTZ>;

type RawTimestampTZRangeObject = RawRangeObject<TimestampTZObject>;

type TimestampTZRange = Range<TimestampTZ, TimestampTZObject>;

const TimestampTZRange: RangeConstructor<TimestampTZ, TimestampTZObject> = getRange<TimestampTZ, TimestampTZObject>(
	TimestampTZ,
	TimestampTZ.isTimestampTZ,
	"TimestampTZRange"
);

types.setTypeParser(DataType.tstzrange as any, parser(TimestampTZRange));
types.setTypeParser(DataType._tstzrange as any, arrayParser(TimestampTZRange));

export { TimestampTZRange, TimestampTZRangeObject, RawTimestampTZRangeObject };
