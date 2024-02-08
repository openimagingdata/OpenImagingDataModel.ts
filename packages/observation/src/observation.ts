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
  value: z.array(systemCodeSchema), //array of code is a coding
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
}

class ImagingObservationComponent {
  private _data: componentData;
  private _value: ImagingComponentValueInput;

  constructor(
    key: ImagingComponentKeyInput,
    value?: ImagingComponentValueInput,
  )
  {
    if (!value) {
      if (ImagingComponentKeyInput instanceof CdElement) {
        ObservationBuilder.buildComponentFromCDE(ImagingComponentKeyInput)

      }else if (typeof ImagingComponentKeyInput === 'string'){
        ObservationBuilder.buildComponentFromRDEid(ImagingComponentKeyInput)
      }else {
        console.error("Incorrect key type");
      }
    }else {
      ObservationBuilder.buildComponentFromkeyValue
    }

}
}

const rdeIdPattern = /^rde\d{1,3}$/i;

class ObservationBuilder {
  //Build from: CdeSet, String

  //Builds components from CdElements
  static buildComponentFromCDE(partialElement: Partial<CdElement>): Partial<Component>{
    let partialComponent: Partial<Component> = {};
    let componentValue;
    switch (partialElement.elementType) {
      case 'integer':
        const integerCdElement = partialElement as Partial<IntegerElement>;
        componentValue = integerCdElement.integerValues;
        break;
      case 'boolean':
        const booleanCdElement = partialElement as Partial<BooleanElement>;
        componentValue = booleanCdElement.booleanValues;
        break;
      case 'float':
        const floatCdElement = partialElement as Partial<FloatElement>;
        componentValue = floatCdElement.floatValues;
        break;
      case 'valueSet':
        const valueCdElement = partialElement as Partial<ValueSetElement>;
        componentValue = valueCdElement.values;
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
    let components: Component[] = [];

    cdeSet.element.forEach((element) => {
      const component = ImagingObservation.buildComponentFromCDE(element);
      components.push(component);
    }
    )
    partialImagingObs = {
      resourceType: "Imaging Observation",
      code: {
        system: cdeSet.source,
        code: cdeSet.id,
        display: cdeSet.name
      },
      bodySite: /* Define or reference */,
      component: components
    }
    return partialImagingObs;
  }

  static buildComponentFromRDEid(id: string ){
    if (!rdeIdPattern.test(id)) {
      console.error('Invalid RDE id format.');
      return null;
    }
    else {
      const cdElement: CdElement = (await CdElement.fetchFromRepo(id));
      component= buildComponentFromCDE(cdElement);
      return component;
    }
  }

  static buildComponentFromkeyValue(key: ImagingComponentKeyInput , value: ImagingComponentValueInput ){
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
      const cdElement: CdElement = await CdElement.fetchFromRepo(key);
      //cdElement.values.push(value);
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
    }else {
        throw new Error('Unsupported key type');
    }
  }
}

export type imagingObservationData = z.infer<typeof observationSchema>;

class ImagingObservation {
  private _data: imagingObservationData;
  private _components: Component[];

  constructor(inData: Partial<CdeSet> | string) {
    this._components = [];
    if (inData instanceof Partial<CdeSet>){
      this._data = ImagingObservation.buildImagingObsFromCdeSet(inData);
    }else if (typeof inData === "string" ) {
      const cdeSet = CdeSet.fetchFromRepo(inData)
      this._data = ImagingObservation.buildImagingObsFromCdeSet(cdeSet);
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

type ImagingComponentKeyInput = string | CdElement; //In case of string would be in format of RDEID ???
type ImagingComponentValueInput =
  | string
  | number
  | boolean
  | SystemCodeData
  | SystemCodeData[]; //SystemCodeData and SystemCodeData[] = code and coding ???


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
  | Coding
  | ImagingObservationComponent; //If type ImagingObservationComponent not going to have input value because taken care of when making the ImagingObservationComponent instance????
type ComponentValueInput =
  | string
  | number
  | boolean
  | SystemCodeData
  | SystemCodeData[]; //SystemCodeData and SystemCodeData[] = code and coding ???;

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
  //
  // What kind of inputs might we give for key?
  // - A string that matches the regex /^rde\d{1,3}$/i
  // - A CdElement object
  // - A FHIR Coding object
  // What kind of inputs might have for the value?
  // - A string, number, or boolean, a FHIR Coding, or a list of strings or list of FHIR Codings

  // type ComponentKeyInput = string | CdElement | Coding;
  // type ComponentValueInput = string | number | boolean | Coding | Coding[] | string[];

  private async addComponent(
    key: ComponentKeyInput,
    value: ComponentValueInput
  ) {
    if (key instanceof ImagingObservationComponent) {
      //Get data which is a component
      const newComponent: componentData = key.data; //TODO: push key.data or key??
      //push component to this._components
      this._components.push(newComponent);
    }
    //This the case where key is string and matches the regex
    if (typeof key === 'string') {
      const idPattern = /^rde\d{1,3}$/i;
      if (key.match(idPattern)) {
        const cdElement: CdElement = (await CdElement.fetchFromRepo(
          key
        )) as CdElement; //TODO: What if returs null.
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
        //TODO: This the case it is a string that does not match the regex... what do we do AKA "arbitrary code"
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

  getComponentValue(key: string | CdElement): any | undefined {
    // It essentially disables TypeScript's type checking for the return value,
    //allowing the method to return a value of any type. Need to specify later?

    //Checks the type of key. If it's a string, it assigns key to keyString.
    //If it's not a string, it assumes it's a CdElement and assigns its id property to keyString
    const keyString = typeof key === 'string' ? key : key.id;

    // Find the component with the matching key
    const matchingComponent = this._components.find((component) => {
      return component.code.code === keyString; //TODO: Need to fix, which attribute are we trying to match?
    });

    // Return the value if found
    return matchingComponent?.data.value;
  }
}
