import * as dotenv from "dotenv";
dotenv.config();

console.log("Environment variables loaded:");
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
	throw new Error("API key is not defined in .env file");
}

// Import the OpenAI package using ES6 modules
import { OpenAI } from "openai";

// Initialize the OpenAI client
const openai = new OpenAI({ apiKey });

// Wrap top-level await in an async function to ensure compatibility
(async () => {
	try {
		const completion = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: [
				{ role: "system", content: "You are a helpful assistant." },
				{
					role: "user",
					content: "Write a haiku about recursion in programming.",
				},
			],
		});

		console.log(completion.choices[0].message);
	} catch (error) {
		console.error("Error fetching completion:", error);
	}
})();
