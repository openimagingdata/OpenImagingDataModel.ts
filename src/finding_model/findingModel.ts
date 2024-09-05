import { Schema } from "@effect/schema";

const attributeTypeSchema = Schema.Union(
	Schema.Literal("choice"),
	Schema.Literal("numeric"),
);

// ChoiceValue model
const choiceValueSchema = Schema.Struct({
	name: Schema.String,
	description: Schema.optional(Schema.String),
});

// ChoiceAttribute model
export const choiceAttributeSchema = Schema.Struct({
	name: Schema.String,
	description: Schema.optional(Schema.String),
	type: Schema.Literal("choice"),
	values: Schema.Array(choiceValueSchema),
});

// NumericAttribute model
export const numericAttributeSchema = Schema.Struct({
	name: Schema.String,
	description: Schema.optional(Schema.String),
	type: Schema.Literal("numeric"),
	minimum: Schema.optional(Schema.Number),
	maximum: Schema.optional(Schema.Number),
	unit: Schema.optional(Schema.String),
});

export const attributeSchema = Schema.Union(
	choiceAttributeSchema,
	numericAttributeSchema,
);

// FindingModel schema
export const findingModelSchema = Schema.Struct({
	finding_name: Schema.String,
	description: Schema.String,
	attributes: Schema.Array(attributeSchema), //This needs to be a union of choice and numeric not attruibuteTypeSchema
});

// Types from schemas
export type ChoiceValue = Schema.Schema.Type<typeof choiceValueSchema>;
export type ChoiceAttribute = Schema.Schema.Type<typeof choiceAttributeSchema>;
export type NumericAttribute = Schema.Schema.Type<
	typeof numericAttributeSchema
>;
export type Attribute = Schema.Schema.Type<typeof attributeSchema>;
export type FindingModel = Schema.Schema.Type<typeof findingModelSchema>;
