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

## What's Left to Build

- Refactor: ContentBody.tsx is getting pretty long. Let us split it into multiple files. Maybe we can also factor out a reusable component for all the `isEditing` blocks.
- Bug: When adding the second wikilink in the same editing session, the new characters are still
  added at the location of the first wikilink.
- The wikilink preview positioning needs improvement to appear near the cursor, browsing the suggestions with arrow keys does not work yet.
- Also, browsing adapting the suggestions after more characters using some fuzzy search does not work yet.
- Implement a very convenient markdown editor with similar UX as Notion or Obsidian.
- Implement a calendar view for events.

## Current Status

The project is in the development phase. Phase 1 of the planned improvements is largely complete with the implementation of wikilink previews, enhanced frontmatter editing visibility, and inline task display.

## Known Issues

## Evolution of Project Decisions

- The project has evolved to focus on providing a unified experience for managing different types of items.
- Recent updates have prioritized user interface improvements for better interaction with content.
