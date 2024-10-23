import { JSONSchema, Schema } from "@effect/schema";
export type specialtyAbbreviations = "AR" | "AB" | "BR" | "CA" | "CH" | "ER" | "GI" | "GU" | "HN" | "IR" | "MI" | "MK" | "NR" | "OB" | "OI" | "OT" | "PD" | "QI" | "RS" | "VA";
export declare const specialtyAbbreviationsSchema: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
export type specialtyName = "Abdominal Radiology" | "Allergy and Immunology" | "Cardiology" | "Critical Care Medicine" | "Dermatology" | "Emergency Medicine" | "Endocrinology" | "Genitourinary Radiology" | "Gastroenterology" | "Geriatrics" | "Hematology" | "Infectious Disease" | "Medical Genetics" | "Nephrology" | "Obstetrics and Gynecology" | "Oncology" | "Otolaryngology" | "Pediatrics" | "Quality Improvement" | "Radiology" | "Vascular Medicine";
export declare const specialtySchema: Schema.Struct<{
    abbreviation: Schema.Union<[Schema.Literal<["AR"]>, Schema.Literal<["AB"]>, Schema.Literal<["BR"]>, Schema.Literal<["CA"]>, Schema.Literal<["CH"]>, Schema.Literal<["ER"]>, Schema.Literal<["GI"]>, Schema.Literal<["GU"]>, Schema.Literal<["HN"]>, Schema.Literal<["IR"]>, Schema.Literal<["MI"]>, Schema.Literal<["MK"]>, Schema.Literal<["NR"]>, Schema.Literal<["OB"]>, Schema.Literal<["OI"]>, Schema.Literal<["OT"]>, Schema.Literal<["PD"]>, Schema.Literal<["QI"]>, Schema.Literal<["RS"]>, Schema.Literal<["VA"]>]>;
    name: Schema.Union<[Schema.Literal<["Abdominal Radiology"]>, Schema.Literal<["Allergy and Immunology"]>, Schema.Literal<["Cardiology"]>, Schema.Literal<["Critical Care Medicine"]>, Schema.Literal<["Dermatology"]>, Schema.Literal<["Emergency Medicine"]>, Schema.Literal<["Genitourinary Radiology"]>, Schema.Literal<["Endocrinology"]>, Schema.Literal<["Gastroenterology"]>, Schema.Literal<["Geriatrics"]>, Schema.Literal<["Hematology"]>, Schema.Literal<["Infectious Disease"]>, Schema.Literal<["Medical Genetics"]>, Schema.Literal<["Nephrology"]>, Schema.Literal<["Obstetrics and Gynecology"]>, Schema.Literal<["Oncology"]>, Schema.Literal<["Otolaryngology"]>, Schema.Literal<["Pediatrics"]>, Schema.Literal<["Quality Improvement"]>, Schema.Literal<["Radiology"]>, Schema.Literal<["Vascular Medicine"]>]>;
}>;
export type SpecialtyType = Schema.Schema.Type<typeof specialtySchema>;
export declare class Specialty {
    abbreviation: specialtyAbbreviations;
    name: specialtyName;
    constructor(inData: SpecialtyType);
    getAbbreviation(): specialtyAbbreviations;
    getName(): specialtyName;
}
export declare const versionSchema: Schema.Struct<{
    number: typeof Schema.Number;
    date: Schema.filter<Schema.Schema<string, string, never>>;
}>;
export type VersionType = Schema.Schema.Type<typeof versionSchema>;
export declare class Version {
    readonly number: number;
    readonly date: string;
    constructor(number: number, date: string);
}
export declare const schemaVersionSchema: Schema.filter<Schema.Schema<string, string, never>>;
export declare const setVersionSchema: Schema.Struct<{
    number: typeof Schema.Number;
    date: typeof Schema.String;
}>;
export type SetVersionType = Schema.Schema.Type<typeof setVersionSchema>;
export declare const setVersionJSONSchema: JSONSchema.JsonSchema7Root;
export type StatusOptions = "Proposed" | "Published" | "Retired";
export declare const statusSchema: Schema.Struct<{
    date: Schema.filter<Schema.Schema<string, string, never>>;
    name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
}>;
export type StatusType = Schema.Schema.Type<typeof statusSchema>;
export declare class Status {
    date: string;
    name: StatusOptions | undefined;
    constructor(date: string, name: StatusOptions);
}
export declare const eventSchema: Schema.Struct<{
    date: Schema.filter<Schema.Schema<string, string, never>>;
    status: Schema.Struct<{
        date: Schema.filter<Schema.Schema<string, string, never>>;
        name: Schema.optional<Schema.Union<[Schema.Literal<["Proposed"]>, Schema.Literal<["Published"]>, Schema.Literal<["Retired"]>]>>;
    }>;
}>;
export type EventType = Schema.Schema.Type<typeof eventSchema>;
export declare class Event {
    date: string;
    status: StatusType;
    constructor(inData: EventType);
}
export type RoleOptions = "Author" | "Sponsor" | "Translator" | "Reviewer" | "Contributor";
declare const organizationSchema: Schema.Struct<{
    name: typeof Schema.String;
    url: Schema.optional<typeof Schema.String>;
    abbreviation: Schema.optional<typeof Schema.String>;
    comment: Schema.optional<typeof Schema.String>;
    role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
}>;
export type OrganizationType = Schema.Schema.Type<typeof organizationSchema>;
export declare class Organization {
    name: string;
    url: string | undefined;
    abbreviation: string | undefined;
    comment: string | undefined;
    role: RoleOptions | undefined;
    constructor(inData: OrganizationType);
}
declare const personSchema: Schema.Struct<{
    name: typeof Schema.String;
    email: typeof Schema.String;
    affiliation: Schema.optional<typeof Schema.String>;
    orcidId: Schema.optional<typeof Schema.String>;
    url: Schema.optional<typeof Schema.String>;
    role: Schema.optional<Schema.Union<[Schema.Literal<["Author"]>, Schema.Literal<["Sponsor"]>, Schema.Literal<["Translator"]>, Schema.Literal<["Reviewer"]>, Schema.Literal<["Contributor"]>]>>;
}>;
export type PersonType = Schema.Schema.Type<typeof personSchema>;
export declare class Person {
    name: string;
    email: string;
    affiliation: string | undefined;
    orcidId: string | undefined;
    url: string | undefined;
    role: RoleOptions | undefined;
    constructor(inData: PersonType);
}
export declare const contributorsSchema: Schema.Struct<{
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
}>;
export type ContributorsType = Schema.Schema.Type<typeof contributorsSchema>;
export declare class Contributors {
    people: PersonType[];
    organizations: OrganizationType[];
    constructor(inData: ContributorsType);
}
export declare const indexCodesSchema: Schema.Struct<{
    system: typeof Schema.String;
    code: typeof Schema.String;
    display: typeof Schema.String;
    url: typeof Schema.String;
}>;
export type IndexCodesType = Schema.Schema.Type<typeof indexCodesSchema>;
export declare class IndexCodes {
    system: string;
    code: string;
    display: string;
    url: string;
    constructor(inData: IndexCodesType);
}
export declare const referencesSchema: Schema.Struct<{
    citation: typeof Schema.String;
    doi_url: typeof Schema.String;
    pubmed_id: typeof Schema.String;
}>;
export type ReferencesType = Schema.Schema.Type<typeof referencesSchema>;
export declare class References {
    citation: string;
    doi_url: string;
    pubmed_id: string;
    constructor(inData: ReferencesType);
}
export {};
//# sourceMappingURL=common.d.ts.map