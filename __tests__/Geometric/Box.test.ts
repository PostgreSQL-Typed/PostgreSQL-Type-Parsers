import { Client } from "pg";

import { Box } from "../../src";

describe("Box Class", () => {
	it("should create a box from a string", () => {
		const box = Box.from("(1,2),(3,4)");
		expect(box).not.toBeNull();
	});

	it("should create a box from a object", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box).not.toBeNull();
	});

	it("should create a box from numbers", () => {
		const box = Box.from(1, 2, 3, 4);
		expect(box).not.toBeNull();
	});

	it("isBox()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(Box.isBox(box)).toBe(true);
		expect(Box.isBox({ x1: 1, y1: 2, x2: 3, y2: 4 })).toBe(false);
	});

	it("toString()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.toString()).toBe("(1,2),(3,4)");
	});

	it("toJSON()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.toJSON()).toEqual({ x1: 1, y1: 2, x2: 3, y2: 4 });
	});

	it("equals()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });

		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 }))).toBe(true);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 5 }))).toBe(false);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 }).toJSON())).toBe(
			true
		);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 5 }).toJSON())).toBe(
			false
		);
		expect(
			box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 }).toString())
		).toBe(true);
		expect(
			box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 5 }).toString())
		).toBe(false);
	});

	it("get x1", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.x1).toBe(1);
	});

	it("get y1", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.y1).toBe(2);
	});

	it("get x2", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.x2).toBe(3);
	});

	it("get y2", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.y2).toBe(4);
	});

	it("set x1", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		box.x1 = 5;
		expect(box.x1).toBe(5);
	});

	it("set y1", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		box.y1 = 5;
		expect(box.y1).toBe(5);
	});

	it("set x2", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		box.x2 = 5;
		expect(box.x2).toBe(5);
	});

	it("set y2", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		box.y2 = 5;
		expect(box.y2).toBe(5);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "box.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestbox (
					box box NULL,
					_box _box NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestbox (box, _box)
				VALUES (
					'(1,2),(3,4)',
					'{(1.1\,2.2)\,(3.3\,4.4);(5.5\,6.6)\,(7.7\,8.8)}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestbox
			`);

			expect(result.rows[0].box).toStrictEqual(
				Box.from({ x1: 3, y1: 4, x2: 1, y2: 2 })
			);
			expect(result.rows[0]._box).toStrictEqual([
				Box.from({ x1: 3.3, y1: 4.4, x2: 1.1, y2: 2.2 }),
				Box.from({ x1: 7.7, y1: 8.8, x2: 5.5, y2: 6.6 })
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestbox
		`);

		await client.end();

		if (error) throw error;
	});
});
