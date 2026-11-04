(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m12",
  number: 12,
  title: "Async & Concurrency",
  tagline: "Do many things at once without freezing: tasks, async/await, cancellation and threads.",
  level: "Advanced",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m12-l01",
      title: "Why async: Task, async and await",
      minutes: 24,
      objectives: [
        "Explain the difference between blocking and waiting asynchronously",
        "Write async methods that return Task and Task<T>",
        "Predict the order in which async code runs",
        "Know the difference between Task.Delay and Thread.Sleep"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Most of the time a real program is <strong>waiting</strong>: for a web server to answer, a database query to finish, a file to load. If the code simply stops and waits, we say it <strong>blocks</strong>. In a desktop app a blocked UI thread means a frozen window with \"Not responding\" in the title bar. In a web server a blocked thread cannot serve anyone else, so under load the server runs out of threads.</p><p><strong>Asynchronous</strong> code starts the slow operation, hands the thread back while the operation is in flight, and continues when the result arrives. Nothing sits idle holding a thread. C# makes this look almost like normal code with two keywords: <code>async</code> and <code>await</code>.</p>"
        },
        {
          type: "callout",
          tone: "note",
          title: "A kitchen analogy",
          html: "<p>A blocking cook puts the kettle on and stares at it until it boils. An asynchronous cook puts the kettle on, chops vegetables, and comes back when the kettle whistles. Same single cook, much more done. Async is about not wasting a worker while waiting. It is not the same thing as using more workers (that is parallelism, covered in lesson 5).</p>"
        },
        {
          type: "code",
          title: "Your first async method",
          code: String.raw`Console.WriteLine("Fetching price...");
decimal price = await GetPriceAsync("ACME");
Console.WriteLine($"ACME costs {price}");

async Task<decimal> GetPriceAsync(string symbol)
{
    await Task.Delay(500);   // pretend this is a web call
    return symbol.Length * 10.5m;
}`,
          output: "Fetching price...\nACME costs 42.0"
        },
        {
          type: "text",
          html: "<p>The pieces:</p><ul><li><code>Task</code> represents an operation that will finish later. <code>Task&lt;T&gt;</code> is one that will finish later <em>with a result</em> of type <code>T</code>. Think of it as a receipt or a promise.</li><li><code>async</code> on a method allows <code>await</code> inside it. The method returns <code>Task</code> (no result) or <code>Task&lt;T&gt;</code>, yet you write <code>return price;</code> with a plain value. The compiler wraps it.</li><li><code>await</code> says \"if this task is not finished, pause this method here, free the thread, and continue right after when it completes\". It also unwraps the result: awaiting a <code>Task&lt;decimal&gt;</code> gives a <code>decimal</code>.</li><li>Top-level statements can use <code>await</code> directly. The compiler makes <code>Main</code> async for you.</li><li>By convention async method names end in <code>Async</code>.</li></ul>"
        },
        {
          type: "code",
          title: "Who runs when?",
          code: String.raw`Console.WriteLine("1. before the call");
Task work = DoWorkAsync();
Console.WriteLine("3. call returned a Task, not finished yet");
await work;
Console.WriteLine("5. after await");

async Task DoWorkAsync()
{
    Console.WriteLine("2. inside, before the first await");
    await Task.Delay(300);
    Console.WriteLine("4. inside, after the delay");
}`,
          output: "1. before the call\n2. inside, before the first await\n3. call returned a Task, not finished yet\n4. inside, after the delay\n5. after await"
        },
        {
          type: "text",
          html: "<p>This order surprises many people. Calling an async method runs it <strong>synchronously</strong> until it reaches the first <code>await</code> on something unfinished. At that point the method returns an incomplete <code>Task</code> to the caller, and the caller keeps going (line 3). When the delay ends, the rest of <code>DoWorkAsync</code> runs (line 4), the task completes, and the caller's <code>await</code> resumes (line 5).</p><p>So calling an async method <em>starts</em> the work. Awaiting it <em>waits</em> for the result. You can separate the two, which is the key to doing several things at once in the next lesson.</p>"
        },
        {
          type: "compare",
          left: {
            label: "Blocking (avoid in async code)",
            code: String.raw`void Wait()
{
    // freezes this thread for 1 s
    Thread.Sleep(1000);
}`
          },
          right: {
            label: "Asynchronous",
            code: String.raw`async Task WaitAsync()
{
    // thread is free during the wait
    await Task.Delay(1000);
}`
          }
        },
        {
          type: "text",
          html: "<p><code>Thread.Sleep</code> parks the current thread and nobody else can use it. <code>Task.Delay</code> sets up a timer and returns a task that completes when the timer fires, so the thread is released. In this course we use <code>Task.Delay</code> to stand in for real slow operations like network calls, because it behaves the same way and needs no internet.</p>"
        },
        {
          type: "code",
          title: "Sequential awaits run one after another",
          code: String.raw`using System.Diagnostics;

var sw = Stopwatch.StartNew();
string a = await LoadAsync("users", 300);
string b = await LoadAsync("orders", 300);
string c = await LoadAsync("stock", 300);
sw.Stop();

Console.WriteLine($"{a}, {b}, {c}");
Console.WriteLine($"Took at least 900 ms: {sw.ElapsedMilliseconds >= 890}");

async Task<string> LoadAsync(string what, int ms)
{
    await Task.Delay(ms);
    return what + " loaded";
}`,
          output: "users loaded, orders loaded, stock loaded\nTook at least 900 ms: True"
        },
        {
          type: "text",
          html: "<p>Each <code>await</code> waits for its load before the next one starts, so the times add up. That is correct when step 2 needs the result of step 1. When the loads are independent it is wasted time. Lesson 2 fixes this with <code>Task.WhenAll</code>.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p>The model is very close to <code>asyncio</code>: <code>async def</code> becomes <code>async Task</code>, <code>await asyncio.sleep(1)</code> becomes <code>await Task.Delay(1000)</code>. One big difference: a Python coroutine does nothing until awaited or scheduled, while a C# async method starts running the moment you call it. There is also no event loop to start; .NET's thread pool runs the continuations for you.</p>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "What the compiler does with async",
          html: "<p>The compiler rewrites an async method into a <strong>state machine</strong> class. Each <code>await</code> becomes a numbered state. When a task is not finished, the state machine registers a callback (a continuation) on it and returns. When the task completes, the callback runs the state machine again from the saved state, with your local variables kept in fields. No thread is waiting in between. That is why async scales so well on servers.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print? Follow the rule: an async method runs synchronously until its first real await.",
          code: String.raw`Console.WriteLine("A");
Task t = StepAsync();
Console.WriteLine("B");
await t;
Console.WriteLine("C");

async Task StepAsync()
{
    Console.WriteLine("D");
    await Task.Delay(200);
    Console.WriteLine("E");
}`,
          answer: "A\nD\nB\nE\nC",
          explain: "<p><code>StepAsync</code> prints D immediately, then hits <code>await Task.Delay</code> and returns an unfinished task. The caller prints B, then waits. After the delay, E prints, the task completes, and C prints.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the async method that returns a string after a short simulated wait.",
          code: String.raw`async ___<string> GreetAsync(string name)
{
    ___ Task.Delay(100);
    return $"Hello, {name}";
}`,
          blanks: [["Task"], ["await"]],
          explain: "<p>An async method that produces a value returns <code>Task&lt;T&gt;</code>. Inside, you <code>await</code> the delay and return a plain <code>string</code>. The compiler wraps it in the task.</p>"
        },
        {
          type: "mcq",
          prompt: "In a WPF app a button click handler calls <code>Thread.Sleep(5000)</code>. What does the user see?",
          options: [
            "Nothing special; the app stays responsive",
            "The window freezes for 5 seconds because the UI thread is blocked",
            "The app crashes with an exception",
            "The handler runs on a background thread automatically"
          ],
          answer: 1,
          explain: "<p>Click handlers run on the UI thread, the only thread allowed to redraw the window. Sleeping blocks it, so nothing repaints and the window shows \"Not responding\". <code>await Task.Delay(5000)</code> in an async handler would keep the window alive.</p>"
        },
        {
          type: "bug",
          prompt: "This does not compile. What is the problem?",
          code: String.raw`string Download()
{
    await Task.Delay(1000);
    return "data";
}`,
          options: [
            "Task.Delay needs a TimeSpan",
            "await can only be used in a method marked async (error CS4032/CS4033), which must return Task<string>",
            "A method cannot return a string literal",
            "Download must be static"
          ],
          answer: 1,
          explain: "<p>The compiler says <code>The 'await' operator can only be used within an async method</code>. Fix: <code>async Task&lt;string&gt; DownloadAsync()</code>. <code>Task.Delay</code> happily takes milliseconds as an <code>int</code>.</p>"
        },
        {
          type: "mcq",
          prompt: "What does <code>await</code> do when the task it awaits is not finished yet?",
          options: [
            "It blocks the current thread until the task completes",
            "It starts a new thread to run the task",
            "It returns control to the caller and resumes the method later when the task completes",
            "It throws an exception because the task is not ready"
          ],
          answer: 2,
          explain: "<p><code>await</code> never blocks. It registers the rest of the method as a continuation and returns. No new thread is created by <code>await</code> itself; the awaited operation decides how it runs (a timer, network I/O, and so on).</p>"
        }
      ],
      takeaways: [
        "Async frees the thread while waiting; it keeps apps responsive and servers scalable.",
        "Task means \"finishes later\"; Task<T> means \"finishes later with a T\".",
        "Calling an async method starts it; awaiting it waits for its result.",
        "An async method runs synchronously until its first await on unfinished work.",
        "Use Task.Delay, never Thread.Sleep, in async code."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m12-l02",
      title: "Running tasks together",
      minutes: 24,
      objectives: [
        "Run independent operations concurrently with Task.WhenAll",
        "React to the first finished task with Task.WhenAny",
        "Use Task.Run for CPU-bound work",
        "Handle exceptions from several tasks and limit concurrency"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Last lesson's three loads took 900 ms because each <code>await</code> waited before the next load even started. The trick is to <strong>start</strong> all the tasks first, then await them together. Since starting an async method returns a task immediately, that is easy:</p>"
        },
        {
          type: "code",
          title: "Task.WhenAll",
          code: String.raw`using System.Diagnostics;

var sw = Stopwatch.StartNew();

Task<string> users = LoadAsync("users", 300);
Task<string> orders = LoadAsync("orders", 300);
Task<string> stock = LoadAsync("stock", 300);

string[] results = await Task.WhenAll(users, orders, stock);
sw.Stop();

Console.WriteLine(string.Join(", ", results));
Console.WriteLine($"Under 600 ms: {sw.ElapsedMilliseconds < 600}");

async Task<string> LoadAsync(string what, int ms)
{
    await Task.Delay(ms);
    return what + " loaded";
}`,
          output: "users loaded, orders loaded, stock loaded\nUnder 600 ms: True"
        },
        {
          type: "text",
          html: "<p>All three delays run at the same time, so the total is about 300 ms instead of 900. <code>Task.WhenAll</code> returns a task that completes when every task is done. For <code>Task&lt;T&gt;</code> inputs its result is a <code>T[]</code> in the <strong>same order as the tasks you passed</strong>, no matter which one finished first. You can also read <code>users.Result</code> after the <code>WhenAll</code>; at that point it is complete, so it does not block.</p><p>When you create the tasks with LINQ, as in the next example, call <code>ToList()</code>. LINQ is lazy (module 10), so without it the query would start a fresh set of tasks every time it is enumerated.</p>"
        },
        {
          type: "code",
          title: "WhenAll with a list of tasks",
          code: String.raw`int[] ids = { 3, 1, 2 };

// Select starts one task per id
List<Task<string>> tasks = ids.Select(FetchUserAsync).ToList();
string[] names = await Task.WhenAll(tasks);

foreach (string n in names)
    Console.WriteLine(n);

async Task<string> FetchUserAsync(int id)
{
    await Task.Delay(id * 100);   // id 1 finishes first
    return $"user #{id}";
}`,
          output: "user #3\nuser #1\nuser #2"
        },
        {
          type: "code",
          title: "Task.WhenAny: first one wins",
          code: String.raw`Task<string> primary = QueryAsync("primary server", 800);
Task<string> mirror = QueryAsync("mirror", 200);

Task<string> winner = await Task.WhenAny(primary, mirror);
Console.WriteLine($"Answer from {await winner}");

async Task<string> QueryAsync(string server, int ms)
{
    await Task.Delay(ms);
    return server;
}`,
          output: "Answer from mirror"
        },
        {
          type: "text",
          html: "<p><code>Task.WhenAny</code> completes as soon as <em>one</em> task completes, and its result is <strong>that task</strong> (not its value). That is why there are two awaits: one to wait for any task, and one to get the winner's result (or exception). The losing tasks keep running in the background. If they do real work you should cancel them, which is the topic of lesson 3.</p>"
        },
        {
          type: "code",
          title: "Task.Run for CPU-heavy work",
          code: String.raw`Task<long> sumTask = Task.Run(() =>
{
    long sum = 0;
    for (int i = 1; i <= 50_000_000; i++) sum += i % 7;
    return sum;
});

Console.WriteLine("Main thread is free while we count...");
long total = await sumTask;
Console.WriteLine($"Sum: {total}");`,
          output: "Main thread is free while we count...\nSum: 149999998"
        },
        {
          type: "text",
          html: "<p>There are two kinds of slow work:</p><ul><li><strong>I/O-bound</strong>: waiting for network, disk or a database. Use the library's async methods (<code>ReadAllTextAsync</code>, <code>GetStringAsync</code>). No thread is used during the wait.</li><li><strong>CPU-bound</strong>: crunching numbers, resizing images. Something has to do the work, so <code>Task.Run</code> moves it to a thread-pool thread and gives you a task to await. That keeps a UI responsive.</li></ul><p>Do not wrap I/O in <code>Task.Run</code> just to make it \"async\", and on a web server avoid <code>Task.Run</code> for request work: the request is already on a pool thread, so you only add overhead.</p>"
        },
        {
          type: "code",
          title: "Exceptions from several tasks",
          code: String.raw`Task a = FailAsync("disk full", 100);
Task b = FailAsync("timeout", 200);
Task ok = Task.Delay(50);
Task all = Task.WhenAll(a, b, ok);

try
{
    await all;
}
catch (Exception ex)
{
    Console.WriteLine($"await threw: {ex.Message}");
    foreach (var inner in all.Exception!.InnerExceptions)
        Console.WriteLine($"  also: {inner.Message}");
}

async Task FailAsync(string msg, int ms)
{
    await Task.Delay(ms);
    throw new InvalidOperationException(msg);
}`,
          output: "await threw: disk full\n  also: disk full\n  also: timeout"
        },
        {
          type: "text",
          html: "<p>An exception inside an async method is stored in its task and rethrown when you <code>await</code> it. <code>Task.WhenAll</code> waits for <em>all</em> tasks, even after one fails, and collects every exception in an <code>AggregateException</code> on its <code>Exception</code> property. <code>await</code> rethrows only the first one, so keep a reference to the <code>WhenAll</code> task if you need to log them all.</p>"
        },
        {
          type: "code",
          title: "Limiting how many run at once with SemaphoreSlim",
          code: String.raw`var gate = new SemaphoreSlim(2);   // at most 2 at a time
int running = 0, maxSeen = 0;

var jobs = Enumerable.Range(1, 6).Select(async i =>
{
    await gate.WaitAsync();
    try
    {
        int now = Interlocked.Increment(ref running);
        InterlockedMax(ref maxSeen, now);
        await Task.Delay(100);
        Interlocked.Decrement(ref running);
    }
    finally
    {
        gate.Release();
    }
}).ToList();

await Task.WhenAll(jobs);
Console.WriteLine($"6 jobs done, max running at once: {maxSeen}");

static void InterlockedMax(ref int target, int value)
{
    int seen;
    while (value > (seen = target)
        && Interlocked.CompareExchange(ref target, value, seen) != seen) { }
}`,
          output: "6 jobs done, max running at once: 2"
        },
        {
          type: "text",
          html: "<p>Starting 1000 downloads at once would overwhelm a server (and many APIs will reject you). <code>SemaphoreSlim</code> is a counter of free slots. <code>WaitAsync</code> takes a slot, waiting asynchronously if none are free, and <code>Release</code> gives it back. Always release in <code>finally</code> so a failing job does not leak a slot. (<code>Interlocked</code> is explained in lesson 5; here it just counts safely from several tasks.)</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "Each task waits a different time. What does this print?",
          code: String.raw`var t1 = WaitAndReturn(300, "slow");
var t2 = WaitAndReturn(100, "fast");
var t3 = WaitAndReturn(200, "medium");

Task<string> first = await Task.WhenAny(t1, t2, t3);
Console.WriteLine(await first);

string[] r = await Task.WhenAll(t1, t2, t3);
Console.WriteLine(string.Join(" ", r));

async Task<string> WaitAndReturn(int ms, string s)
{
    await Task.Delay(ms);
    return s;
}`,
          answer: "fast\nslow fast medium",
          explain: "<p><code>WhenAny</code> completes when the 100 ms task finishes, so the first line is <code>fast</code>. <code>WhenAll</code> then waits for the rest and returns the results in the order the tasks were passed in, not the order they finished.</p>"
        },
        {
          type: "fill",
          prompt: "Start both downloads at the same time and wait for both.",
          code: String.raw`Task<string> a = DownloadAsync("a.txt");
Task<string> b = DownloadAsync("b.txt");
string[] both = await Task.___(a, b);`,
          blanks: [["WhenAll"]],
          explain: "<p>Both tasks are started by the calls on the first two lines. <code>Task.WhenAll</code> waits for both and returns their results as an array in argument order.</p>"
        },
        {
          type: "bug",
          prompt: "These three independent API calls take 3 seconds in total instead of about 1 second. Why?",
          code: String.raw`var weather = await GetWeatherAsync();   // ~1 s
var news = await GetNewsAsync();         // ~1 s
var stocks = await GetStocksAsync();     // ~1 s`,
          options: [
            "await always takes at least one second",
            "Each call is awaited before the next one starts, so they run one after another",
            "The methods need Task.Run around them",
            "Async methods cannot run concurrently in a console app"
          ],
          answer: 1,
          explain: "<p>Awaiting immediately serializes the calls. Start all three first (<code>var w = GetWeatherAsync();</code> and so on) and then <code>await Task.WhenAll(w, n, s)</code>. <code>Task.Run</code> would add threads but the real fix is to stop waiting between independent calls.</p>"
        },
        {
          type: "mcq",
          prompt: "You need to resize 500 photos on the user's machine without freezing the UI. What fits best?",
          options: [
            "await Task.Delay for each photo",
            "Task.Run (or Parallel.ForEach inside Task.Run) because the work is CPU-bound",
            "Mark the resize method async and leave the code as it is",
            "Thread.Sleep between photos so the UI can redraw"
          ],
          answer: 1,
          explain: "<p>Resizing is CPU work. Marking a method <code>async</code> without awaiting anything does not move work off the UI thread (the compiler even warns, CS1998). <code>Task.Run</code> offloads it to the thread pool, and the UI awaits the result.</p>"
        }
      ],
      takeaways: [
        "Start independent tasks first, then await them together.",
        "Task.WhenAll returns results in argument order and collects all exceptions.",
        "Task.WhenAny returns the first finished task; await it again for its value.",
        "Task.Run is for CPU-bound work; I/O should use real async APIs.",
        "SemaphoreSlim limits how many operations run at once."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m12-l03",
      title: "Cancellation, timeouts and progress",
      minutes: 24,
      objectives: [
        "Cancel async work cooperatively with CancellationToken",
        "Apply timeouts with CancelAfter and WaitAsync",
        "Report progress through IProgress<T>",
        "Handle OperationCanceledException correctly"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Users change their minds. They press Cancel, close the window, or navigate away. Servers have timeouts. Long work must be stoppable. In .NET, cancellation is <strong>cooperative</strong>: you cannot kill a task from the outside. Instead you pass it a <code>CancellationToken</code>, and the task checks it and stops itself cleanly.</p><p>Two types work together:</p><ul><li><code>CancellationTokenSource</code> (the remote control): the code that wants to cancel owns it and calls <code>Cancel()</code>.</li><li><code>CancellationToken</code> (the receiver): passed into methods, which check <code>IsCancellationRequested</code> or pass it on to other async methods.</li></ul>"
        },
        {
          type: "code",
          title: "Cancelling a running job",
          code: String.raw`using var cts = new CancellationTokenSource();
cts.CancelAfter(450);   // cancel automatically after 450 ms

try
{
    await ProcessAsync(cts.Token);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Job was cancelled.");
}

async Task ProcessAsync(CancellationToken token)
{
    for (int step = 1; step <= 5; step++)
    {
        await Task.Delay(300, token);   // throws when cancelled
        Console.WriteLine($"Step {step} done");
    }
}`,
          output: "Step 1 done\nJob was cancelled."
        },
        {
          type: "text",
          html: "<p>Step 1 finishes at 300 ms. The cancel fires at 450 ms, in the middle of step 2's delay. Because the token was passed to <code>Task.Delay</code>, the delay ends early by throwing <code>TaskCanceledException</code>, which derives from <code>OperationCanceledException</code>. Always catch the base type.</p><p>The convention for async methods that can be cancelled is a last parameter <code>CancellationToken cancellationToken = default</code>. Pass the token down to every async call you make. Almost every .NET async API accepts one.</p>"
        },
        {
          type: "code",
          title: "Checking the token in CPU work",
          code: String.raw`using var cts = new CancellationTokenSource();

try
{
    long sum = SumSquares(1_000, cts, cancelAt: 600);
    Console.WriteLine(sum);
}
catch (OperationCanceledException)
{
    Console.WriteLine("Stopped early.");
}

static long SumSquares(int n, CancellationTokenSource cts, int cancelAt)
{
    long sum = 0;
    for (int i = 1; i <= n; i++)
    {
        if (i == cancelAt) cts.Cancel();   // simulate a user click
        cts.Token.ThrowIfCancellationRequested();
        sum += (long)i * i;
    }
    return sum;
}`,
          output: "Stopped early."
        },
        {
          type: "text",
          html: "<p>Code that does not await anything must check the token itself. <code>ThrowIfCancellationRequested()</code> throws <code>OperationCanceledException</code> if cancellation was requested and does nothing otherwise. Check it at sensible intervals, such as once per loop iteration or once per item, not millions of times per second in a tight inner loop.</p><p>In real code the method receives just the token. We passed the source here only to simulate a click at a predictable moment.</p>"
        },
        {
          type: "code",
          title: "Timeouts with WaitAsync",
          code: String.raw`try
{
    string data = await SlowServiceAsync()
        .WaitAsync(TimeSpan.FromMilliseconds(200));
    Console.WriteLine(data);
}
catch (TimeoutException)
{
    Console.WriteLine("Gave up after 200 ms.");
}

async Task<string> SlowServiceAsync()
{
    await Task.Delay(2000);
    return "finally!";
}`,
          output: "Gave up after 200 ms."
        },
        {
          type: "text",
          html: "<p><code>WaitAsync(TimeSpan)</code> (.NET 6+) stops <em>waiting</em> and throws <code>TimeoutException</code>. Note that it does not stop the slow operation itself, which keeps running. When the operation accepts a token, <code>cts.CancelAfter(timeout)</code> is better because it actually stops the work. You can also link a timeout with a user's cancel button:</p>"
        },
        {
          type: "code",
          title: "Linked tokens: user cancel OR timeout",
          code: String.raw`async Task<string> FetchAsync(string url, CancellationToken userToken)
{
    using var timeout = new CancellationTokenSource(
        TimeSpan.FromSeconds(10));
    using var linked = CancellationTokenSource
        .CreateLinkedTokenSource(userToken, timeout.Token);

    // cancelled if the user cancels OR 10 s pass
    return await Http.GetStringAsync(url, linked.Token);
}`
        },
        {
          type: "callout",
          tone: "tip",
          title: "Cancellation is not an error",
          html: "<p>When a user cancels, show a calm message, not an error dialog, and do not log it as a failure. A common pattern is <code>catch (OperationCanceledException) when (token.IsCancellationRequested)</code>, which handles only the cancellation you asked for and lets unexpected cancellations (like an internal HttpClient timeout) bubble up.</p>"
        },
        {
          type: "text",
          html: "<p>Long jobs should also tell the user how far along they are. The standard interface is <code>IProgress&lt;T&gt;</code>, with a single method <code>Report(T value)</code>. The worker method takes an <code>IProgress&lt;T&gt;?</code> and calls <code>Report</code>. It does not know or care whether the value ends up in a console, a progress bar or a log.</p>"
        },
        {
          type: "code",
          title: "Reporting progress",
          code: String.raw`var progress = new ConsoleProgress();
await CopyFilesAsync(4, progress);
Console.WriteLine("All files copied.");

async Task CopyFilesAsync(int count, IProgress<int>? progress)
{
    for (int i = 1; i <= count; i++)
    {
        await Task.Delay(100);              // copy one file
        progress?.Report(i * 100 / count);  // percent done
    }
}

class ConsoleProgress : IProgress<int>
{
    public void Report(int percent) =>
        Console.WriteLine($"Progress: {percent}%");
}`,
          output: "Progress: 25%\nProgress: 50%\nProgress: 75%\nProgress: 100%\nAll files copied."
        },
        {
          type: "callout",
          tone: "deep",
          title: "Progress<T> versus your own IProgress<T>",
          html: "<p>.NET ships a ready-made <code>Progress&lt;T&gt;</code> that takes a lambda: <code>new Progress&lt;int&gt;(p =&gt; bar.Value = p)</code>. It captures the <strong>synchronization context</strong> of the thread that created it. In WPF, WinForms or MAUI that is the UI thread, so the lambda runs where it is allowed to touch controls. That is exactly what you want in a UI app. A console app has no synchronization context, so <code>Progress&lt;T&gt;</code> runs the lambda on a thread-pool thread at some later moment. The messages can arrive out of order, or after \"All files copied\". In console tools, a small class like <code>ConsoleProgress</code> above is more predictable.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`using var cts = new CancellationTokenSource();
int done = 0;

try
{
    for (int i = 1; i <= 10; i++)
    {
        cts.Token.ThrowIfCancellationRequested();
        done++;
        if (done == 3) cts.Cancel();
    }
    Console.WriteLine("finished");
}
catch (OperationCanceledException)
{
    Console.WriteLine($"cancelled after {done}");
}
Console.WriteLine(cts.IsCancellationRequested);`,
          answer: "cancelled after 3\nTrue",
          explain: "<p>After the third item <code>Cancel()</code> is called. The next loop pass checks the token and throws, so \"finished\" never prints. Cancellation is sticky: the source stays cancelled, and a cancelled source cannot be reset.</p>"
        },
        {
          type: "fill",
          prompt: "Create a source that cancels itself after 5 seconds, and pass its token to the delay.",
          code: String.raw`using var cts = new ___();
cts.___(TimeSpan.FromSeconds(5));
await Task.Delay(10_000, cts.___);`,
          blanks: [["CancellationTokenSource"], ["CancelAfter"], ["Token"]],
          explain: "<p>The source owns the cancellation; <code>CancelAfter</code> schedules it. The method receives <code>cts.Token</code>, the read-only side. The delay will throw <code>TaskCanceledException</code> after 5 seconds.</p>"
        },
        {
          type: "bug",
          prompt: "The Cancel button calls <code>cts.Cancel()</code>, but the import keeps running to the end. Why?",
          code: String.raw`async Task ImportAsync(List<string> files, CancellationToken token)
{
    foreach (var f in files)
    {
        string text = await File.ReadAllTextAsync(f);
        await SaveToDatabaseAsync(text);
    }
}`,
          options: [
            "foreach loops cannot be cancelled",
            "The token is accepted but never checked or passed on, so nothing reacts to it",
            "Cancel() only works on Task.Run tasks",
            "File.ReadAllTextAsync cannot be cancelled"
          ],
          answer: 1,
          explain: "<p>Cancellation is cooperative. Pass the token on (<code>ReadAllTextAsync(f, token)</code>, <code>SaveToDatabaseAsync(text, token)</code>) and/or call <code>token.ThrowIfCancellationRequested()</code> at the top of the loop. Ignoring the token is a very common mistake.</p>"
        },
        {
          type: "mcq",
          prompt: "What happens to <code>SlowAsync()</code> after <code>await SlowAsync().WaitAsync(TimeSpan.FromSeconds(1))</code> throws <code>TimeoutException</code>?",
          options: [
            "It is stopped immediately",
            "It keeps running in the background; only the waiting stopped",
            "It is restarted",
            "The whole program exits"
          ],
          answer: 1,
          explain: "<p><code>WaitAsync</code> only limits how long <em>you</em> wait. To actually stop the work, the operation must accept a <code>CancellationToken</code> and you cancel it, for example with <code>CancelAfter</code>.</p>"
        },
        {
          type: "order",
          prompt: "Order the lines that run a job with a 2-second timeout.",
          lines: [
            "using var cts = new CancellationTokenSource();",
            "cts.CancelAfter(TimeSpan.FromSeconds(2));",
            "try",
            "{ await WorkAsync(cts.Token); }",
            "catch (OperationCanceledException) { Console.WriteLine(\"Timed out\"); }"
          ],
          explain: "<p>Create the source, schedule the timeout, then pass the token into the work inside <code>try</code>. The <code>catch</code> for <code>OperationCanceledException</code> comes last. Scheduling <code>CancelAfter</code> after the work has finished would be useless.</p>"
        }
      ],
      takeaways: [
        "Cancellation is cooperative: pass a CancellationToken and check it.",
        "CancellationTokenSource cancels; CancellationToken is what methods receive.",
        "Cancelled operations throw OperationCanceledException; catch the base type.",
        "WaitAsync stops waiting; CancelAfter stops the work.",
        "Report progress through IProgress<T> so workers stay UI-agnostic."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m12-l04",
      title: "HttpClient basics",
      minutes: 22,
      objectives: [
        "Make GET and POST requests with HttpClient",
        "Read JSON responses into typed objects",
        "Handle status codes, network errors and timeouts",
        "Reuse HttpClient correctly and test without a network"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Talking to web APIs is the most common real-world use of async. .NET's built-in tool is <code>HttpClient</code> in <code>System.Net.Http</code> (already in the implicit usings). Every network call is I/O-bound and can take anywhere from milliseconds to many seconds, so all its methods are async.</p><p>The examples in this lesson that touch the internet have no output shown, because the answer depends on the server. You can run them yourself when you are online.</p>"
        },
        {
          type: "code",
          title: "A simple GET",
          code: String.raw`using var http = new HttpClient();
http.DefaultRequestHeaders.UserAgent.ParseAdd("csharp-course/1.0");

string html = await http.GetStringAsync("https://example.com");
Console.WriteLine($"Got {html.Length} characters");
Console.WriteLine(html.Contains("<title>"));`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Create one HttpClient and reuse it",
          html: "<p>It is tempting to write <code>using var http = new HttpClient();</code> inside a method that runs for every request. Each instance opens its own connections, and disposed connections linger in the operating system for a while. Under load you run out of sockets (\"socket exhaustion\") and requests start failing. Create one <code>HttpClient</code> and keep it for the life of the program, for example in a <code>static readonly</code> field. In ASP.NET Core apps, use <code>IHttpClientFactory</code>, which manages this for you.</p>"
        },
        {
          type: "code",
          title: "Typed JSON with GetFromJsonAsync",
          code: String.raw`using System.Net.Http.Json;

using System.Text.Json;

var snake = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
};
var repo = await Api.Http.GetFromJsonAsync<Repo>(
    "https://api.github.com/repos/dotnet/runtime", snake);

Console.WriteLine($"{repo!.FullName}: {repo.StargazersCount} stars");

static class Api
{
    public static readonly HttpClient Http = CreateClient();

    static HttpClient CreateClient()
    {
        var c = new HttpClient { Timeout = TimeSpan.FromSeconds(15) };
        c.DefaultRequestHeaders.UserAgent.ParseAdd("csharp-course");
        return c;
    }
}

record Repo(string FullName, int StargazersCount);`
        },
        {
          type: "text",
          html: "<p><code>GetFromJsonAsync&lt;T&gt;</code> (namespace <code>System.Net.Http.Json</code>) sends the request, checks for success and deserializes the body in one step. Its defaults suit web APIs: property names match case-insensitively, so camelCase JSON like <code>fullName</code> fills <code>FullName</code>. It does not translate snake_case, though. GitHub sends <code>full_name</code> and <code>stargazers_count</code>, which is why the example passes options with <code>JsonNamingPolicy.SnakeCaseLower</code> (new in .NET 8). Without them both properties would silently stay empty, just like the mismatch you saw in module 11.</p>"
        },
        {
          type: "code",
          title: "Checking the status code yourself",
          code: String.raw`using System.Net;

class PageFetcher
{
    private static readonly HttpClient Http = new();

    public async Task<string?> TryGetAsync(
        string url, CancellationToken ct = default)
    {
        using HttpResponseMessage response =
            await Http.GetAsync(url, ct);

        if (response.StatusCode == HttpStatusCode.NotFound)
            return null;                     // a normal outcome

        response.EnsureSuccessStatusCode();  // throws for 4xx/5xx
        return await response.Content.ReadAsStringAsync(ct);
    }
}`
        },
        {
          type: "table",
          headers: ["Failure", "What you get"],
          rows: [
            ["Server answers 404, 500...", "<code>GetStringAsync</code> and <code>EnsureSuccessStatusCode</code> throw <code>HttpRequestException</code> with <code>StatusCode</code> set. <code>GetAsync</code> alone does not throw."],
            ["No network, DNS fails, connection refused", "<code>HttpRequestException</code> with <code>StatusCode</code> null."],
            ["Request exceeds <code>HttpClient.Timeout</code> (default 100 s)", "<code>TaskCanceledException</code> (with an inner <code>TimeoutException</code>)."],
            ["Your token was cancelled", "<code>TaskCanceledException</code>."],
            ["Body is not the JSON you expected", "<code>JsonException</code>."]
          ]
        },
        {
          type: "code",
          title: "Sending JSON with POST",
          code: String.raw`using System.Net.Http.Json;

var http = new HttpClient
{
    BaseAddress = new Uri("https://jsonplaceholder.typicode.com/")
};

var newPost = new { title = "Hello", body = "From C#", userId = 1 };
using var response = await http.PostAsJsonAsync("posts", newPost);
response.EnsureSuccessStatusCode();

var created = await response.Content.ReadFromJsonAsync<Post>();
Console.WriteLine($"Created post {created!.Id}");

record Post(int Id, string Title);`
        },
        {
          type: "text",
          html: "<p>Professionals do not hit real servers in unit tests: they are slow, flaky and may cost money. <code>HttpClient</code> is built on a pluggable <code>HttpMessageHandler</code>. Give it a fake handler and you can test your code completely offline. This snippet runs without any internet connection:</p>"
        },
        {
          type: "code",
          title: "An offline fake server",
          code: String.raw`using System.Net;
using System.Net.Http.Json;

var http = new HttpClient(new FakeHandler())
{
    BaseAddress = new Uri("https://api.test/")
};

var user = await http.GetFromJsonAsync<User>("users/7");
Console.WriteLine($"{user!.Name} ({user.Id})");

try
{
    await http.GetStringAsync("users/999");
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Failed: {(int?)ex.StatusCode} {ex.StatusCode}");
}

class FakeHandler : HttpMessageHandler
{
    protected override Task<HttpResponseMessage> SendAsync(
        HttpRequestMessage request, CancellationToken ct)
    {
        var response = request.RequestUri!.AbsolutePath == "/users/7"
            ? new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = JsonContent.Create(new User(7, "Ada"))
            }
            : new HttpResponseMessage(HttpStatusCode.NotFound);
        return Task.FromResult(response);
    }
}

