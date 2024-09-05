import {
	versionSchema,
	contributorsSchema,
	eventSchema,
	specialtySchema,
	statusSchema,
	indexCodesSchema,
	referencesSchema,
	Event,
	Specialty,
	Contributors,
	References,
	IndexCodes,
	VersionType,
	StatusType,
	EventType,
	OrganizationType,
	PersonType,
	ContributorsType,
	IndexCodesType,
	ReferencesType,
	SpecialtyType,
} from "./common.js";

import { JSONSchema, Schema } from "@effect/schema";
import { Either } from "effect";

export const cdElementBaseSchema = Schema.Struct({
	id: Schema.String,
	parent_set: Schema.String,
	name: Schema.String,
	definition: Schema.optional(Schema.String),
	element_version: versionSchema,
	schema_version: Schema.String,
	status: statusSchema,
	question: Schema.optional(Schema.String),
	index_codes: Schema.optional(Schema.Array(indexCodesSchema)),
	contributors: Schema.optional(contributorsSchema),
	specialty: Schema.optional(Schema.Array(specialtySchema)),
	history: Schema.optional(Schema.Array(eventSchema)),
	references: Schema.optional(Schema.Array(referencesSchema)),
});

export type cdElementBaseType = Schema.Schema.Type<typeof cdElementBaseSchema>;

export class BaseElement {
	public id: string;
	public parent_set: string;
	public name: string;
	public definition: string | undefined;
	public elementVersion: VersionType;
	public schemaVersion: string;
	public status: StatusType;
	public question: string | undefined;
	public indexCodes: IndexCodesType[] | undefined;
	public contributors: ContributorsType | undefined;
	public specialty: SpecialtyType[] | undefined;
	public history: EventType[] | undefined;
	public references: ReferencesType[] | undefined;

	constructor(inData: cdElementBaseType) {
		this.id = inData.id;
		this.parent_set = inData.parent_set;
		this.name = inData.name;
		this.definition = inData.definition;
		this.elementVersion = inData.element_version;
		this.schemaVersion = inData.schema_version;
		this.status = inData.status;
		this.question = inData.question;
		this.indexCodes =
			inData.index_codes?.map((indexCode) => new IndexCodes(indexCode)) ??
			undefined;
		this.contributors = inData.contributors
			? new Contributors(inData.contributors)
			: undefined;
		this.specialty =
			inData.specialty?.map((specialty) => new Specialty(specialty)) ??
			undefined;
		this.history =
			inData.history?.map((event) => new Event(event)) ?? undefined;
		this.references =
			inData.references?.map((reference) => new References(reference)) ??
			undefined;
	}
}

export const valueSetValueSchema = Schema.Struct({
	code: Schema.String, //TODO: make regex to follow structure ex: "RDE1695.0"?
	value: Schema.optional(Schema.String),
	name: Schema.String, //Enum?
	definition: Schema.optional(Schema.String),
	index_codes: Schema.optional(Schema.Array(indexCodesSchema)),
});

export type ValueSetValueType = Schema.Schema.Type<typeof valueSetValueSchema>;

export class ValueSetValue {
	public code: string;
	public name: string;
	public definition: string | undefined;
	public value: string | undefined;
	public indexCodes: IndexCodesType[] | undefined;

	constructor(inData: ValueSetValueType) {
		this.code = inData.code;
		this.name = inData.name;
		this.value = inData.value;
		this.definition = inData.definition;
		this.indexCodes =
			inData.index_codes?.map((indexCode) => new IndexCodes(indexCode)) ??
			undefined;
	}
}

//effects-ts schemas do not have a .extend method, so we have to redefine the schema?
export const valueSetSchema = Schema.Struct({
	min_cardinality: Schema.Number,
	max_cardinality: Schema.Number,
	values: Schema.Array(valueSetValueSchema),
});

export type ValueSetType = Schema.Schema.Type<typeof valueSetSchema>;

export class ValueSet {
	public minCardinality: number;
	public maxCardinality: number;
	public values: ValueSetValueType[];

	constructor(inData: ValueSetType) {
		this.minCardinality = inData.min_cardinality;
		this.maxCardinality = inData.max_cardinality;
		this.values = inData.values.map((value) => new ValueSetValue(value));
	}
}

export const valueSetElementSchema = Schema.Struct({
	...cdElementBaseSchema.fields,
	value_set: valueSetSchema,
});

export type ValueSetElementType = Schema.Schema.Type<
	typeof valueSetElementSchema
>;

