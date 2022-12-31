import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface DateObject {
	year: number;
	month: number;
	day: number;
}

interface Date {
	toString(): string;
	toJSON(): DateObject;
	equals(otherDate: string | Date | DateObject): boolean;

	year: number;
	month: number;
	day: number;

	/**
	 * @param zone The zone to convert the date to. Defaults to 'local'.
	 */
	toDateTime(zone?: string | Zone | undefined): DateTime;

	/**
	 * @param zone The zone to convert the date to. Defaults to 'local'.
	 */
	toJSDate(zone?: string | Zone | undefined): globalThis.Date;
}

interface DateConstructor {
	from(year: number, month: number, day: number): Date;
	from(data: Date | DateObject | globalThis.Date | DateTime): Date;
	from(str: string): Date;
	/**
	 * Returns `true` if `obj` is a `Date`, `false` otherwise.
	 */
	isDate(obj: any): obj is Date;
}

const Date: DateConstructor = {
	from(arg: string | Date | DateObject | globalThis.Date | DateTime | number, month?: number, day?: number): Date {
		if (typeof arg === "string") {
			if (arg.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) {
				const [year, month, day] = arg.split("-").map(c => parseInt(c));
				return new DateClass({
					year,
					month,
					day,
				});
			}
			throw new Error("Invalid Date string");
		} else if (Date.isDate(arg)) {
			const newlyMadeDate = new DateClass(arg.toJSON());
			if (newlyMadeDate.toString().match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) return newlyMadeDate;
			throw new Error("Invalid Date class");
		} else if (typeof arg === "number") {
			if (typeof month === "number" && typeof day === "number") {
				const newlyMadeDate = new DateClass({
					year: arg,
					month,
					day,
				});
				if (newlyMadeDate.toString().match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) return newlyMadeDate;
				throw new Error("Invalid Date array, numbers only");
			}
			throw new Error("Invalid Date array, numbers only");
		} else if (arg instanceof DateTime) {
			return new DateClass({
				year: arg.year,
				month: arg.month,
				day: arg.day,
			});
		} else if (arg instanceof globalThis.Date) {
			return new DateClass({
				year: arg.getFullYear(),
				month: arg.getMonth() + 1,
				day: arg.getDate(),
			});
		} else {
			if (
				!(
					typeof arg === "object" &&
					"year" in arg &&
					typeof arg.year === "number" &&
					"month" in arg &&
					typeof arg.month === "number" &&
					"day" in arg &&
					typeof arg.day === "number"
				)
			)
				throw new Error("Invalid Date object");

			const newlyMadeDate = new DateClass(arg);
			if (newlyMadeDate.toString().match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) return newlyMadeDate;

			throw new Error("Invalid Date object");
		}
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isDate(obj: any): obj is Date {
		return obj instanceof DateClass;
	},
};

class DateClass implements Date {
	private _year: number;
	private _month: number;
	private _day: number;

	constructor(data: DateObject) {
		this._year = data.year;
		this._month = data.month;
		this._day = data.day;
	}

	private _prefix(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
	}

	toString(): string {
		return `${this._year}-${this._prefix(this._month)}-${this._prefix(this._day)}`;
	}

	toJSON(): DateObject {
		return {
			year: this._year,
			month: this._month,
			day: this._day,
		};
	}

	equals(otherDate: string | Date | DateObject): boolean {
		if (typeof otherDate === "string") return otherDate === this.toString();
		else if (Date.isDate(otherDate)) return otherDate.toString() === this.toString();
		else return otherDate.year === this._year && otherDate.month === this._month && otherDate.day === this._day;
	}

	get year(): number {
		return this._year;
	}

	set year(year: number) {
		if (year < 1 || year > 9999) throw new Error("Invalid year");

		this._year = year;
	}

	get month(): number {
		return this._month;
	}

	set month(month: number) {
		if (month < 1 || month > 12) throw new Error("Invalid month");

		this._month = month;
	}

	get day(): number {
		return this._day;
	}

	set day(day: number) {
		if (day < 1 || day > 31) throw new Error("Invalid day");

		this._day = day;
	}

	toDateTime(zone?: string | Zone | undefined): DateTime {
		return DateTime.fromObject(
			{
				year: this._year,
				month: this._month,
				day: this._day,
			},
			{ zone }
		);
	}

	toJSDate(zone?: string | Zone | undefined): globalThis.Date {
		return this.toDateTime(zone).toJSDate();
	}
}

types.setTypeParser(DataType.date as any, parser(Date));
types.setTypeParser(DataType._date as any, arrayParser(Date, ","));

export { Date, DateObject };
