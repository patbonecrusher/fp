// LESSON 1: Pure Functions
//
// A pure function:
//   1. Given the same input, always returns the same output.
//   2. Has no side effects (doesn't touch anything outside itself:
//      no mutating arguments, no writing to disk/network/console,
//      no reading/writing variables outside its own scope).
//
// Why it's good: a pure function is a black box you can reason about
// in isolation. You can test it with plain input/output assertions,
// call it a million times and cache the result (memoize), run many
// calls in parallel with zero risk of them stepping on each other,
// and refactor its internals without fear of breaking something far
// away in the codebase. Impure code can't offer any of that, because
// the "true" behavior depends on hidden state you can't see at the
// call site.

// --- Impure version -----------------------------------------------

let taxRate = 0.08; // shared, mutable, external state

function addItemImpure(cart: { total: number }, price: number): number {
  cart.total += price * (1 + taxRate); // mutates its argument
  return cart.total;
}

const cartA = { total: 0 };
addItemImpure(cartA, 10);
console.log("Impure cart after adding $10 item:", cartA.total); // 10.8

// Someone on another team "temporarily" tweaks taxRate for a report...
taxRate = 0.2;

const cartB = { total: 0 };
addItemImpure(cartB, 10);
console.log("Impure cart after adding another $10 item:", cartB.total); // 12, not 10.8!

// Same call (`addItemImpure(cart, 10)`), same intent, different result.
// The bug isn't in this function at all — it's in whatever code touched
// `taxRate` earlier. Good luck finding that from a stack trace.

// --- Pure version ---------------------------------------------------

function priceWithTax(price: number, rate: number): number {
  return price * (1 + rate); // only depends on its arguments
}

function addItemPure(
  cart: { total: number },
  price: number,
  rate: number
): { total: number } {
  return { total: cart.total + priceWithTax(price, rate) }; // new object, original untouched
}

const cartC = { total: 0 };
const cartD = addItemPure(cartC, 10, 0.08);

console.log("Pure: original cart is untouched:", cartC.total); // 0
console.log("Pure: new cart has the item:", cartD.total); // 10.8
console.log(
  "Pure: same inputs always give the same output:",
  priceWithTax(10, 0.08) === priceWithTax(10, 0.08) // true, trivially, and always
);

// Try it yourself: call addItemImpure and addItemPure a few more times
// with different tax rates and see which one you can predict just by
// reading the call site, without scrolling up.
