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
} from "./common.js";
import {
	deserialize,
	serializable,
	serialize,
} from "typesafe-class-serializer";

//Want cdElement or cdeElement?
export const cdeElementBaseSchema = z.object({
	id: z.string(),
	parent_set: z.string(), //TODO add regex
	name: z.string(),
	definition: z.string().optional(),
	question: z.string().optional(),
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
type version = z.infer<typeof versionSchema>;
type status = z.infer<typeof statusSchema>;

export class BaseElement {
	public readonly SCHEMA = cdeElementBaseSchema;

	@serializable("id")
	accessor id: string;

	@serializable("parent_set")
	accessor parent_set: string;

	@serializable("name")
	accessor name: string;

	@serializable("definition")
	accessor definition: string | undefined;

	@serializable("element_version")
	accessor elementVersion: version;

	@serializable("schema_version")
	accessor schemaVersion: string;

	@serializable("status")
	accessor status: status;

	@serializable("question")
	accessor question: string | undefined;

	@serializable("index_codes", {
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

	accessor specialty: string[] | undefined;

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
		this.elementVersion = params.element_version;
		this.schemaVersion = params.schema_version;
		this.status = params.status;
		this.question = params.question;
		// params: z.infer<typeof cdeElementBaseSchema> doesnt have SCHEMA property, its an additional property in the class
		this.indexCodes =
			params.index_codes?.map((indexCode) => new IndexCodes(indexCode)) ??
			undefined;
		this.contributors = params.contributors
			? new Contributors(params.contributors)
			: undefined;
		this.specialty = this.specialty = params.specialty;
		this.history =
			params.history?.map((event) => new Event(event)) ?? undefined;
	}
}

const valueSetValueSchema = z.object({
	code: z.string(), //TODO: make regex to follow structure: "RDE1695.0"?
	name: z.string(), //Enum?
});

class ValueSetValue {
	public readonly SCHEMA = valueSetValueSchema;

	@serializable("code")
	accessor code: string;

	@serializable("name")
	accessor name: string;

	constructor(params: z.infer<typeof valueSetValueSchema>) {
		this.code = params.code;
		this.name = params.name;
	}
}

const valueSetSchema = z.object({
	min_cardinality: z.number(),
	max_cardinality: z.number(),
	values: z.array(valueSetValueSchema),
});

class ValueSet {
	public readonly SCHEMA = valueSetSchema;

	@serializable("min_cardinality")
	accessor min_cardinality: number;

	@serializable("max_cardinality")
	accessor max_cardinality: number;

	@serializable("values", {
		doSerialize: (values: ValueSetValue[]) =>
			values.map((value) => serialize(value)),
		doDeserialize: (values: unknown[]) =>
			values.map((value) => deserialize(value as ValueSetValue, ValueSetValue)),
	})
	accessor values: ValueSetValue[];

	constructor(params: z.infer<typeof valueSetSchema>) {
		this.min_cardinality = params.min_cardinality;
		this.max_cardinality = params.max_cardinality;
		this.values = params.values.map((value) => new ValueSetValue(value));
	}
}

export const valueSetElementSchema = cdeElementBaseSchema.extend({
	value_set: valueSetSchema,
});

export type ValueSetElementData = z.infer<typeof valueSetElementSchema>;

export class ValueSetElement extends BaseElement {
	public readonly SCHEMA = valueSetElementSchema;

	@serializable("value_set", {
		doSerialize: (valueSet: ValueSet) => serialize(valueSet),
		doDeserialize: (valueSet: unknown) =>
			deserialize(valueSet as ValueSet, ValueSet),
	})
	accessor valueSet: ValueSet;

	constructor(params: z.infer<typeof valueSetElementSchema>) {
		super(params);
		this.valueSet = new ValueSet(params.value_set);
	}
}
