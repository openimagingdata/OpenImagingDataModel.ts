import { CdeSet, CdeSetData } from '@openimagingdata/cde_set';
import { z } from 'zod';

export const systemCodeSchema = z.object({
  system: z.string().url(),
  code: z.string(),
  display: z.string().optional(),
});

export type SystemCodeData = z.infer<typeof systemCodeSchema>;

export const codeableConceptValueSchema = z.object({
  code: z.array(systemCodeSchema),
  valueCodeableConcept: z.array(systemCodeSchema),
});

export const stringValueSchema = z.object({
  code: z.array(systemCodeSchema),
  valueString: z.string(),
});

export const integerValueSchema = z.object({
  code: z.array(systemCodeSchema),
  valueInteger: z.number().int(),
});

export const floatValueSchema = z.object({
  code: z.array(systemCodeSchema),
  valueFloat: z.number(),
});

export const componentSchema = z.union([
  codeableConceptValueSchema,
  stringValueSchema,
  integerValueSchema,
  floatValueSchema,
]); //

export type ComponentData = z.infer<typeof componentSchema>;

export const observationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string(),
  code: systemCodeSchema,
  bodySite: z.object({ code: systemCodeSchema }).optional(),
  component: z.array(componentSchema),
});

export type ObservationData = z.infer<typeof observationSchema>;
export const sampleCdeSetData: CdeSetData = {
  id: '1',
  name: 'Sample CDE Set',
  description: 'A sample CDE set',
  index_codes: [],
  body_parts: [],
  elements: [],
};

export class Observation {
  private readonly _data: ObservationData;
  private _cdeSet: CdeSet;
  // TODO: set up private readonly _cdeSet: CdeSet;
  constructor(inData: ObservationData) {
    // TODO: initialize this._cdeSet
    this._data = { ...inData };
    this._cdeSet = new CdeSet(sampleCdeSetData); // do we want a lookup here?
  }

  // TODO: Implement accessors, including components; do we need wrapper classes for component data?
  get id() {
    return this._data.id;
  }

  get code() {
    return this._data.code;
  }

  get bodySite() {
    return this._data.bodySite;
  }

  get component() {
    return this._data.component;
  }

  get cdeSet() {
    return this._cdeSet;
  }
}
