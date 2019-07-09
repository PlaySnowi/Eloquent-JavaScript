/* Consider the following (rather contrived) box object.

It is a box with a lock. There is an array in the box, but you can get at it only when the box is unlocked. Directly accessing the private _content property is forbidden.

Write a function called withBoxUnlocked that takes a function value as argument, unlocks the box, runs the function, and then ensures that the box is locked again before returning,
regardless of whether the argument function returned normally or threw an exception.

For extra points, make sure that if you call withBoxUnlocked when the box is already unlocked, the box stays unlocked.

Hints:

This exercise calls for a finally block. Your function should first unlock the box and then call the argument function from inside a try body. The finally block after it should lock the box again.

To make sure we don’t lock the box when it wasn’t already locked, check its lock at the start of the function and unlock and lock it only when it started out locked. */

const box = {
    locked: true,
    unlock() { this.locked = false; },
    lock() { this.locked = true; },
    _content: [],
    get content() {
        if (this.locked) throw new Error("Locked!");
        return this._content;
    }
};

// My solution

function withBoxUnlocked(body) {
    let initialState = box.locked;
    let message;
    if (initialState) box.unlock();
    try {
        body();
        message = box.content;
    } finally {
        if (initialState) box.lock();
    }
    return message;
}

// Book solution

/* function withBoxUnlocked(body) {
    let locked = box.locked;
    if (!locked) {
        return body();
    }

    box.unlock();
    try {
        return body();
    } finally {
        box.lock();
    }
} */

/**/

withBoxUnlocked(function () {
    box.content.push("gold piece");
});

try {
    withBoxUnlocked(function () {
        throw new Error("Pirates on the horizon! Abort!");
    });
} catch (e) {
    console.log("Error raised: " + e);
}
console.log(box.locked);
// → true