import { z } from "zod";
import {
	versionSchema,
	contributorsSchema,
	eventSchema,
	specialtySchema,
	statusSchema,
	indexCodesSchema,
	referencesSchema,
	Event,
	Contributors,
	References,
	IndexCodes,
	Status,
	Specialty,
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

	references: z.array(referencesSchema).optional(), //TODO: Add referencesSchema to common?
});

export type cdeElementBase = z.infer<typeof cdeElementBaseSchema>;
type version = z.infer<typeof versionSchema>;
type status = z.infer<typeof statusSchema>;

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
	accessor status: status;

	@serializable("indexCodes", {
		doSerialize: (indexCodes: IndexCodes[] | undefined) =>
			indexCodes?.map((indexCode) => serialize(indexCode)),
		doDeserialize: (indexCodes: unknown[] | undefined) =>
			indexCodes?.map((indexCode) =>
				deserialize(indexCode as IndexCodes, IndexCodes),
			),
	})
	accessor indexCodes: IndexCodes[] | undefined;

	@serializable("contributors", {
		doSerialize: (contributors: Contributors | undefined) =>
			contributors ? serialize(contributors) : undefined,
		doDeserialize: (contributors: unknown | undefined) =>
			contributors
				? deserialize(contributors as Contributors, Contributors)
				: undefined,
	})
	contributors?: Contributors | undefined;

	@serializable("specialty", {
		//Returning an array of serializedProperties instead of array of strings
		doSerialize: (specialty: Specialty[] | undefined) =>
			specialty?.map((s) => serialize(s)),
		doDeserialize: (specialty: string[] | undefined) =>
			specialty?.map((s) => s as Specialty),
	})
	accessor specialty: Specialty[] | undefined;

	@serializable("history", {
		doSerialize: (history: Event[] | undefined) =>
			history?.map((event) => serialize(event)),
		doDeserialize: (history: unknown[] | undefined) =>
			history?.map((event) => deserialize(event as Event, Event)),
	})
	accessor history: Event[] | undefined;

	@serializable("references", {
		doSerialize: (references: References[] | undefined) =>
			references?.map((reference) => serialize(reference)),
		doDeserialize: (references: unknown[] | undefined) =>
			references?.map((reference) =>
				deserialize(reference as References, References),
			),
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
		// params: z.infer<typeof cdeElementBaseSchema> doesnt have SCHEMA property, its an additional property in the class
		this.indexCodes =
			params.indexCodes?.map((indexCode) => new IndexCodes(indexCode)) ??
			undefined;
		this.contributors = params.contributors
			? new Contributors(params.contributors)
			: undefined;
		this.specialty =
			params.specialty?.map((specialty) => new Specialty(specialty)) ??
			undefined;
		this.history =
			params.history?.map((event) => new Event(event)) ?? undefined;
	}

	stripSchema = (obj: any) => {
		const { SCHEMA, ...rest } = obj;
		return rest;
	};
}
