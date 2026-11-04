(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m04",
  number: 4,
  title: "Methods",
  tagline: "Name a piece of logic once, then reuse it everywhere.",
  level: "Beginner",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m04-l01",
      title: "Defining and Calling Methods",
      minutes: 20,
      objectives: [
        "Explain why programs are split into methods",
        "Define void methods and methods that return a value",
        "Use return to exit early",
        "Put methods in a static class and call them by class name"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>A <strong>method</strong> is a named block of code you can run whenever you need it. You have used methods since your first program: <code>Console.WriteLine</code> is one. Now you will write your own.</p>
<p>Why bother? Three reasons professionals care about:</p>
<ul><li><strong>Reuse.</strong> Write the logic once, call it from many places. Fix a bug once.</li><li><strong>Naming.</strong> <code>CalculateTax(price)</code> explains itself. Twenty lines of arithmetic do not.</li><li><strong>Testing.</strong> A small method with clear inputs and outputs is easy to check on its own (module 14).</li></ul>`
        },
        {
          type: "code",
          title: "A void method",
          code: String.raw`Greet("Ana");
Greet("Ben");

void Greet(string name)
{
    Console.WriteLine($"Hello, {name}!");
}`,
          output: `Hello, Ana!
Hello, Ben!`
        },
        {
          type: "text",
          html: `<p>The first line of a method is its <strong>signature</strong>:</p>
<ul><li><code>void</code> is the <strong>return type</strong>. <code>void</code> means "gives nothing back".</li><li><code>Greet</code> is the <strong>name</strong>. C# methods use PascalCase and usually start with a verb.</li><li><code>(string name)</code> is the <strong>parameter list</strong>: the inputs, each with a type and a name.</li></ul>
<p>When you call <code>Greet("Ana")</code>, the value <code>"Ana"</code> is copied into <code>name</code>, the body runs, and execution comes back to the line after the call.</p>`
        },
        {
          type: "table",
          headers: ["Term", "Meaning", "In Greet(\"Ana\")"],
          rows: [
            ["Parameter", "the variable in the method definition", "<code>name</code>"],
            ["Argument", "the value passed in at the call", "<code>\"Ana\"</code>"],
            ["Return type", "the type of the value sent back", "<code>void</code> (nothing)"],
            ["Call site", "the line that runs the method", "<code>Greet(\"Ana\");</code>"]
          ]
        },
        {
          type: "code",
          title: "Returning a value",
          code: String.raw`int Square(int n)
{
    return n * n;
}

bool IsLeapYear(int year)
{
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

int area = Square(7);
Console.WriteLine(area);
Console.WriteLine(Square(3) + Square(4));
Console.WriteLine(IsLeapYear(2024));
Console.WriteLine(IsLeapYear(1900));`,
          output: `49
25
True
False`
        },
        {
          type: "text",
          html: `<p><code>return</code> does two jobs: it hands a value back to the caller, and it ends the method immediately. A call like <code>Square(3)</code> is an expression, so you can store it, print it or use it in arithmetic.</p>
<p>A <code>void</code> method can use a bare <code>return;</code> to leave early. This is a <strong>guard clause</strong>: handle the special case first and get out, so the main logic is not buried in nested <code>if</code>s.</p>`
        },
        {
          type: "code",
          title: "Early return",
          code: String.raw`PrintShipping(30m);
PrintShipping(75m);

void PrintShipping(decimal orderTotal)
{
    if (orderTotal >= 50m)
    {
        Console.WriteLine("Free shipping!");
        return;
    }
    decimal missing = 50m - orderTotal;
    Console.WriteLine($"Spend {missing} more for free shipping.");
}`,
          output: `Spend 20 more for free shipping.
Free shipping!`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Errors you will meet",
          html: `<ul><li><strong>CS0161: 'Sign(int)': not all code paths return a value.</strong> A non-void method must return on every path. An <code>if</code> with a <code>return</code> but no <code>else</code> leaves a gap.</li><li><strong>CS0029: Cannot implicitly convert type 'string' to 'int'.</strong> You returned the wrong type.</li><li><strong>CS0127: Since 'Greet(string)' returns void, a return keyword must not be followed by an object expression.</strong> You wrote <code>return x;</code> in a <code>void</code> method.</li></ul>
<p>Calling <code>Square(5);</code> on its own line compiles fine but throws the result away. That is legal and almost always a mistake.</p>`
        },
        {
          type: "text",
          html: `<p>In top-level programs you can write methods straight in <code>Program.cs</code>, as above. In real projects, methods live inside a <strong>class</strong>. A <code>static class</code> is a simple container for related methods. Mark each method <code>public static</code> and call it with the class name in front.</p>`
        },
        {
          type: "code",
          title: "Methods in a static class",
          code: String.raw`Console.WriteLine(Temperature.ToFahrenheit(100));
Console.WriteLine(Temperature.ToCelsius(212));
Console.WriteLine(Temperature.ToCelsius(98.6).ToString("F1"));

static class Temperature
{
    public static double ToFahrenheit(double celsius)
    {
        return celsius * 9 / 5 + 32;
    }

    public static double ToCelsius(double fahrenheit)
    {
        return (fahrenheit - 32) * 5 / 9;
    }
}`,
          output: `212
100
37.0`
        },
        {
          type: "callout",
          tone: "deep",
          title: "What top-level methods really are",
          html: `<p>The compiler wraps top-level statements in a hidden <code>Main</code> method. Methods you write among them become <strong>local functions</strong> inside <code>Main</code>. That explains three things you will run into:</p>
<ul><li>They can be called before the line where they are written.</li><li>They cannot be overloaded (lesson 3).</li><li>Type declarations like <code>static class Temperature</code> must come after all top-level statements, or you get <strong>CS8803: Top-level statements must precede namespace and type declarations</strong>.</li></ul>`
        },
        {
          type: "callout",
          tone: "python",
          title: "def with types",
          html: `<p><code>def square(n): return n * n</code> becomes <code>int Square(int n) { return n * n; }</code>. Every parameter and the return value must have a declared type, and the compiler enforces them. <code>void</code> plays the role of a Python function that returns <code>None</code>. Python's <code>snake_case</code> names become <code>PascalCase</code> for C# methods.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`int Triple(int x)
{
    return x * 3;
}

int a = Triple(2);
int b = Triple(a);
Console.WriteLine(a + " " + b);
Console.WriteLine(Triple(a + b));`,
          answer: `6 18
72`,
          explain: `<p><code>Triple(2)</code> is 6. Passing <code>a</code> (6) gives 18. The argument <code>a + b</code> is evaluated first (24) and then tripled to 72. Arguments are always fully computed before the method runs.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the method so it returns the larger of two numbers.</p>`,
          code: String.raw`___ Max(int a, int b)
{
    if (a > b)
    {
        ___ a;
    }
    return b;
}

Console.WriteLine(Max(3, 9));`,
          blanks: [["int"], ["return"]],
          explain: `<p>The method hands back an <code>int</code>, so the return type is <code>int</code>. <code>void</code> would make both <code>return</code> statements errors (CS0127). The first <code>return</code> also exits the method, so <code>return b;</code> only runs when <code>a</code> is not larger.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This method does not compile. Why?</p>`,
          code: String.raw`string Sign(int n)
{
    if (n > 0)
    {
        return "positive";
    }
    else if (n < 0)
    {
        return "negative";
    }
}`,
          options: [
            "string is not a valid return type",
            "When n is 0 no return runs: CS0161, not all code paths return a value",
            "else if is not allowed inside a method",
            "The method must be marked static"
          ],
          answer: 1,
          explain: `<p>The compiler checks every path. For <code>n == 0</code> neither branch runs and the method would fall off the end without a value. Add a final <code>return "zero";</code>. Top-level methods do not need <code>static</code>, and <code>string</code> is a fine return type.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>What is the difference between a parameter and an argument?</p>`,
          options: [
            "They are two names for the same thing",
            "A parameter is declared in the method; an argument is the value given at the call",
            "Arguments are always numbers; parameters can be any type",
            "A parameter is the return value"
          ],
          answer: 1,
          explain: `<p>In <code>void Greet(string name)</code>, <code>name</code> is the parameter. In <code>Greet("Ana")</code>, <code>"Ana"</code> is the argument. People mix the words up in casual talk, but compiler messages use them precisely, so knowing the difference helps you read errors.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange the lines into a program that defines and uses a static helper class. Remember the rule about top-level statements.</p>`,
          lines: [
            "Console.WriteLine(Shop.AddTax(100m));",
            "static class Shop",
            "{",
            "    public static decimal AddTax(decimal price)",
            "        => price * 1.2m;",
            "}"
          ],
          explain: `<p>Top-level statements must come first, then type declarations (CS8803 otherwise). Inside the class, the method signature comes before its body. The <code>=&gt;</code> form is a shortcut you will learn in lesson 3.</p>`
        }
      ],
      takeaways: [
        "A method has a return type, a name, a parameter list and a body.",
        "void methods give nothing back; other methods must return on every path (CS0161).",
        "return hands back a value and exits the method immediately.",
        "Guard clauses return early so the main logic stays flat.",
        "Real projects put methods in classes; call static ones as ClassName.Method()."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m04-l02",
      title: "Parameters: Optional, Named and params",
      minutes: 20,
      objectives: [
        "Give parameters default values to make them optional",
        "Pass arguments by name to make calls readable",
        "Accept any number of arguments with params",
        "Know the ordering rules the compiler enforces"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>By default, arguments are matched to parameters by <strong>position</strong>: the first argument goes to the first parameter, and so on. Every parameter must get a value. C# gives you three tools to make calls more flexible: optional parameters, named arguments and <code>params</code>.</p>`
        },
        {
          type: "code",
          title: "Optional parameters",
          code: String.raw`Console.WriteLine(Pad("Total"));
Console.WriteLine(Pad("Total", 12));
Console.WriteLine(Pad("Total", 12, '-'));

string Pad(string text, int width = 10, char fill = '.')
{
    return text.PadRight(width, fill) + "|";
}`,
          output: `Total.....|
Total.......|
Total-------|`
        },
        {
          type: "text",
          html: `<p>Writing <code>= value</code> after a parameter gives it a <strong>default</strong>. Callers may leave it out and the default is used. This replaces writing three nearly identical methods.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Rules for defaults",
          html: `<ul><li>Optional parameters must come after all required ones: <strong>CS1737: Optional parameters must appear after all required parameters</strong>.</li><li>A default must be a compile-time constant, such as a number, string, <code>true</code>, or <code>null</code>. <code>DateTime d = DateTime.Now</code> fails with <strong>CS1736: Default parameter value for 'd' must be a compile-time constant</strong>. The usual workaround is a nullable parameter defaulting to <code>null</code> that you replace inside the method.</li></ul>`
        },
        {
          type: "text",
          html: `<p><strong>Named arguments</strong> let the caller write <code>parameterName: value</code>. Two big benefits: you can skip optional parameters in the middle, and the call site documents itself.</p>`
        },
        {
          type: "code",
          title: "Named arguments",
          code: String.raw`PrintLabel("sale");
PrintLabel("new", uppercase: false);
PrintLabel(border: '*', text: "hot");

void PrintLabel(string text, char border = '=',
                bool uppercase = true)
{
    string shown = uppercase ? text.ToUpper() : text;
    string line = new string(border, shown.Length + 4);
    Console.WriteLine(line);
    Console.WriteLine($"{border} {shown} {border}");
    Console.WriteLine(line);
}`,
          output: `========
= SALE =
========
=======
= new =
=======
*******
* HOT *
*******`
        },
        {
          type: "callout",
          tone: "tip",
          title: "Name your booleans",
          html: `<p>A call like <code>Export(report, true, false)</code> is unreadable. Which flag is which? <code>Export(report, includeHeader: true, compress: false)</code> costs a few keystrokes and saves every future reader a trip to the definition. Many teams require named arguments for <code>bool</code> literals.</p>`
        },
        {
          type: "text",
          html: `<p>Sometimes you do not know how many arguments a caller will pass. Mark the last parameter <code>params</code> and give it an array type. The compiler collects any number of arguments (even zero) into the array. Callers can also pass an existing array directly.</p>`
        },
        {
          type: "code",
          title: "params arrays",
          code: String.raw`Console.WriteLine(Sum());
Console.WriteLine(Sum(5));
Console.WriteLine(Sum(1, 2, 3, 4));

int[] values = { 10, 20, 30 };
Console.WriteLine(Sum(values));

Log("INFO", "Server", "started", "on", "port", "8080");

int Sum(params int[] numbers)
{
    int total = 0;
    foreach (int n in numbers)
    {
        total += n;
    }
    return total;
}

void Log(string level, params string[] words)
{
    Console.WriteLine($"[{level}] " + string.Join(" ", words));
}`,
          output: `0
5
10
60
[INFO] Server started on port 8080`
        },
        {
          type: "callout",
          tone: "note",
          title: "params rules",
          html: `<p>A method can have only one <code>params</code> parameter, and it must be last: <strong>CS0231: A params parameter must be the last parameter in a parameter list</strong>. You already use this feature: <code>string.Join</code>, <code>string.Format</code> and <code>Console.WriteLine("{0} {1}", a, b)</code> all take <code>params</code>. C# 13 (.NET 9) extends <code>params</code> to other collection types; in this course we use arrays.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Defaults, keywords and *args",
          html: `<p>Python's <code>def pad(text, width=10)</code>, <code>pad(text="x")</code> and <code>def total(*nums)</code> map directly to optional parameters, named arguments and <code>params</code>. One Python trap does not exist here: since C# defaults must be constants, you cannot share a mutable default like <code>def f(items=[])</code>. C# has no direct <code>**kwargs</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`Describe("Mug");
Describe("Lamp", 3);
Describe("Desk", inStock: false);

void Describe(string item, int qty = 1, bool inStock = true)
{
    string status = inStock ? "available" : "backorder";
    Console.WriteLine($"{qty} x {item} ({status})");
}`,
          answer: `1 x Mug (available)
3 x Lamp (available)
1 x Desk (backorder)`,
          explain: `<p>Missing arguments take their defaults. The third call skips <code>qty</code> by naming <code>inStock</code>, so <code>qty</code> keeps its default of 1. Without the name, <code>Describe("Desk", false)</code> would try to put <code>false</code> into the <code>int</code> parameter and fail to compile.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the signature so <code>Average</code> accepts any number of <code>double</code> values.</p>`,
          code: String.raw`double Average(___ double[] values)
{
    if (values.Length == 0) return 0;
    double sum = 0;
    foreach (double v in values) sum += v;
    return sum / values.___;
}

Console.WriteLine(Average(2, 4, 9));`,
          blanks: [["params"], ["Length"]],
          explain: `<p><code>params</code> lets callers write <code>Average(2, 4, 9)</code> instead of building an array. Inside the method it is an ordinary array, so its size is <code>Length</code>. The empty check matters because a caller may pass nothing at all, and 0 / 0 for doubles is <code>NaN</code>.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Given <code>void Book(string room, int nights = 1, bool breakfast = false)</code>, which call does <strong>not</strong> compile?</p>`,
          options: [
            "Book(\"101\");",
            "Book(\"101\", breakfast: true);",
            "Book(nights: 2, room: \"101\");",
            "Book(\"101\", true);"
          ],
          answer: 3,
          explain: `<p>Positional arguments fill parameters in order, so <code>true</code> lands in <code>nights</code>, an <code>int</code>. There is no conversion from <code>bool</code> to <code>int</code>, so it is a compile error. The other calls are fine: named arguments can skip optional parameters and can appear in any order.</p>`
        },
        {
          type: "bug",
          prompt: `<p>Why does this declaration fail to compile?</p>`,
          code: String.raw`void SendEmail(string subject = "(no subject)",
               string to)
{
    Console.WriteLine($"To {to}: {subject}");
}`,
          options: [
            "Strings cannot have default values",
            "An optional parameter comes before a required one (CS1737)",
            "Defaults must be numbers",
            "Parameters cannot span two lines"
          ],
          answer: 1,
          explain: `<p>Required parameters must come first, otherwise the compiler could not tell which positional argument goes where. Swap them: <code>(string to, string subject = "(no subject)")</code>. String constants are valid defaults, and line breaks inside a parameter list are fine.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange the lines into a method that prints a heading and then every item passed to it.</p>`,
          lines: [
            "void PrintList(string heading, params string[] items)",
            "{",
            "    Console.WriteLine(heading);",
            "    foreach (string item in items)",
            "        Console.WriteLine(\"- \" + item);",
            "}"
          ],
          explain: `<p>The <code>params</code> parameter goes last in the signature. The heading prints once before the loop; the loop prints each item. You could call it as <code>PrintList("Groceries", "milk", "eggs")</code>.</p>`
        }
      ],
      takeaways: [
        "Default values make parameters optional; they go after required ones (CS1737).",
        "Defaults must be compile-time constants (CS1736).",
        "Named arguments skip optional parameters and make bool flags readable.",
        "params collects any number of arguments into an array; it must be last.",
        "Positional arguments always fill parameters left to right."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m04-l03",
      title: "Overloading, Expression Bodies and Local Functions",
      minutes: 22,
      objectives: [
        "Write overloaded methods that differ by parameter list",
        "Predict which overload the compiler picks",
        "Shorten one-line methods with =>",
        "Hide helper logic inside a method with local functions"
      ],
      blocks: [
        {
          type: "text",
          html: `<p><strong>Overloading</strong> means several methods share a name but have different parameter lists. <code>Console.WriteLine</code> has over a dozen overloads: one for <code>int</code>, one for <code>string</code>, one for <code>double</code>, and so on. Callers just write <code>WriteLine(x)</code> and the compiler picks the right one.</p>`
        },
        {
          type: "code",
          title: "Overloads in a class",
          code: String.raw`Console.WriteLine(Geometry.Area(2.0));
Console.WriteLine(Geometry.Area(3.0, 4.0));
Console.WriteLine(Geometry.Area(5));

static class Geometry
{
    // Circle
    public static double Area(double radius)
    {
        return Math.Round(Math.PI * radius * radius, 2);
    }

    // Rectangle
    public static double Area(double width, double height)
    {
        return width * height;
    }

    // Square with whole-number sides
    public static int Area(int side)
    {
        return side * side;
    }
}`,
          output: `12.57
12
25`
        },
        {
          type: "text",
          html: `<p>Overloads must differ in the <strong>number</strong>, <strong>types</strong> or <strong>order</strong> of their parameters. The compiler looks at the arguments and picks the best match. <code>Area(5)</code> has an <code>int</code> argument, so the <code>int</code> overload is an exact match and wins over the <code>double</code> one, even though an <code>int</code> could convert to <code>double</code>.</p>
<p>If two overloads are equally good, you get <strong>CS0121: The call is ambiguous between the following methods or properties</strong>.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "What does not count as an overload",
          html: `<ul><li>A different <strong>return type</strong> alone is not enough. <code>int F(int a)</code> and <code>double F(int a)</code> give <strong>CS0111: Type 'M' already defines a member called 'F' with the same parameter types</strong>. The compiler chooses by arguments, and the arguments are identical.</li><li>Different parameter <strong>names</strong> alone do not count either.</li><li>Top-level methods in <code>Program.cs</code> are local functions, and local functions cannot be overloaded: <strong>CS0128: A local variable or function named 'Area' is already defined in this scope</strong>. Put overloads in a class.</li></ul>`
        },
        {
          type: "text",
          html: `<p><strong>Expression-bodied members.</strong> When a method body is a single expression, replace <code>{ return ...; }</code> with <code>=&gt;</code>. It works for <code>void</code> methods too, when the body is a single call.</p>`
        },
        {
          type: "code",
          title: "=> for one-liners",
          code: String.raw`Console.WriteLine(Num.IsEven(10));
Console.WriteLine(Num.Clamp(150, 0, 100));
Num.Rule();
Console.WriteLine(Num.Percent(1, 3));

static class Num
{
    public static bool IsEven(int n) => n % 2 == 0;

    public static int Clamp(int value, int min, int max) =>
        value < min ? min : value > max ? max : value;

    public static void Rule() => Console.WriteLine("----------");

    public static string Percent(int part, int whole) =>
        $"{100.0 * part / whole:F1}%";
}`,
          output: `True
100
----------
33.3%`
        },
        {
          type: "callout",
          tone: "tip",
          title: "When to use =>",
          html: `<p>Use the arrow when the whole method fits comfortably on one or two lines and reads as "this method <em>is</em> this expression". Once you need a local variable, an <code>if</code> statement or a loop, go back to a block body. Long ternary chains squeezed behind <code>=&gt;</code> are harder to read than a plain <code>if</code>.</p>`
        },
        {
          type: "text",
          html: `<p><strong>Local functions</strong> are methods declared inside another method. Use them for a helper that only makes sense to one method. Nobody else can call it, so it does not clutter the class. A local function can read the outer method's parameters and variables. This is called <strong>capturing</strong>.</p>`
        },
        {
          type: "code",
          title: "Local functions",
          code: String.raw`Report.Print(new[] { "Ana", "Ben", "Cy" },
             new[] { 92, 67, 81 });

static class Report
{
    public static void Print(string[] names, int[] scores)
    {
        int width = 22;
        Line();
        for (int i = 0; i < names.Length; i++)
        {
            Console.WriteLine(
                $"{names[i],-5}{scores[i],4}  {Bar(scores[i])}");
        }
        Line();

        void Line() => Console.WriteLine(new string('=', width));
        static string Bar(int score) => new string('#', score / 10);
    }
}`,
          output: `======================
Ana    92  #########
Ben    67  ######
Cy     81  ########
======================`
        },
        {
          type: "callout",
          tone: "deep",
          title: "static local functions",
          html: `<p><code>Line</code> captures <code>width</code> from the outer method. <code>Bar</code> is marked <code>static</code>, which forbids capturing: if it tried to read <code>width</code> you would get <strong>CS8421: A static local function cannot contain a reference to 'width'</strong>. Marking helpers <code>static</code> when they do not need outer state makes their inputs explicit and avoids hidden allocations. Like other local functions, both can be declared after the code that calls them.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Python has no overloading",
          html: `<p>In Python, a second <code>def area(...)</code> silently replaces the first. Python code uses default arguments or type checks instead. C# keeps every overload and picks one at compile time based on argument types. Local functions are like nested <code>def</code>s; the <code>=&gt;</code> body is similar in spirit to a one-line function, though C# lambdas (module 9) are the true cousin of <code>lambda</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>Which overloads run? Note that there is no <code>char</code> overload.</p>`,
          code: String.raw`Printer.Show(42);
Printer.Show(4.2);
Printer.Show("42");
Printer.Show('A');

static class Printer
{
    public static void Show(int v) =>
        Console.WriteLine($"int {v}");
    public static void Show(double v) =>
        Console.WriteLine($"double {v}");
    public static void Show(string v) =>
        Console.WriteLine($"string {v}");
}`,
          answer: `int 42
double 4.2
string 42
int 65`,
          explain: `<p>The first three are exact matches. For <code>'A'</code>, there is no <code>char</code> overload, but a <code>char</code> converts implicitly to <code>int</code> (its character code, 65), and <code>int</code> is a better match than <code>double</code>. It never picks <code>string</code>, because there is no implicit conversion from <code>char</code> to <code>string</code>.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Rewrite <code>Cube</code> as an expression-bodied method.</p>`,
          code: String.raw`Console.WriteLine(Cube(3));

int Cube(int n) ___ n * n * n;`,
          blanks: [["=>"]],
          explain: `<p>The arrow replaces <code>{ return n * n * n; }</code>. There is no <code>return</code> keyword after <code>=&gt;</code>; the expression itself is the result. It prints 27.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Inside a static class you write <code>public static int Parse(string s)</code> and <code>public static double Parse(string s)</code>. What happens?</p>`,
          options: [
            "It compiles; the caller's variable type picks the overload",
            "It compiles; the first one declared wins",
            "Error CS0111: a member with the same parameter types already exists",
            "Error CS0121: the call is ambiguous"
          ],
          answer: 2,
          explain: `<p>Overloads are chosen by the arguments, never by the return type or by what you assign the result to. With identical parameter lists, the compiler rejects the second declaration outright (CS0111). CS0121 is a different error: it appears at a <em>call</em> when two valid overloads tie.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This file does not compile. What is wrong?</p>`,
          code: String.raw`Console.WriteLine(Describe(5));
Console.WriteLine(Describe("five"));

string Describe(int n) => $"number {n}";
string Describe(string s) => $"text {s}";`,
          options: [
            "Expression-bodied methods cannot return strings",
            "Top-level methods are local functions and cannot be overloaded (CS0128)",
            "Methods must be declared before they are called",
            "String interpolation is not allowed after =>"
          ],
          answer: 1,
          explain: `<p>Methods written among top-level statements become local functions, and two local functions cannot share a name. Move both into a <code>static class</code> to overload them. Local functions can be called before they are declared, and <code>=&gt;</code> works with any return type.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange the lines so <code>Summary</code> uses a local function to format each value.</p>`,
          lines: [
            "static string Summary(int min, int max)",
            "{",
            "    return $\"{Fmt(min)} to {Fmt(max)}\";",
            "    static string Fmt(int v) => v.ToString(\"N0\");",
            "}"
          ],
          explain: `<p>The outer signature and opening brace come first. The <code>return</code> can call <code>Fmt</code> even though it is declared later, because local functions are visible throughout their enclosing block. The local function sits inside the outer method's braces.</p>`
        }
      ],
      takeaways: [
        "Overloads share a name but differ in number, types or order of parameters.",
        "Return type alone cannot distinguish overloads (CS0111).",
        "Top-level methods cannot be overloaded; put overloads in a class.",
        "=> replaces { return ...; } for one-expression methods.",
        "Local functions keep private helpers inside the method that uses them; static ones cannot capture."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m04-l04",
      title: "Passing Arguments: Value, ref, out and in",
      minutes: 24,
      objectives: [
        "Explain why a method cannot change a caller's int by default",
        "Predict what happens when you pass an array to a method",
        "Use ref and out, and write your own TryParse-style method",
        "Know what in is for"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>By default, C# passes arguments <strong>by value</strong>: the method gets a <em>copy</em>. Changing the parameter changes the copy, not the caller's variable.</p>`
        },
        {
          type: "code",
          title: "Pass by value",
          code: String.raw`int score = 10;
AddBonus(score);
Console.WriteLine($"After the call: {score}");

void AddBonus(int points)
{
    points += 5;
    Console.WriteLine($"Inside: {points}");
}`,
          output: `Inside: 15
After the call: 10`
        },
        {
          type: "text",
          html: `<p>Arrays and objects are <strong>reference types</strong>. The variable holds a reference (think: an address) to data stored elsewhere. Passing it by value copies the <em>reference</em>, so the method and the caller point at the <em>same</em> array. Changing an element is visible to the caller. Pointing the parameter at a brand new array is not. (Python lists behave exactly the same way.) Module 6 explores reference types in depth.</p>`
        },
        {
          type: "code",
          title: "Arrays: shared data, separate variables",
          code: String.raw`int[] scores = { 10, 20 };

BoostFirst(scores);
Console.WriteLine(scores[0]);

Replace(scores);
Console.WriteLine(scores[0]);

void BoostFirst(int[] arr)
{
    arr[0] += 5;          // changes the shared array
}

void Replace(int[] arr)
{
    arr = new int[] { 99, 99 };  // only changes the copy
}`,
          output: `15
15`
        },
        {
          type: "text",
          html: `<p>When you really want a method to change the caller's variable, pass it <strong>by reference</strong> with <code>ref</code>. The parameter becomes another name for the caller's variable. You must write <code>ref</code> in both the definition and the call, so readers can see at a glance that the variable may change.</p>`
        },
        {
          type: "code",
          title: "ref",
          code: String.raw`int a = 1;
int b = 2;
Swap(ref a, ref b);
Console.WriteLine($"a = {a}, b = {b}");

int lives = 3;
LoseLife(ref lives);
LoseLife(ref lives);
Console.WriteLine($"Lives left: {lives}");

void Swap(ref int x, ref int y)
{
    int temp = x;
    x = y;
    y = temp;
}

void LoseLife(ref int count)
{
    count--;
}`,
          output: `a = 2, b = 1
Lives left: 1`
        },
        {
          type: "callout",
          tone: "warning",
          title: "ref errors",
          html: `<ul><li>Forget <code>ref</code> at the call and you get <strong>CS1620: Argument 1 must be passed with the 'ref' keyword</strong>.</li><li>A <code>ref</code> argument must already have a value: <strong>CS0165: Use of unassigned local variable</strong>.</li><li>Only variables can be passed by <code>ref</code>, not literals like <code>Swap(ref 1, ref 2)</code>.</li></ul>
<p>In everyday code, returning a new value (<code>lives = LoseLife(lives);</code>) is usually clearer than <code>ref</code>. Reach for <code>ref</code> when a method must update several of the caller's variables, like <code>Swap</code>.</p>`
        },
        {
          type: "text",
          html: `<p><code>out</code> is a cousin of <code>ref</code> built for <strong>extra results</strong>. The caller's variable does not need a value beforehand, and the method <strong>must</strong> assign it before returning. The most famous example is the <strong>TryParse pattern</strong>: return a <code>bool</code> that says whether it worked, and hand the actual result back through an <code>out</code> parameter.</p>
<ul><li><code>out int quotient</code> declares the variable right in the call. <code>out var quotient</code> also works.</li><li><code>out _</code> is a discard: "I do not need this value".</li><li>Forget to assign an <code>out</code> parameter on some path and you get <strong>CS0177: The out parameter 'result' must be assigned to before control leaves the current method</strong>.</li></ul>`
        },
        {
          type: "code",
          title: "Writing a Try method",
          code: String.raw`if (TryDivide(17, 5, out int quotient))
{
    Console.WriteLine($"17 / 5 = {quotient}");
}

if (!TryDivide(8, 0, out _))
{
    Console.WriteLine("Cannot divide by zero.");
}

bool TryDivide(int a, int b, out int result)
{
    if (b == 0)
    {
        result = 0;   // out must be assigned on every path
        return false;
    }
    result = a / b;
    return true;
}`,
          output: `17 / 5 = 3
Cannot divide by zero.`
        },
        {
          type: "code",
          title: "The built-in TryParse",
          code: String.raw`string[] inputs = { "42", "-7", " 12 ", "3.5", "abc", "" };

foreach (string text in inputs)
{
    if (int.TryParse(text, out int value))
    {
        Console.WriteLine($"'{text}' -> {value}");
    }
    else
    {
        Console.WriteLine($"'{text}' -> not a whole number");
    }
}`,
          output: `'42' -> 42
'-7' -> -7
' 12 ' -> 12
'3.5' -> not a whole number
'abc' -> not a whole number
'' -> not a whole number`
        },
        {
          type: "text",
          html: `<p><code>int.TryParse</code> never throws on bad input, which is why professionals prefer it over <code>int.Parse</code> for anything a user typed. Notice that surrounding spaces are allowed.</p>
<p>The last modifier, <code>in</code>, passes by reference but <strong>read-only</strong>. Assigning to an <code>in</code> parameter is <strong>CS8331: Cannot assign to variable 'value' ... because it is a readonly variable</strong>. It exists to avoid copying large structs (module 13) and you will rarely need it for small types like <code>int</code>.</p>`
        },
        {
          type: "table",
          headers: ["Modifier", "Caller writes", "Must be set before call?", "Method may change it?"],
          rows: [
            ["(none)", "<code>F(x)</code>", "yes", "changes a copy only"],
            ["<code>ref</code>", "<code>F(ref x)</code>", "yes", "yes, caller sees it"],
            ["<code>out</code>", "<code>F(out x)</code>", "no", "must assign it"],
            ["<code>in</code>", "<code>F(x)</code> or <code>F(in x)</code>", "yes", "no, read-only"]
          ]
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`int x = 5;
int y = 5;
Change(x, ref y);
Console.WriteLine($"{x} {y}");

void Change(int a, ref int b)
{
    a = a * 10;
    b = b * 10;
}`,
          answer: `5 50`,
          explain: `<p><code>a</code> is a copy of <code>x</code>, so <code>x</code> stays 5. <code>b</code> is another name for <code>y</code> because of <code>ref</code>, so <code>y</code> becomes 50.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the Try method and its call.</p>`,
          code: String.raw`bool TryGetDiscount(string code, ___ int percent)
{
    percent = code == "SAVE10" ? 10 : 0;
    return percent > 0;
}

if (TryGetDiscount("SAVE10", ___ int p))
{
    Console.WriteLine($"{p}% off");
}`,
          blanks: [["out"], ["out"]],
          explain: `<p><code>out</code> appears in both places. <code>ref</code> would compile in the definition but then the call would need an already-assigned variable, which defeats the purpose. The method assigns <code>percent</code> on its only path, so CS0177 is satisfied. It prints <code>10% off</code>.</p>`
        },
        {
          type: "mcq",
          prompt: `<p><code>bool ok = int.TryParse("12a", out int n);</code> What are <code>ok</code> and <code>n</code>?</p>`,
          options: [
            "ok is true, n is 12",
            "ok is false, n is 0",
            "It throws FormatException",
            "ok is false, n is unassigned"
          ],
          answer: 1,
          explain: `<p>"12a" is not a valid integer, so <code>TryParse</code> returns <code>false</code>. Because an <code>out</code> parameter must always be assigned, it sets <code>n</code> to the default, 0. It never throws; that is the whole point of the Try pattern. <code>int.Parse</code> is the one that throws <code>FormatException</code>.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This method does not compile. Why?</p>`,
          code: String.raw`bool TryFindIndex(string[] items, string target,
                  out int index)
{
    for (int i = 0; i < items.Length; i++)
    {
        if (items[i] == target)
        {
            index = i;
            return true;
        }
    }
    return false;
}`,
          options: [
            "for loops cannot contain return",
            "index is not assigned when the item is not found (CS0177)",
            "Strings cannot be compared with ==",
            "out parameters must come first"
          ],
          answer: 1,
          explain: `<p>If the loop finishes without a match, the method returns <code>false</code> without ever setting <code>index</code>. Every path must assign an <code>out</code> parameter. Add <code>index = -1;</code> before <code>return false;</code>. In C#, <code>==</code> compares string contents, and <code>out</code> parameters can be anywhere in the list.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange the lines to read a number safely, defaulting to 1 when the text is not valid.</p>`,
          lines: [
            "string text = \"abc\";",
            "if (!int.TryParse(text, out int qty))",
            "{",
            "    qty = 1;",
            "}",
            "Console.WriteLine($\"Quantity: {qty}\");"
          ],
          explain: `<p><code>out int qty</code> declares <code>qty</code> in the surrounding scope, so it can be reassigned and printed after the <code>if</code>. With "abc" the parse fails, the fallback runs, and it prints <code>Quantity: 1</code>.</p>`
        }
      ],
      takeaways: [
        "Arguments are copied by default; changing a parameter does not change the caller's int.",
        "Arrays are references: a method can change their elements but not the caller's variable.",
        "ref lets a method update the caller's variable; write ref at both ends.",
        "out returns an extra result and must be assigned on every path (CS0177).",
        "bool TryX(input, out result) is the standard .NET pattern for operations that may fail."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m04-l05",
      title: "Recursion, Scope and XML Docs",
      minutes: 24,
      objectives: [
        "Write a recursive method with a base case and a recursive step",
        "Trace the call stack and recognise stack overflow",
        "Explain where a variable is visible",
        "Document a method with XML doc comments"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>A <strong>recursive</strong> method calls itself. It works when a problem can be described in terms of a smaller version of itself. Every recursive method needs two parts:</p>
<ul><li>a <strong>base case</strong> that answers directly, without calling itself;</li><li>a <strong>recursive step</strong> that calls itself on a smaller input, moving toward the base case.</li></ul>`
        },
        {
          type: "code",
          title: "Factorial",
          code: String.raw`for (int i = 0; i <= 5; i++)
{
    Console.WriteLine($"{i}! = {Factorial(i)}");
}

long Factorial(int n)
{
    if (n <= 1)
    {
        return 1;                 // base case
    }
    return n * Factorial(n - 1);  // recursive step
}`,
          output: `0! = 1
1! = 1
2! = 2
3! = 6
4! = 24
5! = 120`
        },
        {
          type: "text",
          html: `<p>Each call gets its own fresh set of parameters and local variables, stored in a <strong>stack frame</strong>. <code>Factorial(3)</code> waits for <code>Factorial(2)</code>, which waits for <code>Factorial(1)</code>. When the base case returns, the waiting calls finish in reverse order. You can watch it happen:</p>`
        },
        {
          type: "code",
          title: "Tracing the call stack",
          code: String.raw`CountDown(3, 0);

void CountDown(int n, int depth)
{
    string indent = new string(' ', depth * 2);
    Console.WriteLine($"{indent}enter CountDown({n})");
    if (n > 0)
    {
        CountDown(n - 1, depth + 1);
    }
    Console.WriteLine($"{indent}leave CountDown({n})");
}`,
          output: `enter CountDown(3)
  enter CountDown(2)
    enter CountDown(1)
      enter CountDown(0)
      leave CountDown(0)
    leave CountDown(1)
  leave CountDown(2)
leave CountDown(3)`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Stack overflow",
          html: `<p>Forget the base case, or make a step that never reaches it, and calls pile up until the stack (about 1 MB by default) runs out. .NET then kills the whole process with <strong>Stack overflow</strong>. Unlike most errors, a <code>StackOverflowException</code> cannot be caught with <code>try/catch</code>. (Python stops at about 1000 calls with a catchable <code>RecursionError</code>; C# has no such safety net.) Always check: does every path eventually hit the base case?</p>`
        },
        {
          type: "code",
          title: "Recursion is not always the best tool",
          code: String.raw`int calls = 0;
Console.WriteLine($"Fib(25) = {Fib(25)}, calls: {calls}");
Console.WriteLine($"FibLoop(25) = {FibLoop(25)}");

int Fib(int n)
{
    calls++;
    if (n < 2) return n;
    return Fib(n - 1) + Fib(n - 2);
}

int FibLoop(int n)
{
    int previous = 0, current = 1;
    for (int i = 0; i < n; i++)
    {
        int next = previous + current;
        previous = current;
        current = next;
    }
    return previous;
}`,
          output: `Fib(25) = 75025, calls: 242785
FibLoop(25) = 75025`
        },
        {
          type: "text",
          html: `<p>The recursive Fibonacci recomputes the same values over and over, so its call count explodes. The loop version does 25 additions. Recursion shines for naturally nested data such as folder trees, menus and expression parsers (you will write one in module 13). For simple counting, a loop is usually faster and safer.</p>
<p><strong>Scope</strong> is the region of code where a name is visible. A variable declared inside braces lives until the closing brace. Each method has its own scope, so two methods can both have a variable called <code>result</code> without conflict.</p>`
        },
        {
          type: "code",
          title: "Scope in practice",
          code: String.raw`int total = 0;

for (int i = 1; i <= 3; i++)
{
    int doubled = i * 2;    // exists only inside this loop body
    total += doubled;
}
// Console.WriteLine(doubled);  // CS0103: does not exist here

if (total > 10)
{
    string label = "big";
    Console.WriteLine(label);
}
else
{
    string label = "small"; // a different variable, no clash
    Console.WriteLine(label);
}

Console.WriteLine(Twice(total));

int Twice(int value)
{
    int result = value * 2;  // local to Twice
    return result;
}`,
          output: `big
24`
        },
        {
          type: "callout",
          tone: "note",
          title: "Shadowing is blocked",
          html: `<p>C# will not let an inner block reuse a name that is still alive in an enclosing block. <code>int x = 1; { int x = 2; }</code> gives <strong>CS0136: A local or parameter named 'x' cannot be declared in this scope because that name is used in an enclosing local scope</strong>. That rule prevents a whole category of "which x did I mean?" bugs. Sibling blocks, like the <code>if</code> and <code>else</code> above, are fine.</p>`
        },
        {
          type: "text",
          html: `<p><strong>XML documentation comments</strong> start with <code>///</code> and sit directly above a method. Visual Studio, VS Code and Rider show them as tooltips (IntelliSense) wherever the method is called. The common tags are <code>&lt;summary&gt;</code>, <code>&lt;param name="..."&gt;</code> and <code>&lt;returns&gt;</code>. Type <code>///</code> above a method and your editor fills in the skeleton.</p>`
        },
        {
          type: "code",
          title: "Documenting a public method",
          code: String.raw`Console.WriteLine(Pricing.ApplyDiscount(80m, 25));
Console.WriteLine(Pricing.ApplyDiscount(19.99m, 15));

static class Pricing
{
    /// <summary>
    /// Reduces a price by a percentage.
    /// </summary>
    /// <param name="price">The original price.</param>
    /// <param name="percent">Discount from 0 to 100.</param>
    /// <returns>The discounted price, rounded to cents.</returns>
    public static decimal ApplyDiscount(decimal price, int percent)
    {
        return Math.Round(price * (100 - percent) / 100m, 2);
    }
}`,
          output: `60
16.99`
        },
        {
          type: "callout",
          tone: "deep",
          title: "Docs as build output",
          html: `<p>Add <code>&lt;GenerateDocumentationFile&gt;true&lt;/GenerateDocumentationFile&gt;</code> to the <code>.csproj</code> and the build produces an XML file that ships with your library, so other developers get your tooltips too. The compiler then warns <strong>CS1591: Missing XML comment for publicly visible type or member</strong> for anything public you forgot to document. Document the <em>why</em> and the contract (valid inputs, what is returned), not a restatement of the code.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`Console.WriteLine(SumDigits(4072));

int SumDigits(int n)
{
    if (n < 10)
    {
        return n;
    }
    return n % 10 + SumDigits(n / 10);
}`,
          answer: `13`,
          explain: `<p><code>n % 10</code> takes the last digit and <code>n / 10</code> drops it (integer division). The calls are 2 + SumDigits(407), 7 + SumDigits(40), 0 + SumDigits(4), and the base case returns 4. Total: 2 + 7 + 0 + 4 = 13.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the recursive power method so <code>Power(2, 5)</code> returns 32.</p>`,
          code: String.raw`int Power(int b, int exp)
{
    if (exp == ___)
    {
        return 1;
    }
    return b * Power(b, exp ___ 1);
}

Console.WriteLine(Power(2, 5));`,
          blanks: [["0"], ["-"]],
          explain: `<p>Anything to the power 0 is 1, so <code>exp == 0</code> is the base case. Each step must shrink <code>exp</code> toward 0, so subtract 1. Using <code>+</code> would move away from the base case and overflow the stack.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>What happens when you run this?</p>`,
          code: String.raw`int Countdown(int n)
{
    Console.WriteLine(n);
    return Countdown(n - 1);
}
Countdown(3);`,
          options: [
            "It prints 3, 2, 1 and stops",
            "Compile error: a method cannot call itself",
            "It prints numbers until the process crashes with a stack overflow",
            "It throws an exception you can catch with try/catch"
          ],
          answer: 2,
          explain: `<p>There is no base case, so the calls never stop. Each one adds a stack frame until the stack is full and .NET terminates the process. Recursion is perfectly legal, so it compiles. A stack overflow cannot be caught, which is why the last option is wrong.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This does not compile. Which line causes the error?</p>`,
          code: String.raw`int count = 0;
for (int i = 0; i < 3; i++)
{
    int step = i * 2;
    count += step;
}
Console.WriteLine(count + step);`,
          options: [
            "int count = 0; because count is never used",
            "count += step; because step is declared after use",
            "The last line: step only exists inside the loop body (CS0103)",
            "for (int i = 0; ...) because i shadows count"
          ],
          answer: 2,
          explain: `<p><code>step</code> is declared inside the loop's braces, so its scope ends at the closing brace. The last line cannot see it. <code>count</code> is declared outside, so it is fine. <code>i</code> and <code>count</code> are different names, so there is no shadowing.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange the lines into a documented recursive method that adds the numbers from 1 to n.</p>`,
          lines: [
            "/// <summary>Adds the whole numbers from 1 to n.</summary>",
            "static int SumTo(int n)",
            "{",
            "    if (n <= 0) return 0;",
            "    return n + SumTo(n - 1);",
            "}"
          ],
          explain: `<p>The XML comment sits directly above the signature. Inside, the base case comes first so it is checked before recursing. <code>n &lt;= 0</code> is safer than <code>n == 0</code> because a negative input would otherwise never reach the base case.</p>`
        }
      ],
      takeaways: [
        "A recursive method needs a base case and a step that moves toward it.",
        "Each call has its own stack frame; without a base case you get an uncatchable stack overflow.",
        "Prefer loops for simple repetition; recursion suits nested, tree-like problems.",
        "A variable is visible from its declaration to the end of its enclosing braces.",
        "/// XML comments document public methods and power IntelliSense tooltips."
      ]
    }
  ],
  milestone: {
    id: "m04-project",
    title: "Menu Calculator",
    brief: `<p>Build a console calculator driven by a menu. The user picks an operation, types the numbers, and sees the result. The menu then comes back until they choose Exit.</p>
<p>The point of this project is structure. Every operation is its own method, input reading is a reusable Try method, and nothing is copy-pasted. As a bonus feature, typing <code>ans</code> instead of a number reuses the previous result, just like a real calculator.</p>`,
    skills: ["methods and return values", "static classes", "expression-bodied members", "out parameters and the Try pattern", "optional parameters", "params", "recursion"],
    requirements: [
      "Show a menu with 1) Add 2) Subtract 3) Multiply 4) Divide 5) Power 6) Average of three 0) Exit, repeated after each calculation.",
      "Put the math in a static class Calc; Add, Subtract and Multiply are expression-bodied.",
      "Divide uses bool TryDivide(double a, double b, out double result) and prints an error for division by zero.",
      "Power(double b, int exp) is recursive and handles negative exponents (2 ^ -2 = 0.25).",
      "Average uses a params double[] parameter.",
      "A TryReadNumber(string prompt, out double value) method re-prompts on invalid input and returns false when input ends.",
      "Typing ans at any number prompt uses the last result.",
      "Results are shown through a FormatNumber(double value, int decimals = 4) helper with an optional parameter.",
      "On exit (menu choice 0 or end of input) print how many calculations were done."
    ],
    sampleRun: `=== Menu Calculator ===

1) Add  2) Subtract  3) Multiply
4) Divide  5) Power  6) Average of three
0) Exit
Choice: 4
First number: 10
Second number: 0
Error: cannot divide by zero.

1) Add  2) Subtract  3) Multiply
4) Divide  5) Power  6) Average of three
0) Exit
Choice: 5
Base: 2
Exponent (whole number): 10
Result: 1024

1) Add  2) Subtract  3) Multiply
4) Divide  5) Power  6) Average of three
0) Exit
Choice: 4
First number: ans
Second number: three
Please enter a number (or 'ans').
Second number: 3
Result: 341.3333

1) Add  2) Subtract  3) Multiply
4) Divide  5) Power  6) Average of three
0) Exit
Choice: 0
Calculations done: 2. Goodbye!`,
    starter: String.raw`double lastResult = 0;
int calculations = 0;

Console.WriteLine("=== Menu Calculator ===");

while (true)
{
    ShowMenu();
    string? choice = Console.ReadLine();
    if (choice is null || choice.Trim() == "0")
    {
        break;
    }

    // TODO: use a switch on choice.Trim() to run the right operation.
    // Read numbers with TryReadNumber; if it returns false, stop.
    // Store each result in lastResult, count it, and print it with
    // FormatNumber.
    Console.WriteLine("Not implemented yet.");
}

Console.WriteLine($"Calculations done: {calculations}. Goodbye!");

void ShowMenu()
{
    Console.WriteLine();
    Console.WriteLine("1) Add  2) Subtract  3) Multiply");
    Console.WriteLine("4) Divide  5) Power  6) Average of three");
    Console.WriteLine("0) Exit");
    Console.Write("Choice: ");
}

bool TryReadNumber(string prompt, out double value)
{
    // TODO: loop: print prompt, read a line,
    // return false on null, use lastResult for "ans",
    // return true when double.TryParse succeeds,
    // otherwise print a message and ask again.
    value = 0;
    return false;
}

string FormatNumber(double value, int decimals = 4) =>
    value.ToString(); // TODO: round to 'decimals' places

static class Calc
{
    // TODO: Add, Subtract, Multiply as expression-bodied methods

    // TODO: bool TryDivide(double a, double b, out double result)

    // TODO: recursive double Power(double b, int exp)

    // TODO: double Average(params double[] values)
}`,
    hints: [
      `<p>Start with <code>Calc.Add</code>, <code>Subtract</code> and <code>Multiply</code>: each is one line like <code>public static double Add(double a, double b) =&gt; a + b;</code>. Wire up choice "1" and test before moving on.</p>`,
      `<p><code>TryReadNumber</code> is a <code>while (true)</code> loop. Inside: read the line; <code>if (line is null) { value = 0; return false; }</code>; if it equals "ans" set <code>value = lastResult</code> and return true; if <code>double.TryParse</code> succeeds return true; otherwise print a message and loop.</p>`,
      `<p><code>Power</code> has three cases: <code>exp == 0</code> returns 1; <code>exp &lt; 0</code> returns <code>1 / Power(b, -exp)</code>; otherwise <code>b * Power(b, exp - 1)</code>.</p>`,
      `<p>The exponent is read as a double, so check it is whole before casting: <code>if (y != Math.Floor(y))</code> print an error and skip. Then call <code>Calc.Power(x, (int)y)</code>.</p>`,
      `<p>To avoid repeating "print result, store it, count it" in every case, have each case compute a <code>double? result</code> (null meaning "nothing to show"), then handle it once after the switch.</p>`
    ],
    solution: String.raw`double lastResult = 0;
int calculations = 0;

Console.WriteLine("=== Menu Calculator ===");

while (true)
{
    ShowMenu();
    string? choice = Console.ReadLine();
    if (choice is null || choice.Trim() == "0")
    {
        break;
    }

    choice = choice.Trim();
    if (choice is not ("1" or "2" or "3" or "4" or "5" or "6"))
    {
        Console.WriteLine("Unknown option.");
        continue;
    }

    double? result = null;
    bool inputEnded = false;

    if (choice == "5")
    {
        if (!TryReadNumber("Base: ", out double b) ||
            !TryReadNumber("Exponent (whole number): ", out double e))
        {
            inputEnded = true;
        }
        else if (e != Math.Floor(e))
        {
            Console.WriteLine("Error: exponent must be whole.");
        }
        else
        {
            result = Calc.Power(b, (int)e);
        }
    }
    else if (choice == "6")
    {
        if (!TryReadNumber("Number 1: ", out double n1) ||
            !TryReadNumber("Number 2: ", out double n2) ||
            !TryReadNumber("Number 3: ", out double n3))
        {
            inputEnded = true;
        }
        else
        {
            result = Calc.Average(n1, n2, n3);
        }
    }
    else if (!TryReadNumber("First number: ", out double x) ||
             !TryReadNumber("Second number: ", out double y))
    {
        inputEnded = true;
    }
    else
    {
        switch (choice)
        {
            case "1": result = Calc.Add(x, y); break;
            case "2": result = Calc.Subtract(x, y); break;
            case "3": result = Calc.Multiply(x, y); break;
            case "4":
                if (Calc.TryDivide(x, y, out double q)) result = q;
                else Console.WriteLine("Error: cannot divide by zero.");
                break;
        }
    }

    if (inputEnded)
    {
        break;
    }
    if (result is double value)
    {
        lastResult = value;
        calculations++;
        Console.WriteLine($"Result: {FormatNumber(value)}");
    }
}

Console.WriteLine($"Calculations done: {calculations}. Goodbye!");

void ShowMenu()
{
    Console.WriteLine();
    Console.WriteLine("1) Add  2) Subtract  3) Multiply");
    Console.WriteLine("4) Divide  5) Power  6) Average of three");
    Console.WriteLine("0) Exit");
    Console.Write("Choice: ");
}

bool TryReadNumber(string prompt, out double value)
{
    while (true)
    {
        Console.Write(prompt);
        string? line = Console.ReadLine();
        if (line is null)
        {
            value = 0;
            return false;
        }
        if (line.Trim().ToLower() == "ans")
        {
            value = lastResult;
            return true;
        }
        if (double.TryParse(line, out value))
        {
            return true;
        }
        Console.WriteLine("Please enter a number (or 'ans').");
    }
}

string FormatNumber(double value, int decimals = 4) =>
    Math.Round(value, decimals).ToString();

static class Calc
{
    public static double Add(double a, double b) => a + b;
    public static double Subtract(double a, double b) => a - b;
    public static double Multiply(double a, double b) => a * b;

    public static bool TryDivide(double a, double b, out double result)
    {
        result = b == 0 ? 0 : a / b;
        return b != 0;
    }

    public static double Power(double b, int exp)
    {
        if (exp == 0) return 1;
        if (exp < 0) return 1 / Power(b, -exp);
        return b * Power(b, exp - 1);
    }

    public static double Average(params double[] values)
    {
        if (values.Length == 0) return 0;
        double sum = 0;
        foreach (double v in values) sum += v;
        return sum / values.Length;
    }
}`,
    stretch: [
      "Add a 7) Factorial option implemented recursively, rejecting negative or non-whole input.",
      "Let the user change the number of decimals shown and pass it to FormatNumber as a named argument.",
      "Add Calc overloads that take int arguments and return int, and use them when both inputs are whole numbers.",
      "Write /// XML doc comments for every public method in Calc."
    ]
  }
});
