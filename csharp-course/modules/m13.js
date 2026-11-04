(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m13",
  number: 13,
  title: "Modern C# Power Tools",
  tagline: "Patterns, records, tuples, Span and reflection: the features that make modern C# short, safe and fast.",
  level: "Advanced",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m13-l01",
      title: "Advanced pattern matching",
      minutes: 30,
      objectives: [
        "Match on the shape of an object with property and positional patterns",
        "Take arrays and strings apart with list and slice patterns",
        "Combine patterns with and, or, not and relational operators",
        "Read the exhaustiveness and ordering warnings the compiler gives you"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>In Module 3 you used the switch expression with simple values like <code>1</code> or <code>&gt; 90</code>. Patterns go much further. A pattern can look <em>inside</em> an object, check several properties at once, pull values out into new variables, and even match the first and last items of an array.</p><p>Why bother? Without patterns, a rule like "gold customers spending over 200 get 15%" turns into nested <code>if</code> statements, null checks and casts. With patterns, each rule is one line that reads like the business rule itself.</p>`
        },
        {
          type: "code",
          title: "Property patterns",
          code: String.raw`var orders = new[]
{
    new Order("A1", 250m, new Customer("Ana", "Gold")),
    new Order("B2", 40m, new Customer("Ben", "None")),
    new Order("C3", 120m, new Customer("Cy", "Gold")),
    new Order("D4", 130m, new Customer("Di", "None")),
};

foreach (var o in orders)
{
    decimal discount = o switch
    {
        { Total: > 200m, Customer.Tier: "Gold" } => 0.15m,
        { Customer.Tier: "Gold" } => 0.10m,
        { Total: > 100m } => 0.05m,
        _ => 0m
    };
    Console.WriteLine($"{o.Id}: {discount}");
}

record Customer(string Name, string Tier);
record Order(string Id, decimal Total, Customer Customer);`,
          output: String.raw`A1: 0.15
B2: 0
C3: 0.10
D4: 0.05`
        },
        {
          type: "text",
          html: String.raw`<p>Read <code>{ Total: &gt; 200m, Customer.Tier: "Gold" }</code> as "an object whose <code>Total</code> is greater than 200 <strong>and</strong> whose <code>Customer.Tier</code> is Gold". All listed properties must match. The dotted form <code>Customer.Tier</code> is an <em>extended property pattern</em> (C# 10). It is shorthand for <code>Customer: { Tier: "Gold" }</code>.</p><p>A property pattern also checks for null. <code>o is { }</code> means "o is not null", and if <code>Customer</code> were null, the pattern <code>Customer.Tier: "Gold"</code> would simply not match. No <code>NullReferenceException</code>.</p><p>You can capture the matched value with a name: <code>if (o is { Customer: { Tier: "Gold" } c })</code> gives you a variable <code>c</code> of type <code>Customer</code>, only in the branch where it matched.</p>`
        },
        {
          type: "code",
          title: "Positional patterns use Deconstruct",
          code: String.raw`Point[] points = [new(0, 0), new(5, 0), new(0, -2),
                  new(3, 4), new(-1, 7)];

foreach (var p in points)
{
    string where = p switch
    {
        (0, 0) => "origin",
        (var x, 0) => $"on the x-axis at {x}",
        (0, _) => "on the y-axis",
        ( > 0, > 0) => "top-right quadrant",
        _ => "somewhere else"
    };
    Console.WriteLine($"{p}: {where}");
}

record Point(int X, int Y);`,
          output: String.raw`Point { X = 0, Y = 0 }: origin
Point { X = 5, Y = 0 }: on the x-axis at 5
Point { X = 0, Y = -2 }: on the y-axis
Point { X = 3, Y = 4 }: top-right quadrant
Point { X = -1, Y = 7 }: somewhere else`
        },
        {
          type: "text",
          html: String.raw`<p>A positional pattern <code>(a, b)</code> works on any type that has a <code>Deconstruct</code> method. Positional records get one for free, and so do tuples. <code>var x</code> captures a value, <code>_</code> ignores one, and <code>&gt; 0</code> tests one. The order of the arms matters: the switch tries them top to bottom and picks the first match.</p>`
        },
        {
          type: "code",
          title: "List patterns and slices (C# 11)",
          code: String.raw`Console.WriteLine(Describe([]));
Console.WriteLine(Describe([7]));
Console.WriteLine(Describe([3, 9]));
Console.WriteLine(Describe([1, 2, 3, 4, 5]));

string[] inputs = ["go north", "take lamp", "look",
                   "get key", "say hello there", "dance"];
foreach (var line in inputs)
{
    string reply = line.Split(' ') switch
    {
        ["look"] => "You look around.",
        ["go", var dir] => $"You walk {dir}.",
        ["take" or "get", var item] => $"You take the {item}.",
        ["say", .. var words] => $"You say: {string.Join(' ', words)}",
        [var verb, ..] => $"I don't know how to '{verb}'.",
        [] => "Say something."
    };
    Console.WriteLine(reply);
}

static string Describe(int[] xs) => xs switch
{
    [] => "empty",
    [var only] => $"one item: {only}",
    [var a, var b] => $"a pair: {a} and {b}",
    [var first, .., var last] => $"{xs.Length} items, {first} to {last}"
};`,
          output: String.raw`empty
one item: 7
a pair: 3 and 9
5 items, 1 to 5
You walk north.
You take the lamp.
You look around.
You take the key.
You say: hello there
I don't know how to 'dance'.`
        },
        {
          type: "text",
          html: String.raw`<p>A list pattern <code>[p1, p2, p3]</code> matches a sequence of exactly that length, testing each element against its own pattern. The <em>slice pattern</em> <code>..</code> matches zero or more elements, and you can use it once per list pattern. <code>.. var words</code> captures the slice as a new array.</p><p>List patterns work on arrays, <code>List&lt;T&gt;</code>, <code>Span&lt;T&gt;</code> and strings: anything with a <code>Length</code> or <code>Count</code> and an indexer. So <code>name is ['A', ..]</code> asks "does the name start with A?".</p>`
        },
        {
          type: "table",
          headers: ["Pattern", "Example", "Matches when"],
          rows: [
            ["Constant", "<code>\"Gold\"</code>, <code>0</code>, <code>null</code>", "the value equals the constant"],
            ["Relational", "<code>&gt; 100</code>, <code>&lt;= 0</code>", "the comparison is true"],
            ["Logical", "<code>&gt; 0 and &lt; 10</code>, <code>'a' or 'e'</code>, <code>not null</code>", "the combination holds"],
            ["Type", "<code>string s</code>, <code>Circle</code>", "the value has that type (and is not null)"],
            ["Property", "<code>{ Length: &gt; 3 }</code>", "not null and every listed property matches"],
            ["Positional", "<code>(0, var y)</code>", "Deconstruct output matches position by position"],
            ["var / discard", "<code>var x</code>, <code>_</code>", "always (var captures, _ ignores)"],
            ["List / slice", "<code>[1, .., var last]</code>", "length and each element match"]
          ]
        },
        {
          type: "callout",
          tone: "warning",
          title: "The two warnings you will meet",
          html: String.raw`<p><strong>CS8509</strong>: "The switch expression does not handle all possible values of its input type". If no arm matches at run time, you get a <code>SwitchExpressionException</code>. Add a final <code>_ =&gt;</code> arm, or cover every case.</p><p><strong>CS8510</strong>: "The pattern has already been handled by a previous arm of the switch expression". This is an error. It means an earlier, more general arm hides a later, more specific one. Put specific arms first, general arms last.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Like Python's match statement",
          html: String.raw`<p>Python 3.10's <code>match</code> has the same ideas: <code>case [first, *rest]:</code> is C#'s <code>[var first, .. var rest]</code>, and <code>case Point(x=0, y=y):</code> is close to <code>{ X: 0, Y: var y }</code>. The big difference: C# checks types at compile time and warns you when your cases are not exhaustive.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this program print?",
          code: String.raw`int[][] data = [[], [4], [1, 2, 3], [5, 0]];
foreach (var xs in data)
{
    Console.WriteLine(xs switch
    {
        [] => "none",
        [var x] => $"single {x}",
        [_, 0] => "ends in zero",
        [var a, .., var b] => $"{a}+{b}={a + b}"
    });
}`,
          answer: String.raw`none
single 4
1+3=4
ends in zero`,
          explain: String.raw`<p>The arms are tried top to bottom. <code>[1, 2, 3]</code> has three elements, so <code>[_, 0]</code> (exactly two) fails and the slice arm captures 1 and 3. <code>[5, 0]</code> matches <code>[_, 0]</code> before it reaches the slice arm, so it never prints 5+0.</p>`
        },
        {
          type: "fill",
          prompt: "Complete the property pattern so adults (Age 18 or more) living in Oslo get the message.",
          code: String.raw`if (person is { Age: ___ 18, Address.___: "Oslo" })
{
    Console.WriteLine("Welcome, Oslo voter!");
}`,
          blanks: [[">="], ["City"]],
          explain: String.raw`<p>A relational pattern <code>&gt;= 18</code> tests the property. <code>Address.City</code> is an extended property pattern, the short form of <code>Address: { City: "Oslo" }</code>. If <code>Address</code> is null, the pattern fails instead of throwing.</p>`
        },
        {
          type: "mcq",
          prompt: "Which of these arrays matches the pattern <code>[1, .., 9]</code>?",
          options: ["<code>[1, 9]</code>, <code>[1, 5, 9]</code> and <code>[1, 2, 3, 9]</code>", "Only <code>[1, 5, 9]</code>", "Only arrays with at least three elements", "<code>[9, 1]</code>"],
          answer: 0,
          explain: String.raw`<p>The slice <code>..</code> matches <em>zero</em> or more elements, so <code>[1, 9]</code> matches too. The first element must be 1 and the last must be 9. <code>[9, 1]</code> has them the wrong way round.</p>`
        },
        {
          type: "bug",
          prompt: "This code does not compile. Why?",
          code: String.raw`string Grade(int score) => score switch
{
    >= 50 => "Pass",
    >= 90 => "Distinction",
    _ => "Fail"
};`,
          options: [
            "The >= 90 arm can never match because >= 50 already catches those values, so the compiler reports CS8510",
            "Relational patterns cannot be used on int",
            "The switch expression is missing a default arm",
            "Expression-bodied methods cannot contain switch expressions"
          ],
          answer: 0,
          explain: String.raw`<p>Every score that is 90 or more is also 50 or more, so the first arm hides the second. The compiler spots this and reports error CS8510. Put the most specific arm first: <code>&gt;= 90</code>, then <code>&gt;= 50</code>. The <code>_</code> arm is already there, and relational patterns work on all numeric types.</p>`
        },
        {
          type: "output",
          prompt: "Predict the output.",
          code: String.raw`object[] things = [42, "hi", 3.5, null!, "", -7];
foreach (var t in things)
{
    string s = t switch
    {
        int n and > 0 => "positive int",
        int => "other int",
        string { Length: 0 } => "empty string",
        string str => $"string of {str.Length}",
        null => "null",
        _ => t.GetType().Name
    };
    Console.WriteLine(s);
}`,
          answer: String.raw`positive int
string of 2
Double
null
empty string
other int`,
          explain: String.raw`<p><code>3.5</code> is a <code>double</code>, so only the discard matches and <code>GetType().Name</code> gives <code>Double</code>. The empty string hits the more specific <code>{ Length: 0 }</code> arm before the general <code>string str</code> arm. Type patterns never match null, which is why null needs its own arm.</p>`
        }
      ],
      takeaways: [
        "Property patterns { Prop: pattern } look inside objects and fail safely on null.",
        "Positional patterns (a, b) use Deconstruct; records and tuples have one built in.",
        "List patterns [a, .., z] match arrays, lists and strings by length and elements.",
        "Arms run top to bottom: specific first, general last, or you get CS8510."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m13-l02",
      title: "Records and immutability",
      minutes: 28,
      objectives: [
        "Explain value equality and how records generate it",
        "Use with-expressions to make modified copies",
        "Spot the shallow-copy trap when a record holds a list",
        "Choose between record class, record struct and a plain class"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>You met records in Module 6. Now let's see what the compiler actually writes for you, and why immutable data makes programs easier to reason about.</p><p>An <strong>immutable</strong> object cannot change after it is built. If you pass it to ten methods, none of them can surprise you by changing it. You can share it between threads without locks. You can use it as a dictionary key safely. The price is that "changing" means "making a new copy", which records make cheap to write.</p>`
        },
        {
          type: "code",
          title: "What a positional record gives you",
          code: String.raw`var a = new Money(10m, "EUR");
var b = new Money(10m, "EUR");

Console.WriteLine(a == b);
Console.WriteLine(ReferenceEquals(a, b));
Console.WriteLine(a);

var c = a with { Amount = 25m };
Console.WriteLine(c);
Console.WriteLine(a);

var (amount, currency) = c;
Console.WriteLine($"{amount} {currency}");

record Money(decimal Amount, string Currency);`,
          output: String.raw`True
False
Money { Amount = 10, Currency = EUR }
Money { Amount = 25, Currency = EUR }
Money { Amount = 10, Currency = EUR }
25 EUR`
        },
        {
          type: "text",
          html: String.raw`<p>From that one line, <code>record Money(decimal Amount, string Currency);</code>, the compiler generates:</p><ul><li>A constructor and two <code>{ get; init; }</code> properties.</li><li><code>Equals</code>, <code>GetHashCode</code>, <code>==</code> and <code>!=</code> that compare every property (value equality).</li><li>A readable <code>ToString</code>.</li><li>A <code>Deconstruct</code> method, so <code>var (amount, currency) = c;</code> works.</li><li>A hidden copy method that powers <code>with</code>.</li></ul><p><code>a with { Amount = 25m }</code> is called <em>non-destructive mutation</em>. It copies <code>a</code>, then sets <code>Amount</code> on the copy. <code>a</code> is untouched.</p>`
        },
        {
          type: "code",
          title: "The shallow-copy trap",
          code: String.raw`var red = new Team("Red", new List<string> { "Ann" });
var blue = red with { Name = "Blue" };

blue.Members.Add("Bo");

Console.WriteLine(string.Join(", ", red.Members));
Console.WriteLine(ReferenceEquals(red.Members, blue.Members));

var x = new Team("X", new List<string> { "Zed" });
var y = new Team("X", new List<string> { "Zed" });
Console.WriteLine(x == y);

record Team(string Name, List<string> Members);`,
          output: String.raw`Ann, Bo
True
False`
        },
        {
          type: "text",
          html: String.raw`<p>Two surprises. First, <code>with</code> copies only the <em>reference</em> to the list. Both teams share one list, so adding to Blue also adds to Red. Second, record equality compares the list with the list's own <code>Equals</code>, which is reference equality. Two lists with the same content are still "different".</p><p>A record is only as immutable as its members. The professional fix is to store immutable collections, for example <code>IReadOnlyList&lt;string&gt;</code> filled from a fresh array, or <code>ImmutableArray&lt;string&gt;</code> from <code>System.Collections.Immutable</code>.</p>`
        },
        {
          type: "code",
          title: "Validation, computed members and required properties",
          code: String.raw`var t = new Temperature(21.5);
Console.WriteLine($"{t.Celsius} C = {t.Fahrenheit} F");

try
{
    var bad = t with { Celsius = -300 };
}
catch (ArgumentOutOfRangeException ex)
{
    Console.WriteLine($"Rejected: {ex.ParamName}");
}

var user = new User { Email = "ana@example.com" };
Console.WriteLine(user);

record Temperature(double Celsius)
{
    public double Celsius { get; init; } = Check(Celsius);
    public double Fahrenheit => Celsius * 9 / 5 + 32;

    static double Check(double c) => c >= -273.15
        ? c
        : throw new ArgumentOutOfRangeException(nameof(Celsius));

    // with sets the property directly, so validate in init too
}

record User
{
    public required string Email { get; init; }
    public string Role { get; init; } = "reader";
}`,
          output: String.raw`21.5 C = 70.7 F
User { Email = ana@example.com, Role = reader }`
        },
        {
          type: "callout",
          tone: "warning",
          title: "with skips your constructor",
          html: String.raw`<p>Look closely at the program above: the <code>with</code> expression created a temperature of -300 and nothing complained. A <code>with</code> expression copies the object and then calls the <code>init</code> accessors. It does <em>not</em> run the constructor or the property initializer. If you need validation that survives <code>with</code>, write it in the <code>init</code> accessor itself:</p><p><code>init =&gt; _c = value &gt;= -273.15 ? value : throw ...;</code></p>`
        },
        {
          type: "text",
          html: String.raw`<p>The <code>required</code> modifier (C# 11) makes the caller set a property in the object initializer. Forget it and the compiler stops you with <strong>CS9035</strong>: "Required member 'User.Email' must be set in the object initializer or attribute constructor." This gives you nominal records (named properties) that are still safe to create.</p>`
        },
        {
          type: "code",
          title: "Record structs and inheritance",
          code: String.raw`var p1 = new Pixel(10, 20);
var p2 = p1 with { X = 11 };
Console.WriteLine($"{p1} {p2} {p1 == p2}");

Animal a = new Dog("Rex");
Animal b = new Cat("Rex");
Console.WriteLine(a == b);
Console.WriteLine(a == new Dog("Rex"));

readonly record struct Pixel(int X, int Y);

abstract record Animal(string Name);
record Dog(string Name) : Animal(Name);
record Cat(string Name) : Animal(Name);`,
          output: String.raw`Pixel { X = 10, Y = 20 } Pixel { X = 11, Y = 20 } False
False
True`
        },
        {
          type: "table",
          headers: ["Kind", "Lives", "Equality", "Use it for"],
          rows: [
            ["<code>class</code>", "heap, by reference", "reference (same object?)", "entities with identity and behavior: a <code>BankAccount</code>, a <code>Window</code>"],
            ["<code>record</code> (record class)", "heap, by reference", "value (same data?)", "data transfer objects, events, messages, settings"],
            ["<code>readonly record struct</code>", "inline, copied", "value", "small values (up to about 16 bytes): coordinates, money, ids"],
            ["<code>struct</code>", "inline, copied", "field by field (slow, via reflection unless you override)", "low-level performance code"]
          ]
        },
        {
          type: "callout",
          tone: "deep",
          title: "Why Dog(\"Rex\") is not equal to Cat(\"Rex\")",
          html: String.raw`<p>Every record has a hidden, protected property called <code>EqualityContract</code> that returns its runtime type. The generated <code>Equals</code> compares it first. So two records are equal only when they have the same runtime type <em>and</em> the same property values. This stops a <code>Dog</code> and a <code>Cat</code> with the same name from being treated as one animal.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var s1 = new Settings("dark", 12);
var s2 = s1 with { FontSize = 14 };
var s3 = s2 with { FontSize = 12 };

Console.WriteLine(s1 == s2);
Console.WriteLine(s1 == s3);
Console.WriteLine(ReferenceEquals(s1, s3));
Console.WriteLine(s3);

record Settings(string Theme, int FontSize);`,
          answer: String.raw`False
True
False
Settings { Theme = dark, FontSize = 12 }`,
          explain: String.raw`<p><code>s3</code> is a brand new object, so <code>ReferenceEquals</code> is false. But it has the same data as <code>s1</code>, and records compare data, so <code>s1 == s3</code> is true. That is value equality in one example.</p>`
        },
        {
          type: "fill",
          prompt: "Create a copy of <code>order</code> with its status changed to Shipped, leaving <code>order</code> unchanged.",
          code: String.raw`var shipped = order ___ { Status = ___.Shipped };

enum OrderStatus { New, Shipped }
record Order(int Id, OrderStatus Status);`,
          blanks: [["with"], ["OrderStatus"]],
          explain: String.raw`<p>The <code>with</code> expression copies the record and sets only the listed properties. The original <code>order</code> still has its old status. You could not write <code>order.Status = ...</code> because positional record properties are <code>init</code>-only.</p>`
        },
        {
          type: "bug",
          prompt: "A developer expected <code>draft</code> to keep only one tag. It ends up with two. What is the cause?",
          code: String.raw`var draft = new Post("Hello", new List<string> { "news" });
var published = draft with { Title = "Hello!" };
published.Tags.Add("featured");
Console.WriteLine(draft.Tags.Count); // 2

record Post(string Title, List<string> Tags);`,
          options: [
            "with makes a shallow copy, so both records share the same List object",
            "Records cannot contain lists",
            "with modifies the original record in place",
            "List.Add is not allowed on init-only properties, so it throws"
          ],
          answer: 0,
          explain: String.raw`<p><code>with</code> copies each property value. For a list, the value is a reference, so both posts point to one list. <code>init</code> only stops you from replacing the property; it does not freeze the list behind it. Use an immutable collection, or copy the list: <code>draft with { Tags = new(draft.Tags) }</code>.</p>`
        },
        {
          type: "mcq",
          prompt: "You need a type for a 2D grid coordinate that you will create millions of times in a game loop. Which is the best fit?",
          options: ["<code>readonly record struct Cell(int Row, int Col)</code>", "<code>record Cell(int Row, int Col)</code>", "<code>class Cell { public int Row; public int Col; }</code>", "<code>Tuple&lt;int, int&gt;</code>"],
          answer: 0,
          explain: String.raw`<p>It is small (8 bytes), has no identity and benefits from value equality, so a <code>readonly record struct</code> fits. It lives inline with no heap allocation per cell. A record class or plain class allocates each instance on the heap, and the old <code>Tuple&lt;int,int&gt;</code> is also a heap-allocated class with poor names.</p>`
        },
        {
          type: "order",
          prompt: "Put these steps in the order the runtime performs <code>var b = a with { X = 5 };</code>",
          lines: [
            "Evaluate the expression a",
            "Call the hidden copy method to clone a",
            "Run the init accessor for X with the value 5",
            "Assign the new object to b"
          ],
          explain: String.raw`<p>The clone happens first, then each property in the braces is set on the clone using its <code>init</code> accessor. No constructor runs, which is why validation must live in the accessors if it must survive <code>with</code>.</p>`
        }
      ],
      takeaways: [
        "Records generate value equality, ToString, Deconstruct and with-support.",
        "with copies then sets init properties; it does not run constructors.",
        "Copies are shallow: a record holding a List is not truly immutable.",
        "Use readonly record struct for small values, record class for data objects."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m13-l03",
      title: "Tuples and deconstruction",
      minutes: 24,
      objectives: [
        "Return several values from a method with named tuples",
        "Deconstruct tuples, records, dictionaries and your own types",
        "Use tuple patterns in switch expressions",
        "Decide between a tuple, a record and out parameters"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>Sometimes a method needs to hand back two or three things: a min and a max, a success flag and a value, a name and a score. Creating a whole class for that feels heavy. A <strong>tuple</strong> is a lightweight group of values with optional names, and it is a value type (<code>System.ValueTuple</code>), so it costs no heap allocation.</p>`
        },
        {
          type: "code",
          title: "Named tuples as return values",
          code: String.raw`var s = Stats([4, 8, 15, 16, 23, 42]);
Console.WriteLine($"min {s.Min}, max {s.Max}, avg {s.Avg:F2}");

var (lo, hi, _) = Stats([3, 1, 2]);
Console.WriteLine($"range {lo}..{hi}");

(string Name, int Age) person = ("Ana", 31);
Console.WriteLine(person);
Console.WriteLine(person.Item1 == person.Name);

static (int Min, int Max, double Avg) Stats(int[] xs)
    => (xs.Min(), xs.Max(), xs.Average());`,
          output: String.raw`min 4, max 42, avg 18.00
range 1..3
(Ana, 31)
True`
        },
        {
          type: "text",
          html: String.raw`<p>The names (<code>Min</code>, <code>Max</code>, <code>Avg</code>) exist only for the compiler. At run time the fields are still called <code>Item1</code>, <code>Item2</code> and <code>Item3</code>, which is why <code>person.Item1</code> still works. <code>var (lo, hi, _) = ...</code> is <strong>deconstruction</strong>: it splits the tuple into separate variables, and <code>_</code> throws away the part you do not need.</p>`
        },
        {
          type: "code",
          title: "Swaps, loops and dictionaries",
          code: String.raw`int a = 1, b = 2;
(a, b) = (b, a);
Console.WriteLine($"a={a} b={b}");

// Fibonacci without a temp variable
(int prev, int cur) = (0, 1);
for (int i = 0; i < 8; i++)
{
    Console.Write(cur + " ");
    (prev, cur) = (cur, prev + cur);
}
Console.WriteLine();

var stock = new Dictionary<string, int> { ["apple"] = 3, ["pear"] = 0 };
foreach (var (fruit, count) in stock)
    Console.WriteLine($"{fruit}: {count}");

Console.WriteLine((1, "x") == (1, "x"));`,
          output: String.raw`a=2 b=1
1 1 2 3 5 8 13 21
apple: 3
pear: 0
True`
        },
        {
          type: "callout",
          tone: "python",
          title: "Very close to Python",
          html: String.raw`<p><code>a, b = b, a</code> in Python becomes <code>(a, b) = (b, a);</code> in C#. Unpacking a dict with <code>for k, v in d.items()</code> becomes <code>foreach (var (k, v) in d)</code>. One difference: Python tuples are immutable, while C# value tuples are <em>mutable</em> structs. <code>person.Age = 32;</code> compiles.</p>`
        },
        {
          type: "code",
          title: "Deconstruct your own types",
          code: String.raw`var name = new FullName("Grace", "Hopper");
var (first, last) = name;
Console.WriteLine($"{last}, {first}");

var temp = new Reading("Oslo", -3.5);
if (temp is ("Oslo", < 0))
    Console.WriteLine("Freezing in Oslo");

class FullName(string first, string last)
{
    public void Deconstruct(out string f, out string l)
    {
        f = first;
        l = last;
    }
}

record Reading(string City, double Celsius);`,
          output: String.raw`Hopper, Grace
Freezing in Oslo`
        },
        {
          type: "text",
          html: String.raw`<p>Any type with a method <code>public void Deconstruct(out T1 a, out T2 b, ...)</code> can be deconstructed and used in positional patterns. Records generate it. For classes you write it yourself. It can even be an extension method, which is how <code>KeyValuePair</code> works in <code>foreach</code>.</p>`
        },
        {
          type: "code",
          title: "Tuple patterns: decide on two values at once",
          code: String.raw`string[] moves = ["rock", "paper", "scissors"];
foreach (var p1 in moves)
{
    foreach (var p2 in moves)
    {
        string result = (p1, p2) switch
        {
            var (x, y) when x == y => "draw",
            ("rock", "scissors") or ("paper", "rock")
                or ("scissors", "paper") => "P1 wins",
            _ => "P2 wins"
        };
        Console.WriteLine($"{p1,-8} vs {p2,-8} {result}");
    }
}`,
          output: String.raw`rock     vs rock     draw
rock     vs paper    P2 wins
rock     vs scissors P1 wins
paper    vs rock     P1 wins
paper    vs paper    draw
paper    vs scissors P2 wins
scissors vs rock     P2 wins
scissors vs paper    P1 wins
scissors vs scissors draw`
        },
        {
          type: "table",
          headers: ["Need", "Best choice", "Why"],
          rows: [
            ["Private helper returns 2-3 values", "Named tuple", "zero ceremony, no allocation"],
            ["Public API returns data", "record", "a real name, documented properties, survives refactoring"],
            ["Try-something pattern", "<code>bool TryX(out T value)</code>", "works directly in <code>if</code>; the .NET convention"],
            ["Values stored long term or in many places", "record or class", "tuples with Item1/Item2 become unreadable fast"]
          ]
        },
        {
          type: "callout",
          tone: "tip",
          title: "Rule of thumb",
          html: String.raw`<p>If a tuple escapes the file it was created in, or you find yourself writing the same tuple type twice, promote it to a record. <code>record MinMax(int Min, int Max);</code> is one line and gives every reader a name to search for.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var (q, r) = DivRem(17, 5);
Console.WriteLine($"{q} r {r}");

int x = 3, y = 4, z = 5;
(x, y, z) = (z, x, y);
Console.WriteLine($"{x} {y} {z}");

var t = (Name: "Bo", Score: 7);
t.Score += 3;
Console.WriteLine(t);

static (int, int) DivRem(int a, int b) => (a / b, a % b);`,
          answer: String.raw`3 r 2
5 3 4
(Bo, 10)`,
          explain: String.raw`<p>The right-hand tuple <code>(z, x, y)</code> is built first from the old values (5, 3, 4), then assigned. Value tuples are mutable, so <code>t.Score += 3</code> works, and printing a tuple shows its values in parentheses without the names.</p>`
        },
        {
          type: "fill",
          prompt: "Complete the method so this class can be deconstructed with <code>var (w, h) = size;</code>",
          code: String.raw`class Size(int width, int height)
{
    public void ___(out int w, ___ int h)
    {
        w = width;
        h = height;
    }
}`,
          blanks: [["Deconstruct"], ["out"]],
          explain: String.raw`<p>The compiler looks for a method named exactly <code>Deconstruct</code> whose parameters are all <code>out</code>. The number of <code>out</code> parameters must match the number of variables on the left.</p>`
        },
        {
          type: "mcq",
          prompt: "A public library method currently returns <code>(string, int, bool)</code>. Users complain the code is hard to read. What is the best fix?",
          options: [
            "Return a record with named properties, e.g. record LookupResult(string Name, int Count, bool Found)",
            "Return object[] so callers can cast",
            "Add comments saying what Item1, Item2 and Item3 mean",
            "Use Tuple<string, int, bool> instead"
          ],
          answer: 0,
          explain: String.raw`<p>A record gives the result a searchable name, IntelliSense-friendly properties and documentation. <code>object[]</code> throws away type safety. Comments drift out of date. <code>Tuple&lt;...&gt;</code> is the older class-based tuple with the same Item1 naming problem plus a heap allocation.</p>`
        },
        {
          type: "output",
          prompt: "Predict the output.",
          code: String.raw`(int, int)[] pairs = [(0, 0), (2, 2), (3, -3), (1, 5)];
foreach (var p in pairs)
{
    Console.WriteLine(p switch
    {
        (0, 0) => "zero",
        var (a, b) when a == b => "same",
        var (a, b) when a == -b => "opposite",
        _ => "other"
    });
}`,
          answer: String.raw`zero
same
opposite
other`,
          explain: String.raw`<p><code>(0, 0)</code> matches the constant arm first, even though it would also satisfy <code>a == b</code>. The <code>when</code> guards let you test relations between the two values, which a plain positional pattern cannot express.</p>`
        }
      ],
      takeaways: [
        "Named tuples return several values cheaply; names are compile-time only.",
        "Deconstruction (var (a, b) = ...) works on tuples, records, KeyValuePair and any type with Deconstruct.",
        "(a, b) = (b, a) swaps without a temp variable.",
        "Promote a tuple to a record once it crosses a public boundary."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m13-l04",
      title: "Performance: allocations, Span and structs",
      minutes: 32,
      objectives: [
        "Explain what an allocation is and why the garbage collector cares",
        "Build strings efficiently with StringBuilder",
        "Slice text and arrays without copying using Span&lt;T&gt; and stackalloc",
        "Avoid the classic struct pitfalls: hidden copies and boxing"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>Most code is fast enough. Write it clearly first. But when you process a million log lines or render 60 frames a second, one thing dominates: <strong>allocations</strong>. Every <code>new</code> of a class, every string you build, every array, lands on the managed heap. The garbage collector (GC) later has to find and free it. Fewer allocations means less GC work and fewer pauses.</p>`
        },
        {
          type: "callout",
          tone: "deep",
          title: "How the .NET GC sees your objects",
          html: String.raw`<p>New objects go into <strong>generation 0</strong>, which is collected often and cheaply. Objects that survive move to gen 1, then gen 2, which is collected rarely and costs more. Objects of 85,000 bytes or more go straight to the <strong>Large Object Heap</strong>. Short-lived garbage is cheap, but creating lots of it in a hot loop still adds up. Value types stored in locals or inside arrays are not separate heap objects at all.</p>`
        },
        {
          type: "code",
          title: "StringBuilder: one buffer instead of many strings",
          code: String.raw`using System.Text;

string[] items = ["Coffee", "Bagel", "Juice"];
decimal[] prices = [3.50m, 2.25m, 4.00m];

var sb = new StringBuilder();
sb.AppendLine("ITEM      PRICE");
for (int i = 0; i < items.Length; i++)
{
    sb.Append(items[i].PadRight(10))
      .Append(prices[i].ToString("0.00"))
      .AppendLine();
}
sb.Append("TOTAL     ").Append(prices.Sum().ToString("0.00"));

string receipt = sb.ToString();
Console.WriteLine(receipt);
Console.WriteLine($"{receipt.Length} chars");`,
          output: String.raw`ITEM      PRICE
Coffee    3.50
Bagel     2.25
Juice     4.00
TOTAL     9.75
75 chars`
        },
        {
          type: "text",
          html: String.raw`<p>Strings are immutable, so <code>s += x</code> in a loop creates a brand new string every time and copies everything so far. For n pieces that is roughly n&sup2;/2 characters copied. <code>StringBuilder</code> keeps a growable buffer and copies once at the end in <code>ToString()</code>.</p><p>Do not overdo it: <code>$"{a} {b}"</code> or <code>a + b + c</code> on one line is already efficient. Reach for <code>StringBuilder</code> when you append inside a loop.</p>`
        },
        {
          type: "code",
          title: "Span<T>: a window onto memory",
          code: String.raw`ReadOnlySpan<char> line = "2026-11-04;ORD-7781;149.90";

int firstSemi = line.IndexOf(';');
ReadOnlySpan<char> date = line[..firstSemi];
ReadOnlySpan<char> rest = line[(firstSemi + 1)..];
ReadOnlySpan<char> orderId = rest[..rest.IndexOf(';')];

int year = int.Parse(date[..4]);
int month = int.Parse(date.Slice(5, 2));
Console.WriteLine($"year={year} month={month}");
Console.WriteLine($"order={orderId.ToString()}");
Console.WriteLine(orderId.StartsWith("ORD-"));

int[] numbers = [10, 20, 30, 40, 50];
Span<int> middle = numbers.AsSpan(1, 3);
middle[0] = 99;
Console.WriteLine(string.Join(",", numbers));`,
          output: String.raw`year=2026 month=11
order=ORD-7781
True
10,99,30,40,50`
        },
        {
          type: "text",
          html: String.raw`<p>A <code>Span&lt;T&gt;</code> is a pointer plus a length: a view onto memory that already exists. Slicing a span with <code>[..4]</code> or <code>Slice(5, 2)</code> creates no new string or array. Compare that with <code>Substring</code> and <code>Split</code>, which allocate a new string for every piece.</p><p>Notice the last example: writing to <code>middle[0]</code> changed the original array. A span is a window onto the array; it never copies. <code>ReadOnlySpan&lt;T&gt;</code> is the read-only version, and strings convert to it implicitly. Many APIs (<code>int.Parse</code>, <code>double.TryParse</code>, <code>StartsWith</code>) accept spans directly.</p>`
        },
        {
          type: "code",
          title: "stackalloc: temporary buffers with no heap at all",
          code: String.raw`Span<int> squares = stackalloc int[6];
for (int i = 0; i < squares.Length; i++)
    squares[i] = i * i;

int sum = 0;
foreach (int s in squares) sum += s;
Console.WriteLine($"sum of squares = {sum}");

// Reverse a short string without allocating a char[]
string word = "stressed";
Span<char> buffer = stackalloc char[word.Length];
word.AsSpan().CopyTo(buffer);
buffer.Reverse();
Console.WriteLine(buffer.ToString());`,
          output: String.raw`sum of squares = 55
desserts`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Span rules the compiler enforces",
          html: String.raw`<p><code>Span&lt;T&gt;</code> is a <code>ref struct</code>: it must live on the stack. So you cannot store it in a class field, put it in a <code>List</code>, capture it in a lambda, or use it across an <code>await</code>. Declare one in an <code>async</code> method and you get <strong>CS4012</strong>: "Parameters or locals of type 'Span&lt;int&gt;' cannot be declared in async methods or async lambda expressions." When you need to keep a slice around, use <code>Memory&lt;T&gt;</code> instead.</p><p>Keep <code>stackalloc</code> small (a few hundred bytes to a few KB). The stack is about 1 MB; a huge <code>stackalloc</code> crashes the process with a stack overflow that you cannot catch.</p>`
        },
        {
          type: "code",
          title: "Struct pitfalls: copies and boxing",
          code: String.raw`var arr = new[] { new Counter() };
arr[0].Count++;            // array element is a variable: OK
Counter copy = arr[0];     // copies the struct
copy.Count += 100;
Console.WriteLine(arr[0].Count);

var list = new List<Counter> { new Counter() };
// list[0].Count++;        // error CS1612
var tmp = list[0];
tmp.Count++;
list[0] = tmp;             // write the copy back
Console.WriteLine(list[0].Count);

var score = new Score();
IBump boxed = score;       // boxing: copies into a heap object
boxed.Bump();
boxed.Bump();
Console.WriteLine($"{score.Value} {((Score)boxed).Value}");

struct Counter { public int Count; }

interface IBump { void Bump(); }
struct Score : IBump
{
    public int Value;
    public void Bump() => Value++;
}`,
          output: String.raw`1
1
0 2`
        },
        {
          type: "text",
          html: String.raw`<p>A struct is copied whenever you assign it, pass it, or read it from a property or a list indexer. <code>list[0]</code> returns a copy, so <code>list[0].Count++</code> would change a temporary that is thrown away. The compiler refuses with <strong>CS1612</strong>: "Cannot modify the return value of 'List&lt;Counter&gt;.this[int]' because it is not a variable."</p><p><strong>Boxing</strong> happens when a struct is converted to <code>object</code> or an interface. The runtime copies it into a new heap object. Changes to the box do not affect the original. Boxing in a hot loop also defeats the purpose of using a struct.</p><p>The cure for most struct bugs is the same: make structs <code>readonly</code> and small. A <code>readonly struct</code> cannot be changed, so copying it can never surprise you.</p>`
        },
        {
          type: "code",
          title: "Measure before and after (no fixed output)",
          code: String.raw`using System.Diagnostics;
using System.Text;

const int N = 20_000;

var sw = Stopwatch.StartNew();
string s = "";
for (int i = 0; i < N; i++) s += "x";
Console.WriteLine($"+= concat:     {sw.ElapsedMilliseconds} ms");

sw.Restart();
var sb = new StringBuilder();
for (int i = 0; i < N; i++) sb.Append('x');
string t = sb.ToString();
Console.WriteLine($"StringBuilder: {sw.ElapsedMilliseconds} ms");

long before = GC.GetAllocatedBytesForCurrentThread();
int total = 0;
foreach (var part in "a,b,c,d".Split(',')) total += part.Length;
long after = GC.GetAllocatedBytesForCurrentThread();
Console.WriteLine($"Split allocated {after - before} bytes");`
        },
        {
          type: "callout",
          tone: "tip",
          title: "How professionals measure",
          html: String.raw`<p><code>Stopwatch</code> is fine for a quick look, but timings jump around because of JIT warm-up and GC. For real decisions, use the <strong>BenchmarkDotNet</strong> NuGet package with <code>[MemoryDiagnoser]</code>. It warms up, runs many iterations and reports mean time and bytes allocated per call. Optimize only the code a profiler or benchmark shows is hot.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`ReadOnlySpan<char> path = "/users/42/orders/7";
var afterUsers = path["/users/".Length..];
int slash = afterUsers.IndexOf('/');
int userId = int.Parse(afterUsers[..slash]);
Console.WriteLine(userId * 2);

int[] data = [1, 2, 3, 4, 5, 6];
Span<int> tail = data.AsSpan(3);
tail.Fill(0);
Console.WriteLine(string.Join(" ", data));`,
          answer: String.raw`84
1 2 3 0 0 0`,
          explain: String.raw`<p>The first slice skips the 7 characters of <code>"/users/"</code>, leaving <code>"42/orders/7"</code>. <code>int.Parse</code> accepts a span directly. <code>AsSpan(3)</code> is a window over elements 3 to 5 of the original array, so <code>Fill(0)</code> changes the array itself.</p>`
        },
        {
          type: "fill",
          prompt: "Allocate a 16-byte scratch buffer on the stack instead of the heap.",
          code: String.raw`___<byte> scratch = ___ byte[16];`,
          blanks: [["Span"], ["stackalloc"]],
          explain: String.raw`<p><code>stackalloc</code> reserves memory in the current stack frame, which is freed automatically when the method returns. Assigning it to a <code>Span&lt;byte&gt;</code> lets you use it safely without <code>unsafe</code> code. <code>new byte[16]</code> would allocate on the heap.</p>`
        },
        {
          type: "bug",
          prompt: "Why does this print 0 instead of 5?",
          code: String.raw`var p = new Player();
p.Pos.Move(5);
Console.WriteLine(p.Pos.X);

struct Position
{
    public int X;
    public void Move(int dx) => X += dx;
}
class Player
{
    public Position Pos { get; set; }
}`,
          options: [
            "The property getter returns a copy of the struct, and Move changes that copy",
            "Structs cannot have methods",
            "X is not initialized, so it stays 0",
            "Move needs the ref keyword to compile"
          ],
          answer: 0,
          explain: String.raw`<p><code>p.Pos</code> calls the getter, which returns a copy. <code>Move</code> updates the copy, which is then discarded. The compiler allows calling a method on it (unlike assigning a field, which gives CS1612). The fix is to make <code>Position</code> a <code>readonly struct</code> whose <code>Move</code> returns a new value, then write <code>p.Pos = p.Pos.Moved(5);</code>.</p>`
        },
        {
          type: "mcq",
          prompt: "Which loop most needs a <code>StringBuilder</code>?",
          options: [
            "Building one CSV line per row for 50,000 rows into a single string",
            "Building a greeting with $\"Hello {name}!\"",
            "Joining three words with a + b + c",
            "Calling string.Join(\",\", list) once"
          ],
          answer: 0,
          explain: String.raw`<p>Repeated <code>+=</code> in a large loop copies the growing string over and over. A one-line interpolation or concatenation is compiled into a single efficient call, and <code>string.Join</code> already uses a builder internally.</p>`
        },
        {
          type: "output",
          prompt: "Boxing check. What is printed?",
          code: String.raw`int n = 5;
object o = n;
n = 10;
Console.WriteLine(o);
Console.WriteLine((int)o + n);
Console.WriteLine(o is int);`,
          answer: String.raw`5
15
True`,
          explain: String.raw`<p><code>object o = n;</code> boxes a <em>copy</em> of 5. Changing <code>n</code> later does not touch the box. Unboxing with <code>(int)o</code> copies the 5 back out, and 5 + 10 = 15.</p>`
        }
      ],
      takeaways: [
        "Allocations cost GC time; cut them in hot loops and keep the rest simple.",
        "Use StringBuilder when appending in a loop.",
        "Span and ReadOnlySpan slice without copying; stackalloc gives small heap-free buffers.",
        "Structs copy on every assignment; keep them small and readonly, and watch for boxing."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m13-l05",
      title: "Attributes and reflection",
      minutes: 28,
      objectives: [
        "Use built-in attributes such as Obsolete, Flags and the caller-info attributes",
        "Write a custom attribute and restrict where it can go",
        "Inspect types, properties and attributes at run time with reflection",
        "Know the costs of reflection and the modern alternatives"
      ],
      blocks: [
        {
          type: "text",
          html: String.raw`<p>An <strong>attribute</strong> is a label in square brackets that attaches extra information (metadata) to code: a class, a method, a property, a parameter. The attribute does nothing by itself. Something else reads it: the compiler, a test runner, a JSON serializer, or your own code using <strong>reflection</strong>.</p><p>You have already used some: <code>[JsonPropertyName("id")]</code> in Module 11 told System.Text.Json what name to use. In the next module, <code>[Fact]</code> tells xUnit "this method is a test".</p>`
        },
        {
          type: "code",
          title: "Attributes the compiler and runtime understand",
          code: String.raw`var p = Permissions.Read | Permissions.Write;
Console.WriteLine(p);
Console.WriteLine(p.HasFlag(Permissions.Write));
Console.WriteLine(Plain.A | Plain.B);

Console.WriteLine(Legacy.Total(2, 3));

[Flags]
enum Permissions { None = 0, Read = 1, Write = 2, Delete = 4 }

enum Plain { A = 1, B = 2 }

static class Legacy
{
    [Obsolete("Use Math.Add from the new API instead.")]
    public static int Sum(int a, int b) => a + b;

    public static int Total(int a, int b) => a + b;
}`,
          output: String.raw`Read, Write
True
3
5`
        },
        {
          type: "text",
          html: String.raw`<p><code>[Flags]</code> changes how <code>ToString</code> prints combined values: <code>Read, Write</code> instead of <code>3</code>. Give flag values powers of two (1, 2, 4, 8) so they can be combined with <code>|</code>.</p><p><code>[Obsolete]</code> is read by the compiler. Any call to <code>Legacy.Sum</code> produces warning <strong>CS0618</strong>: "'Legacy.Sum(int, int)' is obsolete: 'Use Math.Add from the new API instead.'" Write <code>[Obsolete("...", true)]</code> and it becomes error <strong>CS0619</strong>. Library authors use this to retire old methods gently.</p>`
        },
        {
          type: "code",
          title: "Caller-info attributes: free context for logging",
          code: String.raw`using System.Runtime.CompilerServices;

var repo = new Repo();
repo.Save();
repo.Delete(0);

class Repo
{
    public void Save() => Log("saving");

    public void Delete(int id)
    {
        try { Check(id > 0); }
        catch (ArgumentException ex) { Console.WriteLine(ex.Message); }
    }

    static void Log(string msg,
        [CallerMemberName] string member = "",
        [CallerLineNumber] int line = 0)
        => Console.WriteLine($"[{member}:{line}] {msg}");

    static void Check(bool ok,
        [CallerArgumentExpression(nameof(ok))] string expr = "")
    {
        if (!ok) throw new ArgumentException($"Check failed: {expr}");
    }
}`,
          output: String.raw`[Save:9] saving
Check failed: id > 0`
        },
        {
          type: "text",
          html: String.raw`<p>The compiler fills in caller-info parameters at the call site. <code>[CallerMemberName]</code> becomes <code>"Save"</code>, <code>[CallerLineNumber]</code> the line of the call, and <code>[CallerArgumentExpression]</code> the source text of an argument. This is how <code>ArgumentNullException.ThrowIfNull(x)</code> knows to say "x" in its message, with zero run-time cost.</p>`
        },
        {
          type: "code",
          title: "A custom attribute read with reflection",
          code: String.raw`using System.Reflection;

var good = new Product { Name = "Mug", Sku = "MUG-01", Price = 9 };
var bad = new Product { Name = "", Sku = "X-TOO-LONG-CODE", Price = 5 };

Console.WriteLine($"good: {string.Join("; ", Validate(good))}");
foreach (var e in Validate(bad)) Console.WriteLine($"bad: {e}");

static List<string> Validate(object obj)
{
    var errors = new List<string>();
    foreach (PropertyInfo prop in obj.GetType().GetProperties())
    {
        object? value = prop.GetValue(obj);
        if (prop.GetCustomAttribute<NotEmptyAttribute>() is not null
            && value is string { Length: 0 })
            errors.Add($"{prop.Name} must not be empty");

        if (prop.GetCustomAttribute<MaxLenAttribute>() is { } max
            && value is string s && s.Length > max.Length)
            errors.Add($"{prop.Name} is longer than {max.Length}");
    }
    return errors;
}

[AttributeUsage(AttributeTargets.Property)]
class NotEmptyAttribute : Attribute { }

[AttributeUsage(AttributeTargets.Property)]
class MaxLenAttribute(int length) : Attribute
{
    public int Length { get; } = length;
}

class Product
{
    [NotEmpty] public string Name { get; set; } = "";
    [NotEmpty, MaxLen(8)] public string Sku { get; set; } = "";
    public decimal Price { get; set; }
}`,
          output: String.raw`good:
bad: Name must not be empty
bad: Sku is longer than 8`
        },
        {
          type: "text",
          html: String.raw`<p>Three things to notice:</p><ul><li>An attribute is a class that inherits <code>Attribute</code>. By convention its name ends in <code>Attribute</code>, and you may drop that suffix when you use it: <code>[MaxLen(8)]</code>.</li><li><code>[AttributeUsage(AttributeTargets.Property)]</code> limits where it may go. Put <code>[MaxLen(8)]</code> on a class and you get error <strong>CS0592</strong>.</li><li>Reflection starts from a <code>Type</code> (<code>obj.GetType()</code> or <code>typeof(Product)</code>). <code>GetProperties()</code> returns <code>PropertyInfo</code> objects that can read values (<code>GetValue</code>) and attributes (<code>GetCustomAttribute&lt;T&gt;()</code>).</li></ul>`
        },
        {
          type: "code",
          title: "Exploring a type at run time",
          code: String.raw`using System.Reflection;

Type t = typeof(Invoice);
Console.WriteLine($"{t.Name} in {t.Namespace ?? "(global)"}");

foreach (var p in t.GetProperties())
    Console.WriteLine($"  prop {p.Name}: {p.PropertyType.Name}");

foreach (var m in t.GetMethods(BindingFlags.Public
             | BindingFlags.Instance | BindingFlags.DeclaredOnly))
    if (!m.IsSpecialName)
        Console.WriteLine($"  method {m.Name}()");

object inv = Activator.CreateInstance(t)!;
t.GetProperty("Number")!.SetValue(inv, 1001);
object? result = t.GetMethod("Describe")!.Invoke(inv, null);
Console.WriteLine(result);

class Invoice
{
    public int Number { get; set; }
    public decimal Amount { get; set; }
    public string Describe() => $"Invoice #{Number}";
}`,
          output: String.raw`Invoice in (global)
  prop Number: Int32
  prop Amount: Decimal
  method Describe()
Invoice #1001`
        },
        {
          type: "callout",
          tone: "warning",
          title: "The cost of reflection",
          html: String.raw`<p>Reflection is powerful but has three costs. It is <strong>slow</strong> compared with a direct call, often 10 to 100 times. It is <strong>not checked by the compiler</strong>: a typo in <code>GetProperty("Numbr")</code> returns null at run time. And it <strong>fights trimming and Native AOT</strong>, because the trimmer cannot see which members you reach by name.</p><p>Modern .NET moves this work to compile time with <strong>source generators</strong>: <code>[JsonSerializable]</code> for System.Text.Json, <code>[GeneratedRegex]</code> for regular expressions, <code>[LoggerMessage]</code> for logging. Use reflection for tools, plugins and one-time startup scanning, and cache what you find.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Attributes are not decorators",
          html: String.raw`<p>A Python decorator is a function that wraps and changes behavior when the module loads. A C# attribute is passive data. <code>[Obsolete]</code> does not wrap the method; the compiler just reads the label. Python's <code>getattr(obj, "name")</code> and <code>type(obj).__dict__</code> are the closest thing to C# reflection.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var style = Style.Bold | Style.Underline;
Console.WriteLine(style);
Console.WriteLine((int)style);
style &= ~Style.Bold;
Console.WriteLine(style);
Console.WriteLine(Style.None);

[Flags]
enum Style { None = 0, Bold = 1, Italic = 2, Underline = 4 }`,
          answer: String.raw`Bold, Underline
5
Underline
None`,
          explain: String.raw`<p>Bold (1) plus Underline (4) is 5. <code>&amp;= ~Style.Bold</code> clears the Bold bit. Because of <code>[Flags]</code>, <code>ToString</code> lists the names of the set bits, and the zero value prints its own name.</p>`
        },
        {
          type: "fill",
          prompt: "Read the <code>MaxLen</code> attribute from a property, or get null if it is not there.",
          code: String.raw`PropertyInfo prop = typeof(Product).___("Sku")!;
var max = prop.___<MaxLenAttribute>();`,
          blanks: [["GetProperty"], ["GetCustomAttribute"]],
          explain: String.raw`<p><code>Type.GetProperty(name)</code> finds one property by name (null if missing, hence the <code>!</code>). <code>GetCustomAttribute&lt;T&gt;()</code> is an extension method from <code>System.Reflection</code> that returns the attribute instance or null.</p>`
        },
        {
          type: "mcq",
          prompt: "You mark a method <code>[Obsolete(\"Use V2\", true)]</code>. What happens when other code calls it?",
          options: [
            "The build fails with error CS0619",
            "The build succeeds with warning CS0618",
            "The call throws an ObsoleteException at run time",
            "Nothing, attributes are only documentation"
          ],
          answer: 0,
          explain: String.raw`<p>The second argument <code>true</code> means "treat use as an error", so the compiler reports CS0619. Without it you get warning CS0618. There is no run-time exception: the compiler is the only reader of this attribute.</p>`
        },
        {
          type: "order",
          prompt: "Put the steps of a reflection-based property printer in order.",
          lines: [
            "Get the Type with obj.GetType()",
            "Call GetProperties() to list PropertyInfo objects",
            "For each property, call GetValue(obj)",
            "Print the property Name and its value"
          ],
          explain: String.raw`<p>Reflection always starts from a <code>Type</code>. From there you get member descriptions (<code>PropertyInfo</code>, <code>MethodInfo</code>), and only then can you read values from a specific object.</p>`
        },
        {
          type: "bug",
          prompt: "This attribute does not compile on the property. Why?",
          code: String.raw`[AttributeUsage(AttributeTargets.Class)]
class SecretAttribute : Attribute { }

class Account
{
    [Secret] public string Pin { get; set; } = "";
}`,
          options: [
            "AttributeUsage allows the attribute only on classes, so using it on a property is error CS0592",
            "The attribute name must be written [SecretAttribute]",
            "Attributes must have a constructor with parameters",
            "Attribute classes must be sealed"
          ],
          answer: 0,
          explain: String.raw`<p><code>AttributeTargets.Class</code> restricts the attribute to classes. Change it to <code>AttributeTargets.Property</code> (or combine targets with <code>|</code>). The <code>Attribute</code> suffix is optional when using it, and a parameterless attribute is fine. Sealing attribute classes is a good habit for speed, but it is not required.</p>`
        }
      ],
      takeaways: [
        "Attributes are passive metadata; the compiler, frameworks or reflection give them meaning.",
        "[Flags], [Obsolete] and the caller-info attributes are worth knowing by heart.",
        "Custom attributes inherit Attribute; AttributeUsage controls where they go.",
        "Reflection is flexible but slow and unchecked; prefer source generators in hot paths."
      ]
    }
  ],
  milestone: {
    id: "m13-project",
    title: "Expression Evaluator",
    brief: String.raw`<p>Calculators, spreadsheets, query languages and compilers all start the same way: turn text into tokens, then turn tokens into meaning. In this project you build a small math language that runs in the console.</p><p>A <strong>tokenizer</strong> (lexer) walks the input and produces records like <code>Number "3.5"</code>, <code>Star</code> or <code>LParen</code>. A <strong>recursive-descent parser</strong> then has one method per precedence level. Each method calls the next tighter level, so <code>2 + 3 * 4</code> naturally evaluates to 14.</p><p>Your evaluator supports <code>+ - * / ^</code>, parentheses, unary minus, decimal numbers and named variables (<code>rate = 0.2</code>). Bad input must never crash it: show the user exactly where the problem is.</p>`,
    skills: ["records", "enums", "switch expressions", "property patterns", "recursion", "custom exceptions", "Dictionary"],
    requirements: [
      "Tokenize the input into a List of Token records (kind, text, position), ending with an End token.",
      "Respect precedence: ^ binds tighter than * and /, which bind tighter than + and -.",
      "^ is right-associative (2 ^ 3 ^ 2 = 512) and -2 ^ 2 gives -4.",
      "Support parentheses and unary minus, e.g. -(3 - 5) gives 2.",
      "Support assignment name = expression; later lines can use the variable.",
      "Report errors (unknown character, unexpected token, unknown variable, division by zero) with a caret under the position, without crashing.",
      "Parse numbers with CultureInfo.InvariantCulture so 0.5 works on every machine.",
      "Exit on 'quit' or end of input (ReadLine returns null)."
    ],
    sampleRun: String.raw`Expression Evaluator. Type 'quit' to exit.
> 2 + 3 * 4
= 14
> (2 + 3) * 4
= 20
> 2 ^ 3 ^ 2
= 512
> -2 ^ 2
= -4
> rate = 0.2
= 0.2
> 150 * (1 + rate)
= 180
> 10 / (5 - 5)
     ^ division by zero
> 3 + * 4
      ^ unexpected '*'
> total * 2
  ^ unknown variable 'total'
> quit
Bye!`,
    starter: String.raw`using System.Globalization;

var vars = new Dictionary<string, double>();
Console.WriteLine("Expression Evaluator. Type 'quit' to exit.");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null || line.Trim() == "quit") break;
    if (line.Trim().Length == 0) continue;

    try
    {
        var tokens = Lexer.Tokenize(line);
        double value = new Parser(tokens, vars).ParseLine();
        Console.WriteLine("= " + value.ToString(
            "G10", CultureInfo.InvariantCulture));
    }
    catch (EvalException ex)
    {
        // TODO: print spaces so the caret lines up under the
        // error position (the prompt "> " is 2 characters wide)
        Console.WriteLine("^ " + ex.Message);
    }
}
Console.WriteLine("Bye!");

enum Kind { Number, Name, Plus, Minus, Star, Slash, Caret,
            LParen, RParen, Assign, End }

record Token(Kind Kind, string Text, int Pos);

class EvalException(string message, int pos) : Exception(message)
{
    public int Pos { get; } = pos;
}

static class Lexer
{
    public static List<Token> Tokenize(string text)
    {
        var tokens = new List<Token>();
        // TODO: loop over the characters:
        //   skip whitespace
        //   digits and '.' -> Number token
        //   letters -> Name token
        //   + - * / ^ ( ) = -> operator tokens (use a switch)
        //   anything else -> throw EvalException
        tokens.Add(new Token(Kind.End, "", text.Length));
        return tokens;
    }
}

class Parser(List<Token> tokens, Dictionary<string, double> vars)
{
    int _i;
    Token Current => tokens[_i];

    // line := Name '=' expr | expr
    public double ParseLine()
    {
        // TODO: detect assignment, then parse an expression
        // and make sure the next token is End
        throw new EvalException("not implemented", 0);
    }

    // TODO: Expr (+ -), Term (* /), Unary (-), Power (^),
    // Primary (number, name, parentheses)
}`,
    hints: [
      String.raw`<p>Write the grammar down first, one rule per method:<br><code>expr := term (('+'|'-') term)*</code><br><code>term := unary (('*'|'/') unary)*</code><br><code>unary := '-' unary | power</code><br><code>power := primary ('^' unary)?</code><br><code>primary := Number | Name | '(' expr ')'</code></p>`,
      String.raw`<p>Give the parser two helpers: <code>Token Next()</code> returns <code>Current</code> and moves <code>_i</code> forward, and <code>Token Expect(Kind k)</code> throws an <code>EvalException</code> at <code>Current.Pos</code> if the kind is wrong.</p>`,
      String.raw`<p>For assignment, look ahead two tokens: <code>if (Current.Kind == Kind.Name &amp;&amp; tokens[_i + 1].Kind == Kind.Assign)</code>. The End token at the end guarantees <code>_i + 1</code> is in range whenever <code>Current</code> is not End.</p>`,
      String.raw`<p>Right associativity comes for free if <code>Power</code> calls <code>Unary</code> (which can reach <code>Power</code> again) for its right side, instead of looping. Remember the operator token before you parse the right side, so a division-by-zero error can point at the <code>/</code>.</p>`,
      String.raw`<p>For the caret: <code>Console.WriteLine(new string(' ', ex.Pos + 2) + "^ " + ex.Message);</code></p>`
    ],
    solution: String.raw`using System.Globalization;

var vars = new Dictionary<string, double>();
Console.WriteLine("Expression Evaluator. Type 'quit' to exit.");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null || line.Trim() == "quit") break;
    if (line.Trim().Length == 0) continue;

    try
    {
        var tokens = Lexer.Tokenize(line);
        double value = new Parser(tokens, vars).ParseLine();
        Console.WriteLine("= " + value.ToString(
            "G10", CultureInfo.InvariantCulture));
    }
    catch (EvalException ex)
    {
        Console.WriteLine(
            new string(' ', ex.Pos + 2) + "^ " + ex.Message);
    }
}
Console.WriteLine("Bye!");

