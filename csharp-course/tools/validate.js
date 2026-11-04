#!/usr/bin/env node
// Validates course module files against csharp-course/SCHEMA.md.
// Usage:
//   node csharp-course/tools/validate.js                 # all modules, structure only
//   node csharp-course/tools/validate.js m03             # one module
//   node csharp-course/tools/validate.js m03 --run       # also compile+run every snippet that declares an output,
//                                                        # and every milestone starter/solution (needs dotnet)
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");
const os = require("os");

const root = path.join(__dirname, "..", "modules");
const args = process.argv.slice(2);
const run = args.includes("--run");
const only = args.filter(a => !a.startsWith("--"));

const files = fs.readdirSync(root).filter(f => /^m\d\d\.js$/.test(f))
  .filter(f => !only.length || only.includes(f.replace(".js", ""))).sort();

let errors = 0, warnings = 0;
const err = (where, msg) => { errors++; console.log(`  ERROR ${where}: ${msg}`); };
const warn = (where, msg) => { warnings++; console.log(`  warn  ${where}: ${msg}`); };

const BLOCKS = ["text", "code", "callout", "compare", "table", "steps"];
const TONES = ["tip", "warning", "note", "python", "deep"];
const EX = ["mcq", "output", "fill", "order", "bug"];
const ALLOWED_TAGS = /^(p|strong|em|code|ul|ol|li|br|b|i|kbd|sup|sub|a)$/;

function checkHtml(where, html) {
  if (typeof html !== "string") return err(where, "html must be a string");
  const tags = html.match(/<\/?([a-zA-Z0-9]+)/g) || [];
  for (const t of tags) {
    const name = t.replace(/[<\/]/g, "").toLowerCase();
    if (!ALLOWED_TAGS.test(name)) err(where, `disallowed tag <${name}> (escape generics as &lt;T&gt;)`);
  }
}
function checkCode(where, code) {
  if (typeof code !== "string" || !code.trim()) return err(where, "code missing");
  if (code.includes("\t")) warn(where, "tab character in code (use 4 spaces)");
  const long = code.split("\n").filter(l => l.length > 78);
  if (long.length) warn(where, `${long.length} line(s) over 78 chars`);
}

const snippets = [];

