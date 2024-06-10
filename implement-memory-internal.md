# Memory Management Under The Hood

Memory management is a crucial aspect of JavaScript, especially in Node.js where efficient memory use is essential for performance. This documentation demonstrates how to manually manage memory in Node.js, including allocation, usage, and garbage collection. JavaScript uses automatic memory management with a built-in garbage collector. The main goal is to reclaim memory occupied by objects that are no longer reachable or needed by the program.
<br />

Key Concepts : 

* Memory Allocation - Memory is allocated when variables, objects, or functions are created. 
* Garbage Collection - The process of automatically finding and freeing memory that is no longer in use.

The documentation covers:

* Memory allocation for different types of variables.
* Garbage collection mechanisms (mark-and-sweep, reference counting).
* Manual garbage collection in Node.js using `global.gc()`.
* Preventing and debugging memory leaks.
* Simulation and monitoring the usage of memory in production.


Understanding How Memory Is Working Behind The Scenes
---------------------------------------------------------

Let's begin by examining the life cycle of memory:

1.  **Allocation of memory**: When a program starts, the operating system allocates memory to the Node.js process to store values.
2.  **Memory usage**: The process utilizes the allocated memory to read and write values.
3.  **Releasing memory**: When the program completes its execution, the operating system frees the memory allocated to the Node.js process, making it available to other processes that require it.

If an application's memory consumption exceeds the memory allocated to it by the operating system, it will be terminated. Increasing the V8 memory limit can provide temporary relief, but eventually, you may run out of memory or be forced to pay more for server resources. Therefore, it's critical to understand how to prevent memory leaks to make the best use of the allocated memory.

Memory Storage In JavaScript
------------------------------------------

This section will explain how data is stored in memory by the JavaScript engine utilized by the Node.js runtime. When memory is allocated to a program, the JavaScript engine stores data in two primary storage areas which are discussed below:

### 1\. Stack

The stack is a Last-In-First-Out (LIFO) data structure that stores data with a fixed and known size, such as numbers or strings. JavaScript categorizes fixed-sized values into primitive types, which include `string`, `number`, `boolean`, `undefined`, `symbol`, and `null`. These data types are stored on the stack and are immutable, as shown in the following example:

```js
let name = "Stanley";
let num = 15;
let isLogged = true;
let check = null;
```


The variables and their values are allocated on the stack, with the `name` variable added first and the `check` variable added last, as illustrated in the illustration below:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9e92f38d-491e-4238-899b-4e4ddad30d00/lg1x">

### 2\. Heap

The heap is a dynamic memory location that stores elements with an unknown size, such as arrays, functions, and objects. The heap can expand if more memory is required, or it can shrink if objects are deleted.

JavaScript stores arbitrarily sized objects on the heap, including functions, arrays, and objects. These objects' sizes are typically unknown and can change dynamically, such as when elements are added to or removed from an array. Adding elements requests more memory from the heap, while removing elements frees up memory.

The following code demonstrates examples of an object, function, and an array, typically stored on the heap:

```js
const user = {
  name: "Stanley",
  email: "user1@mail.com",
};

function printUser() {
  console.log(`name is ${name}`);
}

const interests = ["bikes", "motorcycles"];
```


We can visualize them as follows:
<br />
<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1011d40e-8d25-4f19-59c3-df78de437100/lg1x" />

In this example, the variable names are stored on the stack, but the values they reference are placed on the heap instead.

Understanding How JavaScript Objects Hold Memory
------------------------------------------------

A Garbage Collector (GC) automatically manages the allocation and freeing of memory in JavaScript. The GC goes through the heap and deletes all objects that are no longer needed.

Objects occupy memory in the heap in two ways:

1.  **Shallow size**: The amount of heap memory allocated to store the object itself.
2.  **Retained size**: The amount of memory allocated to the object, including the size of all objects referenced by it.

Let's examine how an object creates references using the following example:

```js
var user = {
  name: "Stanley",
  email: "user1@mail.com",
};
```


When you define the `user` variable, the `global` object in Node.js references the object stored on the heap. We can represent this using a graph data structure:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7d1d09a0-845c-41cd-a9ad-ce2efb892c00/lg1x" />

If later in the code, you set `user` to `null`:
```js
user = null
```

The reference from the root is lost, and the object in the heap becomes unreferenced and garbage.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d1011bdb-0baf-4330-08ba-1c3fb8ee6900/lg1x" />

As your codebase grows and more objects are stored in the heap, you may end up with complex references:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/7a144bd1-e2d6-4afa-e423-53e76c78a400/lg1x" />

Now that you understand how objects consume memory in JavaScript, let's learn about how the garbage collector works in the next section.

Understanding How The JavaScript Garbage Collector Works
--------------------------------------------------------

In languages like C or C++, programmers manually allocate or free memory on the heap. However, this is not the case in Node.js whose V8 engine contains a garbage collector. The GC automatically removes objects that are no longer required in the heap. It starts from the root node, traverses all object references, and deletes the ones that don't have any references.

In the following diagram, the garbage collector identifies two nodes (objects) that don't have any references and are no longer needed:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a5b4f17b-1e21-4316-0061-2046a453cc00/lg1x" />

Objects that are not referenced are classified as garbage, and their deletion frees up memory from the heap.

As your program executes, the garbage collector periodically pauses the application to remove unreferenced objects from the heap. You don't control when the garbage collector runs; it runs as it sees fit or when it detects a shortage of free memory.

JavaScript primarily uses two garbage collection algorithms:

#### 1\. The Mark-and-Sweep Algorithm

The garbage collector uses the mark-and-sweep algorithm to eliminate garbage data and free up space. The algorithm functions in the following manner:

1.  **Mark phase**: the GC traverses from the root (global) and marks all referenced objects that are reachable from the root.
    
