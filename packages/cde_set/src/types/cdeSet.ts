import { z } from 'zod';

import { bodyPartSchema } from './bodyPart';
import {
  elementSchema,
  // floatElementSchema,
  // valueSetElementSchema,
} from './cdElement';
import { indexCodeSchema } from './indexCode';
import { Organization, Person, authorSchema } from './author';
import { specialtySchema, versionSchema } from './shared';

// import { referenceSchema } from './referencesSchema';

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
  //history:
  specialty: z.array(specialtySchema),
  elements: z.array(elementSchema),
  // TODO: add elements schema - and have multiple schemas for the four different types of elements
});

export type CdeSetData = z.infer<typeof cdeSetSchema>;

export class CdeSet {
  private _data: CdeSetData;
  private _authors: (Person | Organization)[] = [];

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

    // TODO: add elements
    // this._elements = this._data.elements.map((elementData) => {
    //   return new FloatElement(elementData);
    // });
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

  get indexCodes() {
    // should we convert this to the IndexCode class?
    return this._data.index_codes;
  }

  get bodyParts() {
    return this._data.body_parts;
  }

  get authors() {
    return [...this._authors];
  }

  // TODO: add elements
  // get elements() {
  //   return [...this._elements];
  // }
}
