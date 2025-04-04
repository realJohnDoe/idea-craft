import { Item } from "@/lib/content-utils";
import { generateUniqueId } from "./id-utils";

// Simplified example items with fewer tags
export const simplifiedExampleContentItems: Item[] = [
  {
    id: `note-welcome-${generateUniqueId().substring(0, 8)}`,
    title: "Welcome to IdeaCraft",
    content: "This is your personal knowledge and task management tool. Create and link different types of content:\n\n- Tasks with checkboxes\n- Events with dates and locations\n- Emails with from/to fields\n- Notes for capturing ideas\n\nCreate links between your items using the [[title]] syntax.",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["welcome", "tutorial"],
  },
  {
    id: `task-example-${generateUniqueId().substring(0, 8)}`,
    title: "Task Example",
    content: "This is an example task. You can mark it as done using the checkbox.",
    createdAt: new Date(),
    updatedAt: new Date(),
    done: false,
    tags: ["example"],
  },
  {
    id: `event-example-${generateUniqueId().substring(0, 8)}`,
    title: "Event Example",
    content: "This is an example event with a date and location.",
    createdAt: new Date(),
    updatedAt: new Date(),
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    location: "Virtual Meeting",
    tags: ["example"],
  },
  {
    id: `mail-example-${generateUniqueId().substring(0, 8)}`,
    title: "Email Example",
    content: "This is an example email with from and to fields.",
    createdAt: new Date(),
    updatedAt: new Date(),
    from: "sender@example.com",
    to: ["recipient@example.com"],  // Fixed: Changed from string to string[]
    tags: ["example"],
  },
];

// Keep the original exampleContentItems as a reference
export const exampleContentItems = simplifiedExampleContentItems;
