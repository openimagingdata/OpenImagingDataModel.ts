"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindingModel =
	exports.choiceAttributes =
	exports.findingModelSchema =
	exports.attributeSchema =
	exports.numericAttributeSchema =
	exports.choiceAttributeSchema =
		void 0;
var schema_1 = require("@effect/schema");
var attributeTypeSchema = schema_1.Schema.Union(
	schema_1.Schema.Literal("choice"),
	schema_1.Schema.Literal("numeric"),
);
// ChoiceValue model
var choiceValueSchema = schema_1.Schema.Struct({
	name: schema_1.Schema.String,
	description: schema_1.Schema.optional(schema_1.Schema.String),
});
// ChoiceAttribute model
exports.choiceAttributeSchema = schema_1.Schema.Struct({
	name: schema_1.Schema.String,
	description: schema_1.Schema.optional(schema_1.Schema.String),
	type: schema_1.Schema.Literal("choice"),
	values: schema_1.Schema.Array(choiceValueSchema),
});
// NumericAttribute model
exports.numericAttributeSchema = schema_1.Schema.Struct({
	name: schema_1.Schema.String,
	description: schema_1.Schema.optional(schema_1.Schema.String),
	type: schema_1.Schema.Literal("numeric"),
	minimum: schema_1.Schema.optional(schema_1.Schema.Number),
	maximum: schema_1.Schema.optional(schema_1.Schema.Number), // TODO need be make nullable.
	unit: schema_1.Schema.optional(schema_1.Schema.String),
});
exports.attributeSchema = schema_1.Schema.Union(
	exports.choiceAttributeSchema,
	exports.numericAttributeSchema,
);
// FindingModel schema
exports.findingModelSchema = schema_1.Schema.Struct({
	name: schema_1.Schema.String,
	description: schema_1.Schema.String,
	attributes: schema_1.Schema.Array(exports.attributeSchema), //This needs to be a union of choice and numeric not attruibuteTypeSchema
});
//Classes
var ChoiceValue = /** @class */ (function () {
	function ChoiceValue(inData) {
		this.name = inData.name;
		this.description = inData.description;
	}
	return ChoiceValue;
})();
var choiceAttributes = /** @class */ (function () {
	function choiceAttributes(inData) {
		this.name = inData.name;
		this.values = inData.values.map(function (value) {
			return new ChoiceValue(value);
		});
		this.description = inData.description;
		this.type = "choice";
	}
	return choiceAttributes;
})();
exports.choiceAttributes = choiceAttributes;
var NumericAttribute = /** @class */ (function () {
	function NumericAttribute(inData) {
		this.name = inData.name;
		this.minimum = inData.minimum;
		this.maximum = inData.maximum;
		this.unit = inData.unit;
		this.description = inData.description;
		this.type = "numeric";
	}
	return NumericAttribute;
})();
var FindingModel = /** @class */ (function () {
	function FindingModel(inData) {
		this.finding_name = inData.name;
		this.description = inData.description;
		this.attributes = inData.attributes.map(function (attribute) {
			if (attribute.type === "choice") {
				return new choiceAttributes(attribute);
			} else {
				return new NumericAttribute(attribute);
			}
		});
	}
	return FindingModel;
})();
exports.FindingModel = FindingModel;
