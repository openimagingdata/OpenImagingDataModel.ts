import { Schema } from "@effect/schema";
// ChoiceValue model
const choiceValueSchema = Schema.Struct({
    name: Schema.String,
    description: Schema.optional(Schema.String),
});
// ChoiceAttribute model
export const choiceAttributeSchema = Schema.Struct({
    name: Schema.String,
    description: Schema.optional(Schema.String),
    type: Schema.Literal("choice"),
    values: Schema.Array(choiceValueSchema),
});
// NumericAttribute model
export const numericAttributeSchema = Schema.Struct({
    name: Schema.String,
    description: Schema.optional(Schema.String),
    type: Schema.Literal("numeric"),
    minimum: Schema.optional(Schema.Number),
    maximum: Schema.optional(Schema.Number), // TODO need be make nullable.
    unit: Schema.optional(Schema.String),
});
export const attributeSchema = Schema.Union(choiceAttributeSchema, numericAttributeSchema);
// FindingModel schema
export const findingModelSchema = Schema.Struct({
    name: Schema.String,
    description: Schema.String,
    attributes: Schema.Array(attributeSchema), //This needs to be a union of choice and numeric not attruibuteTypeSchema
});
//Classes
class ChoiceValue {
    name;
    description;
    constructor(inData) {
        this.name = inData.name;
        this.description = inData.description;
    }
}
export class choiceAttributes {
    name;
    description;
    type;
    values;
    constructor(inData) {
        this.name = inData.name;
        this.values = inData.values.map((value) => new ChoiceValue(value));
        this.description = inData.description;
        this.type = "choice";
    }
}
class NumericAttribute {
    name;
    description;
    type;
    minimum;
    maximum;
    unit;
    constructor(inData) {
        this.name = inData.name;
        this.minimum = inData.minimum;
        this.maximum = inData.maximum;
        this.unit = inData.unit;
        this.description = inData.description;
        this.type = "numeric";
    }
}
export class FindingModel {
    name;
    description;
    attributes;
    constructor(inData) {
        this.name = inData.name;
        this.description = inData.description;
        this.attributes = inData.attributes.map((attribute) => {
            if (attribute.type === "choice") {
                return new choiceAttributes(attribute);
            }
            else {
                return new NumericAttribute(attribute);
            }
        });
    }
}
//# sourceMappingURL=finding_model.js.map