import { Client } from "pg";

import { LineSegment, Point } from "../../src";

describe("LineSegment Class", () => {
	it("should create a line segment from a string", () => {
		const segment = LineSegment.from("[(1,2),(3,4)]");
		expect(segment).not.toBeNull();
	});

	it("should create a line segment from a object", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		expect(segment).not.toBeNull();
	});

	it("should create a line segment from a raw object", () => {
		const segment = LineSegment.from({
			a: {
				x: 1,
				y: 2
			},
			b: {
				x: 3,
				y: 4
			}
		});
		expect(segment).not.toBeNull();
	});

	it("should create a line segment from points", () => {
		const segment = LineSegment.from(Point.from(1, 2), Point.from(3, 4));
		expect(segment).not.toBeNull();
	});

	it("isLineSegment()", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		expect(LineSegment.isLineSegment(segment)).toStrictEqual(true);
		expect(
			LineSegment.isLineSegment({ a: Point.from(1, 2), b: Point.from(3, 4) })
		).toStrictEqual(false);
	});

	it("toString()", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		expect(segment.toString()).toStrictEqual("[(1,2),(3,4)]");
	});

	it("toJSON()", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		expect(segment.toJSON()).toEqual({
			a: {
				x: 1,
				y: 2
			},
			b: {
				x: 3,
				y: 4
			}
		});
	});

	it("equals()", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});

		expect(
			segment.equals(
				LineSegment.from({
					a: Point.from(1, 2),
					b: Point.from(3, 4)
				})
			)
		).toStrictEqual(true);
		expect(
			segment.equals(
				LineSegment.from({
					a: Point.from(1, 2),
					b: Point.from(3, 5)
				})
			)
		).toStrictEqual(false);
		expect(
			segment.equals(
				LineSegment.from({
					a: Point.from(1, 2),
					b: Point.from(3, 4)
				}).toJSON()
			)
		).toStrictEqual(true);
		expect(
			segment.equals(
				LineSegment.from({
					a: Point.from(1, 2),
					b: Point.from(3, 5)
				}).toJSON()
			)
		).toStrictEqual(false);
		expect(
			segment.equals(
				LineSegment.from({
					a: Point.from(1, 2),
					b: Point.from(3, 4)
				}).toString()
			)
		).toStrictEqual(true);
		expect(
			segment.equals(
				LineSegment.from({
					a: Point.from(1, 2),
					b: Point.from(3, 5)
				}).toString()
			)
		).toStrictEqual(false);
	});

	it("get a", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		expect(segment.a).toStrictEqual(Point.from(1, 2));
	});

	it("get b", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		expect(segment.b).toStrictEqual(Point.from(3, 4));
	});

	it("set a", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		segment.a = Point.from(5, 6);
		expect(segment.a).toStrictEqual(Point.from(5, 6));
	});

	it("set b", () => {
		const segment = LineSegment.from({
			a: Point.from(1, 2),
			b: Point.from(3, 4)
		});
		segment.b = Point.from(7, 8);
		expect(segment.b).toStrictEqual(Point.from(7, 8));
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
				CREATE TABLE public.jestlseg (
					lseg lseg NULL,
					_lseg _lseg NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestlseg (lseg, _lseg)
				VALUES (
					'[(1.1,2.2),(3.3,4.4)]',
					'{ \\[(1.1\\,2.2)\\,(3.3\\,4.4)\\], \\[(5.5\\,6.6)\\,(7.7\\,8.8)\\] }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestlseg
			`);

			expect(result.rows[0].lseg).toStrictEqual(
				LineSegment.from({
					a: Point.from(1.1, 2.2),
					b: Point.from(3.3, 4.4)
				})
			);
			expect(result.rows[0]._lseg).toStrictEqual([
				LineSegment.from({
					a: Point.from(1.1, 2.2),
					b: Point.from(3.3, 4.4)
				}),
				LineSegment.from({
					a: Point.from(5.5, 6.6),
					b: Point.from(7.7, 8.8)
				})
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestlseg
		`);

		await client.end();

		if (error) throw error;
	});
});
