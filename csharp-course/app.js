/* C# Zero to Hero: course runtime. Renders module data from csharp-course/modules/*.js. */
(function () {
  "use strict";

  const COURSE = (window.CSHARP_COURSE || { modules: [] });
  const modules = COURSE.modules.slice().sort((a, b) => a.number - b.number);
  const LEVELS = ["Beginner", "Intermediate", "Advanced"];
  const XP = { exercise: 10, lesson: 25, project: 100 };
  const STORE_KEY = "csharp-z2h-progress-v1";
  const THEME_KEY = "csharp-z2h-theme";

  const $ = (sel, root = document) => root.querySelector(sel);
  const main = $("#main");

  // ---------- index ----------
  const lessonIndex = new Map();   // id -> { module, lesson, li }
  const order = [];                // linear route: lesson ids and project ids
  modules.forEach(m => {
    m.lessons.forEach((l, li) => { lessonIndex.set(l.id, { module: m, lesson: l, li }); order.push(l.id); });
    if (m.milestone) order.push(m.milestone.id);
  });
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalExercises = modules.reduce((n, m) => n + m.lessons.reduce((k, l) => k + (l.exercises || []).length, 0), 0);
  const totalProjects = modules.filter(m => m.milestone).length;

  // ---------- storage ----------
  function loadState() {
    try { const s = JSON.parse(localStorage.getItem(STORE_KEY)); if (s && typeof s === "object") return Object.assign(blank(), s); } catch (e) { /* storage unavailable */ }
    return blank();
  }
  function blank() { return { ex: {}, lessons: {}, projects: {}, req: {}, hints: {}, last: null }; }
  const state = loadState();
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }

  function xpTotal() {
    return Object.keys(state.ex).length * XP.exercise + Object.keys(state.lessons).length * XP.lesson + Object.keys(state.projects).length * XP.project;
  }
  function moduleProgress(m) {
    const units = m.lessons.length + (m.milestone ? 1 : 0);
    let done = m.lessons.filter(l => state.lessons[l.id]).length;
    if (m.milestone && state.projects[m.milestone.id]) done++;
    return { done, units, pct: units ? done / units : 0 };
  }
  function courseProgress() {
    const units = totalLessons + totalProjects;
    const done = Object.keys(state.lessons).filter(id => lessonIndex.has(id)).length + Object.keys(state.projects).length;
    return units ? done / units : 0;
  }

  // ---------- helpers ----------
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  function highlight(code, lang = "csharp") {
    const P = window.Prism;
    if (P && P.languages && P.languages[lang]) {
      try { return P.highlight(code, P.languages[lang], lang); } catch (e) { /* fall through */ }
    }
    return esc(code);
  }
  function h(tag, attrs, html) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") el.className = attrs[k];
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    }
    if (html != null) el.innerHTML = html;
    return el;
  }
  const ICON = {
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pencil: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>',
  };
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }
  function copyText(text, btn) {
    const done = () => { if (btn) { const o = btn.textContent; btn.textContent = "Copied"; setTimeout(() => (btn.textContent = o), 1400); } };
    try {
      navigator.clipboard.writeText(text).then(done, () => fallbackSelect(btn));
    } catch (e) { fallbackSelect(btn); }
  }
  function fallbackSelect(btn) {
    const pre = btn && btn.closest(".code-wrap") && btn.closest(".code-wrap").querySelector("pre");
    if (!pre) return;
    const r = document.createRange(); r.selectNodeContents(pre);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    toast("Selected. Press Ctrl+C to copy.");
  }
  function codeBlock(code, opts = {}) {
    const wrap = h("div", { class: "code" + (opts.lang ? " lang-" + opts.lang : "") });
    const inner = h("div", { class: "code-wrap" });
    const head = h("div", { class: "code-head" });
    head.appendChild(h("span", { class: "fname" }, esc(opts.title || (opts.lang === "python" ? "Python" : "C#"))));
    const btn = h("button", { class: "copy", type: "button" }, "Copy");
    btn.addEventListener("click", () => copyText(code, btn));
    head.appendChild(btn);
    inner.appendChild(head);
    inner.appendChild(h("pre", null, "<code>" + highlight(code, opts.lang || "csharp") + "</code>"));
    if (opts.output != null) {
      const term = h("div", { class: "term" });
      term.appendChild(h("div", { class: "term-label" }, "Output"));
      term.appendChild(h("pre", null, esc(opts.output)));
      inner.appendChild(term);
    }
    wrap.appendChild(inner);
    return wrap;
  }

  // ---------- rail ----------
  let openModules = new Set();
  function renderRail(currentId) {
    const body = $("#railBody");
    const filter = ($("#railFilter").value || "").trim().toLowerCase();
    body.innerHTML = "";
    const curMod = currentId ? (currentId.match(/^m\d\d/) || [])[0] : null;
    if (curMod) openModules.add(curMod);
    if (!modules.length) { body.appendChild(h("p", { class: "pending-note" }, "Lessons are loading. If this stays empty, check that the csharp-course folder sits next to this page.")); return; }
    LEVELS.forEach(level => {
      const ms = modules.filter(m => m.level === level);
      if (!ms.length) return;
      const matches = ms.map(m => {
        const items = m.lessons.filter(l => !filter || l.title.toLowerCase().includes(filter) || m.title.toLowerCase().includes(filter));
        const projHit = m.milestone && (!filter || m.milestone.title.toLowerCase().includes(filter) || m.title.toLowerCase().includes(filter));
        return { m, items, projHit };
      }).filter(x => x.items.length || x.projHit);
      if (!matches.length) return;
      body.appendChild(h("div", { class: "rail-level eyebrow" }, level));
      matches.forEach(({ m, items, projHit }) => {
        const p = moduleProgress(m);
        const isOpen = filter || openModules.has(m.id);
        const box = h("div", { class: "rail-mod" + (m.id === curMod ? " current" : "") + (p.done === p.units ? " done" : "") });
        const btn = h("button", { type: "button", "aria-expanded": isOpen ? "true" : "false" },
          `<span class="rail-num">${String(m.number).padStart(2, "0")}</span><span class="rail-title">${esc(m.title)}</span><span class="rail-pct">${p.done}/${p.units}</span>`);
        btn.addEventListener("click", () => {
          if (openModules.has(m.id)) openModules.delete(m.id); else openModules.add(m.id);
          renderRail(currentId);
        });
        box.appendChild(btn);
        if (isOpen) {
          const ul = h("ul", { class: "rail-lessons" });
          ul.appendChild(railLink("#" + m.id, "Overview", "", currentId === m.id, false));
          items.forEach(l => ul.appendChild(railLink("#" + l.id, l.title, state.lessons[l.id] ? "done" : "", currentId === l.id, false)));
          if (projHit) ul.appendChild(railLink("#" + m.milestone.id, m.milestone.title, "flag" + (state.projects[m.milestone.id] ? " done" : ""), currentId === m.milestone.id, true));
          box.appendChild(ul);
        }
        body.appendChild(box);
      });
    });
  }
  function railLink(href, text, dotClass, active, project) {
    const li = h("li");
    const a = h("a", { href, class: (active ? "active " : "") + (project ? "project" : ""), "aria-current": active ? "page" : false },
      `<span class="dot ${dotClass}"></span><span>${esc(text)}</span>`);
    a.addEventListener("click", closeRail);
    li.appendChild(a);
    return li;
  }

  function updateMeter() {
    const pct = Math.round(courseProgress() * 100);
    $("#meterText").textContent = pct + "% complete";
    $("#meterFill").style.width = pct + "%";
    $("#xp").textContent = xpTotal().toLocaleString() + " XP";
  }

  // ---------- views ----------
  function nextUp() {
    for (const id of order) {
      if (lessonIndex.has(id) ? !state.lessons[id] : !state.projects[id]) return id;
    }
    return order[0];
  }
  function titleOf(id) {
    if (lessonIndex.has(id)) return lessonIndex.get(id).lesson.title;
    const m = modules.find(m => m.milestone && m.milestone.id === id);
    if (m) return m.milestone.title;
    const mm = modules.find(m => m.id === id);
    return mm ? mm.title : "";
  }

  function viewHome() {
    document.title = "C# Zero to Hero";
    const wrap = h("div", { class: "wide" });
    const started = Object.keys(state.lessons).length + Object.keys(state.ex).length > 0;
    const next = nextUp();
    const hero = h("section", { class: "hero" });
    const left = h("div");
    left.innerHTML = `
      <div class="eyebrow">Interactive course · .NET 8 and C# 12</div>
      <h1 style="margin-top:14px">C<span class="sharp">#</span><br>Zero <span class="arrow">to</span> Hero</h1>
      <p class="lede">Learn C# from your very first <code>Console.WriteLine</code> to building tested web APIs. Short lessons, exercises that check your answers, and a real project at the end of every module.</p>`;
    const actions = h("div", { class: "hero-actions" });
    if (next) actions.appendChild(h("a", { class: "btn primary", href: "#" + next }, started ? "Continue: " + esc(titleOf(next)) : "Start lesson 1"));
    actions.appendChild(h("a", { class: "btn", href: "#route" }, "See the route"));
    left.appendChild(actions);
    hero.appendChild(left);
    hero.appendChild(heroEditor());
    wrap.appendChild(hero);

    const stats = h("div", { class: "stats" });
    [[modules.length, "modules"], [totalLessons, "lessons"], [totalExercises, "exercises"], [totalProjects, "milestone projects"]]
      .forEach(([n, l]) => stats.appendChild(h("div", { class: "stat" }, `<b>${n}</b><span>${l}</span>`)));
    wrap.appendChild(stats);

    wrap.appendChild(h("div", { class: "method" }, `
      <div><div class="step-n">1 · Read</div><h3>Short lessons</h3><p>Each lesson covers one idea in 10 to 20 minutes, with runnable examples and the exact output they print.</p></div>
      <div><div class="step-n">2 · Practice</div><h3>Checked exercises</h3><p>Predict output, fill in missing code, put lines in order and spot bugs. You get feedback and an explanation every time.</p></div>
      <div><div class="step-n">3 · Build</div><h3>Milestone projects</h3><p>Each module ends with a console project you write in your own editor, with a starter, hints and a full solution.</p></div>`));

    const route = h("section", { id: "route" });
    route.appendChild(h("div", { class: "section-head" }, `<h2>The route</h2><span class="eyebrow">${Math.round(courseProgress() * 100)}% done · ${xpTotal().toLocaleString()} XP</span>`));
    if (!modules.length) route.appendChild(h("p", { class: "pending-note" }, "No lessons found. Make sure the csharp-course folder is published next to this page."));
    LEVELS.forEach(level => {
      const ms = modules.filter(m => m.level === level);
      if (!ms.length) return;
      route.appendChild(h("div", { class: "level-band eyebrow" }, level));
      const ol = h("ol", { class: "route" });
      ms.forEach(m => {
        const p = moduleProgress(m);
        const C = 2 * Math.PI * 25;
        const li = h("li", { class: "stop" + (p.done === p.units && p.units ? " done" : "") });
        li.innerHTML = `
          <div class="stop-node" aria-hidden="true">
            <svg viewBox="0 0 56 56"><circle class="track" cx="28" cy="28" r="25"/><circle class="fill" cx="28" cy="28" r="25" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p.pct)}"/></svg>
            ${m.number}
          </div>
          <a class="stop-card" href="#${m.id}">
            <h3>${esc(m.title)}</h3>
            <p>${esc(m.tagline)}</p>
            <div class="stop-meta">
              <span>${m.lessons.length} lessons</span>
              <span>${m.lessons.reduce((k, l) => k + (l.minutes || 0), 0)} min</span>
              <span>${p.done}/${p.units} done</span>
              ${m.milestone ? `<span class="flag-chip">${ICON.flag}${esc(m.milestone.title)}</span>` : ""}
            </div>
          </a>`;
        ol.appendChild(li);
      });
      route.appendChild(ol);
    });
    wrap.appendChild(route);
    return wrap;
  }

  function heroEditor() {
    const ed = h("div", { class: "editor", "aria-hidden": "true" });
    ed.innerHTML = `<div class="editor-head"><i></i><i></i><i></i><span style="margin-left:6px">Program.cs</span></div><pre><code class="typed"></code><span class="caret"></span></pre>`;
    const src = [
      'var hero = new Developer("you");',
      '',
      'foreach (var module in Course.Modules)',
      '{',
      '    hero.Learn(module.Lessons);',
      '    hero.Practice(module.Exercises);',
      '    hero.Build(module.Milestone);',
      '}',
      '',
      'Console.WriteLine($"{hero.Name}: zero to hero");',
    ].join("\n");
    const target = ed.querySelector(".typed");
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { target.innerHTML = highlight(src); return ed; }
    target.innerHTML = highlight(src);  // complete at rest; replay typing once after paint
    let i = 0;
    const tick = () => {
      if (!document.body.contains(ed)) return;
      i = Math.min(src.length, i + 2);
      target.innerHTML = highlight(src.slice(0, i));
      if (i < src.length) setTimeout(tick, 18);
    };
    setTimeout(() => { i = 0; tick(); }, 400);
    return ed;
  }

  function viewModule(m) {
    document.title = `${m.title} · C# Zero to Hero`;
    const col = h("div", { class: "column" });
    col.appendChild(crumbs([["#home", "Course"], [null, "Module " + m.number]]));
    const p = moduleProgress(m);
    col.appendChild(h("header", { class: "mod-hero" }, `
      <div class="mod-num">${String(m.number).padStart(2, "0")}</div>
      <div class="eyebrow" style="margin-top:12px">${esc(m.level)} · ${m.lessons.length} lessons · ${p.done}/${p.units} done</div>
      <h1>${esc(m.title)}</h1>
      <p>${esc(m.tagline)}</p>`));
    const ul = h("ul", { class: "lesson-list" });
    m.lessons.forEach((l, i) => {
      const done = !!state.lessons[l.id];
      const solved = (l.exercises || []).filter((_, xi) => state.ex[l.id + ":" + xi]).length;
      const li = h("li");
      li.appendChild(h("a", { class: "lesson-row" + (done ? " done" : ""), href: "#" + l.id }, `
        <span class="n">${done ? "✓" : String(i + 1).padStart(2, "0")}</span>
        <div><h3>${esc(l.title)}</h3><p>${l.minutes} min · ${(l.exercises || []).length} exercises</p></div>
        <span class="state">${done ? "Complete" : solved ? solved + "/" + l.exercises.length + " solved" : "Not started"}</span>`));
      ul.appendChild(li);
    });
    col.appendChild(ul);
    if (m.milestone) {
      const pr = m.milestone;
      col.appendChild(h("a", { class: "project-card", href: "#" + pr.id }, `
        <span class="flag-chip">${ICON.flag}Milestone project${state.projects[pr.id] ? " · Complete" : ""}</span>
        <h3>${esc(pr.title)}</h3>
        <p>${esc(pr.skills.join(" · "))}</p>`));
    }
    return col;
  }

  function crumbs(items) {
    const nav = h("nav", { class: "crumbs", "aria-label": "Breadcrumb" });
    items.forEach(([href, text], i) => {
      if (i) nav.appendChild(h("span", { "aria-hidden": "true" }, "/"));
      nav.appendChild(href ? h("a", { href }, esc(text)) : h("span", null, esc(text)));
    });
    return nav;
  }

  function renderBlock(b) {
    switch (b.type) {
      case "text": return h("div", { class: "block-text" }, b.html);
      case "code": return codeBlock(b.code, { title: b.title, output: b.output });
      case "callout": {
        const labels = { tip: "Tip", warning: "Watch out", note: "Note", python: "Coming from Python", deep: "Under the hood" };
        return h("aside", { class: "callout " + b.tone },
          `<div class="callout-title">${esc(b.title || labels[b.tone] || "Note")}</div><div class="callout-body">${b.html}</div>`);
      }
      case "compare": {
        const d = h("div", { class: "compare" });
        d.appendChild(codeBlock(b.left.code, { title: b.left.label, lang: b.left.lang || "csharp" }));
        d.appendChild(codeBlock(b.right.code, { title: b.right.label, lang: b.right.lang || "csharp" }));
        return d;
      }
      case "table": {
        const d = h("div", { class: "table-wrap" });
        d.innerHTML = `<table><thead><tr>${b.headers.map(x => `<th>${x}</th>`).join("")}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
        return d;
      }
      case "steps": return h("ol", { class: "steps" }, b.items.map(i => `<li><div>${i}</div></li>`).join(""));
      default: return h("div");
    }
  }

  // ---------- exercises ----------
  const KIND = { mcq: "Multiple choice", output: "Predict the output", fill: "Fill in the blanks", order: "Put the lines in order", bug: "Find the bug" };
  const normOut = s => String(s).replace(/\r/g, "").split("\n").map(l => l.trim()).join("\n").replace(/\n+$/, "").replace(/^\n+/, "");
  const normCode = s => String(s).replace(/\s+/g, "");

  function renderExercise(lesson, x, xi, onSolved) {
    const key = lesson.id + ":" + xi;
    const card = h("article", { class: "ex" + (state.ex[key] ? " solved" : "") });
    const top = h("div", { class: "ex-top" }, `<span class="ex-kind">${xi + 1} · ${KIND[x.type] || "Exercise"}</span><span class="ex-status">${state.ex[key] ? "Solved" : ""}</span>`);
    card.appendChild(top);
    card.appendChild(h("div", { class: "ex-prompt" }, wrapP(x.prompt)));
    const fb = h("div", { class: "feedback", hidden: true });
    const solved = () => {
      if (!state.ex[key]) { state.ex[key] = 1; save(); toast("+" + XP.exercise + " XP"); updateMeter(); }
      card.classList.add("solved"); top.querySelector(".ex-status").textContent = "Solved";
      onSolved();
    };
    const show = (good, extra) => {
      fb.hidden = false; fb.className = "feedback " + (good ? "good" : "bad");
      fb.innerHTML = `<div class="verdict">${good ? "Correct" : "Not quite"}</div>${extra || ""}${good || extra ? wrapP(x.explain) : ""}`;
    };
    const already = !!state.ex[key];

    if (x.type === "mcq" || x.type === "bug") {
      if (x.code) card.appendChild(codeBlock(x.code, { title: x.type === "bug" ? "Find the bug" : undefined }));
      const opts = h("div", { class: "opts", role: "group" });
      const buttons = x.options.map((o, oi) => {
        const b = h("button", { class: "opt", type: "button" }, `<span class="key">${String.fromCharCode(65 + oi)}</span><span>${o}</span>`);
        b.addEventListener("click", () => {
          if (oi === x.answer) {
            buttons.forEach(bb => { bb.disabled = true; }); b.classList.add("right"); show(true); solved();
          } else {
            b.classList.add("wrong"); b.disabled = true;
            fb.hidden = false; fb.className = "feedback bad";
            fb.innerHTML = `<div class="verdict">Not quite. Try another option.</div>`;
          }
        });
        opts.appendChild(b);
        return b;
      });
      card.appendChild(opts);
      if (already) { buttons.forEach(b => (b.disabled = true)); buttons[x.answer].classList.add("right"); show(true); }
    }

    if (x.type === "output") {
      card.appendChild(codeBlock(x.code));
      const id = "ans-" + key.replace(/[^a-z0-9]/gi, "-");
      card.appendChild(h("label", { class: "sr-only", for: id }, "Your predicted output"));
      const ta = h("textarea", { class: "answer-box", id, spellcheck: "false", placeholder: "Type exactly what the console prints…" });
      ta.rows = Math.min(8, Math.max(2, x.answer.split("\n").length + 1));
      card.appendChild(ta);
      const actions = h("div", { class: "ex-actions" });
      const check = h("button", { class: "btn primary small", type: "button" }, "Check");
      const reveal = h("button", { class: "btn ghost small", type: "button", hidden: true }, "Show answer");
      check.addEventListener("click", () => {
        if (normOut(ta.value) === normOut(x.answer)) { show(true); solved(); reveal.hidden = true; }
        else { show(false, `<p>Compare your answer line by line. Spacing at the ends of lines does not matter; everything else does.</p>`); reveal.hidden = false; }
      });
      reveal.addEventListener("click", () => {
        ta.value = x.answer; show(false, `<p>The program prints the text now in the box.</p>`); reveal.hidden = true;
      });
      actions.append(check, reveal); card.appendChild(actions);
      if (already) { ta.value = x.answer; show(true); }
    }

    if (x.type === "fill") {
      const parts = x.code.split("___");
      let html = "";
      parts.forEach((p, i) => {
        html += highlight(p);
        if (i < parts.length - 1) {
          const w = Math.max(4, ...x.blanks[i].map(s => s.length)) + 1;
          html += `<input class="blank" data-i="${i}" aria-label="Blank ${i + 1}" spellcheck="false" autocomplete="off" autocapitalize="off" style="width:${w}ch">`;
        }
      });
      const wrap = h("div", { class: "code" });
      wrap.innerHTML = `<div class="code-wrap"><div class="code-head"><span class="fname">Complete the code</span></div><pre><code>${html}</code></pre></div>`;
      card.appendChild(wrap);
      const inputs = [...wrap.querySelectorAll(".blank")];
      const actions = h("div", { class: "ex-actions" });
      const check = h("button", { class: "btn primary small", type: "button" }, "Check");
      const reveal = h("button", { class: "btn ghost small", type: "button", hidden: true }, "Show answer");
      const doCheck = () => {
        let all = true;
        inputs.forEach((inp, i) => {
          const ok = x.blanks[i].some(a => normCode(a) === normCode(inp.value));
          inp.classList.toggle("right", ok); inp.classList.toggle("wrong", !ok); all = all && ok;
        });
        if (all) { show(true); solved(); reveal.hidden = true; }
        else { show(false, `<p>The blanks marked in red are not right yet.</p>`); reveal.hidden = false; }
      };
      inputs.forEach(inp => inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); doCheck(); } }));
      check.addEventListener("click", doCheck);
      reveal.addEventListener("click", () => {
        inputs.forEach((inp, i) => { inp.value = x.blanks[i][0]; inp.classList.remove("wrong"); });
        show(false, `<p>The accepted answers are filled in.</p>`); reveal.hidden = true;
      });
      actions.append(check, reveal); card.appendChild(actions);
      if (already) { inputs.forEach((inp, i) => { inp.value = x.blanks[i][0]; inp.classList.add("right"); }); show(true); }
    }

    if (x.type === "order") {
      let cur = already ? x.lines.map((_, i) => i) : shuffle(x.lines.map((_, i) => i));
      const list = h("ol", { class: "order-list" });
      const draw = (marks) => {
        list.innerHTML = "";
        cur.forEach((li, pos) => {
          const item = h("li", { class: "order-item" + (marks ? (marks[pos] ? " right" : " wrong") : "") });
          item.appendChild(h("code", null, highlight(x.lines[li])));
          const btns = h("div", { class: "order-btns" });
          const up = h("button", { type: "button", "aria-label": "Move line up", disabled: pos === 0 }, ICON.up);
          const dn = h("button", { type: "button", "aria-label": "Move line down", disabled: pos === cur.length - 1 }, ICON.down);
          up.addEventListener("click", () => { [cur[pos - 1], cur[pos]] = [cur[pos], cur[pos - 1]]; draw(); list.children[pos - 1].querySelector("button").focus(); });
          dn.addEventListener("click", () => { [cur[pos + 1], cur[pos]] = [cur[pos], cur[pos + 1]]; draw(); const b = list.children[pos + 1].querySelectorAll("button")[1]; b.disabled ? list.children[pos + 1].querySelector("button").focus() : b.focus(); });
          btns.append(up, dn); item.appendChild(btns); list.appendChild(item);
        });
      };
      draw(already ? cur.map(() => true) : null);
      card.appendChild(list);
      const actions = h("div", { class: "ex-actions" });
      const check = h("button", { class: "btn primary small", type: "button" }, "Check order");
      const reveal = h("button", { class: "btn ghost small", type: "button", hidden: true }, "Show answer");
      check.addEventListener("click", () => {
        // Lines are compared by text, so identical lines in swapped positions still count.
        const marks = cur.map((li, pos) => x.lines[li] === x.lines[pos]);
        draw(marks);
        if (marks.every(Boolean)) { show(true); solved(); reveal.hidden = true; }
        else { show(false, `<p>Lines outlined in red are in the wrong place.</p>`); reveal.hidden = false; }
      });
      reveal.addEventListener("click", () => { cur = x.lines.map((_, i) => i); draw(cur.map(() => true)); show(false, `<p>This is the correct order.</p>`); reveal.hidden = true; });
      actions.append(check, reveal); card.appendChild(actions);
      if (already) show(true);
    }

    card.appendChild(fb);
    return card;
  }
  function wrapP(html) { html = String(html || ""); return /^\s*<(p|ul|ol)\b/.test(html) ? html : `<p>${html}</p>`; }
  function shuffle(a) {
    const orig = a.slice();
    for (let n = 0; n < 6; n++) {
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      if (a.some((v, i) => v !== orig[i])) break;
    }
    return a;
  }

  function viewLesson(id) {
    const { module: m, lesson: l, li } = lessonIndex.get(id);
    document.title = `${l.title} · C# Zero to Hero`;
    const col = h("article", { class: "column" });
    col.appendChild(crumbs([["#home", "Course"], ["#" + m.id, `Module ${m.number}: ${m.title}`], [null, `Lesson ${li + 1} of ${m.lessons.length}`]]));
    col.appendChild(h("h1", { class: "lesson-title" }, esc(l.title)));
    col.appendChild(h("div", { class: "lesson-meta" },
      `<span>${ICON.clock}${l.minutes} min</span><span>${ICON.pencil}${(l.exercises || []).length} exercises</span><span>${esc(m.level)}</span>`));
    if (l.objectives && l.objectives.length) {
      col.appendChild(h("section", { class: "objectives" }, `<div class="eyebrow">In this lesson you will</div><ul>${l.objectives.map(o => `<li><span>${o}</span></li>`).join("")}</ul>`));
    }
    const prose = h("div", { class: "prose" });
    l.blocks.forEach(b => prose.appendChild(renderBlock(b)));
    col.appendChild(prose);

    const exs = l.exercises || [];
    const solvedCount = () => exs.filter((_, xi) => state.ex[l.id + ":" + xi]).length;
    const ph = h("div", { class: "practice-head" }, `<h2>Practice</h2><span class="score"></span>`);
    const setScore = () => { ph.querySelector(".score").textContent = `${solvedCount()} of ${exs.length} solved`; };
    setScore();
    col.appendChild(ph);
    const list = h("div", { class: "exercises" });
    const bar = h("div", { class: "complete-bar" });
    const refreshBar = () => {
      const done = !!state.lessons[l.id];
      const all = solvedCount() === exs.length;
      bar.innerHTML = done
        ? `<p><strong>Lesson complete.</strong> You earned ${XP.lesson} XP for finishing it.</p>`
        : `<p>${all ? "All exercises solved." : `Solve the exercises above, or mark the lesson done when you are ready.`}</p>`;
      const btn = h("button", { class: "btn " + (done ? "ghost" : all ? "ok" : "primary"), type: "button" }, done ? "Mark as not done" : "Mark lesson complete");
      btn.addEventListener("click", () => {
        if (state.lessons[l.id]) delete state.lessons[l.id];
        else { state.lessons[l.id] = Date.now(); toast("Lesson complete · +" + XP.lesson + " XP"); }
        save(); refreshBar(); updateMeter(); renderRail(id);
      });
      bar.appendChild(btn);
    };
    exs.forEach((x, xi) => list.appendChild(renderExercise(l, x, xi, () => {
      setScore();
      if (solvedCount() === exs.length && !state.lessons[l.id]) {
        state.lessons[l.id] = Date.now(); save(); toast("All solved. Lesson complete · +" + XP.lesson + " XP"); updateMeter(); renderRail(id);
      }
      refreshBar();
    })));
    col.appendChild(list);

    if (l.takeaways && l.takeaways.length) {
      col.appendChild(h("section", { class: "takeaways" }, `<h2>Key takeaways</h2><ul>${l.takeaways.map(t => `<li>${t}</li>`).join("")}</ul>`));
    }
    refreshBar();
    col.appendChild(bar);
    col.appendChild(pager(id));
    return col;
  }

  function pager(id) {
    const i = order.indexOf(id);
    const nav = h("nav", { class: "pager", "aria-label": "Lesson navigation" });
    const prev = order[i - 1], next = order[i + 1];
    const label = x => lessonIndex.has(x) ? "Lesson" : "Milestone project";
    if (prev) nav.appendChild(h("a", { href: "#" + prev, class: "prev" }, `<small>← Previous ${label(prev).toLowerCase()}</small><b>${esc(titleOf(prev))}</b>`));
    if (next) nav.appendChild(h("a", { href: "#" + next, class: "next" }, `<small>Next ${label(next).toLowerCase()} →</small><b>${esc(titleOf(next))}</b>`));
    return nav;
  }

  function viewProject(m) {
    const p = m.milestone;
    document.title = `${p.title} · C# Zero to Hero`;
    const col = h("article", { class: "column" });
    col.appendChild(crumbs([["#home", "Course"], ["#" + m.id, `Module ${m.number}: ${m.title}`], [null, "Milestone project"]]));
    col.appendChild(h("div", { class: "proj-flag" }, `${ICON.flag}Milestone ${m.number} of ${modules.length}`));
    col.appendChild(h("h1", { class: "lesson-title" }, esc(p.title)));
    const chips = h("div", { class: "chips" }, p.skills.map(s => `<span class="chip">${esc(s)}</span>`).join(""));
    col.appendChild(chips);
    col.appendChild(h("div", { class: "prose" }, p.brief));

    // requirements
    const reqSec = h("section", { class: "proj-section" });
    const reqDone = () => p.requirements.filter((_, i) => state.req[p.id + ":" + i]).length;
    const reqHead = h("h2", null, `Requirements <small></small>`);
    const setReq = () => { reqHead.querySelector("small").textContent = `${reqDone()} of ${p.requirements.length} checked`; };
    setReq();
    reqSec.appendChild(reqHead);
    const ul = h("ul", { class: "checklist" });
    p.requirements.forEach((r, i) => {
      const k = p.id + ":" + i;
      const id = "req-" + k.replace(/[^a-z0-9]/gi, "-");
      const li = h("li");
      li.innerHTML = `<label for="${id}"><input type="checkbox" id="${id}" ${state.req[k] ? "checked" : ""}><span>${r}</span></label>`;
      li.querySelector("input").addEventListener("change", e => { if (e.target.checked) state.req[k] = 1; else delete state.req[k]; save(); setReq(); });
      ul.appendChild(li);
    });
    reqSec.appendChild(ul);
    col.appendChild(reqSec);

    const sec = (title, node) => { const s = h("section", { class: "proj-section" }); s.appendChild(h("h2", null, title)); s.appendChild(node); col.appendChild(s); return s; };
    if (p.sampleRun) {
      const run = h("div", { class: "code" });
      run.innerHTML = `<div class="code-wrap"><div class="code-head"><span class="fname">Example run</span></div><div class="term" style="border-top:0"><pre>${esc(p.sampleRun)}</pre></div></div>`;
      sec("What it looks like", run);
    }
    const starterNote = h("div", { class: "prose" });
    starterNote.appendChild(h("div", { class: "block-text" }, `<p>Create a project with <code>dotnet new console -o ${esc(p.title.replace(/[^A-Za-z0-9]+/g, ""))}</code>, replace <code>Program.cs</code> with the starter below, and work through the <code>TODO</code> comments. Run it with <code>dotnet run</code> after each step.</p>`));
    starterNote.appendChild(codeBlock(p.starter, { title: "Program.cs · starter" }));
    sec("Starter code", starterNote);

    // hints
    const hintBox = h("div", { style: "display:grid;gap:8px" });
    const shown = () => state.hints[p.id] || 0;
    const drawHints = () => {
      hintBox.innerHTML = "";
      p.hints.slice(0, shown()).forEach((hint, i) => hintBox.appendChild(h("div", { class: "hint" }, `<b>Hint ${i + 1}</b><div>${wrapP(hint)}</div>`)));
      if (shown() < p.hints.length) {
        const b = h("button", { class: "btn small", type: "button" }, shown() ? `Show hint ${shown() + 1} of ${p.hints.length}` : `Show the first hint (${p.hints.length} available)`);
        b.addEventListener("click", () => { state.hints[p.id] = shown() + 1; save(); drawHints(); });
        hintBox.appendChild(b);
      }
    };
    drawHints();
    sec("Hints", hintBox);

    // solution
    const solBox = h("div", { style: "display:grid;gap:10px" });
    const drawSol = (stage) => {
      solBox.innerHTML = "";
      if (stage === 0) {
        const b = h("button", { class: "btn small", type: "button" }, "Show the solution");
        b.addEventListener("click", () => drawSol(reqDone() === p.requirements.length ? 2 : 1));
        solBox.appendChild(b);
      } else if (stage === 1) {
        const c = h("div", { class: "confirm" }, `<p>You have checked ${reqDone()} of ${p.requirements.length} requirements. Writing it yourself first is how the ideas stick.</p>`);
        const row = h("div", { class: "ex-actions" });
        const yes = h("button", { class: "btn amber small", type: "button" }, "Show it anyway");
        const no = h("button", { class: "btn small", type: "button" }, "Keep working");
        yes.addEventListener("click", () => drawSol(2)); no.addEventListener("click", () => drawSol(0));
        row.append(yes, no); c.appendChild(row); solBox.appendChild(c);
      } else {
        solBox.appendChild(codeBlock(p.solution, { title: "Program.cs · reference solution" }));
        const hide = h("button", { class: "btn ghost small", type: "button" }, "Hide solution");
        hide.addEventListener("click", () => drawSol(0));
        solBox.appendChild(hide);
      }
    };
    drawSol(0);
    sec("Reference solution", solBox);

    if (p.stretch && p.stretch.length) sec("Stretch goals", h("ul", { class: "stretch" }, p.stretch.map(s => `<li>${s}</li>`).join("")));

    const bar = h("div", { class: "complete-bar" });
    const drawBar = () => {
      const done = !!state.projects[p.id];
      bar.innerHTML = done ? `<p><strong>Milestone reached.</strong> You earned ${XP.project} XP.</p>` : `<p>Finished the requirements and it runs? Mark the milestone complete for ${XP.project} XP.</p>`;
      const b = h("button", { class: "btn " + (done ? "ghost" : "amber"), type: "button" }, done ? "Mark as not done" : "Mark milestone complete");
      b.addEventListener("click", () => {
        if (state.projects[p.id]) delete state.projects[p.id];
        else { state.projects[p.id] = Date.now(); toast("Milestone reached · +" + XP.project + " XP"); }
        save(); drawBar(); updateMeter(); renderRail(p.id);
      });
      bar.appendChild(b);
    };
    drawBar();
    col.appendChild(bar);
    col.appendChild(pager(p.id));
    return col;
  }

  function viewMissing() {
    const col = h("div", { class: "column" });
    col.innerHTML = `<h1 class="lesson-title">Page not found</h1><p>That lesson link does not match anything in this course. <a href="#home">Go to the course start</a>.</p>`;
    return col;
  }

  // ---------- router ----------
  function route() {
    const id = (location.hash || "#home").slice(1);
    let view, railId = null;
    if (!id || id === "home" || id === "route") view = viewHome();
    else if (lessonIndex.has(id)) { view = viewLesson(id); railId = id; }
    else if (/^m\d\d-project$/.test(id)) {
      const m = modules.find(m => m.milestone && m.milestone.id === id);
      view = m ? viewProject(m) : viewMissing(); railId = id;
    } else {
      const m = modules.find(m => m.id === id);
      view = m ? viewModule(m) : viewMissing(); railId = m ? id : null;
    }
    main.innerHTML = ""; main.appendChild(view);
    if (railId) { state.last = railId; save(); }
    renderRail(railId);
    updateMeter();
    if (id === "route") { const r = $("#route"); if (r) r.scrollIntoView(); }
    else window.scrollTo(0, 0);
  }

  // ---------- chrome ----------
  function closeRail() { document.body.classList.remove("rail-open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }
  $("#menuBtn").addEventListener("click", () => {
    const open = document.body.classList.toggle("rail-open");
    $("#menuBtn").setAttribute("aria-expanded", open ? "true" : "false");
  });
  $("#scrim").addEventListener("click", closeRail);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeRail(); });
  $("#railFilter").addEventListener("input", () => renderRail((location.hash || "").slice(1)));

  function applyTheme(t) {
    if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  }
  let theme = null;
  try { theme = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
  applyTheme(theme);
  $("#themeBtn").addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark" ||
      (!document.documentElement.getAttribute("data-theme") && matchMedia("(prefers-color-scheme: dark)").matches);
    theme = isDark ? "light" : "dark";
    applyTheme(theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
  });

  window.addEventListener("hashchange", route);
  route();
})();
