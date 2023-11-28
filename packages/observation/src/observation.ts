import { CdeSet, CdeSetData } from '../../cde_set/src/types/cdeSet';
import { z } from 'zod';

//Schemas

export const codingSchema = z.object({
  system: z.string(),
  code: z.string(), //This is an RDES
  display: z.string(),
});

export const codeSchema = z.object({
  code: z.array(codingSchema),
});

export const bodySiteSchema = z.object({
  code: codingSchema,
});

export const valueCodeableConceptSchema = z.object({
  system: z.string().url(),
  code: z.string(), //This is an RDE?
  display: z.string(),
});

export const stringValueSchema = z.object({
  value: z.string(),
});

export const integerValueSchema = z.object({
  value: z.number().int(),
});

export const floatValueSchema = z.object({
  value: z.number(),
});

export const valueSchema = z.union([
  valueCodeableConceptSchema,
  stringValueSchema,
  integerValueSchema,
  floatValueSchema,
]);

/**
 * component has two attributes
 *  code which is an array
 *  value: which is one of several types of values string, float, codeableConcept etc...
 */
export const componentSchema = z.object({
  code: z.array(codingSchema),
  // Needed to make these optional despite the union d/t the different names ie int, value, string rtc...
  valueCodeableConcept: z.array(valueSchema).optional(),
  valueString: z.string().optional(), //TODO: arrays or single value
  valueInteger: z.number().int().optional(),
  valueFloat: z.number().optional(),
  //TODO: add more if needed
});

export const observationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string(),
  code: codingSchema,
  bodySite: bodySiteSchema, //TODO: Supposed to be an array?
  component: z.array(componentSchema),
});

//Types
export type componentData = z.infer<typeof componentSchema>;
export type observationData = z.infer<typeof observationSchema>;
export type codingData = z.infer<typeof codingSchema>;
export type valueData = z.infer<typeof valueSchema>;
export type valueCodeableConceptData = z.infer<
  typeof valueCodeableConceptSchema
>;
export type stringValueData = z.infer<typeof stringValueSchema>;
export type integerValueData = z.infer<typeof integerValueSchema>;
export type floatValueData = z.infer<typeof floatValueSchema>;

//classes

export class stringValue {
  protected _data: stringValueData;

  constructor(inData: stringValueData) {
    this._data = { ...inData };
  }

  get value() {
    return this._data.value;
  }
}

export class integerValue {
  protected _data: integerValueData;

  constructor(inData: integerValueData) {
    this._data = { ...inData };
  }

  get value() {
    return this._data.value;
  }
}

export class floatValue {
  protected _data: floatValueData;

  constructor(inData: floatValueData) {
    this._data = { ...inData };
  }

  get value() {
    return this._data.value;
  }
}

export class valueCodeableConcept {
  protected _data: valueCodeableConceptData;

  constructor(inData: valueCodeableConceptData) {
    this._data = { ...inData };
  }

  get system() {
    return this._data.system;
  }

  get code() {
    return this._data.code;
  }

  get display() {
    return this._data.display;
  }
}

export class Component {
  protected _data: componentData;

  constructor(inData: componentData) {
    this._data = { ...inData };
  }

  get code() {
    //TODO: if array need to change
    return this._data.code;
  }

  get valueCodeableConcept() {
    //TODO: if array need to change
    return this._data.valueCodeableConcept;
  }
}

export class Observation<T extends observationData> {
  protected _data: observationData;
  protected _component: componentData[] = [];

  constructor(inData: observationData) {
    this._data = { ...inData };
    this._data.component.forEach((componentData) => {
      this._component.push(new Component(componentData));
    });
  }

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
    return this._component;
  }

  toJSON(): string {
    const json: observationData = {
      resourceType: 'Observation',
      id: this._data.id,
      code: { ...this._data.code },
      bodySite: this._data.bodySite
        ? { code: { ...this._data.bodySite.code } }
        : undefined,
      component: this._component.map((component) => component.toJSON()),
    };

    return JSON.stringify(json);
  }
}

///////////////////////////////
/*
export type ObservationData = z.infer<typeof observationSchema>;
export const sampleCdeSetData: CdeSetData = {
  id: '1',
  name: 'Sample CDE Set',
  description: 'A sample CDE set',
  version: {
    status: 'Proposed',
    name: 'Starting',
    version_date: '2021-01-01',
  },
  url: 'https://example.com',
  index_codes: [],
  body_parts: [],
  authors: [],
  specialty: [],
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
*/
