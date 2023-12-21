import { CdeSet, CdeSetData, CdElement } from '../../cde_set/src/types/cdeSet';
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
]); //

export type ComponentData = z.infer<typeof componentSchema>;

export const observationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string(),
  code: systemCodeSchema,
  bodySite: z.object({ 
    code: systemCodeSchema }).optional(),
  component: z.array(componentSchema),
});

export class Observation {
  protected _data: observationData;
  protected _components: Component[] = [];
  protected _cdeSet: CdeSet;

  constructor(cdeSet: CdeSet) {  //Is there going to be other inData, for example what would observation.ID be? 
    this._cdeSet = cdeSet;
    this._data = {
      code: {
        system: cdeSet.url,
        code: cdeSet.id, 
        display: cdeSet.name,
      }
      //bodySite: RID???
      //component
    };
    cdeSet.elements.forEach((element) => {
      const cdElement = CdElementFactory.create(element);

      let componentValue;

      switch (cdElement.elementType) {
        case 'integer':
          value = cdElement.integerValues;
          break;
        case 'boolean':
          // Value does not follow the same structure as the element value??
          value = cdElement.booleanValues;
          break;
        case 'float':
          value = cdElement.floatValues;
          break;
        case 'valueSet':
          value = cdElement.values;
          break;
      }

      const newComponentData: componentData = {
        code: {
          system: cdElement.source,
          code: cdElement.id,
          display: cdElement.name,
        },
        value: componentValue,
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


  addComponentFromCDElement(cdElement: CdElement) {
      let componentValue;
      switch (cdElement.elementType) {
        case 'integer':
          value = cdElement.integerValues;
          break;
        case 'boolean':
          // Value does not follow the same structure as the lement value??
          value = cdElement.booleanValues;
          break;
        case 'float':
          value = cdElement.floatValues;
          break;
        case 'valueSet':
          value = cdElement.values;
          break;
      }
    
    const newComponentData: componentData = {
      code: {
        system: cdElement.source,
        code: cdElement.id,
        display: cdElement.name,
      },
      value: componentValue,
    };
    const newComponent = new Component(newComponentData);
    this._component.push(newComponent);
  }

  addComponentFromCDElementID(cdElementID: string) {
    //add logic
  }
    

  addComponentFromCDElementName(elementName: string) {
    //add logic
  }

};

const cdeSet = await CdeSet.fetchFromRepo('your_rdes_id');
const observation = new Observation(cdeSet);






/*   toJSON(): string {
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
  }*/