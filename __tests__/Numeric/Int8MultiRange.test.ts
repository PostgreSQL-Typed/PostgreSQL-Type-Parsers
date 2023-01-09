import { Client } from "pg";

import { Int8MultiRange, Int8Range, LowerRange, UpperRange } from "../../src";

describe("Int8MultiRange Class", () => {
	it("should create a int8 multi range from a string", () => {
		const int8MultiRange = Int8MultiRange.from("{[1,3),[11,13),[21,23)}");
		expect(int8MultiRange).not.toBeNull();
	});

	it("should error when creating a int8 multi range from an invalid string", () => {
		expect(() => {
			Int8MultiRange.from("{[1,3),[11,13),[21,23)");
		}).toThrow("Invalid Int8MultiRange string");
	});

	it("should create a int8 multi range from a object", () => {
		const int8MultiRange = Int8MultiRange.from({
			ranges: [Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")],
		});
		expect(int8MultiRange).not.toBeNull();
	});

	it("should error when creating a int8 multi range from an invalid object", () => {
		expect(() => {
			Int8MultiRange.from({} as any);
		}).toThrow("Invalid Int8MultiRange object");
	});

	it("should create a int8 multi range from a raw object", () => {
		const int8MultiRange = Int8MultiRange.from({
			ranges: [
				{
					lower: LowerRange.include,
					upper: UpperRange.exclude,
					value: [{ int8: BigInt(1) }, { int8: BigInt(3) }],
				},
				{
					lower: "(",
					upper: "]",
					value: [{ int8: BigInt(11) }, { int8: BigInt(13) }],
				},
				{
					lower: LowerRange.include,
					upper: "]",
					value: [{ int8: BigInt(21) }, { int8: BigInt(23) }],
				},
			],
		});
		expect(int8MultiRange).not.toBeNull();
	});

	it("should error when creating a int8 multi range from an invalid raw object", () => {
		expect(() => {
			Int8MultiRange.from({
				ranges: ["range1", "range2"],
			} as any);
		}).toThrow("Invalid Int8MultiRange object");
	});

	it("should create a int8 multi range from int8 ranges", () => {
		const int8MultiRange = Int8MultiRange.from([Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")]);
		expect(int8MultiRange).not.toBeNull();
	});

	it("should error when creating a int8 multi range from invalid int8 ranges", () => {
		expect(() => {
			Int8MultiRange.from(["range1", "range2"] as any);
		}).toThrow("Invalid Int8MultiRange array, invalid Int8Ranges");
	});

	it("should create a int8 multi range from int8 ranges", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRange).not.toBeNull();
	});

	it("should error when creating a int8 multi range from invalid int8 ranges", () => {
		expect(() => {
			Int8MultiRange.from(Int8Range.from("[1,3)"), "range2" as any);
		}).toThrow("Invalid Int8MultiRange array, invalid Int8Ranges");
	});

	it("isPath()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(Int8MultiRange.isMultiRange(int8MultiRange)).toBe(true);
		expect(
			Int8MultiRange.isMultiRange({
				ranges: [Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")],
			})
		).toBe(false);
	});

	it("toString()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRange.toString()).toBe("{[1,3),[11,13),[21,23)}");
	});

	it("toJSON()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRange.toJSON()).toEqual({
			ranges: [
				{
					lower: "[",
					upper: ")",
					value: [{ int8: BigInt(1) }, { int8: BigInt(3) }],
				},
				{
					lower: "[",
					upper: ")",
					value: [{ int8: BigInt(11) }, { int8: BigInt(13) }],
				},
				{
					lower: "[",
					upper: ")",
					value: [{ int8: BigInt(21) }, { int8: BigInt(23) }],
				},
			],
		});
	});

	it("equals()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));

		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,13),[21,23)}"))).toBe(true);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,99),[21,23)}"))).toBe(false);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,13),[21,23)}").toJSON())).toBe(true);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,99),[21,23)}").toJSON())).toBe(false);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,13),[21,23)}").toString())).toBe(true);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,99),[21,23)}").toString())).toBe(false);
		expect(int8MultiRange.equals([Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")])).toBe(true);
		expect(int8MultiRange.equals([Int8Range.from("[1,3)"), Int8Range.from("[11,99)"), Int8Range.from("[21,23)")])).toBe(false);
	});

	it("get ranges()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRange.ranges).toEqual([Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")]);
	});

	it("set ranges()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		int8MultiRange.ranges = [Int8Range.from("[1,3)"), Int8Range.from("[11,15)"), Int8Range.from("[21,23)")];
		expect(int8MultiRange.ranges).toEqual([Int8Range.from("[1,3)"), Int8Range.from("[11,15)"), Int8Range.from("[21,23)")]);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int8multirange.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint8multirange (
					int8multirange int8multirange NULL,
					_int8multirange _int8multirange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint8multirange (int8multirange, _int8multirange)
				VALUES (
					'{[1,3),[11,13),[21,23)}',
					'{\\{[1\\,3)\\,[11\\,13)\\},\\{[21\\,23)\\,[31\\,33)\\}}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint8multirange
			`);

			expect(result.rows[0].int8multirange).toStrictEqual(Int8MultiRange.from("{[1,3),[11,13),[21,23)}"));
			expect(result.rows[0]._int8multirange).toStrictEqual([Int8MultiRange.from("{[1,3),[11,13)}"), Int8MultiRange.from("{[21,23),[31,33)}")]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint8multirange
		`);

		await client.end();

		if (error) throw error;
	});
});
