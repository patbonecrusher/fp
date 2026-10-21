// LESSON 6: Currying
//
// Currying reshapes a function that takes several arguments into a
// chain of functions that each take exactly one: f(a, b) becomes
// f(a)(b). Calling it with just the first argument doesn't run the
// whole function — it hands back a new, smaller function that
// remembers `a` and is still waiting for `b`.
//
// Why it's good: Lesson 5 showed higher-order functions returning
// functions as the mechanism for reuse. Currying is that mechanism
// applied systematically — "give me part of the input now, and I'll
// give you back a specialized function" — which is exactly what
// Lesson 4's `pipe` needs, since every step in a pipe can only pass
// ONE value along. A curried function slots into a pipe directly;
// an un-curried one needs a hand-written wrapper for every case.

const pipe =
  (...fns: Array<(x: number) => number>) =>
  (x: number): number =>
    fns.reduce((acc, fn) => fn(acc), x);

// --- Un-curried version (needs a hand-written wrapper per case) -------

const applyDiscountUncurried = (rate: number, price: number): number =>
  price * (1 - rate);
const addTaxUncurried = (rate: number, price: number): number =>
  price * (1 + rate);

// `pipe` only passes one value through each step, so a 2-argument
// function has to be wrapped down to 1 argument before it can be used:
const applyUSDiscount = (price: number) => applyDiscountUncurried(0.1, price);
const addUSTax = (price: number) => addTaxUncurried(0.08, price);
const usTotal = pipe(applyUSDiscount, addUSTax);

// Adding Japan means copy-pasting that wrapper pattern again — and
// someone forgets to change the discount rate from the US value:
const applyJPDiscount = (price: number) => applyDiscountUncurried(0.1, price); // bug: should be 0.05
const addJPTax = (price: number) => addTaxUncurried(0.1, price);
const jpTotal = pipe(applyJPDiscount, addJPTax);

console.log("Un-curried, hand-written wrappers per region:");
console.log("  US total for $100:", usTotal(100));
console.log(
  "  JP total for $100 (should use a 5% discount):",
  jpTotal(100),
  "<-- wrong, copy-pasted the US discount rate"
);

// --- Curried version (a region is just data, not new code) -------------

const applyDiscount = (rate: number) => (price: number): number =>
  price * (1 - rate);
const addTax = (rate: number) => (price: number): number =>
  price * (1 + rate);

type Region = { discount: number; tax: number };
const regions: Record<string, Region> = {
  US: { discount: 0.1, tax: 0.08 },
  JP: { discount: 0.05, tax: 0.1 },
};

const totalFor = (region: string) =>
  pipe(applyDiscount(regions[region]!.discount), addTax(regions[region]!.tax));

console.log("\nCurried, a region is just a row of data:");
console.log("  US total for $100:", totalFor("US")(100));
console.log("  JP total for $100:", totalFor("JP")(100));

// Calling applyDiscount(0.1) alone doesn't compute anything yet — it
// hands back a specialized, reusable function:
const tenPercentOff = applyDiscount(0.1);
console.log(
  "\napplyDiscount(0.1) returns a function, not a number:",
  typeof tenPercentOff === "function"
);
console.log("Calling it on $50 and $200:", tenPercentOff(50), tenPercentOff(200));

// Try it yourself: add a third region (say, "EU": { discount: 0.2, tax: 0.2 })
// to the `regions` table and call `totalFor("EU")(100)` — no new
// wrapper function needed, just a new row of data.
