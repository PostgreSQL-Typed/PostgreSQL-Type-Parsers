import type { ObjectFunction } from "../types/ObjectFunction";

export const arrayParser =
	(object: any, delimiter = '","') =>
	(value: string | null) => {
		const Object = object as ObjectFunction;

		if (value === null) return null;
		//* If the value doesn't start with { and end with }, it's not an ARRAY.
		if (!value.startsWith("{") || !value.endsWith("}")) return null;
		//* Removes the { and } from the string, make an extra space between circles and then split on the extra space.
		let values = value
			.slice(1, -1)
			.split(delimiter)
			.join(delimiter.includes('"') ? '", "' : ", ")
			.split(", ");
		//* Removes the quotes from the strings
		if (delimiter.includes('"')) values = values.map(v => v.slice(1, -1));
		//* Returns the values as Circle objects
		return values.map(v => Object.from(v));
	};
