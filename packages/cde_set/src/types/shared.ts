import { z } from 'zod';

export const statusField = z.enum(['Proposed', 'Published', 'Retired']);

const datePattern = /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/;

export const versionSchema = z.object({
  name: z.string(),
  version_date: z.string().regex(datePattern),
  status_date: z.string().regex(datePattern).optional(),
  status: statusField,
});

export const specialtySchema = z.object({
  name: z.string(),
  abbreviation: z.enum([
    'BR',
    'BQ',
    'CA',
    'CH',
    'ER',
    'GI',
    'GU',
    'HN',
    'IR',
    'MI',
    'MK',
    'NR',
    'OB',
    'OI',
    'OT',
    'PD',
    'QI',
    'RS',
    'VA',
    'CT',
    'MR',
    'NM',
    'US',
    'AI',
    'ED',
    'HP',
    'IN',
    'LM',
    'PH',
    'PR',
    'RO',
    'SQ',
  ]),
});

export const eventSchema = z.object({
  date: z.string().regex(datePattern),
  status: statusField,
});

export const personSchema = z.object({
  name: z.string().optional().nullable(),
  orcid_id: z.string().optional().nullable(),
  twitter_handle: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  role: z
    .enum(['author', 'editor', 'translator', 'reviewer', 'contributor'])
    .optional()
    .nullable(),
});

export const organizationSchema = z.object({
  name: z.string().optional().nullable(),
  abbreviation: z.string().nullable(),
  url: z.string().optional().nullable(),
  comment: z.string().optional().nullable(),
  role: z
    .enum(['author', 'sponsor', 'translator', 'reviewer', 'contributor'])
    .optional()
    .nullable(),
});

export const authorSchema = z.object({
  person: z.array(personSchema).optional().nullable(),
  organization: z.array(organizationSchema).optional().nullable(),
});

export const referenceSchema = z.object({
  citation: z.string(),
  doi_url: z.string().url().optional(),
  pubmed_id: z.string().url().optional(),
  url: z.string().url().optional(),
});

export type EventData = z.infer<typeof eventSchema>;
export type SpecialtyData = z.infer<typeof specialtySchema>;
export type VersionData = z.infer<typeof versionSchema>;
export type PersonData = z.infer<typeof personSchema>;
export type OrganizationData = z.infer<typeof organizationSchema>;
export type AuthorData = z.infer<typeof authorSchema>;
export type ReferenceData = z.infer<typeof referenceSchema>;

export class Person {
  private _data: PersonData;

  constructor(inData: PersonData) {
    this._data = { ...inData };
  }

  get name() {
    return this._data.name;
  }

  get orcidId() {
    return this._data.orcid_id;
  }

  get twitterHandle() {
    return this._data.twitter_handle;
  }

  get url() {
    return this._data.url;
  }

  get role() {
    return this._data.role;
  }
}

export class Organization {
  private _data: OrganizationData;

  constructor(inData: OrganizationData) {
    this._data = { ...inData };
  }

  get name() {
    return this._data.name;
  }

  get abbreviation() {
    return this._data.abbreviation;
  }

  get url() {
    return this._data.url;
  }

  get comment() {
    return this._data.comment;
  }

  get role() {
    return this._data.role;
  }
}
