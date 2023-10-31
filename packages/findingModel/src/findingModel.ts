import { z } from 'zod';

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
  type: z.literal('numeric'),
  minimum: z.number(), //TODO: Nullable?
  maximum: z.number().nullable(),
});

export const choiceAttributesSchema = baseAttributesSchema.extend({
  type: z.literal('choice'),
  values: z.array(valuesSchema),
});

export const attributesSchema = z.union([
  numericAttributesSchema,
  choiceAttributesSchema,
]);

/*
export const attributesSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('numeric'), numericAttributesSchema }),
  z.object({ type: z.literal('choice'), choiceAttributesSchema }),
  //list numeric attribute schema an choice
]);
*/

export const findingSchema = z.object({
  name: z.string().max(75),
  description: z.string().max(500).optional(),
  attributes: z.array(attributesSchema), //TODO: array of attributes
});

//Types
export type BaseAttributeData = z.infer<typeof baseAttributesSchema>;
export type ValuesData = z.infer<typeof valuesSchema>;
export type NumericAttributeData = z.infer<typeof numericAttributesSchema>;
export type ChoiceAttributeData = z.infer<typeof choiceAttributesSchema>;
export type AttributeData = z.infer<typeof attributesSchema>;
export type FindingData = z.infer<typeof findingSchema>;

//classes
export abstract class Attributes<
  T extends BaseAttributeData = BaseAttributeData
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
}

export class ChoiceAttribute extends Attributes<ChoiceAttributeData> {
  get type() {
    return this._data.type;
  }

  get values() {
    return this._data.values;
    //return this._data.values[0].name;
    //need a values object to get the attributes of values?
  }

  get valueNames() {
    return this._data.values;
  }

  /*
  get valueNames() {
    return this._data.values.map((value) => value.name);
    //this will return an array of value.name
  }
  */

  get valueDescriptions() {
    return this._data.values.map((value) => value.description);
    //return array of value.descriptions
  }
}

export class NumericAttribute extends Attributes<NumericAttributeData> {
  get type() {
    return this._data.type;
  }

  get minimum() {
    return this._data.minimum;
  }

  get maximum() {
    return this._data.maximum;
  }
}

export function isNumericAttribute(
  attributeData: AttributeData
): attributeData is NumericAttributeData {
  return 'type' in attributeData && attributeData.type === 'numeric';
}

export function isChoiceAttribute(
  attributeData: AttributeData
): attributeData is ChoiceAttributeData {
  return 'type' in attributeData && attributeData.type === 'choice';
}

export class FindingModel {
  private _data: FindingData;
  private _attributes: AttributeData[] = [];

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

  /*
  get attributeValue() {
    return this._attributes[0];
  }*/
}
