(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m07",
  number: 7,
  title: "Inheritance & Interfaces",
  tagline: "Share behavior between types, swap implementations, and let objects speak for themselves.",
  level: "Intermediate",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m07-l01",
      title: "Inheritance basics",
      minutes: 18,
      objectives: [
        "Derive a class from a base class with the : syntax",
        "Call a base constructor with base(...)",
        "Use protected to share members with derived classes only",
        "Explain the order in which constructors run"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Many types in a program are related. A dog is an animal. A savings account is a bank account. A car is a vehicle. When one type is a more specific version of another, you can say so in code with <strong>inheritance</strong>.</p>
<p>The general type is the <strong>base class</strong> (also called parent or superclass). The specific type is the <strong>derived class</strong> (child or subclass). The derived class gets every member of the base class for free, then adds its own.</p>
<p>Read <code>class Dog : Animal</code> out loud as "Dog is an Animal". That sentence is the test for inheritance. If it sounds wrong, inheritance is probably the wrong tool.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var rex = new Dog();
rex.Name = "Rex";
rex.Eat();    // inherited from Animal
rex.Bark();   // declared in Dog

class Animal
{
    public string Name { get; set; } = "";

    public void Eat()
    {
        Console.WriteLine($"{Name} is eating.");
    }
}

class Dog : Animal
{
    public void Bark()
    {
        Console.WriteLine($"{Name} says woof!");
    }
}`,
          output: `Rex is eating.
Rex says woof!`
        },
        {
          type: "text",
          html: `<p>A few rules about what gets inherited:</p>
<ul>
<li>Fields, properties, methods and events are inherited. <strong>Constructors are not.</strong> Each class declares its own.</li>
<li><code>private</code> members of the base class still exist inside the derived object, but the derived class's code cannot touch them.</li>
<li>A class can have <strong>only one</strong> base class. <code>class C : A, B</code> where both are classes fails with <code>error CS1721: Class 'C' cannot have multiple base classes</code>. (You can implement many interfaces, which is lesson 4.)</li>
<li>If you write no base class, the class derives from <code>object</code> (<code>System.Object</code>). Every type in .NET ends up there, which is why every object has <code>ToString()</code>.</li>
</ul>`
        },
        {
          type: "text",
          html: `<p>When the base class has a constructor with parameters, the derived constructor must pass values up to it. You do that with <code>: base(...)</code> after the constructor's parameter list. The base constructor always runs <strong>first</strong>, so the base part of the object is ready before the derived constructor body uses it.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var car = new Car("Toyota", 5);
Console.WriteLine(car.Describe());

class Vehicle
{
    public string Make { get; }

    public Vehicle(string make)
    {
        Make = make;
        Console.WriteLine("Vehicle constructor");
    }
}

class Car : Vehicle
{
    public int Seats { get; }

    public Car(string make, int seats) : base(make)
    {
        Seats = seats;
        Console.WriteLine("Car constructor");
    }

    public string Describe() => $"{Make} with {Seats} seats";
}`,
          output: `Vehicle constructor
Car constructor
Toyota with 5 seats`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Forgetting base(...)",
          html: `<p>If you leave out <code>: base(make)</code>, C# tries to call a parameterless <code>Vehicle()</code> constructor. There is none, so you get:</p>
<p><code>error CS7036: There is no argument given that corresponds to the required parameter 'make' of 'Vehicle.Vehicle(string)'</code></p>
<p>The fix is always the same: chain to a base constructor that exists and pass it what it needs.</p>`
        },
        {
          type: "text",
          html: `<p>Sometimes a derived class needs to read or change base data that outsiders should not see. <code>private</code> is too strict (the derived class cannot see it) and <code>public</code> is too loose (everyone can). <code>protected</code> sits in between: visible inside the class and inside any class derived from it.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var savings = new SavingsAccount(100m);
savings.AddInterest(0.05m);
Console.WriteLine(savings.Balance);
// savings.balance = 1_000_000m;  // error CS0122: inaccessible

class Account
{
    protected decimal balance;

    public Account(decimal opening) => balance = opening;

    public decimal Balance => balance;
}

class SavingsAccount : Account
{
    public SavingsAccount(decimal opening) : base(opening) { }

    public void AddInterest(decimal rate)
    {
        balance += balance * rate;   // allowed: protected
    }
}`,
          output: `105.00`
        },
        {
          type: "table",
          headers: ["Modifier", "Same class", "Derived class", "Other code in the project"],
          rows: [
            ["<code>public</code>", "yes", "yes", "yes"],
            ["<code>protected</code>", "yes", "yes", "no"],
            ["<code>internal</code>", "yes", "yes, if same project", "yes, if same project"],
            ["<code>private</code>", "yes", "no", "no"]
          ]
        },
        {
          type: "callout",
          tone: "tip",
          title: "How professionals use protected",
          html: `<p>Protected fields couple derived classes tightly to base internals. Many teams keep fields <code>private</code> and expose a <code>protected</code> method or property instead, such as <code>protected void Deposit(decimal amount)</code>. Then the base class can still validate every change.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p>Python writes <code>class Dog(Animal):</code> and calls <code>super().__init__(name)</code> inside <code>__init__</code>. C# puts the base after a colon (<code>class Dog : Animal</code>) and chains with <code>: base(name)</code> before the constructor body runs.</p>
<p>Python allows multiple base classes and treats <code>_name</code> as protected by convention only. C# allows one base class and the compiler enforces <code>protected</code> and <code>private</code>.</p>`
        },
        {
          type: "callout",
          tone: "deep",
          title: "One object, several layers",
          html: `<p><code>new Car(...)</code> creates a single object on the heap. It contains the fields of <code>object</code>, then <code>Vehicle</code>, then <code>Car</code>. Construction walks the chain from the top: <code>object</code>'s constructor, then <code>Vehicle</code>'s, then <code>Car</code>'s body. That is why base data is always initialized before derived code reads it.</p>`
        }
      ],
      exercises: [
        {
          type: "mcq",
          prompt: `<p>Which sentence best describes <code>class Manager : Employee</code>?</p>`,
          options: [
            "A Manager is an Employee, and it inherits Employee's members",
            "An Employee is a Manager",
            "Manager contains a field of type Employee",
            "Manager and Employee share one object at runtime"
          ],
          answer: 0,
          explain: `<p>The colon declares inheritance: <code>Manager</code> is a more specific kind of <code>Employee</code>. The reverse is not true (not every employee manages). Holding an <code>Employee</code> field is composition, a different relationship covered in lesson 6. Each <code>new Manager()</code> is its own object.</p>`
        },
        {
          type: "output",
          prompt: `<p>What does this program print?</p>`,
          code: String.raw`new C();

class A
{
    public A() => Console.WriteLine("A");
}

class B : A
{
    public B() => Console.WriteLine("B");
}

class C : B
{
    public C() => Console.WriteLine("C");
}`,
          answer: `A
B
C`,
          explain: `<p>Base constructors run first, starting at the top of the chain. Creating a <code>C</code> runs <code>A</code>'s constructor, then <code>B</code>'s, then <code>C</code>'s body. Even without an explicit <code>: base()</code>, C# calls the parameterless base constructor for you.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the derived class so <code>Cat</code> inherits from <code>Animal</code> and passes <code>name</code> to <code>Animal</code>'s constructor.</p>`,
          code: String.raw`class Animal
{
    public string Name { get; }
    public Animal(string name) => Name = name;
}

class Cat ___ Animal
{
    public Cat(string name) : ___(name) { }
}`,
          blanks: [[":"], ["base"]],
          explain: `<p>The colon after the class name names the base class. <code>: base(name)</code> after a constructor's parameter list chains to the base constructor. Python's <code>super</code> is not a C# keyword, and <code>this(...)</code> would chain to another constructor of the same class.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This code does not compile. Why?</p>`,
          code: String.raw`class Shape
{
    private string color = "red";
}

class Square : Shape
{
    public void Paint() => Console.WriteLine(color);
}`,
          options: [
            "color is private, so Square cannot access it (CS0122); make it protected",
            "Square must declare its own color field first",
            "Shape needs a constructor for inheritance to work",
            "Console.WriteLine cannot print fields"
          ],
          answer: 0,
          explain: `<p>Private members exist inside the <code>Square</code> object, but only <code>Shape</code>'s own code can use them. The compiler reports <code>CS0122: 'Shape.color' is inaccessible due to its protection level</code>. Changing it to <code>protected</code> (or exposing a protected property) fixes it. A class without a constructor gets a default one, so that is not the problem.</p>`
        },
        {
          type: "order",
          prompt: `<p>Put these steps in the order they happen when <code>var car = new Car("VW", 4);</code> runs.</p>`,
          lines: [
            "Memory for one Car object (with Vehicle's fields inside) is allocated",
            "Car's constructor is called with \"VW\" and 4",
            ": base(make) hands \"VW\" to Vehicle's constructor",
            "Vehicle's constructor body runs and sets Make",
            "Car's constructor body runs and sets Seats",
            "The reference to the new object is stored in car"
          ],
          explain: `<p>Allocation comes first, then the constructor chain. The arguments arrive at <code>Car</code>'s constructor, but <code>: base(...)</code> runs before <code>Car</code>'s body, so <code>Vehicle</code> finishes first. Only when every constructor is done does <code>car</code> receive the reference.</p>`
        }
      ],
      takeaways: [
        "class Derived : Base means Derived is a Base and inherits its members.",
        "C# classes have exactly one base class; everything ends at object.",
        "Constructors are not inherited; chain to one with : base(...).",
        "Base constructors run before derived constructor bodies.",
        "protected members are visible to derived classes but not to outside code."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m07-l02",
      title: "Virtual, override and polymorphism",
      minutes: 20,
      objectives: [
        "Mark methods virtual and override them in derived classes",
        "Explain polymorphism using static type versus runtime type",
        "Extend base behavior with base.Method()",
        "Know what sealed and new do, and why new is rarely wanted"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Inheritance lets a derived class <em>add</em> members. Often you also want it to <em>change</em> behavior it inherited. A dog and a cat both "speak", but differently. You want to call <code>Speak()</code> on any animal and get the right sound without checking what kind of animal it is.</p>
<p>That is <strong>polymorphism</strong> ("many shapes"): one call, different behavior depending on the actual object. In C# you opt in with two keywords. The base class marks a method <code>virtual</code> (allowed to be replaced). The derived class marks its version <code>override</code>.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Animal[] zoo = [new Dog("Rex"), new Cat("Tom"), new Animal("Blob")];

foreach (Animal a in zoo)
{
    a.Speak();
}

class Animal
{
    public string Name { get; }
    public Animal(string name) => Name = name;

    public virtual void Speak()
    {
        Console.WriteLine($"{Name} makes a sound.");
    }
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }

    public override void Speak()
    {
        Console.WriteLine($"{Name} says woof.");
    }
}

class Cat : Animal
{
    public Cat(string name) : base(name) { }

    public override void Speak()
    {
        Console.WriteLine($"{Name} says meow.");
    }
}`,
          output: `Rex says woof.
Tom says meow.
Blob makes a sound.`
        },
        {
          type: "text",
          html: `<p>Look at the loop variable: <code>Animal a</code>. Every variable has two types to think about:</p>
<ul>
<li>The <strong>static type</strong> is the declared type, <code>Animal</code>. The compiler uses it to decide which members you may call.</li>
<li>The <strong>runtime type</strong> is the type of the object actually stored, <code>Dog</code> or <code>Cat</code>. For a <code>virtual</code> method, the runtime decides which version runs based on this.</li>
</ul>
<p>This is what makes polymorphism useful. The loop above never changes when you add a <code>Cow</code> class. You write the new class with its own override and every existing loop picks it up.</p>`
        },
        {
          type: "callout",
          tone: "deep",
          title: "How the runtime picks the method",
          html: `<p>Each class has a hidden table of its virtual methods (a <em>vtable</em>). An <code>override</code> replaces the base entry in the derived class's table. A virtual call looks up the slot in the object's own table, which costs one extra memory read. Non-virtual calls skip this and can be inlined by the JIT, which is one reason C# methods are non-virtual by default.</p>`
        },
        {
          type: "text",
          html: `<p>An override can still use the base version. Call <code>base.MethodName()</code> inside it. This is the normal way to <em>extend</em> behavior instead of replacing it completely.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Report report = new SalesReport();
report.Print();

class Report
{
    public virtual void Print()
    {
        Console.WriteLine("== Company Report ==");
    }
}

class SalesReport : Report
{
    public override void Print()
    {
        base.Print();   // run the shared header first
        Console.WriteLine("Sales this month: 42 units");
    }
}`,
          output: `== Company Report ==
Sales this month: 42 units`
        },
        {
          type: "text",
          html: `<p>Rules the compiler enforces:</p>
<ul>
<li>You can only override a member marked <code>virtual</code>, <code>abstract</code> or <code>override</code> in the base. Otherwise: <code>error CS0506: cannot override inherited member 'Animal.Eat()' because it is not marked virtual, abstract, or override</code>.</li>
<li>The override must have the same name, parameters, return type and accessibility.</li>
<li>Properties can be virtual too: <code>public virtual string Label =&gt; "item";</code> and <code>public override string Label =&gt; "book";</code>.</li>
</ul>`
        },
        {
          type: "text",
          html: `<p>What if a derived class declares a method with the same name as a <em>non-virtual</em> base method? That is <strong>hiding</strong>, and you mark it with <code>new</code>. A hidden method is chosen by the <em>static</em> type, not the runtime type. Compare the two calls below.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Base b = new Derived();
b.Hello();   // non-virtual: static type Base decides
b.Greet();   // virtual: runtime type Derived decides

class Base
{
    public void Hello() => Console.WriteLine("Base.Hello");
    public virtual void Greet() => Console.WriteLine("Base.Greet");
}

class Derived : Base
{
    public new void Hello() => Console.WriteLine("Derived.Hello");
    public override void Greet() => Console.WriteLine("Derived.Greet");
}`,
          output: `Base.Hello
Derived.Greet`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Accidental hiding",
          html: `<p>If you forget both <code>new</code> and <code>override</code>, the code compiles with a warning:</p>
<p><code>warning CS0114: 'Dog.Speak()' hides inherited member 'Animal.Speak()'. To make the current member override that implementation, add the override keyword. Otherwise add the new keyword.</code></p>
<p>Polymorphism then silently stops working: calls through an <code>Animal</code> variable run the base version. Treat CS0114 and CS0108 as bugs. Hiding with <code>new</code> is a rare tool, mostly used when a base class you do not control adds a member that clashes with yours.</p>`
        },
        {
          type: "text",
          html: `<p><code>sealed</code> closes things off. A <code>sealed class</code> cannot be inherited from (<code>error CS0509: cannot derive from sealed type</code>). <code>string</code> is sealed, for example. A <code>sealed override</code> method stops further overriding down the chain. Professionals seal classes that were not designed for inheritance, because every virtual member is a promise you must keep working for subclasses you have never seen.</p>`
        },
        {
          type: "code",
          title: "Sealing",
          code: String.raw`class Animal
{
    public virtual void Speak() => Console.WriteLine("...");
}

class Dog : Animal
{
    // Subclasses of Dog cannot override Speak again.
    public sealed override void Speak() => Console.WriteLine("Woof");
}

sealed class Puppy : Dog
{
    // public override void Speak() { }  // error CS0239
}

// class RoboPuppy : Puppy { }           // error CS0509`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p>In Python every method can be overridden, and <code>obj.speak()</code> always finds the most derived version. C# turns that around: methods are <strong>non-virtual by default</strong>. You must write <code>virtual</code> in the base and <code>override</code> in the child. It is more typing, but the base class author decides exactly which extension points exist, and typos in override names become compile errors instead of silent new methods.</p>`
        },
        {
          type: "table",
          headers: ["Keyword", "Where", "Meaning"],
          rows: [
            ["<code>virtual</code>", "base", "Derived classes may replace this member"],
            ["<code>override</code>", "derived", "Replace the base version; chosen by runtime type"],
            ["<code>base.M()</code>", "derived", "Call the base version from inside an override"],
            ["<code>sealed</code>", "class or override", "No further inheritance or overriding"],
            ["<code>new</code>", "derived", "Hide a base member; chosen by static type"]
          ]
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>Predict the output. Watch which methods are virtual.</p>`,
          code: String.raw`Printer p = new ColorPrinter();
ColorPrinter c = new ColorPrinter();
p.Name();
p.Print();
c.Name();

class Printer
{
    public void Name() => Console.WriteLine("Printer");
    public virtual void Print() => Console.WriteLine("Black ink");
}

class ColorPrinter : Printer
{
    public new void Name() => Console.WriteLine("ColorPrinter");
    public override void Print() => Console.WriteLine("Color ink");
}`,
          answer: `Printer
Color ink
ColorPrinter`,
          explain: `<p><code>Name</code> is hidden with <code>new</code>, so the static type picks it: <code>p</code> is declared <code>Printer</code> and prints "Printer", while <code>c</code> is declared <code>ColorPrinter</code>. <code>Print</code> is virtual, so the runtime type (<code>ColorPrinter</code>) wins even through <code>p</code>.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>A derived class writes <code>public override void Eat()</code> and gets <code>error CS0506</code>. What is the most likely cause?</p>`,
          options: [
            "The base class's Eat() is not marked virtual (or abstract)",
            "The derived class forgot to call base.Eat()",
            "Override methods must return a value",
            "The derived class must also be marked virtual"
          ],
          answer: 0,
          explain: `<p>CS0506 means the base member is not overridable. Add <code>virtual</code> to the base method if you own it. Calling <code>base.Eat()</code> is optional. Overrides can return <code>void</code>, and classes are never marked <code>virtual</code>.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Make <code>Describe</code> replaceable in <code>Product</code> and replace it in <code>Book</code>, reusing the base text.</p>`,
          code: String.raw`class Product
{
    public string Name { get; init; } = "";
    public ___ string Describe() => $"Product: {Name}";
}

class Book : Product
{
    public ___ string Describe()
        => ___.Describe() + " (book)";
}`,
          blanks: [["virtual"], ["override"], ["base"]],
          explain: `<p>The base method needs <code>virtual</code>, the derived one <code>override</code>, and <code>base.Describe()</code> calls the original. Using <code>new</code> instead of <code>override</code> would compile but break polymorphism: a <code>Product</code> variable holding a <code>Book</code> would run the base version.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This program crashes with a <code>StackOverflowException</code> when <code>Print</code> is called on a <code>LoudLogger</code>. Why?</p>`,
          code: String.raw`class Logger
{
    public virtual void Print(string msg) => Console.WriteLine(msg);
}

class LoudLogger : Logger
{
    public override void Print(string msg)
    {
        Print(msg.ToUpper());
    }
}`,
          options: [
            "Print(...) inside the override calls itself forever; it should be base.Print(...)",
            "ToUpper() allocates too much memory",
            "Overrides cannot take parameters",
            "Logger.Print must be sealed"
          ],
          answer: 0,
          explain: `<p>Inside <code>LoudLogger</code>, a plain <code>Print(...)</code> call is a virtual call on <code>this</code>, which is a <code>LoudLogger</code>. It calls the override again, with no end, until the call stack runs out. <code>base.Print(...)</code> explicitly targets the parent's version.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Why might a library author mark a class <code>sealed</code>?</p>`,
          options: [
            "The class was not designed for inheritance, and sealing prevents fragile subclasses",
            "Sealed classes cannot be instantiated",
            "Sealed classes cannot have methods",
            "It makes every method virtual"
          ],
          answer: 0,
          explain: `<p>Sealing says "do not derive from this". You can still create instances and call methods. Designing for inheritance is real work (every virtual member is a public promise), so sealing classes that were not designed for it is a common professional default.</p>`
        }
      ],
      takeaways: [
        "virtual in the base plus override in the derived class gives polymorphism.",
        "Virtual calls use the runtime type; non-virtual calls use the static type.",
        "base.Method() runs the parent's version from inside an override.",
        "Warnings CS0114 and CS0108 usually mean a missing override: fix them.",
        "sealed stops inheritance or further overriding."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m07-l03",
      title: "Abstract classes",
      minutes: 16,
      objectives: [
        "Declare abstract classes and abstract members",
        "Recognize errors CS0144 and CS0534",
        "Mix concrete and abstract members in one base class",
        "Apply the template method pattern"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Some base classes describe an idea that is too general to exist on its own. What is the area of "a shape"? You cannot answer until you know if it is a circle or a rectangle. Writing a <code>virtual double Area() =&gt; 0;</code> would be a lie that bugs hide behind.</p>
<p>Mark such a class <code>abstract</code>. An abstract class <strong>cannot be instantiated</strong>. It can declare <strong>abstract members</strong>: members with no body that every non-abstract derived class <strong>must</strong> override.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Shape[] shapes = [new Circle(1), new Rectangle(3, 4), new Circle(2.5)];

foreach (Shape s in shapes)
{
    Console.WriteLine($"{s.Name,-10}{s.Area(),8:F2}");
}

abstract class Shape
{
    public abstract string Name { get; }
    public abstract double Area();
}

class Circle : Shape
{
    private readonly double radius;
    public Circle(double radius) => this.radius = radius;

    public override string Name => "Circle";
    public override double Area() => Math.PI * radius * radius;
}

class Rectangle : Shape
{
    private readonly double width, height;

    public Rectangle(double width, double height)
    {
        this.width = width;
        this.height = height;
    }

    public override string Name => "Rectangle";
    public override double Area() => width * height;
}`,
          output: `Circle        3.14
Rectangle    12.00
Circle       19.63`
        },
        {
          type: "callout",
          tone: "warning",
          title: "The two errors you will meet",
          html: `<p><code>var s = new Shape();</code> fails with <code>error CS0144: Cannot create an instance of the abstract type or interface 'Shape'</code>.</p>
<p>A derived class that forgets an abstract member fails with <code>error CS0534: 'Circle' does not implement inherited abstract member 'Shape.Area()'</code>. This is the point of abstract members: the compiler will not let you forget.</p>`
        },
        {
          type: "text",
          html: `<p>An abstract class is still a normal class in every other way. It can have fields, constructors, regular methods, virtual methods and abstract methods all together. That makes it a good home for shared code plus "fill in the blank" slots.</p>
<p>A classic use is the <strong>template method pattern</strong>. The base class writes the overall algorithm once, as a non-virtual method. The steps that vary are abstract (must fill in) or virtual (may change).</p>`
        },
        {
          type: "code",
          title: "Template method",
          code: String.raw`string[] items = ["apples", "pears"];

new PlainReport().Print(items);
new NumberedReport().Print(items);

abstract class ReportBase
{
    // The template: fixed order, variable steps.
    public void Print(string[] items)
    {
        Console.WriteLine(Header());
        for (int i = 0; i < items.Length; i++)
        {
            Console.WriteLine(FormatLine(i, items[i]));
        }
        Console.WriteLine(Footer());
    }

    protected abstract string Header();
    protected abstract string FormatLine(int index, string item);
    protected virtual string Footer() => "---";
}

class PlainReport : ReportBase
{
    protected override string Header() => "Items:";
    protected override string FormatLine(int index, string item)
        => "- " + item;
}

class NumberedReport : ReportBase
{
    protected override string Header() => "Numbered items:";
    protected override string FormatLine(int index, string item)
        => $"{index + 1}. {item}";
    protected override string Footer() => "(end of list)";
}`,
          output: `Items:
- apples
- pears
---
Numbered items:
1. apples
2. pears
(end of list)`
        },
        {
          type: "text",
          html: `<p>Notice the choices in <code>ReportBase</code>. <code>Print</code> is not virtual, so subclasses cannot reorder the steps. <code>Header</code> and <code>FormatLine</code> are abstract because there is no sensible default. <code>Footer</code> is virtual with a default, so subclasses override it only if they care. The steps are <code>protected</code> because callers should use <code>Print</code>, not the pieces.</p>`
        },
        {
          type: "table",
          headers: ["Member kind", "Has a body?", "Derived class must override?", "Derived class may override?"],
          rows: [
            ["regular", "yes", "no", "no (only hide with <code>new</code>)"],
            ["<code>virtual</code>", "yes", "no", "yes"],
            ["<code>abstract</code>", "no", "yes (unless the derived class is abstract too)", "yes"]
          ]
        },
        {
          type: "code",
          title: "Constructors in abstract classes",
          code: String.raw`abstract class Employee
{
    public string Name { get; }

    // protected: only derived classes can call it anyway.
    protected Employee(string name) => Name = name;

    public abstract decimal MonthlyPay();

    public string PaySlip() => $"{Name}: {MonthlyPay():F2}";
}

class Salaried : Employee
{
    private readonly decimal yearly;

    public Salaried(string name, decimal yearly) : base(name)
        => this.yearly = yearly;

    public override decimal MonthlyPay() => yearly / 12;
}`
        },
        {
          type: "callout",
          tone: "tip",
          title: "Make abstract constructors protected",
          html: `<p>Nobody can call <code>new Employee(...)</code> anyway, so a <code>public</code> constructor on an abstract class is misleading. Code analyzers (rule CA1012) suggest <code>protected</code>. It documents that the constructor exists only for derived classes to chain to.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p>Python uses <code>class Shape(ABC):</code> with <code>@abstractmethod</code>. Forgetting to implement one raises <code>TypeError</code> when you try to create the object, at runtime. In C#, the same mistake is a compile error (CS0534), so it never reaches a user.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`Beverage tea = new Tea();
tea.Make();

abstract class Beverage
{
    public void Make()
    {
        Boil();
        Brew();
        Console.WriteLine("Pour into cup");
    }

    private void Boil() => Console.WriteLine("Boil water");
    protected abstract void Brew();
}

class Tea : Beverage
{
    protected override void Brew()
        => Console.WriteLine("Steep tea bag");
}`,
          answer: `Boil water
Steep tea bag
Pour into cup`,
          explain: `<p>The template method <code>Make</code> fixes the order. <code>Boil</code> is the base's private step, <code>Brew</code> is filled in by <code>Tea</code>, and the last line comes from the base again. Creating <code>new Tea()</code> is fine because <code>Tea</code> itself is not abstract.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Given <code>abstract class Shape</code> and <code>class Circle : Shape</code> (which implements everything), which line does <strong>not</strong> compile?</p>`,
          options: [
            "<code>Shape s = new Shape();</code>",
            "<code>Shape s = new Circle(2);</code>",
            "<code>Shape[] all = [new Circle(1)];</code>",
            "<code>Circle c = new Circle(3);</code>"
          ],
          answer: 0,
          explain: `<p>You cannot create an instance of an abstract type (CS0144). You can still use <code>Shape</code> as a variable, array or parameter type and store concrete derived objects in it. That is exactly how abstract classes are meant to be used.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the code: <code>Employee</code> cannot be created directly, every employee type must define <code>MonthlyPay</code>, and <code>Contractor</code> provides it.</p>`,
          code: String.raw`public ___ class Employee
{
    public ___ decimal MonthlyPay();
}

public class Contractor : Employee
{
    public decimal Hours { get; init; }
    public decimal Rate { get; init; }

    public ___ decimal MonthlyPay() => Hours * Rate;
}`,
          blanks: [["abstract"], ["abstract"], ["override"]],
          explain: `<p>An abstract class may contain abstract members, which have no body and end with a semicolon. Implementations use <code>override</code>. <code>virtual</code> would not work for the base member because a virtual method needs a body.</p>`
        },
        {
          type: "bug",
          prompt: `<p>Why does this fail to compile?</p>`,
          code: String.raw`abstract class Shape
{
    public abstract double Area();
    public abstract double Perimeter();
}

class Square : Shape
{
    public double Side { get; init; }
    public override double Area() => Side * Side;
}`,
          options: [
            "Square does not override Perimeter(), so it fails with CS0534",
            "Abstract classes cannot have more than one abstract method",
            "Square needs a constructor",
            "Area() must be marked virtual in Square"
          ],
          answer: 0,
          explain: `<p>Every abstract member must be implemented by a concrete derived class. Add <code>public override double Perimeter() =&gt; 4 * Side;</code>, or mark <code>Square</code> abstract if it really is incomplete. A class with no constructor gets a default one, so that is fine.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Can an abstract class have a constructor?</p>`,
          options: [
            "Yes; derived classes chain to it with base(...)",
            "No; abstract classes cannot be constructed at all",
            "Only if it has no abstract members",
            "Only a static constructor"
          ],
          answer: 0,
          explain: `<p>An abstract class cannot be created <em>on its own</em>, but its part of a derived object still needs initializing. Its constructor runs as part of the chain when you create a derived object. Making it <code>protected</code> is the convention.</p>`
        }
      ],
      takeaways: [
        "abstract classes cannot be instantiated (CS0144).",
        "abstract members have no body and must be overridden (CS0534 otherwise).",
        "Abstract classes can still hold fields, constructors and regular methods.",
        "Template method: a fixed algorithm in the base, variable steps in subclasses.",
        "Give abstract classes protected constructors."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m07-l04",
      title: "Interfaces",
      minutes: 22,
      objectives: [
        "Declare and implement interfaces",
        "Implement several interfaces alongside one base class",
        "Make a type sortable with IComparable<T>",
        "Use default interface members and explicit implementation"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>An <strong>interface</strong> is a contract: a named list of members a type promises to provide. It says <em>what</em> a type can do, never <em>how</em> it stores its data. By convention interface names start with a capital <code>I</code>: <code>IDisposable</code>, <code>IComparable&lt;T&gt;</code>, <code>IEnumerable&lt;T&gt;</code>.</p>
<p>Code that depends on an interface works with any type that implements it. That lets you swap an email sender for an SMS sender, or a real database for a fake one in tests, without touching the calling code.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`IMessageSender[] senders = [new EmailSender(), new SmsSender()];

foreach (IMessageSender sender in senders)
{
    sender.Send("Your order has shipped");
}

interface IMessageSender
{
    void Send(string message);
}

class EmailSender : IMessageSender
{
    public void Send(string message)
        => Console.WriteLine($"Email: {message}");
}

class SmsSender : IMessageSender
{
    public void Send(string message)
        => Console.WriteLine($"SMS: {message}");
}`,
          output: `Email: Your order has shipped
SMS: Your order has shipped`
        },
        {
          type: "text",
          html: `<p>The rules:</p>
<ul>
<li>Interface members are public by default, so you do not write <code>public</code> in the interface.</li>
<li>The implementing class must provide every member as <code>public</code>. Missing one gives <code>error CS0535: 'SmsSender' does not implement interface member 'IMessageSender.Send(string)'</code>.</li>
<li>Implementations do <strong>not</strong> use <code>override</code>. You just write a matching public member.</li>
<li>Interfaces cannot hold instance fields and cannot be instantiated (CS0144 again).</li>
</ul>`
        },
        {
          type: "text",
          html: `<p>A class has one base class but can implement <strong>any number</strong> of interfaces. List the base class first, then the interfaces, separated by commas.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var duck = new Duck();
duck.Fly();
duck.Swim();

IFlyer flyer = duck;     // same object, viewed as IFlyer
flyer.Fly();
// flyer.Swim();         // error CS1061: IFlyer has no Swim

interface IFlyer { void Fly(); }
interface ISwimmer { void Swim(); }

class Bird
{
    public string Species { get; init; } = "bird";
}

class Duck : Bird, IFlyer, ISwimmer
{
    public void Fly() => Console.WriteLine("Duck flaps away");
    public void Swim() => Console.WriteLine("Duck paddles");
}`,
          output: `Duck flaps away
Duck paddles
Duck flaps away`
        },
        {
          type: "table",
          headers: ["", "Abstract class", "Interface"],
          rows: [
            ["How many can a class use?", "one", "many"],
            ["Instance fields / state", "yes", "no"],
            ["Constructors", "yes", "no"],
            ["Member bodies", "yes", "only default members (C# 8+)"],
            ["Relationship", "is-a (Dog is an Animal)", "can-do (Duck can fly)"],
            ["Works with structs", "no", "yes"]
          ]
        },
        {
          type: "text",
          html: `<p>.NET itself is built on interfaces. A great first one to implement is <code>IComparable&lt;T&gt;</code>. It has a single method, <code>int CompareTo(T? other)</code>, which returns a negative number if <code>this</code> comes first, zero if equal, positive if <code>this</code> comes after. <code>List&lt;T&gt;.Sort()</code> and <code>Array.Sort</code> call it to put your objects in order.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`List<Player> players =
[
    new Player("Ana", 120),
    new Player("Ben", 340),
    new Player("Cy", 95),
];

players.Sort();   // uses Player.CompareTo

foreach (Player p in players)
{
    Console.WriteLine($"{p.Name,-5}{p.Score,5}");
}

class Player : IComparable<Player>
{
    public string Name { get; }
    public int Score { get; }

    public Player(string name, int score)
    {
        Name = name;
        Score = score;
    }

    // Highest score first: compare other to this.
    public int CompareTo(Player? other)
    {
        if (other is null) return 1;  // convention: null sorts first
        return other.Score.CompareTo(Score);
    }
}`,
          output: `Ben    340
Ana    120
Cy      95`
        },
        {
          type: "callout",
          tone: "tip",
          title: "Details that trip people up",
          html: `<ul>
<li>Write the parameter as <code>Player? other</code>. The interface declares it nullable, and writing <code>Player other</code> produces warning CS8767.</li>
<li>Reuse the built-in comparisons (<code>int.CompareTo</code>, <code>string.Compare</code>) instead of subtracting numbers. <code>a - b</code> can overflow for large values.</li>
<li>Without <code>IComparable&lt;T&gt;</code>, <code>players.Sort()</code> compiles but throws <code>InvalidOperationException: Failed to compare two elements in the array</code> at runtime.</li>
</ul>`
        },
        {
          type: "text",
          html: `<p>Since C# 8, an interface may give a member a <strong>default implementation</strong>. Implementers get it for free and may provide their own. This lets library authors add a member to a published interface without breaking every existing class. One catch: the default member is only reachable through the interface type.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`IGreeter greeter = new EnglishGreeter();
greeter.Greet("Sam");
greeter.GreetAll(["Ana", "Ben"]);
// new EnglishGreeter().GreetAll(...);  // error CS1061

interface IGreeter
{
    void Greet(string name);

    // Default member: implementers get this for free.
    void GreetAll(string[] names)
    {
        foreach (string n in names) Greet(n);
    }
}

class EnglishGreeter : IGreeter
{
    public void Greet(string name)
        => Console.WriteLine($"Hello, {name}!");
}`,
          output: `Hello, Sam!
Hello, Ana!
Hello, Ben!`
        },
        {
          type: "callout",
          tone: "deep",
          title: "Explicit interface implementation",
          html: `<p>Two interfaces may declare members with the same name, or you may want a member visible only through the interface. Write the interface name in front and leave out <code>public</code>: <code>void IFlyer.Fly() { ... }</code>. That member is then callable only through an <code>IFlyer</code> variable. <code>List&lt;T&gt;</code> uses this trick to hide rarely used members such as <code>ICollection&lt;T&gt;.IsReadOnly</code>.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p>Python relies on duck typing: if it has a <code>send</code> method, you can call it. <code>typing.Protocol</code> adds optional static checks. In C# a class must <em>declare</em> that it implements an interface (<code>: IMessageSender</code>). Having a matching method by accident is not enough, and the compiler checks every member is present.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>Predict the output. Read <code>Increment</code> carefully.</p>`,
          code: String.raw`ICounter c = new StepCounter();
c.Increment();
c.Increment();
c.IncrementBy(3);
Console.WriteLine(c.Value);

interface ICounter
{
    int Value { get; }
    void Increment();

    void IncrementBy(int n)
    {
        for (int i = 0; i < n; i++) Increment();
    }
}

class StepCounter : ICounter
{
    public int Value { get; private set; }
    public void Increment() => Value += 2;
}`,
          answer: `10`,
          explain: `<p>Each <code>Increment</code> adds 2. Two direct calls give 4. The default member <code>IncrementBy(3)</code> calls <code>Increment</code> three more times through the interface, which runs <code>StepCounter</code>'s version: 4 + 6 = 10. The call works because <code>c</code> is typed as <code>ICounter</code>.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Make <code>Book</code> sortable by title with <code>List&lt;Book&gt;.Sort()</code>.</p>`,
          code: String.raw`class Book : ___<Book>
{
    public string Title { get; init; } = "";

    public int CompareTo(Book? other)
    {
        if (other is null) return 1;
        return Title.___(other.Title);
    }
}`,
          blanks: [["IComparable"], ["CompareTo"]],
          explain: `<p>The generic interface is <code>IComparable&lt;Book&gt;</code>, and <code>string</code> already implements <code>CompareTo</code>, so you can delegate to it. For culture-independent ordinal sorting, professionals often use <code>string.Compare(Title, other.Title, StringComparison.Ordinal)</code> instead.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This gives <code>error CS0737</code>. What is wrong?</p>`,
          code: String.raw`class Order : IComparable<Order>
{
    public decimal Total { get; init; }

    int CompareTo(Order? other)
        => Total.CompareTo(other?.Total ?? 0);
}`,
          options: [
            "CompareTo is private (no modifier); interface members must be implemented as public",
            "decimal cannot be compared",
            "The method must be marked override",
            "IComparable cannot be used with classes"
          ],
          answer: 0,
          explain: `<p>Class members are private by default. A private method cannot implicitly implement an interface member, so C# reports CS0737. Add <code>public</code>. Interface implementations never use <code>override</code>; that keyword is only for virtual and abstract class members.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Which declaration compiles? (<code>Bird</code> is a class; <code>IFlyer</code> and <code>ISwimmer</code> are interfaces.)</p>`,
          options: [
            "<code>class Duck : Bird, IFlyer, ISwimmer</code>",
            "<code>class Duck : IFlyer, Bird</code>",
            "<code>class Duck : Bird, Animal</code> (Animal is a class)",
            "<code>class Duck implements IFlyer</code>"
          ],
          answer: 0,
          explain: `<p>The base class must come first (otherwise CS1722), and there can be only one (CS1721). C# has no <code>implements</code> keyword; base class and interfaces share the colon list.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>You are designing a plug-in point where very different types (a struct, a class with its own base class) all need a <code>Validate()</code> method. What fits best?</p>`,
          options: [
            "An interface IValidatable",
            "An abstract class ValidatableBase",
            "A sealed class Validator",
            "A virtual method on object"
          ],
          answer: 0,
          explain: `<p>Structs cannot inherit from classes, and a class that already has a base cannot take a second one. Any type can implement an interface, so an interface is the right contract here. Use an abstract base class when related types share real code and state.</p>`
        }
      ],
      takeaways: [
        "An interface is a contract of members; implementers must make them public.",
        "A class can implement many interfaces but inherit from only one class.",
        "Implement IComparable<T> so Sort() knows how to order your objects.",
        "Default interface members are reachable only through the interface type.",
        "Prefer interfaces for can-do abilities and abstract classes for shared code."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m07-l05",
      title: "Type checks and casting",
      minutes: 16,
      objectives: [
        "Tell implicit upcasts from explicit downcasts",
        "Test types safely with is and type patterns",
        "Use as and handle its null result",
        "Recognize when type checks should be polymorphism instead"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>A <code>Dog</code> can always be stored in an <code>Animal</code> variable. That is an <strong>upcast</strong> (toward the base) and it is implicit, because it can never fail.</p>
<p>Going the other way is a <strong>downcast</strong>. An <code>Animal</code> variable might hold a <code>Cat</code>, so the compiler makes you write the cast explicitly: <code>(Dog)animal</code>. You are telling the compiler "trust me". If you are wrong, the runtime throws <code>InvalidCastException</code>.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Animal a = new Dog("Rex");  // upcast: implicit, always safe
// a.Fetch();               // error CS1061: Animal has no Fetch
Dog d = (Dog)a;             // downcast: explicit
d.Fetch();

class Animal
{
    public string Name { get; }
    public Animal(string name) => Name = name;
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }
    public void Fetch() => Console.WriteLine($"{Name} fetches the ball.");
}`,
          output: `Rex fetches the ball.`
        },
        {
          type: "callout",
          tone: "warning",
          title: "When a cast is wrong",
          html: `<p>If <code>a</code> held a <code>Cat</code>, <code>(Dog)a</code> would compile fine and then crash:</p>
<p><code>System.InvalidCastException: Unable to cast object of type 'Cat' to type 'Dog'.</code></p>
<p>Only use a direct cast when you are certain of the type. When you are not, test first.</p>`
        },
        {
          type: "text",
          html: `<p>The <code>is</code> operator tests a type and returns <code>true</code> or <code>false</code>. Its most useful form also declares a variable when the test passes: <code>if (animal is Dog dog)</code>. Inside the <code>if</code>, <code>dog</code> is already a <code>Dog</code>. No separate cast, no chance of an exception.</p>
<ul>
<li><code>x is Dog</code> is true for a <code>Dog</code> and for anything derived from <code>Dog</code>.</li>
<li><code>null</code> never matches a type pattern, so <code>is</code> also handles null safely.</li>
<li><code>is not</code> reads naturally for early exits: <code>if (item is not Book book) return;</code> and <code>book</code> is usable after the <code>if</code>.</li>
</ul>`
        },
        {
          type: "code",
          title: "Type patterns in a switch",
          code: String.raw`object?[] things = [42, "hello", 7, true, null, new int[3]];

foreach (object? thing in things)
{
    string description = thing switch
    {
        int n when n > 10 => $"big int {n}",
        int n => $"small int {n}",
        string s => $"string of length {s.Length}",
        bool b => $"bool {b}",
        null => "null",
        _ => $"something else: {thing.GetType().Name}"
    };
    Console.WriteLine(description);
}`,
          output: `big int 42
string of length 5
small int 7
bool True
null
something else: Int32[]`
        },
        {
          type: "text",
          html: `<p><code>as</code> is the older way. It tries the conversion and gives <code>null</code> instead of throwing when it fails. You must then check for null. <code>as</code> works only with reference types and nullable value types: <code>o as int</code> is <code>error CS0077</code>. Modern code mostly uses <code>is Dog d</code>, which combines the test and the variable, but you will see <code>as</code> in many codebases.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Animal[] pets = [new Dog("Rex"), new Cat("Tom")];

foreach (Animal pet in pets)
{
    Dog? dog = pet as Dog;      // null if pet is not a Dog
    if (dog != null)
    {
        dog.Fetch();
    }
    else
    {
        Console.WriteLine($"{pet.Name} is not a dog.");
    }
}

class Animal
{
    public string Name { get; }
    public Animal(string name) => Name = name;
}

class Dog : Animal
{
    public Dog(string name) : base(name) { }
    public void Fetch() => Console.WriteLine($"{Name} fetches.");
}

class Cat : Animal
{
    public Cat(string name) : base(name) { }
}`,
          output: `Rex fetches.
Tom is not a dog.`
        },
        {
          type: "table",
          headers: ["Syntax", "On failure", "Use when"],
          rows: [
            ["<code>(Dog)x</code>", "throws <code>InvalidCastException</code>", "you are certain of the type"],
            ["<code>x as Dog</code>", "returns <code>null</code>", "older code; reference types only"],
            ["<code>x is Dog</code>", "returns <code>false</code>", "you only need yes or no"],
            ["<code>x is Dog d</code>", "returns <code>false</code>, <code>d</code> unassigned", "test and use in one step (preferred)"]
          ]
        },
        {
          type: "callout",
          tone: "tip",
          title: "Lots of type checks is a design smell",
          html: `<p>If you find a chain of <code>if (x is Dog) ... else if (x is Cat) ...</code> all over the code, every new subclass means hunting down every chain. Usually the behavior belongs in a virtual method on the base class, so each subclass carries its own answer. Type checks are fine at boundaries (parsing input, handling <code>object</code> from an API), not as a replacement for polymorphism.</p>`
        },
        {
          type: "compare",
          left: {
            label: "Type checks (fragile)",
            code: String.raw`decimal Fee(Animal a)
{
    if (a is Dog) return 30m;
    if (a is Cat) return 20m;
    return 10m;   // new pets silently get 10
}`
          },
          right: {
            label: "Polymorphism (preferred)",
            code: String.raw`class Animal
{
    public virtual decimal Fee => 10m;
}
class Dog : Animal
{
    public override decimal Fee => 30m;
}
// Fee lives with each type.`
          }
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p><code>isinstance(x, Dog)</code> becomes <code>x is Dog</code>. Python has no casts because every variable can hold anything. In C# the declared type limits what you can call, so after the test you need a <code>Dog</code>-typed variable, which <code>x is Dog d</code> gives you.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`object[] items = [7, "seven", 7L, 'x'];

