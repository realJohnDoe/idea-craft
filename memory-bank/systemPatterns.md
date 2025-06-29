# System Patterns

## Architecture

Idea Craft is designed to handle tasks, events, messages, and notes within a single application, allowing for seamless integration and movement of content between different types. The core architecture revolves around parsing and interpreting markdown files with frontmatter, using a unified data model to represent all item types. The system employs React for a dynamic user interface, with components structured to manage content listing, filtering, and detailed views.

## Data Storage

The system stores data in markdown files with frontmatter, utilizing local storage for persistence within the browser environment. Frontmatter is used to store metadata about items, such as dates, status, or sender information, without explicitly defining an item's type. Instead, the system infers types dynamically from frontmatter attributes, allowing for flexible categorization where a single item can belong to multiple types (e.g., a task with a date can be both a `task` and an `event`). This approach supports easy transformation of content across categories without technical constraints.

## Key Technical Decisions

- Utilize markdown files with frontmatter for data storage to enable easy editing, portability, and compatibility with other markdown-based systems.
- Implement a flexible frontmatter parsing system using YAML to infer types and attributes dynamically, avoiding rigid schema definitions.
- Design a unified data model to represent tasks, events, messages, and notes, ensuring consistency in how content is managed and displayed.
- Structure the React component hierarchy to separate concerns, with distinct components for content rendering (`ContentRenderer`), item management (`ContentItem`), and UI filtering (`TypeFilter`, `TagsFilter`).
- Employ aliasing in TypeScript and Vite configurations (`@` for `src/`) to streamline import paths and maintain consistency across the codebase, with recent fixes to include test directories for IDE support.
