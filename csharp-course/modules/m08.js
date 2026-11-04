(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m08",
  number: 8,
  title: "Errors & Robust Code",
  tagline: "Expect things to go wrong, handle it cleanly, and find bugs fast.",
  level: "Intermediate",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m08-l01",
      title: "Exceptions and try/catch",
      minutes: 20,
      objectives: [
        "Explain what happens when an exception is thrown",
        "Catch specific exception types in the right order",
        "Filter catches with when",
        "Choose between exceptions and TryParse-style checks"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Some problems cannot be caught by the compiler. The user types "abc" where you expected a number. A file was deleted. A server is down. When .NET hits a problem like this at runtime, it creates an <strong>exception</strong>: an object that describes what went wrong, and <strong>throws</strong> it.</p>
<p>A thrown exception stops normal execution immediately. The runtime walks back up the call stack, method by method, looking for code that says "I can handle this". If it finds none, the program crashes and prints the exception.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int[] scores = new int[3];
Console.WriteLine(scores[5]);   // there is no index 5
Console.WriteLine("This line never runs.");`
        },
        {
          type: "text",
          html: `<p>Running that prints something like this and exits with an error code:</p>
<p><code>Unhandled exception. System.IndexOutOfRangeException: Index was outside the bounds of the array.</code><br><code>&nbsp;&nbsp;&nbsp;at Program.&lt;Main&gt;$(String[] args) in /app/Program.cs:line 2</code></p>
<p>Read it left to right: the exception <strong>type</strong> (<code>IndexOutOfRangeException</code>), the <strong>message</strong>, then the <strong>stack trace</strong> showing where it happened. Lesson 5 covers stack traces in depth.</p>`
        },
        {
          type: "text",
          html: `<p>To handle an exception, put the risky code in a <code>try</code> block and add one or more <code>catch</code> blocks. Each <code>catch</code> names the exception type it handles. When something in the <code>try</code> throws, the rest of the <code>try</code> is skipped, the first matching <code>catch</code> runs, and the program continues after the whole <code>try</code>/<code>catch</code>.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`string[] inputs = ["42", "abc", "99999999999"];

foreach (string input in inputs)
{
    try
    {
        int n = int.Parse(input);
        Console.WriteLine($"Parsed {n}");
    }
    catch (FormatException)
    {
        Console.WriteLine($"'{input}' is not a number.");
    }
    catch (OverflowException)
    {
        Console.WriteLine($"'{input}' is too big for an int.");
    }
}
Console.WriteLine("Done.");`,
          output: `Parsed 42
'abc' is not a number.
'99999999999' is too big for an int.
Done.`
        },
        {
          type: "text",
          html: `<p>Exceptions are classes in a hierarchy, all deriving from <code>System.Exception</code>. A <code>catch (ArgumentException)</code> also catches <code>ArgumentNullException</code> and <code>ArgumentOutOfRangeException</code>, because they derive from it. That is why catch order matters: put the <strong>most specific</strong> types first. A general catch above a specific one makes the specific one unreachable, and the compiler refuses:</p>
<p><code>error CS0160: A previous catch clause already catches all exceptions of this or of a super type ('Exception')</code></p>`
        },
        {
          type: "table",
          headers: ["Exception", "Typical cause"],
          rows: [
            ["<code>NullReferenceException</code>", "calling a member on a variable that holds <code>null</code>"],
            ["<code>IndexOutOfRangeException</code>", "array index below 0 or at/after <code>Length</code>"],
            ["<code>ArgumentOutOfRangeException</code>", "a bad index or value passed to a method, e.g. <code>list[10]</code> on a short list"],
            ["<code>ArgumentNullException</code>", "passing <code>null</code> where a method requires a value"],
            ["<code>FormatException</code>", "<code>int.Parse(\"abc\")</code>, bad format strings"],
            ["<code>InvalidOperationException</code>", "the object is in the wrong state, e.g. changing a list during <code>foreach</code>"],
            ["<code>KeyNotFoundException</code>", "<code>dict[key]</code> with a missing key"],
            ["<code>DivideByZeroException</code>", "integer division by zero"],
            ["<code>FileNotFoundException</code> / <code>IOException</code>", "missing files, locked files, disk errors"]
          ]
        },
        {
          type: "text",
          html: `<p>Add a variable to the <code>catch</code> to inspect the exception object. <code>Message</code> is the human-readable text. The exception also travels <em>through</em> methods: below, <code>Average</code> has no <code>try</code>, so the exception leaves it immediately and lands in the caller's <code>catch</code>.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`try
{
    Console.WriteLine(Average([]));
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Caught {ex.GetType().Name}");
    Console.WriteLine(ex.Message);
}

static int Average(int[] values)
{
    int total = 0;
    foreach (int v in values) total += v;
    return total / values.Length;   // 0 / 0 with ints throws
}`,
          output: `Caught DivideByZeroException
Attempted to divide by zero.`
        },
        {
          type: "text",
          html: `<p>An <strong>exception filter</strong> adds a condition with <code>when</code>. The catch only runs if the type matches <em>and</em> the condition is true. Otherwise the runtime keeps looking at the next catch. This is cleaner than catching, checking with <code>if</code>, and rethrowing.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`using System.Net;

foreach (int status in new[] { 404, 503 })
{
    try
    {
        FakeDownload(status);
    }
    catch (HttpRequestException ex) when ((int?)ex.StatusCode >= 500)
    {
        Console.WriteLine($"{status}: server busy, will retry");
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"{status}: giving up ({ex.Message})");
    }
}

static void FakeDownload(int status)
{
    // Stands in for a real web request that failed.
    throw new HttpRequestException(
        "Download failed", null, (HttpStatusCode)status);
}`,
          output: `404: giving up (Download failed)
503: server busy, will retry`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Do not swallow exceptions",
          html: `<p><code>catch (Exception) { }</code> with an empty body hides every problem, including real bugs you have not met yet. The program carries on with bad data and fails somewhere far away, which is much harder to debug. Catch only what you can actually handle. A single catch-all at the very top of the program, which logs the error and exits, is fine.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p><code>try/except ValueError as e:</code> becomes <code>try { } catch (FormatException e) { }</code>. Python's <code>else</code> clause on <code>try</code> has no C# equivalent.</p>
<p>The bigger difference is culture. Python encourages "easier to ask forgiveness" (just try it and catch). In .NET, throwing is relatively expensive and reserved for unexpected failures. For input you <em>expect</em> to be wrong sometimes, use the Try pattern: <code>if (int.TryParse(text, out int n)) { ... }</code>.</p>`
        },
        {
          type: "compare",
          left: {
            label: "Exceptions for expected input (avoid)",
            code: String.raw`try
{
    age = int.Parse(text);
}
catch (FormatException)
{
    Console.WriteLine("Not a number");
}`
          },
          right: {
            label: "Try pattern (preferred)",
            code: String.raw`if (int.TryParse(text, out int age))
{
    Console.WriteLine($"Age {age}");
}
else
{
    Console.WriteLine("Not a number");
}`
          }
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`try
{
    Console.WriteLine("A");
    int[] data = new int[2];
    data[2] = 1;
    Console.WriteLine("B");
}
catch (IndexOutOfRangeException)
{
    Console.WriteLine("C");
}
Console.WriteLine("D");`,
          answer: `A
C
D`,
          explain: `<p><code>data[2]</code> is out of range for a two-element array, so it throws. The rest of the <code>try</code> (printing B) is skipped, the matching catch prints C, and execution continues after the try/catch with D.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Why does this fail with <code>error CS0160</code>?</p>`,
          code: String.raw`try { Load(); }
catch (Exception ex) { Log(ex); }
catch (FileNotFoundException ex) { AskForPath(); }`,
          options: [
            "The Exception catch already handles FileNotFoundException, so the second catch can never run",
            "You cannot have two catch blocks",
            "FileNotFoundException needs a using directive",
            "Both catch variables are called ex"
          ],
          answer: 0,
          explain: `<p><code>FileNotFoundException</code> derives from <code>Exception</code>, so the first catch matches it first. Put specific types before general ones. Multiple catches are fine, and each catch has its own scope, so reusing <code>ex</code> is allowed.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the handler: try parsing, catch format problems, and only retry I/O errors while <code>attempt &lt; 3</code>.</p>`,
          code: String.raw`___
{
    int n = int.Parse(text);
}
___ (FormatException)
{
    Console.WriteLine("Not a number");
}

try
{
    SaveFile();
}
catch (IOException) ___ (attempt < 3)
{
    Retry();
}`,
          blanks: [["try"], ["catch"], ["when"]],
          explain: `<p><code>try</code> marks the risky code, <code>catch (Type)</code> handles one exception type, and <code>when (condition)</code> adds a filter. If the filter is false, the exception keeps looking for another handler.</p>`
        },
        {
          type: "bug",
          prompt: `<p>The total is sometimes wrong and nobody can tell why. What is the problem?</p>`,
          code: String.raw`decimal total = 0;
foreach (string line in lines)
{
    try
    {
        total += decimal.Parse(line);
    }
    catch
    {
    }
}`,
          options: [
            "The empty catch silently skips bad lines, so errors vanish without a trace",
            "decimal.Parse cannot throw",
            "A catch block must always name an exception type",
            "The try block should be outside the loop"
          ],
          answer: 0,
          explain: `<p>Bad lines are dropped without any message, so the total is wrong and nothing explains it. Use <code>decimal.TryParse</code> and report or count the rejected lines. A bare <code>catch</code> is legal C# (it catches everything), which is exactly why it is dangerous.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Your console app asks the user for their age. What is the most idiomatic C# way to handle non-numeric input?</p>`,
          options: [
            "int.TryParse, and ask again when it returns false",
            "int.Parse inside try/catch (Exception)",
            "Convert.ToInt32 and let the program crash",
            "Check every character with char.IsDigit, then int.Parse"
          ],
          answer: 0,
          explain: `<p>Bad input is <em>expected</em> here, so the Try pattern fits: no exception cost and clear control flow. Catching <code>Exception</code> is too broad. Checking digits by hand misses signs, overflow and whitespace rules that <code>TryParse</code> already handles.</p>`
        }
      ],
      takeaways: [
        "A thrown exception skips the rest of the try and unwinds until a matching catch.",
        "Order catch blocks from most specific to most general (CS0160 otherwise).",
        "when (condition) filters a catch without catching and rethrowing.",
        "Never swallow exceptions with an empty catch.",
        "Use TryParse-style methods for input you expect to be wrong."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m08-l02",
      title: "finally, using and IDisposable",
      minutes: 18,
      objectives: [
        "Use finally for cleanup that must always run",
        "Explain what IDisposable is for",
        "Write using statements and using declarations",
        "Implement a simple IDisposable class"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Some objects hold things the garbage collector does not manage well: open files, network sockets, database connections. The GC frees memory eventually, but you have no idea when, and until then the file stays locked or the connection stays open. These need <strong>deterministic cleanup</strong>: release them now, and release them even if an exception is flying.</p>
<p>The first tool is <code>finally</code>. A <code>finally</code> block runs after the <code>try</code> (and any <code>catch</code>), no matter how the <code>try</code> ended.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Process(10);
Process(0);

static void Process(int divisor)
{
    Console.WriteLine($"Start {divisor}");
    try
    {
        Console.WriteLine(100 / divisor);
    }
    catch (DivideByZeroException)
    {
        Console.WriteLine("Cannot divide by zero");
    }
    finally
    {
        Console.WriteLine("Cleanup");
    }
}`,
          output: `Start 10
10
Cleanup
Start 0
Cannot divide by zero
Cleanup`
        },
        {
          type: "text",
          html: `<p><code>finally</code> runs when the <code>try</code> finishes normally, after a <code>catch</code> handles an exception, when the <code>try</code> executes <code>return</code>, <code>break</code> or <code>continue</code>, and when an exception passes through uncaught on its way to an outer handler. It does <em>not</em> run if the process is killed, calls <code>Environment.FailFast</code>, or overflows its stack.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Console.WriteLine(GetValue());

static int GetValue()
{
    try
    {
        Console.WriteLine("In try");
        return 1;
    }
    finally
    {
        Console.WriteLine("In finally");
    }
}`,
          output: `In try
In finally
1`
        },
        {
          type: "text",
          html: `<p>Writing <code>try/finally</code> around every file would be tedious. .NET standardizes cleanup with the <code>IDisposable</code> interface, which has one method: <code>void Dispose()</code>. Every type that holds a resource implements it: <code>FileStream</code>, <code>StreamReader</code>, <code>StreamWriter</code>, database connections, <code>Timer</code> and many more.</p>
<p>The <code>using</code> statement calls <code>Dispose()</code> for you when the block ends, even if an exception is thrown. Below, a tiny class makes the calls visible.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`using (var scope = new TraceScope("report"))
{
    Console.WriteLine("Working...");
}
Console.WriteLine("After the block");

class TraceScope : IDisposable
{
    private readonly string name;

    public TraceScope(string name)
    {
        this.name = name;
        Console.WriteLine($"Open {name}");
    }

    public void Dispose() => Console.WriteLine($"Close {name}");
}`,
          output: `Open report
Working...
Close report
After the block`
        },
        {
          type: "compare",
          left: {
            label: "You write",
            code: String.raw`using (var w = new StreamWriter(path))
{
    w.WriteLine("hello");
}`
          },
          right: {
            label: "The compiler generates (roughly)",
            code: String.raw`var w = new StreamWriter(path);
try
{
    w.WriteLine("hello");
}
finally
{
    if (w != null) w.Dispose();
}`
          }
        },
        {
          type: "text",
          html: `<p>C# 8 added the shorter <strong>using declaration</strong>: <code>using var x = ...;</code> with no braces. The object is disposed when the enclosing scope (usually the method) ends. With several declarations, disposal happens in <strong>reverse</strong> order, so things opened last are closed first.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Run();
Console.WriteLine("Back in caller");

static void Run()
{
    using var first = new TraceScope("first");
    using var second = new TraceScope("second");
    Console.WriteLine("Doing work");
}   // second, then first, are disposed here

class TraceScope : IDisposable
{
    private readonly string name;

    public TraceScope(string name)
    {
        this.name = name;
        Console.WriteLine($"Open {name}");
    }

    public void Dispose() => Console.WriteLine($"Close {name}");
}`,
          output: `Open first
Open second
Doing work
Close second
Close first
Back in caller`
        },
        {
          type: "text",
          html: `<p>Here is the everyday case: writing a file. <code>StreamWriter</code> buffers text in memory for speed. <code>Dispose()</code> flushes the buffer to disk and releases the file handle.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`string path = Path.Combine(Path.GetTempPath(), "notes-demo.txt");

using (var writer = new StreamWriter(path))
{
    writer.WriteLine("first line");
    writer.WriteLine("second line");
}   // flushed and closed here

foreach (string line in File.ReadLines(path))
{
    Console.WriteLine(line);
}
File.Delete(path);`,
          output: `first line
second line`
        },
        {
          type: "callout",
          tone: "warning",
          title: "What happens when you forget",
          html: `<p>Without <code>using</code>, the buffered text may never reach the disk, so the file is empty or cut short. On Windows the file also stays locked, and the next attempt to open it fails with <code>IOException: The process cannot access the file because it is being used by another process</code>. Analyzer rule CA2000 flags disposable objects that are never disposed.</p>`
        },
        {
          type: "callout",
          tone: "deep",
          title: "Dispose, finalizers and the GC",
          html: `<p>The GC only knows about memory. A class that wraps a raw OS handle needs a <em>finalizer</em> as a safety net and the full "dispose pattern" with <code>Dispose(bool disposing)</code>. You will rarely write one: wrap handles in <code>SafeHandle</code> instead. For an ordinary class that just <em>owns</em> disposable objects, implement <code>IDisposable</code>, dispose the fields in <code>Dispose()</code>, make the method safe to call twice, and seal the class.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p><code>with open(path) as f:</code> is Python's version of <code>using (var f = File.OpenText(path))</code>. A Python context manager's <code>__exit__</code> plays the role of <code>Dispose()</code>. Python's <code>try/finally</code> works the same as C#'s.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>Predict the full output, in order.</p>`,
          code: String.raw`try
{
    using var scope = new Scope();
    Console.WriteLine("work");
    throw new InvalidOperationException("boom");
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"caught {ex.Message}");
}
finally
{
    Console.WriteLine("finally");
}

class Scope : IDisposable
{
    public Scope() => Console.WriteLine("open");
    public void Dispose() => Console.WriteLine("dispose");
}`,
          answer: `open
work
dispose
caught boom
finally`,
          explain: `<p>The using declaration belongs to the <code>try</code> block's scope. When the exception leaves that block, <code>Dispose</code> runs first (it is an inner, hidden <code>finally</code>). Then the outer <code>catch</code> handles the exception, and the outer <code>finally</code> runs last.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>In which situation does a <code>finally</code> block <strong>not</strong> run?</p>`,
          options: [
            "The process is terminated with Environment.FailFast",
            "The try block executes return",
            "An exception is thrown and not caught by this try",
            "A catch block handles the exception"
          ],
          answer: 0,
          explain: `<p><code>finally</code> runs on normal completion, on <code>return</code>, after a catch, and while an uncaught exception passes through. Only abrupt process termination (FailFast, a killed process, stack overflow) skips it.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Make <code>Connection</code> disposable and make sure it is closed at the end of the method.</p>`,
          code: String.raw`class Connection : ___
{
    public void ___()
    {
        Console.WriteLine("Connection closed");
    }
}

static void Query()
{
    ___ var conn = new Connection();
    Console.WriteLine("Querying...");
}`,
          blanks: [["IDisposable"], ["Dispose"], ["using"]],
          explain: `<p>Implement <code>IDisposable</code> by providing a public <code>Dispose()</code> method. <code>using var</code> then guarantees <code>Dispose</code> is called when <code>Query</code> ends, even if the query throws.</p>`
        },
        {
          type: "order",
          prompt: `<p>Order what happens for <code>using (var w = new StreamWriter(path)) { w.WriteLine("hi"); }</code>.</p>`,
          lines: [
            "The StreamWriter constructor opens the file",
            "WriteLine puts \"hi\" into an in-memory buffer",
            "Execution reaches the end of the using block",
            "Dispose() flushes the buffer to the file",
            "The file handle is released for other programs"
          ],
          explain: `<p>Writes go to a buffer first for speed. The closing brace of the <code>using</code> block triggers <code>Dispose()</code>, which flushes and then closes. That is why forgetting <code>using</code> can leave an empty file.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This prints an empty line instead of "Total: 42" (and fails with an <code>IOException</code> on Windows). Why?</p>`,
          code: String.raw`var writer = new StreamWriter("report.txt");
writer.WriteLine("Total: 42");
Console.WriteLine(File.ReadAllText("report.txt"));`,
          options: [
            "The writer is never disposed, so the text is still buffered and the file is still open",
            "WriteLine needs a \\n at the end",
            "File.ReadAllText cannot read .txt files",
            "StreamWriter only works with absolute paths"
          ],
          answer: 0,
          explain: `<p>The text sits in the writer's buffer until a flush. Wrap the writer in <code>using</code> (or call <code>Dispose</code>) before reading the file. <code>WriteLine</code> already adds the newline, and relative paths are fine.</p>`
        }
      ],
      takeaways: [
        "finally runs after try and catch, however the try ended.",
        "IDisposable.Dispose() releases files, connections and other resources now.",
        "using (...) { } and using var both guarantee Dispose, even on exceptions.",
        "Multiple using declarations dispose in reverse order.",
        "Forgetting to dispose a writer can lose data and lock files."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m08-l03",
      title: "Throwing and custom exceptions",
      minutes: 22,
      objectives: [
        "Validate arguments with guard clauses and .NET 8 throw helpers",
        "Pick the right built-in exception type",
        "Rethrow with throw; and wrap with an inner exception",
        "Design a custom exception class"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>So far you have caught exceptions .NET throws. Your own methods should throw too, whenever they are asked to do something they cannot do correctly. A method that silently returns a wrong answer is far worse than one that fails loudly.</p>
<p>The most common place to throw is a <strong>guard clause</strong>: checks at the very top of a method that reject bad arguments before any work happens. This is called <em>failing fast</em>. The error appears right where the bad value entered, not three methods later.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var account = new Account("Ana", 100m);
account.Withdraw(30m);
Console.WriteLine(account.Balance);

try
{
    account.Withdraw(500m);
}
catch (InvalidOperationException ex)
{
    Console.WriteLine(ex.Message);
}

try
{
    account.Withdraw(-5m);
}
catch (ArgumentOutOfRangeException ex)
{
    Console.WriteLine(ex.Message);
}

class Account
{
    public string Owner { get; }
    public decimal Balance { get; private set; }

    public Account(string owner, decimal opening)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(owner);
        ArgumentOutOfRangeException.ThrowIfNegative(opening);
        Owner = owner;
        Balance = opening;
    }

    public void Withdraw(decimal amount)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount);
        if (amount > Balance)
            throw new InvalidOperationException("Insufficient funds.");

        Balance -= amount;
    }
}`,
          output: `70
