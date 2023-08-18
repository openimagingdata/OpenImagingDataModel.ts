import { z } from 'zod';

export const statusField = z.enum(['Proposed', 'Published', 'Retired']);

const datePattern = /^\d{1,2}[-\/]\d{1,2}[-\/]d{4}$/;

export const versionSchema = z.object({
  name: z.string(),
  version_date: z.string().regex(datePattern),
  status: statusField,
});

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

export const eventSchema = z.object({
  date: z.string().regex(datePattern),
  status: statusField,
});

export type EventData = z.infer<typeof eventSchema>;
export type SpecialtyData = z.infer<typeof specialtySchema>;
export type VersionData = z.infer<typeof versionSchema>;

export class Specialty {
  private _data: SpecialtyData;

  constructor(_inData: SpecialtyData) {
    this._data = { ..._inData };
  }

  get name() {
    return this._data.name;
  }

  get abbreviation() {
    return this._data.abbreviation;
  }
}

export class Version {
  private _data: VersionData;

  constructor(_inData: VersionData) {
    this._data = { ..._inData };
  }

  get name() {
    return this._data.name;
  }

  get version_date() {
    return this._data.version_date;
  }

  get status() {
    return this._data.status;
  }
}