record User(int Id, string Name);`,
          output: "Ada (7)\nFailed: 404 NotFound"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p><code>HttpClient</code> fills the role of <code>requests</code> or <code>httpx</code>. The main difference is that every call is async, and that you reuse one client like a <code>requests.Session</code>. <code>response.raise_for_status()</code> is <code>EnsureSuccessStatusCode()</code>.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "No network is involved here. What does this print?",
          code: String.raw`using System.Net;

var ok = new HttpResponseMessage(HttpStatusCode.Created);
var bad = new HttpResponseMessage(HttpStatusCode.NotFound);

Console.WriteLine(ok.IsSuccessStatusCode);
Console.WriteLine((int)bad.StatusCode);

try
{
    bad.EnsureSuccessStatusCode();
    Console.WriteLine("fine");
}
catch (HttpRequestException ex)
{
    Console.WriteLine(ex.StatusCode);
}`,
          answer: "True\n404\nNotFound",
          explain: "<p>Any 2xx code (201 Created included) counts as success. Casting the enum to <code>int</code> gives the numeric code. <code>EnsureSuccessStatusCode</code> throws for 404, and the exception's <code>StatusCode</code> prints as the enum name.</p>"
        },
        {
          type: "bug",
          prompt: "This web service works in testing, but under heavy load requests start failing with socket errors. What is the cause?",
          code: String.raw`public async Task<string> GetQuoteAsync()
{
    using var http = new HttpClient();
    return await http.GetStringAsync("https://quotes.test/today");
}`,
          options: [
            "GetStringAsync should be GetAsync",
            "A new HttpClient per call opens new connections each time, which exhausts sockets under load",
            "The method should not be async",
            "The using statement disposes the string"
          ],
          answer: 1,
          explain: "<p>Share one <code>HttpClient</code> (a static field) or use <code>IHttpClientFactory</code>. The <code>using</code> looks responsible, but disposing clients constantly is exactly what leaves sockets in the TIME_WAIT state.</p>"
        },
        {
          type: "fill",
          prompt: "Download and deserialize a JSON list of products in one call.",
          code: String.raw`using System.Net.Http.Json;

