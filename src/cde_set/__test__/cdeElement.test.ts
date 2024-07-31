import { describe, it, expect } from "vitest";
import { JSONSchema, Schema } from "@effect/schema";
import {
	BaseElement,
	ValueSetElement,
	ValueSetElementType,
	valueSetElementSchema,
} from "../cde_element.js";
import { statusOptions } from "../common.js";

const valueSetElementdata: ValueSetElementType = {
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
		name: statusOptions.Published, //TODO: Check if this is the correct way to use the enum
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

	it("should serialize a ValueSetElement", () => {
		const element = new ValueSetElement(valueSetElementdata);
		const encoded = Schema.encode(valueSetElementSchema)(valueSetElementdata);
		const elementJSONSchema = JSONSchema.make(valueSetElementSchema);
		const jsonData = JSON.stringify(valueSetElementdata);
		const encodedJson = Schema.encode(elementJSONSchema)(jsonData);
		//console.log(encoded);
	});
	/*

import { Schema, JSONSchema } from "@effect/schema";

const schema = Schema.Struct({
  id: Schema.String,
  value: Schema.Number,
});

const data = {
  id: "123",
  value: 42,
};

const encoded = Schema.encode(schema)(data); // Encodes `data` to fit `schema`
	it("should deserialize a ValueSetElement", () => {
		const element = new ValueSetElement(valueSetElementdata);
		const serialized = serialize(element);
		const deserialized = new ValueSetElement(serialized);
		expect(deserialized).toEqual(element);
		expect(deserialized).toBeInstanceOf(BaseElement);
		expect(deserialized).toBeInstanceOf(ValueSetElement);
		expect(deserialized.valueSet).toHaveProperty("min_cardinality", 1);
	});
*/
});
