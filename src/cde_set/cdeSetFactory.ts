import { Version, Status, Event, StatusOptions } from "./common.js";
import { CdeSet } from "./cdeSet.js";
import {
	IntegerElement,
	FloatElement,
	BooleanElement,
	ValueSetElement,
	IntegerValue,
	FloatValue,
	valueSetSchema,
	cdElementBaseType,
} from "./cde_element.js";
import { Schema } from "@effect/schema";
import { Either } from "effect";
import { FindingModel } from "../finding_model/findingModel.js";

export interface ValueArgs {
	name: string;
	value?: string;
}

const generateRandomDigits = (): string => {
	const digits = "0123456789";
	return Array.from(
		{ length: 4 },
		() => digits[Math.floor(Math.random() * digits.length)],
	).join("");
};

export const createSet = (
	name: string,
	description: string | null = null,
	addPresenceElement = false,
): CdeSet => {
	if (!name) {
		throw new Error("Name is required for a CDE Set");
	}

	const randomDigits = generateRandomDigits();
	const today = new Date().toISOString().split("T")[0];
	const version = new Version(1, today);
	const status = new Status(today, "Proposed");
	const eventInput = { date: today, status } as const;
	const history: Event[] = [new Event(eventInput)];

	const set = new CdeSet({
		id: `TO_BE_DETERMINED${randomDigits}`,
		name,
		description: description || `Description for ${name}`,
		schema_version: "1.0.0",
		set_version: version,
		status,
		history,
		index_codes: [],
		specialties: [],
		elements: [],
	});

	if (addPresenceElement) {
		set.elements.push(createPresenceElement(name));
	}

	return set;
};

export const defaultElementMetadata = (name: string) => {
	if (!name) {
		throw new Error("Name is required for a CDE Element");
	}

	const today = new Date().toISOString().split("T")[0];
	const randomDigits = generateRandomDigits();

	return {
		id: `TO_BE_DETERMINED${randomDigits}`,
		name,
		definition: "",
		question: "",
		values: [],
		parent_set: "TO_BE_DETERMINED",
		element_version: {
			number: 1,
			date: today,
		},
		schema_version: "1.0.0",
		status: {
			date: today,
			name: "Proposed" as StatusOptions,
		},
	};
};

export const createIntegerElement = (
	name: string,
	min: number | null = null,
	max: number | null = null,
	step: number | null = null,
	unit: string | null = null,
): IntegerElement => {
	const elementId = "TO_BE_DETERMINED" + generateRandomDigits();
	const boilerplate = defaultElementMetadata(name);
	boilerplate.id = elementId;

	const integerValueArgs: Partial<{
		min_value: number;
		max_value: number;
		step: number;
		unit: string;
	}> = {};

	if (min !== null) {
		integerValueArgs.min_value = min;
	}
	if (max !== null) {
		integerValueArgs.max_value = max;
	}
	if (step !== null) {
		integerValueArgs.step = step;
	}
	if (unit !== null) {
		integerValueArgs.unit = unit;
	}

	return new IntegerElement({
		...boilerplate,
		integer_value: new IntegerValue(integerValueArgs),
	});
};

export const createFloatElement = (
	name: string,
	min: number | null = null,
	max: number | null = null,
	step: number | null = null,
	unit: string | null = null,
): FloatElement => {
	const elementId = "TO_BE_DETERMINED" + generateRandomDigits();
	const boilerplate = defaultElementMetadata(name);
	boilerplate.id = elementId;

	const floatValueArgs: Partial<{
		min_value: number;
		max_value: number;
		step: number;
		unit: string;
	}> = {};

	if (min !== null) {
		floatValueArgs.min_value = min;
	}
	if (max !== null) {
		floatValueArgs.max_value = max;
	}
	if (step !== null) {
		floatValueArgs.step = step;
	}
	if (unit !== null) {
		floatValueArgs.unit = unit;
	}

	return new FloatElement({
		...boilerplate,
		float_value: new FloatValue(floatValueArgs),
	});
};

export const createBooleanElement = (name: string): BooleanElement => {
	const elementId = "TO_BE_DETERMINED" + generateRandomDigits();
	const boilerplate = defaultElementMetadata(name);
	boilerplate.id = elementId;

	return new BooleanElement({
		...boilerplate,
		boolean_value: "boolean",
	});
};

