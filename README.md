# PostgreSQL-Type-Parsers [![Version](https://img.shields.io/npm/v/postgresql-type-parsers.svg)](https://www.npmjs.com/package/postgresql-type-parsers) [![CI](https://github.com/PostgreSQL-Typed/PostgreSQL-Type-Parsers/actions/workflows/CI.yml/badge.svg)](https://github.com/PostgreSQL-Typed/PostgreSQL-Type-Parsers/actions/workflows/CI.yml)

Easy to use types for PostgreSQL data types

- [Installation](#installation)
- [Usage](#usage)
  - [Box](#box)
  - [Circle](#circle)
  - [Interval](#interval)
  - [LineSegment](#linesegment)
  - [Point](#point)

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

[box]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.8
[circle]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-CIRCLE
[interval]: https://www.postgresql.org/docs/current/datatype-datetime.html#DATATYPE-INTERVAL-INPUT
[lseg]: https://www.postgresql.org/docs/current/datatype-geometric.html#DATATYPE-LSEG
[point]: https://www.postgresql.org/docs/current/datatype-geometric.html#id-1.5.7.16.5