foreach (object item in items)
{
    Console.WriteLine(item switch
    {
        int i => "int " + i,
        long l => "long " + l,
        string s => "string " + s.ToUpper(),
        _ => "other " + item
    });
}`,
          answer: `int 7
string SEVEN
long 7
other x`,
          explain: `<p>The literal <code>7L</code> is a <code>long</code>, not an <code>int</code>, so it skips the first arm. <code>'x'</code> is a <code>char</code>, which no arm names, so it falls to the discard <code>_</code>. Arms are tried top to bottom and the first match wins.</p>`
        },
        {
          type: "mcq",
          prompt: `<p><code>Animal pet = new Cat("Tom");</code> What is the value of <code>pet as Dog</code>?</p>`,
          options: [
            "null",
            "It throws InvalidCastException",
            "A Dog named Tom",
            "It does not compile"
          ],
          answer: 0,
          explain: `<p><code>as</code> never throws on a type mismatch; it returns <code>null</code>. The direct cast <code>(Dog)pet</code> is the one that throws. It compiles because an <code>Animal</code> could be a <code>Dog</code>.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Fill in the operators: first a type pattern, then a conversion that yields null on failure.</p>`,
          code: String.raw`if (shape ___ Circle c)
{
    Console.WriteLine(c.Radius);
}

