# Todo App – Coding Standards

## Overview

This document describes the coding conventions used throughout the Todo App codebase. All contributors should follow these standards to keep the code consistent and maintainable.

---

## File Structure

```
todo-app/
├── index.html        # App markup and structure
├── styles.css        # All styles (light + dark theme variables)
├── app.js            # Application logic and state management
└── CODING_STANDARDS.md
```

---

## Naming Conventions

| Context              | Convention            | Example                         |
|----------------------|-----------------------|---------------------------------|
| Variables            | camelCase             | `currentFilter`, `todoInput`    |
| Functions            | camelCase verb + noun | `addTodo()`, `renderTodos()`    |
| Constants            | SCREAMING_SNAKE_CASE  | `STORAGE_KEY`, `PRIORITY_LEVELS`|
| Classes / PascalCase | PascalCase            | N/A (vanilla JS, no classes)    |
| DOM IDs              | kebab-case            | `todo-input`, `add-btn`         |
| CSS classes          | kebab-case            | `todo-item`, `filter-btn`       |
| Files                | kebab-case            | `app.js`, `styles.css`          |

---

## Data Model

Each todo object stored in `localStorage` under the key `todos` has the following shape:

```json
{
  "id": 1700000000000,
  "text": "Buy groceries",
  "completed": false,
  "priority": "medium",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "completedAt": null
}
```

| Field        | Type               | Description                                  |
|--------------|--------------------|----------------------------------------------|
| `id`         | `number`           | `Date.now()` timestamp used as unique key    |
| `text`       | `string`           | The todo description                         |
| `completed`  | `boolean`          | Whether the todo is done                     |
| `priority`   | `"high"|"medium"|"low"` | Priority level                         |
| `createdAt`  | ISO 8601 string    | When the todo was created                    |
| `completedAt`| ISO 8601 string or `null` | When the todo was completed (or `null`) |

**Backward compatibility**: When loading from `localStorage`, missing fields are filled with safe defaults so that todos created before new fields were added continue to work.

---

## Theming

Theming is CSS-variable-driven.

- Light theme is the default (`body[data-theme="light"]`).
- Dark theme is activated by setting `body[data-theme="dark"]`.
- All colours reference CSS custom properties defined in `:root` (overridden in `[data-theme="dark"]`).
- The selected theme is persisted in `localStorage` under the key `todo-theme`.

---

## JavaScript Style

- Use `const` for references that never change; `let` for those that do.
- Prefer `Array` methods (`filter`, `find`, `map`, `forEach`) over `for` loops.
- Each function has a single, clear responsibility.
- Functions that mutate state always call `saveTodos()` followed by `renderTodos()` and `updateCount()`.
- DOM creation is centralised in `createTodoElement()`.

---

## CSS Style

- All spacing uses `px` units.
- Transitions are `0.3s ease` by default.
- Responsive breakpoint: `600px` (mobile-first adjustments).
- Priority colours: red for high, yellow/amber for medium, green for low.
