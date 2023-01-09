import { Client } from "pg";

import { Int8, Int8Range, LowerRange, UpperRange } from "../../src";

describe("Int8Range Class", () => {
	it("should create a int8 range from a string", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range).not.toBeNull();
	});

	it("should error when creating a int8 range from an invalid string", () => {
		expect(() => {
			Int8Range.from("1");
		}).toThrow("Invalid Int8Range string");
	});

	it("should create a int8 range from a object", () => {
		const int8Range = Int8Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [Int8.from(1), Int8.from(3)],
		});
		expect(int8Range).not.toBeNull();
	});

	it("should error when creating a int8 range from an invalid object", () => {
		expect(() => {
			Int8Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [] as any,
			});
		}).toThrow("Invalid Int8Range object, too few values");

		expect(() => {
			Int8Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Int8.from(1), Int8.from(3), Int8.from(5)] as any,
			});
		}).toThrow("Invalid Int8Range object, too many values");

		expect(() => {
			Int8Range.from({
				lower: "heya",
				upper: UpperRange.exclude,
				value: [Int8.from(1), Int8.from(3)],
			} as any);
		}).toThrow("Invalid Int8Range object");
	});

	it("should create a int8 range from a raw object", () => {
		const int8Range = Int8Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [{ int8: BigInt(1) }, { int8: BigInt(3) }],
		});
		expect(int8Range).not.toBeNull();
	});

	it("should error when creating a int8 range from an invalid raw object", () => {
		expect(() => {
			Int8Range.from({} as any);
		}).toThrow("Invalid Int8Range object");
	});

	it("should create a int8 range from arguments", () => {
		const int8Range = Int8Range.from(Int8.from({ int8: BigInt(1) }), Int8.from({ int8: BigInt(3) }));
		expect(int8Range).not.toBeNull();
	});

	it("should error when creating a int8 range from an invalid arguments", () => {
		expect(() => {
			Int8Range.from(Int8.from({ int8: BigInt(1) }), "int8" as any);
		}).toThrow("Invalid Int8Range array, invalid Int8s");
	});

	it("should create a int8 range from array", () => {
		const int8Range = Int8Range.from([Int8.from({ int8: BigInt(1) }), Int8.from({ int8: BigInt(3) })]);
		expect(int8Range).not.toBeNull();
	});

	it("should error when creating a int8 range from an invalid array", () => {
		expect(() => {
			Int8Range.from([] as any);
		}).toThrow("Invalid Int8Range array, too few values");

		expect(() => {
			Int8Range.from([Int8.from("1"), Int8.from("1"), Int8.from("1")] as any);
		}).toThrow("Invalid Int8Range array, too many values");

		expect(() => {
			Int8Range.from(["1", "1"] as any);
		}).toThrow("Invalid Int8Range array, invalid Int8s");
	});

	it("should create a int8 range from a Int8Range", () => {
		const int8Range = Int8Range.from(Int8Range.from("[1,3)"));
		expect(int8Range).not.toBeNull();
	});

	it("isRange()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(Int8Range.isRange(int8Range)).toBe(true);
		expect(
			Int8Range.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Int8.from({ int8: BigInt(1) }), Int8.from({ int8: BigInt(3) })],
			})
		).toBe(false);
	});

	it("toString()", () => {
		const int8Range1 = Int8Range.from("[1,3)");
		expect(int8Range1.toString()).toBe("[1,3)");

		const int8Range2 = Int8Range.from("[1,3]");
		expect(int8Range2.toString()).toBe("[1,3]");

		const int8Range3 = Int8Range.from("(1,3)");
		expect(int8Range3.toString()).toBe("(1,3)");

		const int8Range4 = Int8Range.from("(1,3]");
		expect(int8Range4.toString()).toBe("(1,3]");
	});

	it("toJSON()", () => {
		const int8Range1 = Int8Range.from("[1,3)");
		expect(int8Range1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [{ int8: BigInt(1) }, { int8: BigInt(3) }],
		});

		const int8Range2 = Int8Range.from("[1,3]");
		expect(int8Range2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			value: [{ int8: BigInt(1) }, { int8: BigInt(3) }],
		});

		const int8Range3 = Int8Range.from("(1,3)");
		expect(int8Range3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			value: [{ int8: BigInt(1) }, { int8: BigInt(3) }],
		});

		const int8Range4 = Int8Range.from("(1,3]");
		expect(int8Range4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			value: [{ int8: BigInt(1) }, { int8: BigInt(3) }],
		});
	});

	it("equals()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.equals(Int8Range.from("[1,3)"))).toBe(true);
		expect(int8Range.equals(Int8Range.from("[1,3]"))).toBe(false);
		expect(int8Range.equals(Int8Range.from("[1,3)").toString())).toBe(true);
		expect(int8Range.equals(Int8Range.from("[1,3]").toString())).toBe(false);
		expect(int8Range.equals(Int8Range.from("[1,3)").toJSON())).toBe(true);
		expect(int8Range.equals(Int8Range.from("[1,3]").toJSON())).toBe(false);
	});

	it("get lower()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.lower).toBe("[");
	});

	it("set lower()", () => {
		const int8Range = Int8Range.from("[1,3)");
		int8Range.lower = LowerRange.exclude;
		expect(int8Range.lower).toBe("(");
	});

	it("get upper()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.upper).toBe(")");
	});

	it("set upper()", () => {
		const int8Range = Int8Range.from("[1,3)");
		int8Range.upper = UpperRange.include;
		expect(int8Range.upper).toBe("]");
	});

	it("get value()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.value).toStrictEqual([Int8.from({ int8: BigInt(1) }), Int8.from({ int8: BigInt(3) })]);
	});

	it("set value()", () => {
		const int8Range = Int8Range.from("[1,3)");
		int8Range.value = [Int8.from(2), Int8.from(6)];
		expect(int8Range.value).toStrictEqual([Int8.from(2), Int8.from(6)]);
	});

	it("get empty()", () => {
		const int8Range1 = Int8Range.from("[1,3)");
		expect(int8Range1.empty).toBe(false);
		const int8Range2 = Int8Range.from("[1,1)");
		expect(int8Range2.empty).toBe(true);
		const int8Range3 = Int8Range.from("(1,1]");
		expect(int8Range3.empty).toBe(true);
		const int8Range4 = Int8Range.from("empty");
		expect(int8Range4.empty).toBe(true);
	});

	it("isWithinRange()", () => {
		const int8Range1 = Int8Range.from("[1,6)");
		expect(int8Range1.isWithinRange(Int8.from("1"))).toBe(true);
		expect(int8Range1.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range1.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range1.isWithinRange(Int8.from("6"))).toBe(false);

		const int8Range2 = Int8Range.from("(1,6]");
		expect(int8Range2.isWithinRange(Int8.from("1"))).toBe(false);
		expect(int8Range2.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range2.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range2.isWithinRange(Int8.from("6"))).toBe(true);

		const int8Range3 = Int8Range.from("empty");
		expect(int8Range3.isWithinRange(Int8.from("1"))).toBe(false);
		expect(int8Range3.isWithinRange(Int8.from("2"))).toBe(false);
		expect(int8Range3.isWithinRange(Int8.from("5"))).toBe(false);
		expect(int8Range3.isWithinRange(Int8.from("6"))).toBe(false);

		const int8Range4 = Int8Range.from("[1,6]");
		expect(int8Range4.isWithinRange(Int8.from("1"))).toBe(true);
		expect(int8Range4.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range4.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range4.isWithinRange(Int8.from("6"))).toBe(true);

		const int8Range5 = Int8Range.from("(1,6)");
		expect(int8Range5.isWithinRange(Int8.from("1"))).toBe(false);
		expect(int8Range5.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range5.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range5.isWithinRange(Int8.from("6"))).toBe(false);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int8range.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint8range (
					int8range int8range NULL,
					_int8range _int8range NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint8range (int8range, _int8range)
				VALUES (
					'[1,3)',
					'{[1\\,3),(5\\,7]}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint8range
			`);

			expect(result.rows[0].int8range).toStrictEqual(Int8Range.from("[1,3)"));
			expect(result.rows[0]._int8range).toStrictEqual([Int8Range.from("[1,3)"), Int8Range.from("[6,8)")]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint8range
		`);

		await client.end();

		if (error) throw error;
	});
});
