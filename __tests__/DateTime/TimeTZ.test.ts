import { DateTime } from "luxon";
import { Client } from "pg";

import { TimeTZ } from "../../src";

describe("TimeTZ Class", () => {
	it("should create a timetz from a string", () => {
		const timetz1 = TimeTZ.from("04:05:06.789+01:00");
		expect(timetz1).not.toBeNull();
		const timetz2 = TimeTZ.from("04:05:06.789-01:00");
		expect(timetz2).not.toBeNull();
		const timetz3 = TimeTZ.from("04:05:06.789+01");
		expect(timetz3).not.toBeNull();
		const timetz4 = TimeTZ.from("04:05:06.789-01");
		expect(timetz4).not.toBeNull();
		const timetz5 = TimeTZ.from("04:05:06.789 EST");
		expect(timetz5).not.toBeNull();
	});

	it("should create a timetz from a object", () => {
		const timetz1 = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timetz1).not.toBeNull();
		const timetz2 = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz2).not.toBeNull();
	});

	it("should create a timetz from numbers", () => {
		const timetz1 = TimeTZ.from(4, 5, 6, 1, 0, "plus");
		expect(timetz1).not.toBeNull();
		const timetz2 = TimeTZ.from(4, 5, 6, 1, 0, "minus");
		expect(timetz2).not.toBeNull();
	});

	it("should create a timetz from a DateTime", () => {
		const timetz = TimeTZ.from(
			DateTime.fromObject({
				hour: 4,
				minute: 5,
				second: 6,
				millisecond: 789
			}).setZone("America/New_York")
		);
		expect(timetz).not.toBeNull();
	});

	it("should create a timetz from a JavaScript Date", () => {
		const timetz = TimeTZ.from(new globalThis.Date(2022, 9, 2, 4, 5, 6, 789));
		expect(timetz).not.toBeNull();
	});

	it("isTimeTZ()", () => {
		const timetz = TimeTZ.from("04:05:06.789+01:00");
		expect(TimeTZ.isTimeTZ(timetz)).toBe(true);
		expect(
			TimeTZ.isTimeTZ({
				hour: 4,
				minute: 5,
				second: 6,
				offset: {
					hour: 1,
					minute: 0,
					direction: "minus"
				}
			})
		).toBe(false);
	});

	it("toString()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.toString()).toBe("04:05:06-01:00");
	});

	it("toJSON()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.toJSON()).toEqual({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
	});

	it("equals()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});

		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "minus"
					}
				})
			)
		).toBe(true);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus"
					}
				})
			)
		).toBe(false);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "minus"
					}
				}).toJSON()
			)
		).toBe(true);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus"
					}
				}).toJSON()
			)
		).toBe(false);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "minus"
					}
				}).toString()
			)
		).toBe(true);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus"
					}
				}).toString()
			)
		).toBe(false);
	});

	it("get hour", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.hour).toBe(4);
	});

	it("set hour", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		timetz.hour = 12;
		expect(timetz.hour).toBe(12);
	});

	it("get minute", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.minute).toBe(5);
	});

	it("set minute", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		timetz.minute = 10;
		expect(timetz.minute).toBe(10);
	});

	it("get second", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6.123,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.second).toBe(6.123);
	});

	it("set second", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		timetz.second = 3;
		expect(timetz.second).toBe(3);
	});

	it("get offset", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.offset).toEqual({
			hour: 1,
			minute: 0,
			direction: "minus"
		});
	});

	it("set offset", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		timetz.offset = {
			hour: 2,
			minute: 0,
			direction: "plus"
		};
		expect(timetz.offset).toEqual({
			hour: 2,
			minute: 0,
			direction: "plus"
		});
	});

	it("toDateTime()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.toDateTime()).toStrictEqual(
			DateTime.fromISO(`${DateTime.now().toISODate()}T04:05:06-01:00`)
		);
	});

	it("toJSDate()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timetz.toJSDate()).toBeInstanceOf(globalThis.Date);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "timetz.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jesttimetz (
					timetz timetz NULL,
					_timetz _timetz NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttimetz (timetz, _timetz)
				VALUES (
					'04:05:06.789-01:00',
					'{ 01:02:03.456+08:00, 04:05:06.789 EST }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttimetz
			`);

			expect(result.rows[0].timetz).toStrictEqual(
				TimeTZ.from("04:05:06.789-01:00")
			);
			expect(result.rows[0]._timetz).toStrictEqual([
				TimeTZ.from("01:02:03.456+08:00"),
				TimeTZ.from("04:05:06.789 EST")
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jesttimetz
		`);

		await client.end();

		if (error) throw error;
	});
});
