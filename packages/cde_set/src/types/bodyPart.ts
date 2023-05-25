import { z } from 'zod';

import { IndexCode, indexCodeSchema } from './indexCode';

export const bodyPartSchema = z.object({
  name: z.string(),
  index_codes: z.array(indexCodeSchema).optional(),
});

export type BodyPartData = z.infer<typeof bodyPartSchema>;

export class BodyPart {
  private _data: BodyPartData;

  private _indexCodes: IndexCode[];

  constructor(inData: BodyPartData) {
    this._data = { ...inData };
    if (this._data.index_codes)
      this._indexCodes = this._data.index_codes.map((indexCodeData) => {
        return new IndexCode(indexCodeData);
      });
    else this._indexCodes = [];
  }

  get name() {
    return this._data.name;
  }

  get indexCodes() {
    return [...this._indexCodes];
  }
}
