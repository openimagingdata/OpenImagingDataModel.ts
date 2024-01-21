import { z } from 'zod';

import { bodyPartSchema, BodyPart } from './bodyPart';
import {
  elementSchema,
  CdElement,
  CdElementFactory,
  ValueSetElement,
  ValueSetValue,
} from './cdElement';
import { indexCodeSchema, IndexCode } from './indexCode';
import {
  specialtySchema,
  versionSchema,
  eventSchema,
  Organization,
  Person,
  authorSchema,
  referenceSchema,
  //Specialty, //TODO: create specialty class in shared
} from './shared';
import { FindingModel } from '../findingModel/src/findingModel';

//import { FindingModel } from '../../../findingModel/src/findingModel';
const idPattern = /^rdes\d{1,3}$/i;

export const cdeSetSchema = z.object({
  id: z.string().regex(idPattern, { message: 'Must be a valid ID' }),
  name: z.string().max(50, { message: 'Must be 50 or fewer characters long' }),
  description: z
    .string()
    .max(100, { message: 'Must be 100 or fewer characters long' }),
  version: versionSchema,
  url: z.string().url(),
  index_codes: z.array(indexCodeSchema),
  body_parts: z.array(bodyPartSchema),
  authors: authorSchema,
  history: z.array(eventSchema),
  specialty: z.array(specialtySchema),
  elements: z.array(elementSchema),
  references: z.array(referenceSchema),
});

export type CdeSetData = z.infer<typeof cdeSetSchema>;

export class CdeSet {
  private _data: CdeSetData;
  private _authors: (Person | Organization)[] = [];
  private _index_codes: IndexCode[] = [];
  private _body_parts: BodyPart[] = [];
  //private _specialty: Specialty[] = [];

  private _elements: CdElement[] = [];

  constructor(inData: CdeSetData) {
    this._data = { ...inData };

    inData.authors.person.forEach((personData) => {
      this._authors.push(new Person(personData));
    });
    inData.authors.organization?.forEach((organizationData) => {
      this._authors.push(new Organization(organizationData));
    });

    //Load index codes
    this._data.index_codes.forEach((indexCodeData) => {
      this._index_codes.push(new IndexCode(indexCodeData));
    });

    this._data.elements.forEach((elementData) => {
      this._elements.push(CdElementFactory.create(elementData));
    });
  }

  static async fetchFromRepo(rdesId: string): Promise<CdeSet | null> {
    const radElementAPI = `https://api3.rsna.org/radelement/v1/sets/${rdesId}`;

    try {
      const response = await fetch(radElementAPI);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const jsonData = await response.json();
      console.log(jsonData.data);
      const parsed = cdeSetSchema.safeParse(jsonData.data);
      if (!parsed.success) throw new Error(parsed.error.message);
      const cdeSetData: CdeSetData = parsed.data;
      console.log(cdeSetData);
      const cdeSetInstance = new CdeSet(cdeSetData);
      return cdeSetInstance;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  get id() {
    return this._data.id;
  }

  get name() {
    return this._data.name;
  }

  get description() {
    return this._data.description;
  }

  get version() {
    return this._data.version;
  }

  get indexCodes() {
    return [...this._index_codes];
  }

  get url() {
    return this._data.url;
  }

  get bodyParts() {
    return [...this._body_parts];
  }

  get authors() {
    return [...this._authors];
  }

  get history() {
    return [...this._data.history];
  }

  get specialty() {
    return [...this._data.specialty];
  }

  get references() {
    return [...this._data.references];
  }

  get elements() {
    return [...this._data.elements];
  }
}

//Take a finding model as input and out put a CDE Set based on it?
//In terms of FindingModel → CdeSet…
//1. CdeSetBuilder class. We can use the Partial<CdeSet> type (see https://timmousk.com/blog/typescript-partial/ for info on Partial<>.)
//Basically, the builder lets you slowly set the different things we need to define for the new CdeSet object, and then convert it to a final CdeSet when we have everything put together.
//We can go one by one through how we put together the required fiedls—most of them can be set to a reasonable default based on the idea
//that this is a new Set, it’s the first version,
//it has no history, it gets a temporary ID, and so on.
//Does that make sense?

//Questions:
//Do I want to add a partialCDE to CDEset contructor
//Mult
//data from findng map to an element in a new CDE. F

/*Finding {
  name,
  description,
  attributes [attributesSchema]
}

choiceAttribute
numeriAttribute

*/

export class CdeSetBuilder {
  private _data: Partial<CdeSet>;
  private _elements: CdElement[];
  private _values: ValueSetValue[];

  // {partialCde or FindingModel as input}?
  constructor(inData: Partial<CdeSet> | FindingModel) {
    this._data = { ...inData };
    this._elements = [];

    // get the attributes from the finding ie choice or numeric
    // May need to loop through each attribute and generate a cde from it
    // if numeric map to a float, int element
    if (this._data instanceof FindingModel) {
      let element: Partial<ValueSetElement>;
      const finding: FindingModel = this._data;
      // for each attribute we need 1 element.
      finding.attributes.forEach((attribute) => {
        // check the type (choice or numeric)
        switch (attribute.type) {
          //If its a choice attribute:
          case 'choice':
            //initialize values
            this._values = [];
            //get each finding.attribute.values and convert to cdElement.values
            attribute.values.forEach((value) => {
              this._values.push({
                value: value.name, // TODO: This is supposed to be a string in the form of RDExxx.x
                name: value.description,
              });
            });

            element = {
              id: 'Unique ID', // TODO: generate a unique ID
              parent_id: 1, // TODO: what number
              name: this._data.name,
              short_name: '', // TODO: Needed?
              editor: '', // TODO: add editor
              instructions: '', // TODO: add instructions
              synonyms: '', // TODO: add synonyms
              definition: this._data.description,
              question: '',
              version: {
                name: '',
                version_date: '',
                status_date: '',
                status: 'Proposed',
              },
              // index_codes: null,
              // authors: {
              //   person: null,
              //   organization: null,
              // },
              // history: ,
              // specialty:
              // references:
              // source= //,
              // value_set: {
              //   cardinality: {
              //     min_cardinality: '',
              //     max_cardinality: '',
              //   },
              //   value_min_max: {
              //     value_min: //,
              //     value_max: //,
              //   },
              //   step_value: //,
              //   unit: //,
              //   value_type: 'valueSet',
              //   value_size:  //,
              //
              //   TODO: add loop here for each? then add it?
              //   Have values be empty to start
              values: this._values,
            };

            this._elements.push(element); // push the finding to the elements array?
            break;

          case 'numeric':
            // numeric logic
            break;
        }
      });
    } else {
      // else inData is Partial<CdeSet>
    }
  }

  update(updatedData: Partial<CdeSet>): void {
    this._data = { ...this._data, ...updatedData };
  }
}