2.  **Sweep phase**: next, the GC examines all memory from start to finish and removes all unmarked objects. This frees up memory in the heap.
    
#### 2\. Reference Counting Algorithm

In reference counting, each object has a count of references pointing to it. When this count drops to zero, the object is collected. However, this can cause issues with circular references, which is why modern engines prefer mark-and-sweep.



Demo For Memory Under The Hood In Javascript
--------------------------------------------

```js
// Function to monitor memory usage
function monitorMemoryUsage() {
  const used = process.memoryUsage();
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
  console.log('---');
}

// Example of memory allocation
function allocateMemoryExample() {
  // Primitive allocation
  let number = 123;
  let string = "Hello, world!";

  // Object allocation
  let obj = { name: "JavaScript", type: "Programming Language" };

  // Array allocation
  let array = [1, 2, 3, 4, 5];

  // Function allocation
  function greet() {
    console.log("Hello, memory management!");
  }

  // Use the allocated memory
  console.log(number, string, obj, array);
  greet();

  // Deallocate memory (objects and arrays become unreachable)
  obj = null;
  array = null;
  // Primitive types are automatically deallocated
}

// Example of mark-and-sweep garbage collection
function markAndSweepDemo() {
  let root = {
    child1: {
      child2: {
        child3: {}
      }
    }
  };

  console.log("Before setting to null:", root);

  // Break references
  root.child1.child2 = null;
  root.child1 = null;

  console.log("After setting to null:", root);
}

// Example of reference counting and circular references
function referenceCountingDemo() {
  let obj1 = {};
  let obj2 = {};

  // Circular reference
  obj1.ref = obj2;
  obj2.ref = obj1;

  console.log("Circular references created:", obj1, obj2);

  // Break the references
  obj1 = null;
  obj2 = null;

  console.log("References broken, eligible for garbage collection");
}

// Monitor initial memory usage
console.log("Initial memory usage:");
monitorMemoryUsage();

// Run memory allocation example
allocateMemoryExample();
console.log("After memory allocation example:");
monitorMemoryUsage();

// Run mark-and-sweep example
markAndSweepDemo();
console.log("After mark-and-sweep example:");
monitorMemoryUsage();

// Run reference counting demo
referenceCountingDemo();
console.log("After reference counting demo:");
monitorMemoryUsage();

// Trigger garbage collection manually (if possible)
if (global.gc) {
  console.log("Manual garbage collection:");
  global.gc();
  monitorMemoryUsage();
} else {
  console.warn("No GC hook! Start your program with `node --expose-gc memoryManagement.js`.");
}

// Simulate a long-running process to give time for garbage collection
setTimeout(() => {
  console.log("End of script");
  monitorMemoryUsage();

  // Trigger garbage collection manually again (if possible)
  if (global.gc) {
    console.log("Final manual garbage collection:");
    global.gc();
    monitorMemoryUsage();
  } else {
    console.warn("No GC hook! Start your program with `node --expose-gc memoryManagement.js`.");
  }
}, 5000);
```

### Explanation

The provided code demonstrates memory management in Node.js, focusing on memory allocation and garbage collection.

1. **Memory Monitoring**:
    
    * The `monitorMemoryUsage` function logs the current memory usage, breaking it down into various types (e.g., RSS, heap total, heap used, external).
2. **Memory Allocation Example**:
    
    * Memory for primitives is allocated on the stack, and memory for objects and arrays is allocated on the heap.
    * Functions are stored in memory along with their closures, which include references to their outer lexical environments.
    * After usage, objects and arrays are set to `null` to make them eligible for garbage collection.

3. **Mark-and-Sweep Example**:
    
    * Shows how breaking references can make objects eligible for garbage collection using the mark-and-sweep algorithm.
    * Roots are global variables and local variables within function scopes.
    * The garbage collector marks all objects reachable from the roots.
    * Unmarked objects are considered unreachable and are swept (collected).
4. **Reference Counting Example**:
    
    * Illustrates how circular references can lead to memory leaks if not managed properly.
    * Circular references can cause memory leaks, as their reference counts never reach zero.
    * Breaks the circular references to make the objects eligible for garbage collection.
    * Each object keeps a count of references to it.
    * When the reference count drops to zero, the object is collected.
    
5. **Manual Garbage Collection**:
    
    * Uses `global.gc()` to manually trigger garbage collection. This requires the script to be run with the `--expose-gc` flag.
    * Logs memory usage before and after manual garbage collection.
    * Checks if the `gc` function is available (which requires the script to be run with `--expose-gc`).
    * Manually triggers garbage collection to observe its effects on memory usage.
6. **Long-running Process Simulation**:
    
    * Uses `setTimeout` to simulate a delay, allowing you to see if garbage collection occurs over time.
    * Manually triggers garbage collection again to observe its impact.

### Running the Script

To run the script with manual garbage collection enabled, use the following command:

```bash
node --expose-gc memoryManagement.js
```

When you run the script with the `--expose-gc` flag, you should see output similar to the following:

```yaml
Initial memory usage:
rss: 32.45 MB
heapTotal: 8.84 MB
heapUsed: 4.21 MB
external: 0.05 MB
---

123 Hello, world! { name: 'JavaScript', type: 'Programming Language' } [ 1, 2, 3, 4, 5 ]
Hello, memory management!
After memory allocation example:
rss: 32.59 MB
heapTotal: 8.84 MB
heapUsed: 4.36 MB
external: 0.05 MB
---
Before setting to null: { child1: { child2: { child3: {} } } }
After setting to null: { child1: null }
After mark-and-sweep example:
rss: 32.59 MB
heapTotal: 8.84 MB
heapUsed: 4.37 MB
external: 0.05 MB
---
Circular references created: { ref: { ref: [Circular *1] } } { ref: { ref: [Circular *2] } }
References broken, eligible for garbage collection
After reference counting demo:
rss: 32.59 MB
heapTotal: 8.84 MB
heapUsed: 4.37 MB
external: 0.05 MB
---
Manual garbage collection:
rss: 32.59 MB
heapTotal: 8.84 MB
heapUsed: 4.37 MB
external: 0.05 MB
---
End of script
rss: 32.59 MB
heapTotal: 8.84 MB
heapUsed: 4.37 MB
external: 0.05 MB
---
Final manual garbage collection:
rss: 32.59 MB
heapTotal: 8.84 MB
heapUsed: 4.37 MB
external: 0.05 MB
---
```

