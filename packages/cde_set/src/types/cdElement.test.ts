import { describe, it, expect } from 'vitest';

import {
  CdElementFactory,
  elementSchema,
  ValueSetElement,
  BooleanElement,
  FloatElement,
  IntegerElement,
  booleanElementSchema,
  integerElementSchema,
  ValueSetElementData,
  BooleanElementData,
  IntegerElementData,
  FloatElementData,
  valueSetElementSchema,
  floatElementSchema,
  isFloatElementData,
  isValueSetElementData,
  isIntegerElementData,
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

//Tests for ValueSet

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
    expect(valueSetElementData.value_set).toHaveProperty('cardinality');
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
    expect(valueSetElement).toHaveProperty('cardinality');
    expect(valueSetElement).not.toHaveProperty('value_size');
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
      expect(valueSetElement).toHaveProperty('cardinality');
      expect(valueSetElement).not.toHaveProperty('value_size');
      expect(valueSetElement).not.toHaveProperty('index_codes');
    }
  });

  it('should create a ValueSetElement object from JSON using the factory', () => {
    const valueSetElement =
      CdElementFactory.createFromJson(valueSetElementJson);
    expect(valueSetElement).toBeInstanceOf(ValueSetElement);
    const valueSetElement2 = CdElementFactory.createFromJson(
      JSON.stringify(valueSetElementJson)
    );
    expect(valueSetElement).toBeInstanceOf(ValueSetElement);
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

//Tests for BooleanElement

describe('boolean element data', () => {
  it('should parse cdElement JSON for Boolean type', () => {
    const parsed = booleanElementSchema.safeParse(booleanElementJson);
    if (!parsed.success) throw new Error('Failed to parse booleanElementJson');
    if (!isBooleanElementData(parsed.data))
      throw new Error('parsed booleanElementJson is not BooleanElementData');
    const booleanElementData: BooleanElementData = parsed.data;
    expect(booleanElementData).toHaveProperty('id', 'RDE49');
    expect(booleanElementData).toHaveProperty('boolean_values');
    expect(booleanElementData.boolean_values).toHaveProperty('cardinality');
    expect(booleanElementData.boolean_values).toHaveProperty('step_value');
    expect(booleanElementData.boolean_values).toHaveProperty('cardinality');
  });
});

describe('BooleanElement', () => {
  it('should create a booleanElement object from JSON', () => {
    const booleanElementData = elementSchema.parse(booleanElementJson);
    if (!isBooleanElementData(booleanElementData))
      throw new Error('parsed booleanElementJson is not booleanElementData');
    const booleanElement = new BooleanElement(booleanElementData);
    expect(booleanElement).toBeInstanceOf(BooleanElement);
    expect(booleanElement).toHaveProperty('id', 'RDE49');
    expect(booleanElement).toHaveProperty('references');
    expect(booleanElement).not.toHaveProperty('boolean_values');
  });
  //TODO: Need to take out "not relevant" properties from the base class.

  it('should create a BooleanElement object from BooleanData using the factory', () => {
    const elementData = elementSchema.parse(booleanElementJson);
    const booleanElement = CdElementFactory.create(elementData);
    expect(booleanElement).toBeInstanceOf(BooleanElement);
    expect(booleanElement.elementType).toBe('boolean');
    expect(booleanElement).toHaveProperty('id', 'RDE49');
    if (booleanElement instanceof BooleanElement) {
      //TODO" No relevant data under "boolean" in "guide_to_elements"
    }
  });

  it('should create a BooleanElement object from JSON using the factory', () => {
    const booleanElement = CdElementFactory.createFromJson(booleanElementJson);
    expect(booleanElement).toBeInstanceOf(BooleanElement);
    const booleanElement2 = CdElementFactory.createFromJson(
      JSON.stringify(booleanElementJson)
    );
    expect(booleanElement).toBeInstanceOf(BooleanElement);
    expect(booleanElement2).toBeInstanceOf(BooleanElement);
  });
});

const integerElementJson: IntegerElementData = {
  id: 'RDE81',
  parent_id: 5,
  name: 'Diameter',
  short_name: '',
  editor: '',
  instructions:
    'Diameter should be measured in the sequence, phase, and imaging plane in which the margins are most sharply demarcated and in which there is no anatomic distortion. If margins are sharply demarcated on more than one sequence or phase, do not measure in the arterial phase.',
  synonyms: '',
  definition:
    'The largest dimension (outer edge to outer edge) of an observation, measured in millimeters.',
  question: '',
  version: {
    name: '',
    version_date: '09/02/2016',
    status_date: '09/02/2016',
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
  integer_values: {
    cardinality: {
      min_cardinality: 1,
      max_cardinality: 1,
    },
    value_min_max: {
      value_min: 0,
      value_max: 999,
    },
    step_value: 1,
    unit: 'mm',
    value_type: 'integer',
    value_size: 0,
    values: [],
  },
};

describe('integer element data', () => {
  it('should parse cdElement JSON for Integer type', () => {
    const parsed = integerElementSchema.safeParse(integerElementJson);
    if (!parsed.success) throw new Error('Failed to parse integerElementJson');
    if (!isIntegerElementData(parsed.data))
      throw new Error('parsed integerElementJson is not IntegerElementData');
    const integerElementData: IntegerElementData = parsed.data;
    expect(integerElementData).toHaveProperty('id', 'RDE81');
    expect(integerElementData).toHaveProperty('integer_values');
    expect(integerElementData.integer_values).toHaveProperty('unit');
    expect(integerElementData.integer_values).toHaveProperty('step_value');
    expect(integerElementData.integer_values).toHaveProperty('value_min_max');
  });
});

//HERE change rest to integer vs boolean.

describe('IntegerElement', () => {
  it('should create a IntegerElement object from JSON', () => {
    const integerElementData = elementSchema.parse(integerElementJson);
    if (!isIntegerElementData(integerElementData))
      throw new Error('parsed integerElementJson is not integerElementData');
    const integerElement = new IntegerElement(integerElementData);
    expect(integerElement).toBeInstanceOf(IntegerElement);
    expect(integerElement.integerValues).toHaveProperty('step_value', 1);
    expect(integerElement.integerValues).toHaveProperty('unit', 'mm');
    expect(integerElement.integerValues.value_min_max).toHaveProperty(
      'value_max',
      999
    );
    expect(integerElement.integerValues.value_min_max).toHaveProperty(
      'value_min',
      0
    );
    expect(integerElement).not.toHaveProperty('boolean_values');
  });

  it('should create a IntegerElement object from IntegerData using the factory', () => {
    const elementData = elementSchema.parse(integerElementJson);
    const integerElement = CdElementFactory.create(elementData);
    expect(integerElement).toBeInstanceOf(IntegerElement);
    expect(integerElement.elementType).toBe('integer');
    expect(integerElement).toHaveProperty('id', 'RDE81');
    if (integerElement instanceof IntegerElement) {
      expect(integerElement.integerValues).toHaveProperty('step_value', 1);
      expect(integerElement.integerValues).toHaveProperty('unit', 'mm');
      expect(integerElement.integerValues.value_min_max).toHaveProperty(
        'value_max',
        999
      );
      expect(integerElement.integerValues.value_min_max).toHaveProperty(
        'value_min',
        0
      );
      expect(integerElement).not.toHaveProperty('float_values');
    }
  });

  it('should create a IntegerElement object from JSON using the factory', () => {
    const integerElement = CdElementFactory.createFromJson(integerElementJson);
    expect(integerElement).toBeInstanceOf(IntegerElement);
    const integerElement2 = CdElementFactory.createFromJson(
      JSON.stringify(integerElementJson)
    );
    expect(integerElement).toBeInstanceOf(IntegerElement);
    expect(integerElement2).toBeInstanceOf(IntegerElement);
  });

  const floatElementJson: FloatElementData = {
    id: 'RDE31',
    parent_id: 1,
    name: 'Gunshot wound caliber number',
    short_name: '',
    editor: 'cek',
    instructions: '',
    synonyms: '',
    definition: '',
    question: '',
    version: {
      name: '3.0',
      version_date: '01/13/2016',
      status_date: '01/13/2016',
      status: 'Published',
    },
    index_codes: [
      {
        system: 'SNOMEDCT',
        code: '56768003',
        display: 'gunshot wound',
        href: 'http://purl.bioontology.org/ontology/SNOMEDCT/56768003',
      },
      {
        system: 'SNOMEDCT',
        code: '283545005',
        display: 'gunshot wound',
        href: 'http://purl.bioontology.org/ontology/SNOMEDCT/283545005',
      },
      {
        system: 'LOINC',
        code: 'LA17212-4',
        display: 'gunshot wound',
        href: 'http://purl.bioontology.org/ontology/LNC/LA17212-4',
      },
      {
        system: 'SNOMEDCT',
        code: '102343009',
        display: 'bullet caliber',
        href: 'http://purl.bioontology.org/ontology/SNOMEDCT/102343009',
      },
    ],
    authors: {
      person: [],
      organization: [],
    },
    history: [],
    specialty: [],
    references: [],
    source: '',
    float_values: {
      cardinality: {
        min_cardinality: 1,
        max_cardinality: 1,
      },
      value_min_max: {
        value_min: 0.17,
        value_max: 0.5,
      },
      step_value: null,
      unit: '',
      value_type: 'float',
      value_size: 0,
      values: [],
    },
  };

  describe('float element data', () => {
    it('should parse cdElement JSON for float type', () => {
      const parsed = floatElementSchema.safeParse(floatElementJson);
      if (!parsed.success) throw new Error('Failed to parse floatElementJson');
      if (!isFloatElementData(parsed.data))
        throw new Error('parsed floatElementJson is not FloatElementData');
      const floatElementData: FloatElementData = parsed.data;
      expect(floatElementData).toHaveProperty('id', 'RDE31');
      expect(floatElementData).toHaveProperty('float_values');
      expect(floatElementData.float_values).toHaveProperty('unit');
      expect(floatElementData.float_values).toHaveProperty('step_value');
      expect(floatElementData.float_values).toHaveProperty('value_min_max');
    });
  });

  describe('FloatElement', () => {
    it('should create a FloatElement object from JSON', () => {
      const floatElementData = elementSchema.parse(floatElementJson);
      if (!isFloatElementData(floatElementData))
        throw new Error('parsed floatElementJson is not floatElementData');
      const floatElement = new FloatElement(floatElementData);
      expect(floatElement).toBeInstanceOf(FloatElement);
      expect(floatElement.floatValues).toHaveProperty('step_value', null);
      expect(floatElement.floatValues).toHaveProperty('unit', '');
      expect(floatElement.floatValues.value_min_max).toHaveProperty(
        'value_max',
        0.5
      );
      expect(floatElement.floatValues.value_min_max).toHaveProperty(
        'value_min',
        0.17
      );
      expect(floatElement).not.toHaveProperty('boolean_values');
    });

    it('should create a FloatElement object from FloatData using the factory', () => {
      const elementData = elementSchema.parse(floatElementJson);
      const floatElement = CdElementFactory.create(elementData);
      expect(floatElement).toBeInstanceOf(FloatElement);
      expect(floatElement.elementType).toBe('float');
      expect(floatElement).toHaveProperty('id', 'RDE31');
      if (floatElement instanceof FloatElement) {
        expect(floatElement.floatValues).toHaveProperty('step_value', null);
        expect(floatElement.floatValues).toHaveProperty('unit', '');
        expect(floatElement.floatValues.value_min_max).toHaveProperty(
          'value_max',
          0.5
        );
        expect(floatElement.floatValues.value_min_max).toHaveProperty(
          'value_min',
          0.17
        );
        expect(floatElement).not.toHaveProperty('integer_values');
      }
    });

    it('should create a FloatElement object from JSON using the factory', () => {
      const floatElement = CdElementFactory.createFromJson(floatElementJson);
      expect(floatElement).toBeInstanceOf(FloatElement);
      const floatElement2 = CdElementFactory.createFromJson(
        JSON.stringify(floatElementJson)
      );
      expect(floatElement).toBeInstanceOf(FloatElement);
      expect(floatElement2).toBeInstanceOf(FloatElement);
      expect(floatElement2).toHaveProperty('id', 'RDE31');
      expect(floatElement).toHaveProperty('floatValues');
      expect(floatElement2).toHaveProperty('floatValues');
    });
  });
});
