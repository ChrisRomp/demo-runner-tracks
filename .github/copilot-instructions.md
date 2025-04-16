# About

Monorepo containing two related projects

- Runner tracks, a website for runners to get information about multiple races
- Race management, a website for race organizers to add and get information about their race

## Runner tracks

- Located in the ts-web folder
- Hosts APIs for race management to get and send data, and the website for runners
- Uses SvelteKit 4
  - Use SSR for dynamic content rendering
  - Use static site generation (SSG) for pre-rendered static pages
  - The only files which start with + are for SvelteKit; no test files start with +
- Uses Tailwind 3
  - All style is done using Tailwind
  - Modern look with rounded corners and subtle shadows
- Prisma data access
  - Use Prisma when working with TypeScript
  - Use SQLite's limited supported aggregation functions
  - SQLite always does case insensitive comparisons, so don't use mode
  - When asked to generate queries, just provide the Prisma query
- Testing
  - Use `vitest` for unit testing TypeScript and JavaScript
    - Svelte pages are tested in page.server.test.ts, with no plus sign for the file
    - Other services and components are tested in the same directory as the file
    - Keep unit tests small and focused
    - Mocks created in the `__mocks__` folder using `mockDeep`
  - Use `pytest` for unit testing Python
  - Use `playwright` for end-to-end testing.
    - Playwright should always use role based locators

## Race management

- Located in the python folder
- Flask application for race organizers
- Uses API exposed by runner tracks to get data
- Uses `pytest` for unit testing

## General programming notes

### Typescript 5
- Prefer interfaces over types
- Constants should use camelCasing

### Python notes
- Follow pep8 when appropriate

