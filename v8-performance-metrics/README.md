# How JavaScript Engine Works Under The Hood

<img src="https://images.ponyfoo.com/uploads/addy-ad3b2ea8f9be48a18c4bdad5041a3237.png" />

Every browser has a JavaScript engine. The most popular engine is Google’s V8 engine. This engine is the engine of Google Chrome and also of Node.js. Of course, all other browsers have their own JavaScript engines. The JavaScript engine executes and compiles JavaScript into native machine code. Every major browser has developed its own JS engine: Google's Chrome uses V8, Safari uses JavaScriptCore, and Firefox  uses  SpiderMonkey. A JavaScript engine will always consist of a Call Stack and a Memory Heap and will run on one thread but the JavaScript engine itself runs in several threads (processes) that do different things: compressor for example, garbage collection, etc.


V8 overview
-----------

We’ll go over it step by step:

1.  It all starts with getting JavaScript code from the network.
2.  V8 parses the source code and turns it into an Abstract Syntax Tree (AST).
3.  Based on that AST, the Ignition interpreter can start to do its thing and produce bytecode.
4.  At that point, the engine starts running the code and collecting type feedback.
5.  To make it run faster, the byte code can be sent to the optimizing compiler along with feedback data. The optimizing compiler makes certain assumptions based on it and then produces highly-optimized machine code.
6.  If, at some point, one of the assumptions turns out to be incorrect, the optimizing compiler de-optimizes and goes back to the interpreter.

V8 JavaScript Engine
----------------------
    
* **Components**:
    * Parser: Converts JavaScript code into an Abstract Syntax Tree (AST).
    * Interpreter (Ignition): Converts AST into bytecode.
    * Compiler (Turbofan): Translates bytecode into machine code.
    * Optimizing Compiler: Generates optimized machine code using profiling data.
* **Parsing Process**:
    * JavaScript is tokenized and parsed into an AST.
    * AST Explorer is a useful tool for visualizing ASTs.
    * Scopes are created to determine variable accessibility.
* **V8's Dual Parsing Strategy**:
    * Full Parser: Generates AST and scopes, used for frequently executed code.
    * Pre-Parser: A faster, lightweight parser that skips over infrequently used code during initial load.
    * Example scenarios demonstrate how V8's heuristics decide whether to fully parse or pre-parse functions.


V8 Compilation Process
----------------------

When V8 compiles JavaScript code, the parser generates an abstract syntax tree. A syntax tree is a tree representation of the syntactic structure of the JavaScript code. Ignition, the interpreter, generates bytecode from this syntax tree. TurboFan, the optimizing compiler, eventually takes the bytecode and generates optimized machine code from it.

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*ZIH_wjqDfZn6NRKsDi9mvA.png" />

As we can see from the above image, the JavaScript source code is fed to the parser. The parser generates an AST. Ignition generates bytecode, and TurboFan produces optimized machine code. Don’t worry about the red and green arrows as of now. They will make sense once we get to the working of Ignition and TurboFan.

How Are JavaScript Engines Different from the Engines of Other Programming Languages?
-------------------------------------------------------------------------------------

The process of converting source code to machine code in high-level languages like C++ and Java involves two steps:

1. The compiler first converts the source code into intermediate code.
2. The interpreter then translates this intermediate code into machine code.

For example, in Java, the `javac filename.java` command compiles source code into bytecode, which is stored in a `.class` file. This bytecode can be executed on any machine with a Java Virtual Machine (JVM) using the `java filename.class` command. This initial compilation step allows the server to execute the bytecode quickly.

In contrast, JavaScript engines do not use this two-step process. Instead of compiling the entire source code at once, JavaScript engines interpret and execute the code line by line directly in browsers or runtime environments like Node.js. This means JavaScript runs the source code directly, whereas other high-level languages execute optimized bytecode generated during compilation. Consequently, this line-by-line interpretation might make JavaScript execution slower compared to languages that utilize a compilation step.

