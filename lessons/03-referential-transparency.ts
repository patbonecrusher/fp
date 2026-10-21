// LESSON 3: Referential Transparency
//
// An expression is "referentially transparent" if you can replace it
// with its computed value anywhere it appears, and the program behaves
// exactly the same. In other words: `f(x)` and "whatever f(x) evaluates
// to" are interchangeable.
//
// Why it's good: it's the property that actually pays off from Lessons
// 1 and 2. Pure functions + immutable data are what MAKE expressions
// referentially transparent — and referential transparency is what
// lets you cache a result, extract a repeated call into a variable, or
// inline a variable back into its call site, all without changing what
// the program does. Impure code can't offer that: swapping a call for
// its value silently deletes whatever side effect that call was doing.

// --- Not referentially transparent ------------------------------------

let apiCallCount = 0;

function getDiscountedPriceImpure(price: number): number {
  apiCallCount++; // pretend this hits a pricing API every time it's called
  console.log(`  (simulated API call #${apiCallCount} for price ${price})`);
  return price * 0.9;
}

console.log("Version A: calling the expression twice");
apiCallCount = 0;
const totalA =
  getDiscountedPriceImpure(100) + getDiscountedPriceImpure(100);
console.log("total:", totalA, "| API calls made:", apiCallCount);

console.log("\nVersion B: 'the same expression', extracted into a variable");
apiCallCount = 0;
const discounted = getDiscountedPriceImpure(100);
const totalB = discounted + discounted;
console.log("total:", totalB, "| API calls made:", apiCallCount);

// Same math, same final total — but Version B made HALF the "API calls"
// of Version A. Refactoring "extract into a variable" (a change that's
// supposed to be behavior-preserving) silently changed how many times
// the side effect ran. That's what "not referentially transparent" costs
// you: an expression and its value are NOT interchangeable.

// --- Referentially transparent -----------------------------------------

function getDiscountedPricePure(price: number): number {
  return price * 0.9; // no side effect, nothing to lose by caching this
}

console.log("\nVersion C: calling the pure expression twice");
const totalC =
  getDiscountedPricePure(100) + getDiscountedPricePure(100);
console.log("total:", totalC);

console.log("\nVersion D: extracted into a variable — identical either way");
const discountedPure = getDiscountedPricePure(100);
const totalD = discountedPure + discountedPure;
console.log("total:", totalD);

console.log(
  "\nC and D are indistinguishable:",
  totalC === totalD // true, and there's nothing else to check —
  // no hidden counter, no log line, no way to tell which version ran.
);

// Try it yourself: add a `console.log` side effect inside
// getDiscountedPricePure and watch Version C/D diverge in call count
// just like A/B did — that's the side effect breaking referential
// transparency, not something specific to the discount math.
