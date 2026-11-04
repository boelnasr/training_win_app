(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m05",
  number: 5,
  title: "Collections",
  tagline: "Arrays, lists, dictionaries and friends: store many values and find them fast.",
  level: "Beginner",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m05-l01",
      title: "Arrays",
      minutes: 30,
      objectives: [
        "Create, read and change one-dimensional arrays",
        "Use Array.Sort, Array.Reverse, Array.IndexOf and Array.Fill",
        "Explain why two array variables can point at the same data",
        "Choose between rectangular [,] and jagged [][] arrays"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>So far every variable has held one value. Real programs deal with many: 30 test scores, 12 monthly totals, a 9x9 Sudoku board. An <strong>array</strong> is the simplest way to hold many values of the same type under one name.</p><p>Three facts define an array in C#:</p><ul><li>Every element has the <strong>same type</strong> (<code>int[]</code> holds only ints).</li><li>The <strong>size is fixed</strong> when you create it. You cannot add a 31st score to a 30-slot array.</li><li>Elements are numbered from <strong>0</strong>. The last index is <code>Length - 1</code>.</li></ul>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`// Three ways to create an array
int[] scores = new int[3];            // 3 slots, all 0
string[] days = { "Mon", "Tue", "Wed" }; // initializer
double[] temps = new double[] { 21.5, 19.0 };

scores[0] = 90;      // write by index
scores[2] = 75;

Console.WriteLine(scores[0]);      // read by index
Console.WriteLine(scores[1]);      // never set: 0
Console.WriteLine(days.Length);    // how many elements
Console.WriteLine(days[days.Length - 1]); // last one
Console.WriteLine(temps[1]);`,
          output: "90\n0\n3\nWed\n19"
        },
        {
          type: "text",
          html: "<p>When you create an array with <code>new int[3]</code>, C# fills every slot with the type's <strong>default value</strong>: <code>0</code> for numbers, <code>false</code> for <code>bool</code>, <code>'\\0'</code> for <code>char</code> and <code>null</code> for reference types like <code>string</code>. You never get random garbage memory the way you can in C.</p>"
        },
        {
          type: "callout",
          tone: "warning",
          title: "IndexOutOfRangeException",
          html: "<p>Reading <code>scores[3]</code> on a 3-element array compiles fine, then crashes at run time with <code>System.IndexOutOfRangeException: Index was outside the bounds of the array.</code> The compiler cannot know which index you will use, so the runtime checks every access. The classic cause is a loop written as <code>i &lt;= arr.Length</code> instead of <code>i &lt; arr.Length</code>.</p>"
        },
        {
          type: "code",
          title: "Looping over an array",
          code: String.raw`int[] scores = { 72, 88, 95, 61 };

// for: when you need the index
for (int i = 0; i < scores.Length; i++)
{
    Console.WriteLine($"Student {i + 1}: {scores[i]}");
}

// foreach: when you only need each value
int total = 0;
foreach (int s in scores)
{
    total += s;
}
Console.WriteLine($"Average: {total / (double)scores.Length}");

// Printing the array itself is a common surprise
Console.WriteLine(scores);
Console.WriteLine(string.Join(", ", scores));`,
          output: "Student 1: 72\nStudent 2: 88\nStudent 3: 95\nStudent 4: 61\nAverage: 79\nSystem.Int32[]\n72, 88, 95, 61"
        },
        {
          type: "text",
          html: "<p><code>Console.WriteLine(scores)</code> prints the type name <code>System.Int32[]</code>, not the contents. Arrays do not override <code>ToString()</code>. Use <code>string.Join(separator, array)</code> whenever you want to see what is inside.</p><p>The static <code>Array</code> class has helpers for everyday jobs. They change the array <em>in place</em>, so they return nothing (except <code>IndexOf</code>).</p>"
        },
        {
          type: "code",
          title: "Array helpers",
          code: String.raw`int[] nums = { 42, 7, 19, 3, 25 };

Array.Sort(nums);                 // ascending, in place
Console.WriteLine(string.Join(" ", nums));

Array.Reverse(nums);              // now descending
Console.WriteLine(string.Join(" ", nums));

Console.WriteLine(Array.IndexOf(nums, 19)); // position
Console.WriteLine(Array.IndexOf(nums, 99)); // not found
Console.WriteLine(nums.Contains(7));        // needs LINQ,
                                            // implicit using
int[] zeros = new int[4];
Array.Fill(zeros, 5);
Console.WriteLine(string.Join(" ", zeros));

int[] copy = (int[])nums.Clone();  // a real, separate copy
copy[0] = 0;
Console.WriteLine($"{nums[0]} vs {copy[0]}");`,
          output: "3 7 19 25 42\n42 25 19 7 3\n2\n-1\nTrue\n5 5 5 5\n42 vs 0"
        },
        {
          type: "callout",
          tone: "deep",
          title: "Arrays are reference types",
          html: "<p>An array variable does not contain the elements. It contains a <strong>reference</strong> (an address) to an array object on the heap. So <code>int[] b = a;</code> copies the address, not the data. Both names now point at one array, and a change through <code>b</code> is visible through <code>a</code>. The same is true when you pass an array to a method: the method can change your elements. Use <code>Clone()</code>, <code>Array.Copy</code> or <code>[.. a]</code> (lesson 5) when you need an independent copy.</p>"
        },
        {
          type: "code",
          title: "Two names, one array",
          code: String.raw`int[] a = { 1, 2, 3 };
int[] b = a;          // same array, second name
b[0] = 100;
Console.WriteLine(a[0]);

DoubleAll(a);
Console.WriteLine(string.Join(",", b));

static void DoubleAll(int[] values)
{
    for (int i = 0; i < values.Length; i++)
        values[i] *= 2;
}`,
          output: "100\n200,4,6"
        },
        {
          type: "text",
          html: "<p>For grids, C# has two kinds of multi-dimensional arrays.</p><ul><li>A <strong>rectangular</strong> array <code>int[,]</code> is one block of memory with fixed rows and columns. Access with <code>grid[row, col]</code>. Use <code>GetLength(0)</code> for rows and <code>GetLength(1)</code> for columns. <code>Length</code> gives the total cell count.</li><li>A <strong>jagged</strong> array <code>int[][]</code> is an array of arrays. Each row is its own array and can have a different length. Access with <code>jag[row][col]</code>.</li></ul>"
        },
        {
          type: "code",
          title: "Rectangular vs jagged",
          code: String.raw`int[,] grid =
{
    { 1, 2, 3 },
    { 4, 5, 6 }
};
Console.WriteLine($"{grid.GetLength(0)} rows, " +
    $"{grid.GetLength(1)} cols, {grid.Length} cells");
Console.WriteLine(grid[1, 2]);

for (int r = 0; r < grid.GetLength(0); r++)
{
    for (int c = 0; c < grid.GetLength(1); c++)
        Console.Write(grid[r, c] + " ");
    Console.WriteLine();
}

int[][] triangle = new int[3][];
triangle[0] = new[] { 1 };
triangle[1] = new[] { 1, 1 };
triangle[2] = new[] { 1, 2, 1 };
foreach (int[] row in triangle)
    Console.WriteLine(string.Join(" ", row));`,
          output: "2 rows, 3 cols, 6 cells\n6\n1 2 3 \n4 5 6 \n1\n1 1\n1 2 1"
        },
        {
          type: "table",
          headers: ["", "Rectangular <code>int[,]</code>", "Jagged <code>int[][]</code>"],
          rows: [
            ["Shape", "Every row has the same length", "Rows can differ"],
            ["Access", "<code>g[r, c]</code>", "<code>g[r][c]</code>"],
            ["Row count", "<code>g.GetLength(0)</code>", "<code>g.Length</code>"],
            ["Good for", "Boards, images, matrices", "Ragged data, rows built one at a time"]
          ]
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python lists",
          html: "<p>A Python <code>list</code> grows, shrinks and mixes types. A C# array does none of that. If you try <code>scores.Add(5)</code> on an array you get <code>error CS1061: 'int[]' does not contain a definition for 'Add'</code>. The C# type that behaves like a Python list is <code>List&lt;T&gt;</code>, which is the next lesson. Arrays still matter: they are fast, compact, and many .NET APIs return them (<code>string.Split</code>, <code>File.ReadAllLines</code>).</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this program print?",
          code: String.raw`int[] a = { 3, 1, 2 };
int[] b = a;
b[0] = 10;
Array.Sort(a);
Console.WriteLine(string.Join(",", b));`,
          answer: "1,2,10",
          explain: "<p><code>b = a</code> copies the reference, so there is only one array. Setting <code>b[0] = 10</code> gives <code>{10, 1, 2}</code>. Sorting through <code>a</code> sorts that same array to <code>{1, 2, 10}</code>, and printing <code>b</code> shows it. If you answered <code>10,1,2</code> you treated <code>b</code> as a copy.</p>"
        },
        {
          type: "mcq",
          prompt: "What does <code>new string[3]</code> contain right after it is created?",
          options: [
            "Three empty strings \"\"",
            "Three null references",
            "Random leftover memory",
            "Nothing: Length is 0 until you assign elements"
          ],
          answer: 1,
          explain: "<p>Every slot gets the default value of the element type. <code>string</code> is a reference type, so the default is <code>null</code>, not <code>\"\"</code>. C# never exposes uninitialized memory. <code>Length</code> is 3 from the moment of creation because the size is fixed.</p>"
        },
        {
          type: "bug",
          prompt: "This program compiles but crashes. Which line is the bug?",
          code: String.raw`int[] temps = { 18, 21, 19 };
int max = temps[0];
for (int i = 1; i <= temps.Length; i++)
{
    if (temps[i] > max) max = temps[i];
}
Console.WriteLine(max);`,
          options: [
            "int max = temps[0]; should start at 0",
            "The loop condition should be i < temps.Length",
            "The loop should start at i = 0",
            "temps needs new int[3] before the initializer"
          ],
          answer: 1,
          explain: "<p>Valid indexes are 0 to 2. With <code>&lt;=</code> the loop reaches <code>temps[3]</code> and throws <code>IndexOutOfRangeException</code>. Starting <code>max</code> at <code>temps[0]</code> is correct (starting at 0 breaks for all-negative data), and starting the loop at 1 just skips a comparison you do not need.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the code so it prints the number of <em>columns</em> in the rectangular array.",
          code: String.raw`int[,] seats = new int[4, 10];
Console.WriteLine(seats.___(___));`,
          blanks: [["GetLength"], ["1"]],
          explain: "<p>Dimension 0 is rows and dimension 1 is columns, so <code>seats.GetLength(1)</code> is 10. <code>seats.Length</code> would print 40, the total number of seats.</p>"
        },
        {
          type: "output",
          prompt: "Predict the output.",
          code: String.raw`int[][] rows = new int[2][];
rows[0] = new[] { 5, 6, 7 };
rows[1] = new[] { 8 };
Console.WriteLine(rows.Length);
Console.WriteLine(rows[0].Length + rows[1].Length);
Console.WriteLine(rows[1][0]);`,
          answer: "2\n4\n8",
          explain: "<p>A jagged array's <code>Length</code> counts rows (2). Each row has its own length: 3 + 1 = 4. <code>rows[1][0]</code> is the first element of the second row, 8.</p>"
        }
      ],
      takeaways: [
        "Arrays have a fixed size, one element type, and indexes from 0 to Length - 1.",
        "New arrays are filled with default values: 0, false, or null.",
        "Array variables hold references; assignment shares the array, Clone() copies it.",
        "Print contents with string.Join, not Console.WriteLine(array).",
        "int[,] is a fixed grid; int[][] is an array of separately sized rows."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m05-l02",
      title: "List<T>: the growable array",
      minutes: 30,
      objectives: [
        "Create a List&lt;T&gt; and add, insert and remove items",
        "Search a list with Contains, IndexOf and Find",
        "Explain Count vs Capacity and why lists are fast to append",
        "Avoid changing a list while a foreach is reading it"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Most of the time you do not know how many items you will have. A shopping cart, the lines of a file, the players who joined a game. For that, C# programmers reach for <code>List&lt;T&gt;</code>. It works like an array that grows and shrinks on demand.</p><p>The <code>&lt;T&gt;</code> part is a <strong>type parameter</strong>. You fill it in when you create the list: <code>List&lt;string&gt;</code>, <code>List&lt;int&gt;</code>, <code>List&lt;double&gt;</code>. The compiler then makes sure only that type goes in. You will learn to write your own generic types in Module 9.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var cart = new List<string>();      // empty
cart.Add("apples");
cart.Add("bread");
cart.Add("milk");
Console.WriteLine(cart.Count);      // Count, not Length

cart.Insert(1, "butter");           // at index 1
Console.WriteLine(string.Join(", ", cart));

cart.Remove("bread");               // by value
cart.RemoveAt(0);                   // by index
Console.WriteLine(string.Join(", ", cart));

cart[0] = "salted butter";          // index like an array
Console.WriteLine(cart[0]);
Console.WriteLine(cart.Contains("milk"));`,
          output: "3\napples, butter, bread, milk\nbutter, milk\nsalted butter\nTrue"
        },
        {
          type: "callout",
          tone: "tip",
          title: "Count vs Length",
          html: "<p>Arrays and strings use <code>Length</code>. Lists, dictionaries, sets, queues and stacks use <code>Count</code>. Mixing them up gives <code>error CS1061: 'List&lt;string&gt;' does not contain a definition for 'Length'</code>. The rule of thumb: fixed-size things have a Length, growable things have a Count.</p>"
        },
        {
          type: "text",
          html: "<p>You can fill a list when you create it with a <strong>collection initializer</strong>, or copy any array or other collection into it. Lists have many of the same helpers as arrays, but as instance methods: <code>list.Sort()</code> instead of <code>Array.Sort(arr)</code>.</p>"
        },
        {
          type: "code",
          title: "Initializers, sorting, searching",
          code: String.raw`var scores = new List<int> { 88, 42, 95, 70 };
int[] more = { 64, 100 };
scores.AddRange(more);         // add many at once

scores.Sort();
Console.WriteLine(string.Join(" ", scores));
Console.WriteLine(scores.IndexOf(95));
Console.WriteLine(scores.IndexOf(1));

// Find takes a test written as a lambda: "s goes to s < 50"
int firstFail = scores.Find(s => s < 50);
Console.WriteLine(firstFail);
Console.WriteLine(scores.Exists(s => s == 100));

int removed = scores.RemoveAll(s => s < 65);
Console.WriteLine($"Removed {removed}, left {scores.Count}");

int[] backToArray = scores.ToArray();
Console.WriteLine(backToArray.Length);`,
          output: "42 64 70 88 95 100\n4\n-1\n42\nTrue\nRemoved 2, left 4\n4"
        },
        {
          type: "callout",
          tone: "note",
          title: "A first look at lambdas",
          html: "<p><code>s =&gt; s &lt; 50</code> is a <strong>lambda</strong>: a tiny unnamed method. Read it as \"given <code>s</code>, return whether <code>s &lt; 50</code>\". <code>Find</code> calls it for each item and returns the first one where it is true (or the default value, 0 for int, if none match). Module 9 covers lambdas in depth. For now, copy the pattern.</p>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "How a List grows: Count vs Capacity",
          html: "<p>Inside every <code>List&lt;T&gt;</code> is a plain array. <code>Count</code> is how many slots you use. <code>Capacity</code> is how big the hidden array is. When <code>Add</code> finds the array full, the list allocates a new array twice as big and copies everything over. Doubling means copies are rare, so adding to the end is fast on average. If you know the final size up front, pass it in: <code>new List&lt;int&gt;(10_000)</code> skips the repeated growing. Inserting or removing near the <em>front</em> is slower, because every later item must shift one slot.</p>"
        },
        {
          type: "code",
          title: "Watching Capacity",
          code: String.raw`var list = new List<int>();
int lastCapacity = -1;
for (int i = 0; i < 20; i++)
{
    list.Add(i);
    if (list.Capacity != lastCapacity)
    {
        Console.WriteLine($"Count {list.Count}, " +
            $"Capacity {list.Capacity}");
        lastCapacity = list.Capacity;
    }
}`,
          output: "Count 1, Capacity 4\nCount 5, Capacity 8\nCount 9, Capacity 16\nCount 17, Capacity 32"
        },
        {
          type: "text",
          html: "<p>One rule trips up almost everyone: <strong>do not add to or remove from a list inside a <code>foreach</code> over that same list</strong>. The loop's enumerator notices the change and throws <code>InvalidOperationException: Collection was modified; enumeration operation may not execute.</code> The fixes are to loop backwards with <code>for</code>, to use <code>RemoveAll</code>, or to build a new list.</p>"
        },
        {
          type: "compare",
          left: {
            label: "Crashes at run time",
            code: String.raw`var names = new List<string>
    { "Ann", "", "Bo", "" };
foreach (string n in names)
{
    if (n == "")
        names.Remove(n); // throws
}`
          },
          right: {
            label: "Safe: walk backwards",
            code: String.raw`var names = new List<string>
    { "Ann", "", "Bo", "" };
for (int i = names.Count - 1; i >= 0; i--)
{
    if (names[i] == "")
        names.RemoveAt(i);
}
// or simply:
// names.RemoveAll(n => n == "");`
          }
        },
        {
          type: "callout",
          tone: "python",
          title: "Python equivalents",
          html: "<p><code>lst.append(x)</code> is <code>list.Add(x)</code>. <code>len(lst)</code> is <code>list.Count</code>. <code>x in lst</code> is <code>list.Contains(x)</code>. <code>lst.pop(i)</code> is <code>list.RemoveAt(i)</code> (it returns nothing, so read the item first). <code>lst.sort()</code> is <code>list.Sort()</code>. Negative indexes like <code>lst[-1]</code> do not work in C#. Use <code>list[^1]</code> instead (lesson 5).</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var q = new List<int> { 5, 10, 15 };
q.Insert(0, 1);
q.Remove(10);
q.Add(20);
Console.WriteLine(string.Join(" ", q));
Console.WriteLine(q.Count);`,
          answer: "1 5 15 20\n4",
          explain: "<p>Start <code>5 10 15</code>. Insert 1 at the front: <code>1 5 10 15</code>. <code>Remove(10)</code> removes the <em>value</em> 10, not index 10: <code>1 5 15</code>. Add 20 at the end. Four items.</p>"
        },
        {
          type: "mcq",
          prompt: "A list holds <code>{ 4, 8, 4 }</code>. What does <code>list.Remove(4)</code> do?",
          options: [
            "Removes the item at index 4 and throws because there is none",
            "Removes both 4s",
            "Removes only the first 4 and returns true",
            "Does nothing because Remove needs an index"
          ],
          answer: 2,
          explain: "<p><code>Remove(value)</code> removes the <em>first</em> match and returns <code>true</code> (or <code>false</code> if nothing matched). Removing by index is <code>RemoveAt</code>. Removing every match is <code>RemoveAll(x =&gt; x == 4)</code>.</p>"
        },
        {
          type: "fill",
          prompt: "Fill in the blanks to create a list of prices and print how many there are.",
          code: String.raw`var prices = new ___<decimal> { 9.99m, 4.50m };
prices.___(12.00m);
Console.WriteLine(prices.___);`,
          blanks: [["List"], ["Add"], ["Count"]],
          explain: "<p>The type is <code>List&lt;decimal&gt;</code>, items are appended with <code>Add</code>, and lists report their size with <code>Count</code>. <code>Length</code> is for arrays and strings.</p>"
        },
        {
          type: "bug",
          prompt: "This should remove every negative reading, but it crashes. Why?",
          code: String.raw`var readings = new List<int> { 3, -1, 4, -5 };
foreach (int r in readings)
{
    if (r < 0) readings.Remove(r);
}`,
          options: [
            "Remove needs an index, not a value",
            "The list is changed while foreach is enumerating it",
            "List<int> cannot hold negative numbers",
            "foreach variables are read-only, so r < 0 does not compile"
          ],
          answer: 1,
          explain: "<p>Changing a list during a <code>foreach</code> over it throws <code>InvalidOperationException: Collection was modified</code>. Use <code>readings.RemoveAll(r =&gt; r &lt; 0)</code> or a backwards <code>for</code> loop. The foreach variable is read-only, but reading it in a condition is fine.</p>"
        },
        {
          type: "order",
          prompt: "Arrange the lines to read names until an empty line, then print them sorted.",
          lines: [
            "var names = new List<string>();",
            "string? line;",
            "while (!string.IsNullOrEmpty(line = Console.ReadLine()))",
            "    names.Add(line);",
            "names.Sort();",
            "Console.WriteLine(string.Join(\", \", names));"
          ],
          explain: "<p>Create the list first, declare the variable that holds each line, loop while input is not empty (which also stops on <code>null</code> at end of input), add inside the loop, then sort and print once at the end.</p>"
        }
      ],
      takeaways: [
        "List<T> is the default choice for a growable sequence.",
        "Add, Insert, Remove (by value), RemoveAt (by index), Count.",
        "Adding at the end is fast; inserting at the front shifts everything.",
        "Never modify a list inside a foreach over it; use RemoveAll or a backwards for."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m05-l03",
      title: "Dictionary<TKey, TValue>",
      minutes: 30,
      objectives: [
        "Store and look up values by key",
        "Use TryGetValue instead of risky indexer reads",
        "Count things with a dictionary",
        "Loop over key/value pairs"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>A list answers \"what is item number 3?\". Often the real question is different: \"what is Alice's phone number?\", \"how many times did the word <em>the</em> appear?\", \"which product has code SKU-1042?\". A <code>Dictionary&lt;TKey, TValue&gt;</code> maps <strong>keys</strong> to <strong>values</strong> and answers those questions almost instantly, no matter how many entries it holds.</p><p>Keys are unique. Values can repeat.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var capitals = new Dictionary<string, string>
{
    ["France"] = "Paris",
    ["Japan"] = "Tokyo"
};

capitals.Add("Kenya", "Nairobi");   // add new key
capitals["Peru"] = "Lima";          // add or overwrite
capitals["Japan"] = "TOKYO";        // overwrite

Console.WriteLine(capitals["France"]);
Console.WriteLine(capitals["Japan"]);
Console.WriteLine(capitals.Count);
Console.WriteLine(capitals.ContainsKey("Peru"));

capitals.Remove("Kenya");
Console.WriteLine(capitals.ContainsKey("Kenya"));`,
          output: "Paris\nTOKYO\n4\nTrue\nFalse"
        },
        {
          type: "table",
          headers: ["Operation", "Key exists", "Key missing"],
          rows: [
            ["<code>d[key]</code> (read)", "Returns the value", "Throws <code>KeyNotFoundException</code>"],
            ["<code>d[key] = v</code> (write)", "Overwrites", "Adds"],
            ["<code>d.Add(key, v)</code>", "Throws <code>ArgumentException</code>", "Adds"],
            ["<code>d.TryAdd(key, v)</code>", "Returns false, no change", "Adds, returns true"],
            ["<code>d.TryGetValue(key, out v)</code>", "true, v = value", "false, v = default"],
            ["<code>d.Remove(key)</code>", "Removes, returns true", "Returns false"]
          ]
        },
        {
          type: "callout",
          tone: "warning",
          title: "The two classic dictionary crashes",
          html: "<p>Reading a missing key: <code>System.Collections.Generic.KeyNotFoundException: The given key 'Spain' was not present in the dictionary.</code></p><p>Adding a key twice with <code>Add</code>: <code>System.ArgumentException: An item with the same key has already been added. Key: Kenya</code>.</p><p>Both are run-time errors, so the compiler will not save you. Professionals almost never read with the indexer unless they are certain the key exists.</p>"
        },
        {
          type: "text",
          html: "<p>The safe way to read is <code>TryGetValue</code>. You met the Try pattern with <code>int.TryParse</code> in Module 4: it returns a <code>bool</code> for success and hands back the result through an <code>out</code> parameter. It also does one lookup instead of two, which is faster than <code>ContainsKey</code> followed by the indexer.</p>"
        },
        {
          type: "code",
          title: "TryGetValue",
          code: String.raw`var stock = new Dictionary<string, int>
{
    ["apple"] = 12,
    ["pear"] = 0
};

string[] wanted = { "apple", "kiwi", "pear" };
foreach (string item in wanted)
{
    if (stock.TryGetValue(item, out int qty))
        Console.WriteLine($"{item}: {qty} in stock");
    else
        Console.WriteLine($"{item}: we do not sell this");
}

// GetValueOrDefault is handy for simple reads
Console.WriteLine(stock.GetValueOrDefault("kiwi", -1));`,
          output: "apple: 12 in stock\nkiwi: we do not sell this\npear: 0 in stock\n-1"
        },
        {
          type: "text",
          html: "<p>Counting is the most common dictionary job of all. Read each item; if the key is new, start at 1; otherwise add 1. Then loop over the dictionary. Each element is a <code>KeyValuePair&lt;TKey, TValue&gt;</code> with <code>.Key</code> and <code>.Value</code>, and you can unpack it straight into two variables.</p>"
        },
        {
          type: "code",
          title: "Word counter",
          code: String.raw`string text = "the cat saw the dog and the dog ran";
var counts = new Dictionary<string, int>();

foreach (string word in text.Split(' '))
{
    counts.TryGetValue(word, out int n); // n is 0 if new
    counts[word] = n + 1;
}

foreach (KeyValuePair<string, int> pair in counts)
{
    if (pair.Value > 1)
        Console.WriteLine($"{pair.Key} x{pair.Value}");
}

// Deconstruction: shorter and clearer
foreach (var (word, n) in counts)
{
    if (n == 1) Console.Write(word + " ");
}
Console.WriteLine();`,
          output: "the x3\ndog x2\ncat saw and ran "
        },
        {
          type: "callout",
          tone: "deep",
          title: "Why lookups are fast: hashing",
          html: "<p>A dictionary calls <code>GetHashCode()</code> on the key to get a number, and uses that number to jump straight to a small \"bucket\". It then checks <code>Equals</code> only against the few keys in that bucket. That is why lookups stay fast with a million entries. It also explains two rules: keys must not change after you add them, and do not depend on the enumeration order. Today a dictionary with no removals happens to return items in insertion order, but the documentation does not promise it. If you need order, sort the keys or use <code>SortedDictionary</code>.</p>"
        },
        {
          type: "code",
          title: "Case-insensitive keys and sorted output",
          code: String.raw`var ages = new Dictionary<string, int>(
    StringComparer.OrdinalIgnoreCase)
{
    ["Zoe"] = 31,
    ["adam"] = 25
};
Console.WriteLine(ages["ZOE"]);  // works: case ignored
ages["Adam"] = 26;               // same key as "adam"
Console.WriteLine(ages.Count);

var names = new List<string>(ages.Keys);
names.Sort();
foreach (string name in names)
    Console.WriteLine($"{name}: {ages[name]}");`,
          output: "31\n2\nadam: 26\nZoe: 31"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python dict",
          html: "<p><code>d.get(k, default)</code> is <code>d.GetValueOrDefault(k, default)</code>. <code>k in d</code> is <code>d.ContainsKey(k)</code>. <code>for k, v in d.items()</code> is <code>foreach (var (k, v) in d)</code>. The big difference: C# dictionaries are typed. A <code>Dictionary&lt;string, int&gt;</code> refuses <code>d[\"x\"] = \"hello\"</code> with <code>error CS0029: Cannot implicitly convert type 'string' to 'int'</code>.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var d = new Dictionary<string, int>();
d["a"] = 1;
d["b"] = 2;
d["a"] = d["a"] + 10;
d.TryAdd("b", 99);
Console.WriteLine($"{d["a"]} {d["b"]} {d.Count}");`,
          answer: "11 2 2",
          explain: "<p>Writing with the indexer overwrites, so <code>a</code> becomes 11. <code>TryAdd</code> does nothing when the key already exists, so <code>b</code> stays 2. There are two keys.</p>"
        },
        {
          type: "mcq",
          prompt: "Which line can throw <code>KeyNotFoundException</code>?",
          options: [
            "d[\"x\"] = 5;",
            "int v = d[\"x\"];",
            "d.TryGetValue(\"x\", out int v);",
            "bool ok = d.Remove(\"x\");"
          ],
          answer: 1,
          explain: "<p>Only <em>reading</em> through the indexer throws for a missing key. Writing through the indexer adds the key. <code>TryGetValue</code> and <code>Remove</code> report a missing key by returning <code>false</code>.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the safe lookup.",
          code: String.raw`var phone = new Dictionary<string, string>();
if (phone.___("Ana", ___ string? number))
    Console.WriteLine(number);
else
    Console.WriteLine("No number for Ana");`,
          blanks: [["TryGetValue"], ["out"]],
          explain: "<p><code>TryGetValue(key, out value)</code> returns <code>true</code> and fills <code>value</code> when the key exists. The <code>out</code> keyword is required at the call site, just like with <code>int.TryParse</code>.</p>"
        },
        {
          type: "bug",
          prompt: "This letter counter crashes on its first letter. What is wrong?",
          code: String.raw`var freq = new Dictionary<char, int>();
foreach (char c in "hello")
{
    freq[c] = freq[c] + 1;
}`,
          options: [
            "char cannot be a dictionary key",
            "Reading freq[c] throws when c is not in the dictionary yet",
            "The string must be converted to an array first",
            "freq[c] = ... must be written as freq.Add(c, ...)"
          ],
          answer: 1,
          explain: "<p>The right side reads <code>freq[c]</code> before anything was stored, which throws <code>KeyNotFoundException</code>. Use <code>freq.TryGetValue(c, out int n); freq[c] = n + 1;</code> or <code>freq[c] = freq.GetValueOrDefault(c) + 1;</code>. Switching to <code>Add</code> would crash on the second <code>l</code> instead.</p>"
        }
      ],
      takeaways: [
        "Dictionary<TKey, TValue> maps unique keys to values with fast lookups.",
        "Reading a missing key with d[key] throws; TryGetValue does not.",
        "d[key] = value adds or overwrites; Add throws on a duplicate.",
        "Loop with foreach (var (key, value) in d); do not rely on order.",
        "Pass StringComparer.OrdinalIgnoreCase for case-insensitive string keys."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m05-l04",
      title: "HashSet, Queue and Stack",
      minutes: 28,
      objectives: [
        "Use HashSet&lt;T&gt; to track unique items and do set math",
        "Process work in arrival order with Queue&lt;T&gt;",
        "Use Stack&lt;T&gt; for undo and nesting problems",
        "Use the Try methods to avoid empty-collection exceptions"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Lists and dictionaries cover most needs. Three more collections each solve one problem very well:</p><ul><li><code>HashSet&lt;T&gt;</code>: \"have I seen this before?\" with no duplicates.</li><li><code>Queue&lt;T&gt;</code>: first in, first out (FIFO), like a line at a shop.</li><li><code>Stack&lt;T&gt;</code>: last in, first out (LIFO), like a pile of plates.</li></ul><p>Picking the right one makes code shorter and harder to get wrong.</p>"
        },
        {
          type: "code",
          title: "HashSet basics",
          code: String.raw`var visited = new HashSet<string>();
Console.WriteLine(visited.Add("home"));   // True: new
Console.WriteLine(visited.Add("about"));  // True
Console.WriteLine(visited.Add("home"));   // False: dup
Console.WriteLine(visited.Count);
Console.WriteLine(visited.Contains("about"));

// Remove duplicates from a list in one step
var tags = new List<string> { "c#", "dotnet", "c#", "web" };
var unique = new HashSet<string>(tags);
Console.WriteLine(unique.Count);`,
          output: "True\nTrue\nFalse\n2\nTrue\n3"
        },
        {
          type: "text",
          html: "<p><code>Add</code> returns <code>false</code> for a duplicate instead of throwing. That makes duplicate checks a one-liner: <code>if (!seen.Add(x)) ...</code>. <code>Contains</code> on a <code>HashSet</code> uses hashing like a dictionary, so it stays fast for huge sets. <code>List.Contains</code> has to check every item.</p><p>Sets also do set math. These methods change the set they are called on.</p>"
        },
        {
          type: "code",
          title: "Set operations",
          code: String.raw`var alice = new HashSet<int> { 1, 2, 3, 4 };
var bob = new HashSet<int> { 3, 4, 5 };

var both = new HashSet<int>(alice);
both.IntersectWith(bob);          // in both
var either = new HashSet<int>(alice);
either.UnionWith(bob);            // in either
var onlyAlice = new HashSet<int>(alice);
onlyAlice.ExceptWith(bob);        // in alice, not bob

Print("both", both);
Print("either", either);
Print("only alice", onlyAlice);
Console.WriteLine(bob.IsSubsetOf(either));

static void Print(string label, HashSet<int> set)
{
    var sorted = new List<int>(set);
    sorted.Sort();     // sets have no guaranteed order
    Console.WriteLine($"{label}: {string.Join(",", sorted)}");
}`,
          output: "both: 3,4\neither: 1,2,3,4,5\nonly alice: 1,2\nTrue"
        },
        {
          type: "callout",
          tone: "warning",
          title: "Sets are not ordered",
          html: "<p>A <code>HashSet</code> has no index (<code>set[0]</code> is <code>error CS0021: Cannot apply indexing with [] to an expression of type 'HashSet&lt;int&gt;'</code>) and no promised order. Copy to a list and sort when you need to display it. If you need a set that is always sorted, use <code>SortedSet&lt;T&gt;</code>.</p>"
        },
        {
          type: "code",
          title: "Queue: first in, first out",
          code: String.raw`var printJobs = new Queue<string>();
printJobs.Enqueue("report.pdf");
printJobs.Enqueue("photo.png");
printJobs.Enqueue("invoice.pdf");

Console.WriteLine($"Next up: {printJobs.Peek()}");

while (printJobs.Count > 0)
{
    string job = printJobs.Dequeue();
    Console.WriteLine($"Printing {job}");
}

// Dequeue on an empty queue throws; TryDequeue does not
if (!printJobs.TryDequeue(out string? nextJob))
    Console.WriteLine("Queue is empty");`,
          output: "Next up: report.pdf\nPrinting report.pdf\nPrinting photo.png\nPrinting invoice.pdf\nQueue is empty"
        },
        {
          type: "text",
          html: "<p>Queues model anything handled in arrival order: customer support tickets, messages, a breadth-first search through a maze. <code>Peek</code> looks at the front without removing it. Calling <code>Dequeue</code> or <code>Peek</code> on an empty queue throws <code>InvalidOperationException: Queue empty.</code>, so check <code>Count</code> or use <code>TryDequeue</code>/<code>TryPeek</code>.</p><p>A <code>Stack&lt;T&gt;</code> is the mirror image. The last thing you <code>Push</code> is the first thing you <code>Pop</code>. Undo history works this way, and so does the call stack you see in exception traces.</p>"
        },
        {
          type: "code",
          title: "Stack: undo history",
          code: String.raw`var text = "";
var history = new Stack<string>();

void Type(string s)
{
    history.Push(text);   // remember the old state
    text += s;
}

Type("Hello");
Type(", world");
Type("!!!");
Console.WriteLine(text);

text = history.Pop();     // undo once
Console.WriteLine(text);
text = history.Pop();     // undo again
Console.WriteLine(text);
Console.WriteLine($"{history.Count} undo step(s) left");`,
          output: "Hello, world!!!\nHello, world\nHello\n1 undo step(s) left"
        },
        {
          type: "code",
          title: "Stack: are the brackets balanced?",
          code: String.raw`Console.WriteLine(Balanced("{ a[1] + (b * 2) }"));
Console.WriteLine(Balanced("( [ ) ]"));
Console.WriteLine(Balanced("(("));

static bool Balanced(string s)
{
    var open = new Stack<char>();
    foreach (char c in s)
    {
        if (c is '(' or '[' or '{')
            open.Push(c);
        else if (c is ')' or ']' or '}')
        {
            if (!open.TryPop(out char top)) return false;
            char expected = c == ')' ? '('
                : c == ']' ? '[' : '{';
            if (top != expected) return false;
        }
    }
    return open.Count == 0;   // nothing left unclosed
}`,
          output: "True\nFalse\nFalse"
        },
        {
          type: "callout",
          tone: "python",
          title: "Python equivalents",
          html: "<p><code>set()</code> is <code>HashSet&lt;T&gt;</code>; <code>a &amp; b</code> is <code>IntersectWith</code>, <code>a | b</code> is <code>UnionWith</code>. <code>collections.deque</code> with <code>append</code>/<code>popleft</code> is <code>Queue&lt;T&gt;</code>. A Python list used with <code>append</code>/<code>pop()</code> as a stack is <code>Stack&lt;T&gt;</code>. C# gives each job its own type, so the intent is obvious from the declaration.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var s = new Stack<int>();
var q = new Queue<int>();
for (int i = 1; i <= 3; i++)
{
    s.Push(i);
    q.Enqueue(i);
}
Console.WriteLine($"{s.Pop()} {q.Dequeue()}");
Console.WriteLine($"{s.Peek()} {q.Peek()}");`,
          answer: "3 1\n2 2",
          explain: "<p>Both received 1, 2, 3. The stack gives back the last one first (3); the queue gives back the first one first (1). After that, the top of the stack is 2 and the front of the queue is 2. <code>Peek</code> does not remove anything.</p>"
        },
        {
          type: "mcq",
          prompt: "You must check 50,000 incoming usernames and reject any that were already used. Which collection fits best for the \"already used\" check?",
          options: [
            "List<string> with Contains",
            "HashSet<string> with Add",
            "Queue<string>",
            "string[] with Array.IndexOf"
          ],
          answer: 1,
          explain: "<p><code>HashSet.Add</code> both checks and records in one fast hashed step and returns <code>false</code> for a duplicate. <code>List.Contains</code> and <code>Array.IndexOf</code> scan every item, so 50,000 checks against a growing list gets very slow. A queue is about order, not membership.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the code so it prints the jobs in the order they arrived.",
          code: String.raw`var jobs = new Queue<string>();
jobs.___("first");
jobs.___("second");
while (jobs.Count > 0)
    Console.WriteLine(jobs.___());`,
          blanks: [["Enqueue"], ["Enqueue"], ["Dequeue"]],
          explain: "<p>A queue adds with <code>Enqueue</code> and removes from the front with <code>Dequeue</code>. <code>Push</code> and <code>Pop</code> belong to <code>Stack&lt;T&gt;</code>; <code>Add</code> belongs to lists and sets.</p>"
        },
        {
          type: "output",
          prompt: "Predict the output.",
          code: String.raw`var seen = new HashSet<char>();
string result = "";
foreach (char c in "bookkeeper")
{
    if (seen.Add(c)) result += c;
}
Console.WriteLine(result);`,
          answer: "bokepr",
          explain: "<p><code>Add</code> returns <code>true</code> only the first time a character appears, so each letter is appended once, in the order first seen: b, o, k, e, p, r. This is a standard \"remove duplicates, keep order\" trick.</p>"
        }
      ],
      takeaways: [
        "HashSet<T>: unique items, fast Contains, Add returns false for duplicates.",
        "Queue<T>: Enqueue/Dequeue, first in first out.",
        "Stack<T>: Push/Pop, last in first out; perfect for undo and nesting.",
        "Peek/Dequeue/Pop throw on empty; prefer TryPeek/TryDequeue/TryPop."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m05-l05",
      title: "Choosing a collection, indices and ranges",
      minutes: 30,
      objectives: [
        "Pick a collection based on how the data is used",
        "Describe O(1), O(n) and O(log n) in plain words",
        "Write collection expressions like [1, 2, 3] and spread with ..",
        "Use ^1 and ranges a..b to slice arrays, strings and lists"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Professionals pick a collection by asking how the data will be <em>used</em>, not how it looks. Is it looked up by key? Does order matter? Will it grow? Will you check \"is X in here?\" thousands of times? The answer points at one type.</p>"
        },
        {
          type: "table",
          headers: ["You need to...", "Use", "Why"],
          rows: [
            ["Hold a fixed number of items", "<code>T[]</code>", "Smallest and fastest"],
            ["Keep an ordered list that grows", "<code>List&lt;T&gt;</code>", "The everyday default"],
            ["Look things up by a key", "<code>Dictionary&lt;K,V&gt;</code>", "Fast lookup by key"],
            ["Track unique items / membership", "<code>HashSet&lt;T&gt;</code>", "Fast Contains, no duplicates"],
            ["Process in arrival order", "<code>Queue&lt;T&gt;</code>", "FIFO"],
            ["Undo, backtracking, nesting", "<code>Stack&lt;T&gt;</code>", "LIFO"],
            ["Keep keys always sorted", "<code>SortedDictionary&lt;K,V&gt;</code>", "Ordered, slightly slower"]
          ]
        },
        {
          type: "text",
          html: "<p><strong>Big-O notation</strong> describes how the work grows as the collection grows. You do not need the math, just the intuition:</p><ul><li><strong>O(1)</strong>, constant: the same speed with 10 items or 10 million. Array index, <code>Dictionary</code> lookup, <code>HashSet.Contains</code>, <code>List.Add</code> at the end.</li><li><strong>O(n)</strong>, linear: twice the items, twice the time. <code>List.Contains</code>, <code>Array.IndexOf</code>, <code>List.Insert(0, x)</code>.</li><li><strong>O(log n)</strong>, logarithmic: barely grows. A million items take about 20 steps. <code>Array.BinarySearch</code> on a sorted array, <code>SortedDictionary</code> lookups.</li><li><strong>O(n log n)</strong>: what a good sort costs (<code>Array.Sort</code>, <code>List.Sort</code>).</li></ul>"
        },
        {
          type: "callout",
          tone: "tip",
          title: "The mistake that shows up in code reviews",
          html: "<p>Calling <code>list.Contains</code> inside a loop over another list is O(n) work done n times, which is O(n²). With 100,000 items that is ten billion comparisons and the program seems to hang. Build a <code>HashSet</code> once, then call <code>Contains</code> on the set. The loop becomes O(n) and finishes instantly.</p>"
        },
        {
          type: "text",
          html: "<p>C# 12 added <strong>collection expressions</strong>: one short syntax that builds arrays, lists, sets and more. The square brackets create whatever type the target asks for. The <strong>spread</strong> element <code>..</code> copies all items of another collection in place.</p>"
        },
        {
          type: "code",
          title: "Collection expressions (C# 12)",
          code: String.raw`int[] small = [1, 2, 3];
List<int> big = [10, 20];
HashSet<string> colors = ["red", "green", "red"];
int[] none = [];

int[] all = [0, .. small, .. big, 99];  // spread
Console.WriteLine(string.Join(" ", all));
Console.WriteLine(colors.Count);
Console.WriteLine(none.Length);

int[] copy = [.. small];   // an independent copy
copy[0] = 100;
Console.WriteLine($"{small[0]} {copy[0]}");`,
          output: "0 1 2 3 10 20 99\n2\n0\n1 100"
        },
        {
          type: "callout",
          tone: "note",
          title: "var needs a target type",
          html: "<p><code>var x = [1, 2, 3];</code> does not compile: <code>error CS9176: There is no target type for the collection expression.</code> The brackets do not decide the type by themselves. Write the type on the left (<code>int[] x = [1, 2, 3];</code>) or pass the expression to a parameter that has a type.</p>"
        },
        {
          type: "text",
          html: "<p>Two more operators make slicing easy. The <strong>index from end</strong> <code>^n</code> counts from the end: <code>^1</code> is the last element, <code>^2</code> the one before. A <strong>range</strong> <code>a..b</code> takes elements from index <code>a</code> up to but <em>not including</em> <code>b</code>. Either side can be left out. Ranges work on arrays and strings, and on <code>List&lt;T&gt;</code> since .NET 8. Slicing always gives you a new, separate copy.</p>"
        },
        {
          type: "code",
          title: "Indices and ranges",
          code: String.raw`int[] n = [10, 20, 30, 40, 50];
Console.WriteLine(n[^1]);         // last
Console.WriteLine(n[^2]);         // second to last

int[] middle = n[1..4];           // index 1,2,3
int[] firstTwo = n[..2];
int[] lastTwo = n[^2..];
Console.WriteLine(string.Join(",", middle));
Console.WriteLine(string.Join(",", firstTwo));
Console.WriteLine(string.Join(",", lastTwo));

string file = "report.pdf";
Console.WriteLine(file[^3..]);    // extension
Console.WriteLine(file[..^4]);    // name without ".pdf"

List<string> names = ["Ann", "Bo", "Cy"];
Console.WriteLine(names[^1]);     // works on List too
Console.WriteLine(names[1..].Count);`,
          output: "50\n40\n20,30,40\n10,20\n40,50\npdf\nreport\nCy\n2"
        },
        {
          type: "callout",
          tone: "python",
          title: "Slicing compared",
          html: "<p>Python <code>xs[-1]</code> is C# <code>xs[^1]</code>, and <code>xs[1:4]</code> is <code>xs[1..4]</code>. The end is exclusive in both. Two differences: C# has no step (<code>xs[::2]</code> has no range equivalent), and a range on an array <strong>copies</strong> into a new array. <code>n[^0]</code> is one past the end, so reading it throws <code>IndexOutOfRangeException</code> just like <code>n[n.Length]</code>.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`int[] a = [5, 6, 7, 8, 9];
int[] b = [.. a[1..3], .. a[^1..]];
Console.WriteLine(string.Join(" ", b));
Console.WriteLine(a[^b.Length]);`,
          answer: "6 7 9\n7",
          explain: "<p><code>a[1..3]</code> is indexes 1 and 2 (6, 7); the end is exclusive. <code>a[^1..]</code> is just the last element, 9. So <code>b</code> is <code>6 7 9</code> with length 3, and <code>a[^3]</code> is the third from the end, 7.</p>"
        },
        {
          type: "mcq",
          prompt: "You check whether each of 200,000 order IDs appears in a list of 200,000 refunded IDs. The program crawls. What is the best fix?",
          options: [
            "Sort the refunded list before each Contains call",
            "Put the refunded IDs in a HashSet once, then call Contains on the set",
            "Use an array instead of a List",
            "Use a Queue and Dequeue each ID"
          ],
          answer: 1,
          explain: "<p><code>List.Contains</code> is O(n), so the whole job is O(n²). A <code>HashSet</code> makes each check O(1), so the job becomes O(n). Sorting before each call costs even more. An array's <code>IndexOf</code> is still a linear scan. A queue does not help with membership checks.</p>"
        },
        {
          type: "fill",
          prompt: "Fill in the blanks: take the last element, then everything except the first element.",
          code: String.raw`string[] words = ["alpha", "beta", "gamma"];
string last = words[___];
string[] rest = words[___];`,
          blanks: [["^1"], ["1..", "1..^0"]],
          explain: "<p><code>^1</code> is the last element. <code>1..</code> starts at index 1 and runs to the end. <code>words[^0]</code> would be one past the end and throw.</p>"
        },
        {
          type: "bug",
          prompt: "Which line fails to compile?",
          code: String.raw`int[] a = [1, 2, 3];          // line 1
List<int> b = [.. a, 4];      // line 2
var c = [7, 8, 9];            // line 3
HashSet<int> d = [];          // line 4`,
          options: ["Line 1", "Line 2", "Line 3", "Line 4"],
          answer: 2,
          explain: "<p>A collection expression needs a target type, and <code>var</code> gives none, so line 3 fails with <code>CS9176</code>. Line 2 spreads an array into a list, which is fine. Line 4 creates an empty set.</p>"
        },
        {
          type: "mcq",
          prompt: "Which operation is O(1) on average?",
          options: [
            "list.Contains(x) on a List<int>",
            "list.Insert(0, x) on a List<int>",
            "dict.TryGetValue(key, out v) on a Dictionary",
            "Array.Sort(arr)"
          ],
          answer: 2,
          explain: "<p>Dictionary lookups hash the key and jump to a bucket: O(1) on average. <code>List.Contains</code> scans (O(n)); inserting at the front shifts every item (O(n)); sorting is O(n log n).</p>"
        }
      ],
      takeaways: [
        "Choose by usage: index, grow, key lookup, membership, FIFO or LIFO.",
        "O(1) stays flat, O(n) grows with size; avoid Contains on a List inside a loop.",
        "Collection expressions [a, b, .. other] build arrays, lists and sets.",
        "^1 is the last element; a..b slices with an exclusive end."
      ]
    }
  ],
  // --------------------------------------------------------------------
  milestone: {
    id: "m05-project",
    title: "Gradebook",
    brief: "<p>A teacher wants a quick console gradebook. She types commands like <code>add Maya 91 84</code> to record scores, <code>list</code> to see everyone, and <code>report</code> to get each student's average, best and worst score and a letter grade, plus a class summary.</p><p>You will combine the collections from this module: a <code>Dictionary</code> from student name to a <code>List&lt;int&gt;</code> of scores, a <code>HashSet</code> or dictionary comparer to treat names case-insensitively, and arrays from <code>string.Split</code>. The program must also cope with the end of input (when <code>Console.ReadLine()</code> returns <code>null</code>) and exit cleanly.</p>",
    skills: ["Dictionary<string, List<int>>", "List<T>", "string.Split", "TryParse", "StringComparer.OrdinalIgnoreCase", "loops and switch"],
    requirements: [
      "Show a prompt and read commands in a loop until the user types quit or input ends (ReadLine returns null).",
      "add NAME SCORE [SCORE...] records one or more scores from 0 to 100; invalid scores are rejected with a message and valid ones are kept.",
      "Student names are case-insensitive: add maya 80 and add Maya 90 update the same student.",
      "list prints every student in alphabetical order with all of their scores.",
      "report prints, per student, the average (one decimal place), lowest and highest score, and a letter grade (A 90+, B 80+, C 70+, D 60+, else F).",
      "report ends with the class average across all scores and the name of the student with the highest average.",
      "remove NAME deletes a student and says whether they existed.",
      "Unknown commands and commands with missing arguments print a helpful message instead of crashing."
    ],
    sampleRun: "Gradebook. Commands: add, list, report, remove, quit\n> add Maya 91 84 77\nAdded 3 score(s) for Maya.\n> add leo 65 abc 72 140\n  Skipped 'abc': not a whole number.\n  Skipped '140': must be 0-100.\nAdded 2 score(s) for leo.\n> add maya 95\nAdded 1 score(s) for maya.\n> list\nleo: 65, 72\nMaya: 91, 84, 77, 95\n> report\nleo        avg  68.5  min 65  max 72  D\nMaya       avg  86.8  min 77  max 95  B\nClass average: 80.7 over 6 score(s)\nTop student: Maya (86.8)\n> remove bob\nNo student named bob.\n> quit\nBye!",
    starter: String.raw`// Gradebook - Module 5 milestone
// Run it and type commands. Ctrl+Z (Windows) or Ctrl+D ends input.

var grades = new Dictionary<string, List<int>>(
    StringComparer.OrdinalIgnoreCase);

Console.WriteLine(
    "Gradebook. Commands: add, list, report, remove, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;          // end of input

    string[] parts = line.Split(' ',
        StringSplitOptions.RemoveEmptyEntries);
    if (parts.Length == 0) continue;

    string command = parts[0].ToLowerInvariant();
    if (command == "quit") break;

    switch (command)
    {
        case "add":
            AddScores(parts);
            break;
        // TODO: handle "list", "report" and "remove"
        default:
            Console.WriteLine($"Unknown command '{command}'.");
            break;
    }
}
Console.WriteLine("Bye!");

void AddScores(string[] parts)
{
    // TODO: parts[1] is the name, parts[2..] are the scores.
    // TODO: validate each score with int.TryParse and 0-100.
    // TODO: create the student's list if it does not exist yet.
    Console.WriteLine("add is not implemented yet.");
}

// TODO: write ListStudents(), PrintReport() and
// RemoveStudent(string[] parts).

static string Letter(double average)
{
    // TODO: return "A", "B", "C", "D" or "F"
    return "?";
}`,
    hints: [
      "<p>Use <code>parts.Length &lt; 3</code> to detect an <code>add</code> with no scores, and <code>parts[2..]</code> to get just the score strings.</p>",
      "<p>To add to a student who may not exist yet: <code>if (!grades.TryGetValue(name, out var list)) { list = new List&lt;int&gt;(); grades[name] = list; }</code> then <code>list.Add(score)</code>. Because the list is a reference type, adding to <code>list</code> updates the one stored in the dictionary.</p>",
      "<p>For <code>list</code> in alphabetical order, copy the keys: <code>var names = new List&lt;string&gt;(grades.Keys); names.Sort(StringComparer.OrdinalIgnoreCase);</code>.</p>",
      "<p>For the report, keep running totals for the class (sum and count of all scores) and track the best average and its name as you loop. Compute an average with <code>(double)sum / count</code> to avoid integer division.</p>",
      "<p>The letter grade is a neat switch expression: <code>average switch { &gt;= 90 =&gt; \"A\", &gt;= 80 =&gt; \"B\", ... _ =&gt; \"F\" }</code>.</p>"
    ],
    solution: String.raw`// Gradebook - Module 5 milestone (solution)

var grades = new Dictionary<string, List<int>>(
    StringComparer.OrdinalIgnoreCase);

Console.WriteLine(
    "Gradebook. Commands: add, list, report, remove, quit");

while (true)
{
    Console.Write("> ");
    string? line = Console.ReadLine();
    if (line is null) break;          // end of input

    string[] parts = line.Split(' ',
        StringSplitOptions.RemoveEmptyEntries);
    if (parts.Length == 0) continue;

    string command = parts[0].ToLowerInvariant();
    if (command == "quit") break;

    switch (command)
    {
        case "add": AddScores(parts); break;
        case "list": ListStudents(); break;
        case "report": PrintReport(); break;
        case "remove": RemoveStudent(parts); break;
        default:
            Console.WriteLine($"Unknown command '{command}'.");
            break;
    }
}
Console.WriteLine("Bye!");

void AddScores(string[] parts)
{
    if (parts.Length < 3)
    {
        Console.WriteLine("Usage: add NAME SCORE [SCORE...]");
        return;
    }
    string name = parts[1];
    if (!grades.TryGetValue(name, out List<int>? scores))
    {
        scores = new List<int>();
        grades[name] = scores;   // first spelling is kept
    }

    int added = 0;
    foreach (string text in parts[2..])
    {
        if (!int.TryParse(text, out int score))
            Console.WriteLine(
                $"  Skipped '{text}': not a whole number.");
        else if (score < 0 || score > 100)
            Console.WriteLine($"  Skipped '{text}': must be 0-100.");
        else
        {
            scores.Add(score);
            added++;
        }
    }
    if (scores.Count == 0) grades.Remove(name);
    Console.WriteLine($"Added {added} score(s) for {name}.");
}

List<string> SortedNames()
{
    var names = new List<string>(grades.Keys);
    names.Sort(StringComparer.OrdinalIgnoreCase);
    return names;
}

void ListStudents()
{
    if (grades.Count == 0)
    {
        Console.WriteLine("No students yet.");
        return;
    }
    foreach (string name in SortedNames())
        Console.WriteLine($"{name}: {string.Join(", ", grades[name])}");
}

void PrintReport()
{
    if (grades.Count == 0)
    {
        Console.WriteLine("No students yet.");
        return;
    }
    int classSum = 0, classCount = 0;
    string topName = "";
    double topAverage = -1;

    foreach (string name in SortedNames())
    {
        List<int> s = grades[name];
        int sum = 0, min = 100, max = 0;
        foreach (int score in s)
        {
            sum += score;
            if (score < min) min = score;
            if (score > max) max = score;
        }
        double avg = (double)sum / s.Count;
        Console.WriteLine($"{name,-10} avg {avg,5:F1}  " +
            $"min {min}  max {max}  {Letter(avg)}");

        classSum += sum;
        classCount += s.Count;
        if (avg > topAverage)
        {
            topAverage = avg;
            topName = name;
        }
    }
    double classAvg = (double)classSum / classCount;
    Console.WriteLine($"Class average: {classAvg:F1} " +
        $"over {classCount} score(s)");
    Console.WriteLine($"Top student: {topName} ({topAverage:F1})");
}

void RemoveStudent(string[] parts)
{
    if (parts.Length < 2)
    {
        Console.WriteLine("Usage: remove NAME");
        return;
    }
    Console.WriteLine(grades.Remove(parts[1])
        ? $"Removed {parts[1]}."
        : $"No student named {parts[1]}.");
}

static string Letter(double average) => average switch
{
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    >= 60 => "D",
    _ => "F"
};`,
    stretch: [
      "Add an undo command that removes the scores added by the last add, using a Stack.",
      "Add a histogram command that prints how many students got each letter grade, using a Dictionary<string, int>.",
      "Support names with spaces by accepting quotes, or a comma between the name and the scores.",
      "Add a top N command that prints the N best students using List.Sort with a comparison."
    ]
  }
});
