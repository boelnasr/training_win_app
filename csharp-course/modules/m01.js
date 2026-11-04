(function () {
const R = String.raw;

(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m01",
  number: 1,
  title: "Hello, C#",
  tagline: "Set up your tools, write your first program, and learn to read what the computer tells you.",
  level: "Beginner",
  lessons: [
    // ------------------------------------------------------------------
    {
      id: "m01-l01",
      title: "What C# and .NET are",
      minutes: 14,
      objectives: [
        "Explain what a programming language and a compiler do",
        "Follow the path from a .cs file to code the CPU runs (C# to IL to machine code)",
        "Tell apart C#, .NET, the CLR, the SDK and the runtime"
      ],
      blocks: [
        { type: "text", html: R`<p>A <strong>program</strong> is a list of instructions for a computer. The processor inside your computer (the CPU) only understands <em>machine code</em>: long rows of numbers that are very hard for people to read or write.</p><p>So we write programs in a <strong>programming language</strong> that people can read, and a tool translates it for the machine. <strong>C#</strong> (say "C sharp") is one of those languages. Microsoft created it in 2000, and today it is open source and runs on Windows, macOS and Linux.</p><p>Here is a complete C# program. It is one line long. When it runs, it shows a message in the console (the text window, also called the terminal).</p>` },
        { type: "code", title: "Program.cs", code: R`Console.WriteLine("Hello, World!");`, output: "Hello, World!" },
        { type: "text", html: R`<p>You will learn exactly what each part of that line means in lesson 3. For now, notice three things:</p><ul><li><code>Console</code> is the console window.</li><li><code>WriteLine</code> means "write this text, then move to a new line".</li><li>The text to show sits inside double quotes, and the line ends with a semicolon <code>;</code>.</li></ul><p>People use C# to build Windows desktop apps, web sites and web APIs, cloud services, mobile apps, and games (the Unity game engine uses C#). The language you learn in this course is the same in all of those places.</p><p>So how does that one line become something the CPU can run? It happens in two translation steps.</p>` },
        { type: "steps", items: [
          R`<strong>You write C# code</strong> in text files that end in <code>.cs</code>, such as <code>Program.cs</code>.`,
          R`<strong>The C# compiler</strong> (its name is Roslyn) checks your code for mistakes. If it finds none, it translates the code into <strong>IL</strong> (Intermediate Language) and saves it in a <code>.dll</code> file.`,
          R`<strong>The CLR</strong> (Common Language Runtime) starts when you run the program. It loads the <code>.dll</code> file.`,
          R`<strong>The JIT compiler</strong> (Just-In-Time) inside the CLR turns the IL into real machine code for your exact CPU, a moment before each part of the program is needed.`,
          R`<strong>The CPU runs the machine code</strong>, and you see <code>Hello, World!</code> on the screen.`
        ] },
        { type: "callout", tone: "deep", title: "Why two steps instead of one?", html: R`<p>IL is the same on every computer. One <code>.dll</code> file can run on Windows, Linux or a Mac, on Intel or ARM processors. The JIT does the last step on the machine that actually runs the program, so it can use the special features of that exact CPU.</p><p>The JIT is also clever about time. It compiles code quickly first, then recompiles the parts that run very often with heavier optimizations. This is called <em>tiered compilation</em>. If you ever need a program that starts instantly with no JIT, .NET also offers <em>Native AOT</em> (ahead-of-time) publishing. You will not need it in this course.</p>` },
        { type: "text", html: R`<p>C# code is called <strong>managed code</strong>, because the CLR manages it while it runs. The most important job is memory. When your program stops using a piece of data, the <strong>garbage collector</strong> frees that memory for you. The CLR also checks things like "is this position really inside the list?" so a mistake causes a clear error message instead of silently damaging memory. In older languages such as C, the programmer has to do all of this by hand, and small slips cause crashes and security holes.</p>` },
        { type: "table", headers: ["Word", "What it means"], rows: [
          [R`<strong>C#</strong>`, "The programming language: the words and rules you type."],
          [R`<strong>.NET</strong>`, "The whole platform: the runtime, the tools, and a big library of ready-made code."],
          [R`<strong>CLR</strong>`, "The runtime engine that loads and runs your program and manages its memory."],
          [R`<strong>IL</strong>`, R`Intermediate Language. What the C# compiler produces, stored in <code>.dll</code> files.`],
          [R`<strong>JIT</strong>`, "The part of the CLR that turns IL into machine code while the program runs."],
          [R`<strong>BCL</strong>`, R`Base Class Library. Ready-made code that comes with .NET, such as <code>Console</code>, math, files and dates.`],
          [R`<strong>Runtime</strong>`, "What a computer needs to RUN .NET programs. Users of your app need this."],
          [R`<strong>SDK</strong>`, "Software Development Kit: the runtime plus the compiler and the dotnet tool. Programmers need this."]
        ] },
        { type: "callout", tone: "note", title: ".NET Framework vs .NET", html: R`<p>You will see two similar names online. <strong>.NET Framework</strong> (last version 4.8) is the old, Windows-only version from 2002. <strong>.NET</strong> (versions 5, 6, 7, 8 and later) is the modern, cross-platform version. This course uses <strong>.NET 8</strong> with <strong>C# 12</strong>. .NET 8 is a Long Term Support (LTS) release, which is what most companies run in production. When you search for help, prefer answers that mention .NET 6 or newer.</p>` },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p>Python also compiles your code to bytecode (the <code>.pyc</code> files) and then an interpreter runs that bytecode. C# has the same idea with IL, with two big differences. First, the JIT turns IL into real machine code, which is a big reason C# programs often run many times faster than the same Python code. Second, the C# compiler checks your whole program <em>before</em> it runs. A typo in a name that Python would only notice when that line runs is caught by C# at build time.</p>` }
      ],
      exercises: [
        { type: "mcq", prompt: R`What does the C# compiler produce when it compiles your <code>.cs</code> files?`, options: ["Machine code for your CPU", "IL (Intermediate Language) stored in a .dll file", "A Python script", "Nothing; C# code runs directly from the .cs file"], answer: 1, explain: R`<p>The C# compiler produces <strong>IL</strong>. Machine code is made later, by the JIT, while the program runs. C# never runs straight from the <code>.cs</code> text file: the compiler always checks and translates it first.</p>` },
        { type: "order", prompt: "Put the journey of a C# program in the correct order.", lines: [
          "You write code in Program.cs",
          "The C# compiler checks it and produces IL in a .dll",
          "The CLR loads the .dll when you run the program",
          "The JIT turns the IL into machine code",
          "The CPU runs the machine code"
        ], explain: R`<p>Source code, then IL (compile time), then machine code (run time). The JIT can only work once the CLR has loaded the program, so it comes after the CLR step.</p>` },
        { type: "output", prompt: "What does this program print?", code: R`Console.WriteLine("C# is compiled to IL.");
Console.WriteLine("The JIT makes machine code.");`, answer: "C# is compiled to IL.\nThe JIT makes machine code.", explain: R`<p>Each <code>WriteLine</code> prints its text and then moves to a new line, so you get two lines. The statements run from top to bottom. The quotes are not printed: they only mark where the text starts and ends.</p>` },
        { type: "fill", prompt: R`Complete the program so it shows <code>I am learning C#</code> and then moves to a new line.`, code: R`Console.___("I am learning C#");`, blanks: [["WriteLine"]], explain: R`<p><code>WriteLine</code> writes the text and then a line break. C# is case-sensitive, so <code>writeline</code> or <code>Writeline</code> would not compile.</p>` },
        { type: "mcq", prompt: "Your friend wants to run a program you built, but will never write code. What must be installed on their computer?", options: ["The .NET SDK", "The .NET runtime", "Visual Studio", "The C# compiler only"], answer: 1, explain: R`<p>To <em>run</em> a .NET program you need the <strong>runtime</strong> (the CLR and the libraries). The SDK adds the compiler and developer tools, which your friend does not need. Visual Studio is an editor for programmers. (Later you will also learn to publish "self-contained" apps that carry the runtime with them.)</p>` }
      ],
      takeaways: [
        "C# is the language; .NET is the platform that compiles and runs it.",
        "Your code goes C# to IL (compile time), then IL to machine code by the JIT (run time).",
        "The CLR manages memory for you with a garbage collector, so C# is called managed code.",
        "Programmers install the SDK. People who only run apps need the runtime."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m01-l02",
      title: "Your first project",
      minutes: 16,
      objectives: [
        "Install the .NET 8 SDK and check that it works",
        "Create, build and run a console app with the dotnet CLI",
        "Read a .csproj file and know what bin and obj are for"
      ],
      blocks: [
        { type: "text", html: R`<p>Time to set up your computer. You need one thing: the <strong>.NET 8 SDK</strong>. It is free. It includes the compiler and a command-line tool called <code>dotnet</code> that creates, builds and runs projects.</p><p>You can write code in any editor, because the SDK does the real work. Popular choices are <strong>Visual Studio Code</strong> with the "C# Dev Kit" extension (free, all systems), <strong>Visual Studio 2022</strong> (Windows, free Community edition) and <strong>JetBrains Rider</strong> (all systems). They all call the same <code>dotnet</code> tools you are about to use. Learning the command line first means you will understand what the buttons in those editors do.</p>` },
        { type: "steps", items: [
          R`Go to <code>https://dotnet.microsoft.com/download</code> and download the <strong>.NET 8 SDK</strong> for your system. On Windows you can also open a terminal and run <code>winget install Microsoft.DotNet.SDK.8</code>.`,
          R`Run the installer and accept the defaults.`,
          R`Open a <strong>new</strong> terminal window. On Windows, use "Terminal" or "PowerShell". On macOS, use "Terminal". A new window is needed so it sees the freshly installed tool.`,
          R`Type <code>dotnet --version</code> and press Enter. You should see a version number that starts with <code>8.</code>, for example <code>8.0.400</code>.`,
          R`If you see "command not found" or "'dotnet' is not recognized", close every terminal and open a new one. If it still fails, restart the computer so the PATH setting is reloaded.`
        ] },
        { type: "text", html: R`<p>Now create your first project. A <strong>project</strong> is a folder with your code files plus one settings file. These commands make a project called <code>HelloApp</code>, move into its folder, and run it:</p>` },
        { type: "code", title: "Terminal", code: R`dotnet new console -o HelloApp
cd HelloApp
dotnet run` },
        { type: "text", html: R`<p><code>dotnet new console</code> uses the "console" template. <code>-o HelloApp</code> means "output into a new folder called HelloApp", and the project takes the folder's name. After <code>dotnet run</code> you should see <code>Hello, World!</code>. The template wrote this <code>Program.cs</code> for you:</p>` },
        { type: "code", title: "Program.cs", code: R`// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");`, output: "Hello, World!" },
        { type: "text", html: R`<p>The first line starts with <code>//</code>, which makes it a <strong>comment</strong>: a note for humans that the compiler ignores. The folder also holds a file called <code>HelloApp.csproj</code>. This is the <strong>project file</strong>. It tells the build tools what kind of program this is.</p>` },
        { type: "code", title: "HelloApp.csproj", code: R`<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>

</Project>` },
        { type: "table", headers: ["Setting", "What it does"], rows: [
          [R`<code>OutputType</code> Exe`, "Build a program you can start (an executable), not a library for other programs."],
          [R`<code>TargetFramework</code> net8.0`, "Build for .NET 8. This decides which runtime and library features you can use."],
          [R`<code>ImplicitUsings</code> enable`, R`Automatically import common namespaces, so you can write <code>Console</code> without extra lines. Lesson 3 explains this.`],
          [R`<code>Nullable</code> enable`, R`Turn on warnings that help you avoid "null" mistakes. You will meet this in lesson 4.`]
        ] },
        { type: "table", headers: ["Command", "What it does"], rows: [
          [R`<code>dotnet new console -o Name</code>`, "Create a new console project in a new folder."],
          [R`<code>dotnet new list</code>`, "Show all project templates (console, classlib, webapi, xunit and more)."],
          [R`<code>dotnet build</code>`, R`Compile the project. Reports errors and warnings. Output goes to <code>bin/</code>.`],
          [R`<code>dotnet run</code>`, "Build (only if something changed), then run the program."],
          [R`<code>dotnet watch</code>`, "Run the program and rebuild and restart it every time you save a file."],
          [R`<code>dotnet clean</code>`, "Delete the build output, for a fresh start."]
        ] },
        { type: "text", html: R`<p>After a build you will see two new folders. <code>obj/</code> holds temporary files the build uses. <code>bin/Debug/net8.0/</code> holds the result: <code>HelloApp.dll</code> (your IL code) and, on Windows, a small <code>HelloApp.exe</code> launcher that starts the runtime and loads the <code>.dll</code>. You never edit files in <code>bin</code> or <code>obj</code>. You can delete both at any time; the next build recreates them. That is also why professionals never commit them to source control.</p>` },
        { type: "callout", tone: "warning", title: "Run commands in the right folder", html: R`<p><code>dotnet run</code> and <code>dotnet build</code> look for a <code>.csproj</code> file in the current folder. If you are in the wrong folder you get:</p><p><code>error MSB1003: Specify a project or solution file. The current working directory does not contain a project or solution file.</code></p><p>Fix it with <code>cd HelloApp</code>, or point at the project: <code>dotnet run --project HelloApp</code>. Also avoid creating a new project <em>inside</em> another project's folder. The outer project will try to compile the inner one's files too, and you get confusing duplicate errors.</p>` },
      ],
      exercises: [
        { type: "order", prompt: "Put these terminal commands in the order you would type them to create and run a new app called Greeter.", lines: [
          "dotnet --version",
          "dotnet new console -o Greeter",
          "cd Greeter",
          "dotnet run"
        ], explain: R`<p>First confirm the SDK works. Then create the project, move into its folder (where the <code>.csproj</code> lives), and run it. Running <code>dotnet run</code> before <code>cd Greeter</code> gives error MSB1003 because there is no project file in the current folder.</p>` },
        { type: "fill", prompt: R`Complete the commands: create a console project called <code>Greeter</code>, then run it from inside its folder.`, code: R`dotnet ___ console -o Greeter
cd Greeter
dotnet ___`, blanks: [["new"], ["run", "watch"]], explain: R`<p><code>dotnet new</code> creates projects from templates. <code>dotnet run</code> builds and runs. (<code>dotnet watch</code> also works: it runs and restarts on every save.) <code>dotnet build</code> alone would compile but not start the program.</p>` },
        { type: "output", prompt: R`You replace the code in <code>Program.cs</code> with this and type <code>dotnet run</code>. What appears?`, code: R`// My first change
Console.WriteLine("Hello from Greeter!");
Console.WriteLine("Build, then run.");`, answer: "Hello from Greeter!\nBuild, then run.", explain: R`<p>The comment line is ignored by the compiler, so it prints nothing. The two <code>WriteLine</code> calls each print one line. <code>dotnet run</code> notices the file changed, rebuilds, then runs.</p>` },
        { type: "mcq", prompt: R`Which file tells the build tools that your project targets .NET 8?`, options: ["Program.cs", "HelloApp.csproj", "bin/Debug/net8.0/HelloApp.dll", "obj/project.assets.json"], answer: 1, explain: R`<p>The <code>.csproj</code> project file holds settings like <code>&lt;TargetFramework&gt;net8.0&lt;/TargetFramework&gt;</code>. <code>Program.cs</code> holds your code. The files in <code>bin</code> and <code>obj</code> are generated by the build, and are overwritten every time.</p>` },
        { type: "mcq", prompt: R`A teammate's project folder contains <code>bin</code> and <code>obj</code> folders that take 80 MB. What is true?`, options: ["They contain the source code and must be backed up", "They are build output and can be deleted; the next build recreates them", "Deleting them breaks the project forever", "They hold the .NET SDK"], answer: 1, explain: R`<p><code>bin</code> and <code>obj</code> are generated by <code>dotnet build</code>. The real source is your <code>.cs</code> files and the <code>.csproj</code>. The SDK is installed separately on the computer, not inside your project.</p>` }
      ],
      takeaways: [
        "Install the .NET 8 SDK and check it with dotnet --version.",
        "dotnet new console -o Name creates a project; dotnet run builds and runs it.",
        "The .csproj file holds project settings such as the target framework.",
        "bin and obj are build output: never edit them, and do not commit them."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m01-l03",
      title: "Anatomy of Program.cs",
      minutes: 18,
      objectives: [
        "Recognize statements, blocks and comments",
        "Compare top-level statements with the classic Main method",
        "Explain namespaces, using directives and implicit usings"
      ],
      blocks: [
        { type: "text", html: R`<p>A C# program is made of <strong>statements</strong>. A statement is one instruction, like "print this line". Each statement ends with a semicolon <code>;</code>. The program runs the statements one after another, from the top of the file to the bottom.</p>` },
        { type: "code", title: "Program.cs", code: R`Console.WriteLine("Step 1: wake up");
Console.WriteLine("Step 2: make coffee");
Console.WriteLine("Step 3: write code");`, output: "Step 1: wake up\nStep 2: make coffee\nStep 3: write code" },
        { type: "text", html: R`<p>Let us take apart one statement: <code>Console.WriteLine("Step 1: wake up");</code></p><ul><li><code>Console</code> is a <strong>class</strong>: a named group of related code. This one is all about the console window.</li><li>The dot <code>.</code> means "look inside". <code>Console.WriteLine</code> is the <code>WriteLine</code> that belongs to <code>Console</code>.</li><li><code>WriteLine</code> is a <strong>method</strong>: a named action you can run. Running it is called <em>calling</em> it.</li><li>The parentheses <code>( )</code> hold the input you give the method. Here it is a piece of text, called a <strong>string</strong>, written between double quotes.</li><li>The semicolon ends the statement.</li></ul><p>C# does not care about spaces, tabs or line breaks between the parts of a statement. You could split one statement over three lines and it would mean exactly the same thing. Programmers still keep a tidy, consistent style, because code is read far more often than it is written.</p><p>A <strong>block</strong> is a group of statements inside curly braces <code>{ }</code>. Blocks group code that belongs together. Every <code>{</code> needs a matching <code>}</code>. You will use blocks all the time with <code>if</code>, loops and methods.</p><p>The style of <code>Program.cs</code> you have seen so far is called <strong>top-level statements</strong>, added in C# 9. Before that, every program needed a class and a method called <code>Main</code>, the program's entry point. You will still see this classic style in older code, books, and many company projects. Both versions below do the same thing.</p>` },
        { type: "compare", left: { label: "Top-level statements (modern)", code: R`Console.WriteLine("Hello!");` }, right: { label: "Classic Main method", code: R`namespace HelloApp;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello!");
    }
}` } },
        { type: "text", html: R`<p>With top-level statements the compiler writes the class and the <code>Main</code> method for you behind the scenes. In the classic version, read from the inside out:</p><ul><li><code>Main</code> is where the program starts. <code>static void</code> means it belongs to the class itself and gives no value back. Module 4 explains these words in depth.</li><li><code>string[] args</code> holds any extra words typed after the program name on the command line. Top-level programs get a hidden <code>args</code> variable too.</li><li><code>class Program { ... }</code> is the class that contains <code>Main</code>. Its braces form a block.</li><li><code>namespace HelloApp;</code> puts the class into a namespace.</li></ul><p>A project has exactly one starting point. If two <code>.cs</code> files both contain top-level statements, the build fails with <code>error CS8802: Only one compilation unit can have top-level statements.</code> When you add more files later in the course, they will contain classes, not loose statements.</p><p>A <strong>namespace</strong> is a family name for code, like a folder for classes. .NET has thousands of classes, so namespaces keep names from clashing. <code>Console</code> lives in the namespace <code>System</code>, so its full name is <code>System.Console</code>.</p><p>A <code>using</code> directive at the top of a file says "I will use classes from this namespace, so let me write the short name". With <code>using System;</code> you can write <code>Console</code> instead of <code>System.Console</code>.</p>` },
        { type: "code", code: R`using System;

System.Console.WriteLine("Full name works");
Console.WriteLine("Short name works too");
Console.WriteLine(Math.Max(3, 8));`, output: "Full name works\nShort name works too\n8" },
        { type: "callout", tone: "note", title: "Implicit usings: why your file has no using lines", html: R`<p>Your <code>.csproj</code> contains <code>&lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;</code>. That tells the SDK to add common <code>using</code> lines to every file automatically: <code>System</code>, <code>System.IO</code>, <code>System.Linq</code>, <code>System.Collections.Generic</code>, <code>System.Net.Http</code>, <code>System.Threading</code> and <code>System.Threading.Tasks</code>. You can see them in the generated file <code>obj/Debug/net8.0/HelloApp.GlobalUsings.g.cs</code>. So <code>using System;</code> in the example above is allowed but not needed. For any other namespace (for example <code>System.Text</code> or <code>System.Globalization</code>) you still write the <code>using</code> line yourself.</p>` },
        { type: "text", html: R`<p><strong>Comments</strong> are notes for humans. The compiler skips them completely.</p><ul><li><code>//</code> starts a comment that runs to the end of the line.</li><li><code>/*</code> starts a comment that runs until <code>*/</code>, even across many lines.</li><li><code>///</code> starts a documentation comment that describes a method or class. Module 4 covers these.</li></ul><p>Good comments explain <em>why</em> the code does something. The code itself already shows <em>what</em> it does. A handy trick: put <code>//</code> in front of a line to switch it off while you test something. This is called "commenting out".</p>` },
        { type: "code", code: R`// Print a short menu
Console.WriteLine("1. Start");
// Console.WriteLine("2. Settings");  (hidden for now)
/* The quit option
   is always last. */
Console.WriteLine("3. Quit");`, output: "1. Start\n3. Quit" },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p>Python uses indentation to group code. C# uses braces <code>{ }</code>; indentation is only for people. Python ends a statement at the end of the line. C# ends it at the semicolon. Comments use <code>//</code> instead of <code>#</code>. Both languages are case-sensitive: <code>console</code> and <code>Console</code> are different names. A top-level C# file runs from top to bottom like a Python script, which is the main reason C# 9 added top-level statements.</p>` },
      ],
      exercises: [
        { type: "output", prompt: "What does this program print? Watch the comments carefully.", code: R`Console.WriteLine("A");
// Console.WriteLine("B");
/* Console.WriteLine("C"); */ Console.WriteLine("D");
Console.WriteLine("E"); // Console.WriteLine("F");`, answer: "A\nD\nE", explain: R`<p><code>B</code> is commented out by <code>//</code>. On line 3 the <code>/* ... */</code> comment ends before <code>Console.WriteLine("D");</code>, so D still runs. On the last line, E runs and everything after <code>//</code> is ignored, so F never prints.</p>` },
        { type: "order", prompt: "Put the lines of this classic-style program in a valid order.", lines: [
          "namespace Shop;",
          "class Program",
          "{",
          "    static void Main(string[] args)",
          "    {",
          "        Console.WriteLine(\"Shop is open\");",
          "    }"
        ], explain: R`<p>The namespace comes first. Then the class, whose block opens with <code>{</code>. Inside the class sits <code>Main</code>, with its own block. The statement lives inside <code>Main</code>. (The program still needs one final <code>}</code> to close the class.)</p>` },
        { type: "fill", prompt: R`Complete the classic program so it compiles and prints <code>Hi</code>. Use the full name of the console class.`, code: R`class Program
{
    static ___ Main(string[] args)
    {
        System.___.WriteLine("Hi");
    }
}`, blanks: [["void"], ["Console"]], explain: R`<p><code>void</code> means <code>Main</code> returns nothing. <code>System.Console</code> is the full name of the class, made of the namespace <code>System</code> plus the class name <code>Console</code>.</p>` },
        { type: "bug", prompt: "This program does not compile. What is wrong?", code: R`Console.WriteLine("Line one");
Console.WriteLine("Line two")
Console.WriteLine("Line three");`, options: ["WriteLine cannot be used three times", "Line 2 is missing its semicolon; the compiler reports CS1002: ; expected", "The strings need single quotes", "Top-level statements need a Main method"], answer: 1, explain: R`<p>Every statement ends with <code>;</code>. The compiler stops at the end of line 2 and says <code>error CS1002: ; expected</code>. You can call a method as many times as you like. Text strings use double quotes; single quotes are for one character. Top-level statements need no <code>Main</code>.</p>` },
        { type: "mcq", prompt: R`Your project has <code>&lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;</code>. What does that do?`, options: ["Imports every namespace in .NET", "Adds common using directives such as System to every file automatically", "Lets you skip semicolons", "Makes C# ignore uppercase and lowercase differences"], answer: 1, explain: R`<p>Implicit usings add a fixed list of common namespaces (System, System.IO, System.Linq and a few more). Namespaces outside that list, like <code>System.Text</code>, still need a <code>using</code> line. Semicolons and case-sensitivity are not affected.</p>` }
      ],
      takeaways: [
        "Statements end with a semicolon and run from top to bottom.",
        "Blocks group statements inside { }; every { needs a matching }.",
        "Top-level statements are a short form; the compiler generates the classic Main for you.",
        "Namespaces group classes; using lets you write short names; implicit usings add common ones for you.",
        "Use // and /* */ comments to explain why, and to switch lines off while testing."
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m01-l04",
      title: "Console output and input",
      minutes: 20,
      objectives: [
        "Choose between Console.Write and Console.WriteLine",
        "Use escape sequences, verbatim strings and raw strings",
        "Read a line of text from the user and handle the case where there is none"
      ],
      blocks: [
        { type: "text", html: R`<p>You already know <code>Console.WriteLine</code>. Its partner is <code>Console.Write</code>, which prints text <em>without</em> moving to a new line afterwards. The next output continues on the same line. <code>Console.WriteLine()</code> with nothing inside the parentheses prints an empty line, which is handy for spacing out your output.</p>` },
        { type: "code", code: R`Console.Write("Loading");
Console.Write(".");
Console.Write(".");
Console.WriteLine(".");
Console.WriteLine("Done!");
Console.WriteLine();
Console.WriteLine("After an empty line");`, output: "Loading...\nDone!\n\nAfter an empty line" },
        { type: "text", html: R`<p>Some characters are hard to type inside a string. How do you put a double quote inside text that is itself surrounded by double quotes? You use an <strong>escape sequence</strong>: a backslash <code>\</code> followed by a code letter.</p>` },
        { type: "table", headers: ["Escape", "Meaning", "Example"], rows: [
          [R`<code>\n</code>`, "New line", R`<code>"Line 1\nLine 2"</code>`],
          [R`<code>\t</code>`, "Tab (jump to the next column stop)", R`<code>"Name\tAge"</code>`],
          [R`<code>\"</code>`, "A double quote character", R`<code>"She said \"hi\""</code>`],
          [R`<code>\\</code>`, "One backslash", R`<code>"C:\\Temp"</code>`],
          [R`<code>\'</code>`, "A single quote (needed inside a single character)", R`<code>'\''</code>`]
        ] },
        { type: "code", code: R`Console.WriteLine("Line 1\nLine 2");
Console.WriteLine("She said \"hi\" to me.");
Console.WriteLine("Saved to C:\\Temp\\notes.txt");`, output: "Line 1\nLine 2\nShe said \"hi\" to me.\nSaved to C:\\Temp\\notes.txt" },
        { type: "text", html: R`<p>Doubling every backslash gets tiring with Windows paths. A <strong>verbatim string</strong> starts with <code>@</code>. Inside it, backslashes are ordinary characters, and the string can span several lines. To put a double quote inside a verbatim string, write it twice: <code>""</code>.</p><p>C# 11 added <strong>raw string literals</strong>, which start and end with three double quotes <code>"""</code>. Inside them, nothing is special: quotes and backslashes appear exactly as typed. They are perfect for text art, JSON samples and multi-line messages. The closing <code>"""</code> sets the left margin: the spaces in front of it are removed from every line.</p>` },
        { type: "code", code: R`Console.WriteLine(@"C:\Users\Ada\Documents");
Console.WriteLine(@"He said ""ready"".");
Console.WriteLine("""
    +--------+
    | "Raw!" |
    +--------+
    """);`, output: "C:\\Users\\Ada\\Documents\nHe said \"ready\".\n+--------+\n| \"Raw!\" |\n+--------+" },
        { type: "text", html: R`<p>Now let us listen to the user. <code>Console.ReadLine()</code> waits until the user types something and presses Enter, then gives you that text. You store it in a <strong>variable</strong>: a named box that holds a value. Module 2 covers variables in depth. Here is a small program that asks for a name and greets the user:</p>` },
        { type: "code", title: "Program.cs", code: R`Console.Write("What is your name? ");
string? name = Console.ReadLine();

if (string.IsNullOrWhiteSpace(name))
{
    name = "friend";
}

Console.WriteLine($"Nice to meet you, {name}!");` },
        { type: "text", html: R`<p>Line by line:</p><ul><li><code>Console.Write</code> shows the question. Because it is <code>Write</code>, the cursor stays on the same line, right after the question. That looks much nicer than typing on the next line.</li><li><code>string? name = Console.ReadLine();</code> creates a variable called <code>name</code> that holds text (<code>string</code>) and stores whatever the user typed in it. The <code>=</code> means "store into".</li><li><code>string.IsNullOrWhiteSpace(name)</code> is true when <code>name</code> is missing, empty, or only spaces. The <code>if</code> statement runs the block below it only when that is true, so a user who just presses Enter is called "friend". You will learn <code>if</code> properly in Module 3; this pattern is enough for now.</li><li>The last line uses <strong>string interpolation</strong>. A string that starts with <code>$</code> can contain variables inside curly braces, and C# fills in their values. If the user typed <code>Ada</code>, it prints <code>Nice to meet you, Ada!</code>.</li></ul><p>You can also join strings with <code>+</code>: <code>"Nice to meet you, " + name + "!"</code> gives the same text. Interpolation is easier to read, so most C# developers prefer it.</p>` },
        { type: "callout", tone: "note", title: "What is the ? in string? for", html: R`<p><code>ReadLine</code> usually gives back the text the user typed. If the input has <em>ended</em>, it gives back <code>null</code>, which means "no value at all". This happens when the user presses Ctrl+Z then Enter (Windows) or Ctrl+D (macOS/Linux), or when the program's input comes from a file that has run out of lines.</p><p><code>string?</code> means "a string, or possibly null". If you write plain <code>string</code>, the code still runs, but the compiler warns you: <code>warning CS8600: Converting null literal or possible null value to non-nullable type.</code> It is reminding you to plan for the "no input" case. Module 2 covers null fully.</p>` },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p><code>print(x)</code> is <code>Console.WriteLine(x)</code>, and <code>print(x, end="")</code> is <code>Console.Write(x)</code>. Python's <code>input("Name? ")</code> becomes two steps: <code>Console.Write("Name? ")</code> then <code>Console.ReadLine()</code>. Python raises <code>EOFError</code> when input ends; C# returns <code>null</code> instead. C# <code>$"Hi {name}"</code> works like Python's <code>f"Hi {name}"</code>. Verbatim <code>@"..."</code> is close to Python's raw strings <code>r"..."</code>, and raw <code>"""..."""</code> literals are like triple-quoted strings.</p>` }
      ],
      exercises: [
        { type: "output", prompt: "What does this program print?", code: R`Console.Write("Ready");
Console.Write(", set");
Console.WriteLine(", go!");
Console.Write("Run");
Console.WriteLine();
Console.WriteLine("Finish");`, answer: "Ready, set, go!\nRun\nFinish", explain: R`<p><code>Write</code> stays on the same line, so the first three calls build one line, and the <code>WriteLine</code> ends it. <code>Write("Run")</code> starts a new line, and the empty <code>WriteLine()</code> only ends that line. It does not add a blank line here, because "Run" was already on it.</p>` },
        { type: "output", prompt: "What does this program print?", code: R`Console.WriteLine("Path: C:\\games\\save.dat");
Console.WriteLine("Say \"cheese\"");
Console.WriteLine(@"Raw: C:\new");`, answer: "Path: C:\\games\\save.dat\nSay \"cheese\"\nRaw: C:\\new", explain: R`<p><code>\\</code> prints one backslash and <code>\"</code> prints a double quote. In the verbatim string <code>@"..."</code> the backslash is an ordinary character, so <code>\n</code> stays as the two characters backslash and n instead of becoming a new line.</p>` },
        { type: "fill", prompt: R`Complete the program: show the question on the same line as the answer, then read the answer.`, code: R`Console.___("Favorite food? ");
string? food = Console.___();
Console.WriteLine($"Yum, {food}!");`, blanks: [["Write"], ["ReadLine"]], explain: R`<p><code>Write</code> keeps the cursor on the same line as the question. <code>ReadLine</code> waits for the user and returns the typed line (or null if input has ended). <code>WriteLine</code> in the first blank would compile, but the user would type on the next line.</p>` },
        { type: "bug", prompt: R`This program should print <code>C:\new\table.txt</code>. It compiles, but prints something strange. Why?`, code: R`Console.WriteLine("C:\new\table.txt");`, options: ["Console cannot print file paths", R`<code>\n</code> and <code>\t</code> are escape sequences (new line and tab); use <code>@"C:\new\table.txt"</code> or double each backslash`, "The string needs single quotes", "WriteLine should be Write"], answer: 1, explain: R`<p>Inside a normal string, <code>\n</code> becomes a line break and <code>\t</code> becomes a tab, so you get <code>C:</code>, then a new line, then <code>ew</code>, a tab, and <code>able.txt</code>. Make it a verbatim string with <code>@</code>, or write <code>"C:\\new\\table.txt"</code>. This is one of the most common bugs with Windows paths.</p>` },
        { type: "mcq", prompt: R`What does <code>Console.ReadLine()</code> return when there is no more input (for example, the user pressed Ctrl+Z then Enter on Windows)?`, options: ["An empty string \"\"", "null", "The text \"EOF\"", "It crashes the program"], answer: 1, explain: R`<p>It returns <code>null</code>, meaning "no value". An empty string <code>""</code> is different: that is what you get when the user just presses Enter without typing. This is why the variable is declared as <code>string?</code>, and why <code>string.IsNullOrWhiteSpace</code> is so useful: it checks both cases at once.</p>` }
      ],
      takeaways: [
        "Write keeps the cursor on the line; WriteLine moves to the next line.",
        R`Escape sequences like \n, \t, \" and \\ put special characters in strings.`,
        R`Verbatim strings (@"...") treat backslashes as plain text; raw strings (""" ... """) treat everything as plain text.`,
        "ReadLine returns the typed text, or null when input has ended, so store it in a string?.",
        R`String interpolation ($"Hi {name}") is the usual way to build text from values.`
      ]
    },
    // ------------------------------------------------------------------
    {
      id: "m01-l05",
      title: "Errors, warnings and crashes",
      minutes: 18,
      objectives: [
        "Tell compile errors, warnings, runtime exceptions and logic bugs apart",
        "Read a compiler message: file, line, column, code and text",
        "Fix the most common beginner errors such as CS1002, CS0103 and CS0029"
      ],
      blocks: [
        { type: "text", html: R`<p>Every programmer, at every level, sees errors every day. Errors are a normal part of the job. Each one is the computer telling you, as precisely as it can, what it did not understand. Learning to read them calmly is one of the most valuable skills in this course.</p><p>There are four kinds of problems, and each one shows up at a different time. We will go through them in this order.</p>` },
        { type: "table", headers: ["Kind", "When you find out", "What happens"], rows: [
          [R`<strong>Compile error</strong>`, R`At build time (<code>dotnet build</code> or <code>dotnet run</code>)`, "The build fails. No program is produced, so nothing runs at all."],
          [R`<strong>Warning</strong>`, "At build time", "The build succeeds, but the compiler thinks something looks suspicious."],
          [R`<strong>Runtime exception</strong>`, "While the program runs", "The program stops with an error message called an exception (a crash)."],
          [R`<strong>Logic bug</strong>`, "When you check the results", "The program runs fine but gives the wrong answer. The computer cannot spot this for you."]
        ] },
        { type: "code", title: "Program.cs (line 2 is missing its semicolon)", code: R`Console.WriteLine("Welcome");
Console.WriteLine("Total: 3")
Console.WriteLine("Bye");

// dotnet build reports:
// Program.cs(2,30): error CS1002: ; expected` },
        { type: "text", html: R`<p>Read the message from left to right:</p><ul><li><code>Program.cs</code>: the file with the problem.</li><li><code>(2,30)</code>: line 2, column 30. Column means "characters from the left". Your editor shows both numbers at the bottom of the window.</li><li><code>error</code>: how serious it is (an error stops the build; a <code>warning</code> does not).</li><li><code>CS1002</code>: the error code. Every compiler message has one. Search for it (for example "CS1002") to find Microsoft's official page with examples and fixes.</li><li><code>; expected</code>: the description, in plain words.</li></ul>` },
        { type: "table", headers: ["Code", "Message", "Usual cause"], rows: [
          ["CS1002", R`<code>; expected</code>`, "A statement is missing its semicolon. Often the real problem is at the end of the line before the one reported."],
          ["CS0103", R`<code>The name 'console' does not exist in the current context</code>`, R`A typo, or wrong upper/lower case. C# sees <code>console</code> and <code>Console</code> as different names.`],
          ["CS0117", R`<code>'Console' does not contain a definition for 'Writeline'</code>`, R`The class exists, but the method name is wrong. It should be <code>WriteLine</code>.`],
          ["CS1010", R`<code>Newline in constant</code>`, "A string is missing its closing double quote."],
          ["CS1513", R`<code>} expected</code>`, R`A <code>{</code> has no matching <code>}</code>.`],
          ["CS0029", R`<code>Cannot implicitly convert type 'string' to 'int'</code>`, R`You put a value of one type into a variable of another type, like text into a number. Module 2 explains types.`]
        ] },
        { type: "callout", tone: "tip", title: "Fix the first error first", html: R`<p>One small mistake can confuse the compiler about everything after it, so one missing quote can produce three or four errors. A missing closing quote, for example, gives CS1010, CS1026 and CS1002 all on the same line. Always fix the <strong>first</strong> error in the list, rebuild, and look again. Often the others disappear too. And when an error points at a line that looks fine, check the line just above it.</p>` },
        { type: "text", html: R`<p><strong>Warnings</strong> mean "this compiles, but are you sure?". The program still runs. For example, a variable you created but never used gives <code>warning CS0168: The variable 'total' is declared but never used</code>, and storing <code>ReadLine()</code> in a plain <code>string</code> gives <code>warning CS8600</code>. Many warnings point at real bugs, so read them. Professional teams often add <code>&lt;TreatWarningsAsErrors&gt;true&lt;/TreatWarningsAsErrors&gt;</code> to the <code>.csproj</code> so no warning can be ignored.</p><p>A <strong>runtime exception</strong> happens when the code is valid C#, but something goes wrong while it runs. Here, <code>int.Parse</code> turns text into a whole number. Module 2 covers it. The text <code>"abc"</code> is not a number, and the compiler cannot know that ahead of time:</p>` },
        { type: "code", title: "Program.cs", code: R`Console.WriteLine("Start");
int number = int.Parse("abc");
Console.WriteLine(number);` },
        { type: "code", title: "Terminal", code: R`Start
Unhandled exception. System.FormatException: The input string 'abc'
was not in a correct format.
   at System.Number.ThrowFormatException[TChar](ReadOnlySpan...)
   at System.Int32.Parse(String s)
   at Program.<Main>$(String[] args) in C:\Code\Demo\Program.cs:line 2` },
        { type: "text", html: R`<p>Notice that <code>Start</code> was printed. The program really ran until line 2. The message tells you the exception type (<code>System.FormatException</code>) and a description. The lines starting with <code>at</code> are the <strong>stack trace</strong>: the path the program took to reach the crash, newest first. The top lines are inside .NET itself. Look for the first line that mentions <em>your</em> file: <code>Program.cs:line 2</code>. (<code>&lt;Main&gt;$</code> is the name the compiler gave to the hidden Main method of your top-level statements.) Module 8 teaches you to catch exceptions so they do not crash the program.</p><p>The last kind is the sneakiest. A <strong>logic bug</strong> compiles and runs without any message, but the answer is wrong. This program tries to compute the average of 7 and 8. The first line prints 11, because division happens before addition (just like in math class), so it computes <code>7 + 4</code>. The second line uses parentheses and a decimal number to get the correct 7.5. Module 2 explains both of these rules. The lesson for now: always check your program's output against an answer you worked out by hand.</p>` },
        { type: "code", code: R`Console.WriteLine(7 + 8 / 2);
Console.WriteLine((7 + 8) / 2.0);`, output: "11\n7.5" },
        { type: "callout", tone: "python", title: "Coming from Python?", html: R`<p>In Python, a misspelled name like <code>pritn("hi")</code> only fails with a <code>NameError</code> when that line actually runs. That might be weeks later, in a branch you rarely test. In C#, misspelled names and mismatched types are compile errors, so the program never starts until they are fixed. That feels strict at first. In large projects it saves a lot of time.</p>` }
      ],
      exercises: [
        { type: "mcq", prompt: R`Your program compiles. When it runs, it prints two lines and then shows <code>Unhandled exception. System.FormatException</code>. What kind of problem is this?`, options: ["Compile error", "Warning", "Runtime exception", "Logic bug"], answer: 2, explain: R`<p>It compiled and started running, so it is not a compile error. Warnings never stop a program. A logic bug gives a wrong answer silently, without any message. A message starting with "Unhandled exception" while the program runs is a <strong>runtime exception</strong>.</p>` },
        { type: "bug", prompt: R`The build fails with <code>Program.cs(1,1): error CS0103: The name 'console' does not exist in the current context</code>. What is the fix?`, code: R`console.WriteLine("Hello");`, options: ["Add a semicolon at the end", R`Write <code>Console</code> with a capital C, because C# is case-sensitive`, R`Add <code>using console;</code> at the top`, "Install the .NET runtime"], answer: 1, explain: R`<p>C# treats <code>console</code> and <code>Console</code> as two different names, and only <code>Console</code> exists. The semicolon is already there. There is no namespace called <code>console</code> to import. Missing tools would give a different error, not CS0103.</p>` },
        { type: "bug", prompt: "This program fails to build with three errors, the first one being CS1010: Newline in constant. What single fix solves all three?", code: R`Console.WriteLine("Score:);
Console.WriteLine("Done");`, options: ["Add a semicolon at the end of line 2", R`Add the missing closing double quote after <code>Score:</code>`, R`Change <code>WriteLine</code> to <code>Write</code>`, "Delete line 2"], answer: 1, explain: R`<p>Without a closing quote, the string runs to the end of the line (CS1010). The compiler then cannot find the <code>)</code> or the <code>;</code> either, so it reports CS1026 and CS1002 too. Fixing the first error makes the others disappear. That is why you always start with the first message.</p>` },
        { type: "fill", prompt: R`The build fails with <code>error CS0103: The name 'mesage' does not exist in the current context</code>. Fix the second line.`, code: R`string message = "Keep going!";
Console.WriteLine(___);`, blanks: [["message"]], explain: R`<p>The variable is called <code>message</code> (two s's). Names must match exactly, letter for letter and case for case. Writing <code>"message"</code> in quotes would compile, but it would print the word message instead of the variable's value.</p>` },
        { type: "output", prompt: "This program has a logic bug. What does it actually print?", code: R`Console.WriteLine("Average of 10 and 20:");
Console.WriteLine(10 + 20 / 2);`, answer: "Average of 10 and 20:\n20", explain: R`<p>Division happens before addition, so it computes <code>10 + (20 / 2)</code> = <code>10 + 10</code> = 20. The correct average is 15, written as <code>(10 + 20) / 2</code>. No error message appears, which is exactly what makes logic bugs dangerous.</p>` }
      ],
      takeaways: [
        "Compile errors stop the build; warnings do not; exceptions crash a running program; logic bugs give wrong answers silently.",
        "A compiler message gives file, (line,column), severity, code and description. Search the code (like CS1002) for help.",
        "Fix the first error first, and check the line above the one reported.",
        "In a stack trace, look for the first line that mentions your own file and line number.",
        "Always compare your program's output with an answer you worked out yourself."
      ]
    }
  ],
  // --------------------------------------------------------------------
  milestone: {
    id: "m01-project",
    title: "Business Card Printer",
    brief: R`<p>A small print shop wants a console tool for its front desk. A customer answers a few questions, and the program prints a neat business card inside a box made of text characters.</p><p>You will use everything from this module: <code>Write</code> and <code>WriteLine</code>, reading input with <code>ReadLine</code>, handling empty or missing answers, escape sequences, a raw string literal for the banner, and string interpolation.</p><p>One new tool helps you line up the right edge of the box: <code>PadRight</code>. <code>"Ada".PadRight(6)</code> gives <code>"Ada   "</code>, the text plus spaces up to 6 characters in total. So every line inside the box can have exactly the same width.</p>`,
    skills: ["Console.Write / WriteLine", "Console.ReadLine and string?", "string.IsNullOrWhiteSpace", "escape sequences", "raw string literals", "string interpolation", "PadRight"],
    requirements: [
      "Print a banner at the start using a raw string literal (\"\"\" ... \"\"\").",
      "Ask for name, job title, company, email and a short motto. Each question uses Console.Write so the answer is typed on the same line.",
      "Store each answer in a string? variable.",
      "If an answer is empty, only spaces, or missing (null), use a sensible default such as \"Your Name\" or \"(no email)\".",
      "Print the card inside a box exactly 40 characters wide: + and - for the top and bottom, | for the sides.",
      "Every line inside the box is padded with PadRight so the right-hand | lines up.",
      "Show the name in uppercase (use .ToUpper()) and the motto inside double quotes (use \\\").",
      "Leave one empty line inside the box between the name/title block and the contact block, and print a goodbye message at the end.",
      "The program must not crash when input ends early (all answers null)."
    ],
    sampleRun: R`  ___             _
 / __|__ _ _ _ __| |
| (__/ _' | '_/ _' |
 \___\__,_|_| \__,_|  Printer v1

Full name: Ada Lovelace
Job title: Analyst
Company: Engine Works Ltd
Email: ada@engine.works
Motto: Imagination is key

+--------------------------------------+
| ADA LOVELACE                         |
| Analyst                              |
| Engine Works Ltd                     |
|                                      |
| Email: ada@engine.works              |
| "Imagination is key"                 |
+--------------------------------------+

Your card is ready. Thank you!`,
    starter: R`// Business Card Printer
// Run with: dotnet run

// TODO 1: Print a banner using a raw string literal ("""...""").
Console.WriteLine("Card Printer v1");
Console.WriteLine();

// TODO 2: Ask for the remaining answers the same way.
Console.Write("Full name: ");
string? name = Console.ReadLine();

// TODO 3: Replace missing or blank answers with defaults.
if (string.IsNullOrWhiteSpace(name))
{
    name = "Your Name";
}

// The box is 40 characters wide:
// "| " (2) + 36 characters of text + " |" (2)
string border = "+--------------------------------------+";

Console.WriteLine();
Console.WriteLine(border);
// TODO 4: Print the name in uppercase, padded to 36 characters.
Console.WriteLine("| " + name.PadRight(36) + " |");
// TODO 5: Print title, company, an empty line, email and motto.
Console.WriteLine(border);

// TODO 6: Print a goodbye message.`,
    hints: [
      R`<p>Copy the pattern you already have for <code>name</code>: <code>Console.Write</code> for the question, then <code>string? title = Console.ReadLine();</code>, then an <code>if</code> block for the default.</p>`,
      R`<p>Every line inside the box has the same shape: <code>"| " + text.PadRight(36) + " |"</code>. For the empty line, pad an empty string: <code>"".PadRight(36)</code>.</p>`,
      R`<p>Build the text first, then pad it. For the email line that is <code>("Email: " + email).PadRight(36)</code>. The parentheses make sure the whole text is padded, not just the email part. For uppercase, use <code>name.ToUpper()</code>.</p>`,
      R`<p>To put quotes around the motto, use the escape <code>\"</code>: <code>"\"" + motto + "\""</code>. Inside an interpolated string that is <code>$"\"{motto}\""</code>.</p>`,
      R`<p>For the banner, a raw string literal keeps every backslash and quote exactly as typed. Put the closing <code>"""</code> on its own line, indented the same as the text, so the indentation is removed.</p>`
    ],
    solution: R`// Business Card Printer
// Asks a few questions and prints a boxed business card.

Console.WriteLine("""
      ___             _
     / __|__ _ _ _ __| |
    | (__/ _' | '_/ _' |
     \___\__,_|_| \__,_|  Printer v1
    """);
Console.WriteLine();

// ---- Ask the questions ----
Console.Write("Full name: ");
string? name = Console.ReadLine();

Console.Write("Job title: ");
string? title = Console.ReadLine();

Console.Write("Company: ");
string? company = Console.ReadLine();

Console.Write("Email: ");
string? email = Console.ReadLine();

Console.Write("Motto: ");
string? motto = Console.ReadLine();

// ---- Defaults for blank or missing answers ----
if (string.IsNullOrWhiteSpace(name))
{
    name = "Your Name";
}
if (string.IsNullOrWhiteSpace(title))
{
    title = "Professional";
}
if (string.IsNullOrWhiteSpace(company))
{
    company = "Independent";
}
if (string.IsNullOrWhiteSpace(email))
{
    email = "(no email)";
}
if (string.IsNullOrWhiteSpace(motto))
{
    motto = "Always learning";
}

// ---- Build the lines that go inside the box ----
// The box is 40 wide: "| " + 36 characters + " |"
string border = "+--------------------------------------+";
string nameLine = name.ToUpper();
string emailLine = "Email: " + email;
string mottoLine = $"\"{motto}\"";

// ---- Print the card ----
Console.WriteLine();
Console.WriteLine(border);
Console.WriteLine("| " + nameLine.PadRight(36) + " |");
Console.WriteLine("| " + title.PadRight(36) + " |");
Console.WriteLine("| " + company.PadRight(36) + " |");
Console.WriteLine("| " + "".PadRight(36) + " |");
Console.WriteLine("| " + emailLine.PadRight(36) + " |");
Console.WriteLine("| " + mottoLine.PadRight(36) + " |");
Console.WriteLine(border);
Console.WriteLine();
Console.WriteLine("Your card is ready. Thank you!");`,
    stretch: [
      "Ask for a phone number too, and print it on its own line under the email.",
      R`Text longer than 36 characters breaks the box. Cut long values down with <code>text.Substring(0, 33) + "..."</code> when <code>text.Length &gt; 36</code>.`,
      "Center the name inside the box instead of aligning it left. Work out how many spaces go on the left with (36 - name.Length) / 2.",
      R`Draw the box with Unicode line characters such as <code>┌ ─ ┐ │ └ ┘</code>. You may need <code>Console.OutputEncoding = System.Text.Encoding.UTF8;</code> on Windows.`
    ]
  }
});
})();
