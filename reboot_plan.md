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

## Update Tooling

- Update `tsconfig.json` to be inline with the guidance outlined in [the Total TypeScript cheat sheet](https://www.totaltypescript.com/tsconfig-cheat-sheet). Specifically, we should make sure to make sure to use imports with `.js` on them.
- Update ESLint configuration with modern default configuration from `eslint-typescript-default` plugins and ensure non-conflict with the Prettier formatter.
- Update TypeScript version to 5.3+ and make sure we configure VS Code project settings to use the project-installed TypeScript rather than editor version.

