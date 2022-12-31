import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface IntervalObject {
	years?: number;
	months?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
}

type IntervalProperties = keyof Omit<IntervalObject, "milliseconds">;

interface Interval {
	toString(): string;
	toISOString(short?: boolean): string;
	toJSON(): IntervalObject;
	equals(otherInterval: string | Interval | IntervalObject): boolean;

	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;

	readonly totalYears: number;
	readonly totalMonths: number;
	readonly totalDays: number;
	readonly totalHours: number;
	readonly totalMinutes: number;
	readonly totalSeconds: number;
	readonly totalMilliseconds: number;
}

interface IntervalConstructor {
	from(
		years: number,
		months: number,
		days: number,
		hours: number,
		minutes: number,
		seconds: number,
		milliseconds: number
	): Interval;
	from(data: Interval | IntervalObject): Interval;
	from(str: string): Interval;
	/**
	 * Returns `true` if `obj` is a `Interval`, `false` otherwise.
	 */
	isInterval(obj: any): obj is Interval;
}

const Interval: IntervalConstructor = {
	from(
		arg: string | Interval | IntervalObject | number,
		months?: number,
		days?: number,
		hours?: number,
		minutes?: number,
		seconds?: number,
		milliseconds?: number
	): Interval {
		if (typeof arg === "string") {
			const numberRegex = "([+-]?\\d+)",
				yearRegex = `${numberRegex}\\s+years?`,
				monthRegex = `${numberRegex}\\s+mons?`,
				dayRegex = `${numberRegex}\\s+days?`,
				// NOTE: PostgreSQL automatically overflows seconds into minutes and minutes
				// into hours, so we can rely on minutes and seconds always being 2 digits
				// (plus decimal for seconds). The overflow stops at hours - hours do not
				// overflow into days, so could be arbitrarily long.
				timeRegex = "([+-])?(\\d+):(\\d\\d):(\\d\\d(?:\\.\\d{1,6})?)",
				intervalRegex = new RegExp(
					`^\\s*${[yearRegex, monthRegex, dayRegex, timeRegex]
						// All parts of an interval are optional
						.map(str => "(?:" + str + ")?")
						.join("\\s*")}\\s*$`
				),
				matches = intervalRegex.exec(arg);
			if (!matches) {
				const ISORegex = new RegExp(
						/P(-?\d*Y)?(-?\d*M)?(-?\d*D)?T(-?\d*H)?(-?\d*M)?(-?\d*(\.\d{1,6})?S)?/g
					),
					isoMatches = ISORegex.exec(arg);

				if (!isoMatches) throw new Error("Invalid Interval string");

				const [
					,
					yearsString,
					monthsString,
					daysString,
					hoursString,
					minutesString,
					secondsString
				] = isoMatches;

				const years = parseInt(yearsString || "0") || 0,
					months = parseInt(monthsString || "0") || 0,
					days = parseInt(daysString || "0") || 0,
					hours = parseInt(hoursString || "0") || 0,
					minutes = parseInt(minutesString || "0") || 0,
					secondsWithMiliseconds = parseFloat(secondsString || "0") || 0,
					seconds = Math.floor(secondsWithMiliseconds),
					milliseconds = Math.floor((secondsWithMiliseconds - seconds) * 1000);

				return new IntervalClass({
					years,
					months,
					days,
					hours,
					minutes,
					seconds,
					milliseconds
				});
			}

			const [
					,
					yearsString,
					monthsString,
					daysString,
					plusMinusTime,
					hoursString,
					minutesString,
					secondsString
				] = matches,
				timeMultiplier = plusMinusTime === "-" ? -1 : 1,
				years = yearsString ? parseInt(yearsString, 10) : 0,
				months = monthsString ? parseInt(monthsString, 10) : 0,
				days = daysString ? parseInt(daysString, 10) : 0,
				hours = hoursString ? timeMultiplier * parseInt(hoursString, 10) : 0,
				minutes = minutesString
					? timeMultiplier * parseInt(minutesString, 10)
					: 0,
				secondsFloat = parseFloat(secondsString) || 0,
				// secondsFloat is guaranteed to be >= 0, so floor is safe
				absSeconds = Math.floor(secondsFloat),
				seconds = timeMultiplier * absSeconds,
				// Without the rounding, we end up with decimals like 455.99999999999994 instead of 456
				milliseconds =
					Math.round(timeMultiplier * (secondsFloat - absSeconds) * 1_000_000) /
					1_000;

			return new IntervalClass({
				years,
				months,
				days,
				hours,
				minutes,
				seconds,
				milliseconds
			});
		} else if (Interval.isInterval(arg)) {
			return new IntervalClass(arg.toJSON());
		} else if (typeof arg === "number") {
			if (
				typeof months === "number" &&
				typeof days === "number" &&
				typeof hours === "number" &&
				typeof minutes === "number" &&
				typeof seconds === "number" &&
				typeof milliseconds === "number"
			) {
				return new IntervalClass({
					years: arg,
					months,
					days,
					hours,
					minutes,
					seconds,
					milliseconds
				});
			}
			throw new Error("Invalid Interval array, numbers only");
		} else {
			if (
				typeof arg === "object" &&
				(!("years" in arg) || typeof arg.years === "number") &&
				(!("months" in arg) || typeof arg.months === "number") &&
				(!("days" in arg) || typeof arg.days === "number") &&
				(!("hours" in arg) || typeof arg.hours === "number") &&
				(!("minutes" in arg) || typeof arg.minutes === "number") &&
				(!("seconds" in arg) || typeof arg.seconds === "number") &&
				(!("milliseconds" in arg) || typeof arg.milliseconds === "number") &&
				("years" in arg ||
					"months" in arg ||
					"days" in arg ||
					"hours" in arg ||
					"minutes" in arg ||
					"seconds" in arg ||
					"milliseconds" in arg)
			)
				return new IntervalClass(arg);
			throw new Error("Invalid Interval object");
		}
	},
	isInterval(obj: any): obj is Interval {
		return obj instanceof IntervalClass;
	}
};

