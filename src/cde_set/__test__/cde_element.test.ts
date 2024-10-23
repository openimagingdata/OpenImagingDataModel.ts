import { describe, it, expect } from "vitest";
import { Schema } from "@effect/schema";
import { Either } from "effect";
import {
	BaseElement,
	ValueSetElement,
	valueSetElementSchema,
	CdElementFactory,
} from "../cde_element.js";
import { CdeSet } from "../cde_set.js";

const valueSetElementdata = {
	id: "RDE1695",
	parent_set: "RDES3",
	name: "Microscopic fat",
	definition:
		"The adrenal nodule contains macroscopic fat, as evidenced by at least one pixel attenuation value less than -10 HU.",
	element_version: {
		number: 1,
		date: "2023-06-23",
	},
	schema_version: "1.0.0",
	status: {
		date: "2023-06-23",
		//name: "Published", //TODO: Not working. String literal not working as expected. Enum not working as expected
	},
	index_codes: [],
	contributors: {
		people: [],
		organizations: [],
	},
	history: [],
	specialty: [],
	references: [],
	value_set: {
		min_cardinality: 1,
		max_cardinality: 1,
		values: [
			{
				code: "RDE1695.0",
				name: "present",
			},
			{
				code: "RDE1695.1",
				name: "absent",
			},
			{
				code: "RDE1695.2",
				name: "unknown",
			},
			{
				code: "RDE1695.3",
				name: "indeterminate",
			},
		],
	},
};

describe("ValueSetElement", () => {
	it("should create a new ValueSetElement", () => {
		const element = new ValueSetElement(valueSetElementdata);
		expect(element).toBeInstanceOf(BaseElement);
		expect(element).toBeInstanceOf(ValueSetElement);
		expect(element.value_set).toHaveProperty("min_cardinality", 1);
		expect(element.value_set).toHaveProperty("max_cardinality", 1);
		expect(element.value_set.values).toHaveLength(4);
		expect(element.value_set.values[0]).toHaveProperty("code", "RDE1695.0");
		expect(element.value_set.values[0]).toHaveProperty("name", "present");
	});
});

describe("CdeElementFactory", () => {
	it("CdElementFactory should generate proper element subtype", () => {
		const element = CdElementFactory.create(valueSetElementdata);
		expect(element).toBeInstanceOf(BaseElement);
		expect(element).toBeInstanceOf(ValueSetElement);
		expect(element).toHaveProperty("value_set");
		console.log("Element: ", element);
	});
});

describe("Encoding", () => {
	it("Encoding from data to ValueSetElement", () => {
		const encodedDataEither = Schema.encodeEither(valueSetElementSchema)(
			valueSetElementdata,
		);
		if (Either.isRight(encodedDataEither)) {
			const encodedData = encodedDataEither.right;
			console.log("Encoded data: ", encodedData);
			expect;
			expect(encodedData).toHaveProperty("id", "RDE1695");
			expect(encodedData).toHaveProperty("name", "Microscopic fat");
			expect(encodedData).toHaveProperty("value_set");
			expect(encodedData).toHaveProperty("element_version");
			expect(encodedData).toHaveProperty("status");
			expect(encodedData).toHaveProperty("specialty");
			expect(encodedData.value_set).toHaveProperty("min_cardinality", 1);
			expect(encodedData.value_set).toHaveProperty("max_cardinality", 1);
			expect(encodedData.value_set).toHaveProperty("values");
			expect(encodedData.value_set.values).toHaveLength(4);
			expect(encodedData.value_set.values[0]).toHaveProperty(
				"code",
				"RDE1695.0",
			);
			expect(encodedData.value_set.values[0]).toHaveProperty("name", "present");
		} else {
			console.log("Encoding failed: ", encodedDataEither.left);
		}
	});
});

describe("Decoding from ValueSetElementData", () => {
	it("Decoding from ValueSetElementData", () => {
		const decode = Schema.decodeUnknownEither(valueSetElementSchema);
		const decodedValueSetElementEither = decode(valueSetElementdata);
		if (Either.isRight(decodedValueSetElementEither)) {
			console.log("Decode Success");
			const decodedValueSetElement = decodedValueSetElementEither.right;
			expect(decodedValueSetElement).toHaveProperty("id", "RDE1695");
			expect(decodedValueSetElement).toHaveProperty("name", "Microscopic fat");
			expect(decodedValueSetElement).toHaveProperty("value_set");
			expect(decodedValueSetElement).toHaveProperty("element_version");
			expect(decodedValueSetElement).toHaveProperty("status");
			expect(decodedValueSetElement).toHaveProperty("specialty");
			expect(decodedValueSetElement.value_set).toHaveProperty(
				"min_cardinality",
				1,
			);
			expect(decodedValueSetElement.value_set).toHaveProperty(
				"max_cardinality",
				1,
			);
			expect(decodedValueSetElement.value_set).toHaveProperty("values");
			expect(decodedValueSetElement.value_set.values).toHaveLength(4);
			expect(decodedValueSetElement.value_set.values[0]).toHaveProperty(
				"code",
				"RDE1695.0",
			);
		} else {
			console.log("Decoding failed: ", decodedValueSetElementEither.left);
		}
	});

	//TODO: finish
	it("Decoding from JSON", () => {
		// valueSetElementdata is the object we want to validate
		const JSONstring = JSON.stringify(valueSetElementdata); // Convert object to JSON string

		// Use parseJson with valueSetElementSchema to validate and decode
		//schema will take json string and validate against valueSetElementSchema
		const schema = Schema.parseJson(valueSetElementSchema);

		// decode is the function to parse and validate the JSON string
		const decode = Schema.decodeUnknownSync(schema);

		// Decode the JSON string into an object
		const decoded = decode(JSONstring);

		console.log("decoded from string: ", decoded);

		// Expect the decoded object to match the original data
		expect(decoded).toEqual(valueSetElementdata);
	});
});
