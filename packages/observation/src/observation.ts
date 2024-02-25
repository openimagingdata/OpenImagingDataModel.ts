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
  code: z.string().optional(),
  display: z.string().optional(),
});

export type SystemCodeData = z.infer<typeof systemCodeSchema>;

export const codeableConceptValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.array(systemCodeSchema).nullable(), //array of code is a coding, Can we have this nullable?
});

export const stringValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.string().nullable(),
});

export const integerValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.number().int().nullable(),
});

export const floatValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.number().nullable(),
});

export const componentSchema = z.union([
  codeableConceptValueSchema,
  stringValueSchema,
  integerValueSchema,
  floatValueSchema,
]);

export const observationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string().optional(),
  code: systemCodeSchema,
  bodySite: z
    .object({
      code: systemCodeSchema,
    })
    .optional(),
  component: z.array(componentSchema),
});

export type componentData = z.infer<typeof componentSchema>;
export type observationData = z.infer<typeof observationSchema>;

function isObservationData(obj: any): obj is observationData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'resourceType' in obj &&
    obj['resourceType'] === 'Observation' // Check for the specific value of resourceType
    // Add more checks if needed for other properties
    // You might also want to check if the 'component' property is an array of componentData
  );
}

function isComponentData(obj: any): obj is componentData {
  return (
    typeof obj === 'object' && obj !== null && 'code' in obj && 'value' in obj
    // Add more checks if needed for other properties
  );
}

//const pulmNoduleSet = new CdeSet('RDES195');
//const rightLowerLobeBodyPart = BodyPartIndex.getByRadlexId('RIDxxxx');'
//let pulmNodule = new ImagingObservation(pulmNoduleSet); // New ImagingObservation is a pulmonary nodule, but no components yet
//pulmNodule.bodySite = rightLowerLobeBodyPart;
//const sizeComponent = new ImagingObservationComponent(pulmNoduleSet.getElement("size"), 6.0)
//pulmNodule.addComponent(sizeComponent);
// and so on for composition, location, and so on

class Component {
  private _data: componentData;

  constructor(inData: componentData) {
    this._data = { ...inData };
  }

  get data() {
    return this._data;
  }
  get code() {
    return this._data.code;
  }
  get value() {
    return this._data.value;
  }
}

type ImagingComponentKeyInput = string | CdElement; //In case of string would be in format of RDEID ???
type ImagingComponentValueInput = string | number | SystemCodeData[]; //SystemCodeData and SystemCodeData[] = code and coding ???

class ImagingObservationComponent {
  private _data: Partial<Component> = {};
  //private _value: ImagingComponentValueInput; Probably dont need.

