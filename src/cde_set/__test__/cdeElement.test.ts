import { describe, it, expect } from "vitest";
import {
	cdeElementBaseSchema,
	BaseElement,
	ValueSetElement,
} from "../cde_element.js";

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
		name: "Published",
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
	});

	it("should serialize and deserialize a ValueSetElement", () => {
		const element = new ValueSetElement(valueSetElementdata);
		const serializedElement = element.serialize();
		const deserializedElement = ValueSetElement.deserialize(serializedElement);
		expect(deserializedElement).toEqual(element);
	});
});