export const createValueSetElement = (
	name: string,
	values: ValueArgs[],
	definition: string | null = null,
	question: string | null = null,
	min_cardinality = 1,
	max_cardinality = 1,
): ValueSetElement => {
	const elementId = "TO_BE_DETERMINED" + generateRandomDigits();
	const boilerplate = defaultElementMetadata(name);
	boilerplate.id = elementId;

	if (definition) {
		boilerplate.definition = definition;
	}

	if (question) {
		boilerplate.question = question;
	}

	if (values.length < 2) {
		throw new Error("Value set must have at least two values");
	}
	/*The checkAndFixValue function standardizes an input (either a string or an object) by ensuring 
    that the object has a name, code, and value properties. It renames description to definition if 
    present, and assigns value in snake_case if not already defined. This ensures all values are in 
    a consistent format for further processing.*/
	const checkAndFixValue = (
		value: ValueArgs | string,
		index: number,
	): Record<string, string> => {
		const outValue = (
			typeof value === "string" ? { name: value } : { ...value }
		) as Record<string, string>;

		if (!outValue.name) {
			throw new Error("Value must have a name");
		}

		outValue.code = `${elementId}.${index}`;

		if ("description" in outValue) {
			outValue.definition = outValue.description;
			delete outValue.description;
		}

		//If outValue doesn’t already have a value property (outValue.value), assign it a value derived from the name by converting it to snake_case.
		outValue.value ||= toSnake(outValue.name);

		return outValue;
	};

	const processedValues = values.map(checkAndFixValue);

	const inData = {
		min_cardinality,
		max_cardinality,
		values: processedValues,
	};

	const valueSetDecoder = Schema.decodeUnknownEither(valueSetSchema);
	const decodedInData = valueSetDecoder(inData);
	if (Either.isLeft(decodedInData)) {
		console.error("ValueSet schema validation error:", decodedInData.left);
		throw new Error("Invalid value set data");
	} else {
		const elementData = { ...boilerplate, value_set: decodedInData.right };
		return new ValueSetElement(elementData);
	}
};

const toSnake = (name: string): string => {
	const snakeCased = name
		.replace(/([a-z])([A-Z])/g, "$1_$2") // Convert camelCase to snake_case
		.replace(/\s+/g, "_") // Replace spaces with underscores
		.toLowerCase(); // Convert to lowercase

	return snakeCased;
};

export const createPresenceElement = (
	findingName: string | null = null,
	definition: string | null = null,
	question: string | null = null,
): ValueSetElement => {
	// Determine the name, definition, and question values
	const name = findingName ? `Presence of ${findingName}` : "Presence";

	//definition remains definition if it has a value or the conditional...
	definition ||= findingName
		? `Presence of ${findingName}`
		: "Presence of the feature";

	question ||= findingName
		? `Is the ${findingName} present?`
		: "Is the feature present?";

	// Define the values list
	const values: { value: string; name: string }[] = [
		{
			value: "absent",
			name: "Absent",
		},
		{
			value: "present",
			name: "Present",
		},
		{
			value: "unknown",
			name: "Unknown",
		},
		{
			value: "indeterminate",
			name: "Indeterminate",
		},
	];

	return createValueSetElement(name, values, definition, question);
};

export const createSetFromFindingModel = (model: FindingModel): CdeSet => {
	const newSet = createSet(model.name, model.description, true);
	model.attributes.forEach((attribute) => {
		//if attribute is a choice, create a value set element
		if (attribute.type === "choice") {
			const values = attribute.values.map((value) => ({
				name: value.name,
				value: value.description,
			}));
			const newElement = createValueSetElement(
				attribute.name,
				values,
				attribute.description,
			);
			newSet.addElement(newElement);
		} else {
			//if attribute is numeric, create a float element
			const newElement = createFloatElement(
				attribute.name,
				attribute.minimum,
				attribute.maximum,
				undefined,
				attribute.unit,
			);
			if (attribute.description) {
				newElement.definition = attribute.description;
			}
			newSet.addElement(newElement);
		}
	});
	return newSet;
};
