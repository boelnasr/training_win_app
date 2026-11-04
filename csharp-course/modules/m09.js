(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m09",
  number: 9,
  title: "Generics, Delegates & Events",
  tagline: "Write code once for many types, pass behavior around, and let objects announce what happened.",
  level: "Intermediate",
  lessons: [
    // ------------------------------------------------------------------
    // Lesson 1: Generic methods and classes
    // ------------------------------------------------------------------
    {
      id: "m09-l01",
      title: "Generic methods and classes",
      minutes: 22,
      objectives: [
        "Explain the problem generics solve (type safety without copy-paste)",
        "Write and call generic methods, with and without type inference",
        "Build a generic class with one or more type parameters",
        "Use default(T) and read generic compiler errors"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>You have already used generics. <code>List&lt;int&gt;</code>, <code>Dictionary&lt;string, decimal&gt;</code> and <code>Queue&lt;Order&gt;</code> are all generic types. The part in angle brackets is a <strong>type argument</strong>. It tells the class which type it should work with.</p><p>In this lesson you learn to write your own. First, let's see the problem generics solve.</p>"
        },
        {
          type: "text",
          html: "<p>Imagine you want a method that swaps two values. Without generics you write one version per type, or you fall back to <code>object</code>, which accepts anything:</p>"
        },
        {
          type: "code",
          title: "Program.cs (the old way)",
          code: String.raw`void SwapInts(ref int a, ref int b)
{
    int temp = a; a = b; b = temp;
}

void SwapStrings(ref string a, ref string b)
{
    string temp = a; a = b; b = temp;
}

// ...and SwapDoubles, SwapDates, SwapCustomers...

object box = 42;          // object accepts anything
int n = (int)box;         // but you must cast it back
string s = (string)box;   // compiles, then crashes at runtime`,
        },
        {
          type: "text",
          html: "<p>Copy-paste means bugs get fixed in one copy and not the others. The <code>object</code> version compiles for any cast, so a wrong cast only blows up at runtime with an <code>InvalidCastException</code>. It also <strong>boxes</strong> value types like <code>int</code>, which costs a heap allocation each time.</p><p>Generics fix all three problems. You write the code once with a placeholder type, usually called <code>T</code>, and the compiler checks every call:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int x = 1, y = 2;
Swap(ref x, ref y);
Console.WriteLine($"x={x}, y={y}");

string first = "left", second = "right";
Swap(ref first, ref second);
Console.WriteLine($"{first} {second}");

// T is a type parameter: a placeholder for a real type
static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}`,
          output: "x=2, y=1\nright left"
        },
        {
          type: "text",
          html: "<p>Notice that the calls say <code>Swap(ref x, ref y)</code>, not <code>Swap&lt;int&gt;(ref x, ref y)</code>. The compiler looks at the arguments and <strong>infers</strong> <code>T</code> for you. You can still write the type argument explicitly. You must write it when there is nothing to infer from, for example when <code>T</code> appears only in the return type:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Console.WriteLine(First(new[] { 3, 1, 2 }));
Console.WriteLine(First<string>(["a", "b"]));
Console.WriteLine(MakeDefault<int>());
Console.WriteLine(MakeDefault<string>() is null);

static T First<T>(T[] items) => items[0];

// Nothing to infer from: the caller must say what T is.
static T? MakeDefault<T>() => default;`,
          output: "3\na\n0\nTrue"
        },
        {
          type: "callout",
          tone: "note",
          title: "default(T)",
          html: "<p>Inside generic code you do not know whether <code>T</code> is a number, a string or a class. <code>default(T)</code> (or just <code>default</code> when the type is clear) gives the zero value for whatever <code>T</code> turns out to be: <code>0</code> for numbers, <code>false</code> for <code>bool</code>, and <code>null</code> for reference types.</p>"
        },
        {
          type: "text",
          html: "<p>Classes can be generic too. Here is a tiny fixed-size history buffer that remembers the last few items of any type. This is the same idea as <code>List&lt;T&gt;</code>: the class is written once and the user picks the type.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var recent = new History<string>(capacity: 3);
recent.Add("open");
recent.Add("edit");
recent.Add("save");
recent.Add("close");   // "open" falls off the front
Console.WriteLine(string.Join(", ", recent.Items));

var temps = new History<double>(2);
temps.Add(21.5);
temps.Add(22.0);
Console.WriteLine($"Latest: {temps.Latest}");

class History<T>
{
    private readonly Queue<T> _items = new();
    private readonly int _capacity;

    public History(int capacity) => _capacity = capacity;

    public IEnumerable<T> Items => _items;
    public T? Latest => _items.Count > 0 ? _items.Last() : default;

    public void Add(T item)
    {
        if (_items.Count == _capacity) _items.Dequeue();
        _items.Enqueue(item);
    }
}`,
          output: "edit, save, close\nLatest: 22"
        },
        {
          type: "text",
          html: "<p>A type can have several type parameters. By convention a single parameter is named <code>T</code>, and multiple ones get descriptive names that start with <code>T</code>: <code>TKey</code>, <code>TValue</code>, <code>TResult</code>. The .NET libraries follow this rule everywhere, so following it makes your code feel familiar.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var p = new Pair<string, int>("Answer", 42);
Console.WriteLine(p);

var swapped = p.Swap();
Console.WriteLine(swapped);

record Pair<TFirst, TSecond>(TFirst First, TSecond Second)
{
    public Pair<TSecond, TFirst> Swap() => new(Second, First);
}`,
          output: "Pair { First = Answer, Second = 42 }\nPair { First = 42, Second = Answer }"
        },
        {
          type: "table",
          headers: ["You write", "Compiler says", "Meaning"],
          rows: [
            ["<code>History&lt;int&gt; h = new History&lt;string&gt;(3);</code>", "CS0029: Cannot implicitly convert type 'History&lt;string&gt;' to 'History&lt;int&gt;'", "Different type arguments make different types."],
            ["<code>h.Add(\"hi\");</code> on a <code>History&lt;int&gt;</code>", "CS1503: Argument 1: cannot convert from 'string' to 'int'", "The type check happens at compile time. That is the whole point."],
            ["<code>MakeDefault();</code>", "CS0411: The type arguments for method ... cannot be inferred from the usage", "Nothing to infer <code>T</code> from. Write <code>MakeDefault&lt;int&gt;()</code>."]
          ]
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p>Python's <code>list[int]</code> and <code>TypeVar</code> are hints that a tool like mypy may check. At runtime Python ignores them. In C# the type argument is enforced by the compiler <em>and</em> kept at runtime: a <code>List&lt;int&gt;</code> really stores raw ints, with no boxing, and you cannot sneak a string in.</p>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "How .NET runs generics",
          html: "<p>The compiler emits one generic definition in IL. At runtime the JIT creates specialized machine code: one shared copy for all reference types (they are all just pointers), and a separate copy for each value type such as <code>int</code> or <code>double</code>. That is why <code>List&lt;int&gt;</code> is as fast as a hand-written int list. Java, by contrast, erases generic types and boxes primitives.</p>"
        }
      ],
      exercises: [
        {
          type: "mcq",
          prompt: "Why is <code>List&lt;int&gt;</code> better than storing numbers in a <code>List&lt;object&gt;</code>?",
          options: [
            "It is checked at compile time and avoids boxing each int",
            "It can hold more items",
            "It allows mixing ints and strings safely",
            "It is the only list that supports foreach"
          ],
          answer: 0,
          explain: "<p>Generics give you compile-time type checks and store value types directly. Capacity is the same for both lists. Mixing types is exactly what <code>List&lt;int&gt;</code> prevents. Both lists support <code>foreach</code>.</p>"
        },
        {
          type: "output",
          prompt: "What does this program print?",
          code: String.raw`Console.WriteLine(Pick(true, "yes", "no"));
Console.WriteLine(Pick(false, 10, 20));
Console.WriteLine(Empty<bool>());

static T Pick<T>(bool condition, T a, T b) =>
    condition ? a : b;

static T? Empty<T>() => default;`,
          answer: "yes\n20\nFalse",
          explain: "<p><code>T</code> is inferred as <code>string</code>, then <code>int</code>. <code>Empty&lt;bool&gt;()</code> returns <code>default(bool)</code>, which is <code>false</code>, and <code>Console.WriteLine</code> prints a bool as <code>False</code> with a capital F.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the generic method so it returns the last element of any array.",
          code: String.raw`static ___ Last___(T[] items)
{
    return items[items.Length - 1];
}`,
          blanks: [["T"], ["<T>"]],
          explain: "<p>The return type is <code>T</code>, and the type parameter list <code>&lt;T&gt;</code> goes right after the method name. Without <code>&lt;T&gt;</code> the compiler reports CS0246: the type or namespace name 'T' could not be found.</p>"
        },
        {
          type: "bug",
          prompt: "This code does not compile. Why?",
          code: String.raw`var names = new History<string>(5);
names.Add("Ada");
names.Add(42);`,
          options: [
            "42 is an int, and a History<string> only accepts strings (CS1503)",
            "History needs a type argument on the right side too",
            "Generic classes cannot be created with var",
            "Add must be called as Add<string>"
          ],
          answer: 0,
          explain: "<p>Once you pick <code>string</code> for <code>T</code>, <code>Add</code> takes a <code>string</code>. The compiler stops the int at compile time with CS1503. The <code>new History&lt;string&gt;(5)</code> already has its type argument, <code>var</code> is fine, and <code>Add</code> is not a generic method.</p>"
        },
        {
          type: "mcq",
          prompt: "Which call needs an explicit type argument?",
          code: String.raw`static T Echo<T>(T value) => value;
static T Create<T>() where T : new() => new T();`,
          options: [
            "Create, because T appears only in the return type",
            "Echo, because T is a parameter",
            "Both of them",
            "Neither of them"
          ],
          answer: 0,
          explain: "<p>Type inference works from the <em>arguments</em>. <code>Echo(5)</code> infers <code>int</code> from <code>5</code>. <code>Create()</code> has no arguments, so you must write <code>Create&lt;Customer&gt;()</code>. The return type is never used for inference.</p>"
        }
      ],
      takeaways: [
        "Generics let you write code once and reuse it safely for many types.",
        "Type arguments are checked at compile time, and value types are not boxed.",
        "The compiler infers T from arguments. When it cannot, write the type argument explicitly.",
        "default(T) is the zero value: 0, false or null depending on T.",
        "Name a single type parameter T and multiple ones TKey, TValue, TResult and so on."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 2: Constraints
    // ------------------------------------------------------------------
    {
      id: "m09-l02",
      title: "Constraints: where T : ...",
      minutes: 20,
      objectives: [
        "Explain why the compiler limits what you can do with a bare T",
        "Add constraints such as class, struct, new(), notnull, a base class or an interface",
        "Write a generic Max method using IComparable<T>",
        "Recognize the errors that a missing or violated constraint produces"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Inside a generic method, the compiler knows nothing about <code>T</code>. It could be an <code>int</code>, a <code>string</code>, a <code>FileStream</code> or your own <code>Customer</code>. So it only lets you do things that work for <em>every</em> type: assign it, pass it around, compare it to <code>null</code>-ish defaults, call <code>ToString()</code>, <code>Equals()</code> and <code>GetHashCode()</code>.</p><p>Try to compare two values and you hit a wall:</p>"
        },
        {
          type: "code",
          title: "Does not compile",
          code: String.raw`static T Max<T>(T a, T b)
{
    return a > b ? a : b;
    // error CS0019: Operator '>' cannot be applied
    // to operands of type 'T' and 'T'
}`
        },
        {
          type: "text",
          html: "<p>That error is correct. What would <code>&gt;</code> mean for two <code>FileStream</code> objects? A <strong>constraint</strong> narrows down which types are allowed for <code>T</code>. In return, you get to use the members those types are guaranteed to have. You add constraints with a <code>where</code> clause after the parameter list:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Console.WriteLine(Max(3, 9));
Console.WriteLine(Max("apple", "banana"));
Console.WriteLine(Max(19.99m, 4.50m));

// T must implement IComparable<T>, so CompareTo exists.
static T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) >= 0 ? a : b;
}`,
          output: "9\nbanana\n19.99"
        },
        {
          type: "text",
          html: "<p><code>CompareTo</code> returns a negative number if <code>a</code> comes first, zero if they are equal, and a positive number if <code>a</code> comes after <code>b</code>. <code>int</code>, <code>string</code>, <code>decimal</code>, <code>DateTime</code> and many more all implement <code>IComparable&lt;T&gt;</code>, so one method covers them all.</p>"
        },
        {
          type: "table",
          headers: ["Constraint", "Means", "Unlocks"],
          rows: [
            ["<code>where T : class</code>", "T is a reference type", "Can compare with <code>null</code>, can use <code>as</code>"],
            ["<code>where T : struct</code>", "T is a non-nullable value type", "Can write <code>T?</code> as <code>Nullable&lt;T&gt;</code>"],
            ["<code>where T : new()</code>", "T has a public parameterless constructor", "<code>new T()</code>"],
            ["<code>where T : notnull</code>", "T is not a nullable type", "Safe dictionary keys and similar"],
            ["<code>where T : Animal</code>", "T is Animal or derives from it", "All of Animal's public members"],
            ["<code>where T : IShape</code>", "T implements the interface", "All the interface members"],
            ["<code>where TDerived : TBase</code>", "One type parameter derives from another", "Treating TDerived as TBase"]
          ]
        },
        {
          type: "text",
          html: "<p>You can combine constraints with commas, and give each type parameter its own <code>where</code> clause. The order rule: <code>class</code> or <code>struct</code> first, then base class and interfaces, and <code>new()</code> last.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var repo = new Repository<Product>();
Product mouse = repo.Create();
mouse.Name = "Mouse";
repo.Add(mouse);
repo.Add(new Product { Id = 7, Name = "Desk" });

Console.WriteLine(repo.Find(7)?.Name ?? "none");
Console.WriteLine(repo.Find(99)?.Name ?? "none");
Console.WriteLine($"Count: {repo.Count}");

interface IEntity
{
    int Id { get; }
}

class Product : IEntity
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
}

// Reference type, has an Id, can be created with new T()
class Repository<T> where T : class, IEntity, new()
{
    private readonly List<T> _items = new();

    public int Count => _items.Count;
    public T Create() => new T();
    public void Add(T item) => _items.Add(item);

    public T? Find(int id)
    {
        foreach (T item in _items)
            if (item.Id == id) return item;   // Id from IEntity
        return null;                          // OK: T is a class
    }
}`,
          output: "Desk\nnone\nCount: 2"
        },
        {
          type: "text",
          html: "<p>Every constraint on that repository is doing a job. Remove <code>IEntity</code> and <code>item.Id</code> fails. Remove <code>class</code> and <code>return null</code> fails. Remove <code>new()</code> and <code>new T()</code> fails with <strong>CS0304</strong>: <em>Cannot create an instance of the variable type 'T' because it does not have the new() constraint</em>.</p><p>Constraints also protect callers. If someone writes <code>new Repository&lt;string&gt;()</code>, they get <strong>CS0311</strong>: there is no implicit reference conversion from 'string' to 'IEntity'. The mistake is caught before the program ever runs.</p>"
        },
        {
          type: "callout",
          tone: "tip",
          title: "Add constraints only when you need them",
          html: "<p>Each constraint shrinks the set of types callers can use. Start with none. Add one when the compiler tells you that you need a member, and pick the smallest constraint that unlocks it. An interface constraint such as <code>IComparable&lt;T&gt;</code> is usually better than a base class, because any type can implement an interface.</p>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "Generic math (C# 11 and later)",
          html: "<p>Interfaces can now declare static operators. <code>System.Numerics.INumber&lt;T&gt;</code> lets you write <code>static T Sum&lt;T&gt;(T[] xs) where T : INumber&lt;T&gt;</code> and use <code>+</code> and <code>T.Zero</code> inside it. It works for <code>int</code>, <code>double</code>, <code>decimal</code> and the rest. You will see it in library code. For day-to-day apps, <code>IComparable&lt;T&gt;</code> and the constraints above cover most needs.</p>"
        }
      ],
      exercises: [
        {
          type: "mcq",
          prompt: "Why does <code>a &gt; b</code> fail inside <code>static T Max&lt;T&gt;(T a, T b)</code>?",
          options: [
            "The compiler cannot assume every possible T supports the > operator",
            "Generic methods cannot use operators at all",
            "T must be written as T? to compare it",
            "The method needs to be non-static"
          ],
          answer: 0,
          explain: "<p>With no constraint, <code>T</code> could be any type, and most types have no <code>&gt;</code>. Generic code can use operators that every type has, such as <code>=</code>, and with generic math even <code>+</code> and <code>&gt;</code>. Nullability and <code>static</code> have nothing to do with it.</p>"
        },
        {
          type: "fill",
          prompt: "Add the constraint that lets this method call <code>new T()</code>.",
          code: String.raw`static List<T> MakeMany<T>(int count) where T : ___
{
    var list = new List<T>();
    for (int i = 0; i < count; i++) list.Add(new T());
    return list;
}`,
          blanks: [["new()"]],
          explain: "<p><code>new()</code> promises a public parameterless constructor. Without it the compiler reports CS0304.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`Console.WriteLine(Smallest([5, 2, 8]));
Console.WriteLine(Smallest(["pear", "fig", "kiwi"]));

static T Smallest<T>(T[] items) where T : IComparable<T>
{
    T best = items[0];
    foreach (T item in items)
        if (item.CompareTo(best) < 0) best = item;
    return best;
}`,
          answer: "2\nfig",
          explain: "<p>For ints, <code>CompareTo</code> compares numerically, so 2 wins. For strings it compares alphabetically, and <code>\"fig\"</code> comes before <code>\"kiwi\"</code> and <code>\"pear\"</code>. The same method handles both because both types implement <code>IComparable&lt;T&gt;</code>.</p>"
        },
        {
          type: "bug",
          prompt: "This line produces a compile error. Which constraint is violated?",
          code: String.raw`static void Reset<T>(ref T? value) where T : class
    => value = null;

int count = 5;
Reset(ref count);`,
          options: [
            "int is a value type, but the method requires a reference type (class)",
            "ref cannot be used with generic parameters",
            "T? is not allowed with a class constraint",
            "count must be declared as int? first"
          ],
          answer: 0,
          explain: "<p><code>where T : class</code> only allows reference types. The compiler reports CS0452: the type 'int' must be a reference type. <code>ref</code> works fine with generics, and <code>T?</code> on a class-constrained T means a nullable reference.</p>"
        },
        {
          type: "order",
          prompt: "Put this constrained generic class declaration in a valid order.",
          lines: [
            "class Cache<TKey, TValue>",
            "    where TKey : notnull",
            "    where TValue : class, new()",
            "{",
            "    private readonly Dictionary<TKey, TValue> _map = new();",
            "}"
          ],
          explain: "<p>Type parameters come right after the class name. Each gets its own <code>where</code> clause before the opening brace. Inside one clause, <code>class</code> comes first and <code>new()</code> comes last.</p>"
        }
      ],
      takeaways: [
        "Without constraints, generic code can only use what every type has.",
        "A where clause limits the allowed types and unlocks their members.",
        "IComparable<T> is the go-to constraint for comparing and sorting.",
        "Common errors: CS0019 (no operator), CS0304 (missing new()), CS0311/CS0452 (constraint violated).",
        "Use the fewest, smallest constraints that make your code compile."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 3: Delegates, lambdas, closures
    // ------------------------------------------------------------------
    {
      id: "m09-l03",
      title: "Delegates, lambdas and closures",
      minutes: 28,
      objectives: [
        "Explain a delegate as a variable that holds a method",
        "Use Func, Action and Predicate instead of custom delegate types",
        "Write expression and statement lambdas",
        "Predict what a closure captures, including the classic loop trap"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>So far, variables have held data: numbers, strings, objects. A <strong>delegate</strong> is a variable that holds a <em>method</em>. You can store it, pass it to another method and call it later.</p><p>Why would you want that? Because it lets one method take <em>behavior</em> as a parameter. A sort method can take \"how to compare\". A retry helper can take \"what to retry\". A button can take \"what to do when clicked\".</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`// A delegate type describes a method shape:
// takes an int, returns an int.
MathOp op = Double;
Console.WriteLine(op(5));      // calls Double(5)

op = Square;                   // point it at another method
Console.WriteLine(op(5));

Console.WriteLine(ApplyTwice(Double, 3));

static int Double(int x) => x * 2;
static int Square(int x) => x * x;

static int ApplyTwice(MathOp f, int value) => f(f(value));

delegate int MathOp(int x);`,
          output: "10\n25\n12"
        },
        {
          type: "text",
          html: "<p>Any method whose parameters and return type match the delegate can be assigned to it. If the shape does not match, you get <strong>CS0123</strong>: <em>No overload for 'Shout' matches delegate 'MathOp'</em>.</p><p>Declaring your own delegate types is rare today. .NET ships generic delegates that cover almost every shape:</p>"
        },
        {
          type: "table",
          headers: ["Delegate", "Shape", "Example"],
          rows: [
            ["<code>Action</code>", "no parameters, returns nothing", "<code>Action beep = () =&gt; Console.Beep();</code>"],
            ["<code>Action&lt;T1, T2&gt;</code>", "takes T1 and T2, returns nothing", "<code>Action&lt;string&gt; log = Console.WriteLine;</code>"],
            ["<code>Func&lt;TResult&gt;</code>", "no parameters, returns TResult", "<code>Func&lt;int&gt; roll = () =&gt; 6;</code>"],
            ["<code>Func&lt;T1, TResult&gt;</code>", "takes T1, returns TResult (the <strong>last</strong> type is the return type)", "<code>Func&lt;int, bool&gt; isEven = n =&gt; n % 2 == 0;</code>"],
            ["<code>Predicate&lt;T&gt;</code>", "takes T, returns bool", "<code>list.RemoveAll(predicate)</code>"]
          ]
        },
        {
          type: "text",
          html: "<p>The <code>n =&gt; n % 2 == 0</code> part is a <strong>lambda expression</strong>: a method with no name, written inline. Read <code>=&gt;</code> as \"goes to\". The left side lists parameters, the right side is the body.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`// Expression lambda: one expression, its value is returned
Func<int, int, int> add = (a, b) => a + b;

// Statement lambda: a block with an explicit return
Func<string, string> initials = fullName =>
{
    string[] parts = fullName.Split(' ');
    string result = "";
    foreach (string p in parts) result += p[0];
    return result.ToUpper();
};

Action<string> shout = msg => Console.WriteLine(msg + "!");
Predicate<int> isNegative = n => n < 0;

Console.WriteLine(add(2, 3));
Console.WriteLine(initials("grace brewster hopper"));
shout("Hello");
Console.WriteLine(isNegative(-4));

// C# 10+: a lambda with typed parameters has a natural type
var square = (int x) => x * x;
Console.WriteLine(square(7));`,
          output: "5\nGBH\nHello!\nTrue\n49"
        },
        {
          type: "text",
          html: "<p>The real payoff is passing lambdas to methods that accept delegates. The collection classes are full of them:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var scores = new List<int> { 72, 45, 90, 38, 81 };

scores.RemoveAll(s => s < 40);              // Predicate<int>
Console.WriteLine(string.Join(" ", scores));

int firstA = scores.Find(s => s >= 90);     // Predicate<int>
Console.WriteLine(firstA);

scores.Sort((a, b) => b.CompareTo(a));      // Comparison<int>
Console.WriteLine(string.Join(" ", scores));

scores.ForEach(s => Console.Write(s / 10 + " "));  // Action<int>
Console.WriteLine();

// Your own higher-order method
List<string> labels = Map(scores, s => s >= 50 ? "pass" : "fail");
Console.WriteLine(string.Join(" ", labels));

static List<TOut> Map<TIn, TOut>(List<TIn> items,
                                 Func<TIn, TOut> transform)
{
    var result = new List<TOut>();
    foreach (TIn item in items) result.Add(transform(item));
    return result;
}`,
          output: "72 45 90 81\n90\n90 81 72 45\n9 8 7 4 \npass pass pass fail"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p>Python functions are already first-class objects, so <code>Func</code> and <code>Action</code> play the role of <code>Callable[[int], bool]</code>. One difference: a Python <code>lambda</code> can only hold a single expression, so you reach for <code>def</code> for anything bigger. A C# lambda can have a full block body with statements, loops and <code>return</code>.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Closures.</strong> A lambda can use variables from the method around it. It does not copy their values. It <em>captures the variable itself</em>, so it sees later changes and can change the variable too:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int counter = 0;
Action increment = () => counter++;

increment();
increment();
Console.WriteLine(counter);     // the lambda changed it

Func<int> peek = () => counter;
counter = 100;
Console.WriteLine(peek());      // sees the latest value

Func<int> MakeCounter()
{
    int count = 0;                // lives on after the
    return () => ++count;         // method returns
}

var next = MakeCounter();
Console.WriteLine($"{next()} {next()} {next()}");`,
          output: "2\n100\n1 2 3"
        },
        {
          type: "callout",
          tone: "warning",
          title: "The for-loop capture trap",
          html: "<p>A <code>for</code> loop has <strong>one</strong> loop variable shared by every iteration. Lambdas created in the loop all capture that same variable, so when they run later they all see its final value. <code>foreach</code> creates a fresh variable each iteration (since C# 5), so it does not have this problem. The fix for <code>for</code> is to copy the value into a local inside the loop body.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var actions = new List<Action>();
for (int i = 0; i < 3; i++)
    actions.Add(() => Console.Write(i + " "));
foreach (var a in actions) a();     // all see i == 3
Console.WriteLine();

actions.Clear();
for (int i = 0; i < 3; i++)
{
    int copy = i;                   // new variable each time
    actions.Add(() => Console.Write(copy + " "));
}
foreach (var a in actions) a();
Console.WriteLine();`,
          output: "3 3 3 \n0 1 2 "
        },
        {
          type: "callout",
          tone: "deep",
          title: "What the compiler builds",
          html: "<p>For a capturing lambda, the compiler generates a hidden class with a field for each captured variable, and turns the lambda into a method on that class. That is how <code>count</code> outlives <code>MakeCounter</code>: it is really a field on a heap object. It also means capturing has a small cost. Add the <code>static</code> keyword (<code>static x =&gt; x * 2</code>) to a lambda that should capture nothing, and the compiler will stop you if it accidentally does.</p>"
        }
      ],
      exercises: [
        {
          type: "mcq",
          prompt: "Which delegate type matches a method that takes a <code>string</code> and returns an <code>int</code>?",
          options: [
            "Func<string, int>",
            "Func<int, string>",
            "Action<string, int>",
            "Predicate<string>"
          ],
          answer: 0,
          explain: "<p>In <code>Func</code>, the <strong>last</strong> type argument is the return type, so <code>Func&lt;string, int&gt;</code>. <code>Func&lt;int, string&gt;</code> is the reverse. <code>Action</code> never returns a value. <code>Predicate&lt;string&gt;</code> returns <code>bool</code>.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`int total = 10;
Func<int, int> addTotal = x => x + total;
total = 20;
Console.WriteLine(addTotal(1));

Action<int> bump = n => total += n;
bump(5);
Console.WriteLine(total);`,
          answer: "21\n25",
          explain: "<p>The lambda captures the <em>variable</em> <code>total</code>, not its value at creation time. By the time <code>addTotal(1)</code> runs, <code>total</code> is 20, so the result is 21. <code>bump</code> changes the same variable, so it becomes 25.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the declarations so this compiles.",
          code: String.raw`___ isLong = word => word.Length > 5;
___ greet = name => Console.WriteLine($"Hi {name}");

Console.WriteLine(isLong("elephant"));
greet("Sam");`,
          blanks: [["Func<string, bool>", "Predicate<string>"], ["Action<string>"]],
          explain: "<p><code>isLong</code> takes a string and returns a bool: <code>Func&lt;string, bool&gt;</code> or <code>Predicate&lt;string&gt;</code>. <code>greet</code> returns nothing, so it is an <code>Action&lt;string&gt;</code>. Plain <code>var</code> fails here (CS8917) because the lambda parameters have no types to infer from.</p>"
        },
        {
          type: "output",
          prompt: "Predict the output. Watch the loop.",
          code: String.raw`var printers = new List<Func<string>>();
for (int i = 1; i <= 3; i++)
    printers.Add(() => "#" + i);

foreach (var p in printers)
    Console.Write(p() + " ");
Console.WriteLine();

foreach (int n in new[] { 1, 2, 3 })
    printers.Add(() => "#" + n);
Console.WriteLine(printers[3]() + printers[5]());`,
          answer: "#4 #4 #4\n#1#3",
          explain: "<p>The <code>for</code> loop shares one <code>i</code>. The loop ends when <code>i</code> becomes 4, so all three lambdas print <code>#4</code>. The <code>foreach</code> loop gets a fresh <code>n</code> each pass, so the lambdas at index 3 and 5 keep 1 and 3.</p>"
        },
        {
          type: "bug",
          prompt: "Why does this fail to compile?",
          code: String.raw`Func<int, int> twice = x => x * 2;
int result = twice("4");`,
          options: [
            "twice expects an int argument, but \"4\" is a string",
            "Func cannot hold lambdas, only named methods",
            "Lambdas must use a block body with return",
            "twice must be called with Invoke"
          ],
          answer: 0,
          explain: "<p>A delegate keeps full type checking: <code>Func&lt;int, int&gt;</code> takes an int, so passing a string gives CS1503. <code>Func</code> holds lambdas just fine, expression bodies are allowed, and <code>twice(...)</code> is shorthand for <code>twice.Invoke(...)</code>.</p>"
        }
      ],
      takeaways: [
        "A delegate is a type-safe variable that holds a method.",
        "Use Action (no return), Func (last type is the return) and Predicate (returns bool).",
        "Lambdas are inline methods: x => expr, or (a, b) => { statements }.",
        "Closures capture variables, not values, so they see later changes.",
        "In a for loop, copy the loop variable into a local before capturing it."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 4: Events
    // ------------------------------------------------------------------
    {
      id: "m09-l04",
      title: "Events and the publisher/subscriber pattern",
      minutes: 25,
      objectives: [
        "Explain why events exist on top of delegates",
        "Declare and raise an event with EventHandler<TEventArgs>",
        "Subscribe and unsubscribe with += and -=",
        "Avoid common event bugs: null events and leaked subscriptions"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Often an object needs to say \"something happened\" without knowing who cares. A thermostat reports a temperature change. A shopping cart reports a new item. A button reports a click. The object that raises the news is the <strong>publisher</strong>. The objects that react are <strong>subscribers</strong>.</p><p>The publisher should not have a hard-coded list of who to call. That would tie it to every screen, logger and email service in your app. Instead, it exposes an <strong>event</strong>, and anyone can sign up.</p>"
        },
        {
          type: "text",
          html: "<p>Under the hood, an event is a delegate. A delegate variable can hold <em>several</em> methods at once (a <strong>multicast delegate</strong>). Calling it calls them all, in the order they were added:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Action<string> notify = msg => Console.WriteLine("Log: " + msg);
notify += msg => Console.WriteLine("Email: " + msg);
notify += msg => Console.WriteLine("SMS: " + msg);

notify("Server restarted");`,
          output: "Log: Server restarted\nEmail: Server restarted\nSMS: Server restarted"
        },
        {
          type: "text",
          html: "<p>So why not just expose a public delegate field? Because then any outside code could do <code>notify = null;</code> and wipe out every subscriber, or call <code>notify(\"fake news\")</code> and pretend to be the publisher. The <code>event</code> keyword closes those holes. From outside the class, you can only use <code>+=</code> and <code>-=</code>. Anything else gives <strong>CS0070</strong>: <em>The event 'Thermostat.TemperatureChanged' can only appear on the left hand side of += or -= (except when used from within the type 'Thermostat')</em>.</p>"
        },
        {
          type: "text",
          html: "<p>.NET has a standard shape for events: <code>EventHandler&lt;TEventArgs&gt;</code>. Handlers receive two things: <code>sender</code> (the object that raised the event) and an args object with the details. Follow it and every .NET developer will know how to use your class.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var thermostat = new Thermostat();

// Subscribe with a lambda
thermostat.TemperatureChanged += (sender, e) =>
    Console.WriteLine($"Display: {e.NewValue} C");

// Subscribe with a named method
thermostat.TemperatureChanged += WarnIfHot;

thermostat.Temperature = 21;
thermostat.Temperature = 21;    // no change, no event
thermostat.Temperature = 31;

static void WarnIfHot(object? sender, TemperatureEventArgs e)
{
    if (e.NewValue > 30)
        Console.WriteLine($"Warning: up {e.NewValue - e.OldValue}");
}

// 1. The event data
class TemperatureEventArgs : EventArgs
{
    public int OldValue { get; }
    public int NewValue { get; }
    public TemperatureEventArgs(int oldValue, int newValue)
        => (OldValue, NewValue) = (oldValue, newValue);
}

// 2. The publisher
class Thermostat
{
    private int _temperature;

    public event EventHandler<TemperatureEventArgs>?
        TemperatureChanged;

    public int Temperature
    {
        get => _temperature;
        set
        {
            if (value == _temperature) return;
            int old = _temperature;
            _temperature = value;
            OnTemperatureChanged(
                new TemperatureEventArgs(old, value));
        }
    }

    // 3. Raise it safely: ?. skips the call if nobody listens
    protected virtual void OnTemperatureChanged(
        TemperatureEventArgs e)
        => TemperatureChanged?.Invoke(this, e);
}`,
          output: "Display: 21 C\nDisplay: 31 C\nWarning: up 10"
        },
        {
          type: "steps",
          items: [
            "<strong>Define the data.</strong> A class deriving from <code>EventArgs</code> with read-only properties. Name it after the event: <code>TemperatureChanged</code> uses <code>TemperatureEventArgs</code>.",
            "<strong>Declare the event.</strong> <code>public event EventHandler&lt;TemperatureEventArgs&gt;? TemperatureChanged;</code> The <code>?</code> says it is null while nobody has subscribed.",
            "<strong>Raise it</strong> in a <code>protected virtual void OnXxx(...)</code> method using <code>Xxx?.Invoke(this, e)</code>. Derived classes can override <code>OnXxx</code> to react or add behavior.",
            "<strong>Subscribe</strong> from outside with <code>+=</code>, passing a lambda or a method with the signature <code>(object? sender, TemperatureEventArgs e)</code>.",
            "<strong>Unsubscribe</strong> with <code>-=</code> when the subscriber is done."
          ]
        },
        {
          type: "callout",
          tone: "warning",
          title: "Raising an event nobody subscribed to",
          html: "<p>An event with no subscribers is <code>null</code>. Writing <code>TemperatureChanged(this, e)</code> then throws a <code>NullReferenceException</code>. Always raise with <code>?.Invoke</code>. It checks for null and calls in one step, which is also safe if another thread unsubscribes at the same moment.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Unsubscribing.</strong> <code>-=</code> removes a handler only if it is the <em>same</em> delegate. With a named method that is easy. With a lambda, you must keep the lambda in a variable, because writing the same lambda twice creates two different delegates:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var button = new Button();

EventHandler onClick = (s, e) => Console.WriteLine("clicked");
button.Click += onClick;
button.Press();

button.Click -= onClick;            // same delegate: removed
button.Press();                     // prints nothing

button.Click += (s, e) => Console.WriteLine("A");
button.Click -= (s, e) => Console.WriteLine("A");  // new lambda!
button.Press();                     // still prints A

class Button
{
    public event EventHandler? Click;
    public void Press() => Click?.Invoke(this, EventArgs.Empty);
}`,
          output: "clicked\nA"
        },
        {
          type: "callout",
          tone: "tip",
          title: "Subscriptions keep objects alive",
          html: "<p>When a subscriber does <code>publisher.Event += this.Handler</code>, the publisher now holds a reference to the subscriber. If the publisher lives for the whole app (a static service, a main window), the subscriber can never be garbage collected. This is the most common memory leak in desktop apps. Unsubscribe when a short-lived object is done, often in its <code>Dispose</code> method.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p>Python has no built-in event keyword. You would usually keep a list of callbacks and loop over it, or use a library signal. C# events are that pattern built into the language, with the safety rule that only the owner can fire the event or clear the list.</p>"
        }
      ],
      exercises: [
        {
          type: "mcq",
          prompt: "What does the <code>event</code> keyword add on top of a public delegate field?",
          options: [
            "Outside code can only add or remove handlers, not invoke or overwrite the delegate",
            "It makes handlers run on a background thread",
            "It allows more than one handler",
            "It guarantees the event is never null"
          ],
          answer: 0,
          explain: "<p>The <code>event</code> keyword restricts outside code to <code>+=</code> and <code>-=</code>. Handlers still run synchronously on the caller's thread. Plain delegates are already multicast. And an event with no subscribers is still <code>null</code>, which is why you raise it with <code>?.Invoke</code>.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var door = new Door();
EventHandler log = (s, e) => Console.Write("log ");
door.Opened += log;
door.Opened += (s, e) => Console.Write("light ");
door.Open();
Console.WriteLine();

door.Opened -= log;
door.Open();
Console.WriteLine();

class Door
{
    public event EventHandler? Opened;
    public void Open() => Opened?.Invoke(this, EventArgs.Empty);
}`,
          answer: "log light\nlight",
          explain: "<p>Handlers run in the order they were added: <code>log</code>, then <code>light</code>. After <code>-= log</code>, only the lambda that prints <code>light</code> remains. The trailing spaces are trimmed when your answer is checked.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the publisher so it declares and raises the event safely.",
          code: String.raw`class Order
{
    public event ___<OrderEventArgs>? Shipped;

    public void Ship()
    {
        Shipped___(this, new OrderEventArgs());
    }
}

class OrderEventArgs : EventArgs { }`,
          blanks: [["EventHandler"], ["?.Invoke"]],
          explain: "<p><code>EventHandler&lt;T&gt;</code> is the standard event delegate. <code>Shipped?.Invoke(...)</code> raises the event only if someone subscribed. Plain <code>Shipped(this, ...)</code> would throw a <code>NullReferenceException</code> with zero subscribers.</p>"
        },
        {
          type: "bug",
          prompt: "This code is outside the <code>Door</code> class. Why does it not compile?",
          code: String.raw`var door = new Door();
door.Opened += (s, e) => Console.WriteLine("hi");
door.Opened(door, EventArgs.Empty);`,
          options: [
            "Only the class that declares an event can raise it (CS0070)",
            "Lambdas cannot be used as event handlers",
            "EventArgs.Empty is not a valid argument",
            "You must unsubscribe before raising"
          ],
          answer: 0,
          explain: "<p>From outside, an event only supports <code>+=</code> and <code>-=</code>. Raising it is the publisher's job, so the call gives CS0070. Lambdas are normal handlers, and <code>EventArgs.Empty</code> is the standard \"no data\" argument.</p>"
        },
        {
          type: "order",
          prompt: "Order the steps of the standard event pattern from first to last in a typical program.",
          lines: [
            "Define a class that derives from EventArgs",
            "Declare public event EventHandler<T>? in the publisher",
            "Write a protected virtual OnXxx method that calls ?.Invoke",
            "Subscribers attach handlers with +=",
            "The publisher calls OnXxx when something happens",
            "Subscribers detach with -= when done"
          ],
          explain: "<p>Data first, then the event declaration, then the raising method. At runtime, subscribers attach, the publisher fires, and subscribers detach when they no longer care, which prevents leaks.</p>"
        }
      ],
      takeaways: [
        "Events let a publisher announce things without knowing its subscribers.",
        "An event is a multicast delegate that outsiders can only += and -=.",
        "Use EventHandler<TEventArgs> with (object? sender, TEventArgs e).",
        "Raise with ?.Invoke so zero subscribers is not a crash.",
        "Unsubscribe with the same delegate instance, or long-lived publishers leak subscribers."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 5: Extension methods
    // ------------------------------------------------------------------
    {
      id: "m09-l05",
      title: "Extension methods",
      minutes: 20,
      objectives: [
        "Write an extension method with the this modifier",
        "Explain how the compiler turns an extension call into a static call",
        "Write generic extension methods that take delegates",
        "Know the rules and limits: where they live, what they can see, and when not to use them"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Sometimes you want to add a method to a type you do not own: <code>string</code>, <code>int</code>, <code>DateTime</code> or a class from a library. You cannot edit their source. You could write a static helper, <code>StringHelpers.Truncate(title, 10)</code>, but that reads backwards.</p><p>An <strong>extension method</strong> is a static method that you can call as if it were an instance method: <code>title.Truncate(10)</code>.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`string title = "Generics, Delegates and Events";
Console.WriteLine(title.Truncate(15));
Console.WriteLine("short".Truncate(15));
Console.WriteLine("hello world".WordCount());
Console.WriteLine(7.IsBetween(1, 10));

static class StringExtensions
{
    // 'this' on the first parameter makes it an extension
    public static string Truncate(this string text, int max)
        => text.Length <= max ? text : text[..(max - 3)] + "...";

    public static int WordCount(this string text)
        => text.Split(' ', StringSplitOptions.RemoveEmptyEntries)
               .Length;

    public static bool IsBetween(this int value, int lo, int hi)
        => value >= lo && value <= hi;
}`,
          output: "Generics, De...\nshort\n2\nTrue"
        },
        {
          type: "text",
          html: "<p>The rules are short:</p><ul><li>The method is <code>static</code> and lives in a <code>static</code>, non-generic, top-level class. Break this and you get <strong>CS1106</strong>: <em>Extension method must be defined in a non-generic static class</em>.</li><li>The first parameter has the <code>this</code> modifier. Its type is the type being extended.</li><li>The class's namespace must be imported with <code>using</code> where you call it. If the call says <code>'string' does not contain a definition for 'Truncate'</code> (<strong>CS1061</strong>), a missing <code>using</code> is the usual cause.</li></ul>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "It is just a static call",
          html: "<p>The compiler rewrites <code>title.Truncate(15)</code> to <code>StringExtensions.Truncate(title, 15)</code>. Nothing is added to <code>string</code>. That has consequences: an extension method can only see <strong>public</strong> members of the type, it cannot be <code>virtual</code>, and if the type already has an instance method with the same signature, the instance method always wins.</p>"
        },
        {
          type: "text",
          html: "<p>Because it is a static call, an extension method can even run on a <code>null</code> reference without crashing. The built-in <code>string.IsNullOrEmpty</code> is a plain static method, but you could write an extension version:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`string? missing = null;
Console.WriteLine(missing.IsBlank());   // no exception
Console.WriteLine("  ".IsBlank());
Console.WriteLine("hi".IsBlank());

static class NullSafe
{
    public static bool IsBlank(this string? s)
        => string.IsNullOrWhiteSpace(s);
}`,
          output: "True\nTrue\nFalse"
        },
        {
          type: "text",
          html: "<p>Extension methods get really useful when you combine them with generics and delegates. You can extend <em>every</em> sequence at once by extending <code>IEnumerable&lt;T&gt;</code>, the interface that arrays, lists, sets and dictionaries all implement:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int[] numbers = [4, 8, 15, 16, 23, 42];
var words = new List<string> { "cat", "horse", "ox" };

foreach (int n in numbers.Filter(n => n % 2 == 1))
    Console.Write(n + " ");
Console.WriteLine();

Console.WriteLine(words.CountWhere(w => w.Length <= 3));
Console.WriteLine(numbers.Describe());
Console.WriteLine(words.Describe());

static class SequenceExtensions
{
    public static List<T> Filter<T>(this IEnumerable<T> source,
                                    Func<T, bool> keep)
    {
        var result = new List<T>();
        foreach (T item in source)
            if (keep(item)) result.Add(item);
        return result;
    }

    public static int CountWhere<T>(this IEnumerable<T> source,
                                    Func<T, bool> match)
    {
        int count = 0;
        foreach (T item in source)
            if (match(item)) count++;
        return count;
    }

    public static string Describe<T>(this IEnumerable<T> source)
        => "[" + string.Join(", ", source) + "]";
}`,
          output: "15 23 \n2\n[4, 8, 15, 16, 23, 42]\n[cat, horse, ox]"
        },
        {
          type: "callout",
          tone: "note",
          title: "You just built a tiny LINQ",
          html: "<p><code>Filter</code> and <code>CountWhere</code> are home-made versions of LINQ's <code>Where</code> and <code>Count</code>. LINQ, the subject of the next module, is a large set of generic extension methods on <code>IEnumerable&lt;T&gt;</code> that take lambdas. Everything in this module (generics, constraints, delegates, lambdas and extension methods) comes together there.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p>In Python you might monkey-patch a class to bolt on a method. That actually changes the class at runtime and affects all code. A C# extension method changes nothing. It is compile-time sugar that is only visible where its namespace is imported, so it cannot surprise unrelated code.</p>"
        },
        {
          type: "callout",
          tone: "tip",
          title: "When to use them",
          html: "<p>Good uses: small helpers on types you do not own, fluent helpers on interfaces, and keeping a class focused while offering convenience methods elsewhere. Poor uses: logic that needs private state (put it in the class), or extending <code>object</code> so that every IntelliSense list in the project fills up with your helpers.</p>"
        }
      ],
      exercises: [
        {
          type: "fill",
          prompt: "Make <code>Shout</code> an extension method on <code>string</code>.",
          code: String.raw`Console.WriteLine("hi".Shout());

___ class TextExtensions
{
    public static string Shout(___ string s) => s.ToUpper() + "!";
}`,
          blanks: [["static"], ["this"]],
          explain: "<p>Extension methods must live in a <code>static</code> class (otherwise CS1106), and the first parameter needs the <code>this</code> modifier. Without <code>this</code> you get an ordinary static method, and <code>\"hi\".Shout()</code> fails with CS1061.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`Console.WriteLine(5.Times("ab"));
Console.WriteLine(3.Clamp(5, 9));
Console.WriteLine(12.Clamp(5, 9));

static class IntExtensions
{
    public static string Times(this int n, string s)
        => string.Concat(Enumerable.Repeat(s, n));

    public static int Clamp(this int v, int lo, int hi)
        => v < lo ? lo : v > hi ? hi : v;
}`,
          answer: "ababababab\n5\n9",
          explain: "<p><code>5.Times(\"ab\")</code> is really <code>IntExtensions.Times(5, \"ab\")</code>, which repeats <code>ab</code> five times. <code>Clamp</code> keeps a value inside a range: 3 is below 5 so it becomes 5, and 12 is above 9 so it becomes 9.</p>"
        },
        {
          type: "mcq",
          prompt: "A class <code>Report</code> has an instance method <code>Print()</code>. You also write an extension method <code>Print(this Report r)</code>. What does <code>report.Print()</code> call?",
          options: [
            "The instance method; it always wins over an extension",
            "The extension method, because it was written later",
            "Neither; the compiler reports an ambiguity error",
            "Both, one after the other"
          ],
          answer: 0,
          explain: "<p>The compiler looks for instance methods first and only considers extension methods if none fit. Your extension compiles but is silently ignored for that call. The order you wrote them in does not matter, there is no error, and only one method runs.</p>"
        },
        {
          type: "bug",
          prompt: "Why does this not compile?",
          code: String.raw`class Helpers
{
    public static bool IsEven(this int n) => n % 2 == 0;
}`,
          options: [
            "Extension methods must be in a static class (CS1106)",
            "int cannot be extended because it is a struct",
            "The this parameter must be the last parameter",
            "Expression-bodied extension methods are not allowed"
          ],
          answer: 0,
          explain: "<p>The containing class must be <code>static</code> and non-generic. Value types like <code>int</code> can be extended. <code>this</code> goes on the <em>first</em> parameter, and expression bodies are fine.</p>"
        }
      ],
      takeaways: [
        "An extension method is a static method in a static class whose first parameter has this.",
        "obj.Method(x) compiles to StaticClass.Method(obj, x); nothing is added to the type.",
        "They only see public members, and real instance methods always win.",
        "Generic extensions on IEnumerable<T> that take Func delegates are exactly how LINQ works.",
        "Import the namespace with using, or the extension is invisible (CS1061)."
      ]
    }
  ],

  milestone: {
    id: "m09-project",
    title: "Inventory Alerts",
    brief: "<p>A small shop wants a console tool that tracks stock and <strong>reacts</strong> when items run low. When a sale leaves fewer than a threshold of an item, the tool should print an alert and add the item to a reorder list. When an item hits zero, a louder alert fires.</p><p>The key design rule: the <code>Inventory</code> class must not know about the console or the reorder list. It only raises events. Other objects subscribe and decide what to do. That way the shop can later add an email notifier without touching <code>Inventory</code> at all.</p><p>The program reads commands until the user types <code>quit</code> or input ends (Ctrl+Z / Ctrl+D, or a closed pipe).</p>",
    skills: [
      "events with EventHandler<T>",
      "custom EventArgs",
      "lambdas and method group handlers",
      "generic class with a constraint",
      "extension methods",
      "int.TryParse"
    ],
    requirements: [
      "A StockEventArgs class (derived from EventArgs) carries the item name and remaining quantity.",
      "Inventory exposes two events, LowStock and OutOfStock, both of type EventHandler<StockEventArgs>, and raises them with ?.Invoke.",
      "LowStock fires when a sale leaves 1 or more but fewer than the threshold; OutOfStock fires when a sale leaves exactly 0.",
      "Sell refuses (returns false) when the item is unknown or there is not enough stock; nothing is raised in that case.",
      "A ReorderService subscribes to both events with a named method and keeps a list of items to reorder, with no duplicates; restocking removes the item from that list.",
      "A generic AlertLog<T> where T : EventArgs records every event it receives, and the program prints how many alerts were logged at the end.",
      "An extension method on int draws a stock bar, used by the list command (for example 6 -> ######).",
      "The commands sell, restock, list, reorders and quit work (alerts appear while Sell runs, before the \"Sold\" line); bad input prints a helpful message and the loop continues.",
      "When Console.ReadLine returns null, the program prints its summary and exits cleanly."
    ],
    sampleRun: String.raw`Inventory Alerts (low-stock threshold: 5)
Commands: sell <item> <qty>, restock <item> <qty>,
          list, reorders, quit
> list
  apple      12 ############
  banana      6 ######
  cherry     20 ####################
> sell banana 2
  [LOW] banana: only 4 left
Sold 2 banana.
> sell banana 4
  [OUT] banana is out of stock!
Sold 4 banana.
> sell banana 1
Cannot sell 1 banana.
> reorders
To reorder: banana
> restock banana 10
Restocked banana to 10.
> reorders
To reorder: (nothing)
> sell apple x
Quantity must be a positive whole number.
> quit

Session over. 2 alert(s) logged, 0 item(s) to reorder.`,
    starter: String.raw`// Inventory Alerts: starter
var inventory = new Inventory(lowStockThreshold: 5);
var reorders = new ReorderService();
var log = new AlertLog<StockEventArgs>();

// TODO: subscribe console alerts to LowStock and OutOfStock
//       using lambdas that print [LOW] and [OUT] lines.
// TODO: subscribe reorders.OnStockAlert to both events.
// TODO: subscribe log.Record to both events.

inventory.Add("apple", 12);
inventory.Add("banana", 6);
inventory.Add("cherry", 20);

Console.WriteLine("Inventory Alerts (low-stock threshold: 5)");
Console.WriteLine("Commands: sell <item> <qty>, restock <item> <qty>,");
Console.WriteLine("          list, reorders, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;

    string[] parts = line.Split(' ',
        StringSplitOptions.RemoveEmptyEntries);
    if (parts.Length == 0) continue;
    string command = parts[0].ToLowerInvariant();
    if (command == "quit") break;

    // TODO: handle sell, restock, list and reorders.
    //       Validate the quantity with int.TryParse.
    Console.WriteLine("Unknown command.");
}

Console.WriteLine();
Console.WriteLine("Session over.");
// TODO: print the number of alerts logged and items to reorder.

class StockEventArgs : EventArgs
{
    // TODO: Item (string) and Quantity (int) read-only properties
}

class Inventory
{
    private readonly Dictionary<string, int> _stock = new();
    private readonly int _threshold;

    public Inventory(int lowStockThreshold)
        => _threshold = lowStockThreshold;

    // TODO: declare LowStock and OutOfStock events

    public IReadOnlyDictionary<string, int> Stock => _stock;

    public void Add(string item, int quantity)
        => _stock[item] = quantity;

    public bool Sell(string item, int quantity)
    {
        // TODO: refuse unknown items or not enough stock,
        //       subtract, then raise the right event.
        return false;
    }

    public void Restock(string item, int quantity)
    {
        // TODO: add the quantity (new items start at 0)
    }
}

class ReorderService
{
    private readonly List<string> _pending = new();
    public IReadOnlyList<string> Pending => _pending;

    // TODO: OnStockAlert(object? sender, StockEventArgs e)
    // TODO: MarkRestocked(string item)
}

class AlertLog<T> where T : EventArgs
{
    // TODO: keep a List<T>, a Record(object? sender, T e)
    //       method and a Count property.
}

static class DisplayExtensions
{
    // TODO: public static string ToBar(this int quantity)
}`,
    hints: [
      "<p>Start with <code>StockEventArgs</code>: two get-only properties set in a constructor. Then declare the events in <code>Inventory</code>: <code>public event EventHandler&lt;StockEventArgs&gt;? LowStock;</code></p>",
      "<p>In <code>Sell</code>, use <code>_stock.TryGetValue(item, out int have)</code>. Return <code>false</code> if it fails or <code>have &lt; quantity</code>. After subtracting, check <code>left == 0</code> first, then <code>left &lt; _threshold</code>.</p>",
      "<p>The named handler must match <code>EventHandler&lt;StockEventArgs&gt;</code>: <code>public void OnStockAlert(object? sender, StockEventArgs e)</code>. Use <code>if (!_pending.Contains(e.Item))</code> to avoid duplicates.</p>",
      "<p>The extension method is one line: <code>public static string ToBar(this int quantity) =&gt; new string('#', quantity);</code></p>",
      "<p>For the stock list, <code>$\"  {name,-8} {qty,4} {qty.ToBar()}\"</code> lines up the columns. Remember to call <code>reorders.MarkRestocked</code> in the restock command.</p>"
    ],
    solution: String.raw`// Inventory Alerts: solution
var inventory = new Inventory(lowStockThreshold: 5);
var reorders = new ReorderService();
var log = new AlertLog<StockEventArgs>();

inventory.LowStock += (sender, e) =>
    Console.WriteLine($"  [LOW] {e.Item}: only {e.Quantity} left");
inventory.OutOfStock += (sender, e) =>
    Console.WriteLine($"  [OUT] {e.Item} is out of stock!");
inventory.LowStock += reorders.OnStockAlert;
inventory.OutOfStock += reorders.OnStockAlert;
inventory.LowStock += log.Record;
inventory.OutOfStock += log.Record;

inventory.Add("apple", 12);
inventory.Add("banana", 6);
inventory.Add("cherry", 20);

Console.WriteLine("Inventory Alerts (low-stock threshold: 5)");
Console.WriteLine("Commands: sell <item> <qty>, restock <item> <qty>,");
Console.WriteLine("          list, reorders, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;

    string[] parts = line.Split(' ',
        StringSplitOptions.RemoveEmptyEntries);
    if (parts.Length == 0) continue;
    string command = parts[0].ToLowerInvariant();
    if (command == "quit") break;

    switch (command)
    {
        case "list":
            foreach (var (name, qty) in inventory.Stock)
                Console.WriteLine($"  {name,-8} {qty,4} {qty.ToBar()}");
            break;

        case "reorders":
            string items = reorders.Pending.Count == 0
                ? "(nothing)"
                : string.Join(", ", reorders.Pending);
            Console.WriteLine($"To reorder: {items}");
            break;

        case "sell" or "restock":
            if (parts.Length != 3)
            {
                Console.WriteLine($"Usage: {command} <item> <qty>");
                break;
            }
            if (!int.TryParse(parts[2], out int qtyArg)
                || qtyArg <= 0)
            {
                Console.WriteLine(
                    "Quantity must be a positive whole number.");
                break;
            }
            string item = parts[1].ToLowerInvariant();
            if (command == "sell")
            {
                bool ok = inventory.Sell(item, qtyArg);
                Console.WriteLine(ok
                    ? $"Sold {qtyArg} {item}."
                    : $"Cannot sell {qtyArg} {item}.");
            }
            else
            {
                inventory.Restock(item, qtyArg);
                reorders.MarkRestocked(item);
                Console.WriteLine(
                    $"Restocked {item} to {inventory.Stock[item]}.");
            }
            break;

        default:
            Console.WriteLine("Unknown command.");
            break;
    }
}

Console.WriteLine();
Console.WriteLine($"Session over. {log.Count} alert(s) logged, " +
                  $"{reorders.Pending.Count} item(s) to reorder.");

class StockEventArgs : EventArgs
{
    public string Item { get; }
    public int Quantity { get; }
    public StockEventArgs(string item, int quantity)
        => (Item, Quantity) = (item, quantity);
}

class Inventory
{
    private readonly Dictionary<string, int> _stock = new();
    private readonly int _threshold;

    public Inventory(int lowStockThreshold)
        => _threshold = lowStockThreshold;

    public event EventHandler<StockEventArgs>? LowStock;
    public event EventHandler<StockEventArgs>? OutOfStock;

    public IReadOnlyDictionary<string, int> Stock => _stock;

    public void Add(string item, int quantity)
        => _stock[item] = quantity;

    public bool Sell(string item, int quantity)
    {
        if (!_stock.TryGetValue(item, out int have)
            || have < quantity)
            return false;

        int left = have - quantity;
        _stock[item] = left;

        var args = new StockEventArgs(item, left);
        if (left == 0) OutOfStock?.Invoke(this, args);
        else if (left < _threshold) LowStock?.Invoke(this, args);
        return true;
    }

    public void Restock(string item, int quantity)
    {
        _stock.TryGetValue(item, out int have);
        _stock[item] = have + quantity;
    }
}

class ReorderService
{
    private readonly List<string> _pending = new();
    public IReadOnlyList<string> Pending => _pending;

    public void OnStockAlert(object? sender, StockEventArgs e)
    {
        if (!_pending.Contains(e.Item)) _pending.Add(e.Item);
    }

    public void MarkRestocked(string item) => _pending.Remove(item);
}

class AlertLog<T> where T : EventArgs
{
    private readonly List<T> _entries = new();
    public int Count => _entries.Count;
    public void Record(object? sender, T e) => _entries.Add(e);
}

static class DisplayExtensions
{
    public static string ToBar(this int quantity)
        => new string('#', quantity);
}`,
    stretch: [
      "Add a Restocked event and a subscriber that prints how many units arrived.",
      "Let the user change the threshold per item, stored in a second dictionary.",
      "Add an AlertLog<T>.Last(int n) method and a history command that shows the last 3 alerts.",
      "Write a generic extension method Where<T>(this IEnumerable<T>, Func<T, bool>) and use it to list only low items."
    ]
  }
});