This output shows memory usage at different stages and demonstrates how memory is allocated, used, and collected in a Node.js environment.


### Observing Garbage Collection

Garbage collection in JavaScript is automatic and non-deterministic. You can observe memory usage and garbage collection using browser developer tools or Node.js memory profiling tools.

* **Chrome DevTools**: Use the "Memory" tab to take heap snapshots and observe memory usage.
* **Node.js**: Use `--inspect` and `--expose-gc` flags to manually trigger garbage collection and inspect memory usage.
* **Third-party libraries**: Tools like `heapdump` and `memwatch-next` can help monitor memory usage in Node.js applications.


Memory Leaks in Node.js
---------------------------------------

Memory leaks can be a big problem in all applications regardless of the programming languages. Whether leaks happen incrementally or in smaller chunks, the application will come to a point where it will start getting slow and eventually crash. This can leave a bad impression on users, so it's important to be prudent and avoid writing code that can introduce memory leaks.

### What Are Memory Leaks?

As discussed earlier, the garbage collector deletes all objects that are not reachable from the root node. However, sometimes objects that are no longer required in the program are still referenced from the root node or another node reachable from the root. As a result, the garbage collector assumes that these objects are still required due to the references. So, every time the garbage collector runs, the garbage objects survive each garbage collection phase, causing the program's memory usage to continue growing until it runs out of memory. This is known as a memory leak.

### Causes of Memory Leaks

This section will discuss some of the most common causes of memory leaks in a Node.js application.

### 1\. Global variables

Global variables are directly referenced by the root node, and they remain in memory for the entire duration of your application. The garbage collector does not clean them up.

Consider the following example:

```js
const express = require("express");
const app = express();
const PORT = 3000;

const data = [];
app.get("/", (req, res) => {
  data.push(req.headers);
  res.status(200).send(JSON.stringify(data));
});
```


In this snippet, you have a global variable data, which is initially empty. However, every time a user visits the / route, the request headers object is appended to the data array. If the app receives 1000 requests, the data array will grow to 1000 elements, and the memory will persist as long as the app runs. As the app receives more requests, it will eventually exhaust all allocated memory and crash.

While this memory leak is easy to identify, it is possible to accidentally introduce global variables in Node.js that cause memory leaks. For example:

```js
function setName() {
  name = "Stanley";
}
setName();
console.log(name); // "Stanley"
```


In the `setName()` function, a `name` variable is assigned the value `Stanley`. Although it might appear to be a local variable of the function, it is a global variable in non-strict mode. The variable is attached to the global object and remains in memory as long as your app runs.

If you run the program, the `console.log()` method logs the value of the name variable in the console, even after the `setName()` memory has been destroyed.

### 2\. Closures

Another common cause of memory leaks in Node.js is closures. A closure is a function that is returned from another function and retains the memory of the parent (outer) function. When the closure is returned and invoked, the data it holds in memory is not destroyed, and it can be accessed in the program at any time, leading to a memory leak.

Consider the following example, which has a function that returns an inner function:

```js
function outer(elementCount) {
  // Create an array containing numbers from 0 to elementCount value
  let elements = Array.from(Array(elementCount).keys());

  return function inner() {
    // return a random number
    return elements[Math.floor(Math.random() * elements.length)];
  };
}

```


In the `outer()` function, an array is created with numbers ranging from 0 to the value of the `elementCount` parameter. The function then returns an `inner()` function that randomly selects a number from the elements array and returns it. The `inner()` function is a closure because it retains access to the scope of the `outer()` function.

To execute the closure, you can call it as follows:

```js
let getRandom = outer(10000);
console.log(getRandom());
console.log(getRandom());
```


Here, the `outer()` function is invoked with an argument of `10000`, and it returns the `inner()` function. The `getRandom()` function then retrieves a random number from the elements array. You can call `getRandom()` as many times as you want, and it will always return a different result.

However, once you have finished using the `inner()` function, you might assume that its memory has been cleaned up. Unfortunately, the closure retains the memory of the `outer()` function, and it persists in the heap even after you have finished using it. The garbage collector will not clean it up because it assumes that the closure is still required and that you might use it later. This can result in a memory leak.

### 3\. Forgotten Timers

Node.js comes with timers such as setTimeout() and setInterval(). The former executes a callback function after a specified delay, while the latter executes a callback function repeatedly with a fixed delay between each execution. These timers can cause memory leaks, especially when used with closures.

Consider this example:

```js
function increment() {
  const data = [];
  let counter = 0;

  return function inner() {
    data.push(counter++); // data array is now part of the callback's scope
    console.log(counter);
    console.log(data);
  };
}

setInterval(increment(), 1000);
```


In this example, the `setInterval()` method runs the `inner()` function returned by the `increment()` function, repeatedly adding an element to the data array each time it runs. Since the data array is part of the closure created by inner(), it remains in memory after each call to increment(), even though it's no longer needed. As a result, the heap keeps growing over time until the application runs out of memory.

