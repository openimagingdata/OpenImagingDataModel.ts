import { ZodNull, nullable, z } from 'zod';
import { CdeSet } from '../../cde_set/src/types/cdeSet';

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
  //Take a finding and generate cdeSet Json
  static buildFromPartial = (finding: FindingModel): Partial<CdeSet> => {
    const cdeSet: CdeSet = {
      id: 'rdes1',
      name: finding.name,
      description: finding.description ?? '', //defualt to empty string?
      version: {
        name: '',
        version_date: '',
        status_date: '',
        status: 'Proposed',
      },
      url: 'https://www.example.com',
      index_codes: [],
      body_parts: [],
      authors: {
        person: [],
        organization: [],
      },
      history: [],
      specialty: [],
      elements: [],
      references: [],
    };
    return cdeSet;
  };

  static buildElementFromAttribute = (
    attribute: ChoiceAttribute | NumericAttribute
  ) => {};

  static buildElementFromChoiceAttribute(attribute: ChoiceAttribute) {}

  static buildElementFromNumericAttribute(attribute: NumericAttribute) {}
}

/* Notes from 02/29
FHIR representation of an observation
-What to be able to take a finding and generate cdeSet json. 
-Dont need mutable middle man 
-CdeSet structure is going to be changing:
--new model https://github.com/RSNA/ACR-RSNA-CDEs/blob/master/cde.schema.json
*/
