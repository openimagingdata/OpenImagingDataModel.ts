import { describe, it, expect } from 'vitest';

import {
  FindingModel,
  FindingData,
  findingSchema,
  NumericAttribute,
  ChoiceAttribute,
} from './findingModel';

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

  it('should create instance of Finding class', () => {
    const parsed = findingSchema.safeParse(findingJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const findingData: FindingData = parsed.data;
    const finding = new FindingModel(findingData);
    console.log('This is entire finding structure: ');
    //console.log(findingData);
    console.log(finding);
    expect(finding).toHaveProperty(
      'description',
      'A type of small lesion in the lungs, often caused by inflammation from diseases such as tuberculosis. These granulomas become calcified as they heal, leaving behind a small area of lung tissue that is harder than normal due to the deposition of calcium salts.'
    );
    expect(finding).toHaveProperty('name', 'calcified pulmonary granuloma');
    expect(finding).toHaveProperty(
      'description',
      'A type of small lesion in the lungs, often caused by inflammation from diseases such as tuberculosis. These granulomas become calcified as they heal, leaving behind a small area of lung tissue that is harder than normal due to the deposition of calcium salts.'
    );
    expect(finding).toHaveProperty('attributes');
  });

  it('should appropriately load attributes', () => {
    const parsed = findingSchema.safeParse(findingJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const findingData: FindingData = parsed.data;
    const finding = new FindingModel(findingData);
    console.log('This is finding.attributes[0], a numericAttribute: ');
    console.log(finding.attributes[0]);
    console.log('This is finding.attributes[1], a choice attribute: ');
    console.log(finding.attributes[1]);
    expect(finding.attributes[0]).toBeInstanceOf(NumericAttribute);
    expect(finding.attributes[0]).toHaveProperty('name', 'size');
    expect(finding.attributes[0]).toHaveProperty('type', 'numeric');
    expect(finding.attributes[0]).toHaveProperty('minimum', 0);
    expect(finding.attributes[0]).toHaveProperty('maximum', null);
    expect(finding.attributes[1]).toBeInstanceOf(ChoiceAttribute);
    expect(finding.attributes[1]).toHaveProperty('name', 'location');
    expect(finding.attributes[1]).toHaveProperty('type', 'choice');
    expect(finding.attributes[1]).toHaveProperty(
      'description',
      'The anatomical location of the granuloma in the lungs'
    );
    expect(finding.attributes[1]).toHaveProperty('values');
  });

  it('should appropriately load values', () => {
    const parsed = findingSchema.safeParse(findingJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const findingData: FindingData = parsed.data;
    const finding = new FindingModel(findingData);
    const numericAttribute = finding.attributes[0] as NumericAttribute;
    expect(numericAttribute).toHaveProperty('type', 'numeric');
    expect(numericAttribute).toHaveProperty('minimum', 0);
    expect(numericAttribute).toHaveProperty('maximum', null);
    const choiceAttribute = finding.attributes[1] as ChoiceAttribute;
    expect(choiceAttribute).toHaveProperty('type', 'choice');
    expect(choiceAttribute).toHaveProperty('values');
    expect(choiceAttribute.values).toHaveLength(5);
    console.log('This is finding.attributes[1]: ');
    console.log(finding.attributes[1]);
    console.log('This is finding.attributes[0]: ');
    console.log(finding.attributes[0]);
    console.log('This is finding.attributes[1].values[0]: ');
    //console.log(finding.attributes[1].values[0]);
  });

<<<<<<< HEAD
  //TODO: Is the type assertion going to lead to false passing tests?
  //TypeScript infers the type of finding.attributes[0] based on the declared type of the array
  //Need to perform type casting to access specific attributes of a derrivation of 'Attributes'.
=======
  //TODO: Currently the getters in the Finding class are working but the subclasses cannot be accessed?
  //TODO: DO i need to add the attributes (fields) to the subclasses, only have the getters currently.
  //for example minimum attribute in the numeric subclass, not only the getter.
  //TODO: Need to continue to test attributes and add getters to the two different subclasses.

  //TODO: Do i need a values object?
  //TODO: I think within a choice attribute, the values need to be loaded into the values attibute from the constructor
  //TODO: Why can I not access the values attribute of the choice attribute?
  //Is the finding class wrong.
  //Everything seems to be defualting to the baseAttributes class?
  //Are my getters not there?
  //This is the edit to test if its working
>>>>>>> 4daf877c7e0f0a8d4f13c6efec554125a7face9e
});