enum Kind { Number, Name, Plus, Minus, Star, Slash, Caret,
            LParen, RParen, Assign, End }

record Token(Kind Kind, string Text, int Pos);

class EvalException(string message, int pos) : Exception(message)
{
    public int Pos { get; } = pos;
}

static class Lexer
{
    public static List<Token> Tokenize(string text)
    {
        var tokens = new List<Token>();
        int i = 0;
        while (i < text.Length)
        {
            char c = text[i];
            if (char.IsWhiteSpace(c)) { i++; continue; }

            int start = i;
            if (char.IsDigit(c) || c == '.')
            {
                while (i < text.Length
                       && (char.IsDigit(text[i]) || text[i] == '.'))
                    i++;
                tokens.Add(new Token(Kind.Number, text[start..i], start));
                continue;
            }
            if (char.IsLetter(c))
            {
                while (i < text.Length && char.IsLetterOrDigit(text[i]))
                    i++;
                tokens.Add(new Token(Kind.Name, text[start..i], start));
                continue;
            }

            Kind kind = c switch
            {
                '+' => Kind.Plus,
                '-' => Kind.Minus,
                '*' => Kind.Star,
                '/' => Kind.Slash,
                '^' => Kind.Caret,
                '(' => Kind.LParen,
                ')' => Kind.RParen,
                '=' => Kind.Assign,
                _ => throw new EvalException($"unknown character '{c}'", i)
            };
            tokens.Add(new Token(kind, c.ToString(), i));
            i++;
        }
        tokens.Add(new Token(Kind.End, "", text.Length));
        return tokens;
    }
}

