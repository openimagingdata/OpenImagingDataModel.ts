import { z } from 'zod';

import { IndexCode, indexCodeSchema } from './indexCode';

export const bodyPartSchema = z.object({
  name: z.string(),
  index_codes: indexCodeSchema.optional(),
});

export type BodyPartData = z.infer<typeof bodyPartSchema>;

export class BodyPart {
  private _data: BodyPartData;

  private _indexCode: IndexCode | undefined;

  constructor(inData: BodyPartData) {
    this._data = { ...inData };
    if (this._data.index_codes) {
      this._indexCode = new IndexCode(this._data.index_codes);
    }
  }

  get name() {
    return this._data.name;
  }

  get indexCode() {
    return this._indexCode;
  }
}
