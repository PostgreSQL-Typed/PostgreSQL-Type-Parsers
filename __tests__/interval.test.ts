import { Client } from "pg";

import { Interval } from "../src";

describe("Interval Class", () => {
	it("should create a interval from a string", () => {
		const interval1 = Interval.from("01:02:03");
		expect(interval1).not.toBeNull();
		expect(
			interval1.equals({
				years: 0,
				months: 0,
				days: 0,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 0
			})
		).toBe(true);

		const interval2 = Interval.from("01:02:03.456");
		expect(interval2).not.toBeNull();
		expect(
			interval2.equals({
				years: 0,
				months: 0,
				days: 0,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 456
			})
		).toBe(true);

		const interval3 = Interval.from("1 year -32 days");
		expect(interval3).not.toBeNull();
		expect(
			interval3.equals({
				years: 1,
				months: 0,
				days: -32,
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0
			})
		).toBe(true);

		const interval4 = Interval.from("1 day -00:00:03");
		expect(interval4).not.toBeNull();
		expect(
			interval4.equals({
				years: 0,
				months: 0,
				days: 1,
				hours: 0,
				minutes: 0,
				seconds: -3,
				milliseconds: 0
			})
		).toBe(true);

		const interval5 = Interval.from("1 day -00:00:03.456");
		expect(interval5).not.toBeNull();
		expect(
			interval5.equals({
				years: 0,
				months: 0,
				days: 1,
				hours: 0,
				minutes: 0,
				seconds: -3,
				milliseconds: -456
			})
		).toBe(true);
	});

	it("should create a interval from a ISO", () => {
		const interval = Interval.from("P0Y0M4DT1H2M3S");
		expect(interval).not.toBeNull();
		expect(
			interval.equals({
				years: 0,
				months: 0,
				days: 4,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 0
			})
		).toBe(true);
	});

	it("should create a interval from a short ISO", () => {
		const interval = Interval.from("P4DT1H2M3S");
		expect(interval).not.toBeNull();
		expect(
			interval.equals({
				years: 0,
				months: 0,
				days: 4,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 0
			})
		).toBe(true);
	});

	it("should create a interval from numbers", () => {
		const interval = Interval.from(1, 2, 3, 4, 5, 6, 7);
		expect(interval).not.toBeNull();
		expect(
			interval.equals({
				years: 1,
				months: 2,
				days: 3,
				hours: 4,
				minutes: 5,
				seconds: 6,
				milliseconds: 7
			})
		).toBe(true);
	});

	it("isInterval()", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(Interval.isInterval(interval)).toBe(true);
		expect(
			Interval.isInterval({
				seconds: 3,
				minutes: 2,
				hours: 1
			})
		).toBe(false);
	});

	it("toString()", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(interval.toString()).toBe("1 hour 2 minutes 3 seconds");
	});

	it("toISOString()", () => {
		const interval = Interval.from({
			days: 4,
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(interval.toISOString()).toBe("P0Y0M4DT1H2M3S");
	});

	it("toISOString(), short", () => {
		const interval = Interval.from({
			days: 4,
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(interval.toISOString(true)).toBe("P4DT1H2M3S");
	});

	it("toJSON()", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(interval.toJSON()).toEqual({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
	});

	it("equals()", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});

		expect(
			interval.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 1
				})
			)
		).toBe(true);
		expect(
			interval.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 2
				}).toString()
			)
		).toBe(false);
		expect(
			interval.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 1
				}).toJSON()
			)
		).toBe(true);
		expect(
			interval.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 2
				}).toISOString()
			)
		).toBe(false);
		expect(
			interval.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 1
				}).toISOString(true)
			)
		).toBe(true);
	});

	it("get years", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(interval1.years).toBe(0);

		const interval2 = Interval.from({
			years: 1,
			seconds: 3,
			minutes: 2,
			hours: 1
		});

		expect(interval2.years).toBe(1);
	});

	it("set years", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		interval.years = 1;

		expect(interval.years).toBe(1);
	});

	it("get months", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(interval1.months).toBe(0);

		const interval2 = Interval.from({
			months: 1,
			seconds: 3,
			minutes: 2,
			hours: 1
		});

		expect(interval2.months).toBe(1);
	});

	it("set months", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		interval.months = 1;

		expect(interval.months).toBe(1);
	});

	it("get days", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		expect(interval1.days).toBe(0);

		const interval2 = Interval.from({
			days: 1,
			seconds: 3,
			minutes: 2,
			hours: 1
		});

		expect(interval2.days).toBe(1);
	});

	it("set days", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});
		interval.days = 1;

		expect(interval.days).toBe(1);
	});

	it("get hours", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2
		});
		expect(interval1.hours).toBe(0);

		const interval2 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1
		});

		expect(interval2.hours).toBe(1);
	});

	it("set hours", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2
		});
		interval.hours = 1;

		expect(interval.hours).toBe(1);
	});

	it("get minutes", () => {
		const interval1 = Interval.from({
			seconds: 3
		});
		expect(interval1.minutes).toBe(0);

		const interval2 = Interval.from({
			seconds: 3,
			minutes: 2
		});

		expect(interval2.minutes).toBe(2);
	});

	it("set minutes", () => {
		const interval = Interval.from({
			seconds: 3
		});
		interval.minutes = 2;

		expect(interval.minutes).toBe(2);
	});

	it("get seconds", () => {
		const interval = Interval.from({
			seconds: 3
		});

		expect(interval.seconds).toBe(3);
	});

	it("set seconds", () => {
		const interval = Interval.from({
			seconds: 3
		});
		interval.seconds = 2;

		expect(interval.seconds).toBe(2);
	});

	it("get milliseconds", () => {
		const interval = Interval.from({
			seconds: 3
		});

		expect(interval.milliseconds).toBe(0);
	});

	it("set milliseconds", () => {
		const interval = Interval.from({
			seconds: 3
		});
		interval.milliseconds = 2;

		expect(interval.milliseconds).toBe(2);
	});

	it("get totalMilliseconds", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1
		});

		expect(interval.totalMilliseconds).toBe(37065906007);
	});

	it("get totalSeconds", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1
		});

		expect(interval.totalSeconds).toBe(37065906.007);
	});

	it("get totalMinutes", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1
		});

		expect(interval.totalMinutes).toBe(617765.1001166666);
	});

	it("get totalHours", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1
		});

		expect(interval.totalHours).toBe(10296.085001944444);
	});

	it("get totalDays", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1
		});

		expect(interval.totalDays).toBe(429.0035417476852);
	});

	it("get totalMonths", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1
		});

		expect(interval.totalMonths).toBe(14.300118058256173);
	});

	it("get totalYears", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1
		});

		expect(interval.totalYears).toBe(1.1916765048546811);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "interval.test.ts"
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestinterval (
					interval interval NULL,
					_interval _interval NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestinterval (interval, _interval)
				VALUES (
					'1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds',
					'{ 1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds, 7 years 6 months 5 days 4 hours 3 minutes 2.001 seconds }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestinterval
			`);

			expect(result.rows[0].interval).toStrictEqual(
				Interval.from({
					milliseconds: 7,
					seconds: 6,
					minutes: 5,
					hours: 4,
					days: 3,
					months: 2,
					years: 1
				})
			);
			expect(result.rows[0]._interval).toStrictEqual([
				Interval.from({
					milliseconds: 7,
					seconds: 6,
					minutes: 5,
					hours: 4,
					days: 3,
					months: 2,
					years: 1
				}),
				Interval.from({
					milliseconds: 1,
					seconds: 2,
					minutes: 3,
					hours: 4,
					days: 5,
					months: 6,
					years: 7
				})
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestinterval
		`);

		await client.end();

		if (error) throw error;
	});
});

//Set get functions
