import { Client } from "pg";

import { Int4MultiRange, Int4Range, LowerRange, UpperRange } from "../../src";

describe("Int4MultiRange Class", () => {
	it("should create a int4 multi range from a string", () => {
		const int4MultiRange = Int4MultiRange.from("{[1,3),[11,13),[21,23)}");
		expect(int4MultiRange).not.toBeNull();
	});

	it("should error when creating a int4 multi range from an invalid string", () => {
		expect(() => {
			Int4MultiRange.from("{[1,3),[11,13),[21,23)");
		}).toThrow("Invalid Int4MultiRange string");
	});

	it("should create a int4 multi range from a object", () => {
		const int4MultiRange = Int4MultiRange.from({
			ranges: [Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")],
		});
		expect(int4MultiRange).not.toBeNull();
	});

	it("should error when creating a int4 multi range from an invalid object", () => {
		expect(() => {
			Int4MultiRange.from({} as any);
		}).toThrow("Invalid Int4MultiRange object");
	});

	it("should create a int4 multi range from a raw object", () => {
		const int4MultiRange = Int4MultiRange.from({
			ranges: [
				{
					lower: LowerRange.include,
					upper: UpperRange.exclude,
					value: [{ int4: 1 }, { int4: 3 }],
				},
				{
					lower: "(",
					upper: "]",
					value: [{ int4: 11 }, { int4: 13 }],
				},
				{
					lower: LowerRange.include,
					upper: "]",
					value: [{ int4: 21 }, { int4: 23 }],
				},
			],
		});
		expect(int4MultiRange).not.toBeNull();
	});

	it("should error when creating a int4 multi range from an invalid raw object", () => {
		expect(() => {
			Int4MultiRange.from({
				ranges: ["range1", "range2"],
			} as any);
		}).toThrow("Invalid Int4MultiRange object");
	});

	it("should create a int4 multi range from int4 ranges", () => {
		const int4MultiRange = Int4MultiRange.from([Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")]);
		expect(int4MultiRange).not.toBeNull();
	});

	it("should error when creating a int4 multi range from invalid int4 ranges", () => {
		expect(() => {
			Int4MultiRange.from(["range1", "range2"] as any);
		}).toThrow("Invalid Int4MultiRange array, invalid Int4Ranges");
	});

	it("should create a int4 multi range from int4 ranges", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRange).not.toBeNull();
	});

	it("should error when creating a int4 multi range from invalid int4 ranges", () => {
		expect(() => {
			Int4MultiRange.from(Int4Range.from("[1,3)"), "range2" as any);
		}).toThrow("Invalid Int4MultiRange array, invalid Int4Ranges");
	});

	it("isPath()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(Int4MultiRange.isMultiRange(int4MultiRange)).toBe(true);
		expect(
			Int4MultiRange.isMultiRange({
				ranges: [Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")],
			})
		).toBe(false);
	});

	it("toString()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRange.toString()).toBe("{[1,3),[11,13),[21,23)}");
	});

	it("toJSON()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRange.toJSON()).toEqual({
			ranges: [
				{
					lower: "[",
					upper: ")",
					value: [{ int4: 1 }, { int4: 3 }],
				},
				{
					lower: "[",
					upper: ")",
					value: [{ int4: 11 }, { int4: 13 }],
				},
				{
					lower: "[",
					upper: ")",
					value: [{ int4: 21 }, { int4: 23 }],
				},
			],
		});
	});

	it("equals()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));

		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,13),[21,23)}"))).toBe(true);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,99),[21,23)}"))).toBe(false);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,13),[21,23)}").toJSON())).toBe(true);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,99),[21,23)}").toJSON())).toBe(false);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,13),[21,23)}").toString())).toBe(true);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,99),[21,23)}").toString())).toBe(false);
		expect(int4MultiRange.equals([Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")])).toBe(true);
		expect(int4MultiRange.equals([Int4Range.from("[1,3)"), Int4Range.from("[11,99)"), Int4Range.from("[21,23)")])).toBe(false);
	});

	it("get ranges()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRange.ranges).toEqual([Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")]);
	});

	it("set ranges()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		int4MultiRange.ranges = [Int4Range.from("[1,3)"), Int4Range.from("[11,15)"), Int4Range.from("[21,23)")];
		expect(int4MultiRange.ranges).toEqual([Int4Range.from("[1,3)"), Int4Range.from("[11,15)"), Int4Range.from("[21,23)")]);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int4multirange.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint4multirange (
					int4multirange int4multirange NULL,
					_int4multirange _int4multirange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint4multirange (int4multirange, _int4multirange)
				VALUES (
					'{[1,3),[11,13),[21,23)}',
					'{\\{[1\\,3)\\,[11\\,13)\\},\\{[21\\,23)\\,[31\\,33)\\}}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint4multirange
			`);

			expect(result.rows[0].int4multirange).toStrictEqual(Int4MultiRange.from("{[1,3),[11,13),[21,23)}"));
			expect(result.rows[0]._int4multirange).toStrictEqual([Int4MultiRange.from("{[1,3),[11,13)}"), Int4MultiRange.from("{[21,23),[31,33)}")]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint4multirange
		`);

		await client.end();

		if (error) throw error;
	});
});