class Parser(List<Token> tokens, Dictionary<string, double> vars)
{
    int _i;
    Token Current => tokens[_i];
    Token Next() => tokens[_i++];

    Token Expect(Kind kind)
    {
        if (Current.Kind != kind)
            throw Unexpected();
        return Next();
    }

    EvalException Unexpected() => Current.Kind == Kind.End
        ? new EvalException("unexpected end of input", Current.Pos)
        : new EvalException($"unexpected '{Current.Text}'", Current.Pos);

    public double ParseLine()
    {
        string? target = null;
        if (Current.Kind == Kind.Name
            && tokens[_i + 1].Kind == Kind.Assign)
        {
            target = Next().Text;
            Next(); // skip '='
        }
        double value = Expr();
        Expect(Kind.End);
        if (target is not null) vars[target] = value;
        return value;
    }

    double Expr()
    {
        double left = Term();
        while (Current.Kind is Kind.Plus or Kind.Minus)
        {
            Token op = Next();
            double right = Term();
            left = op.Kind == Kind.Plus ? left + right : left - right;
        }
        return left;
    }

    double Term()
    {
        double left = Unary();
        while (Current.Kind is Kind.Star or Kind.Slash)
        {
            Token op = Next();
            double right = Unary();
            if (op.Kind == Kind.Slash && right == 0)
                throw new EvalException("division by zero", op.Pos);
            left = op.Kind == Kind.Star ? left * right : left / right;
        }
        return left;
    }

