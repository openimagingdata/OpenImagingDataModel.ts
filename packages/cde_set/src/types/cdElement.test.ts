import { describe, it, expect } from 'vitest';
import {
  CdElementFactory,
  elementSchema,
  ValueSetElement,
  BooleanElement,
  ValueSetElementData,
  BooleanElementData,
  booleanElementSchema,
} from './cdElement';

const valueSetElementJson: ValueSetElementData = {
  id: 'RDE818',
  parent_id: 126,
  name: 'Aortic dissection',
  definition: '',
  question: '',
  version: {
    name: 'Initial Version',
    version_date: '03/27/2023',
    status_date: '03/27/2023',
    status: 'Proposed',
  },
  index_codes: [],
  value_set: {
    cardinality: {
      min_cardinality: 1,
      max_cardinality: 1,
    },
    value_type: 'valueSet',
    values: [
      {
        value: 'RDE818.0',
        name: 'acute',
      },
      {
        value: 'RDE818.1',
        name: 'subacute',
      },
      {
        value: 'RDE818.2',
        name: 'chronic',
      },
      {
        value: 'RDE818.3',
        name: 'unknown',
      },
      {
        value: 'RDE818.4',
        name: 'indeterminate',
      },
    ],
  },
};

describe('cdElement', () => {
  it('should parse cdElement JSON', () => {
    const cdElementData = elementSchema.safeParse(valueSetElementJson);
    expect(cdElementData.success).toBe(true);
    if (cdElementData.success) {
      const valueSetElementData = cdElementData.data as ValueSetElementData;
      expect(valueSetElementData).toHaveProperty('id', 'RDE818');
      expect(valueSetElementData).toHaveProperty('value_set');
      expect(valueSetElementData.value_set).toHaveProperty('values');
      expect(valueSetElementData.value_set.values).toHaveLength(5);
    }
  });
});

describe('ValueSetElement', () => {
  it('should create a ValueSetElement object from JSON', () => {
    const valueSetElementData = elementSchema.parse(
      valueSetElementJson
    ) as ValueSetElementData;
    const valueSetElement = new ValueSetElement(valueSetElementData);
    expect(valueSetElement).toHaveProperty('id', 'RDE818');
    expect(valueSetElement).toHaveProperty('values');
    expect(valueSetElement.values).toHaveLength(5);
  });

  it('should create a ValueSetElement object from ElementData using the factory', () => {
    const elementData = elementSchema.parse(valueSetElementJson);
    const valueSetElement = CdElementFactory.create(elementData);
    expect(valueSetElement).toBeInstanceOf(ValueSetElement);
    expect(valueSetElement).toHaveProperty('id', 'RDE818');
    if (valueSetElement instanceof ValueSetElement) {
      expect(valueSetElement).toHaveProperty('values');
      expect(valueSetElement.values).toHaveLength(5);
    }
  });

  it('should create a ValueSetElement object from JSON using the factory', () => {
    const valueSetElement =
      CdElementFactory.createFromJson(valueSetElementJson);
    expect(valueSetElement).toBeInstanceOf(ValueSetElement);
    const valueSetElement2 = CdElementFactory.createFromJson(
      JSON.stringify(valueSetElementJson)
    );
    expect(valueSetElement2).toBeInstanceOf(ValueSetElement);
  });
});

const booleanElementJson: BooleanElementData = {
  id: 'RDE49',
  parent_id: 3,
  name: 'Uniformly cystic',
  short_name: '',
  editor: 'cek',
  instructions: '',
  synonyms: '',
  definition: 'Indicates if the adrenal nodule is uniformly cystic. ',
  question: 'Is the adrenal nodule uniformly cystic?',
  version: {
    name: '1',
    version_date: '01/03/2016',
    status_date: '01/03/2016',
    status: 'Published',
  },
  index_codes: [],
  authors: {
    person: [],
    organization: [],
  },
  history: [],
  specialty: [],
  references: [],
  source: 'CAR/DS Adrenal Nodule',
  boolean_values: {
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
    value_type: 'boolean',
    value_size: 1,
    values: [],
  },
};

describe('boolean cdElement', () => {
  it('should parse cdElement JSON for Boolean type', () => {
    const booleanElementData = elementSchema.safeParse(booleanElementJson);
    expect(booleanElementData.success).toBe(true);
    if (booleanElementData.success) {
      //const booleanElementJson = booleanElementData.data as BooleanElementData;
      expect(booleanElementJson).toHaveProperty('id', 'RDE49');
      expect(booleanElementJson).toHaveProperty('boolean_values');
      expect(booleanElementJson.boolean_values).toHaveProperty('cardinality');
      expect(booleanElementJson.boolean_values).toHaveProperty(
        'step_value',
        null
      );
    }
  });
});

describe('BooleanElement', () => {
  it('should create a BooleanElement object from JSON', () => {
    const booleanElementData = booleanElementSchema.parse(booleanElementJson);
    const booleanElement = new BooleanElement(booleanElementData);
    expect(booleanElement).toHaveProperty('id', 'RDE49');
  });
});