List<Product>? items = await http.___<List<Product>>(
    "products", cancellationToken);`,
          blanks: [["GetFromJsonAsync"]],
          explain: "<p><code>GetFromJsonAsync&lt;T&gt;</code> sends a GET, checks for success and deserializes the body. Its result is nullable because the body could be the JSON literal <code>null</code>.</p>"
        },
        {
          type: "mcq",
          prompt: "A request to a very slow server fails after 100 seconds. Which exception do you most likely see?",
          options: [
            "TimeoutException thrown directly",
            "HttpRequestException with StatusCode 408",
            "TaskCanceledException, because HttpClient.Timeout elapsed",
            "JsonException"
          ],
          answer: 2,
          explain: "<p><code>HttpClient.Timeout</code> defaults to 100 seconds and is implemented with cancellation, so you get <code>TaskCanceledException</code> (its inner exception is a <code>TimeoutException</code>). A 408 would only appear if the server itself replied with that code.</p>"
        }
      ],
      takeaways: [
        "HttpClient methods are async; every network call is I/O-bound.",
        "Reuse one HttpClient (or IHttpClientFactory); never one per request.",
        "GetFromJsonAsync / PostAsJsonAsync handle JSON in one step.",
        "Expect HttpRequestException, TaskCanceledException and JsonException.",
        "A fake HttpMessageHandler lets you test HTTP code offline."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m12-l05",
      title: "Threads, locks and thread-safe collections",
      minutes: 26,
      objectives: [
        "Explain what a race condition is and why it happens",
        "Protect shared data with lock and Interlocked",
        "Use Parallel.For / Parallel.ForEach for CPU-bound loops",
        "Choose ConcurrentDictionary and friends for shared collections"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>So far, async was about <em>waiting</em> efficiently. <strong>Parallelism</strong> is about doing CPU work on several cores at the same time. A <strong>thread</strong> is an independent path of execution; the operating system runs threads on the available cores. .NET keeps a <strong>thread pool</strong> of reusable threads, and <code>Task.Run</code>, <code>Parallel</code> and async continuations all use it.</p><p>You can still create a thread by hand, but you rarely should:</p>"
        },
        {
          type: "code",
          title: "A raw thread (for understanding only)",
          code: String.raw`var worker = new Thread(() =>
{
    for (int i = 1; i <= 3; i++)
        Console.WriteLine($"worker {i}");
});
worker.Start();
worker.Join();            // wait for the thread to end
Console.WriteLine("main done");`,
          output: "worker 1\nworker 2\nworker 3\nmain done"
        },
        {
          type: "text",
          html: "<p>Threads are expensive to create (about 1 MB of stack each) and give you no result or exception handling. <code>Task.Run</code> is the modern replacement. The concepts below apply no matter how the threads were started.</p><p>The danger with threads is <strong>shared mutable state</strong>. Look at this innocent counter:</p>"
        },
        {
          type: "code",
          title: "A race condition",
          code: String.raw`int counter = 0;