To avoid this issue, you can clear the timer when it's no longer needed, for example by calling `clearInterval()` or `clearTimeout()`. It's also a good practice to avoid using closures in timer callbacks unless necessary, to reduce the risk of memory leaks.

Preventing Memory Leaks
-----------------------

In this section, we will discuss best practices to prevent memory leaks in your Node.js applications.

### 1\. Reduce global variables usage

While it may be challenging to eliminate global variables completely, it is essential to avoid using them whenever possible. If you must use global variables, set them to null once you are done using them, so the garbage collector can clean them up.

```js
const data = [];
// do some stuff

data = null;
```


Avoid using global variables solely because it is easier to pass them around your codebase. Group functionality that constantly references a variable in a class or use ES modules. Use functions as much as possible so that variables can be locally scoped and destroyed after the function finishes executing.

### 2\. Avoid accidental global variables

To avoid creating accidental global variables, use [ES modules](https://nodejs.org/api/esm.html)  in Node.js or the browser. ES modules run in strict mode by default. Therefore, running the following code will trigger an error:

```js
function setName() {
  name = "Stanley";
}
setName();
console.log(name);
```


```yaml
ReferenceError: name is not defined
```


To use ES Modules, add the following line in your `package.json` file:
```js
{
  ...
"type": "module"
}
```

If you cannot switch to ES modules right now, add "use strict" to the top of each file in your project:

Or use the `--use-strict` flag when running a Node.js program:

```yaml
node --use-strict program.js
```


In addition, make a habit of using ES6's `const` and `let` to define variables, which are block-scoped:

```js
function setName() {

  const name = "Stanley";
}
setName();
console.log(name);
```


```yaml
Uncaught ReferenceError: name is not defined
```


### 3\. Clearing timers

As discussed earlier, timers can cause memory leaks if not handled properly. To prevent such leaks, it's important to clear the timers when they are no longer needed.

In the following example, we used the `setInterval()` method to repeatedly execute a function that adds a new item to an array every second:

```js
function increment() {
  const data = [];
  let counter = 0;

  return function inner() {
  ...
  };
}

const timerId = setInterval(increment(), 1000);


// Clear the timer after 10 seconds

setTimeout(() => {

  clearInterval(timerId);

}, 10000);
```


In the code above, the ID of the timer returned by `setInterval()` is stored in the `timerId` variable, and `setTimeout()` is used to clear the timer after 10 seconds by passing the `timerId` to `clearInterval()` to ensure that the timer stops running after the specified duration.

Remember that the same principles can be applied to other types of timers, such as setTimeout(), as well as event listeners or [EventEmitters](https://betterstack.com/nodejs.org/api/events.html) . Always clear the timers and listeners when they are no longer needed to prevent memory leaks.

Coping With Memory Leaks In Production
--------------------------------------

Finding and fixing memory leaks in a large application can be challenging and time-consuming. While investigating the root cause of the issue, it helps to deploy some temporary measures to prevent the memory leak from getting out of hand.

One common strategy is to configure a process manager to auto-restart the application process when the memory reaches a pre-configured threshold. This approach helps to clear the process memory, including the heap, allowing the application to start afresh with an empty memory.

Here's an example that configures [PM2](https://betterstack.com/community/guides/scaling-nodejs/pm2-guide/) to auto restart a node application when it exceeds a certain limit (400 Megabytes in this case):

ecosystem.config.js:

```yaml
module.exports = {
  apps : [{
    name: 'app_name',
    script: 'app.js',

    max_memory_restart: '400M'
    ...
  }]
}
```


With this in place, `pm2` will automatically check memory usage every 30 seconds and restart the application when the memory limit `400M` has been reached. You can also use the `--max-memory-restart` option when starting the application:

```yaml
pm2 start app.js --max-memory-restart 400M
```


Once you have such auto restart strategy in place, you can focus on debugging and fixing the memory leak, and that's what we will focus on in the rest of this article.

Debugging Node.js Memory Leaks
------------------------------

In this section, you will learn how to debug the application to identify the memory leak source and fix it permanently. Starting with Node.js v11.13.0 or higher, you can use `writeHeapSnapshot()` method of the [`v8`](https://nodejs.org/api/v8.html)  module to take a heap snapshot as your application is running. If you are using a Node.js version lower than v11.13, use the [heapdump](https://www.npmjs.com/package/heapdump)  package instead or [v8-profiler-next] (https://www.npmjs.com/package/v8-profiler-next).

Once the snapshots have been taken, you can load them in the Chrome DevTools. The DevTools have a memory panel that allows you to load heap snapshots, compare them, and give you a summary of the memory usage.

To debug a memory leak, first, create a project directory and move into it:

Before we begin to describe the process of debugging memory leaks, let's create a Node.js project that contains a memory leak first. Start by creating and changing into a new project directory using the command below:

```yaml
mkdir memoryleak_demo && cd memoryleak_demo
```


Next, initialize the project with a `package.json` file:

Afterward, install [Express](https://expressjs.com/) and [loadtest](https://www.npmjs.com/package/loadtest) and [v8-profiler-next](https://www.npmjs.com/package/v8-profiler-next)  packages in your project directory. The former is for creating a simple Node.js server, while the latter is for sending traffic to the server.

Once the dependencies are installed, open a new `captureHeapSnapshot.js` file in your text editor, then add the following code:

```js
const http = require("http");
const v8Profiler = require("v8-profiler-next");
const fs = require("fs");

// Function to capture heap snapshot with a unique filename
const captureHeapSnapshot = (label) => {
  const timestamp = new Date().toISOString().replace(/:/g, "-"); // Generate a unique timestamp
  const snapshot = v8Profiler.takeSnapshot(`${label}-${timestamp}`);
  snapshot
    .export()
    .pipe(fs.createWriteStream(`${label}-${timestamp}.heapsnapshot`))
    .on("finish", () => {
      snapshot.delete();
      console.log(
        `Heap snapshot captured successfully: ${label}-${timestamp}.heapsnapshot`
      );
    });
};

// Function to start the server and capture heap snapshots
const startServerAndCaptureSnapshots = () => {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World\n");
  });

  server.listen(3000, () => {
    console.log("Server started at http://localhost:3000/");
    // Capture initial heap snapshot after 1 second
    setTimeout(() => captureHeapSnapshot("heapSnapshot-initial"), 1000);

    // Capture second heap snapshot after a delay (e.g., 10 seconds for demonstration)
    setTimeout(() => captureHeapSnapshot("heapSnapshot-second"), 11000);
  });
};

// Check if the server is already running on port 3000
const serverStatusCheck = http.get("http://localhost:3000", (res) => {
  // Server is already running, capture initial heap snapshot
  console.log("Server is already running on port 3000.");
  captureHeapSnapshot("heapSnapshot-initial");

  // Capture second heap snapshot after a delay (e.g., 10 seconds for demonstration)
  setTimeout(() => captureHeapSnapshot("heapSnapshot-second"), 10000);
});

// Handle connection errors (e.g., server not running)
serverStatusCheck.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    // Server is not running, start the server and capture snapshots
    startServerAndCaptureSnapshots();
  } else {
    console.error("Error checking server status:", err);
  }
});
```

The code imports the necessary `http`, `v8-profiler-next`, and `fs` modules to capture heap snapshots and manage an HTTP server. It defines a function `captureHeapSnapshot` that creates a heap snapshot with a unique filename using a timestamp. The `startServerAndCaptureSnapshots` function starts a server on port 3000 and schedules two heap snapshots: one taken 1 second after the server starts and a second one taken 10 seconds later. The script first checks if the server is already running on port 3000. If it is running, it captures the snapshots directly. If the server is not running, it starts the server and captures the snapshots, handling any connection errors that might occur.

Once you are done adding the new lines, save the file and execute the program to start the server on port 3000:

```yaml
Server listening on http://localhost:3000/
Heap snapshot captured successfully: heapSnapshot-initial-2024-06-09T19-56-16.547Z.heapsnapshot
Heap snapshot captured successfully: heapSnapshot-second-2024-06-09T19-56-26.556Z.heapsnapshot
```


Now that the first snapshot has been created, you will use the `loadtest` package to simulate 7000 HTTP requests to the Node.js app server. In the second terminal, run the following command:

```yaml
npx loadtest -n 7000 -c 1 -k http://localhost:3000/
```


You will observe a output that looks similar to this:

```yaml
Target URL:          http://localhost:3000/
Max requests:        7000
Concurrent clients:  2
Running on cores:    2
Agent:               keepalive

Completed requests:  7000
Total errors:        0
Total time:          2.792 s
Mean latency:        0.3 ms
Effective rps:       2507

Percentage of requests served within a certain time
  50%      1 ms
  90%      1 ms
  95%      1 ms
  99%      5 ms
 100%      75 ms (longest request)
```


In the output, `Completed requests: 7000` confirms that the requests have been successfully sent. 

At this point, you have created two snapshot files. One when the application just started running, and the other after some load has been sent to the server:

Next, open Chrome and visit `http://localhost:3000/` to get an idea of the data stored in the `headersArray`:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b7737b30-ea96-437d-4c59-2a8b527c3700/lg1x" />

Due to the simulated 7000 visits to the server using `loadtest`, the `headersArray` has 7000 objects with the `userAgentUsed` property set to the `loadtest/5.2.0` value.

Analyzing Node.js Heap Snapshots Using The Chrome DevTools
------------------------------

After creating the snapshot files, you need to analyze them using Chrome DevTools to locate the memory leak. Therefore, open the Chrome DevTools in your browser tab and switch to the memory panel:
<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/bf01be2c-be5d-4233-df6e-7e56c7119700/lg1x" />

Click the **Load** button to open your operating system's file picker. Locate the first heap dump in your application directory and select it:
<br />
<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ee9d72e1-6881-40a5-cad5-89336e730f00/lg1x" />

Repeat the process once again to load the second heap dump file. You will now see the two heap dumps loaded:
<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/d298c5c8-ad75-4806-22be-53314db83800/lg1x" />

Now, click the second heap dump file and select **Statistics**. The panel will give you an idea of what kind of data is taking space in the heap:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/395f9e68-7939-443d-e773-5120fe7f1e00/lg1x" />

If you observe closely, you will notice that **Strings** is using most of the memory in the heap, which is 3046kb. It is followed by the **Code**, which includes your application code, as well as all the code in the `node_modules` directory.

Observing the statistics give you a hint of the objects you need to investigate to find the memory leak. We already know that we have over 7000 objects in the `headersArray`. This can mislead you into thinking that **JS arrays** should be the one using the most memory since `headersArray` is an array. The best thing you can do for now is to trust the data you are looking at on the chart and take note of what is taking the most memory, which is the strings here.

Next, you will compare the differences between the two heap snapshots by selecting the **Comparison** option:
<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/a50b9910-7736-4c3b-a8c1-fbb9d4718c00/lg1x" />

When you select this option, the objects in the heap of the first snapshot will be compared with the ones in the second snapshot.

Let's go over some of the columns in the table and what they mean:

*   **Constructor**: Shows the type of Constructor used.
*   **New**: The new objects that have been added to the heap.
*   **Deleted**: The objects that have been deleted.
*   **Delta**: The number of objects created and deleted in the heap. If a number is prefixed with `+`, it represents the number of objects added. When prefixed with `-`, it represents the number of objects deleted.
*   **Alloc. Size**: The amount of memory allocated to the constructor
*   **Freed Size**: The amount of memory freed after deleting objects.

Our focus will be on the **Delta** column. First, click on the **Delta** column header twice to sort the column values from highest to lowest.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/579ca2f2-99bf-4189-6018-c68caee88300/lg1x" />

If you look at the column, you will see that over 7000 new objects have been added for the constructor **Object** and **(string)** also has close to 7000 objects. This confirms that there is a memory leak. Usually, when there is no memory leak, the column shows you negative values, 0, or smaller positive values.

To investigate the source of the memory leak, we will need to expand the **(string)** object. This is easier to do in the **Summary** panel. To switch to the panel, choose the **Summary** option, and then select the **Objects allocated between snapshot 1 and snapshot 2** option.
<br />
<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/4b8c1935-fb72-4a4f-1e51-20bb4eab6500/lg1x" />

Once you are in the **Summary** panel, double-click the **Shallow Size** panel to sort the column from highest to lowest.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1283db8f-ed53-4f86-d5f0-9baea51e3b00/lg1x" />

Let's briefly go over over the columns in this panel:

*   **Constructor**: Shows the type of Constructor used for the data in the heap.
*   **Distance**: The number of references between the root and the object.
*   **Shallow size**: The amount of heap memory allocated to store the object itself.
*   **Retained size**: The amount of memory allocated to the object, including the size of all the objects it references.

Following this, looking closely at the **(string)** and **Object** constructor rows:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/67202791-500f-4697-a244-742b56d44700/lg1x" />

You should now be able to see that both **(string)** and **Object** constructors show that they have over 7000 objects. In the **Shallow Size** and **Retained Size** columns, they are also taking a lot of memory in bytes more than the constructors below. This further confirms what we have seen from the **Statistics** and the **Comparison** panel. So we are on the right track.

If you recall the **Statistics** panel showed that **String** is taking more objects. So let's expand **(string)**:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/b4c1c0fc-84b1-4aef-360c-9ec99c156e00/lg1x" />

Next, scroll down until you see rows that look like the following:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/1dbaa484-fb4d-4cee-01a4-f7bb957bab00/lg1x" />

This matches with what we saw when we visited `http://localhost:3000/` earlier. So it is a good place to stop and investigate further.

Next, click on the first or any of the strings containing `loadtest/5.2.0`, which is the user agent of the `loadtest` library.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/44f67235-fbc1-4963-e2ac-0dc685887b00/lg1x" />

If you don't see the expanded objects, drag up the **Retainers** panel.

In the screenshot, there is a lot of important information Chrome is providing. For starters, `userAgentUsed` has shown up, which is the first hint of where the string is getting a reference. Second, `[282] in Array`, tells you that the element `userAgentUsed` resides in an array. Next, you'll see `headersArray in system`, which tells you the name of the array.

You can use this information to go back to the source code and investigate how the program is interacting with the array. For our program, we already know that the source is the `headersArray` global variable, but if we didn't know, this would have given us a hint. Of course, most memory leaks investigation won't be a bit straightforward as this. You would have to click on multiple objects or expand them.

### Fixing the memory leak

You have now found the source of the memory leak, and it is the `headersArray`. Every time a user visits the `/` endpoint, an object is pushed to the `headersArray` with no mechanism in place to clear the array.

To fix the memory leak, the following are some of options you can use:

*   Store the user agent objects in the file system instead of storing them in the `headersArray`. You can write the data to a JSON, CSV, or text file.
*   You can also store the data in a database system, which includes [SQlite](https://www.sqlite.org/index.html) , [MySQL](https://www.mysql.com/) , or [Postgres](https://www.postgresql.org/) .

Once you have made the changes, you can create two heap snapshots as you have done earlier in the article and load them in the Chrome Devtools.

When you switch to the **Comparison** panel, you will see that fewer objects have been added.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/2b976efc-bc4a-408b-0665-0a01195a6c00/lg1x" />

In the first comparison, you had the constructors **Object** and **(string)** at the top with close to 7000 objects. That is no longer the case, proving that the memory leak has been fixed.

That takes care of the memory leaks. Next, you will look at the tools you can use to detect memory leaks.

Monitoring Memory Usage In Node.js With Prometheus
--------------------------------------------------

Memory monitoring tools track the memory usage of your application and give you insights into how your application is using memory through reports/graphs. You can usually configure such tools to alert you when memory usage is too high. In this section, you will monitor memory usage with [Prometheus](https://prometheus.io/)  and configure it to alert you when a specified memory threshold is reached.

Before you can proceed, you must [download Prometheus](https://prometheus.io/)  and install it on your machine. You may [follow this tutorial](https://devopscube.com/install-configure-prometheus-linux/)  to download and install Prometheus on Linux, and to get it up and running.

After Prometheus is installed, ensure that it is running before proceeding:

```yaml
prometheus.exe --config.file=prometheus.yml
```


```yaml
prometheus.service - Prometheus
     Loaded: loaded (/etc/systemd/system/prometheus.service; enabled; vendor preset: enabled)
     Active: active (running) since Thu 2023-03-02 11:41:28 CAT; 36s ago
   Main PID: 19530 (prometheus)
      Tasks: 9 (limit: 9302)
     Memory: 22.3M
        CPU: 287ms
     CGroup: /system.slice/prometheus.service
             └─19530 /usr/local/bin/prometheus --config.file /etc/prometheus/prometheus.yml --storage.tsdb.path /var/lib/prometheus/ --web.co>
```


In the output, if you see `Active: active (running)`, then Prometheus is running.

Return to your terminal and install the [prom-client](https://www.npmjs.com/package/prom-client)  package in the application directory. It is a Prometheus client for Node.js applications.

We'll reuse the original example in the last section that has a memory leak:

```js
const http = require("http");
const express = require("express");
const v8Profiler = require("v8-profiler-next");
const fs = require("fs");
const client = require("prom-client");

const app = express();
const PORT = 3000;
const headersArray = [];

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "memory-leak-demo",
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a custom histogram metric
const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
});

// Register the custom metric
register.registerMetric(httpRequestDurationMicroseconds);

// Function to capture heap snapshot
const captureHeapSnapshot = (label) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const snapshot = v8Profiler.takeSnapshot(
    `heapSnapshot-${label}-${timestamp}`
  );
  snapshot
    .export()
    .pipe(
      fs.createWriteStream(`heapSnapshot-${label}-${timestamp}.heapsnapshot`)
    )
    .on("finish", () => {
      snapshot.delete();
      console.log(
        `Heap snapshot captured successfully: heapSnapshot-${label}-${timestamp}.heapsnapshot`
      );
    });
};

// Middleware to collect request metrics
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      code: res.statusCode,
    });
  });
  next();
});

// Route to collect headers
app.get("/", (req, res) => {
  headersArray.push({ userAgentUsed: req.get("User-Agent") });
  res.status(200).send(JSON.stringify(headersArray));
});

// Expose the metrics at /metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Start the server and capture snapshots
const startServerAndCaptureSnapshots = () => {
  const server = app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}/`);

    // Capture the first heap snapshot after 1 second
    setTimeout(() => captureHeapSnapshot("first"), 1000);

    // Capture the second heap snapshot after 10 seconds
    setTimeout(() => captureHeapSnapshot("second"), 10000);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log("Server is already running on port 3000.");
      captureHeapSnapshot("first");
      setTimeout(() => captureHeapSnapshot("second"), 10000);
    } else {
      console.error("Server error:", err);
    }
  });
};

// Check if the server is already running on port 3000
const serverStatusCheck = http.get(`http://localhost:${PORT}`, (res) => {
  // Server is already running, capture heap snapshots directly
  console.log("Server is already running on port 3000.");
  captureHeapSnapshot("first");
  setTimeout(() => captureHeapSnapshot("second"), 10000);
});

// Handle connection errors (e.g., server not running)
serverStatusCheck.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    // Server is not running, start the server
    startServerAndCaptureSnapshots();
  } else {
    console.error("Error checking server status:", err);
  }
});
```


The `prom-client` module is imported and used to instantiate the registry to collect metrics for Prometheus. Next, the `/metrics` endpoint is created to exposes all the metrics collected by Prometheus.

When you're finished, save the file and start the server again:

```yaml
node captureHeapSnapshot  
```

Return to Chrome and visit `http://localhost:3000/metrics`. You will see the following page:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/213493ed-0155-43bb-a551-296411d6cb00/lg1x" />

