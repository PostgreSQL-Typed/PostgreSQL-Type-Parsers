import { Client } from "pg";

import { Circle } from "../../src";

describe("Circle Class", () => {
	it("should create a circle from a string", () => {
		const circle = Circle.from("<(1,2),3>");
		expect(circle).not.toBeNull();
	});

	it("should error when creating a circle from an invalid string", () => {
		expect(() => Circle.from("()")).toThrow("Invalid Circle string");
	});

	it("should create a circle from a object", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle).not.toBeNull();
	});

	it("should error when creating a circle from an invalid object", () => {
		expect(() =>
			Circle.from({
				x: 1,
				y: 2
			} as any)
		).toThrow("Invalid Circle object");
	});

	it("should create a circle from numbers", () => {
		const circle = Circle.from(1, 2, 3);
		expect(circle).not.toBeNull();
	});

	it("should error when creating a circle from invalid numbers", () => {
		expect(() => Circle.from(1, 2, "3" as any)).toThrow(
			"Invalid Circle array, invalid numbers"
		);
	});

	it("isCircle()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(Circle.isCircle(circle)).toBe(true);
		expect(Circle.isCircle({ x: 1, y: 2, radius: 3 })).toBe(false);
	});

	it("toString()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.toString()).toBe("<(1,2),3>");
	});

	it("toJSON()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.toJSON()).toEqual({
			x: 1,
			y: 2,
			radius: 3
		});
	});

	it("equals()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });

		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 3 }))).toBe(true);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 4 }))).toBe(false);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 3 }).toJSON())).toBe(
			true
		);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 4 }).toJSON())).toBe(
			false
		);
		expect(
			circle.equals(Circle.from({ x: 1, y: 2, radius: 3 }).toString())
		).toBe(true);
		expect(
			circle.equals(Circle.from({ x: 1, y: 2, radius: 4 }).toString())
		).toBe(false);
	});

	it("get x", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.x).toBe(1);
	});

	it("get y", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.y).toBe(2);
	});

	it("get radius", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.radius).toBe(3);
	});

	it("set x", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		circle.x = 4;
		expect(circle.x).toBe(4);
	});

	it("set y", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		circle.y = 4;
		expect(circle.y).toBe(4);
	});

	it("set radius", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		circle.radius = 4;
		expect(circle.radius).toBe(4);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "circle.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestcircle (
					circle circle NULL,
					_circle _circle NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestcircle (circle, _circle)
				VALUES (
					'<(1,2),3>',
					'{ <(1.1\\,2.2)\\,3.3>, <(4\\,5)\\,6> }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestcircle
			`);

			expect(result.rows[0].circle).toStrictEqual(
				Circle.from({ x: 1, y: 2, radius: 3 })
			);
			expect(result.rows[0]._circle).toStrictEqual([
				Circle.from({ x: 1.1, y: 2.2, radius: 3.3 }),
				Circle.from({ x: 4, y: 5, radius: 6 })
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestcircle
		`);

		await client.end();

		if (error) throw error;
	});
});