Parallel.For(0, 1_000_000, i =>
{
    counter++;     // read, add 1, write back: not atomic!
});

Console.WriteLine($"Expected 1000000, got {counter}");`
        },
        {
          type: "text",
          html: "<p>Run this and you will see a smaller number, different every time. <code>counter++</code> is three steps: read the value, add one, write it back. Two threads can both read 41, both compute 42, and both write 42. One increment is lost. This is a <strong>race condition</strong>: the result depends on the timing of threads. Race conditions are the worst kind of bug because they may pass every test and fail only in production under load.</p>"
        },
        {
          type: "code",
          title: "Fix 1: Interlocked for simple numbers",
          code: String.raw`int counter = 0;

Parallel.For(0, 1_000_000, i =>
{
    Interlocked.Increment(ref counter);   // atomic
});

Console.WriteLine($"Expected 1000000, got {counter}");`,
          output: "Expected 1000000, got 1000000"
        },
        {
          type: "code",
          title: "Fix 2: lock for anything more complex",
          code: String.raw`var account = new Account();

Parallel.For(0, 1000, i =>
{
    account.Deposit(10);
    account.Withdraw(5);
});
Console.WriteLine($"Balance: {account.Balance}");
Console.WriteLine($"Transactions: {account.Count}");

class Account
{
    private readonly object _sync = new();
    private decimal _balance;
    private int _count;

