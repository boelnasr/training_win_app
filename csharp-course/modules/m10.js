(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m10",
  number: 10,
  title: "LINQ",
  tagline: "Ask questions of your data: filter, sort, group and combine collections in a few readable lines.",
  level: "Intermediate",
  lessons: [
    // ------------------------------------------------------------------
    // Lesson 1: IEnumerable, Where, Select
    // ------------------------------------------------------------------
    {
      id: "m10-l01",
      title: "IEnumerable<T>, Where and Select",
      minutes: 22,
      objectives: [
        "Explain what IEnumerable<T> is and why LINQ is built on it",
        "Filter a sequence with Where and transform it with Select",
        "Chain LINQ calls into a readable pipeline",
        "Turn results into a List or array with ToList and ToArray"
      ],
      blocks: [
        {
          type: "text",
          html: "<p><strong>LINQ</strong> (Language Integrated Query) is a set of methods for asking questions of collections: \"which orders are over 100?\", \"what are the customer names?\", \"what is the total per region?\". Instead of writing a loop, an <code>if</code> and a temporary list every time, you describe <em>what</em> you want.</p>"
        },
        {
          type: "compare",
          left: {
            label: "Loop version",
            code: String.raw`var result = new List<string>();
foreach (var p in products)
{
    if (p.Price > 20)
    {
        result.Add(p.Name.ToUpper());
    }
}`
          },
          right: {
            label: "LINQ version",
            code: String.raw`var result = products
    .Where(p => p.Price > 20)
    .Select(p => p.Name.ToUpper())
    .ToList();`
          }
        },
        {
          type: "text",
          html: "<p>Both do the same work. The LINQ version reads like the question itself: <em>where</em> the price is over 20, <em>select</em> the upper-case name. Once you know about 20 LINQ methods, you can read almost any data-processing code in the .NET world.</p>"
        },
        {
          type: "text",
          html: "<p><strong>The foundation: <code>IEnumerable&lt;T&gt;</code>.</strong> This interface means \"something you can walk through one item at a time\". It has a single method, <code>GetEnumerator()</code>, which is what <code>foreach</code> uses. Arrays, <code>List&lt;T&gt;</code>, <code>HashSet&lt;T&gt;</code>, <code>Dictionary&lt;K,V&gt;</code>, strings and more all implement it.</p><p>LINQ methods are <strong>extension methods</strong> on <code>IEnumerable&lt;T&gt;</code>, defined in the <code>System.Linq</code> namespace (imported automatically by implicit usings). So every collection gets all of them for free. They take lambdas, the <code>Func</code> delegates from the previous module.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int[] numbers = [5, 12, 8, 3, 20, 7];

// Where keeps items for which the lambda returns true
IEnumerable<int> big = numbers.Where(n => n > 6);
Console.WriteLine(string.Join(", ", big));

// Select turns each item into something else
IEnumerable<int> doubled = numbers.Select(n => n * 2);
Console.WriteLine(string.Join(", ", doubled));

// The result type can change: int -> string
var labels = numbers.Select(n => n % 2 == 0 ? "even" : "odd");
Console.WriteLine(string.Join(", ", labels));

// Works on strings too: a string is IEnumerable<char>
var vowels = "Language Integrated Query"
    .Where(c => "aeiouAEIOU".Contains(c));
Console.WriteLine(new string(vowels.ToArray()));`,
          output: "12, 8, 20, 7\n10, 24, 16, 6, 40, 14\nodd, even, even, odd, even, odd\nauaeIeaeue"
        },
        {
          type: "text",
          html: "<p>Each LINQ method returns a new sequence and <strong>never changes the original</strong>. That makes them easy to chain: the output of one step is the input of the next. Put each step on its own line, starting with the dot, so the pipeline reads top to bottom.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var products = new List<Product>
{
    new("Keyboard", 49.99m, "Accessories"),
    new("Monitor", 189.00m, "Displays"),
    new("Mouse", 19.50m, "Accessories"),
    new("Webcam", 64.00m, "Accessories"),
    new("Laptop", 999.00m, "Computers"),
};

List<string> pricey = products
    .Where(p => p.Category == "Accessories")
    .Where(p => p.Price > 20)
    .Select(p => $"{p.Name} ({p.Price})")
    .ToList();

foreach (string line in pricey) Console.WriteLine(line);

// Select can build a new anonymous type on the fly
var tags = products.Select(p => new { p.Name, Cheap = p.Price < 50 });
foreach (var t in tags.Take(2)) Console.WriteLine(t);

record Product(string Name, decimal Price, string Category);`,
          output: "Keyboard (49.99)\nWebcam (64.00)\n{ Name = Keyboard, Cheap = True }\n{ Name = Monitor, Cheap = False }"
        },
        {
          type: "callout",
          tone: "note",
          title: "Anonymous types",
          html: "<p><code>new { p.Name, Cheap = ... }</code> creates an object of a type with no name. The compiler generates it with read-only properties, a <code>ToString</code> and value equality. It is handy for intermediate results inside one method. You must use <code>var</code> to hold it, and you cannot return it from a method with a useful type. For anything that leaves the method, declare a <code>record</code>.</p>"
        },
        {
          type: "text",
          html: "<p><code>Where</code> and <code>Select</code> also have overloads that pass the item's <strong>index</strong> as a second lambda parameter:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`string[] podium = ["Ana", "Ben", "Cleo"];
var ranked = podium.Select((name, i) => $"{i + 1}. {name}");
Console.WriteLine(string.Join(" | ", ranked));

var everyOther = podium.Where((name, i) => i % 2 == 0);
Console.WriteLine(string.Join(" ", everyOther));`,
          output: "1. Ana | 2. Ben | 3. Cleo\nAna Cleo"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p><code>[p.name.upper() for p in products if p.price &gt; 20]</code> is the Python comprehension for the LINQ example above. <code>Where</code> is the <code>if</code> part and <code>Select</code> is the expression part. Like a generator expression, a LINQ query is lazy until you loop over it or call <code>ToList()</code>. Lesson 5 covers what that means in practice.</p>"
        },
        {
          type: "callout",
          tone: "tip",
          title: "Read the compiler error",
          html: "<p>If you write <code>List&lt;int&gt; xs = numbers.Where(n =&gt; n &gt; 6);</code> you get <strong>CS0266</strong>: <em>Cannot implicitly convert type 'IEnumerable&lt;int&gt;' to 'List&lt;int&gt;'</em>. LINQ returns <code>IEnumerable&lt;T&gt;</code>, not a list. Add <code>.ToList()</code> (or <code>.ToArray()</code>) when you need a real list.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`int[] xs = [1, 2, 3, 4, 5, 6];
var result = xs
    .Where(x => x % 2 == 0)
    .Select(x => x * x);
Console.WriteLine(string.Join(" ", result));
Console.WriteLine(xs.Length);`,
          answer: "4 16 36\n6",
          explain: "<p><code>Where</code> keeps 2, 4 and 6. <code>Select</code> squares them. The original array is untouched, so it still has 6 items. LINQ always produces a new sequence.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the query: the names of people aged 18 or over, as a <code>List&lt;string&gt;</code>.",
          code: String.raw`List<string> adults = people
    .___(p => p.Age >= 18)
    .___(p => p.Name)
    .___();`,
          blanks: [["Where"], ["Select"], ["ToList"]],
          explain: "<p>Filter first with <code>Where</code>, then project with <code>Select</code>, then materialize with <code>ToList</code>. Without <code>ToList()</code> the type is <code>IEnumerable&lt;string&gt;</code>, and assigning it to a <code>List&lt;string&gt;</code> fails with CS0266.</p>"
        },
        {
          type: "mcq",
          prompt: "Why can you call <code>.Where(...)</code> on an array, a <code>List&lt;T&gt;</code> and a <code>HashSet&lt;T&gt;</code>?",
          options: [
            "Where is an extension method on IEnumerable<T>, which all of them implement",
            "Each collection class has its own Where method",
            "Arrays are converted to lists automatically",
            "The compiler rewrites Where into a for loop"
          ],
          answer: 0,
          explain: "<p>LINQ methods live once in <code>System.Linq.Enumerable</code> as extension methods on <code>IEnumerable&lt;T&gt;</code>. The collection classes do not define <code>Where</code> themselves, and nothing is converted. The method runs its own loop through <code>GetEnumerator()</code>.</p>"
        },
        {
          type: "bug",
          prompt: "Which line causes a compile error?",
          code: String.raw`string[] words = ["sun", "moon", "star"];
var lengths = words.Select(w => w.Length);   // line A
int first = lengths.First();                 // line B
List<int> list = lengths;                    // line C`,
          options: [
            "Line C: an IEnumerable<int> is not a List<int> (CS0266)",
            "Line A: Select cannot change string into int",
            "Line B: First does not exist on IEnumerable<int>",
            "None, it compiles"
          ],
          answer: 0,
          explain: "<p><code>Select</code> may change the element type, so line A is fine. <code>First()</code> is another LINQ method, so line B is fine. Line C needs <code>lengths.ToList()</code>.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`string[] names = ["zoe", "Al", "bea"];
var shown = names
    .Select((n, i) => $"{i}:{n.ToUpper()}")
    .Where(s => s.Length > 4);
Console.WriteLine(string.Join(",", shown));`,
          answer: "0:ZOE,2:BEA",
          explain: "<p><code>Select</code> runs first and builds <code>0:ZOE</code>, <code>1:AL</code> and <code>2:BEA</code>. Then <code>Where</code> keeps strings longer than 4 characters. <code>1:AL</code> has only 4, so it is dropped. Order of steps matters: the index comes from the original position.</p>"
        }
      ],
      takeaways: [
        "IEnumerable<T> means \"can be walked with foreach\"; all collections implement it.",
        "LINQ methods are extension methods on IEnumerable<T> that take lambdas.",
        "Where filters, Select transforms; neither changes the source.",
        "Chain steps one per line; call ToList() or ToArray() when you need a real collection.",
        "Anonymous types (new { ... }) are great for short-lived results inside one method."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 2: Ordering, paging, element and quantifier operators
    // ------------------------------------------------------------------
    {
      id: "m10-l02",
      title: "Sorting, paging and picking elements",
      minutes: 25,
      objectives: [
        "Sort by one or more keys with OrderBy, ThenBy and their Descending forms",
        "Page through data with Skip and Take",
        "Choose correctly between First, FirstOrDefault, Single and Last",
        "Ask yes/no questions with Any, All, Contains and Count"
      ],
      blocks: [
        {
          type: "text",
          html: "<p><strong>Sorting.</strong> <code>OrderBy</code> takes a lambda that picks the <strong>key</strong> to sort by. <code>OrderByDescending</code> sorts the other way. To break ties, chain <code>ThenBy</code> or <code>ThenByDescending</code>. The sort is <em>stable</em>: items with equal keys keep their original order.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var staff = new List<Employee>
{
    new("Maya", "Sales", 52000),
    new("Omar", "IT", 61000),
    new("Lena", "Sales", 58000),
    new("Ravi", "IT", 61000),
    new("Ines", "HR", 47000),
};

var bySalary = staff.OrderByDescending(e => e.Salary);
foreach (var e in bySalary) Console.WriteLine(e.Name);

Console.WriteLine("---");
var sorted = staff
    .OrderBy(e => e.Dept)
    .ThenByDescending(e => e.Salary)
    .Select(e => $"{e.Dept,-5} {e.Name} {e.Salary}");
foreach (var line in sorted) Console.WriteLine(line);

record Employee(string Name, string Dept, int Salary);`,
          output: "Omar\nRavi\nLena\nMaya\nInes\n---\nHR    Ines 47000\nIT    Omar 61000\nIT    Ravi 61000\nSales Lena 58000\nSales Maya 52000"
        },
        {
          type: "callout",
          tone: "warning",
          title: "OrderBy twice is not ThenBy",
          html: "<p><code>.OrderBy(e =&gt; e.Dept).OrderBy(e =&gt; e.Salary)</code> sorts by department, then throws that away and re-sorts the whole list by salary. Use <code>ThenBy</code> for the second key. Also note that <code>List&lt;T&gt;.Sort()</code> sorts the list <em>in place</em>, while <code>OrderBy</code> leaves the source alone and returns a new sequence.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Paging.</strong> <code>Take(n)</code> keeps the first <code>n</code> items. <code>Skip(n)</code> drops them and keeps the rest. Together they give you page 3 of a search result. <code>TakeWhile</code> and <code>SkipWhile</code> use a condition instead of a count and stop at the first item that fails it. <code>Chunk(n)</code> splits a sequence into arrays of size <code>n</code>.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var items = Enumerable.Range(1, 10);   // 1..10

int pageSize = 3;
int page = 2;                           // zero-based
var pageItems = items.Skip(page * pageSize).Take(pageSize);
Console.WriteLine(string.Join(" ", pageItems));

int[] temps = [12, 15, 19, 23, 18, 25];
var warmingUp = temps.TakeWhile(t => t < 20);
Console.WriteLine(string.Join(" ", warmingUp));

foreach (int[] batch in items.Chunk(4))
    Console.WriteLine("[" + string.Join(",", batch) + "]");`,
          output: "7 8 9\n12 15 19\n[1,2,3,4]\n[5,6,7,8]\n[9,10]"
        },
        {
          type: "text",
          html: "<p><strong>Picking one element.</strong> These methods return a single item, not a sequence. The difference between them is what happens when there are zero or several matches. Choosing the right one documents your assumptions and catches bad data early.</p>"
        },
        {
          type: "table",
          headers: ["Method", "0 matches", "1 match", "2+ matches"],
          rows: [
            ["<code>First(pred)</code>", "throws", "returns it", "returns the first"],
            ["<code>FirstOrDefault(pred)</code>", "returns <code>default</code> (null, 0...)", "returns it", "returns the first"],
            ["<code>Single(pred)</code>", "throws", "returns it", "throws"],
            ["<code>SingleOrDefault(pred)</code>", "returns <code>default</code>", "returns it", "throws"],
            ["<code>Last(pred)</code> / <code>LastOrDefault</code>", "throws / default", "returns it", "returns the last"],
            ["<code>ElementAt(i)</code>", "throws if out of range", "", ""]
          ]
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var users = new List<User>
{
    new(1, "ada@example.com"),
    new(2, "bob@example.com"),
    new(3, "cy@example.com"),
};

User? bob = users.FirstOrDefault(u => u.Email.StartsWith("bob"));
Console.WriteLine(bob?.Id);

User? nobody = users.FirstOrDefault(u => u.Id == 99);
Console.WriteLine(nobody is null ? "not found" : "found");

// Ids are unique, so exactly one match is expected
User three = users.Single(u => u.Id == 3);
Console.WriteLine(three.Email);

// FirstOrDefault with a fallback value (.NET 6+)
User guest = users.FirstOrDefault(u => u.Id == 0,
                                  new User(0, "guest"));
Console.WriteLine(guest.Email);

try
{
    users.First(u => u.Id > 10);
}
catch (InvalidOperationException ex)
{
    Console.WriteLine(ex.Message);
}

record User(int Id, string Email);`,
          output: "2\nnot found\ncy@example.com\nguest\nSequence contains no matching element"
        },
        {
          type: "callout",
          tone: "tip",
          title: "How professionals choose",
          html: "<p>Use <code>Single</code> when duplicates would mean a bug (looking up by a unique id): it fails loudly instead of quietly picking one. Use <code>FirstOrDefault</code> when \"not found\" is a normal outcome and you will check for null. Use <code>First</code> only when an empty result is truly impossible. A bare <code>First()</code> on user data is a classic source of the runtime error <em>Sequence contains no elements</em>.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Yes/no questions and counts.</strong> <code>Any</code> asks \"is there at least one?\", <code>All</code> asks \"does every item match?\", <code>Contains</code> checks for a specific value and <code>Count</code> counts (optionally with a condition). <code>MinBy</code> and <code>MaxBy</code> return the <em>item</em> with the smallest or largest key. <code>Distinct</code> removes duplicates.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int[] scores = [72, 88, 95, 60, 88, 41];

Console.WriteLine(scores.Any(s => s < 50));      // any failing?
Console.WriteLine(scores.All(s => s >= 40));     // all >= 40?
Console.WriteLine(scores.Contains(95));
Console.WriteLine(scores.Count(s => s >= 70));
Console.WriteLine(string.Join(" ", scores.Distinct()));

var people = new[] { ("Kim", 34), ("Leo", 19), ("Mo", 52) };
Console.WriteLine(people.MaxBy(p => p.Item2).Item1);
Console.WriteLine(people.MinBy(p => p.Item2).Item1);

int[] empty = [];
Console.WriteLine(empty.All(s => s > 1000));     // vacuous truth`,
          output: "True\nTrue\nTrue\n4\n72 88 95 60 41\nMo\nLeo\nTrue"
        },
        {
          type: "callout",
          tone: "warning",
          title: "Any() beats Count() > 0",
          html: "<p>To check whether a sequence has items, write <code>xs.Any()</code>. <code>Count()</code> may walk the <em>entire</em> sequence just to compare with zero, while <code>Any()</code> stops at the first item. On a database query or a large file reader, that difference is huge. Code analyzers flag <code>Count() &gt; 0</code> for this reason (rule CA1827).</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`string[] words = ["pear", "fig", "apple", "kiwi", "date"];
var result = words
    .OrderBy(w => w.Length)
    .ThenBy(w => w)
    .Skip(1)
    .Take(3);
Console.WriteLine(string.Join(" ", result));`,
          answer: "date kiwi pear",
          explain: "<p>Sorted by length then alphabetically: <code>fig</code> (3), <code>date</code>, <code>kiwi</code>, <code>pear</code> (4), <code>apple</code> (5). <code>Skip(1)</code> drops <code>fig</code>, and <code>Take(3)</code> keeps the next three.</p>"
        },
        {
          type: "mcq",
          prompt: "You look up an order by its unique order number. If two orders ever share a number, that is a data bug you want to catch. Which method fits?",
          options: [
            "SingleOrDefault",
            "FirstOrDefault",
            "First",
            "ElementAt"
          ],
          answer: 0,
          explain: "<p><code>SingleOrDefault</code> returns null when there is no order and throws if there are two, so the bug surfaces. <code>FirstOrDefault</code> would hide duplicates by picking one. <code>First</code> also hides duplicates and throws on a normal \"not found\". <code>ElementAt</code> works by position, not by number.</p>"
        },
        {
          type: "fill",
          prompt: "Sort products by category A to Z, then by price from highest to lowest.",
          code: String.raw`var sorted = products
    .___(p => p.Category)
    .___(p => p.Price);`,
          blanks: [["OrderBy"], ["ThenByDescending"]],
          explain: "<p>The primary key uses <code>OrderBy</code>. The tie-breaker must be a <code>ThenBy</code> variant. A second <code>OrderByDescending</code> would discard the category order completely.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`int[] xs = [3, 6, 9, 4, 12];
Console.WriteLine(xs.Any(x => x > 10));
Console.WriteLine(xs.All(x => x % 3 == 0));
Console.WriteLine(xs.TakeWhile(x => x % 3 == 0).Count());
Console.WriteLine(xs.FirstOrDefault(x => x > 100));`,
          answer: "True\nFalse\n3\n0",
          explain: "<p>12 is over 10, so <code>Any</code> is true. 4 is not divisible by 3, so <code>All</code> is false. <code>TakeWhile</code> stops at 4, keeping three items. No item exceeds 100, so <code>FirstOrDefault</code> returns <code>default(int)</code>, which is 0, not null.</p>"
        },
        {
          type: "bug",
          prompt: "This code is meant to sort by last name, then first name. What is wrong?",
          code: String.raw`var ordered = people
    .OrderBy(p => p.LastName)
    .OrderBy(p => p.FirstName);`,
          options: [
            "The second OrderBy re-sorts everything; it should be ThenBy",
            "OrderBy cannot be called on a property of type string",
            "The lambdas must return int",
            "Nothing, it sorts by last name then first name"
          ],
          answer: 0,
          explain: "<p>Each <code>OrderBy</code> starts a fresh sort, so the result is ordered by first name only (with last name order surviving only between equal first names). <code>ThenBy</code> adds a tie-breaker instead. Any comparable key works, strings included.</p>"
        }
      ],
      takeaways: [
        "OrderBy/OrderByDescending set the main sort; ThenBy/ThenByDescending break ties.",
        "Skip(n).Take(m) is the paging pattern; Chunk(n) makes batches.",
        "First throws on empty, FirstOrDefault returns default, Single also throws on duplicates.",
        "Use Any() to test for items instead of Count() > 0.",
        "MinBy and MaxBy return the whole item with the extreme key."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 3: Grouping and aggregation
    // ------------------------------------------------------------------
    {
      id: "m10-l03",
      title: "Grouping, aggregation and lookups",
      minutes: 26,
      objectives: [
        "Compute totals and statistics with Sum, Average, Min, Max and Aggregate",
        "Group items by a key with GroupBy and summarize each group",
        "Build fast lookups with ToDictionary and ToLookup",
        "Avoid the duplicate-key and empty-sequence exceptions"
      ],
      blocks: [
        {
          type: "text",
          html: "<p><strong>Aggregation</strong> means boiling a sequence down to one value. LINQ has the common ones built in. Each takes an optional selector lambda to say which number to use.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var orders = new List<Order>
{
    new("Alice", "Books", 35.00m),
    new("Bob", "Games", 60.00m),
    new("Alice", "Games", 45.50m),
    new("Cara", "Books", 12.25m),
    new("Bob", "Books", 20.00m),
};

Console.WriteLine(orders.Sum(o => o.Amount));
Console.WriteLine(orders.Average(o => o.Amount));
Console.WriteLine(orders.Min(o => o.Amount));
Console.WriteLine(orders.Max(o => o.Amount));
Console.WriteLine(orders.Count);

record Order(string Customer, string Category, decimal Amount);`,
          output: "172.75\n34.55\n12.25\n60.00\n5"
        },
        {
          type: "callout",
          tone: "warning",
          title: "Empty sequences",
          html: "<p><code>Sum</code> of an empty sequence is 0. <code>Average</code>, <code>Min</code> and <code>Max</code> on an empty sequence of numbers <strong>throw</strong> <code>InvalidOperationException: Sequence contains no elements</code>, because there is no sensible answer. Guard with <code>if (xs.Any())</code>, or use <code>DefaultIfEmpty()</code>: <code>xs.DefaultIfEmpty(0).Max()</code>.</p>"
        },
        {
          type: "text",
          html: "<p><code>Aggregate</code> is the general tool behind all of these. You give it a starting value (the <strong>seed</strong>) and a lambda that combines the running result with the next item. It is LINQ's version of Python's <code>functools.reduce</code>. Reach for it when no built-in method fits.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int[] digits = [4, 2, 7];

int product = digits.Aggregate(1, (acc, d) => acc * d);
Console.WriteLine(product);

int asNumber = digits.Aggregate(0, (acc, d) => acc * 10 + d);
Console.WriteLine(asNumber);

string path = new[] { "home", "user", "docs" }
    .Aggregate("", (acc, part) => acc + "/" + part);
Console.WriteLine(path);`,
          output: "56\n427\n/home/user/docs"
        },
        {
          type: "text",
          html: "<p><strong>GroupBy</strong> splits a sequence into buckets that share a key. It returns a sequence of groups. Each group is an <code>IGrouping&lt;TKey, TElement&gt;</code>: it has a <code>Key</code> property and is itself a sequence of the items in that bucket. So you can run any LINQ method on a group.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var orders = new List<Order>
{
    new("Alice", "Books", 35.00m),
    new("Bob", "Games", 60.00m),
    new("Alice", "Games", 45.50m),
    new("Cara", "Books", 12.25m),
    new("Bob", "Books", 20.00m),
};

foreach (var group in orders.GroupBy(o => o.Category))
{
    Console.WriteLine($"{group.Key}: {group.Count()} orders");
    foreach (var o in group)
        Console.WriteLine($"  {o.Customer} {o.Amount}");
}

// The usual pattern: group, then summarize each group
var totals = orders
    .GroupBy(o => o.Customer)
    .Select(g => new { Customer = g.Key, Total = g.Sum(o => o.Amount) })
    .OrderByDescending(x => x.Total);

foreach (var t in totals)
    Console.WriteLine($"{t.Customer,-6}{t.Total,8}");

record Order(string Customer, string Category, decimal Amount);`,
          output: "Books: 3 orders\n  Alice 35.00\n  Cara 12.25\n  Bob 20.00\nGames: 2 orders\n  Bob 60.00\n  Alice 45.50\nAlice    80.50\nBob      80.00\nCara     12.25"
        },
        {
          type: "callout",
          tone: "note",
          title: "Group order",
          html: "<p>In LINQ to Objects, groups come out in the order their keys were first seen, and items inside a group keep their original order. If you need a specific order, add an <code>OrderBy</code> after grouping, as the totals example does.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Lookups.</strong> When you need to find items by key many times, turn the sequence into a dictionary once. <code>ToDictionary(keySelector, valueSelector)</code> builds a <code>Dictionary</code>. It requires <strong>unique</strong> keys. <code>ToLookup</code> allows several items per key and returns an empty sequence for missing keys instead of throwing.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var orders = new List<Order>
{
    new(101, "Alice", 35.00m),
    new(102, "Bob", 60.00m),
    new(103, "Alice", 45.50m),
};

Dictionary<int, Order> byId = orders.ToDictionary(o => o.Id);
Console.WriteLine(byId[102].Customer);

Dictionary<int, decimal> amounts =
    orders.ToDictionary(o => o.Id, o => o.Amount);
Console.WriteLine(amounts[103]);

ILookup<string, Order> byCustomer =
    orders.ToLookup(o => o.Customer);
Console.WriteLine(byCustomer["Alice"].Count());
Console.WriteLine(byCustomer["Zed"].Count());   // no exception

try
{
    orders.ToDictionary(o => o.Customer);   // "Alice" twice
}
catch (ArgumentException ex)
{
    Console.WriteLine(ex.Message);
}

record Order(int Id, string Customer, decimal Amount);`,
          output: "Bob\n45.50\n2\n0\nAn item with the same key has already been added. Key: Alice"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p><code>GroupBy</code> is like <code>itertools.groupby</code> without the gotcha: Python's version only groups <em>adjacent</em> items, so you must sort first. LINQ's <code>GroupBy</code> collects matching keys from anywhere. <code>ToLookup</code> is close to a <code>defaultdict(list)</code> that you cannot modify.</p>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "decimal keeps trailing zeros",
          html: "<p>Notice <code>60.00</code> and <code>45.50</code> in the output. A <code>decimal</code> remembers its scale, so <code>45.50m</code> prints with two decimal places. A <code>double</code> would print <code>45.5</code>. When you show money to users, format explicitly anyway, for example <code>{amount:F2}</code>, so the output never depends on how the value was produced.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`string[] words = ["ant", "bee", "cat", "bat", "ape"];
var groups = words.GroupBy(w => w[0]);
foreach (var g in groups)
    Console.WriteLine($"{g.Key}={string.Join("+", g)}");`,
          answer: "a=ant+ape\nb=bee+bat\nc=cat",
          explain: "<p>Words are grouped by their first letter. Groups appear in the order each key was first seen (a, b, c). Inside a group, items keep their original order: <code>ant</code> before <code>ape</code>, <code>bee</code> before <code>bat</code>.</p>"
        },
        {
          type: "fill",
          prompt: "Total sales per region, as a dictionary from region name to total.",
          code: String.raw`Dictionary<string, decimal> totals = sales
    .___(s => s.Region)
    .ToDictionary(g => g.___, g => g.___(s => s.Amount));`,
          blanks: [["GroupBy"], ["Key"], ["Sum"]],
          explain: "<p><code>GroupBy</code> produces one group per region. In <code>ToDictionary</code>, the group's <code>Key</code> becomes the dictionary key, and <code>Sum</code> over the group's items becomes the value. Grouping first guarantees the keys are unique.</p>"
        },
        {
          type: "mcq",
          prompt: "<code>emails.ToDictionary(e =&gt; e.Domain)</code> throws at runtime. What is the most likely reason?",
          options: [
            "Several emails share the same domain, and dictionary keys must be unique",
            "ToDictionary requires a value selector",
            "Strings cannot be dictionary keys",
            "The list was empty"
          ],
          answer: 0,
          explain: "<p>A duplicate key throws <code>ArgumentException</code>: an item with the same key has already been added. Use <code>ToLookup</code> or <code>GroupBy</code> when keys can repeat. The value selector is optional (the whole item is the value), strings make fine keys, and an empty list simply gives an empty dictionary.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`int[] xs = [2, 3, 4];
Console.WriteLine(xs.Aggregate(10, (acc, x) => acc + x));
Console.WriteLine(xs.Aggregate(1, (acc, x) => acc * x));
Console.WriteLine(new int[0].Sum());`,
          answer: "19\n24\n0",
          explain: "<p>The seed is the starting value: 10 + 2 + 3 + 4 = 19, and 1 * 2 * 3 * 4 = 24. <code>Sum</code> of an empty sequence is 0. (<code>Max</code> or <code>Average</code> on that empty array would throw instead.)</p>"
        },
        {
          type: "bug",
          prompt: "Some days have no readings. What goes wrong?",
          code: String.raw`List<double> readings = LoadReadings(day);
double peak = readings.Max();
Console.WriteLine($"Peak: {peak}");`,
          options: [
            "Max throws InvalidOperationException on an empty list",
            "Max returns double.NaN on an empty list",
            "Max returns 0 on an empty list, which is misleading",
            "Max only works on int"
          ],
          answer: 0,
          explain: "<p>For a sequence of non-nullable numbers, <code>Max</code>, <code>Min</code> and <code>Average</code> throw <em>Sequence contains no elements</em>. Check <code>readings.Any()</code> first, or use <code>readings.DefaultIfEmpty().Max()</code>. Only <code>Sum</code> quietly returns 0.</p>"
        }
      ],
      takeaways: [
        "Sum, Average, Min, Max and Count reduce a sequence to one number.",
        "Average, Min and Max throw on empty sequences; Sum returns 0.",
        "Aggregate(seed, (acc, x) => ...) is the general fold.",
        "GroupBy gives groups with a Key; summarize them with Select.",
        "ToDictionary needs unique keys; ToLookup allows many items per key."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 4: Join, SelectMany, query syntax
    // ------------------------------------------------------------------
    {
      id: "m10-l04",
      title: "Join, SelectMany and query syntax",
      minutes: 26,
      objectives: [
        "Combine two sequences on a matching key with Join and GroupJoin",
        "Flatten nested collections with SelectMany",
        "Read and write LINQ query syntax (from, where, select, orderby, group, join, let)",
        "Choose between query syntax and method syntax"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Real data is spread over several collections: customers in one list, orders in another, linked by an id. <strong>Join</strong> pairs up items from two sequences whose keys match, like a SQL inner join.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var customers = new List<Customer>
{
    new(1, "Alice"), new(2, "Bob"), new(3, "Cara"),
};
var orders = new List<Order>
{
    new(101, 1, 35m), new(102, 2, 60m), new(103, 1, 45m),
};

var joined = orders.Join(
    customers,                 // the other sequence
    o => o.CustomerId,         // key from orders
    c => c.Id,                 // key from customers
    (o, c) => $"#{o.Id} {c.Name} {o.Total}");  // result

foreach (var line in joined) Console.WriteLine(line);

record Customer(int Id, string Name);
record Order(int Id, int CustomerId, decimal Total);`,
          output: "#101 Alice 35\n#102 Bob 60\n#103 Alice 45"
        },
        {
          type: "text",
          html: "<p><code>Join</code> is an <em>inner</em> join: Cara has no orders, so she does not appear at all. When you want every customer, with their orders (possibly none), use <code>GroupJoin</code>. It gives each customer the <em>group</em> of matching orders:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var customers = new List<Customer>
{
    new(1, "Alice"), new(2, "Bob"), new(3, "Cara"),
};
var orders = new List<Order>
{
    new(101, 1, 35m), new(102, 2, 60m), new(103, 1, 45m),
};

var summary = customers.GroupJoin(
    orders,
    c => c.Id,
    o => o.CustomerId,
    (c, os) => $"{c.Name}: {os.Count()} order(s), {os.Sum(o => o.Total)}");

foreach (var line in summary) Console.WriteLine(line);

record Customer(int Id, string Name);
record Order(int Id, int CustomerId, decimal Total);`,
          output: "Alice: 2 order(s), 80\nBob: 1 order(s), 60\nCara: 0 order(s), 0"
        },
        {
          type: "callout",
          tone: "tip",
          title: "Often a dictionary is simpler",
          html: "<p>For \"look up the customer for each order\", many developers build <code>var byId = customers.ToDictionary(c =&gt; c.Id);</code> once and then use <code>byId[o.CustomerId]</code> inside a <code>Select</code>. It is just as fast and easier to read. Use <code>Join</code> when both sides are large or when you are writing a query against a database.</p>"
        },
        {
          type: "text",
          html: "<p><strong>SelectMany</strong> flattens. If each item contains a collection (a student has several courses, an order has several lines), <code>Select</code> gives you a sequence of collections. <code>SelectMany</code> gives you one flat sequence of all their items.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var students = new List<Student>
{
    new("Ana", ["Math", "Art"]),
    new("Ben", ["Math", "History", "Music"]),
    new("Cy",  ["Art"]),
};

// Select: a sequence of lists (nested)
IEnumerable<List<string>> nested = students.Select(s => s.Courses);
Console.WriteLine(nested.Count());

// SelectMany: one flat sequence
var allCourses = students.SelectMany(s => s.Courses);
Console.WriteLine(string.Join(", ", allCourses));
Console.WriteLine(string.Join(", ", allCourses.Distinct()));

// Keep the parent around with the result-selector overload
var pairs = students.SelectMany(
    s => s.Courses,
    (s, course) => $"{s.Name}:{course}");
Console.WriteLine(string.Join(" ", pairs));

record Student(string Name, List<string> Courses);`,
          output: "3\nMath, Art, Math, History, Music, Art\nMath, Art, History, Music\nAna:Math Ana:Art Ben:Math Ben:History Ben:Music Cy:Art"
        },
        {
          type: "text",
          html: "<p><strong>Query syntax.</strong> C# has a second way to write LINQ that looks like SQL. The compiler translates it into the same method calls you already know: <code>where</code> becomes <code>Where</code>, <code>select</code> becomes <code>Select</code>, and so on. A query starts with <code>from</code> and ends with <code>select</code> or <code>group</code>.</p>"
        },
        {
          type: "compare",
          left: {
            label: "Query syntax",
            code: String.raw`var cheap =
    from p in products
    where p.Price < 50
    orderby p.Name
    select p.Name;`
          },
          right: {
            label: "Method syntax (same thing)",
            code: String.raw`var cheap = products
    .Where(p => p.Price < 50)
    .OrderBy(p => p.Name)
    .Select(p => p.Name);`
          }
        },
        {
          type: "text",
          html: "<p>Query syntax shines when a query has several range variables: joins, nested <code>from</code> clauses (that is <code>SelectMany</code>) and <code>let</code>, which stores an intermediate value so you do not compute it twice. In method syntax those need awkward anonymous types.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var customers = new List<Customer>
{
    new(1, "Alice"), new(2, "Bob"), new(3, "Cara"),
};
var orders = new List<Order>
{
    new(101, 1, 35m), new(102, 2, 60m), new(103, 1, 45m),
};

var bigOrders =
    from o in orders
    join c in customers on o.CustomerId equals c.Id
    let withTax = o.Total * 1.2m
    where withTax > 50
    orderby withTax descending
    select $"{c.Name} {withTax:F2}";
foreach (var s in bigOrders) Console.WriteLine(s);

var byName =
    from o in orders
    join c in customers on o.CustomerId equals c.Id
    group o by c.Name into g
    select $"{g.Key} spent {g.Sum(o => o.Total)}";
foreach (var s in byName) Console.WriteLine(s);

record Customer(int Id, string Name);
record Order(int Id, int CustomerId, decimal Total);`,
          output: "Bob 72.00\nAlice 54.00\nAlice spent 80\nBob spent 60"
        },
        {
          type: "table",
          headers: ["Query keyword", "Method it becomes"],
          rows: [
            ["<code>where x</code>", "<code>Where</code>"],
            ["<code>select x</code>", "<code>Select</code>"],
            ["<code>orderby a, b descending</code>", "<code>OrderBy</code> then <code>ThenByDescending</code>"],
            ["<code>group x by k</code>", "<code>GroupBy</code>"],
            ["<code>join ... on a equals b</code>", "<code>Join</code> (note: <code>equals</code>, not <code>==</code>)"],
            ["second <code>from</code>", "<code>SelectMany</code>"],
            ["<code>let y = ...</code>", "a <code>Select</code> into a hidden anonymous type"]
          ]
        },
        {
          type: "callout",
          tone: "note",
          title: "Which style should you use?",
          html: "<p>Most C# codebases use method syntax by default, because it covers every operator (<code>Take</code>, <code>Distinct</code>, <code>Any</code> and others have no query keyword) and chains naturally. Use query syntax when a join or <code>let</code> makes it clearly easier to read. Mixing is fine: <code>(from ... select ...).ToList()</code>.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var teams = new[]
{
    new { Team = "Red", Players = new[] { "Ann", "Bo" } },
    new { Team = "Blue", Players = new[] { "Cid" } },
};
var all = teams.SelectMany(t => t.Players);
Console.WriteLine(all.Count());
Console.WriteLine(teams.Select(t => t.Players).Count());`,
          answer: "3\n2",
          explain: "<p><code>SelectMany</code> flattens the two player arrays into one sequence of 3 names. <code>Select</code> keeps the nesting: a sequence of 2 arrays, so its count is 2.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the query-syntax join.",
          code: String.raw`var lines =
    from o in orders
    join c in customers on o.CustomerId ___ c.Id
    ___ c.Name + ": " + o.Total;`,
          blanks: [["equals"], ["select"]],
          explain: "<p>A query join compares keys with the contextual keyword <code>equals</code>. Writing <code>==</code> is a compile error. The query must end with <code>select</code> (or <code>group</code>).</p>"
        },
        {
          type: "mcq",
          prompt: "Customers with no orders must still appear in the report, with a count of 0. Which operator fits?",
          options: [
            "GroupJoin",
            "Join",
            "SelectMany",
            "Zip"
          ],
          answer: 0,
          explain: "<p><code>GroupJoin</code> gives every outer item (each customer) its group of matches, which may be empty. <code>Join</code> is an inner join and drops customers with no orders. <code>SelectMany</code> flattens nested collections. <code>Zip</code> pairs items by position, not by key.</p>"
        },
        {
          type: "output",
          prompt: "What does this query print?",
          code: String.raw`int[] xs = [1, 2, 3];
string[] ys = ["a", "b"];
var combos =
    from x in xs
    from y in ys
    where x != 2
    select $"{x}{y}";
Console.WriteLine(string.Join(" ", combos));`,
          answer: "1a 1b 3a 3b",
          explain: "<p>Two <code>from</code> clauses produce every pair (that is <code>SelectMany</code>). The outer loop is <code>x</code>, so pairs come out as 1a, 1b, 2a, 2b, 3a, 3b. The <code>where</code> clause removes those with <code>x == 2</code>.</p>"
        },
        {
          type: "order",
          prompt: "Arrange the clauses into a valid query that lists, for each category, how many products it has.",
          lines: [
            "var counts =",
            "    from p in products",
            "    where p.InStock",
            "    group p by p.Category into g",
            "    orderby g.Key",
            "    select $\"{g.Key}: {g.Count()}\";"
          ],
          explain: "<p>A query starts with <code>from</code>. Filter before grouping so only in-stock products are counted. <code>group ... into g</code> continues the query with the groups, so you can sort them and then <code>select</code> a line for each.</p>"
        }
      ],
      takeaways: [
        "Join pairs items with matching keys (inner join); GroupJoin keeps outer items with no matches.",
        "SelectMany flattens a sequence of collections into one sequence.",
        "Query syntax (from ... where ... select) compiles to the same method calls.",
        "In query joins, compare keys with equals, not ==.",
        "Default to method syntax; use query syntax when joins or let make it clearer."
      ]
    },

    // ------------------------------------------------------------------
    // Lesson 5: Deferred execution, iterators, pitfalls
    // ------------------------------------------------------------------
    {
      id: "m10-l05",
      title: "Deferred execution, yield and LINQ pitfalls",
      minutes: 28,
      objectives: [
        "Explain deferred execution and when a query actually runs",
        "Write your own lazy sequences with yield return",
        "Spot and fix multiple enumeration and other common LINQ bugs",
        "Know when to materialize a query with ToList"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Here is the most important idea in LINQ, and the source of most LINQ bugs: <strong>a query does not run when you write it</strong>. <code>numbers.Where(...)</code> builds a description of the work, a recipe. The work happens only when someone pulls items out of it with <code>foreach</code>, <code>ToList</code>, <code>Count</code>, <code>First</code> and so on. This is called <strong>deferred execution</strong>.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`var numbers = new List<int> { 1, 2, 3 };

var evens = numbers.Where(n =>
{
    Console.WriteLine($"  checking {n}");
    return n % 2 == 0;
});

Console.WriteLine("Query built, nothing checked yet.");
numbers.Add(4);                      // added AFTER the query

foreach (int n in evens)
    Console.WriteLine($"Got {n}");`,
          output: "Query built, nothing checked yet.\n  checking 1\n  checking 2\nGot 2\n  checking 3\n  checking 4\nGot 4"
        },
        {
          type: "text",
          html: "<p>Two things to notice. First, nothing was checked until the <code>foreach</code>. Second, the query saw the <code>4</code> that was added later, because it reads the list when it runs, not when it was written. Also notice the interleaving: items flow through the pipeline <strong>one at a time</strong>. LINQ does not build a full filtered list before moving to the next step.</p>"
        },
        {
          type: "table",
          headers: ["Kind", "Methods", "When it runs"],
          rows: [
            ["Deferred, streaming", "<code>Where</code>, <code>Select</code>, <code>Take</code>, <code>Skip</code>, <code>SelectMany</code>, <code>Concat</code>", "Item by item, as you iterate"],
            ["Deferred, buffering", "<code>OrderBy</code>, <code>GroupBy</code>, <code>Reverse</code>, <code>Distinct</code>", "On first iteration it reads the whole source, then yields"],
            ["Immediate", "<code>ToList</code>, <code>ToArray</code>, <code>ToDictionary</code>, <code>Count</code>, <code>Sum</code>, <code>First</code>, <code>Any</code>, <code>Max</code>", "Right away, returns a value or collection"]
          ]
        },
        {
          type: "text",
          html: "<p><strong>yield return</strong> is how you write your own lazy sequences. A method that returns <code>IEnumerable&lt;T&gt;</code> and uses <code>yield return</code> becomes an <strong>iterator</strong>. Each time the caller asks for the next item, the method runs until the next <code>yield return</code>, hands back that value and pauses. <code>yield break</code> ends the sequence.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`foreach (int n in Countdown(3))
    Console.WriteLine(n);

// Infinite, but safe: Take pulls only what it needs
var firstFibs = Fibonacci().Take(8);
Console.WriteLine(string.Join(" ", firstFibs));

var bigOnes = Fibonacci().SkipWhile(f => f < 100).First();
Console.WriteLine(bigOnes);

static IEnumerable<int> Countdown(int from)
{
    Console.WriteLine("(start)");
    for (int i = from; i > 0; i--)
        yield return i;
    Console.WriteLine("(liftoff)");
}

static IEnumerable<long> Fibonacci()
{
    long a = 0, b = 1;
    while (true)
    {
        yield return a;
        (a, b) = (b, a + b);
    }
}`,
          output: "(start)\n3\n2\n1\n(liftoff)\n0 1 1 2 3 5 8 13\n144"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p>This is exactly a Python generator: <code>yield</code> in Python, <code>yield return</code> in C#. LINQ's lazy operators behave like generator expressions and <code>itertools</code>. One difference: a C# <code>IEnumerable&lt;T&gt;</code> from a <code>List</code> or an iterator method can usually be enumerated <em>again</em>, which restarts it from scratch. That is convenient, and it is also the next pitfall.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Pitfall 1: multiple enumeration.</strong> Because a query is a recipe, every time you iterate it, it runs again from the start. Expensive work (reading a file, calling a database, heavy calculations) repeats each time:</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int calls = 0;
var squares = Enumerable.Range(1, 5).Select(n =>
{
    calls++;                  // count how often this runs
    return n * n;
});

Console.WriteLine(squares.Count());
Console.WriteLine(squares.Sum());
Console.WriteLine(squares.Max());
Console.WriteLine($"Lambda ran {calls} times");

calls = 0;
List<int> cached = squares.ToList();   // run once, store
Console.WriteLine(cached.Count + cached.Sum() + cached.Max());
Console.WriteLine($"Lambda ran {calls} times");`,
          output: "5\n55\n25\nLambda ran 15 times\n85\nLambda ran 5 times"
        },
        {
          type: "callout",
          tone: "tip",
          title: "When to call ToList()",
          html: "<p>Materialize with <code>ToList()</code> or <code>ToArray()</code> when you will use the results more than once, when the source may change before you use them, or before returning results from a method that holds a resource (like an open file). Do <em>not</em> sprinkle <code>ToList()</code> after every step: that builds throwaway lists and loses streaming. IDEs and analyzers warn about \"possible multiple enumeration of IEnumerable\" to help you here.</p>"
        },
        {
          type: "text",
          html: "<p><strong>Pitfall 2: side effects and captured variables.</strong> A lambda inside a query runs <em>later</em>, and it captures variables, not values (remember closures from the previous module). Change a captured variable between building and running the query, and the query uses the new value. <strong>Pitfall 3: modifying the source while iterating it</strong> throws <code>InvalidOperationException: Collection was modified; enumeration operation may not execute</code>.</p>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`int limit = 2;
int[] data = [1, 2, 3, 4, 5];
var over = data.Where(x => x > limit);
limit = 4;                                  // changed later
Console.WriteLine(string.Join(" ", over));  // uses 4

var tasks = new List<string> { "a", "skip", "b", "skip" };
try
{
    foreach (var t in tasks.Where(t => t == "skip"))
        tasks.Remove(t);                    // modifies source
}
catch (InvalidOperationException ex)
{
    Console.WriteLine(ex.Message);
}

// Fix: materialize the matches first, or use RemoveAll
tasks.RemoveAll(t => t == "skip");
Console.WriteLine(string.Join(" ", tasks));`,
          output: "5\nCollection was modified; enumeration operation may not execute.\na b"
        },
        {
          type: "callout",
          tone: "warning",
          title: "Exceptions show up late",
          html: "<p>Because of deferred execution, an exception inside a <code>Select</code> lambda is not thrown on the line that builds the query. It is thrown wherever the query is first enumerated, which might be in a different method or even after a <code>try</code> block has ended. If you need errors to surface at a specific point, call <code>ToList()</code> inside the <code>try</code>.</p>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "IEnumerable vs IQueryable",
          html: "<p>Everything here is <strong>LINQ to Objects</strong>: lambdas are compiled delegates run in memory. Libraries such as Entity Framework Core use <code>IQueryable&lt;T&gt;</code>, where the lambdas are captured as <em>expression trees</em> and translated into SQL. The method names are the same, but only expressions the provider can translate are allowed, and deferred execution means \"the SQL runs when you enumerate\". You will meet this when you work with databases.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print? Pay attention to when the query runs.",
          code: String.raw`var list = new List<int> { 1, 2, 3 };
var doubled = list.Select(x => x * 2);
list.Add(10);
var snapshot = doubled.ToList();
list.Add(100);
Console.WriteLine(string.Join(" ", doubled));
Console.WriteLine(string.Join(" ", snapshot));`,
          answer: "2 4 6 20 200\n2 4 6 20",
          explain: "<p><code>doubled</code> is a recipe, so printing it runs the query now, over all five items. <code>snapshot</code> ran the query once, when the list held four items, and stored the results. Later changes to <code>list</code> do not affect it.</p>"
        },
        {
          type: "output",
          prompt: "What does this iterator program print?",
          code: String.raw`foreach (var w in Words().Take(2))
    Console.WriteLine(w);

static IEnumerable<string> Words()
{
    Console.WriteLine("one?");
    yield return "one";
    Console.WriteLine("two?");
    yield return "two";
    Console.WriteLine("three?");
    yield return "three";
}`,
          answer: "one?\none\ntwo?\ntwo",
          explain: "<p>The iterator runs only as far as needed. <code>Take(2)</code> asks for two items and then stops asking, so the code after the second <code>yield return</code> never runs and <code>three?</code> is never printed.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the iterator that yields the even numbers from 0 up to <code>max</code>, stopping early at a negative max.",
          code: String.raw`static IEnumerable<int> Evens(int max)
{
    if (max < 0) yield ___;
    for (int i = 0; i <= max; i += 2)
        yield ___ i;
}`,
          blanks: [["break"], ["return"]],
          explain: "<p><code>yield break</code> ends an iterator (a plain <code>return;</code> is not allowed in an iterator that returns a value). <code>yield return i</code> hands back one item and pauses until the caller asks for the next.</p>"
        },
        {
          type: "bug",
          prompt: "This method reads a large log file. Why is it slow?",
          code: String.raw`var errors = File.ReadLines("app.log")
    .Where(l => l.Contains("ERROR"));

Console.WriteLine($"Errors: {errors.Count()}");
Console.WriteLine($"First: {errors.FirstOrDefault()}");
Console.WriteLine($"Last: {errors.LastOrDefault()}");`,
          options: [
            "The query is enumerated three times, so the file is read three times",
            "ReadLines loads the whole file into memory first",
            "Where must be replaced with a foreach loop",
            "Count() always throws on files"
          ],
          answer: 0,
          explain: "<p><code>errors</code> is deferred. <code>Count</code>, <code>FirstOrDefault</code> and <code>LastOrDefault</code> each run it again, re-reading the file. Call <code>.ToList()</code> once. <code>File.ReadLines</code> actually streams lazily (it is <code>ReadAllLines</code> that loads everything), and LINQ on files is perfectly fine.</p>"
        },
        {
          type: "mcq",
          prompt: "Which call makes the query run immediately?",
          code: String.raw`var q = orders.Where(o => o.Total > 100);`,
          options: [
            "q.Any()",
            "q.Select(o => o.Id)",
            "q.OrderBy(o => o.Total)",
            "q.Take(5)"
          ],
          answer: 0,
          explain: "<p><code>Any</code> returns a <code>bool</code>, so it has to run the query (and it stops at the first match). <code>Select</code>, <code>OrderBy</code> and <code>Take</code> all return new deferred sequences that do nothing until enumerated.</p>"
        }
      ],
      takeaways: [
        "LINQ queries are deferred: they run when enumerated, not when written.",
        "Lazy operators stream items one at a time; OrderBy and GroupBy buffer the source first.",
        "yield return turns a method into a lazy iterator; yield break ends it.",
        "Enumerating a query twice runs it twice; ToList() once when you reuse results.",
        "Captured variables, source changes and exceptions all take effect when the query runs."
      ]
    }
  ],

  milestone: {
    id: "m10-project",
    title: "Sales Report Analyzer",
    brief: "<p>The sales team exports a list of transactions every quarter and spends an afternoon in a spreadsheet turning it into a report. Your job: write a console tool that produces that report in one go, using LINQ for every calculation.</p><p>The data is built into the program as a list of <code>Sale</code> records (date, region, sales rep, product, units, unit price). The tool asks for an optional region filter, then prints a headline summary, revenue per region, the top products, a monthly trend and a rep leaderboard. If the user just presses Enter, or input is closed, it reports on all regions.</p>",
    skills: [
      "Where and Select",
      "GroupBy with Sum and Count",
      "OrderByDescending, ThenBy and Take",
      "MaxBy, Any and Average",
      "ToDictionary",
      "deferred execution and ToList"
    ],
    requirements: [
      "Ask for a region; null or blank input means all regions, and an unknown region prints a message and exits without crashing.",
      "Filter the sales once with Where and materialize the result with ToList so it is not re-evaluated by every report.",
      "Headline: number of sales, total units, total revenue and average sale value (revenue per sale), money shown with two decimals.",
      "Revenue by region, sorted from highest to lowest, using GroupBy and Sum.",
      "Top 3 products by revenue; ties broken alphabetically with ThenBy.",
      "Monthly trend: revenue per month in calendar order, with the best month marked using MaxBy.",
      "Rep leaderboard: each rep's sale count and revenue, with a share of total revenue as a percentage.",
      "Use a Dictionary built with ToDictionary somewhere meaningful (for example rep name to revenue)."
    ],
    sampleRun: String.raw`=== Sales Report Analyzer ===
Regions: East, North, West
Filter by region (Enter for all): 

Report for: All regions
Sales: 14   Units: 85   Revenue: 6608.50
Average sale: 472.04

-- Revenue by region --
  East       2905.50
  West       2088.50
  North      1614.50

-- Top 3 products --
  1. Monitor    3600.00 (18 units)
  2. Keyboard   1200.00 (24 units)
  3. Headset     973.50 (11 units)

-- Monthly trend --
  Jan     1865.50
  Feb     2223.50  <- best
  Mar     1742.50
  Apr      777.00

-- Rep leaderboard --
  Maya     5 sales    3282.50  49.7%
  Lena     4 sales    1877.00  28.4%
  Omar     5 sales    1449.00  21.9%

(Second run)
Filter by region (Enter for all): west

Report for: West
Sales: 4   Units: 23   Revenue: 2088.50
...

(Third run)
Filter by region (Enter for all): south
No sales found for region 'south'.`,
    starter: String.raw`// Sales Report Analyzer: starter
var sales = new List<Sale>
{
    new(1, "East", "Maya", "Monitor", 4, 200m),
    new(1, "West", "Omar", "Keyboard", 10, 50m),
    new(1, "North", "Lena", "Mouse", 15, 20m),
    new(1, "East", "Omar", "Headset", 3, 88.50m),
    new(2, "West", "Maya", "Monitor", 6, 200m),
    new(2, "North", "Lena", "Keyboard", 8, 50m),
    new(2, "East", "Maya", "Mouse", 12, 20m),
    new(2, "West", "Omar", "Headset", 1, 88.50m),
    new(2, "North", "Omar", "Webcam", 5, 59m),
    new(3, "East", "Lena", "Monitor", 5, 200m),
    new(3, "North", "Maya", "Headset", 5, 88.50m),
    new(3, "West", "Omar", "Keyboard", 6, 50m),
    new(4, "East", "Maya", "Monitor", 3, 200m),
    new(4, "North", "Lena", "Headset", 2, 88.50m),
};

string[] monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

Console.WriteLine("=== Sales Report Analyzer ===");
// TODO: print the distinct region names, sorted.

Console.Write("Filter by region (Enter for all): ");
string? input = Console.ReadLine();

// TODO: decide the region filter (null or blank = all).
// TODO: if a region was given but no sale has it, print
//       a message and return.
// TODO: filter once and call ToList().
List<Sale> selected = sales;

Console.WriteLine();
Console.WriteLine("Report for: All regions");

// TODO: headline (count, units, revenue, average sale)
// TODO: revenue by region (GroupBy, Sum, OrderByDescending)
// TODO: top 3 products (ThenBy for ties)
// TODO: monthly trend with the best month marked (MaxBy)
// TODO: rep leaderboard with share of revenue

Console.WriteLine($"Loaded {selected.Count} sales.");

record Sale(int Month, string Region, string Rep,
            string Product, int Units, decimal UnitPrice)
{
    public decimal Revenue => Units * UnitPrice;
}`,
    hints: [
      "<p>Normalize the filter first: <code>string? region = string.IsNullOrWhiteSpace(input) ? null : input.Trim();</code>. Then check <code>sales.Any(s =&gt; s.Region.Equals(region, StringComparison.OrdinalIgnoreCase))</code>.</p>",
      "<p>Filter with one <code>Where</code> whose condition is <code>region is null || s.Region.Equals(...)</code>, then <code>.ToList()</code>. Every later report reads from that list, so the filter runs exactly once.</p>",
      "<p>Most sections share one shape: <code>selected.GroupBy(s =&gt; s.Key).Select(g =&gt; new { g.Key, Revenue = g.Sum(s =&gt; s.Revenue) })</code>, then sort and print. Add <code>.ToList()</code> when you need the result twice, as the monthly trend does for <code>MaxBy</code>.</p>",
      "<p>For the leaderboard, build <code>Dictionary&lt;string, decimal&gt; revenueByRep</code> with <code>GroupBy(...).ToDictionary(g =&gt; g.Key, g =&gt; g.Sum(...))</code>. The share is <code>revenue / total * 100</code>, formatted with <code>:F1</code>.</p>",
      "<p>Alignment helps the report look clean: <code>{name,-8}</code> pads to the left, <code>{amount,10:F2}</code> right-aligns a money value in 10 characters.</p>"
    ],
    solution: String.raw`// Sales Report Analyzer: solution
var sales = new List<Sale>
{
    new(1, "East", "Maya", "Monitor", 4, 200m),
    new(1, "West", "Omar", "Keyboard", 10, 50m),
    new(1, "North", "Lena", "Mouse", 15, 20m),
    new(1, "East", "Omar", "Headset", 3, 88.50m),
    new(2, "West", "Maya", "Monitor", 6, 200m),
    new(2, "North", "Lena", "Keyboard", 8, 50m),
    new(2, "East", "Maya", "Mouse", 12, 20m),
    new(2, "West", "Omar", "Headset", 1, 88.50m),
    new(2, "North", "Omar", "Webcam", 5, 59m),
    new(3, "East", "Lena", "Monitor", 5, 200m),
    new(3, "North", "Maya", "Headset", 5, 88.50m),
    new(3, "West", "Omar", "Keyboard", 6, 50m),
    new(4, "East", "Maya", "Monitor", 3, 200m),
    new(4, "North", "Lena", "Headset", 2, 88.50m),
};

string[] monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

Console.WriteLine("=== Sales Report Analyzer ===");
var regions = sales.Select(s => s.Region).Distinct().OrderBy(r => r);
Console.WriteLine($"Regions: {string.Join(", ", regions)}");

Console.Write("Filter by region (Enter for all): ");
string? input = Console.ReadLine();
string? region = string.IsNullOrWhiteSpace(input)
    ? null
    : input.Trim();

bool Matches(Sale s) => region is null
    || s.Region.Equals(region, StringComparison.OrdinalIgnoreCase);

if (region is not null && !sales.Any(Matches))
{
    Console.WriteLine($"No sales found for region '{region}'.");
    return;
}

// Use the region's real spelling, e.g. "west" -> "West".
if (region is not null) region = sales.First(Matches).Region;

// Filter once; every report below reuses this list.
List<Sale> selected = sales.Where(Matches).ToList();

Console.WriteLine();
Console.WriteLine($"Report for: {region ?? "All regions"}");

decimal total = selected.Sum(s => s.Revenue);
Console.WriteLine($"Sales: {selected.Count}   " +
    $"Units: {selected.Sum(s => s.Units)}   Revenue: {total:F2}");
Console.WriteLine($"Average sale: {selected.Average(s => s.Revenue):F2}");

Section("Revenue by region");
var byRegion = selected
    .GroupBy(s => s.Region)
    .Select(g => new { Region = g.Key, Revenue = g.Sum(s => s.Revenue) })
    .OrderByDescending(x => x.Revenue);
foreach (var r in byRegion)
    Console.WriteLine($"  {r.Region,-8}{r.Revenue,10:F2}");

Section("Top 3 products");
var topProducts = selected
    .GroupBy(s => s.Product)
    .Select(g => new
    {
        Product = g.Key,
        Units = g.Sum(s => s.Units),
        Revenue = g.Sum(s => s.Revenue)
    })
    .OrderByDescending(x => x.Revenue)
    .ThenBy(x => x.Product)
    .Take(3)
    .Select((x, i) =>
        $"  {i + 1}. {x.Product,-8}{x.Revenue,10:F2} ({x.Units} units)");
foreach (string line in topProducts) Console.WriteLine(line);

Section("Monthly trend");
var months = selected
    .GroupBy(s => s.Month)
    .Select(g => (Month: g.Key, Revenue: g.Sum(s => s.Revenue)))
    .OrderBy(m => m.Month)
    .ToList();                 // used twice: MaxBy and the loop
var best = months.MaxBy(m => m.Revenue);
foreach (var m in months)
{
    string mark = m == best ? "  <- best" : "";
    Console.WriteLine(
        $"  {monthNames[m.Month - 1],-4}{m.Revenue,11:F2}{mark}");
}

Section("Rep leaderboard");
Dictionary<string, decimal> revenueByRep = selected
    .GroupBy(s => s.Rep)
    .ToDictionary(g => g.Key, g => g.Sum(s => s.Revenue));
var salesByRep = selected.ToLookup(s => s.Rep);
foreach (var (rep, revenue) in
         revenueByRep.OrderByDescending(kv => kv.Value))
{
    decimal share = total == 0 ? 0 : revenue / total * 100;
    Console.WriteLine($"  {rep,-8}{salesByRep[rep].Count(),2} sales" +
                      $"{revenue,11:F2}{share,6:F1}%");
}

static void Section(string title)
{
    Console.WriteLine();
    Console.WriteLine($"-- {title} --");
}

record Sale(int Month, string Region, string Rep,
            string Product, int Units, decimal UnitPrice)
{
    public decimal Revenue => Units * UnitPrice;
}`,
    stretch: [
      "Accept a product name as a second filter and combine both conditions in the same Where.",
      "Show each region's best-selling product using GroupBy followed by MaxBy inside each group.",
      "Rewrite the revenue-by-region query in query syntax (from ... group ... by ... into g ... select).",
      "Write an iterator method RunningTotal(IEnumerable<decimal>) with yield return and print a cumulative revenue column in the monthly trend."
    ]
  }
});