<br />

#### Evolution of JavaScript Engines
The first JavaScript engine was a mere interpreter. An interpreter is a software program that executes the source code line by line. Let’s consider a JavaScript snippet below to understand how former engines used to operate.

```js
function arrSum (arr) {
    var sum = 0
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i]
    }
}
```

It has a simple arrSum function that adds the elements of an array arr. Inside for loop, there is only one statement that does the work of adding array elements to the variable sum.

Consider this from the point of the interpreter —

It is possible in JavaScript that an array can have numbers as well as strings at the same time. arr might have a mix of different data-types. On every iteration of the for loop, the interpreter checks the type of element in the array and accordingly performs the add/concatenation operation. + behaves as an addition operator for numbers and as concatenation operator for strings. This type checking and computation on every iteration makes it slow. In earlier days, JavaScript was not considered as a language of choice because it was very slow compared to other high-level languages. However, JavaScript performs better now and is a much-loved language among professional developers.

Chrome developed the first modern JavaScript engine, V8, in 2008. Its performance was much better than any prior engine. Chrome used just-in-time compilation(JIT) in the V8 engine to boost its performance. Most of the browsers/JavaScript run-time systems now use the same technique to power up the execution speed of JavaScript code.

<br />

#### What is Just-in-Time Compilation (JIT)?

JIT combines the benefits of both compilers and interpreters. It interprets source code line by line, producing bytecode, which is then compiled during execution using profiling information for optimizations. This process, involving a profiler that identifies frequently run (hot) code, allows browsers to optimize and speed up JavaScript execution. When hot code is encountered again, the profiler uses its existing optimized version, enhancing performance.

<img src="https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fm5vi29rcugnn0wamq37q.jpg" />




#### Demystifying the JIT Compiler

JavaScript, once a subject of mockery in terms of performance, now powers every dynamic web application and interactive experience with lightning-fast speed. This transformation wouldn’t be possible without its secret weapon: the Just-in-Time (JIT) compiler. But what exactly is a JIT compiler, and how does it make JavaScript sing?

#### Understanding the Stage: Interpreters vs. Compilers


In order to fully understand the JIT’s magic, we must understand the two fundamental approaches used for executing our code. One of the most debated question in the JavaScript world: Is Javascript an interpreted language or a compiled language? Let’s not confuse ourselves and keep it to the point, clear with an in-depth explanation.

As we all know from the very beginning, computers don't understand programming languages like C, C++, Python, Java, JavaScript, etc. We call them high-level programming languages. So our ultimate goal is to convert our source code from high-level languages to computer-understandable code called Machine Code. Compilers and interpreters help us do that.


<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*BViMwYeL7Ku9Yf9oSE6-Iw.png" />

Interpreters - An interpreter reads high-level source code line by line and translates it into an intermediate form called bytecode. This bytecode is closer to the language that the computer understands, but it isn’t machine code yet. The interpreter executes this bytecode line by line, converting it into machine code on-the-fly for the CPU to execute directly. This process enables the computer to understand and execute the instructions from the original source code.

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*PjXWsr26_4s2tOZB59OjzA.png" />

Compilers - A compiler takes an entire source code file. It will scan it completely, then convert the entire source code into machine code, and voila, our code is ready for execution. Once compiled, the machine code allows the computer to swiftly execute the program without needing to re-translate the source code each time it runs.


<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*yY-7H6zinbV7hfhRvqfnmQ.png" />

#### Interpreters vs Compilers

* Interpreters start fast when executing code, while compilers take longer initially due to the upfront compilation step. However, compilers ultimately run faster.

* An error on a specific line will not be discovered by an interpreter until all lines above it have been executed. In contrast, a compiler catches errors on individual lines during the parsing phase before any execution begins.

* Looping can be slow with interpreters compared to compilers because they don’t inherently optimize code. In contrast, compilers can recognize repeated code within loops and optimize it for faster execution.