    public decimal Balance { get { lock (_sync) return _balance; } }
    public int Count { get { lock (_sync) return _count; } }

    public void Deposit(decimal amount)
    {
        lock (_sync)          // only one thread at a time in here
        {
            _balance += amount;
            _count++;
        }
    }

    public void Withdraw(decimal amount)
    {
        lock (_sync)
        {
            if (_balance < amount) return;
            _balance -= amount;
            _count++;
        }
    }
}`,
          output: "Balance: 5000\nTransactions: 2000"
        },
        {
          type: "text",
          html: "<p><code>lock (obj) { ... }</code> lets only one thread at a time into any block that locks the same object. Others wait at the door. Rules that keep you safe:</p><ul><li>Lock on a <strong>private</strong> object created for that purpose. Never lock on <code>this</code>, a string, or a type, because outside code could lock on the same thing.</li><li>Keep locked sections short. Do not call slow I/O inside a lock.</li><li>Every read and write of the shared data must be inside the lock, including reads (see the properties above).</li><li>You cannot <code>await</code> inside a <code>lock</code> (error CS1996). In async code use <code>SemaphoreSlim(1, 1)</code> with <code>await WaitAsync()</code> instead.</li></ul><p>The check and the withdrawal in <code>Withdraw</code> are in the same lock. If they were separate, two threads could both pass the check and overdraw the account.</p>"
        },
        {
          type: "code",
          title: "Parallel.ForEach with a thread-safe dictionary",
          code: String.raw`using System.Collections.Concurrent;