  constructor(
    key: ImagingComponentKeyInput,
    value?: ImagingComponentValueInput
  ) {
    if (!value) {
      if (key instanceof CdElement) {
        this._data = ObservationBuilder.buildComponentFromCDE(key);
      } else if (typeof key === 'string') {
        ObservationBuilder.buildComponentFromRDEid(key)
          .then((componentData) => {
            this._data = componentData;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error('Incorrect key type');
      }
    } else if (isComponentData(key)) {
      //Want this to be componentData not component
      this._data = key;
    } else {
      this._data = ObservationBuilder.buildComponentFromKeyValue(key, value);
    }
  }

  get data() {
    return this._data;
  }

  get code() {
    return this._data.code;
  }

  get value() {
    return this._data.value;
  }
}

const rdeIdPattern = /^rde\d{1,3}$/i;

class ObservationBuilder {
  //TODO: Need to map cde.valueSet.values to component.value
  //cde.valueSet.value = [{value: 'RDE818.0', name: 'acute'}, {value: 'RDE818.1', name: 'chronic'}]
  //component.value = [{system: 'defaultSystem', code: 'RDE818.0', display: 'acute'}, {system: 'defaultSystem', code: 'RDE818.1', display: 'chronic'}]
  //TODO: Need to map these two things together somehow.
  //Builds components from valueSet elements
  static valueSetToComponentValues(
    cdElement: Partial<ValueSetElement>
  ): SystemCodeData[] {
    const systemCodeData: SystemCodeData[] = [];
    if (cdElement.elementType === 'valueSet') {
      const valueSetElement = cdElement as ValueSetElement;
      valueSetElement.values.forEach((value) => {
        systemCodeData.push({
          system: valueSetElement.source ?? 'defaultSystem',
          code: value.value,
          display: value.name,
        });
      });
    }
    return systemCodeData;
  }

  //Builds components from CdElements
  static buildComponentFromCDE(cdeElement: CdElement): componentData {
    let componentValue;
    let booleanCdElement;
    let integerCdElement;
    let floatCdElement;
    let valueSetCdElement;
    switch (cdeElement.elementType) {
      case 'integer':
        integerCdElement = cdeElement as IntegerElement;
        componentValue = integerCdElement.integerValues?.values;
        break;
      case 'boolean':
        booleanCdElement = cdeElement as BooleanElement;
        componentValue = booleanCdElement.booleanValues?.values;
        break;
      case 'float':
        floatCdElement = cdeElement as FloatElement;
        componentValue = floatCdElement.floatValues?.values;
        break;
      case 'valueSet':
        valueSetCdElement = cdeElement as ValueSetElement;
        componentValue =
          ObservationBuilder.valueSetToComponentValues(valueSetCdElement);
        break;
    }

    const code: SystemCodeData[] = [
      {
        system: cdeElement.source ?? 'defaultSystem',
        code: cdeElement.id ?? '',
        display: cdeElement.name ?? '',
      },
    ];

    const newComponentData: componentData = {
      code: code,
      value: componentValue ?? [],
      //TODO: element.values.values can return null or undefined which is causes this error because values is required in component.
    };

    return newComponentData;
  }

  static buildMutableImagingObsFromCdeSet(
    id: string,
    cdeSet: CdeSet
  ): Partial<imagingObservationData> {
    const partialImagingObs: Partial<imagingObservationData> = {};
    const components: componentData[] = [];

    //set metadata
    partialImagingObs.resourceType = 'Observation';
    partialImagingObs.id = id;
    partialImagingObs.code = {
      system: 'system', //What do we want these values to be
      code: 'code',
      display: 'display',
    };
    partialImagingObs.bodySite = {
      code: {
        system: 'system', //What do we want these values to be
        code: 'code',
        display: 'display',
      },
    }; //TODO: Need to add real body part;

    if (cdeSet.elements) {
      cdeSet.elements.forEach((element) => {
        const currentElement = CdElementFactory.create(element); //TODO: need this because it is picking element up as elementData not an element
        const componentData =
          ObservationBuilder.buildComponentFromCDE(currentElement);
        components.push(componentData);
      });
    }
    partialImagingObs.component = components;
    return partialImagingObs;
  }

  //Build ImagingObservation from CdeSet. Uses static method buildComponentFromCDE
  static buildImagingObsFromCdeSet(
    id: string,
    cdeSet: CdeSet
  ): MutabaleImagingObservation {
    const partialImagingObs: Partial<imagingObservationData> = {};
    const components: componentData[] = [];

    //set metadata
    partialImagingObs.resourceType = 'Observation';
    partialImagingObs.id = id;
    partialImagingObs.code = {
      system: 'system', //What do we want these values to be
      code: 'code',
      display: 'display',
    };
    partialImagingObs.bodySite = {
      code: {
        system: 'system', //What do we want these values to be
        code: 'code',
        display: 'display',
      },
    };

    if (cdeSet.elements) {
      cdeSet.elements.forEach((element) => {
        const currentElement = CdElementFactory.create(element);
        const component =
          ObservationBuilder.buildComponentFromCDE(currentElement);
        components.push(component);
      });
    }
    partialImagingObs.component = components;
    const newMutableImagingObs = new MutabaleImagingObservation(
      id,
      partialImagingObs
    );

    return newMutableImagingObs;
  }

  static async buildComponentFromRDEid(
    id: string
  ): Promise<Partial<Component>> {
    let partialComponent: Partial<Component> = {};
    if (!rdeIdPattern.test(id)) {
      throw new Error('Invalid RDE id format.');
    } else {
      const cdElement: CdElement | null = await CdElement.fetchFromRepo(id);
      if (cdElement === null) {
        throw new Error('Failed to fetch CdElement from repository.');
      } else {
        partialComponent = ObservationBuilder.buildComponentFromCDE(cdElement);
        return partialComponent;
      }
    }
  }

  static buildComponentFromKeyValue(
    key: ImagingComponentKeyInput,
    value: ImagingComponentValueInput
  ) {
    let partialComponent: Partial<Component>;
    if (key instanceof CdElement) {
      partialComponent = {
        code: [
          {
            system: key.source ?? 'defaultSystem',
            code: key.id,
            display: key.name,
          },
        ],
        value: value,
      };
      return partialComponent;
    } else if (typeof key === 'string') {
      //How would this work, wouldnt the values be already set?
      const cdElement: CdElement | null = await CdElement.fetchFromRepo(key);
      if (cdElement === null) {
        throw new Error('Failed to fetch CdElement from repository.');
      } else {
        partialComponent = {
          code: [
            {
              system: cdElement.source ?? 'defaultSystem',
              code: cdElement.id,
              display: cdElement.name,
            },
          ],
          value: value,
        };
        return partialComponent;
      }
      //cdElement.values.push(value);
    } else {
      throw new Error('Unsupported key type');
    }
  }
}

//Add more inData types as required
type imagingObservationInData =
  | CdeSet
  | Partial<CdeSet>
  | imagingObservationData;

class MutabaleImagingObservation {
  private _data: Partial<imagingObservationData>;
  private _components: Component[] = [];

  constructor(id: string, inData: imagingObservationInData) {
    if (inData instanceof CdeSet) {
      this._data = ObservationBuilder.buildMutableImagingObsFromCdeSet(
        id,
        inData
      );
      if (this._data.component) {
        this._components = this._data.component.map((component) => {
          return new Component(component);
        });
      }
    } else {
      this._data = { ...inData };
    }
  }

  addComponent(component: ImagingObservationComponent) {
    this._components.push(component);
  }

  get resourceType() {
    return this._data.resourceType;
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

  set bodySite(inBodySite: SystemCodeData) {
    this._data.bodySite = inBodySite;
  }

  get components() {
    return this._components;
  }
}

class ImagingObservation {
  private _data: imagingObservationData;
  private _components: Component[] = [];

  constructor(inData: imagingObservationData) {
    this._data = { ...inData };
    const components = this._data.component;
    components.forEach((component) => {
      this._components.push(new Component(component));
    });
  }

  addComponent(component: Component) {
    this._components.push(component);
  }

  get resourceType() {
    return this._data.resourceType;
  }

  get id() {
    return this._data.id;
  }

  set id(inId: string) {
    this._data.id = inId;
  }

  get code() {
    return this._data.code;
  }

  set code(inCode: SystemCodeData) {
    this._data.code = inCode;
  }

  get bodySite() {
    return this._data.bodySite;
  }

  get components() {
    return this._components;
  }
}

const ObservationInput = z.object({
  cdeSetId: z.string(),
  observationId: z.string(),
  //optional data, where the data is a Mapping from strings (representing either element names or IDs) or CDElements and values
  data: z.array(string()),
});

type observationInput = z.infer<typeof ObservationInput>;

export class ObservationId {
  protected _id: string | undefined;

  constructor(inId: string | undefined = undefined) {
    this._id = inId;
  }

  public generateId() {
    this._id = uuidv4();
    return this._id;
  }

  get id() {
    return this._id;
  }
}

type ComponentKeyInput =
  | string
  | CdElement
  | SystemCodeData //This is coding? Check
  | ImagingObservationComponent; //If type ImagingObservationComponent not going to have input value because taken care of when making the ImagingObservationComponent instance????
type ComponentValueInput =
  | string
  | number
  | boolean
  | SystemCodeData
  | SystemCodeData[]; //SystemCodeData and SystemCodeData[] = code and coding ???;
