import { z } from 'zod';

import { IndexCode, indexCodeSchema } from './indexCode';
import {
  authorSchema,
  versionElementSchema,
  eventSchema,
  specialtySchema,
  referenceSchema,
} from './shared';

export const baseElementSchema = z.object({
  id: z.string(),
  parent_id: z.number(),
  name: z.string(),
  short_name: z.string().optional(),
  editor: z.string().optional(),
  instructions: z.string().optional(),
  synonyms: z.string().optional(), // TODO: Looks like this is a string, should change to array of strings
  definition: z.string().optional(),
  question: z.string().optional(),
  version: versionElementSchema,
  index_codes: z.array(indexCodeSchema).optional(),
  authors: authorSchema.optional(),
  history: z.array(eventSchema).optional(),
  specialty: z.array(specialtySchema).optional(),
  references: z.array(referenceSchema).optional(),
  source: z.string().optional(),
});

export const valueSetValueSchema = z.object({
  value: z.string(),
  name: z.string(),
  definition: z.string().optional(),
  index_codes: z.array(indexCodeSchema).optional(),
  // TODO: Include images, eventually
});

export const valueSetElementSchema = baseElementSchema.extend({
  value_set: z.object({
    value_type: z.literal('valueSet'),
    cardinality: z.object({
      min_cardinality: z.number(),
      max_cardinality: z.number(),
    }),
    values: z.array(valueSetValueSchema),
  }),
});

export const floatElementSchema = baseElementSchema.extend({
  float_values: z.object({
    value_type: z.literal('float'),
    value_min_max: z.object({
      value_min: z.number().optional(),
      value_max: z.number().optional(),
    }),
    step_value: z.number().optional().nullable(),
    unit: z.string(),
  }),
});

export const integerElementSchema = baseElementSchema.extend({
  integer_values: z.object({
    value_type: z.literal('integer'),
    value_min_max: z.object({
      value_min: z.number().optional(),
      value_max: z.number().optional(),
    }),
    step_value: z.number().optional(),
    unit: z.string(),
  }),
});

export const booleanElementSchema = baseElementSchema.extend({
  boolean_values: z.object({
    cardinality: z.object({
      min_cardinality: z.number(),
      max_cardinality: z.number(),
    }),
    value_min_max: z.object({
      value_min: z.number().optional().nullable(),
      value_max: z.number().optional().nullable(),
    }),
    step_value: z.number().optional().nullable(),
    unit: z.string(),
    value_type: z.literal('boolean'),
    value_size: z.number(),
    values: z.array(z.string()).optional().nullable(), //TODO: need to fix this
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

type ElementType = 'float' | 'valueSet' | 'integer' | 'boolean';

export class CdElement<T extends ElementData = ElementData> {
  protected _data: T;

  protected _indexCodes;

  constructor(baseElementData: T) {
    this._data = { ...baseElementData };
    this._indexCodes = (this._data.index_codes || []).map((indexCode) => {
      return new IndexCode(indexCode);
    });
  }

  get id() {
    return this._data.id;
  }

  get parent_id() {
    return this._data.parent_id;
  }

  get name() {
    return this._data.name;
  }

  get short_name() {
    return this._data.short_name;
  }

  get editor() {
    return this._data.editor;
  }

  get instructions() {
    return this._data.instructions;
  }

  get synonyms() {
    return this._data.synonyms;
  }

  get definition() {
    return this._data.definition;
  }

  get question() {
    return this._data.question;
  }

  get version() {
    return this._data.version;
  }

  get indexCodes() {
    return [...this._indexCodes];
  }

  get authors() {
    return this._data.authors;
  }

  get history() {
    return this._data.history;
  }

  get specialty() {
    return this._data.specialty;
  }

  get references() {
    return this._data.references;
  }

  get source() {
    return this._data.source;
  }

  abstract get elementType(): ElementType;
}

export class FloatElement extends CdElement<FloatElementData> {
  get elementType() {
    return 'float';
  }
  get floatValues() {
    return this._data.float_values;
  }

  get min() {
    return this._data.float_values.value_min_max.value_min;
  }

  get max() {
    return this._data.float_values.value_min_max.value_max;
  }

  get stepValue() {
    return this._data.float_values.step_value;
  }

  get unit() {
    return this._data.float_values.unit;
  }
}

export class IntegerElement extends CdElement<IntegerElementData> {
  get elementType() {
    return 'integer';
  }

  get integerValues() {
    return this._data.integer_values;
  }

  get min() {
    return this._data.integer_values.value_min_max.value_min;
  }

  get max() {
    return this._data.integer_values.value_min_max.value_max;
  }

  get stepValue() {
    return this._data.integer_values.step_value;
  }

  get unit() {
    return this._data.integer_values.unit;
  }
}

export class BooleanElement extends CdElement<BooleanElementData> {
  get elementType() {
    return 'boolean';
  }
}

export class ValueSetElement extends CdElement<ValueSetElementData> {
  get values(): ValueSetValue[] {
    return this._data.value_set.values.map((value) => {
      return { ...value };
    });
  }

  get cardinality() {
    return this._data.value_set.cardinality;
  }

  get elementType() {
    return 'valueSet';
  }
}

export function isValueSetElementData(
  elementData: ElementData
): elementData is ValueSetElementData {
  return (
    'value_set' in elementData &&
    elementData.value_set?.value_type === 'valueSet'
  );
}

export function isFloatElementData(
  elementData: ElementData
): elementData is FloatElementData {
  return (
    'float_values' in elementData &&
    elementData.float_values?.value_type === 'float'
  );
}

export function isIntegerElementData(
  elementData: ElementData
): elementData is IntegerElementData {
  return (
    'integer_values' in elementData &&
    elementData.integer_values?.value_type === 'integer'
  );
}

export function isBooleanElementData(
  elementData: ElementData
): elementData is BooleanElementData {
  return (
    'boolean_values' in elementData &&
    elementData.boolean_values?.value_type === 'boolean'
  );
}

export class CdElementFactory {
  // create a factory method taking in CdElementData and returning the right sub-class of CdElement
  static create(inData: ElementData): CdElement {
    if (isValueSetElementData(inData)) return new ValueSetElement(inData);
    if (isFloatElementData(inData)) return new FloatElement(inData);
    if (isIntegerElementData(inData)) return new IntegerElement(inData);
    if (isBooleanElementData(inData)) return new BooleanElement(inData);
    throw new Error(
      `Unknown element type: doesn't seem to have value_set, float_values, integer_values, or boolean_values.`
    );
  }

  //create a CdElement object from JSON data
  static createFromJson(json: string | object): CdElement {
    const parsedJson: object =
      typeof json === 'string' ? JSON.parse(json) : json;
    const inData = elementSchema.parse(parsedJson);
    return CdElementFactory.create(inData);
  }
}
