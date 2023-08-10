import { z } from 'zod';

export const statusField = z.enum(['Proposed', 'Published', 'Retired']);

const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

export const versionSchema = z.object({
  name: z.string(),
  version_date: z.string().datetime(),
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

export const cdeEventSchema = z.object({
  date: z.string().datetime(),
  status: statusField,
});

export type CdeEventData = z.infer<typeof cdeEventSchema>;
export type SpecialtyData = z.infer<typeof specialtySchema>;
export type VersionData = z.infer<typeof versionSchema>;
