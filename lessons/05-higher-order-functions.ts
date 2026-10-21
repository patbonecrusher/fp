// LESSON 5: Higher-Order Functions
//
// Ordinary functions operate on data — numbers, strings, objects. A
// "higher-order function" (HOF) treats FUNCTIONS as the data it
// operates on: it accepts a function as an argument, returns a new
// function, or both.
//
// You already used one in Lesson 4 without naming it: `pipe` takes
// functions in and hands back a new function. `map`, `filter`, and
// `reduce` are the most common HOFs of all — this lesson builds one
// of them from scratch to see why they exist.
//
// Why it's good: a HOF separates the MECHANISM (how to loop over a
// list, step by step) from the POLICY (what to do with each item).
// Write the loop once, inside the HOF, and every caller just supplies
// a different small function — nothing about iterating is ever
// copy-pasted again.

type User = { name: string; age: number; active: boolean; deleted: boolean };

const users: User[] = [
  { name: "Ada", age: 17, active: true, deleted: false },
  { name: "Grace", age: 34, active: false, deleted: false },
  { name: "Alan", age: 41, active: true, deleted: true }, // soft-deleted
  { name: "Barbara", age: 29, active: true, deleted: false },
];

// --- Monolithic version (iteration logic duplicated per case) ---------

function filterAdultsMonolithic(list: User[]): User[] {
  const result: User[] = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i]!.age >= 18) {
      result.push(list[i]!);
    }
  }
  return result;
}

function filterActiveUsersMonolithic(list: User[]): User[] {
  const result: User[] = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i]!.active) {
      result.push(list[i]!);
    }
  }
  return result;
}

console.log("Monolithic, before excluding soft-deleted users:");
console.log("  adults:", filterAdultsMonolithic(users).map((u) => u.name));
console.log(
  "  active:",
  filterActiveUsersMonolithic(users).map((u) => u.name)
);

// A bug shows up: soft-deleted users (like Alan) shouldn't appear in
// ANY list. Someone fixes the adults loop...

function filterAdultsMonolithicFixed(list: User[]): User[] {
  const result: User[] = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i]!.age >= 18 && !list[i]!.deleted) {
      result.push(list[i]!);
    }
  }
  return result;
}
// ...and forgets filterActiveUsersMonolithic has its own separate copy
// of the exact same loop, which still lets deleted users through.

console.log("\nAfter fixing the 'exclude deleted' rule in ONE loop:");
console.log(
  "  adults:",
  filterAdultsMonolithicFixed(users).map((u) => u.name)
);
console.log(
  "  active:",
  filterActiveUsersMonolithic(users).map((u) => u.name),
  "<-- Alan (deleted) still slipped through"
);

// --- Higher-order version (one loop, many policies) --------------------

function myFilter<T>(list: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];
  for (let i = 0; i < list.length; i++) {
    if (predicate(list[i]!)) {
      result.push(list[i]!);
    }
  }
  return result;
}
// This is the ONLY loop in the whole lesson from here on. Every caller
// below just hands it a different predicate — a different POLICY —
// and reuses the exact same MECHANISM.

const isAdult = (u: User) => u.age >= 18;
const isActive = (u: User) => u.active;
const notDeleted = (u: User) => !u.deleted;

console.log("\nHigher-order, before excluding soft-deleted users:");
console.log(
  "  adults:",
  myFilter(users, isAdult).map((u) => u.name)
);
console.log(
  "  active:",
  myFilter(users, isActive).map((u) => u.name)
);

// Fix the "exclude deleted" rule ONCE, as its own small predicate, and
// compose it into both calls — there's no second loop to forget.
const isAdultAndPresent = (u: User) => isAdult(u) && notDeleted(u);
const isActiveAndPresent = (u: User) => isActive(u) && notDeleted(u);

console.log("\nAfter adding the 'exclude deleted' rule to both predicates:");
console.log(
  "  adults:",
  myFilter(users, isAdultAndPresent).map((u) => u.name)
);
console.log(
  "  active:",
  myFilter(users, isActiveAndPresent).map((u) => u.name),
  "<-- Alan correctly excluded everywhere"
);

// Try it yourself: write a third predicate (say, `isTeen`) and pass it
// to `myFilter` — no new loop required, just a new one-line function.
