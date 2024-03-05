import { ZodNull, nullable, z } from 'zod';
import { CdeSet, CdeSetData } from '../../cde_set/src/types/cdeSet';
import {
  ValueSetElementData,
  FloatElement,
  IntegerElement,
  BooleanElement,
  CdElement,
  ValueSetElement,
} from '../../cde_set/src/types/cdElement';

const currentDate = new Date();
const formattedCurrentDate = `${
  currentDate.getMonth() + 1
}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
//Schemas
export const valuesSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const typeSchema = z.union([z.literal('choice'), z.literal('numeric')]);

export const baseAttributesSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: typeSchema,
});

export const numericAttributesSchema = baseAttributesSchema.extend({
  //create type as numeric
  minimum: z.number(), //TODO: Nullable?
  maximum: z.number().nullable(),
});

export const choiceAttributesSchema = baseAttributesSchema.extend({
  //tpye: choice literal
  values: z.array(valuesSchema),
});

export const attributesSchema = z.union([
  numericAttributesSchema,
  choiceAttributesSchema,
]);

/*
export const attributesSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('numeric') }),
  z.object({ type: z.literal('choice') }),
  list numeric attribute schema an choice
]); */

//

export const findingSchema = z.object({
  name: z.string().max(75),
  description: z.string().max(500).optional(),
  attributes: z.array(attributesSchema), //TODO: array of attributes
});

//Types
export type BaseAttributesData = z.infer<typeof baseAttributesSchema>;
export type ValuesData = z.infer<typeof valuesSchema>;
export type NumericAttributesData = z.infer<typeof numericAttributesSchema>;
export type ChoiceAttributesData = z.infer<typeof choiceAttributesSchema>;
export type AttributesData = z.infer<typeof attributesSchema>;
export type FindingData = z.infer<typeof findingSchema>;

//classes
export abstract class Attributes<
  T extends BaseAttributesData = BaseAttributesData
> {
  protected _data: T;

  constructor(baseAttributesData: T) {
    this._data = { ...baseAttributesData };
  }

  get name() {
    return this._data.name;
  }

  get description() {
    return this._data.description;
  }

  get type() {
    return this._data.type;
  }
}

export class ChoiceAttribute extends Attributes<ChoiceAttributesData> {
  get values() {
    return this._data.values;
    //return this._data.values[0].name;
    //need a values object to get the attributes of values?
  }
}

export class NumericAttribute extends Attributes<NumericAttributesData> {
  get minimum() {
    return this._data.minimum;
  }

  get maximum() {
    return this._data.maximum;
  }
}

export function isNumericAttribute(
  attributeData: AttributesData
): attributeData is NumericAttributesData {
  return 'type' in attributeData && attributeData.type === 'numeric';
}

export function isChoiceAttribute(
  attributeData: AttributesData
): attributeData is ChoiceAttributesData {
  return 'type' in attributeData && attributeData.type === 'choice';
}

export class FindingModel {
  private _data: FindingData;
  private _attributes: AttributesData[] = [];

  constructor(inData: FindingData) {
    this._data = { ...inData };

    this._data.attributes.forEach((attributeData) => {
      if (isNumericAttribute(attributeData)) {
        this._attributes.push(new NumericAttribute(attributeData));
      } else if (isChoiceAttribute(attributeData)) {
        this._attributes.push(new ChoiceAttribute(attributeData));
      }
    });
  }
  get name() {
    return this._data.name;
  }

  get description() {
    return this._data.description;
  }

  get attributes() {
    return this._attributes;
  }
}
//TODO: need to indentify attribute tpye based on type field.

class findingToCdeSetBuilder {
  //Everything except values?
  static setElementMetadata(
    attribute: ChoiceAttribute | NumericAttribute
  ): Partial<CdeSetData> {
    const setMetadata: Partial<CdElement> = {
      id: 'Generate Unique ID', //uuid4()?
      parent_id: 1,
      name: attribute.name,
      definition: attribute.description,
      question: '',
      version: {
        name: 'Initial Version',
        version_date: formattedCurrentDate,
        status_date: formattedCurrentDate,
        status: 'Proposed',
      },
      indexCodes: [],
    };
    return setMetadata;
  }
  //Take a finding and generate cdeSet Json
  static findingToCdeSet = (finding: FindingModel): CdeSet => {
    const cdeSetData: CdeSetData = {
      //Set the metadata
      id: 'rdes1', //TODO: generate a unique id uuidv4()?
      name: finding.name,
      description: finding.description ?? '', //defualt to empty string?
      version: {
        name: 'Initial Version',
        version_date: formattedCurrentDate,
        status_date: formattedCurrentDate,
        status: 'Proposed',
      },
      url: 'https://www.example.com',
      index_codes: [],
      body_parts: [], //Needed to change the name of the getter to get body_parts from get bodyParts?
      authors: {
        person: [
          {
            name: '', //TODO: What do we want these defualt values to be??
            orcid_id: '',
            twitter_handle: '',
            url: '',
            role: 'author',
          },
        ],
        organization: [],
      },
      history: [],
      specialty: [],
      elements: [], //TODO: Set the elements based on the attribute type.
      references: [],
    };
    const cdeSet = new CdeSet(cdeSetData);
    return cdeSet;
  };

  static buildElementFromAttribute = (
    attribute: ChoiceAttribute | NumericAttribute
  ) => {
    if (attribute instanceof ChoiceAttribute) {
      return this.buildElementFromChoiceAttribute(attribute);
    } else if (attribute instanceof NumericAttribute) {
      return this.buildElementFromNumericAttribute(attribute);
    }
  };

  static buildElementFromChoiceAttribute(
    attribute: ChoiceAttribute
  ): CdElement {
    const valuesSetData: ValueSetElementData = {
      id: 'RDE818', //TODO: generate a unique id uuid4()?
      parent_id: 126,
      name: attribute.name,
      definition: attribute.description,
      question: '',
      version: {
        name: 'Initial Version',
        version_date: formattedCurrentDate,
        status_date: formattedCurrentDate,
        status: 'Proposed',
      },
      index_codes: [],
      value_set: {
        cardinality: {
          min_cardinality: 1,
          max_cardinality: 1,
        },
        value_type: 'valueSet',
        values: attribute.values.map((value) => ({
          value: value.description ?? '',
          name: value.name,
        })),
      },
    };
    const element = new ValueSetElement(valuesSetData);
    return element;
  }

  static buildElementFromNumericAttribute(attribute: NumericAttribute) {
    const element: Partial<CdElement> = {
      id: 'Generate Unique ID', //uuid4()?
      parent_id: 126,
      name: attribute.name,
      definition: attribute.description,
      question: '',
      version: {
        name: 'Initial Version',
        version_date: formattedCurrentDate,
        status_date: formattedCurrentDate,
        status: 'Proposed',
      },
      indexCodes: [],
    };
  }
}

/* Notes from 02/29
FHIR representation of an observation
-What to be able to take a finding and generate cdeSet json. 
-Dont need mutable middle man 
-CdeSet structure is going to be changing:
--new model https://github.com/RSNA/ACR-RSNA-CDEs/blob/master/cde.schema.json
*/
