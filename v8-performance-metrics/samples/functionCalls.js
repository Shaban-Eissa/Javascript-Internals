function functionCalls() {
  function add(a, b) {
    return a + b;
  }

  let sum = 0;
  for (let i = 0; i < 100000; i++) {
    sum += add(i, i + 1);
  }
  return sum;
}

console.log(functionCalls());
