# Progress

## What Works

- The memory bank structure is fully set up with core files documenting the project's context and status.
- The application allows users to create, edit, and delete items (tasks, events, messages, and notes).
- Items are stored in local storage, with support for importing and exporting as markdown files.
- The application features a basic UI with components like Navbar, TypeFilter, TagsFilter, ContentList, and SelectedItemView.
- Type inference from frontmatter is implemented, allowing flexible categorization of items.
- Quick preview for wikilinks is functional when typing `[[`, with automatic closing braces.
- Frontmatter attributes are now more obviously editable with always-visible edit icons, adjusted for subtlety.
- Inline tasks are displayed within content for better integration.
- The `AttributeEditor` component and its tests are complete, with all tests passing.
- Test files have been adapted to use `@` imports instead of relative paths for consistency.
- Resolved IDE import recognition issue by adding the `test` directory to `tsconfig.app.json`, ensuring proper alias resolution in the development environment.
- Fixed failing tests in `ContentBody.test.tsx` by using `title` attributes to improve element selection for content editing.
- All tests are passing with correct element selection in `ContentBody.tsx` and resolved `lucide-react` import issues.
- Successfully integrated `AttributeEditor` into `ContentBody.tsx` to factor out duplicate code for editing attributes like location, mail from, and mail to, with all tests passing.
- Factored out `EditActions.tsx` from `ContentBody.tsx` as a reusable component for edit actions, furthering the refactoring effort to make `ContentBody.tsx` more manageable.
- Implemented Progressive Web App (PWA) structural components:
  - Created `manifest.json` in the `public` directory for app metadata.
  - Added `service-worker.js` for caching and offline functionality.
  - Updated `index.html` to reference the manifest file.
  - Modified `main.tsx` to register the service worker, with conditional logic to skip registration in local development environments (localhost/127.0.0.1) to avoid HTTPS-related installation errors.

## What's Left to Build

- Continue refactoring `ContentBody.tsx` into smaller, more manageable files, potentially creating additional reusable components for `isEditing` blocks.
- Fix the bug where adding a second wikilink in the same editing session inserts characters at the location of the first wikilink.
- Enhance wikilink preview positioning to appear near the cursor, enable browsing suggestions with arrow keys, and implement fuzzy search for adapting suggestions after more characters are typed.
- Develop a markdown editor with a user experience similar to Notion or Obsidian for intuitive content creation and linking.
- Implement a calendar view for events to provide a visual representation of scheduled items.
- Implement web app with home screen shortcut support (non-PWA) to make Idea Craft accessible from mobile devices without the complexities of service worker and HTTPS setup in local development.
- Implement local directory syncing functionality using the File System Access API to allow users to select a static folder for bidirectional markdown file syncing, with the sync target reference stored in cookies.
- Replace the existing import/export buttons with a static sync directory feature to streamline markdown file management.

## Current Status

The project is in an active development phase. Significant progress has been made on user interface enhancements, technical setup, and initial PWA conversion:
- Recent update: Decided to pivot from a full PWA setup to a web app with home screen shortcut (non-PWA) to make Idea Craft installable on mobile devices, avoiding service worker and HTTPS issues in local development. Planned to implement local directory syncing using the File System Access API, with sync target reference stored in cookies, acknowledging browser support limitations and the need for user re-approval across sessions.
- Phase 1 improvements, such as wikilink previews, enhanced frontmatter editing visibility, and inline task display, are largely complete.

## Known Issues

- None at this time related to `lucide-react`; the import issue has been resolved.
- Service worker installation error in local development environment (localhost:8080) has been mitigated by conditional registration; further testing in a production-like environment is needed for full PWA functionality, but current focus is shifting to non-PWA web app shortcut approach.

## Evolution of Project Decisions

- The project has evolved to prioritize a unified experience for managing different types of items, with flexible type inference from frontmatter.
- Recent updates have focused on user interface improvements for better content interaction, such as wikilink previews and editable attributes.
- Decided to use `@` aliases in test imports for consistency with the rest of the codebase, resolving IDE issues through configuration adjustments.
- Resolved `lucide-react` import issues by removing the mock alias and using the actual library, with all tests now passing.
- Used `title` attributes for UI elements to enhance test reliability and maintain accessibility.
- Integrated reusable components like `AttributeEditor` and `EditActions.tsx` to reduce code duplication and improve maintainability.
- Identified and resolved a styling issue with the cancel icon in `EditActions.tsx` by using `text-red` to align with the custom color definition in `tailwind.config.ts`, after standard Tailwind color classes were overridden. The user declined further styling changes, confirming the current state is acceptable.
- Progressed with PWA conversion by implementing necessary structural files and configurations to make Idea Craft installable and offline-capable, with a recent adjustment to service worker registration to handle local development constraints. However, due to challenges with local testing, decided to shift focus to a non-PWA web app with home screen shortcut for mobile accessibility, combined with local directory syncing using the File System Access API and cookie storage for sync target reference.
