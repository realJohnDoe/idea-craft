# Technical Context

## Technologies Used

- TypeScript: For type-safe development of the application.
- React: For building a dynamic and responsive user interface.
- Vite: For fast bundling and development server capabilities.
- Tailwind CSS: For utility-first styling of the application.
- Markdown: For storing data in a human-readable format.
- YAML: For parsing frontmatter metadata in markdown files.
- Vitest: For unit testing React components and utility functions.
- shadcn-ui: For pre-built, customizable UI components.

## Development Setup

- The project uses npm for package management and dependency installation.
- ESLint is employed for linting to maintain code quality and consistency.
- Prettier is used for code formatting to ensure a uniform style across the codebase.
- TypeScript configuration includes aliasing (`@` for `src/`) and has been updated to include the `test` directory in `tsconfig.app.json` to resolve IDE import recognition issues.

## Dependencies

- React
- React DOM
- Vite
- Tailwind CSS
- js-yaml
- lucide-react (currently commented out in some components due to resolution issues during testing)

## Tool Usage Patterns

- `npm install`: To install dependencies required by the project.
- `npm run dev`: To start the Vite development server with auto-reloading and instant preview.
- `npm run build`: To build the application for production deployment.
- `npm run test`: To execute unit tests using Vitest, ensuring component and utility functionality.

## Technical Challenges

- Encountered issues with `lucide-react` dependency resolution during test runs, temporarily resolved by commenting out imports in affected components (e.g., `AttributeEditor.tsx`). A permanent solution is pending, potentially involving correct installation verification or switching to an alternative icon library.
- Resolved IDE import recognition errors by including the `test` directory in TypeScript configuration, ensuring aliases like `@/lib/` are correctly resolved in both source and test files.
