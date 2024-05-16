# OpenImagingDataModel.ts Reboot Plan

The TypsScript version of the Open Imaging Data Model needs to be reworked to bring it in line with the work in the Python version of the tool set. We will also take this opportunity to apply some of our hard-won knownledge from the work so far to create a more streamlined tool that's easier to work with, both for library users and further development of the library itself.

## Reconfigure Monorepo

Should be fewer packages under the monorepo, really everything in the library category can be in the `packages/lib` directory under a single `openimagingdatamodel` library. This can include:

- CDE Set
- Observation
- Finding Model
- Body Part/Anatomic Location
- Exam Type
- Ontology Tools

We can create a separate package for any tools (e.g., CLI tools) that will use the packages.

## Update Tooling

- Update `tsconfig.json` to be inline with the guidance outlined in [the Total TypeScript cheat sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet). Specifically, we should make sure to make sure to use imports with `.js` on them.
- Update ESLint configuration with modern default configuration from `eslint-typescript-default` plugins and ensure non-conflict with the Prettier formatter.
- Update TypeScript version to 5.3+ and make sure we configure VS Code project settings to use the project-installed TypeScript rather than editor version.
- Make sure we're using vitest appropriately for testing.
- Set up Husky pre-commit hooks so we don't get things out of hand.
- Set up Github Actions with appropriate package builds (and consider pushes to NPM as appropriate).

## Core Library Objects

The goal should be to use the Zod library to manage the validation of JSON objects as DTOs (data transfer objects). The pattern will be to define Zod schemata to be used for validation and from those infer DTOs which reflect the JSON or objects that can be used as the inputs to functions.

We then define the actual class objects by hand that define the individual fields as class instances rather than data objects. Each class accepts a DTO as its input, which it then validates using the schema. For each property, we provide a getter using camel case, and a setter that either accepts a class object of the relevant type or a DTO of the companion type (which is then passed for contruction).

For example, for CDE Sets, we'd have:

- A `cdeSetSchema` defined using Zod
- A `CDESetDTO` interface, generated using the schema
- A `CDESet` class object which:
  - Accepts a `CDESetDTO` as an input to its constructor
  - Has a `_url` private variable (a `string`), with a `url` getter and a setter that uses a part of `cdeSetSchema` to do its validation. (For a property with a name like `index_codes`, we'd also offer `indexCodes` versions of the getter/setter tied to the same underlying private variable)

Each of our objects would also offer a `serialize()` method which would output the relevant DTO version of itself (that is, `CDESet.serialize()` would return a `CDESetDTO` object).
