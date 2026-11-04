(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m06",
  number: 6,
  title: "Classes & Objects",
  tagline: "Bundle data and behavior into your own types, and keep them valid.",
  level: "Intermediate",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m06-l01",
      title: "Classes, objects and references",
      minutes: 30,
      objectives: [
        "Declare a class with fields and methods",
        "Create objects with new and call their methods",
        "Explain what a reference is and why two variables can share one object",
        "Recognize NullReferenceException and where it comes from"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Up to now your data has lived in loose variables: a <code>name</code> here, a <code>balance</code> there, a list of scores somewhere else. As programs grow, that falls apart. Which balance belongs to which name? Which methods are allowed to change it?</p><p>A <strong>class</strong> fixes this by bundling related data and the code that works on it into one new type. The class is the <strong>blueprint</strong>. An <strong>object</strong> (also called an <em>instance</em>) is one thing built from that blueprint. One <code>Dog</code> class, many dog objects.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Dog rex = new Dog();      // create an object
rex.Name = "Rex";         // set its fields
rex.Age = 3;

var luna = new Dog();     // a second, separate object
luna.Name = "Luna";
luna.Age = 7;

rex.Bark();
luna.Bark();
Console.WriteLine(luna.HumanYears());

// Type declarations go AFTER top-level statements
class Dog
{
    public string Name = "";   // field: data
    public int Age;            // field, default 0

    public void Bark()         // method: behavior
    {
        Console.WriteLine($"{Name} says woof!");
    }

    public int HumanYears() => Age * 7;
}`,
          output: "Rex says woof!\nLuna says woof!\n49"
        },
        {
          type: "text",
          html: "<p>Read the pieces one at a time:</p><ul><li><strong>Fields</strong> (<code>Name</code>, <code>Age</code>) are variables that live inside each object. Rex and Luna each have their own <code>Age</code>.</li><li><strong>Methods</strong> (<code>Bark</code>, <code>HumanYears</code>) are functions that belong to the class. Inside a method, <code>Name</code> means \"this object's Name\".</li><li><code>new Dog()</code> allocates a fresh object and runs its setup code. Fields you did not initialize get default values, exactly like array slots.</li><li><code>public</code> lets code outside the class use the member. Lesson 4 explains the other choices.</li></ul>"
        },
        {
          type: "callout",
          tone: "warning",
          title: "Where to put the class",
          html: "<p>In a file with top-level statements, classes must come after the statements. If you put <code>class Dog</code> first you get <code>error CS8803: Top-level statements must precede namespace and type declarations.</code> In real projects you will usually give each class its own file, such as <code>Dog.cs</code>, in the same project. The compiler sees every <code>.cs</code> file in the project, so no import is needed.</p>"
        },
        {
          type: "code",
          title: "this and methods that change state",
          code: String.raw`var counter = new ClickCounter();
counter.Click();
counter.Click();
counter.Click();
Console.WriteLine(counter.Report());
counter.Reset();
Console.WriteLine(counter.Report());

class ClickCounter
{
    private int clicks;      // only this class can touch it

    public void Click() => clicks++;
    public void Reset() => this.clicks = 0; // 'this' optional

    public string Report() =>
        $"{clicks} click{(clicks == 1 ? "" : "s")}";
}`,
          output: "3 clicks\n0 clicks"
        },
        {
          type: "text",
          html: "<p>The keyword <code>this</code> means \"the object this method was called on\". You rarely need to type it. It matters when a parameter has the same name as a field, as in <code>this.name = name;</code>, which you will see in constructors in lesson 3.</p><p>Now the most important idea in this module. A class is a <strong>reference type</strong>. Just like the arrays in Module 5, a variable of type <code>Dog</code> does not contain the dog. It contains a reference to a dog object stored on the heap.</p>"
        },
        {
          type: "code",
          title: "Reference semantics",
          code: String.raw`var a = new Box { Value = 1 };
var b = a;            // copy the reference, not the box
b.Value = 99;
Console.WriteLine(a.Value);

var c = new Box { Value = 99 };
Console.WriteLine(a == c);  // different objects
Console.WriteLine(a == b);  // same object

Grow(a);
Console.WriteLine(a.Value);

static void Grow(Box box) => box.Value += 1;

class Box
{
    public int Value;
}`,
          output: "99\nFalse\nTrue\n100"
        },
        {
          type: "callout",
          tone: "deep",
          title: "Stack, heap and the garbage collector",
          html: "<p><code>new Box()</code> creates the object on the <strong>managed heap</strong>. The local variable <code>a</code> holds an address that points there. Assignment and method calls copy the address, so they are cheap no matter how big the object is. For classes, <code>==</code> compares addresses by default: two boxes with equal contents are still two different objects. When no variable refers to an object any more, the <strong>garbage collector</strong> frees it for you. There is no <code>delete</code> in C#.</p>"
        },
        {
          type: "text",
          html: "<p>A reference can also point at nothing: <code>null</code>. Calling a method or reading a field through a null reference crashes with <code>System.NullReferenceException: Object reference not set to an instance of an object.</code> It is the most common run-time error in C#. The compiler helps: with nullable reference types on (the default in new projects), it warns <code>CS8602: Dereference of a possibly null reference</code> when you use a <code>Dog?</code> without checking it. Module 8 goes deeper.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python classes",
          html: "<p>There is no <code>self</code> parameter; <code>this</code> is implicit. Fields are declared in the class body with a type, not created by assigning <code>self.x</code> in <code>__init__</code>. You cannot add a new field to an object at run time: <code>rex.Color = \"brown\"</code> fails with <code>error CS1061: 'Dog' does not contain a definition for 'Color'</code>. That strictness is the point: typos are caught before the program runs.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var p = new Player { Score = 10 };
var q = p;
q.Score += 5;
p = new Player { Score = 1 };
Console.WriteLine($"{p.Score} {q.Score}");

class Player
{
    public int Score;
}`,
          answer: "1 15",
          explain: "<p><code>q = p</code> makes both names refer to the first player, so <code>q.Score += 5</code> makes it 15. Then <code>p</code> is pointed at a brand new player with score 1. That does not affect <code>q</code>, which still refers to the first player.</p>"
        },
        {
          type: "mcq",
          prompt: "What does <code>var d = new Dog();</code> do?",
          options: [
            "Declares a variable but leaves it null until you set its fields",
            "Creates a Dog object on the heap and stores a reference to it in d",
            "Copies the Dog class into d",
            "Creates a Dog only if Dog has a constructor"
          ],
          answer: 1,
          explain: "<p><code>new</code> allocates a new object and runs its setup; <code>d</code> receives a reference to it. The fields get default values. Every class without a written constructor gets a hidden parameterless one, so <code>new Dog()</code> works.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the class so the program prints <code>Hi, I'm Ada</code>.",
          code: String.raw`var p = ___ Person();
p.Name = "Ada";
p.Greet();

___ Person
{
    public string Name = "";
    public void Greet() =>
        Console.WriteLine($"Hi, I'm {Name}");
}`,
          blanks: [["new"], ["class"]],
          explain: "<p>Objects are created with <code>new</code>, and a class is declared with the <code>class</code> keyword. The declaration sits after the top-level statements.</p>"
        },
        {
          type: "bug",
          prompt: "This compiles with a warning and then crashes. Why?",
          code: String.raw`Dog? best = null;
var dogs = new List<Dog>();
foreach (var d in dogs)
    if (best == null || d.Age > best.Age) best = d;
Console.WriteLine(best.Name);

class Dog { public string Name = ""; public int Age; }`,
          options: [
            "foreach cannot loop over a List<Dog>",
            "The list is empty, so best is still null when .Name is read",
            "best == null must be written best.Equals(null)",
            "Dog needs a constructor"
          ],
          answer: 1,
          explain: "<p>With no dogs, the loop body never runs and <code>best</code> stays <code>null</code>. Reading <code>best.Name</code> throws <code>NullReferenceException</code>. The compiler warned you with <code>CS8602</code>. Check for null first, or print a message when the list is empty.</p>"
        },
        {
          type: "mcq",
          prompt: "Two objects of the same class have identical field values. What does <code>x == y</code> return for a normal class?",
          options: [
            "true, because the fields match",
            "false, because == compares references by default",
            "It does not compile for classes",
            "It depends on the field order"
          ],
          answer: 1,
          explain: "<p>For classes, <code>==</code> asks \"same object?\" unless the class redefines it. Two separately created objects are different objects. Records (lesson 5) change this to compare values.</p>"
        }
      ],
      takeaways: [
        "A class is a blueprint; new creates an object from it.",
        "Fields hold each object's data; methods hold behavior.",
        "Class variables hold references: assignment shares one object.",
        "== on classes compares identity unless the type redefines it.",
        "Using a null reference throws NullReferenceException; heed CS8602 warnings."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m06-l02",
      title: "Properties",
      minutes: 30,
      objectives: [
        "Replace public fields with auto-properties",
        "Protect data with private set and validation in a setter",
        "Write computed (read-only) properties",
        "Use init and required for set-once values"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Public fields let anyone write anything. Nothing stops <code>account.Balance = -1_000_000;</code> or <code>person.Age = -5;</code>. A <strong>property</strong> looks like a field to the caller, but behind it are two small methods, <code>get</code> and <code>set</code>, where you decide what is allowed.</p><p>In professional C# code, public data is almost always exposed as properties. Fields are kept <code>private</code>.</p>"
        },
        {
          type: "compare",
          left: {
            label: "Public field: no control",
            code: String.raw`class Product
{
    public string Name = "";
    public decimal Price;
}`
          },
          right: {
            label: "Auto-properties: same use",
            code: String.raw`class Product
{
    public string Name { get; set; } = "";
    public decimal Price { get; set; }
}`
          }
        },
        {
          type: "text",
          html: "<p>An <strong>auto-property</strong> like <code>{ get; set; }</code> makes the compiler create a hidden backing field for you. Callers write <code>p.Price = 9.99m</code> either way. So why bother? Because you can later add validation or change <code>set</code> to <code>private set</code> without changing a single caller, and because data binding, serializers (JSON in Module 11) and many libraries only look at properties.</p>"
        },
        {
          type: "code",
          title: "Read-only from outside: private set",
          code: String.raw`var score = new Scoreboard();
score.AddPoints(10);
score.AddPoints(25);
Console.WriteLine(score.Points);
// score.Points = 1000;  // error CS0272: the set accessor
                         // is inaccessible

class Scoreboard
{
    public int Points { get; private set; }

    public void AddPoints(int amount)
    {
        if (amount > 0) Points += amount;
    }
}`,
          output: "35"
        },
        {
          type: "text",
          html: "<p>When you need checks, write a <strong>full property</strong> with your own private backing field. The setter receives the new value in a hidden parameter named <code>value</code>. If the value is invalid, throw an exception so the bad data never gets in. (Module 8 covers exceptions properly; here the <code>try</code>/<code>catch</code> just shows the message.)</p>"
        },
        {
          type: "code",
          title: "Validation in a setter",
          code: String.raw`var t = new Thermostat();
t.TargetCelsius = 21.5;
Console.WriteLine(t.TargetCelsius);

try
{
    t.TargetCelsius = 95;
}
catch (ArgumentOutOfRangeException ex)
{
    Console.WriteLine("Rejected: " + ex.ParamName);
}
Console.WriteLine(t.TargetCelsius);   // unchanged

class Thermostat
{
    private double target = 20;       // backing field

    public double TargetCelsius
    {
        get => target;
        set
        {
            if (value < 5 || value > 30)
                throw new ArgumentOutOfRangeException(
                    nameof(TargetCelsius), "Must be 5-30");
            target = value;
        }
    }
}`,
          output: "21.5\nRejected: TargetCelsius\n21.5"
        },
        {
          type: "text",
          html: "<p>A <strong>computed property</strong> has only a <code>get</code> and calculates its value from other data every time it is read. Nothing is stored, so it can never be out of date. Write it with <code>=&gt;</code> when the body is one expression.</p>"
        },
        {
          type: "code",
          title: "Computed properties",
          code: String.raw`var r = new Rectangle { Width = 4, Height = 2.5 };
Console.WriteLine(r.Area);
r.Width = 10;                 // Area follows along
Console.WriteLine(r.Area);
Console.WriteLine(r.IsSquare);

var p = new Person { First = "Grace", Last = "Hopper" };
Console.WriteLine(p.FullName);

class Rectangle
{
    public double Width { get; set; }
    public double Height { get; set; }
    public double Area => Width * Height;
    public bool IsSquare => Width == Height;
}

class Person
{
    public string First { get; set; } = "";
    public string Last { get; set; } = "";
    public string FullName => $"{First} {Last}";
}`,
          output: "10\n25\nFalse\nGrace Hopper"
        },
        {
          type: "text",
          html: "<p>Some values should be set once, when the object is created, and never change: an order number, a date of birth. Use <code>init</code> instead of <code>set</code>. The property can be assigned in an object initializer (<code>new X { Id = 5 }</code>) and is read-only after that. Add the <code>required</code> modifier (C# 11) when the caller <em>must</em> provide it.</p>"
        },
        {
          type: "code",
          title: "init and required",
          code: String.raw`var order = new Order { Id = 1042, Customer = "Kim" };
Console.WriteLine($"#{order.Id} for {order.Customer}");
order.Note = "Leave at door";      // normal set: fine
// order.Id = 7;
//   error CS8852: Init-only property 'Order.Id' can only
//   be assigned in an object initializer...
// var bad = new Order { Customer = "Lee" };
//   error CS9035: Required member 'Order.Id' must be set
//   in the object initializer or attribute constructor.

class Order
{
    public required int Id { get; init; }
    public required string Customer { get; init; }
    public string Note { get; set; } = "";
}`,
          output: "#1042 for Kim"
        },
        {
          type: "table",
          headers: ["Declaration", "Outside code can read", "Outside code can write"],
          rows: [
            ["<code>{ get; set; }</code>", "Yes", "Any time"],
            ["<code>{ get; private set; }</code>", "Yes", "Never (class methods can)"],
            ["<code>{ get; init; }</code>", "Yes", "Only while creating the object"],
            ["<code>{ get; }</code>", "Yes", "Never (constructor can)"],
            ["<code>=&gt; expression</code>", "Yes, recomputed each read", "Never"]
          ]
        },
        {
          type: "callout",
          tone: "python",
          title: "Like @property, but built in",
          html: "<p>Python's <code>@property</code> plus <code>@x.setter</code> is the same idea as a C# full property. The difference is culture: in Python you start with a plain attribute and add <code>@property</code> later; in C# you start with an auto-property from day one, because switching a public field to a property later is a breaking change for compiled code that uses it.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var c = new Cart();
c.Add(3);
c.Add(-2);
c.Add(4);
Console.WriteLine($"{c.Items} {c.IsEmpty}");

class Cart
{
    public int Items { get; private set; }
    public bool IsEmpty => Items == 0;
    public void Add(int n)
    {
        if (n > 0) Items += n;
    }
}`,
          answer: "7 False",
          explain: "<p>The <code>-2</code> is ignored by the check in <code>Add</code>, so Items is 3 + 4 = 7. <code>IsEmpty</code> is computed when read, and 7 is not 0.</p>"
        },
        {
          type: "mcq",
          prompt: "Which property can be set in <code>new Ticket { Seat = \"12A\" }</code> but not changed afterwards?",
          options: [
            "public string Seat { get; set; }",
            "public string Seat { get; init; }",
            "public string Seat { get; private set; }",
            "public string Seat => \"12A\";"
          ],
          answer: 1,
          explain: "<p><code>init</code> allows assignment only during object creation. <code>set</code> allows it any time. <code>private set</code> blocks the object initializer too, because the initializer runs outside the class. An expression-bodied property has no setter at all.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the validating property. The setter's incoming value has a fixed name.",
          code: String.raw`class Student
{
    private int age;
    public int Age
    {
        ___ => age;
        set
        {
            if (___ < 0) throw new ArgumentException("age");
            age = ___;
        }
    }
}`,
          blanks: [["get"], ["value"], ["value"]],
          explain: "<p>The getter returns the backing field. Inside <code>set</code>, the new value is always called <code>value</code>; there is no parameter list to rename it.</p>"
        },
        {
          type: "bug",
          prompt: "Reading <code>Balance</code> crashes the program with a StackOverflowException. Which line is the bug?",
          code: String.raw`class Account
{
    private decimal balance;
    public decimal Balance
    {
        get => Balance;
        set => balance = value;
    }
}`,
          options: [
            "private decimal balance; needs an initial value",
            "get => Balance; calls the property itself forever",
            "set => balance = value; should use Balance",
            "decimal cannot be used in properties"
          ],
          answer: 1,
          explain: "<p>The getter returns <code>Balance</code> (capital B), which is the property, which calls the getter again, and so on until the stack overflows. It must return the field <code>balance</code>. Changing the setter to use <code>Balance</code> would cause the same infinite loop on writes.</p>"
        }
      ],
      takeaways: [
        "Expose data through properties; keep fields private.",
        "private set lets the class change a value that callers can only read.",
        "Validate in the setter and throw so bad data never gets stored.",
        "Computed properties (=>) are always up to date and store nothing.",
        "init allows set-once values; required forces callers to provide them."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m06-l03",
      title: "Constructors and object initializers",
      minutes: 30,
      objectives: [
        "Write constructors that make objects valid from the start",
        "Overload and chain constructors with this(...)",
        "Use C# 12 primary constructors and know their limits",
        "Combine constructors with object initializers"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>A <strong>constructor</strong> is a special method that runs when you write <code>new</code>. It has the same name as the class and no return type. Its job is to make sure every object starts life in a valid state. If a <code>BankAccount</code> must always have an owner, the constructor demands one, and it becomes impossible to create an account without it.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var acct = new BankAccount("Priya", 50m);
Console.WriteLine($"{acct.Owner}: {acct.Balance}");
// var empty = new BankAccount();
//   error CS7036: There is no argument given that
//   corresponds to the required parameter 'owner'...

class BankAccount
{
    public string Owner { get; }       // get-only
    public decimal Balance { get; private set; }

    public BankAccount(string owner, decimal opening)
    {
        if (string.IsNullOrWhiteSpace(owner))
            throw new ArgumentException("Owner required");
        Owner = owner;      // get-only: settable only here
        Balance = opening;
    }
}`,
          output: "Priya: 50"
        },
        {
          type: "callout",
          tone: "note",
          title: "The disappearing default constructor",
          html: "<p>A class with no constructor gets a free, hidden one with no parameters. The moment you write <em>any</em> constructor, that free one is gone. That is why <code>new BankAccount()</code> now fails with <code>CS7036</code>. This is usually what you want. If you also need a parameterless version, write it yourself.</p>"
        },
        {
          type: "text",
          html: "<p>Like methods, constructors can be <strong>overloaded</strong>. To avoid copying the same setup code into each one, <strong>chain</strong> them: <code>: this(...)</code> after the parameter list calls another constructor of the same class first. Put all the real work in the most complete constructor and let the others forward to it.</p>"
        },
        {
          type: "code",
          title: "Overloading and chaining",
          code: String.raw`var a = new Pizza();
var b = new Pizza("large");
var c = new Pizza("small", "olives");
Console.WriteLine(a);
Console.WriteLine(b);
Console.WriteLine(c);

class Pizza
{
    public string Size { get; }
    public string Topping { get; }

    public Pizza() : this("medium") { }
    public Pizza(string size) : this(size, "cheese") { }

    public Pizza(string size, string topping)
    {
        Console.WriteLine($"  (building {size})");
        Size = size;
        Topping = topping;
    }

    public override string ToString() =>
        $"{Size} {Topping} pizza";
}`,
          output: "  (building medium)\n  (building large)\n  (building small)\nmedium cheese pizza\nlarge cheese pizza\nsmall olives pizza"
        },
        {
          type: "callout",
          tone: "tip",
          title: "ToString is worth overriding",
          html: "<p><code>Console.WriteLine(obj)</code> calls <code>obj.ToString()</code>. By default that prints the type name, which is useless. Overriding it as above makes logging and debugging far nicer. You will learn what <code>override</code> means in Module 7; for now, copy the line exactly. Optional parameters (<code>string topping = \"cheese\"</code>) are another way to get the same effect with one constructor.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Object initializers</strong> set properties right after the constructor runs: <code>new Pizza(\"large\") { ... }</code>. The constructor handles what is required; the initializer handles optional extras. The order is always: field initializers, then the constructor body, then the initializer assignments.</p>"
        },
        {
          type: "code",
          title: "Order of execution",
          code: String.raw`var w = new Widget("gear") { Color = "red" };
Console.WriteLine($"{w.Name} {w.Color}");

class Widget
{
    private string log = Note("field initializer");
    public string Name { get; }
    public string Color { get; set; } = "grey";

    public Widget(string name)
    {
        Note("constructor body, Color=" + Color);
        Name = name;
    }

    static string Note(string s)
    {
        Console.WriteLine(s);
        return s;
    }
}`,
          output: "field initializer\nconstructor body, Color=grey\ngear red"
        },
        {
          type: "text",
          html: "<p>C# 12 added <strong>primary constructors</strong> for classes. You put the parameters right after the class name, and they are in scope everywhere in the class body. This removes a lot of boilerplate for classes that just store what they were given.</p>"
        },
        {
          type: "code",
          title: "Primary constructors (C# 12)",
          code: String.raw`var e = new Employee("Sam", 52_000m);
Console.WriteLine(e.Name);
Console.WriteLine(e.MonthlyPay());
e.GiveRaise(0.10m);
Console.WriteLine(e.MonthlyPay());

class Employee(string name, decimal salary)
{
    public string Name { get; } = name;   // copy into property

    public decimal MonthlyPay() => Math.Round(salary / 12, 2);

    public void GiveRaise(decimal percent) =>
        salary += salary * percent;     // parameter is mutable
}`,
          output: "Sam\n4333.33\n4766.67"
        },
        {
          type: "callout",
          tone: "warning",
          title: "Primary constructor parameters are not properties",
          html: "<p>In a class, <code>salary</code> above is a captured parameter. Outside code cannot read <code>e.salary</code> (<code>error CS1061</code>), and it is not read-only: any method can change it. If you want a public value, copy it into a property as with <code>Name</code>. If you want an immutable data holder where the parameters <em>become</em> public properties automatically, use a <code>record</code> (lesson 5). Any extra constructor you write must chain to the primary one with <code>: this(...)</code>.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Compared with __init__",
          html: "<p><code>__init__</code> runs after Python has created the object; a C# constructor plays the same role. Python has one <code>__init__</code> with default arguments, while C# also allows several constructors that chain. Python keyword arguments look like C# object initializers, but initializers set properties, not parameters, and only after the constructor finishes.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var t = new Tea("green") { Sugar = 2 };
Console.WriteLine(t);

class Tea
{
    public string Kind { get; }
    public int Sugar { get; set; } = 1;
    public Tea(string kind)
    {
        Kind = kind;
        Sugar = Sugar + 10;
    }
    public override string ToString() => $"{Kind}:{Sugar}";
}`,
          answer: "green:2",
          explain: "<p>The property initializer sets Sugar to 1, then the constructor makes it 11, then the object initializer runs last and sets it to 2. The initializer always wins because it runs after the constructor.</p>"
        },
        {
          type: "fill",
          prompt: "Make the one-parameter constructor reuse the two-parameter one.",
          code: String.raw`class Temperature
{
    public double Value { get; }
    public string Unit { get; }

    public Temperature(double value) ___ ___(value, "C") { }

    public Temperature(double value, string unit)
    {
        Value = value;
        Unit = unit;
    }
}`,
          blanks: [[":"], ["this"]],
          explain: "<p>Constructor chaining is written <code>: this(arguments)</code> between the parameter list and the body. The chained constructor runs first, then the (here empty) body.</p>"
        },
        {
          type: "mcq",
          prompt: "Given <code>class Point(int x, int y) { }</code>, what is true?",
          options: [
            "Callers can read p.x and p.y",
            "x and y are usable inside the class, but are not public properties",
            "x and y are read-only fields",
            "The class still has a parameterless constructor"
          ],
          answer: 1,
          explain: "<p>Primary constructor parameters on a class are captured for use in the body only. They are not public, not properties, and not read-only. Declaring a primary constructor also means every <code>new Point(...)</code> must supply x and y.</p>"
        },
        {
          type: "bug",
          prompt: "Why does <code>new Ticket()</code> fail to compile here?",
          code: String.raw`var t = new Ticket();

class Ticket
{
    public string Event { get; }
    public Ticket(string ev) { Event = ev; }
}`,
          options: [
            "Event is a reserved word",
            "Writing any constructor removes the default parameterless one",
            "Get-only properties cannot be set in a constructor",
            "Classes need a public field"
          ],
          answer: 1,
          explain: "<p>Once a class declares a constructor, the compiler stops generating the parameterless one, so the call gives <code>CS7036</code>. Get-only properties <em>can</em> be set in a constructor; that is exactly where they are meant to be set.</p>"
        },
        {
          type: "order",
          prompt: "Put these in the order they run for <code>new Widget(\"x\") { Color = \"red\" }</code>.",
          lines: [
            "Field and property initializers (= values in declarations)",
            "Any chained constructor called with : this(...)",
            "The body of the constructor you called",
            "Object initializer assignments like Color = \"red\""
          ],
          explain: "<p>Initializers in declarations run first, then the chained constructor's body, then the called constructor's body, and finally the object initializer. That is why the object initializer always has the last word.</p>"
        }
      ],
      takeaways: [
        "Constructors make objects valid from the start; they have the class name and no return type.",
        "Writing any constructor removes the free parameterless one.",
        "Chain overloads with : this(...) so setup lives in one place.",
        "Object initializers run after the constructor and are ideal for optional values.",
        "C# 12 primary constructor parameters are captured variables, not public properties."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m06-l04",
      title: "Static members, access and encapsulation",
      minutes: 30,
      objectives: [
        "Tell instance members from static members",
        "Use static fields for shared data like ID counters",
        "Choose the right access modifier",
        "Design a class that protects its own rules (encapsulation)"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Everything so far belonged to one object: each dog has its own <code>Name</code>. A <strong>static</strong> member belongs to the class itself. There is exactly one copy, shared by all objects, and you reach it through the class name, not through an object. You have used static members since day one: <code>Console.WriteLine</code>, <code>Math.Max</code>, <code>int.Parse</code>.</p>"
        },
        {
          type: "code",
          title: "A shared ID counter",
          code: String.raw`var a = new Ticket("Concert");
var b = new Ticket("Theatre");
var c = new Ticket("Museum");
Console.WriteLine($"{a.Id} {b.Id} {c.Id}");
Console.WriteLine(Ticket.IssuedCount);   // via class name
Console.WriteLine(Ticket.Describe(b));

class Ticket
{
    private static int nextId = 100;     // one, shared
    public static int IssuedCount { get; private set; }

    public int Id { get; }               // one per object
    public string Event { get; }

    public Ticket(string ev)
    {
        Id = nextId++;
        Event = ev;
        IssuedCount++;
    }

    public static string Describe(Ticket t) =>
        $"Ticket {t.Id} for {t.Event}";
}`,
          output: "100 101 102\n3\nTicket 101 for Theatre"
        },
        {
          type: "callout",
          tone: "warning",
          title: "CS0120: static code cannot see instance members",
          html: "<p>A static method has no object, so it has no <code>this</code>. Inside <code>Describe</code>, writing just <code>Id</code> fails with <code>error CS0120: An object reference is required for the non-static field, method, or property 'Ticket.Id'</code>. Pass an object in (as above) or make the method an instance method. The reverse is fine: instance methods can use static members freely.</p>"
        },
        {
          type: "text",
          html: "<p>A <strong>static class</strong> cannot be instantiated and contains only static members. Use it for groups of helper functions that need no state, like <code>Math</code> or <code>File</code>. Use <code>const</code> for values fixed at compile time and <code>readonly</code> for fields that are set once, in a declaration or constructor, and never again.</p>"
        },
        {
          type: "code",
          title: "Static class, const and readonly",
          code: String.raw`Console.WriteLine(Units.ToFahrenheit(100));
Console.WriteLine(Units.ToKm(26.2));
// new Units();  // error CS0712: Cannot create an
                 // instance of the static class 'Units'

var log = new AuditLog("orders");
Console.WriteLine(log.Name);

static class Units
{
    public const double KmPerMile = 1.609344;
    public static double ToFahrenheit(double c) => c * 9 / 5 + 32;
    public static double ToKm(double miles) =>
        Math.Round(miles * KmPerMile, 1);
}

class AuditLog(string name)
{
    public readonly string Name = name.ToUpper();
    // A method writing Name = "x" gives error CS0191.
}`,
          output: "212\n42.2\nORDERS"
        },
        {
          type: "table",
          headers: ["Modifier", "Who can use the member"],
          rows: [
            ["<code>public</code>", "Any code"],
            ["<code>private</code>", "Only code inside the same class (the default for members)"],
            ["<code>protected</code>", "The class and classes that inherit from it (Module 7)"],
            ["<code>internal</code>", "Any code in the same project/assembly (the default for top-level classes)"],
            ["<code>protected internal</code>", "Same assembly, or derived classes anywhere"],
            ["<code>private protected</code>", "Derived classes in the same assembly"]
          ]
        },
        {
          type: "text",
          html: "<p>Using something you cannot access gives <code>error CS0122: 'Account.balance' is inaccessible due to its protection level</code>. That error is your friend. <strong>Encapsulation</strong> means the class hides its data and exposes only safe operations, so its rules (its <em>invariants</em>) cannot be broken from outside. A good habit: start every member as <code>private</code> and open it up only when you have a reason.</p>"
        },
        {
          type: "compare",
          left: {
            label: "Leaky: callers can bypass the rules",
            code: String.raw`class Playlist
{
    public List<string> Songs = new();
    public int MaxSongs = 3;
}
// Anyone can do:
// p.Songs.Add("4th song");
// p.Songs.Clear();
// p.MaxSongs = -1;`
          },
          right: {
            label: "Encapsulated: the class enforces them",
            code: String.raw`class Playlist
{
    private readonly List<string> songs = new();
    public const int MaxSongs = 3;

    public IReadOnlyList<string> Songs => songs;

    public bool Add(string song)
    {
        if (songs.Count >= MaxSongs) return false;
        songs.Add(song);
        return true;
    }
}`
          }
        },
        {
          type: "code",
          title: "Using the encapsulated Playlist",
          code: String.raw`var p = new Playlist();
foreach (var s in new[] { "Intro", "Waves", "Glow", "Echo" })
    Console.WriteLine($"{s}: {(p.Add(s) ? "added" : "full")}");
Console.WriteLine(string.Join(", ", p.Songs));
// p.Songs.Add("x");  // error CS1061: IReadOnlyList<string>
                      // has no Add

class Playlist
{
    private readonly List<string> songs = new();
    public const int MaxSongs = 3;

    public IReadOnlyList<string> Songs => songs;

    public bool Add(string song)
    {
        if (songs.Count >= MaxSongs) return false;
        songs.Add(song);
        return true;
    }
}`,
          output: "Intro: added\nWaves: added\nGlow: added\nEcho: full\nIntro, Waves, Glow"
        },
        {
          type: "callout",
          tone: "python",
          title: "Enforced, not a convention",
          html: "<p>Python marks private things with a leading underscore and trusts you. C# enforces <code>private</code> at compile time. Many C# teams still name private fields <code>_balance</code> so they stand out from locals and parameters; the official .NET style uses <code>_camelCase</code> for private fields and <code>PascalCase</code> for everything public.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var a = new Robot();
var b = new Robot();
var c = new Robot();
Console.WriteLine($"{b.Serial} {Robot.Built}");

class Robot
{
    public static int Built;
    public int Serial { get; }
    public Robot()
    {
        Built++;
        Serial = Built * 10;
    }
}`,
          answer: "20 3",
          explain: "<p><code>Built</code> is static, so all robots share one counter. When <code>b</code> is built the counter becomes 2, so its serial is 20. After all three, <code>Built</code> is 3. Each robot keeps its own <code>Serial</code>.</p>"
        },
        {
          type: "mcq",
          prompt: "Inside a <code>static</code> method of class <code>Car</code>, you write <code>Speed++</code> where <code>Speed</code> is an instance property. What happens?",
          options: [
            "It increments Speed on every Car",
            "It increments Speed on the most recently created Car",
            "Compile error CS0120: an object reference is required",
            "It compiles but throws NullReferenceException"
          ],
          answer: 2,
          explain: "<p>A static method has no <code>this</code>, so there is no object whose Speed could be changed. The compiler stops you with CS0120. There is no \"current\" or \"every\" object behind the scenes.</p>"
        },
        {
          type: "fill",
          prompt: "Make the counter shared by all instances and readable but not writable from outside.",
          code: String.raw`class Session
{
    public ___ int Open { get; ___ set; }
    public Session() => Open++;
}`,
          blanks: [["static"], ["private"]],
          explain: "<p><code>static</code> makes one shared value; <code>private set</code> lets only the class change it. Outside code reads <code>Session.Open</code>.</p>"
        },
        {
          type: "bug",
          prompt: "The class promises a balance is never negative. Which member breaks that promise?",
          code: String.raw`class Wallet
{
    private decimal cash;
    public decimal Cash => cash;
    public List<decimal> History { get; } = new();
    public decimal Limit { get; set; } = 500;
    public bool Spend(decimal amt)
    {
        if (amt <= 0 || amt > cash) return false;
        cash -= amt;
        History.Add(-amt);
        return true;
    }
}`,
          options: [
            "Cash, because it is computed",
            "Spend, because it returns bool",
            "None of them can make cash negative",
            "private decimal cash, because it is private"
          ],
          answer: 2,
          explain: "<p>Only <code>Spend</code> writes <code>cash</code>, and it refuses amounts larger than the balance. <code>Cash</code> is read-only. The class does have other leaks worth fixing: <code>History</code> exposes a mutable list (callers can add fake entries) and <code>Limit</code> is settable by anyone, but neither can change <code>cash</code>.</p>"
        }
      ],
      takeaways: [
        "static members belong to the class: one shared copy, accessed by class name.",
        "Static code cannot touch instance members without an object (CS0120).",
        "Members are private by default; open them up only on purpose.",
        "Encapsulate: hide fields, expose operations that keep the rules, return IReadOnlyList.",
        "const is a compile-time constant; readonly is set once at construction."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m06-l05",
      title: "Structs, records and enums",
      minutes: 32,
      objectives: [
        "Explain value types vs reference types with structs and classes",
        "Create records and use value equality and with-expressions",
        "Define enums and switch on them",
        "Parse enum values safely from text"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Classes are not the only way to make your own type. C# gives you three more tools, each with a specific purpose:</p><ul><li>A <strong>struct</strong> is a <em>value type</em>: the variable holds the data itself, and assignment copies it.</li><li>A <strong>record</strong> is a type for data where two objects with equal values should count as equal.</li><li>An <strong>enum</strong> is a named set of choices, like days of the week or order statuses.</li></ul>"
        },
        {
          type: "code",
          title: "struct copies, class shares",
          code: String.raw`var s1 = new PointS { X = 1 };
var s2 = s1;          // copies the whole struct
s2.X = 50;

var c1 = new PointC { X = 1 };
var c2 = c1;          // copies the reference
c2.X = 50;

Console.WriteLine($"struct: {s1.X} {s2.X}");
Console.WriteLine($"class:  {c1.X} {c2.X}");

struct PointS { public int X; }
class PointC { public int X; }`,
          output: "struct: 1 50\nclass:  50 50"
        },
        {
          type: "text",
          html: "<p>You already know value types: <code>int</code>, <code>double</code>, <code>bool</code>, <code>decimal</code> and <code>DateTime</code> are all structs. That is why <code>int b = a; b++;</code> never changes <code>a</code>. A struct never needs <code>new</code> on the heap, can never be <code>null</code> (unless you write <code>PointS?</code>), and gets compared field by field by <code>Equals</code>.</p>"
        },
        {
          type: "table",
          headers: ["", "class", "struct"],
          rows: [
            ["Kind", "Reference type", "Value type"],
            ["Assignment copies", "The reference", "All the data"],
            ["Can be null", "Yes", "No (unless <code>T?</code>)"],
            ["Inheritance", "Yes", "No"],
            ["Use for", "Most things, especially with identity or behavior", "Small, immutable values: a coordinate, a money amount, a color"]
          ]
        },
        {
          type: "callout",
          tone: "warning",
          title: "Mutable structs bite",
          html: "<p>Because structs are copied, changing one you got from a list or a property changes only a copy. The compiler blocks the obvious case: <code>points[0].X = 5;</code> on a <code>List&lt;PointS&gt;</code> gives <code>error CS1612: Cannot modify the return value of 'List&lt;PointS&gt;.this[int]' because it is not a variable</code>. The professional rule: make structs immutable with <code>readonly struct</code>, and default to classes when unsure.</p>"
        },
        {
          type: "text",
          html: "<p>A <strong>record</strong> is a class (or struct, with <code>record struct</code>) that the compiler fills with useful code for data: properties from the parameter list, value-based <code>==</code> and <code>Equals</code>, a readable <code>ToString</code>, and support for <code>with</code> to make a modified copy. Records are ideal for results, messages and other data that should not change.</p>"
        },
        {
          type: "code",
          title: "Records (intro)",
          code: String.raw`var a = new Money(9.99m, "EUR");
var b = new Money(9.99m, "EUR");
Console.WriteLine(a);              // nice ToString
Console.WriteLine(a == b);         // compares values
Console.WriteLine(a.Amount);       // generated property

var c = a with { Amount = 20m };   // copy with a change
Console.WriteLine(c);
Console.WriteLine(a);              // original unchanged
// a.Amount = 1;  // error CS8852: init-only property

record Money(decimal Amount, string Currency);`,
          output: "Money { Amount = 9.99, Currency = EUR }\nTrue\n9.99\nMoney { Amount = 20, Currency = EUR }\nMoney { Amount = 9.99, Currency = EUR }"
        },
        {
          type: "callout",
          tone: "note",
          title: "Record parameters vs class primary constructors",
          html: "<p><code>record Money(decimal Amount, string Currency);</code> and <code>class Money(decimal amount, string currency)</code> look alike but behave differently. In a record, each parameter becomes a public <code>{ get; init; }</code> property. In a class, the parameters stay private captured variables (lesson 3). Module 13 covers records in depth.</p>"
        },
        {
          type: "text",
          html: "<p>An <strong>enum</strong> gives names to a fixed set of options. Instead of passing magic strings like <code>\"shipped\"</code> (easy to misspell) or numbers like <code>2</code> (what does 2 mean?), you write <code>OrderStatus.Shipped</code>, and the compiler checks it. Under the hood each name is an <code>int</code>, starting at 0 unless you choose values.</p>"
        },
        {
          type: "code",
          title: "Enums",
          code: String.raw`var status = OrderStatus.Shipped;
Console.WriteLine(status);           // name
Console.WriteLine((int)status);      // underlying number

string message = status switch
{
    OrderStatus.Pending => "We got your order",
    OrderStatus.Shipped => "On its way",
    OrderStatus.Delivered => "Enjoy!",
    _ => "Unknown"
};
Console.WriteLine(message);

if (Enum.TryParse("delivered", ignoreCase: true,
        out OrderStatus parsed))
    Console.WriteLine($"Parsed: {parsed}");

foreach (OrderStatus s in Enum.GetValues<OrderStatus>())
    Console.Write($"{s}={(int)s} ");
Console.WriteLine();

enum OrderStatus { Pending, Shipped, Delivered, Cancelled = 9 }`,
          output: "Shipped\n1\nOn its way\nParsed: Delivered\nPending=0 Shipped=1 Delivered=2 Cancelled=9 "
        },
        {
          type: "callout",
          tone: "deep",
          title: "Enums are just numbers",
          html: "<p><code>(OrderStatus)42</code> compiles and runs. The value prints as <code>42</code> because there is no matching name. <code>Enum.TryParse(\"42\", out OrderStatus s)</code> also succeeds. When enum values come from users or files, check them with <code>Enum.IsDefined(s)</code>. That is also why the switch above keeps a <code>_</code> arm: the compiler warns <code>CS8524</code> if an enum switch expression has no default, since unnamed values are possible.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Python equivalents",
          html: "<p><code>@dataclass(frozen=True)</code> is close to a C# <code>record</code>. Python's <code>enum.Enum</code> matches a C# <code>enum</code>, except C# enum values are plain integers with no extra data. Python has no struct; every Python object is a reference.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var p = new Pos(1, 2);
var q = p with { Y = 5 };
var r = new Pos(1, 5);
Console.WriteLine(q);
Console.WriteLine(q == r);
Console.WriteLine(p.Y);

record Pos(int X, int Y);`,
          answer: "Pos { X = 1, Y = 5 }\nTrue\n2",
          explain: "<p><code>with</code> makes a new record with Y changed. Records compare by value, so <code>q</code> and <code>r</code> (both 1, 5) are equal even though they are different objects. The original <code>p</code> is untouched.</p>"
        },
        {
          type: "output",
          prompt: "Predict the output.",
          code: String.raw`var a = new Counter { N = 1 };
var b = a;
b.N++;
var list = new List<Counter> { a };
var copy = list[0];
copy.N = 100;
Console.WriteLine($"{a.N} {b.N} {list[0].N}");

struct Counter { public int N; }`,
          answer: "1 2 1",
          explain: "<p><code>Counter</code> is a struct, so every assignment copies. <code>b</code> is a copy of <code>a</code>, so only <code>b</code> becomes 2. Adding <code>a</code> to the list stores another copy, and <code>copy</code> is yet another copy, so setting it to 100 changes neither the list nor <code>a</code>.</p>"
        },
        {
          type: "fill",
          prompt: "Declare an enum and use it.",
          code: String.raw`var light = TrafficLight.___;
Console.WriteLine(light == TrafficLight.Red);

___ TrafficLight { Red, Amber, Green }`,
          blanks: [["Red"], ["enum"]],
          explain: "<p>Enum members are accessed with the type name and a dot: <code>TrafficLight.Red</code>. The type is declared with the <code>enum</code> keyword, followed by a comma-separated list of names.</p>"
        },
        {
          type: "mcq",
          prompt: "You need a type for 2D screen coordinates used millions of times per second in a game. Two coordinates with the same X and Y are interchangeable. Best choice?",
          options: [
            "A class with public X and Y fields",
            "A readonly struct (or readonly record struct) with X and Y",
            "An enum",
            "A Dictionary<string, int> with keys \"X\" and \"Y\""
          ],
          answer: 1,
          explain: "<p>Small, immutable, value-like data is the textbook case for a struct: no heap allocation per point and copy semantics that match \"interchangeable values\". A class would allocate millions of objects for the garbage collector. An enum holds names, not coordinates. A dictionary is slow and loses type safety.</p>"
        },
        {
          type: "bug",
          prompt: "A record is used as a lookup key, but the second lookup unexpectedly works. Which statement explains it?",
          code: String.raw`var prices = new Dictionary<Sku, decimal>();
prices[new Sku("A-1")] = 4.50m;
Console.WriteLine(prices[new Sku("A-1")]);

record Sku(string Code);`,
          options: [
            "It is not a bug: records compare and hash by value, so a new Sku(\"A-1\") finds the same entry",
            "It throws KeyNotFoundException because the objects are different",
            "Records cannot be dictionary keys",
            "It only works because strings are interned"
          ],
          answer: 0,
          explain: "<p>Records generate <code>Equals</code> and <code>GetHashCode</code> from their values, so any <code>Sku</code> with code <code>A-1</code> is the same key. This prints 4.50. With a plain class it would throw <code>KeyNotFoundException</code>, because class keys compare by reference.</p>"
        }
      ],
      takeaways: [
        "struct = value type, copied on assignment; class = reference type, shared.",
        "Use structs only for small, immutable values; default to classes.",
        "Records give value equality, readable ToString and with-expressions.",
        "Enums name a fixed set of int values; switch on them and keep a default arm.",
        "Validate parsed enums with Enum.IsDefined."
      ]
    }
  ],
  // --------------------------------------------------------------------
  milestone: {
    id: "m06-project",
    title: "Bank Account Manager",
    brief: "<p>A small credit union wants a console tool for tellers. Tellers open accounts, make deposits and withdrawals, move money between accounts, and print an account statement. The rules must be impossible to break from outside the account class: no negative balances, no zero or negative amounts, and every change recorded in a history.</p><p>Design it with what you learned in this module: a <code>BankAccount</code> class with a private balance and a static account-number counter, a <code>Transaction</code> record, a <code>TransactionType</code> enum, and a <code>Bank</code> class that stores accounts in a <code>Dictionary</code>. The command loop must stop cleanly when input ends.</p>",
    skills: ["classes and encapsulation", "properties with private set", "constructors", "static members", "records", "enums", "Dictionary<int, BankAccount>"],
    requirements: [
      "open NAME [AMOUNT] creates an account with an automatically assigned number starting at 1001 and an optional opening deposit.",
      "BankAccount exposes Balance with a public get and no public setter; it can only change through Deposit and Withdraw.",
      "Deposit and Withdraw reject amounts of zero or less, and Withdraw rejects amounts larger than the balance; both report success or failure without crashing.",
      "Every successful change adds a Transaction record (type, amount, balance after) to a history exposed as IReadOnlyList.",
      "TransactionType is an enum with at least Deposit, Withdrawal, TransferIn and TransferOut.",
      "transfer FROM TO AMOUNT moves money only if the withdrawal succeeds, recording TransferOut and TransferIn.",
      "show NUMBER prints the owner, balance and full history; list prints every account.",
      "Invalid numbers, unknown accounts and unknown commands print a message; the loop ends on quit or when ReadLine returns null."
    ],
    sampleRun: "Bank Account Manager. Commands: open, deposit, withdraw,\ntransfer, show, list, quit\n> open Priya 100\nOpened account 1001 for Priya.\n> open Tom\nOpened account 1002 for Tom.\n> withdraw 1002 20\nFailed: insufficient funds.\n> transfer 1001 1002 35.50\nTransferred 35.50 from 1001 to 1002.\n> deposit 1002 10\nOK. Balance 45.50\n> show 1001\n1001 Priya  balance 64.50\n  Deposit         100.00  ->  100.00\n  TransferOut      35.50  ->   64.50\n> list\n1001 Priya  balance 64.50\n1002 Tom  balance 45.50\n> quit\nGoodbye.",
    starter: String.raw`// Bank Account Manager - Module 6 milestone
var bank = new Bank();
Console.WriteLine("Bank Account Manager. Commands: open, deposit, " +
    "withdraw,\ntransfer, show, list, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;
    string[] p = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
    if (p.Length == 0) continue;
    if (p[0] == "quit") break;

    switch (p[0])
    {
        case "open" when p.Length >= 2:
            // TODO: parse the optional amount, call bank.Open
            Console.WriteLine("open: not implemented yet");
            break;
        // TODO: deposit, withdraw, transfer, show, list
        default:
            Console.WriteLine("Unknown or incomplete command.");
            break;
    }
}
Console.WriteLine("Goodbye.");

enum TransactionType { Deposit, Withdrawal }   // TODO: add more

record Transaction(TransactionType Type, decimal Amount,
    decimal BalanceAfter);

class BankAccount
{
    // TODO: static counter so numbers start at 1001
    private readonly List<Transaction> history = new();

    public int Number { get; }
    public string Owner { get; }
    public decimal Balance { get; private set; }
    public IReadOnlyList<Transaction> History => history;

    public BankAccount(string owner)
    {
        Owner = owner;
        // TODO: assign Number from the static counter
    }

    public bool Deposit(decimal amount,
        TransactionType type = TransactionType.Deposit)
    {
        // TODO: reject amount <= 0, update Balance, record it
        return false;
    }

    // TODO: Withdraw, returning false with a reason on failure
}

class Bank
{
    private readonly Dictionary<int, BankAccount> accounts = new();

    public BankAccount Open(string owner)
    {
        var account = new BankAccount(owner);
        accounts[account.Number] = account;
        return account;
    }

    // TODO: Find(int number), Transfer(...), All accounts
}`,
    hints: [
      "<p>Give <code>BankAccount</code> a <code>private static int nextNumber = 1001;</code> and assign <code>Number = nextNumber++;</code> in the constructor. Each new account gets the next number, and no caller can tamper with the counter.</p>",
      "<p>Write <code>Withdraw</code> as <code>public bool Withdraw(decimal amount, out string error, TransactionType type = TransactionType.Withdrawal)</code>. Set <code>error</code> to a reason like <code>\"insufficient funds\"</code> before returning false, and to <code>\"\"</code> on success. It is the Try pattern from Module 4.</p>",
      "<p>A helper on <code>Bank</code> such as <code>public BankAccount? Find(int number) =&gt; accounts.GetValueOrDefault(number);</code> keeps lookups short. In the command loop, parse with <code>int.TryParse</code> and <code>decimal.TryParse</code>, then check the account is not null.</p>",
      "<p>For <code>Transfer</code>, withdraw from the source first with type <code>TransferOut</code>. Only if that succeeds, deposit into the target with type <code>TransferIn</code>. Also refuse a transfer to the same account.</p>",
      "<p>Format money with <code>{amount:F2}</code> and line up the statement with alignment, for example <code>{t.Type,-12} {t.Amount,9:F2}</code>.</p>"
    ],
    solution: String.raw`// Bank Account Manager - Module 6 milestone (solution)
var bank = new Bank();
Console.WriteLine("Bank Account Manager. Commands: open, deposit, " +
    "withdraw,\ntransfer, show, list, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;
    string[] p = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
    if (p.Length == 0) continue;
    if (p[0] == "quit") break;

    switch (p[0])
    {
        case "open" when p.Length >= 2:
            decimal opening = 0;
            if (p.Length >= 3 && !decimal.TryParse(p[2], out opening))
            {
                Console.WriteLine("Invalid amount.");
                break;
            }
            var acct = bank.Open(p[1]);
            if (opening > 0) acct.Deposit(opening);
            Console.WriteLine(
                $"Opened account {acct.Number} for {acct.Owner}.");
            break;
        case "deposit" or "withdraw" when p.Length == 3:
            var a = Lookup(p[1]);
            if (a is null || !TryAmount(p[2], out decimal amt)) break;
            string error = "";
            bool ok = p[0] == "deposit"
                ? a.Deposit(amt)
                : a.Withdraw(amt, out error);
            Console.WriteLine(ok ? $"OK. Balance {a.Balance:F2}"
                : $"Failed: {(error == "" ? "invalid amount" : error)}.");
            break;
        case "transfer" when p.Length == 4:
            var from = Lookup(p[1]);
            var to = Lookup(p[2]);
            if (from is null || to is null) break;
            if (!TryAmount(p[3], out decimal t)) break;
            Console.WriteLine(bank.Transfer(from, to, t, out string why)
                ? $"Transferred {t:F2} from {from.Number} to {to.Number}."
                : $"Failed: {why}.");
            break;
        case "show" when p.Length == 2:
            var s = Lookup(p[1]);
            if (s is null) break;
            Console.WriteLine(s);
            foreach (var tr in s.History)
                Console.WriteLine($"  {tr.Type,-12} {tr.Amount,9:F2}" +
                    $"  -> {tr.BalanceAfter,7:F2}");
            break;
        case "list":
            foreach (var acc in bank.All) Console.WriteLine(acc);
            break;
        default:
            Console.WriteLine("Unknown or incomplete command.");
            break;
    }
}
Console.WriteLine("Goodbye.");

BankAccount? Lookup(string text)
{
    BankAccount? found = int.TryParse(text, out int n)
        ? bank.Find(n) : null;
    if (found is null) Console.WriteLine($"No account '{text}'.");
    return found;
}

static bool TryAmount(string text, out decimal amount)
{
    bool ok = decimal.TryParse(text, out amount);
    if (!ok) Console.WriteLine($"'{text}' is not an amount.");
    return ok;
}

enum TransactionType { Deposit, Withdrawal, TransferIn, TransferOut }

record Transaction(TransactionType Type, decimal Amount,
    decimal BalanceAfter);

class BankAccount
{
    private static int nextNumber = 1001;
    private readonly List<Transaction> history = new();

    public int Number { get; }
    public string Owner { get; }
    public decimal Balance { get; private set; }
    public IReadOnlyList<Transaction> History => history;

    public BankAccount(string owner)
    {
        Owner = owner;
        Number = nextNumber++;
    }

    public bool Deposit(decimal amount,
        TransactionType type = TransactionType.Deposit)
    {
        if (amount <= 0) return false;
        Balance += amount;
        history.Add(new Transaction(type, amount, Balance));
        return true;
    }

    public bool Withdraw(decimal amount, out string error,
        TransactionType type = TransactionType.Withdrawal)
    {
        error = amount <= 0 ? "amount must be positive"
            : amount > Balance ? "insufficient funds" : "";
        if (error != "") return false;
        Balance -= amount;
        history.Add(new Transaction(type, amount, Balance));
        return true;
    }

    public override string ToString() =>
        $"{Number} {Owner}  balance {Balance:F2}";
}

class Bank
{
    private readonly Dictionary<int, BankAccount> accounts = new();

    public IEnumerable<BankAccount> All => accounts.Values;

    public BankAccount Open(string owner)
    {
        var account = new BankAccount(owner);
        accounts[account.Number] = account;
        return account;
    }

    public BankAccount? Find(int number) =>
        accounts.GetValueOrDefault(number);

    public bool Transfer(BankAccount from, BankAccount to,
        decimal amount, out string error)
    {
        if (from == to)
        {
            error = "same account";
            return false;
        }
        if (!from.Withdraw(amount, out error,
                TransactionType.TransferOut))
            return false;
        to.Deposit(amount, TransactionType.TransferIn);
        return true;
    }
}`,
    stretch: [
      "Add a SavingsAccount option with a monthly interest command that deposits Balance * rate, recorded as a new TransactionType.Interest.",
      "Add a daily withdrawal limit stored as a const and enforced inside Withdraw.",
      "Add a close NUMBER command that only works when the balance is zero.",
      "Make Transaction a readonly record struct and explain in a comment why that is a reasonable choice."
    ]
  }
});
