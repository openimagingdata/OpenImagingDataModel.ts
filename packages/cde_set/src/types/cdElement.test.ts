import { describe, it, expect } from 'vitest';

import {
  CdElementFactory,
  elementSchema,
  ValueSetElement,
  BooleanElement,
  IntegerElement,
  FloatElement,
  ValueSetElementData,
  BooleanElementData,
  valueSetElementSchema,
  isValueSetElementData,
  isBooleanElementData,
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
    const parsed = valueSetElementSchema.safeParse(valueSetElementJson);
    if (!parsed.success) throw new Error('Failed to parse valueSetElementJson');
    if (!isValueSetElementData(parsed.data))
      throw new Error('parsed valueSetElementJson is not ValueSetElementData');
    const valueSetElementData: ValueSetElementData = parsed.data;
    expect(valueSetElementData).toHaveProperty('id', 'RDE818'); //? valueSetElementData
    expect(valueSetElementData).toHaveProperty('value_set');
    expect(valueSetElementData.value_set).toHaveProperty('values');
    expect(valueSetElementData.value_set.values).toHaveLength(5);
  });
});

describe('ValueSetElement', () => {
  it('should create a ValueSetElement object from JSON', () => {
    const valueSetElementData = elementSchema.parse(valueSetElementJson);
    if (!isValueSetElementData(valueSetElementData))
      throw new Error('parsed valueSetElementJson is not ValueSetElementData');
    const valueSetElement = new ValueSetElement(valueSetElementData);
    expect(valueSetElement).toHaveProperty('id', 'RDE818');
    expect(valueSetElement).toHaveProperty('values');
    expect(valueSetElement.values).toHaveLength(5);
  });

  it('should create a ValueSetElement object from ElementData using the factory', () => {
    const elementData = elementSchema.parse(valueSetElementJson);
    const valueSetElement = CdElementFactory.create(elementData);
    expect(valueSetElement).toBeInstanceOf(ValueSetElement);
    expect(valueSetElement.elementType).toBe('valueSet');
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

describe('boolean element data', () => {
  it('should parse cdElement JSON for Boolean type', () => {
    const parsed = elementSchema.safeParse(booleanElementJson);
    expect(parsed.success).toBe(true);
    if (!parsed.success) throw new Error('Failed to parse booleanElementJson');
    if (!isBooleanElementData(parsed.data))
      throw new Error('parsed booleanElementJson is not BooleanElementData');
    const booleanElementData: BooleanElementData = parsed.data;
    expect(booleanElementData).toHaveProperty('id', 'RDE49');
    expect(booleanElementData).toHaveProperty('boolean_values');
    expect(booleanElementData.boolean_values).toHaveProperty('cardinality');
    expect(booleanElementData.boolean_values).toHaveProperty('step_value');
  });
});

/*
This part of the code takes the JavaScript object 
valueSetElementJson and converts it into a JSON-formatted string.
*/
describe('BooleanElement', () => {
  it('should create a booleanElement Obj from JSOn formatted string', () => {
    const booleanFactoryElement = CdElementFactory.createFromJson(
      JSON.stringify(booleanElementJson)
    );
    expect(booleanFactoryElement).toBeInstanceOf(BooleanElement);
    expect(booleanFactoryElement).toHaveProperty('id', 'RDE49');
    expect(booleanFactoryElement).toHaveProperty('references');
  });
  it('should create a BooleanElement object from TS object using factory', () => {
    const booleanFactoryElement =
      CdElementFactory.createFromJson(booleanElementJson);
    expect(booleanFactoryElement).toBeInstanceOf(BooleanElement);
    expect(booleanFactoryElement.elementType).toBe('boolean');
    expect(booleanFactoryElement).toHaveProperty('id', 'RDE49');
    expect(booleanFactoryElement).toHaveProperty('references');
  });
  //TODO: Use the factory method "create" to create a BooleanElement object from the JSON object
});
