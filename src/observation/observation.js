"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
					});
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) {
						throw t[1];
					}
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g = Object.create(
				(typeof Iterator === "function" ? Iterator : Object).prototype,
			);
		return (
			(g.next = verb(0)),
			(g["throw"] = verb(1)),
			(g["return"] = verb(2)),
			typeof Symbol === "function" &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) {
				throw new TypeError("Generator is already executing.");
			}

			while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y["return"]
									: op[0]
										? y["throw"] || ((t = y["return"]) && t.call(y), 0)
										: y.next) &&
							!(t = t.call(y, op[1])).done)
					) {
						return t;
					}
					if (((y = 0), t)) {
						op = [op[0] & 2, t.value];
					}
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) {
								_.ops.pop();
							}
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			}

			if (op[0] & 5) {
				throw op[1];
			}
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.observationSchema =
	exports.componentSchema =
	exports.floatValueSchema =
	exports.integerValueSchema =
	exports.stringValueSchema =
	exports.codeableConceptValueSchema =
	exports.systemCodeSchema =
		void 0;
var openai_1 = require("openai");
var zod_1 = require("openai/helpers/zod");
var zod_2 = require("zod");
// Schemas
exports.systemCodeSchema = zod_2.z.object({
	system: zod_2.z.string().url(),
	code: zod_2.z.string().optional(),
	display: zod_2.z.string().optional(),
});
exports.codeableConceptValueSchema = zod_2.z.object({
	code: zod_2.z.array(exports.systemCodeSchema),
	value: zod_2.z.array(exports.systemCodeSchema).nullable(),
});
exports.stringValueSchema = zod_2.z.object({
	code: zod_2.z.array(exports.systemCodeSchema),
	value: zod_2.z.string().nullable(),
});
exports.integerValueSchema = zod_2.z.object({
	code: zod_2.z.array(exports.systemCodeSchema),
	value: zod_2.z.number().int().nullable(),
});
exports.floatValueSchema = zod_2.z.object({
	code: zod_2.z.array(exports.systemCodeSchema),
	value: zod_2.z.number().nullable(),
});
exports.componentSchema = zod_2.z.union([
	exports.codeableConceptValueSchema,
	exports.stringValueSchema,
	exports.integerValueSchema,
	exports.floatValueSchema,
]);
exports.observationSchema = zod_2.z.object({
	resourceType: zod_2.z.literal("Observation"),
	id: zod_2.z.string().optional(),
	code: exports.systemCodeSchema,
	bodySite: zod_2.z
		.object({
			code: exports.systemCodeSchema,
		})
		.optional(),
	component: zod_2.z.array(exports.componentSchema),
});
// Define the function parameters schema using zod
var ObservationFunctionParams = zod_2.z.object({
	resourceType: zod_2.z.literal("Observation"),
	code: zod_2.z.object({
		system: zod_2.z.string().url(),
		code: zod_2.z.string(),
		display: zod_2.z.string().optional(),
	}),
	bodySite: zod_2.z
		.object({
			code: zod_2.z.object({
				system: zod_2.z.string().url(),
				code: zod_2.z.string(),
				display: zod_2.z.string().optional(),
			}),
		})
		.optional(),
	component: zod_2.z.array(
		zod_2.z.union([
			zod_2.z.object({ value: zod_2.z.number().nullable() }),
			zod_2.z.object({ value: zod_2.z.string().nullable() }),
		]),
	),
});
var openai = new openai_1.default({
	apiKey: process.env.OPENAI_API_KEY,
});
var runAIRequest = function (textInput) {
	return __awaiter(void 0, void 0, void 0, function () {
		var completion, functionCall, parsedArgs, validationResult, error_1;
		var _a;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_b.trys.push([0, 2, , 3]);
					return [
						4 /*yield*/,
						openai.beta.chat.completions.parse({
							model: "gpt-4o-2024-08-06", // Replace with the correct model version
							messages: [
								{
									role: "system",
									content:
										"You are an assistant that helps structure health data as observations.",
								},
								{ role: "user", content: textInput },
							],
							tools: [
								(0, zod_1.zodFunction)({
									name: "generate_observation",
									parameters: ObservationFunctionParams,
								}),
							],
						}),
					];
				case 1:
					completion = _b.sent();
					functionCall =
						(_a = completion.choices[0]) === null || _a === void 0
							? void 0
							: _a.message.tool_calls[0];
					if (
						functionCall === null || functionCall === void 0
							? void 0
							: functionCall.function
					) {
						parsedArgs = functionCall.function.parsed_arguments;
						console.log("Parsed observation data:", parsedArgs);
						validationResult = exports.observationSchema.safeParse(parsedArgs);
						if (validationResult.success) {
							console.log("Validation successful:", validationResult.data);
						} else {
							console.error(
								"Validation failed:",
								validationResult.error.format(),
							);
						}
					} else {
						console.error("No function call was generated.");
					}
					return [3 /*break*/, 3];
				case 2:
					error_1 = _b.sent();
					console.error("Error in AI request:", error_1);
					return [3 /*break*/, 3];
				case 3:
					return [2 /*return*/];
			}
		});
	});
};
// Example usage
var userTextInput = "Record an observation for blood pressure measurement.";
runAIRequest(userTextInput);
