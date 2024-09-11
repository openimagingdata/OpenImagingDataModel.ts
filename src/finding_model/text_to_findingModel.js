"use strict";
//pnpm install openai
//change type to module?
Object.defineProperty(exports, "__esModule", { value: true });
// Import the OpenAI package using ES6 modules
var openai_1 = require("openai");
var openai = new openai_1.OpenAI();
var completion = await openai.chat.completions.create({
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
