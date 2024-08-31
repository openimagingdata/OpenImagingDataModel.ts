import { describe, it, expect } from "vitest";
import { JSONSchema, Schema } from "@effect/schema";
import { Either } from "effect";
import { CdeSet, cdeSetSchema, CdeSetType } from "../cdeSet.js";
import {
	Specialty,
	specialtyName,
	specialtyAbbreviations,
	specialtySchema,
	SpecialtyType,
} from "../common.js";

const cdeSetData = {
	id: "RDES3",
	name: "CAR/DS Adrenal Nodule",
	description: "ACR Assist project for describing adrenal nodules.",
	set_version: {
		number: 1,
		date: "2016-01-03",
	},
	schema_version: "1.0.0",
	status: {
		date: "2016-01-03",
		//name: "Proposed"
	},
	references: [
		{
			citation:
				"Sangwaiya MJ, Boland GW, Cronin CG et-al. Incidental adrenal lesions: accuracy of characterization with contrast-enhanced washout multidetector CT-10-minute delayed imaging protocol revisited in a large patient cohort. Radiology. 2010;256 (2): 504-10.",
			doi_url: "http://dx.doi.org/10.1148/radiol.10091386",
			pubmed_id: "20656838",
		},
		{
			citation:
				"Blake MA, Cronin CG, Boland GW. Adrenal imaging. AJR Am J Roentgenol. 2010;194 (6):1450-60.",
			doi_url: "http://dx.doi.org/10.2214/AJR.10.4547",
			pubmed_id: "20489083",
		},
	],
	history: [],
	contributors: {
		organizations: [
			{
				name: "American College of Radiology",
				abbreviation: "ACR",
			},
		],
		people: [
			{
				name: "Tarik Alkasab",
				//role: "Author",
				email: "talkasab@partners.org",
			},
			{
				name: "Marc Kohli",
				orcid_id: "0000-0003-3720-0156",
				email: "marc.kohli@ucsf.edu",
				//role: "Editor",
				affiliation: "UCSF",
			},
		],
	},
	specialties: [
		{
			name: specialtyName["Abdominal Radiology"],
			abbreviation: specialtyAbbreviations.AR,
		},
		{
			name: "Genitourinary Radiology",
			abbreviation: "GU",
		},
	],
	index_codes: [],
	elements: [
		{
			id: "RDE41",
			parent_set: "RDES3",
			name: "Nodule size",
			definition: "The greatest linear dimension of the adrenal nodule.",
			element_version: {
				number: 1,
				date: "2016-01-03",
			},
			schema_version: "1.0.0",
			status: {
				//name: "Proposed",
				date: "2016-01-03",
			},
			index_codes: [
				{
					system: "SNOMEDCT",
					code: "246120007",
					url: "http://snomed.info/sct",
					display: "nodule size",
				},
			],
			specialty: [
				{
					name: specialtyName["Abdominal Radiology"], //Enum not working
					abbreviation: specialtyAbbreviations.AR, //Enum not working
				},
				{
					name: specialtyName.Geriatrics,
					abbreviation: specialtyAbbreviations.GU,
				},
			],
			integer_value: {
				min: 0,
				max: 999,
				step: 1,
				unit: "mm",
			},
		},
		{
			id: "RDE42",
			parent_set: "RDES3",
			name: "Side",
			definition: "The side of the body (right or left)",
			element_version: {
				number: 1,
				date: "2016-01-03",
			},
			schema_version: "1.0.0",
			status: {
				date: "2016-01-03",
				//name: "Proposed"
			},
			value_set: {
				min_cardinality: 1,
				max_cardinality: 1,
				values: [
					{
						code: "RDE42.0",
						value: "R",
						name: "Right",
						index_codes: [
							{
								system: "RADLEX",
								code: "RID5828",
								url: "http://radlex.org/",
								display: "Right",
							},
							{
								system: "SNOMEDCT",
								code: "24028007",
								url: "http://snomed.info/sct",
								display: "Right",
							},
						],
					},
					{
						code: "RDE42.1",
						value: "L",
						name: "Left",
						index_codes: [
							{
								system: "RADLEX",
								code: "RID5824",
								url: "http://radlex.org/",
								display: "Left",
							},
							{
								system: "SNOMEDCT",
								code: "7771000",
								url: "http://snomed.info/sct",
								display: "Left",
							},
						],
					},
				],
			},
		},
	],
};

describe("cdeSetData", () => {
	it("should create a new cdeSet from cdeSetData", () => {
		const element = new CdeSet(cdeSetData);
	});
});
