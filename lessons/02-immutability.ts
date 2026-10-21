// LESSON 2: Immutability
//
// Immutable data is never changed after it's created — instead of
// modifying a value in place, you produce a new value with the change
// applied, leaving the original untouched.
//
// Why it's good: it's what makes "pure function" (Lesson 1) achievable
// in practice, rather than just a rule you have to remember not to
// break. Any code that's still holding a reference to the "old" value
// can trust it will never change out from under it — which is exactly
// what lets you keep an undo history, compare "before" and "after"
// snapshots, or hand data to another function/thread without worrying
// what it might do to it.

// --- Mutable version -------------------------------------------------

function addTodoMutable(todos: string[], todo: string): string[] {
  todos.push(todo); // mutates the array in place
  return todos;
}

const history: string[][] = [];

let todosA = ["Buy milk"];
history.push(todosA); // "snapshot" for undo — or so we think

todosA = addTodoMutable(todosA, "Walk dog");
history.push(todosA);

todosA = addTodoMutable(todosA, "Do laundry");
history.push(todosA);

console.log("Mutable: 'undo' history (should show 3 different snapshots):");
console.log(history);
// Every entry points at the SAME array, which has since been mutated
// three times. There is no history — just three references to one
// final array. "Undo" is impossible.

// --- Immutable version -----------------------------------------------

function addTodoImmutable(todos: readonly string[], todo: string): string[] {
  return [...todos, todo]; // new array, original left alone
}

const historyImmutable: string[][] = [];

let todosB: string[] = ["Buy milk"];
historyImmutable.push(todosB);

todosB = addTodoImmutable(todosB, "Walk dog");
historyImmutable.push(todosB);

todosB = addTodoImmutable(todosB, "Do laundry");
historyImmutable.push(todosB);

console.log("\nImmutable: undo history (3 real, distinct snapshots):");
console.log(historyImmutable);

console.log(
  "\nEarliest snapshot is untouched:",
  historyImmutable[0]?.length === 1 // true — still just ["Buy milk"]
);

// Try it yourself: log `history[0]` in the mutable version and compare
// it to `historyImmutable[0]` — one has grown to 3 items, the other
// still has the 1 item it started with.
