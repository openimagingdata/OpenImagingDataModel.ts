import { describe, it, expect } from "vitest";
import {
	IntegerElement,
	FloatElement,
	ValueSetElement,
	BooleanElement,
} from "../cde_element.js";
import { CdeSet } from "../cdeSet.js";
import {
	createSet,
	createIntegerElement,
	createFloatElement,
	createBooleanElement,
	createValueSetElement,
} from "../cdeSetFactory.js";

describe("SetFactory", () => {
	it("should create a CdeSet correctly", () => {
		const setName = "Test Set";
		const setDescription = "A description for the test set";
		const cdeSet = createSet(setName, setDescription, false);

		expect(cdeSet).toBeInstanceOf(CdeSet);
		expect(cdeSet.name).toBe(setName);
		expect(cdeSet.description).toBe(setDescription);
		expect(cdeSet.elements).toHaveLength(0);
	});

	it("should throw an error if name is missing when creating a CdeSet", () => {
		expect(() => createSet("")).toThrow("Name is required for a CDE Set");
	});

	it("should create an IntegerElement correctly", () => {
		const integerElement = createIntegerElement(
			"Test Element",
			1,
			10,
			1,
			"units",
		);

		expect(integerElement).toBeInstanceOf(IntegerElement);
		console.log("Integeger Element: ", integerElement);
		expect(integerElement.integerValue).toHaveProperty("min_value", 1);
		expect(integerElement.integerValue).toHaveProperty("max_value", 10);
		expect(integerElement.integerValue).toHaveProperty("unit", "units");
	});

	it("should create a FloatElement correctly", () => {
		const floatElement = createFloatElement(
			"Test Float",
			0.1,
			10.1,
			0.1,
			"units",
		);
		expect(floatElement).toBeInstanceOf(FloatElement);
		console.log("Float Element: ", floatElement);
		expect(floatElement.floatValue).toHaveProperty("min_value", 0.1);
		expect(floatElement.floatValue).toHaveProperty("max_value", 10.1);
		expect(floatElement.floatValue).toHaveProperty("unit", "units");
	});

	it("should create a BooleanElement correctly", () => {
		const booleanElement = createBooleanElement("Test Boolean");

		expect(booleanElement).toBeInstanceOf(BooleanElement);
		expect(booleanElement.booleanValue).toBe("boolean");
		console.log("Boolean Element: ", booleanElement);
	});

	it("should create a ValueSetElement with valid input", () => {
		const name = "Sample Element";
		const values = ["Value 1", "Value 2"];
		const definition = "Element Definition";
		const question = "Element Question";

		const element = createValueSetElement(
			name,
			values,
			definition,
			question,
			1,
			1,
		);

		expect(element).toBeInstanceOf(ValueSetElement);
		console.log("Value Set Element: ", element);
		expect(element.value_set.values.length).toBe(2);
		expect(element.value_set.values[0]).toHaveProperty("name", "Value 1");
	});

	it("should throw an error for ValueSetElement with less than two values", () => {
		expect(() =>
			createValueSetElement("Single Value", [{ name: "Only One" }]),
		).toThrow("Value set must have at least two values");
	});
});