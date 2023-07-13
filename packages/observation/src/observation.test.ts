import { describe, it, expect } from 'vitest';
import { Observation, ObservationData, observationSchema } from './index';

describe('Observation', () => {
  const observationJson: ObservationData = {
    resourceType: 'Observation',
    id: '1',
    code: {
      system: 'http://loinc.org',
      code: '12345-6',
      display: 'Test Observation',
    },
    bodySite: {
      code: {
        system: 'http://snomed.info/sct',
        code: '123456789',
        display: 'Aorta',
      },
    },
    component: [
      {
        code: [
          {
            system: 'http://loinc.org',
            code: '12345-6',
            display: 'Test Observation',
          },
        ],
        valueCodeableConcept: [
          {
            system: 'http://snomed.info/sct',
            code: '123456789',
            display: 'Aorta',
          },
        ],
      },
    ],
  };
  it('should fail to parse empty observation JSON', () => {
    const parsed = observationSchema.safeParse({});
    expect(parsed.success).toBe(false);
    // TODO: Sometime figure out how to get this to work
    // expectTypeOf(parsed).toEqualTypeOf<ZodError<unknown>>();
  });

  it('should parse observation JSON', () => {
    const goodParsed = observationSchema.safeParse(observationJson);
    expect(goodParsed.success).toBe(true);
    if (goodParsed.success) {
      expect(goodParsed.data).toHaveProperty('id', '1');
      expect(goodParsed.data).toHaveProperty('code');
    }
  });

  // Test that we get a CdeSet object back from the Observation
  it('should return a CdeSet object', () => {
    const goodParsed = observationSchema.safeParse(observationJson);
    expect(goodParsed.success).toBe(true);
    if (goodParsed.success) {
      const observation = new Observation(goodParsed.data);
      expect(observation).toHaveProperty('cdeSet');
      expect(observation.cdeSet).toHaveProperty('id', '1');
      expect(observation.cdeSet).toHaveProperty('name', 'Sample CDE Set');
    }
  });
});
