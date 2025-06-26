# System Patterns

## Architecture

The system will be designed to handle tasks, events, messages, and notes within a single application, allowing for seamless integration and movement of content between them. The core will revolve around parsing and interpreting markdown files with frontmatter.

## Data Storage

The system will store data in markdown files with frontmatter. The frontmatter will be used to store metadata about the item, but not it's type. The system will infer types from the frontmatter, allowing for flexible categorization.

## Key Technical Decisions

- Utilize markdown files with frontmatter for data storage to enable easy editing and portability.
- Implement a flexible frontmatter parsing system to infer types and attributes.
- Design a unified data model to represent tasks, events, messages, and notes.
