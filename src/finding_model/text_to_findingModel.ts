import { findingModelSchema, FindingModel } from "./findingModel.js";
import * as S from "@effect/schema/Schema";
import * as JSONSchema from "@effect/schema/JSONSchema";
import { Schema } from "@effect/schema";
import {
	findingModelExample,
	findingJsonExample,
} from "./data/findingExample.js";
import { Either } from "effect";
import * as dotenv from "dotenv";
dotenv.config();

const jsonSchema = JSONSchema.make(findingModelSchema); //This did not work. Responds with "Not a valid json format"
//console.log("New json Schema this one: ", jsonSchema);

const findingModelExampleJson = JSON.stringify(findingModelExample, null, 2);
//console.log("Finding Model Example JSON:", findingModelExampleJson);

import { OpenAI } from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
	throw new Error("API key is not defined in .env file");
}

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey });

// Function to generate a JSON object based on a dynamically provided schema and data
async function generateJsonFromSchemaAndData(schema: any, data: string) {
	try {
		// Request the model to return a valid JSON object with JSON mode enabled
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini", // Specify the model version you're using
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant. Always respond in valid JSON format.",
				},
				{
					role: "user",
					content: `Here is an example schema: ${findingModelExampleJson};
					What I need is the following:
					1. I am going to provide some data. I want you to take the data and provide a JSON object that strictly follows the example schema provided earlier. Please respond only with valid JSON.
					2. Here is the data: ${data};
					`,
				},
			],
			response_format: { type: "json_object" }, // Specify that JSON response is expected
		});

		// Extract the response
		const jsonResponse = completion.choices[0].message.content;

		// Attempt to parse the JSON response
		let parsedResponse;
		try {
			if (jsonResponse) {
				parsedResponse = JSON.parse(jsonResponse); // Convert the response to a JSON object
			} else {
				throw new Error("JSON response is empty or null");
			}
		} catch (e) {
			console.error("Error parsing JSON response:", e);
		}

		// Return the generated JSON object if it's valid
		if (parsedResponse) {
			return parsedResponse;
		}
	} catch (error) {
		console.error("Error fetching completion:", error);
	}
}

// Example usage
(async () => {
	// Example schema
	const mySchema = findingModelSchema;

	// Example data
	const report = `The report identifies a calcified pulmonary granuloma, a small lesion in the lungs often caused by inflammation from diseases such as tuberculosis. 
	As the granuloma heals, it becomes calcified, resulting in a hardened area of lung tissue due to calcium salt deposition. 
	The granuloma's size ranges from 0 to 5 cm in diameter. 
	Its location is within a specific anatomical region of the lungs, the consistency reflects varying levels of calcification, 
	and there has been a noted change in the size or number of granulomas compared to the previous imaging study.`;

	// Call the function with the schema and data
	const generatedJson = await generateJsonFromSchemaAndData(mySchema, report);
	console.log("Generated Finding from open AI first prompt:", generatedJson);
	console.log(
		"example attribute first AI example: ",
		generatedJson.attributes[1],
	);
	console.log(
		"example attribute values from first AI example: ",
		generatedJson.attributes[1].values[0],
	);
})();

(async () => {
	const mySchema = findingModelSchema;

	const report = `Devices/Tubes/Lines: None.
	Lungs: No new or enlarging pulmonary nodules. A few stable 2-3 mm
	  nodules are seen, for example in the left upper lobe (6:49, 63), and 
	  left lower lobe (6:138, 152). No consolidation. The airways are clear.
	Pleura: No pleural effusion or pneumothorax.
	Mediastinum: Heart size and pericardium are normal. Moderate amount
	  of coronary calcifications. No aortic aneurysm or dissection.
	Lymph Nodes: No enlarged supraclavicular, axillary, mediastinal, or
	  hilar lymph nodes.
	Upper Abdomen: Absence of intravenous contrast and low dose 
	  technique limits sensitivity for detecting small lesions, solid organ and
	  vascular findings. No abnormality detected in the visualized upper 
	  abdomen.
	Chest Wall: No chest wall mass.
	Bones: No suspicious lytic or blastic lesions. Moderate degenerative 
	  changes in the spine.`;

	// Call the function with the schema and data
	const generatedJson = await generateJsonFromSchemaAndData(mySchema, report);
	console.log(
		"Second Generated finding from openAI and stringified:",
		JSON.stringify(generatedJson, null, 2),
	);

	const decode = Schema.decodeUnknownEither(findingModelSchema);
	const decodedFinding = decode(generatedJson);
	if (Either.isRight(decodedFinding)) {
		const decodedData = decodedFinding.right;
		console.log("Decoded AI generated Finding: ", decodedData);
	} else {
		console.log("Error: ", decodedFinding.left);
	}

	const newFinding = new FindingModel(generatedJson);
	console.log(
		"New Finding Instance created from AI generated JSON: ",
		newFinding,
	);
})();