Insufficient funds.
amount ('-5') must be a non-negative and non-zero value. (Parameter 'amount')
Actual value was -5.`
        },
        {
          type: "text",
          html: `<p>The <code>ThrowIf...</code> helpers are new in .NET 7 and 8. They check the condition, and if it fails they throw with a complete message that already includes the <strong>parameter name</strong>. They get the name automatically (through a feature called <code>CallerArgumentExpression</code>), so you cannot get it wrong after a rename.</p>`
        },
        {
          type: "compare",
          left: {
            label: "Classic guard",
            code: String.raw`if (customer is null)
{
    throw new ArgumentNullException(
        nameof(customer));
}
if (quantity <= 0)
{
    throw new ArgumentOutOfRangeException(
        nameof(quantity),
        "Quantity must be positive.");
}`
          },
          right: {
            label: ".NET 8 throw helpers",
            code: String.raw`ArgumentNullException
    .ThrowIfNull(customer);

ArgumentOutOfRangeException
    .ThrowIfNegativeOrZero(quantity);`
          }
        },
        {
          type: "table",
          headers: ["Throw this", "When"],
          rows: [
            ["<code>ArgumentNullException</code>", "an argument is <code>null</code> but must not be"],
            ["<code>ArgumentOutOfRangeException</code>", "an argument is outside the allowed range"],
            ["<code>ArgumentException</code>", "an argument is invalid in some other way (empty, wrong format)"],
            ["<code>InvalidOperationException</code>", "the arguments are fine but the object's current state forbids the call"],
            ["<code>NotSupportedException</code>", "the operation is never supported by this type (e.g. writing to a read-only stream)"],
            ["<code>NotImplementedException</code>", "a stub you have not written yet; should never ship"],
            ["a custom exception", "callers need to catch this specific situation and read extra data"]
          ]
        },
        {
          type: "callout",
          tone: "warning",
          title: "Never throw new Exception(...)",
          html: `<p>A plain <code>Exception</code> tells the caller nothing, and they can only catch it by catching <em>everything</em>. Analyzer rule CA2201 warns about it. Also avoid throwing <code>NullReferenceException</code> or <code>IndexOutOfRangeException</code> yourself; those signal bugs inside the runtime's own checks. Use the argument exceptions instead.</p>`
        },
        {
          type: "text",
          html: `<p>Sometimes you catch an exception, do something (log it, clean up), and want it to keep going up. Use <code>throw;</code> on its own. It rethrows the <em>same</em> exception with its original stack trace intact.</p>
<p><code>throw ex;</code> looks similar but resets the stack trace to the current line, destroying the most useful debugging information. Analyzer rule CA2200 flags it.</p>
<p>Other times you want to add context: "loading the config failed" is more useful to the caller than "input string was not in a correct format". Throw a new exception and pass the original as the <strong>inner exception</strong>, so nothing is lost.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`try
{
    LoadPort("port=abc");
}
catch (ConfigException ex)
{
    Console.WriteLine(ex.Message);
    Console.WriteLine($"Cause: {ex.InnerException?.GetType().Name}");
}

static int LoadPort(string line)
{
    string value = line.Split('=')[1];
    try
    {
        return int.Parse(value);
    }
    catch (FormatException ex)
    {
        throw new ConfigException($"Bad port value '{value}'.", ex);
    }
}

class ConfigException : Exception
{
    public ConfigException(string message, Exception inner)
        : base(message, inner) { }
}`,
          output: `Bad port value 'abc'.
Cause: FormatException`
        },
        {
          type: "text",
          html: `<p>Create a <strong>custom exception</strong> when callers need to react to a specific situation differently from others, or need data about it. Follow the conventions:</p>
<ul>
<li>Derive from <code>Exception</code> (or a more specific existing exception).</li>
<li>End the name with <code>Exception</code>.</li>
<li>Pass a clear message to <code>base(...)</code>, and accept an inner exception when you wrap.</li>
<li>Expose the useful data as read-only properties.</li>
</ul>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var wallet = new Wallet(20m);

try
{
    wallet.Pay(35m);
}
catch (InsufficientFundsException ex)
{
    Console.WriteLine(ex.Message);
    Console.WriteLine($"Short by {ex.Shortfall}");
}

class Wallet
{
    public decimal Balance { get; private set; }
    public Wallet(decimal balance) => Balance = balance;

    public void Pay(decimal amount)
    {
        if (amount > Balance)
            throw new InsufficientFundsException(Balance, amount);
        Balance -= amount;
    }
}

class InsufficientFundsException : Exception
{
    public decimal Balance { get; }
    public decimal Requested { get; }
    public decimal Shortfall => Requested - Balance;

    public InsufficientFundsException(decimal balance, decimal requested)
        : base($"Cannot pay {requested}: balance is only {balance}.")
    {
        Balance = balance;
        Requested = requested;
    }
}`,
          output: `Cannot pay 35: balance is only 20.
Short by 15`
        },
        {
          type: "callout",
          tone: "tip",
          title: "throw is also an expression",
          html: `<p>Since C# 7 you can throw inside an expression, which keeps guards short:</p>
<ul>
<li><code>Name = name ?? throw new ArgumentNullException(nameof(name));</code></li>
<li><code>_ =&gt; throw new ArgumentOutOfRangeException(nameof(level))</code> as the last arm of a switch expression</li>
<li><code>int Age =&gt; age &gt;= 0 ? age : throw new InvalidOperationException();</code></li>
</ul>`
        },
        {
          type: "callout",
          tone: "deep",
          title: "Why exceptions are not for normal control flow",
          html: `<p>Throwing captures a stack trace and unwinds frames. That costs microseconds, thousands of times slower than an <code>if</code>. That is fine for real failures, but a loop that throws on every bad line of a big file will crawl. This is why .NET pairs <code>Parse</code> with <code>TryParse</code> and <code>dict[key]</code> with <code>TryGetValue</code>: one throws for surprises, the other returns <code>false</code> for expected misses.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`try
{
    try
    {
        throw new FormatException("bad digit");
    }
    catch (FormatException ex)
    {
        throw new InvalidOperationException("load failed", ex);
    }
}
catch (InvalidOperationException ex)
{
    Console.WriteLine(ex.Message);
    Console.WriteLine(ex.InnerException?.Message);
}`,
          answer: `load failed
bad digit`,
          explain: `<p>The inner catch wraps the <code>FormatException</code> in a new <code>InvalidOperationException</code>. The outer catch receives the wrapper; its <code>Message</code> is "load failed", and the original is still available through <code>InnerException</code>.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Inside a catch block you want to log and let the exception continue to the caller. Which line is correct?</p>`,
          options: [
            "<code>throw;</code>",
            "<code>throw ex;</code>",
            "<code>throw new Exception(ex.Message);</code>",
            "<code>return ex;</code>"
          ],
          answer: 0,
          explain: `<p><code>throw;</code> rethrows the same exception and keeps its original stack trace. <code>throw ex;</code> resets the trace to the catch block, hiding where the error really started. Creating a plain <code>Exception</code> loses the type and the stack trace both.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Add .NET 8 guard clauses: <code>customer</code> must not be null and <code>quantity</code> must be at least 1. Then use a throw expression for <code>note</code>.</p>`,
          code: String.raw`public void AddOrder(Customer customer, int quantity, string? note)
{
    ArgumentNullException.___(customer);
    ArgumentOutOfRangeException.___(quantity);

    Note = note ?? ___ new ArgumentNullException(nameof(note));
}`,
          blanks: [["ThrowIfNull"], ["ThrowIfNegativeOrZero"], ["throw"]],
          explain: `<p><code>ThrowIfNull</code> handles null checks. <code>ThrowIfNegativeOrZero</code> rejects 0 and below. (<code>ThrowIfNegative</code> alone would allow 0.) <code>?? throw</code> is a throw expression: if the left side is null, the exception is thrown instead of producing a value.</p>`
        },
        {
          type: "bug",
          prompt: `<p>Production logs show the error "happened" in <code>Save</code>'s catch block, never in the real failing line. Why?</p>`,
          code: String.raw`public void Save(Order order)
{
    try
    {
        repository.Write(order);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Save failed");
        throw ex;
    }
}`,
          options: [
            "throw ex; resets the stack trace; use throw; to keep the original",
            "LogError swallows the exception",
            "catch (Exception ex) must come after a more specific catch",
            "Save should return bool instead"
          ],
          answer: 0,
          explain: `<p><code>throw ex;</code> treats the exception as newly thrown from this line, so the trace starts here. <code>throw;</code> preserves the full original trace. Logging and rethrowing at a boundary like this is otherwise a reasonable pattern.</p>`
        },
        {
          type: "mcq",
          prompt: `<p><code>account.Withdraw(50m)</code> is called after the account was closed. The amount itself is valid. Which exception fits best?</p>`,
          options: [
            "InvalidOperationException",
            "ArgumentOutOfRangeException",
            "ArgumentNullException",
            "NotImplementedException"
          ],
          answer: 0,
          explain: `<p>The argument is fine; the object's <em>state</em> forbids the operation. That is exactly what <code>InvalidOperationException</code> means. Argument exceptions are for bad inputs, and <code>NotImplementedException</code> marks unfinished code.</p>`
        }
      ],
      takeaways: [
        "Guard clauses at the top of a method fail fast with a clear exception.",
        ".NET 8 helpers like ThrowIfNull and ThrowIfNegativeOrZero fill in parameter names.",
        "Use throw; to rethrow; throw ex; destroys the stack trace.",
        "Wrap with new SomeException(message, inner) to add context without losing the cause.",
        "Custom exceptions end in Exception, derive from Exception, and carry useful data."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m08-l04",
      title: "Nullable reference types",
      minutes: 20,
      objectives: [
        "Read string vs string? as the compiler does",
        "Fix the common nullable warnings (CS8600, CS8602, CS8618)",
        "Use ?., ??, ??= and know when ! is acceptable",
        "Configure a project to treat nullable warnings seriously"
      ],
      blocks: [
        {
          type: "text",
          html: `<p><code>NullReferenceException</code> is the most common crash in .NET history. Its cause is always the same: calling a member on a variable that holds <code>null</code>. Since C# 8, the compiler can track which variables might be null and warn you <em>before</em> you run the code. New projects turn this on with <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> in the <code>.csproj</code>.</p>
<p>With it enabled, reference types get two spellings:</p>
<ul>
<li><code>string</code> means "this should never be null".</li>
<li><code>string?</code> means "this might be null, so check before use".</li>
</ul>
<p>This is purely compile-time analysis. The runtime behaves exactly as before, so the warnings are your only protection. Read them.</p>`
        },
        {
          type: "code",
          title: "Warnings in action",
          code: String.raw`string? maybe = Console.ReadLine();   // null at end of input

Console.WriteLine(maybe.Length);
// warning CS8602: Dereference of a possibly null reference.

string sure = maybe;
// warning CS8600: Converting null literal or possible
//                 null value to non-nullable type.`
        },
        {
          type: "table",
          headers: ["Warning", "Meaning", "Usual fix"],
          rows: [
            ["<code>CS8600</code>", "storing a maybe-null value in a non-nullable variable", "make the variable <code>T?</code>, or check first"],
            ["<code>CS8602</code>", "using a member of a maybe-null value", "check for null, or use <code>?.</code>"],
            ["<code>CS8603</code>", "returning a maybe-null value from a non-nullable return type", "return <code>T?</code>, or return a real value"],
            ["<code>CS8604</code>", "passing a maybe-null argument to a non-nullable parameter", "check first, or use <code>??</code> to supply a default"],
            ["<code>CS8618</code>", "a non-nullable field or property is not set by the constructor", "initialize it, set it in the constructor, or mark it <code>required</code>"],
            ["<code>CS8625</code>", "assigning the literal <code>null</code> to a non-nullable type", "make the type nullable"]
          ]
        },
        {
          type: "text",
          html: `<p>The compiler follows your code's logic (<strong>flow analysis</strong>). After <code>if (text is null) return;</code>, it knows <code>text</code> is not null for the rest of the method, and the warnings disappear. You do not need any special syntax: normal checks are enough.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`PrintLength("hello");
PrintLength(null);

static void PrintLength(string? text)
{
    if (text is null)
    {
        Console.WriteLine("No text");
        return;
    }
    // From here on, the compiler knows text is not null.
    Console.WriteLine($"Length {text.Length}");
}`,
          output: `Length 5
No text`
        },
        {
          type: "text",
          html: `<p>Four operators make null handling concise:</p>
<ul>
<li><code>a?.B</code> (null-conditional): if <code>a</code> is null, the whole expression is null instead of crashing.</li>
<li><code>a ?? b</code> (null-coalescing): <code>a</code> unless it is null, then <code>b</code>.</li>
<li><code>a ??= b</code>: assign <code>b</code> to <code>a</code> only if <code>a</code> is null.</li>
<li><code>a!</code> (null-forgiving): "trust me, this is not null". It silences the warning and does nothing else.</li>
</ul>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Customer? nobody = null;
var ana = new Customer { Name = "Ana" };
var ben = new Customer { Name = "Ben", Email = "ben@example.com" };

Console.WriteLine(nobody?.Name ?? "(no customer)");
Console.WriteLine(ana.Email?.ToUpper() ?? "(no email)");
Console.WriteLine(ben.Email?.ToUpper() ?? "(no email)");
Console.WriteLine(ana.Email?.Length);   // null prints as empty

ana.Email ??= "unknown@example.com";
Console.WriteLine(ana.Email);

class Customer
{
    public required string Name { get; init; }
    public string? Email { get; set; }
}`,
          output: `(no customer)
(no email)
BEN@EXAMPLE.COM

unknown@example.com`
        },
        {
          type: "callout",
          tone: "warning",
          title: "The ! operator is a promise, not a fix",
          html: `<p><code>string name = Console.ReadLine()!;</code> compiles without warnings, but if input ends, <code>name</code> is null and the crash just moves to the next line that uses it. Use <code>!</code> only when you truly know more than the compiler, such as right after a check it cannot see. For user input, prefer <code>Console.ReadLine() ?? ""</code> or an explicit null check.</p>`
        },
        {
          type: "text",
          html: `<p>Warning <code>CS8618</code> appears on classes: a non-nullable property that the constructor never sets would start as <code>null</code>, breaking the promise. You have four honest fixes. Pick the one that matches what the property really means.</p>`
        },
        {
          type: "code",
          title: "Four ways to fix CS8618",
          code: String.raw`class Person
{
    // 1. A sensible default
    public string Nickname { get; set; } = "";

    // 2. Set in the constructor
    public string Name { get; }

    // 3. Callers must set it in an object initializer (C# 11)
    public required string Email { get; init; }

    // 4. It really is optional: say so
    public string? MiddleName { get; set; }

    public Person(string name) => Name = name;
}`
        },
        {
          type: "callout",
          tone: "tip",
          title: "Make the compiler strict",
          html: `<p>Teams usually turn nullable warnings into errors so they cannot pile up. In the <code>.csproj</code>, inside <code>&lt;PropertyGroup&gt;</code>, add <code>&lt;WarningsAsErrors&gt;Nullable&lt;/WarningsAsErrors&gt;</code>, or go all the way with <code>&lt;TreatWarningsAsErrors&gt;true&lt;/TreatWarningsAsErrors&gt;</code>. When enabling nullable in an old codebase, you can turn it on file by file with <code>#nullable enable</code> at the top of a file.</p>`
        },
        {
          type: "callout",
          tone: "deep",
          title: "string? and int? are different animals",
          html: `<p><code>int?</code> is a real type, <code>Nullable&lt;int&gt;</code>, with <code>HasValue</code> and <code>Value</code>. <code>string?</code> is the same <code>string</code> type at runtime with an annotation for the compiler. That is why <code>typeof(string?)</code> is not allowed but <code>typeof(int?)</code> is, and why nullable reference warnings never change how your program runs.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p><code>string?</code> is like <code>Optional[str]</code> (or <code>str | None</code>) checked by mypy: static analysis only. Watch out with <code>??</code>: it is <em>not</em> Python's <code>a or b</code>. <code>"" ?? "x"</code> is <code>""</code>, because only <code>null</code> triggers the fallback, while Python's <code>"" or "x"</code> gives <code>"x"</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`string? a = null;
string? b = "hi";

Console.WriteLine(a ?? "none");
Console.WriteLine(b?.Length ?? -1);
Console.WriteLine(a?.Length ?? -1);

a ??= "set";
b ??= "ignored";
Console.WriteLine(a + " " + b);`,
          answer: `none
2
-1
set hi`,
          explain: `<p><code>a</code> is null, so <code>??</code> picks "none". <code>b?.Length</code> is 2. <code>a?.Length</code> is null, so <code>??</code> gives -1. <code>??=</code> only assigns when the variable is null: <code>a</code> becomes "set" and <code>b</code> keeps "hi".</p>`
        },
        {
          type: "mcq",
          prompt: `<p>What does the <code>!</code> in <code>string s = FindName()!;</code> do at runtime?</p>`,
          options: [
            "Nothing; it only silences the compiler warning",
            "It throws if FindName() returns null",
            "It replaces null with an empty string",
            "It negates the result"
          ],
          answer: 0,
          explain: `<p>The null-forgiving operator exists only for the compiler. If <code>FindName()</code> returns null, <code>s</code> is null and the crash happens later when <code>s</code> is used. If you want a check, write one or use a throw helper. In front of an expression, <code>!</code> means "not"; after it, it means null-forgiving.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Get the length of a name that might be null (0 if null), then load the cache only if it has not been loaded.</p>`,
          code: String.raw`string? name = GetName();
int length = name___Length ___ 0;

List<string>? cache = null;
cache ___ LoadCache();`,
          blanks: [["?."], ["??"], ["??="]],
          explain: `<p><code>name?.Length</code> is an <code>int?</code> that is null when <code>name</code> is null. <code>?? 0</code> turns that into a plain <code>int</code>. <code>??=</code> assigns only when <code>cache</code> is still null, so <code>LoadCache</code> runs at most once.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This class gets <code>warning CS8618</code> on <code>Title</code>. Which fix is <strong>wrong</strong>?</p>`,
          code: String.raw`class Movie
{
    public string Title { get; set; }
    public int Year { get; set; }
}`,
          options: [
            "public string Title { get; set; } = null!;",
            "public required string Title { get; init; }",
            "public string Title { get; set; } = \"\";",
            "Add a constructor that sets Title"
          ],
          answer: 0,
          explain: `<p><code>= null!</code> silences the warning while still leaving <code>Title</code> null, which is the exact bug the warning was protecting you from. The other three make sure <code>Title</code> really has a value. <code>Year</code> is an <code>int</code>, a value type, so it defaults to 0 and never warns.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>You call <code>Greet(input)</code> where <code>input</code> is <code>string?</code> and <code>Greet</code> takes <code>string</code>. Which warning do you get?</p>`,
          options: [
            "CS8604: Possible null reference argument",
            "CS8602: Dereference of a possibly null reference",
            "CS8618: Non-nullable property must contain a non-null value",
            "No warning; nullable types convert automatically"
          ],
          answer: 0,
          explain: `<p>Passing a maybe-null value into a non-nullable parameter is CS8604. CS8602 is for using a member (<code>input.Length</code>), and CS8618 is about constructors not initializing members. Fix it with a null check first or <code>Greet(input ?? "guest")</code>.</p>`
        }
      ],
      takeaways: [
        "With nullable enabled, string means never null and string? means maybe null.",
        "The compiler tracks null checks, so a plain if (x is null) return; clears warnings.",
        "?. short-circuits on null, ?? supplies a fallback, ??= assigns only when null.",
        "! only silences a warning; it never prevents a NullReferenceException.",
        "Fix CS8618 with a default, a constructor, required, or an honest T?."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m08-l05",
      title: "Debugging like a professional",
      minutes: 20,
      objectives: [
        "Use breakpoints, stepping and watches to inspect a running program",
        "Read a .NET stack trace and find the failing line",
        "Check assumptions with Debug.Assert",
        "Follow a repeatable process to find a bug"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Bugs come in three flavors. <strong>Compile errors</strong> are the easiest: the compiler points at the line. <strong>Exceptions</strong> are next: the stack trace points at the line. <strong>Wrong results</strong> are the hardest: the program runs happily and prints the wrong answer, and nothing points anywhere.</p>
<p>A <strong>debugger</strong> lets you pause a running program, look at every variable, and move forward one line at a time. Visual Studio, VS Code (with the C# Dev Kit extension) and JetBrains Rider all share the same core ideas and mostly the same keys.</p>`
        },
        {
          type: "steps",
          items: [
            "Click in the left margin next to a line (or press <kbd>F9</kbd>) to set a <strong>breakpoint</strong>. A red dot appears.",
            "Start with debugging using <kbd>F5</kbd>. The program runs until it reaches the breakpoint, then pauses <em>before</em> executing that line.",
            "Hover over variables, or open the <strong>Locals</strong> window, to see current values.",
            "Press <kbd>F10</kbd> (<strong>Step Over</strong>) to run the current line and stop at the next one.",
            "Press <kbd>F11</kbd> (<strong>Step Into</strong>) to enter the method being called on the current line. <kbd>Shift</kbd>+<kbd>F11</kbd> (<strong>Step Out</strong>) finishes the current method and returns to the caller.",
            "Press <kbd>F5</kbd> again to continue to the next breakpoint, or <kbd>Shift</kbd>+<kbd>F5</kbd> to stop debugging."
          ]
        },
        {
          type: "table",
          headers: ["Tool", "What it does"],
          rows: [
            ["Locals / Variables", "every variable in the current method and its value"],
            ["Watch", "expressions you choose, re-evaluated at each pause, e.g. <code>total / count</code>"],
            ["Call Stack", "the chain of method calls that led here; click a frame to inspect it"],
            ["Conditional breakpoint", "pauses only when an expression is true, e.g. <code>i == 500</code>"],
            ["Tracepoint / logpoint", "prints a message instead of pausing; no code changes needed"],
            ["Exception settings", "break the moment an exception is thrown, before any catch handles it"]
          ]
        },
        {
          type: "text",
          html: `<p>When a program crashes, the stack trace is your map. Here is a small program with a bug, followed by what it prints:</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var printer = new LabelPrinter();
printer.PrintAll(["Ana", null, "Ben"]);

class LabelPrinter
{
    public void PrintAll(string?[] names)
    {
        foreach (string? name in names)
        {
            Console.WriteLine(MakeLabel(name));
        }
    }

    private static string MakeLabel(string? name)
        => "[" + name!.ToUpper() + "]";
}`
        },
        {
          type: "code",
          title: "Console output",
          code: String.raw`[ANA]
Unhandled exception. System.NullReferenceException: Object
reference not set to an instance of an object.
   at LabelPrinter.MakeLabel(String name) in Program.cs:line 15
   at LabelPrinter.PrintAll(String[] names) in Program.cs:line 10
   at Program.<Main>$(String[] args) in Program.cs:line 2`
        },
        {
          type: "text",
          html: `<p>How to read it:</p>
<ol>
<li>The first line gives the exception type and message. <code>NullReferenceException</code> means something was null.</li>
<li>The <code>at</code> lines are the call stack, <strong>most recent call first</strong>. The top frame is where it blew up: <code>MakeLabel</code>, line 15.</li>
<li>Read downward to see how you got there: <code>Main</code> (line 2) called <code>PrintAll</code> (line 10), which called <code>MakeLabel</code>.</li>
<li>In real apps the top frames are often framework code (<code>System.</code>...). Scan down to the <strong>first frame in your code</strong>; that is usually where to look.</li>
</ol>
<p>Here, the <code>!</code> told the compiler "name is never null", which was false. The bug is the broken promise, so the real fix is handling null names, not removing the <code>!</code>.</p>`
        },
        {
          type: "text",
          html: `<p><code>Debug.Assert(condition, message)</code> from <code>System.Diagnostics</code> documents an assumption and checks it while you develop. If the condition is false in a Debug build, the program stops with "Assertion failed" and your message, right where the assumption broke. In a Release build (<code>dotnet run -c Release</code>) the call is <strong>removed entirely</strong> by the compiler, so it costs nothing in production.</p>`
        },
        {
          type: "code",
          title: "Debug.Assert",
          code: String.raw`using System.Diagnostics;

static decimal ApplyDiscount(decimal price, decimal percent)
{
    // Callers should have validated this already.
    Debug.Assert(percent is >= 0 and <= 100,
        "percent must be between 0 and 100");

    decimal result = price - price * percent / 100;
    Debug.WriteLine($"Discounted {price} to {result}");
    return result;
}`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Assert versus guard clause",
          html: `<p>Asserts vanish in Release builds, so never use them to validate user input or public arguments. Use a guard clause that throws for that. Use <code>Debug.Assert</code> for things that can only be false if <em>your own code</em> has a bug. And never put work inside an assert, such as <code>Debug.Assert(queue.TryDequeue(out var x))</code>: in Release, the dequeue itself disappears.</p>`
        },
        {
          type: "text",
          html: `<p>The hardest bugs give wrong results with no exception. Inspecting values is the way in. This program "works" but the average is wrong:</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int[] scores = [90, 85, 72];
int total = 0;
foreach (int s in scores) total += s;

double average = total / scores.Length;   // the bug
Console.WriteLine($"Total {total}, count {scores.Length}");
Console.WriteLine($"Average {average}");
Console.WriteLine($"Fixed  {(double)total / scores.Length:F2}");`,
          output: `Total 247, count 3
Average 82
Fixed  82.33`
        },
        {
          type: "text",
          html: `<p>A breakpoint on the <code>average</code> line plus a watch on <code>total / scores.Length</code> shows <code>82</code> with type <code>int</code>. That is integer division: the result is computed as an <code>int</code> and only then stored in a <code>double</code>. A professional process for any bug looks like this:</p>
<ol>
<li><strong>Reproduce</strong> it reliably, with the smallest input that fails.</li>
<li><strong>Read</strong> the message and stack trace fully.</li>
<li><strong>Form a hypothesis</strong> and test it with a breakpoint or a temporary print.</li>
<li><strong>Fix the cause</strong>, not the symptom.</li>
<li><strong>Confirm</strong> the fix, and add a test so it cannot return (module 14).</li>
</ol>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p>Python tracebacks print the most recent call <strong>last</strong> ("most recent call last"). .NET stack traces print it <strong>first</strong>. Read .NET traces top-down. <code>breakpoint()</code> and pdb map to IDE breakpoints, and Python's <code>assert</code>, which is stripped with <code>python -O</code>, maps closely to <code>Debug.Assert</code>, which is stripped in Release builds.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>A progress bar shows 0%. What does this print?</p>`,
          code: String.raw`int done = 7, total = 8;
double percent = done / total * 100;
Console.WriteLine(percent);
Console.WriteLine((double)done / total * 100);`,
          answer: `0
87.5`,
          explain: `<p><code>7 / 8</code> with two ints is 0 (the fraction is discarded), and 0 * 100 is 0, which is then stored in a <code>double</code>. Casting <code>done</code> to <code>double</code> first makes the division floating-point: 0.875 * 100 = 87.5.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>In a .NET stack trace, what does the first <code>at ...</code> line tell you?</p>`,
          options: [
            "The method where the exception was thrown (the most recent call)",
            "The program's entry point",
            "The method that caught the exception",
            "The first method that ran when the app started"
          ],
          answer: 0,
          explain: `<p>.NET lists frames from the innermost (where the throw happened) outward to the entry point at the bottom. This is the reverse of Python's traceback order. If the top frames are framework code, look for the first frame from your own code.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Add a development-time check that <code>count</code> never goes negative.</p>`,
          code: String.raw`using System.___;

Debug.___(count >= 0, "count went negative");`,
          blanks: [["Diagnostics"], ["Assert"]],
          explain: `<p><code>Debug</code> lives in <code>System.Diagnostics</code>. <code>Debug.Assert(condition, message)</code> stops a Debug build when the condition is false, and disappears from Release builds.</p>`
        },
        {
          type: "order",
          prompt: `<p>Put a professional debugging process in order.</p>`,
          lines: [
            "Reproduce the bug reliably with the smallest failing input",
            "Read the exception message and stack trace",
            "Set a breakpoint before the suspect line",
            "Step through and inspect values to confirm a hypothesis",
            "Fix the root cause",
            "Re-run, confirm, and add a test for the case"
          ],
          explain: `<p>You cannot debug what you cannot reproduce, so that comes first. Reading the evidence beats guessing. Breakpoints and stepping turn a guess into a confirmed cause. Only then fix it, and finish by proving the fix and guarding against regressions.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This works when debugging but in the Release build no jobs are ever processed. Why?</p>`,
          code: String.raw`while (queue.Count > 0)
{
    Debug.Assert(queue.TryDequeue(out var job));
    Process(job);
}`,
          options: [
            "Debug.Assert calls are removed in Release, so TryDequeue never runs",
            "TryDequeue only works in Debug builds",
            "Process must be async",
            "Queues cannot be used inside while loops"
          ],
          answer: 0,
          explain: `<p>The compiler deletes the entire <code>Debug.Assert(...)</code> call, including its argument, in Release builds. The dequeue disappears with it (and this code would not even compile there, because <code>job</code> is no longer declared). Do the work in a normal statement and assert on the result.</p>`
        }
      ],
      takeaways: [
        "Breakpoints pause execution; F10 steps over, F11 steps into, Shift+F11 steps out.",
        ".NET stack traces list the most recent call first; find the first frame in your code.",
        "Debug.Assert checks your own assumptions and is removed from Release builds.",
        "Wrong-result bugs need inspection: watches, breakpoints or temporary prints.",
        "Reproduce, read, hypothesize, fix the cause, confirm."
      ]
    }
  ],
  milestone: {
    id: "m08-project",
    title: "Bulletproof ATM",
    brief: `<p>You are writing the software for a cash machine. Real users type nonsense, ask for more money than they have, hit daily limits, and walk away mid-session. Whatever happens, the machine must never crash and must always give the card back.</p>
<p>Build a console ATM with a PIN check and a menu (balance, deposit, withdraw, history, quit). The <code>Account</code> class protects itself with guard clauses and exceptions. The menu loop catches each kind of failure and shows a friendly message. A disposable <code>CardSession</code> guarantees "Card ejected" is printed no matter how the program ends.</p>`,
    skills: ["guard clauses", "custom exceptions", "try/catch ordering", "IDisposable and using", "TryParse", "nullable reference types"],
    requirements: [
      "Account.Deposit and Account.Withdraw reject zero or negative amounts with ArgumentOutOfRangeException.ThrowIfNegativeOrZero.",
      "Withdraw throws a custom InsufficientFundsException (with Balance and Requested properties) when the amount exceeds the balance.",
      "Withdraw only accepts multiples of 10 (ArgumentException) and enforces a daily limit of 500 (InvalidOperationException that says how much is left).",
      "The menu loop catches InsufficientFundsException, ArgumentOutOfRangeException, ArgumentException and InvalidOperationException in a valid order, each with a friendly message, and keeps running.",
      "Amounts are read with decimal.TryParse; non-numeric input prints a message instead of throwing.",
      "The PIN check allows 3 attempts; after that the card is retained and the program ends.",
      "A CardSession class implements IDisposable, is created with a using declaration, and prints \"Card ejected\" exactly once whenever the program ends.",
      "End of input (Console.ReadLine() returns null) at any prompt ends the session cleanly, and the project builds with no nullable warnings."
    ],
    sampleRun: `Card inserted. Welcome, Ana Lopez.
Enter PIN: 1111
Wrong PIN. 2 attempt(s) left.
Enter PIN: 1234

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 3
Amount: 45
Invalid amount: This ATM only dispenses multiples of 10.

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 3
Amount: 300
Declined: You asked for 300.00 but your balance is 250.00.

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 2
Amount: lots
That is not a valid amount.

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 2
Amount: 400
Deposited 400.00. Balance: 650.00

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 3
Amount: 300
Please take your cash: 300.00. Balance: 350.00

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 3
Amount: 300
Declined: Daily limit is 500.00. You can withdraw 200.00 more today.

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 3
Amount: -20
Invalid amount: it must be greater than zero.

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 4
Deposit   +  400.00
Withdraw  -  300.00

1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit
Choose: 5
Card ejected. Goodbye, Ana Lopez.`,
    starter: String.raw`const string CorrectPin = "1234";
var account = new Account("Ana Lopez", 250m, dailyLimit: 500m);

using var session = new CardSession(account.Owner);

// TODO: call CheckPin; if it fails print
// "PIN not verified. Card retained." and return.

while (true)
{
    Console.WriteLine();
    Console.WriteLine(
        "1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit");
    string? choice = Ask("Choose: ");
    if (choice is null || choice.Trim() == "5") break;

    // TODO: wrap the menu in try/catch. Catch the most specific
    // exceptions first: InsufficientFundsException,
    // ArgumentOutOfRangeException, ArgumentException,
    // InvalidOperationException.
    switch (choice.Trim())
    {
        case "1":
            Console.WriteLine($"Balance: {account.Balance:F2}");
            break;
        // TODO: cases "2" (deposit), "3" (withdraw), "4" (history)
        default:
            Console.WriteLine("Please choose 1-5.");
            break;
    }
}

static string? Ask(string prompt)
{
    Console.Write(prompt);
    return Console.ReadLine();
}

// TODO: static bool CheckPin(string correctPin) with 3 attempts.
// TODO: static decimal? ReadAmount() using decimal.TryParse.

class Account
{
    private readonly List<string> history = [];
    private decimal withdrawnToday;

    public string Owner { get; }
    public decimal Balance { get; private set; }
    public decimal DailyLimit { get; }
    public IReadOnlyList<string> History => history;

    public Account(string owner, decimal opening, decimal dailyLimit)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(owner);
        ArgumentOutOfRangeException.ThrowIfNegative(opening);
        Owner = owner;
        Balance = opening;
        DailyLimit = dailyLimit;
    }

    public void Deposit(decimal amount)
    {
        // TODO: guard clause, then update Balance and history.
    }

    public void Withdraw(decimal amount)
    {
        // TODO: guard clauses (positive, multiple of 10, balance,
        // daily limit using withdrawnToday), then update state.
    }
}

// TODO: class InsufficientFundsException : Exception

sealed class CardSession : IDisposable
{
    private readonly string owner;

    public CardSession(string owner)
    {
        this.owner = owner;
        Console.WriteLine($"Card inserted. Welcome, {owner}.");
    }

    public void Dispose()
    {
        // TODO: print the goodbye message exactly once.
    }
}`,
    hints: [
      `<p>Start with <code>Account</code>. Each method begins with guards: <code>ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount);</code>, then <code>if (amount % 10 != 0) throw new ArgumentException(...)</code>, then the balance and daily-limit checks. Only change state after every check passes.</p>`,
      `<p>The custom exception needs a constructor that calls <code>base(message)</code>: <code>public InsufficientFundsException(decimal balance, decimal requested) : base($"You asked for {requested:F2} but your balance is {balance:F2}.")</code>.</p>`,
      `<p>Catch order matters because <code>ArgumentOutOfRangeException</code> derives from <code>ArgumentException</code>. Put it first, or the compiler reports CS0160. Print a fixed friendly text for it, because its built-in message is long and technical.</p>`,
      `<p><code>ReadAmount</code> can return <code>decimal?</code>: <code>null</code> when the text is not a number or input ended. In the menu, write <code>if (ReadAmount() is decimal amount) { ... }</code> to use it only when it has a value.</p>`,
      `<p>Make <code>Dispose</code> safe to call twice with a <code>private bool disposed;</code> flag. Because <code>session</code> is a using declaration at the top level, it is disposed when the program ends, even after an early <code>return</code>.</p>`
    ],
    solution: String.raw`const string CorrectPin = "1234";
var account = new Account("Ana Lopez", 250m, dailyLimit: 500m);

using var session = new CardSession(account.Owner);

if (!CheckPin(CorrectPin))
{
    Console.WriteLine("PIN not verified. Card retained.");
    return;
}

while (true)
{
    Console.WriteLine();
    Console.WriteLine(
        "1) Balance  2) Deposit  3) Withdraw  4) History  5) Quit");
    string? choice = Ask("Choose: ");
    if (choice is null || choice.Trim() == "5") break;

    try
    {
        switch (choice.Trim())
        {
            case "1":
                Console.WriteLine($"Balance: {account.Balance:F2}");
                break;
            case "2":
                if (ReadAmount() is decimal deposit)
                {
                    account.Deposit(deposit);
                    Console.WriteLine($"Deposited {deposit:F2}. " +
                        $"Balance: {account.Balance:F2}");
                }
                break;
            case "3":
                if (ReadAmount() is decimal cash)
                {
                    account.Withdraw(cash);
                    Console.WriteLine($"Please take your cash: " +
                        $"{cash:F2}. Balance: {account.Balance:F2}");
                }
                break;
            case "4":
                if (account.History.Count == 0)
                    Console.WriteLine("No transactions yet.");
                foreach (string entry in account.History)
                    Console.WriteLine(entry);
                break;
            default:
                Console.WriteLine("Please choose 1-5.");
                break;
        }
    }
    catch (InsufficientFundsException ex)
    {
        Console.WriteLine($"Declined: {ex.Message}");
    }
    catch (ArgumentOutOfRangeException)
    {
        Console.WriteLine("Invalid amount: it must be greater than zero.");
    }
    catch (ArgumentException ex)
    {
        Console.WriteLine($"Invalid amount: {ex.Message}");
    }
    catch (InvalidOperationException ex)
    {
        Console.WriteLine($"Declined: {ex.Message}");
    }
}

static string? Ask(string prompt)
{
    Console.Write(prompt);
    return Console.ReadLine();
}

static bool CheckPin(string correctPin)
{
    for (int attempt = 1; attempt <= 3; attempt++)
    {
        string? pin = Ask("Enter PIN: ");
        if (pin is null) return false;          // input ended
        if (pin.Trim() == correctPin) return true;
        Console.WriteLine($"Wrong PIN. {3 - attempt} attempt(s) left.");
    }
    return false;
}

static decimal? ReadAmount()
{
    string? text = Ask("Amount: ");
    if (text is null) return null;
    if (decimal.TryParse(text, out decimal amount)) return amount;
    Console.WriteLine("That is not a valid amount.");
    return null;
}

class Account
{
    private readonly List<string> history = [];
    private decimal withdrawnToday;

    public string Owner { get; }
    public decimal Balance { get; private set; }
    public decimal DailyLimit { get; }
    public IReadOnlyList<string> History => history;

    public Account(string owner, decimal opening, decimal dailyLimit)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(owner);
        ArgumentOutOfRangeException.ThrowIfNegative(opening);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(dailyLimit);
        Owner = owner;
        Balance = opening;
        DailyLimit = dailyLimit;
    }

    public void Deposit(decimal amount)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount);
        Balance += amount;
        history.Add($"Deposit   +{amount,8:F2}");
    }

    public void Withdraw(decimal amount)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(amount);
        if (amount % 10 != 0)
            throw new ArgumentException(
                "This ATM only dispenses multiples of 10.");
        if (amount > Balance)
            throw new InsufficientFundsException(Balance, amount);
        if (withdrawnToday + amount > DailyLimit)
            throw new InvalidOperationException(
                $"Daily limit is {DailyLimit:F2}. You can withdraw " +
                $"{DailyLimit - withdrawnToday:F2} more today.");

        Balance -= amount;
        withdrawnToday += amount;
        history.Add($"Withdraw  -{amount,8:F2}");
    }
}

class InsufficientFundsException : Exception
{
    public decimal Balance { get; }
    public decimal Requested { get; }

    public InsufficientFundsException(decimal balance, decimal requested)
        : base($"You asked for {requested:F2} but your balance " +
               $"is {balance:F2}.")
    {
        Balance = balance;
        Requested = requested;
    }
}

sealed class CardSession : IDisposable
{
    private readonly string owner;
    private bool disposed;

    public CardSession(string owner)
    {
        this.owner = owner;
        Console.WriteLine($"Card inserted. Welcome, {owner}.");
    }

    public void Dispose()
    {
        if (disposed) return;
        disposed = true;
        Console.WriteLine($"Card ejected. Goodbye, {owner}.");
    }
}`,
    stretch: [
      "Wrap the whole session in a last-resort catch (Exception ex) that prints \"Unexpected error, please contact the bank\" and still ejects the card. Throw a test exception to prove it.",
      "Write every transaction and every declined attempt to an atm-log.txt file using a StreamWriter that CardSession owns and disposes.",
      "Add a Transfer option between two accounts that rolls back the withdrawal if the deposit fails.",
      "Lock the account after three declined withdrawals in a row by throwing a custom AccountLockedException."
    ]
  }
});