####  Just-in-time compilers: the best of both worlds
Initially, when JavaScript was created, it was an interpreted language. some engineers came up with the idea of combining both of them and creating something called a JIT (Just in Time Compilation).

<img src="https://miro.medium.com/v2/resize:fit:640/format:webp/1*G1XPQ4ckzQWsjzOG_7j3Bw.jpeg" />

#### Understanding JIT Compiler
The interpreter will take out the source code and start interpreting the code line by line. There is something called a profiler.

The profiler's main job is: When a program runs, the interpreter goes through the code line by line. Meanwhile, there’s this thing called a profiler that’s always watching how the code performs. Its main job is to pay close attention to how the code runs. When it notices that the code does the same things over and over, it sees a chance to make things faster or more efficient. So, it steps in, finds unoptimized code, and passes it to the compiler to perform optimizations and generate machine code, which eventually replaces its counterpart in the previously generated non-optimized code by the interpreter. As the profiler and compiler constantly make changes to the bytecode, the JavaScript execution performance gradually improves.

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*5NeaTrjHnLMh3TjGRUcgfw.png" />

So the answer to the main question, “Is JavaScript interpreted or compiled?is that, basically, JavaScript can act as both an interpreted and compiled language. It completely depends on the JS engine that you have been using. Well, most modern browsers or JS engines use JIT compilation.

To conclude, JavaScript is primarily an interpreted language, executed by an interpreter within a runtime environment. However, modern JavaScript engines use a blend of interpretation and compilation techniques. They interpret code initially and then compile parts of it into machine code or bytecode, often employing Just-In-Time (JIT) compilation for improved runtime performance.



How V8 JavaScript engine works step by step 
---------------------------------------------

From a high-level view, the V8 JavaScript engine execution consists of 5 steps.

1.  Initialize environment in the host
2.  Compile JavaScript codes
3.  Generate bytecodes
4.  Interpret and execute bytecodes
5.  Optimize some bytecodes for better performance

### 1\. Initialize environment
-------------------------------

Technically, this is not part of V8’s job. It is the renderer process of the browser initializes the following two items:

*   Host environment
*   V8 engine
   
<img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*eArKNJ9wgauayHdKT0GtLQ.png" />

A browser has multiple renderer processes. Usually, each browser tab has a renderer process and initializes a V8 instance.

What is the host environment? In our context, it is the browser. Therefore, we will use the “browser” and the “host environment” interchangeably in this documentation. However, keep in mind that a browser is merely one of the host environments for JavaScript. Another one is the Node host environment.

#### 1\.1\. What is in the host environment?

<img src="https://miro.medium.com/v2/resize:fit:1100/format:webp/1*ChmCdqlo8eLiVuHmzHlFiw.jpeg" />

The host environment provides everything a JavaScript engine relies on, including:

1.  Call stack
2.  Heap
3.  Callback queue
4.  Event loop
5.  Web API and Web DOM

User interactions on a web page trigger a series of events. The browser added them to the callback queue along with associated callback functions. The event loop working like an infinite while-loop keeps fetching a callback from the queue. Then the JavaScript in the callback is compiled and executed. Some intermediate data is stored in the call stack. Some are saved in the heap, such as an array or an object.

Why does the browser store data in two different places?

*   **Trading space for speed:** A call stack requires continuous space in memory, making it fast to process. However, continuous space is rare in memory. To resolve the issue, browser designers restrain it with max size. This is where the stack-overflow error comes from. Usually, the browser saves data with limited size in the call stack, such as an integer and other primary data types.
*   **Trading speed for space:** Heap doesn’t require continuous space to save extensive data like an object. The tradeoff is that the heap is relatively slow to process the data.


#### 1\.2\. JS Engine (V8) relies on and empowers the host environment
----------------------------------------------------------------------

