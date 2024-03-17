import { z } from 'zod';
import {
  ValueSetElementData,
  FloatElement,
  IntegerElement,
  BooleanElement,
  CdElement,
  ValueSetElement,
  ElementData,
} from '../../cde_set/src/types/cdElement';

import { CdeSetData, CdeSet } from '../../cde_set/src/types/cdeSet';
import {
  FindingModel,
  ChoiceAttribute,
  NumericAttribute,
  ChoiceAttributesData, //TODO: Need to update findingModel, most up to date is in update_observation-model
  NumericAttributesData,
} from '../../finding_model/src/findingModel';

//TODO: check date formatting
const currentDate = new Date();
const formattedCurrentDate = `${
  currentDate.getMonth() + 1
}/${currentDate.getDate()}/${currentDate.getFullYear()}`;

class findingToCdeSetBuilder {
  //Take a finding and generate cdeSet Json
  static findingToCdeSet = (finding: FindingModel): CdeSet => {
    const elements: CdElement[] = [];

    finding.attributes.forEach((attributeData) => {
      let attribute;
      let element: CdElement;
      if (attributeData.type === 'choice') {
        attribute = new ChoiceAttribute(attributeData as ChoiceAttributesData);
        element = findingToCdeSetBuilder.buildElementFromAttribute(attribute);
        elements.push(element);
      } else if (attributeData.type === 'numeric') {
        attribute = new NumericAttribute(
          attributeData as NumericAttributesData
        );
        element = findingToCdeSetBuilder.buildElementFromAttribute(attribute);
        elements.push(element);
      }
      if (!attribute) {
        throw new Error('Attribute type not found');
      }
    });

    const cdeSetData: CdeSetData = {
      //Set the metadata//
      id: 'rdes1', //TODO: generate a unique id uuidv4()?
      name: finding.name,
      description: finding.description ?? '', //defualt to empty string?
      version: {
        name: 'Initial Version',
        version_date: formattedCurrentDate,
        status_date: formattedCurrentDate,
        status: 'Proposed',
      },
      url: 'https://www.example.com',
      index_codes: [],
      body_parts: [], //Needed to change the name of the getter to get body_parts from get bodyParts?
      authors: {
        person: [
          {
            name: '', //TODO: What do we want these defualt values to be??
            orcid_id: '',
            twitter_handle: '',
            url: '',
            role: 'author',
          },
        ],
        organization: [],
      },
      history: [],
      specialty: [],
      elements: elements, //TODO: Set the elements based on the attribute type.
      references: [],
    };

    //Add the elements from attributes//

    const cdeSet = new CdeSet(cdeSetData);
    return cdeSet;
  };

  static buildElementFromAttribute = (
    attribute: ChoiceAttribute | NumericAttribute
  ): CdElement => {
    if (attribute instanceof ChoiceAttribute) {
      return this.buildElementFromChoiceAttribute(attribute);
    } else if (attribute instanceof NumericAttribute) {
      return this.buildElementFromNumericAttribute(attribute);
    } else {
      throw new Error('Attribute type not found');
    }
  };

  static buildElementFromChoiceAttribute(
    attribute: ChoiceAttribute
  ): ValueSetElement {
    const valuesSetData: ValueSetElementData = {
      id: 'RDE818', //TODO: generate a unique id uuid4()?
      parent_id: 0,
      name: attribute.name,
      definition: attribute.description,
      question: '',
      version: {
        name: 'Initial Version',
        version_date: formattedCurrentDate,
        status_date: formattedCurrentDate,
        status: 'Proposed',
      },
      index_codes: [],
      value_set: {
        cardinality: {
          min_cardinality: 1,
          max_cardinality: 1,
        },
        value_type: 'valueSet',
        values: attribute.values.map((value) => ({
          value: value.description ?? '',
          name: value.name,
        })),
      },
    };
    return new ValueSetElement(valuesSetData);
  }

  static buildElementFromNumericAttribute(
    attribute: NumericAttribute
  ): FloatElement {
    //TODO: Need a switch to determine the subtype of element.
    const elementData: ElementData = {
      id: 'Generate Unique ID', //uuid4()?
      parent_id: 0,
      name: attribute.name,
      definition: attribute.description,
      question: '',
      version: {
        name: 'Initial Version',
        version_date: formattedCurrentDate,
        status_date: formattedCurrentDate,
        status: 'Proposed',
      },
      index_codes: [],
      float_values: {
        value_type: 'float',
        cardinality: {
          min_cardinality: 1,
          max_cardinality: 1,
        },
        value_min_max: {
          value_min: attribute.minimum,
          value_max: attribute.maximum,
        },
        value_size: 1,
        step_value: 1,
        unit: '',
        values: [],
      },
    };
    return new FloatElement(elementData);
  }
}
