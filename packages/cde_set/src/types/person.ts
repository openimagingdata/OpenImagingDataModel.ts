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
