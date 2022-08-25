import { Client } from "pg";

import { Point, Polygon } from "../src";

describe("Polygon Class", () => {
	it("should create a polygon from a string", () => {
		const polygon = Polygon.from("((1,2),(3,4))");
		expect(polygon).not.toBeNull();
	});

	it("should create a polygon from a object", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
		});
		expect(polygon).not.toBeNull();
	});

	it("should create a polygon from a raw object", () => {
		const polygon = Polygon.from({
			points: [
				{ x: 1, y: 2 },
				{ x: 3, y: 4 }
			]
		});
		expect(polygon).not.toBeNull();
	});

	it("should create a polygon from points", () => {
		const polygon = Polygon.from([Point.from(1, 2), Point.from(3, 4)]);
		expect(polygon).not.toBeNull();
	});

	it("should create a polygon from points", () => {
		const polygon = Polygon.from(Point.from(1, 2), Point.from(3, 4));
		expect(polygon).not.toBeNull();
	});

	it("isPolygon()", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
		});
		expect(Polygon.isPolygon(polygon)).toBe(true);
		expect(
			Polygon.isPolygon({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
			})
		).toBe(false);
	});

	it("toString()", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
		});
		expect(polygon.toString()).toBe("((1,2),(3,4))");
	});

	it("toJSON()", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
		});
		expect(polygon.toJSON()).toEqual({
			points: [
				{ x: 1, y: 2 },
				{ x: 3, y: 4 }
			]
		});
	});

	it("equals()", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
		});

		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
				})
			)
		).toBe(true);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })]
				})
			)
		).toBe(false);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
				}).toJSON()
			)
		).toBe(true);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })]
				}).toJSON()
			)
		).toBe(false);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
				}).toString()
			)
		).toBe(true);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })]
				}).toString()
			)
		).toBe(false);
	});

	it("get points", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
		});
		expect(polygon.points).toStrictEqual([
			Point.from({ x: 1, y: 2 }),
			Point.from({ x: 3, y: 4 })
		]);
	});

	it("set points", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })]
		});
		polygon.points = [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })];
		expect(polygon.points).toStrictEqual([
			Point.from({ x: 1, y: 2 }),
			Point.from({ x: 3, y: 5 })
		]);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "polygon.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestpolygon (
					polygon polygon NULL,
					_polygon _polygon NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestpolygon (polygon, _polygon)
				VALUES (
					'((1.1,2.2),(3.3,4.4))',
					'{((1.1\\,2.2)\\,(3.3\\,4.4)),((5.5\\,6.6)\\,(7.7\\,8.8))}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestpolygon
			`);

			expect(result.rows[0].polygon).toStrictEqual(
				Polygon.from({
					points: [
						Point.from({ x: 1.1, y: 2.2 }),
						Point.from({ x: 3.3, y: 4.4 })
					]
				})
			);
			expect(result.rows[0]._polygon).toStrictEqual([
				Polygon.from({
					points: [
						Point.from({ x: 1.1, y: 2.2 }),
						Point.from({ x: 3.3, y: 4.4 })
					]
				}),
				Polygon.from({
					points: [
						Point.from({ x: 5.5, y: 6.6 }),
						Point.from({ x: 7.7, y: 8.8 })
					]
				})
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestpolygon
		`);

		await client.end();

		if (error) throw error;
	});
});
