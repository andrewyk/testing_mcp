/**
 * STRUCTURE POLICY:
 * - This file MUST remain framework-agnostic (no React imports, no DOM).
 * - Export ONLY: types + pure functions.
 * - All functions MUST be deterministic and MUST NOT mutate inputs.
 */

export type TodoId = string;

export type Todo = Readonly<{
  id: TodoId;
  title: string;
  completed: boolean;
  createdAtIso: string;
}>;

export type TodoList = ReadonlyArray<Todo>;

/**
 * STRUCTURE POLICY:
 * - ID creation is isolated here.
 * - If you replace this, keep it as a pure function.
 */
export function createTodoId(now: Date = new Date()): TodoId {
  // Simple ID: timestamp + random suffix (good enough for demo apps).
  return `${now.getTime()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * STRUCTURE POLICY:
 * - Validation MUST live in domain layer, not in React components.
 */
export function normalizeTitle(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

/**
 * STRUCTURE POLICY:
 * - Factory returns an immutable object.
 * - No optional fields in UI: keep a consistent shape.
 */
export function createTodo(title: string, now: Date = new Date()): Todo {
  const normalized = normalizeTitle(title);

  return Object.freeze({
    id: createTodoId(now),
    title: normalized,
    completed: false,
    createdAtIso: now.toISOString(),
  });
}

/**
 * STRUCTURE POLICY:
 * - Update operations MUST be immutable (return new arrays/objects).
 * - Do not use in-place mutation (push/splice/sort on the same array).
 */
export function addTodo(list: TodoList, todo: Todo): TodoList {
  return [...list, todo];
}

export function removeTodo(list: TodoList, id: TodoId): TodoList {
  return list.filter((t) => t.id !== id);
}

export function toggleTodo(list: TodoList, id: TodoId): TodoList {
  return list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}
