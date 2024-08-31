import { JSONSchema, Schema } from "@effect/schema";

export enum specialtyAbbreviations {
	"AR",
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

export enum specialtyName {
	"Abdominal Radiology",
	"Allergy and Immunology",
	"Cardiology",
	"Critical Care Medicine",
	"Dermatology",
	"Emergency Medicine",
	"Endocrinology",
	"Gastroenterology",
	"Geriatrics",
	"Hematology",
	"Infectious Disease",
	"Medical Genetics",
	"Nephrology",
	"Obstetrics and Gynecology",
	"Oncology",
	"Otolaryngology",
	"Pediatrics",
	"Quality Improvement",
	"Radiology",
	"Vascular Medicine",
}

export const specialtySchema = Schema.Struct({
	abbreviation: Schema.Enums(specialtyAbbreviations),
	name: Schema.Enums(specialtyName),
});

export type SpecialtyType = Schema.Schema.Type<typeof specialtySchema>;

export class Specialty {
	public abbreviation: specialtyAbbreviations;
	public name: specialtyName;

	constructor(inData: SpecialtyType) {
		this.abbreviation = inData.abbreviation;
		this.name = inData.name;
	}

	getAbbreviation() {
		return this.abbreviation;
	}

	getName() {
		return this.name;
	}
}

export const versionSchema = Schema.Struct({
	number: Schema.Number,
	date: Schema.String.pipe(Schema.pattern(/^\d{4}-\d{2}-\d{2}$/)),
});

export type VersionType = Schema.Schema.Type<typeof versionSchema>;

class Version {
	public number: number;
	public date: string;

	constructor(inData: VersionType) {
		this.number = inData.number;
		this.date = inData.date;
	}
}

const versionJSONSchema = JSONSchema.make(versionSchema);

export const schemaVersionSchema = Schema.String.pipe(
	Schema.pattern(
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,
	),
);

type SchemaVersionType = Schema.Schema.Type<typeof schemaVersionSchema>;

export type StatusOptions = "Proposed" | "Published" | "Retired";

// Define a schema for the StatusOptions using string literals
const statusOptionsSchema = Schema.Union(
	Schema.Literal("Proposed"),
	Schema.Literal("Published"),
	Schema.Literal("Retired"),
);

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const statusSchema = Schema.Struct({
	date: Schema.String.pipe(Schema.pattern(datePattern)),
	name: Schema.optional(statusOptionsSchema),
});

const statusJSONSchema = JSONSchema.make(statusSchema);

export type StatusType = Schema.Schema.Type<typeof statusSchema>;

export class Status {
	public date: string;
	public name: StatusOptions | undefined;

	constructor(inData: StatusType) {
		this.date = inData.date;
		this.name = inData.name;
	}
}

export const eventSchema = Schema.Struct({
	date: Schema.String.pipe(Schema.pattern(datePattern)), // TODO: Add date format pattern
	status: statusSchema,
});

export type EventType = Schema.Schema.Type<typeof eventSchema>;

export class Event {
	public date: string;
	public status: StatusType;

	constructor(inData: EventType) {
		this.date = inData.date;
		this.status = inData.status;
	}
}

export type RoleOptions =
	| "author"
	| "sponsor"
	| "translator"
	| "reviewer"
	| "contributor";

const roleSchema = Schema.Union(
	Schema.Literal("author"),
	Schema.Literal("sponsor"),
	Schema.Literal("translator"),
	Schema.Literal("reviewer"),
	Schema.Literal("contributor"),
);

const organizationSchema = Schema.Struct({
	name: Schema.String,
	url: Schema.optional(Schema.String), //TODO: Validate URL???
	abbreviation: Schema.optional(Schema.String),
	comment: Schema.optional(Schema.String),
	role: Schema.optional(roleSchema),
});

export type OrganizationType = Schema.Schema.Type<typeof organizationSchema>;

export class Organization {
	public name: string;
	public url: string | undefined;
	public abbreviation: string | undefined;
	public comment: string | undefined;
	public role: RoleOptions | undefined;

	constructor(inData: OrganizationType) {
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
	role: Schema.optional(roleSchema),
});

export type PersonType = Schema.Schema.Type<typeof personSchema>;

export class Person {
	public name: string;
	public email: string;
	public affiliation: string | undefined;
	public orcidId: string | undefined;
	public url: string | undefined;
	public role: RoleOptions | undefined;

	constructor(inData: PersonType) {
		this.name = inData.name;
		this.email = inData.email;
		this.affiliation = inData.affiliation;
		this.orcidId = inData.orcidId;
		this.url = inData.url;
		this.role = inData.role;
	}
}

export const contributorsSchema = Schema.Struct({
	people: Schema.Array(personSchema),
	organizations: Schema.Array(organizationSchema),
});

export type ContributorsType = Schema.Schema.Type<typeof contributorsSchema>;

export class Contributors {
	public people: PersonType[];
	public organizations: OrganizationType[];

	constructor(inData: ContributorsType) {
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

export type IndexCodesType = Schema.Schema.Type<typeof indexCodesSchema>;

export class IndexCodes {
	public system: string;
	public code: string;
	public display: string;
	public url: string;

	constructor(inData: IndexCodesType) {
		this.system = inData.system;
		this.code = inData.code;
		this.display = inData.display;
		this.url = inData.url;
	}
}

export const referencesSchema = Schema.Struct({
	citation: Schema.String,
	doi_url: Schema.String, //TODO: Validate URL???
	pubmed_id: Schema.String,
});

export type ReferencesType = Schema.Schema.Type<typeof referencesSchema>;

export class References {
	public citation: string;
	public doiUrl: string;
	public pubmedId: string;

	constructor(inData: ReferencesType) {
		this.citation = inData.citation;
		this.doiUrl = inData.doi_url;
		this.pubmedId = inData.pubmed_id;
	}
}
