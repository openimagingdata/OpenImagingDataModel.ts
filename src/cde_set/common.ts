import { z } from "zod";

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

export type VersionDTO = z.infer<typeof versionSchema>;

export class Version implements VersionDTO {
	public number: number;
	public date: string;

	constructor(dto: VersionDTO) {
		dto = versionSchema.parse(dto);
		this.number = dto.number;
		this.date = dto.date;
	}

	public toDTO(): VersionDTO {
		return versionSchema.parse(this);
	}
}