Square? sq = shape ___ Square;`,
          blanks: [["is"], ["as"]],
          explain: `<p><code>is Circle c</code> tests and declares <code>c</code> in one step. <code>as Square</code> converts or returns null, which is why the variable is declared <code>Square?</code>.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This crashes at runtime. What is the safest fix?</p>`,
          code: String.raw`Animal[] animals = [new Dog("Rex"), new Cat("Tom")];

foreach (Animal a in animals)
{
    Dog d = (Dog)a;
    d.Fetch();
}`,
          options: [
            "Use if (a is Dog d) d.Fetch(); so non-dogs are skipped",
            "Change the cast to (Animal)a",
            "Declare the array as Dog[]",
            "Wrap Fetch() in a virtual method on Cat"
          ],
          answer: 0,
          explain: `<p>The second element is a <code>Cat</code>, so <code>(Dog)a</code> throws <code>InvalidCastException</code>. The <code>is</code> pattern tests first and skips non-matches. Declaring <code>Dog[]</code> would not compile because the array contains a <code>Cat</code>. Casting to <code>Animal</code> leaves you unable to call <code>Fetch</code>.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Why does <code>int n = obj as int;</code> fail to compile?</p>`,
          options: [
            "as needs a type that can be null, and int cannot (CS0077)",
            "int cannot be stored in an object",
            "as only works with interfaces",
            "You must write as(int)"
          ],
          answer: 0,
          explain: `<p><code>as</code> signals failure with <code>null</code>, so the target type must allow null. <code>obj as int?</code> compiles. Better still is <code>if (obj is int n)</code>, which works for value types directly.</p>`
        }
      ],
      takeaways: [
        "Upcasts (derived to base) are implicit and always succeed.",
        "Downcasts need (Type)x and throw InvalidCastException when wrong.",
        "x is Dog d tests and declares in one step; null never matches.",
        "as returns null on failure and only works with nullable types.",
        "Repeated type checks often mean a virtual method is missing."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m07-l06",
      title: "Object methods and composition",
      minutes: 22,
      objectives: [
        "Override ToString for readable output",
        "Override Equals and GetHashCode together, correctly",
        "Explain why records often replace hand-written equality",
        "Choose composition (has-a) over inheritance (is-a) when it fits"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Every class inherits four public methods from <code>object</code>: <code>ToString()</code>, <code>Equals(object?)</code>, <code>GetHashCode()</code> and <code>GetType()</code>. The first three are virtual, and the defaults are rarely what you want for your own data types.</p>
<p>Start with <code>ToString()</code>. <code>Console.WriteLine(x)</code>, string interpolation and the debugger all call it. The default returns the type's full name, which tells you nothing about the data.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`Console.WriteLine(new RawPoint());