    double Unary()
    {
        if (Current.Kind == Kind.Minus)
        {
            Next();
            return -Unary();
        }
        return Power();
    }

    double Power()
    {
        double b = Primary();
        if (Current.Kind != Kind.Caret) return b;
        Next();
        return Math.Pow(b, Unary()); // recursion: right-associative
    }

    double Primary()
    {
        Token t = Current;
        switch (t)
        {
            case { Kind: Kind.Number }:
                Next();
                if (!double.TryParse(t.Text, NumberStyles.Float,
                        CultureInfo.InvariantCulture, out double n))
                    throw new EvalException($"bad number '{t.Text}'", t.Pos);
                return n;
            case { Kind: Kind.Name }:
                Next();
                return vars.TryGetValue(t.Text, out double v)
                    ? v
                    : throw new EvalException(
                        $"unknown variable '{t.Text}'", t.Pos);
            case { Kind: Kind.LParen }:
                Next();
                double inner = Expr();
                Expect(Kind.RParen);
                return inner;
            default:
                throw Unexpected();
        }
    }
}`,
    stretch: [
      "Add functions: sqrt(x), abs(x), max(a, b). Hint: a Name followed by LParen is a call.",
      "Add the modulo operator % at the same level as * and /.",
      "Build an abstract syntax tree of records (Num, Var, Binary, Neg) first, then evaluate it with a switch expression over the node types.",
      "Store the tokens as ReadOnlySpan slices instead of strings, and measure the difference with BenchmarkDotNet."
    ]
  }
});