class IntervalClass implements Interval {
	private _years?: number;
	private _months?: number;
	private _days?: number;
	private _hours?: number;
	private _minutes?: number;
	private _seconds?: number;
	private _milliseconds?: number;

	constructor(data: IntervalObject) {
		this._years = data.years;
		this._months = data.months;
		this._days = data.days;
		this._hours = data.hours;
		this._minutes = data.minutes;
		this._seconds = data.seconds;
		this._milliseconds = data.milliseconds;
	}

	toString(): string {
		const properties: IntervalProperties[] = [
				"years",
				"months",
				"days",
				"hours",
				"minutes",
				"seconds"
			],
			filtered = properties.filter(
				key => this[`_${key}`] !== undefined && this[`_${key}`] !== 0
			);

		// In addition to `properties`, we need to account for fractions of seconds.
		if (this.milliseconds && !filtered.includes("seconds"))
			filtered.push("seconds");

		if (!filtered.length) return "0";

		return filtered
			.map(property => {
				let value: string | number = this[property];

				// Account for fractional part of seconds,
				// remove trailing zeroes.
				if (property === "seconds" && this.milliseconds) {
					value = (value + this.milliseconds / 1_000)
						.toFixed(6)
						.replace(/\.?0+$/, "");
				}

				// fractional seconds will be a string, all others are number
				const isSingular = String(value) === "1",
					// Remove plural 's' when the value is singular
					formattedProperty = isSingular
						? property.replace(/s$/, "")
						: property;

				return `${value} ${formattedProperty}`;
			})
			.join(" ");
	}

	toISOString(short = false): string {
		const dateProperties: IntervalProperties[] = ["years", "months", "days"],
			timeProperties: IntervalProperties[] = ["hours", "minutes", "seconds"],
			datePart = dateProperties.map(d => this.buildProperty(d, short)).join(""),
			timePart = timeProperties.map(t => this.buildProperty(t, short)).join("");

		if (!timePart.length && !datePart.length) return "PT0S";

		if (!timePart.length) return `P${datePart}`;

		return `P${datePart}T${timePart}`;
	}

