# System Patterns for Idea Craft

## Architecture
Idea Craft is built as a single-page application (SPA) with a component-based architecture, focusing on modularity and reusability to ensure maintainability and scalability:
- **Frontend Structure:** The UI is composed of reusable components like `Navbar`, `ContentList`, `SelectedItemView`, and specialized content-item components (`ContentBody`, `ContentFooter`, etc.), ensuring a consistent look and feel across different views.
- **State Management:** Local state is managed within components using hooks, with data persistence designed for simplicity and offline capability through browser-based storage.
- **Routing:** Minimal routing handles the main index page and a not-found page, keeping the app lightweight and focused on content management.
- **Mobile Accessibility Approach:** Initially explored as a Progressive Web App (PWA) with advanced offline support, the approach has pivoted to a non-PWA web app with home screen shortcut support. This simplifies mobile accessibility by avoiding complexities in local development environments, allowing users to manually add the app to their device's home screen.

## Data Storage
- **Client-Side Persistence:** User content (tasks, events, messages, notes) is stored locally in the browser to ensure data persists across sessions without requiring server interaction, aligning with the goal of offline usability.
- **Markdown Format:** Content is structured in markdown for portability, with frontmatter defining metadata like type, tags, and custom attributes, enabling flexible categorization and easy data transfer.
- **Planned Local Directory Syncing:** To enhance data portability, the architecture will support bidirectional syncing of markdown files with a user-selected local directory, allowing users to manage content outside the app and integrate with external workflows.

## Component Relationships
- **Navbar:** Serves as the top-level navigation, providing access to content creation and filtering options, acting as the entry point to app functionality.
- **Filters (TypeFilter, TagsFilter):** Enable users to narrow down content by type or tags, dynamically updating the `ContentList` to reflect filtered results.
- **ContentList:** Displays a list of content items based on applied filters, linking to `SelectedItemView` for detailed editing and viewing of individual items.
- **SelectedItemView:** Renders detailed content using sub-components like `ContentBody` and `ContentFooter`, managing editing states and metadata display for user interaction.
- **Content-Item Components:** Modular components like `ContentBody`, `ContentRenderer`, and `ContentTypeTags` handle specific aspects of content display and interaction, with ongoing refactoring to break down complex components (e.g., `ContentBody`) into smaller, reusable pieces like `AttributeEditor` and `EditActions`.
- **Import/Export (Planned Sync):** Current components handle manual data transfer, but the design will evolve to incorporate a static sync directory feature for seamless markdown file management, reducing user effort in data handling.

## Key Technical Decisions
- **Component-Based Design:** Emphasize modularity by structuring the app as a collection of independent, reusable components, facilitating easier updates and maintenance.
- **Markdown with Frontmatter:** Adopted as the content format for its simplicity and compatibility, supporting features like wikilinks for internal connections and metadata for organization.
- **Local Storage First:** Prioritize client-side storage over server-side solutions to focus on simplicity and offline access in the initial phase, avoiding backend complexity.
- **Pivot from PWA to Non-PWA:** Shifted focus from a full PWA setup to a non-PWA web app with home screen shortcut support to simplify mobile accessibility, driven by challenges in local development setups, impacting architectural complexity for offline features.
- **Syncing Strategy:** Plan to integrate a mechanism for local directory syncing to enhance data management, designed to fit within the client-side architecture while addressing user needs for external content access.

## Critical Implementation Paths
- **Content Parsing:** Markdown content with frontmatter is parsed into a structured data model using utility functions, ensuring consistent rendering and editing across components.
- **Wikilink Support:** Implemented quick preview and autocompletion for wikilinks in content editing, with plans to enhance positioning and search functionality to improve linking between content items.
- **UI Responsiveness:** Components are designed with responsive utilities to adapt to various screen sizes, critical for mobile accessibility via home screen shortcuts, ensuring a seamless experience across devices.
- **Refactoring for Maintainability:** Ongoing efforts to modularize complex components like `ContentBody` into smaller, focused components (e.g., `AttributeEditor`, `EditActions`) to improve code readability and reusability within the architecture.
- **Future Sync Integration:** Path to replace manual import/export with a static sync directory feature, architecturally planned to streamline data management and provide a more integrated user experience without altering the core client-side focus.

This file focuses on the architectural patterns and design decisions of Idea Craft. For specific technologies, development setup, or current project status, refer to other memory bank files.