Now that the endpoint is working, you should keep the server running so that when we configure Prometheus, it should be able to scrap this endpoint.

Prometheus uses a configuration file to define the scraping targets, which are running instances. The `memoryleak_domo` app instance runs on port `3000`. For Prometheus to scrap it, you need to define it as the target.

Open the Prometheus configuration file and add the highlighted code to add an entry for the `memoryleak_demo` app:

/etc/prometheus/prometheus.yml

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'memoryleak_demo'

    scrape_interval: 5s

    static_configs:

      - targets: ['localhost:3000']
```


In the preceding configuration file, Prometheus will scrap two targets:

*   `prometheus`: A scrapping job of itself that is scrapped every 5 seconds as defined with the `scrape_interval` property.
*   `memoryleak_demo`: A scrapping job for the `memoryleak_demo` app you created earlier in the section. It will be scrapped every 5 seconds as well.

At this point, restart Prometheus to ensure that the new changes take effect:

```yaml
prometheus.exe --config.file=prometheus.yml
```


Next, visit `http://localhost:9090/targets` to view the targets that Prometheus is currently scrapping. You will see that Prometheus recognizes the `memoryleak_demo` job. It has detected the `http://localhost:3000/metrics` endpoint in the **Endpoint** field and that the instance is running(`UP`) in the **State** field.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/10097c48-b8a3-4e9f-ef2d-373f853db700/lg1x" />

