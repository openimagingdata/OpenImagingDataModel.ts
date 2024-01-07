import { CdeSet, CdElementFactory } from '../../cde_set/src/types/cdeSet';
import {
  CdElement,
  IntegerElement,
  FloatElement,
  BooleanElement,
  ValueSetElement,
} from '../../cde_set/src/types/cdElement';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
//TODO: npm install --save-dev @types/uuid

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
    let intCdElement = cdElement as IntegerElement;
    let boolCdElement = cdElement as BooleanElement;
    let floatCdElement = cdElement as FloatElement;
    let valueCdElement = cdElement as ValueSetElement;

    switch (cdElement.elementType) {
      case 'integer':
        intCdElement = cdElement as IntegerElement;
        componentValue = intCdElement.integerValues;
        break;
      case 'boolean':
        boolCdElement = cdElement as BooleanElement;
        componentValue = boolCdElement.booleanValues;
        break;
      case 'float':
        floatCdElement = cdElement as FloatElement;
        componentValue = floatCdElement.floatValues;
        break;
      case 'valueSet':
        valueCdElement = cdElement as ValueSetElement;
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
      //TODO: update value attribute of each component type to match the corresponding CDEelement.values
      //TODO: what attributes from cdeElement.integerValues do you want ex cardinality, value_min_max, step value etc...
      //need this to match the schema outline.
    };

    this._data = component;
  }

  get data() {
    return { ...this._data };
  }
}

const ObservationInput = z.object({
  cdeSetId: z.string(),
  observationId: z.string(),
  //optional data, where the data is a Mapping from strings (representing either element names or IDs) or CDElements and values
  data: z.array(string()),
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
      bodySite: undefined, //TODO: need to figure out bodyType structure
      component: [],
    };
    if (this._id.id) {
      this._data['id'] = this._id.id;
    }
    inData.elements.forEach((element) => {
      const cdElement = CdElementFactory.create(element);
      let componentValue;
      let intCdElement = cdElement as IntegerElement;
      let boolCdElement = cdElement as BooleanElement;
      let floatCdElement = cdElement as FloatElement;
      let valueCdElement = cdElement as ValueSetElement;

      switch (cdElement.elementType) {
        case 'integer':
          intCdElement = cdElement as IntegerElement;
          componentValue = intCdElement.integerValues;
          break;
        case 'boolean':
          boolCdElement = cdElement as BooleanElement;
          componentValue = boolCdElement.booleanValues;
          break;
        case 'float':
          floatCdElement = cdElement as FloatElement;
          componentValue = floatCdElement.floatValues;
          break;
        case 'valueSet':
          valueCdElement = cdElement as ValueSetElement;
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

  // What we want to be able to do with components is call something like
  // obs.addComponent(key, value)
  // Where "key" could be some arbitrary code, or it could be a CDE ID or it could
  // be a CdElement object itself...
  // ...and we confirm that value is valid given the element and add it to the list
  // BTW, it's also possible to have non-CDEs as the codes associated with a component;
  // we should also allow alternate codes to be used instead of a cdElement (in which
  // case we obviously can't check for validity).
  // We would also like to be able to call
  private async addComponent(key: string | CdElement, value: any) {
    //This the case where key is string and matches the regex
    if (typeof key === 'string') {
      const idPattern = /^rde\d{1,3}$/i;
      if (key.match(idPattern)) {
        const cdElement: CdElement = (await CdElement.fetchFromRepo(
          key
        )) as CdElement; //TODO: Can I assume it will return as CdeElement, what if returs null.
        if (cdElement) {
          let componentValue;
          let intCdElement = cdElement as IntegerElement;
          let boolCdElement = cdElement as BooleanElement;
          let floatCdElement = cdElement as FloatElement;
          let valueCdElement = cdElement as ValueSetElement;

          switch (cdElement.elementType) {
            case 'integer':
              intCdElement = cdElement as IntegerElement;
              componentValue = intCdElement.integerValues;
              break;
            case 'boolean':
              boolCdElement = cdElement as BooleanElement;
              componentValue = boolCdElement.booleanValues;
              break;
            case 'float':
              floatCdElement = cdElement as FloatElement;
              componentValue = floatCdElement.floatValues;
              break;
            case 'valueSet':
              valueCdElement = cdElement as ValueSetElement;
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
            //TODO: if boolean key.booleanValues, if integer key.integerValues etc...
            //TODO: which attributes of values do we want?
          };

          const newComponent = new Component(newComponentData);
          this._components.push(newComponent);
          //TODO: what if fetch returns null
        }
      } else {
        //TODO: This the case it is a string that does not match the regex... what do we do.
        // If the key is a string, assume it's a code?
        // Validate if the key is a valid code or handle non-CDE cases
        // if key is a random string, how do we map its values to componentData?
      }
      //If key is of type CdeElement or CdeElement subclass
    } else if (key instanceof CdElement) {
      let componentValue;
      let intCdElement = key as IntegerElement;
      let boolCdElement = key as BooleanElement;
      let floatCdElement = key as FloatElement;
      let valueCdElement = key as ValueSetElement;

      switch (key.elementType) {
        case 'integer':
          intCdElement = key as IntegerElement;
          componentValue = intCdElement.integerValues;
          break;
        case 'boolean':
          boolCdElement = key as BooleanElement;
          componentValue = boolCdElement.booleanValues;
          break;
        case 'float':
          floatCdElement = key as FloatElement;
          componentValue = floatCdElement.floatValues;
          break;
        case 'valueSet':
          valueCdElement = key as ValueSetElement;
          componentValue = valueCdElement.values;
          break;
      }

      const newComponentData: componentData = {
        code: [
          {
            system: key.source ?? 'defaultSystem',
            code: key.id,
            display: key.name,
          },
        ],
        value: componentValue,
        //TODO: if boolean key.booleanValues, if integer key.integerValues etc...
        //TODO: which attributes of values do we want?
      };

      const newComponent = new Component(newComponentData);
      this._components.push(newComponent);
      this._data.component.push(newComponentData); //Probably dont want to push to both
    }
  }
  //TODO: Next steps:
  // obs.getComponentValue(Code | CdElement | CDE ID)
  // and if we have a component like that, we can return the value.
  // At the end of the day, we'd like to be able ingest and spit out FHIR
}
