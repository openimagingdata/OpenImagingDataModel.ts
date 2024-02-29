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
import { CdElement } from '../../cde_set/src/types/cdElement';

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

let pulmonaryNoduleObservation: MutabaleImagingObservation;
describe('CdeSet', async () => {
  it('should fetch a CdeSet from Repo and generate MutableImagingObservation', async () => {
    //fetch a CdeSet
    const pulmonaryNoduleSetId = 'RDES195';
    const pulmonaryNoduleSet = await CdeSet.fetchFromRepo(pulmonaryNoduleSetId);
    const pulmonaryNoduleObservationId = '1';
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
    expect(pulmonaryNoduleObservation).toBeInstanceOf(
      MutabaleImagingObservation
    );
    expect(pulmonaryNoduleObservation).toHaveProperty('id', '1');
    expect(pulmonaryNoduleObservation).toHaveProperty('code');
    expect(pulmonaryNoduleObservation).toHaveProperty('_components');
    expect(pulmonaryNoduleObservation).toHaveProperty('component');
    expect(pulmonaryNoduleObservation).toHaveProperty('_data');
  });
  it('should properly load component data', async () => {
    expect(pulmonaryNoduleObservation.component).toHaveLength(13);
    expect(pulmonaryNoduleObservation.component[0]).toHaveProperty('code');
    expect(pulmonaryNoduleObservation.component[0]).toHaveProperty('value');
    expect(pulmonaryNoduleObservation.component[0]).toHaveProperty('_data');
    /*
    expect(pulmonaryNoduleObservation.component[0].code).toHaveProperty(
      'system'
    );
    expect(pulmonaryNoduleObservation.component[0].code).toHaveProperty('code');
    expect(pulmonaryNoduleObservation.component[0].code).toHaveProperty(
      'display'
    );//TODO add getters for these */
    console.log(
      'Component[0]_data: ',
      pulmonaryNoduleObservation.component[0].data
    );
    console.log(
      'Component[1]_data: ',
      pulmonaryNoduleObservation.component[1].data
    );
    console.log(
      'Component[2]_data: ',
      pulmonaryNoduleObservation.component[2].data
    );
    console.log('code: ', pulmonaryNoduleObservation.component[0].code);
    console.log('value: ', pulmonaryNoduleObservation.component[0].value);
  });
  it('Get element from CDES and add it to observation', async () => {
    const pulmonaryNoduleSetId = 'RDES195';
    const pulmonaryNoduleSet = await CdeSet.fetchFromRepo(pulmonaryNoduleSetId);
    expect(pulmonaryNoduleSet).toBeInstanceOf(CdeSet);
    if (pulmonaryNoduleSet === null) {
      throw new Error('Failed to fetch CdeSet');
    } else {
      const element = pulmonaryNoduleSet.getElementByName('Size');
      console.log('Element Size: ', element);
      expect(element).toBeInstanceOf(CdElement);
      if (element !== null) {
        pulmonaryNoduleObservation.addComponent(element);
        expect(pulmonaryNoduleObservation.component).toHaveLength(14);
      }
    }
  });
});
