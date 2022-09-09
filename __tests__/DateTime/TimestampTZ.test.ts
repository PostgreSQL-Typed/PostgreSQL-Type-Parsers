import { DateTime } from "luxon";
import { Client } from "pg";

import { Date, TimestampTZ, TimeTZ } from "../../src";

describe("TimestampTZ Class", () => {
	it("should create a timestamptz from a string", () => {
		const timestamptz1 = TimestampTZ.from("2004-10-19 04:05:06.789+01:00");
		expect(timestamptz1).not.toBeNull();
		const timestamptz2 = TimestampTZ.from("2004-10-19 04:05:06.789 -01:00");
		expect(timestamptz2).not.toBeNull();
		const timestamptz3 = TimestampTZ.from("2004-10-19 04:05:06.789+01");
		expect(timestamptz3).not.toBeNull();
		const timestamptz4 = TimestampTZ.from("2004-10-19 04:05:06.789 -01");
		expect(timestamptz4).not.toBeNull();
		const timestamptz5 = TimestampTZ.from("2004-10-19 04:05:06.789 EST");
		expect(timestamptz5).not.toBeNull();
		const timestamptz6 = TimestampTZ.from("2004-10-19T04:05:06.789Z");
		expect(timestamptz6).not.toBeNull();
		const timestamptz7 = TimestampTZ.from("2004-10-19T04:05:06.789+01:00");
		expect(timestamptz7).not.toBeNull();
	});

	it("should create a timestamptz from a object", () => {
		const timestamptz1 = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz1).not.toBeNull();
		const timestamptz2 = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus"
			}
		});
		expect(timestamptz2).not.toBeNull();
	});

	it("should create a timestamptz from numbers", () => {
		const timestamptz1 = TimestampTZ.from(2004, 10, 19, 4, 5, 6, 1, 0, "plus");
		expect(timestamptz1).not.toBeNull();
		const timestamptz2 = TimestampTZ.from(2004, 10, 19, 4, 5, 6, 1, 0, "minus");
		expect(timestamptz2).not.toBeNull();
	});

	it("should create a timestamptz from a DateTime", () => {
		const timestamp = TimestampTZ.from(
			DateTime.fromObject({
				year: 2004,
				month: 10,
				day: 19,
				hour: 4,
				minute: 5,
				second: 6,
				millisecond: 789
			}).setZone("America/New_York")
		);
		expect(timestamp).not.toBeNull();
	});

	it("should create a timestamptz from a JavaScript Date", () => {
		const timestamp = TimestampTZ.from(
			new globalThis.Date(2004, 10, 19, 4, 5, 6, 789)
		);
		expect(timestamp).not.toBeNull();
	});

	it("isTimestampTZ()", () => {
		const timestamptz = TimestampTZ.from("2004-10-19 10:23:54.678 EST");
		expect(TimestampTZ.isTimestampTZ(timestamptz)).toBe(true);
		expect(
			TimestampTZ.isTimestampTZ({
				year: 2004,
				month: 10,
				day: 19,
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
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6.789,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.toString()).toBe("2004-10-19 04:05:06.789 +01:00");
	});

	it("toISO()", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6.789,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.toISO()).toBe("2004-10-19T04:05:06.789+01:00");
	});

	it("toJSON()", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.toJSON()).toEqual({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
	});

	it("equals()", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});

		expect(
			timestamptz.equals(
				TimestampTZ.from({
					year: 2004,
					month: 10,
					day: 19,
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
		).toBe(true);
		expect(
			timestamptz.equals(
				TimestampTZ.from({
					year: 2004,
					month: 10,
					day: 19,
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
		).toBe(false);
		expect(
			timestamptz.equals(
				TimestampTZ.from({
					year: 2004,
					month: 10,
					day: 19,
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
		).toBe(true);
		expect(
			timestamptz.equals(
				TimestampTZ.from({
					year: 2004,
					month: 10,
					day: 19,
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
		).toBe(false);
		expect(
			timestamptz.equals(
				TimestampTZ.from({
					year: 2004,
					month: 10,
					day: 19,
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
		).toBe(true);
		expect(
			timestamptz.equals(
				TimestampTZ.from({
					year: 2004,
					month: 10,
					day: 19,
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
		).toBe(false);
	});

	it("get year", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.year).toBe(2004);
	});

	it("set year", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		timestamptz.year = 2023;
		expect(timestamptz.year).toBe(2023);
	});

	it("get month", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.month).toBe(10);
	});

	it("set month", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		timestamptz.month = 4;
		expect(timestamptz.month).toBe(4);
	});

	it("get day", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.day).toBe(19);
	});

	it("set day", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		timestamptz.day = 3;
		expect(timestamptz.day).toBe(3);
	});

	it("get hour", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.hour).toBe(4);
	});

	it("set hour", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		timestamptz.hour = 12;
		expect(timestamptz.hour).toBe(12);
	});

	it("get minute", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.minute).toBe(5);
	});

	it("set minute", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		timestamptz.minute = 10;
		expect(timestamptz.minute).toBe(10);
	});

	it("get second", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6.123,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.second).toBe(6.123);
	});

	it("set second", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		timestamptz.second = 3;
		expect(timestamptz.second).toBe(3);
	});

	it("get offset", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.offset).toEqual({
			hour: 1,
			minute: 0,
			direction: "plus"
		});
	});

	it("set offset", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		timestamptz.offset = {
			hour: 2,
			minute: 0,
			direction: "minus"
		};
		expect(timestamptz.offset).toEqual({
			hour: 2,
			minute: 0,
			direction: "minus"
		});
	});

	it("toDate()", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.toDate()).toEqual(
			Date.from({
				year: 2004,
				month: 10,
				day: 19
			})
		);
	});

	it("toTime()", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.toTimeTZ()).toEqual(
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
		);
	});

	it("toDateTime()", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.toDateTime()).toStrictEqual(
			DateTime.fromISO("2004-10-19T04:05:06+01:00")
		);
	});

	it("toJSDate()", () => {
		const timestamptz = TimestampTZ.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus"
			}
		});
		expect(timestamptz.toJSDate()).toBeInstanceOf(globalThis.Date);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "timestamptz.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jesttimestamptz (
					timestamptz timestamptz NULL,
					_timestamptz _timestamptz NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttimestamptz (timestamptz, _timestamptz)
				VALUES (
					'2004-10-19 04:05:06.789 -01:00',
					'{ 2004-10-19T04:05:06.789+01:00, 2004-10-19 10:23:54.678 EST }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttimestamptz
			`);

			expect(result.rows[0].timestamptz).toStrictEqual(
				TimestampTZ.from("2004-10-19 05:05:06.789 +00:00")
			);
			expect(result.rows[0]._timestamptz).toStrictEqual([
				TimestampTZ.from("2004-10-19 03:05:06.789 +00:00"),
				TimestampTZ.from("2004-10-19 15:23:54.678 +00:00")
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jesttimestamptz
		`);

		await client.end();

		if (error) throw error;
	});
});
