import type { ObjectFunction } from "../types/ObjectFunction";

export const parser = (object: any) => (value: string | null) => {
	const Object = object as ObjectFunction;

	if (value === null) return null;
	return Object.from(value);
};
