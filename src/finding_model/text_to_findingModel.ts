import { findingModelSchema } from "./findingModel.js";
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

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
	throw new Error("API key is not defined in .env file");
}

/*
let encodedData;
const encodedDataEither = Schema.encodeEither(findingModelSchema)(findingJsonExample); 
if (Either.isRight(encodedDataEither)) {
    encodedData = encodedDataEither.right;
} else {
    console.log("Error: ", encodedDataEither.left);
}


const jsonSchema = Schema.parseJson(findingModelSchema);
const schemaAsJson = JSON.stringify(jsonSchema, null, 2);
console.log("Json Schema: ", schemaAsJson); */

const findingModelExampleJson = JSON.stringify(findingModelExample, null, 2);

console.log(findingModelSchema);
//TODO: Not working well. Try encoding or decoding the schema?
const schemaAsString = JSON.stringify(findingModelSchema, null, 2);
console.log(`Schema: ${schemaAsString}`);

import { OpenAI } from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey });

(async () => {
	try {
		// Request the model to return a valid JSON object with JSON mode enabled
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{
					role: "system",
					content:
						"You are a helpful assistant. Always respond in valid JSON format.",
				},
				{
					role: "user",
					content: `Here is a schema: ${findingModelExampleJson}. Can you generate a JSON object that strictly follows this schema? Please respond only with valid JSON.`,
				},
			],
			response_format: { type: "json_object" }, // JSON mode enabled
		});

		// Extract the response (no need to clean if JSON mode works correctly)
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

		// Store the parsed JSON object in a variable
		const generatedExample = parsedResponse;

		// Log the JSON object if it's valid
		if (generatedExample) {
			console.log("Generated JSON Example:", generatedExample);
		}
	} catch (error) {
		console.error("Error fetching completion:", error);
	}
})();
