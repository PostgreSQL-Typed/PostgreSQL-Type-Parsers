import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../util/arrayParser";
import { parser } from "../util/parser";
import { getRange, Range, RangeConstructor, RangeObject } from "../util/Range";
import { Date, DateObject } from "./Date";

type DateRangeObject = RangeObject<DateObject>;

type DateRange = Range<Date, DateObject>;

const DateRange: RangeConstructor<Date, DateObject> = getRange<
	Date,
	DateObject
>(Date, "DateRange");

types.setTypeParser(DataType.daterange as any, parser(DateRange));
types.setTypeParser(DataType._daterange as any, arrayParser(DateRange));

export { DateRange, DateRangeObject };
