import { type VersionType, type StatusType, type EventType, type ContributorsType, type IndexCodesType, type ReferencesType, type SpecialtyType } from "./common.js";
import { Schema } from "@effect/schema";
export declare const cdElementBaseSchema: Schema.Struct<{
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>;
export type cdElementBaseType = Schema.Schema.Type<typeof cdElementBaseSchema>;
export declare class BaseElement {
    id: string;
    parent_set: string;
    name: string;
    definition: string | undefined;
    elementVersion: VersionType;
    schemaVersion: string;
    status: StatusType;
    question: string | undefined;
    indexCodes: IndexCodesType[] | undefined;
    contributors: ContributorsType | undefined;
    specialty: SpecialtyType[] | undefined;
    history: EventType[] | undefined;
    references: ReferencesType[] | undefined;
    constructor(inData: cdElementBaseType);
}
export declare const valueSetValueSchema: Schema.Struct<{
    code: typeof Schema.String;
    value: Schema.optional<typeof Schema.String>;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
}>;
export type ValueSetValueType = Schema.Schema.Type<typeof valueSetValueSchema>;
export declare class ValueSetValue {
    code: string;
    name: string;
    definition: string | undefined;
    value: string | undefined;
    indexCodes: IndexCodesType[] | undefined;
    constructor(inData: ValueSetValueType);
}
export declare const valueSetSchema: Schema.Struct<{
    min_cardinality: typeof Schema.Number;
    max_cardinality: typeof Schema.Number;
    values: Schema.Array$<Schema.Struct<{
        code: typeof Schema.String;
        value: Schema.optional<typeof Schema.String>;
        name: typeof Schema.String;
        definition: Schema.optional<typeof Schema.String>;
        index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
            system: typeof Schema.String;
            code: typeof Schema.String;
            display: typeof Schema.String;
            url: typeof Schema.String;
        }>>>;
    }>>;
}>;
export type ValueSetType = Schema.Schema.Type<typeof valueSetSchema>;
export declare class ValueSet {
    minCardinality: number;
    maxCardinality: number;
    values: ValueSetValueType[];
    constructor(inData: ValueSetType);
    modelValidate(inData: ValueSetType): {
        readonly values: readonly {
            readonly name: string;
            readonly value?: string | undefined;
            readonly code: string;
            readonly definition?: string | undefined;
            readonly index_codes?: readonly {
                readonly url: string;
                readonly system: string;
                readonly code: string;
                readonly display: string;
            }[] | undefined;
        }[];
        readonly min_cardinality: number;
        readonly max_cardinality: number;
    };
}
export declare const valueSetElementSchema: Schema.Struct<{
    value_set: Schema.Struct<{
        min_cardinality: typeof Schema.Number;
        max_cardinality: typeof Schema.Number;
        values: Schema.Array$<Schema.Struct<{
            code: typeof Schema.String;
            value: Schema.optional<typeof Schema.String>;
            name: typeof Schema.String;
            definition: Schema.optional<typeof Schema.String>;
            index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
                system: typeof Schema.String;
                code: typeof Schema.String;
                display: typeof Schema.String;
                url: typeof Schema.String;
            }>>>;
        }>>;
    }>;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>;
