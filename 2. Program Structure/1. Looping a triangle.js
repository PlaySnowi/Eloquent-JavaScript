/* Looping a triangle

Write a loop that makes seven calls to console.log to output the following triangle:

#
##
###
####
#####
######
####### 

It may be useful to know that you can find the length of a string by writing .length after it.

let abc = "abc";
console.log(abc.length);
// → 3

Hints:

You can start with a program that prints out the numbers 1 to 7,
which you can derive by making a few modifications to the even number printing example given earlier in the chapter, where the for loop was introduced.

Now consider the equivalence between numbers and strings of hash characters.
You can go from 1 to 2 by adding 1 (+= 1). You can go from "#" to "##" by adding a character (+= "#").
Thus, your solution can closely follow the number-printing program. */

// My solution
let s = '';

for (let i = 0; i < 7; i++) {
  s += '#';  
  console.log(s);
}

// Book solution
for (let line = "#"; line.length < 8; line += "#")
  console.log(line);