string[] lines =
{
    "the cat sat", "the dog ran", "a cat ran",
    "the end", "dog and cat"
};

var counts = new ConcurrentDictionary<string, int>();

Parallel.ForEach(lines, line =>
{
    foreach (string word in line.Split(' '))
        counts.AddOrUpdate(word, 1, (_, old) => old + 1);
});

foreach (var (word, n) in counts.OrderByDescending(p => p.Value)
                                .ThenBy(p => p.Key).Take(4))
    Console.WriteLine($"{word}: {n}");`,
          output: "cat: 3\nthe: 3\ndog: 2\nran: 2"
        },
        {
          type: "text",
          html: "<p>A normal <code>Dictionary</code> or <code>List</code> is <strong>not</strong> safe to modify from several threads; it can lose data, throw strange exceptions or even corrupt itself. <code>System.Collections.Concurrent</code> has thread-safe versions. <code>AddOrUpdate</code> and <code>GetOrAdd</code> do the read-and-write as one safe operation. Writing <code>counts[word] = counts[word] + 1</code> would bring the race right back, because the read and the write are two separate calls.</p><p>The iteration order of a dictionary is not guaranteed, which is why we sort before printing.</p>"
        },
        {
          type: "callout",
          tone: "tip",
          title: "Parallel is for CPU work",
          html: "<p><code>Parallel.For</code> and <code>Parallel.ForEach</code> split a loop across cores and block until it finishes. Use them for CPU-heavy items like image processing or calculations. Do not pass an async lambda to <code>Parallel.ForEach</code>: it becomes <code>async void</code> and the loop ends before the work does (next lesson). For async work use <code>Parallel.ForEachAsync</code> (.NET 6+) or <code>Task.WhenAll</code> with a <code>SemaphoreSlim</code>. And measure: for tiny items the overhead of parallelism can make the loop slower than a plain <code>foreach</code>.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p>CPython's Global Interpreter Lock lets only one thread run Python code at a time, so Python uses <code>multiprocessing</code> for CPU parallelism. .NET has no GIL: threads truly run in parallel on all cores. That is great for speed and means race conditions are real, so the locking rules here matter.</p>"
        }
      ],
      exercises: [
        {
          type: "mcq",
          prompt: "Why can <code>count++</code> from several threads lose increments?",
          options: [
            "Because int is too small",
            "Because ++ is a read, an add and a write, and threads can interleave between them",
            "Because Parallel.For skips some iterations",
            "Because the compiler removes the ++ in Release mode"
          ],
          answer: 1,
          explain: "<p>Two threads can read the same old value and both write old+1. <code>Interlocked.Increment(ref count)</code> performs all three steps as one indivisible (atomic) operation. Parallel.For runs every iteration exactly once.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`int total = 0;
var sync = new object();

Parallel.For(1, 101, i =>
{
    lock (sync) { total += i; }
});

long squares = 0;
Parallel.For(1, 11, i => Interlocked.Add(ref squares, i * i));

Console.WriteLine(total);
Console.WriteLine(squares);`,
          answer: "5050\n385",
          explain: "<p>Both loops protect the shared variable, so the result is the same as a normal loop: 1 + 2 + ... + 100 = 5050, and 1² + ... + 10² = 385. <code>Parallel.For</code> excludes the upper bound, so <code>(1, 101)</code> covers 1 to 100.</p>"
        },
        {
          type: "fill",
          prompt: "Count page visits safely from many threads.",
          code: String.raw`var visits = new ___<string, int>();

void Visit(string page) =>
    visits.___(page, 1, (_, old) => old + 1);`,
          blanks: [["ConcurrentDictionary"], ["AddOrUpdate"]],
          explain: "<p><code>ConcurrentDictionary</code> is safe for concurrent use. <code>AddOrUpdate</code> inserts 1 for a new key or applies the update function to the existing value as one safe operation.</p>"
        },
        {
          type: "bug",
          prompt: "This class is used from many threads. What is wrong with its locking?",
          code: String.raw`class Inventory
{
    private int _stock = 10;

    public bool TryTake()
    {
        if (_stock > 0)
        {
            lock (this) { _stock--; }
            return true;
        }
        return false;
    }
}`,
          options: [
            "Nothing, the decrement is locked",
            "The check is outside the lock, so two threads can both see 1 and take it, and locking on this is risky",
            "lock cannot be used on int fields",
            "TryTake must be async"
          ],
          answer: 1,
          explain: "<p>Check-then-act must happen inside one lock, or stock can go negative. Also lock on a private <code>readonly object</code>, not <code>this</code>, since outside code could lock on the same instance and cause deadlocks.</p>"
        }
      ],
      takeaways: [
        "Shared mutable state + threads = race conditions.",
        "Interlocked handles single numbers atomically.",
        "lock a private object around every access to data that changes together.",
        "Use concurrent collections and their atomic methods (AddOrUpdate).",
        "Parallel.For/ForEach are for CPU-bound loops, not async work."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m12-l06",
      title: "Async pitfalls and best practices",
      minutes: 22,
      objectives: [
        "Avoid async void and fire-and-forget bugs",
        "Explain why .Result and .Wait() cause deadlocks and wrapped exceptions",
        "Recognize the forgotten-await warning CS4014",
        "Apply professional async guidelines"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Async code reads like normal code, which is its strength. It also hides a handful of traps that every professional C# developer has fallen into at least once. This lesson collects the important ones so you can spot them in code reviews.</p>"
        },
        {
          type: "code",
          title: "Pitfall 1: forgetting await",
          code: String.raw`Console.WriteLine("Saving...");
SaveAsync();          // warning CS4014: not awaited
Console.WriteLine("Program ends.");

async Task SaveAsync()
{
    await Task.Delay(200);
    Console.WriteLine("Saved!");   // never printed
}`
        },
        {
          type: "text",
          html: "<p>This prints <code>Saving...</code> and <code>Program ends.</code> and nothing else. Without <code>await</code>, the program does not wait for the save, and the process exits before it finishes. Any exception inside <code>SaveAsync</code> would also vanish silently, because nobody looks at the task. The compiler warns you: <code>CS4014: Because this call is not awaited, execution of the current method continues before the call is completed</code>. Treat that warning as an error. Many teams configure it as one.</p>"
        },
        {
          type: "code",
          title: "Pitfall 2: async void",
          code: String.raw`// BAD: callers cannot await it or catch its exceptions
async void LoadBad()
{
    await Task.Delay(100);
    throw new InvalidOperationException("boom");
}

