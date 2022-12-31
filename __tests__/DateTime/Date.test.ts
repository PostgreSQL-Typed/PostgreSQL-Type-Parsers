import { DateTime } from "luxon";
import { Client } from "pg";

import { Date } from "../../src";

describe("Date Class", () => {
	it("should create a date from a string", () => {
		const date = Date.from("2022-09-02");
		expect(date).not.toBeNull();
	});

	it("should error when creating a date from an invalid string", () => {
		expect(() => {
			Date.from("2022-09-02T00:00:00.000Z");
		}).toThrow("Invalid Date string");
	});

	it("should create a date from a object", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date).not.toBeNull();
	});

	it("should error when creating a date from an invalid object", () => {
		expect(() => {
			Date.from({} as any);
		}).toThrow("Invalid Date object");
		expect(() => {
			Date.from({
				year: 2022,
				month: 9,
				day: "2",
			} as any);
		}).toThrow("Invalid Date object");
	});

	it("should create a date from numbers", () => {
		const date = Date.from(2022, 9, 2);
		expect(date).not.toBeNull();
	});

	it("should error when creating a date from invalid numbers", () => {
		expect(() => {
			Date.from(2022, 9, "2" as any);
		}).toThrow("Invalid Date array, numbers only");
	});

	it("should create a date from a DateTime", () => {
		const date = Date.from(DateTime.fromISO("2022-09-02"));
		expect(date).not.toBeNull();
	});

	it("should create a date from a JavaScript Date", () => {
		const date = Date.from(new globalThis.Date(2022, 9, 2));
		expect(date).not.toBeNull();
	});

	it("isDate()", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(Date.isDate(date)).toBe(true);
		expect(
			Date.isDate({
				year: 2022,
				month: 9,
				day: 2,
			})
		).toBe(false);
	});

	it("toString()", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date.toString()).toBe("2022-09-02");
	});

	it("toJSON()", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date.toJSON()).toEqual({
			year: 2022,
			month: 9,
			day: 2,
		});
	});

	it("equals()", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});

		expect(
			date.equals(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				})
			)
		).toBe(true);
		expect(
			date.equals(
				Date.from({
					year: 2022,
					month: 9,
					day: 3,
				})
			)
		).toBe(false);
		expect(
			date.equals(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}).toJSON()
			)
		).toBe(true);
		expect(
			date.equals(
				Date.from({
					year: 2022,
					month: 9,
					day: 3,
				}).toJSON()
			)
		).toBe(false);
		expect(
			date.equals(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}).toString()
			)
		).toBe(true);
		expect(
			date.equals(
				Date.from({
					year: 2022,
					month: 9,
					day: 3,
				}).toString()
			)
		).toBe(false);
	});

	it("get year", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date.year).toBe(2022);
	});

	it("set year", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		date.year = 2023;
		expect(date.year).toBe(2023);
	});

	it("get month", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date.month).toBe(9);
	});

	it("set month", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		date.month = 10;
		expect(date.month).toBe(10);
	});

	it("get day", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date.day).toBe(2);
	});

	it("set day", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		date.day = 3;
		expect(date.day).toBe(3);
	});

	it("toDateTime()", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date.toDateTime()).toStrictEqual(
			DateTime.fromObject(
				{
					year: 2022,
					month: 9,
					day: 2,
				},
				{ zone: "local" }
			)
		);
	});

	it("toJSDate()", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(date.toJSDate()).toBeInstanceOf(globalThis.Date);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "date.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestdate (
					date date NULL,
					_date _date NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestdate (date, _date)
				VALUES (
					'2022-09-02',
					'{ 1997-08-24, 2022-09-02 }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestdate
			`);

			expect(result.rows[0].date).toStrictEqual(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				})
			);
			expect(result.rows[0]._date).toStrictEqual([
				Date.from({
					year: 1997,
					month: 8,
					day: 24,
				}),
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}),
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestdate
		`);

		await client.end();

		if (error) throw error;
	});
});
