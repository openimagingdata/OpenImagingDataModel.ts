import OpenAI from "openai";
import { zodFunction } from "openai/helpers/zod";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// Schemas

export const systemCodeSchema = z.object({
	system: z.string(),
	code: z.string().optional(),
	display: z.string().optional(),
});

export const codeableConceptValueSchema = z.object({
	code: z.array(systemCodeSchema),
	value: z.array(systemCodeSchema).nullable(),
});

export const stringValueSchema = z.object({
	code: z.array(systemCodeSchema),
	value: z.string().nullable(),
});

export const integerValueSchema = z.object({
	code: z.array(systemCodeSchema),
	value: z.number().int().nullable(),
});

export const floatValueSchema = z.object({
	code: z.array(systemCodeSchema),
	value: z.number().nullable(),
});

export const componentSchema = z.union([
	codeableConceptValueSchema,
	stringValueSchema,
	integerValueSchema,
	floatValueSchema,
]);

export const observationSchema = z.object({
	resourceType: z.literal("Observation"),
	id: z.string().optional(),
	code: systemCodeSchema,
	bodySite: z
		.object({
			code: systemCodeSchema,
		})
		.optional(),
	component: z.array(componentSchema),
});

const ObservationFunctionParams = z.object({
	resourceType: z.literal("Observation"),
	id: z.string().optional(),
	code: systemCodeSchema,
	bodySite: z
		.object({
			code: z
				.object({
					system: z.string(),
					code: z.string().optional(),
					display: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	component: z.array(
		z.object({
			code: z.object({
				system: z.string(),
				code: z.string().optional(),
				display: z.string().optional(),
			}),
			value: z.union([z.string(), z.number()]).nullable(),
		}),
	),
});

const ObservationFunctionParamsJSON = zodToJsonSchema(
	ObservationFunctionParams,
); //TODO remove this line

import * as dotenv from "dotenv";
dotenv.config();

console.log("Environment variables loaded:");
//console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
	throw new Error("API key is not defined in .env file");
}

const openai = new OpenAI({ apiKey });

const runAIRequest = async (textInput: string) => {
	try {
		const completion = await openai.beta.chat.completions.parse({
			model: "gpt-4o-2024-08-06",
			messages: [
				{
					role: "system",
					content:
						"You are an assistant that helps structure health data as observations.",
				},
				{ role: "user", content: textInput },
			],
			tools: [
				zodFunction({
					name: "generate_observation",
					parameters: ObservationFunctionParams,
				}),
			],
		});
		// Print the entire response for debugging
		console.log("Full API Response:", JSON.stringify(completion, null, 2));

		const toolCalls = completion.choices?.[0]?.message?.tool_calls;
		if (toolCalls && toolCalls.length > 0 && toolCalls[0]?.function) {
			console.log(toolCalls[0].function.parsed_arguments);
		} else {
			console.error("No valid tool call or function in the response.");
		}
	} catch (error) {
		console.error("Error:", error);
	}
};

// Example usage
const userTextInput = "Record an observation for blood pressure measurement.";
runAIRequest(userTextInput);

/*
//Notes
//It doesnt like .url() in the schema

//Does not like the following for body tpye: 

.object({
  code: systemCodeSchema,
})
.optional(),
component: z.array(componentSchema),
}); 

Does not like 
component: z.array(componentSchema),



*/
