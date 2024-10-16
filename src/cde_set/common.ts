import { JSONSchema, Schema } from "@effect/schema";

export type specialtyAbbreviations =
	| "AR"
	| "AB"
	| "BR"
	| "CA"
	| "CH"
	| "ER"
	| "GI"
	| "GU"
	| "HN"
	| "IR"
	| "MI"
	| "MK"
	| "NR"
	| "OB"
	| "OI"
	| "OT"
	| "PD"
	| "QI"
	| "RS"
	| "VA";

export const specialtyAbbreviationsSchema = Schema.Union(
	Schema.Literal("AR"),
	Schema.Literal("AB"),
	Schema.Literal("BR"),
	Schema.Literal("CA"),
	Schema.Literal("CH"),
	Schema.Literal("ER"),
	Schema.Literal("GI"),
	Schema.Literal("GU"),
	Schema.Literal("HN"),
	Schema.Literal("IR"),
	Schema.Literal("MI"),
	Schema.Literal("MK"),
	Schema.Literal("NR"),
	Schema.Literal("OB"),
	Schema.Literal("OI"),
	Schema.Literal("OT"),
	Schema.Literal("PD"),
	Schema.Literal("QI"),
	Schema.Literal("RS"),
	Schema.Literal("VA"),
);

export type specialtyName =
	| "Abdominal Radiology"
	| "Allergy and Immunology"
	| "Cardiology"
	| "Critical Care Medicine"
	| "Dermatology"
	| "Emergency Medicine"
	| "Endocrinology"
	| "Genitourinary Radiology"
	| "Gastroenterology"
	| "Geriatrics"
	| "Hematology"
	| "Infectious Disease"
	| "Medical Genetics"
	| "Nephrology"
	| "Obstetrics and Gynecology"
	| "Oncology"
	| "Otolaryngology"
	| "Pediatrics"
	| "Quality Improvement"
	| "Radiology"
	| "Vascular Medicine";

const specialtyNameSchema = Schema.Union(
	Schema.Literal("Abdominal Radiology"),
	Schema.Literal("Allergy and Immunology"),
	Schema.Literal("Cardiology"),
	Schema.Literal("Critical Care Medicine"),
	Schema.Literal("Dermatology"),
	Schema.Literal("Emergency Medicine"),
	Schema.Literal("Genitourinary Radiology"),
	Schema.Literal("Endocrinology"),
	Schema.Literal("Gastroenterology"),
	Schema.Literal("Geriatrics"),
	Schema.Literal("Hematology"),
	Schema.Literal("Infectious Disease"),
	Schema.Literal("Medical Genetics"),
	Schema.Literal("Nephrology"),
	Schema.Literal("Obstetrics and Gynecology"),
	Schema.Literal("Oncology"),
	Schema.Literal("Otolaryngology"),
	Schema.Literal("Pediatrics"),
	Schema.Literal("Quality Improvement"),
	Schema.Literal("Radiology"),
	Schema.Literal("Vascular Medicine"),
);

export const specialtySchema = Schema.Struct({
	abbreviation: specialtyAbbreviationsSchema,
	name: specialtyNameSchema,
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

export class Version {
	readonly number: number;
	readonly date: string;

	constructor(number: number, date: string) {
		this.number = number;
		this.date = date;
	}
}

export const schemaVersionSchema = Schema.String.pipe(
	Schema.pattern(
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*))*))?(?:\+([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/i,
	),
);

export const setVersionSchema = Schema.Struct({
	number: Schema.Number,
	date: Schema.String, //Change to date
});

export type SetVersionType = Schema.Schema.Type<typeof setVersionSchema>;

export const setVersionJSONSchema = JSONSchema.make(setVersionSchema);

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

export type StatusType = Schema.Schema.Type<typeof statusSchema>;

export class Status {
	public date: string;
	public name: StatusOptions | undefined;

	constructor(date: string, name: StatusOptions) {
		this.date = date;
		this.name = name;
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
	| "Author"
	| "Sponsor"
	| "Translator"
	| "Reviewer"
	| "Contributor";

const roleSchema = Schema.Union(
	Schema.Literal("Author"),
	Schema.Literal("Sponsor"),
	Schema.Literal("Translator"),
	Schema.Literal("Reviewer"),
	Schema.Literal("Contributor"),
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
	public doi_url: string;
	public pubmed_id: string;

	constructor(inData: ReferencesType) {
		this.citation = inData.citation;
		this.doi_url = inData.doi_url;
		this.pubmed_id = inData.pubmed_id;
	}
}
