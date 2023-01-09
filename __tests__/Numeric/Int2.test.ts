import { Client } from "pg";

import { Int2 } from "../../src";

describe("Int2 Class", () => {
	it("should create a Int2 from a string", () => {
		const int2 = Int2.from("1");
		expect(int2).not.toBeNull();
	});

	it("should error when creating a Int2 from an invalid string", () => {
		expect(() => Int2.from("0.5")).toThrow("Invalid Int2 string");
		expect(() => Int2.from("abc")).toThrow("Invalid Int2 string");
		expect(() => Int2.from("32768")).toThrow("Invalid Int2 string");
		expect(() => Int2.from("-32769")).toThrow("Invalid Int2 string");
	});

	it("should create a Int2 from a number", () => {
		const int2 = Int2.from(1);
		expect(int2).not.toBeNull();
	});

	it("should error when creating a Int2 from an invalid number", () => {
		expect(() => Int2.from(0.5)).toThrow("Invalid Int2 number");
		expect(() => Int2.from(32768)).toThrow("Invalid Int2 number");
		expect(() => Int2.from(-32769)).toThrow("Invalid Int2 number");
	});

	it("should create a Int2 from a object", () => {
		const int2 = Int2.from({ Int2: 1 });
		expect(int2).not.toBeNull();
	});

	it("should error when creating a Int2 from an invalid object", () => {
		expect(() => Int2.from({ Int2: "1" as any })).toThrow("Invalid Int2 object");
		expect(() => Int2.from({ Int2: 0.5 })).toThrow("Invalid Int2 object");
	});

	it("isInt2()", () => {
		const int2 = Int2.from(1);
		expect(Int2.isInt2(int2)).toBe(true);
		expect(Int2.isInt2({ Int2: 1 })).toBe(false);
	});

	it("toString()", () => {
		const int2 = Int2.from(1);
		expect(int2.toString()).toBe("1");
	});

	it("toNumber()", () => {
		const int2 = Int2.from(1);
		expect(int2.toNumber()).toBe(1);
	});

	it("equals()", () => {
		const int2 = Int2.from(1);

		expect(int2.equals(Int2.from(1))).toBe(true);
		expect(int2.equals(Int2.from(2))).toBe(false);
		expect(int2.equals(Int2.from(1).toJSON())).toBe(true);
		expect(int2.equals(Int2.from(2).toJSON())).toBe(false);
		expect(int2.equals(Int2.from(1).toString())).toBe(true);
		expect(int2.equals(Int2.from(2).toString())).toBe(false);
		expect(int2.equals(Int2.from(1).toNumber())).toBe(true);
		expect(int2.equals(Int2.from(2).toNumber())).toBe(false);
	});

	it("get Int2", () => {
		const int2 = Int2.from(1);
		expect(int2.Int2).toBe(1);
	});

	it("set Int2", () => {
		const int2 = Int2.from(1);
		int2.Int2 = 2;
		expect(int2.Int2).toBe(2);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int2.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint2 (
					int2 int2 NULL,
					_int2 _int2 NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint2 (int2, _int2)
				VALUES (
					1,
					'{2, 3}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint2
			`);

			expect(result.rows[0].int2).toStrictEqual(Int2.from(1));
			expect(result.rows[0]._int2).toStrictEqual([Int2.from(2), Int2.from(3)]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint2
		`);

		await client.end();

		if (error) throw error;
	});
});
