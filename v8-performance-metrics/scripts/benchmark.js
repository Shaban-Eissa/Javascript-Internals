const { spawnSync } = require("child_process");
const fs = require("fs");
const { parse } = require("json2csv");
const v8 = require("v8");

function measureTime(file) {
  const start = process.hrtime.bigint();

  // Run the script and measure total execution time
  const result = spawnSync("node", [`samples/${file}`], { encoding: "utf-8" });
  const end = process.hrtime.bigint();
  const executionTime = (end - start) / BigInt(1000000); // Convert to milliseconds

  // Measure bytecode generation time
  const bytecodeStart = process.hrtime.bigint();
  const script = fs.readFileSync(`samples/${file}`, "utf-8");
  new Function(script);
  const bytecodeEnd = process.hrtime.bigint();
  const bytecodeTime = (bytecodeEnd - bytecodeStart) / BigInt(1000000); // Convert to milliseconds

  // Get V8 heap statistics
  const heapStats = v8.getHeapStatistics();
  const heapUsed = heapStats.used_heap_size;
  const heapTotal = heapStats.total_heap_size;

  // Mock data for optimized and deoptimized function counts
  const optimizedFunctions = Math.floor(Math.random() * 100);
  const deoptimizedFunctions = Math.floor(Math.random() * 20);

  // Mock data for garbage collection time (in ms)
  const garbageCollectionTime = Math.floor(Math.random() * 50);

  return {
    file,
    executionTime: Number(executionTime),
    bytecodeTime: Number(bytecodeTime), // Include bytecode time
    heapUsed,
    heapTotal,
    optimizedFunctions,
    deoptimizedFunctions,
    garbageCollectionTime,
  };
}

const files = ["simpleLoop.js", "complexCalculation.js", "functionCalls.js"];
const results = files.map(measureTime);

// Save results to CSV
const csv = parse(results, {
  fields: [
    "file",
    "executionTime",
    "bytecodeTime", // Include bytecode time field
    "heapUsed",
    "heapTotal",
    "optimizedFunctions",
    "deoptimizedFunctions",
    "garbageCollectionTime",
  ],
});
fs.writeFileSync("data/performance_metrics.csv", csv);

console.log(
  "Benchmarking complete. Results saved to data/performance_metrics.csv"
);
