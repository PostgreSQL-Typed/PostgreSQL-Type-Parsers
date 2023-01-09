import { Client } from "pg";

import { Int4 } from "../../src";

describe("Int4 Class", () => {
	it("should create a Int4 from a string", () => {
		const int4 = Int4.from("1");
		expect(int4).not.toBeNull();
	});

	it("should error when creating a Int4 from an invalid string", () => {
		expect(() => Int4.from("0.5")).toThrow("Invalid Int4 string");
		expect(() => Int4.from("abc")).toThrow("Invalid Int4 string");
		expect(() => Int4.from("2147483648")).toThrow("Invalid Int4 string");
		expect(() => Int4.from("-2147483649")).toThrow("Invalid Int4 string");
	});

	it("should create a Int4 from a number", () => {
		const int4 = Int4.from(1);
		expect(int4).not.toBeNull();
	});

	it("should error when creating a Int4 from an invalid number", () => {
		expect(() => Int4.from(0.5)).toThrow("Invalid Int4 number");
		expect(() => Int4.from(2147483648)).toThrow("Invalid Int4 number");
		expect(() => Int4.from(-2147483649)).toThrow("Invalid Int4 number");
	});

	it("should create a Int4 from a object", () => {
		const int4 = Int4.from({ int4: 1 });
		expect(int4).not.toBeNull();
	});

	it("should error when creating a Int4 from an invalid object", () => {
		expect(() => Int4.from({ int4: "1" as any })).toThrow("Invalid Int4 object");
		expect(() => Int4.from({ int4: 0.5 })).toThrow("Invalid Int4 object");
	});

	it("isInt4()", () => {
		const int4 = Int4.from(1);
		expect(Int4.isInt4(int4)).toBe(true);
		expect(Int4.isInt4({ int4: 1 })).toBe(false);
	});

	it("toString()", () => {
		const int4 = Int4.from(1);
		expect(int4.toString()).toBe("1");
	});

	it("toNumber()", () => {
		const int4 = Int4.from(1);
		expect(int4.toNumber()).toBe(1);
	});

	it("equals()", () => {
		const int4 = Int4.from(1);

		expect(int4.equals(Int4.from(1))).toBe(true);
		expect(int4.equals(Int4.from(2))).toBe(false);
		expect(int4.equals(Int4.from(1).toJSON())).toBe(true);
		expect(int4.equals(Int4.from(2).toJSON())).toBe(false);
		expect(int4.equals(Int4.from(1).toString())).toBe(true);
		expect(int4.equals(Int4.from(2).toString())).toBe(false);
		expect(int4.equals(Int4.from(1).toNumber())).toBe(true);
		expect(int4.equals(Int4.from(2).toNumber())).toBe(false);
	});

	it("get int4", () => {
		const int4 = Int4.from(1);
		expect(int4.int4).toBe(1);
	});

	it("set int4", () => {
		const int4 = Int4.from(1);
		int4.int4 = 2;
		expect(int4.int4).toBe(2);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int4.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint4 (
					int4 int4 NULL,
					_int4 _int4 NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint4 (int4, _int4)
				VALUES (
					1,
					'{2, 3}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint4
			`);

			expect(result.rows[0].int4).toStrictEqual(Int4.from(1));
			expect(result.rows[0]._int4).toStrictEqual([Int4.from(2), Int4.from(3)]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint4
		`);

		await client.end();

		if (error) throw error;
	});
});
