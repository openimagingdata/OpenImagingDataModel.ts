import { describe, it, expect } from 'vitest';

import { CdeSetData, cdeSetSchema, CdeSet } from './cdeSet';

import { Organization, Person } from './shared';

const cdeSetJson: CdeSetData = {
  id: 'RDES231',
  name: 'Acute Clavicle Fracture',
  description: 'Acute Clavicle Fracture Detection',
  version: {
    name: 'Acute Clavicle Fracture',
    version_date: '01/01/0001',
    status_date: '10/04/2022',
    status: 'Proposed',
  },
  url: 'https://api3.rsna.org/radelement/public/sets/231',
  index_codes: [
    {
      system: 'RADLEX',
      code: 'RID6434',
      display: 'Brain',
      href: 'http://www.radlex.org/RID/RID6434',
    },
  ],
  body_parts: [],
  authors: {
    person: [
      {
        name: 'Farish, Natalia',
        orcid_id: null,
        twitter_handle: null,
        url: null,
        role: null,
      },
    ],
    organization: [],
  },
  history: [],
  specialty: [],
  elements: [
    {
      id: 'RDE1474',
      parent_id: 231,
      name: 'Side',
      short_name: '',
      editor: '',
      instructions: '',
      synonyms: '',
      definition: 'Describe clavicle fracture laterality',
      question: '',
      version: {
        name: '',
        version_date: '07/25/2023',
        status_date: '07/25/2023',
        status: 'Proposed',
      },
      index_codes: [],
      authors: {
        person: [],
        organization: [],
      },
      history: [],
      specialty: [],
      references: [],
      source: '',
      value_set: {
        cardinality: {
          min_cardinality: 1,
          max_cardinality: 1,
        },
        value_min_max: {
          value_min: null,
          value_max: null,
        },
        step_value: null,
        unit: '',
        value_type: 'valueSet',
        value_size: 0,
        values: [
          {
            value: 'RDE1474.0',
            name: 'right',
            definition: '',
          },
          {
            value: 'RDE1474.1',
            name: 'left',
            definition: '',
          },
        ],
      },
    },
    {
      id: 'RDE1475',
      parent_id: 231,
      name: 'Type',
      short_name: '',
      editor: '',
      instructions: '',
      synonyms: '',
      definition:
        'Clavicle fractures are classiied into three types based on the location of the fracture',
      question: '',
      version: {
        name: '',
        version_date: '07/25/2023',
        status_date: '07/25/2023',
        status: 'Proposed',
      },
      index_codes: [],
      authors: {
        person: [],
        organization: [],
      },
      history: [],
      specialty: [],
      references: [],
      source: '',
      value_set: {
        cardinality: {
          min_cardinality: 1,
          max_cardinality: 1,
        },
        value_min_max: {
          value_min: null,
          value_max: null,
        },
        step_value: null,
        unit: '',
        value_type: 'valueSet',
        value_size: 0,
        values: [
          {
            value: 'RDE1475.0',
            name: 'proximal to sternum',
            definition: '',
          },
          {
            value: 'RDE1475.1',
            name: 'proximal to AC joint',
            definition: '',
          },
          {
            value: 'RDE1475.2',
            name: 'middle of the bone, between the sternum and AC joint',
            definition: '',
          },
          {
            value: 'RDE1475.3',
            name: 'unknown',
            definition: '',
          },
          {
            value: 'RDE1475.4',
            name: 'indeterminate',
            definition: '',
          },
          {
            value: 'RDE1475.5',
            name: 'absent',
            definition: '',
          },
        ],
      },
    },
  ],
  references: [],
};

describe('cdeSet', () => {
  it('should parse cdeSet JSON', () => {
    const parsed = cdeSetSchema.safeParse(cdeSetJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const cdeSetData: CdeSetData = parsed.data;
    expect(cdeSetData).toHaveProperty('id', 'RDES231');
    expect(cdeSetData).toHaveProperty('name', 'Acute Clavicle Fracture');
    expect(cdeSetData).toHaveProperty('body_parts');
    expect(cdeSetData).toHaveProperty('index_codes');
    expect(cdeSetData.elements).toHaveLength(2);
    expect(cdeSetData.elements[0]).toHaveProperty('index_codes');
  });

  it('should create isntance of CdeSet class', () => {
    const parsed = cdeSetSchema.safeParse(cdeSetJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const cdeSetData: CdeSetData = parsed.data;
    const cdeSet = new CdeSet(cdeSetData);
    expect(cdeSet).toHaveProperty('id', 'RDES231');
    expect(cdeSet).toHaveProperty('specialty');
    expect(cdeSet).toHaveProperty('name', 'Acute Clavicle Fracture');
    expect(cdeSet).toHaveProperty('authors');
    expect(cdeSet).toHaveProperty('_index_codes');
    expect(typeof cdeSet.specialty).toBe('object');
    expect(cdeSet.version).toHaveProperty('version_date', '01/01/0001');
    expect(cdeSet.authors[0]).toBeInstanceOf(Person);
    expect(cdeSet.authors).toHaveLength(1);
  });

  it('Should appropriately load elements', () => {
    const parsed = cdeSetSchema.safeParse(cdeSetJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const cdeSetData: CdeSetData = parsed.data;
    const cdeSet = new CdeSet(cdeSetData);
    expect(cdeSet.elements).toHaveLength(2);
    expect(cdeSet.elements[0]).toHaveProperty('index_codes');
    expect(cdeSet.elements[0]).toHaveProperty('version');
    expect(cdeSet.elements[0]).toHaveProperty('id', 'RDE1474');
    expect(cdeSet.elements[1]).toHaveProperty('id', 'RDE1475');
    expect(cdeSet.elements[1]).toHaveProperty('value_set');
  });

  //Load index codes
  it('Should appropriately load index_codes', () => {
    const parsed = cdeSetSchema.safeParse(cdeSetJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const cdeSetData: CdeSetData = parsed.data;
    const cdeSet = new CdeSet(cdeSetData);
    expect(cdeSet.indexCodes).toHaveLength(1);
    expect(cdeSet.indexCodes[0]).toHaveProperty('system', 'RADLEX');
    expect(cdeSet.indexCodes[0]).toHaveProperty('code', 'RID6434');
    expect(cdeSet.indexCodes[0]).toHaveProperty('display', 'Brain');
    expect(cdeSet.indexCodes[0]).toHaveProperty(
      'href',
      'http://www.radlex.org/RID/RID6434'
    );
  });
});
