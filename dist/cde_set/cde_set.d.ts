import { Schema } from "@effect/schema";
import { BaseElement } from "./cde_element.js";
export declare const cdeSetSchema: Schema.Struct<{
    id: typeof Schema.String;
    parent_set: Schema.optional<typeof Schema.String>;
    name: typeof Schema.String;
    description: Schema.optional<typeof Schema.String>;
    element_version: Schema.optional<Schema.Struct<{
        number: typeof Schema.Number;
        date: Schema.filter<Schema.Schema<string, string, never>>;
    }>>;
    schema_version: typeof Schema.String;
    set_version: Schema.Struct<{
        number: typeof Schema.Number;
        date: typeof Schema.String;
    }>;
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
    specialties: Schema.optional<Schema.Array$<Schema.Struct<{
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
    elements: Schema.Array$<Schema.Union<[Schema.Struct<{
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
    }>]>>;
}>;
export type CdeSetType = Schema.Schema.Type<typeof cdeSetSchema>;
export declare class CdeSet {
    private _data;
    private _elements;
    constructor(inData: CdeSetType);
    private initializeElement;
    static serialize: (inData: CdeSetType | CdeSet) => string | null;
    static deserialize: (inData: string | object) => CdeSet | null;
    get id(): string;
    get name(): string;
    get parentSet(): string | undefined;
    get schemaVersion(): string;
    get description(): string | undefined;
    get setVersion(): {
        readonly number: number;
        readonly date: string;
    };
    get status(): {
        readonly name?: "Proposed" | "Published" | "Retired" | undefined;
        readonly date: string;
    };
    get indexCodes(): {
        readonly url: string;
        readonly system: string;
        readonly code: string;
        readonly display: string;
    }[];
    get contributors(): {
        readonly people: readonly {
            readonly name: string;
            readonly url?: string | undefined;
            readonly role?: "Author" | "Sponsor" | "Translator" | "Reviewer" | "Contributor" | undefined;
            readonly email: string;
            readonly affiliation?: string | undefined;
            readonly orcidId?: string | undefined;
        }[];
        readonly organizations: readonly {
            readonly abbreviation?: string | undefined;
            readonly name: string;
            readonly url?: string | undefined;
            readonly comment?: string | undefined;
            readonly role?: "Author" | "Sponsor" | "Translator" | "Reviewer" | "Contributor" | undefined;
        }[];
    } | undefined;
    get history(): {
        readonly date: string;
        readonly status: {
            readonly name?: "Proposed" | "Published" | "Retired" | undefined;
            readonly date: string;
        };
    }[];
    get specialties(): {
        readonly abbreviation: "AR" | "AB" | "BR" | "CA" | "CH" | "ER" | "GI" | "GU" | "HN" | "IR" | "MI" | "MK" | "NR" | "OB" | "OI" | "OT" | "PD" | "QI" | "RS" | "VA";
        readonly name: "Abdominal Radiology" | "Allergy and Immunology" | "Cardiology" | "Critical Care Medicine" | "Dermatology" | "Emergency Medicine" | "Endocrinology" | "Genitourinary Radiology" | "Gastroenterology" | "Geriatrics" | "Hematology" | "Infectious Disease" | "Medical Genetics" | "Nephrology" | "Obstetrics and Gynecology" | "Oncology" | "Otolaryngology" | "Pediatrics" | "Quality Improvement" | "Radiology" | "Vascular Medicine";
    }[];
    get references(): {
        readonly citation: string;
        readonly doi_url: string;
        readonly pubmed_id: string;
    }[];
    get elements(): BaseElement[];
    addElement(element: BaseElement): void;
    static fetchFromRepo(rdesId: string): Promise<CdeSet | null>;
}
//# sourceMappingURL=cde_set.d.ts.map