	private buildProperty(property: IntervalProperties, short = false): string {
		const propertiesISOEquivalent = {
			years: "Y",
			months: "M",
			days: "D",
			hours: "H",
			minutes: "M",
			seconds: "S"
		};

		let value: string | number = this[property];

		// Account for fractional part of seconds,
		// remove trailing zeroes.
		if (property === "seconds" && this.milliseconds)
			value = (value + this.milliseconds / 1_000).toFixed(6).replace(/0+$/, "");

		if (short && !value) return "";

		return value + propertiesISOEquivalent[property];
	}

	toJSON(): IntervalObject {
		return {
			years: this._years === 0 ? undefined : this._years,
			months: this._months === 0 ? undefined : this._months,
			days: this._days === 0 ? undefined : this._days,
			hours: this._hours === 0 ? undefined : this._hours,
			minutes: this._minutes === 0 ? undefined : this._minutes,
			seconds: this._seconds === 0 ? undefined : this._seconds,
			milliseconds: this._milliseconds === 0 ? undefined : this._milliseconds
		};
	}

	equals(otherInterval: string | Interval | IntervalObject): boolean {
		if (typeof otherInterval === "string") {
			return (
				otherInterval === this.toString() ||
				otherInterval === this.toISOString() ||
				otherInterval === this.toISOString(true)
			);
		} else if (Interval.isInterval(otherInterval)) {
			return otherInterval.toString() === this.toString();
		} else {
			return (
				(otherInterval.years ?? 0) === (this._years ?? 0) &&
				(otherInterval.months ?? 0) === (this._months ?? 0) &&
				(otherInterval.days ?? 0) === (this._days ?? 0) &&
				(otherInterval.hours ?? 0) === (this._hours ?? 0) &&
				(otherInterval.minutes ?? 0) === (this._minutes ?? 0) &&
				(otherInterval.seconds ?? 0) === (this._seconds ?? 0) &&
				(otherInterval.milliseconds ?? 0) === (this._milliseconds ?? 0)
			);
		}
	}

	get years(): number {
		return this._years ?? 0;
	}

	set years(years: number) {
		this._years = years;
	}

	get months(): number {
		return this._months ?? 0;
	}

	set months(months: number) {
		this._months = months;
	}

	get days(): number {
		return this._days ?? 0;
	}

	set days(days: number) {
		this._days = days;
	}

	get hours(): number {
		return this._hours ?? 0;
	}

	set hours(hours: number) {
		this._hours = hours;
	}

	get minutes(): number {
		return this._minutes ?? 0;
	}

	set minutes(minutes: number) {
		this._minutes = minutes;
	}

	get seconds(): number {
		return this._seconds ?? 0;
	}

	set seconds(seconds: number) {
		this._seconds = seconds;
	}

	get milliseconds(): number {
		return this._milliseconds ?? 0;
	}

	set milliseconds(milliseconds: number) {
		this._milliseconds = milliseconds;
	}

	get totalMilliseconds(): number {
		return (
			(this._years ?? 0) * 31_536_000_000 +
			(this._months ?? 0) * 2_628_000_000 +
			(this._days ?? 0) * 86_400_000 +
			(this._hours ?? 0) * 3_600_000 +
			(this._minutes ?? 0) * 60_000 +
			(this._seconds ?? 0) * 1_000 +
			(this._milliseconds ?? 0)
		);
	}

	get totalSeconds(): number {
		return this.totalMilliseconds / 1_000;
	}

	get totalMinutes(): number {
		return this.totalSeconds / 60;
	}

	get totalHours(): number {
		return this.totalMinutes / 60;
	}

	get totalDays(): number {
		return this.totalHours / 24;
	}

	get totalMonths(): number {
		return this.totalDays / 30;
	}

	get totalYears(): number {
		return this.totalMonths / 12;
	}
}

types.setTypeParser(DataType.interval as any, parser(Interval));
types.setTypeParser(DataType._interval as any, arrayParser(Interval));

export { Interval, IntervalObject };
