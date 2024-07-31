import { z } from "zod";
import {
	deserialize,
	serializable,
	serialize,
	validateWith,
} from "typesafe-class-serializer";
import { JSONSchema, Schema } from "@effect/schema";

enum specialtyOptions {
	"AB",
	"BR",
	"CA",
	"CH",
	"ER",
	"GI",
	"GU",
	"HN",
	"IR",
	"MI",
	"MK",
	"NR",
	"OB",
	"OI",
	"OT",
	"PD",
	"QI",
	"RS",
	"VA",
}

const specialty = Schema.Enums(specialtyOptions);

export const SPECIALTY_NAMES = {
	AB: "Abdominal",
	BR: "Breast",
	CA: "Cardiac",
	CH: "Chest",
	ER: "Emergency Radiology",
	GI: "Gastrointestinal",
	GU: "Genitourinary",
	HN: "Head and Neck",
	IR: "Interventional Radiology",
	MI: "Molecular Imaging",
	MK: "Musculoskeletal",
	NR: "Neuroradiology",
	OB: "Obstetrics/Gynecology",
	OI: "Oncologic Imaging",
	OT: "Other",
	PD: "Pediatric",
	QI: "Quality Improvement",
	RS: "Radiation Safety",
	VA: "Vascular",
} as const;

const versionSchema = Schema.Struct({
	number: Schema.Number,
	date: Schema.String.pipe(Schema.pattern(/^\d{4}-\d{2}-\d{2}$/)),
});

type versionType = Schema.Schema.Type<typeof versionSchema>;

class Version {
	public number: number;
	public date: string;

	constructor(inData: versionType) {
		this.number = inData.number;
		this.date = inData.date;
	}
}

const versionJSONSchema = JSONSchema.make(versionSchema);

const schemaVersionSchema = Schema.String.pipe(
	Schema.pattern(
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
	),
);

type SchemaVersion = Schema.Schema.Type<typeof schemaVersionSchema>;

enum statusOptions {
	"Proposed",
	"Published",
	"Retired",
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const statusSchema = Schema.Struct({
	date: Schema.String.pipe(Schema.pattern(datePattern)), //TODO Check regex matches correctly
	name: Schema.Enums(statusOptions),
});

const statusJSONSchema = JSONSchema.make(statusSchema);

type StatusType = Schema.Schema.Type<typeof statusSchema>;

export class Status {
	public date: string;
	public name: statusOptions;

	constructor(inData: StatusType) {
		this.date = inData.date;
		this.name = inData.name;
	}
}

export const eventSchema = Schema.Struct({
	date: Schema.String.pipe(Schema.pattern(datePattern)), // TODO: Add date format pattern
	status: statusSchema,
});

type eventType = Schema.Schema.Type<typeof eventSchema>;

export class Event {
	public date: string;
	public status: StatusType;

	constructor(inData: eventType) {
		this.date = inData.date;
		this.status = inData.status;
	}
}

enum roleOptions {
	"author",
	"sponsor",
	"translator",
	"reviewer",
	"contributor",
}

const organizationSchema = Schema.Struct({
	name: Schema.String,
	url: Schema.String, //TODO: Validate URL???
	abbreviation: Schema.optional(Schema.String),
	comment: Schema.optional(Schema.String),
	role: Schema.optional(Schema.Enums(roleOptions)),
});

type organizationType = Schema.Schema.Type<typeof organizationSchema>;

export class Organization {
	public name: string;
	public url: string;
	public abbreviation: string | undefined;
	public comment: string | undefined;
	public role: roleOptions | undefined;

	constructor(inData: organizationType) {
		this.name = inData.name;
		this.url = inData.url;
		this.abbreviation = inData.abbreviation;
		this.comment = inData.comment;
		this.role = inData.role;
	}
}

const personSchema = Schema.Struct({
	name: Schema.String,
	email: Schema.String, //No z.string().optional() equivalent in Schema
	affiliation: Schema.optional(Schema.String),
	orcidId: Schema.optional(Schema.String),
	url: Schema.optional(Schema.String),
	role: Schema.optional(Schema.Enums(roleOptions)),
});

type personType = Schema.Schema.Type<typeof personSchema>;

export class Person {
	public name: string;
	public email: string;
	public affiliation: string | undefined;
	public orcidId: string | undefined;
	public url: string | undefined;
	public role: roleOptions | undefined;

	constructor(inData: personType) {
		this.name = inData.name;
		this.email = inData.email;
		this.affiliation = inData.affiliation;
		this.orcidId = inData.orcidId;
		this.url = inData.url;
		this.role = inData.role;
	}
}

const contributorsSchema = Schema.Struct({
	people: Schema.Array(personSchema),
	organizations: Schema.Array(organizationSchema),
});

type contributorsType = Schema.Schema.Type<typeof contributorsSchema>;

export class Contributors {
	public people: personType[];
	public organizations: organizationType[];

	constructor(inData: contributorsType) {
		this.people = inData.people.map((person) => new Person(person));
		this.organizations = inData.organizations.map(
			(organization) => new Organization(organization),
		);
	}
}

export const indexCodesSchema = Schema.Struct({
	system: Schema.String, //TODO: ENUM?
	code: Schema.String, //TODO: add regex
	display: Schema.String,
	url: Schema.String,
});

type indexCodesType = Schema.Schema.Type<typeof indexCodesSchema>;

export class IndexCodes {
	public system: string;
	public code: string;
	public display: string;
	public url: string;

	constructor(inData: indexCodesType) {
		this.system = inData.system;
		this.code = inData.code;
		this.display = inData.display;
		this.url = inData.url;
	}
}

export const referencesSchema = Schema.Struct({
	citation: Schema.String,
	doiUrl: Schema.String, //TODO: Validate URL???
	pubmedId: Schema.Number,
});

type referencesType = Schema.Schema.Type<typeof referencesSchema>;

export class References {
	public citation: string;
	public doiUrl: string;
	public pubmedId: number;

	constructor(inData: referencesType) {
		this.citation = inData.citation;
		this.doiUrl = inData.doiUrl;
		this.pubmedId = inData.pubmedId;
	}
}
