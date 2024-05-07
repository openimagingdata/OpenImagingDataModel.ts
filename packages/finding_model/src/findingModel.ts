import { z } from 'zod';

const valuesSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const typeSchema = z.union([z.literal('choice'), z.literal('numeric')]);

const baseAttributesSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: typeSchema,
});

const numericAttributesSchema = baseAttributesSchema.extend({
  //create type as numeric
  minimum: z.number().nullable(),
  maximum: z.number().nullable(),
});

const choiceAttributesSchema = baseAttributesSchema.extend({
  //tpye: choice literal
  values: z.array(valuesSchema),
});

const attributesSchema = z.union([
  numericAttributesSchema,
  choiceAttributesSchema,
]);

export const findingModelSchema = z.object({
  name: z.string().max(75),
  description: z.string().max(500).optional(),
  attributes: z.array(attributesSchema),
});

//Types
type BaseAttributesData = z.infer<typeof baseAttributesSchema>;
// type ValuesData = z.infer<typeof valuesSchema>;
export type NumericAttributesData = z.infer<typeof numericAttributesSchema>;
export type ChoiceAttributesData = z.infer<typeof choiceAttributesSchema>;
type AttributesData = z.infer<typeof attributesSchema>;
export type FindingModelData = z.infer<typeof findingModelSchema>;

//classes
abstract class Attributes<T extends BaseAttributesData = BaseAttributesData> {
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
  constructor(choiceAttributesData: ChoiceAttributesData) {
    super(choiceAttributesData);
  }

  get values() {
    return this._data.values;
    //return this._data.values[0].name;
    //need a values object to get the attributes of values?
  }
}

export class NumericAttribute extends Attributes<NumericAttributesData> {
  constructor(numericAttributesData: NumericAttributesData) {
    super(numericAttributesData);
  }

  get minimum() {
    return this._data.minimum;
  }

  get maximum() {
    return this._data.maximum;
  }
}

function isNumericAttributeData(
  attributeData: AttributesData
): attributeData is NumericAttributesData {
  return 'type' in attributeData && attributeData.type === 'numeric';
}

function isChoiceAttributeData(
  attributeData: AttributesData
): attributeData is ChoiceAttributesData {
  return 'type' in attributeData && attributeData.type === 'choice';
}

export class FindingModel {
  private _data: FindingModelData;
  private _attributes: AttributesData[] = [];

  constructor(inData: FindingModelData) {
    this._data = { ...inData };

    this._data.attributes.forEach((attributeData) => {
      if (isNumericAttributeData(attributeData)) {
        this._attributes.push(new NumericAttribute(attributeData));
      } else if (isChoiceAttributeData(attributeData)) {
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
