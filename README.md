# Idea Craft

A unified productivity tool designed to help users manage tasks, events, messages, and notes within a single, intuitive application. Idea Craft breaks down the barriers between different content types by using markdown with frontmatter for flexible data storage and type inference.

## Overview

Idea Craft addresses the problem of fragmented productivity tools by allowing users to create, organize, and transform content seamlessly. Whether it's a task with a deadline, an event, a message, or a note, Idea Craft infers types from frontmatter attributes, enabling fluid categorization without technical constraints.

## Key Features

- **Unified Content Management**: Handle tasks, events, messages, and notes in one app, with the ability to transform content between types effortlessly.
- **Markdown with Frontmatter**: Store data in human-readable markdown files, using YAML frontmatter for metadata like dates, status, or recipients.
- **Type Inference**: Dynamically categorize items based on frontmatter attributes (e.g., a task with a date can be both a `task` and an `event`).
- **Intuitive UI**: Features a clean interface with components like Navbar, TypeFilter, TagsFilter, ContentList, and SelectedItemView for easy navigation.
- **Advanced Interactions**: Supports wikilink previews when typing `[[` (with auto-closing braces), inline task rendering, and editable frontmatter attributes with visible edit icons.
- **Local Storage**: Persists data in the browser's local storage, with support for importing and exporting markdown files.

## Getting Started

### Prerequisites

- Node.js and npm installed on your system. [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating) if needed.

### Setup Instructions

Follow these steps to set up and run Idea Craft locally:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd idea-craft

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

The application will open in your browser at `http://localhost:8080/idea-craft/` (or a similar port if 8080 is in use).

### Running Tests

```sh
# Execute unit tests using Vitest to verify component and utility functionality.
npm run test
```

### Building for Production

```sh
# Build the application for deployment.
npm run build
```

## Current Status

Idea Craft is in active development:
- Recent progress includes resolving IDE import recognition issues by updating TypeScript configuration to include test directories.
- Implemented features like the `AttributeEditor` component for frontmatter editing, wikilink previews, and inline task display.
- Ongoing tasks include refactoring UI components, enhancing wikilink functionality, and developing a Notion-like markdown editor.

## Known Issues

- Dependency resolution errors with `lucide-react` during test runs, temporarily mitigated by commenting out imports.
- Minor UI bugs and warnings in test files that are being addressed.

## Contributing

Contributions to Idea Craft are welcome! To contribute:
1. Fork or clone the repository.
2. Make your changes in a feature branch.
3. Ensure tests pass and add new tests for significant features.
4. Submit a pull request with a clear description of your changes.

For major changes or feature suggestions, please open an issue to discuss before starting work.

## Documentation

Detailed project documentation is available in the `memory-bank/` directory:
- `projectbrief.md`: Project goals and requirements.
- `productContext.md`: Problem statement and user experience goals.
- `systemPatterns.md`: Architecture and data storage approach.
- `techContext.md`: Technologies, setup, and technical challenges.
- `activeContext.md`: Current focus and recent changes.
- `progress.md`: Implemented features, current status, and tasks.

## Deployment

Idea Craft is deployed using GitHub Pages, as configured in `.github/workflows/pages.yml`. To deploy updates, push your changes to the repository, and the workflow will automatically build and deploy the application to GitHub Pages.
