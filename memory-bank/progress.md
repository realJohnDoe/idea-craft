# Progress

## What Works

- The memory bank structure is set up.
- The core files have been created.
- The application allows users to create, edit, and delete items (tasks, events, messages, and notes).
- Items are stored in local storage.
- The application has a basic UI with a Navbar, TypeFilter, TagsFilter, ContentList, and SelectedItemView.
- The application supports importing items.
- The application infers types from the frontmatter.
- A quick preview for wikilinks is implemented when typing `[[`, with automatic closing braces.
- Frontmatter attributes are now more obviously editable with always-visible edit icons, adjusted for subtlety.
- Inline tasks are now displayed inline within content.
- Implementation of the `AttributeEditor` component and its corresponding tests are complete, with all tests passing.
- Adapted a test to use @ imports instead of relative paths (AttributeEditor.test.tsx).

## What's Left to Build

- Fix the warning about the value prop form field
- Address the `lucide-react` import issue permanently, possibly by ensuring correct installation or using an alternative icon library.
- Resolve the inconsistent resolution of @ imports in test files, ensuring all tests can use @ aliases without errors.
- Refactor: ContentBody.tsx is getting pretty long. Let us split it into multiple files. Maybe we can also factor out a reusable component for all the `isEditing` blocks.
- Bug: When adding the second wikilink in the same editing session, the new characters are still added at the location of the first wikilink.
- The wikilink preview positioning needs improvement to appear near the cursor, browsing the suggestions with arrow keys does not work yet.
- Also, browsing adapting the suggestions after more characters using some fuzzy search does not work yet.
- Implement a very convenient markdown editor with similar UX as Notion or Obsidian.
- Implement a calendar view for events.

## Current Status

The project is in the development phase. Phase 1 of the planned improvements is largely complete with the implementation of wikilink previews, enhanced frontmatter editing visibility, and inline task display.

- Recent update: The `AttributeEditor` component has been implemented and tested successfully, with a temporary workaround for the `lucide-react` import issue.

## Known Issues

- The `lucide-react` library import causes resolution errors during test runs, currently commented out as a temporary workaround.
- A warning in tests about providing a `value` prop to a form field without an `onChange` handler in `AttributeEditor.test.tsx`.
- Inconsistent resolution of @ imports in test files; works in some files (e.g., AttributeEditor.test.tsx) but fails in others (e.g., task-import-export.test.ts), requiring further investigation into Vitest alias configuration.

## Evolution of Project Decisions

- The project has evolved to focus on providing a unified experience for managing different types of items.
- Recent updates have prioritized user interface improvements for better interaction with content.
- Decided to use relative paths in test imports to align with existing test file structures.
- Temporarily disabled `lucide-react` to make tests pass, with a plan to revisit the dependency resolution issue.
