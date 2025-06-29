# Product Context

## Problem

Many people keep track of their tasks, events, messages, and notes in separate apps, making it hard to move content from one to the other. This fragmentation leads to inefficiency and difficulty in maintaining a cohesive workflow across different types of information.

## Solution

Idea Craft aims to provide a simple and intuitive way for users to create, organize, and track their tasks, events, messages, and notes within a single app. By inferring types from frontmatter and allowing arbitrary YAML frontmatter, the app offers a flexible view of content rather than imposing rigid categorizations. For example:
- A task with a deadline might have frontmatter like:
  ```yml
  date: 2025-06-26
  done: false
  ```
  with inferred types `task` and `event`.
- An event might simply have:
  ```yml
  date: 2025-06-26
  ```
- A message could include:
  ```yml
  from: john.doe@gmail.com
  to: [jane.doe@gmail.com]
  ```

This approach allows users to easily transform content between notes, events, and tasks without technical boundaries, fostering a seamless productivity experience.

## User Experience Goals

- The tool should be easy to use and navigate, minimizing the learning curve for new users.
- The interface should be clean and uncluttered, focusing on content without unnecessary distractions.
- Users should be able to quickly create and edit items, as well as change their type through intuitive frontmatter adjustments.
- The tool should seamlessly load and save items as markdown files after they are edited, ensuring data portability and compatibility with other markdown-based systems.
- Provide advanced features like wikilink previews and inline task rendering to enhance content interaction and linking.
