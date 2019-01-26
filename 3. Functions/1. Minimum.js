/* Minimum

The previous chapter introduced the standard function Math.min that returns its smallest argument. We can build something like that now.
Write a function min that takes two arguments and returns their minimum.

Hints:

If you have trouble putting braces and parentheses in the right place to get a valid function definition,
start by copying one of the examples in this chapter and modifying it.

A function may contain multiple return statements. */

// My solution
const min = function(n1, n2) {
  if (n1 <= n2) {
    return n1
  } else {
    return n2
  }
}

// Book solution
function min(a, b) {
  if (a < b) return a;
  else return b;
}

console.log(min(0, 10));
// → 0
console.log(min(0, -10));
// → -10