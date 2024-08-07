import { describe, it, expect } from "vitest";
import { JSONSchema, Schema } from "@effect/schema";
import {
	BaseElement,
	ValueSetElement,
	ValueSetElementType,
	valueSetElementSchema,
	CdElementFactory,
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
		const jsonData = JSON.stringify(valueSetElementdata);
		const elementJSONSchema = JSONSchema.make(valueSetElementSchema);
		//const encodedJson = Schema.encode(elementJSONSchema)(jsonData);
	});

	it("CdElementFactory", () => {
		const element = CdElementFactory.create(valueSetElementdata);
		expect(element).toBeInstanceOf(BaseElement);
		expect(element).toBeInstanceOf(ValueSetElement);
	});
});