export class ValueSetElement extends BaseElement {
	private _data: ValueSetElementType;
	public value_set: ValueSetType;

	constructor(inData: ValueSetElementType) {
		super(inData);
		this._data = { ...inData };
		this.value_set = inData.value_set;
	}

	get valueSet() {
		return this._data.value_set;
	}
}

export const integerValueSchema = Schema.Struct({
	min_value: Schema.optional(Schema.Number),
	max_value: Schema.optional(Schema.Number),
	step: Schema.optional(Schema.Number),
	unit: Schema.optional(Schema.String),
});

export type IntegerValueType = Schema.Schema.Type<typeof integerValueSchema>;

export const integerElementSchema = Schema.Struct({
	...cdElementBaseSchema.fields,
	integer_value: integerValueSchema,
});

export type IntegerElementType = Schema.Schema.Type<
	typeof integerElementSchema
>;

export class IntegerElement extends BaseElement {
	public integerValue: IntegerValueType;

	constructor(inData: IntegerElementType) {
		super(inData);
		this.integerValue = inData.integer_value;
	}
}

export const floatValueSchema = Schema.Struct({
	min_value: Schema.optional(Schema.Number),
	max_value: Schema.optional(Schema.Number),
	step: Schema.optional(Schema.Number),
	unit: Schema.optional(Schema.String),
});

export type FloatValueType = Schema.Schema.Type<typeof floatValueSchema>;

export const floatElementSchema = Schema.Struct({
	...cdElementBaseSchema.fields,
	float_value: floatValueSchema,
});

export type FloatElementType = Schema.Schema.Type<typeof floatElementSchema>;

export class FloatElement extends BaseElement {
	public floatValue: FloatValueType;

	constructor(inData: FloatElementType) {
		super(inData);
		this.floatValue = inData.float_value;
	}
}

//NEED BooleanElement

export const booleanElementSchema = Schema.Struct({
	...cdElementBaseSchema.fields,
	boolean_value: Schema.String,
});

export type BooleanElementType = Schema.Schema.Type<
	typeof booleanElementSchema
>;

export class BooleanElement extends BaseElement {
	public booleanValue: string;

	constructor(inData: BooleanElementType) {
		super(inData);
		this.booleanValue = inData.boolean_value;
	}
}

export const elementUnionSchema = Schema.Union(
	valueSetElementSchema,
	integerElementSchema,
	floatElementSchema,
	booleanElementSchema,
);

export type ElementType = Schema.Schema.Type<typeof elementUnionSchema>;

export class CdElementFactory {
	// Static factory method to create the right subclass of CdElement
	static create(
		inData: unknown, //TODO: Cant have this be BaseElement type????
	): ValueSetElement | IntegerElement | FloatElement | BooleanElement | null {
		// Decode the input data using the base schema
		const baseResult = Schema.decodeUnknownEither(elementUnionSchema)(inData);

		if (Either.isLeft(baseResult)) {
			console.error("Base schema validation error:", baseResult.left);
			throw new Error("Invalid element data");
		}

		const baseData = baseResult.right;

		if ("value_set" in baseData) {
			const valueSetResult = Schema.decodeUnknownEither(valueSetElementSchema)(
				inData,
			);
			if (Either.isRight(valueSetResult)) {
				return new ValueSetElement(valueSetResult.right);
			} else {
				console.error(
					"ValueSetElement schema validation error:",
					valueSetResult.left,
				);
			}
		} else if ("integer_value" in baseData) {
			const integerResult =
				Schema.decodeUnknownEither(integerElementSchema)(inData);
			if (Either.isRight(integerResult)) {
				return new IntegerElement(integerResult.right);
			} else {
				console.error(
					"IntegerElement schema validation error:",
					integerResult.left,
				);
			}
		} else if ("float_value" in baseData) {
			const floatResult =
				Schema.decodeUnknownEither(floatElementSchema)(inData);
			if (Either.isRight(floatResult)) {
				return new FloatElement(floatResult.right);
			} else {
				console.error(
					"IntegerElement schema validation error:",
					floatResult.left,
				);
			}
		} else if ("boolean_value" in baseData) {
			const booleanResult =
				Schema.decodeUnknownEither(booleanElementSchema)(inData);
			if (Either.isRight(booleanResult)) {
				return new BooleanElement(booleanResult.right);
			} else {
				console.error(
					"IntegerElement schema validation error:",
					booleanResult.left,
				);
			}
		} else {
			console.error("Unknown element type:", baseData);
		}

		return null;
	}
}
