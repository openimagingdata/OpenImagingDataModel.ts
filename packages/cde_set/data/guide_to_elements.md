# Guide to Element Types

There are 4 different element types:

- Value set
- Float
- Integer
- Boolean

In the element definition, there is an object that specifies what's allowed in terms of values for the element. For value sets, it's within `value_set`, `float_values`, `integer_values`, or `boolean_values`.

In any of these, there is a `value_type` string, which will be one of `valueSet`, `float`, `integer`, or `boolean`.

## `ValueSet`

Relevant:

- `cardinality`
- `values`

Not Relevant:

- `unit`
- `step_value`
- `value_size`
- `value_min_max`
- `value_type`

## `Float` and `Integer`

Relevant:

- `unit`
- `step_value`
- `value_min_max`

Not relevant:

- `values`
- `cardinality`
- `value_size`
- `value_type`

## `Boolean`

Relevant:

-

Not Relevant:

- `unit`
- `step_value`
- `value_min_max`
- `values`
- `cardinality`
- `value_size`
- `value_type`
