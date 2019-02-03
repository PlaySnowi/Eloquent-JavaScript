/* Reversing an array

Arrays have a reverse method that changes the array by inverting the order in which its elements appear.
For this exercise, write two functions, reverseArray and reverseArrayInPlace.
The first, reverseArray, takes an array as argument and produces a new array that has the same elements in the inverse order.
The second, reverseArrayInPlace, does what the reverse method does: it modifies the array given as argument by reversing its elements.
Neither may use the standard reverse method.

Thinking back to the notes about side effects and pure functions in the previous chapter, which variant do you expect to be useful in more situations?
Which one runs faster?

Hints:

There are two obvious ways to implement reverseArray.
The first is to simply go over the input array from front to back and use the unshift method on the new array to insert each element at its start.
The second is to loop over the input array backwards and use the push method.
Iterating over an array backwards requires a (somewhat awkward) for specification, like (let i = array.length - 1; i >= 0; i--).

Reversing the array in place is harder. You have to be careful not to overwrite elements that you will later need.
Using reverseArray or otherwise copying the whole array (array.slice(0) is a good way to copy an array) works but is cheating.

The trick is to swap the first and last elements, then the second and second-to-last, and so on.
You can do this by looping over half the length of the array
(use Math.floor to round down—you don’t need to touch the middle element in an array with an odd number of elements)
and swapping the element at position i with the one at position array.length - 1 - i.
You can use a local binding to briefly hold on to one of the elements, overwrite that one with its mirror image,
and then put the value from the local binding in the place where the mirror image used to be. */

// My solution - reverseArray (first way)
function reverseArray(arr) {
  let revArr = [];
  for (let i = 0; i < arr.length; i++) {
    revArr.unshift(arr[i]);
  }
  return revArr
}

// My solution and book solution - reverseArray (second way)
function reverseArray(arr) {
  let revArr = [];
  for (let i = arr.length-1; i >= 0; i--) {
    revArr.push(arr[i]);
  }
  return revArr
}

// My and book solution - reverseArrayInPlace
function reverseArrayInPlace(arr) {
  for (let i = 0; i < Math.floor(arr.length/2); i++) {
    let tempEl = arr[i]; // local binding to briefly hold on to the element that is going to be swapped
    arr[i] = arr[arr.length-1-i]; // overwrite the element that is going to be swapped with its mirror image
    arr[arr.length-1-i] = tempEl; // put the value from the local binding in the the mirror image place
  }
  return arr
}

console.log(reverseArray(["A", "B", "C"]));
// → ["C", "B", "A"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]

// reverseArrayInPlace runs faster and I'd expect it to be useful in more situations