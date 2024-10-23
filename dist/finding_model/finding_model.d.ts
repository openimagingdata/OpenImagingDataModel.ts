import { Schema } from "@effect/schema";
declare const choiceValueSchema: Schema.Struct<{
    name: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
}>;
export declare const choiceAttributeSchema: Schema.Struct<{
    name: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    type: Schema.Literal<["choice"]>;
    values: Schema.Array$<Schema.Struct<{
        name: typeof Schema.String;
        description: Schema.optional<typeof Schema.String>;
    }>>;
}>;
export declare const numericAttributeSchema: Schema.Struct<{
    name: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    type: Schema.Literal<["numeric"]>;
    minimum: Schema.optional<typeof Schema.Number>;
    maximum: Schema.optional<typeof Schema.Number>;
    unit: Schema.optional<typeof Schema.String>;
}>;
export declare const attributeSchema: Schema.Union<[Schema.Struct<{
    name: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    type: Schema.Literal<["choice"]>;
    values: Schema.Array$<Schema.Struct<{
        name: typeof Schema.String;
        description: Schema.optional<typeof Schema.String>;
    }>>;
}>, Schema.Struct<{
    name: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    type: Schema.Literal<["numeric"]>;
    minimum: Schema.optional<typeof Schema.Number>;
    maximum: Schema.optional<typeof Schema.Number>;
    unit: Schema.optional<typeof Schema.String>;
}>]>;
export declare const findingModelSchema: Schema.Struct<{
    name: typeof Schema.String;
    description: typeof Schema.String;
    attributes: Schema.Array$<Schema.Union<[Schema.Struct<{
        name: typeof Schema.String;
        description: Schema.optional<typeof Schema.String>;
        type: Schema.Literal<["choice"]>;
        values: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            description: Schema.optional<typeof Schema.String>;
        }>>;
    }>, Schema.Struct<{
        name: typeof Schema.String;
        description: Schema.optional<typeof Schema.String>;
        type: Schema.Literal<["numeric"]>;
        minimum: Schema.optional<typeof Schema.Number>;
        maximum: Schema.optional<typeof Schema.Number>;
        unit: Schema.optional<typeof Schema.String>;
    }>]>>;
}>;
export type ChoiceValueType = Schema.Schema.Type<typeof choiceValueSchema>;
export type ChoiceAttributeType = Schema.Schema.Type<typeof choiceAttributeSchema>;
export type NumericAttributeType = Schema.Schema.Type<typeof numericAttributeSchema>;
export type Attribute = Schema.Schema.Type<typeof attributeSchema>;
export type FindingModelType = Schema.Schema.Type<typeof findingModelSchema>;
export declare class choiceAttributes {
    name: string;
    description?: string;
    type: "choice";
    values: ChoiceValueType[];
    constructor(inData: ChoiceAttributeType);
}
export declare class FindingModel {
    name: string;
    description: string;
    attributes: Attribute[];
    constructor(inData: FindingModelType);
}
export {};
//# sourceMappingURL=finding_model.d.ts.map