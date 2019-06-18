/* Make the Group class from the previous exercise iterable.
Refer to the section about the iterator interface earlier in the chapter if you aren’t clear on the exact form of the interface anymore.

If you used an array to represent the group’s members, don’t just return the iterator created by calling the Symbol.iterator method on the array.
That would work, but it defeats the purpose of this exercise.

It is okay if your iterator behaves strangely when the group is modified during iteration.

Hints:

It is probably worthwhile to define a new class GroupIterator.
Iterator instances should have a property that tracks the current position in the group.
Every time next is called, it checks whether it is done and, if not, moves past the current value and returns it.

The Group class itself gets a method named by Symbol.iterator that, when called, returns a new instance of the iterator class for that group. */

// My solution
class Group {
  constructor() {
    this.groupArray = [];
    Group.iterate();
  }

  add(valueToAdd) {
    if (this.groupArray.indexOf(valueToAdd) === -1) return this.groupArray.push(valueToAdd);
  }

  delete(valueToDelete) {
    const result = this.groupArray.filter(v => v !== valueToDelete);
    this.groupArray = result;
  }

  has(valueToVerify) {
    if (this.groupArray.indexOf(valueToVerify) === -1) return false
    else return true
  }

  static from(iterable) {
    let group = new Group();
    for (let i of iterable) {
      group.add(i);
    }
    return group;
  }

  static iterate() {
    Group.prototype[Symbol.iterator] = function () {
      return new GroupIterator(this);
    };
  }
}

class GroupIterator {
  constructor(group) {
    this.array = group.groupArray;
    this.x = 0;
  }

  next() {
    if (this.x === this.array.length) return { done: true };

    let value = this.array[this.x];

    this.x++;

    return { value, done: false };
  }
}

// Book solution
class Group {
  constructor() {
    this.members = [];
  }

  add(value) {
    if (!this.has(value)) {
      this.members.push(value);
    }
  }

  delete(value) {
    this.members = this.members.filter(v => v !== value);
  }

  has(value) {
    return this.members.includes(value);
  }

  static from(collection) {
    let group = new Group;
    for (let value of collection) {
      group.add(value);
    }
    return group;
  }

  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}

class GroupIterator {
  constructor(group) {
    this.group = group;
    this.position = 0;
  }

  next() {
    if (this.position >= this.group.members.length) {
      return { done: true };
    } else {
      let result = {
        value: this.group.members[this.position],
        done: false
      };
      this.position++;
      return result;
    }
  }
}

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
