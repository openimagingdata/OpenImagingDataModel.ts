import { z } from 'zod';

import { bodyPartSchema } from './bodyPart';
import { floatElementSchema, valueSetElementSchema } from './cdElement';
import { indexCodeSchema } from './indexCode';
import { authorSchema } from './authorSchema';
import { specialtySchema } from './shared';
import { referenceSchema } from './referencesSchema';

const versionSchema = z.object({
  name: z.string(),
  version_date: z.string(), // TODO: add format validation "00/00/0000"
  status: z.enum(['Proposed', 'Published', 'Retired']),
});

export const cdeSetSchema = z.object({
  id: z.string(), // TODO: add format validation
  name: z.string().length(5),
  description: z.string().length(10),
  version: versionSchema,
  url: z.string().url(),
  index_codes: z.array(indexCodeSchema),
  body_parts: z.array(bodyPartSchema),
  authors: z.array(authorSchema),
  //history: 
  specialty: z.array(specialtySchema),
  elements: z.array(
    // TODO: add elements schema - and have multiple schemas for the four different types of elements
    z.union([valueSetElementSchema, floatElementSchema])
  ),
  references: z.array(referenceSchema)
});

export type CdeSetData = z.infer<typeof cdeSetSchema>;

export class CdeSet {
  private _data: CdeSetData;

  // TODO: add elements
  // private _elements: FloatElement[];

  constructor(inData: CdeSetData) {
    this._data = { ...inData };
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

  // TODO: add elements
  // get elements() {
  //   return [...this._elements];
  // }
}
