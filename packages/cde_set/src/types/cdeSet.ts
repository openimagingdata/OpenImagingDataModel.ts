import { z } from 'zod';

import { bodyPartSchema, BodyPart } from './bodyPart';
import { elementSchema } from './cdElement';
import { indexCodeSchema, IndexCode } from './indexCode';
import {
  specialtySchema,
  versionSchema,
  eventSchema,
  Organization,
  Person,
  authorSchema,
  referenceSchema,
} from './shared';

const idPattern = /^rdes\d{1,2}$/;

export const cdeSetSchema = z.object({
  id: z.string().regex(idPattern, 'Invalid id format'), // TODO: add format validation
  name: z.string().length(5),
  description: z.string().length(10),
  version: versionSchema,
  url: z.string().url(),
  index_codes: z.array(indexCodeSchema),
  body_parts: z.array(bodyPartSchema),
  authors: authorSchema,
  history: z.array(eventSchema),
  specialty: z.array(specialtySchema),
  references: z.array(referenceSchema),
  elements: z.array(elementSchema),
  // TODO: add elements schema - and have multiple schemas for the four different types of elements
});

export type CdeSetData = z.infer<typeof cdeSetSchema>;

export class CdeSet {
  private _data: CdeSetData;
  private _authors: (Person | Organization)[] = []; // Note: not an array in schema/JSON, just an object
  private _index_codes: IndexCode[] = [];
  private _body_parts: BodyPart[] = [];

  // TODO: add elements
  // private _elements: FloatElement[];

  constructor(inData: CdeSetData) {
    this._data = { ...inData };

    // Load authors
    inData.authors.person.forEach((personData) => {
      this._authors.push(new Person(personData));
    });

    inData.authors.organization.forEach((organizationData) => {
      this._authors.push(new Organization(organizationData));
    });

    //Load index codes
    this._data.index_codes.forEach((indexCodeData) => {
      this._index_codes.push(new IndexCode(indexCodeData));
    });

    //load body parts
    this._data.body_parts.forEach((bodyPartData) => {
      this._body_parts.push(new BodyPart(bodyPartData));
    });
    // TODO: add elements
    // this._elements = this._data.elements.map((elementData) => {
    //   return new FloatElement(elementData);
    // });
  }
  //use spread syntax only on iterables, not primative datatypes.

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
