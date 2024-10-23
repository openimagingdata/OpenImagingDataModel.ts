import { JSONSchema, Schema } from "@effect/schema";
export const specialtyAbbreviationsSchema = Schema.Union(Schema.Literal("AR"), Schema.Literal("AB"), Schema.Literal("BR"), Schema.Literal("CA"), Schema.Literal("CH"), Schema.Literal("ER"), Schema.Literal("GI"), Schema.Literal("GU"), Schema.Literal("HN"), Schema.Literal("IR"), Schema.Literal("MI"), Schema.Literal("MK"), Schema.Literal("NR"), Schema.Literal("OB"), Schema.Literal("OI"), Schema.Literal("OT"), Schema.Literal("PD"), Schema.Literal("QI"), Schema.Literal("RS"), Schema.Literal("VA"));
const specialtyNameSchema = Schema.Union(Schema.Literal("Abdominal Radiology"), Schema.Literal("Allergy and Immunology"), Schema.Literal("Cardiology"), Schema.Literal("Critical Care Medicine"), Schema.Literal("Dermatology"), Schema.Literal("Emergency Medicine"), Schema.Literal("Genitourinary Radiology"), Schema.Literal("Endocrinology"), Schema.Literal("Gastroenterology"), Schema.Literal("Geriatrics"), Schema.Literal("Hematology"), Schema.Literal("Infectious Disease"), Schema.Literal("Medical Genetics"), Schema.Literal("Nephrology"), Schema.Literal("Obstetrics and Gynecology"), Schema.Literal("Oncology"), Schema.Literal("Otolaryngology"), Schema.Literal("Pediatrics"), Schema.Literal("Quality Improvement"), Schema.Literal("Radiology"), Schema.Literal("Vascular Medicine"));
export const specialtySchema = Schema.Struct({
    abbreviation: specialtyAbbreviationsSchema,
    name: specialtyNameSchema,
});
export class Specialty {
    abbreviation;
    name;
    constructor(inData) {
        this.abbreviation = inData.abbreviation;
        this.name = inData.name;
    }
    getAbbreviation() {
        return this.abbreviation;
    }
    getName() {
        return this.name;
    }
}
export const versionSchema = Schema.Struct({
    number: Schema.Number,
    date: Schema.String.pipe(Schema.pattern(/^\d{4}-\d{2}-\d{2}$/)),
});
export class Version {
    number;
    date;
    constructor(number, date) {
        this.number = number;
        this.date = date;
    }
}
export const schemaVersionSchema = Schema.String.pipe(Schema.pattern(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][0-9a-z-]*))*))?(?:\+([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/i));
export const setVersionSchema = Schema.Struct({
    number: Schema.Number,
    date: Schema.String, //Change to date
});
export const setVersionJSONSchema = JSONSchema.make(setVersionSchema);
// Define a schema for the StatusOptions using string literals
const statusOptionsSchema = Schema.Union(Schema.Literal("Proposed"), Schema.Literal("Published"), Schema.Literal("Retired"));
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
export const statusSchema = Schema.Struct({
    date: Schema.String.pipe(Schema.pattern(datePattern)),
    name: Schema.optional(statusOptionsSchema),
});
export class Status {
    date;
    name;
    constructor(date, name) {
        this.date = date;
        this.name = name;
    }
}
export const eventSchema = Schema.Struct({
    date: Schema.String.pipe(Schema.pattern(datePattern)), // TODO: Add date format pattern
    status: statusSchema,
});
export class Event {
    date;
    status;
    constructor(inData) {
        this.date = inData.date;
        this.status = inData.status;
    }
}
const roleSchema = Schema.Union(Schema.Literal("Author"), Schema.Literal("Sponsor"), Schema.Literal("Translator"), Schema.Literal("Reviewer"), Schema.Literal("Contributor"));
const organizationSchema = Schema.Struct({
    name: Schema.String,
    url: Schema.optional(Schema.String), //TODO: Validate URL???
    abbreviation: Schema.optional(Schema.String),
    comment: Schema.optional(Schema.String),
    role: Schema.optional(roleSchema),
});
export class Organization {
    name;
    url;
    abbreviation;
    comment;
    role;
    constructor(inData) {
        this.name = inData.name;
        this.url = inData.url;
        this.abbreviation = inData.abbreviation;
        this.comment = inData.comment;
        this.role = inData.role;
    }
}
const personSchema = Schema.Struct({
    name: Schema.String,
    email: Schema.String, //No z.string().optional() equivalent in Schema
    affiliation: Schema.optional(Schema.String),
    orcidId: Schema.optional(Schema.String),
    url: Schema.optional(Schema.String),
    role: Schema.optional(roleSchema),
});
export class Person {
    name;
    email;
    affiliation;
    orcidId;
    url;
    role;
    constructor(inData) {
        this.name = inData.name;
        this.email = inData.email;
        this.affiliation = inData.affiliation;
        this.orcidId = inData.orcidId;
        this.url = inData.url;
        this.role = inData.role;
    }
}
export const contributorsSchema = Schema.Struct({
    people: Schema.Array(personSchema),
    organizations: Schema.Array(organizationSchema),
});
export class Contributors {
    people;
    organizations;
    constructor(inData) {
        this.people = inData.people.map((person) => new Person(person));
        this.organizations = inData.organizations.map((organization) => new Organization(organization));
    }
}
export const indexCodesSchema = Schema.Struct({
    system: Schema.String, //TODO: ENUM?
    code: Schema.String, //TODO: add regex
    display: Schema.String,
    url: Schema.String,
});
export class IndexCodes {
    system;
    code;
    display;
    url;
    constructor(inData) {
        this.system = inData.system;
        this.code = inData.code;
        this.display = inData.display;
        this.url = inData.url;
    }
}
export const referencesSchema = Schema.Struct({
    citation: Schema.String,
    doi_url: Schema.String, //TODO: Validate URL???
    pubmed_id: Schema.String,
});
export class References {
    citation;
    doi_url;
    pubmed_id;
    constructor(inData) {
        this.citation = inData.citation;
        this.doi_url = inData.doi_url;
        this.pubmed_id = inData.pubmed_id;
    }
}
//# sourceMappingURL=common.js.map