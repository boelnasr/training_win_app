(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m03",
  number: 3,
  title: "Control Flow",
  tagline: "if, switch and loops: teach your program to choose and repeat.",
  level: "Beginner",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m03-l01",
      title: "if, else and Boolean Logic",
      minutes: 20,
      objectives: [
        "Write if, else if and else chains that pick exactly one path",
        "Combine conditions with &&, || and !",
        "Use short-circuit evaluation to guard against null and errors",
        "Choose between an if statement and the ?: operator"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>So far your programs ran every line from top to bottom. Real programs need to <strong>choose</strong>. Should we charge shipping? Is the password long enough? Did the player win?</p>
<p>Every choice in C# comes down to a <code>bool</code>: a value that is either <code>true</code> or <code>false</code>. The <code>if</code> statement runs a block of code only when its condition is <code>true</code>.</p>`
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int age = 17;

if (age >= 18)
{
    Console.WriteLine("You can vote.");
}
else
{
    Console.WriteLine("Not yet. Wait " + (18 - age) + " year(s).");
}

Console.WriteLine("Done.");`,
          output: `Not yet. Wait 1 year(s).
Done.`
        },
        {
          type: "text",
          html: `<p>The condition goes in parentheses. The code to run goes in braces. <code>else</code> is optional and runs when the condition is <code>false</code>. Either way, the program carries on after the whole statement.</p>
<p>Conditions are usually built from <strong>comparison operators</strong>, and comparisons are joined with <strong>logical operators</strong>:</p>`
        },
        {
          type: "table",
          headers: ["Operator", "Meaning", "Example (x = 5)"],
          rows: [
            ["<code>==</code>", "equal to", "<code>x == 5</code> is true"],
            ["<code>!=</code>", "not equal to", "<code>x != 5</code> is false"],
            ["<code>&lt;</code> <code>&gt;</code>", "less / greater than", "<code>x &lt; 10</code> is true"],
            ["<code>&lt;=</code> <code>&gt;=</code>", "or equal", "<code>x &gt;= 5</code> is true"],
            ["<code>&amp;&amp;</code>", "AND: both must be true", "<code>x &gt; 0 &amp;&amp; x &lt; 3</code> is false"],
            ["<code>||</code>", "OR: at least one true", "<code>x &lt; 0 || x == 5</code> is true"],
            ["<code>!</code>", "NOT: flips true/false", "<code>!(x == 5)</code> is false"]
          ]
        },
        {
          type: "code",
          title: "else if chains",
          code: String.raw`int score = 82;
string grade;

if (score >= 90)
{
    grade = "A";
}
else if (score >= 80)
{
    grade = "B";
}
else if (score >= 70)
{
    grade = "C";
}
else
{
    grade = "F";
}

Console.WriteLine($"Score {score} is a {grade}.");`,
          output: `Score 82 is a B.`
        },
        {
          type: "text",
          html: `<p>C# tests the conditions from top to bottom and runs the <strong>first</strong> branch that matches. The rest are skipped. That is why the order matters: <code>score &gt;= 80</code> does not need to also say <code>score &lt; 90</code>, because any score of 90 or more was already caught by the first branch.</p>
<p>Notice that <code>grade</code> is declared without a value. The compiler checks that every path assigns it. Remove the final <code>else</code> and you get <strong>error CS0165: Use of unassigned local variable 'grade'</strong>, because a score of 50 would leave it empty.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "= is not ==",
          html: `<p>Writing <code>if (x = 5)</code> is a classic slip. In C# it does not compile: <strong>error CS0029: Cannot implicitly convert type 'int' to 'bool'</strong>. The single <code>=</code> assigns, and an <code>int</code> is not a <code>bool</code>. The same error appears for <code>if (count)</code> when <code>count</code> is a number. C# never treats numbers as true or false, so you must say what you mean: <code>if (count &gt; 0)</code>.</p>`
        },
        {
          type: "text",
          html: `<p><strong>Short-circuit evaluation.</strong> <code>&amp;&amp;</code> and <code>||</code> stop as soon as the answer is known. With <code>A &amp;&amp; B</code>, if <code>A</code> is false the whole thing is false, so <code>B</code> is never evaluated. With <code>A || B</code>, if <code>A</code> is true, <code>B</code> is skipped.</p>
<p>Professionals rely on this every day to guard risky checks. Put the safe test first and the risky one second. (The single <code>&amp;</code> and <code>|</code> operators also work on bools but always evaluate both sides, so stick to <code>&amp;&amp;</code> and <code>||</code> in conditions.)</p>`
        },
        {
          type: "code",
          title: "Guarding against null",
          code: String.raw`string? name = null;

// Safe: name.Length is only read when name is not null.
if (name != null && name.Length > 3)
{
    Console.WriteLine("Long name");
}
else
{
    Console.WriteLine("Missing or short name");
}

// Reversed order would crash with NullReferenceException:
// if (name.Length > 3 && name != null) ...`,
          output: `Missing or short name`
        },
        {
          type: "code",
          title: "The conditional operator ?:",
          code: String.raw`int items = 1;
string word = items == 1 ? "item" : "items";
Console.WriteLine($"You have {items} {word}.");

int stock = 0;
Console.WriteLine(stock > 0 ? "In stock" : "Sold out");`,
          output: `You have 1 item.
Sold out`
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: `<ul><li><code>and</code>, <code>or</code>, <code>not</code> become <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>.</li><li><code>elif</code> becomes <code>else if</code>.</li><li>Parentheses around the condition are required. Braces mark the block, not indentation.</li><li>No truthiness: <code>if my_list:</code> has no direct twin. Write <code>if (list.Count &gt; 0)</code> or <code>if (text != "")</code>.</li><li><code>a if cond else b</code> becomes <code>cond ? a : b</code>.</li></ul>`
        },
        {
          type: "callout",
          tone: "tip",
          title: "Always use braces",
          html: `<p>C# lets you drop the braces when a branch has one statement. Teams usually forbid it. Later someone adds a second line that looks like it is inside the <code>if</code> but always runs. Braces cost nothing and remove that whole class of bug.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this program print?</p>`,
          code: String.raw`int temp = 25;
bool raining = false;

if (temp > 30 || raining)
{
    Console.WriteLine("Stay inside");
}
else if (temp > 20 && !raining)
{
    Console.WriteLine("Go to the beach");
}
else
{
    Console.WriteLine("Take a walk");
}`,
          answer: `Go to the beach`,
          explain: `<p><code>temp &gt; 30</code> is false and <code>raining</code> is false, so the first <code>||</code> is false. The second condition is <code>true &amp;&amp; true</code>, so that branch runs. The <code>else</code> is skipped because a branch already matched.</p>`
        },
        {
          type: "mcq",
          prompt: `<p><code>int count = 3;</code> What happens with <code>if (count) { ... }</code>?</p>`,
          options: [
            "It runs the block, because 3 is non-zero",
            "It skips the block",
            "Compile error CS0029: cannot convert int to bool",
            "It throws an exception at runtime"
          ],
          answer: 2,
          explain: `<p>C# has no truthiness. An <code>if</code> needs a <code>bool</code>, and there is no automatic conversion from <code>int</code>. The compiler stops you before the program ever runs, so it cannot skip or throw. Write <code>if (count &gt; 0)</code>.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the code so it prints "Welcome" only when the user is at least 18 <strong>and</strong> has a ticket, and "Sorry" otherwise.</p>`,
          code: String.raw`int age = 20;
bool hasTicket = true;

if (age >= 18 ___ hasTicket)
{
    Console.WriteLine("Welcome");
}
___
{
    Console.WriteLine("Sorry");
}`,
          blanks: [["&&"], ["else"]],
          explain: `<p><code>&amp;&amp;</code> requires both sides to be true. A single <code>&amp;</code> would also compile but always evaluates both sides, and <code>||</code> would let in anyone with a ticket. <code>else</code> catches every other case.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This code sometimes crashes with <code>NullReferenceException</code>. Why?</p>`,
          code: String.raw`string? input = Console.ReadLine();

if (input.Length > 0 && input != null)
{
    Console.WriteLine("You typed: " + input);
}`,
          options: [
            "&& should be ||",
            "The null check comes after input.Length is read",
            "Console.ReadLine never returns null",
            "Length should be Count"
          ],
          answer: 1,
          explain: `<p>Short-circuiting works left to right. Here <code>input.Length</code> runs first, so a null input crashes before the null check gets a chance. Swap the two tests. Changing to <code>||</code> would make it worse, and <code>ReadLine</code> does return null when input ends. Strings use <code>Length</code>, so that part is correct.</p>`
        },
        {
          type: "order",
          prompt: `<p>Put these lines in order to print "Even" or "Odd" for <code>n</code>.</p>`,
          lines: [
            "int n = 7;",
            "if (n % 2 == 0)",
            "{",
            "    Console.WriteLine(\"Even\");",
            "}",
            "else",
            "{ Console.WriteLine(\"Odd\"); }"
          ],
          explain: `<p>Declare the variable first, then the condition, then the true block, then <code>else</code> with its block. <code>n % 2</code> is the remainder after dividing by 2, which is 0 for even numbers.</p>`
        }
      ],
      takeaways: [
        "if runs a block only when its bool condition is true; else handles the rest.",
        "In an else if chain, the first matching branch wins and the rest are skipped.",
        "&& and || short-circuit, so put the safe check (like != null) first.",
        "C# has no truthiness: if (count) is error CS0029.",
        "cond ? a : b picks between two values in a single expression."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m03-l02",
      title: "switch Statements and Expressions",
      minutes: 22,
      objectives: [
        "Write a switch statement with case labels and default",
        "Explain why C# forbids fall-through between cases",
        "Turn a value into another value with a switch expression",
        "Use relational (<, >=) and logical (and, or, not) patterns"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>When you compare one value against many possibilities, a long <code>else if</code> chain gets noisy. The <code>switch</code> statement reads better: name the value once, then list the cases.</p>`
        },
        {
          type: "code",
          title: "switch statement",
          code: String.raw`int day = 6;

switch (day)
{
    case 1:
        Console.WriteLine("Monday");
        break;
    case 2:
    case 3:
    case 4:
        Console.WriteLine("Midweek");
        break;
    case 5:
        Console.WriteLine("Friday!");
        break;
    case 6:
    case 7:
        Console.WriteLine("Weekend");
        break;
    default:
        Console.WriteLine("Not a day");
        break;
}`,
          output: `Weekend`
        },
        {
          type: "text",
          html: `<p>Each <code>case</code> label is a value to match. Stacking several labels with nothing between them means "any of these". <code>default</code> runs when nothing else matched. Every section must end with <code>break</code> (or <code>return</code>, <code>throw</code>, <code>continue</code>), which jumps out of the switch.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "No accidental fall-through",
          html: `<p>In C and Java, forgetting <code>break</code> silently runs the next case too. C# refuses to compile it: <strong>error CS0163: Control cannot fall through from one case label ('case 1:') to another</strong>. Stacked empty labels like <code>case 2: case 3:</code> are fine because there is no code between them.</p>`
        },
        {
          type: "text",
          html: `<p>Very often you do not want to <em>do</em> something in each case. You want to <em>produce a value</em>. That is what the <strong>switch expression</strong> (C# 8 and later) is for. The value comes first, then <code>switch</code>, then arms written as <code>pattern =&gt; result</code>, separated by commas.</p>`
        },
        {
          type: "code",
          title: "switch expression",
          code: String.raw`int day = 3;

string name = day switch
{
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    6 or 7 => "Weekend",
    _ => "Other"
};

Console.WriteLine(name);`,
          output: `Wednesday`
        },
        {
          type: "text",
          html: `<p>The <code>_</code> is the <strong>discard pattern</strong>. It matches anything, so it plays the role of <code>default</code>. Arms are checked top to bottom and the first match wins. The whole thing is an expression, so it can sit on the right of <code>=</code>, inside <code>Console.WriteLine(...)</code>, or after <code>return</code>.</p>
<p>Patterns are not limited to exact values. <strong>Relational patterns</strong> use <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code>, <code>&gt;=</code>. <strong>Logical patterns</strong> combine them with the words <code>and</code>, <code>or</code>, <code>not</code>.</p>`
        },
        {
          type: "code",
          title: "Relational and logical patterns",
          code: String.raw`double[] temps = { -5, 8, 21, 35 };

foreach (double t in temps)
{
    string feel = t switch
    {
        < 0 => "freezing",
        >= 0 and < 15 => "cold",
        >= 15 and < 28 => "pleasant",
        _ => "hot"
    };
    Console.WriteLine($"{t,4}: {feel}");
}`,
          output: `  -5: freezing
   8: cold
  21: pleasant
  35: hot`
        },
        {
          type: "code",
          title: "Patterns with is, and guards with when",
          code: String.raw`int score = 95;

// 'is' + a pattern works in a plain if:
if (score is >= 90 and <= 100)
{
    Console.WriteLine("Top band");
}

// 'when' adds any extra condition to an arm:
int stock = 3;
bool isVip = true;
string message = stock switch
{
    0 => "Sold out",
    < 5 when isVip => "Low stock: reserved for you",
    < 5 => "Only a few left",
    _ => "Plenty available"
};
Console.WriteLine(message);`,
          output: `Top band
Low stock: reserved for you`
        },
        {
          type: "callout",
          tone: "deep",
          title: "The compiler checks your arms",
          html: `<p>A switch expression must produce a value for every input. If some input can slip through, you get <strong>warning CS8509: The switch expression does not handle all possible values of its input type</strong>. Ignore it and an unmatched value throws <code>SwitchExpressionException</code> at runtime. Add a <code>_</code> arm.</p>
<p>The compiler also catches arms that can never match. Putting <code>&gt; 0</code> before <code>&gt; 100</code> gives <strong>error CS8510: The pattern is unreachable</strong>, because every number above 100 was already taken by the first arm.</p>`
        },
        {
          type: "table",
          headers: ["", "switch statement", "switch expression"],
          rows: [
            ["Purpose", "run different statements", "compute a value"],
            ["Syntax", "<code>case X: ... break;</code>", "<code>X =&gt; value,</code>"],
            ["Fallback", "<code>default:</code>", "<code>_ =&gt;</code>"],
            ["Use when", "each case does several things", "each case maps to one result"]
          ]
        },
        {
          type: "callout",
          tone: "python",
          title: "Compared with match",
          html: `<p>Python 3.10's <code>match</code>/<code>case</code> is the closest relative. <code>case _:</code> is the same idea as C#'s <code>_</code>. Python uses <code>|</code> to combine alternatives where C# uses <code>or</code>, and Python guards use <code>if</code> where C# uses <code>when</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`int[] speeds = { 30, 55, 90 };

foreach (int s in speeds)
{
    string label = s switch
    {
        < 40 => "slow",
        >= 40 and <= 70 => "normal",
        _ => "fast"
    };
    Console.WriteLine(label);
}`,
          answer: `slow
normal
fast`,
          explain: `<p>30 matches <code>&lt; 40</code>. 55 fails the first arm and matches the range <code>&gt;= 40 and &lt;= 70</code>. 90 fails both and falls to the discard <code>_</code>.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the switch expression. Ages 13 to 19 inclusive are "teen", anything not listed is "adult".</p>`,
          code: String.raw`int age = 16;
string group = age switch
{
    < 13 => "child",
    >= 13 ___ <= 19 => "teen",
    ___ => "adult"
};
Console.WriteLine(group);`,
          blanks: [["and"], ["_"]],
          explain: `<p>Patterns use the keyword <code>and</code>, not <code>&amp;&amp;</code>. The discard <code>_</code> matches any value, so it acts as the fallback. Using <code>default</code> here does not compile because that keyword belongs to the switch <em>statement</em>.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>What happens when you compile this?</p>`,
          code: String.raw`int n = 150;
string size = n switch
{
    > 0 => "positive",
    > 100 => "big",
    _ => "other"
};`,
          options: [
            "It prints nothing but size is \"big\"",
            "size is \"positive\" and the code compiles cleanly",
            "Error CS8510: the > 100 arm is unreachable",
            "Warning CS8509: not exhaustive"
          ],
          answer: 2,
          explain: `<p>Every number above 100 is also above 0, so the first arm always wins and the second can never match. The compiler reports this as an error. The discard arm makes the expression exhaustive, so CS8509 does not appear. Fix it by putting the narrower <code>&gt; 100</code> arm first.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This switch statement does not compile. What is wrong?</p>`,
          code: String.raw`string cmd = "stop";
switch (cmd)
{
    case "go":
        Console.WriteLine("Moving");
    case "stop":
        Console.WriteLine("Stopped");
        break;
}`,
          options: [
            "You cannot switch on a string",
            "The \"go\" section is missing break, so it would fall through (CS0163)",
            "A default section is required",
            "case labels need parentheses"
          ],
          answer: 1,
          explain: `<p>C# allows switching on strings, and <code>default</code> is optional. The problem is that the <code>"go"</code> section has code but no <code>break</code>, so control would fall into <code>"stop"</code>. C# makes that a compile error to stop a whole family of bugs.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange the lines into a switch expression that converts a traffic light colour into an action.</p>`,
          lines: [
            "string light = \"amber\";",
            "string action = light switch",
            "{",
            "    \"green\" => \"Go\",",
            "    \"amber\" => \"Slow down\",",
            "    _ => \"Stop\"",
            "};"
          ],
          explain: `<p>The input value comes before <code>switch</code>. Specific arms come before the catch-all <code>_</code>, and the closing brace ends with a semicolon because the whole switch is part of an assignment statement.</p>`
        }
      ],
      takeaways: [
        "A switch statement runs code per case; every section must end with break or similar.",
        "C# forbids fall-through (CS0163), but stacked empty case labels are fine.",
        "A switch expression maps an input to a value: input switch { pattern => result, ... }.",
        "Patterns can be relational (< 10) and logical (and, or, not); _ is the fallback.",
        "Order arms from most specific to most general; unreachable arms are error CS8510."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m03-l03",
      title: "while and do-while Loops",
      minutes: 18,
      objectives: [
        "Repeat code with a while loop until a condition fails",
        "Identify the three parts of every loop: start, test, update",
        "Use do-while when the body must run at least once",
        "Spot and avoid infinite loops"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>A loop repeats code. The simplest loop, <code>while</code>, checks a condition and, if it is <code>true</code>, runs its body. Then it checks again. It stops the first time the condition is <code>false</code>.</p>`
        },
        {
          type: "code",
          title: "Countdown",
          code: String.raw`int count = 3;

while (count > 0)
{
    Console.WriteLine(count);
    count--;
}

Console.WriteLine("Liftoff!");`,
          output: `3
2
1
Liftoff!`
        },
        {
          type: "text",
          html: `<p>Every working loop has three parts:</p>
<ol><li><strong>Start</strong>: set up the variable the condition depends on (<code>int count = 3;</code>).</li><li><strong>Test</strong>: the condition checked before each pass (<code>count &gt; 0</code>).</li><li><strong>Update</strong>: something inside the body that moves toward the exit (<code>count--</code>).</li></ol>
<p>Forget the update and the condition never changes. The loop runs forever. The condition is checked <em>before</em> the first pass too, so a <code>while</code> loop can run zero times.</p>`
        },
        {
          type: "code",
          title: "When you do not know how many passes",
          code: String.raw`// How many years until savings double at 7% interest?
decimal balance = 1000m;
int years = 0;

while (balance < 2000m)
{
    balance *= 1.07m;
    years++;
}

Console.WriteLine($"Years: {years}");
Console.WriteLine($"Balance: {balance:F2}");`,
          output: `Years: 11
Balance: 2104.85`
        },
        {
          type: "text",
          html: `<p>This is the natural home of <code>while</code>: you know when to stop, but not how many passes it will take.</p>
<p>The <strong>do-while</strong> loop puts the test at the bottom. The body always runs at least once, then the condition decides whether to go again. Note the semicolon after the final <code>while (...)</code>.</p>`
        },
        {
          type: "code",
          title: "do-while runs at least once",
          code: String.raw`int n = 10;

do
{
    Console.WriteLine($"do-while body, n = {n}");
    n++;
} while (n < 5);

while (n < 5)
{
    Console.WriteLine("while body");
}

Console.WriteLine("End");`,
          output: `do-while body, n = 10
End`
        },
        {
          type: "text",
          html: `<p>The classic use is input validation: you must ask at least once, and you keep asking while the answer is bad. When reading the console, remember that <code>Console.ReadLine()</code> returns <code>null</code> when input runs out (for example, the user presses Ctrl+Z on Windows or Ctrl+D on Linux, or input is piped from a file). A robust loop handles that.</p>`
        },
        {
          type: "code",
          title: "Asking until the answer is valid",
          code: String.raw`int age;
bool valid;

do
{
    Console.Write("Enter your age: ");
    string? line = Console.ReadLine();
    if (line is null)
    {
        Console.WriteLine("No input. Bye.");
        return;
    }
    valid = int.TryParse(line, out age) && age >= 0;
    if (!valid)
    {
        Console.WriteLine("Please type a whole number.");
    }
} while (!valid);

Console.WriteLine($"Next year you will be {age + 1}.");`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Infinite loops and the stray semicolon",
          html: `<p>If your program hangs and prints nothing, suspect a loop whose condition never becomes false. Press <kbd>Ctrl</kbd>+<kbd>C</kbd> to stop it.</p>
<p>A sneaky cause is <code>while (count &gt; 0);</code> with a semicolon. That semicolon is an empty loop body, so the block below is not part of the loop and <code>count</code> never changes. The compiler warns about <code>if (x);</code> (CS0642) but stays silent for <code>while</code>.</p>`
        },
        {
          type: "callout",
          tone: "python",
          title: "No do-while in Python",
          html: `<p>Python only has <code>while</code>, so you may know the <code>while True: ... if done: break</code> idiom. That works in C# too (<code>while (true)</code>), and you will see it in lesson 5. <code>do-while</code> is the tidier choice when the exit test naturally sits at the bottom. Also, <code>count--</code> and <code>count++</code> exist in C# as short forms of <code>count -= 1</code> and <code>count += 1</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`int x = 1;
while (x < 50)
{
    x *= 3;
    Console.WriteLine(x);
}`,
          answer: `3
9
27
81`,
          explain: `<p>The test runs <em>before</em> each pass. When <code>x</code> is 27 the test <code>27 &lt; 50</code> is still true, so the body runs once more, prints 81, and only then does the test fail. The value printed can exceed the limit because the update happens before the print.</p>`
        },
        {
          type: "output",
          prompt: `<p>How many lines does this print, and what are they?</p>`,
          code: String.raw`int tries = 5;
do
{
    Console.WriteLine($"Try {tries}");
    tries++;
} while (tries < 3);
Console.WriteLine("Finished");`,
          answer: `Try 5
Finished`,
          explain: `<p>A do-while body always runs once, even though <code>5 &lt; 3</code> is false from the start. A plain <code>while</code> with the same condition would print only "Finished".</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the loop so the body always runs once and repeats while <code>attempts</code> is below 3.</p>`,
          code: String.raw`int attempts = 0;
___
{
    Console.WriteLine("Attempt " + attempts);
    attempts++;
} ___ (attempts < 3);`,
          blanks: [["do"], ["while"]],
          explain: `<p>A do-while starts with <code>do</code> and ends with <code>while (condition);</code>. The trailing semicolon is required here, unlike a normal <code>while</code> header.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This program never finishes. Why?</p>`,
          code: String.raw`int i = 0;
while (i < 5)
{
    Console.WriteLine(i);
}
i++;`,
          options: [
            "i++ is outside the loop body, so i never changes",
            "while needs a semicolon after the condition",
            "i should start at 1",
            "Console.WriteLine cannot print an int"
          ],
          answer: 0,
          explain: `<p>The update sits after the closing brace, so the loop body only prints. <code>i</code> stays 0 and the test is always true. Adding a semicolon after the condition would make it worse by creating an empty body. Starting at 1 changes nothing about the missing update.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Which loop fits best: "keep rolling a die until you get a 6"?</p>`,
          options: [
            "A while loop with the test at the top, because the roll might never happen",
            "A do-while loop, because you must roll at least once before you can check",
            "Either, but do-while needs a counter",
            "Neither; you need a for loop"
          ],
          answer: 1,
          explain: `<p>You cannot test for a 6 until you have rolled once, so the test naturally goes at the bottom. A <code>while</code> loop works only if you roll once before the loop, which duplicates code. A <code>for</code> loop is for a known number of passes, and you do not know how many rolls it will take.</p>`
        }
      ],
      takeaways: [
        "while tests before each pass and can run zero times.",
        "do-while tests after each pass and always runs at least once.",
        "Every loop needs a start, a test and an update that moves toward the exit.",
        "Console.ReadLine() can return null; input loops must handle it.",
        "A semicolon after while (...) creates an empty body and often an infinite loop."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m03-l04",
      title: "for, foreach and Nested Loops",
      minutes: 22,
      objectives: [
        "Write for loops that count up, count down and step",
        "Iterate arrays and strings with foreach",
        "Avoid off-by-one errors with < Length",
        "Build grids and tables with nested loops"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>When you know how many passes you need, the <code>for</code> loop puts all three loop parts on one line: <strong>start; test; update</strong>.</p>`
        },
        {
          type: "code",
          title: "for loop",
          code: String.raw`for (int i = 1; i <= 5; i++)
{
    Console.Write(i + " ");
}
Console.WriteLine();

// The same loop written with while:
int j = 1;
while (j <= 5)
{
    Console.Write(j + " ");
    j++;
}
Console.WriteLine();`,
          output: `1 2 3 4 5
1 2 3 4 5`
        },
        {
          type: "text",
          html: `<p>The <code>for</code> version is shorter and keeps the counter <code>i</code> inside the loop. After the loop ends, <code>i</code> no longer exists. Trying to use it gives <strong>error CS0103: The name 'i' does not exist in the current context</strong>. That is a feature: the counter cannot leak into later code by accident.</p>`
        },
        {
          type: "code",
          title: "Counting down and stepping",
          code: String.raw`for (int i = 10; i > 0; i -= 3)
{
    Console.Write(i + " ");
}
Console.WriteLine();

for (int i = 0; i <= 20; i += 5)
{
    Console.Write(i + " ");
}
Console.WriteLine();`,
          output: `10 7 4 1
0 5 10 15 20`
        },
        {
          type: "text",
          html: `<p><strong>foreach</strong> walks through every item of a collection without a counter. You will learn arrays properly in module 5. For now, <code>string[] names = { "Ana", "Ben" };</code> creates a list of strings, <code>names.Length</code> is how many there are, and <code>names[0]</code> is the first one. A <code>string</code> is also a collection: of <code>char</code> values.</p>`
        },
        {
          type: "code",
          title: "foreach over an array and a string",
          code: String.raw`string[] fruits = { "apple", "banana", "cherry" };

foreach (string fruit in fruits)
{
    Console.WriteLine(fruit.ToUpper());
}

int vowels = 0;
foreach (char c in "programming")
{
    if ("aeiou".Contains(c))
    {
        vowels++;
    }
}
Console.WriteLine($"Vowels: {vowels}");`,
          output: `APPLE
BANANA
CHERRY
Vowels: 3`
        },
        {
          type: "callout",
          tone: "warning",
          title: "Off by one",
          html: `<p>Indexes run from <code>0</code> to <code>Length - 1</code>. The safe loop header is <code>for (int i = 0; i &lt; arr.Length; i++)</code>. Writing <code>&lt;=</code> reads one past the end and throws <strong>IndexOutOfRangeException</strong> at runtime. The compiler cannot catch it. If you do not need the index, use <code>foreach</code> and the problem disappears.</p>`
        },
        {
          type: "callout",
          tone: "note",
          title: "foreach variables are read-only",
          html: `<p>Inside <code>foreach (char c in text)</code> you cannot write <code>c = 'x';</code>. It is <strong>error CS1656: Cannot assign to 'c' because it is a 'foreach iteration variable'</strong>. To change items in an array, use a <code>for</code> loop with an index: <code>arr[i] = ...</code>.</p>`
        },
        {
          type: "text",
          html: `<p>A loop can sit inside another loop. The inner loop runs <em>completely</em> for every single pass of the outer loop. Rows and columns are the classic example: outer loop picks the row, inner loop fills the row.</p>
<p>Costs multiply. Two nested loops of 1,000 passes each run the inner body 1,000,000 times. When a program is mysteriously slow, look for nested loops over large data first.</p>`
        },
        {
          type: "code",
          title: "Multiplication table",
          code: String.raw`for (int row = 1; row <= 4; row++)
{
    for (int col = 1; col <= 5; col++)
    {
        Console.Write($"{row * col,4}");
    }
    Console.WriteLine();
}`,
          output: `   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20`
        },
        {
          type: "code",
          title: "The inner loop can depend on the outer one",
          code: String.raw`for (int row = 1; row <= 4; row++)
{
    for (int star = 0; star < row; star++)
    {
        Console.Write("*");
    }
    Console.WriteLine();
}`,
          output: `*
**
***
****`
        },
        {
          type: "callout",
          tone: "python",
          title: "range() and for-in",
          html: `<p>Python's <code>for x in items:</code> is C#'s <code>foreach (var x in items)</code>. Python's <code>for i in range(5):</code> becomes <code>for (int i = 0; i &lt; 5; i++)</code>. And <code>range(10, 0, -3)</code> is <code>for (int i = 10; i &gt; 0; i -= 3)</code>. In both languages the end value is excluded when you use <code>&lt;</code>.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`int total = 0;
for (int i = 1; i <= 3; i++)
{
    for (int j = 1; j <= 2; j++)
    {
        total += i * j;
    }
}
Console.WriteLine(total);`,
          answer: `18`,
          explain: `<p>For each <code>i</code>, the inner loop adds <code>i * 1 + i * 2 = 3i</code>. Summing for i = 1, 2, 3 gives 3 + 6 + 9 = 18. The inner loop runs fully (twice) for every outer pass, so the body runs 6 times in total.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the loop header so it prints every element of <code>scores</code> by index.</p>`,
          code: String.raw`int[] scores = { 70, 85, 92 };
for (int i = 0; i ___ scores.___; i++)
{
    Console.WriteLine(scores[i]);
}`,
          blanks: [["<"], ["Length"]],
          explain: `<p>Valid indexes are 0, 1 and 2, so the loop must stop before reaching <code>Length</code> (3). Using <code>&lt;=</code> would try <code>scores[3]</code> and throw <code>IndexOutOfRangeException</code>. Arrays use <code>Length</code>; <code>Count</code> belongs to lists.</p>`
        },
        {
          type: "bug",
          prompt: `<p>This crashes at runtime. What is the bug?</p>`,
          code: String.raw`string[] names = { "Ana", "Ben", "Cy" };
for (int i = 0; i <= names.Length; i++)
{
    Console.WriteLine(names[i]);
}`,
          options: [
            "i should start at 1",
            "<= reads one past the last index",
            "string arrays cannot be indexed",
            "i++ should be ++i"
          ],
          answer: 1,
          explain: `<p>With 3 names the last valid index is 2, but <code>i &lt;= 3</code> lets <code>i</code> reach 3. Starting at 1 would skip "Ana" and still crash. <code>i++</code> and <code>++i</code> behave the same in the update slot.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>You want to double every number stored in an <code>int[]</code> array. Which loop can do it?</p>`,
          options: [
            "foreach (int n in nums) { n *= 2; }",
            "for (int i = 0; i < nums.Length; i++) { nums[i] *= 2; }",
            "Both work the same",
            "Neither; arrays are read-only"
          ],
          answer: 1,
          explain: `<p>The foreach variable is a read-only copy, so <code>n *= 2</code> is error CS1656. With a <code>for</code> loop you write through the index into the array itself. Arrays are not read-only.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange these lines to add up the numbers 1 to 100 and print the result.</p>`,
          lines: [
            "int sum = 0;",
            "for (int i = 1; i <= 100; i++)",
            "{",
            "    sum += i;",
            "}",
            "Console.WriteLine(sum);"
          ],
          explain: `<p>The accumulator <code>sum</code> must be declared before the loop, otherwise it would reset each pass and also vanish after the loop. The print goes after the closing brace so it runs once, giving 5050.</p>`
        }
      ],
      takeaways: [
        "for (start; test; update) is ideal when you know the number of passes.",
        "foreach reads every item of an array or string; its variable is read-only.",
        "Index loops use i < arr.Length; <= is the classic off-by-one crash.",
        "Inner loops run completely for each outer pass, so costs multiply.",
        "Loop variables declared in the for header disappear after the loop."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m03-l05",
      title: "break, continue and Loop Design",
      minutes: 22,
      objectives: [
        "Leave a loop early with break and skip a pass with continue",
        "Exit nested loops cleanly",
        "Generate random numbers with Random.Shared",
        "Design a loop by answering four questions before coding"
      ],
      blocks: [
        {
          type: "text",
          html: `<p>Two keywords change a loop's normal rhythm:</p>
<ul><li><code>break</code> leaves the loop immediately. Execution continues after the loop.</li><li><code>continue</code> skips the rest of the current pass and jumps to the next test (and, in a <code>for</code>, the update).</li></ul>`
        },
        {
          type: "code",
          title: "break: stop when found",
          code: String.raw`// First multiple of 7 above 50
int found = -1;
for (int n = 51; n < 100; n++)
{
    if (n % 7 == 0)
    {
        found = n;
        break;
    }
}
Console.WriteLine(found);`,
          output: `56`
        },
        {
          type: "code",
          title: "continue: skip what you do not want",
          code: String.raw`string[] lines = { "apples", "", "  ", "pears", "plums" };
int count = 0;

foreach (string line in lines)
{
    if (string.IsNullOrWhiteSpace(line))
    {
        continue; // skip blank entries
    }
    count++;
    Console.WriteLine($"{count}. {line}");
}`,
          output: `1. apples
2. pears
3. plums`
        },
        {
          type: "text",
          html: `<p><code>continue</code> is great for filtering at the top of a loop. It keeps the main logic unindented, instead of wrapping everything inside a big <code>if</code>. Professionals call this a <strong>guard</strong>: reject the cases you do not care about first.</p>`
        },
        {
          type: "callout",
          tone: "warning",
          title: "break only exits one loop",
          html: `<p>In nested loops, <code>break</code> leaves only the <strong>innermost</strong> loop. The outer loop keeps going. To stop everything, use a flag variable that the outer loop checks, or move the loops into a method and use <code>return</code> (module 4). C# has <code>goto</code>, but code reviewers will ask you to remove it.</p>`
        },
        {
          type: "code",
          title: "Leaving nested loops with a flag",
          code: String.raw`// Find two numbers from 1..9 whose product is 42
bool done = false;
for (int a = 1; a <= 9 && !done; a++)
{
    for (int b = a; b <= 9; b++)
    {
        if (a * b == 42)
        {
            Console.WriteLine($"{a} x {b} = 42");
            done = true;
            break;
        }
    }
}
Console.WriteLine($"Found: {done}");`,
          output: `6 x 7 = 42
Found: True`
        },
        {
          type: "text",
          html: `<p><strong>Random numbers.</strong> Games and simulations need randomness. Since .NET 6, use the ready-made, thread-safe <code>Random.Shared</code>:</p>
<ul><li><code>Random.Shared.Next(1, 7)</code> returns 1 to 6. The upper bound is <strong>exclusive</strong>.</li><li><code>Random.Shared.Next(10)</code> returns 0 to 9.</li><li><code>Random.Shared.NextDouble()</code> returns a <code>double</code> from 0.0 up to (not including) 1.0.</li></ul>`
        },
        {
          type: "code",
          title: "Roll until a six (output varies)",
          code: String.raw`int rolls = 0;
int value;

do
{
    value = Random.Shared.Next(1, 7);
    rolls++;
    Console.WriteLine($"Roll {rolls}: {value}");
} while (value != 6);

Console.WriteLine($"Got a six after {rolls} roll(s).");`
        },
        {
          type: "callout",
          tone: "deep",
          title: "Random in older code and in tests",
          html: `<p>Older tutorials write <code>new Random()</code> inside a loop. On old .NET Framework, several instances created in the same instant got the same seed and produced identical "random" numbers. <code>Random.Shared</code> avoids this. When you need the <em>same</em> sequence every run, for example in a test, create <code>new Random(42)</code> with a fixed seed. Never use <code>Random</code> for passwords or tokens; that is what <code>System.Security.Cryptography.RandomNumberGenerator</code> is for.</p>`
        },
        {
          type: "text",
          html: `<p><strong>Designing a loop.</strong> Before you type, answer four questions:</p>
<ol><li>What repeats? (the body)</li><li>When do I stop? (the test, or a <code>break</code>)</li><li>What changes each pass so I eventually stop? (the update)</li><li>Can it run zero times, or must it run at least once? (<code>while</code> vs <code>do-while</code>)</li></ol>
<p>When the natural exit point is in the <em>middle</em> of the body, such as right after reading input, <code>while (true)</code> with a <code>break</code> is clean and common.</p>`
        },
        {
          type: "code",
          title: "A command loop with an exit in the middle",
          code: String.raw`int total = 0;

while (true)
{
    Console.Write("Number to add (or 'q'): ");
    string? line = Console.ReadLine();

    if (line is null || line == "q")
    {
        break;
    }
    if (!int.TryParse(line, out int n))
    {
        Console.WriteLine("Not a number, try again.");
        continue;
    }
    total += n;
    Console.WriteLine($"Running total: {total}");
}

Console.WriteLine($"Final total: {total}");`
        },
        {
          type: "callout",
          tone: "python",
          title: "Same keywords",
          html: `<p><code>break</code> and <code>continue</code> mean exactly what they do in Python. Python's <code>random.randint(1, 6)</code> includes 6, but <code>Random.Shared.Next(1, 6)</code> stops at 5. This trips up many Python developers. C# has no <code>for ... else</code>; use a flag like <code>found</code> instead.</p>`
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: `<p>What does this print?</p>`,
          code: String.raw`for (int i = 1; i <= 10; i++)
{
    if (i % 2 == 0)
    {
        continue;
    }
    if (i > 7)
    {
        break;
    }
    Console.Write(i + " ");
}
Console.WriteLine("end");`,
          answer: `1 3 5 7 end`,
          explain: `<p>Even numbers hit <code>continue</code> and are skipped. The odd numbers 1, 3, 5, 7 are printed. At 9 the <code>i &gt; 7</code> check fires and <code>break</code> leaves the loop, so 9 is never printed. Then "end" prints on the same line.</p>`
        },
        {
          type: "mcq",
          prompt: `<p>Which values can <code>Random.Shared.Next(1, 7)</code> return?</p>`,
          options: [
            "0 to 7",
            "1 to 7",
            "1 to 6",
            "0 to 6"
          ],
          answer: 2,
          explain: `<p>The first argument is inclusive and the second is exclusive, so you get 1, 2, 3, 4, 5 or 6: a perfect die. To include 7 you would pass 8.</p>`
        },
        {
          type: "fill",
          prompt: `<p>Complete the loop so it skips negative numbers and stops completely at the first zero.</p>`,
          code: String.raw`int[] data = { 4, -2, 7, 0, 9 };
foreach (int d in data)
{
    if (d < 0) ___;
    if (d == 0) ___;
    Console.WriteLine(d);
}`,
          blanks: [["continue"], ["break"]],
          explain: `<p><code>continue</code> skips just this item, so -2 is ignored and the loop moves on to 7. <code>break</code> ends the whole loop at 0, so 9 is never printed. The program prints 4 and 7.</p>`
        },
        {
          type: "bug",
          prompt: `<p>The author wants to stop searching as soon as a 5 is found, but the program prints "Found it" twice. Why?</p>`,
          code: String.raw`int[,] grid = { { 1, 5 }, { 5, 2 } };
for (int r = 0; r < 2; r++)
{
    for (int c = 0; c < 2; c++)
    {
        if (grid[r, c] == 5)
        {
            Console.WriteLine("Found it");
            break;
        }
    }
}`,
          options: [
            "break exits only the inner loop, so the outer loop moves to the next row",
            "break is not allowed inside nested loops",
            "The grid syntax is wrong",
            "The comparison should use ="
          ],
          answer: 0,
          explain: `<p><code>break</code> leaves the innermost loop only. The outer loop continues with row 1, which also contains a 5. Add a <code>found</code> flag checked by the outer loop, or put the search in a method and <code>return</code>. A single <code>=</code> in the condition would be a compile error, not this behaviour.</p>`
        },
        {
          type: "order",
          prompt: `<p>Arrange the lines into a loop that reads commands until the input ends or the user types "exit".</p>`,
          lines: [
            "while (true)",
            "{",
            "    string? cmd = Console.ReadLine();",
            "    if (cmd is null || cmd == \"exit\") break;",
            "    Console.WriteLine($\"Running {cmd}\");",
            "}"
          ],
          explain: `<p>The loop must read before it can decide whether to stop, so the exit check sits in the middle, right after the read. Checking for <code>null</code> first handles the end of input, and short-circuiting means <code>cmd == "exit"</code> only runs on real text.</p>`
        }
      ],
      takeaways: [
        "break leaves the innermost loop; continue jumps to the next pass.",
        "To exit nested loops, use a flag or return from a method.",
        "Random.Shared.Next(min, max) includes min and excludes max.",
        "Use a fixed seed (new Random(42)) only when you need repeatable results.",
        "Design loops by deciding what repeats, when it stops and what changes each pass."
      ]
    }
  ],
  milestone: {
    id: "m03-project",
    title: "Guess the Number",
    brief: `<p>Build the classic console game. The computer picks a secret number and the player guesses. After each guess, the game says "Too high" or "Too low" until the player finds it or runs out of attempts.</p>
<p>Make it feel like a real game: three difficulty levels, a limited number of attempts, friendly handling of bad input, and the option to play again. When the player quits, show how many games they won.</p>`,
    skills: ["while and do-while loops", "switch expressions", "break and continue", "Random.Shared", "int.TryParse"],
    requirements: [
      "Offer three difficulty levels: Easy (1-20, 6 attempts), Medium (1-100, 7 attempts), Hard (1-1000, 10 attempts).",
      "Pick the secret number with Random.Shared.Next so both ends of the range are possible.",
      "After each guess print \"Too low\", \"Too high\" or a win message with the number of attempts used.",
      "Non-numeric or out-of-range guesses print a warning and do not use up an attempt.",
      "When attempts run out, reveal the secret number.",
      "Ask \"Play again? (y/n)\" after each game and loop until the player says no.",
      "At the end, print games played and games won.",
      "If input ends (Console.ReadLine returns null) at any prompt, finish cleanly without crashing."
    ],
    sampleRun: `=== Guess the Number ===
Choose difficulty: 1) Easy  2) Medium  3) Hard
> 2
I'm thinking of a number from 1 to 100. You have 7 attempts.
Guess #1: 50
Too high.
Guess #2: abc
Please enter a whole number.
Guess #2: 25
Too low.
Guess #3: 37
Too high.
Guess #4: 31
Correct! You got it in 4 attempts.
Play again? (y/n) n

Games played: 1
Games won: 1
Thanks for playing!`,
    starter: String.raw`Console.WriteLine("=== Guess the Number ===");

int gamesPlayed = 0;
int gamesWon = 0;
bool playAgain = true;

while (playAgain)
{
    Console.WriteLine("Choose difficulty: 1) Easy  2) Medium  3) Hard");
    Console.Write("> ");
    string? choice = Console.ReadLine();
    if (choice is null)
    {
        break;
    }

    // TODO: use a switch expression to set maxNumber and maxAttempts
    // Easy: 20 / 6, Medium: 100 / 7, Hard: 1000 / 10
    int maxNumber = 100;
    int maxAttempts = 7;

    // TODO: pick the secret with Random.Shared.Next(1, maxNumber + 1)
    int secret = 42;

    Console.WriteLine(
        $"I'm thinking of a number from 1 to {maxNumber}. " +
        $"You have {maxAttempts} attempts.");

    gamesPlayed++;
    bool won = false;

    // TODO: loop while attempts remain:
    //   read a guess (stop the game if input is null)
    //   reject non-numbers and out-of-range values with continue
    //   print Too low / Too high, or a win message and break

    // TODO: if not won, reveal the secret number

    // TODO: ask "Play again? (y/n)" and set playAgain
    playAgain = false;
}

Console.WriteLine();
Console.WriteLine($"Games played: {gamesPlayed}");
Console.WriteLine($"Games won: {gamesWon}");
Console.WriteLine("Thanks for playing!");`,
    hints: [
      `<p>A switch expression can only return one value, so write two of them: one for <code>maxNumber</code> and one for <code>maxAttempts</code>. Use <code>_</code> to default to Medium when the choice is unexpected.</p>`,
      `<p><code>Random.Shared.Next(1, maxNumber + 1)</code> includes 1 and <code>maxNumber</code>, because the upper bound is exclusive.</p>`,
      `<p>Keep a counter <code>attempt</code> that only increases after a <em>valid</em> guess. A <code>while (attempt &lt; maxAttempts)</code> loop with <code>continue</code> for bad input does exactly that.</p>`,
      `<p>When input ends mid-game, set a flag such as <code>inputEnded = true</code>, <code>break</code> out of the guessing loop, and then <code>break</code> out of the main loop too.</p>`,
      `<p>For "play again", a do-while that repeats while the answer is neither "y" nor "n" keeps asking until the reply makes sense. Use <code>ToLower()</code> so "Y" works too.</p>`
    ],
    solution: String.raw`Console.WriteLine("=== Guess the Number ===");

int gamesPlayed = 0;
int gamesWon = 0;
bool playAgain = true;
bool inputEnded = false;

while (playAgain)
{
    Console.WriteLine("Choose difficulty: 1) Easy  2) Medium  3) Hard");
    Console.Write("> ");
    string? choice = Console.ReadLine();
    if (choice is null)
    {
        break;
    }

    int maxNumber = choice.Trim() switch
    {
        "1" => 20,
        "3" => 1000,
        _ => 100
    };
    int maxAttempts = choice.Trim() switch
    {
        "1" => 6,
        "3" => 10,
        _ => 7
    };

    int secret = Random.Shared.Next(1, maxNumber + 1);
    Console.WriteLine(
        $"I'm thinking of a number from 1 to {maxNumber}. " +
        $"You have {maxAttempts} attempts.");

    gamesPlayed++;
    bool won = false;
    int attempt = 0;

    while (attempt < maxAttempts)
    {
        Console.Write($"Guess #{attempt + 1}: ");
        string? line = Console.ReadLine();
        if (line is null)
        {
            inputEnded = true;
            break;
        }

        if (!int.TryParse(line, out int guess))
        {
            Console.WriteLine("Please enter a whole number.");
            continue;
        }
        if (guess < 1 || guess > maxNumber)
        {
            Console.WriteLine($"Stay between 1 and {maxNumber}.");
            continue;
        }

        attempt++;
        if (guess < secret)
        {
            Console.WriteLine("Too low.");
        }
        else if (guess > secret)
        {
            Console.WriteLine("Too high.");
        }
        else
        {
            string tries = attempt == 1 ? "attempt" : "attempts";
            Console.WriteLine(
                $"Correct! You got it in {attempt} {tries}.");
            won = true;
            gamesWon++;
            break;
        }
    }

    if (inputEnded)
    {
        break;
    }
    if (!won)
    {
        Console.WriteLine($"Out of attempts. The number was {secret}.");
    }

    string answer;
    do
    {
        Console.Write("Play again? (y/n) ");
        string? reply = Console.ReadLine();
        if (reply is null)
        {
            answer = "n";
            break;
        }
        answer = reply.Trim().ToLower();
    } while (answer != "y" && answer != "n");

    playAgain = answer == "y";
}

Console.WriteLine();
Console.WriteLine($"Games played: {gamesPlayed}");
Console.WriteLine($"Games won: {gamesWon}");
Console.WriteLine("Thanks for playing!");`,
    stretch: [
      "Add a hint after three wrong guesses saying whether the number is even or odd.",
      "Track the best (lowest) number of attempts per difficulty and print it at the end.",
      "Add a \"Custom\" level where the player types the range and attempt count.",
      "Print \"Warm\" when the guess is within 10 of the secret and \"Cold\" otherwise."
    ]
  }
});