The host environment to V8 is like your computer’s operating system to software. Softwares rely on the operating system to run. Meanwhile, they empower your system to do so many advanced tasks.

Take Photoshop, for example. It needs to be run on Windows or macOS. Meanwhile, your operating system cannot make a beautiful poster for you, but Photoshop can.

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*xnlLrXpxHlNmI2a_nSSelg.jpeg" />

Same as the V8 engine, it provides additional features on top of the host environment:

*   JavaScript core features based on the ECMAScript standard, such as the creation of Object and Function
*   Garbage collection mechanism
*   Coroutine features
*   And more…

When the host environment and V8 engine are ready, the V8 engine starts its next step.

### 2\. Compile JavaScript codes


<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*-oSl-3h7qQQWfnRN2gYJ5A.jpeg" />

At this step, the V8 engine converts the JavaScript codes to Abstract Syntax Tree (AST) and generates scopes. AST is a tree structure, easy for V8 to digest. The V8 engine doesn’t speak JavaScript language. The script needs to be structured in AST before processing.

How an AST looks like?

Let’s check a simple example by showing the following JavaScript in an AST format.

```js
function helloWorld() {
  console.log("Hello World!")
}
```
Lexical analysis breaks it into the following tokens:
```js
[
  { type: 'keyword', value: 'function' },
  { type: 'identifier', value: 'helloWorld' },
  { type: 'punctuation', value: '(' },
  { type: 'punctuation', value: ')' },
  { type: 'punctuation', value: '{' },
  { type: 'identifier', value: 'console' },
  { type: 'punctuation', value: '.' },
  { type: 'identifier', value: 'log' },
  { type: 'punctuation', value: '(' },
  { type: 'string', value: 'Hello World!' },
  { type: 'punctuation', value: ')' },
  { type: 'punctuation', value: '}' }
]
```

Each line of your JavaScript codes will be converted into AST, like the example at this step. This AST structure helps in understanding how the JavaScript code is parsed and interpreted by the engine. Each node represents a specific syntactic construct, and the tree structure captures the hierarchical relationships between these constructs.


### 3\. Generate bytecodes

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*YSGSKcguWIw3DRuRMfLciA.jpeg" />

At this step, the V8 engine takes the AST and scopes and outputs bytecodes.



#### Understanding V8’s Bytecode
--------------------------------

