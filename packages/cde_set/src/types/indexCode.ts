import { z } from 'zod';

export const indexCodeSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string().optional(),
  href: z.string().optional(), //add .url() to format only to URL?
});

export type IndexCodeData = z.infer<typeof indexCodeSchema>;

export class IndexCode {
  private _data: IndexCodeData;

  constructor(inData: IndexCodeData) {
    this._data = { ...inData };
  }

  get code() {
    return this._data.code;
  }

  get system() {
    return this._data.system;
  }

  get display() {
    return this._data.display;
  }

  get href() {
    return this._data.href;
  }
}
