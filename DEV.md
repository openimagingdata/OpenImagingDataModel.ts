# Info for Developers

## How to Work

- Create a branch for the task that you're working on
- Accomplish the task with changes in the branch
- Generate a pull request to push your changes back to the main branch
- When we release, we'll push the changes onto a production branch

> We should set up GitHub Actions to automate linting/testing on commitment
> of pull requests back to the main branch.

> Would also like to set up automated publishing of pushes to the prod branch

> Tool called **changeset** that makes it easier to work with versions, naming/
> numbering versions, maintaining changelogs, etc.

## Monorepo Organization

Repository consists of a top-level monorepo that includes sub-packages, all managed
via **pnpm workspaces**. Inidividual packages in the `packages` directory.

## Development Tooling

- **pnpm** package manager, which also manages the monorepo.
- **ESList** for code standard checking; the rules are a bit opinionated, but just go with them
- **Prettier** for code formatting; should set to format your code on paste and save
- **Rollup** for build and packaging
- **Vitest** for testing

## Recommended VS Code Extensions

- Better Comments
- Wallaby extensions
  - Console Ninja
  - Quokka
  - Wallaby
- ESList
- GitHub Copilot + Chat
- Live Share
- Markdown All in One
- npm Intellisense
- Path Intellisense
- Prettier - Code formatter
- Todo Tree
- Vitest
