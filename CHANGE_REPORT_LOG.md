# Change Report Log

## 2025-03-04

### Added

-   Applied previous unit test code to `test/index.test.ts`.
-   Modified `global.fetch` mocking from using `jest.fn()` to directly overriding `global.fetch`.
-   Resolved several type-related issues with `global.fetch` (defined `CustomResponse` interface, used `declare global`, and used `as any` when necessary).

### Changed

-   N/A

### Removed

-   N/A

## 2025-03-04

### Added

-   Created `package.json` with project metadata, dependencies, and scripts.
-   Created `tsconfig.json` for TypeScript compiler configuration.
-   Created `src/index.ts` containing the `isImageUrl` function and related image type checking functions.
-   Created `test/index.test.ts` with unit tests for the `isImageUrl` function.
-   Created `jest.config.js` for Jest configuration.
-   Created `README.md` with project description, installation instructions, usage examples, and API documentation.
-   Created `CHANGELOG.md` to track project changes.

### Changed

-   N/A

### Removed

-   N/A
