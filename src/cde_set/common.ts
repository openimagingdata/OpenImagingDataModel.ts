import { z } from "zod";
import {
	deserialize,
	serializable,
	serialize,
	validateWith,
} from "typesafe-class-serializer";
import { JSONSchema, Schema } from "@effect/schema";

export const specialtySchema = z.enum([
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
]);

export type SpecialtyNames = z.infer<typeof specialtySchema>;

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

export const versionSchema = z.object({
	number: z.number().int(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const versionSchemaEffect = Schema.Struct({
	number: Schema.Number,
	date: Schema.String.pipe(Schema.pattern(/^\d{4}-\d{2}-\d{2}$/)),
});

type versionType = Schema.Schema.Type<typeof versionSchemaEffect>;

class VersionEffect {
	public number: number;
	public date: string;

	constructor(inData: versionType) {
		this.number = inData.number;
		this.date = inData.date;
	}
}

const versionJSONSchema = JSONSchema.make(versionSchemaEffect);

export class Version {
	public readonly SCHEMA = versionSchema;

	@serializable("number")
	accessor number: number;

	@serializable("date")
	accessor date: string;

	constructor(params: z.infer<typeof versionSchema>) {
		this.number = params.number;
		this.date = params.date;
	}
}

const schemaVersionSchema = z
	.string()
	.regex(
		/^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$/,
	);

export type SchemaVersion = z.infer<typeof schemaVersionSchema>;

export const statusSchema = z.object({
	date: z.string(), // TODO: Add date formatting
	name: z.enum(["Proposed", "Published", "Retired"]),
});

export class Status {
	public readonly SCHEMA = statusSchema;

	@validateWith(statusSchema.shape.date)
	@serializable("date")
	accessor date: z.infer<typeof statusSchema.shape.date>;

	@serializable("name")
	accessor name: z.infer<typeof statusSchema.shape.name>;

	constructor(params: z.infer<typeof statusSchema>) {
		this.date = params.date;
		this.name = params.name;
	}
}

export const eventSchema = z.object({
	date: z.string(), // TODO: Add date format pattern
	status: z.instanceof(Status),
});

export class Event {
	public readonly SCHEMA = eventSchema;

	@serializable("date")
	accessor date: z.infer<typeof eventSchema.shape.date>;

	@serializable("status", Status)
	accessor status: Status;

	constructor(params: z.infer<typeof eventSchema>) {
		this.date = params.date;
		this.status = params.status;
	}
}

const organizationSchema = z.object({
	name: z.string(),
	url: z.string().url().optional(),
	abbreviation: z.string().optional(),
	comment: z.string().optional(),
	role: z
		.enum(["author", "sponsor", "translator", "reviewer", "contributor"])
		.optional(),
});

export class Organization {
	public readonly SCHEMA = organizationSchema;

	@serializable("name")
	accessor name: string;

	@validateWith(organizationSchema.shape.url)
	@serializable("url")
	accessor url: string | undefined;

	@serializable("abbreviation")
	accessor abbreviation: string | undefined;

	@serializable("comment")
	accessor comment: string | undefined;

	@serializable("role")
	accessor role: z.infer<typeof organizationSchema.shape.role>;

	constructor(params: z.infer<typeof organizationSchema>) {
		this.name = params.name;
		this.url = params.url;
		this.abbreviation = params.abbreviation;
		this.comment = params.comment;
		this.role = params.role;
	}
}

const personSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	affiliation: z.string().optional(),
	orcidId: z.string().optional(),
	url: z.string().url().optional(),
	role: z.enum(["Author", "Editor", "Translator", "Reviewer"]).optional(),
});

export class Person {
	public readonly SCHEMA = personSchema;

	@serializable("name")
	accessor name: string;

	@validateWith(personSchema.shape.email)
	@serializable("email")
	accessor email: string;

	@serializable("affiliation")
	accessor affiliation: string | undefined;

	@serializable("orcidId")
	accessor orcidId: string | undefined;

	@validateWith(personSchema.shape.url)
	@serializable("url")
	accessor url: string | undefined;

	@serializable("role")
	accessor role: z.infer<typeof personSchema.shape.role>;

	constructor(params: z.infer<typeof personSchema>) {
		this.name = params.name;
		this.email = params.email;
		this.affiliation = params.affiliation;
		this.orcidId = params.orcidId;
		this.url = params.url;
		this.role = params.role;
	}
}

export const contributorsSchema = z.object({
	people: z.array(z.instanceof(Person)),
	organizations: z.array(z.instanceof(Organization)),
});

export class Contributors {
	public readonly SCHEMA = contributorsSchema;

	@serializable("people", {
		doSerialize: (people: Person[]) =>
			people.map((person) => serialize(person)),
		doDeserialize: (people: unknown[]) =>
			people.map((person) => deserialize(person as Person, Person)),
	})
	accessor people: Person[];

	@serializable("organizations", {
		doSerialize: (organizations: Organization[]) =>
			organizations.map((organization) => serialize(organization)),
		doDeserialize: (organizations: unknown[]) =>
			organizations.map((organization) =>
				deserialize(organization as Organization, Organization),
			),
	})
	accessor organizations: Organization[];

	constructor(params: z.infer<typeof contributorsSchema>) {
		this.people = params.people;
		this.organizations = params.organizations;
	}
}

export const indexCodesSchema = z.object({
	system: z.string(), //TODO: ENUM?
	code: z.string(), //TODO: add regex
	display: z.string(),
	url: z.string().url(),
});

export class IndexCodes {
	public readonly SCHEMA = indexCodesSchema;

	@serializable("system")
	accessor system: string;

	@serializable("code")
	accessor code: string;

	@serializable("display")
	accessor display: string;

	@serializable("url")
	accessor url: string;

	constructor(params: z.infer<typeof indexCodesSchema>) {
		//TODO: Want these or | undefined?
		this.system = params.system;
		this.code = params.code;
		this.display = params.display;
		this.url = params.url;
	}
}

export const referencesSchema = z.object({
	citation: z.string(),
	doiUrl: z.string().url(),
	pubmedId: z.number(),
});

export class References {
	public readonly SCHEMA = referencesSchema;

	@serializable("citation")
	accessor citation: string;

	@serializable("doiUrl")
	accessor doiUrl: string;

	@serializable("pubmedId")
	accessor pubmedId: number;

	constructor(params: z.infer<typeof referencesSchema>) {
		this.citation = params.citation;
		this.doiUrl = params.doiUrl;
		this.pubmedId = params.pubmedId;
	}
}