Next, visit `http://localhost:9090/graph` to view the Prometheus console which allows you to enter queries. Enter the expression `nodejs_external_memory_bytes` to check the memory usage. Following that, press **Execute** and switch the **Graph** tab:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ba1627ad-8fdc-42bb-6e87-f397eada6700/lg1x" />

Prometheus plots a graph that shows the current application's memory usage, which is around 1MB.

In a second terminal, simulate the traffic to the app:

```yaml
npx loadtest -n 7000 -c 1 -k http://localhost:3000/
```


Return to the Prometheus graph page, and press **Execute** once again. You will observe that the memory usage has grown to over 5MB:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/88b671b1-4e04-437e-0b08-0b59e049ac00/lg1x" />

Send Alerts On High Memory Usage
--------------------------------

Now that you can observe your application's memory usage via the Prometheus interface, the next step is to configure it to alert you when the memory usage reaches a specific threshold.

You can use the [Prometheus Alertmanager](https://github.com/prometheus/alertmanager)  to send alerts to your preferred channel which could be Email, Slack, and any service that provides a webhook receiver.

In this tutorial, we will configure Alertmanager to use Gmail to send email notifications. First, you need to install the program on your machine. You can do this by [following this tutorial up until step 7](https://acloudguru.com/hands-on-labs/installing-prometheus-alertmanager) .

Once you've installed Alertmanager, make sure that it is running on your system:

```yaml
alertmanager.exe --config.file=alertmanager.yml
```

You will receive output that looks like this:

```yaml
alertmanager.service - Prometheus Alert Manager Service
     Loaded: loaded (/etc/systemd/system/alertmanager.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2023-02-28 21:12:22 CAT; 6s ago
   Main PID: 24277 (alertmanager)
      Tasks: 9 (limit: 9302)
     Memory: 13.2M
        CPU: 205ms
     CGroup: /system.slice/alertmanager.service
             └─24277 /usr/local/bin/alertmanager/alertmanager --config.file=/usr/local/bin/alertmanager/alertmanager.yml
```


The output confirms that the Alertmanager service is active. Visit `http://localhost:9093/` and you will see the following page, further confirming that it works:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/89646e39-f302-4260-b0e4-abeb502d3500/lg1x" />

At this stage, you should configure an app password for your Gmail account so that you can use it to send emails through Alertmanager. You can do this by heading to [Google My Account → Security](https://myaccount.google.com/security?hl=en) , and enabling 2-Step Verification.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/64e634c0-af78-4f62-0f63-df519ee2e700/lg1x" />

Afterward, find the [App passwords](https://myaccount.google.com/apppasswords)  section, and create a new app password. Choose the **Other (custom name)** option and type **Alertmanager** in the resulting text field. Once done, click the **GENERATE** button.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/ea9e9ff6-be53-4480-1ee6-08707d880300/lg1x" />

Copy the password presented in the popup dialog and paste it somewhere safe. You won't be able to see it again.

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/855efbe6-abdf-4240-d9fe-593b3fb4c800/lg1x" />

Now, return to your terminal and open the `alertmanager.yml` config file in your text editor

/etc/alertmanager/alertmanager.yml

```yml
global:
  resolve_timeout: 1m

route:
  group_by: ['alertname', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 3h
  receiver: 'gmail-notifications'

receivers:
- name: 'gmail-notifications'
  email_configs:
  - to: <example2@gmail.com>
    from: <example@gmail.com>
    smarthost: smtp.gmail.com:587
    auth_username: <example@gmail.com>
    auth_identity: <example@gmail.com>
    auth_password: <app_password>
    send_resolved: true
```


In the Alertmanager config, replace all `example@gmail.com` with the Gmail account that Alertmanager should use to send emails. Update the `to` property with the receiver's email address. In the`auth_password` property, replace `<app_password>` with the app password you generated with your Google account.

Next, add the following in the `alerts.yml` file to define the rules that should trigger the alert:

```yml
/prometheus/alerts.yml
```


/etc/prometheus/alerts.yml
```yml
groups:
- name: memory leak
  rules:
  - alert: High memory Usage
    expr: avg(nodejs_external_memory_bytes / 1024) > 2000
    for: 1m
    annotations:
      severity: critical
      description: memory usage high
```


In the preceding code, you configure Prometheus to send an alert when memory usage for the Node.js application is greater than 2000 KB (2 MB) for 1 minute. The expression `avg(nodejs_external_memory_bytes / 1024) > 2000` checks if memory usage is over 2 MB, and `for` is set to `1m` (1 minute).

Now that you have defined the rules, create a reference to the `alerts.yml` file and add an entry for the Alertmanager in the Prometheus config:

```yml
prometheus.exe --config.file=prometheus.yml
```


/etc/prometheus/prometheus.yml

```yml
global:
  scrape_interval: 15s


rule_files:

  - "/etc/prometheus/alerts.yml"


alerting:

  alertmanagers:

  - static_configs:

    - targets:

       - localhost:9093

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
  - job_name: 'memoryleak_demo'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:3000']
```


Restart Alertmanager to reflect the new changes:

```yml
alertmanager.exe --config.file=alertmanager.yml
```


Also, restart Prometheus:

```yml
prometheus.exe --config.file=prometheus.yml
```


Next, let's do a final load test to trigger the alert:

```yml
npx loadtest -n 7000 -c 1 -k http://localhost:3000/
```


Visit `http://localhost:9093/#/alerts`. It might take a while to see something like this:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/8c89211b-8321-4e2b-56a5-c150ebe9c000/lg1x" />

Next, visit `http://localhost:9090/alerts?search=`, which is the Prometheus alerts page. You should observe that an alert is firing:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/9c307f16-1805-47cb-f809-b42a61201b00/lg1x" />

After a few minutes, you should also receive an email that looks like this:

<img src="https://imagedelivery.net/xZXo0QFi-1_4Zimer-T0XQ/34791131-653f-41e0-6427-85cb80c7a700/lg1x" />

At this point, you have successfully monitored the application using Prometheus, and configured Alertmanager to send email notifications when memory usage is high.

Final Thoughts And Next Steps
-----------------------------

In this article, you have gained an understanding of how memory leaks can be introduced into a codebase, and explored techniques for both preventing and temporarily fixing such leaks. Furthermore, you have learned how to debug a memory leak by identifying its source and implementing a solution. Finally, you have discovered how to monitor an application using Prometheus, and how to configure it to send email alerts via Gmail.

To continue your journey of memory profiling with DevTools, you can visit the [Chrome documentation](https://developer.chrome.com/docs/devtools/memory-problems/)  for more information. Also, if you're interested in delving deeper into how JavaScript manages memory, the [Memory Management tutorial on the Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)  is a great resource. Lastly, to further enhance your knowledge of monitoring applications using Prometheus, you can [explore the Prometheus docs](https://prometheus.io/docs/introduction/overview/)  for a comprehensive overview.

### Conclusion

JavaScript's memory management involves automatic allocation and garbage collection. Understanding how it works helps in writing efficient and leak-free code. The provided code example highlights memory allocation, usage, and a common memory leak scenario.

For a deeper understanding, you can explore resources like the V8 JavaScript engine's documentation or articles on modern JavaScript garbage collection techniques.

Thanks for reading!

#

### Refernces 

[Preventing and Debugging Memory Leaks in Node.js](https://betterstack.com/community/guides/scaling-nodejs/high-performance-nodejs/nodejs-memory-leaks/)