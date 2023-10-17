import { z } from 'zod';

//Schemas
export const valuesSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const baseAttributesSchema = z.object({
  name: z.enum(['size', 'location', 'consistency', 'change']),
  description: z.string(),
  type: z.enum(['choice', 'numeric']), //TODO: Other options?
});

export const sizeAttributesSchema = baseAttributesSchema.extend({
  minimum: z.number(), //TODO: Nullable?
  maximum: z.number().nullable(),
});

export const qualitativeAttributesSchema = baseAttributesSchema.extend({
  values: z.array(valuesSchema),
});

export const attributesSchema = z.union([
  sizeAttributesSchema,
  qualitativeAttributesSchema,
]);

export const findingSchema = z.object({
  name: z.string().max(75),
  description: z.string().max(500),
  attributes: z.array(attributesSchema), //TODO: array of attributes
});

//Types
export type BaseAttributesData = z.infer<typeof baseAttributesSchema>;
export type ValuesData = z.infer<typeof valuesSchema>;
export type SizeAttributesData = z.infer<typeof sizeAttributesSchema>;
export type QualitativeAttributesData = z.infer<
  typeof qualitativeAttributesSchema
>;
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

export class QualitativeAttributes extends Attributes<QualitativeAttributesData> {
  get values() {
    return this._data.values;
    //return this._data.values[0].name;
    //need a values object to get the attributes of values?
  }
}

export class SizeAttributes extends Attributes<SizeAttributesData> {
  get minimum() {
    return this._data.minimum;
  }

  get maximum() {
    return this._data.maximum;
  }
}

export function isSizeAttribute(
  attributeData: AttributesData
): attributeData is SizeAttributesData {
  return 'minimum' in attributeData && attributeData.name === 'size';
}

export function isQualitativeAttribute(
  attributeData: AttributesData
): attributeData is QualitativeAttributesData {
  return (
    ('values' in attributeData && attributeData.name === 'location') ||
    attributeData.name === 'consistency' ||
    attributeData.name === 'change'
  );
}

export class Finding {
  private _data: FindingData;
  private _attributes: AttributesData[] = [];

  constructor(inData: FindingData) {
    this._data = { ...inData };

    this._data.attributes.forEach((attributeData) => {
      if (isSizeAttribute(attributeData)) {
        this._attributes.push(new SizeAttributes(attributeData));
      } else if (isQualitativeAttribute(attributeData)) {
        this._attributes.push(new QualitativeAttributes(attributeData));
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
