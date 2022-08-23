# PostgreSQL-Type-Parsers [![Version](https://img.shields.io/npm/v/postgresql-type-parsers.svg)](https://www.npmjs.com/package/postgresql-type-parsers)

Easy to use types for PostgreSQL data types

- [Installation](#installation)
- [Usage](#usage)
  - [Circle](#circle)
  - [Interval](#interval)

## Installation

```bash
# npm
npm install postgresql-type-parsers

# yarn
yarn add postgresql-type-parsers

# pnpm
pnpm i postgresql-type-parsers
```

## Usage

### Circle

```ts
import { Circle } from "postgresql-type-parsers";

//* Circles can be created in the following ways:
const circle1 = Circle.from({ x: 1, y: 2, radius: 3 });
const circle2 = Circle.from("<(1,2),3>");
const circle3 = Circle.from(1, 2, 3); //x, y, radius

//* To verify if a value is a circle, use the `isCircle` method:
if (Circle.isCircle(circle1)) {
	console.log("circle1 is a circle");
}

//* Afterwards, you can get/set the properties of the circle:
circle1.x; // 1
circle1.y; // 2
circle1.radius; // 3

//* It has a `toString()` method that returns a string representation of the circle:
circle1.toString(); // "<(1,2),3>"

//* It has a `toJSON()` method that returns a JSON representation of the circle:
circle1.toJSON(); // { x: 1, y: 2, radius: 3 }

//* It has a `equals()` method that returns whether two circles are equal:
circle1.equals(circle2); // true
```

### Interval

```ts
import { Interval } from "postgresql-type-parsers";

//* Intervals can be created in the following ways:
const interval1 = Interval.from("01:02:03.456");
const interval2 = Interval.from("1 year -32 days");
const interval3 = Interval.from("P0Y0M4DT1H2M3S");
const interval4 = Interval.from("P4DT1H2M3S");
const interval5 = Interval.from(1, 2, 3, 4, 5, 6, 7); //years, months, days, hours, minutes, seconds, milliseconds
const interval6 = Interval.from({
	years: 1,
	months: 2,
	days: 3,
	hours: 4,
	minutes: 5,
	seconds: 6,
	milliseconds: 7
});

//* To verify if a value is an interval, use the `isInterval` method:
if (Interval.isInterval(interval1)) {
	console.log("interval1 is an interval");
}

//* Afterwards, you can get/set the properties of the interval:
interval6.years; // 1
interval6.months; // 2
interval6.days; // 3
interval6.hours; // 4
interval6.minutes; // 5
interval6.seconds; // 6
interval6.milliseconds; // 7

//* There are also readonly properties for the interval's total values:
interval6.totalYears; // 1.1916765048546811
interval6.totalMonths; // 14.300118058256173
interval6.totalDays; // 429.0035417476852
interval6.totalHours; // 10296.085001944444
interval6.totalMinutes; // 617765.1001166666
interval6.totalSeconds; // 37065906.007
interval6.totalMilliseconds; // 37065906007

//* It has a `toString()` method that returns a string representation of the interval:
interval6.toString(); // "1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds"

//* It has a `toISOString()` method that returns a JSON representation of the interval:
interval6.toISOString(); // "P1Y2M3DT4H5M6.007S"
//* By passing the `true` parameter, it will return the short representation of the interval:
interval1.toISOString(true); // "PT1H2M3.456S"

//* It has a `toJSON()` method that returns a JSON representation of the interval:
interval6.toJSON(); // { years: 1, months: 2, days: 3, hours: 4, minutes: 5, seconds: 6, milliseconds: 7 }

//* It has a `equals()` method that returns whether two intervals are equal:
interval6.equals(interval5); // true
```
