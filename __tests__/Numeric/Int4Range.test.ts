import { Client } from "pg";

import { Int4, Int4Range, LowerRange, UpperRange } from "../../src";

describe("Int4Range Class", () => {
	it("should create a int4 range from a string", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range).not.toBeNull();
	});

	it("should error when creating a int4 range from an invalid string", () => {
		expect(() => {
			Int4Range.from("1");
		}).toThrow("Invalid Int4Range string");
	});

	it("should create a int4 range from a object", () => {
		const int4Range = Int4Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [Int4.from(1), Int4.from(3)],
		});
		expect(int4Range).not.toBeNull();
	});

	it("should error when creating a int4 range from an invalid object", () => {
		expect(() => {
			Int4Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [] as any,
			});
		}).toThrow("Invalid Int4Range object, too few values");

		expect(() => {
			Int4Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Int4.from(1), Int4.from(3), Int4.from(5)] as any,
			});
		}).toThrow("Invalid Int4Range object, too many values");

		expect(() => {
			Int4Range.from({
				lower: "heya",
				upper: UpperRange.exclude,
				value: [Int4.from(1), Int4.from(3)],
			} as any);
		}).toThrow("Invalid Int4Range object");
	});

	it("should create a int4 range from a raw object", () => {
		const int4Range = Int4Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [{ int4: 1 }, { int4: 3 }],
		});
		expect(int4Range).not.toBeNull();
	});

	it("should error when creating a int4 range from an invalid raw object", () => {
		expect(() => {
			Int4Range.from({} as any);
		}).toThrow("Invalid Int4Range object");
	});

	it("should create a int4 range from arguments", () => {
		const int4Range = Int4Range.from(Int4.from({ int4: 1 }), Int4.from({ int4: 3 }));
		expect(int4Range).not.toBeNull();
	});

	it("should error when creating a int4 range from an invalid arguments", () => {
		expect(() => {
			Int4Range.from(Int4.from({ int4: 1 }), "int4" as any);
		}).toThrow("Invalid Int4Range array, invalid Int4s");
	});

	it("should create a int4 range from array", () => {
		const int4Range = Int4Range.from([Int4.from({ int4: 1 }), Int4.from({ int4: 3 })]);
		expect(int4Range).not.toBeNull();
	});

	it("should error when creating a int4 range from an invalid array", () => {
		expect(() => {
			Int4Range.from([] as any);
		}).toThrow("Invalid Int4Range array, too few values");

		expect(() => {
			Int4Range.from([Int4.from("1"), Int4.from("1"), Int4.from("1")] as any);
		}).toThrow("Invalid Int4Range array, too many values");

		expect(() => {
			Int4Range.from(["1", "1"] as any);
		}).toThrow("Invalid Int4Range array, invalid Int4s");
	});

	it("should create a int4 range from a Int4Range", () => {
		const int4Range = Int4Range.from(Int4Range.from("[1,3)"));
		expect(int4Range).not.toBeNull();
	});

	it("isRange()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(Int4Range.isRange(int4Range)).toBe(true);
		expect(
			Int4Range.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Int4.from({ int4: 1 }), Int4.from({ int4: 3 })],
			})
		).toBe(false);
	});

	it("toString()", () => {
		const int4Range1 = Int4Range.from("[1,3)");
		expect(int4Range1.toString()).toBe("[1,3)");

		const int4Range2 = Int4Range.from("[1,3]");
		expect(int4Range2.toString()).toBe("[1,3]");

		const int4Range3 = Int4Range.from("(1,3)");
		expect(int4Range3.toString()).toBe("(1,3)");

		const int4Range4 = Int4Range.from("(1,3]");
		expect(int4Range4.toString()).toBe("(1,3]");
	});

	it("toJSON()", () => {
		const int4Range1 = Int4Range.from("[1,3)");
		expect(int4Range1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [{ int4: 1 }, { int4: 3 }],
		});

		const int4Range2 = Int4Range.from("[1,3]");
		expect(int4Range2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			value: [{ int4: 1 }, { int4: 3 }],
		});

		const int4Range3 = Int4Range.from("(1,3)");
		expect(int4Range3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			value: [{ int4: 1 }, { int4: 3 }],
		});

		const int4Range4 = Int4Range.from("(1,3]");
		expect(int4Range4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			value: [{ int4: 1 }, { int4: 3 }],
		});
	});

	it("equals()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.equals(Int4Range.from("[1,3)"))).toBe(true);
		expect(int4Range.equals(Int4Range.from("[1,3]"))).toBe(false);
		expect(int4Range.equals(Int4Range.from("[1,3)").toString())).toBe(true);
		expect(int4Range.equals(Int4Range.from("[1,3]").toString())).toBe(false);
		expect(int4Range.equals(Int4Range.from("[1,3)").toJSON())).toBe(true);
		expect(int4Range.equals(Int4Range.from("[1,3]").toJSON())).toBe(false);
	});

	it("get lower()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.lower).toBe("[");
	});

	it("set lower()", () => {
		const int4Range = Int4Range.from("[1,3)");
		int4Range.lower = LowerRange.exclude;
		expect(int4Range.lower).toBe("(");
	});

	it("get upper()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.upper).toBe(")");
	});

	it("set upper()", () => {
		const int4Range = Int4Range.from("[1,3)");
		int4Range.upper = UpperRange.include;
		expect(int4Range.upper).toBe("]");
	});

	it("get value()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.value).toStrictEqual([Int4.from({ int4: 1 }), Int4.from({ int4: 3 })]);
	});

	it("set value()", () => {
		const int4Range = Int4Range.from("[1,3)");
		int4Range.value = [Int4.from(2), Int4.from(6)];
		expect(int4Range.value).toStrictEqual([Int4.from(2), Int4.from(6)]);
	});

	it("get empty()", () => {
		const int4Range1 = Int4Range.from("[1,3)");
		expect(int4Range1.empty).toBe(false);
		const int4Range2 = Int4Range.from("[1,1)");
		expect(int4Range2.empty).toBe(true);
		const int4Range3 = Int4Range.from("(1,1]");
		expect(int4Range3.empty).toBe(true);
		const int4Range4 = Int4Range.from("empty");
		expect(int4Range4.empty).toBe(true);
	});

	it("isWithinRange()", () => {
		const int4Range1 = Int4Range.from("[1,6)");
		expect(int4Range1.isWithinRange(Int4.from("1"))).toBe(true);
		expect(int4Range1.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range1.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range1.isWithinRange(Int4.from("6"))).toBe(false);

		const int4Range2 = Int4Range.from("(1,6]");
		expect(int4Range2.isWithinRange(Int4.from("1"))).toBe(false);
		expect(int4Range2.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range2.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range2.isWithinRange(Int4.from("6"))).toBe(true);

		const int4Range3 = Int4Range.from("empty");
		expect(int4Range3.isWithinRange(Int4.from("1"))).toBe(false);
		expect(int4Range3.isWithinRange(Int4.from("2"))).toBe(false);
		expect(int4Range3.isWithinRange(Int4.from("5"))).toBe(false);
		expect(int4Range3.isWithinRange(Int4.from("6"))).toBe(false);

		const int4Range4 = Int4Range.from("[1,6]");
		expect(int4Range4.isWithinRange(Int4.from("1"))).toBe(true);
		expect(int4Range4.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range4.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range4.isWithinRange(Int4.from("6"))).toBe(true);

		const int4Range5 = Int4Range.from("(1,6)");
		expect(int4Range5.isWithinRange(Int4.from("1"))).toBe(false);
		expect(int4Range5.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range5.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range5.isWithinRange(Int4.from("6"))).toBe(false);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int4range.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint4range (
					int4range int4range NULL,
					_int4range _int4range NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint4range (int4range, _int4range)
				VALUES (
					'[1,3)',
					'{[1\\,3),(5\\,7]}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint4range
			`);

			expect(result.rows[0].int4range).toStrictEqual(Int4Range.from("[1,3)"));
			expect(result.rows[0]._int4range).toStrictEqual([Int4Range.from("[1,3)"), Int4Range.from("[6,8)")]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint4range
		`);

		await client.end();

		if (error) throw error;
	});
});
