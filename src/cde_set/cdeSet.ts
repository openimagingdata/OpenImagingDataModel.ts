import { Schema } from "@effect/schema";
import { Either } from "effect";
// Remove the duplicate import statement for 'URL'
import {
	versionSchema,
	contributorsSchema,
	eventSchema,
	specialtySchema,
	statusSchema,
	indexCodesSchema,
	referencesSchema,
	setVersionSchaema,
} from "./common.js";

import {
	ValueSetElement,
	CdElementFactory,
	BaseElement,
	cdElementBaseSchema,
	cdElementBaseType,
	ElementType,
	elementUnionSchema,
} from "./cde_element.js";

import { URL } from "url";

export const cdeSetSchema = Schema.Struct({
	id: Schema.String,
	parent_set: Schema.optional(Schema.String),
	name: Schema.String,
	description: Schema.optional(Schema.String),
	element_version: Schema.optional(versionSchema),
	schema_version: Schema.String,
	set_version: setVersionSchaema,
	status: statusSchema,
	question: Schema.optional(Schema.String),
	index_codes: Schema.optional(Schema.Array(indexCodesSchema)),
	contributors: Schema.optional(contributorsSchema),
	specialties: Schema.optional(Schema.Array(specialtySchema)),
	history: Schema.optional(Schema.Array(eventSchema)),
	references: Schema.optional(Schema.Array(referencesSchema)),
	elements: Schema.Array(elementUnionSchema),
});

export type CdeSetType = Schema.Schema.Type<typeof cdeSetSchema>;

export class CdeSet {
	private _data: CdeSetType;
	private _elements: BaseElement[] = []; //This shouldnt work, need the subtype but ElementType not working. Works because subtypes extend the super

	constructor(inData: CdeSetType) {
		this._data = { ...inData };
		this.initializeElement();
	}

	private initializeElement() {
		this._data.elements.forEach((element) => {
			const newElement = CdElementFactory.create(element);
			if (newElement) {
				this._elements.push(newElement);
			} else {
				console.error(`Failed to create element: ${element.id}`);
			}
		});
	}

	get id() {
		return this._data.id;
	}

	get name() {
		return this._data.name;
	}

	get parentSet() {
		return this._data.parent_set;
	}

	get schemaVersion() {
		return this._data.schema_version;
	}

	get description() {
		return this._data.description;
	}

	get setVersion() {
		return this._data.set_version;
	}

	get status() {
		return this._data.status;
	}

	get indexCodes() {
		return [...(this._data.index_codes ?? [])];
	}

	get contributors() {
		return this._data.contributors;
	}

	get history() {
		return [...(this._data.history ?? [])];
	}

	get specialties() {
		return [...(this._data.specialties ?? [])];
	}

	get references() {
		return [...(this._data.references ?? [])];
	}

	get elements() {
		return [...this._elements];
	}

	static async fetchFromRepo(rdesId: string): Promise<CdeSet | null> {
		const radElementAPI = `https://api3.rsna.org/radelement/v1/sets/${rdesId}`;

		try {
			const response = await fetch(radElementAPI);
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			const jsonData = await response.json();

			// Decode the data using the schema
			const decodeCdeSet = Schema.decodeUnknownEither(cdeSetSchema);
			const result = decodeCdeSet(jsonData.data);

			if (Either.isRight(result)) {
				// Successfully parsed and validated data
				const parsed = result.right;
				return new CdeSet(parsed);
			} else {
				// Validation failed
				console.error("Validation errors:", result.left);
				return null;
			}
		} catch (error) {
			console.error("Error:", error);
			return null;
		}
	}
}
