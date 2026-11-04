# C# Zero to Hero — content schema

Each module lives in `csharp-course/modules/mNN.js` (two-digit number) and registers itself:

```js
(window.CSHARP_COURSE = window.CSHARP_COURSE || { modules: [] }).modules.push({
  id: "m03",                 // matches file name
  number: 3,
  title: "Making Decisions",  // short, 1-4 words
  tagline: "if, switch and loops: teach your program to choose and repeat.",
  level: "Beginner",         // "Beginner" | "Intermediate" | "Advanced"
  lessons: [ /* Lesson */ ],
  milestone: { /* Milestone */ }
});
```

## Lesson

```js
{
  id: "m03-l02",             // module id + "-l" + two digits
  title: "The switch expression",
  minutes: 12,               // honest reading + exercise time
  objectives: ["Write a switch expression", "..."],   // 2-4 items
  blocks: [ /* Block */ ],   // the teaching content, 5-12 blocks
  exercises: [ /* Exercise */ ],   // 3-5 per lesson, mixed types
  takeaways: ["...", "..."]  // 3-5 one-line summary bullets
}
```

### Blocks

| type | fields | notes |
|---|---|---|
| `text` | `html` | Small HTML only: `<p> <strong> <em> <code> <ul> <ol> <li> <br>`. Always wrap paragraphs in `<p>`. Escape `<` in prose as `&lt;` (e.g. `List&lt;int&gt;`). |
| `code` | `code`, optional `title` (e.g. `"Program.cs"`), optional `output` | `output` = exact console output, verified by running. |
| `callout` | `tone`, `title`, `html` | tone: `"tip"`, `"warning"`, `"note"`, `"python"` (comparison for Python devs), `"deep"` (under-the-hood detail). |
| `compare` | `left: {label, code, lang?}`, `right: {label, code, lang?}` | side-by-side. `lang` is `"csharp"` (default) or `"python"`. |
| `table` | `headers: [..]`, `rows: [[..], ..]` | cells are small HTML strings. |
| `steps` | `items: [html, ..]` | numbered procedure (e.g. CLI steps). |

### Exercises

All exercises have `prompt` (small HTML) and `explain` (small HTML shown after answering).

| type | extra fields | behaviour |
|---|---|---|
| `mcq` | `options: [string..]` (2-5, plain text or `<code>`), `answer: index`, optional `code` | single choice |
| `output` | `code`, `answer` | learner types predicted console output. Compared after trimming each line and trimming trailing blank lines. **Must be verified with `dotnet run`.** |
| `fill` | `code` containing `___` markers, `blanks: [[accepted..], ..]` | one inner array per `___` in order; whitespace-insensitive, case-sensitive match against any accepted string. |
| `order` | `lines: [..]` in the CORRECT order (3-7 lines) | the app shuffles; learner reorders. |
| `bug` | `code`, `options`, `answer` | like mcq but framed "find the bug". |

## Milestone

```js
{
  id: "m03-project",
  title: "Guess the Number",
  brief: "<p>...</p>",                   // the scenario, 1-3 paragraphs
  skills: ["while loops", "Random", "int.TryParse"],
  requirements: ["...", "..."],          // 5-9 concrete, checkable items
  sampleRun: "...",                      // an example console session (text)
  starter: "...",                        // compiling C# skeleton with // TODO comments
  hints: ["...", "..."],                 // 3-5 progressive hints (small HTML)
  solution: "...",                       // complete, compiling, verified solution
  stretch: ["...", "..."]                // 2-4 extra challenges
}
```

## Writing code strings

Write every code string with `String.raw` template literals so backslashes survive:

```js
code: String.raw`Console.WriteLine("Tab:\tdone");`
```

Rules:
- Never use a backtick inside code.
- Never write the two characters `$` followed by `{` (it is JS interpolation even in `String.raw`). C# interpolated strings like `$"Hi {name}"` are fine because `$"` comes before `{`. Avoid raw interpolated strings (`$$"""`) entirely.
- Code targets .NET 8 / C# 12 console apps with top-level statements and implicit usings, unless the lesson is about something else.
- Indent with 4 spaces. Keep lines under ~70 characters so they fit on a phone.
