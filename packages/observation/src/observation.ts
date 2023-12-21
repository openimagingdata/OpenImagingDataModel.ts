import { CdeSet, CdeSetData, CdeElement } from '../../cde_set/src/types/cdeSet';
import { z } from 'zod';

//Schemas

export const codingSchema = z.object({    //This is really a CDE or CDEs, rename????
  system: z.string(),
  code: z.string(), //This is the CDES id ex RDES195
  display: z.string(),
});

export const codeSchema = z.object({
  code: z.array(codingSchema),
});

export const bodySiteSchema = z.object({
  code: z.array(codingSchema), //This is an RID, which refers to a body site, dont have this yet? 
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
  code: z.array(codingSchema), //These are CDE's
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
  code: codingSchema, //This is a CDES
  bodySite: bodySiteSchema, //had code attribute which is am array of codes or CDE's
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

import { Component, componentData, CdElement, CdeSet, observationData } from './path-to-your-classes';

export class Observation {
  protected _data: observationData;
  protected _components: Component[] = [];
  protected _cdeSet: CdeSet;

  constructor(cdeSet: CdeSet) {
    this._cdeSet = cdeSet;
    this._data = {
      id: cdeSet.id,
      code: cdeSet.code,
      // other attributes 

    };

    // Get the elements from the CDEset and use them to generate the components
    cdeSet.elements.forEach((element) => {
      const cdElement = CdElementFactory.create(element); // assuming CdElementFactory is accessible

      const newComponentData: componentData = {
        code: {
          system: cdElement.source,
          code: cdElement.id,
          display: cdElement.name,
        },
        value: cdElement.values, //Need to update for specific cdeElement type, how to get correct type and struct
      };

      const newComponent = new Component(newComponentData);
      this._components.push(newComponent);
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

  get components() {
    return [...this._components];
  }


  addComponentFromCDElement(cdeElement: CdElement, value: string) {
    const newComponentData: componentData = {
      code: cdeElement.getCode(),
      valueString: value,
    };
    const newComponent = new Component(newComponentData);
    this._component.push(newComponent);
  }

  addComponentFromCDElementID(cdeElementID: string, value: string) {
    const cdeElement = this._cdeSet.getCDElementByID(cdeElementID);

    if (cdeElement) {
      this.addComponentFromCDElement(cdeElement, value);
    } else {
      console.error(`CDElement with ID ${cdeElementID} not found.`);
    }
  }

  addComponentFromCDElementName(cdeElementName: string, value: string) {
    const cdeElement = this._cdeSet.getCDElementByName(cdeElementName);

    if (cdeElement) {
      this.addComponentFromCDElement(cdeElement, value);
    } else {
      console.error(`CDElement with name ${cdeElementName} not found.`);
    }
  }

  toJSON(): string {
    const json: observationData = {
      resourceType: 'Observation',
      id: this._data.id,
      code: { 
              system: this._data.code.system,
              code: this._data.code.code, 
              display: this._data.code.display
            },
      //TODO: add ? for optionals?
      bodySite: {
        code: { 
              system: this._data.bodySite.system,
              code: this._data.bodySite.code, 
              display: this._data.bodySite.display
            },
      },
      component: this._component.map((componentItem) => ({
        code: {
          coding: componentItem.code.map((codeItem) => ({
            system: codeItem.system,
            code: codeItem.code,
            display: codeItem.display
          }))
        },
        valueCodeableConcept?: {
          coding: valueItem.code.map((valueItem) => ({ 
            system: this._component.valueCodeableConcept.system,
            code: this._component.valueCodeableConcept.code,
            display: this._component.valueCodeableConcept.display
            }))
        },
        valueString?: this._data.component.valueString,
        valueString?: this._data.component.valueString,
        valueInteger?: this._data.component.valueInteger,
        valueFloat?: this._data.component.valueFloat,
      })),
    };
    return JSON.stringify(json);
  }
};

const cdeSet = await CdeSet.fetchFromRepo('your_rdes_id');
const observation = new Observation(cdeSet);
