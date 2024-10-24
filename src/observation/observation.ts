import { z } from 'zod';

// Schemas

export const systemCodeSchema = z.object({
  system: z.string(),
  code: z.string().optional(),
  display: z.string().optional(),
});

export const codeableConceptValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.array(systemCodeSchema).nullable(),
});

export const stringValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.string().nullable(),
});

export const integerValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.number().int().nullable(),
});

export const floatValueSchema = z.object({
  code: z.array(systemCodeSchema),
  value: z.number().nullable(),
});

export const componentSchema = z.union([
  codeableConceptValueSchema,
  stringValueSchema,
  integerValueSchema,
  floatValueSchema,
]);

export const observationSchema = z.object({
  resourceType: z.literal('Observation'),
  id: z.string().optional(),
  code: systemCodeSchema,
  bodySite: z
    .object({
      code: systemCodeSchema,
    })
    .optional(),
  component: z.array(componentSchema),
});

const ObservationFunctionParams = z.object({
  resourceType: z.literal('Observation'),
  id: z.string().optional(),
  code: systemCodeSchema,
  bodySite: z
    .object({
      code: z
        .object({
          system: z.string(),
          code: z.string().optional(),
          display: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  component: z.array(
    z.object({
      code: z.object({
        system: z.string(),
        code: z.string().optional(),
        display: z.string().optional(),
      }),
      value: z.union([z.string(), z.number()]).nullable(),
    }),
  ),
});

export type ObservationResult = z.infer<typeof ObservationFunctionParams>;
