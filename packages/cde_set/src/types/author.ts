import { z } from 'zod';

export const personSchema = z.object({
  name: z.string(),
  orcid_id: z.string().optional(),
  twitter_handle: z.string().optional(),
  url: z.string().optional(),
  role: z
    .enum(['author', 'editor', 'translator', 'reviewer', 'contributor'])
    .optional(),
});

export type PersonData = z.infer<typeof personSchema>;

export class Person {
  private _data: PersonData;

  constructor(inData: PersonData) {
    this._data = { ...inData };
  }

  get name() {
    return this._data.name;
  }

  /**
   * Returns the ORCID ID of the person.
   * @returns {string} The ORCID ID of the person.
   */
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
export const organizationSchema = z.object({
  name: z.string(),
  abbreviation: z.string().optional(),
  url: z.string().optional(),
  comment: z.string().optional(),
  role: z
    .enum(['author', 'sponsor', 'translator', 'reviewer', 'contributor'])
    .optional(),
});

//TODO: Need instances of organization and person to create author class
//TODO: Create organization class
//TODO: Import person class from person.ts
//TODO: Create Author class
//TODO: Within Author need: _data, person, organization
//TODO: Create instances of person and organization from _data.person, _data.organization

export type OrganizationData = z.infer<typeof organizationSchema>;

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

export const authorSchema = z.object({
  person: z.array(personSchema),
  organization: z.array(organizationSchema),
});

export type AuthorData = z.infer<typeof authorSchema>;
