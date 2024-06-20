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
	element_version: versionSchema,
	schema_version: z.string(), //TODO: Add regex
	status: statusSchema,
	index_codes: z.array(indexCodesSchema).optional(),
	contributors: contributorsSchema.optional(),
	history: z.array(eventSchema).optional(),
	specialty: z.array(specialtySchema).optional(),
	references: z.array(referencesSchema).optional(), //TODO: Add referencesSchema to common?
});

export type cdeElementBase = z.infer<typeof cdeElementBaseSchema>;

class CdElement {
	public readonly SCHEMA = cdeElementBaseSchema;

	@serializable("id")
	accessor id: string;

	constructor(params: z.infer<typeof cdeElementBaseSchema>) {
		this.id = params.id;
	}
}
