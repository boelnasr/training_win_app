(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m11",
  number: 11,
  title: "Files & Data",
  tagline: "Save, load and exchange data: files, streams, CSV, JSON and dates.",
  level: "Intermediate",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m11-l01",
      title: "Files, paths and folders",
      minutes: 20,
      objectives: [
        "Read and write whole files with the File class",
        "Build paths safely with Path.Combine and friends",
        "Create and list folders with Directory",
        "Know which exceptions file code can throw and why"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Everything your programs have done so far vanished the moment they ended. Variables live in memory, and memory is wiped when the process exits. To keep data between runs you write it to a <strong>file</strong> on disk.</p><p>.NET puts the file tools in the <code>System.IO</code> namespace. It is part of the implicit usings, so you can use it straight away. Three static classes do most of the everyday work:</p><ul><li><code>File</code>: read, write, copy, move, delete single files.</li><li><code>Path</code>: build and take apart path strings. It never touches the disk.</li><li><code>Directory</code>: create, list and delete folders.</li></ul>"
        },
        {
          type: "code",
          title: "Program.cs",
          code: String.raw`string path = Path.Combine(Path.GetTempPath(), "notes.txt");

File.WriteAllText(path, "Buy milk\nCall Sam\n");
File.AppendAllText(path, "Fix bike\n");

string all = File.ReadAllText(path);
Console.Write(all);

string[] lines = File.ReadAllLines(path);
Console.WriteLine($"{lines.Length} lines, first: {lines[0]}");

File.Delete(path);
Console.WriteLine(File.Exists(path));`,
          output: "Buy milk\nCall Sam\nFix bike\n3 lines, first: Buy milk\nFalse"
        },
        {
          type: "text",
          html: "<p>Notice the behaviour of each method:</p><ul><li><code>WriteAllText</code> creates the file, or <strong>replaces</strong> it completely if it already exists. There is no warning.</li><li><code>AppendAllText</code> adds to the end, and creates the file if needed.</li><li><code>ReadAllText</code> returns one big string. <code>ReadAllLines</code> splits it into a <code>string[]</code> and drops the line break characters.</li><li><code>Delete</code> does nothing if the file is missing. It only throws if the folder is missing or the file is locked.</li></ul><p>These \"All\" methods load the whole file into memory. That is perfect for config files and small data files. For a 2 GB log file you need streams, which is the next lesson.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p><code>File.ReadAllText(p)</code> is like <code>open(p).read()</code> and <code>File.WriteAllText(p, s)</code> is like <code>open(p, \"w\").write(s)</code>. The File helpers open and close the file for you, so you do not need a <code>with</code> block. <code>Path.Combine</code> plays the role of <code>os.path.join</code>.</p>"
        },
        {
          type: "code",
          title: "Taking paths apart with Path",
          code: String.raw`string p = Path.Combine("data", "2024", "sales.csv");
Console.WriteLine(p.Replace('\\', '/'));
Console.WriteLine(Path.GetFileName(p));
Console.WriteLine(Path.GetFileNameWithoutExtension(p));
Console.WriteLine(Path.GetExtension(p));
Console.WriteLine(Path.ChangeExtension(p, ".json")
    .Replace('\\', '/'));`,
          output: "data/2024/sales.csv\nsales.csv\nsales\n.csv\ndata/2024/sales.json"
        },
        {
          type: "text",
          html: "<p>Why not just glue strings together with <code>\"data/\" + name</code>? Windows uses <code>\\</code> as the separator and Linux and macOS use <code>/</code>. <code>Path.Combine</code> picks the right one for the machine and never doubles a separator. (The <code>Replace</code> calls above only exist so the printed output looks the same on every OS.)</p><p>One trap: if a later argument is an absolute path, <code>Path.Combine</code> throws away everything before it. <code>Path.Combine(\"data\", \"/etc/passwd\")</code> gives <code>/etc/passwd</code>. Never pass raw user input as a later part without checking it.</p>"
        },
        {
          type: "code",
          title: "Working with folders",
          code: String.raw`string root = Path.Combine(Path.GetTempPath(), "m11-demo");
string logs = Path.Combine(root, "logs");

Directory.CreateDirectory(logs);   // creates root too
Directory.CreateDirectory(logs);   // already there: no error

File.WriteAllText(Path.Combine(logs, "a.log"), "one");
File.WriteAllText(Path.Combine(logs, "b.log"), "two");
File.WriteAllText(Path.Combine(logs, "c.txt"), "three");

string[] found = Directory.GetFiles(logs, "*.log");
Array.Sort(found);
foreach (string f in found)
    Console.WriteLine(Path.GetFileName(f));

Directory.Delete(root, recursive: true);
Console.WriteLine(Directory.Exists(root));`,
          output: "a.log\nb.log\nFalse"
        },
        {
          type: "text",
          html: "<p><code>Directory.CreateDirectory</code> is safe to call every time: it creates any missing parent folders and quietly succeeds if the folder exists. The listing order of <code>GetFiles</code> is not guaranteed by the OS, so sort it when order matters. <code>Directory.Delete(path, recursive: true)</code> removes a folder and everything in it. Use it with care.</p>"
        },
        {
          type: "table",
          headers: ["Exception", "Typical cause"],
          rows: [
            ["<code>FileNotFoundException</code>", "Reading a file that does not exist."],
            ["<code>DirectoryNotFoundException</code>", "A folder in the path is missing (writing to <code>out/x.txt</code> before creating <code>out</code>)."],
            ["<code>UnauthorizedAccessException</code>", "No permission, or the path is a folder, or the file is read-only."],
            ["<code>IOException</code>", "The file is locked by another program (Excel has it open), disk full, and similar."],
            ["<code>PathTooLongException</code>", "The path is longer than the OS allows."]
          ]
        },
        {
          type: "code",
          title: "Handling the expected failures",
          code: String.raw`string path = Path.Combine(Path.GetTempPath(), "missing-123.txt");

try
{
    string text = File.ReadAllText(path);
    Console.WriteLine(text);
}
catch (FileNotFoundException)
{
    Console.WriteLine("No saved data yet, starting fresh.");
}
catch (IOException ex)
{
    Console.WriteLine($"Could not read file: {ex.Message}");
}`,
          output: "No saved data yet, starting fresh."
        },
        {
          type: "callout",
          tone: "warning",
          title: "File.Exists is not a lock",
          html: "<p>Checking <code>File.Exists</code> first and then reading is fine for friendly messages, but it does not make the read safe. Another program can delete or lock the file between the two calls. Professionals still wrap the real read in <code>try/catch</code>. <code>FileNotFoundException</code> and <code>DirectoryNotFoundException</code> both inherit from <code>IOException</code>, so catch the specific ones first.</p>"
        },
        {
          type: "callout",
          tone: "deep",
          title: "Where does a relative path point?",
          html: "<p>A relative path like <code>\"data.json\"</code> is resolved against the <strong>current working directory</strong>, which is wherever the program was started from. With <code>dotnet run</code> that is your project folder. In Visual Studio it is usually <code>bin/Debug/net8.0</code>. Print <code>Environment.CurrentDirectory</code> when files seem to vanish. For per-user app data, build a path from <code>Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData)</code>, and for scratch files use <code>Path.GetTempPath()</code>.</p>"
        }
      ],
      exercises: [
        {
          type: "mcq",
          prompt: "A file <code>log.txt</code> already contains 50 lines. You call <code>File.WriteAllText(\"log.txt\", \"start\")</code>. What does the file contain now?",
          options: [
            "The 50 old lines followed by <code>start</code>",
            "Only <code>start</code>",
            "Nothing, because an exception is thrown for an existing file",
            "<code>start</code> followed by the 50 old lines"
          ],
          answer: 1,
          explain: "<p><code>WriteAllText</code> overwrites the whole file without asking. To add to the end you need <code>AppendAllText</code>. No exception is thrown for an existing file, which is exactly why accidental overwrites are a common bug.</p>"
        },
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`string p = Path.Combine(Path.GetTempPath(), "ex1.txt");
File.WriteAllText(p, "red\n");
File.AppendAllText(p, "green\n");
File.AppendAllText(p, "blue\n");
string[] lines = File.ReadAllLines(p);
Console.WriteLine(lines.Length);
Console.WriteLine(lines[^1]);
Console.WriteLine(Path.GetExtension(p));
File.Delete(p);`,
          answer: "3\nblue\n.txt",
          explain: "<p>The file ends up with three lines. <code>ReadAllLines</code> strips the line breaks and does not create an empty fourth element for the final <code>\\n</code>. <code>lines[^1]</code> is the last element. <code>GetExtension</code> includes the dot.</p>"
        },
        {
          type: "fill",
          prompt: "Build the path <code>exports/report.csv</code> in a portable way, make sure the folder exists, then write the file.",
          code: String.raw`string folder = "exports";
string path = Path.___(folder, "report.csv");
Directory.___(folder);
File.___(path, "id,total\n");`,
          blanks: [["Combine"], ["CreateDirectory"], ["WriteAllText"]],
          explain: "<p><code>Path.Combine</code> uses the right separator for the OS. <code>Directory.CreateDirectory</code> is safe even if the folder exists. Without it, <code>WriteAllText</code> would throw <code>DirectoryNotFoundException</code> on the first run.</p>"
        },
        {
          type: "bug",
          prompt: "This program crashes the first time it runs on a new machine. Why?",
          code: String.raw`string path = Path.Combine("saves", "game1.txt");
File.WriteAllText(path, "level=1");
Console.WriteLine("Saved.");`,
          options: [
            "Path.Combine cannot take two arguments",
            "The saves folder does not exist yet, so WriteAllText throws DirectoryNotFoundException",
            "WriteAllText needs the file to exist first",
            "The .txt extension is not allowed"
          ],
          answer: 1,
          explain: "<p><code>WriteAllText</code> creates the file but not missing folders. Call <code>Directory.CreateDirectory(\"saves\")</code> first. It works on your machine only because you created the folder once by hand, a classic \"works on my machine\" bug.</p>"
        },
        {
          type: "mcq",
          prompt: "Your program reads <code>\"settings.json\"</code>. It works with <code>dotnet run</code> but throws <code>FileNotFoundException</code> when started from Visual Studio. What is the most likely cause?",
          options: [
            "Visual Studio cannot read JSON files",
            "The relative path is resolved against a different working directory",
            "The file needs to be opened with a stream",
            "File names are case-sensitive on Windows"
          ],
          answer: 1,
          explain: "<p>Relative paths are resolved against the current working directory, which differs between launch methods. Print <code>Environment.CurrentDirectory</code> to check. Windows file names are not case-sensitive, and JSON files are just text files to <code>File</code>.</p>"
        }
      ],
      takeaways: [
        "File.ReadAllText/WriteAllText/AppendAllText cover small files in one call.",
        "WriteAllText silently replaces an existing file.",
        "Build paths with Path.Combine; never hard-code separators.",
        "Directory.CreateDirectory is safe to call every time.",
        "Wrap real file access in try/catch for IOException and friends."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m11-l02",
      title: "Streams, readers and writers",
      minutes: 22,
      objectives: [
        "Explain what a stream is and why it matters for big files",
        "Write text with StreamWriter and read it line by line with StreamReader",
        "Choose between ReadAllLines and File.ReadLines",
        "Understand encodings and why using is essential"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>A <strong>stream</strong> is a sequence of bytes you read or write a piece at a time. Think of a water pipe instead of a bucket. <code>File.ReadAllText</code> is the bucket: it fills memory with the whole file. A stream lets you handle one line, or one block of bytes, then move on. That is how programs process files far bigger than RAM.</p><p>The base type is <code>Stream</code>. Common kinds are <code>FileStream</code> (a file on disk), <code>MemoryStream</code> (bytes in memory) and <code>NetworkStream</code>. Raw streams deal in bytes. To work with text you wrap them in a <code>StreamReader</code> or <code>StreamWriter</code>, which convert between bytes and characters.</p>"
        },
        {
          type: "code",
          title: "Writing and reading line by line",
          code: String.raw`string path = Path.Combine(Path.GetTempPath(), "scores.txt");

using (var writer = new StreamWriter(path))
{
    writer.WriteLine("Ana,92");
    writer.WriteLine("Ben,78");
    writer.Write("Cleo,");
    writer.WriteLine(85);
}

using (var reader = new StreamReader(path))
{
    string? line;
    int n = 0;
    while ((line = reader.ReadLine()) != null)
    {
        n++;
        Console.WriteLine($"{n}: {line}");
    }
}
File.Delete(path);`,
          output: "1: Ana,92\n2: Ben,78\n3: Cleo,85"
        },
        {
          type: "text",
          html: "<p><code>StreamWriter</code> has the same <code>Write</code> and <code>WriteLine</code> methods you know from <code>Console</code>. <code>StreamReader.ReadLine</code> returns <code>null</code> at the end of the file, so the loop <code>while ((line = reader.ReadLine()) != null)</code> is the standard pattern. It assigns and tests in one step.</p><p>The <code>using</code> block matters more here than anywhere else. A writer keeps data in an in-memory <strong>buffer</strong> and only pushes it to disk when the buffer fills up or the writer is disposed. If you forget to dispose it, the last part of your file can be missing, and the file stays locked until the garbage collector gets around to it.</p>"
        },
        {
          type: "code",
          title: "The forgotten-dispose bug",
          code: String.raw`string path = Path.Combine(Path.GetTempPath(), "lost.txt");

var writer = new StreamWriter(path);
writer.Write("important data");
// no Dispose, no Flush

Console.WriteLine(new FileInfo(path).Length);

writer.Dispose();   // now the buffer is flushed
Console.WriteLine(new FileInfo(path).Length);
File.Delete(path);`,
          output: "0\n14"
        },
        {
          type: "text",
          html: "<p>Before <code>Dispose</code> the file is 0 bytes long. The text was sitting in the buffer. After <code>Dispose</code> it holds all 14 bytes. This is why professionals always write <code>using var writer = ...</code>. You can call <code>writer.Flush()</code> to force the buffer out early, for example in a log file that must survive a crash.</p>"
        },
        {
          type: "code",
          title: "using declarations and append mode",
          code: String.raw`string path = Path.Combine(Path.GetTempPath(), "events.log");
File.Delete(path);

for (int run = 1; run <= 3; run++)
{
    // true = append instead of overwrite
    using var log = new StreamWriter(path, append: true);
    log.WriteLine($"run {run} started");
}   // log is disposed at the end of each loop pass

foreach (string line in File.ReadLines(path))
    Console.WriteLine(line);
File.Delete(path);`,
          output: "run 1 started\nrun 2 started\nrun 3 started"
        },
        {
          type: "text",
          html: "<p><code>File.ReadLines</code> (no \"All\") returns a lazy <code>IEnumerable&lt;string&gt;</code>. It opens a reader behind the scenes and yields one line at a time as <code>foreach</code> asks for it. That gives you streaming with almost no code, and it plays well with LINQ:</p>"
        },
        {
          type: "code",
          title: "Streaming with LINQ",
          code: String.raw`string path = Path.Combine(Path.GetTempPath(), "server.log");
File.WriteAllLines(path, new[]
{
    "INFO start",
    "ERROR disk full",
    "INFO retry",
    "ERROR timeout",
    "INFO done"
});

int errors = File.ReadLines(path)
    .Count(l => l.StartsWith("ERROR"));
string? firstError = File.ReadLines(path)
    .FirstOrDefault(l => l.StartsWith("ERROR"));

Console.WriteLine($"{errors} errors, first: {firstError}");
File.Delete(path);`,
          output: "2 errors, first: ERROR disk full"
        },
        {
          type: "table",
          headers: ["Method", "Returns", "Memory", "Use when"],
          rows: [
            ["<code>File.ReadAllText</code>", "<code>string</code>", "Whole file", "Small files you need as one string (JSON, config)."],
            ["<code>File.ReadAllLines</code>", "<code>string[]</code>", "Whole file", "Small files where you need random access or the count."],
            ["<code>File.ReadLines</code>", "<code>IEnumerable&lt;string&gt;</code>", "One line", "Big files, searching, stopping early."],
            ["<code>StreamReader</code>", "Lines or chars", "One buffer", "Full control: custom parsing, other streams, encodings."]
          ]
        },
        {
          type: "callout",
          tone: "deep",
          title: "Encodings in one paragraph",
          html: "<p>Text on disk is bytes, and an <strong>encoding</strong> maps characters to bytes. .NET reads and writes <strong>UTF-8</strong> by default, which handles every language and is the modern standard. Old Windows tools sometimes produce files in a legacy code page (Windows-1252). Read one of those as UTF-8 and \"Zürich\" turns into \"Z�rich\". You can pass an encoding explicitly: <code>new StreamReader(path, Encoding.Latin1)</code> or <code>File.ReadAllText(path, Encoding.UTF8)</code>. When you control both sides, stick with UTF-8.</p>"
        },
        {
          type: "code",
          title: "Streams are not only files: MemoryStream",
          code: String.raw`using var memory = new MemoryStream();

using (var w = new StreamWriter(memory, leaveOpen: true))
{
    w.WriteLine("hello");
    w.WriteLine("stream");
}

Console.WriteLine($"{memory.Length} bytes");
memory.Position = 0;               // rewind before reading

using var r = new StreamReader(memory);
Console.WriteLine(r.ReadToEnd().ToUpper().Trim());`,
          output: "13 bytes\nHELLO\nSTREAM"
        },
        {
          type: "text",
          html: "<p>The same reader and writer classes work on any stream. That is the power of the abstraction: code that takes a <code>Stream</code> or a <code>TextReader</code> works with files, memory, network connections and compressed data. It also makes testing easy, because a test can pass a <code>StringReader</code> instead of a real file.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`string p = Path.Combine(Path.GetTempPath(), "ex2.txt");
using (var w = new StreamWriter(p))
{
    w.Write("a");
    w.Write("b");
    w.WriteLine("c");
    w.WriteLine("d");
}
using (var r = new StreamReader(p))
{
    Console.WriteLine(r.ReadLine());
    Console.WriteLine(r.ReadLine());
    Console.WriteLine(r.ReadLine() is null);
}
File.Delete(p);`,
          answer: "abc\nd\nTrue",
          explain: "<p><code>Write</code> does not add a line break, so <code>a</code>, <code>b</code> and <code>c</code> share the first line. The third <code>ReadLine</code> finds no more data and returns <code>null</code>.</p>"
        },
        {
          type: "fill",
          prompt: "Complete the standard loop that reads a file one line at a time.",
          code: String.raw`using var reader = new ___(path);
string? line;
while ((line = reader.___()) != ___)
{
    Console.WriteLine(line);
}`,
          blanks: [["StreamReader"], ["ReadLine"], ["null"]],
          explain: "<p><code>ReadLine</code> returns <code>null</code> only at the end of the file. An empty line comes back as <code>\"\"</code>, so testing for <code>null</code> (not empty) is what ends the loop correctly.</p>"
        },
        {
          type: "bug",
          prompt: "The report file is sometimes missing its last few lines. What is wrong?",
          code: String.raw`var w = new StreamWriter("report.txt");
foreach (var row in rows)
    w.WriteLine(row);
Console.WriteLine("Report written.");`,
          options: [
            "WriteLine should be Write",
            "The writer is never disposed or flushed, so buffered text may never reach the disk",
            "StreamWriter cannot be used inside a foreach",
            "The file name needs a full path"
          ],
          answer: 1,
          explain: "<p>A <code>StreamWriter</code> buffers output. Without <code>Dispose</code> (or <code>Flush</code>) the tail of the buffer can be lost and the file stays locked. Writing <code>using var w = ...</code> fixes it.</p>"
        },
        {
          type: "mcq",
          prompt: "You need to find the first line containing <code>\"FATAL\"</code> in a 6 GB log file. Which is best?",
          options: [
            "<code>File.ReadAllText(path).Split('\\n')</code>",
            "<code>File.ReadAllLines(path).First(...)</code>",
            "<code>File.ReadLines(path).FirstOrDefault(...)</code>",
            "<code>File.ReadAllBytes(path)</code>"
          ],
          answer: 2,
          explain: "<p><code>File.ReadLines</code> streams lazily and <code>FirstOrDefault</code> stops at the first match, so memory stays tiny and the rest of the file is never read. The other options load all 6 GB into memory first, which may throw <code>OutOfMemoryException</code>.</p>"
        },
        {
          type: "order",
          prompt: "Put the steps in order to write text to a MemoryStream and read it back.",
          lines: [
            "using var ms = new MemoryStream();",
            "using (var w = new StreamWriter(ms, leaveOpen: true)) w.Write(\"hi\");",
            "ms.Position = 0;",
            "using var r = new StreamReader(ms);",
            "Console.WriteLine(r.ReadToEnd());"
          ],
          explain: "<p>Write first and dispose the writer (with <code>leaveOpen</code> so the stream survives). After writing, the position is at the end, so rewind to 0 before reading or you get an empty string.</p>"
        }
      ],
      takeaways: [
        "A stream processes data piece by piece instead of all at once.",
        "StreamWriter buffers: always dispose it with using, or data can be lost.",
        "Loop with while ((line = reader.ReadLine()) != null).",
        "File.ReadLines streams lazily and is ideal for big files.",
        "UTF-8 is the default encoding; pass another one only when you must."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m11-l03",
      title: "CSV by hand and its pitfalls",
      minutes: 24,
      objectives: [
        "Parse a simple CSV file into objects",
        "Recognize why string.Split breaks on real CSV data",
        "Parse numbers with CultureInfo.InvariantCulture",
        "Write CSV safely by quoting fields"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>CSV (comma-separated values) is the most common format for exchanging tables: spreadsheets export it, banks offer it, and every data tool reads it. A CSV file is plain text. Each line is a row and commas separate the columns. The first line is usually a <strong>header</strong> with the column names.</p><p>It looks so simple that everybody writes a parser with <code>Split(',')</code>. That works for clean data and fails in surprising ways on real data. In this lesson you build the naive version, break it, then fix it.</p>"
        },
        {
          type: "code",
          title: "The naive parser",
          code: String.raw`using System.Globalization;

string csv = """
    name,qty,price
    Pen,10,1.50
    Notebook,3,4.25

    Stapler,1,12.00
    """;

var items = new List<Item>();
foreach (string raw in csv.Split('\n').Skip(1))
{
    string line = raw.Trim();
    if (line.Length == 0) continue;          // skip blank lines

    string[] f = line.Split(',');
    items.Add(new Item(
        f[0],
        int.Parse(f[1]),
        decimal.Parse(f[2], CultureInfo.InvariantCulture)));
}

foreach (var i in items)
    Console.WriteLine($"{i.Name,-9} {i.Qty,3} x {i.Price}");
Console.WriteLine($"Total: {items.Sum(i => i.Qty * i.Price)}");

record Item(string Name, int Qty, decimal Price);`,
          output: "Pen        10 x 1.50\nNotebook    3 x 4.25\nStapler     1 x 12.00\nTotal: 39.75"
        },
        {
          type: "text",
          html: "<p>Three habits are already in there:</p><ul><li><code>Skip(1)</code> skips the header row.</li><li>Blank lines are skipped. Files often end with an empty line, and <code>int.Parse(\"\")</code> would throw <code>FormatException</code>.</li><li>Numbers are parsed with <code>CultureInfo.InvariantCulture</code>. This one deserves its own section.</li></ul>"
        },
        {
          type: "callout",
          tone: "warning",
          title: "The culture bug that only hits other countries",
          html: "<p><code>decimal.Parse(\"1.50\")</code> uses the computer's current culture. On a German or French PC the decimal separator is a comma, so <code>\"1.50\"</code> parses as <strong>150</strong> (the dot is read as a thousands separator) or throws. Your program works perfectly on your laptop and gives wrong totals for a colleague in Berlin. Data files should always be parsed and written with <code>CultureInfo.InvariantCulture</code>. Use the user's culture only for text that a human reads on screen.</p>"
        },
        {
          type: "code",
          title: "Seeing the culture difference",
          code: String.raw`using System.Globalization;

var de = new CultureInfo("de-DE");
var inv = CultureInfo.InvariantCulture;

Console.WriteLine(decimal.Parse("1.50", inv));
Console.WriteLine(decimal.Parse("1.50", de));
Console.WriteLine(decimal.Parse("1,50", de));
Console.WriteLine(1234.5m.ToString(de));
Console.WriteLine(1234.5m.ToString(inv));`,
          output: "1.50\n150\n1.50\n1234,5\n1234.5"
        },
        {
          type: "text",
          html: "<p>Now the real killer. CSV allows a field to contain a comma if the field is wrapped in double quotes. A double quote inside a quoted field is written as two quotes (<code>\"\"</code>). Spreadsheets do this automatically:</p>"
        },
        {
          type: "compare",
          left: {
            label: "The data",
            code: String.raw`name,city,note
"Smith, John",Boston,VIP
Ana,"Paris",said "hi"
"Lee ""Ace"" Wong",Austin,`
          },
          right: {
            label: "What Split(',') gives row 1",
            code: String.raw`[0] "Smith
[1]  John"
[2] Boston
[3] VIP
// 4 fields instead of 3,
// quotes still attached`
          }
        },
        {
          type: "text",
          html: "<p>A correct parser has to walk the line character by character and remember whether it is inside quotes. It is a small <strong>state machine</strong>:</p>"
        },
        {
          type: "code",
          title: "A quote-aware CSV line parser",
          code: String.raw`using System.Text;

static List<string> ParseCsvLine(string line)
{
    var fields = new List<string>();
    var current = new StringBuilder();
    bool inQuotes = false;

    for (int i = 0; i < line.Length; i++)
    {
        char c = line[i];
        if (inQuotes)
        {
            if (c == '"' && i + 1 < line.Length
                && line[i + 1] == '"')
            {
                current.Append('"');   // "" means one quote
                i++;
            }
            else if (c == '"') inQuotes = false;
            else current.Append(c);
        }
        else if (c == '"') inQuotes = true;
        else if (c == ',')
        {
            fields.Add(current.ToString());
            current.Clear();
        }
        else current.Append(c);
    }
    fields.Add(current.ToString());
    return fields;
}

string[] rows =
{
    "\"Smith, John\",Boston,VIP",
    "\"Lee \"\"Ace\"\" Wong\",Austin,",
};
foreach (string row in rows)
    Console.WriteLine(string.Join(" | ", ParseCsvLine(row)));`,
          output: "Smith, John | Boston | VIP\nLee \"Ace\" Wong | Austin |"
        },
        {
          type: "text",
          html: "<p>Writing CSV has the mirror problem. Before writing a field, check whether it contains a comma, a quote or a line break. If so, double every quote and wrap the field in quotes:</p>"
        },
        {
          type: "code",
          title: "Escaping fields when writing",
          code: String.raw`using System.Globalization;

static string Esc(string s) =>
    s.IndexOfAny(new[] { ',', '"', '\n', '\r' }) >= 0
        ? "\"" + s.Replace("\"", "\"\"") + "\""
        : s;

var people = new[]
{
    ("Smith, John", 1250.5m),
    ("Lee \"Ace\" Wong", 99m),
    ("Ana", 7.25m)
};

string path = Path.Combine(Path.GetTempPath(), "people.csv");
using (var w = new StreamWriter(path))
{
    w.WriteLine("name,balance");
    foreach (var (name, balance) in people)
        w.WriteLine(Esc(name) + "," +
            balance.ToString(CultureInfo.InvariantCulture));
}
Console.Write(File.ReadAllText(path));
File.Delete(path);`,
          output: "name,balance\n\"Smith, John\",1250.5\n\"Lee \"\"Ace\"\" Wong\",99\nAna,7.25"
        },
        {
          type: "callout",
          tone: "tip",
          title: "How professionals do it",
          html: "<p>Our parser still does not handle a quoted field that spans several lines, and real files bring other surprises: semicolons as separators (Excel in Europe), a byte order mark at the start, inconsistent column counts. In production code most teams use a library such as <strong>CsvHelper</strong> (NuGet) which handles all of that and maps rows to classes. Writing the parser yourself once is still valuable: you now know what can go wrong and what to test.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print? Think about how <code>Split</code> treats the quotes.",
          code: String.raw`string line = "\"Doe, Jane\",42";
string[] parts = line.Split(',');
Console.WriteLine(parts.Length);
Console.WriteLine(parts[1]);`,
          answer: "3\n Jane\"",
          explain: "<p><code>Split</code> knows nothing about quotes. It cuts at every comma, so you get <code>\"Doe</code>, <code> Jane\"</code> and <code>42</code>. The second piece keeps its leading space and the closing quote. This is the exact bug that corrupts names in naive CSV imports.</p>"
        },
        {
          type: "mcq",
          prompt: "Your CSV import gives correct totals in the US office and totals 100 times too large in the Paris office. What is the most likely cause?",
          options: [
            "French Windows uses a different line ending",
            "decimal.Parse uses the current culture, where the dot is not the decimal separator",
            "The CSV file is encoded in UTF-8",
            "decimal cannot store values over 1000"
          ],
          answer: 1,
          explain: "<p>In fr-FR the decimal separator is a comma. <code>\"12.50\"</code> parsed with that culture loses its dot and becomes 1250. Passing <code>CultureInfo.InvariantCulture</code> makes parsing identical everywhere. Line endings and UTF-8 do not change numbers.</p>"
        },
        {
          type: "fill",
          prompt: "Parse a price from a CSV field so the result does not depend on the user's regional settings.",
          code: String.raw`using System.Globalization;

string field = "19.99";
decimal price = decimal.Parse(field, CultureInfo.___);`,
          blanks: [["InvariantCulture"]],
          explain: "<p><code>CultureInfo.InvariantCulture</code> always uses a dot for decimals and no locale quirks. Use it for anything machine-readable: files, network data, logs.</p>"
        },
        {
          type: "bug",
          prompt: "This import crashes with <code>FormatException</code> on a file that looks fine in Notepad. Why?",
          code: String.raw`foreach (string line in File.ReadAllLines("stock.csv"))
{
    string[] f = line.Split(',');
    int qty = int.Parse(f[1]);
    Console.WriteLine($"{f[0]}: {qty}");
}`,
          options: [
            "ReadAllLines cannot read CSV files",
            "The header row is parsed too: int.Parse(\"qty\") throws",
            "Split needs a string, not a char",
            "Console.WriteLine cannot print an int inside a string"
          ],
          answer: 1,
          explain: "<p>The first line is the header, so <code>f[1]</code> is the text <code>qty</code>. Skip it with <code>.Skip(1)</code>. A trailing blank line would cause a similar crash (<code>IndexOutOfRangeException</code>), so skip blank lines too.</p>"
        },
        {
          type: "output",
          prompt: "Using the <code>Esc</code> helper from the lesson, what does this print?",
          code: String.raw`static string Esc(string s) =>
    s.IndexOfAny(new[] { ',', '"', '\n', '\r' }) >= 0
        ? "\"" + s.Replace("\"", "\"\"") + "\""
        : s;

Console.WriteLine(Esc("plain"));
Console.WriteLine(Esc("a,b"));
Console.WriteLine(Esc("say \"no\""));`,
          answer: "plain\n\"a,b\"\n\"say \"\"no\"\"\"",
          explain: "<p>A field with no special characters is written as is. A comma forces quotes around the field. Quotes inside a field are doubled, and then the whole field is wrapped in quotes too.</p>"
        }
      ],
      takeaways: [
        "Skip the header and blank lines before parsing rows.",
        "Parse and write data numbers with CultureInfo.InvariantCulture.",
        "Split(',') breaks on quoted fields; real CSV needs a quote-aware parser.",
        "When writing, quote fields containing commas, quotes or line breaks and double inner quotes.",
        "In production, a library like CsvHelper handles the edge cases."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m11-l04",
      title: "JSON with System.Text.Json",
      minutes: 26,
      objectives: [
        "Serialize objects to JSON and deserialize them back",
        "Configure output with JsonSerializerOptions",
        "Control property names and visibility with attributes",
        "Handle null results and JsonException safely"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>JSON is the language of web APIs and the most popular format for config and save files. It supports objects, arrays, strings, numbers, booleans and <code>null</code>, so it maps naturally onto C# classes and lists. That is a big step up from CSV, which only knows flat rows of text.</p><p>.NET has a fast JSON library built in: <code>System.Text.Json</code>. The main entry point is the static class <code>JsonSerializer</code> with two methods. <strong>Serialize</strong> turns an object into a JSON string. <strong>Deserialize</strong> turns JSON back into an object.</p>"
        },
        {
          type: "code",
          title: "Round trip",
          code: String.raw`using System.Text.Json;

var book = new Book("Dune", "Frank Herbert", 1965,
    new List<string> { "sci-fi", "classic" });

string json = JsonSerializer.Serialize(book);
Console.WriteLine(json);

Book? back = JsonSerializer.Deserialize<Book>(json);
Console.WriteLine(back!.Title + " / " + back.Tags.Count + " tags");
Console.WriteLine(back == book ? "equal" : "different");

record Book(string Title, string Author, int Year,
    List<string> Tags);`,
          output: "{\"Title\":\"Dune\",\"Author\":\"Frank Herbert\",\"Year\":1965,\"Tags\":[\"sci-fi\",\"classic\"]}\nDune / 2 tags\ndifferent"
        },
        {
          type: "text",
          html: "<p>Three details to notice:</p><ul><li>Only <strong>public properties</strong> are serialized. Fields and private members are ignored unless you opt in.</li><li><code>Deserialize&lt;T&gt;</code> returns <code>T?</code>. The JSON text <code>null</code> is valid and gives you <code>null</code>, so the compiler makes you deal with it.</li><li>The records print <code>different</code> even though the data matches. Record equality compares the <code>List</code> by reference, and deserializing created a new list. A good reminder that record equality is shallow.</li></ul>"
        },
        {
          type: "code",
          title: "Options: pretty printing and camelCase",
          code: String.raw`using System.Text.Json;

var options = new JsonSerializerOptions
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

var p = new Player { Name = "Kai", HighScore = 4200, IsOnline = true };
Console.WriteLine(JsonSerializer.Serialize(p, options));

class Player
{
    public string Name { get; set; } = "";
    public int HighScore { get; set; }
    public bool IsOnline { get; set; }
}`,
          output: "{\n  \"name\": \"Kai\",\n  \"highScore\": 4200,\n  \"isOnline\": true\n}"
        },
        {
          type: "text",
          html: "<p>C# uses PascalCase property names, while most JSON in the wild (JavaScript, web APIs) uses camelCase. <code>JsonNamingPolicy.CamelCase</code> converts on the way out and on the way in. <code>WriteIndented</code> makes save files readable for humans.</p><p>Reading is <strong>case-sensitive</strong> by default. If the file says <code>\"name\"</code> and your property is <code>Name</code>, the property silently stays at its default value. Either use the same naming policy for reading or set <code>PropertyNameCaseInsensitive = true</code>.</p>"
        },
        {
          type: "code",
          title: "The silent mismatch",
          code: String.raw`using System.Text.Json;

string json = """{"name":"Kai","highScore":4200}""";

var strict = JsonSerializer.Deserialize<Player>(json)!;
Console.WriteLine($"[{strict.Name}] {strict.HighScore}");

var relaxed = JsonSerializer.Deserialize<Player>(json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
Console.WriteLine($"[{relaxed.Name}] {relaxed.HighScore}");

class Player
{
    public string Name { get; set; } = "";
    public int HighScore { get; set; }
}`,
          output: "[] 0\n[Kai] 4200"
        },
        {
          type: "callout",
          tone: "tip",
          title: "Reuse your options object",
          html: "<p>A <code>JsonSerializerOptions</code> instance caches metadata about your types the first time it is used. Creating a new one for every call throws that cache away and is noticeably slower. Store it in a <code>static readonly</code> field and reuse it. Since .NET 8 the analyzer even warns you about this (CA1869).</p>"
        },
        {
          type: "code",
          title: "Attributes for fine control",
          code: String.raw`using System.Text.Json;
using System.Text.Json.Serialization;

var order = new Order
{
    Id = 17,
    Status = Status.Shipped,
    InternalNote = "customer was rude",
    Coupon = null
};

var opts = new JsonSerializerOptions
{
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    Converters = { new JsonStringEnumConverter() }
};
Console.WriteLine(JsonSerializer.Serialize(order, opts));

enum Status { Pending, Shipped }

class Order
{
    [JsonPropertyName("order_id")]
    public int Id { get; set; }

    public Status Status { get; set; }

    [JsonIgnore]
    public string InternalNote { get; set; } = "";

    public string? Coupon { get; set; }
}`,
          output: "{\"order_id\":17,\"Status\":\"Shipped\"}"
        },
        {
          type: "table",
          headers: ["Tool", "Effect"],
          rows: [
            ["<code>[JsonPropertyName(\"x\")]</code>", "Use a fixed JSON name for this property, regardless of naming policy."],
            ["<code>[JsonIgnore]</code>", "Never read or write this property."],
            ["<code>[JsonInclude]</code>", "Include a field or a non-public setter."],
            ["<code>JsonStringEnumConverter</code>", "Write enums as names (<code>\"Shipped\"</code>) instead of numbers (<code>1</code>)."],
            ["<code>DefaultIgnoreCondition</code>", "Skip null (or default) values when writing."],
            ["<code>[JsonRequired]</code>", "Throw if the property is missing when reading."]
          ]
        },
        {
          type: "text",
          html: "<p>Enums are written as numbers by default. Numbers are compact but fragile: if somebody reorders the enum members, every saved file changes meaning. Names are safer for files that live a long time.</p><p>When the JSON text is broken, <code>Deserialize</code> throws <code>JsonException</code>. Its message includes the line and byte position, which is a great help when a user edits a save file by hand:</p>"
        },
        {
          type: "code",
          title: "Loading a save file defensively",
          code: String.raw`using System.Text.Json;

string path = Path.Combine(Path.GetTempPath(), "settings.json");
File.WriteAllText(path, """{ "Volume": 80, "Theme": "dark" """);

Settings settings;
try
{
    string json = File.ReadAllText(path);
    settings = JsonSerializer.Deserialize<Settings>(json)
               ?? new Settings();
}
catch (JsonException)
{
    Console.WriteLine("Settings file is damaged, using defaults.");
    settings = new Settings();
}
Console.WriteLine($"Volume {settings.Volume}, theme {settings.Theme}");
File.Delete(path);

class Settings
{
    public int Volume { get; set; } = 50;
    public string Theme { get; set; } = "light";
}`,
          output: "Settings file is damaged, using defaults.\nVolume 50, theme light"
        },
        {
          type: "callout",
          tone: "deep",
          title: "Why do I see \\u0027 in my JSON?",
          html: "<p>By default the serializer escapes characters that could be dangerous if the JSON were pasted into HTML: <code>'</code> becomes <code>\\u0027</code>, <code>&lt;</code> becomes <code>\\u003C</code>, and non-ASCII letters like <code>ü</code> become <code>\\u00FC</code>. The JSON is still correct and reads back perfectly. For human-friendly files set <code>Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping</code> (namespace <code>System.Text.Encodings.Web</code>). The name sounds scary, but it is fine when the JSON is not embedded in a web page.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`using System.Text.Json;

var opts = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};
var t = new Todo { Title = "Wash car", Done = false, Priority = 2 };
Console.WriteLine(JsonSerializer.Serialize(t, opts));

class Todo
{
    public string Title { get; set; } = "";
    public bool Done { get; set; }
    public int Priority { get; set; }
}`,
          answer: "{\"title\":\"Wash car\",\"done\":false,\"priority\":2}",
          explain: "<p>The camelCase policy lowercases the first letter of each property name. No indentation was requested, so the JSON is on one line with no spaces. Booleans are written as lowercase <code>false</code>, as JSON requires.</p>"
        },
        {
          type: "mcq",
          prompt: "You deserialize <code>{\"username\":\"ana\"}</code> into a class with <code>public string UserName { get; set; } = \"\";</code> and default options. What happens?",
          options: [
            "UserName becomes \"ana\"",
            "A JsonException is thrown because the names differ",
            "UserName stays \"\" and no error is reported",
            "A compile error, CS0029"
          ],
          answer: 2,
          explain: "<p>Matching is case-sensitive by default, and unknown JSON properties are ignored silently. So the property keeps its default. Set <code>PropertyNameCaseInsensitive = true</code> or add <code>[JsonPropertyName(\"username\")]</code>. No compile error is possible because JSON is only checked at runtime.</p>"
        },
        {
          type: "fill",
          prompt: "Make <code>Password</code> never appear in the JSON, and write <code>Email</code> under the name <code>e-mail</code>.",
          code: String.raw`class Account
{
    [___("e-mail")]
    public string Email { get; set; } = "";

    [___]
    public string Password { get; set; } = "";
}`,
          blanks: [["JsonPropertyName"], ["JsonIgnore"]],
          explain: "<p><code>[JsonPropertyName]</code> sets the exact JSON name. <code>[JsonIgnore]</code> removes a property from both reading and writing. Both live in <code>System.Text.Json.Serialization</code>.</p>"
        },
        {
          type: "bug",
          prompt: "This compiles but the JSON is always <code>{}</code>. Why?",
          code: String.raw`class Point
{
    public int X;
    public int Y;
}

var json = JsonSerializer.Serialize(new Point { X = 1, Y = 2 });`,
          options: [
            "Point must be a record",
            "X and Y are fields, and System.Text.Json only serializes properties by default",
            "Serialize needs a JsonSerializerOptions argument",
            "Int values cannot be serialized"
          ],
          answer: 1,
          explain: "<p>Public fields are skipped by default. Turn them into properties (<code>{ get; set; }</code>), mark them <code>[JsonInclude]</code>, or set <code>IncludeFields = true</code> in the options. Classes work fine; a record is not required.</p>"
        },
        {
          type: "order",
          prompt: "Put the lines in order to load a list of contacts from JSON, falling back to an empty list.",
          lines: [
            "string path = \"contacts.json\";",
            "if (!File.Exists(path)) return new List<Contact>();",
            "string json = File.ReadAllText(path);",
            "var list = JsonSerializer.Deserialize<List<Contact>>(json);",
            "return list ?? new List<Contact>();"
          ],
          explain: "<p>Check for the file (first run), read the text, deserialize, then guard against a <code>null</code> result, because a file that contains just <code>null</code> is valid JSON.</p>"
        }
      ],
      takeaways: [
        "JsonSerializer.Serialize and Deserialize<T> cover most JSON needs.",
        "Only public properties are included by default.",
        "Reading is case-sensitive; match naming policies or enable case-insensitivity.",
        "Use attributes ([JsonPropertyName], [JsonIgnore]) for per-property control.",
        "Deserialize can return null or throw JsonException; handle both."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m11-l05",
      title: "Dates, times and culture",
      minutes: 24,
      objectives: [
        "Create and do arithmetic with DateTime, DateOnly and TimeSpan",
        "Format and parse dates with explicit formats",
        "Know when to use UTC and DateTimeOffset",
        "Use CultureInfo.InvariantCulture for data and the user culture for display"
      ],
      blocks: [
        {
          type: "text",
          html: "<p>Almost every data file has dates in it: order dates, birthdays, log timestamps. Dates look easy and are a famous source of bugs. Time zones, daylight saving time, month lengths and regional formats all get in the way. .NET gives you a set of types, each with a clear job:</p>"
        },
        {
          type: "table",
          headers: ["Type", "Holds", "Example use"],
          rows: [
            ["<code>DateTime</code>", "Date and time of day", "Timestamps, appointments"],
            ["<code>DateOnly</code>", "Just a date (.NET 6+)", "Birthdays, due dates, holidays"],
            ["<code>TimeOnly</code>", "Just a time of day", "Opening hours, alarms"],
            ["<code>TimeSpan</code>", "A duration", "\"2 hours 30 minutes\", elapsed time"],
            ["<code>DateTimeOffset</code>", "Date, time and UTC offset", "Exact moments across time zones"]
          ]
        },
        {
          type: "code",
          title: "Creating dates and doing arithmetic",
          code: String.raw`var start = new DateTime(2024, 1, 30, 9, 0, 0);

Console.WriteLine(start.AddDays(3).ToString("yyyy-MM-dd"));
Console.WriteLine(start.AddMonths(1).ToString("yyyy-MM-dd"));
Console.WriteLine(start.AddHours(-10).ToString("yyyy-MM-dd HH:mm"));
Console.WriteLine(start.DayOfWeek);

DateTime end = new DateTime(2024, 3, 1, 17, 30, 0);
TimeSpan gap = end - start;
Console.WriteLine($"{gap.Days} days and {gap.Hours} hours");
Console.WriteLine($"{gap.TotalHours} hours in total");`,
          output: "2024-02-02\n2024-02-29\n2024-01-29 23:00\nTuesday\n31 days and 8 hours\n752.5 hours in total"
        },
        {
          type: "text",
          html: "<p>The <code>Add...</code> methods know the calendar. <code>AddMonths(1)</code> on January 30 gives February 29 in a leap year, because there is no February 30. Subtracting two dates gives a <code>TimeSpan</code>. Careful with its properties: <code>Hours</code> is only the hours <em>part</em> (0-23), while <code>TotalHours</code> is the whole duration as a <code>double</code>. Mixing them up is a common bug.</p><p>All date types are <strong>immutable</strong>, like strings. <code>start.AddDays(3)</code> returns a new value. Writing <code>start.AddDays(3);</code> on its own line does nothing useful.</p>"
        },
        {
          type: "code",
          title: "DateOnly and TimeSpan",
          code: String.raw`var birthday = new DateOnly(1990, 7, 14);
var today = new DateOnly(2024, 7, 13);

int age = today.Year - birthday.Year;
if (today < birthday.AddYears(age)) age--;  // not yet this year
Console.WriteLine($"Age: {age}");

int daysLeft = birthday.AddYears(age + 1).DayNumber
               - today.DayNumber;
Console.WriteLine($"Days to birthday: {daysLeft}");

var shift = TimeSpan.FromMinutes(450);
Console.WriteLine(shift);
Console.WriteLine(shift.ToString(@"h\:mm"));
Console.WriteLine(TimeSpan.FromHours(1.5) + TimeSpan.FromMinutes(20));`,
          output: "Age: 33\nDays to birthday: 1\n07:30:00\n7:30\n01:50:00"
        },
        {
          type: "text",
          html: "<p>The age calculation shows why dates need thought. Subtracting the years gives 34, but the birthday has not happened yet this year, so the real age is 33. <code>DateOnly</code> avoids a whole class of bugs because there is no hidden time of day to trip over.</p><p>Custom TimeSpan formats need the colon escaped (<code>@\"h\\:mm\"</code>) because TimeSpan formats treat every non-letter as a literal you must escape.</p>"
        },
        {
          type: "code",
          title: "Formatting: the culture matters",
          code: String.raw`using System.Globalization;

var d = new DateTime(2024, 3, 9, 14, 5, 0);
var us = new CultureInfo("en-US");
var de = new CultureInfo("de-DE");
var inv = CultureInfo.InvariantCulture;

Console.WriteLine(d.ToString("d", us));
Console.WriteLine(d.ToString("d", de));
Console.WriteLine(d.ToString("yyyy-MM-dd HH:mm", inv));
Console.WriteLine(d.ToString("o", inv));
Console.WriteLine(d.ToString("dddd d MMMM", us));
Console.WriteLine(d.ToString("dddd d MMMM", de));`,
          output: "3/9/2024\n09.03.2024\n2024-03-09 14:05\n2024-03-09T14:05:00.0000000\nSaturday 9 March\nSamstag 9 März"
        },
        {
          type: "text",
          html: "<p>The same date is <code>3/9/2024</code> in the US and <code>09.03.2024</code> in Germany. A program that writes dates with the default <code>ToString()</code> and reads them back on another machine can swap day and month without any error. The rule professionals follow:</p><ul><li><strong>Data</strong> (files, JSON, databases, logs): ISO 8601 format (<code>yyyy-MM-dd</code> or <code>\"o\"</code>) with <code>InvariantCulture</code>.</li><li><strong>Display</strong> to a human: the user's culture, which is the default.</li></ul><p>Watch the case of format letters: <code>MM</code> is month and <code>mm</code> is minutes. <code>HH</code> is 24-hour and <code>hh</code> is 12-hour.</p>"
        },
        {
          type: "code",
          title: "Parsing safely with TryParseExact",
          code: String.raw`using System.Globalization;

string[] inputs = { "2024-02-29", "2023-02-29", "29/02/2024" };

foreach (string s in inputs)
{
    bool ok = DateOnly.TryParseExact(s, "yyyy-MM-dd",
        CultureInfo.InvariantCulture, DateTimeStyles.None,
        out DateOnly date);
    Console.WriteLine(ok
        ? $"{s} -> {date.DayOfWeek}"
        : $"{s} -> invalid");
}`,
          output: "2024-02-29 -> Thursday\n2023-02-29 -> invalid\n29/02/2024 -> invalid"
        },
        {
          type: "text",
          html: "<p><code>TryParseExact</code> accepts only the exact format you specify and rejects impossible dates such as February 29 in a non-leap year. That is what you want for data files. Plain <code>DateTime.Parse</code> tries to guess, and its guess depends on the machine's culture.</p>"
        },
        {
          type: "callout",
          tone: "warning",
          title: "Local time, UTC and DateTimeOffset",
          html: "<p><code>DateTime.Now</code> is local time on this machine. <code>DateTime.UtcNow</code> is Coordinated Universal Time, the same everywhere. Store and compare timestamps in <strong>UTC</strong>. Local time jumps an hour twice a year with daylight saving time, so \"local end minus local start\" can be off by an hour. Convert to local time only when displaying. If you must remember which offset a moment was recorded in, use <code>DateTimeOffset</code>, which stores both the time and its offset from UTC. For measuring how long code takes, use <code>Stopwatch</code>, not <code>DateTime.Now</code>.</p>"
        },
        {
          type: "callout",
          tone: "python",
          title: "Coming from Python",
          html: "<p><code>DateTime</code> is like <code>datetime.datetime</code>, <code>DateOnly</code> like <code>datetime.date</code> and <code>TimeSpan</code> like <code>timedelta</code>. The format letters differ: Python's <code>%Y-%m-%d</code> is <code>yyyy-MM-dd</code> in .NET.</p>"
        }
      ],
      exercises: [
        {
          type: "output",
          prompt: "What does this print?",
          code: String.raw`var a = new DateTime(2024, 5, 1, 8, 0, 0);
var b = new DateTime(2024, 5, 3, 20, 30, 0);
TimeSpan t = b - a;
Console.WriteLine(t.Days);
Console.WriteLine(t.Hours);
Console.WriteLine(t.Minutes);
Console.WriteLine(t.TotalHours);`,
          answer: "2\n12\n30\n60.5",
          explain: "<p>The gap is 2 days, 12 hours and 30 minutes. <code>Days</code>, <code>Hours</code> and <code>Minutes</code> are the separate parts. <code>TotalHours</code> expresses the whole gap in hours: 48 + 12.5 = 60.5.</p>"
        },
        {
          type: "fill",
          prompt: "Write a date as <code>2024-12-31</code> on every machine, then parse it back with the same exact format.",
          code: String.raw`using System.Globalization;

var d = new DateOnly(2024, 12, 31);
string s = d.ToString("___", CultureInfo.InvariantCulture);
DateOnly back = DateOnly.ParseExact(s, "yyyy-MM-dd",
    CultureInfo.___);`,
          blanks: [["yyyy-MM-dd"], ["InvariantCulture"]],
          explain: "<p>Capital <code>MM</code> is the month (lowercase <code>mm</code> would be minutes). Using the same explicit format and <code>InvariantCulture</code> on both sides guarantees a perfect round trip.</p>"
        },
        {
          type: "bug",
          prompt: "This should print the due date one week from the start, but it prints the start date. Why?",
          code: String.raw`var due = new DateOnly(2024, 6, 1);
due.AddDays(7);
Console.WriteLine(due.ToString("yyyy-MM-dd"));`,
          options: [
            "AddDays only works on DateTime",
            "Dates are immutable: AddDays returns a new value that is thrown away",
            "The format string is wrong",
            "AddDays takes a TimeSpan, not an int"
          ],
          answer: 1,
          explain: "<p>Like strings, date types never change in place. Write <code>due = due.AddDays(7);</code>. <code>DateOnly</code> does have <code>AddDays(int)</code>, and the format string is correct.</p>"
        },
        {
          type: "mcq",
          prompt: "You are writing order timestamps to a JSON file that servers in several countries will read. What should you store?",
          options: [
            "DateTime.Now.ToString()",
            "DateTime.UtcNow in ISO 8601 format",
            "The local time formatted with the user's culture",
            "Only the date, as text like \"03/04/2024\""
          ],
          answer: 1,
          explain: "<p>UTC is the same on every server, and ISO 8601 cannot be misread. <code>DateTime.Now.ToString()</code> mixes local time with a culture-specific format, and <code>03/04/2024</code> is March 4 in the US but April 3 in Europe. (System.Text.Json writes DateTime values in ISO 8601 automatically.)</p>"
        },
        {
          type: "output",
          prompt: "What does this print? (Remember the case of the format letters.)",
          code: String.raw`using System.Globalization;

var d = new DateTime(2024, 8, 5, 7, 42, 0);
var inv = CultureInfo.InvariantCulture;
Console.WriteLine(d.ToString("dd/MM/yyyy", inv));
Console.WriteLine(d.ToString("HH:mm", inv));
Console.WriteLine(d.ToString("yyyy-mm-dd", inv));`,
          answer: "05/08/2024\n07:42\n2024-42-05",
          explain: "<p>The last line uses lowercase <code>mm</code>, which means minutes, so 42 lands where the month should be. This exact bug ships to production surprisingly often. <code>dd</code> pads the day to two digits.</p>"
        }
      ],
      takeaways: [
        "Pick the right type: DateTime, DateOnly, TimeOnly, TimeSpan, DateTimeOffset.",
        "Date values are immutable; keep the result of AddDays and friends.",
        "TimeSpan.Hours is a part; TotalHours is the whole duration.",
        "Write and parse data dates as ISO 8601 with InvariantCulture.",
        "Store timestamps in UTC; convert to local time only for display."
      ]
    }
  ],
  milestone: {
    id: "m11-project",
    title: "Contact Book",
    brief: "<p>Build a command-line contact book that remembers its data between runs. Contacts are stored in a <code>contacts.json</code> file next to where the program runs. Each contact has a name, a phone number, an email and the date it was added.</p><p>The program loads the file at startup (or starts empty on the first run), shows a prompt, and processes commands until the user types <code>quit</code> or input ends. After every change it saves the whole list back to disk, so nothing is lost if the program is closed.</p>",
    skills: [
      "File.ReadAllText / WriteAllText",
      "System.Text.Json",
      "JsonSerializerOptions",
      "DateOnly and ISO dates",
      "Exception handling for IO",
      "LINQ search"
    ],
    requirements: [
      "Define a Contact record or class with Name, Phone, Email and Added (DateOnly).",
      "On startup, load contacts from contacts.json; if the file does not exist, start with an empty list.",
      "If the file is damaged (JsonException), print a warning and start with an empty list instead of crashing.",
      "Command add asks for name, phone and email, rejects an empty name, and stores today's date.",
      "Command list prints all contacts sorted by name, or \"No contacts yet.\" when empty.",
      "Command find asks for text and shows contacts whose name or email contains it, ignoring case.",
      "Command remove deletes a contact by exact name (ignoring case) and reports whether it was found.",
      "Save the list as indented camelCase JSON after every add and remove.",
      "End cleanly on quit or when Console.ReadLine returns null."
    ],
    sampleRun: "Contact Book (2 contacts loaded)\nCommands: add, list, find, remove, quit\n> add\nName: Grace Hopper\nPhone: 555-0199\nEmail: grace@navy.mil\nSaved Grace Hopper.\n> list\nAda Lovelace     555-0100    ada@engine.org    added 2024-05-02\nAlan Turing      555-0142    alan@bletchley.uk added 2024-05-03\nGrace Hopper     555-0199    grace@navy.mil    added 2024-11-04\n> find\nSearch: ALAN\nAlan Turing      555-0142    alan@bletchley.uk added 2024-05-03\n> remove\nName: alan turing\nRemoved Alan Turing.\n> quit\nBye!",
    starter: String.raw`using System.Text.Json;

const string FilePath = "contacts.json";

var options = new JsonSerializerOptions
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

List<Contact> contacts = Load();
Console.WriteLine($"Contact Book ({contacts.Count} contacts loaded)");
Console.WriteLine("Commands: add, list, find, remove, quit");

while (true)
{
    Console.Write("> ");
    string? command = Console.ReadLine();
    if (command is null) break;

    switch (command.Trim().ToLower())
    {
        case "add":
            // TODO: ask for name, phone, email (handle null input)
            // TODO: reject an empty name
            // TODO: add a Contact with today's date and Save()
            break;
        case "list":
            // TODO: print contacts sorted by name, or a message
            break;
        case "find":
            // TODO: case-insensitive search on name and email
            break;
        case "remove":
            // TODO: remove by name (ignore case) and Save()
            break;
        case "quit":
            Console.WriteLine("Bye!");
            return;
        default:
            Console.WriteLine("Unknown command.");
            break;
    }
}

List<Contact> Load()
{
    // TODO: return an empty list if the file does not exist
    // TODO: read and deserialize; handle null and JsonException
    return new List<Contact>();
}

void Save()
{
    // TODO: serialize contacts with options and write the file
}

record Contact(string Name, string Phone, string Email, DateOnly Added);`,
    hints: [
      "<p>Start with <code>Load</code> and <code>Save</code>. <code>Save</code> is one line: <code>File.WriteAllText(FilePath, JsonSerializer.Serialize(contacts, options));</code>. Pass the same <code>options</code> to <code>Deserialize</code> so the camelCase names match when reading.</p>",
      "<p>In <code>Load</code>, check <code>File.Exists</code> first, then wrap the read and deserialize in <code>try/catch (JsonException)</code>. Return <code>result ?? new List&lt;Contact&gt;()</code> because the file could contain <code>null</code>.</p>",
      "<p>Write a small helper <code>string? Ask(string label)</code> that prints the label and returns <code>Console.ReadLine()?.Trim()</code>. Then in <code>add</code>, <code>if (string.IsNullOrEmpty(name))</code> reject it.</p>",
      "<p>Today's date as a <code>DateOnly</code> is <code>DateOnly.FromDateTime(DateTime.Today)</code>. System.Text.Json writes it as <code>\"2024-05-02\"</code> automatically.</p>",
      "<p>For searching use <code>Contains(text, StringComparison.OrdinalIgnoreCase)</code>, and for removing use <code>contacts.FindIndex(c =&gt; string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase))</code>.</p>"
    ],
    solution: String.raw`using System.Globalization;
using System.Text.Json;

const string FilePath = "contacts.json";

var options = new JsonSerializerOptions
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

List<Contact> contacts = Load();
Console.WriteLine($"Contact Book ({contacts.Count} contacts loaded)");
Console.WriteLine("Commands: add, list, find, remove, quit");

while (true)
{
    Console.Write("> ");
    string? command = Console.ReadLine();
    if (command is null) break;

    switch (command.Trim().ToLower())
    {
        case "add":
            string? name = Ask("Name: ");
            if (string.IsNullOrEmpty(name))
            {
                Console.WriteLine("A name is required.");
                break;
            }
            string phone = Ask("Phone: ") ?? "";
            string email = Ask("Email: ") ?? "";
            var today = DateOnly.FromDateTime(DateTime.Today);
            contacts.Add(new Contact(name, phone, email, today));
            Save();
            Console.WriteLine($"Saved {name}.");
            break;

        case "list":
            if (contacts.Count == 0)
            {
                Console.WriteLine("No contacts yet.");
                break;
            }
            foreach (var c in contacts.OrderBy(c => c.Name))
                Print(c);
            break;

        case "find":
            string text = Ask("Search: ") ?? "";
            var hits = contacts
                .Where(c => c.Name.Contains(text,
                                StringComparison.OrdinalIgnoreCase)
                         || c.Email.Contains(text,
                                StringComparison.OrdinalIgnoreCase))
                .OrderBy(c => c.Name)
                .ToList();
            if (hits.Count == 0) Console.WriteLine("No matches.");
            foreach (var c in hits) Print(c);
            break;

        case "remove":
            string target = Ask("Name: ") ?? "";
            int index = contacts.FindIndex(c => string.Equals(
                c.Name, target, StringComparison.OrdinalIgnoreCase));
            if (index < 0)
            {
                Console.WriteLine("No contact with that name.");
                break;
            }
            string removed = contacts[index].Name;
            contacts.RemoveAt(index);
            Save();
            Console.WriteLine($"Removed {removed}.");
            break;

        case "quit":
            Console.WriteLine("Bye!");
            return;

        case "":
            break;

        default:
            Console.WriteLine("Unknown command.");
            break;
    }
}

string? Ask(string label)
{
    Console.Write(label);
    return Console.ReadLine()?.Trim();
}

void Print(Contact c)
{
    string added = c.Added.ToString("yyyy-MM-dd",
        CultureInfo.InvariantCulture);
    Console.WriteLine(
        $"{c.Name,-16} {c.Phone,-11} {c.Email,-17} added {added}");
}

List<Contact> Load()
{
    if (!File.Exists(FilePath)) return new List<Contact>();
    try
    {
        string json = File.ReadAllText(FilePath);
        return JsonSerializer.Deserialize<List<Contact>>(json, options)
               ?? new List<Contact>();
    }
    catch (JsonException)
    {
        Console.WriteLine("Warning: contacts.json is damaged. "
            + "Starting with an empty list.");
        return new List<Contact>();
    }
    catch (IOException ex)
    {
        Console.WriteLine($"Warning: could not read file: {ex.Message}");
        return new List<Contact>();
    }
}

void Save()
{
    try
    {
        string json = JsonSerializer.Serialize(contacts, options);
        File.WriteAllText(FilePath, json);
    }
    catch (IOException ex)
    {
        Console.WriteLine($"Could not save: {ex.Message}");
    }
}

record Contact(string Name, string Phone, string Email, DateOnly Added);`,
    stretch: [
      "Add an edit command that changes the phone or email of an existing contact (records make this easy with a with-expression).",
      "Write to a temporary file first and then replace contacts.json with File.Move(temp, path, overwrite: true), so a crash during saving can never corrupt the data.",
      "Add export and import commands that write and read the contacts as CSV, quoting fields correctly.",
      "Reject a second contact with the same email address, ignoring case."
    ]
  }
});
