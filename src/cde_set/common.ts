import { z } from "zod";
import { serializable } from "typesafe-class-serializer";

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
