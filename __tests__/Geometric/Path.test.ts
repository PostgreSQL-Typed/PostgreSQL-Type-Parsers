import { Client } from "pg";

import { Path, Point } from "../../src";

describe("Path Class", () => {
	it("should create a path from a string", () => {
		const path = Path.from("((1,2),(3,4))");
		expect(path).not.toBeNull();
	});

	it("should create a path from a object", () => {
		const path = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		expect(path).not.toBeNull();
	});

	it("should create a path from a raw object", () => {
		const path = Path.from({
			points: [
				{ x: 1, y: 2 },
				{ x: 3, y: 4 }
			],
			connection: "open"
		});
		expect(path).not.toBeNull();
	});

	it("should create a path from points", () => {
		const path = Path.from([Point.from(1, 2), Point.from(3, 4)]);
		expect(path).not.toBeNull();
	});

	it("should create a path from points", () => {
		const path = Path.from(Point.from(1, 2), Point.from(3, 4));
		expect(path).not.toBeNull();
	});

	it("isPath()", () => {
		const path = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		expect(Path.isPath(path)).toBe(true);
		expect(
			Path.isPath({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				connection: "open"
			})
		).toBe(false);
	});

	it("toString()", () => {
		const path1 = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		expect(path1.toString()).toBe("((1,2),(3,4))");
		const path2 = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "closed"
		});
		expect(path2.toString()).toBe("[(1,2),(3,4)]");
	});

	it("toJSON()", () => {
		const path1 = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		expect(path1.toJSON()).toEqual({
			points: [
				{ x: 1, y: 2 },
				{ x: 3, y: 4 }
			],
			connection: "open"
		});
		const path2 = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "closed"
		});
		expect(path2.toJSON()).toEqual({
			points: [
				{ x: 1, y: 2 },
				{ x: 3, y: 4 }
			],
			connection: "closed"
		});
	});

	it("equals()", () => {
		const path = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});

		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "open"
				})
			)
		).toBe(true);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })],
					connection: "open"
				})
			)
		).toBe(false);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "closed"
				})
			)
		).toBe(false);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "open"
				}).toJSON()
			)
		).toBe(true);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })],
					connection: "open"
				}).toJSON()
			)
		).toBe(false);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "closed"
				}).toJSON()
			)
		).toBe(false);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "open"
				}).toString()
			)
		).toBe(true);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })],
					connection: "open"
				}).toString()
			)
		).toBe(false);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "closed"
				}).toString()
			)
		).toBe(false);
		expect(
			path.equals([Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })])
		).toBe(true);
		expect(
			path.equals([Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })])
		).toBe(false);
	});

	it("get points", () => {
		const polygon = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		expect(polygon.points).toStrictEqual([
			Point.from({ x: 1, y: 2 }),
			Point.from({ x: 3, y: 4 })
		]);
	});

	it("set points", () => {
		const polygon = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		polygon.points = [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 5 })];
		expect(polygon.points).toStrictEqual([
			Point.from({ x: 1, y: 2 }),
			Point.from({ x: 3, y: 5 })
		]);
	});

	it("get connection", () => {
		const polygon = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		expect(polygon.connection).toBe("open");
	});

	it("set connection", () => {
		const polygon = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open"
		});
		polygon.connection = "closed";
		expect(polygon.connection).toBe("closed");
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "path.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestpath (
					path path NULL,
					_path _path NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestpath (path, _path)
				VALUES (
					'((1.1,2.2),(3.3,4.4))',
					'{((1.1\\,2.2)\\,(3.3\\,4.4)),[(5.5\\,6.6)\\,(7.7\\,8.8)]}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestpath
			`);

			expect(result.rows[0].path).toStrictEqual(
				Path.from({
					points: [
						Point.from({ x: 1.1, y: 2.2 }),
						Point.from({ x: 3.3, y: 4.4 })
					],
					connection: "open"
				})
			);
			expect(result.rows[0]._path).toStrictEqual([
				Path.from({
					points: [
						Point.from({ x: 1.1, y: 2.2 }),
						Point.from({ x: 3.3, y: 4.4 })
					],
					connection: "open"
				}),
				Path.from({
					points: [
						Point.from({ x: 5.5, y: 6.6 }),
						Point.from({ x: 7.7, y: 8.8 })
					],
					connection: "closed"
				})
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestpath
		`);

		await client.end();

		if (error) throw error;
	});
});
