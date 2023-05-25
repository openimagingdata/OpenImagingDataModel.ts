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

export const valueSchema = z.object({
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
    values: z.array(valueSchema),
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

export type FloatElementData = z.infer<typeof floatElementSchema>;
export type ValueSetElementData = z.infer<typeof valueSetElementSchema>;
export type ValueData = z.infer<typeof valueSchema>;
export type BaseElementData = z.infer<typeof baseElementSchema>; // do we need this one?

export class FloatElement {
  private _data: FloatElementData;

  constructor(inData: FloatElementData) {
    this._data = { ...inData };
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
}
