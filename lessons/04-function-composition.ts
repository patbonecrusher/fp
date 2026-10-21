// LESSON 4: Function Composition
//
// Composition means building a new function by chaining smaller ones
// together, where the output of one becomes the input of the next:
// compose(f, g)(x) is just f(g(x)).
//
// Why it's good: instead of writing one big function per "pipeline"
// you need, you write small, tested, pure (Lesson 1) building blocks
// once, then assemble different pipelines out of the SAME blocks. Fix
// a bug in a block, and every pipeline using it is fixed at once —
// no hunting for copy-pasted logic across multiple big functions.

// --- Monolithic version (logic duplicated across functions) -----------

function wholesaleTotalMonolithic(price: number): number {
  const discounted = price * 0.9; // apply discount
  const withTax = discounted * 1.08; // add tax — duplicated formula
  return withTax;
}

function retailTotalMonolithic(price: number): number {
  const withTax = price * 1.08; // add tax — same formula, copy-pasted
  const withLateFee = withTax + 5; // add late fee
  return withLateFee;
}

console.log("Monolithic, tax rate 1.08:");
console.log("  wholesale total for $100:", wholesaleTotalMonolithic(100));
console.log("  retail total for $100:", retailTotalMonolithic(100));

// The tax rate changes from 8% to 8.25%. Someone updates the formula in
// wholesaleTotalMonolithic... and doesn't realize retailTotalMonolithic
// has its own separate copy of the exact same formula.

function wholesaleTotalMonolithicFixed(price: number): number {
  const discounted = price * 0.9;
  const withTax = discounted * 1.0825; // fixed here
  return withTax;
}
// retailTotalMonolithic is untouched — still using the old 1.08 below.

console.log("\nAfter fixing the tax rate in ONE of the two functions:");
console.log("  wholesale total for $100:", wholesaleTotalMonolithicFixed(100));
console.log(
  "  retail total for $100:",
  retailTotalMonolithic(100),
  "<-- still using the OLD tax rate, silently"
);

// --- Composed version (one shared building block) ----------------------

const applyDiscount = (price: number): number => price * 0.9;
let addTax = (price: number): number => price * 1.08; // the ONE place tax lives
const addLateFee = (price: number): number => price + 5;

const pipe =
  (...fns: Array<(x: number) => number>) =>
  (x: number): number =>
    fns.reduce((acc, fn) => fn(acc), x);

const wholesaleTotal = pipe(applyDiscount, addTax);
const retailTotal = pipe(addTax, addLateFee);

console.log("\nComposed, tax rate 1.08:");
console.log("  wholesale total for $100:", wholesaleTotal(100));
console.log("  retail total for $100:", retailTotal(100));

// Now the tax rate changes the same way — but there's only one function
// to update, and BOTH pipelines pick up the fix automatically, because
// they're both built out of the same `addTax` reference.

addTax = (price: number): number => price * 1.0825;
const wholesaleTotalFixed = pipe(applyDiscount, addTax);
const retailTotalFixed = pipe(addTax, addLateFee);

console.log("\nAfter fixing the tax rate ONCE, in the shared building block:");
console.log("  wholesale total for $100:", wholesaleTotalFixed(100));
console.log(
  "  retail total for $100:",
  retailTotalFixed(100),
  "<-- automatically consistent"
);

// Try it yourself: build a third pipeline — say, a "clearance" total
// that applies the discount twice — by composing the SAME
// applyDiscount/addTax blocks in a different order, with no new
// duplicated formulas at all: pipe(applyDiscount, applyDiscount, addTax)
