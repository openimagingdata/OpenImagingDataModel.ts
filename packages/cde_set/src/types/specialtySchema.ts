import { z } from 'zod';

export const specialtySchema = z.object({
  name: z.string(),
  abbreviation: z.enum([
    'BR',
    'BQ',
    'CA',
    'CH',
    'ER',
    'GI',
    'GU',
    'HN',
    'IR',
    'MI',
    'MK',
    'NR',
    'OB',
    'OI',
    'OT',
    'PD',
    'QI',
    'RS',
    'VA',
    'CT',
    'MR',
    'NM',
    'US',
    'AI',
    'ED',
    'HP',
    'IN',
    'LM',
    'PH',
    'PR',
    'RO',
    'SQ',
  ]),
});

export type SpecialtyData = z.infer<typeof specialtySchema>;

export class Specialty {
  private _data: SpecialtyData;

  constructor(inData: SpecialtyData) {
    this._data = { ...inData };
  }

  get name() {
    return this._data.name;
  }

  get abbreviation() {
    return this._data.abbreviation;
  }
}