// GOOD: returns a Task that carries completion and errors
async Task LoadGood()
{
    await Task.Delay(100);
    throw new InvalidOperationException("boom");
}`
        },
        {
          type: "text",
          html: "<p>An <code>async void</code> method returns nothing the caller can await. An exception in it cannot be caught by the caller's <code>try/catch</code>; it is raised on the thread pool and <strong>crashes the whole process</strong>. The only legitimate use is event handlers (like a button's <code>Click</code>), whose signature must return <code>void</code>. Even then, put a <code>try/catch</code> inside the handler.</p><p>Watch for hidden async void: <code>list.ForEach(async x =&gt; await SaveAsync(x))</code> and <code>Parallel.ForEach(items, async x =&gt; ...)</code> both turn your lambda into <code>async void</code>, because those methods take an <code>Action</code>. They return immediately while the work is still running.</p>"
        },
        {
          type: "code",
          title: "Pitfall 3: .Wait() and .Result wrap exceptions",
          code: String.raw`Task<int> failing = ParseLaterAsync("abc");

try
{
    int n = failing.Result;           // blocks, then throws
}
catch (Exception ex)
{
    Console.WriteLine($".Result threw {ex.GetType().Name}");
    Console.WriteLine($"  inner: {ex.InnerException!.GetType().Name}");
}

try
{
    int n = await ParseLaterAsync("abc");
}
catch (Exception ex)
{
    Console.WriteLine($"await threw {ex.GetType().Name}");
}

async Task<int> ParseLaterAsync(string s)
{
    await Task.Delay(50);
    return int.Parse(s);
}`,
          output: ".Result threw AggregateException\n  inner: FormatException\nawait threw FormatException"
        },
        {
          type: "text",
          html: "<p><code>.Result</code> and <code>.Wait()</code> <strong>block</strong> the thread, which throws away the benefit of async, and they wrap failures in <code>AggregateException</code>, so your <code>catch (FormatException)</code> never fires. <code>await</code> unwraps the exception for you. If you really must block (rare), <code>task.GetAwaiter().GetResult()</code> at least throws the original exception.</p>"
        },
        {
          type: "callout",
          tone: "warning",
          title: "The classic deadlock",
          html: "<p>In a WPF or WinForms app (and old ASP.NET), calling <code>GetDataAsync().Result</code> on the UI thread can freeze the app forever. The UI thread blocks waiting for the task. Inside <code>GetDataAsync</code>, the code after <code>await</code> wants to continue <em>on the UI thread</em>, which is blocked. Each waits for the other. Console apps and ASP.NET Core have no synchronization context, so the same code \"works\" there, which is why the bug surprises people when they move code into a UI. The fix is to go <strong>async all the way</strong>: make the caller async and <code>await</code> instead of blocking.</p>"
        },
        {
          type: "code",
          title: "Library code: ConfigureAwait(false)",
          code: String.raw`public static class ReportLoader
{
    public static async Task<string[]> LoadLinesAsync(
        string path, CancellationToken ct = default)
    {
        // A library does not need to come back to the UI thread
        string text = await File.ReadAllTextAsync(path, ct)
            .ConfigureAwait(false);
        return text.Split('\n');
    }
}`
        },
        {
          type: "text",
          html: "<p><code>ConfigureAwait(false)</code> tells the awaiter \"I do not need to resume on the original context\". In reusable library code it avoids needless hops to the UI thread and protects against the deadlock above. In application code (UI handlers, ASP.NET Core controllers) you normally leave it out, because UI code must come back to the UI thread to touch controls.</p>"
        },
        {
          type: "table",
          headers: ["Do", "Avoid"],
          rows: [
            ["<code>async Task</code> / <code>async Task&lt;T&gt;</code>", "<code>async void</code> (except event handlers)"],
            ["<code>await</code> every task you start, or store it and await later", "Fire-and-forget calls (CS4014)"],
            ["Async all the way up to <code>Main</code> or the handler", "<code>.Result</code>, <code>.Wait()</code>"],
            ["<code>await Task.Delay</code>", "<code>Thread.Sleep</code> in async code"],
            ["Accept and pass a <code>CancellationToken</code>", "Ignoring tokens you were given"],
            ["<code>Task.WhenAll</code> for independent work", "Awaiting one by one in a loop when order does not matter"],
            ["Name methods <code>...Async</code>", "Async methods that never await (CS1998)"]
          ]
        },
        {
          type: "callout",
          tone: "deep",
          title: "ValueTask in one paragraph",
          html: "<p>You will see <code>ValueTask&lt;T&gt;</code> in high-performance APIs. It avoids allocating a <code>Task</code> object when the result is usually available immediately (for example, a cache hit). It comes with rules: await it exactly once and never call <code>.Result</code> on an unfinished one. In your own code, return <code>Task</code> unless profiling shows the allocation matters.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`Task t = FailAsync();
try
{
    t.Wait();
}
catch (InvalidOperationException)
{
    Console.WriteLine("caught IOE");
}
catch (AggregateException ae)
{
    Console.WriteLine($"caught AE: {ae.InnerException!.Message}");
}

async Task FailAsync()
{
    await Task.Delay(10);
    throw new InvalidOperationException("bad state");
}`,
          answer: "caught AE: bad state",
          explain: "<p><code>.Wait()</code> wraps the failure in an <code>AggregateException</code>, so the <code>InvalidOperationException</code> catch is skipped. With <code>await t</code> instead, the first catch would run.</p>"
        },
        {
          type: "bug",
          prompt: "This should save every order before printing \"All saved\", but the message appears first and some orders are never saved. Why?",
          code: String.raw`orders.ForEach(async o => await SaveOrderAsync(o));
Console.WriteLine("All saved");`,
          options: [
            "ForEach does not exist on List<T>",
            "The async lambda becomes async void because ForEach takes an Action, so nothing waits for the saves",
            "SaveOrderAsync must be called with Task.Run",
            "await is not allowed inside a lambda"
          ],
          answer: 1,
          explain: "<p><code>List.ForEach</code> takes an <code>Action&lt;T&gt;</code>, so the lambda is <code>async void</code>. Use <code>foreach (var o in orders) await SaveOrderAsync(o);</code> or <code>await Task.WhenAll(orders.Select(SaveOrderAsync));</code>.</p>"
        },
        {
          type: "mcq",
          prompt: "A WPF button handler does <code>var data = LoadAsync().Result;</code> and the window freezes forever. What is happening?",
          options: [
            "LoadAsync has an infinite loop",
            "The UI thread blocks on .Result while LoadAsync waits to resume on that same UI thread: a deadlock",
            ".Result is not allowed in WPF",
            "The network is slow"
          ],
          answer: 1,
          explain: "<p>Each side waits for the other. Make the handler <code>async void</code> (allowed for event handlers) and write <code>var data = await LoadAsync();</code>. Library code can add <code>ConfigureAwait(false)</code> as extra protection.</p>"
        },
        {
          type: "fill",
          prompt: "Fix the method signature so callers can await it and catch its exceptions.",
          code: String.raw`async ___ SendEmailAsync(string to)
{
    await smtp.SendAsync(to);
}

