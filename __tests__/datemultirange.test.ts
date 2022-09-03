import { Client } from "pg";

import { DateMultiRange, DateRange, LowerRange, UpperRange } from "../src";

describe("DateMultiRange Class", () => {
	it("should create a date multi range from a string", () => {
		const dateMultiRange = DateMultiRange.from(
			"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}"
		);
		expect(dateMultiRange).not.toBeNull();
	});

	it("should create a date multi range from a object", () => {
		const dateMultiRange = DateMultiRange.from({
			ranges: [
				DateRange.from("[1999-01-08,2022-01-01)"),
				DateRange.from("[2023-01-08,2024-01-01)"),
				DateRange.from("[2025-01-08,2026-01-01)")
			]
		});
		expect(dateMultiRange).not.toBeNull();
	});

	it("should create a date multi range from a raw object", () => {
		const dateMultiRange = DateMultiRange.from({
			ranges: [
				{
					lower: LowerRange.include,
					upper: UpperRange.exclude,
					value: [
						{ year: 1999, month: 1, day: 8 },
						{ year: 2022, month: 1, day: 1 }
					]
				},
				{
					lower: "(",
					upper: "]",
					value: [
						{ year: 2023, month: 1, day: 8 },
						{ year: 2024, month: 1, day: 1 }
					]
				},
				{
					lower: LowerRange.include,
					upper: "]",
					value: [
						{ year: 2025, month: 1, day: 8 },
						{ year: 2026, month: 1, day: 1 }
					]
				}
			]
		});
		expect(dateMultiRange).not.toBeNull();
	});

	it("should create a date multi range from date ranges", () => {
		const dateMultiRange = DateMultiRange.from([
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		]);
		expect(dateMultiRange).not.toBeNull();
	});

	it("should create a date multi range from date ranges", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		);
		expect(dateMultiRange).not.toBeNull();
	});

	it("isPath()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		);
		expect(DateMultiRange.isMultiRange(dateMultiRange)).toBe(true);
		expect(
			DateMultiRange.isMultiRange({
				ranges: [
					DateRange.from("[1999-01-08,2022-01-01)"),
					DateRange.from("[2023-01-08,2024-01-01)"),
					DateRange.from("[2025-01-08,2026-01-01)")
				]
			})
		).toBe(false);
	});

	it("toString()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		);
		expect(dateMultiRange.toString()).toBe(
			"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}"
		);
	});

	it("toJSON()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		);
		expect(dateMultiRange.toJSON()).toEqual({
			ranges: [
				{
					lower: "[",
					upper: ")",
					value: [
						{ year: 1999, month: 1, day: 8 },
						{ year: 2022, month: 1, day: 1 }
					]
				},
				{
					lower: "[",
					upper: ")",
					value: [
						{ year: 2023, month: 1, day: 8 },
						{ year: 2024, month: 1, day: 1 }
					]
				},
				{
					lower: "[",
					upper: ")",
					value: [
						{ year: 2025, month: 1, day: 8 },
						{ year: 2026, month: 1, day: 1 }
					]
				}
			]
		});
	});

	it("equals()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		);

		expect(
			dateMultiRange.equals(
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}"
				)
			)
		).toBe(true);
		expect(
			dateMultiRange.equals(
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-02),[2025-01-08,2026-01-01)}"
				)
			)
		).toBe(false);
		expect(
			dateMultiRange.equals(
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}"
				).toJSON()
			)
		).toBe(true);
		expect(
			dateMultiRange.equals(
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-02),[2025-01-08,2026-01-01)}"
				).toJSON()
			)
		).toBe(false);
		expect(
			dateMultiRange.equals(
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}"
				).toString()
			)
		).toBe(true);
		expect(
			dateMultiRange.equals(
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-02),[2025-01-08,2026-01-01)}"
				).toString()
			)
		).toBe(false);
		expect(
			dateMultiRange.equals([
				DateRange.from("[1999-01-08,2022-01-01)"),
				DateRange.from("[2023-01-08,2024-01-01)"),
				DateRange.from("[2025-01-08,2026-01-01)")
			])
		).toBe(true);
		expect(
			dateMultiRange.equals([
				DateRange.from("[1999-01-08,2022-01-01)"),
				DateRange.from("[2023-01-08,2024-01-02)"),
				DateRange.from("[2025-01-08,2026-01-01)")
			])
		).toBe(false);
	});

	it("get ranges()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		);
		expect(dateMultiRange.ranges).toEqual([
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		]);
	});

	it("set ranges()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-01)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		);
		dateMultiRange.ranges = [
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-02)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		];
		expect(dateMultiRange.ranges).toEqual([
			DateRange.from("[1999-01-08,2022-01-01)"),
			DateRange.from("[2023-01-08,2024-01-02)"),
			DateRange.from("[2025-01-08,2026-01-01)")
		]);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "datemultirange.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestdatemultirange (
					datemultirange datemultirange NULL,
					_datemultirange _datemultirange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestdatemultirange (datemultirange, _datemultirange)
				VALUES (
					'{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}',
					'{\\{[1999-01-08\\,2022-01-01)\\,[2023-01-08\\,2024-01-01)\\},\\{[2025-01-08\\,2026-01-01)\\,[2027-01-08\\,2028-01-01)\\}}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestdatemultirange
			`);

			expect(result.rows[0].datemultirange).toStrictEqual(
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}"
				)
			);
			expect(result.rows[0]._datemultirange).toStrictEqual([
				DateMultiRange.from(
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}"
				),
				DateMultiRange.from("{[2025-01-08,2026-01-01),[2027-01-08,2028-01-01)}")
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestdatemultirange
		`);

		await client.end();

		if (error) throw error;
	});
});