var p = new Point(3, 4);
Console.WriteLine(p);
Console.WriteLine($"Location: {p}");

class RawPoint
{
    public int X { get; } = 3;
    public int Y { get; } = 4;
}

class Point
{
    public int X { get; }
    public int Y { get; }

    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }

    public override string ToString() => $"({X}, {Y})";
}`,
          output: `RawPoint
(3, 4)
Location: (3, 4)`
        },
        {
          type: "text",
          html: `<p>Next, equality. For classes, <code>Equals</code> and <code>==</code> compare <strong>references</strong> by default: two separate objects are never equal, even with identical data. That is right for things with identity (two customers named "Ana" are different people). It is wrong for <em>values</em> such as money, coordinates or dates, where equal data should mean equal objects.</p>
<p>To get value equality, override <code>Equals</code> <strong>and</strong> <code>GetHashCode</code>. The hash code is what <code>Dictionary</code> and <code>HashSet</code> use to find the right bucket. The rule: if two objects are equal, they <em>must</em> return the same hash code.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var a = new Money(10.00m, "EUR");
var b = new Money(10.00m, "EUR");
var c = new Money(10.00m, "USD");

Console.WriteLine(a.Equals(b));
Console.WriteLine(a.Equals(c));
Console.WriteLine(a == b);              // still reference!
Console.WriteLine(ReferenceEquals(a, b));

