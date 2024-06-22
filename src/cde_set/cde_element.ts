import { z } from "zod";
import {
	versionSchema,
	contributorsSchema,
	eventSchema,
	specialtySchema,
	statusSchema,
	indexCodesSchema,
	referencesSchema,
} from "./common.js";
import {
	deserialize,
	serializable,
	serialize,
	validateWith,
} from "typesafe-class-serializer";

//Want cdElement or cdeElement?
export const cdeElementBaseSchema = z.object({
	id: z.string(),
	parent_set: z.string(), //TODO add regex
	name: z.string(),
	definition: z.string().optional(),
	elementVersion: versionSchema,
	schemaVersion: z.string(), //TODO: Add regex
	status: statusSchema,
	indexCodes: z.array(indexCodesSchema).optional(),
	contributors: contributorsSchema.optional(),
	history: z.array(eventSchema).optional(),
	specialty: z.array(specialtySchema).optional(),
	references: z.array(referencesSchema).optional(), //TODO: Add referencesSchema to common?
});

export type cdeElementBase = z.infer<typeof cdeElementBaseSchema>;
type version = z.infer<typeof versionSchema>;
type Status = z.infer<typeof statusSchema>;
type IndexCodes = z.infer<typeof indexCodesSchema>;
type Contributors = z.infer<typeof contributorsSchema>;
type Event = z.infer<typeof eventSchema>;
//type Specialty = z.infer<typeof specialtySchema>;
//export type Specialty = z.infer<typeof specialtySchema> --> not working properly
type Specialty =
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
type References = z.infer<typeof referencesSchema>;

class CdElement {
	public readonly SCHEMA = cdeElementBaseSchema;

	@serializable("id")
	accessor id: string;

	@serializable("parent_set")
	accessor parent_set: string;

	@serializable("name")
	accessor name: string;

	@serializable("definition")
	accessor definition: string | undefined;

	@serializable("elementVersion")
	accessor elementVersion: version;

	@serializable("schemaVersion")
	accessor schemaVersion: string;

	@serializable("status")
	accessor status: Status;

	@serializable("indexCodes", {
		doSerialize: (indexCodes: IndexCodes[] | undefined) =>
			indexCodes?.map((indexCode) => ({
				code: indexCode.code,
				system: indexCode.system,
				display: indexCode.display,
				url: indexCode.url,
			})),
		doDeserialize: (indexCodes: IndexCodes[] | undefined) =>
			indexCodes?.map((indexCode) => ({
				code: indexCode.code,
				system: indexCode.system,
				display: indexCode.display,
				url: indexCode.url,
			})),
	})
	accessor indexCodes:
		| { code: string; url: string; system: string; display: string }[]
		| undefined;

	@serializable("contributors")
	accessor contributors: Contributors | undefined;

	@serializable("specialty", {
		doSerialize: (specialty: Specialty[] | undefined) =>
			specialty?.map((s) => s as Specialty),
		doDeserialize: (specialty: string[] | undefined) =>
			specialty?.map((s) => s as Specialty),
	})
	accessor specialty: Specialty[] | undefined;

	@serializable("history", {
		doSerialize: (history: Event[] | undefined) =>
			history?.map((event) => event as Event),
		doDeserialize: (history: Event[] | undefined) =>
			history?.map((event) => event as Event),
	})
	accessor history: Event[] | undefined;

	@serializable("references", {
		doSerialize: (references: References[] | undefined) =>
			references?.map((references) => references as References),
		doDeserialize: (references: References[] | undefined) =>
			references?.map((references) => references as References),
	})
	accessor references: References[] | undefined;

	constructor(params: z.infer<typeof cdeElementBaseSchema>) {
		this.id = params.id;
		this.parent_set = params.parent_set;
		this.name = params.name;
		this.definition = params.definition;
		this.elementVersion = params.elementVersion;
		this.schemaVersion = params.schemaVersion;
		this.status = params.status;
		this.indexCodes = params.indexCodes;
		this.contributors = params.contributors;
		this.specialty = params.specialty;
		this.history = params.history;
		this.references = params.references;
	}
}
