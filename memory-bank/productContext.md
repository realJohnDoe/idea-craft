# Product Context

## Problem

Many people keep track of their tasks, events, messages, and notes, in separate
apps, making it hard to move content from one to the other.

## Solution

This tool aims to provide a simple and intuitive way for users to create,
organize, and track their tasks, events, messages, and notes as well as
combinations of such in one app.
By inferring the types from the frontmatter and allowing arbitrary frontmatter
yaml, the types become a convenient view instead of a limitation.
For example, a task with a deadline would have the frontmatter

```yml
date: 2025-06-26
done: false
```

and the inferred types would be `task` and `event`.
An event would have the frontmatter

```yml
date: 2025-06-26
```

while a message would have a frontmatter like

```yml
from: john.doe@gmail.com
to: [jane.doe@gmail.com]
```

This allows to easily move content from notes to events to tasks without having
to think about technical boundaries.

## User Experience Goals

- The tool should be easy to use and navigate.
- The interface should be clean and uncluttered.
- Users should be able to quickly create and edit items as well as change their type.
- The tool should seamlessly load and save items as markdown files after they are edited.
