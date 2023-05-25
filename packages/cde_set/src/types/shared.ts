import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string(),
  abbreviation: z.string().optional(),
  url: z.string().optional(),
  comment: z.string().optional(),
  role: z
    .enum(['author', 'sponsor', 'translator', 'reviewer', 'contributor'])
    .optional(),
});

export const statusField = z.enum(['Proposed', 'Published', 'Retired']);

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
export type OrganizationData = z.infer<typeof organizationSchema>;
export type SpecialtyData = z.infer<typeof specialtySchema>;
export type VersionData = z.infer<typeof versionSchema>;
