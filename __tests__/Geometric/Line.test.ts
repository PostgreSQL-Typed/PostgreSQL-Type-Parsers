import { Client } from "pg";

import { Line } from "../../src";

describe("Line Class", () => {
	it("should create a line from a string", () => {
		const line = Line.from("{1,2,3}");
		expect(line).not.toBeNull();
	});

	it("should error when creating a line from an invalid string", () => {
		expect(() => Line.from("()")).toThrow("Invalid Line string");
	});

	it("should create a line from a object", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line).not.toBeNull();
	});

	it("should error when creating a line from an invalid object", () => {
		expect(() => Line.from({} as any)).toThrow("Invalid Line object");
	});

	it("should create a line from numbers", () => {
		const line = Line.from(1, 2, 3);
		expect(line).not.toBeNull();
	});

	it("should error when creating a line from invalid numbers", () => {
		expect(() => Line.from(1, 2, {} as any)).toThrow(
			"Invalid Line array, invalid numbers"
		);
	});

	it("isLine()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(Line.isLine(line)).toBe(true);
		expect(Line.isLine({ a: 1, b: 2, c: 3 })).toBe(false);
	});

	it("toString()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.toString()).toBe("{1,2,3}");
	});

	it("toJSON()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.toJSON()).toEqual({ a: 1, b: 2, c: 3 });
	});

	it("equals()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });

		expect(line.equals(Line.from({ a: 1, b: 2, c: 3 }))).toBe(true);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 4 }))).toBe(false);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 3 }).toJSON())).toBe(true);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 4 }).toJSON())).toBe(false);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 3 }).toString())).toBe(true);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 4 }).toString())).toBe(false);
	});

	it("get a", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.a).toBe(1);
	});

	it("get b", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.b).toBe(2);
	});

	it("get c", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.c).toBe(3);
	});

	it("set a", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		line.a = 5;
		expect(line.a).toBe(5);
	});

	it("set b", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		line.b = 5;
		expect(line.b).toBe(5);
	});

	it("set c", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		line.c = 5;
		expect(line.c).toBe(5);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "line.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestline (
					line line NULL,
					_line _line NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestline (line, _line)
				VALUES (
					'{1.1,2.2,3.3}',
					'{\\{1.1\\,2.2\\,3.3\\},\\{4.4\\,5.5\\,6.6\\}}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestline
			`);

			expect(result.rows[0].line).toStrictEqual(
				Line.from({
					a: 1.1,
					b: 2.2,
					c: 3.3
				})
			);
			expect(result.rows[0]._line).toStrictEqual([
				Line.from({
					a: 1.1,
					b: 2.2,
					c: 3.3
				}),
				Line.from({
					a: 4.4,
					b: 5.5,
					c: 6.6
				})
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestline
		`);

		await client.end();

		if (error) throw error;
	});
});