var set = new HashSet<Money> { a, b, c };
Console.WriteLine(set.Count);

class Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        Amount = amount;
        Currency = currency;
    }

    public override bool Equals(object? obj)
        => obj is Money other
           && Amount == other.Amount
           && Currency == other.Currency;

    public override int GetHashCode()
        => HashCode.Combine(Amount, Currency);
}`,
          output: `True
False
False
False
2`
        },
        {
          type: "text",
          html: `<p>Walk through it. <code>Equals</code> uses the <code>is</code> pattern from the last lesson: if <code>obj</code> is not a <code>Money</code> (or is null), the result is false. <code>HashCode.Combine</code> mixes the fields that take part in equality into one well-distributed number. The set keeps only two items because <code>a</code> and <code>b</code> are now equal.</p>
<p><code>a == b</code> is still false. The <code>==</code> operator is separate from <code>Equals</code> for classes. You can overload it (<code>public static bool operator ==</code>), but then you must also write <code>!=</code> and keep all four members consistent.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Equals without GetHashCode",
          html: `<p>Overriding only <code>Equals</code> gives <code>warning CS0659: 'Money' overrides Object.Equals(object o) but does not override Object.GetHashCode()</code>. Take it seriously. Equal objects would get different hash codes, so a <code>HashSet</code> could hold duplicates and <code>dictionary[key]</code> could fail to find a key that is "equal". Also, only use fields that never change in the hash code. If a key's hash changes while it sits in a dictionary, the entry is lost.</p>`
        },
        {
          type: "text",
          html: `<p>That is a lot of careful code for "two Moneys with the same data are equal". This is exactly why <strong>records</strong> exist. A record generates value-based <code>Equals</code>, <code>GetHashCode</code>, <code>==</code>, <code>!=</code> and a readable <code>ToString</code> for you.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var a = new Money(10.00m, "EUR");
var b = new Money(10.00m, "EUR");

Console.WriteLine(a == b);
Console.WriteLine(a);

record Money(decimal Amount, string Currency);`,
          output: `True
Money { Amount = 10.00, Currency = EUR }`
        },
        {
          type: "text",
          html: `<p>Now the bigger design question. Inheritance models <strong>is-a</strong>. <strong>Composition</strong> models <strong>has-a</strong>: a class holds other objects in fields and delegates work to them. A car <em>has</em> an engine; it is not an engine.</p>
<p>Inheritance is the tighter bond. A derived class depends on its base's internals, cannot change its base at runtime, and gets every public member whether it makes sense or not. Deep hierarchies (<code>Animal &gt; Mammal &gt; Pet &gt; Dog &gt; ServiceDog</code>) become hard to change. The common advice "favor composition over inheritance" comes from that pain.</p>`
        },
        {
          type: "compare",
          left: {
            label: "Inheritance misused",
            code: String.raw`// "A Car is an Engine"? No.
class Car : Engine
{
    // Car now exposes Engine's
    // public members, like
    // SetFuelMixture(), to all.
}`
          },
          right: {
            label: "Composition",
            code: String.raw`class Car
{
    private readonly Engine engine;

    public Car(Engine engine)
        => this.engine = engine;

    public void Start() => engine.Ignite();
}`
          }
        },
        {
          type: "text",
          html: `<p>Composition becomes powerful when the field's type is an interface. Then you can plug in different behavior without any subclassing. Here an <code>Order</code> <em>has a</em> discount rule:</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var standard = new Order(100m, new NoDiscount());
var sale = new Order(100m, new PercentOff(20));

Console.WriteLine(standard.Total());
Console.WriteLine(sale.Total());

interface IDiscount
{
    decimal Apply(decimal amount);
}

class NoDiscount : IDiscount
{
    public decimal Apply(decimal amount) => amount;
}

class PercentOff : IDiscount
{
    private readonly decimal percent;
    public PercentOff(decimal percent) => this.percent = percent;

    public decimal Apply(decimal amount)
        => amount - amount * percent / 100;
}

class Order
{
    private readonly decimal subtotal;
    private readonly IDiscount discount;   // has-a

    public Order(decimal subtotal, IDiscount discount)
    {
        this.subtotal = subtotal;
        this.discount = discount;
    }

    public decimal Total() => discount.Apply(subtotal);
}`,
          output: `100
80`
        },
        {
          type: "table",
          headers: ["Ask yourself", "Leans toward"],
          rows: [
            ["Is it truly a more specific kind of the base, everywhere it is used?", "inheritance"],
            ["Do I only want to reuse some code?", "composition"],
            ["Should the behavior be swappable at runtime or in tests?", "composition with an interface"],
            ["Would the subclass inherit public members that make no sense for it?", "composition"],
            ["Do several types share both data and code, with one natural parent?", "abstract base class"]
          ]
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<p><code>__str__</code>, <code>__eq__</code> and <code>__hash__</code> map to <code>ToString</code>, <code>Equals</code> and <code>GetHashCode</code>. Python has the same rule: defining <code>__eq__</code> without <code>__hash__</code> makes objects unhashable. C# only warns, which is more dangerous, so always override the pair. A C# <code>record</code> is close to a Python <code>@dataclass(frozen=True)</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`var a = new Tag("urgent");
var b = new Tag("urgent");

Console.WriteLine(a);
Console.WriteLine(a.Equals(b));
Console.WriteLine(a.Name == b.Name);

class Tag
{
    public string Name { get; }
    public Tag(string name) => Name = name;
}`,
          answer: `Tag
False
True`,
          explain: `<p><code>Tag</code> overrides nothing, so <code>ToString()</code> returns the type name and <code>Equals</code> compares references (two different objects, so false). Comparing the <code>Name</code> strings is true, because <code>string</code> itself overrides equality to compare characters.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete a value-equality <code>Point</code> with a readable <code>ToString</code>.</p>`,
          code: String.raw`class Point
{
    public int X { get; init; }
    public int Y { get; init; }

    public ___ string ToString() => $"({X}, {Y})";

    public override bool Equals(object? obj)
        => obj is Point p && X == p.X && Y == p.Y;

    public override int GetHashCode() => HashCode.___(X, Y);
}`,
          blanks: [["override"], ["Combine"]],
          explain: `<p><code>ToString</code> is virtual on <code>object</code>, so you <code>override</code> it. <code>HashCode.Combine</code> merges up to eight values into one hash code. Using only <code>X</code> would be legal but would give many collisions and slow lookups.</p>`
        },
        {
          type: "bug",
          prompt: `<p>Two points with different <code>Y</code> values compare as equal. Find the bug.</p>`,
          code: String.raw`public override bool Equals(object? obj)
    => obj is Point other
       && X == other.X
       && Y == other.X;`,
          options: [
            "The last comparison uses other.X instead of other.Y",
            "is cannot be used inside Equals",
            "Equals must take a Point parameter, not object?",
            "The method needs the virtual keyword"
          ],
          answer: 0,
          explain: `<p>A copy-paste slip: <code>Y == other.X</code> compares the wrong fields. <code>Equals(object?)</code> is the correct signature to override, and <code>override</code> is the correct keyword. Records avoid this class of bug because the compiler writes the comparisons.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>You override <code>Equals</code> on <code>Customer</code> but not <code>GetHashCode</code>. What is the real risk?</p>`,
          options: [
            "Equal customers may land in different hash buckets, so HashSet and Dictionary misbehave",
            "The program will not compile",
            "ToString stops working",
            "Equals will always return false"
          ],
          answer: 0,
          explain: `<p>It compiles with warning CS0659. Hash-based collections look up the bucket by hash code first, then call <code>Equals</code>. Different hash codes for equal objects mean the lookup checks the wrong bucket, so you get duplicates or missing keys.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>An <code>Invoice</code> needs to send itself by email or by PDF export, chosen by the user at runtime. Which design fits best?</p>`,
          options: [
            "Invoice has an IInvoiceSender field, with EmailSender and PdfSender implementations",
            "EmailInvoice and PdfInvoice both inherit from Invoice",
            "Invoice inherits from EmailSender",
            "A switch on a string in every method of Invoice"
          ],
          answer: 0,
          explain: `<p>The sending method is a swappable part, so composition with an interface fits: the same <code>Invoice</code> can use either sender, and tests can pass a fake. Subclassing <code>Invoice</code> fixes the choice at creation time and multiplies classes if another axis (such as currency) varies. An invoice is not a sender.</p>`
        }
      ],
      takeaways: [
        "Override ToString() so objects print meaningful text.",
        "Class equality is reference equality until you override Equals.",
        "Always override Equals and GetHashCode together; use HashCode.Combine.",
        "Records generate value equality, == and ToString for you.",
        "Inheritance means is-a; composition means has-a and is usually more flexible."
      ]
    }
  ],
  milestone: {
    id: "m07-project",
    title: "Library Catalog",
    brief: `<p>The town library wants a small console tool for its front desk. The catalog holds books, DVDs and magazines. Books and DVDs can be lent out (for different lengths of time). Magazines are reference only and stay in the building.</p>
<p>Model the items with an abstract base class, add lending ability with an interface, and let polymorphism do the work: the listing code should never need to know which kind of item it is printing. The desk staff type short commands such as <code>list</code>, <code>find hobbit</code>, <code>out 2</code> and <code>in 2</code>.</p>`,
    skills: ["abstract classes", "inheritance and base(...)", "interfaces", "IComparable<T>", "overriding ToString", "is type patterns"],
    requirements: [
      "An abstract class LibraryItem with Id, Title and Year, a protected constructor, an abstract Kind property and an abstract Details() method.",
      "Book (with Author), Dvd (with Minutes) and Magazine (with Issue) derive from LibraryItem and chain to its constructor with base(...).",
      "An ILoanable interface with LoanDays and IsCheckedOut, implemented by Book (21 days) and Dvd (7 days) only.",
      "LibraryItem overrides ToString() to print one line per item, including an [OUT] marker for checked-out loanable items.",
      "LibraryItem implements IComparable<LibraryItem> so list prints items sorted by title, ignoring case.",
      "find <text> prints every item whose title contains the text, ignoring case, or \"No matches.\"",
      "out <id> and in <id> use an is pattern to check for ILoanable, refuse magazines, and refuse checking out twice or returning an item that is not out.",
      "Unknown commands and non-numeric ids print a helpful message; quit or end of input (ReadLine returns null) exits cleanly."
    ],
    sampleRun: `Library Catalog. Commands: list, find <text>, out <id>, in <id>, quit
> list
#5 DVD      Arrival (2016), 116 min
#4 Book     Clean Code (2008), by Robert C. Martin
#3 Magazine National Geographic (2024), issue 6
#2 DVD      Spirited Away (2001), 125 min
#1 Book     The Hobbit (1937), by J.R.R. Tolkien
> out 2
Checked out 'Spirited Away' for 7 days.
> out 2
'Spirited Away' is already checked out.
> out 3
'National Geographic' is reference only.
> find a
#5 DVD      Arrival (2016), 116 min
#4 Book     Clean Code (2008), by Robert C. Martin
#3 Magazine National Geographic (2024), issue 6
#2 DVD      Spirited Away (2001), 125 min [OUT]
> in 2
Returned 'Spirited Away'.
> out x
Please give a numeric id, for example: out 2
> borrow 1
Unknown command 'borrow'.
> quit
Goodbye!`,
    starter: String.raw`var catalog = new Catalog();
catalog.Add(new Book(1, "The Hobbit", 1937, "J.R.R. Tolkien"));
// TODO: add the DVDs and the magazine once those classes exist:
// Dvd(2, "Spirited Away", 2001, 125), Magazine(3, "National
// Geographic", 2024, 6), Book(4, "Clean Code", 2008, "Robert C.
// Martin"), Dvd(5, "Arrival", 2016, 116)

Console.WriteLine("Library Catalog. Commands: list, find <text>, " +
                  "out <id>, in <id>, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;          // end of input

    string[] parts = line.Trim().Split(' ', 2);
    string command = parts[0].ToLowerInvariant();
    string arg = parts.Length > 1 ? parts[1].Trim() : "";

    if (command == "quit") break;

    // TODO: handle list, find, out, in, empty input and
    // unknown commands.
    Console.WriteLine($"(not implemented yet: {command} {arg})");
}
Console.WriteLine("Goodbye!");

interface ILoanable
{
    int LoanDays { get; }
    bool IsCheckedOut { get; set; }
}

abstract class LibraryItem
{
    public int Id { get; }
    public string Title { get; }
    public int Year { get; }

    protected LibraryItem(int id, string title, int year)
    {
        Id = id;
        Title = title;
        Year = year;
    }

    public abstract string Kind { get; }
    protected abstract string Details();

    // TODO: override ToString() to produce a line like
    // "#1 Book     The Hobbit (1937), by J.R.R. Tolkien [OUT]"
    // TODO: implement IComparable<LibraryItem> (by title).
}

class Book : LibraryItem, ILoanable
{
    public string Author { get; }
    public int LoanDays => 21;
    public bool IsCheckedOut { get; set; }

    public Book(int id, string title, int year, string author)
        : base(id, title, year)
    {
        Author = author;
    }

    public override string Kind => "Book";
    protected override string Details() => $"by {Author}";
}

// TODO: class Dvd (Minutes, 7 loan days) and class Magazine
// (Issue, not loanable).

class Catalog
{
    private readonly List<LibraryItem> items = [];

    public void Add(LibraryItem item) => items.Add(item);

    // TODO: PrintAll (sorted), Find(text), CheckOut(id), Return(id)
}`,
    hints: [
      `<p>Start with the types. Copy the shape of <code>Book</code> for <code>Dvd</code> and <code>Magazine</code>. <code>Magazine</code> derives from <code>LibraryItem</code> but does <strong>not</strong> list <code>ILoanable</code>.</p>`,
      `<p>In <code>ToString()</code>, build the marker with a type pattern: <code>string mark = this is ILoanable l &amp;&amp; l.IsCheckedOut ? " [OUT]" : "";</code>. Use <code>{Kind,-8}</code> to line up the columns.</p>`,
      `<p>For sorting, declare <code>abstract class LibraryItem : IComparable&lt;LibraryItem&gt;</code> and return <code>string.Compare(Title, other.Title, StringComparison.OrdinalIgnoreCase)</code>. Then <code>items.Sort()</code> just works.</p>`,
      `<p>For <code>out</code>: find the item by id, then <code>if (item is not ILoanable loanable) return "... is reference only.";</code>. After that line, <code>loanable</code> is in scope and safe to use.</p>`,
      `<p>Parse ids with <code>int.TryParse(arg, out int id)</code> and print the helpful message when it returns false. Let <code>CheckOut</code> and <code>Return</code> return a string so the main loop just prints it.</p>`
    ],
    solution: String.raw`var catalog = new Catalog();
catalog.Add(new Book(1, "The Hobbit", 1937, "J.R.R. Tolkien"));
catalog.Add(new Dvd(2, "Spirited Away", 2001, 125));
catalog.Add(new Magazine(3, "National Geographic", 2024, 6));
catalog.Add(new Book(4, "Clean Code", 2008, "Robert C. Martin"));
catalog.Add(new Dvd(5, "Arrival", 2016, 116));

Console.WriteLine("Library Catalog. Commands: list, find <text>, " +
                  "out <id>, in <id>, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;          // end of input

    string[] parts = line.Trim().Split(' ', 2);
    string command = parts[0].ToLowerInvariant();
    string arg = parts.Length > 1 ? parts[1].Trim() : "";

    if (command == "quit") break;

    switch (command)
    {
        case "":
            break;
        case "list":
            catalog.PrintAll();
            break;
        case "find":
            catalog.Find(arg);
            break;
        case "out":
        case "in":
            if (!int.TryParse(arg, out int id))
            {
                Console.WriteLine(
                    $"Please give a numeric id, for example: {command} 2");
                break;
            }
            Console.WriteLine(command == "out"
                ? catalog.CheckOut(id)
                : catalog.Return(id));
            break;
        default:
            Console.WriteLine($"Unknown command '{command}'.");
            break;
    }
}
Console.WriteLine("Goodbye!");

interface ILoanable
{
    int LoanDays { get; }
    bool IsCheckedOut { get; set; }
}

abstract class LibraryItem : IComparable<LibraryItem>
{
    public int Id { get; }
    public string Title { get; }
    public int Year { get; }

    protected LibraryItem(int id, string title, int year)
    {
        Id = id;
        Title = title;
        Year = year;
    }

    public abstract string Kind { get; }
    protected abstract string Details();

    public override string ToString()
    {
        string mark = this is ILoanable l && l.IsCheckedOut
            ? " [OUT]" : "";
        return $"#{Id} {Kind,-8} {Title} ({Year}), {Details()}{mark}";
    }

    public int CompareTo(LibraryItem? other)
    {
        if (other is null) return 1;
        return string.Compare(Title, other.Title,
            StringComparison.OrdinalIgnoreCase);
    }
}

class Book : LibraryItem, ILoanable
{
    public string Author { get; }
    public int LoanDays => 21;
    public bool IsCheckedOut { get; set; }

    public Book(int id, string title, int year, string author)
        : base(id, title, year) => Author = author;

    public override string Kind => "Book";
    protected override string Details() => $"by {Author}";
}

class Dvd : LibraryItem, ILoanable
{
    public int Minutes { get; }
    public int LoanDays => 7;
    public bool IsCheckedOut { get; set; }

    public Dvd(int id, string title, int year, int minutes)
        : base(id, title, year) => Minutes = minutes;

    public override string Kind => "DVD";
    protected override string Details() => $"{Minutes} min";
}

class Magazine : LibraryItem
{
    public int Issue { get; }

    public Magazine(int id, string title, int year, int issue)
        : base(id, title, year) => Issue = issue;

    public override string Kind => "Magazine";
    protected override string Details() => $"issue {Issue}";
}

class Catalog
{
    private readonly List<LibraryItem> items = [];

    public void Add(LibraryItem item) => items.Add(item);

    public void PrintAll()
    {
        items.Sort();
        foreach (LibraryItem item in items) Console.WriteLine(item);
    }

    public void Find(string text)
    {
        items.Sort();
        int found = 0;
        foreach (LibraryItem item in items)
        {
            if (item.Title.Contains(text,
                    StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine(item);
                found++;
            }
        }
        if (found == 0) Console.WriteLine("No matches.");
    }

    public string CheckOut(int id)
    {
        LibraryItem? item = FindById(id);
        if (item is null) return $"No item with id {id}.";
        if (item is not ILoanable loanable)
            return $"'{item.Title}' is reference only.";
        if (loanable.IsCheckedOut)
            return $"'{item.Title}' is already checked out.";

        loanable.IsCheckedOut = true;
        return $"Checked out '{item.Title}' for {loanable.LoanDays} days.";
    }

    public string Return(int id)
    {
        LibraryItem? item = FindById(id);
        if (item is null) return $"No item with id {id}.";
        if (item is not ILoanable loanable || !loanable.IsCheckedOut)
            return $"'{item.Title}' is not checked out.";

        loanable.IsCheckedOut = false;
        return $"Returned '{item.Title}'.";
    }

    private LibraryItem? FindById(int id)
    {
        foreach (LibraryItem item in items)
        {
            if (item.Id == id) return item;
        }
        return null;
    }
}`,
    stretch: [
      "Add a due date: store DateOnly DueDate on ILoanable items when checked out and show it in the listing.",
      "Add an overdue command that lists every item past its due date, using a virtual LateFeePerDay that differs per item type.",
      "Override Equals and GetHashCode on LibraryItem so two items with the same Id are equal, then keep the catalog in a HashSet.",
      "Replace the hard-coded ILoanable check with a polymorphic virtual bool CanLend property and compare the two designs."
    ]
  }
});
