import { z } from "zod";
import {
	deserialize,
	serializable,
	serialize,
	validateWith,
} from "typesafe-class-serializer";

const specialtySchema = z.enum([
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

export type Specialty = z.infer<typeof specialtySchema>;

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

const versionSchema = z.object({
	number: z.number().int(),
	date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export class Version {
	public readonly SCHEMA = versionSchema;

	@serializable("number")
	accessor number: number;

	@validateWith(versionSchema.shape.date)
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

const statusSchema = z.object({
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

const eventSchema = z.object({
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

const contributorsSchema = z.object({
	people: z.array(z.instanceof(Person)),
	organizations: z.array(z.instanceof(Organization)),
});

export class Contributors {
	public readonly SCHEMA = contributorsSchema;

	@serializable("people", {
		doSerialize: (people) => people.map((person) => serialize(person)),
		doDeserialize: (people) =>
			people.map((person) => deserialize(person, Person)),
	})
	accessor people: Person[];

	@serializable("organizations", {
		doSerialize: (organizations) =>
			organizations.map((organization) => serialize(organization)),
		doDeserialize: (organizations) =>
			organizations.map((organization) =>
				deserialize(organization, Organization),
			),
	})
	accessor organizations: Organization[];

	constructor(params: z.infer<typeof contributorsSchema>) {
		this.people = params.people;
		this.organizations = params.organizations;
	}
}
