import { z } from 'zod';

import { bodyPartSchema } from './bodyPart';
import { floatElementSchema, valueSetElementSchema } from './cdElement';
import { indexCodeSchema } from './indexCode';

export const cdeSetSchema = z.object({
  data: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    index_codes: z.array(indexCodeSchema), // TODO: add index codes schema
    body_parts: z.array(bodyPartSchema), // TODO: add body parts schema
    elements: z.array(
      // TODO: add elements schema - and have multiple schemas for the four different types of elements
      z.union([valueSetElementSchema, floatElementSchema])
    ),
  }),
});

export type CdeSetData = z.infer<typeof cdeSetSchema>;

export class CdeSet {
  private _data: CdeSetData;

  // TODO: add elements
  // private _elements: FloatElement[];

  constructor(inData: CdeSetData) {
    this._data = { ...inData };
    // TODO: add elements
    // this._elements = this._data.data.elements.map((elementData) => {
    //   return new FloatElement(elementData);
    // });
  }

  get id() {
    return this._data.data.id;
  }

  get name() {
    return this._data.data.name;
  }

  get description() {
    return this._data.data.description;
  }

  get indexCodes() {
    // should we convert this to the IndexCode class?
    return this._data.data.index_codes;
  }

  get bodyParts() {
    return this._data.data.body_parts;
  }

  // TODO: add elements
  // get elements() {
  //   return [...this._elements];
  // }
}
