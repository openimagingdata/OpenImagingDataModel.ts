import { describe, it, expect } from 'vitest';

import fs from 'fs';

import { CdeSetData, cdeSetSchema, CdeSet } from './cdeSet';

import { Person } from './shared';

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

  const ribFractureJson: CdeSetData = {
    id: 'RDES112',
    name: 'Rib Fracture on Chest CT',
    description: 'Rib fracture identification- CT chest in emergency setting',
    version: {
      name: 'Rib Fracture on Chest CT',
      version_date: '00/00/0000',
      status: 'Proposed',
    },
    url: 'https://api3.rsna.org/radelement/public/sets/112',
    index_codes: [],
    body_parts: [
      {
        name: 'Rib',
        index_codes: {
          system: 'RADLEX',
          code: 'RID2471',
          display: 'Rib',
          href: 'http://www.radlex.org/RID/RID2471',
        },
      },
    ],
    authors: {
      person: [
        {
          name: 'Jordan Meyer',
          orcid_id: null,
          twitter_handle: null,
          url: null,
          role: null,
        },
      ],
      organization: [],
    },
    history: [],
    specialty: [
      { abbreviation: 'CH', name: 'Chest Radiology' },
      { abbreviation: 'ER', name: 'Emergency Radiology' },
    ],
    elements: [
      {
        id: 'RDE713',
        parent_id: 112,
        name: 'Displacement',
        short_name: '',
        editor: '',
        instructions: '',
        synonyms: '',
        definition: 'Total euclidean displacement of a rib fracture\n',
        question: '',
        version: {
          name: '',
          version_date: '12/06/2022',
          status_date: '12/06/2022',
          status: 'Proposed',
        },
        index_codes: [],
        authors: { person: [], organization: [] },
        history: [],
        specialty: [],
        references: [],
        source: '',
        float_values: {
          cardinality: { min_cardinality: 1, max_cardinality: 1 },
          value_min_max: { value_min: null, value_max: null },
          step_value: 0.1,
          unit: 'mm',
          value_type: 'float',
          value_size: 0,
          values: [],
        },
      },
      {
        id: 'RDE714',
        parent_id: 112,
        name: 'Count',
        short_name: '',
        editor: '',
        instructions: '',
        synonyms: '',
        definition: 'number of rib fractures total',
        question: '',
        version: {
          name: '',
          version_date: '12/06/2022',
          status_date: '12/06/2022',
          status: 'Proposed',
        },
        index_codes: [],
        authors: { person: [], organization: [] },
        history: [],
        specialty: [],
        references: [],
        source: '',
        integer_values: {
          cardinality: { min_cardinality: 1, max_cardinality: 1 },
          value_min_max: { value_min: null, value_max: null },
          step_value: 1,
          unit: 'rib fractures',
          value_type: 'integer',
          value_size: 0,
          values: [],
        },
      },
      {
        id: 'RDE715',
        parent_id: 112,
        name: 'Presence',
        short_name: '',
        editor: '',
        instructions: '',
        synonyms: '',
        definition: 'detection of rib fracture',
        question: '',
        version: {
          name: '',
          version_date: '02/06/2023',
          status_date: '02/06/2023',
          status: 'Proposed',
        },
        index_codes: [],
        authors: { person: [], organization: [] },
        history: [],
        specialty: [],
        references: [],
        source: '',
        value_set: {
          cardinality: { min_cardinality: 1, max_cardinality: 1 },
          value_min_max: { value_min: null, value_max: null },
          step_value: null,
          unit: '',
          value_type: 'valueSet',
          value_size: 0,
          values: [
            {
              value: 'RDE715.0',
              name: 'absent',
              definition: 'fracture absent',
            },
            {
              value: 'RDE715.1',
              name: 'present',
              definition: 'fracture present',
            },
            { value: 'RDE715.2', name: 'unknown', definition: 'unknown' },
            { value: 'RDE715.3', name: 'indeterminate', definition: '' },
          ],
        },
      },
      {
        id: 'RDE717',
        parent_id: 112,
        name: 'Affected rib',
        short_name: '',
        editor: '',
        instructions: '',
        synonyms: '',
        definition: 'Enumerated rib(s) with fracture',
        question: '',
        version: {
          name: '',
          version_date: '02/06/2023',
          status_date: '02/06/2023',
          status: 'Proposed',
        },
        index_codes: [],
        authors: { person: [], organization: [] },
        history: [],
        specialty: [],
        references: [],
        source: '',
        value_set: {
          cardinality: { min_cardinality: 1, max_cardinality: 12 },
          value_min_max: { value_min: null, value_max: null },
          step_value: null,
          unit: '',
          value_type: 'valueSet',
          value_size: 0,
          values: [
            { value: 'RDE717.0', name: '1', definition: '' },
            { value: 'RDE717.1', name: '2', definition: '' },
            { value: 'RDE717.2', name: '3', definition: '' },
            { value: 'RDE717.3', name: '4', definition: '' },
            { value: 'RDE717.4', name: '5', definition: '' },
            { value: 'RDE717.5', name: '6', definition: '' },
            { value: 'RDE717.6', name: '7', definition: '' },
            { value: 'RDE717.7', name: '8', definition: '' },
            { value: 'RDE717.8', name: '9', definition: '' },
            { value: 'RDE717.9', name: '10', definition: '' },
            { value: 'RDE717.10', name: '11', definition: '' },
            { value: 'RDE717.11', name: '12', definition: '' },
          ],
        },
      },
    ],
    references: [],
  };

  // Load an external file
  it('Should load real data from RadElement', () => {
    const parsed = cdeSetSchema.safeParse(ribFractureJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const cdeSetData: CdeSetData = parsed.data;
    const cdeSet = new CdeSet(cdeSetData);
    expect(cdeSet).toHaveProperty('id', 'RDES112');
  });

  it('should create isntance of CdeSet class from ribFractureJson data', () => {
    const parsed = cdeSetSchema.safeParse(ribFractureJson);
    if (!parsed.success) throw new Error(parsed.error.message);
    const cdeSetData: CdeSetData = parsed.data;
    const cdeSet = new CdeSet(cdeSetData);
    expect(cdeSet).toHaveProperty('id', 'RDES112');
  });

  it('Should appropriately load cdeSets using the fetchCdeSet method', () => {
    (async () => {
      const rdesId = '94';
      const cdeSet = await CdeSet.fetchCdeSet(rdesId);
      expect(cdeSet).toHaveProperty('id', 'RDES94');
    })();
  });
});
