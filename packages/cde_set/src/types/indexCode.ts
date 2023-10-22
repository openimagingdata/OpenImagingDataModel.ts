import { z } from 'zod';

export const indexCodeSchema = z.object({
  system: z.enum(['RADLEX', 'SNOMEDCT', 'LOINC']),
  code: z.string(),
  display: z.string().optional(),
  href: z.string().url().optional(),
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
