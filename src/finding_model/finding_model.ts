import { Schema } from '@effect/schema';
import { Either } from 'effect';
// ChoiceValue model
const choiceValueSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.optional(Schema.String),
});

// ChoiceAttribute model
export const choiceAttributeSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.optional(Schema.String),
  type: Schema.Literal('choice'),
  values: Schema.Array(choiceValueSchema),
});

// NumericAttribute model
export const numericAttributeSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.optional(Schema.String),
  type: Schema.Literal('numeric'),
  minimum: Schema.optional(Schema.Number),
  maximum: Schema.optional(Schema.Number), // TODO need be make nullable.
  unit: Schema.optional(Schema.String),
});

export const attributeSchema = Schema.Union(
  choiceAttributeSchema,
  numericAttributeSchema,
);

// FindingModel schema
export const findingModelSchema = Schema.Struct({
  name: Schema.String,
  description: Schema.String,
  attributes: Schema.Array(attributeSchema), //This needs to be a union of choice and numeric not attruibuteTypeSchema
});

// Types from schemas
export type ChoiceValueType = Schema.Schema.Type<typeof choiceValueSchema>;
export type ChoiceAttributeType = Schema.Schema.Type<
  typeof choiceAttributeSchema
>;
export type NumericAttributeType = Schema.Schema.Type<
  typeof numericAttributeSchema
>;
export type Attribute = Schema.Schema.Type<typeof attributeSchema>;
export type FindingModelType = Schema.Schema.Type<typeof findingModelSchema>;

//Classes
class ChoiceValue {
  name: string;
  description?: string;
  constructor(inData: ChoiceValueType) {
    this.name = inData.name;
    this.description = inData.description;
  }
}

export class choiceAttributes {
  name: string;
  description?: string;
  type: 'choice';
  values: ChoiceValueType[];
  constructor(inData: ChoiceAttributeType) {
    this.name = inData.name;
    this.values = inData.values.map((value) => new ChoiceValue(value));
    this.description = inData.description;
    this.type = 'choice';
  }
}

class NumericAttribute {
  name: string;
  description?: string;
  type: 'numeric';
  minimum?: number;
  maximum?: number;
  unit?: string;
  constructor(inData: NumericAttributeType) {
    this.name = inData.name;
    this.minimum = inData.minimum;
    this.maximum = inData.maximum;
    this.unit = inData.unit;
    this.description = inData.description;
    this.type = 'numeric';
  }
}

export class FindingModel {
  name: string;
  description: string;
  attributes: Attribute[];
  constructor(inData: FindingModelType) {
    this.name = inData.name;
    this.description = inData.description;
    this.attributes = inData.attributes.map((attribute) => {
      if (attribute.type === 'choice') {
        return new choiceAttributes(attribute);
      } else {
        return new NumericAttribute(attribute);
      }
    });
  }

  static serialize = (
    inData: FindingModelType | FindingModel,
  ): string | null => {
    // Check if inData is an instance of FindingModel and extract _data if so
    let dataToSerialize: FindingModelType;
    if (inData instanceof FindingModel) {
      dataToSerialize = inData;
    } else {
      dataToSerialize = inData;
    }

    // Serialize the data
    const encodedData =
      Schema.encodeEither(findingModelSchema)(dataToSerialize);
    if (Either.isRight(encodedData)) {
      const encodedDataRight = encodedData.right;
      const serializedData = JSON.stringify(encodedDataRight, null, 2);
      return serializedData;
    } else {
      console.error('Serialization failed:', encodedData.left);
      return null;
    }
  };

  static deserialize = (inData: string | object) => {
    let parsedData;

    if (typeof inData === 'string') {
      parsedData = JSON.parse(inData);
    } else {
      parsedData = inData;
    }

    const decode = Schema.decodeUnknownEither(findingModelSchema);
    const decodedData = decode(parsedData);

    if (Either.isRight(decodedData)) {
      const decodedDataRight = decodedData.right;
      return new FindingModel(decodedDataRight);
    } else {
      console.error('Decoding failed:', decodedData.left);
      return null;
    }
  };
}
