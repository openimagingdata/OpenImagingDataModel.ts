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
    return this._data.value
  }
}

type ImagingComponentKeyInput = string | CdElement; //In case of string would be in format of RDEID ???
type ImagingComponentValueInput =
  | string
  | number
  | SystemCodeData[]; //SystemCodeData and SystemCodeData[] = code and coding ???

class ImagingObservationComponent {
  private _data: Partial<Component> = {};
  //private _value: ImagingComponentValueInput; Probably dont need. 
  
  constructor(
    key: ImagingComponentKeyInput,
    value?: ImagingComponentValueInput,
  )
  {
    if (!value) {
      if (key instanceof CdElement) {
        this._data = ObservationBuilder.buildComponentFromCDE(key)

      } else if (typeof key === 'string') {
        ObservationBuilder.buildComponentFromRDEid(key)
          .then((componentData) => {
            this._data = componentData;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        console.error("Incorrect key type");
      }
    } else {
      this._data = ObservationBuilder.buildComponentFromKeyValue(key, value);
    }
  }
}

const rdeIdPattern = /^rde\d{1,3}$/i;

class ObservationBuilder {
  //TODO: Need to map cde.valueSet.values to component.value
  //cde.valueSet.value = [{value: 'RDE818.0', name: 'acute'}, {value: 'RDE818.1', name: 'chronic'}]
  //component.value = [{system: 'defaultSystem', code: 'RDE818.0', display: 'acute'}, {system: 'defaultSystem', code: 'RDE818.1', display: 'chronic'}]
  //TODO: Need to map these two things together somehow.
  //Builds components from valueSet elements 
  static valueSetToComponentValues(cdElement: Partial<ValueSetElement>): SystemCodeData[] {
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
  static buildComponentFromCDE(partialElement: Partial<CdElement>): Partial<Component>{
    let partialComponent: Partial<Component> = {};
    let componentValue;
    switch (partialElement.elementType) {
      case 'integer': 
        const integerCdElement = partialElement as Partial<IntegerElement>;
        componentValue = integerCdElement.integerValues?.values;
        break;
      case "boolean": 
        const booleanCdElement = partialElement as Partial<BooleanElement>;
        componentValue = booleanCdElement.booleanValues?.values;
        break;
      case 'float':
        const floatCdElement = partialElement as Partial<FloatElement>;
        componentValue = floatCdElement.floatValues?.values;
        break;
      case 'valueSet':
        const valueCdElement = partialElement as Partial<ValueSetElement>; 
        componentValue = ObservationBuilder.valueSetToComponentValues(valueCdElement);
        
        
        
        break;
    }
    partialComponent = {
      code: [
        {
          system: partialElement.source ?? 'defaultSystem',
          code: partialElement.id,
          display: partialElement.name,
        },
      ],
      value: componentValue,
      //TODO: what attributes from cdeElement.integerValues do you want ex cardinality, value_min_max, step value etc....
    };

    return partialComponent;
  }

  //Build ImagingObservation from CdeSet. Uses static method buildComponentFromCDE
  static buildImagingObsFromCdeSet(cdeSet: Partial<CdeSet>): Partial<ImagingObservation> {
    let partialImagingObs: Partial<ImagingObservation> = {};
    let components: Partial<Component>[] = [];  

    if (cdeSet.elements) {
      cdeSet.elements.forEach((element) => {
        const component = ObservationBuilder.buildComponentFromCDE(element);
        components.push(component);
      }
      )
      if (cdeSet.indexCodes) { //Need because cdeSet.indexCodes is possibly undefined. 
        partialImagingObs = {
          resourceType: "Observation",
          code: {
            system: cdeSet.indexCodes[0].system, //Need to iterate for each indexCode/code pair
            code: cdeSet.indexCodes[0].code,
            display: cdeSet.indexCodes[0].display
          },
          bodySite: /* Define or reference */,
          components: components
        }
        partialImagingObs = partialImagingObs;
      }else {
        console.error('CdeSet does not have indexCodes');
      }
  }
  return partialImagingObs;
}

  static async buildComponentFromRDEid(id: string): Promise<Partial<Component>> {
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

  static buildComponentFromKeyValue(key: ImagingComponentKeyInput , value: ImagingComponentValueInput ){
    let partialComponent: Partial<Component>;
    if (key instanceof CdElement){
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

    }else if (typeof key === 'string'){
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
      
    }else {
        throw new Error('Unsupported key type');
    }
  }
}

export type imagingObservationData = z.infer<typeof observationSchema>;

class ImagingObservation {
  private _data: Partial<imagingObservationData>;
  private _components: Component[];

  constructor(inData: Partial<CdeSet> | string) {
    this._components = [];
    if (typeof inData === Partial<CdeSet>){ //TODO: Need to make an actual partialCDEset class???
      this._data = ObservationBuilder.buildImagingObsFromCdeSet(inData);
    }else if (typeof inData === "string" ) {
      const cdeSet = CdeSet.fetchFromRepo(inData)
      this._data = ObservationBuilder.buildImagingObsFromCdeSet(cdeSet);
    }else {
      throw new Error ("Unsupported inData")
    }
  }

  addComponent(component: Component) {
    this._components.push(component);
  }

  get resourceType() {
    return this._data.resourceType;
  }

  get code() {
    return this._data.code;
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
  data: z.array(z.string()),
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