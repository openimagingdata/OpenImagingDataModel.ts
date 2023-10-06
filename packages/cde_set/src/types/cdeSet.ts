import { z } from 'zod';

import { bodyPartSchema, BodyPart } from './bodyPart';
import { elementSchema, CdElement, CdElementFactory } from './cdElement';
import { indexCodeSchema, IndexCode } from './indexCode';
import {
  specialtySchema,
  versionSchema,
  eventSchema,
  Organization,
  Person,
  authorSchema,
  referenceSchema,
  //Specialty, //TODO: create specialty class in shared
} from './shared';

const idPattern = /^rdes\d{1,3}$/i;

export const cdeSetSchema = z.object({
  id: z.string().regex(idPattern, { message: 'Must be a valid ID' }),
  name: z.string().max(50, { message: 'Must be 50 or fewer characters long' }),
  description: z
    .string()
    .max(50, { message: 'Must be 50 or fewer characters long' }),
  version: versionSchema,
  url: z.string().url(),
  index_codes: z.array(indexCodeSchema),
  body_parts: z.array(bodyPartSchema),
  authors: authorSchema,
  history: z.array(eventSchema),
  specialty: z.array(specialtySchema),
  elements: z.array(elementSchema),
  references: z.array(referenceSchema),
});

export type CdeSetData = z.infer<typeof cdeSetSchema>;

export class CdeSet {
  private _data: CdeSetData;
  private _authors: (Person | Organization)[] = [];
  private _index_codes: IndexCode[] = [];
  private _body_parts: BodyPart[] = [];
  //private _specialty: Specialty[] = [];

  private _elements: CdElement[] = [];

  constructor(inData: CdeSetData) {
    this._data = { ...inData };

    inData.authors.person.forEach((personData) => {
      this._authors.push(new Person(personData));
    });

    inData.authors.organization?.forEach((organizationData) => {
      this._authors.push(new Organization(organizationData));
    });

    //Load index codes
    this._data.index_codes.forEach((indexCodeData) => {
      this._index_codes.push(new IndexCode(indexCodeData));
    });

    this._data.elements.forEach((elementData) => {
      this._elements.push(CdElementFactory.create(elementData));
    });
  }

  get id() {
    return this._data.id;
  }

  get name() {
    return this._data.name;
  }

  get description() {
    return this._data.description;
  }

  get version() {
    return this._data.version;
  }

  get indexCodes() {
    return [...this._index_codes];
  }

  get url() {
    return this._data.url;
  }

  get bodyParts() {
    return [...this._body_parts];
  }

  get authors() {
    return [...this._authors];
  }

  get history() {
    return [...this._data.history];
  }

  get specialty() {
    return [...this._data.specialty];
  }

  get references() {
    return [...this._data.references];
  }

  get elements() {
    return [...this._data.elements];
  }
}
