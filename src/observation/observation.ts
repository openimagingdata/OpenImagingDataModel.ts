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

export type ObservationResult = z.infer<typeof ObservationFunctionParams>;

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

const runAIRequest = async (
	textInput: string,
): Promise<ObservationResult | null> => {
	try {
		const completion = await openai.beta.chat.completions.parse({
			model: "gpt-4o-2024-08-06",
			messages: [
				{
					role: "system",
					content: `You are an assistant that helps structure health data as observations. I will provide the data and you will generate the observation resource in FHIR format.
            There are several types of components including: 
            - String with a string value
            - Integer with a integer value
            - Float with a flaot value
            - CodeableConcept with a code and optional value
            You can use these components to structure the observation.

            Here is an example of the different component types: 
            component: [
                {
                  code: [
                    {
                      system: 'http://loinc.org',
                      code: '12345-6',
                      display: 'Test Observation',
                    },
                  ],
                  value: [
                    {
                      system: 'http://snomed.info/sct',
                      code: '123456789',
                      display: 'Aorta',
                    },
                  ],
                },
                {
                  code: [
                    {
                      system: 'http://loinc.org',
                      code: '12345-6',
                      display: 'Test Observation',
                    },
                  ],
                  value: '6', //TODO: what is its namedvalueString?
                },
              ],
            };
            
            
            `,
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

		// Print Response for debugging
		//console.log("Full API Response:", JSON.stringify(completion, null, 2));

		const toolCalls = completion.choices?.[0]?.message?.tool_calls;
		if (toolCalls && toolCalls.length > 0 && toolCalls[0]?.function) {
			// Extract the result and cast it to ObservationResult
			const result = toolCalls[0].function.parsed_arguments;
			return result as ObservationResult;
		} else {
			console.error("No valid tool call or function in the response.");
			return null;
		}
	} catch (error) {
		console.error("Error:", error);
		throw error; // Rethrow the error to be handled by .catch()
	}
};

// Example usage
const userTextInput = "Record an observation for blood pressure measurement.";
const radiologyText = `CT Abdomen and Pelvis with contrast shows a 2.3 cm hypodense lesion in segment VII of the liver.
 The lesion exhibits peripheral enhancement in the arterial phase with delayed washout, consistent with hepatocellular carcinoma. 
 No evidence of metastatic disease or lymphadenopathy is seen. The remaining liver parenchyma is unremarkable. No ascites is present.`;
runAIRequest(radiologyText)
	.then((observation) => {
		if (observation) {
			// Access properties from the resolved value
			console.log("Observation ID:", observation.id);
			console.log("Observation Code:", observation.code);
			console.log("Observation Body Site:", observation.bodySite);
			console.log("Observation Components:", observation.component);
			console.log("Here is the observation", observation);
		} else {
			console.log("No valid finding returned.");
		}
	})
	.catch((error) => {
		console.error("Error:", error);
	});

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
