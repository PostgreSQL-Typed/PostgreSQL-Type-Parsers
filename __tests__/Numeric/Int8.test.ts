import { Client } from "pg";

import { Int8 } from "../../src";

describe("Int8 Class", () => {
	it("should create a Int8 from a string", () => {
		const int8 = Int8.from("1");
		expect(int8).not.toBeNull();
	});

	it("should error when creating a Int8 from an invalid string", () => {
		expect(() => Int8.from("0.5")).toThrow("Invalid Int8 string");
		expect(() => Int8.from("abc")).toThrow("Invalid Int8 string");
		expect(() => Int8.from("9223372036854775808")).toThrow("Invalid Int8 string");
		expect(() => Int8.from("-9223372036854775809")).toThrow("Invalid Int8 string");
	});

	it("should create a Int8 from a bigint", () => {
		const int8 = Int8.from(BigInt("1"));
		expect(int8).not.toBeNull();
	});

	it("should error when creating a Int8 from an invalid bigint", () => {
		expect(() => Int8.from(BigInt("9223372036854775808"))).toThrow("Invalid Int8 bigint");
		expect(() => Int8.from(BigInt("-9223372036854775809"))).toThrow("Invalid Int8 bigint");
	});

	it("should create a Int8 from a number", () => {
		const int8 = Int8.from(1);
		expect(int8).not.toBeNull();
	});

	it("should error when creating a Int8 from an invalid number", () => {
		expect(() => Int8.from(0.5)).toThrow("Invalid Int8 number");
	});

	it("should create a Int8 from a object", () => {
		const int8 = Int8.from({ int8: BigInt(1) });
		expect(int8).not.toBeNull();
	});

	it("should error when creating a Int8 from an invalid object", () => {
		expect(() => Int8.from({ int8: "1" as any })).toThrow("Invalid Int8 object");
		expect(() => Int8.from({ int8: BigInt("-9223372036854775809") })).toThrow("Invalid Int8 object");
	});

	it("isInt8()", () => {
		const int8 = Int8.from(1);
		expect(Int8.isInt8(int8)).toBe(true);
		expect(Int8.isInt8({ int8: 1 })).toBe(false);
	});

	it("toString()", () => {
		const int8 = Int8.from(1);
		expect(int8.toString()).toBe("1");
	});

	it("toBigint()", () => {
		const int8 = Int8.from(1);
		expect(int8.toBigint()).toBe(BigInt(1));
	});

	it("equals()", () => {
		const int8 = Int8.from(1);

		expect(int8.equals(Int8.from(1))).toBe(true);
		expect(int8.equals(Int8.from(2))).toBe(false);
		expect(int8.equals(Int8.from(1).toJSON())).toBe(true);
		expect(int8.equals(Int8.from(2).toJSON())).toBe(false);
		expect(int8.equals(Int8.from(1).toString())).toBe(true);
		expect(int8.equals(Int8.from(2).toString())).toBe(false);
		expect(int8.equals(Int8.from(1).toBigint())).toBe(true);
		expect(int8.equals(Int8.from(2).toBigint())).toBe(false);
	});

	it("get int8", () => {
		const int8 = Int8.from(1);
		expect(int8.int8).toBe(BigInt(1));
	});

	it("set int8", () => {
		const int8 = Int8.from(1);
		int8.int8 = BigInt(2);
		expect(int8.int8).toBe(BigInt(2));
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int8.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint8 (
					int8 int8 NULL,
					_int8 _int8 NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint8 (int8, _int8)
				VALUES (
					1,
					'{2, 3}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint8
			`);

			expect(result.rows[0].int8).toStrictEqual(Int8.from(1));
			expect(result.rows[0]._int8).toStrictEqual([Int8.from(2), Int8.from(3)]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint8
		`);

		await client.end();

		if (error) throw error;
	});
});
