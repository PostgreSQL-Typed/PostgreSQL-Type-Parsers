export type ObjectFunction<T = any, V = string> = {
	from: (value: V) => T;
};
