import { Client } from "pg";

import { Point } from "../../src";

describe("Point Class", () => {
	it("should create a point from a string", () => {
		const point = Point.from("(1,2)");
		expect(point).not.toBeNull();
	});

	it("should error when creating a point from an invalid string", () => {
		expect(() => Point.from("()")).toThrow("Invalid Point string");
	});

	it("should create a point from a object", () => {
		const point = Point.from({ x: 1, y: 2 });
		expect(point).not.toBeNull();
	});

	it("should error when creating a point from an invalid object", () => {
		expect(() => Point.from({} as any)).toThrow("Invalid Point object");
	});

	it("should create a point from numbers", () => {
		const point = Point.from(1, 2);
		expect(point).not.toBeNull();
	});

	it("should error when creating a point from invalid numbers", () => {
		expect(() => Point.from(1, "a" as any)).toThrow("Invalid Point arguments");
	});

	it("isPoint()", () => {
		const point = Point.from({ x: 1, y: 2 });
		expect(Point.isPoint(point)).toBe(true);
		expect(Point.isPoint({ x: 1, y: 2 })).toBe(false);
	});

	it("toString()", () => {
		const point = Point.from({ x: 1, y: 2 });
		expect(point.toString()).toBe("(1,2)");
	});

	it("toJSON()", () => {
		const point = Point.from({ x: 1, y: 2 });
		expect(point.toJSON()).toEqual({
			x: 1,
			y: 2
		});
	});

	it("equals()", () => {
		const point = Point.from({ x: 1, y: 2 });

		expect(point.equals(Point.from({ x: 1, y: 2 }))).toBe(true);
		expect(point.equals(Point.from({ x: 1, y: 3 }))).toBe(false);
		expect(point.equals(Point.from({ x: 1, y: 2 }).toJSON())).toBe(true);
		expect(point.equals(Point.from({ x: 1, y: 3 }).toJSON())).toBe(false);
		expect(point.equals(Point.from({ x: 1, y: 2 }).toString())).toBe(true);
		expect(point.equals(Point.from({ x: 1, y: 3 }).toString())).toBe(false);
	});

	it("get x", () => {
		const point = Point.from({ x: 1, y: 2 });
		expect(point.x).toBe(1);
	});

	it("get y", () => {
		const point = Point.from({ x: 1, y: 2 });
		expect(point.y).toBe(2);
	});

	it("set x", () => {
		const point = Point.from({ x: 1, y: 2 });
		point.x = 4;
		expect(point.x).toBe(4);
	});

	it("set y", () => {
		const point = Point.from({ x: 1, y: 2 });
		point.y = 4;
		expect(point.y).toBe(4);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "point.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestpoint (
					point point NULL,
					_point _point NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestpoint (point, _point)
				VALUES (
					'(1,2)',
					'{ (1.1\\,2.2), (3.3\\,4.4) }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestpoint
			`);

			expect(result.rows[0].point).toStrictEqual(Point.from({ x: 1, y: 2 }));
			expect(result.rows[0]._point).toStrictEqual([
				Point.from({ x: 1.1, y: 2.2 }),
				Point.from({ x: 3.3, y: 4.4 })
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestpoint
		`);

		await client.end();

		if (error) throw error;
	});
});
