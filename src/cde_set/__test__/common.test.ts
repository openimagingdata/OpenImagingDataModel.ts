import { test, expect } from "vitest";

import { SPECIALTY_NAMES, Specialty, Version, VersionDTO } from "../common.js";

// Specialty

test("create a specialty", () => {
	const specialty: Specialty = "AB";
	expect(specialty).toEqual("AB");
	expect(SPECIALTY_NAMES[specialty]).toEqual("Abdominal");
});

// Version

test("create a version", () => {
	expect(() => new Version({ number: 1, date: "2021-01-01" })).not.toThrow();
});

test("create a version with invalid number", () => {
	expect(() => new Version({ number: 1.1, date: "2021-01-01" })).toThrow();
});

test("create a version with invalid date", () => {
	expect(
		() => new Version({ number: 1, date: "2021-01-01T00:00:00" }),
	).toThrow();
});

test("create a DTO from a version", () => {
	const version = new Version({ number: 1, date: "2021-01-01" });
	const dto: VersionDTO = version;
	expect(dto).toEqual({ number: 1, date: "2021-01-01" });
});
