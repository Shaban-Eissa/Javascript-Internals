function complexCalculation() {
  let result = 0;
  for (let i = 1; i <= 1000; i++) {
    result += Math.sin(i) * Math.log(i);
  }
  return result;
}

console.log(complexCalculation());
