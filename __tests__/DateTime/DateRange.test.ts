import { Client } from "pg";

import { Date, DateRange, LowerRange, UpperRange } from "../../src";

describe("DateRange Class", () => {
	it("should create a date range from a string", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange).not.toBeNull();
	});

	it("should create a date range from a object", () => {
		const dateRange = DateRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				Date.from({ year: 2022, month: 9, day: 2 }),
				Date.from({ year: 2022, month: 10, day: 3 })
			]
		});
		expect(dateRange).not.toBeNull();
	});

	it("should create a date range from a raw object", () => {
		const dateRange = DateRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 }
			]
		});
		expect(dateRange).not.toBeNull();
	});

	it("should create a date range from arguments", () => {
		const dateRange = DateRange.from(
			Date.from({ year: 2022, month: 9, day: 2 }),
			Date.from({ year: 2022, month: 10, day: 3 })
		);
		expect(dateRange).not.toBeNull();
	});

	it("should create a date range from array", () => {
		const dateRange = DateRange.from([
			Date.from({ year: 2022, month: 9, day: 2 }),
			Date.from({ year: 2022, month: 10, day: 3 })
		]);
		expect(dateRange).not.toBeNull();
	});

	it("should create a date range from a DateRange", () => {
		const dateRange = DateRange.from(DateRange.from("[2022-09-02,2022-10-03)"));
		expect(dateRange).not.toBeNull();
	});

	it("isRange()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(DateRange.isRange(dateRange)).toBe(true);
		expect(
			DateRange.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [
					Date.from({ year: 2022, month: 9, day: 2 }),
					Date.from({ year: 2022, month: 10, day: 3 })
				]
			})
		).toBe(false);
	});

	it("toString()", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.toString()).toBe("[2022-09-02,2022-10-03)");

		const dateRange2 = DateRange.from("[2022-09-02,2022-10-03]");
		expect(dateRange2.toString()).toBe("[2022-09-02,2022-10-03]");

		const dateRange3 = DateRange.from("(2022-09-02,2022-10-03)");
		expect(dateRange3.toString()).toBe("(2022-09-02,2022-10-03)");

		const dateRange4 = DateRange.from("(2022-09-02,2022-10-03]");
		expect(dateRange4.toString()).toBe("(2022-09-02,2022-10-03]");
	});

	it("toJSON()", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 }
			]
		});

		const dateRange2 = DateRange.from("[2022-09-02,2022-10-03]");
		expect(dateRange2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 }
			]
		});

		const dateRange3 = DateRange.from("(2022-09-02,2022-10-03)");
		expect(dateRange3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 }
			]
		});

		const dateRange4 = DateRange.from("(2022-09-02,2022-10-03]");
		expect(dateRange4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 }
			]
		});
	});

	it("equals()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-10-03)"))).toBe(
			true
		);
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-10-03]"))).toBe(
			false
		);
		expect(
			dateRange.equals(DateRange.from("[2022-09-02,2022-10-03)").toString())
		).toBe(true);
		expect(
			dateRange.equals(DateRange.from("[2022-09-02,2022-10-03]").toString())
		).toBe(false);
		expect(
			dateRange.equals(DateRange.from("[2022-09-02,2022-10-03)").toJSON())
		).toBe(true);
		expect(
			dateRange.equals(DateRange.from("[2022-09-02,2022-10-03]").toJSON())
		).toBe(false);
	});

	it("get lower()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.lower).toBe("[");
	});

	it("set lower()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		dateRange.lower = LowerRange.exclude;
		expect(dateRange.lower).toBe("(");
	});

	it("get upper()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.upper).toBe(")");
	});

	it("set upper()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		dateRange.upper = UpperRange.include;
		expect(dateRange.upper).toBe("]");
	});

	it("get value()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.value).toStrictEqual([
			Date.from({ year: 2022, month: 9, day: 2 }),
			Date.from({ year: 2022, month: 10, day: 3 })
		]);
	});

	it("set value()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		dateRange.value = [
			Date.from({ year: 2022, month: 9, day: 1 }),
			Date.from({ year: 2022, month: 10, day: 4 })
		];
		expect(dateRange.value).toStrictEqual([
			Date.from({ year: 2022, month: 9, day: 1 }),
			Date.from({ year: 2022, month: 10, day: 4 })
		]);
	});

	it("get empty()", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.empty).toBe(false);
		const dateRange2 = DateRange.from("[2022-09-02,2022-09-02)");
		expect(dateRange2.empty).toBe(true);
		const dateRange3 = DateRange.from("(2022-09-02,2022-09-02]");
		expect(dateRange3.empty).toBe(true);
		const dateRange4 = DateRange.from("empty");
		expect(dateRange4.empty).toBe(true);
	});

	it("isWithinRange()", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.isWithinRange(Date.from("2022-09-02"))).toBe(true);
		expect(dateRange1.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange1.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange1.isWithinRange(Date.from("2022-10-03"))).toBe(false);

		const dateRange2 = DateRange.from("(2022-09-02,2022-10-03]");
		expect(dateRange2.isWithinRange(Date.from("2022-09-02"))).toBe(false);
		expect(dateRange2.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange2.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange2.isWithinRange(Date.from("2022-10-03"))).toBe(true);

		const dateRange3 = DateRange.from("empty");
		expect(dateRange3.isWithinRange(Date.from("2022-09-02"))).toBe(false);
		expect(dateRange3.isWithinRange(Date.from("2022-09-03"))).toBe(false);
		expect(dateRange3.isWithinRange(Date.from("2022-10-02"))).toBe(false);
		expect(dateRange3.isWithinRange(Date.from("2022-10-03"))).toBe(false);

		const dateRange4 = DateRange.from("[2022-09-02,2022-10-03]");
		expect(dateRange4.isWithinRange(Date.from("2022-09-02"))).toBe(true);
		expect(dateRange4.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange4.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange4.isWithinRange(Date.from("2022-10-03"))).toBe(true);

		const dateRange5 = DateRange.from("(2022-09-02,2022-10-03)");
		expect(dateRange5.isWithinRange(Date.from("2022-09-02"))).toBe(false);
		expect(dateRange5.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange5.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange5.isWithinRange(Date.from("2022-10-03"))).toBe(false);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "daterange.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestdaterange (
					daterange daterange NULL,
					_daterange _daterange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestdaterange (daterange, _daterange)
				VALUES (
					'[2022-09-02,2022-10-03)',
					'{[2022-09-02\\,2022-10-03),(2022-11-02\\,2022-12-03]}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestdaterange
			`);

			expect(result.rows[0].daterange).toStrictEqual(
				DateRange.from("[2022-09-02,2022-10-03)")
			);
			expect(result.rows[0]._daterange).toStrictEqual([
				DateRange.from("[2022-09-02,2022-10-03)"),
				DateRange.from("[2022-11-03,2022-12-04)")
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestdaterange
		`);

		await client.end();

		if (error) throw error;
	});
});
