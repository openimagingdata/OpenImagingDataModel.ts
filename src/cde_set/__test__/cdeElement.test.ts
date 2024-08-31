import { describe, it, expect } from "vitest";
import { JSONSchema, Schema } from "@effect/schema";
import { Either } from "effect";
import {
	BaseElement,
	ValueSetElement,
	ValueSetElementType,
	valueSetElementSchema,
	CdElementFactory,
} from "../cde_element.js";
import { StatusOptions } from "../common.js";
import { encode } from "@effect/schema/Schema";
import { right } from "effect/Either";

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
		expect(element.valueSet).toHaveProperty("min_cardinality", 1);
		expect(element.valueSet).toHaveProperty("max_cardinality", 1);
		expect(element.valueSet.values).toHaveLength(4);
		expect(element.valueSet.values[0]).toHaveProperty("code", "RDE1695.0");
		expect(element.valueSet.values[0]).toHaveProperty("name", "present");
	});
});

describe("CdeElementFactory", () => {
	it("CdElementFactory should generate proper element subtype", () => {
		const element = CdElementFactory.create(valueSetElementdata);
		expect(element).toBeInstanceOf(BaseElement);
		expect(element).toBeInstanceOf(ValueSetElement);
	});
});

//Advantage of using encode function: encode allows you to specify how specific types should be serialized. For instance,
//a Date object can be transformed into an ISO string, or a number stored as a string can be converted to a proper number before serialization.
describe("Encoding to JSON from ValueSetElement", () => {
	it("Encoding to JSON from ValueSetElement", () => {
		const encodedData = Schema.encode(valueSetElementSchema)(
			valueSetElementdata,
		);
		const serialized = JSON.stringify(encodedData, null, 2);
		console.log(JSON.stringify(encodedData));
	});
});

//decodeUnknownEither takes a schema as input (in this case, valueSetElementSchema) and returns a decoder function.
//This decoder function will take an unknown input and return an Either type, which represents either a success (Right) or failure (Left).
//Type change: This decoder function will take an unknown input and return an Either type, which represents either a success (Right) or failure (Left).
describe("Decoding from ValueSetElementData", () => {
	it("Decoding from ValueSetElementData", () => {
		const decodeValueSetElement = Schema.decodeUnknownEither(
			valueSetElementSchema,
		);
		const result = decodeValueSetElement(valueSetElementdata);
		if (Either.isRight(result)) {
			console.log("Decode Success");
			console.log("Decoded data: ", result.right);
		} else {
			console.log("Decoding failed: ", result.left);
		}
	});
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

/*
What is my goal here?
Recieve JSON data and convert to ValueSetElement object?
Take ValueSetElement object and convert to JSON data for transmission
Use gpt to generate obj from text?

Encode allows you to specify how specific types should be serialized. For instance, 
a Date object can be transformed into an ISO string, or a number stored as a string can be converted to a proper number before serialization.

How decode works: 
**decodeUnknownEither takes a schema as input (in this case, valueSetElementSchema) and returns a decoder function.
Type change: This decoder function will take an unknown input and return an Either type, which represents either a success (Right) or failure (Left).

encode function would take attribues defined in the schema and change their type when encoding? 

*/
