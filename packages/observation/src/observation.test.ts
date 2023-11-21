import { describe, it, expect } from 'vitest';
import { Observation, observationData, observationSchema } from './observation';

describe('Observation', () => {
  const observationJson: observationData = {
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
      {
        code: [
          {
            system: 'http://loinc.org',
            code: '12345-6',
            display: 'Test Observation',
          },
        ],
        integerSchema: [
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
    const parsed = observationSchema.safeParse(observationJson);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const observationData: observationData = parsed.data;
      expect(observationData).toHaveProperty('id', '1');
      expect(observationData).toHaveProperty('code');
      expect(observationData).toHaveProperty('component');
    }
  });

  // Test that we get a CdeSet object back from the Observation
  it('should return a CdeSet object', () => {
    const parsed = observationSchema.safeParse(observationJson);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const observation = new Observation(parsed.data);
      //expect(observation).toHaveProperty('cdeSet');
      console.log(observation);
      console.log('Here is component: ');
      console.log(observation.component);
      expect(observation).toHaveProperty('id', '1');
      expect(observation.component).toHaveLength(2);
    }
  });
});
