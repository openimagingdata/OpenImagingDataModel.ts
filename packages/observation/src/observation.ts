import { CdeSet, CdElementFactory } from '../../cde_set/src/types/cdeSet';
import {
  CdElement,
  IntegerElement,
  FloatElement,
  BooleanElement,
  ValueSetElement,
} from '../../cde_set/src/types/cdElement';
import { z } from 'zod';

//Schemas

export const systemCodeSchema = z.object({
  system: z.string().url(),
  code: z.string(),
  display: z.string().optional(),
});

export type SystemCodeData = z.infer<typeof systemCodeSchema>;

export const codeableConceptValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.array(systemCodeSchema),
});

export const stringValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.string(),
});

export const integerValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.number().int(),
});

export const floatValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.number(),
});

export const componentSchema = z.union([
  codeableConceptValueSchema,
  stringValueSchema,
  integerValueSchema,
  floatValueSchema,
]);

export type componentData = z.infer<typeof componentSchema>;

class Component {
  private _data: componentData;

  constructor(inData: componentData) {
    this._data = { ...inData };
  }
}

export const observationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string(),
  code: systemCodeSchema,
  bodySite: z
    .object({
      code: systemCodeSchema,
    })
    .optional(),
  component: z.array(componentSchema),
});

export type observationData = z.infer<typeof observationSchema>;

class CDEComponent {
  private _data: componentData;

  constructor(cdElement: CdElement) {
      let componentValue; 
      switch (cdElement.elementType) {
      case 'integer':
        const intCdElement = cdElement as IntegerElement;
        componentValue = intCdElement.integerValues;
        break;
      case 'boolean':
        const boolCdElement = cdElement as BooleanElement;
        componentValue = boolCdElement.booleanValues;
        break;
      case 'float':
        const floatCdElement = cdElement as FloatElement;
        componentValue = floatCdElement.floatValues;
        break;
      case 'valueSet':
        const valueCdElement = cdElement as ValueSetElement;
        componentValue = valueCdElement.values;
        break;
    }
    const component: componentData = {
      code: [
        {
          system: cdElement.source ?? 'defaultSystem',
          code: cdElement.id,
          display: cdElement.name,
        },
      ],
      value: componentValue,
    };

    this._data = component;
  }

  get data() {
    return { ...this._data };
  }
}

const ObservationInput = z.object ({
  cdeSetId: z.string(),
  observationId?: z.string(),
  //optional data, where the data is a Mapping from strings (representing either element names or IDs) or CDElements and values
  data?: z.array(string()),
});

type observationInput = z.infer<typeof ObservationInput>;

export class Observation {
  protected _data: observationData;
  protected _components: Component[] = [];
  protected _cdeSet: CdeSet;

  constructor(inData: CdeSet) {
    this._cdeSet = cdeSet;
    this._data = {
      resourceType: 'Observation',
      id: 'some_id', // Waht data do we pull from to get the id?
      code: {
        system: cdeSet.url,
        code: cdeSet.id,
        display: cdeSet.name,
      },
      bodySite: undefined,
      component: [],
    };
    cdeSet.elements.forEach((element) => {
      let cdElement = CdElementFactory.create(element);
      let componentValue;
      let cdeElement1 = cdElement as IntegerElement;

      switch (cdElement.elementType) {
        case 'integer':
          const intCdElement = cdElement as IntegerElement;
          componentValue = intCdElement.integerValues;
          break;
        case 'boolean':
          const boolCdElement = cdElement as BooleanElement;
          componentValue = boolCdElement.booleanValues;
          break;
        case 'float':
          const floatCdElement = cdElement as FloatElement;
          componentValue = floatCdElement.floatValues;
          break;
        case 'valueSet':
          const valueCdElement = cdElement as ValueSetElement;
          componentValue = valueCdElement.values;
          break;
      }

      const newComponentData: componentData = {
        code: [
          {
            system: cdElement.source ?? 'defaultSystem',
            code: cdElement.id,
            display: cdElement.name,
          },
        ],
        value: componentValue, //TODO: need to correct value
      };

      const newComponent = new Component(newComponentData);
      this._components.push(newComponent);
      this._data.component.push(newComponentData); //Probably dont want to push to both
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

  addComponentFromCDElement(cdElement: CdElement) {
    let componentValue;
    switch (cdElement.elementType) {
      case 'integer':
        const intCdElement = cdElement as IntegerElement;
        componentValue = intCdElement.integerValues;
        break;
      case 'boolean':
        const boolCdElement = cdElement as BooleanElement;
        componentValue = boolCdElement.booleanValues;
        break;
      case 'float':
        const floatCdElement = cdElement as FloatElement;
        componentValue = floatCdElement.floatValues;
        break;
      case 'valueSet':
        const valueCdElement = cdElement as ValueSetElement;
        componentValue = valueCdElement.values;
        break;
    }

    const newComponentData: componentData = {
      code: [
        {
          system: cdElement.source ?? 'defaultSystem',
          code: cdElement.id,
          display: cdElement.name,
        },
      ],
      value: componentValue,
    };

    const newComponent = new Component(newComponentData);
    this._components.push(newComponent);
    this._data.component.push(newComponentData); //Probably dont want to push to both
  }
}

// Usage example:
CdeSet.fetchFromRepo('your_rdes_id')
  .then((cdeSet) => {
    if (cdeSet) {
      const observation = new Observation(cdeSet);
    } else {
      console.error('Failed to fetch CdeSet from the repository');
    }
  })
  .catch((error) => {
    console.error('An error occurred:', error);
  });

/*
  const cdeSet = CdeSet.fetchFromRepo('your_rdes_id');
  const observation = new Observation(cdeSet.data);
  console.log(observation.toJSON());

  */

/*  toJSON(): string {
    const json: observationData = {
      resourceType: 'Observation',
      id: this._data.id,
      code: {
        system: this._data.code.system,
        code: this._data.code.code,
        display: this._data.code.display,
      },
      bodySite: this._data.bodySite?.code
        ? {
            code: {
              system: this._data.bodySite.code.system,
              code: this._data.bodySite.code.code,
              display: this._data.bodySite.code.display,
            },
          }
        : undefined,
      component: this._components.map((componentItem) => ({
        code: {
          coding: componentItem.getData().code.map((codeItem) => ({
            system: codeItem.system,
            code: codeItem.code,
            display: codeItem.display,
          })),
        },
        valueCodeableConcept: componentItem.getData().value
          ? {
              coding: componentItem.getData().value?.map((valueItem) => ({
                system: valueItem.system,
                code: valueItem.code,
                display: valueItem.display,
              })),
            }
          : undefined,
        valueString: componentItem.getData().valueString,
        valueInteger: componentItem.getData().valueInteger,
        valueFloat: componentItem.getData().valueFloat,
      })),
    };
    return JSON.stringify(json, null, 2); // Adjust spacing for better readability
  }
}

*/
