# Technical Context for Idea Craft

## Technologies Used
- **React (with Hooks):** Core framework for building the user interface as a single-page application, leveraging hooks for state management and side effects within components.
- **TypeScript:** Provides type safety, enhancing code reliability and maintainability by catching errors during development, especially critical for a growing component-based app.
- **Vite:** Build tool and development server chosen for its speed in hot module replacement and build times, improving developer productivity over alternatives like Create React App.
- **Tailwind CSS:** Utility-first CSS framework for styling, customized with Atom One Dark theme colors in `tailwind.config.ts`, ensuring a consistent and visually appealing design. Custom color names (e.g., `text-red`) must be used due to overridden defaults.
- **Markdown with Frontmatter:** Content format for user data, parsed using utility functions, enabling portable, human-readable content storage with metadata support for type inference and attributes.
- **React Markdown (Planned or Integrated):** Library for rendering markdown content into React components, ensuring accurate display of user content with support for wikilinks and other markdown features.
- **Local Storage API:** Browser API used for persisting user data locally as JSON, providing simplicity and offline access without a backend in the initial implementation.
- **File System Access API (Planned):** To be used for local directory syncing, allowing users to select a static folder on their device for bidirectional markdown file management, enhancing data portability outside the app.

## Development Setup
- **Node.js and npm:** Environment for running Vite, managing dependencies, and executing build scripts. Ensure Node.js version compatibility (typically LTS) for stability with Vite and other tools.
- **VSCode:** Recommended editor for development, with extensions for TypeScript, React, and Tailwind CSS to aid in code completion, linting, and debugging.
- **ESLint:** Configured for code quality and consistency, enforcing rules tailored for React and TypeScript to prevent common errors and maintain style conventions.
- **Vitest:** Testing framework for unit tests, integrated with Vite for fast test execution, used to validate component behavior and utility functions (e.g., `AttributeEditor`, content parsing).
- **Test Directory in tsconfig.app.json:** Added to resolve IDE import recognition issues with `@` aliases in test files, ensuring consistent path resolution across development environments.
- **No Backend:** Currently, Idea Craft operates without a server-side component, relying entirely on client-side storage and processing for simplicity and offline capability.

## Technical Constraints
- **Browser Compatibility:** The app targets modern browsers (Chrome, Edge, Firefox) for full feature support, particularly for local storage and planned File System Access API usage. Limited or no support for older browsers like Internet Explorer.
- **Local Storage Limits:** Browser local storage has capacity limits (typically 5-10 MB depending on the browser), which may constrain the volume of content users can store without a backend or sync solution.
- **No Server-Side Sync (Yet):** Without a backend, real-time syncing across devices isn't possible; data remains device-specific unless manually exported/imported or synced via the planned local directory feature.
- **File System Access API Limitations (Planned):** This API is supported only in certain modern browsers (e.g., Chrome, Edge) and may require user re-approval for directory access across sessions due to security restrictions, impacting the seamless sync experience.

## Dependencies
- **React and React DOM:** Core libraries for UI rendering and component lifecycle management, critical for the SPA framework.
- **Tailwind CSS and PostCSS:** Styling dependencies, with PostCSS for processing Tailwind directives, customized in `tailwind.config.ts` for the Atom One Dark theme.
- **lucide-react:** Icon library used for UI elements, fully integrated after resolving initial import issues in tests by removing mock aliases.
- **shadcn/ui (Assumed or Integrated):** UI component library for consistent, accessible components like buttons and dialogs, enhancing the user interface.
- **Other Utilities (Assumed):** Libraries like `uuid` for unique ID generation (`id-utils.ts`) and markdown parsing utilities for content management.

## Tool Usage Patterns
- **Component Refactoring:** Break down complex components (e.g., `ContentBody`) into smaller, reusable ones (e.g., `AttributeEditor`, `EditActions`) for better maintainability, following a modular design approach.
- **Test-Driven Development (TDD):** Follow Kent Beck's TDD principles by writing tests before implementation (Red → Green → Refactor), ensuring robust functionality as seen with `AttributeEditor` tests.
- **Tidy First:** Separate structural, behavioral, and meta changes, with meta changes (like documentation) prioritized, followed by structural refactoring, and then behavioral updates, maintaining clean commit discipline.
- **Alias Imports:** Use `@` aliases for consistent import paths across the codebase, including test files, resolved via `tsconfig.app.json` for IDE recognition.
- **Manual Testing for UI:** Beyond automated tests, manual testing in browsers is used to verify UI interactions (e.g., wikilink previews, editing states) that are harder to automate.

## Technical Challenges
- **Styling Overrides:** Custom Tailwind color definitions override standard palette values, requiring exact custom names (e.g., `text-red`) and inheritance tracing for debugging, as seen with `EditActions` icon styling.
- **Test Element Selection:** Initial test failures in `ContentBody.test.tsx` due to unreliable selectors were resolved by using `title` attributes for unique, accessible element identification.
- **Import Alias in Tests:** IDE and build issues with `@` imports in test files were fixed by including the `test` directory in `tsconfig.app.json`, ensuring consistent path resolution.
- **PWA Development in Local Environment:** Challenges with HTTPS requirements for service workers in local development led to errors during registration, prompting a strategic pivot from a full PWA setup to a non-PWA web app with home screen shortcut support for mobile accessibility.
- **Browser Compatibility for Syncing (Planned):** The File System Access API for local directory syncing has limited browser support and session-based permission constraints, requiring clear user communication and potential fallback options for unsupported environments.

This file focuses on the technologies, setup, and technical challenges of Idea Craft. For architectural patterns, user experience goals, or current project status, refer to other memory bank files.
