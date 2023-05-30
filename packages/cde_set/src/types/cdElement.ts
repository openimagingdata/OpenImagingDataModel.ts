import { z } from 'zod';

import { indexCodeSchema } from './indexCode';

export const baseElementSchema = z.object({
  id: z.string(),
  parent_id: z.number(),
  name: z.string(),
  definition: z.string(),
  question: z.string(),
  index_codes: z.array(indexCodeSchema),
});

export const valueSetValueSchema = z.object({
  value: z.string(),
  name: z.string(),
  definition: z.string().optional(),
});

export const valueSetElementSchema = baseElementSchema.extend({
  value_set: z.object({
    cardinality: z.object({
      min_cardinality: z.number(),
      max_cardinality: z.number(),
    }),
    value_type: z.literal('valueSet'),
    values: z.array(valueSetValueSchema),
  }),
});

export const floatElementSchema = baseElementSchema.extend({
  float_values: z.object({
    value_min_max: z.object({
      value_min: z.number().optional(),
      value_max: z.number().optional(),
    }),
    step_value: z.number().optional(),
    unit: z.string(),
    value_type: z.literal('float'),
  }),
});

export const integerElementSchema = baseElementSchema.extend({
  integer_values: z.object({
    value_min_max: z.object({
      value_min: z.number().optional(),
      value_max: z.number().optional(),
    }),
    step_value: z.number().optional(),
    unit: z.string(),
    value_type: z.literal('integer'),
  }),
});

export const booleanElementSchema = baseElementSchema.extend({
  boolean_values: z.object({
    value_type: z.literal('boolean'),
  }),
});

export const elementSchema = z.union([
  floatElementSchema,
  valueSetElementSchema,
  integerElementSchema,
  booleanElementSchema,
]);

export type FloatElementData = z.infer<typeof floatElementSchema>;
export type ValueSetElementData = z.infer<typeof valueSetElementSchema>;
export type ValueSetValue = z.infer<typeof valueSetValueSchema>;
export type IntegerElementData = z.infer<typeof integerElementSchema>;
export type BooleanElementData = z.infer<typeof booleanElementSchema>;
export type ElementData = z.infer<typeof elementSchema>;

export class CdElement<T extends ElementData = ElementData> {
  protected _data: T;

  constructor(baseElementData: T) {
    this._data = { ...baseElementData };
  }

  get id() {
    return this._data.id;
  }

  get name() {
    return this._data.name;
  }

  get definition() {
    return this._data.definition;
  }

  get question() {
    return this._data.question;
  }
}
export class FloatElement extends CdElement<FloatElementData> {
  get min() {
    return this._data.float_values.value_min_max.value_min;
  }

  get max() {
    return this._data.float_values.value_min_max.value_max;
  }

  get stepValue() {
    return this._data.float_values.step_value;
  }
}

export class IntegerElement extends CdElement<IntegerElementData> {
  get min() {
    return this._data.integer_values.value_min_max.value_min;
  }

  get max() {
    return this._data.integer_values.value_min_max.value_max;
  }

  get stepValue() {
    return this._data.integer_values.step_value;
  }
}

export class BooleanElement extends CdElement<BooleanElementData> {}

export class ValueSetElement extends CdElement<ValueSetElementData> {
  get values(): ValueSetValue[] {
    return this._data.value_set.values.map((value) => {
      return { ...value };
    });
  }
}

export class CdElementFactory {
  // create a factory method taking in CdElementData and returning the right sub-class of CdElement
  static create(inData: ElementData): CdElement {
    if ('value_set' in inData && inData.value_set?.value_type === 'valueSet')
      return new ValueSetElement(inData);
    else if (
      'float_values' in inData &&
      inData.float_values?.value_type === 'float'
    )
      return new FloatElement(inData);
    else if (
      'integer_values' in inData &&
      inData.integer_values?.value_type === 'integer'
    )
      return new IntegerElement(inData);
    else if (
      'boolean_values' in inData &&
      inData.boolean_values?.value_type === 'boolean'
    )
      return new BooleanElement(inData);
    else
      throw new Error(
        `Unknown element type: doesn't seem to have value_set, float_values, integer_values, or boolean_values.`
      );
  }

  static createFromJson(json: string | {}): CdElement {
    const parsedJson: object =
      typeof json === 'string' ? JSON.parse(json) : json;
    const inData = elementSchema.parse(parsedJson);
    return CdElementFactory.create(inData);
  }
}
