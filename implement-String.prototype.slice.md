# Implement String.prototype.slice

### Problem Description

Implement your own version of the `String.prototype.slice` method in JavaScript.

The `slice()` method extracts a section of a string and returns it as a new string, without modifying the original string.

Your implementation should handle the following:

- If `beginIndex` is greater than or equal to the length of the string, return an empty string.
- If `endIndex` is omitted, extract until the end of the string.
- Negative indices count back from the end of the string.
- If `endIndex` is greater than the length of the string, extract until the end of the string.
- Ensure the method works correctly for both positive and negative indices, and for edge cases where indices are out of bounds.

### Syntax

```js
str.slice(beginIndex[, endIndex])
```

#

### Solution 
```js
/**
 * Custom implementation of String.prototype.slice
 * 
 * @param {string} str - The string to slice.
 * @param {number} beginIndex - The index at which to begin extraction.
 * @param {number} [endIndex] - The index before which to end extraction.
 * @return {string} - The extracted section of the string.
 */
function customSlice(str, beginIndex, endIndex) {
  // Ensure the beginIndex is within the bounds of the string length
  if (beginIndex < 0) {
    beginIndex = Math.max(str.length + beginIndex, 0);
  } else {
    beginIndex = Math.min(beginIndex, str.length);
  }

  // If endIndex is not provided, use the length of the string
  if (endIndex === undefined || endIndex > str.length) {
    endIndex = str.length;
  } else if (endIndex < 0) {
    endIndex = Math.max(str.length + endIndex, 0);
  }

  // Calculate the length of the substring
  const length = Math.max(endIndex - beginIndex, 0);

  // Build the sliced string
  let result = '';
  for (let i = 0; i < length; i++) {
    result += str[beginIndex + i];
  }

  return result;
}

// Usage

console.log(customSlice("Hello, world!", 7, 12)); // Expected: "world"
console.log(customSlice("Hello, world!", 7)); // Expected: "world!"
console.log(customSlice("Hello, world!", -5, -1)); // Expected: "orld"
console.log(customSlice("Hello, world!", -5)); // Expected: "orld!"
console.log(customSlice("Hello, world!", 7, 7)); // Expected: ""
console.log(customSlice("Hello, world!", 7, 6)); // Expected: ""
console.log(customSlice("Hello, world!", 7, 100)); // Expected: "world!"
console.log(customSlice("Hello, world!", 7, -100)); // Expected: ""
console.log(customSlice("Hello, world!", -100, 7)); // Expected: "Hello, "
console.log(customSlice("Hello, world!", 100, 7)); // Expected: ""
console.log(customSlice("Hello, world!", -100, -100)); // Expected: ""
console.log(customSlice("Hello, world!", 100, 100)); // Expected: ""
console.log(customSlice("Hello, world!", -100, -100)); // Expected: ""
console.log(customSlice("Hello, world!", 0, 0)); // Expected: ""
console.log(customSlice("Hello, world!", 0, 1)); // Expected: "H"
console.log(customSlice("Hello, world!", 0, 100)); // Expected: "Hello, world!"
console.log(customSlice("Hello, world!", 0, -100)); // Expected: ""
console.log(customSlice("Hello, world!", -100, 0)); // Expected: ""
console.log(customSlice("Hello, world!", 0, -1)); // Expected: "Hello, world"
console.log(customSlice("Hello, world!", -1, 0)); // Expected: ""
console.log(customSlice("Hello, world!", -1, -1)); // Expected: ""
console.log(customSlice("Hello, world!", -1, -100)); // Expected: ""
console.log(customSlice("Hello, world!", -1, 100)); // Expected: "!"
console.log(customSlice("Hello, world!", -1)); // Expected: "!"
console.log(customSlice("Hello, world!", 0)); // Expected: "Hello, world!"
console.log(customSlice("Hello, world!", 1)); // Expected: "ello, world!"
```

#

### Explanation 

The provided code is a custom implementation of the `String.prototype.slice` method in JavaScript. This method is used to extract a section of a string and return it as a new string, without modifying the original string.


1. The function takes three parameters: `str` the string to slice, `beginIndex` the index at which to begin extraction, and `endIndex` the index before which to end extraction.

2. The function first checks if `beginIndex` is less than 0. If it is, it adjusts `beginIndex` to count from the end of the string. If `beginIndex` is greater than the length of the string, it is set to the length of the string.

3. Next, the function checks if `endIndex` is provided. If it's not, or if it's greater than the length of the string, `endIndex` is set to the length of the string. If  `endIndex` is less than 0, it is adjusted to count from the end of the string.

4. The function then calculates the length of the substring to be extracted. If `endIndex` is less than `beginIndex`, the length is set to 0.

5. Finally, the function builds the sliced string by iterating over the characters in the specified range and appending them to the result string.
