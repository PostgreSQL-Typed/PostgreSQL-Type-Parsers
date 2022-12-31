const tsPreset = require("ts-jest/jest-preset");

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	...tsPreset,
	rootDir: "__tests__",
	testMatch: ["**/*.test.ts"],
};
