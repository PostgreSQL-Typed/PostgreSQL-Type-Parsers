import { DateTime } from "luxon";
import { Client } from "pg";

import { Time } from "../../src";

describe("Date Class", () => {
	it("should create a time from a string", () => {
		const time = Time.from("04:05:06.789");
		expect(time).not.toBeNull();
	});

	it("should create a time from a object", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		expect(time).not.toBeNull();
	});

	it("should create a time from numbers", () => {
		const time = Time.from(4, 5, 6);
		expect(time).not.toBeNull();
	});

	it("should create a time from a DateTime", () => {
		const time = Time.from(
			DateTime.fromObject({
				hour: 4,
				minute: 5,
				second: 6,
				millisecond: 789
			})
		);
		expect(time).not.toBeNull();
	});

	it("should create a time from a JavaScript Date", () => {
		const time = Time.from(new globalThis.Date(2022, 9, 2, 4, 5, 6, 789));
		expect(time).not.toBeNull();
	});

	it("isTime()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		expect(Time.isTime(time)).toBe(true);
		expect(
			Time.isTime({
				hour: 4,
				minute: 5,
				second: 6
			})
		).toBe(false);
	});

	it("toString()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789
		});
		expect(time.toString()).toBe("04:05:06");
	});

	it("toJSON()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789
		});
		expect(time.toJSON()).toEqual({
			hour: 4,
			minute: 5,
			second: 6
		});
	});

	it("equals()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789
		});

		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6
				})
			)
		).toBe(true);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 6,
					second: 6
				})
			)
		).toBe(false);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6
				}).toJSON()
			)
		).toBe(true);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 6,
					second: 6
				}).toJSON()
			)
		).toBe(false);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6
				}).toString()
			)
		).toBe(true);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 6,
					second: 6
				}).toString()
			)
		).toBe(false);
	});

	it("get hour", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		expect(time.hour).toBe(4);
	});

	it("set hour", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		time.hour = 12;
		expect(time.hour).toBe(12);
	});

	it("get minute", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		expect(time.minute).toBe(5);
	});

	it("set minute", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		time.minute = 10;
		expect(time.minute).toBe(10);
	});

	it("get second", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789
		});
		expect(time.second).toBe(6);
	});

	it("set second", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		time.second = 3;
		expect(time.second).toBe(3);
	});

	it("toDateTime()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		expect(time.toDateTime()).toStrictEqual(
			DateTime.fromObject(
				{
					hour: 4,
					minute: 5,
					second: 6
				},
				{ zone: "local" }
			)
		);
	});

	it("toJSDate()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6
		});
		expect(time.toJSDate()).toBeInstanceOf(globalThis.Date);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "time.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jesttime (
					time time NULL,
					_time _time NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttime (time, _time)
				VALUES (
					'04:05:06.789',
					'{ 01:02:03.456, 04:05:06.789 }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttime
			`);

			expect(result.rows[0].time).toStrictEqual(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6
				})
			);
			expect(result.rows[0]._time).toStrictEqual([
				Time.from({
					hour: 1,
					minute: 2,
					second: 3
				}),
				Time.from({
					hour: 4,
					minute: 5,
					second: 6
				})
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jesttime
		`);

		await client.end();

		if (error) throw error;
	});
});