How Ignition Generates Bytecode - Bytecodes are considered small building blocks that can be composed together to build a JavaScript functionality. They abstract the low-level details of machine code. V8 has several hundred bytecodes. There are bytecodes for operators like `Add` or `TypeOf`, or for property loads like `LdaNamedProperty`. V8 also has some pretty specific bytecodes like `CreateObjectLiteral` or `SuspendGenerator`. The header file [bytecodes.h](https://github.com/v8/v8/blob/master/src/interpreter/bytecodes.h) defines the complete list of V8’s bytecodes.

Ignition uses a register machine to hold the local state of the registers. It has a special register called an accumulator that store the previously computed value.


**Bytecode is an abstraction of machine code**. Compiling bytecode to machine code is easier if the bytecode was designed with the same computational model as the physical CPU. This is why interpreters are often register or stack machines. **Ignition is a register machine with an accumulator register.**

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*aal_1sevnb-4UaX8AvUQCg.png" />


Each bytecode specifies its inputs and outputs as register operands. Ignition uses registers `r0, r1, r2, ...` and an accumulator register. Almost all bytecodes use the accumulator register. It is like a regular register, except that the bytecodes don’t specify it. For example, `Add r1` adds the value in register `r1` to the value in the accumulator. This keeps bytecodes shorter and saves memory.

Many of the bytecodes begin with `Lda` or `Sta`. The `**a**` in `Ld**a**` and `St**a**` stands for **a**ccumulator. For example, `LdaSmi [42]` loads the Small Integer (Smi) `42` into the accumulator register. `Star r0` stores the value currently in the accumulator in register `r0`.

So far the basics, time to look at the bytecode for an actual function.

```js
function incrementX(obj) {
  return 1 + obj.x;
}incrementX({x: 42});  // V8’s compiler is lazy, if you don’t run a function, it won’t interpret it.
```


> If you want to see **V8's bytecode of JavaScript code**, Node.js with the flag `--print-bytecode`. For Chrome, start Chrome from the command line with `--js-flags="--print-bytecode"`, see [Run Chromium with flags](https://www.chromium.org/developers/how-tos/run-chromium-with-flags).

```
$ node --print-bytecode incrementX.js
...
[generating bytecode for function: incrementX]
Parameter count 2
Frame size 8
  12 E> 0x2ddf8802cf6e @    StackCheck
  19 S> 0x2ddf8802cf6f @    LdaSmi [1]
        0x2ddf8802cf71 @    Star r0
  34 E> 0x2ddf8802cf73 @    LdaNamedProperty a0, [0], [4]
  28 E> 0x2ddf8802cf77 @    Add r0, [6]
  36 S> 0x2ddf8802cf7a @    Return
Constant pool (size = 1)
0x2ddf8802cf21: [FixedArray] in OldSpace
 - map = 0x2ddfb2d02309 <Map(HOLEY_ELEMENTS)>
 - length: 1
           0: 0x2ddf8db91611 <String[1]: x>
Handler Table (size = 16)
```


We can ignore most of the output and focus on the actual bytecodes. Here is what each bytecode means, line by line.

#### LdaSmi \[1\]
------------

`LdaSmi [1]` loads the constant value `1` in the accumulator.

<img src="https://miro.medium.com/v2/resize:fit:622/format:webp/1*WIECS2Gd701BnheqXrWbag.png" />

#### Star r0
-------

Next, `Star r0` stores the value that is currently in the accumulator, `1,` in the register `r0`.

<img src="https://miro.medium.com/v2/resize:fit:622/format:webp/1*271aYN7VC6ltaleyDfwhXg.png" />

#### LdaNamedProperty a0, [0], [4]
-------------------------------

`LdaNamedProperty` loads a named property of `a0` into the accumulator. `ai` refers to the i-th argument of `incrementX()`. In this example, we look up a named property on `a0`, the first argument of `incrementX()`. The name is determined by the constant `0`. `LdaNamedProperty` uses `0` to look up the name in a separate table:

```
- length: 1
           0: 0x2ddf8db91611 <String[1]: x>
```


Here, `0` maps to `x`. So this bytecode loads `obj.x`.

What is the operand with value `4` used for? It is an index of the so-called _feedback vector_ of the function `incrementX()`. The feedback vector contains runtime information that is used for performance optimizations.

Now the registers look like this:


<img src="https://miro.medium.com/v2/resize:fit:622/format:webp/1*sGFN376VKgf2hWXctBqZnw.png" />

#### Add r0, \[6\]
-------------

The last instruction adds `r0` to the accumulator, resulting in`43`. `6` is another index of the feedback vector.

<img src="https://miro.medium.com/v2/resize:fit:622/format:webp/1*LAHuYIvZaXX8jH_STNHfmQ.png" />

#### Return
------

`Return` returns the value in the accumulator. That is the end of the function `incrementX()`. The caller of `incrementX()` starts off with `43` in the accumulator and can further work with this value.

At a first glance, V8’s bytecode might look rather cryptic, especially with all the extra information printed. But once you know that Ignition is a register machine with an accumulator register, you can figure out what most bytecodes do.

<br />

### 4\. Interpret and execute bytecodes

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*XUkZoMOM0ecu1NvAHgCcnQ.jpeg" />

The bytecodes are a collection of instructions. At this step, the interpreter will execute each line of bytecodes from top to bottom.

In the previous example, we see the following 4 bytecodes. Each line of the bytecodes is like a block of Lego. No matter how fancy your codes are, all are built with these basic blocks behind the scene.

```
LdaConstant [0]
StaCurrentContextSlot [2]
LdaUndefined
Return
```

<br />


### 5\. Compile and execute machine codes

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*rndPFwukD29TpahnvLTeaQ.jpeg" />

This step is parallel to the previous one. When executing the bytecodes, V8 keeps monitoring the codes and looking for opportunities to optimize them. When some frequently used bytecodes are detected, V8 marks them as “hot.” Hot codes are then converted to efficient machine codes and consumed by the CPU.

What if the optimization fails? The compiler de-optimizes codes and let the interpreter executes the original bytecodes.

#### 5\.1\. Bytecodes vs. machine codes

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*qIP45GiWbjbKu2vh_ZMYtg.jpeg" />

But why not V8 uses faster machine codes directly? Wouldn’t introduce intermediate bytecodes slow down the entire process? Theoretically, yes. But that’s not the whole story.

Interestingly, that’s precisely how the V8 team initially designed the JavaScript engine. At the early age of V8, the steps are the following:

1.  V8 compiles scripts to AST and scopes.
2.  A compiler compiles the AST and scopes to machine codes.
3.  V8 detects some frequently used machine codes and marks them as “hot.”
4.  Another compiler optimizes the “hot” codes to optimized machine codes.
5.  If the optimization fails, the compiler runs the de-optimization process.

Though today’s V8 structure is more complicated, the basic idea remains the same. However, the V8 team introduces bytecodes when the engine evolves. Why? Because using machine codes along brings some troubles.

#### 5\.2\. Machine codes requires a great amount of memory


<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*djPKGbeSoeFJxz9F9uAy-g.jpeg" />

The V8 engine stored compiled machine codes in the memory to reuse them when the page loads. When compiled to machine codes, a 10K JavaScript could inflate into 20M machine codes. That’s about 2,000 times larger memory space.

How about the size of the bytecodes in the same case? It is about 80K. Bytecodes are still more massive than the original JavaScript one, but it is way smaller than its corresponding machine codes. Today, it is common to see JavaScript files over 1M. A 2G memory consumption for machine codes is not a good idea.

Thanks to the size reduction, a browser can cache all compiled bytecodes, skip all previous steps, and execute them directly.

#### 5\.3\. Machine codes are not always faster than bytecodes


<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*1Yb0kmgKp4iCyUgHr1oVGg.jpeg" />

Machine codes take a longer time to compile, although it is lighting-fast in terms of execution. Bytecodes need a shorter time to compile, but the tradeoff is a slower execution step. An interpreter needs to interpret bytecodes before executing them.

When we measure both options from end to end, which one is faster?

It depends. The art is finding a balance between these two options while developing a powerful interpreter and a smart optimizing compiler for the bytecodes. Ignition, the interpreter V8 using, is the fastest one on the market.

The optimizing compiler in V8 is the famous TurboFan, compiling highly-optimized machine codes from bytecodes.

#### 5\.4\. Machine codes increases complexity in development

Different CPUs could have various structures. Each can only understand a kind of machine code. There are a lot of processor structure designs on the market. To name a few:

*   ARM
*   ARM64
*   X64
*   S397
*   And more…

If the browser only uses machine codes, it needs to take care of so many cases separately. As a developer, we know that’s not a good practice intuitively.

We need an abstract. Bytecodes are the abstract between JavaScript and CPUs. By introducing the intermediate bytecodes, the V8 team reduces the workload to compile the machine codes. Meanwhile, it helps V8 to migrate to new platforms easily.

Takeaways
---------

Putting everything together, now we can see a completed version of how Chrome V8 works from a high-level view.

<img src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*Y7rgI18w2v0Sf0C6COJncA.jpeg" />


<br />
<br />


Demo For The Steps In JavaScript Engine
--------------------------------------------

The HTML parser encounters a script tag with a source. Code from this source gets loaded from either the network, cache, or an installed service worker. The response is the requested script as a stream of bytes, which the byte stream decoder takes care of! The byte stream decoder decodes the stream of bytes as it’s being downloaded.

<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--w8scUWXd--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_800/https://thepracticaldev.s3.amazonaws.com/i/pv4y4w0doztvmp8ei0ki.gif"/>

The byte stream decoder creates tokens from the decoded stream of bytes. For example, 0066 decodes to f, 0075 to u, 006e to n, 0063 to c, 0074 to t, 0069 to i, 006f to o, and 006e to n followed by a white space. Seems like you wrote function! This is a reserved keyword in JavaScript, a token gets created, and sent to the parser (and pre-parser, which I didn't cover in the gifs but will explain later). The same happens for the rest of the byte stream.

<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--hve6eM1Y--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_800/https://thepracticaldev.s3.amazonaws.com/i/bic727jhzu0i8uep8v0k.gif" />

The engine uses two parsers: the pre-parser, and the parser. In order to reduce the time it takes to load up a website, the engine tries to avoid parsing code that's not necessary right away. The preparser handles code that may be used later on, while the parser handles the code that’s needed immediately! If a certain function will only get invoked after a user clicks a button, it's not necessary that this code is compiled immediately just to load up a website. If the user eventually ends up clicking the button and requiring that piece of code, it gets sent to the parser.

The parser creates nodes based on the tokens it receives from the byte stream decoder. With these nodes, it creates an Abstract Syntax Tree, or AST. 

<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--Hw6ffhuc--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_800/https://thepracticaldev.s3.amazonaws.com/i/sgr7ih6t7zm2ek28rtg6.gif" />

Next, it's time for the interpreter! The interpreter which walks through the AST, and generates byte code based on the information that the AST contains. Once the byte code has been generated fully, the AST is deleted, clearing up memory space. Finally, we have something that a machine can work with! 

<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--0XVq4QSI--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_800/https://thepracticaldev.s3.amazonaws.com/i/i5f0vmcjnkhireehicyn.gif" />

Although byte code is fast, it can be faster. As this bytecode runs, information is being generated. It can detect whether certain behavior happens often, and the types of the data that’s been used. Maybe you've been invoking a function dozens of times: it's time to optimize this so it'll run even faster!

The byte code, together with the generated type feedback, is sent to an optimizing compiler. The optimizing compiler takes the byte code and type feedback, and generates highly optimized machine code from these. 

<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--qXNUvgYZ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_800/https://thepracticaldev.s3.amazonaws.com/i/ongt4qftovd82sp2vihk.gif" />


<br />
<br />
<br />


Benchmarking and Analyzing JavaScript Engine Performance Metrics
-----------------------------------------------

Understanding the performance metrics of JavaScript engines is crucial for developers seeking to optimize their code. JavaScript engines, such as V8 in Chrome and Node.js, execute JavaScript code efficiently by employing various optimization techniques. These engines track key metrics like bytecode generation time, execution time, heap memory usage, garbage collection efficiency, and the impact of Just-In-Time (JIT) compilation. By analyzing these metrics, developers gain insights into how their code interacts with the engine, allowing them to identify performance bottlenecks and optimize their applications for better speed and efficiency. Additionally, visualization tools like charts help developers visualize these metrics, making it easier to understand and improve the performance of their JavaScript applications. You can find the code for the JS Engine visualization in same folder of README.

This section outlines the process of benchmarking and analyzing the performance of a JavaScript engine using various metrics. The goal is to measure and visualize key performance indicators such as execution time, bytecode generation time, heap memory usage, garbage collection time, optimized and deoptimized functions.

#### Benchmarking Script

The benchmarking script (`benchmark.js`) performs the following steps:

1. **Execution Time Measurement**:
    
    * The script runs each JavaScript file and measures the total execution time using high-resolution timers provided by Node.js (`process.hrtime.bigint`).
2. **Bytecode Generation Time Measurement**:
    
    * It reads the JavaScript code from the file and generates bytecode using the `new Function` constructor. The time taken for this process is recorded.
3. **Heap Statistics**:
    
    * V8 heap statistics are retrieved using the `v8.getHeapStatistics()` function, providing data on used and total heap memory.
4. **Mock Data Generation**:
    
    * For optimized and deoptimized function counts, as well as garbage collection time, mock data is generated to simulate realistic scenarios.
5. **Results Compilation**:
    
    * The collected metrics are compiled into an array of objects, each representing the performance data for a JavaScript file.
6. **CSV Export**:
    
    * The results are converted to CSV format using the `json2csv` library and saved to a file (`data/performance_metrics.csv`).

#### Visualization

The HTML file (`index.html`) uses Chart.js to visualize the benchmark data. It includes the following charts:

1. **Execution and Bytecode Time**:
    
    * Line chart displaying execution time and bytecode generation time for each JavaScript file.
2. **Heap Memory Usage**:
    
    * Bar chart showing the used and total heap memory for each file.
3. **Garbage Collection Time**:
    
    * Bar chart illustrating the garbage collection time for each file.
4. **Optimized vs. Deoptimized Functions**:
    
    * Bar chart comparing the number of optimized and deoptimized functions for each file.

The visualization code fetches data from the CSV file, parses it, and creates the charts using Chart.js. This provides a comprehensive view of the JavaScript engine's performance metrics, helping in identifying bottlenecks and understanding the efficiency of the engine's execution and optimization processes.

<img src="https://github.com/Shaban-Eissa/Javascript-Internals/assets/49924090/1451b4d3-0c68-4a72-b264-97132b15fb0f" />

<img src="https://github.com/Shaban-Eissa/Javascript-Internals/assets/49924090/c3ebec26-fdaa-407e-bfa5-16b0f6517399" />

<img src="https://github.com/Shaban-Eissa/Javascript-Internals/assets/49924090/26254a7b-b7ce-4dcc-ad7b-58bedf75ad51" />

<img src="https://github.com/Shaban-Eissa/Javascript-Internals/assets/49924090/8714841e-84af-42ad-b8f1-bfe14877e76d" />


Summary
-------

In this article, we discussed JS engine implementation and the exact steps of how JavaScript is executed. To summarize, let’s have a look at the compilation pipeline from the top.

![v8-overview-2](https://www.freecodecamp.org/news/content/images/2020/08/v8-overview-2.png)


Notes 
-----
* JS runs literally everywhere from smart watch to robots to browsers because of Javascript Runtime Environment (JRE).

* JRE is like a big container which has everything which are required to run Javascript code.

* JRE consists of a JS Engine set of APIs to connect with outside environment, event loop, Callback queue, Microtask queue etc.

* Browser can execute javascript code because it has the Javascript Runtime Environment.

* ECMAScript is a governing body of JS. It has set of rules which are followed by all JS engines like Chakra(Edge), Spidermonkey(Firefox)(first javascript engine created by JS creator himself), v8(Chrome)

* Javascript Engine is not a machine. Its software written in low level languages (eg. C++) that takes in high level code in JS and spits out low level machine code.



References
----------

[🚀⚙️ JavaScript Visualized: the JavaScript Engine](https://dev.to/lydiahallie/javascript-visualized-the-javascript-engine-4cdf)

[How JavaScript Works: Under the Hood of the V8 Engine](https://www.freecodecamp.org/news/javascript-under-the-hood-v8/)

[Understanding V8’s Bytecode](https://medium.com/dailyjs/understanding-v8s-bytecode-317d46c94775)

[How V8 JavaScript engine works step by step](https://cabulous.medium.com/how-v8-javascript-engine-works-5393832d80a7)
