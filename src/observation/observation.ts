import { Schema } from '@effect/schema';

// System Code Schema
export const systemCodeSchema = Schema.Struct({
  system: Schema.String,
  code: Schema.optional(Schema.String),
  display: Schema.optional(Schema.String),
});

// Codeable Concept Value Schema
export const codeableConceptValueSchema = Schema.Struct({
  code: Schema.Array(systemCodeSchema),
  value: Schema.NullOr(Schema.Array(systemCodeSchema)),
});

// String Value Schema
export const stringValueSchema = Schema.Struct({
  code: Schema.Array(systemCodeSchema),
  value: Schema.NullOr(Schema.String),
});

// Integer Value Schema
export const integerValueSchema = Schema.Struct({
  code: Schema.Array(systemCodeSchema),
  value: Schema.NullOr(Schema.Int), // Schema.Int ensures integers only
});

// Float Value Schema
export const floatValueSchema = Schema.Struct({
  code: Schema.Array(systemCodeSchema),
  value: Schema.NullOr(Schema.Number),
});

// Component Schema Union
export const componentSchema = Schema.Union(
  codeableConceptValueSchema,
  stringValueSchema,
  integerValueSchema,
  floatValueSchema,
);

// Observation Schema
export const observationSchema = Schema.Struct({
  resourceType: Schema.Literal('Observation'),
  id: Schema.optional(Schema.String),
  code: systemCodeSchema,
  bodySite: Schema.optional(
    Schema.Struct({
      code: systemCodeSchema,
    }),
  ),
  component: Schema.Array(componentSchema),
});

// Observation Function Params Schema
export const ObservationFunctionParams = Schema.Struct({
  resourceType: Schema.Literal('Observation'),
  id: Schema.optional(Schema.String),
  code: systemCodeSchema,
  bodySite: Schema.optional(
    Schema.Struct({
      code: Schema.optional(systemCodeSchema),
    }),
  ),
  component: Schema.Array(
    Schema.Struct({
      code: systemCodeSchema,
      value: Schema.NullOr(Schema.Union(Schema.String, Schema.Number)),
    }),
  ),
});

// Types from schemas
export type SystemCodeType = Schema.Schema.Type<typeof systemCodeSchema>;
export type CodeableConceptValueType = Schema.Schema.Type<
  typeof codeableConceptValueSchema
>;
export type StringValueType = Schema.Schema.Type<typeof stringValueSchema>;
export type IntegerValueType = Schema.Schema.Type<typeof integerValueSchema>;
export type FloatValueType = Schema.Schema.Type<typeof floatValueSchema>;
export type ComponentType = Schema.Schema.Type<typeof componentSchema>;
export type ObservationType = Schema.Schema.Type<typeof observationSchema>;
export type ObservationFunctionParamsType = Schema.Schema.Type<
  typeof ObservationFunctionParams
>;
