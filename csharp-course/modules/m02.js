(function () {
const R = String.raw;

(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m02",
  number: 2,
  title: "Values & Variables",
  tagline: "Store numbers and text, do math with them, convert between types, and format the results.",
  level: "Beginner",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m02-l01",
      title: "Variables and built-in types",
      minutes: 16,
      objectives: [
        "Declare variables with a type, a name and a value",
        "Pick the right built-in type: int, double, decimal, bool, char or string",
        "Use var and explain why it is still strongly typed",
        "Name variables the way C# developers do"
      ],
      blocks: [
        { type: "text", html: R`<p>A <strong>variable</strong> is a named place in memory that holds a value. Think of a labeled box. In C#, every box also has a <strong>type</strong> that says what kind of value fits inside: a whole number, a piece of text, true or false, and so on.</p><p>You create a variable with a <em>declaration</em>: the type, then the name, then optionally <code>=</code> and a starting value.</p>` },
        { type: "code", title: "Program.cs", code: R`int age = 36;
double height = 1.72;
string name = "Ada";
bool isAdmin = true;
char grade = 'A';

Console.WriteLine($"{name} is {age} years old.");
Console.WriteLine($"Height: {height} m, grade: {grade}");
Console.WriteLine($"Admin? {isAdmin}");`, output: "Ada is 36 years old.\nHeight: 1.72 m, grade: A\nAdmin? True" },
        { type: "table", headers: ["Type", "Holds", "Example", "Use it for"], rows: [
          [R`<code>int</code>`, "Whole numbers, about -2.1 billion to 2.1 billion", R`<code>42</code>`, "Counts, ages, quantities, indexes"],
          [R`<code>long</code>`, "Bigger whole numbers (about 9.2 quintillion)", R`<code>9_000_000_000L</code>`, "File sizes, IDs, timestamps"],
          [R`<code>double</code>`, "Numbers with a fractional part, about 15-16 significant digits", R`<code>3.14</code>`, "Measurements, science, graphics"],
          [R`<code>decimal</code>`, "Exact base-10 numbers, 28-29 significant digits", R`<code>19.99m</code>`, "Money and anything that must add up exactly"],
          [R`<code>bool</code>`, R`<code>true</code> or <code>false</code>`, R`<code>true</code>`, "Yes/no facts and conditions"],
          [R`<code>char</code>`, "One single character, in single quotes", R`<code>'A'</code>`, "Letters, digits, symbols"],
          [R`<code>string</code>`, "Text of any length, in double quotes", R`<code>"Hello"</code>`, "Names, messages, anything textual"]
        ] },
        { type: "text", html: R`<p>Once a variable exists, you can give it a new value with <code>=</code>. You do not repeat the type; that would try to create a second variable with the same name. The new value replaces the old one completely.</p><p>C# is <strong>statically typed</strong>: a variable's type is fixed forever when you declare it. An <code>int</code> box can never hold text. If you try, the compiler stops you before the program runs: <code>error CS0029: Cannot implicitly convert type 'string' to 'int'</code>. A variable must also have a value before you read it, or you get <code>error CS0165: Use of unassigned local variable 'score'</code>.</p>` },
        { type: "code", code: R`int score = 10;
Console.WriteLine(score);

score = 25;           // replace the value
Console.WriteLine(score);

score = score + 5;    // read it, add 5, store it back
Console.WriteLine(score);`, output: "10\n25\n30" },
        { type: "text", html: R`<p>Typing the type every time can feel repetitive when it is obvious. With <code>var</code>, the compiler works out the type from the value on the right. The variable is still statically typed: <code>var count = 10;</code> makes an <code>int</code>, and it stays an <code>int</code>. Because the compiler needs a value to look at, <code>var x;</code> on its own is an error: <code>CS0818: Implicitly-typed variables must be initialized</code>.</p>` },
        { type: "code", code: R`var count = 10;
var price = 9.99;
var total = 9.99m;
var title = "Manager";
var ready = false;

Console.WriteLine(count.GetType());
Console.WriteLine(price.GetType());
Console.WriteLine(total.GetType());
Console.WriteLine(title.GetType());
Console.WriteLine(ready.GetType());`, output: "System.Int32\nSystem.Double\nSystem.Decimal\nSystem.String\nSystem.Boolean" },
        { type: "callout", tone: "deep", title: "int is a nickname for System.Int32", html: R`<p>The C# keywords are short aliases for .NET types: <code>int</code> is <code>System.Int32</code> (32 bits), <code>long</code> is <code>System.Int64</code>, <code>double</code> is <code>System.Double</code>, <code>bool</code> is <code>System.Boolean</code>, <code>string</code> is <code>System.String</code>. That is why <code>GetType()</code> prints the long names. They are exactly the same types; C# developers almost always write the short keywords.</p>` },
        { type: "callout", tone: "tip", title: "When do professionals use var?", html: R`<p>Most teams use <code>var</code> when the type is obvious from the right-hand side, such as <code>var names = new List&lt;string&gt;();</code>, and write the type out when it helps the reader, such as <code>decimal price = GetPrice();</code>. Whatever your team picks, be consistent. In this course you will see both.</p>` },
        { type: "table", headers: ["Rule or habit", "Good", "Bad or invalid"], rows: [
          ["Local variables use camelCase", R`<code>firstName</code>, <code>totalPrice</code>`, R`<code>FirstName</code>, <code>total_price</code>`],
          ["Letters, digits and _ only; no leading digit", R`<code>player2</code>`, R`<code>2player</code> (error), <code>my-name</code> (error)`],
          ["Keywords are reserved", R`<code>className</code>`, R`<code>class</code> (error)`],
          ["Names are case-sensitive", R`<code>count</code> and <code>Count</code> are different`, "Mixing them up by accident"],
          ["Say what it holds", R`<code>daysUntilDue</code>`, R`<code>d</code>, <code>temp2</code>, <code>x</code>`]
        ] },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p>In Python, <code>x = 5</code> then <code>x = "five"</code> is fine, because names can point at any kind of object. In C# the variable itself has a type, so the second line is a compile error. You also declare a variable once (<code>int x = 5;</code>) and then assign without the type (<code>x = 6;</code>). <code>True</code>/<code>False</code> become lowercase <code>true</code>/<code>false</code> in code, though <code>Console.WriteLine(true)</code> prints <code>True</code>.</p>` }
      ],
      exercises: [
        { type: "output", prompt: "What does this program print?", code: R`var a = 5;
var b = 2.5;
var c = "5";
Console.WriteLine(a.GetType().Name);
Console.WriteLine(b.GetType().Name);
Console.WriteLine(c.GetType().Name);`, answer: "Int32\nDouble\nString", explain: R`<p><code>var</code> uses the type of the value: <code>5</code> is an <code>int</code> (System.Int32), <code>2.5</code> is a <code>double</code>, and <code>"5"</code> in quotes is a <code>string</code>, even though it looks like a number. <code>.Name</code> gives the short type name without <code>System.</code>.</p>` },
        { type: "fill", prompt: "Give each variable the most fitting type.", code: R`___ productName = "Desk lamp";
___ quantity = 3;
___ unitPrice = 24.90m;
___ inStock = true;`, blanks: [["string", "var"], ["int", "var"], ["decimal", "var"], ["bool", "var"]], explain: R`<p>Text is <code>string</code>, a whole count is <code>int</code>, money with the <code>m</code> suffix is <code>decimal</code>, and true/false is <code>bool</code>. <code>var</code> also works for each, because every line has a value the compiler can read the type from.</p>` },
        { type: "bug", prompt: "This program does not compile. Why?", code: R`int lives = 3;
Console.WriteLine(lives);
lives = "three";
Console.WriteLine(lives);`, options: ["You cannot change a variable after it is declared", R`<code>lives</code> is an <code>int</code>, so it cannot hold a string: error CS0029`, R`You must write <code>int lives = "three";</code> to change it`, R`<code>Console.WriteLine</code> cannot print an <code>int</code>`], answer: 1, explain: R`<p>Changing a variable's value is fine (<code>lives = 2;</code> would work). Changing its <em>type</em> is not. Repeating <code>int</code> would declare a second variable with the same name, which is a different error (CS0128). <code>WriteLine</code> prints any type.</p>` },
        { type: "mcq", prompt: "Which of these is a valid variable name in C#?", options: ["2ndPlace", "total-price", "class", "_count"], answer: 3, explain: R`<p>Names may contain letters, digits and underscores, but cannot start with a digit (<code>2ndPlace</code>), cannot contain a minus sign (the compiler reads <code>total-price</code> as a subtraction), and cannot be a keyword (<code>class</code>). <code>_count</code> is valid. You will see a leading underscore later, for private fields in classes.</p>` },
        { type: "mcq", prompt: R`What happens with <code>var result;</code> on its own line?`, options: ["result becomes an object that can hold anything", "result becomes an int with value 0", "Compile error CS0818: Implicitly-typed variables must be initialized", "It works, and the type is decided at run time"], answer: 2, explain: R`<p><code>var</code> asks the compiler to read the type from the value. With no value there is nothing to read. <code>var</code> never means "any type" and never decides at run time; the type is fixed at compile time.</p>` }
      ],
      takeaways: [
        "A variable has a type, a name and a value: int count = 3;",
        "The type is fixed forever; assigning a different type is error CS0029.",
        "var lets the compiler infer the type from the value; it is still static typing.",
        "Use decimal for money, double for measurements, int for counts.",
        "Name local variables in camelCase and make the name describe the value."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m02-l02",
      title: "Numbers in depth",
      minutes: 24,
      objectives: [
        "Know the ranges of the integer types and what overflow does",
        "Predict the result of integer division and the % operator",
        "Explain why 0.1 + 0.2 is not exactly 0.3 with double",
        "Choose decimal for money and write numeric literals with suffixes and separators"
      ],
      blocks: [
        { type: "text", html: R`<p>Numbers in a computer live in a fixed amount of memory. That gives each numeric type a <strong>range</strong> (smallest and largest value) and, for fractional types, a <strong>precision</strong> (how many digits it keeps). Every type has <code>MinValue</code> and <code>MaxValue</code> so you can check.</p>` },
        { type: "table", headers: ["Type", "Size", "Range / precision", "Literal"], rows: [
          [R`<code>byte</code>`, "8 bits", "0 to 255", R`<code>(byte)200</code>`],
          [R`<code>short</code>`, "16 bits", "-32,768 to 32,767", R`<code>(short)1000</code>`],
          [R`<code>int</code>`, "32 bits", "-2,147,483,648 to 2,147,483,647", R`<code>42</code>`],
          [R`<code>long</code>`, "64 bits", "about ±9.2 × 10<sup>18</sup>", R`<code>42L</code>`],
          [R`<code>float</code>`, "32 bits", "about 7 digits", R`<code>3.14f</code>`],
          [R`<code>double</code>`, "64 bits", "about 15-16 digits", R`<code>3.14</code> or <code>3.14d</code>`],
          [R`<code>decimal</code>`, "128 bits", "28-29 exact decimal digits", R`<code>3.14m</code>`]
        ] },
        { type: "code", code: R`Console.WriteLine(int.MinValue);
Console.WriteLine(int.MaxValue);
Console.WriteLine(long.MaxValue);
Console.WriteLine(byte.MaxValue);`, output: "-2147483648\n2147483647\n9223372036854775807\n255" },
        { type: "text", html: R`<p>What happens if you go past the maximum? By default, C# does <strong>not</strong> stop you at run time. The value <strong>overflows</strong> and silently wraps around to the other end, like a car odometer rolling over. This is fast, and it is a classic source of bugs.</p><p>Wrap the calculation in <code>checked( )</code> and an overflow throws a <code>System.OverflowException</code> instead, so the mistake is loud. If the compiler can see the overflow in constant values, such as <code>int x = int.MaxValue + 1;</code>, it refuses with <code>error CS0220: The operation overflows at compile time in checked mode</code>.</p>` },
        { type: "code", code: R`int big = int.MaxValue;
big = big + 1;
Console.WriteLine(big);

int counter = 2_000_000_000;
int doubled = counter * 2;
Console.WriteLine(doubled);

long safe = counter * 2L;
Console.WriteLine(safe);`, output: "-2147483648\n-294967296\n4000000000" },
        { type: "callout", tone: "tip", title: "Making overflow loud", html: R`<p>Use <code>checked(a * b)</code> for one calculation, or add <code>&lt;CheckForOverflowUnderflow&gt;true&lt;/CheckForOverflowUnderflow&gt;</code> to the <code>.csproj</code> to check all arithmetic in the project. Many teams turn it on for Debug builds. Above, <code>counter * 2L</code> works because the <code>L</code> makes 2 a <code>long</code>, so the whole multiplication happens in 64 bits.</p>` },
        { type: "text", html: R`<p>When both sides of <code>/</code> are integers, C# does <strong>integer division</strong>: the result is an integer and the fractional part is thrown away (cut toward zero, never rounded). The <code>%</code> operator gives the <strong>remainder</strong>. If at least one side is a <code>double</code> or <code>decimal</code>, you get a fractional result.</p>` },
        { type: "code", code: R`Console.WriteLine(7 / 2);     // integer division
Console.WriteLine(7 % 2);     // remainder
Console.WriteLine(7 / 2.0);   // one side is double
Console.WriteLine(-7 / 2);    // cut toward zero
Console.WriteLine(125 / 60 + " min " + 125 % 60 + " s");`, output: "3\n1\n3.5\n-3\n2 min 5 s" },
        { type: "text", html: R`<p><code>double</code> and <code>float</code> store numbers in <strong>binary</strong>. Many simple decimal fractions, like 0.1, have no exact binary form, just as 1/3 has no exact decimal form (0.333...). So tiny rounding errors appear. <code>decimal</code> stores numbers in base 10, so 0.1 is exact. That makes <code>decimal</code> the right choice for money. It is slower and has a smaller range than <code>double</code>, which is why science and graphics code uses <code>double</code>.</p>` },
        { type: "code", code: R`double d = 0.1 + 0.2;
Console.WriteLine(d);
Console.WriteLine(d == 0.3);

decimal m = 0.1m + 0.2m;
Console.WriteLine(m);
Console.WriteLine(m == 0.3m);

Console.WriteLine(10 / 3.0);
Console.WriteLine(10m / 3);`, output: "0.30000000000000004\nFalse\n0.3\nTrue\n3.3333333333333335\n3.3333333333333333333333333333" },
        { type: "code", title: "Literal tricks", code: R`int million = 1_000_000;     // _ only helps humans read
long distance = 384_400_000L;
int mask = 0xFF;             // hexadecimal
int flags = 0b0000_1010;     // binary
float ratio = 0.75f;         // f = float
decimal fee = 2.50m;         // m = decimal

Console.WriteLine(million);
Console.WriteLine(distance);
Console.WriteLine(mask + " " + flags);
Console.WriteLine(ratio + " " + fee);`, output: "1000000\n384400000\n255 10\n0.75 2.50" },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p>Python's <code>int</code> grows as big as needed and never overflows. A C# <code>int</code> is exactly 32 bits and wraps. Python has two division operators (<code>7 / 2</code> is 3.5, <code>7 // 2</code> is 3); C# picks based on the types, so <code>7 / 2</code> is 3. Watch negative numbers: Python's <code>-7 // 2</code> is -4 (rounds down), C#'s <code>-7 / 2</code> is -3 (cuts toward zero). C# <code>decimal</code> is like Python's <code>Decimal</code>, built in. Also, writing <code>decimal fee = 2.50;</code> without the <code>m</code> is an error: <code>CS0664: Literal of type double cannot be implicitly converted to type 'decimal'; use an 'M' suffix</code>.</p>` }
      ],
      exercises: [
        { type: "output", prompt: "What does this program print?", code: R`int total = 17;
int groups = 5;
Console.WriteLine(total / groups);
Console.WriteLine(total % groups);
Console.WriteLine(total / 5.0);`, answer: "3\n2\n3.4", explain: R`<p>17 / 5 with two ints is integer division: 3 (the .4 is dropped, not rounded). The remainder is 17 - 3 × 5 = 2. With <code>5.0</code> one side is a double, so you get 3.4.</p>` },
        { type: "output", prompt: "What does this program print?", code: R`double a = 0.1 + 0.2;
decimal b = 0.1m + 0.2m;
Console.WriteLine(a == 0.3);
Console.WriteLine(b == 0.3m);`, answer: "False\nTrue", explain: R`<p>With <code>double</code>, 0.1 and 0.2 are stored as close binary approximations, and their sum is 0.30000000000000004, which is not equal to the double nearest 0.3. <code>decimal</code> works in base 10, so the sum is exactly 0.3. Never compare money stored in <code>double</code> with <code>==</code>.</p>` },
        { type: "fill", prompt: "Add the suffixes so this compiles. The price is money; the ratio is a float.", code: R`decimal price = 19.99___;
float ratio = 0.5___;`, blanks: [["m", "M"], ["f", "F"]], explain: R`<p>A number with a decimal point is a <code>double</code> by default. <code>m</code> makes it a <code>decimal</code> and <code>f</code> makes it a <code>float</code>. Without them both lines fail with error CS0664 ("use an 'M' suffix" and "use an 'F' suffix"), because C# will not silently change a number's precision.</p>` },
        { type: "bug", prompt: "A game stores the total points of all players. After a big tournament the total suddenly shows a negative number. What is the most likely cause?", code: R`int totalPoints = 0;
totalPoints = totalPoints + 1_500_000_000;
totalPoints = totalPoints + 1_500_000_000;
Console.WriteLine(totalPoints);`, options: ["Console.WriteLine cannot print large numbers", R`The sum passed <code>int.MaxValue</code> (about 2.1 billion) and wrapped around; use <code>long</code>`, "The underscores in the numbers change their value", R`<code>int</code> can only hold numbers up to 32,767`], answer: 1, explain: R`<p>3 billion does not fit in an <code>int</code>, so the value silently overflows and wraps to a negative number (-1294967296). Use <code>long</code> for values that can grow this large, and consider <code>checked</code> so the problem is reported. Underscores are only visual separators. 32,767 is the limit of <code>short</code>, not <code>int</code>.</p>` },
        { type: "mcq", prompt: "You are writing an invoicing app. Which type should hold amounts like 1,249.99?", options: ["int", "float", "double", "decimal"], answer: 3, explain: R`<p><code>decimal</code> stores base-10 digits exactly, so cents add up the way accountants expect. <code>float</code> and <code>double</code> make tiny binary rounding errors that show up as wrong totals. <code>int</code> could work if you stored whole cents, but then every display and calculation must remember to divide by 100.</p>` }
      ],
      takeaways: [
        "Each numeric type has a fixed range; check it with MinValue and MaxValue.",
        "Integer overflow wraps silently by default; use checked or a bigger type like long.",
        "int / int gives an int (fraction cut toward zero); % gives the remainder.",
        "double is fast but binary, so 0.1 + 0.2 != 0.3; decimal is exact base 10: use it for money.",
        "Suffixes L, f and m set a literal's type; _ separators make long numbers readable."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m02-l03",
      title: "Operators and precedence",
      minutes: 16,
      objectives: [
        "Use arithmetic, compound assignment, increment and comparison operators",
        "Predict the order of evaluation using precedence and parentheses",
        "Use the Math class for powers, roots, rounding and limits"
      ],
      blocks: [
        { type: "text", html: R`<p>An <strong>operator</strong> is a symbol that does something with values: <code>+</code> adds, <code>&lt;</code> compares, and so on. An <strong>expression</strong> is any piece of code that produces a value, like <code>price * 2</code>. You already know the arithmetic operators <code>+ - * / %</code>.</p><p>Programs update variables all the time, so C# has short forms. <code>x += 5</code> means <code>x = x + 5</code>. The same works for <code>-=</code>, <code>*=</code>, <code>/=</code> and <code>%=</code>. To add or subtract exactly 1, use <code>++</code> and <code>--</code>.</p>` },
        { type: "code", code: R`int coins = 10;
coins += 5;    // 15
coins -= 3;    // 12
coins *= 2;    // 24
coins /= 5;    // 4 (integer division)
coins %= 3;    // 1
Console.WriteLine(coins);

int lives = 3;
lives++;
lives++;
lives--;
Console.WriteLine(lives);`, output: "1\n4" },
        { type: "text", html: R`<p><code>++</code> comes in two flavors, and the difference only matters when you use the result in the same expression. <strong>Postfix</strong> <code>x++</code> gives you the <em>old</em> value, then adds 1. <strong>Prefix</strong> <code>++x</code> adds 1 first, then gives you the <em>new</em> value. Many style guides say: use <code>++</code> on its own line, so nobody has to think about it.</p>` },
        { type: "code", code: R`int a = 5;
int b = a++;   // b gets 5, then a becomes 6
Console.WriteLine($"a={a}, b={b}");

int c = 5;
int d = ++c;   // c becomes 6, then d gets 6
Console.WriteLine($"c={c}, d={d}");`, output: "a=6, b=5\nc=6, d=6" },
        { type: "text", html: R`<p><strong>Comparison operators</strong> produce a <code>bool</code>: <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. Note that equality is <code>==</code> with two signs; a single <code>=</code> is assignment. <strong>Logical operators</strong> combine bools: <code>&amp;&amp;</code> (and), <code>||</code> (or), <code>!</code> (not). Module 3 uses these heavily for decisions.</p>` },
        { type: "code", code: R`int age = 20;
bool hasTicket = true;

Console.WriteLine(age >= 18);
Console.WriteLine(age == 21);
Console.WriteLine(age != 21);
Console.WriteLine(age >= 18 && hasTicket);
Console.WriteLine(age < 12 || age > 65);
Console.WriteLine(!hasTicket);`, output: "True\nFalse\nTrue\nTrue\nFalse\nFalse" },
        { type: "table", headers: ["Precedence (high to low)", "Operators"], rows: [
          ["Primary and unary", R`<code>x++  x--  ++x  --x  !x  -x  (type)x</code>`],
          ["Multiplicative", R`<code>*  /  %</code>`],
          ["Additive", R`<code>+  -</code>`],
          ["Comparison", R`<code>&lt;  &gt;  &lt;=  &gt;=</code>, then <code>==  !=</code>`],
          ["Logical AND", R`<code>&amp;&amp;</code>`],
          ["Logical OR", R`<code>||</code>`],
          ["Null-coalescing (lesson 6)", R`<code>??</code>`],
          ["Assignment", R`<code>=  +=  -=  *=  /=  %=  ??=</code>`]
        ] },
        { type: "text", html: R`<p>Operators higher in the table run first. Operators on the same level run left to right. When in doubt, add parentheses: they always win, and they make your intent clear to the next reader. Precedence also explains a famous surprise with strings. <code>+</code> means "add" for numbers and "join" for strings, and it goes left to right. Once a string appears, everything after it is joined as text.</p>` },
        { type: "code", code: R`Console.WriteLine(2 + 3 * 4);
Console.WriteLine((2 + 3) * 4);
Console.WriteLine(20 - 10 - 5);
Console.WriteLine(1 + 2 + "3");
Console.WriteLine("1" + 2 + 3);
Console.WriteLine("1" + (2 + 3));`, output: "14\n20\n5\n33\n123\n15" },
        { type: "text", html: R`<p>C# has no power operator: <code>^</code> means something else (bitwise XOR), so <code>2 ^ 3</code> is 1, not 8. For powers, roots and other math, use the <code>Math</code> class. Most of its methods work with <code>double</code>.</p>` },
        { type: "code", code: R`Console.WriteLine(Math.Pow(2, 10));
Console.WriteLine(Math.Sqrt(81));
Console.WriteLine(Math.Abs(-7));
Console.WriteLine(Math.Max(4, 9) + " " + Math.Min(4, 9));
Console.WriteLine(Math.Round(2.567, 2));
Console.WriteLine(Math.Floor(2.9) + " " + Math.Ceiling(2.1));
Console.WriteLine(Math.Clamp(150, 0, 100));`, output: "1024\n9\n7\n9 4\n2.57\n2 3\n100" },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p>Python's <code>and</code>, <code>or</code>, <code>not</code> are <code>&amp;&amp;</code>, <code>||</code>, <code>!</code> in C#. Python's <code>2 ** 10</code> is <code>Math.Pow(2, 10)</code>. Python has no <code>++</code>; C# does. In Python <code>"1" + 2</code> is a <code>TypeError</code>; in C# it quietly becomes <code>"12"</code>, because C# turns the number into text when one side of <code>+</code> is a string. Python allows <code>1 &lt; x &lt; 10</code>; in C# write <code>1 &lt; x &amp;&amp; x &lt; 10</code>.</p>` }
      ],
      exercises: [
        { type: "output", prompt: "What does this program print?", code: R`int x = 10;
int y = x++;
int z = ++x;
Console.WriteLine(x);
Console.WriteLine(y);
Console.WriteLine(z);`, answer: "12\n10\n12", explain: R`<p><code>y = x++</code> stores the old value 10 in <code>y</code>, then <code>x</code> becomes 11. <code>z = ++x</code> first makes <code>x</code> 12, then stores 12 in <code>z</code>. So x is 12, y is 10, z is 12.</p>` },
        { type: "output", prompt: "What does this program print?", code: R`int apples = 3;
int pears = 4;
Console.WriteLine("Total: " + apples + pears);
Console.WriteLine("Total: " + (apples + pears));
Console.WriteLine(apples + pears + " fruits");`, answer: "Total: 34\nTotal: 7\n7 fruits", explain: R`<p><code>+</code> runs left to right. In line 1, <code>"Total: " + apples</code> is already a string, so <code>pears</code> is joined as text: "34". The parentheses in line 2 add the numbers first. In line 3 the two ints are added (7) before the string appears. Interpolation (<code>$"Total: {apples + pears}"</code>) avoids this trap.</p>` },
        { type: "fill", prompt: R`Use compound assignment to add 50 to <code>balance</code>, then the increment operator to add 1 to <code>visits</code>.`, code: R`decimal balance = 100m;
int visits = 0;
balance ___ 50;
visits___;`, blanks: [["+="], ["++"]], explain: R`<p><code>balance += 50</code> is short for <code>balance = balance + 50</code>. <code>visits++</code> adds exactly 1. Writing <code>balance + 50;</code> alone would not compile (CS0201), because it computes a value and throws it away.</p>` },
        { type: "mcq", prompt: R`What is the value of <code>10 - 4 / 2 * 3 + 1</code>?`, options: ["10", "5", "-2", "4"], answer: 1, explain: R`<p><code>/</code> and <code>*</code> run first, left to right: 4 / 2 = 2, then 2 * 3 = 6. Then <code>-</code> and <code>+</code> left to right: 10 - 6 = 4, then 4 + 1 = 5. Answer 10 would come from adding before multiplying, and -2 from computing 4 + 1 first.</p>` },
        { type: "bug", prompt: R`This should print 1024 (2 to the power of 10). It prints 8. Why?`, code: R`int result = 2 ^ 10;
Console.WriteLine(result);`, options: [R`<code>^</code> is bitwise XOR in C#, not "power"; use <code>Math.Pow(2, 10)</code>`, "int cannot hold 1024", "The operands must be doubles", "Precedence: it needs parentheses"], answer: 0, explain: R`<p>In C#, <code>^</code> compares the bits of 2 (0010) and 10 (1010) and gives 1000, which is 8. Use <code>Math.Pow(2, 10)</code>, which returns the double 1024. An <code>int</code> holds up to about 2.1 billion, so 1024 fits easily, and parentheses would not change a single operator.</p>` }
      ],
      takeaways: [
        "x += 5 is short for x = x + 5; ++ and -- add or subtract 1.",
        "x++ gives the old value, ++x the new one; keep them on their own line to avoid confusion.",
        "* / % run before + -, comparisons before && and ||; parentheses beat everything.",
        R`Once a string appears in a + chain, the rest is joined as text: "1" + 2 + 3 is "123".`,
        "Use Math.Pow for powers; ^ is XOR in C#."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m02-l04",
      title: "Converting between types",
      minutes: 22,
      objectives: [
        "Tell implicit conversions from explicit casts, and know what casts lose",
        "Convert text to numbers with Parse and, safely, with TryParse",
        "Choose between a cast, Convert, Parse, TryParse and ToString"
      ],
      blocks: [
        { type: "text", html: R`<p>Values often need to change type. The user types text but you need a number. You computed a <code>double</code> but need an <code>int</code>. C# has clear rules for this.</p><p>An <strong>implicit conversion</strong> happens automatically when nothing can be lost: <code>int</code> to <code>long</code>, <code>int</code> to <code>double</code>, <code>int</code> to <code>decimal</code>. Going the other way can lose information, so C# demands an <strong>explicit cast</strong>: the target type in parentheses. Without it you get <code>error CS0266: Cannot implicitly convert type 'double' to 'int'. An explicit conversion exists (are you missing a cast?)</code>.</p>` },
        { type: "code", code: R`int small = 42;
long bigger = small;      // implicit: always safe
double asDouble = small;  // implicit: always safe
Console.WriteLine(bigger + " " + asDouble);

double price = 3.99;
int whole = (int)price;   // explicit cast: cuts the fraction
Console.WriteLine(whole);
Console.WriteLine((int)-3.99);

int share = 7;
double half = (double)share / 2;  // cast first, then divide
Console.WriteLine(half);`, output: "42 42\n3\n-3\n3.5" },
        { type: "callout", tone: "warning", title: "A cast is a promise, and the compiler believes you", html: R`<p>Casting <code>double</code> to <code>int</code> truncates (cuts toward zero). It never rounds: <code>(int)3.99</code> is 3. Casting a value that does not fit, like <code>(byte)300</code> from a variable, wraps around and gives 44, with no error. Only cast when you know the value fits, or use <code>checked</code>. Also note the order in <code>(double)share / 2</code>: the cast applies to <code>share</code> first. <code>(double)(share / 2)</code> would do integer division first and give 3.</p>` },
        { type: "text", html: R`<p>Text that looks like a number is still text. <code>"42" + 1</code> is <code>"421"</code>. To turn a string into a number, use <strong>Parse</strong>: <code>int.Parse</code>, <code>double.Parse</code>, <code>decimal.Parse</code> and so on. Parse is strict. If the text is not a valid number, it throws a <code>FormatException</code>, and an empty or null string crashes it too. That is fine for data you control. For anything a user types, it is a crash waiting to happen.</p>` },
        { type: "code", code: R`string text = "42";
Console.WriteLine(text + 1);
Console.WriteLine(int.Parse(text) + 1);

decimal amount = decimal.Parse("19.95");
Console.WriteLine(amount * 2);

bool flag = bool.Parse("True");
Console.WriteLine(!flag);`, output: "421\n43\n39.90\nFalse" },
        { type: "text", html: R`<p>For user input, professionals use <strong>TryParse</strong>. It never throws. It returns a <code>bool</code> that says whether it worked, and hands back the number through an <code>out</code> parameter. <code>out int number</code> declares a new variable right there and lets TryParse fill it. If parsing fails, the number is set to 0. You usually combine it with <code>if</code> (properly taught in Module 3):</p>` },
        { type: "code", code: R`string input1 = "125";
string input2 = "12 apples";

bool ok1 = int.TryParse(input1, out int n1);
bool ok2 = int.TryParse(input2, out int n2);
Console.WriteLine($"{ok1} {n1}");
Console.WriteLine($"{ok2} {n2}");

if (int.TryParse(" 30 ", out int minutes))
{
    Console.WriteLine($"{minutes * 60} seconds");
}`, output: "True 125\nFalse 0\n1800 seconds" },
        { type: "code", title: "Reading a number from the user", code: R`Console.Write("How many tickets? ");
string? line = Console.ReadLine();

if (int.TryParse(line, out int tickets))
{
    Console.WriteLine($"Total: {tickets * 12.50m}");
}
else
{
    Console.WriteLine("That is not a whole number.");
}` },
        { type: "text", html: R`<p>Two more tools. <code>Convert.ToInt32</code>, <code>Convert.ToDouble</code> and friends convert between many types. Unlike a cast, <code>Convert.ToInt32(double)</code> <em>rounds</em>, using "banker's rounding": a value exactly halfway goes to the nearest even number. <code>Math.Round</code> does the same by default; pass <code>MidpointRounding.AwayFromZero</code> to get the school-book rule. Going the other way, every value has <code>ToString()</code> to turn it into text. Characters are numbers underneath, so you can cast between <code>char</code> and <code>int</code> too.</p>` },
        { type: "code", code: R`Console.WriteLine(Convert.ToInt32(3.7));
Console.WriteLine(Convert.ToInt32(2.5) + " " + Convert.ToInt32(3.5));
Console.WriteLine(Math.Round(2.5));
Console.WriteLine(Math.Round(2.5, MidpointRounding.AwayFromZero));

int count = 7;
string label = count.ToString() + " items";
Console.WriteLine(label);

Console.WriteLine((int)'A');
Console.WriteLine((char)66);`, output: "4\n2 4\n2\n3\n7 items\n65\nB" },
        { type: "table", headers: ["You have", "You want", "Use"], rows: [
          ["int", "long, double, decimal", "Nothing: implicit conversion"],
          ["double", "int (drop the fraction)", R`Cast: <code>(int)x</code>`],
          ["double", "int (rounded)", R`<code>(int)Math.Round(x, MidpointRounding.AwayFromZero)</code> or <code>Convert.ToInt32(x)</code>`],
          ["string you trust", "number", R`<code>int.Parse(s)</code>, <code>decimal.Parse(s)</code>`],
          ["string from a user or file", "number", R`<code>int.TryParse(s, out int n)</code>`],
          ["anything", "string", R`<code>x.ToString()</code> or interpolation <code>$"{x}"</code>`]
        ] },
        { type: "callout", tone: "deep", title: "Parsing depends on the computer's culture", html: R`<p>Parse and TryParse read numbers using the current culture settings. On a computer set to German, <code>decimal.Parse("3.14")</code> gives 314, because there the comma is the decimal separator and the dot groups thousands. For data in files and network messages, pass <code>CultureInfo.InvariantCulture</code> (from <code>using System.Globalization;</code>): <code>decimal.Parse("3.14", CultureInfo.InvariantCulture)</code>. For text typed by a user, the current culture is usually what they expect. Module 11 returns to this.</p>` }
      ],
      exercises: [
        { type: "output", prompt: "What does this program print?", code: R`double temp = 98.6;
int a = (int)temp;
int b = Convert.ToInt32(temp);
int c = (int)-2.9;
Console.WriteLine(a);
Console.WriteLine(b);
Console.WriteLine(c);`, answer: "98\n99\n-2", explain: R`<p>A cast cuts the fraction: 98.6 becomes 98. <code>Convert.ToInt32</code> rounds: 99. Casting -2.9 cuts toward zero, giving -2 (not -3, which rounding down would give).</p>` },
        { type: "output", prompt: "What does this program print?", code: R`bool ok = int.TryParse("4O", out int n);
Console.WriteLine(ok);
Console.WriteLine(n);
Console.WriteLine(int.TryParse("40", out int m));
Console.WriteLine(m + 2);`, answer: "False\n0\nTrue\n42", explain: R`<p>Look closely: <code>"4O"</code> uses the letter O, not a zero, so parsing fails. TryParse returns false and sets <code>n</code> to 0 instead of crashing. <code>"40"</code> parses, and 40 + 2 is 42.</p>` },
        { type: "fill", prompt: "Safely read an age the user typed. Fill in the method and the keyword.", code: R`string? text = Console.ReadLine();
if (int.___(text, ___ int age))
{
    Console.WriteLine($"Next year you will be {age + 1}.");
}`, blanks: [["TryParse"], ["out"]], explain: R`<p><code>int.TryParse</code> returns true or false and fills <code>age</code> through the <code>out</code> parameter. It also accepts <code>null</code> (it just returns false), which is why it fits perfectly with <code>ReadLine</code>. <code>int.Parse</code> would crash on bad input and has no <code>out</code> parameter.</p>` },
        { type: "bug", prompt: "This program crashes when the user types \"ten\". What is the best fix?", code: R`Console.Write("Quantity: ");
string line = Console.ReadLine() ?? "";
int quantity = int.Parse(line);
Console.WriteLine(quantity * 3);`, options: ["Use (int)line instead", R`Use <code>int.TryParse(line, out int quantity)</code> and handle the false case`, R`Use <code>Convert.ToInt32(line)</code>`, "Use double.Parse instead"], answer: 1, explain: R`<p><code>int.Parse</code> throws a <code>FormatException</code> on text like "ten". You cannot cast a string to int at all (CS0030). <code>Convert.ToInt32(string)</code> calls <code>int.Parse</code> underneath and throws the same exception. <code>double.Parse</code> fails on "ten" too. TryParse lets you react to bad input calmly.</p>` },
        { type: "mcq", prompt: R`Why does <code>int whole = 7.5;</code> fail to compile, while <code>double d = 7;</code> works?`, options: ["Because 7.5 is too large for int", "Converting double to int can lose information, so C# requires an explicit cast; int to double is always safe", "Because doubles cannot be stored in variables", "It is a bug in the compiler"], answer: 1, explain: R`<p>C# only converts automatically when nothing can be lost. Every <code>int</code> fits in a <code>double</code>, but <code>7.5</code> would lose its <code>.5</code> as an int, so the compiler reports CS0266 and asks you to write <code>(int)7.5</code> to show you mean it. Size is not the issue: 7.5 is tiny.</p>` }
      ],
      takeaways: [
        "Widening conversions (int to long or double) are implicit; narrowing ones need a cast.",
        "A cast to int truncates toward zero; Convert.ToInt32 and Math.Round round (banker's rounding by default).",
        "Parse throws on bad text; TryParse returns false and is the right tool for user input.",
        "ToString() or interpolation turns any value into text.",
        "Parsing depends on culture; use CultureInfo.InvariantCulture for files and data."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m02-l05",
      title: "Strings and formatting",
      minutes: 24,
      objectives: [
        "Format numbers with interpolation, format specifiers and alignment",
        "Use common string methods: Length, ToUpper, Trim, Contains, Replace, Substring, Split",
        "Explain why strings are immutable and what that means for your code"
      ],
      blocks: [
        { type: "text", html: R`<p>You have used interpolation already: <code>$"Hello {name}"</code>. Inside the braces you can put any expression, not just a variable. After the expression you can add a <strong>format specifier</strong> after a colon, and an <strong>alignment</strong> after a comma: <code>{value,width:format}</code>.</p>` },
        { type: "code", code: R`decimal price = 1234.5m;
double ratio = 0.8765;
int id = 42;

Console.WriteLine($"{price:F2}");    // fixed, 2 decimals
Console.WriteLine($"{price:N2}");    // with group separators
Console.WriteLine($"{ratio:F1}");
Console.WriteLine($"{id:D5}");       // pad with zeros
Console.WriteLine($"{255:X}");       // hexadecimal
Console.WriteLine($"{price * 2:F0}");
Console.WriteLine($"Items: {3 + 4}");`, output: "1234.50\n1,234.50\n0.9\n00042\nFF\n2469\nItems: 7" },
        { type: "table", headers: ["Specifier", "Meaning", "Example", "Result*"], rows: [
          [R`<code>F2</code>`, "Fixed-point, 2 decimals", R`<code>{3.14159:F2}</code>`, "3.14"],
          [R`<code>N0</code>`, "Number with group separators", R`<code>{1234567:N0}</code>`, "1,234,567"],
          [R`<code>P1</code>`, "Percent (multiplies by 100)", R`<code>{0.256:P1}</code>`, "25.6%"],
          [R`<code>C</code>`, "Currency of the current culture", R`<code>{9.5m:C}</code>`, "$9.50"],
          [R`<code>D4</code>`, "Integer padded with zeros", R`<code>{7:D4}</code>`, "0007"],
          [R`<code>0.00</code>`, "Custom pattern", R`<code>{2.5:0.00}</code>`, "2.50"]
        ] },
        { type: "callout", tone: "note", title: "*Results depend on culture", html: R`<p>The results above are for US English. Formatting uses the computer's culture settings: in France <code>{1234.5:N2}</code> gives <code>1 234,50</code>, and <code>C</code> shows € instead of $. On servers and in containers the culture is often "invariant", where <code>C</code> shows the odd symbol <code>¤</code> and <code>P1</code> shows <code>25.6 %</code> with a space. To force a culture, pass it: <code>price.ToString("C", CultureInfo.GetCultureInfo("en-US"))</code>. In this course's examples, outputs show the invariant culture.</p>` },
        { type: "text", html: R`<p><strong>Alignment</strong> pads a value with spaces to a fixed width. A positive width aligns right (good for numbers); a negative width aligns left (good for text). Combined with format specifiers, this makes tidy tables and receipts.</p>` },
        { type: "code", code: R`Console.WriteLine($"[{"Coffee",-10}][{3.5m,8:F2}]");
Console.WriteLine($"[{"Bagel",-10}][{12m,8:F2}]");
Console.WriteLine($"[{"Total",-10}][{15.5m,8:F2}]");`, output: "[Coffee    ][    3.50]\n[Bagel     ][   12.00]\n[Total     ][   15.50]" },
        { type: "text", html: R`<p>Strings come with many useful methods and one property, <code>Length</code>. Positions in a string start at <strong>0</strong>, so the first character is <code>s[0]</code>. <code>Substring(start, length)</code> copies a piece. <code>IndexOf</code> finds where something starts, or returns -1 if it is missing.</p>` },
        { type: "code", code: R`string email = "  Ada.Lovelace@Example.com ";
string clean = email.Trim().ToLower();

Console.WriteLine(clean);
Console.WriteLine(clean.Length);
Console.WriteLine(clean[0]);
Console.WriteLine(clean.Contains("@"));
Console.WriteLine(clean.StartsWith("ada"));
Console.WriteLine(clean.IndexOf('@'));
Console.WriteLine(clean.Substring(0, 3));
Console.WriteLine(clean.Replace("example", "test"));
Console.WriteLine("Ada".PadRight(6, '.') + "|");`, output: "ada.lovelace@example.com\n24\na\nTrue\nTrue\n12\nada\nada.lovelace@test.com\nAda...|" },
        { type: "code", title: "Split and Join", code: R`string csv = "red,green,blue";
string[] parts = csv.Split(',');
Console.WriteLine(parts.Length);
Console.WriteLine(parts[1]);
Console.WriteLine(string.Join(" | ", parts));
Console.WriteLine(string.Equals("YES", "yes",
    StringComparison.OrdinalIgnoreCase));`, output: "3\ngreen\nred | green | blue\nTrue" },
        { type: "text", html: R`<p>Strings are <strong>immutable</strong>: once created, a string never changes. Methods like <code>ToUpper</code>, <code>Trim</code> and <code>Replace</code> do not touch the original. They build and return a <em>new</em> string. If you do not store that result, it is thrown away. This is one of the most common beginner bugs, and the compiler will not warn you about it.</p>` },
        { type: "code", code: R`string city = "paris";
city.ToUpper();               // result thrown away!
Console.WriteLine(city);

city = city.ToUpper();        // store the new string
Console.WriteLine(city);`, output: "paris\nPARIS" },
        { type: "callout", tone: "deep", title: "Why immutable?", html: R`<p>Because strings never change, they are safe to share. Two variables can point at the same text, and neither can surprise the other. They can be used safely from many threads at once, and .NET can reuse identical string literals. The cost: building a long string piece by piece in a loop creates many temporary strings. For that case .NET has <code>StringBuilder</code>, covered in Module 13. Also note that <code>==</code> compares the <em>text</em> of two strings, case-sensitively: <code>"Yes" == "yes"</code> is false.</p>` }
      ],
      exercises: [
        { type: "output", prompt: "What does this program print?", code: R`string word = "  Hello World  ";
string t = word.Trim();
Console.WriteLine(t.Length);
Console.WriteLine(t.ToUpper());
Console.WriteLine(t.Substring(6));
Console.WriteLine(t.IndexOf("o"));
Console.WriteLine(t.Replace("l", "L"));`, answer: "11\nHELLO WORLD\nWorld\n4\nHeLLo WorLd", explain: R`<p>After <code>Trim</code>, "Hello World" has 11 characters. <code>Substring(6)</code> starts at position 6 (counting from 0: H=0, e=1, l=2, l=3, o=4, space=5, W=6) and takes the rest. <code>IndexOf("o")</code> finds the <em>first</em> o, at 4. <code>Replace</code> changes every lowercase l.</p>` },
        { type: "output", prompt: "What does this program print?", code: R`string name = "bob";
name.ToUpper();
name.Replace("b", "r");
Console.WriteLine(name);
string shout = name.ToUpper() + "!";
Console.WriteLine(shout);`, answer: "bob\nBOB!", explain: R`<p>Lines 2 and 3 create new strings and throw them away, because strings are immutable and nothing stores the result. <code>name</code> is still "bob". Line 5 stores the uppercase copy plus "!" in a new variable.</p>` },
        { type: "fill", prompt: R`Print the price with exactly two decimals, right-aligned in 8 characters: <code>[   19.50]</code>.`, code: R`decimal price = 19.5m;
Console.WriteLine($"[{price,___:___}]");`, blanks: [["8"], ["F2", "0.00", "f2"]], explain: R`<p>The alignment comes after a comma (<code>8</code> means 8 wide, right-aligned; <code>-8</code> would align left). The format comes after a colon: <code>F2</code> means two fixed decimals. <code>N2</code> would also give 19.50 here, but would add group separators for values over 999.</p>` },
        { type: "bug", prompt: "The program should ignore spaces the user typed around their answer, but \"  yes \" is never accepted. What is wrong?", code: R`string answer = "  yes ";
answer.Trim();
Console.WriteLine(answer == "yes");`, options: [R`<code>==</code> cannot compare strings in C#`, R`<code>Trim</code> returns a new string; the result must be stored: <code>answer = answer.Trim();</code>`, R`<code>Trim</code> only removes spaces at the start`, R`The comparison needs <code>Equals</code> with <code>"YES"</code>`], answer: 1, explain: R`<p>Strings are immutable, so <code>answer.Trim()</code> leaves <code>answer</code> unchanged. Store the result. In C#, <code>==</code> compares string contents, so it works once the spaces are gone. <code>Trim</code> removes whitespace at both ends (<code>TrimStart</code>/<code>TrimEnd</code> do one side).</p>` },
        { type: "mcq", prompt: R`What does <code>"Programming".Substring(3, 4)</code> return?`, options: ["\"gram\"", "\"ogra\"", "\"gramm\"", "\"rogr\""], answer: 0, explain: R`<p>Positions start at 0: P=0, r=1, o=2, g=3. <code>Substring(3, 4)</code> starts at position 3 and takes 4 characters: g, r, a, m. "ogra" would come from counting positions from 1. The second argument is a length, not an end position.</p>` }
      ],
      takeaways: [
        "Interpolation holds any expression: {value,width:format}.",
        "F2, N2, D5, X, P and C are the format specifiers you will use most; results depend on culture.",
        "Positive width aligns right, negative aligns left: perfect for tables.",
        "String positions start at 0; Substring(start, length) takes a length.",
        "Strings are immutable: methods return a new string, so always store the result."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m02-l06",
      title: "null, nullable types and const",
      minutes: 18,
      objectives: [
        "Explain what null means and which types can hold it",
        "Use nullable value types such as int? with HasValue and Value",
        "Supply fallbacks with ?? and ??=",
        "Declare constants with const and know their limits"
      ],
      blocks: [
        { type: "text", html: R`<p><code>null</code> means "no value at all". It is different from 0, which is a number, and from <code>""</code>, which is a string with no characters. A missing middle name, a reading that has not arrived yet, a ReadLine after input has ended: all of these are naturally null.</p><p>C# has two families of types. <strong>Value types</strong> like <code>int</code>, <code>double</code>, <code>decimal</code>, <code>bool</code> and <code>char</code> always contain a value, so they cannot be null: <code>int x = null;</code> gives <code>error CS0037: Cannot convert null to 'int' because it is a non-nullable value type</code>. <strong>Reference types</strong> like <code>string</code> can be null. Module 6 explains the two families in detail.</p>` },
        { type: "text", html: R`<p>Sometimes a number really can be missing: a customer may not have given their age. Add <code>?</code> to a value type to make it <strong>nullable</strong>: <code>int?</code> can hold any int <em>or</em> null. Ask <code>HasValue</code> to see whether a value is there, and read it with <code>Value</code>. Reading <code>Value</code> when there is none throws an <code>InvalidOperationException</code>. <code>GetValueOrDefault()</code> gives the value, or 0 when there is none.</p>` },
        { type: "code", code: R`int? age = null;
Console.WriteLine(age.HasValue);
Console.WriteLine($"[{age}]");          // null prints as nothing
Console.WriteLine(age.GetValueOrDefault());

age = 34;
Console.WriteLine(age.HasValue);
Console.WriteLine(age.Value + 1);

int? noAnswer = null;
Console.WriteLine(noAnswer + 5 == null);  // math with null is null`, output: "False\n[]\n0\nTrue\n35\nTrue" },
        { type: "text", html: R`<p>The <strong>null-coalescing operator</strong> <code>??</code> says "use the left value, unless it is null; then use the right one". It is the neatest way to supply a default. Its partner <code>??=</code> assigns only when the variable is currently null. Both work with nullable value types and with reference types like <code>string?</code>.</p>` },
        { type: "code", code: R`int? savedVolume = null;
int volume = savedVolume ?? 50;
Console.WriteLine(volume);

string? nickname = null;
string displayName = nickname ?? "Guest";
Console.WriteLine(displayName);

string? theme = null;
theme ??= "dark";      // was null, so assign
theme ??= "light";     // not null any more: no change
Console.WriteLine(theme);

int? a = null;
int? b = null;
int c = a ?? b ?? -1;  // first non-null wins
Console.WriteLine(c);`, output: "50\nGuest\ndark\n-1" },
        { type: "code", title: "Typical pattern with ReadLine", code: R`Console.Write("City (Enter for London): ");
string city = Console.ReadLine() ?? "";
if (city.Trim() == "")
{
    city = "London";
}
Console.WriteLine($"Weather for {city}");` },
        { type: "callout", tone: "note", title: "string? and nullable reference types", html: R`<p>With <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> in the project file, the compiler tracks which <code>string</code> variables might be null. <code>string?</code> says "may be null"; plain <code>string</code> says "never null". If you might put null into a plain <code>string</code>, you get warning CS8600. If you call a method on a <code>string?</code> without checking, you get <code>warning CS8602: Dereference of a possibly null reference.</code> These are warnings, not errors, but at run time that mistake becomes a <code>NullReferenceException</code>, the most common crash in .NET. Module 8 covers this in depth.</p>` },
        { type: "text", html: R`<p>Some values never change: the number of days in a week, a tax rate fixed by law, the maximum length of a username. Mark them <code>const</code>. A constant must get its value where it is declared, and that value must be known at compile time (numbers, strings, bools, chars). Trying to change it later fails with <code>error CS0131: The left-hand side of an assignment must be a variable, property or indexer</code>. By convention, C# constants use PascalCase, not ALL_CAPS.</p>` },
        { type: "code", code: R`const int DaysPerWeek = 7;
const decimal VatRate = 0.20m;
const string AppName = "Budgeteer";

int weeks = 3;
decimal net = 50m;

Console.WriteLine($"{AppName}: {weeks * DaysPerWeek} days");
Console.WriteLine($"VAT: {net * VatRate:F2}");
Console.WriteLine($"Gross: {net * (1 + VatRate):F2}");`, output: "Budgeteer: 21 days\nVAT: 10.00\nGross: 60.00" },
        { type: "callout", tone: "tip", title: "Why use constants at all?", html: R`<p>A bare number like <code>0.20m</code> scattered through code is called a <em>magic number</em>: nobody knows what it means, and when the rate changes you must find every copy. A named constant explains itself and lives in one place. Use <code>const</code> for values that are truly fixed forever. For values that are set once at run time (such as a value read from a settings file) you will later use <code>readonly</code> fields, in Module 6.</p>` },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p><code>null</code> is C#'s <code>None</code>. Python's <code>x if x is not None else default</code> is C#'s <code>x ?? default</code>. Python has no real constants (just a naming habit like <code>MAX_SIZE</code>); C# <code>const</code> is enforced by the compiler. And in Python any variable can be <code>None</code>; in C# only reference types and <code>T?</code> value types can.</p>` }
      ],
      exercises: [
        { type: "output", prompt: "What does this program print?", code: R`int? stock = null;
Console.WriteLine(stock ?? 0);
Console.WriteLine(stock.HasValue);
stock = 12;
Console.WriteLine(stock ?? 0);
string? note = null;
note ??= "none";
note ??= "ignored";
Console.WriteLine(note);`, answer: "0\nFalse\n12\nnone", explain: R`<p><code>stock ?? 0</code> gives 0 while stock is null, and 12 after it is set. <code>??=</code> assigns only if the variable is null, so the first one sets "none" and the second one does nothing.</p>` },
        { type: "output", prompt: "What does this program print?", code: R`const int MaxUsers = 5;
int current = 3;
int? reserved = null;
int free = MaxUsers - current - (reserved ?? 0);
Console.WriteLine($"Free seats: {free}");
reserved = 1;
free = MaxUsers - current - (reserved ?? 0);
Console.WriteLine($"Free seats: {free}");`, answer: "Free seats: 2\nFree seats: 1", explain: R`<p>First, <code>reserved ?? 0</code> is 0, so 5 - 3 - 0 = 2. After <code>reserved = 1</code> it is 5 - 3 - 1 = 1. The parentheses matter: <code>??</code> has very low precedence, so without them <code>MaxUsers - current - reserved ?? 0</code> would compute the subtraction (a nullable int) first.</p>` },
        { type: "fill", prompt: R`Declare <code>rating</code> so it can hold an int or null, then print it with a fallback of 0.`, code: R`___ rating = null;
Console.WriteLine(rating ___ 0);`, blanks: [["int?", "Nullable<int>"], ["??"]], explain: R`<p><code>int?</code> is a nullable int (short for <code>Nullable&lt;int&gt;</code>). Plain <code>int rating = null;</code> is error CS0037. <code>??</code> supplies the fallback when the left side is null.</p>` },
        { type: "bug", prompt: "This program does not compile. Why?", code: R`const decimal ShippingFee = 4.99m;
decimal total = 20m + ShippingFee;
ShippingFee = 0m;
Console.WriteLine(total);`, options: ["const values must be int", R`A <code>const</code> cannot be changed after declaration: error CS0131`, R`You cannot add a <code>const</code> to a variable`, R`<code>4.99m</code> needs to be <code>4.99</code>`], answer: 1, explain: R`<p>Constants are fixed at compile time and can never be assigned again. Any type with a literal value can be <code>const</code>, including <code>decimal</code> and <code>string</code>. Using a constant in arithmetic is fine. The <code>m</code> suffix is required for a decimal literal. If the fee must change at run time, it should be a normal variable.</p>` },
        { type: "mcq", prompt: "Which of these declarations compiles?", options: [R`<code>int count = null;</code>`, R`<code>bool? accepted = null;</code>`, R`<code>var name = null;</code>`, R`<code>const int Year;</code>`], answer: 1, explain: R`<p><code>bool?</code> is a nullable bool, so null is allowed. A plain <code>int</code> cannot be null (CS0037). <code>var</code> cannot infer a type from <code>null</code> alone (CS0815). A <code>const</code> must be given its value right away (CS0145).</p>` }
      ],
      takeaways: [
        "null means no value; it is not 0 and not \"\".",
        "Value types (int, double, bool) cannot be null unless you add ?: int?, double?, bool?.",
        "Check HasValue before reading Value, or use GetValueOrDefault().",
        "a ?? b gives a unless it is null; x ??= y assigns only when x is null.",
        "const makes a compile-time constant; name it in PascalCase and use it instead of magic numbers."
      ]
    }
  ],
  // --------------------------------------------------------------------
  milestone: {
    id: "m02-project",
    title: "Bill Splitter",
    brief: R`<p>A group of friends has finished dinner and nobody wants to do the math. Build a console tool that asks for the bill, the tip percentage and the number of people, then prints a clear receipt showing what each person pays.</p><p>Money must be exact, so every amount is a <code>decimal</code>. Splitting money has a classic problem: 100.00 split three ways is 33.333... Each share is rounded to the cent, and because rounding can make the shares not add up, the <strong>last person</strong> pays whatever is left so the total is always exactly right.</p><p>Inputs come from the user, so read them with <code>TryParse</code>. An empty answer for tip or people uses a default. A bill that is not a valid positive number ends the program with a friendly message. (You will learn loops to re-ask in Module 3.)</p>`,
    skills: ["decimal arithmetic", "decimal.TryParse / int.TryParse", "Math.Round with MidpointRounding", "const", "?? with ReadLine", "format specifiers and alignment"],
    requirements: [
      "Declare constants for the default tip (15) and the default number of people (1).",
      "Ask for the bill amount and read it with decimal.TryParse. If it is not a number greater than 0, print \"Invalid bill amount.\" and stop (use return).",
      "Ask for the tip percent. An empty answer uses the default; a value that is not a whole number from 0 to 100 also falls back to the default, with a short note.",
      "Ask for the number of people. An empty or invalid answer, or a number below 1, uses the default.",
      "Compute tip = bill × percent / 100, rounded to 2 decimals with MidpointRounding.AwayFromZero, and total = bill + tip.",
      "Compute each share as total / people rounded to 2 decimals; the last person pays total minus the other shares.",
      "Print a receipt where labels are left-aligned in 16 characters and amounts right-aligned in 10 characters with 2 decimals.",
      "Use only decimal for money (no double), and never crash on empty or missing input."
    ],
    sampleRun: R`=== Bill Splitter ===
Bill amount: 87.45
Tip percent (Enter for 15): 18
Number of people (Enter for 1): 3

Bill                 87.45
Tip (18%)            15.74
Total               103.19
--------------------------
Each of 2 pays       34.40
Last person pays     34.39`,
    starter: R`// Bill Splitter
const int DefaultTipPercent = 15;
const int DefaultPeople = 1;

Console.WriteLine("=== Bill Splitter ===");

// TODO 1: Ask for the bill. Use decimal.TryParse.
//         If it fails or bill <= 0, print a message and return.
Console.Write("Bill amount: ");
string billText = Console.ReadLine() ?? "";
decimal bill = 0m;

// TODO 2: Ask for the tip percent (Enter = default).
int tipPercent = DefaultTipPercent;

// TODO 3: Ask for the number of people (Enter = default).
int people = DefaultPeople;

// TODO 4: Compute tip and total, rounded to 2 decimals.
decimal tip = 0m;
decimal total = bill + tip;

// TODO 5: Compute each share and what the last person pays.
decimal share = total;
decimal lastShare = total;

// TODO 6: Print the receipt with aligned columns.
Console.WriteLine();
Console.WriteLine($"{"Bill",-16}{bill,10:F2}");
Console.WriteLine($"{"Total",-16}{total,10:F2}");
Console.WriteLine($"{share} {lastShare} {billText} {tipPercent} {people}");`,
    hints: [
      R`<p>Read every answer the same way: <code>string text = Console.ReadLine() ?? "";</code>. Then empty input and ended input (null) look the same: an empty string. Check it with <code>text.Trim() == ""</code> or <code>string.IsNullOrWhiteSpace(text)</code>.</p>`,
      R`<p>For the bill: <code>if (!decimal.TryParse(billText, out decimal bill) || bill &lt;= 0) { Console.WriteLine("Invalid bill amount."); return; }</code>. The <code>!</code> means "not", and <code>||</code> means "or". <code>return;</code> in top-level code ends the program.</p>`,
      R`<p>For the tip: start with <code>int tipPercent = DefaultTipPercent;</code>. If the text is not empty, try <code>int.TryParse(tipText, out int parsed)</code>, and only copy <code>parsed</code> into <code>tipPercent</code> when it worked and is between 0 and 100.</p>`,
      R`<p>Rounding: <code>Math.Round(bill * tipPercent / 100, 2, MidpointRounding.AwayFromZero)</code>. Shares: <code>decimal share = Math.Round(total / people, 2, MidpointRounding.AwayFromZero);</code> then <code>decimal lastShare = total - share * (people - 1);</code>.</p>`,
      R`<p>Alignment: <code>$"{"Tip (" + tipPercent + "%)",-16}{tip,10:F2}"</code>. The label is an expression, so you can build it inside the braces. Labels use <code>-16</code> (left), amounts use <code>10:F2</code> (right, two decimals).</p>`
    ],
    solution: R`// Bill Splitter: splits a restaurant bill fairly, to the cent.
const int DefaultTipPercent = 15;
const int DefaultPeople = 1;
const int MaxTipPercent = 100;

Console.WriteLine("=== Bill Splitter ===");

// ---- Bill ----
Console.Write("Bill amount: ");
string billText = Console.ReadLine() ?? "";

if (!decimal.TryParse(billText, out decimal bill) || bill <= 0)
{
    Console.WriteLine("Invalid bill amount.");
    return;
}

// ---- Tip percent ----
Console.Write($"Tip percent (Enter for {DefaultTipPercent}): ");
string tipText = (Console.ReadLine() ?? "").Trim();
int tipPercent = DefaultTipPercent;

if (tipText != "")
{
    bool tipOk = int.TryParse(tipText, out int parsedTip);
    if (tipOk && parsedTip >= 0 && parsedTip <= MaxTipPercent)
    {
        tipPercent = parsedTip;
    }
    else
    {
        Console.WriteLine($"Using default tip of {DefaultTipPercent}%.");
    }
}

// ---- Number of people ----
Console.Write($"Number of people (Enter for {DefaultPeople}): ");
string peopleText = (Console.ReadLine() ?? "").Trim();
int people = DefaultPeople;

if (int.TryParse(peopleText, out int parsedPeople)
    && parsedPeople >= 1)
{
    people = parsedPeople;
}

// ---- Calculations (decimal only) ----
decimal tip = Math.Round(bill * tipPercent / 100, 2,
    MidpointRounding.AwayFromZero);
decimal total = bill + tip;

decimal share = Math.Round(total / people, 2,
    MidpointRounding.AwayFromZero);
decimal lastShare = total - share * (people - 1);

// ---- Receipt ----
string tipLabel = $"Tip ({tipPercent}%)";

Console.WriteLine();
Console.WriteLine($"{"Bill",-16}{bill,10:F2}");
Console.WriteLine($"{tipLabel,-16}{tip,10:F2}");
Console.WriteLine($"{"Total",-16}{total,10:F2}");
Console.WriteLine(new string('-', 26));

if (people == 1)
{
    Console.WriteLine($"{"You pay",-16}{total,10:F2}");
}
else if (share == lastShare)
{
    string label = $"Each of {people} pays";
    Console.WriteLine($"{label,-16}{share,10:F2}");
}
else
{
    string label = $"Each of {people - 1} pays";
    Console.WriteLine($"{label,-16}{share,10:F2}");
    Console.WriteLine($"{"Last person pays",-16}{lastShare,10:F2}");
}`,
    stretch: [
      "Let the user choose to round each share UP to the next whole currency unit (Math.Ceiling), and show how much extra tip that adds.",
      "Ask for a tax percentage too, applied to the bill before the tip.",
      R`Make the bill input culture-safe: accept both <code>12.50</code> and <code>12,50</code> by replacing a comma with a dot and parsing with <code>CultureInfo.InvariantCulture</code>.`,
      "Print the tip as a share of the total too, using the P1 format specifier."
    ]
  }
});
})();
