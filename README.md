# PostgreSQL-Type-Parsers [![Version](https://img.shields.io/npm/v/postgresql-type-parsers.svg)](https://www.npmjs.com/package/postgresql-type-parsers) [![CI](https://github.com/PostgreSQL-Typed/PostgreSQL-Type-Parsers/actions/workflows/CI.yml/badge.svg)](https://github.com/PostgreSQL-Typed/PostgreSQL-Type-Parsers/actions/workflows/CI.yml)

Easy to use types for PostgreSQL data types

- [Installation](#installation)
- [Usage](#usage)
  - [Date/Time Types](#datetime-types)
    - [Date](#date)
    - [DateMultiRange](#datemultirange)
    - [DateRange](#daterange)
    - [Interval](#interval)
    - [Time](#time)
  - [Geometric Types](#geometric-types)
    - [Box](#box)
    - [Circle](#circle)
    - [Line](#line)
    - [LineSegment](#linesegment)
    - [Path](#path)
    - [Point](#point)
    - [Polygon](#polygon)

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

## Date/Time Types

- [Date](#date)
- [DateMultiRange](#datemultirange)
- [DateRange](#daterange)
- [Interval](#interval)
- [Time](#time)

### Date

Used to represent the following PostgreSQL data type(s):

- [`date`][datetime]
- [`_date`][datetime] (`date[]`)

```ts
import { Date } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* Date can be created in the following ways:
const date1 = Date.from("2020-01-01");
const date2 = Date.from({ year: 2020, month: 1, day: 1 });
const date3 = Date.from(2020, 1, 1); //year, month, day
const date4 = Date.from(DateTime.fromISO("2020-01-01")); // Luxon DateTime
const date5 = Date.from(new globalThis.Date("2020-01-01")); // JavaScript Date

//* To verify if a value is a date, use the `isDate` method:
if (Date.isDate(date1)) {
	console.log("date1 is a date");
}

//* Afterwards, you can get/set the properties of the date:
date1.year; // 2020
date1.month; // 1
date1.day; // 1

//* It has a `toString()` method that returns a string representation of the date:
date1.toString(); // "2020-01-01"

//* It has a `toJSON()` method that returns a JSON representation of the date:
date1.toJSON(); // { year: 2020, month: 1, day: 1 }

//* It has a `equals()` method that returns whether two dates are equal:
date1.equals(date2); // true

//* It has a `toDateTime()` method that returns a `DateTime` representation of the date: (defaults to the current timezone)
date1.toDateTime(); // DateTime { year: 2020, month: 1, day: 1 }
date1.toDateTime("America/New_York"); // DateTime { year: 2020, month: 1, day: 1, zone: "America/New_York" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
date1.toJSDate(); // Date { year: 2020, month: 1, day: 1 }
date1.toJSDate("America/New_York"); // Date { year: 2020, month: 1, day: 1, zone: "America/New_York" }
```

### DateMultiRange

Used to represent the following PostgreSQL data type(s):

- [`datemultirange`][multirange]
- [`_datemultirange`][multirange] (`datemultirange[]`)

```ts
import { DateMultiRange, DateRange } from "postgresql-type-parsers";

//* DateMultiRange can be created in the following ways:
const dateMultiRange1 = DateMultiRange.from(
	"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}"
);
const dateMultiRange2 = DateMultiRange.from({
	ranges: [
		DateRange.from("[1999-01-08,2022-01-01)"),
		DateRange.from("[2023-01-08,2024-01-01)")
	]
});
const dateMultiRange3 = DateMultiRange.from([
	DateRange.from("[1999-01-08,2022-01-01)"),
	DateRange.from("[2023-01-08,2024-01-01)")
]);
const dateMultiRange4 = DateMultiRange.from(
	DateRange.from("[1999-01-08,2022-01-01)"),
	DateRange.from("[2023-01-08,2024-01-01)")
);
const dateMultiRange5 = DateMultiRange.from({
	ranges: [
		{
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{ year: 1999, month: 1, day: 8 },
				{ year: 2022, month: 1, day: 1 }
			]
		},
		{
			lower: "(",
			upper: "]",
			value: [
				{ year: 2023, month: 1, day: 8 },
				{ year: 2024, month: 1, day: 1 }
			]
		}
	]
});

//* To verify if a value is a date multi range, use the `isMultiRange` method:
if (DateMultiRange.isMultiRange(dateMultiRange1)) {
	console.log("dateMultiRange1 is a date multi range");
}

//* Afterwards, you can get/set the properties of the date multi range:
dateMultiRange1.ranges; // [DateRange, DateRange]

//* It has a `toString()` method that returns a string representation of the date multi range:
dateMultiRange1.toString(); // "{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}"

//* It has a `toJSON()` method that returns a JSON representation of the date multi range:
dateMultiRange1.toJSON(); // { ranges: [{ lower: "[", upper: ")", value: [Date, Date] }, { lower: "[", upper: ")", value: [Date, Date] }] }

//* It has a `equals()` method that returns whether two date multi ranges are equal:
dateMultiRange1.equals(dateMultiRange2); // true
```

### DateRange

Used to represent the following PostgreSQL data type(s):

- [`daterange`][range]
- [`_daterange`][range] (`daterange[]`)

```ts
import {
	Date,
	DateRange,
	LowerRange,
	UpperRange
} from "postgresql-type-parsers";

//* DateRange can be created in the following ways:
const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
const dateRange2 = DateRange.from({
	lower: LowerRange.include,
	upper: UpperRange.exclude,
	value: [
		{ year: 2022, month: 9, day: 2 }, // lowerValue
		{ year: 2022, month: 10, day: 3 } // upperValue
	]
});
const dateRange3 = DateRange.from({
	lower: LowerRange.include,
	upper: UpperRange.exclude,
	value: [
		Date.from({ year: 2022, month: 9, day: 2 }), // lowerValue
		Date.from({ year: 2022, month: 10, day: 3 }) // upperValue
	]
});
const dateRange4 = DateRange.from(
	Date.from({ year: 2022, month: 9, day: 2 }), // lowerValue
	Date.from({ year: 2022, month: 10, day: 3 }) // upperValue
); // Defaults to [lowerValue, upperValue)
const dateRange5 = DateRange.from([
	Date.from({ year: 2022, month: 9, day: 2 }), //lowerValue
	Date.from({ year: 2022, month: 10, day: 3 }) //upperValue
]); // Defaults to [lowerValue, upperValue)

//* To verify if a value is a date range, use the `isRange` method:
if (DateRange.isRange(dateRange1)) {
	console.log("dateRange1 is a date range");
}

//* Afterwards, you can get/set the properties of the date range:
dateRange1.lower; // LowerRange.include
dateRange1.upper; // UpperRange.exclude
dateRange1.value; // [Date { year: 2022, month: 9, day: 2 }, Date { year: 2022, month: 10, day: 3 }]

//* It has a `toString()` method that returns a string representation of the date range:
dateRange1.toString(); // "[2022-09-02,2022-10-03)"

//* It has a `toJSON()` method that returns a JSON representation of the date range:
dateRange1.toJSON(); // { lower: LowerRange.include, upper: UpperRange.exclude, value: [ { year: 2022, month: 9, day: 2 }, { year: 2022, month: 10, day: 3 } ] }

//* It has a `equals()` method that returns whether two date ranges are equal:
dateRange1.equals(dateRange2); // true

//* It has a `empty` readonly property that returns whether the date range is empty:
dateRange1.empty; // false
const dateRange6 = DateRange.from("[2022-09-02,2022-09-02)");
dateRange6.empty; // true
const dateRange7 = DateRange.from("empty");
dateRange7.empty; // true

//! Note that if a DateRange is empty, it will have a `null` value.
dateRange6.value; // null
dateRange7.value; // null

//* It has a `isWithinRange()` method that returns whether a date is within the range:
dateRange1.isWithinRange(Date.from("2022-09-15")); // true
```

### Interval

Used to represent the following PostgreSQL data type(s):

- [`interval`][interval]
- [`_interval`][interval] (`interval[]`)

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

### Time

Used to represent the following PostgreSQL data type(s):

- [`time`][datetime]
- [`_time`][datetime] (`time[]`)

```ts
import { Time } from "postgresql-type-parsers";
import { DateTime } from "luxon";

//* Times can be created in the following ways:
const time1 = Time.from("12:34:56.789"); // Note milliseconds are ignored
const time2 = Time.from(12, 34, 56); // hours, minutes, seconds
const time3 = Time.from({
	hours: 12,
	minutes: 34,
	seconds: 56
});
const time4 = Time.from(DateTime.fromISO("2020-01-01 12:34:56")); // Luxon DateTime
const time5 = Time.from(new globalThis.Date("2020-01-01 12:34:56")); // JavaScript Date

//* To verify if a value is a time, use the `isTime` method:
if (Time.isTime(time1)) {
	console.log("time1 is a time");
}

//* Afterwards, you can get/set the properties of the time:
time1.hours; // 12
time1.minutes; // 34
time1.seconds; // 56

//* It has a `toString()` method that returns a string representation of the time:
time1.toString(); // "12:34:56"

//* It has a `toJSON()` method that returns a JSON representation of the time:
time1.toJSON(); // { hours: 12, minutes: 34, seconds: 56 }

//* It has a `equals()` method that returns whether two times are equal:
time1.equals(time2); // true

//* It has a `toDateTime()` method that returns a `DateTime` representation of the date: (defaults to the current timezone)
time1.toDateTime(); // DateTime { hours: 12, minutes: 34, seconds: 56 }
time1.toDateTime("America/New_York"); // DateTime { hours: 12, minutes: 34, seconds: 56, zone: "America/New_York" }

//* It has a `toJSDate()` method that returns a JavaScript `Date` representation of the date: (defaults to the current timezone)
time1.toJSDate(); // Date { hours: 12, minutes: 34, seconds: 56 }
time1.toJSDate("America/New_York"); // Date { hours: 12, minutes: 34, seconds: 56, zone: "America/New_York" }
```

## Geometric Types

- [Box](#box)
- [Circle](#circle)
- [Line](#line)
- [LineSegment](#linesegment)
- [Path](#path)
- [Point](#point)
- [Polygon](#polygon)

### Box

Used to represent the following PostgreSQL data type(s):

- [`box`][box]
- [`_box`][box] (`box[]`)

```ts
import { Box } from "postgresql-type-parsers";

//* Box can be created in the following ways:
const box1 = Box.from("(1,2),(3,4)");
const box2 = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
const box3 = Box.from(1, 2, 3, 4);

//* To verify if a value is a box, use the `isBox` method:
if (Box.isBox(box1)) {
	console.log("box1 is a box");
}

//* Afterwards, you can get/set the properties of the box:
box1.x1; // 1
box1.y1; // 2
box1.x2; // 3
box1.y2; // 4

//* It has a `toString()` method that returns a string representation of the box:
box1.toString(); // "(1,2),(3,4)"

//* It has a `toJSON()` method that returns a JSON representation of the box:
box1.toJSON(); // { x1: 1, y1: 2, x2: 3, y2: 4 }

//* It has a `equals()` method that returns whether two boxes are equal:
box1.equals(box2); // true
```

### Circle

Used to represent the following PostgreSQL data type(s):

- [`circle`][circle]
- [`_circle`][circle] (`circle[]`)

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

### Line

Used to represent the following PostgreSQL data type(s):

- [`line`][line]
- [`_line`][line] (`line[]`)

```ts
import { Line } from "postgresql-type-parsers";

//* Lines can be created in the following ways:
const line1 = Line.from({ a: 1, b: 2, c: 3 });
const line2 = Line.from("{1,2,3}");
const line3 = Line.from(1, 2, 3); //a, b, c

//* To verify if a value is a line, use the `isLine` method:
if (Line.isLine(line1)) {
	console.log("line1 is a line");
}

//* Afterwards, you can get/set the properties of the line:
line1.a; // 1
line1.b; // 2
line1.c; // 3

//* It has a `toString()` method that returns a string representation of the line:
line1.toString(); // "{1,2,3}"

//* It has a `toJSON()` method that returns a JSON representation of the line:
line1.toJSON(); // { a: 1, b: 2, c: 3 }

//* It has a `equals()` method that returns whether two lines are equal:
line1.equals(line2); // true
```

### LineSegment

Used to represent the following PostgreSQL data type(s):

- [`lseg`][lseg]
- [`_lseg`][lseg] (`lseg[]`)

```ts
import { LineSegment, Point } from "postgresql-type-parsers";

//* LineSegment can be created in the following ways:
const lineSegment1 = LineSegment.from("[(1,2),(3,4)]");
const lineSegment2 = LineSegment.from({
	a: Point.from(1, 2),
	b: Point.from(3, 4)
});
const lineSegment3 = LineSegment.from({
	a: {
		x: 1,
		y: 2
	},
	b: {
		x: 3,
		y: 4
	}
});
const lineSegment4 = LineSegment.from(Point.from(1, 2), Point.from(3, 4));

//* To verify if a value is a line segment, use the `isLineSegment` method:
if (LineSegment.isLineSegment(lineSegment1)) {
	console.log("lineSegment1 is a line segment");
}

//* Afterwards, you can get/set the properties of the line segment:
lineSegment1.a; // Point { x: 1, y: 2 }
lineSegment1.b; // Point { x: 3, y: 4 }

//* It has a `toString()` method that returns a string representation of the line segment:
lineSegment1.toString(); // "[(1,2),(3,4)]"

//* It has a `toJSON()` method that returns a JSON representation of the line segment:
lineSegment1.toJSON(); // { a: { x: 1, y: 2 }, b: { x: 3, y: 4 } }

//* It has a `equals()` method that returns whether two line segments are equal:
lineSegment1.equals(lineSegment2); // true
```

### Path

Used to represent the following PostgreSQL data type(s):

- [`path`][path]
- [`_path`][path] (`path[]`)

```ts
import { Path, Point } from "postgresql-type-parsers";

//* Path can be created in the following ways:
const path1 = Path.from("((1,2),(3,4))");
const path2 = Path.from([Point.from(1, 2), Point.from(3, 4)]); //Defaults connection to `open`
const path3 = Path.from({
	points: [
		{ x: 1, y: 2 },
		{ x: 3, y: 4 }
	],
	connection: "closed"
});
const path4 = Path.from(Point.from(1, 2), Point.from(3, 4)); //Defaults connection to `open`
const path5 = Path.from({
	points: [Point.from(1, 2), Point.from(3, 4)],
	connection: "closed"
});

//* To verify if a value is a path, use the `isPath` method:
if (Path.isPath(path1)) {
	console.log("path1 is a path");
}

//* Afterwards, you can get/set the properties of the path:
path1.points; // [ Point { x: 1, y: 2 }, Point { x: 3, y: 4 } ]
path1.connection; // "open"

//* It has a `toString()` method that returns a string representation of the polygon:
path1.toString(); // "((1,2),(3,4))"

//* It has a `toJSON()` method that returns a JSON representation of the polygon:
path1.toJSON(); // { points: [ { x: 1, y: 2 }, { x: 3, y: 4 } ], connection: "open" }

//* It has a `equals()` method that returns whether two polygons are equal:
path1.equals(path2); // true
```

### Point

Used to represent the following PostgreSQL data type(s):

- [`point`][point]
- [`_point`][point] (`point[]`)

```ts
import { Point } from "postgresql-type-parsers";

//* Points can be created in the following ways:
const point1 = Point.from("(1,2)");
const point2 = Point.from({ x: 1, y: 2 });
const point3 = Point.from(1, 2);

//* To verify if a value is a point, use the `isPoint` method:
if (Point.isPoint(point1)) {
	console.log("point1 is a point");
}

//* Afterwards, you can get/set the properties of the point:
point1.x; // 1
point1.y; // 2

//* It has a `toString()` method that returns a string representation of the point:
point1.toString(); // "(1,2)"

//* It has a `toJSON()` method that returns a JSON representation of the point:
point1.toJSON(); // { x: 1, y: 2 }

//* It has a `equals()` method that returns whether two points are equal:
point1.equals(point2); // true
```

### Polygon

Used to represent the following PostgreSQL data type(s):

- [`polygon`][polygon]
- [`_polygon`][polygon] (`polygon[]`)

```ts
import { Polygon, Point } from "postgresql-type-parsers";

//* Polygons can be created in the following ways:
const polygon1 = Polygon.from("((1,2),(3,4))");
const polygon2 = Polygon.from([Point.from(1, 2), Point.from(3, 4)]);
const polygon3 = Polygon.from({
	points: [
		{ x: 1, y: 2 },
		{ x: 3, y: 4 }
	]
});
const polygon4 = Polygon.from(Point.from(1, 2), Point.from(3, 4));
const polygon5 = Polygon.from({
	points: [Point.from(1, 2), Point.from(3, 4)]
});

//* To verify if a value is a polygon, use the `isPolygon` method:
if (Polygon.isPolygon(polygon1)) {
	console.log("polygon1 is a polygon");
}

//* Afterwards, you can get/set the properties of the polygon:
polygon1.points; // [ Point { x: 1, y: 2 }, Point { x: 3, y: 4 } ]

//* It has a `toString()` method that returns a string representation of the polygon:
polygon1.toString(); // "((1,2),(3,4))"

//* It has a `toJSON()` method that returns a JSON representation of the polygon:
polygon1.toJSON(); // { points: [ { x: 1, y: 2 }, { x: 3, y: 4 } ] }

//* It has a `equals()` method that returns whether two polygons are equal:
polygon1.equals(polygon2); // true
```

[box]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.8
[circle]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE
[datetime]: https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-DATETIME-INPUT
[interval]: https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-INPUT
[line]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LINE
[lseg]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
[multirange]: https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-CONSTRUCT
[path]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.9
[point]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5
[polygon]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-POLYGON
[range]: https://www.postgresql.org/docs/current/rangetypes.html#RANGETYPES-IO
