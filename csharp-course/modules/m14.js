(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m14",
  number: 14,
  title: "Professional C#",
  tagline: "Solutions, tests, dependency injection, logging and a real Web API: how C# is built and shipped at work.",
  level: "Advanced",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m14-l01",
      title: "Solutions, class libraries and NuGet",
      minutes: 28,
      objectives: [
        "Explain the difference between a solution, a project and an assembly",
        "Split an app into a class library, an app project and a test project",
        "Control what other projects can see with public and internal",
        "Add, update and audit NuGet packages"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>Every program in this course so far has been one project with one <code>Program.cs</code>. Real applications are bigger. A company app might have a web API, a background worker, a command-line admin tool and three test projects, all sharing the same business rules.</p><p>Copying the rules into each app would be a disaster: fix a bug in one place and the others stay broken. So professionals put shared code into a <strong>class library</strong> and let every app reference it.</p>`
        },
        {
          type: "table",
          headers: ["Term", "What it is", "File"],
          rows: [
            ["Solution", "a container that groups related projects so you can build and test them together", "<code>TaskTracker.sln</code>"],
            ["Project", "one unit of compilation with its own settings and dependencies", "<code>TaskTracker.Core.csproj</code>"],
            ["Assembly", "what a project compiles into", "<code>TaskTracker.Core.dll</code>"],
            ["Class library", "a project with no entry point; other projects use its types", "<code>dotnet new classlib</code>"],
            ["Package", "a zipped, versioned assembly published to a feed such as nuget.org", "<code>.nupkg</code>"]
          ]
        },
        {
          type: "steps",
          items: [
            String.raw`<code>mkdir TaskTracker</code> then <code>cd TaskTracker</code>`,
            String.raw`<code>dotnet new sln -n TaskTracker</code> creates the empty solution file.`,
            String.raw`<code>dotnet new classlib -o src/TaskTracker.Core</code> creates the library for business rules.`,
            String.raw`<code>dotnet new console -o src/TaskTracker.Cli</code> creates an app that will use the library.`,
            String.raw`<code>dotnet new xunit -o tests/TaskTracker.Tests</code> creates a test project.`,
            String.raw`<code>dotnet sln add src/TaskTracker.Core src/TaskTracker.Cli tests/TaskTracker.Tests</code> puts all three in the solution.`,
            String.raw`<code>dotnet add src/TaskTracker.Cli reference src/TaskTracker.Core</code> lets the app use the library.`,
            String.raw`<code>dotnet add tests/TaskTracker.Tests reference src/TaskTracker.Core</code> lets the tests use it too.`,
            String.raw`<code>dotnet build</code> and <code>dotnet test</code> from the root folder now build and test everything.`
          ]
        },
        {
          type: "code",
          title: "The resulting layout",
          code: String.raw`TaskTracker/
    TaskTracker.sln
    src/
        TaskTracker.Core/          <- class library (no Main)
            TaskTracker.Core.csproj
            TaskItem.cs
        TaskTracker.Cli/           <- console app
            TaskTracker.Cli.csproj
            Program.cs
    tests/
        TaskTracker.Tests/         <- xUnit test project
            TaskTracker.Tests.csproj
            TaskItemTests.cs`
        },
        {
          type: "text",
          html: String.raw`<p>The dependency arrows point <em>inward</em>: the app and the tests depend on Core, and Core depends on neither. That rule keeps the business logic free of UI and database details, so you can reuse it in a web API later without changing a line. A reference cycle (A needs B, B needs A) is not allowed; the build fails.</p>`
        },
        {
          type: "code",
          title: "TaskTracker.Cli.csproj after adding a reference",
          code: String.raw`<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <ItemGroup>
    <ProjectReference
      Include="..\TaskTracker.Core\TaskTracker.Core.csproj" />
  </ItemGroup>

</Project>`
        },
        {
          type: "code",
          title: "Namespaces and access across projects (simulated in one file)",
          code: String.raw`using TaskTracker.Core;

var calc = new PriceCalculator();
Console.WriteLine(calc.WithVat(100m));
Console.WriteLine(typeof(PriceCalculator).FullName);

// In a real solution this namespace lives in TaskTracker.Core.dll
namespace TaskTracker.Core
{
    public class PriceCalculator
    {
        // internal: visible inside this assembly only
        internal const decimal VatRate = 0.25m;

        public decimal WithVat(decimal net) => net * (1 + VatRate);
    }
}`,
          output: String.raw`125.00
TaskTracker.Core.PriceCalculator`
        },
        {
          type: "text",
          html: String.raw`<p>Access modifiers matter much more once you have several projects:</p><ul><li><code>public</code>: any project that references this one can use it. This is your library's API, so keep it small.</li><li><code>internal</code> (the default for top-level classes): only code in the same assembly can use it. Try to use an internal class from another project and you get <strong>CS0122</strong>: "'PriceHelper' is inaccessible due to its protection level."</li></ul><p>Test projects often need internals. Add <code>&lt;InternalsVisibleTo Include="TaskTracker.Tests" /&gt;</code> to the library's <code>.csproj</code> and the test project can see them, while other projects still cannot.</p>`
        },
        {
          type: "text",
          html: String.raw`<p><strong>NuGet</strong> is .NET's package manager. <code>dotnet add package Humanizer</code> downloads the package, adds a <code>&lt;PackageReference Include="Humanizer" Version="2.14.1" /&gt;</code> line to your <code>.csproj</code>, and restores it into a shared cache (<code>~/.nuget/packages</code>). Packages can depend on other packages; those <em>transitive</em> dependencies are pulled in automatically.</p>`
        },
        {
          type: "table",
          headers: ["Command", "What it does"],
          rows: [
            ["<code>dotnet add package Serilog</code>", "adds the latest stable version"],
            ["<code>dotnet add package Serilog --version 3.1.1</code>", "adds a specific version"],
            ["<code>dotnet remove package Serilog</code>", "removes the reference"],
            ["<code>dotnet list package --outdated</code>", "shows packages with newer versions"],
            ["<code>dotnet list package --vulnerable</code>", "shows packages with known security issues"],
            ["<code>dotnet restore</code>", "downloads everything the projects need (build does this for you)"]
          ]
        },
        {
          type: "callout",
          tone: "python",
          title: "pip and requirements.txt, but per project",
          html: String.raw`<p><code>dotnet add package</code> is like <code>pip install</code> plus writing <code>requirements.txt</code> in one step. You do not need a virtual environment: each project lists its own packages in its <code>.csproj</code>, and the shared cache can hold several versions side by side.</p>`
        },
        {
          type: "callout",
          tone: "tip",
          title: "Shared settings for the whole solution",
          html: String.raw`<p>Put a <code>Directory.Build.props</code> file in the root folder and every project below it inherits its settings. Teams use it to switch on <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> and <code>&lt;TreatWarningsAsErrors&gt;true&lt;/TreatWarningsAsErrors&gt;</code> everywhere. For package versions, <code>Directory.Packages.props</code> (Central Package Management) keeps one version of each package for the whole solution.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Choose packages with care",
          html: String.raw`<p>Every package is code you did not write but must ship and patch. Before adding one, check: is it maintained (recent releases)? Is it widely used (download count)? What license does it have? Does it pull in a long list of dependencies? Run <code>dotnet list package --vulnerable</code> regularly, or let your CI do it.</p>`
        }
      ],
      exercises: [
        {
          type: "order",
          prompt: "Order the steps to build a class library that uses a NuGet package and package it for other teams.",
          lines: [
            "dotnet new classlib -o src/Shop.Core",
            "dotnet add src/Shop.Core package Humanizer",
            "Write a public class in Shop.Core that calls Humanizer",
            "dotnet build src/Shop.Core",
            "dotnet pack src/Shop.Core -c Release"
          ],
          explain: String.raw`<p>The project must exist before you can add a package to it, and the package must be referenced before your code can use it. <code>dotnet build</code> proves it compiles, and <code>dotnet pack</code> turns the library into a <code>.nupkg</code> file that you can push to nuget.org or a private company feed.</p>`
        },
        {
          type: "fill",
          prompt: "Make the console app use the class library.",
          code: String.raw`dotnet add src/Shop.App ___ src/Shop.Core`,
          blanks: [["reference"]],
          explain: String.raw`<p><code>dotnet add &lt;project&gt; reference &lt;other project&gt;</code> writes a <code>&lt;ProjectReference&gt;</code> into the first project's <code>.csproj</code>. Compare <code>dotnet add &lt;project&gt; package &lt;name&gt;</code>, which adds a NuGet package instead.</p>`
        },
        {
          type: "output",
          prompt: "What does this program print?",
          code: String.raw`using Billing = Shop.Billing;

var a = new Billing.Invoice();
var b = new Shop.Shipping.Invoice();
Console.WriteLine(a.Describe());
Console.WriteLine(b.Describe());
Console.WriteLine(typeof(Billing.Invoice).FullName);

namespace Shop.Billing
{
    public class Invoice
    {
        public string Describe() => "money owed";
    }
}

namespace Shop.Shipping
{
    public class Invoice
    {
        public string Describe() => "packing list";
    }
}`,
          answer: String.raw`money owed
packing list
Shop.Billing.Invoice`,
          explain: String.raw`<p>Two classes can share the name <code>Invoice</code> because they live in different namespaces. <code>using Billing = Shop.Billing;</code> is a namespace alias, which is handy when two libraries clash. <code>FullName</code> always shows the real namespace, never the alias.</p>`
        },
        {
          type: "bug",
          prompt: "The app project references the library, yet this line fails with CS0122. Why?",
          code: String.raw`// In Shop.Core (class library)
namespace Shop.Core;
class TaxRules
{
    public static decimal Rate => 0.2m;
}

// In Shop.App (console app)
decimal rate = Shop.Core.TaxRules.Rate;`,
          options: [
            "TaxRules has no access modifier, so it is internal and invisible outside Shop.Core",
            "Static properties cannot be used from another project",
            "The app must reference the .dll file instead of the project",
            "decimal values cannot cross assembly boundaries"
          ],
          answer: 0,
          explain: String.raw`<p>A top-level class without a modifier is <code>internal</code>. Its public members do not help, because the class itself is hidden. Mark it <code>public class TaxRules</code>. Project references are the right way to link; static members and decimals work across assemblies like anything else.</p>`
        },
        {
          type: "mcq",
          prompt: "You run <code>dotnet build</code> on a class library. What do you get?",
          options: [
            "A .dll file that other projects can reference, but cannot run on its own",
            "An .exe you can double-click",
            "A .nupkg ready to upload to nuget.org",
            "Nothing, libraries are only compiled as part of an app"
          ],
          answer: 0,
          explain: String.raw`<p>A class library has no entry point, so the build produces just an assembly (<code>.dll</code>). Packaging into a <code>.nupkg</code> is a separate step, <code>dotnet pack</code>. Libraries build on their own, which is how you know they compile before any app uses them.</p>`
        }
      ],
      takeaways: [
        "A solution groups projects; each project compiles to one assembly.",
        "Put business rules in a class library; apps and tests reference it.",
        "public is your library's API; internal hides details (CS0122 if you reach in).",
        "NuGet packages are PackageReference lines in the .csproj; audit them with dotnet list package."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m14-l02",
      title: "Unit testing with xUnit",
      minutes: 32,
      objectives: [
        "Write tests with [Fact] and [Theory] using the Arrange-Act-Assert shape",
        "Use the most common Assert methods correctly",
        "Run tests with dotnet test and read the results",
        "Tell a good unit test from a fragile one"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>A <strong>unit test</strong> is a small method that calls your code with known inputs and checks the result. You write it once and run it thousands of times: on every build, before every commit, in CI for every pull request.</p><p>Tests give you a safety net. When you refactor a 200-line method, the tests tell you within seconds whether you broke anything. When a bug is reported, you write a test that reproduces it, fix the code, and the bug can never quietly come back. That is called a <em>regression test</em>.</p>`
        },
        {
          type: "code",
          title: "The code under test (TaskTracker.Core)",
          code: String.raw`namespace TaskTracker.Core;

public static class PriorityParser
{
    public static int Parse(string text)
    {
        ArgumentNullException.ThrowIfNull(text);
        return text.Trim().ToLowerInvariant() switch
        {
            "low" => 1,
            "normal" or "" => 2,
            "high" => 3,
            _ => throw new FormatException($"Unknown priority '{text}'")
        };
    }
}`
        },
        {
          type: "code",
          title: "PriorityParserTests.cs (TaskTracker.Tests)",
          code: String.raw`using TaskTracker.Core;

namespace TaskTracker.Tests;

public class PriorityParserTests
{
    [Fact]
    public void Parse_High_ReturnsThree()
    {
        // Arrange
        string input = "high";

        // Act
        int result = PriorityParser.Parse(input);

        // Assert
        Assert.Equal(3, result);
    }

    [Theory]
    [InlineData("low", 1)]
    [InlineData("  LOW ", 1)]
    [InlineData("", 2)]
    [InlineData("High", 3)]
    public void Parse_KnownText_ReturnsLevel(string text, int expected)
    {
        Assert.Equal(expected, PriorityParser.Parse(text));
    }

    [Fact]
    public void Parse_UnknownText_ThrowsFormatException()
    {
        var ex = Assert.Throws<FormatException>(
            () => PriorityParser.Parse("urgent"));
        Assert.Contains("urgent", ex.Message);
    }
}`
        },
        {
          type: "text",
          html: String.raw`<p><code>[Fact]</code> marks a test that takes no parameters: one fixed scenario. <code>[Theory]</code> marks a test that runs once per <code>[InlineData]</code> row, so one method covers four cases above. Each row shows up as its own pass or fail in the results.</p><p>Every test follows <strong>Arrange, Act, Assert</strong>: set up the inputs, call the one thing you are testing, check the result. Short tests often merge the steps into one line, as in the theory.</p>`
        },
        {
          type: "code",
          title: "Terminal: running the tests",
          code: String.raw`$ dotnet test
  Determining projects to restore...
  TaskTracker.Core -> .../TaskTracker.Core.dll
  TaskTracker.Tests -> .../TaskTracker.Tests.dll
Starting test execution, please wait...

Passed!  - Failed: 0, Passed: 6, Skipped: 0, Total: 6

$ dotnet test --filter "FullyQualifiedName~PriorityParser"
$ dotnet watch test      # re-run on every save`
        },
        {
          type: "table",
          headers: ["Assert", "Passes when"],
          rows: [
            ["<code>Assert.Equal(expected, actual)</code>", "values are equal (for collections: same items in the same order)"],
            ["<code>Assert.NotEqual(a, b)</code>", "values differ"],
            ["<code>Assert.True(cond)</code> / <code>Assert.False(cond)</code>", "the condition has that value"],
            ["<code>Assert.Null(x)</code> / <code>Assert.NotNull(x)</code>", "x is (not) null"],
            ["<code>Assert.Contains(item, list)</code>", "the collection or string contains it"],
            ["<code>Assert.Empty(list)</code> / <code>Assert.Single(list)</code>", "zero items / exactly one item (Single returns it)"],
            ["<code>Assert.Throws&lt;T&gt;(() =&gt; ...)</code>", "the code throws exactly T (returns the exception)"],
            ["<code>Assert.Equal(0.3, x, precision: 10)</code>", "doubles match to 10 decimal places"]
          ]
        },
        {
          type: "callout",
          tone: "warning",
          title: "expected comes first",
          html: String.raw`<p><code>Assert.Equal(expected, actual)</code>. Swap them and the test still passes or fails correctly, but the failure message lies: "Expected: 7, Actual: 3" when your code actually returned 7. That costs real debugging time at 2 a.m. Also prefer specific asserts: <code>Assert.Equal(3, list.Count)</code> prints both numbers on failure, while <code>Assert.True(list.Count == 3)</code> only says "Expected: True, Actual: False".</p>`
        },
        {
          type: "code",
          title: "What xUnit does for you (a tiny test runner)",
          code: String.raw`using System.Reflection;

int passed = 0, failed = 0;
foreach (var m in typeof(CartTests).GetMethods())
{
    if (m.GetCustomAttribute<TestAttribute>() is null) continue;

    var instance = new CartTests(); // fresh object per test
    try
    {
        m.Invoke(instance, null);
        passed++;
        Console.WriteLine($"PASS {m.Name}");
    }
    catch (TargetInvocationException ex)
    {
        failed++;
        Console.WriteLine($"FAIL {m.Name}: {ex.InnerException!.Message}");
    }
}
Console.WriteLine($"{passed} passed, {failed} failed");

class TestAttribute : Attribute { }

class CartTests
{
    readonly List<decimal> _cart = [];   // setup runs per test

    [Test] public void EmptyCart_TotalIsZero()
        => Check(_cart.Sum() == 0m, "total should be 0");

    [Test] public void AddTwoItems_CountIsTwo()
    {
        _cart.Add(5m);
        _cart.Add(7m);
        Check(_cart.Count == 2, "count should be 2");
    }

    [Test] public void AddItem_TotalIncludesTax()
    {
        _cart.Add(10m);
        Check(_cart.Sum() * 1.2m == 12.5m, "expected 12.5");
    }

    static void Check(bool ok, string msg)
    {
        if (!ok) throw new Exception(msg);
    }
}`,
          output: String.raw`PASS EmptyCart_TotalIsZero
PASS AddTwoItems_CountIsTwo
FAIL AddItem_TotalIncludesTax: expected 12.5
2 passed, 1 failed`
        },
        {
          type: "text",
          html: String.raw`<p>This is roughly how xUnit works: it uses reflection (Module 13) to find methods marked with an attribute, creates a <strong>new instance of the test class for every test</strong>, calls the method, and treats an exception as a failure. Two practical results:</p><ul><li>The constructor is your per-test setup. Fields start fresh for each test, so tests cannot leak state into each other.</li><li>If you need cleanup (delete a temp file), implement <code>IDisposable</code>; xUnit calls <code>Dispose</code> after each test.</li></ul>`
        },
        {
          type: "table",
          headers: ["A good unit test is", "Because", "Smell that breaks it"],
          rows: [
            ["Fast (milliseconds)", "you run thousands of them all day", "real database, network, <code>Thread.Sleep</code>"],
            ["Isolated", "order of tests must not matter", "static fields shared between tests"],
            ["Repeatable", "same result on every machine, every day", "<code>DateTime.Now</code>, <code>Random</code>, current culture"],
            ["Focused", "a failure points at one cause", "ten asserts about unrelated things"],
            ["Readable", "the name is the documentation", "<code>Test1</code>; use <code>Method_Scenario_Expected</code>"]
          ]
        },
        {
          type: "callout",
          tone: "python",
          title: "xUnit vs pytest",
          html: String.raw`<p>pytest finds functions named <code>test_*</code>; xUnit finds methods with <code>[Fact]</code>. <code>@pytest.mark.parametrize</code> is <code>[Theory]</code> plus <code>[InlineData]</code>. <code>pytest.raises(ValueError)</code> is <code>Assert.Throws&lt;T&gt;</code>. Instead of fixtures, xUnit uses the class constructor for setup and <code>IClassFixture&lt;T&gt;</code> for expensive shared setup.</p>`
        }
      ],
      exercises: [
        {
          type: "fill",
          prompt: "Complete the parameterized test so it runs once for each pair.",
          code: String.raw`[___]
[InlineData(2, 4)]
[InlineData(-3, 9)]
public void Square_ReturnsProduct(int x, int expected)
{
    Assert.___(expected, MathUtil.Square(x));
}`,
          blanks: [["Theory"], ["Equal"]],
          explain: String.raw`<p><code>[Theory]</code> tells xUnit the method takes data; each <code>[InlineData]</code> row becomes one test case. Using <code>[Fact]</code> here fails because a fact must have no parameters. <code>Assert.Equal</code> takes the expected value first.</p>`
        },
        {
          type: "output",
          prompt: "This hand-rolled check finds a bug. What does it print?",
          code: String.raw`(int Value, int Expected)[] cases =
    [(5, 5), (-3, 0), (12, 10), (10, 10)];

foreach (var (value, expected) in cases)
{
    int actual = Clamp(value, 0, 10);
    Console.WriteLine(actual == expected
        ? $"pass Clamp({value})"
        : $"FAIL Clamp({value}): expected {expected}, got {actual}");
}

static int Clamp(int v, int lo, int hi)
    => v < lo ? lo : v > hi ? lo : v;`,
          answer: String.raw`pass Clamp(5)
pass Clamp(-3)
FAIL Clamp(12): expected 10, got 0
pass Clamp(10)`,
          explain: String.raw`<p>The second branch returns <code>lo</code> instead of <code>hi</code>, a classic copy-paste bug. Only the case above the range exposes it. That is why good tests include the edges: a value below, inside, above and exactly on the boundary.</p>`
        },
        {
          type: "bug",
          prompt: "This test passes on Monday and fails on Saturday. What is wrong?",
          code: String.raw`[Fact]
public void IsWorkday_Today_ReturnsTrue()
{
    var calendar = new WorkCalendar();
    Assert.True(calendar.IsWorkday(DateTime.Now));
}`,
          options: [
            "It depends on the real current date, so its result changes from day to day",
            "Assert.True cannot be used with methods that return bool",
            "DateTime.Now is not allowed inside tests",
            "The test needs [Theory] instead of [Fact]"
          ],
          answer: 0,
          explain: String.raw`<p>A unit test must be repeatable. Pass fixed dates instead: <code>calendar.IsWorkday(new DateTime(2026, 11, 2))</code> for a Monday and a separate test for a Saturday. When the code under test reads the clock itself, inject a clock (next lesson).</p>`
        },
        {
          type: "mcq",
          prompt: "Your test class has a field <code>List&lt;int&gt; _items = [];</code>. Test A adds three items. Test B checks that the list is empty. In xUnit, what happens?",
          options: [
            "Both pass, because xUnit creates a new instance of the class for every test",
            "B fails if A runs first, because they share the list",
            "B fails always, because fields are not reset",
            "It does not compile: test classes cannot have fields"
          ],
          answer: 0,
          explain: String.raw`<p>xUnit builds a fresh instance per test, so instance fields always start clean. Only <code>static</code> fields are shared, which is exactly why static mutable state in tests is a smell.</p>`
        },
        {
          type: "order",
          prompt: "Order the lines of a test that follows Arrange-Act-Assert.",
          lines: [
            "var account = new Account(balance: 100m);",
            "account.Withdraw(30m);",
            "Assert.Equal(70m, account.Balance);"
          ],
          explain: String.raw`<p>Arrange builds the object in a known state, Act performs the single operation being tested, Assert checks the outcome. Keeping one Act per test means a failure points at exactly one behavior.</p>`
        }
      ],
      takeaways: [
        "[Fact] is one scenario; [Theory] with [InlineData] runs one test per row.",
        "Write Arrange, Act, Assert, and put expected before actual.",
        "xUnit makes a new test-class instance per test: the constructor is setup.",
        "Fast, isolated, repeatable: no real clock, network or shared static state."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m14-l03",
      title: "Dependency injection and testable design",
      minutes: 32,
      objectives: [
        "Recognize hidden dependencies that make code hard to test",
        "Inject dependencies through constructors using interfaces",
        "Register services in Microsoft.Extensions.DependencyInjection",
        "Choose the right lifetime: singleton, scoped or transient"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>Try to test this method: "send a reminder for every task that is due". It reads <code>DateTime.Now</code>, and it sends real emails. Your test would depend on today's date and spam a real inbox. The method works. The trouble is that it is <strong>hard-wired</strong> to its dependencies.</p><p><strong>Dependency injection</strong> (DI) means a class does not create or look up the things it needs. It asks for them, usually as constructor parameters typed as interfaces. Whoever builds the class decides which implementation to pass in: the real one in production, a fake one in tests.</p>`
        },
        {
          type: "compare",
          left: {
            label: "Hard-wired: untestable",
            code: String.raw`class ReminderService
{
    public void SendDue(List<Reminder> items)
    {
        var mail = new SmtpMailer("smtp.acme.com");
        foreach (var r in items)
            if (r.Due <= DateTime.Now)
                mail.Send($"Reminder: {r.Title}");
    }
}`
          },
          right: {
            label: "Injected: testable",
            code: String.raw`class ReminderService(IClock clock,
                      ISender sender)
{
    public void SendDue(List<Reminder> items)
    {
        foreach (var r in items)
            if (r.Due <= clock.Now)
                sender.Send($"Reminder: {r.Title}");
    }
}`
          }
        },
        {
          type: "code",
          title: "Wiring it by hand with fakes",
          code: String.raw`var clock = new FixedClock(new DateTime(2026, 11, 4, 9, 0, 0));
var sender = new RecordingSender();
var service = new ReminderService(clock, sender);

service.SendDue([
    new("Pay rent", new DateTime(2026, 11, 3)),
    new("Dentist", new DateTime(2026, 11, 10)),
    new("Call mom", new DateTime(2026, 11, 4)),
]);

foreach (var message in sender.Sent)
    Console.WriteLine(message);
Console.WriteLine($"{sender.Sent.Count} sent");

interface IClock { DateTime Now { get; } }
interface ISender { void Send(string message); }

record Reminder(string Title, DateTime Due);

class ReminderService(IClock clock, ISender sender)
{
    public void SendDue(List<Reminder> items)
    {
        foreach (var r in items)
            if (r.Due <= clock.Now)
                sender.Send($"Reminder: {r.Title}");
    }
}

// Test doubles: tiny, predictable implementations
class FixedClock(DateTime now) : IClock
{
    public DateTime Now => now;
}

class RecordingSender : ISender
{
    public List<string> Sent { get; } = [];
    public void Send(string message) => Sent.Add(message);
}`,
          output: String.raw`Reminder: Pay rent
Reminder: Call mom
2 sent`
        },
        {
          type: "text",
          html: String.raw`<p>The service never knows which clock or sender it got. In production you pass a <code>SystemClock</code> and an <code>SmtpSender</code>; in a test you pass a <code>FixedClock</code> and a <code>RecordingSender</code>, then assert on <code>sender.Sent</code>. The interface is the <em>seam</em> where you can swap parts.</p><p>A fake you write yourself like <code>RecordingSender</code> is often all you need. Libraries such as <strong>NSubstitute</strong> and <strong>Moq</strong> generate these doubles for you when interfaces get large.</p>`
        },
        {
          type: "callout",
          tone: "tip",
          title: ".NET 8 ships a clock abstraction: TimeProvider",
          html: String.raw`<p>You do not have to write <code>IClock</code> yourself. .NET 8 includes the abstract class <code>TimeProvider</code>. Production code takes a <code>TimeProvider</code> and calls <code>GetUtcNow()</code>; you register <code>TimeProvider.System</code>. Tests pass a subclass that returns a fixed time, or <code>FakeTimeProvider</code> from the <code>Microsoft.Extensions.TimeProvider.Testing</code> package, which can even advance time on demand.</p>`
        },
        {
          type: "text",
          html: String.raw`<p>Wiring by hand works for three classes. A real app has hundreds, each needing others. A <strong>DI container</strong> does the wiring for you: you register which implementation to use for each type once at startup, and the container builds whole object graphs on request. .NET's standard container lives in the <code>Microsoft.Extensions.DependencyInjection</code> package and is built into ASP.NET Core.</p>`
        },
        {
          type: "code",
          title: "Program.cs with the DI container (needs the NuGet package)",
          code: String.raw`// dotnet add package Microsoft.Extensions.DependencyInjection
using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();

services.AddSingleton<IClock, SystemClock>();
services.AddSingleton<ISender, ConsoleSender>();
services.AddTransient<ReminderService>();

using ServiceProvider provider = services.BuildServiceProvider();

// The container sees ReminderService needs IClock and ISender,
// creates (or reuses) them, and passes them to the constructor.
var reminders = provider.GetRequiredService<ReminderService>();
reminders.SendDue([new("Stand-up", DateTime.Today)]);

class SystemClock : IClock
{
    public DateTime Now => DateTime.Now;
}

class ConsoleSender : ISender
{
    public void Send(string message) => Console.WriteLine(message);
}`
        },
        {
          type: "table",
          headers: ["Lifetime", "One instance per", "Typical use"],
          rows: [
            ["<code>AddSingleton</code>", "application (created once, shared by everyone)", "configuration, caches, <code>TimeProvider</code>, in-memory stores; must be thread-safe"],
            ["<code>AddScoped</code>", "scope; in ASP.NET Core one scope = one HTTP request", "EF Core <code>DbContext</code>, unit-of-work, per-request services"],
            ["<code>AddTransient</code>", "every time it is requested", "lightweight, stateless helpers"]
          ]
        },
        {
          type: "code",
          title: "Lifetimes in action: a miniature container",
          code: String.raw`var c = new MiniContainer();
c.AddSingleton(() => new Counter());
c.AddTransient(() => new Worker(c.Get<Counter>()));

var w1 = c.Get<Worker>();
var w2 = c.Get<Worker>();
w1.DoWork();
w2.DoWork();
w2.DoWork();

Console.WriteLine(ReferenceEquals(w1, w2));
Console.WriteLine(ReferenceEquals(w1.Counter, w2.Counter));
Console.WriteLine($"total work: {c.Get<Counter>().Value}");

class MiniContainer
{
    readonly Dictionary<Type, Func<object>> _factories = new();

    public void AddTransient<T>(Func<T> make) where T : class
        => _factories[typeof(T)] = make;

    public void AddSingleton<T>(Func<T> make) where T : class
    {
        T? instance = null;
        _factories[typeof(T)] = () => instance ??= make();
    }

    public T Get<T>() => (T)_factories[typeof(T)]();
}

class Counter { public int Value; }

class Worker(Counter counter)
{
    public Counter Counter => counter;
    public void DoWork() => counter.Value++;
}`,
          output: String.raw`False
True
total work: 3`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Two classic DI mistakes",
          html: String.raw`<p><strong>Captive dependency</strong>: a singleton that takes a scoped service in its constructor keeps that one scoped instance forever, for example a single <code>DbContext</code> shared by every request and every thread. ASP.NET Core detects this in Development and throws "Cannot consume scoped service ... from singleton ...". Rule: a service may depend only on services that live as long or longer.</p><p><strong>Service locator</strong>: passing <code>IServiceProvider</code> around and calling <code>GetService</code> deep inside your classes. It hides what a class needs. Ask for dependencies in the constructor instead.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Why C# leans on DI more than Python",
          html: String.raw`<p>In Python, tests often swap a dependency with <code>unittest.mock.patch</code>, replacing a module attribute at run time. C# is statically compiled, so you cannot patch <code>DateTime.Now</code>. Interfaces plus constructor injection give you the same ability to swap parts, in a way the compiler can check.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this program print?",
          code: String.raw`var fake = new FakeRates(new() { ["EUR"] = 1.1m, ["GBP"] = 1.25m });
var converter = new Converter(fake);

Console.WriteLine(converter.ToUsd(100m, "EUR"));
Console.WriteLine(converter.ToUsd(8m, "GBP"));
Console.WriteLine(converter.ToUsd(5m, "JPY"));
Console.WriteLine(fake.Calls);

interface IRates { decimal? Rate(string currency); }

class Converter(IRates rates)
{
    public string ToUsd(decimal amount, string currency) =>
        rates.Rate(currency) is decimal r
            ? $"{amount * r:0.00} USD"
            : $"no rate for {currency}";
}

class FakeRates(Dictionary<string, decimal> table) : IRates
{
    public int Calls { get; private set; }
    public decimal? Rate(string currency)
    {
        Calls++;
        return table.TryGetValue(currency, out var r) ? r : null;
    }
}`,
          answer: String.raw`110.00 USD
10.00 USD
no rate for JPY
3`,
          explain: String.raw`<p>The converter only knows <code>IRates</code>, so the test controls exactly which rates exist. The fake also counts calls, which lets a test check behavior such as "the converter asks for a rate once per conversion". No network, no real exchange rates, same result every run.</p>`
        },
        {
          type: "fill",
          prompt: "Register the repository as one shared instance, then ask the container for the service.",
          code: String.raw`services.___<ITaskRepository, InMemoryTaskRepository>();
services.AddScoped<TaskService>();
using var provider = services.BuildServiceProvider();
using var scope = provider.CreateScope();
var svc = scope.ServiceProvider.___<TaskService>();`,
          blanks: [["AddSingleton"], ["GetRequiredService"]],
          explain: String.raw`<p>An in-memory repository must be a singleton, or every request would get an empty new store. <code>GetRequiredService&lt;T&gt;</code> throws a clear error if <code>T</code> is not registered, while <code>GetService&lt;T&gt;</code> returns null and lets the problem surface later.</p>`
        },
        {
          type: "mcq",
          prompt: "In an ASP.NET Core app, which lifetime should an EF Core <code>DbContext</code> have?",
          options: [
            "Scoped: one per HTTP request",
            "Singleton: one for the whole app",
            "Transient: a new one every time any class asks",
            "It should not be registered; create it with new"
          ],
          answer: 0,
          explain: String.raw`<p>A <code>DbContext</code> tracks changes and is not thread-safe, so sharing one across requests (singleton) causes corrupted state. Transient would give two services in the same request different contexts, breaking a shared transaction. Scoped gives each request its own context. <code>AddDbContext</code> registers it as scoped by default.</p>`
        },
        {
          type: "bug",
          prompt: "This works in a quick test but corrupts data under load. What is the bug?",
          code: String.raw`builder.Services.AddScoped<AppDbContext>();
builder.Services.AddSingleton<OrderCache>();

class OrderCache(AppDbContext db)
{
    public Order? Find(int id) => db.Orders.Find(id);
}`,
          options: [
            "A captive dependency: the singleton OrderCache holds one scoped DbContext forever and shares it across threads",
            "OrderCache needs a parameterless constructor",
            "Primary constructors cannot be used with DI",
            "AddScoped must come after AddSingleton"
          ],
          answer: 0,
          explain: String.raw`<p>The singleton is created once, with whichever <code>DbContext</code> existed then, and keeps it for the life of the app. Concurrent requests then share a non-thread-safe context. ASP.NET Core's scope validation throws on this in Development. Make <code>OrderCache</code> scoped, or have it create a scope (or use <code>IDbContextFactory</code>) per operation. Registration order does not matter, and primary constructors work fine with DI.</p>`
        }
      ],
      takeaways: [
        "Ask for dependencies in the constructor; do not new them up or read static globals.",
        "Interfaces are the seams where tests swap in fakes; TimeProvider replaces DateTime.Now.",
        "ServiceCollection registers types; the provider builds the object graph for you.",
        "Singleton, scoped, transient: never let a longer-lived service capture a shorter-lived one."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m14-l04",
      title: "Logging and configuration",
      minutes: 30,
      objectives: [
        "Log with ILogger&lt;T&gt;, log levels and message templates",
        "Explain why structured logging beats string interpolation",
        "Read settings from appsettings.json, environment variables and the command line",
        "Bind a configuration section to a class with the options pattern"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>When your API fails at 3 a.m. on a server you cannot debug, logs are all you have. <code>Console.WriteLine</code> is not enough: you cannot turn it down in production, it has no severity, no timestamp, no idea which class wrote it, and it cannot send anything to a log service.</p><p>.NET's logging abstraction, <code>ILogger&lt;T&gt;</code> from <code>Microsoft.Extensions.Logging</code>, solves this. Your code writes to the interface; configuration decides where logs go (console, file, Seq, Application Insights) and how detailed they are.</p>`
        },
        {
          type: "code",
          title: "Logging in a class (needs Microsoft.Extensions.Logging.Console)",
          code: String.raw`using Microsoft.Extensions.Logging;

using ILoggerFactory factory = LoggerFactory.Create(builder =>
    builder.AddConsole().SetMinimumLevel(LogLevel.Debug));

var importer = new OrderImporter(
    factory.CreateLogger<OrderImporter>());
importer.Import(["A-1", "", "B-7"]);

class OrderImporter(ILogger<OrderImporter> logger)
{
    public void Import(string[] ids)
    {
        logger.LogInformation("Importing {Count} orders", ids.Length);
        foreach (var id in ids)
        {
            if (id.Length == 0)
            {
                logger.LogWarning("Skipped an order with an empty id");
                continue;
            }
            logger.LogDebug("Imported order {OrderId}", id);
        }
    }
}

// Console output looks like:
// info: OrderImporter[0]
//       Importing 3 orders
// dbug: OrderImporter[0]
//       Imported order A-1
// warn: OrderImporter[0]
//       Skipped an order with an empty id
// ...`
        },
        {
          type: "table",
          headers: ["Level", "Value", "Use for"],
          rows: [
            ["<code>Trace</code>", "0", "very detailed steps; never on in production"],
            ["<code>Debug</code>", "1", "information useful while developing"],
            ["<code>Information</code>", "2", "normal events: request handled, order created"],
            ["<code>Warning</code>", "3", "unexpected but handled: retrying, bad input skipped"],
            ["<code>Error</code>", "4", "an operation failed; pass the exception as the first argument"],
            ["<code>Critical</code>", "5", "the app cannot continue: disk full, database gone"]
          ]
        },
        {
          type: "text",
          html: String.raw`<p>A logger with minimum level <code>Warning</code> drops Trace, Debug and Information messages cheaply. You set the minimum per category (usually the class name) in configuration, so you can turn up Debug for one noisy class without flooding the whole log.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Use message templates for log messages",
          html: String.raw`<p>Write <code>logger.LogInformation("Order {OrderId} shipped", id)</code>. Avoid <code>logger.LogInformation($"Order {id} shipped")</code>.</p><p>With a template, the logger stores the template and the value <code>OrderId = 1042</code> separately. A log service can then search "all events for OrderId 1042" or count events per template. With interpolation, all it gets is a flat string. Interpolation also builds the string even when the level is turned off. The .NET analyzers flag it as <strong>CA2254</strong>: "The logging message template should not vary between calls."</p>`
        },
        {
          type: "code",
          title: "What a structured logger keeps",
          code: String.raw`using System.Text.RegularExpressions;

var entry = Capture("Order {OrderId} shipped to {City}", 1042, "Oslo");

Console.WriteLine(entry.Message);
Console.WriteLine($"template: {entry.Template}");
foreach (var (name, value) in entry.Properties)
    Console.WriteLine($"  {name} = {value}");

static LogEntry Capture(string template, params object[] args)
{
    var names = Regex.Matches(template, @"\{(\w+)\}")
                     .Select(m => m.Groups[1].Value)
                     .ToArray();
    var props = names.Zip(args)
                     .ToDictionary(p => p.First, p => p.Second);
    string message = Regex.Replace(template, @"\{(\w+)\}",
        m => props[m.Groups[1].Value].ToString()!);
    return new LogEntry(template, message, props);
}

record LogEntry(string Template, string Message,
                Dictionary<string, object> Properties);`,
          output: String.raw`Order 1042 shipped to Oslo
template: Order {OrderId} shipped to {City}
  OrderId = 1042
  City = Oslo`
        },
        {
          type: "text",
          html: String.raw`<p><strong>Configuration</strong> is the other half. Connection strings, feature switches, limits and URLs must not be hard-coded, because they differ between your laptop, the test server and production. .NET's <code>IConfiguration</code> reads key/value pairs from several <em>sources</em> layered on top of each other. Later sources override earlier ones.</p>`
        },
        {
          type: "code",
          title: "appsettings.json",
          code: String.raw`{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Smtp": {
    "Host": "localhost",
    "Port": 2525,
    "UseTls": false
  }
}`
        },
        {
          type: "code",
          title: "Reading it and binding to a class (needs Microsoft.Extensions.Configuration packages)",
          code: String.raw`using Microsoft.Extensions.Configuration;

IConfiguration config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile("appsettings.Production.json", optional: true)
    .AddEnvironmentVariables()
    .AddCommandLine(args)
    .Build();

string host = config["Smtp:Host"] ?? "localhost";
int port = config.GetValue<int>("Smtp:Port");

SmtpOptions smtp = config.GetSection("Smtp").Get<SmtpOptions>()
                   ?? new SmtpOptions();
Console.WriteLine($"{smtp.Host}:{smtp.Port} tls={smtp.UseTls}");

public class SmtpOptions
{
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 25;
    public bool UseTls { get; set; }
}`
        },
        {
          type: "code",
          title: "Layering, simulated: later sources win",
          code: String.raw`var appsettings = new Dictionary<string, string>
{
    ["Smtp:Host"] = "localhost",
    ["Smtp:Port"] = "2525",
    ["Smtp:UseTls"] = "false",
};
var production = new Dictionary<string, string>
{
    ["Smtp:Host"] = "mail.acme.com",
    ["Smtp:UseTls"] = "true",
};
// Environment variable Smtp__Port=587 (double underscore = colon)
var environment = new Dictionary<string, string>
{
    ["Smtp__Port".Replace("__", ":")] = "587",
};

var final = new Dictionary<string, string>();
foreach (var source in new[] { appsettings, production, environment })
    foreach (var (key, value) in source)
        final[key] = value;

foreach (var (key, value) in final)
    Console.WriteLine($"{key} = {value}");`,
          output: String.raw`Smtp:Host = mail.acme.com
Smtp:Port = 587
Smtp:UseTls = true`
        },
        {
          type: "text",
          html: String.raw`<p>That is the whole idea of configuration layering. In ASP.NET Core, <code>WebApplication.CreateBuilder</code> sets up these sources for you in this order: <code>appsettings.json</code>, <code>appsettings.{Environment}.json</code>, user secrets (Development only), environment variables, command-line arguments. Keys are hierarchical with <code>:</code>; environment variables use <code>__</code> because <code>:</code> is not allowed in variable names on every OS.</p><p>The <strong>options pattern</strong> binds a section to a class and makes it injectable: <code>builder.Services.Configure&lt;SmtpOptions&gt;(builder.Configuration.GetSection("Smtp"));</code>, then any class can take <code>IOptions&lt;SmtpOptions&gt;</code> in its constructor and read <code>options.Value.Host</code>. Strongly typed, testable with <code>Options.Create(new SmtpOptions { ... })</code>, and no magic strings scattered around.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Never commit secrets",
          html: String.raw`<p>Passwords, API keys and connection strings with passwords do not belong in <code>appsettings.json</code>, because that file goes into Git and stays in its history forever. During development, use <code>dotnet user-secrets set "Smtp:Password" "..."</code>, which stores them outside the project folder. In production, use environment variables or a vault such as Azure Key Vault. The code stays the same: it just reads <code>config["Smtp:Password"]</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "fill",
          prompt: "Log a warning with a structured property called <code>UserId</code>.",
          code: String.raw`logger.___("Login failed for user {___}", userId);`,
          blanks: [["LogWarning"], ["UserId"]],
          explain: String.raw`<p>The placeholder name inside the braces becomes the property name in structured logs, so pick a meaningful one. The value comes from the arguments in order. Do not use <code>$"..."</code> here, or the property is lost.</p>`
        },
        {
          type: "output",
          prompt: "The minimum level is Warning. Which events are written?",
          code: String.raw`var min = Level.Warning;
(Level Level, string Text)[] events =
[
    (Level.Information, "Server started"),
    (Level.Warning, "Disk 85% full"),
    (Level.Debug, "Cache miss for key 42"),
    (Level.Error, "Payment provider timed out"),
    (Level.Critical, "Database unreachable"),
];

int dropped = 0;
foreach (var (level, text) in events)
{
    if (level < min) { dropped++; continue; }
    Console.WriteLine($"{level.ToString().ToUpper()[..4]} {text}");
}
Console.WriteLine($"dropped {dropped}");

enum Level { Trace, Debug, Information, Warning, Error, Critical }`,
          answer: String.raw`WARN Disk 85% full
ERRO Payment provider timed out
CRIT Database unreachable
dropped 2`,
          explain: String.raw`<p>Levels are ordered numbers, and anything below the minimum is skipped. Information (2) and Debug (1) are below Warning (3). Filtering by level is cheap, which is why you can leave Debug calls in your code and switch them on only when you need them.</p>`
        },
        {
          type: "order",
          prompt: "In a default ASP.NET Core app, order the configuration sources from lowest to highest priority (the last one wins).",
          lines: [
            "appsettings.json",
            "appsettings.Production.json",
            "Environment variables",
            "Command-line arguments"
          ],
          explain: String.raw`<p>General defaults come first and the most specific, closest-to-the-moment sources come last. That lets operations staff override a setting on a server with an environment variable, or for one run with a command-line argument, without touching the files you deploy.</p>`
        },
        {
          type: "bug",
          prompt: "A reviewer rejects this pull request. What is the most serious problem?",
          code: String.raw`// appsettings.json (committed to Git)
{
  "ConnectionStrings": {
    "Main": "Server=db.acme.com;User=sa;Password=Winter2026!"
  }
}`,
          options: [
            "A real password is stored in a file that goes into source control",
            "Connection strings must be in a ConnectionStrings.json file",
            "JSON does not allow the ! character",
            "The key should be lower case"
          ],
          answer: 0,
          explain: String.raw`<p>Anyone with access to the repository, now or in the future, can read the password, and deleting it later does not remove it from Git history. The password must be rotated, and the value moved to user secrets locally and environment variables or a vault in production.</p>`
        },
        {
          type: "mcq",
          prompt: "Why is <code>logger.LogDebug($\"Loaded {items.Count} items\")</code> worse than <code>logger.LogDebug(\"Loaded {Count} items\", items.Count)</code>?",
          options: [
            "The interpolated version builds the string even when Debug is off and loses the Count property for structured search",
            "Interpolated strings cannot be passed to methods",
            "The interpolated version is not thread-safe",
            "There is no difference; the compiler turns both into the same call"
          ],
          answer: 0,
          explain: String.raw`<p>Interpolation runs before the call, so the work happens even when the message is filtered out, and the logger receives only a finished string. The template version passes the template and the value separately, which is both cheaper and searchable.</p>`
        }
      ],
      takeaways: [
        "Inject ILogger<T> and pick the right level: Information for events, Warning for handled surprises, Error for failures.",
        "Use message templates with named placeholders, never $ interpolation, in log calls.",
        "Configuration layers sources; later ones (env vars, command line) override appsettings.json.",
        "Bind sections to classes with the options pattern, and keep secrets out of Git."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m14-l05",
      title: "Minimal Web APIs with ASP.NET Core",
      minutes: 35,
      objectives: [
        "Create and run an ASP.NET Core minimal API",
        "Map GET, POST and DELETE endpoints with route parameters",
        "Return the right HTTP status codes with Results",
        "Inject services into endpoints and test the API end to end"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>A <strong>Web API</strong> is a program that answers HTTP requests with data, usually JSON. Mobile apps, single-page websites and other services call it. The request says <em>what</em> (a URL path like <code>/tasks/3</code>) and <em>how</em> (a verb like <code>GET</code> or <code>DELETE</code>). The response carries a status code and a body.</p><p>ASP.NET Core is .NET's web framework, and <strong>minimal APIs</strong> are its shortest way to build one: a few lines in <code>Program.cs</code> per endpoint, with the same DI, logging and configuration you just learned.</p>`
        },
        {
          type: "steps",
          items: [
            String.raw`<code>dotnet new web -o src/TaskTracker.Api</code> creates an empty web project (SDK <code>Microsoft.NET.Sdk.Web</code>).`,
            String.raw`<code>dotnet run --project src/TaskTracker.Api</code> starts the server; the console prints "Now listening on: http://localhost:5xxx".`,
            String.raw`Open that address in a browser, or call it with <code>curl</code> or a <code>.http</code> file in Visual Studio / VS Code.`,
            String.raw`Stop the server with <kbd>Ctrl</kbd>+<kbd>C</kbd>. Use <code>dotnet watch</code> to restart on every save.`
          ]
        },
        {
          type: "code",
          title: "Program.cs: a complete small API",
          code: String.raw`var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<NoteStore>();
var app = builder.Build();

app.MapGet("/", () => "Notes API is running");

app.MapGet("/notes", (NoteStore store) => store.All());

app.MapGet("/notes/{id:int}", (int id, NoteStore store) =>
    store.Find(id) is { } note
        ? Results.Ok(note)
        : Results.NotFound());

app.MapPost("/notes", (NewNote input, NoteStore store) =>
{
    if (string.IsNullOrWhiteSpace(input.Text))
        return Results.BadRequest("Text is required.");
    Note note = store.Add(input.Text);
    return Results.Created($"/notes/{note.Id}", note);
});

app.MapDelete("/notes/{id:int}", (int id, NoteStore store) =>
    store.Remove(id) ? Results.NoContent() : Results.NotFound());

app.Run();

record Note(int Id, string Text);
record NewNote(string Text);

class NoteStore
{
    readonly List<Note> _notes = [];
    readonly object _lock = new();
    public IReadOnlyList<Note> All() { lock (_lock) return [.. _notes]; }
    public Note? Find(int id)
    { lock (_lock) return _notes.Find(n => n.Id == id); }
    public Note Add(string text)
    {
        lock (_lock)
        {
            var note = new Note(_notes.Count + 1, text);
            _notes.Add(note);
            return note;
        }
    }
    public bool Remove(int id)
    { lock (_lock) return _notes.RemoveAll(n => n.Id == id) > 0; }
}`
        },
        {
          type: "text",
          html: String.raw`<p>How ASP.NET Core fills in your lambda's parameters is called <strong>binding</strong>:</p><ul><li><code>int id</code> matches <code>{id:int}</code> in the route. The <code>:int</code> constraint means <code>/notes/abc</code> does not match at all (404).</li><li><code>NewNote input</code> is a complex type on a POST, so it is read from the JSON body.</li><li><code>NoteStore store</code> is registered in DI, so it is injected.</li><li>Simple types not in the route, like <code>bool? done</code>, come from the query string: <code>/notes?done=true</code>.</li></ul><p>Return values are serialized to JSON with web defaults (camelCase names). Return an <code>IResult</code> from <code>Results</code> when you need to choose the status code.</p>`
        },
        {
          type: "table",
          headers: ["Verb", "Meaning", "Success status", "Common failures"],
          rows: [
            ["<code>GET</code>", "read; never changes data", "200 OK", "404 Not Found"],
            ["<code>POST</code>", "create, or run an action", "201 Created (with Location header)", "400 Bad Request (validation)"],
            ["<code>PUT</code> / <code>PATCH</code>", "replace / partly update", "200 OK or 204 No Content", "400, 404, 409 Conflict"],
            ["<code>DELETE</code>", "remove", "204 No Content", "404 Not Found"],
            ["any", "server bug or crash", "", "500 Internal Server Error"]
          ]
        },
        {
          type: "code",
          title: "JSON the way ASP.NET Core writes it",
          code: String.raw`using System.Text.Json;

var web = new JsonSerializerOptions(JsonSerializerDefaults.Web);

var note = new Note(1, "Buy milk", IsPinned: true);
Console.WriteLine(JsonSerializer.Serialize(note, web));

string body = """{"id":2,"text":"Call Ana","isPinned":false}""";
Note? parsed = JsonSerializer.Deserialize<Note>(body, web);
Console.WriteLine(parsed);

record Note(int Id, string Text, bool IsPinned);`,
          output: String.raw`{"id":1,"text":"Buy milk","isPinned":true}
Note { Id = 2, Text = Call Ana, IsPinned = False }`
        },
        {
          type: "code",
          title: "notes.http: trying the API from the editor",
          code: String.raw`@host = http://localhost:5080

### Create a note
POST {{host}}/notes
Content-Type: application/json

{ "text": "Buy milk" }

### List notes
GET {{host}}/notes

### Missing note -> 404
GET {{host}}/notes/99`
        },
        {
          type: "compare",
          left: {
            label: "Python (FastAPI)",
            lang: "python",
            code: String.raw`app = FastAPI()

@app.get("/notes/{id}")
def get_note(id: int):
    note = store.find(id)
    if note is None:
        raise HTTPException(404)
    return note`
          },
          right: {
            label: "C# (minimal API)",
            code: String.raw`var app = builder.Build();

app.MapGet("/notes/{id:int}",
    (int id, NoteStore store) =>
        store.Find(id) is { } note
            ? Results.Ok(note)
            : Results.NotFound());`
          }
        },
        {
          type: "text",
          html: String.raw`<p>Two more pieces make an API professional:</p><ul><li><strong>OpenAPI / Swagger</strong>: a machine-readable description of every endpoint, plus a web page to try them. In .NET 8, add the <code>Swashbuckle.AspNetCore</code> package, call <code>builder.Services.AddEndpointsApiExplorer()</code> and <code>AddSwaggerGen()</code>, then <code>app.UseSwagger(); app.UseSwaggerUI();</code>. From .NET 9, <code>Microsoft.AspNetCore.OpenApi</code> is built in.</li><li><strong>Integration tests</strong>: the <code>Microsoft.AspNetCore.Mvc.Testing</code> package gives you <code>WebApplicationFactory&lt;Program&gt;</code>, which starts your whole app in memory and hands you an <code>HttpClient</code>. You send real HTTP requests without opening a port.</li></ul>`
        },
        {
          type: "code",
          title: "An integration test (xUnit + Microsoft.AspNetCore.Mvc.Testing)",
          code: String.raw`using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

public class NotesApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Post_ThenGet_ReturnsNote()
    {
        HttpClient client = factory.CreateClient();

        var post = await client.PostAsJsonAsync("/notes",
            new { text = "Test me" });
        Assert.Equal(HttpStatusCode.Created, post.StatusCode);

        var get = await client.GetAsync(post.Headers.Location);
        Assert.Equal(HttpStatusCode.OK, get.StatusCode);
    }
}

// At the bottom of the API's Program.cs, so tests can see it:
// public partial class Program { }`
        },
        {
          type: "callout",
          tone: "deep",
          title: "What happens to one request",
          html: String.raw`<p>Kestrel, the built-in web server, reads the HTTP request. It passes through the <strong>middleware pipeline</strong> (HTTPS redirection, authentication, exception handling, each added with <code>app.Use...</code>). Routing picks the endpoint whose verb and pattern match. A new DI scope is created, parameters are bound, your lambda runs, and the result is written as JSON. Then the scope is disposed, which is why scoped services live exactly one request.</p>`
        }
      ],
      exercises: [
        {
          type: "fill",
          prompt: "Map an endpoint that answers <code>GET /tasks/7</code> with the task, using the route constraint for integers.",
          code: String.raw`app.___("/tasks/{id:___}", (int id, TaskStore store) =>
    store.Find(id) is { } t ? Results.Ok(t) : Results.NotFound());`,
          blanks: [["MapGet"], ["int"]],
          explain: String.raw`<p><code>MapGet</code> handles the GET verb. The <code>{id:int}</code> segment both binds to the <code>int id</code> parameter and refuses non-numeric paths, so <code>/tasks/abc</code> gets a 404 instead of a binding error.</p>`
        },
        {
          type: "mcq",
          prompt: "A client POSTs a valid new task. What should the API return?",
          options: [
            "201 Created, a Location header pointing to the new task, and the task in the body",
            "200 OK with an empty body",
            "204 No Content",
            "302 Found redirecting to the task list"
          ],
          answer: 0,
          explain: String.raw`<p>201 tells the client something new exists, and the Location header tells it where. Returning the created task saves the client an extra GET (it learns the generated Id). 204 means "done, nothing to send back", which suits DELETE better.</p>`
        },
        {
          type: "output",
          prompt: "This helper maps outcomes to HTTP status codes. What does it print?",
          code: String.raw`string[] outcomes = ["created", "missing", "invalid",
                      "deleted", "found", "crash"];
foreach (var o in outcomes)
    Console.WriteLine($"{o,-8} {StatusFor(o)}");

static int StatusFor(string outcome) => outcome switch
{
    "found" => 200,
    "created" => 201,
    "deleted" => 204,
    "invalid" => 400,
    "missing" => 404,
    _ => 500
};`,
          answer: String.raw`created  201
missing  404
invalid  400
deleted  204
found    200
crash    500`,
          explain: String.raw`<p>The <code>,-8</code> alignment pads the word to 8 characters on the right. The mapping is the standard one: 2xx for success, 4xx when the client sent something wrong, 5xx when the server failed. Anything unexpected falls to 500, just as an unhandled exception would in ASP.NET Core.</p>`
        },
        {
          type: "bug",
          prompt: "The app crashes at startup with \"The service collection cannot be modified because it is read-only.\" Why?",
          code: String.raw`var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

builder.Services.AddSingleton<NoteStore>();

app.MapGet("/notes", (NoteStore store) => store.All());
app.Run();`,
          options: [
            "Services are registered after builder.Build(); registration must happen before Build",
            "NoteStore must be registered as scoped",
            "MapGet must be called before Build",
            "app.Run() must come before MapGet"
          ],
          answer: 0,
          explain: String.raw`<p><code>Build()</code> freezes the service collection and creates the container. Every <code>builder.Services.Add...</code> call must come before it. Endpoints are the opposite: they are mapped on <code>app</code>, after <code>Build()</code> and before <code>Run()</code>.</p>`
        },
        {
          type: "output",
          prompt: "What JSON does this produce with ASP.NET Core's web defaults?",
          code: String.raw`using System.Text.Json;

var web = new JsonSerializerOptions(JsonSerializerDefaults.Web);
var item = new TaskDto(5, "Deploy", null, ["ops", "urgent"]);
Console.WriteLine(JsonSerializer.Serialize(item, web));

record TaskDto(int Id, string Title, string? Owner, string[] Tags);`,
          answer: String.raw`{"id":5,"title":"Deploy","owner":null,"tags":["ops","urgent"]}`,
          explain: String.raw`<p>Web defaults turn PascalCase property names into camelCase, which is what JavaScript clients expect. Null values are still written unless you set <code>DefaultIgnoreCondition</code>. Arrays become JSON arrays.</p>`
        }
      ],
      takeaways: [
        "dotnet new web plus MapGet/MapPost/MapDelete is a complete HTTP API.",
        "Route values, query strings, JSON bodies and DI services bind to handler parameters.",
        "Return Results.Ok, Created, NoContent, BadRequest or NotFound for the right status code.",
        "Register services before Build(); test the whole API with WebApplicationFactory."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m14-l06",
      title: "Shipping your code and what comes next",
      minutes: 25,
      objectives: [
        "Build in Release and publish framework-dependent or self-contained apps",
        "Set up a simple continuous-integration pipeline",
        "Adopt the habits professional C# teams expect",
        "Pick a next platform: WPF, WinUI, MAUI, Blazor or beyond"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p><code>dotnet run</code> builds in the <strong>Debug</strong> configuration: no optimizations, extra checks, easy to step through. What you ship is a <strong>Release</strong> build, created with <code>dotnet publish</code>. Publishing compiles in Release and copies everything the app needs into one folder you can deploy.</p>`
        },
        {
          type: "table",
          headers: ["Command", "Result", "Needs .NET on the target?"],
          rows: [
            ["<code>dotnet publish -c Release</code>", "framework-dependent: small, your DLLs only", "yes, the .NET 8 runtime"],
            ["<code>dotnet publish -c Release -r win-x64 --self-contained</code>", "includes the runtime (about 70 MB)", "no"],
            ["... <code>-p:PublishSingleFile=true</code>", "one executable file", "no (if self-contained)"],
            ["... <code>-p:PublishAot=true</code>", "Native AOT: machine code, fast start, small memory; no unrestricted reflection", "no"],
            ["<code>dotnet publish</code> a web project + Dockerfile", "container image for the cloud", "the base image has it"]
          ]
        },
        {
          type: "code",
          title: "Debug and Release really differ",
          code: String.raw`using System.Diagnostics;

#if DEBUG
Console.WriteLine("Debug build: extra checks are on");
#else
Console.WriteLine("Release build");
#endif

int stock = 3;
Debug.Assert(stock >= 0, "stock went negative");
Console.WriteLine($"stock = {stock}");`,
          output: String.raw`Debug build: extra checks are on
stock = 3`
        },
        {
          type: "text",
          html: String.raw`<p>The <code>DEBUG</code> symbol is defined only in Debug builds, and calls to <code>Debug.Assert</code> and <code>Debug.WriteLine</code> are <em>removed entirely</em> by the compiler in Release. Never put code with side effects inside them. Run your test suite against a Release build in CI at least once before shipping.</p>`
        },
        {
          type: "code",
          title: ".github/workflows/ci.yml: build and test every push",
          code: String.raw`name: ci
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: 8.0.x
      - run: dotnet restore
      - run: dotnet build -c Release --no-restore
      - run: dotnet test -c Release --no-build
      - run: dotnet list package --vulnerable`
        },
        {
          type: "text",
          html: String.raw`<p><strong>Continuous integration</strong> (CI) runs this on a clean machine for every push and pull request. If the build breaks or a test fails, the pull request shows a red cross and cannot be merged. It catches "works on my machine" problems and keeps the main branch always shippable.</p>`
        },
        {
          type: "table",
          headers: ["Habit", "How", "Why"],
          rows: [
            ["Warnings are errors", "<code>&lt;TreatWarningsAsErrors&gt;true&lt;/TreatWarningsAsErrors&gt;</code>", "nullable warnings are real bugs waiting to happen"],
            ["Consistent style", "<code>.editorconfig</code> + <code>dotnet format</code>", "diffs show only logic changes"],
            ["Analyzers", "<code>&lt;AnalysisLevel&gt;latest-recommended&lt;/AnalysisLevel&gt;</code>", "catches CA2254-style mistakes automatically"],
            ["Small pull requests", "one change per PR, with tests", "reviewers can actually understand them"],
            ["Read the docs and source", "learn.microsoft.com, source.dot.net", "the framework is open source; read how it works"]
          ]
        },
        {
          type: "table",
          headers: ["Next step", "What you build", "Choose it if"],
          rows: [
            ["<strong>ASP.NET Core</strong> (deeper)", "APIs, MVC sites, Razor Pages, auth, EF Core databases", "you want backend or full-stack jobs; the most common C# career path"],
            ["<strong>Blazor</strong>", "interactive web UIs in C# instead of JavaScript", "you like web apps but want one language front to back"],
            ["<strong>WPF</strong>", "Windows desktop apps with XAML and MVVM", "you maintain or build line-of-business Windows software (huge installed base)"],
            ["<strong>WinUI 3</strong>", "modern Windows 11 style desktop apps", "you build new Windows-only apps with Fluent design"],
            ["<strong>.NET MAUI</strong>", "one codebase for Android, iOS, Windows and macOS", "you need mobile plus desktop"],
            ["<strong>Worker Services</strong>", "background jobs, queue processors, Windows services", "you build back-end plumbing"],
            ["<strong>Unity / Godot</strong>", "games scripted in C#", "you want to make games"]
          ]
        },
        {
          type: "callout",
          tone: "tip",
          title: "Everything you learned carries over",
          html: String.raw`<p>Every one of these platforms uses the same language, the same base library, and the same DI, logging and configuration you met in this module. A WPF view model is a class with properties and events. A Blazor component injects services with <code>@inject</code>. A MAUI app uses <code>async</code>/<code>await</code> for every network call. You are not starting over; you are picking a UI on top of what you already know.</p>`
        },
        {
          type: "callout",
          tone: "note",
          title: "A learning plan for the next three months",
          html: String.raw`<ol><li>Finish the capstone below and push it to GitHub with a README and CI.</li><li>Replace the in-memory store with EF Core and SQLite, keeping the same <code>ITaskRepository</code> interface.</li><li>Add a front end: a Blazor page, or a WPF or WinUI window that calls your API.</li><li>Read other people's code: pick a small open-source .NET project and fix one "good first issue".</li></ol>`
        }
      ],
      exercises: [
        {
          type: "fill",
          prompt: "Publish a Release build for 64-bit Windows that does not need .NET installed on the target machine.",
          code: String.raw`dotnet publish -c ___ -r win-x64 --___`,
          blanks: [["Release"], ["self-contained"]],
          explain: String.raw`<p><code>-c Release</code> turns on optimizations. <code>-r win-x64</code> picks the target platform, and <code>--self-contained</code> copies the .NET runtime into the output folder so the machine needs nothing pre-installed. The trade-off is size.</p>`
        },
        {
          type: "bug",
          prompt: "This works in Debug, but in Release the queue never shrinks. Why?",
          code: String.raw`using System.Diagnostics;

var jobs = new Queue<string>(["a", "b", "c"]);
string? job = null;
while (jobs.Count > 0)
{
    Debug.Assert(jobs.TryDequeue(out job));
    Console.WriteLine($"processing {job}");
}`,
          options: [
            "Debug.Assert calls are removed in Release builds, so TryDequeue never runs",
            "TryDequeue does not work inside a while loop",
            "Release builds run Debug.Assert twice",
            "Queue<T> is not available in Release builds"
          ],
          answer: 0,
          explain: String.raw`<p><code>Debug.Assert</code> is marked <code>[Conditional("DEBUG")]</code>, so in Release the compiler deletes the whole call, including its arguments. The dequeue disappears, <code>job</code> stays null and the loop never ends. Do the work first, then assert on the result: <code>bool ok = jobs.TryDequeue(out job); Debug.Assert(ok);</code></p>`
        },
        {
          type: "mcq",
          prompt: "A team needs one app for Android, iPhone and Windows tablets, written in C#. Which platform fits best?",
          options: [".NET MAUI", "WPF", "WinUI 3", "Worker Service"],
          answer: 0,
          explain: String.raw`<p>.NET MAUI targets Android, iOS, Windows and macOS from one codebase. WPF and WinUI 3 are Windows-only desktop frameworks, and a Worker Service has no UI at all.</p>`
        },
        {
          type: "order",
          prompt: "Order the steps a typical CI pipeline runs for a .NET solution.",
          lines: [
            "Check out the code",
            "Install the .NET SDK",
            "dotnet restore",
            "dotnet build -c Release",
            "dotnet test -c Release"
          ],
          explain: String.raw`<p>You need the code and the SDK before anything else. Restore downloads packages, build compiles, and tests run against the compiled output. If any step fails, the pipeline stops and marks the commit red.</p>`
        },
        {
          type: "output",
          prompt: "A final recap: records, LINQ and patterns together. What does it print?",
          code: String.raw`Track[] tracks =
[
    new("ASP.NET Core", Web: true, Desktop: false, Hours: 120),
    new("Blazor", Web: true, Desktop: false, Hours: 80),
    new("WPF", Web: false, Desktop: true, Hours: 90),
    new("MAUI", Web: false, Desktop: true, Hours: 110),
];

foreach (var p in tracks.OrderBy(p => p.Hours))
{
    string kind = p switch
    {
        { Web: true, Hours: < 100 } => "quick web win",
        { Web: true } => "web, deeper",
        { Desktop: true } => "desktop",
        _ => "other"
    };
    Console.WriteLine($"{p.Name}: {kind}");
}
Console.WriteLine(tracks.Sum(p => p.Hours));

record Track(string Name, bool Web, bool Desktop, int Hours);`,
          answer: String.raw`Blazor: quick web win
WPF: desktop
MAUI: desktop
ASP.NET Core: web, deeper
400`,
          explain: String.raw`<p><code>OrderBy</code> sorts by hours: 80, 90, 110, 120. Each record then goes through the property patterns top to bottom. ASP.NET Core is web but has 120 hours, so it skips the first arm and lands on <code>{ Web: true }</code>. The total is 120 + 80 + 90 + 110 = 400.</p>`
        }
      ],
      takeaways: [
        "Ship Release builds with dotnet publish; choose framework-dependent, self-contained, single-file or AOT.",
        "Debug-only code (Debug.Assert, #if DEBUG) disappears in Release: no side effects inside it.",
        "CI builds and tests every push on a clean machine.",
        "WPF, WinUI, MAUI, Blazor and ASP.NET Core all build on what you learned here."
      ]
    }
  ],
  milestone: {
    id: "m14-project",
    title: "Task Tracker API (Capstone)",
    external: true,
    brief: String.raw`<p>This is the course capstone. You build a small but complete product the way a professional team would: a <strong>Task Tracker</strong> web API with a clean multi-project structure, business rules in a class library, dependency injection, configuration, structured logging, and a test suite that runs in seconds.</p><p>The solution has three projects. <code>TaskTracker.Core</code> holds the model (<code>TaskItem</code> records), a repository interface with a thread-safe in-memory implementation, and <code>TaskService</code> with all the rules: validation, due dates, overdue detection, sorting. It never calls <code>DateTime.Now</code>; it takes a <code>TimeProvider</code>. <code>TaskTracker.Api</code> is a minimal API that only translates HTTP to service calls. <code>TaskTracker.Tests</code> has fast xUnit unit tests with a fake clock, plus integration tests that boot the real API in memory with <code>WebApplicationFactory</code>.</p><p>Set it up with: <code>dotnet new sln -n TaskTracker</code>, <code>dotnet new classlib -o src/TaskTracker.Core</code>, <code>dotnet new web -o src/TaskTracker.Api</code>, <code>dotnet new xunit -o tests/TaskTracker.Tests</code>, add all three to the solution, reference Core from Api and Tests, reference Api from Tests, then add the packages <code>Microsoft.Extensions.Logging.Abstractions</code> and <code>Microsoft.Extensions.Options</code> to Core and <code>Microsoft.AspNetCore.Mvc.Testing</code> to Tests. The starter below shows every file; files are separated by <code>// File:</code> comments.</p>`,
    skills: ["solutions & class libraries", "NuGet", "records & with", "dependency injection", "TimeProvider", "options pattern", "ILogger", "minimal APIs", "xUnit", "WebApplicationFactory"],
    requirements: [
      "Three projects in one solution: Core (class library, no ASP.NET dependency), Api (minimal API) and Tests (xUnit); dotnet build and dotnet test succeed from the root.",
      "POST /tasks validates input: title required and at most TaskTracker:MaxTitleLength characters (from appsettings.json), due date not in the past, known priority. Invalid input returns 400 with a field-by-field errors object.",
      "A valid POST returns 201 Created with a Location header such as /tasks/1 and the task as JSON (priority written as text, e.g. \"High\").",
      "GET /tasks lists tasks sorted by priority (High first), then due date (tasks without one last), then id, with optional ?done=true|false and ?overdue=true filters.",
      "GET /tasks/{id} returns 200 or 404; POST /tasks/{id}/complete marks a task done using a with-expression and is idempotent; DELETE /tasks/{id} returns 204 or 404.",
      "TaskService gets its repository, TimeProvider, IOptions<TaskOptions> and ILogger<TaskService> through its constructor, and never reads DateTime.Now.",
      "The in-memory repository is registered as a singleton and is thread-safe (ConcurrentDictionary plus Interlocked for ids); TaskService is scoped.",
      "Log created, completed, deleted and rejected tasks with message templates (no $ interpolation in log calls).",
      "At least 8 unit tests (including a [Theory]) using a fake TimeProvider, and at least 3 integration tests covering 201, 400 and 404."
    ],
    sampleRun: String.raw`$ dotnet test
Passed!  - Failed: 0, Passed: 13, Skipped: 0, Total: 13

$ dotnet run --project src/TaskTracker.Api --urls http://localhost:5080
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5080

# in a second terminal
$ curl -i -X POST localhost:5080/tasks -H "Content-Type: application/json" \
    -d '{"title":"Write report","priority":"High","dueDate":"2026-11-20"}'
HTTP/1.1 201 Created
Location: /tasks/1
{"id":1,"title":"Write report","priority":"High","dueDate":"2026-11-20",
 "isDone":false,"createdAt":"2026-11-04T08:33:01.0227048+00:00"}

$ curl -X POST localhost:5080/tasks -H "Content-Type: application/json" \
    -d '{"title":"Water plants"}'
{"id":2,"title":"Water plants","priority":"Normal","dueDate":null,
 "isDone":false,"createdAt":"2026-11-04T08:33:01.0572895+00:00"}

$ curl -X POST localhost:5080/tasks -H "Content-Type: application/json" \
    -d '{"title":"","dueDate":"2020-01-01"}'
{"type":"https://tools.ietf.org/html/rfc9110#section-15.5.1",
 "title":"One or more validation errors occurred.","status":400,
 "errors":{"title":["Title is required."],
           "dueDate":["Due date cannot be in the past."]}}

$ curl -X POST localhost:5080/tasks/2/complete
{"id":2,"title":"Water plants","priority":"Normal","dueDate":null,
 "isDone":true,"createdAt":"2026-11-04T08:33:01.0572895+00:00"}

$ curl "localhost:5080/tasks?done=false"
[{"id":1,"title":"Write report","priority":"High","dueDate":"2026-11-20",
  "isDone":false,"createdAt":"2026-11-04T08:33:01.0227048+00:00"}]

# meanwhile, in the API's console
info: TaskTracker.Core.TaskService[0]
      Created task 1 (High)
info: TaskTracker.Core.TaskService[0]
      Created task 2 (Normal)
warn: TaskTracker.Core.TaskService[0]
      Rejected new task: invalid title, dueDate
info: TaskTracker.Core.TaskService[0]
      Completed task 2`,
    starter: String.raw`// ============================================================
// File: src/TaskTracker.Core/TaskItem.cs
// ============================================================
namespace TaskTracker.Core;

public enum Priority { Low, Normal, High }

public sealed record TaskItem(
    int Id,
    string Title,
    Priority Priority,
    DateOnly? DueDate,
    bool IsDone,
    DateTimeOffset CreatedAt);

public sealed record CreateTaskRequest(
    string? Title,
    Priority Priority = Priority.Normal,
    DateOnly? DueDate = null);

public sealed record CreateResult(
    TaskItem? Task,
    Dictionary<string, string[]> Errors);

public sealed class TaskOptions
{
    public const string Section = "TaskTracker";
    public int MaxTitleLength { get; set; } = 100;
}

// ============================================================
// File: src/TaskTracker.Core/ITaskRepository.cs
// ============================================================
namespace TaskTracker.Core;

public interface ITaskRepository
{
    TaskItem Add(Func<int, TaskItem> create);
    TaskItem? Get(int id);
    IReadOnlyList<TaskItem> All();
    bool Update(TaskItem task);
    bool Delete(int id);
}

// ============================================================
// File: src/TaskTracker.Core/InMemoryTaskRepository.cs
// ============================================================
using System.Collections.Concurrent;

namespace TaskTracker.Core;

public sealed class InMemoryTaskRepository : ITaskRepository
{
    private readonly ConcurrentDictionary<int, TaskItem> _tasks = new();
    private int _lastId;

    public TaskItem Add(Func<int, TaskItem> create)
    {
        // TODO: get the next id safely with Interlocked.Increment,
        // build the task with create(id), store it, return it
        throw new NotImplementedException();
    }

    public TaskItem? Get(int id) => _tasks.GetValueOrDefault(id);

    // TODO: return the tasks ordered by Id
    public IReadOnlyList<TaskItem> All() => [];

    public bool Update(TaskItem task)
    {
        // TODO: replace the task only if its Id already exists
        return false;
    }

    public bool Delete(int id) => _tasks.TryRemove(id, out _);
}

// ============================================================
// File: src/TaskTracker.Core/TaskService.cs
// ============================================================
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace TaskTracker.Core;

public sealed class TaskService(
    ITaskRepository repo,
    TimeProvider time,
    IOptions<TaskOptions> options,
    ILogger<TaskService> logger)
{
    // Never call DateTime.Now here: use the injected TimeProvider.
    private DateOnly Today =>
        DateOnly.FromDateTime(time.GetUtcNow().UtcDateTime);

    public Dictionary<string, string[]> Validate(CreateTaskRequest req)
    {
        var errors = new Dictionary<string, string[]>();
        // TODO: "title" error when blank, or longer than
        //       options.Value.MaxTitleLength after trimming
        // TODO: "dueDate" error when the due date is before Today
        // TODO: "priority" error when Enum.IsDefined is false
        return errors;
    }

    public CreateResult Create(CreateTaskRequest req)
    {
        // TODO: validate; on errors log a warning and return them
        // TODO: otherwise repo.Add a new TaskItem (trimmed title,
        //       IsDone false, CreatedAt = time.GetUtcNow()),
        //       log it with a message template, return it
        throw new NotImplementedException();
    }

    public TaskItem? Get(int id) => repo.Get(id);

    public IReadOnlyList<TaskItem> List(
        bool? done = null, bool overdueOnly = false)
    {
        // TODO: filter by done and overdue, then sort by
        // priority (High first), due date (none last), id
        return repo.All();
    }

    public bool IsOverdue(TaskItem t) =>
        false; // TODO: not done, has a due date, due date < Today

    public TaskItem? Complete(int id)
    {
        // TODO: null if missing; otherwise store a copy made
        // with "task with { IsDone = true }" and return it
        throw new NotImplementedException();
    }

    public bool Delete(int id) => repo.Delete(id);
}

// ============================================================
// File: src/TaskTracker.Api/Program.cs
// ============================================================
using System.Text.Json.Serialization;
using TaskTracker.Core;

var builder = WebApplication.CreateBuilder(args);

// TODO: bind TaskOptions to the "TaskTracker" config section
// TODO: register TimeProvider.System as a singleton
// TODO: register ITaskRepository -> InMemoryTaskRepository
//       (which lifetime keeps the data alive between requests?)
// TODO: register TaskService as scoped
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

var tasks = app.MapGroup("/tasks");

// TODO: GET    /tasks?done=&overdue=   -> 200 list
// TODO: GET    /tasks/{id}             -> 200 or 404
// TODO: POST   /tasks                  -> 201 + Location, or 400
// TODO: POST   /tasks/{id}/complete    -> 200 or 404
// TODO: DELETE /tasks/{id}             -> 204 or 404

app.Run();

// Lets the test project start the app with WebApplicationFactory.
public partial class Program { }

// ============================================================
// File: src/TaskTracker.Api/appsettings.json
// ============================================================
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "TaskTracker": {
    "MaxTitleLength": 80
  }
}

// ============================================================
// File: tests/TaskTracker.Tests/TaskServiceTests.cs
// ============================================================
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using TaskTracker.Core;

namespace TaskTracker.Tests;

// A clock the test controls. TimeProvider is built into .NET 8.
public sealed class FakeClock(DateTimeOffset start) : TimeProvider
{
    public DateTimeOffset Now { get; set; } = start;
    public override DateTimeOffset GetUtcNow() => Now;
}

public class TaskServiceTests
{
    private static readonly DateTimeOffset Nov4 =
        new(2026, 11, 4, 9, 0, 0, TimeSpan.Zero);

    private readonly FakeClock _clock = new(Nov4);
    private readonly TaskService _svc;

    public TaskServiceTests()
    {
        _svc = new TaskService(
            new InMemoryTaskRepository(),
            _clock,
            Options.Create(new TaskOptions { MaxTitleLength = 20 }),
            NullLogger<TaskService>.Instance);
    }

    [Fact]
    public void Create_ValidRequest_AssignsIdsAndTrimsTitle()
    {
        var first = _svc.Create(new("  Buy milk  ")).Task;

        Assert.NotNull(first);
        Assert.Equal(1, first.Id);
        Assert.Equal("Buy milk", first.Title);
    }

    // TODO: [Theory] blank titles (null, "", "   ") are rejected
    // TODO: a title longer than 20 characters is rejected
    // TODO: a due date before Nov 4 is rejected
    // TODO: Complete marks done and is idempotent
    // TODO: overdue filter changes when you move _clock.Now
}

// ============================================================
// File: tests/TaskTracker.Tests/ApiTests.cs
// ============================================================
using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TaskTracker.Tests;

public class ApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Health_ReturnsOk()
    {
        HttpClient client = factory.CreateClient();

        var response = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // TODO: POST /tasks then GET the Location header -> same task
    // TODO: POST with a blank title -> 400
    // TODO: GET /tasks/12345 -> 404
}`,
    hints: [
      String.raw`<p>Work inside-out. Make <code>InMemoryTaskRepository</code> and <code>TaskService</code> pass the unit tests first; the API is a thin layer you add last. Run <code>dotnet watch test</code> in the tests folder so every save re-runs them. The one starter test fails until <code>Create</code> works: that is your first red-green cycle.</p>`,
      String.raw`<p>For ids, <code>int id = Interlocked.Increment(ref _lastId);</code> is safe when two requests create tasks at the same time. <code>_lastId++</code> is not. <code>All()</code> can be <code>_tasks.Values.OrderBy(t =&gt; t.Id).ToList()</code>.</p>`,
      String.raw`<p>Patterns keep the rules short: <code>req.DueDate is { } due &amp;&amp; due &lt; Today</code> for the past-date check and <code>t is { IsDone: false, DueDate: { } due } &amp;&amp; due &lt; Today</code> for overdue. Sort with <code>OrderByDescending(t =&gt; t.Priority).ThenBy(t =&gt; t.DueDate ?? DateOnly.MaxValue).ThenBy(t =&gt; t.Id)</code>.</p>`,
      String.raw`<p>In <code>Program.cs</code>: <code>builder.Services.Configure&lt;TaskOptions&gt;(builder.Configuration.GetSection(TaskOptions.Section));</code>, <code>AddSingleton(TimeProvider.System)</code>, <code>AddSingleton&lt;ITaskRepository, InMemoryTaskRepository&gt;()</code> and <code>AddScoped&lt;TaskService&gt;()</code>. For POST, return <code>Results.Created($"/tasks/{task.Id}", task)</code> or <code>Results.ValidationProblem(result.Errors)</code>.</p>`,
      String.raw`<p>For the overdue test, create a task due Nov 10 while the fake clock says Nov 4, assert the overdue list is empty, then set <code>_clock.Now = Nov4.AddDays(8)</code> and assert it now has one item. Without an injected clock, this test would be impossible to write.</p>`
    ],
    solution: String.raw`// ============================================================
// File: src/TaskTracker.Core/TaskItem.cs
// ============================================================
namespace TaskTracker.Core;

public enum Priority { Low, Normal, High }

public sealed record TaskItem(
    int Id,
    string Title,
    Priority Priority,
    DateOnly? DueDate,
    bool IsDone,
    DateTimeOffset CreatedAt);

public sealed record CreateTaskRequest(
    string? Title,
    Priority Priority = Priority.Normal,
    DateOnly? DueDate = null);

public sealed record CreateResult(
    TaskItem? Task,
    Dictionary<string, string[]> Errors);

public sealed class TaskOptions
{
    public const string Section = "TaskTracker";
    public int MaxTitleLength { get; set; } = 100;
}

// ============================================================
// File: src/TaskTracker.Core/ITaskRepository.cs
// ============================================================
namespace TaskTracker.Core;

public interface ITaskRepository
{
    TaskItem Add(Func<int, TaskItem> create);
    TaskItem? Get(int id);
    IReadOnlyList<TaskItem> All();
    bool Update(TaskItem task);
    bool Delete(int id);
}

// ============================================================
// File: src/TaskTracker.Core/InMemoryTaskRepository.cs
// ============================================================
using System.Collections.Concurrent;

namespace TaskTracker.Core;

public sealed class InMemoryTaskRepository : ITaskRepository
{
    private readonly ConcurrentDictionary<int, TaskItem> _tasks = new();
    private int _lastId;

    public TaskItem Add(Func<int, TaskItem> create)
    {
        int id = Interlocked.Increment(ref _lastId);
        TaskItem task = create(id);
        _tasks[id] = task;
        return task;
    }

    public TaskItem? Get(int id) => _tasks.GetValueOrDefault(id);

    public IReadOnlyList<TaskItem> All() =>
        _tasks.Values.OrderBy(t => t.Id).ToList();

    public bool Update(TaskItem task)
    {
        if (!_tasks.ContainsKey(task.Id)) return false;
        _tasks[task.Id] = task;
        return true;
    }

    public bool Delete(int id) => _tasks.TryRemove(id, out _);
}

// ============================================================
// File: src/TaskTracker.Core/TaskService.cs
// ============================================================
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace TaskTracker.Core;

public sealed class TaskService(
    ITaskRepository repo,
    TimeProvider time,
    IOptions<TaskOptions> options,
    ILogger<TaskService> logger)
{
    private DateOnly Today =>
        DateOnly.FromDateTime(time.GetUtcNow().UtcDateTime);

    public Dictionary<string, string[]> Validate(CreateTaskRequest req)
    {
        var errors = new Dictionary<string, string[]>();
        int max = options.Value.MaxTitleLength;

        if (string.IsNullOrWhiteSpace(req.Title))
            errors["title"] = ["Title is required."];
        else if (req.Title.Trim().Length > max)
            errors["title"] = [$"Title must be {max} characters or fewer."];

        if (req.DueDate is { } due && due < Today)
            errors["dueDate"] = ["Due date cannot be in the past."];

        if (!Enum.IsDefined(req.Priority))
            errors["priority"] = ["Unknown priority."];

        return errors;
    }

    public CreateResult Create(CreateTaskRequest req)
    {
        var errors = Validate(req);
        if (errors.Count > 0)
        {
            logger.LogWarning("Rejected new task: invalid {Fields}",
                string.Join(", ", errors.Keys));
            return new CreateResult(null, errors);
        }

        TaskItem task = repo.Add(id => new TaskItem(
            id, req.Title!.Trim(), req.Priority, req.DueDate,
            IsDone: false, CreatedAt: time.GetUtcNow()));

        logger.LogInformation("Created task {TaskId} ({Priority})",
            task.Id, task.Priority);
        return new CreateResult(task, errors);
    }

    public TaskItem? Get(int id) => repo.Get(id);

    public IReadOnlyList<TaskItem> List(
        bool? done = null, bool overdueOnly = false) =>
        repo.All()
            .Where(t => done is null || t.IsDone == done)
            .Where(t => !overdueOnly || IsOverdue(t))
            .OrderByDescending(t => t.Priority)
            .ThenBy(t => t.DueDate ?? DateOnly.MaxValue)
            .ThenBy(t => t.Id)
            .ToList();

    public bool IsOverdue(TaskItem t) =>
        t is { IsDone: false, DueDate: { } due } && due < Today;

    public TaskItem? Complete(int id)
    {
        if (repo.Get(id) is not { } task) return null;
        if (task.IsDone) return task;

        TaskItem done = task with { IsDone = true };
        repo.Update(done);
        logger.LogInformation("Completed task {TaskId}", id);
        return done;
    }

    public bool Delete(int id)
    {
        bool removed = repo.Delete(id);
        if (removed) logger.LogInformation("Deleted task {TaskId}", id);
        return removed;
    }
}

// ============================================================
// File: src/TaskTracker.Api/Program.cs
// ============================================================
using System.Text.Json.Serialization;
using TaskTracker.Core;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<TaskOptions>(
    builder.Configuration.GetSection(TaskOptions.Section));
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<ITaskRepository, InMemoryTaskRepository>();
builder.Services.AddScoped<TaskService>();
builder.Services.ConfigureHttpJsonOptions(o =>
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

var tasks = app.MapGroup("/tasks");

tasks.MapGet("/", (TaskService svc, bool? done, bool? overdue) =>
    svc.List(done, overdue ?? false));

tasks.MapGet("/{id:int}", (int id, TaskService svc) =>
    svc.Get(id) is { } task ? Results.Ok(task) : Results.NotFound());

tasks.MapPost("/", (CreateTaskRequest req, TaskService svc) =>
{
    CreateResult result = svc.Create(req);
    return result.Task is { } task
        ? Results.Created($"/tasks/{task.Id}", task)
        : Results.ValidationProblem(result.Errors);
});

tasks.MapPost("/{id:int}/complete", (int id, TaskService svc) =>
    svc.Complete(id) is { } task ? Results.Ok(task) : Results.NotFound());

tasks.MapDelete("/{id:int}", (int id, TaskService svc) =>
    svc.Delete(id) ? Results.NoContent() : Results.NotFound());

app.Run();

// Lets the test project start the app with WebApplicationFactory.
public partial class Program { }

// ============================================================
// File: src/TaskTracker.Api/appsettings.json
// ============================================================
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "TaskTracker": {
    "MaxTitleLength": 80
  }
}

// ============================================================
// File: tests/TaskTracker.Tests/TaskServiceTests.cs
// ============================================================
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using TaskTracker.Core;

namespace TaskTracker.Tests;

// A clock the test controls. TimeProvider is built into .NET 8.
public sealed class FakeClock(DateTimeOffset start) : TimeProvider
{
    public DateTimeOffset Now { get; set; } = start;
    public override DateTimeOffset GetUtcNow() => Now;
}

public class TaskServiceTests
{
    private static readonly DateTimeOffset Nov4 =
        new(2026, 11, 4, 9, 0, 0, TimeSpan.Zero);

    private readonly FakeClock _clock = new(Nov4);
    private readonly TaskService _svc;

    public TaskServiceTests()
    {
        // xUnit creates a new instance per test: fresh state each time.
        _svc = new TaskService(
            new InMemoryTaskRepository(),
            _clock,
            Options.Create(new TaskOptions { MaxTitleLength = 20 }),
            NullLogger<TaskService>.Instance);
    }

    [Fact]
    public void Create_ValidRequest_AssignsIdsAndTrimsTitle()
    {
        var first = _svc.Create(new("  Buy milk  ")).Task;
        var second = _svc.Create(new("Walk dog")).Task;

        Assert.NotNull(first);
        Assert.Equal(1, first.Id);
        Assert.Equal("Buy milk", first.Title);
        Assert.Equal(2, second!.Id);
        Assert.Equal(Nov4, first.CreatedAt);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Create_BlankTitle_IsRejected(string? title)
    {
        var result = _svc.Create(new(title));

        Assert.Null(result.Task);
        Assert.Contains("title", result.Errors.Keys);
    }

    [Fact]
    public void Create_TitleLongerThanConfiguredLimit_IsRejected()
    {
        var result = _svc.Create(new(new string('x', 21)));

        Assert.Equal("Title must be 20 characters or fewer.",
            Assert.Single(result.Errors["title"]));
    }

    [Fact]
    public void Create_DueDateInThePast_IsRejected()
    {
        var result = _svc.Create(new("Late", DueDate: new(2026, 11, 3)));

        Assert.Contains("dueDate", result.Errors.Keys);
    }

    [Fact]
    public void Complete_MarksDone_AndIsIdempotent()
    {
        int id = _svc.Create(new("Write tests")).Task!.Id;

        var once = _svc.Complete(id);
        var twice = _svc.Complete(id);

        Assert.True(once!.IsDone);
        Assert.Equal(once, twice);
    }

    [Fact]
    public void Complete_UnknownId_ReturnsNull()
    {
        Assert.Null(_svc.Complete(999));
    }

    [Fact]
    public void List_OverdueOnly_FollowsTheInjectedClock()
    {
        _svc.Create(new("Report", DueDate: new(2026, 11, 10)));
        Assert.Empty(_svc.List(overdueOnly: true));

        _clock.Now = Nov4.AddDays(8); // time travel: Nov 12

        var overdue = Assert.Single(_svc.List(overdueOnly: true));
        Assert.Equal("Report", overdue.Title);
    }

    [Fact]
    public void List_SortsByPriorityThenDueDate()
    {
        _svc.Create(new("C", Priority.Low));
        _svc.Create(new("B", Priority.High, new(2026, 12, 1)));
        _svc.Create(new("A", Priority.High, new(2026, 11, 20)));

        var titles = _svc.List().Select(t => t.Title);

        Assert.Equal(["A", "B", "C"], titles);
    }
}

// ============================================================
// File: tests/TaskTracker.Tests/ApiTests.cs
// ============================================================
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Testing;
using TaskTracker.Core;

namespace TaskTracker.Tests;

public class ApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private static readonly JsonSerializerOptions Json =
        new(JsonSerializerDefaults.Web)
        {
            Converters = { new JsonStringEnumConverter() }
        };

    [Fact]
    public async Task Post_ThenGet_ReturnsTheSameTask()
    {
        HttpClient client = factory.CreateClient();

        var post = await client.PostAsJsonAsync("/tasks",
            new { title = "Ship v1", priority = "High" });

        Assert.Equal(HttpStatusCode.Created, post.StatusCode);
        var created = await post.Content
            .ReadFromJsonAsync<TaskItem>(Json);

        var fetched = await client
            .GetFromJsonAsync<TaskItem>(post.Headers.Location, Json);
        Assert.Equal(created, fetched);
        Assert.Equal(Priority.High, fetched!.Priority);
    }

    [Fact]
    public async Task Post_BlankTitle_Returns400()
    {
        HttpClient client = factory.CreateClient();

        var post = await client.PostAsJsonAsync("/tasks",
            new { title = "" });

        Assert.Equal(HttpStatusCode.BadRequest, post.StatusCode);
    }

    [Fact]
    public async Task Get_UnknownId_Returns404()
    {
        HttpClient client = factory.CreateClient();

        var response = await client.GetAsync("/tasks/12345");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}`,
    stretch: [
      "Replace InMemoryTaskRepository with an EF Core + SQLite implementation of ITaskRepository. The service and its tests should not change at all.",
      "Add PUT /tasks/{id} to edit title, priority and due date, reusing Validate, and return 409 Conflict when editing a completed task.",
      "Add Swagger (Swashbuckle.AspNetCore) and a notes.http file covering every endpoint.",
      "Add a GitHub Actions workflow that builds, tests and runs dotnet list package --vulnerable on every pull request."
    ]
  }
});