___ SendEmailAsync("x@y.com");`,
          blanks: [["Task"], ["await"]],
          explain: "<p>Return <code>Task</code> instead of <code>void</code>. Now the caller can <code>await</code> the call, which waits for completion and rethrows any exception where it can be caught.</p>"
        },
        {
          type: "order",
          prompt: "Rewrite blocking code to be async all the way. Put the lines in order.",
          lines: [
            "static async Task Main()",
            "{",
            "    var report = await BuildReportAsync();",
            "    await File.WriteAllTextAsync(\"report.txt\", report);",
            "    Console.WriteLine(\"Done\");",
            "}"
          ],
          explain: "<p>Main itself is async, so it can await every step. No <code>.Result</code> or <code>.Wait()</code> is needed anywhere, and exceptions surface with their original types.</p>"
        }
      ],
      takeaways: [
        "Always await tasks you start; treat CS4014 as an error.",
        "async void is only for event handlers; it crashes on unhandled exceptions.",
        ".Result and .Wait() block, wrap exceptions and can deadlock UI apps.",
        "Go async all the way; use ConfigureAwait(false) in library code.",
        "Prefer Task over ValueTask unless profiling says otherwise."
      ]
    }
  ],
  milestone: {
    id: "m12-project",
    title: "Download Manager Simulator",
    brief: "<p>Build a console download manager that \"downloads\" a list of files concurrently. There is no network involved: each download is simulated with <code>Task.Delay</code>, one chunk at a time, so the program runs anywhere.</p><p>The user chooses how many downloads may run at the same time. Each file reports its progress, one file is corrupt and fails, and one file is so big it hits the per-file timeout. At the end the manager prints a summary of what succeeded, failed or timed out, and the total size downloaded.</p>",
    skills: [
      "async / await",
      "Task.WhenAll",
      "SemaphoreSlim",
      "CancellationTokenSource and CancelAfter",
      "IProgress<T>",
      "lock and Interlocked",
      "Exception handling in tasks"
    ],
    requirements: [
      "Ask for the maximum number of parallel downloads (1-4); use 2 if the input is empty, invalid or missing.",
      "Simulate each file as chunks of 100 KB, each chunk taking a Task.Delay based on a per-file speed.",
      "Never run more downloads at once than the chosen limit (use SemaphoreSlim and release it in finally).",
      "Give each download its own CancellationTokenSource with a 3-second timeout and pass its token to Task.Delay.",
      "Report progress through IProgress<T> at 50% and 100% of each file; console writes must not interleave (use lock).",
      "A file named corrupt.bin throws an IOException halfway; the manager records it as failed and continues with the others.",
      "Collect a result (file, status, bytes) for every file using Task.WhenAll and print a summary table in the original file order.",
      "Track the total downloaded bytes with Interlocked and print it in KB."
    ],
    sampleRun: "Max parallel downloads (1-4) [2]: 3\nStarting 5 downloads, 3 at a time...\n  readme.txt    50%\n  readme.txt   100%\n  photo.jpg     50%\n  corrupt.bin   50%\n  photo.jpg    100%\n  setup.exe     50%\n  setup.exe    100%\n\nSummary\nreadme.txt   Done         200 KB\nphoto.jpg    Done         800 KB\nvideo.mp4    Timed out   5700 KB\ncorrupt.bin  Failed       500 KB\nsetup.exe    Done        1200 KB\nTotal downloaded: 8400 KB in 3.0 s",
    starter: String.raw`using System.Diagnostics;

var files = new List<FileJob>
{
    new("readme.txt", 200, 30),
    new("photo.jpg", 800, 60),
    new("video.mp4", 12000, 50),
    new("corrupt.bin", 1000, 40),
    new("setup.exe", 1200, 50)
};

Console.Write("Max parallel downloads (1-4) [2]: ");
string? input = Console.ReadLine();
int maxParallel = 2;
// TODO: parse input; keep 2 unless it is a number from 1 to 4

var consoleLock = new object();
long totalBytes = 0;
var progress = new ConsoleProgress(consoleLock);

// TODO: create a SemaphoreSlim limiting parallel downloads
Console.WriteLine(
    $"Starting {files.Count} downloads, {maxParallel} at a time...");
var sw = Stopwatch.StartNew();

// TODO: start one DownloadAsync task per file and await them all
Result[] results = Array.Empty<Result>();

sw.Stop();
Console.WriteLine();
Console.WriteLine("Summary");
// TODO: print each result and the total in KB and seconds

async Task<Result> DownloadAsync(FileJob job)
{
    // TODO: wait for the semaphore, release it in finally
    // TODO: 3 s timeout with CancellationTokenSource
    // TODO: loop over 100 KB chunks with Task.Delay(job.MsPerChunk, token)
    // TODO: corrupt.bin throws IOException halfway
    // TODO: report 50% and 100%, add bytes with Interlocked.Add
    // TODO: map exceptions to "Timed out" or "Failed"
    await Task.CompletedTask;
    return new Result(job.Name, "Done", 0);
}

record FileJob(string Name, int SizeKb, int MsPerChunk);
record Result(string Name, string Status, int Kb);
record DownloadProgress(string Name, int Percent);

class ConsoleProgress : IProgress<DownloadProgress>
{
    private readonly object _lock;
    public ConsoleProgress(object consoleLock) => _lock = consoleLock;

    public void Report(DownloadProgress p)
    {
        // TODO: print "  name   NN%" inside a lock
    }
}`,
    hints: [
      "<p>Parse with <code>int.TryParse(input, out int n) &amp;&amp; n is &gt;= 1 and &lt;= 4</code>. <code>TryParse</code> handles <code>null</code> input by returning <code>false</code>, so empty stdin keeps the default.</p>",
      "<p>Start all tasks with <code>files.Select(DownloadAsync).ToList()</code> and then <code>await Task.WhenAll(tasks)</code>. The result array keeps the original file order even though the downloads finish in a different order.</p>",
      "<p>Inside <code>DownloadAsync</code>: <code>await gate.WaitAsync();</code> then a <code>try { ... } finally { gate.Release(); }</code>. Create <code>using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));</code> after you got the slot, so time spent waiting in the queue does not count.</p>",
      "<p>Number of chunks: <code>job.SizeKb / 100</code>. After each chunk add 100 KB to a local counter and do <code>Interlocked.Add(ref totalBytes, 100 * 1024)</code>. Report when <code>done * 2 == chunks</code> (50%) and when <code>done == chunks</code>.</p>",
      "<p>Catch <code>OperationCanceledException</code> first and return status \"Timed out\" with the KB done so far, then catch <code>IOException</code> and return \"Failed\". Keep the KB counter outside the <code>try</code> so both catch blocks can use it.</p>"
    ],
    solution: String.raw`using System.Diagnostics;

var files = new List<FileJob>
{
    new("readme.txt", 200, 30),
    new("photo.jpg", 800, 60),
    new("video.mp4", 12000, 50),
    new("corrupt.bin", 1000, 40),
    new("setup.exe", 1200, 50)
};

Console.Write("Max parallel downloads (1-4) [2]: ");
string? input = Console.ReadLine();
int maxParallel = 2;
if (int.TryParse(input, out int n) && n is >= 1 and <= 4)
    maxParallel = n;

var consoleLock = new object();
long totalBytes = 0;
var progress = new ConsoleProgress(consoleLock);
var gate = new SemaphoreSlim(maxParallel);

Console.WriteLine(
    $"Starting {files.Count} downloads, {maxParallel} at a time...");
var sw = Stopwatch.StartNew();

List<Task<Result>> tasks = files.Select(DownloadAsync).ToList();
Result[] results = await Task.WhenAll(tasks);

sw.Stop();
Console.WriteLine();
Console.WriteLine("Summary");
foreach (var r in results)
    Console.WriteLine($"{r.Name,-12} {r.Status,-10} {r.Kb,5} KB");
long totalKb = Interlocked.Read(ref totalBytes) / 1024;
Console.WriteLine(
    $"Total downloaded: {totalKb} KB in {sw.Elapsed.TotalSeconds:F1} s");

async Task<Result> DownloadAsync(FileJob job)
{
    await gate.WaitAsync();
    int doneKb = 0;
    try
    {
        using var cts = new CancellationTokenSource(
            TimeSpan.FromSeconds(3));
        int chunks = job.SizeKb / 100;

        for (int done = 1; done <= chunks; done++)
        {
            await Task.Delay(job.MsPerChunk, cts.Token);

            if (job.Name == "corrupt.bin" && done * 2 > chunks)
                throw new IOException("checksum mismatch");

            doneKb += 100;
            Interlocked.Add(ref totalBytes, 100 * 1024);

            if (done * 2 == chunks || done == chunks)
                progress.Report(new DownloadProgress(
                    job.Name, done * 100 / chunks));
        }
        return new Result(job.Name, "Done", doneKb);
    }
    catch (OperationCanceledException)
    {
        return new Result(job.Name, "Timed out", doneKb);
    }
    catch (IOException)
    {
        return new Result(job.Name, "Failed", doneKb);
    }
    finally
    {
        gate.Release();
    }
}

record FileJob(string Name, int SizeKb, int MsPerChunk);
record Result(string Name, string Status, int Kb);
record DownloadProgress(string Name, int Percent);

class ConsoleProgress : IProgress<DownloadProgress>
{
    private readonly object _lock;
    public ConsoleProgress(object consoleLock) => _lock = consoleLock;

    public void Report(DownloadProgress p)
    {
        lock (_lock)
        {
            Console.WriteLine($"  {p.Name,-12} {p.Percent,3}%");
        }
    }
}`,
    stretch: [
      "Add retries: a failed download is retried up to 2 times with an increasing delay (200 ms, then 400 ms) before it counts as failed.",
      "Let the user cancel everything by pressing Enter, using one shared CancellationTokenSource linked with each per-file timeout via CreateLinkedTokenSource.",
      "Draw a single-line text progress bar per file ([#####.....]) that updates in place using Console.SetCursorPosition.",
      "Replace the semaphore loop with Parallel.ForEachAsync and MaxDegreeOfParallelism, and compare the code."
    ]
  }
});
