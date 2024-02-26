import { describe, it, expect } from 'vitest';
import {
  Observation,
  observationData,
  observationSchema,
  SystemCodeData,
  MutabaleImagingObservation,
  systemCodeSchema,
} from './observation';
import { CdeSet } from '../../cde_set/src/types/cdeSet';

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
        value: [
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
        value: '6', //TODO: what is its namedvalueString?
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

  it('should properly load component data', () => {
    const parsed = observationSchema.safeParse(observationJson);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const observation = new Observation(parsed.data);
      expect(observation.component[0]).toHaveProperty('code');
      expect(observation.component[0]).toHaveProperty('value');
      console.log(observation.component[0].code);
      const code: SystemCodeData = observation.component[0]
        .code[0] as SystemCodeData;
      expect(code).toHaveProperty('system', 'http://loinc.org');
      expect(code).toHaveProperty('code', '12345-6');
      //TODO: Need testing for value now
    }
  });
});

describe('CdeSet', async () => {
  it('should fetch a CdeSet', async () => {
    //fetch a CdeSet
    const pulmonaryNoduleSetId = 'RDES195';
    const pulmonaryNoduleSet = await CdeSet.fetchFromRepo(pulmonaryNoduleSetId);
    const pulmonaryNoduleObservationId = '1';
    let pulmonaryNoduleObservation: MutabaleImagingObservation;
    if (pulmonaryNoduleSet === null) {
      throw new Error('Failed to fetch CdeSet');
    } else {
      pulmonaryNoduleObservation = new MutabaleImagingObservation(
        pulmonaryNoduleObservationId,
        pulmonaryNoduleSet
      );
    }
    console.log('Mutable Observation: ', pulmonaryNoduleObservation);
    expect(pulmonaryNoduleObservation).toHaveProperty(
      'resourceType',
      'Observation'
    );
    expect(pulmonaryNoduleObservation).toHaveProperty('id', '1');
    expect(pulmonaryNoduleObservation).toHaveProperty('code');
    expect(pulmonaryNoduleObservation).toHaveProperty('_components');
    expect(pulmonaryNoduleObservation).toHaveProperty('component');
  });
});