for (const f of files) {
  console.log(f);
  const ctx = { window: {} };
  try {
    vm.runInNewContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
  } catch (e) { err(f, "does not load: " + e.message); continue; }
  const mods = (ctx.window.CSHARP_COURSE || {}).modules || [];
  if (mods.length !== 1) { err(f, `expected exactly 1 module, got ${mods.length}`); continue; }
  const m = mods[0];
  const mid = f.replace(".js", "");
  if (m.id !== mid) err(mid, `id should be ${mid}`);
  if (m.number !== +mid.slice(1)) err(mid, "number mismatch");
  for (const k of ["title", "tagline", "level"]) if (!m[k]) err(mid, `missing ${k}`);
  if (!["Beginner", "Intermediate", "Advanced"].includes(m.level)) err(mid, "bad level");
  if (!Array.isArray(m.lessons) || m.lessons.length < 3) err(mid, "needs >= 3 lessons");

  (m.lessons || []).forEach((l, li) => {
    const lid = `${mid}-l${String(li + 1).padStart(2, "0")}`;
    if (l.id !== lid) err(lid, `lesson id is ${l.id}, expected ${lid}`);
    if (!l.title) err(lid, "missing title");
    if (!(l.minutes > 0)) err(lid, "missing minutes");
    if (!Array.isArray(l.objectives) || !l.objectives.length) err(lid, "missing objectives");
    if (!Array.isArray(l.takeaways) || !l.takeaways.length) err(lid, "missing takeaways");
    if (!Array.isArray(l.blocks) || l.blocks.length < 4) err(lid, "needs >= 4 blocks");
    (l.blocks || []).forEach((b, bi) => {
      const w = `${lid} block ${bi} (${b.type})`;
      if (!BLOCKS.includes(b.type)) return err(w, "unknown block type");
      if (b.type === "text") checkHtml(w, b.html);
      if (b.type === "code") {
        checkCode(w, b.code);
        if (b.output != null) snippets.push({ where: w, code: b.code, output: b.output });
      }
      if (b.type === "callout") {
        if (!TONES.includes(b.tone)) err(w, "bad tone " + b.tone);
        checkHtml(w, b.html);
      }
      if (b.type === "compare") {
        if (!b.left || !b.right) err(w, "needs left and right");
        else { checkCode(w + " left", b.left.code); checkCode(w + " right", b.right.code); }
      }
      if (b.type === "table") {
        if (!Array.isArray(b.headers) || !Array.isArray(b.rows)) err(w, "headers/rows");
        else b.rows.forEach((r, ri) => { if (r.length !== b.headers.length) err(w, `row ${ri} width`); r.forEach(c => checkHtml(w, String(c))); });
      }
      if (b.type === "steps") (b.items || []).forEach(i => checkHtml(w, i));
    });
    if (!Array.isArray(l.exercises) || l.exercises.length < 3) err(lid, "needs >= 3 exercises");
    (l.exercises || []).forEach((x, xi) => {
      const w = `${lid} ex ${xi} (${x.type})`;
      if (!EX.includes(x.type)) return err(w, "unknown exercise type");
      checkHtml(w + " prompt", x.prompt || "");
      if (!x.prompt) err(w, "missing prompt");
      if (!x.explain) err(w, "missing explain"); else checkHtml(w + " explain", x.explain);
      if (x.type === "mcq" || x.type === "bug") {
        if (!Array.isArray(x.options) || x.options.length < 2) err(w, "options");
        else if (!(Number.isInteger(x.answer) && x.answer >= 0 && x.answer < x.options.length)) err(w, "answer index out of range");
        if (x.type === "bug" && !x.code) err(w, "bug needs code");
      }
      if (x.type === "output") {
        checkCode(w, x.code);
        if (typeof x.answer !== "string") err(w, "answer must be string");
        else snippets.push({ where: w, code: x.code, output: x.answer });
      }
      if (x.type === "fill") {
        const n = (x.code.match(/___/g) || []).length;
        if (!n) err(w, "no ___ blanks");
        if (!Array.isArray(x.blanks) || x.blanks.length !== n) err(w, `blanks length ${x.blanks && x.blanks.length} != ${n} markers`);
        else x.blanks.forEach((b, i) => { if (!Array.isArray(b) || !b.length) err(w, `blank ${i} needs accepted answers`); });
      }
      if (x.type === "order") {
        if (!Array.isArray(x.lines) || x.lines.length < 3) err(w, "needs >= 3 lines");
        else if (new Set(x.lines).size !== x.lines.length) err(w, "duplicate lines make ordering ambiguous");
      }
    });
  });

  const p = m.milestone;
  const pid = `${mid}-project`;
  if (!p) err(mid, "missing milestone");
  else {
    if (p.id !== pid) err(pid, "milestone id");
    for (const k of ["title", "brief", "starter", "solution", "sampleRun"]) if (!p[k]) err(pid, "missing " + k);
    for (const k of ["skills", "requirements", "hints", "stretch"]) if (!Array.isArray(p[k]) || !p[k].length) err(pid, "missing " + k);
    checkHtml(pid + " brief", p.brief || "");
    (p.hints || []).forEach(h => checkHtml(pid + " hint", h));
    checkCode(pid + " starter", p.starter); checkCode(pid + " solution", p.solution);
    if (!p.external) {
      snippets.push({ where: pid + " starter", code: p.starter, output: null });
      snippets.push({ where: pid + " solution", code: p.solution, output: null });
    }
  }
}

const norm = s => s.replace(/\r/g, "").split("\n").map(l => l.trim()).join("\n").replace(/\n+$/, "").trim();

if (run) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "cscourse-"));
  const env = { ...process.env, DOTNET_CLI_TELEMETRY_OPTOUT: "1", DOTNET_NOLOGO: "1" };
  execFileSync("dotnet", ["new", "console", "-o", dir, "--force"], { env, stdio: "ignore" });
  // Allow Program.cs snippets to read stdin without hanging.
  for (const s of snippets) {
    fs.writeFileSync(path.join(dir, "Program.cs"), s.code);
    let out;
    try {
      out = execFileSync("dotnet", ["run", "--project", dir], { env, input: "", timeout: 120000, stdio: ["pipe", "pipe", "pipe"] }).toString();
    } catch (e) {
      const msg = ((e.stdout || "") + (e.stderr || "")).toString().split("\n").filter(l => /error|Unhandled/.test(l)).slice(0, 3).join(" | ");
      if (s.output === null && /Unhandled|exception/i.test(msg) && !/error CS/.test(msg)) { console.log(`  ok    ${s.where} (compiles; threw at runtime with empty stdin)`); continue; }
      err(s.where, "failed to build/run: " + msg);
      continue;
    }
    if (s.output === null) { console.log(`  ok    ${s.where} (compiles)`); continue; }
    if (norm(out) !== norm(s.output)) err(s.where, `output mismatch\n--- expected\n${s.output}\n--- actual\n${out}`);
    else console.log(`  ok    ${s.where}`);
  }
}

console.log(`\n${files.length} module(s), ${snippets.length} runnable snippet(s), ${errors} error(s), ${warnings} warning(s)`);
process.exit(errors ? 1 : 0);
