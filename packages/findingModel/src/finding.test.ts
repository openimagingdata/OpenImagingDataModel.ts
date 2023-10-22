import { describe, it, expect } from 'vitest';

import { FindingModel, FindingData, findingSchema } from './findingModel';

const findingJson: FindingData = {
  name: 'calcified pulmonary granuloma',
  description:
    'A type of small lesion in the lungs, often caused by inflammation from diseases such as tuberculosis. These granulomas become calcified as they heal, leaving behind a small area of lung tissue that is harder than normal due to the deposition of calcium salts.',
  attributes: [
    {
      name: 'size',
      description: 'The diameter of the granuloma',
      type: 'numeric',
      minimum: 0,
      maximum: null,
    },
    {
      name: 'location',
      description: 'The anatomical location of the granuloma in the lungs',
      type: 'choice',
      values: [
        {
          name: 'right upper lobe',
          description: 'Upper section of the right lung',
        },
        {
          name: 'left upper lobe',
          description: 'Upper section of the left lung',
        },
        {
          name: 'right middle lobe',
          description: 'Middle section of the right lung',
        },
        {
          name: 'right lower lobe',
          description: 'Lower section of the right lung',
        },
        {
          name: 'left lower lobe',
          description: 'Lower section of the left lung',
        },
      ],
    },
    {
      name: 'consistency',
      description: 'The level of calcification of the granuloma',
      type: 'choice',
      values: [
        {
          name: 'fully calcified',
          description: 'Fully hardened with calcium salts',
        },
        {
          name: 'partially calcified',
          description: 'Partially hardened with calcium salts',
        },
      ],
    },
    {
      name: 'change',
      description:
        'The change in the size or number of granulomas since the prior imaging study',
      type: 'choice',
      values: [
        {
          name: 'new',
          description:
            'The granuloma was not present in the prior imaging study',
        },
        {
          name: 'unchanged',
          description:
            'The granuloma is the same size as in the prior imaging study',
        },
        {
          name: 'enlarging',
          description:
            'The granuloma is larger than in the prior imaging study',
        },
        {
          name: 'no significant change',
          description:
            'There is no significant change in the size or number of granulomas since the prior imaging study',
        },
      ],
    },
  ],
};

describe('finding', () => {
  it('should parse finding JSON', () => {
    const parsed = findingSchema.safeParse(findingJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const findingData: FindingData = parsed.data;
    expect(findingData).toHaveProperty('name', 'calcified pulmonary granuloma');
    expect(findingData).toHaveProperty('attributes');
    expect(findingData.attributes[0]).toHaveProperty('name', 'size');
  });

  it('should create instance of Finding class', () => {});
  const parsed = findingSchema.safeParse(findingJson);
  if (!parsed.success) throw new Error(parsed.error.message);
  const findingData: FindingData = parsed.data;
  const finding = new FindingModel(findingData);
  //console.log(findingData);
  expect(finding).toHaveProperty('name', 'calcified pulmonary granuloma');
  console.log(finding.attributes);
  expect(finding.attributes[0]).toHaveProperty('name', 'size');
  //TODO: Need to continue to test attributes and add getters to the two different subclasses.
});