export type ValueSetElementType = Schema.Schema.Type<typeof valueSetElementSchema>;
export declare class ValueSetElement extends BaseElement {
    private _data;
    value_set: ValueSetType;
    constructor(inData: ValueSetElementType);
    get valueSet(): {
        readonly values: readonly {
            readonly name: string;
            readonly value?: string | undefined;
            readonly code: string;
            readonly definition?: string | undefined;
            readonly index_codes?: readonly {
                readonly url: string;
                readonly system: string;
                readonly code: string;
                readonly display: string;
            }[] | undefined;
        }[];
        readonly min_cardinality: number;
        readonly max_cardinality: number;
    };
}
export declare const integerValueSchema: Schema.Struct<{
    min_value: Schema.optional<typeof Schema.Number>;
    max_value: Schema.optional<typeof Schema.Number>;
    step: Schema.optional<typeof Schema.Number>;
    unit: Schema.optional<typeof Schema.String>;
}>;
export type IntegerValueType = Schema.Schema.Type<typeof integerValueSchema>;
export declare const integerElementSchema: Schema.Struct<{
    integer_value: Schema.Struct<{
        min_value: Schema.optional<typeof Schema.Number>;
        max_value: Schema.optional<typeof Schema.Number>;
        step: Schema.optional<typeof Schema.Number>;
        unit: Schema.optional<typeof Schema.String>;
    }>;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>;
export type IntegerElementType = Schema.Schema.Type<typeof integerElementSchema>;
export declare class IntegerValue {
    min_value: number | undefined;
    max_value: number | undefined;
    step: number | undefined;
    unit: string | undefined;
    constructor(inData: IntegerValueType);
}
export declare class IntegerElement extends BaseElement {
    integerValue: IntegerValueType;
    constructor(inData: IntegerElementType);
}
export declare const floatValueSchema: Schema.Struct<{
    min_value: Schema.optional<typeof Schema.Number>;
    max_value: Schema.optional<typeof Schema.Number>;
    step: Schema.optional<typeof Schema.Number>;
    unit: Schema.optional<typeof Schema.String>;
}>;
export type FloatValueType = Schema.Schema.Type<typeof floatValueSchema>;
export declare class FloatValue {
    min_value: number | undefined;
    max_value: number | undefined;
    step: number | undefined;
    unit: string | undefined;
    constructor(inData: FloatValueType);
}
export declare const floatElementSchema: Schema.Struct<{
    float_value: Schema.Struct<{
        min_value: Schema.optional<typeof Schema.Number>;
        max_value: Schema.optional<typeof Schema.Number>;
        step: Schema.optional<typeof Schema.Number>;
        unit: Schema.optional<typeof Schema.String>;
    }>;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>;
export type FloatElementType = Schema.Schema.Type<typeof floatElementSchema>;
export declare class FloatElement extends BaseElement {
    floatValue: FloatValueType;
    constructor(inData: FloatElementType);
}
export declare const booleanElementSchema: Schema.Struct<{
    boolean_value: typeof Schema.String;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>;
export type BooleanElementType = Schema.Schema.Type<typeof booleanElementSchema>;
export declare class BooleanElement extends BaseElement {
    booleanValue: string;
    constructor(inData: BooleanElementType);
}
export declare const elementUnionSchema: Schema.Union<[Schema.Struct<{
    value_set: Schema.Struct<{
        min_cardinality: typeof Schema.Number;
        max_cardinality: typeof Schema.Number;
        values: Schema.Array$<Schema.Struct<{
            code: typeof Schema.String;
            value: Schema.optional<typeof Schema.String>;
            name: typeof Schema.String;
            definition: Schema.optional<typeof Schema.String>;
            index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
                system: typeof Schema.String;
                code: typeof Schema.String;
                display: typeof Schema.String;
                url: typeof Schema.String;
            }>>>;
        }>>;
    }>;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>, Schema.Struct<{
    integer_value: Schema.Struct<{
        min_value: Schema.optional<typeof Schema.Number>;
        max_value: Schema.optional<typeof Schema.Number>;
        step: Schema.optional<typeof Schema.Number>;
        unit: Schema.optional<typeof Schema.String>;
    }>;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>, Schema.Struct<{
    float_value: Schema.Struct<{
        min_value: Schema.optional<typeof Schema.Number>;
        max_value: Schema.optional<typeof Schema.Number>;
        step: Schema.optional<typeof Schema.Number>;
        unit: Schema.optional<typeof Schema.String>;
    }>;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>, Schema.Struct<{
    boolean_value: typeof Schema.String;
    id: typeof Schema.String;
    parent_set: typeof Schema.String;
    name: typeof Schema.String;
    definition: Schema.optional<typeof Schema.String>;
    element_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>;
    schema_version: typeof Schema.String;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
    question: Schema.optional<typeof Schema.String>;
    index_codes: Schema.optional<Schema.Array$<Schema.Struct<{
        system: typeof Schema.String;
        code: typeof Schema.String;
        display: typeof Schema.String;
        url: typeof Schema.String;
    }>>>;
    contributors: Schema.optional<Schema.Struct<{
        people: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            email: typeof Schema.String;
            affiliation: Schema.optional<typeof Schema.String>;
            orcidId: Schema.optional<typeof Schema.String>;
            url: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
        organizations: Schema.Array$<Schema.Struct<{
            name: typeof Schema.String;
            url: Schema.optional<typeof Schema.String>;
            abbreviation: Schema.optional<typeof Schema.String>;
            comment: Schema.optional<typeof Schema.String>;
            role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
        }>>;
    }>>;
    specialty: Schema.optional<Schema.Array$<Schema.Struct<{
        abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
        name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
    }>>>;
    history: Schema.optional<Schema.Array$<Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        status: Schema.Struct<{
            date: Schema.filter<Schema.Schema<string, string, never>>;
            name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
        }>;
    }>>>;
    references: Schema.optional<Schema.Array$<Schema.Struct<{
        citation: typeof Schema.String;
        doi_url: typeof Schema.String;
        pubmed_id: typeof Schema.String;
    }>>>;
}>]>;
export type ElementType = Schema.Schema.Type<typeof elementUnionSchema>;
export declare class CdElementFactory {
    static create(inData: unknown): ValueSetElement | IntegerElement | FloatElement | BooleanElement | null;
}
//# sourceMappingURL=cde_element.d.ts.map