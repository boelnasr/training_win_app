/* Pocket IDE — a mobile-first code editor that runs entirely in the browser. */
(function () {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const { highlight, langOf, escape, KEYWORDS } = window.Highlighter;

  // ---------------------------------------------------------------- storage

  const DB = {
    db: null,
    open() {
      return new Promise((resolve, reject) => {
        const req = indexedDB.open('pocket-ide', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('projects', { keyPath: 'id' });
        req.onsuccess = () => { this.db = req.result; resolve(); };
        req.onerror = () => reject(req.error);
      });
    },
    tx(mode, fn) {
      return new Promise((resolve, reject) => {
        const t = this.db.transaction('projects', mode);
        const r = fn(t.objectStore('projects'));
        t.oncomplete = () => resolve(r && r.result);
        t.onerror = () => reject(t.error);
      });
    },
    all() { return this.tx('readonly', (s) => s.getAll()); },
    put(p) { return this.tx('readwrite', (s) => s.put(p)); },
    del(id) { return this.tx('readwrite', (s) => s.delete(id)); },
  };

  const SETTINGS_KEY = 'pocket-ide-settings';
  const DEFAULT_SETTINGS = {
    theme: 'system', fontSize: 14, tabSize: 2, autoClose: true, suggest: true, keybar: true, lastProject: null,
  };
  function loadSettings() {
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }; }
    catch (e) { return { ...DEFAULT_SETTINGS }; }
  }
  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (e) { /* private mode */ }
  }

  // --------------------------------------------------------------- templates

  const TEMPLATES = {
    web: {
      label: 'Web app (HTML/CSS/JS)',
      active: 'index.html',
      files: {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My App</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="card">
    <h1>Hello from Pocket IDE 👋</h1>
    <p>Edit the files, then tap <b>Run</b>.</p>
    <button id="btn">Clicked 0 times</button>
  </main>
  <script src="script.js"></script>
</body>
</html>
`,
        'style.css': `body {
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
}

.card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

button {
  font-size: 16px;
  padding: 10px 18px;
  border: 0;
  border-radius: 10px;
  background: #10b981;
  color: white;
}
`,
        'script.js': `const btn = document.getElementById('btn');
let count = 0;

btn.addEventListener('click', () => {
  count++;
  btn.textContent = \`Clicked \${count} time\${count === 1 ? '' : 's'}\`;
  console.log('count is', count);
});

console.log('App started ✔');
`,
      },
    },
    python: {
      label: 'Python',
      active: 'main.py',
      files: {
        'main.py': `from utils import fibonacci, is_prime

print("Hello from Python on Android!")

nums = fibonacci(15)
print("Fibonacci:", nums)
print("Primes among them:", [n for n in nums if is_prime(n)])

squares = {n: n * n for n in range(1, 6)}
print("Squares:", squares)
`,
        'utils.py': `def fibonacci(count):
    """Return the first \`count\` Fibonacci numbers."""
    seq = [0, 1]
    while len(seq) < count:
        seq.append(seq[-1] + seq[-2])
    return seq[:count]


def is_prime(n):
    if n < 2:
        return False
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            return False
    return True
`,
      },
    },
    js: {
      label: 'JavaScript (console)',
      active: 'main.js',
      files: {
        'main.js': `// Plain JavaScript — output appears in the Console tab.
const people = [
  { name: 'Ada', born: 1815 },
  { name: 'Grace', born: 1906 },
  { name: 'Linus', born: 1969 },
];

const year = new Date().getFullYear();
for (const p of people) {
  console.log(\`\${p.name} would be \${year - p.born}\`);
}

console.table ? console.log(people) : null;
`,
      },
    },
    blank: { label: 'Empty project', active: null, files: {} },
  };

  // ------------------------------------------------------------------ state

  const settings = loadSettings();
  let projects = [];
  let project = null;
  const viewState = new Map(); // path -> scroll/selection, per session
  let lang = 'text';
  let saveTimer = 0;
  let dirty = false;
  let lineHeight = 21;
  let charWidth = 8.4;
  const PAD_TOP = 10;
  const PAD_LEFT = 10;

  const ta = $('code');
  const hl = $('code-hl');
  const layer = $('code-layer');
  const gutter = $('gutter');
  const activeLine = $('active-line');

  // --------------------------------------------------------------- overlays
  // Drawer, panel (on phones) and dialogs register here so the Android back
  // button closes them instead of leaving the app.

  const overlays = [];
  let ignorePops = 0;
  function makeOverlay(onShow, onHide) {
    const o = {
      on: false,
      show() {
        if (o.on) return;
        o.on = true;
        onShow();
        overlays.push(o);
        history.pushState({ overlay: overlays.length }, '');
      },
      hide(fromPop) {
        if (!o.on) return;
        o.on = false;
        onHide();
        if (!fromPop) {
          const i = overlays.indexOf(o);
          if (i >= 0) overlays.splice(i, 1);
          ignorePops++;
          history.back();
        }
      },
    };
    return o;
  }
  window.addEventListener('popstate', () => {
    if (ignorePops > 0) { ignorePops--; return; }
    const o = overlays.pop();
    if (o) o.hide(true);
  });

  // ------------------------------------------------------------------- UI bits

  let toastTimer = 0;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  const dialog = $('dialog');
  const dialogForm = $('dialog-form');
  const dialogOverlay = makeOverlay(() => dialog.showModal(), () => { if (dialog.open) dialog.close(''); });
  dialog.addEventListener('close', () => dialogOverlay.hide());
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(''); });

  function openDialog(html, onOpen) {
    dialogForm.innerHTML = html;
    dialog.returnValue = '';
    dialogOverlay.show();
    if (onOpen) onOpen(dialogForm);
    return new Promise((resolve) => {
      dialog.addEventListener('close', () => resolve(dialog.returnValue), { once: true });
    });
  }
  const cancelBtn = '<button type="button" class="btn" onclick="this.closest(\'dialog\').close(\'\')">Cancel</button>';

  async function ask(title, value = '', { placeholder = '', ok = 'OK', message = '' } = {}) {
    let input;
    const r = await openDialog(`
      <h3>${escape(title)}</h3>
      ${message ? `<p>${escape(message)}</p>` : ''}
      <input type="text" name="v" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="${escape(placeholder)}">
      <div class="dialog-actions"><button class="btn primary" value="ok">${escape(ok)}</button>${cancelBtn}</div>`,
    (f) => {
      input = f.querySelector('input');
      input.value = value;
      input.focus();
      const dot = value.lastIndexOf('.');
      input.setSelectionRange(value.lastIndexOf('/') + 1, dot > 0 ? dot : value.length);
    });
    return r === 'ok' ? input.value.trim() : null;
  }

  async function confirmDialog(title, message, ok = 'OK', danger = false) {
    const r = await openDialog(`
      <h3>${escape(title)}</h3><p>${escape(message)}</p>
      <div class="dialog-actions">${cancelBtn}<button class="btn ${danger ? 'danger' : 'primary'}" value="ok">${escape(ok)}</button></div>`);
    return r === 'ok';
  }

  async function menu(title, items) {
    const list = items.filter(Boolean);
    const r = await openDialog(`
      <h3>${escape(title)}</h3>
      <div class="menu-list">${list.map((it, i) => `<button value="${i}" class="${it.danger ? 'danger' : ''}"><span class="ico">${it.icon || ''}</span>${escape(it.label)}</button>`).join('')}</div>`);
    if (r === '') return;
    const item = list[Number(r)];
    if (item) item.run();
  }

  function download(name, blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  // ----------------------------------------------------------------- settings

  function applySettings() {
    const root = document.documentElement;
    const dark = settings.theme === 'dark' || (settings.theme === 'system' && !matchMedia('(prefers-color-scheme: light)').matches);
    root.dataset.theme = dark ? 'dark' : 'light';
    document.querySelector('meta[name=theme-color]').content = dark ? '#161b22' : '#f6f8fa';
    root.style.setProperty('--editor-font', settings.fontSize + 'px');
    root.style.setProperty('--tab-size', settings.tabSize);
    $('keybar').hidden = !settings.keybar;
    measure();
    render();
  }
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', applySettings);

  async function openSettings() {
    const sizes = [11, 12, 13, 14, 15, 16, 18, 20, 22, 24];
    const r = await openDialog(`
      <h3>Settings</h3>
      <label class="setting">Theme
        <select name="theme"><option value="system">System</option><option value="dark">Dark</option><option value="light">Light</option></select></label>
      <label class="setting">Font size
        <select name="fontSize">${sizes.map((s) => `<option value="${s}">${s}px</option>`).join('')}</select></label>
      <label class="setting">Indent size
        <select name="tabSize"><option value="2">2 spaces</option><option value="4">4 spaces</option></select></label>
      <label class="setting">Auto-close brackets &amp; quotes <input type="checkbox" name="autoClose"></label>
      <label class="setting">Word suggestions <input type="checkbox" name="suggest"></label>
      <label class="setting">Coding key bar <input type="checkbox" name="keybar"></label>
      <div class="dialog-actions">${cancelBtn}<button class="btn primary" value="ok">Save</button></div>`,
    (f) => {
      for (const k of ['theme', 'fontSize', 'tabSize']) f.elements[k].value = String(settings[k]);
      for (const k of ['autoClose', 'suggest', 'keybar']) f.elements[k].checked = settings[k];
    });
    if (r !== 'ok') return;
    const f = dialogForm.elements;
    settings.theme = f.theme.value;
    settings.fontSize = Number(f.fontSize.value);
    settings.tabSize = Number(f.tabSize.value);
    settings.autoClose = f.autoClose.checked;
    settings.suggest = f.suggest.checked;
    settings.keybar = f.keybar.checked;
    saveSettings();
    applySettings();
  }

  // ------------------------------------------------------------------ projects

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  function newProjectFrom(tplKey, name) {
    const tpl = TEMPLATES[tplKey];
    return {
      id: uid(), name, files: { ...tpl.files },
      open: tpl.active ? [tpl.active] : [], active: tpl.active, updated: Date.now(),
    };
  }

  function scheduleSave() {
    dirty = true;
    updateTitle();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, 400);
  }
  async function flushSave() {
    clearTimeout(saveTimer);
    if (!project) return;
    project.updated = Date.now();
    try {
      await DB.put(project);
      dirty = false;
      updateTitle();
    } catch (e) {
      toast('Could not save: ' + e.message);
    }
  }

  async function switchProject(id) {
    await flushSave();
    captureView();
    project = projects.find((p) => p.id === id) || projects[0];
    settings.lastProject = project.id;
    saveSettings();
    viewState.clear();
    renderProjects();
    renderFiles();
    openFile(project.active);
  }

  async function createProject() {
    const r = await openDialog(`
      <h3>New project</h3>
      <input type="text" name="name" placeholder="Project name" autocapitalize="off" autocomplete="off" spellcheck="false">
      <label class="setting">Template <select name="tpl">${Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}">${escape(t.label)}</option>`).join('')}</select></label>
      <div class="dialog-actions"><button class="btn primary" value="ok">Create</button>${cancelBtn}</div>`,
    (f) => f.elements.name.focus());
    if (r !== 'ok') return;
    const f = dialogForm.elements;
    const p = newProjectFrom(f.tpl.value, f.name.value.trim() || 'Untitled project');
    projects.push(p);
    await DB.put(p);
    await switchProject(p.id);
    toast(`Created “${p.name}”`);
  }

  function projectMenu() {
    menu(project.name, [
      { icon: '＋', label: 'New project…', run: createProject },
      { icon: '✎', label: 'Rename project', run: async () => {
        const n = await ask('Rename project', project.name);
        if (!n) return;
        project.name = n;
        await flushSave();
        renderProjects();
        updateTitle();
      } },
      { icon: '⧉', label: 'Duplicate project', run: async () => {
        const p = { ...structuredClone(project), id: uid(), name: project.name + ' copy' };
        projects.push(p);
        await DB.put(p);
        await switchProject(p.id);
      } },
      { icon: '⬇', label: 'Export as .zip', run: exportZip },
      { icon: '⬆', label: 'Import files or .zip', run: () => $('file-input').click() },
      { icon: '🗑', label: 'Delete project', danger: true, run: async () => {
        if (!(await confirmDialog('Delete project?', `“${project.name}” and all of its files will be removed from this device.`, 'Delete', true))) return;
        await DB.del(project.id);
        projects = projects.filter((p) => p !== project);
        if (!projects.length) {
          const p = newProjectFrom('blank', 'Untitled project');
          projects.push(p);
          await DB.put(p);
        }
        project = null;
        await switchProject(projects[0].id);
      } },
    ]);
  }

  function renderProjects() {
    const sel = $('project-select');
    sel.innerHTML = projects
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((p) => `<option value="${p.id}">${escape(p.name)}</option>`)
      .join('');
    sel.value = project.id;
  }

  function exportZip() {
    const safe = project.name.replace(/[^\w.-]+/g, '-') || 'project';
    download(`${safe}.zip`, window.Zip.create(project.files));
  }

  function isBinary(bytes) {
    const n = Math.min(bytes.length, 8000);
    for (let i = 0; i < n; i++) if (bytes[i] === 0) return true;
    return false;
  }

  async function importFiles(fileList) {
    const incoming = {};
    let skipped = 0;
    for (const file of fileList) {
      if (/\.zip$/i.test(file.name)) {
        try {
          const entries = await window.Zip.read(file);
          const names = Object.keys(entries);
          const roots = new Set(names.map((n) => n.split('/')[0]));
          const strip = roots.size === 1 && names.every((n) => n.includes('/')) ? [...roots][0].length + 1 : 0;
          for (const [name, bytes] of Object.entries(entries)) {
            if (isBinary(bytes)) { skipped++; continue; }
            incoming[name.slice(strip)] = new TextDecoder().decode(bytes);
          }
        } catch (e) {
          toast(e.message);
        }
      } else {
        const bytes = new Uint8Array(await file.arrayBuffer());
        if (isBinary(bytes)) { skipped++; continue; }
        incoming[file.name] = new TextDecoder().decode(bytes);
      }
    }
    const names = Object.keys(incoming);
    if (!names.length) { toast(skipped ? 'Only text files can be imported.' : 'Nothing to import.'); return; }
    const clashes = names.filter((n) => n in project.files);
    if (clashes.length && !(await confirmDialog('Replace files?', `${clashes.length} file(s) already exist:\n${clashes.slice(0, 6).join('\n')}${clashes.length > 6 ? '\n…' : ''}`, 'Replace'))) return;
    Object.assign(project.files, incoming);
    scheduleSave();
    renderFiles();
    if (!project.active || !(project.active in project.files)) openFile(names.sort()[0]);
    else if (names.includes(project.active)) loadDoc();
    toast(`Imported ${names.length} file(s)${skipped ? `, skipped ${skipped} binary` : ''}`);
  }

  // --------------------------------------------------------------------- files

  const FILE_COLORS = {
    html: ['HTML', '#e34c26'], css: ['CSS', '#2965f1'], js: ['JS', '#d4a800'], py: ['PY', '#3776ab'],
    json: ['{ }', '#6b7280'], md: ['MD', '#10b981'], text: ['TXT', '#6b7280'],
  };
  function fileBadge(path) {
    const l = langOf(path);
    const [label, color] = FILE_COLORS[l] || [(path.split('.').pop() || 'TXT').slice(0, 4).toUpperCase(), '#6b7280'];
    return `<span class="ficon" style="color:${color};background:${color}22">${escape(label)}</span>`;
  }

  function normalizePath(p) {
    const parts = [];
    for (const seg of p.replace(/\\/g, '/').split('/')) {
      if (!seg || seg === '.') continue;
      if (seg === '..') parts.pop();
      else parts.push(seg);
    }
    return parts.join('/');
  }

  const collapsed = new Set();
  function renderFiles() {
    const tree = { dirs: {}, files: [] };
    for (const path of Object.keys(project.files)) {
      const parts = path.split('/');
      let node = tree;
      for (const d of parts.slice(0, -1)) node = node.dirs[d] || (node.dirs[d] = { dirs: {}, files: [] });
      node.files.push(path);
    }
    const out = [];
    const walk = (node, prefix, depth) => {
      for (const name of Object.keys(node.dirs).sort()) {
        const full = prefix + name;
        const closed = collapsed.has(full);
        out.push(`<button class="folder-row" data-folder="${escape(full)}" style="padding-left:${depth * 14 + 6}px">${closed ? '▸' : '▾'} 📁 ${escape(name)}</button>`);
        if (!closed) walk(node.dirs[name], full + '/', depth + 1);
      }
      for (const path of node.files.sort()) {
        out.push(`<div class="file-row ${path === project.active ? 'active' : ''}">
          <button class="open" data-open="${escape(path)}" style="padding-left:${depth * 14 + 6}px">${fileBadge(path)}${escape(path.split('/').pop())}</button>
          <button class="more" data-more="${escape(path)}" aria-label="Actions for ${escape(path)}">⋯</button></div>`);
      }
    };
    walk(tree, '', 0);
    $('files').innerHTML = out.join('') || '<p style="padding:12px;color:var(--text-2);font-size:14px">No files yet. Tap “+ File”.</p>';
  }

  $('files').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.folder) {
      const f = b.dataset.folder;
      collapsed.has(f) ? collapsed.delete(f) : collapsed.add(f);
      renderFiles();
    } else if (b.dataset.open) {
      openFile(b.dataset.open);
      drawer.hide();
    } else if (b.dataset.more) fileMenu(b.dataset.more);
  });

  async function newFile(suggested = '') {
    const defaults = { html: 'page.html', py: 'script.py', css: 'styles.css', js: 'app.js' };
    const guess = suggested || defaults[lang] || 'untitled.js';
    const name = await ask('New file', guess, { message: 'Use slashes for folders, e.g. src/app.js', ok: 'Create' });
    if (!name) return;
    const path = normalizePath(name);
    if (!path) return;
    if (path in project.files) { toast('That file already exists'); openFile(path); return; }
    project.files[path] = '';
    scheduleSave();
    renderFiles();
    openFile(path);
    drawer.hide();
    setTimeout(() => ta.focus(), 50);
  }

  function renamePath(from, to) {
    const content = project.files[from];
    delete project.files[from];
    project.files[to] = content;
    project.open = project.open.map((p) => (p === from ? to : p));
    if (project.active === from) project.active = to;
    if (viewState.has(from)) { viewState.set(to, viewState.get(from)); viewState.delete(from); }
  }

  function fileMenu(path) {
    menu(path, [
      { icon: '✎', label: 'Rename / move', run: async () => {
        const n = await ask('Rename file', path, { ok: 'Rename' });
        const to = n && normalizePath(n);
        if (!to || to === path) return;
        if (to in project.files) { toast('A file with that name exists'); return; }
        renamePath(path, to);
        scheduleSave();
        renderFiles();
        renderTabs();
        if (project.active === to) { lang = langOf(to); render(); }
        updateTitle();
      } },
      { icon: '⧉', label: 'Duplicate', run: () => {
        let copy = path.replace(/(\.[^./]+)?$/, ' copy$1');
        while (copy in project.files) copy = copy.replace(/(\.[^./]+)?$/, ' copy$1');
        project.files[copy] = project.files[path];
        scheduleSave();
        renderFiles();
      } },
      { icon: '⬇', label: 'Download', run: () => download(path.split('/').pop(), new Blob([project.files[path]], { type: 'text/plain' })) },
      { icon: '🗑', label: 'Delete', danger: true, run: async () => {
        if (!(await confirmDialog('Delete file?', path, 'Delete', true))) return;
        delete project.files[path];
        viewState.delete(path);
        closeTab(path);
        scheduleSave();
        renderFiles();
      } },
    ]);
  }

  // ---------------------------------------------------------------------- tabs

  function renderTabs() {
    $('tabs').innerHTML = project.open
      .map((p) => `<div class="tab ${p === project.active ? 'active' : ''}" data-tab="${escape(p)}">
        <span>${escape(p.split('/').pop())}</span><button class="close" data-close="${escape(p)}" aria-label="Close ${escape(p)}">×</button></div>`)
      .join('');
    const act = $('tabs').querySelector('.tab.active');
    if (act) act.scrollIntoView({ inline: 'nearest', block: 'nearest' });
  }
  $('tabs').addEventListener('click', (e) => {
    const close = e.target.closest('[data-close]');
    if (close) { closeTab(close.dataset.close); scheduleSave(); return; }
    const tab = e.target.closest('[data-tab]');
    if (tab) openFile(tab.dataset.tab);
  });

  function closeTab(path) {
    const i = project.open.indexOf(path);
    if (i < 0) return;
    project.open.splice(i, 1);
    if (project.active === path) {
      const next = project.open[Math.min(i, project.open.length - 1)] || null;
      openFile(next);
    } else renderTabs();
  }

  // -------------------------------------------------------------------- editor

  function captureView() {
    if (project && project.active) {
      viewState.set(project.active, { st: ta.scrollTop, sl: ta.scrollLeft, ss: ta.selectionStart, se: ta.selectionEnd });
    }
  }

  function openFile(path) {
    if (path && !(path in project.files)) path = null;
    if (project.active && path !== project.active) captureView();
    project.active = path;
    if (path && !project.open.includes(path)) project.open.push(path);
    loadDoc();
    renderTabs();
    renderFiles();
    updateTitle();
    scheduleSave();
  }

  function loadDoc() {
    const path = project.active;
    $('empty-state').hidden = !!path;
    ta.disabled = !path;
    lang = path ? langOf(path) : 'text';
    ta.value = path ? project.files[path] : '';
    const v = path && viewState.get(path);
    if (v) {
      ta.setSelectionRange(v.ss, v.se);
      ta.scrollTop = v.st;
      ta.scrollLeft = v.sl;
    } else {
      ta.setSelectionRange(0, 0);
      ta.scrollTop = 0;
      ta.scrollLeft = 0;
    }
    lastLineCount = -1;
    render();
    hideFindMark();
    clearSuggestions();
  }

  function updateTitle() {
    $('title-project').textContent = project ? project.name : 'Pocket IDE';
    const f = $('title-file');
    f.textContent = project && project.active ? project.active : 'No file open';
    f.classList.toggle('dirty', dirty);
    const py = lang === 'py';
    $('run-label').textContent = py ? 'Run .py' : 'Run';
  }

  function measure() {
    const cs = getComputedStyle(ta);
    lineHeight = parseFloat(cs.lineHeight) || settings.fontSize * 1.55;
    const probe = document.createElement('span');
    probe.textContent = 'M'.repeat(50);
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre';
    hl.appendChild(probe);
    charWidth = probe.getBoundingClientRect().width / 50 || settings.fontSize * 0.6;
    probe.remove();
  }

  let renderQueued = false;
  let lastLineCount = -1;
  function render() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      const code = ta.value;
      hl.innerHTML = highlight(code, lang) + '\n';
      let lines = 1;
      for (let i = code.indexOf('\n'); i >= 0; i = code.indexOf('\n', i + 1)) lines++;
      if (lines !== lastLineCount) {
        lastLineCount = lines;
        let s = '';
        for (let i = 1; i <= lines; i++) s += i + '\n';
        gutter.textContent = s;
      }
      syncScroll();
      updateActiveLine();
    });
  }

  function syncScroll() {
    layer.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    gutter.style.transform = `translateY(${-ta.scrollTop}px)`;
  }

  function lineOf(pos) {
    const v = ta.value;
    let n = 0;
    for (let i = v.indexOf('\n'); i >= 0 && i < pos; i = v.indexOf('\n', i + 1)) n++;
    return n;
  }

  function visualColumn(lineText) {
    let col = 0;
    for (const ch of lineText) col = ch === '\t' ? col + settings.tabSize - (col % settings.tabSize) : col + 1;
    return col;
  }

  function updateActiveLine() {
    activeLine.style.top = PAD_TOP + lineOf(ta.selectionStart) * lineHeight + 'px';
  }

  function scrollToPos(pos) {
    const v = ta.value;
    const line = lineOf(pos);
    const lineStart = v.lastIndexOf('\n', pos - 1) + 1;
    const x = PAD_LEFT + visualColumn(v.slice(lineStart, pos)) * charWidth;
    const y = PAD_TOP + line * lineHeight;
    if (y < ta.scrollTop || y + lineHeight > ta.scrollTop + ta.clientHeight) ta.scrollTop = y - ta.clientHeight / 3;
    if (x < ta.scrollLeft || x > ta.scrollLeft + ta.clientWidth - 20) ta.scrollLeft = Math.max(0, x - ta.clientWidth / 2);
    syncScroll();
  }

  ta.addEventListener('scroll', syncScroll, { passive: true });
  document.addEventListener('selectionchange', () => {
    if (document.activeElement === ta) { updateActiveLine(); updateSuggestions(); }
  });

  ta.addEventListener('input', () => {
    if (!project.active) return;
    project.files[project.active] = ta.value;
    render();
    scheduleSave();
    updateSuggestions();
  });

  // Insert text through the browser's editing pipeline so native undo/redo keeps working.
  let inserting = false;
  function insertText(text, cursorBack = 0) {
    if (ta.disabled) return;
    if (document.activeElement !== ta) ta.focus();
    inserting = true;
    const ok = document.execCommand('insertText', false, text);
    inserting = false;
    if (!ok) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input'));
    }
    if (cursorBack) {
      const p = ta.selectionEnd - cursorBack;
      ta.setSelectionRange(p, p);
    }
  }

  const indentUnit = () => ' '.repeat(settings.tabSize);
  const PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' };
  const CLOSERS = ')]}"\'`';
  const VOID_TAGS = /^(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i;

  function newline() {
    const v = ta.value;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const lineStart = v.lastIndexOf('\n', s - 1) + 1;
    const before = v.slice(lineStart, s);
    const indent = /^[ \t]*/.exec(before)[0];
    const trimmed = before.trimEnd();
    const next = v.slice(e, e + 2);
    let open = /[{[(]$/.test(trimmed) || (lang === 'py' && /:$/.test(trimmed));
    if (lang === 'html') {
      const tag = /<([a-zA-Z][\w-]*)(?:\s[^<>]*)?>$/.exec(trimmed);
      if (tag && !VOID_TAGS.test(tag[1]) && !trimmed.endsWith('/>')) open = true;
    }
    if (open && (/^[)\]}]/.test(next) || (lang === 'html' && next === '</'))) {
      const tail = '\n' + indent;
      insertText('\n' + indent + indentUnit() + tail, tail.length);
    } else {
      insertText('\n' + indent + (open ? indentUnit() : ''));
    }
    scrollToPos(ta.selectionStart);
  }

  function typeChar(ch) {
    const v = ta.value;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const next = v[e];
    const prev = v[s - 1];
    if (!settings.autoClose) return false;
    if (s === e && CLOSERS.includes(ch) && next === ch) {
      ta.setSelectionRange(s + 1, s + 1);
      return true;
    }
    if (!PAIRS[ch]) return false;
    if (s !== e) {
      insertText(ch + v.slice(s, e) + PAIRS[ch]);
      return true;
    }
    const quote = ch === PAIRS[ch];
    if (quote && prev && /[\w\\]/.test(prev)) return false;
    if (next && !/[\s)\]};,:>]/.test(next)) return false;
    insertText(ch + PAIRS[ch], 1);
    return true;
  }

  ta.addEventListener('beforeinput', (e) => {
    if (inserting || e.isComposing) return;
    if (e.inputType === 'insertLineBreak' || (e.inputType === 'insertText' && e.data === '\n')) {
      e.preventDefault();
      newline();
    } else if (e.inputType === 'insertText' && e.data && e.data.length === 1) {
      if (typeChar(e.data)) e.preventDefault();
    } else if (e.inputType === 'deleteContentBackward' && settings.autoClose) {
      const s = ta.selectionStart;
      const v = ta.value;
      if (s === ta.selectionEnd && s > 0 && PAIRS[v[s - 1]] && PAIRS[v[s - 1]] === v[s]) {
        e.preventDefault();
        ta.setSelectionRange(s - 1, s + 1);
        insertText('');
        if (ta.value.length === v.length) { // insertText('') is a no-op in some engines
          inserting = true;
          document.execCommand('delete');
          inserting = false;
        }
      }
    }
  });

  function indentLines(dir) {
    const v = ta.value;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    if (dir > 0 && s === e) { insertText(indentUnit()); return; }
    const ls = v.lastIndexOf('\n', s - 1) + 1;
    let le = v.indexOf('\n', e > s && v[e - 1] === '\n' ? e - 1 : e);
    if (le < 0) le = v.length;
    const block = v.slice(ls, le);
    const dedent = new RegExp(`^(?: {1,${settings.tabSize}}|\\t)`);
    const out = block.split('\n').map((l) => (dir > 0 ? (l ? indentUnit() + l : l) : l.replace(dedent, ''))).join('\n');
    if (out === block) return;
    ta.setSelectionRange(ls, le);
    insertText(out);
    if (s === e) {
      const p = Math.max(ls, s + (out.length - block.length));
      ta.setSelectionRange(p, p);
    } else ta.setSelectionRange(ls, ls + out.length);
  }

  function toggleComment() {
    if (!project.active) return;
    const v = ta.value;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const ls = v.lastIndexOf('\n', s - 1) + 1;
    let le = v.indexOf('\n', e > s && v[e - 1] === '\n' ? e - 1 : e);
    if (le < 0) le = v.length;
    const [open, close] = { py: ['#', ''], css: ['/*', '*/'], html: ['<!--', '-->'], md: ['<!--', '-->'] }[lang] || ['//', ''];
    const lines = v.slice(ls, le).split('\n');
    const code = lines.filter((l) => l.trim());
    const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`^(\\s*)${esc(open)} ?(.*?)${close ? ' ?' + esc(close) : ''}$`);
    const allCommented = code.length && code.every((l) => re.test(l));
    const minIndent = Math.min(...code.map((l) => /^\s*/.exec(l)[0].length));
    const out = lines.map((l) => {
      if (!l.trim()) return l;
      if (allCommented) return l.replace(re, '$1$2');
      return l.slice(0, minIndent) + open + ' ' + l.slice(minIndent) + (close ? ' ' + close : '');
    }).join('\n');
    ta.setSelectionRange(ls, le);
    insertText(out);
    ta.setSelectionRange(ls, ls + out.length);
  }

  function moveCursor(dir) {
    const v = ta.value;
    let p = dir === 'left' ? ta.selectionStart : ta.selectionEnd;
    if (ta.selectionStart === ta.selectionEnd || dir === 'up' || dir === 'down') {
      if (dir === 'left') p = Math.max(0, p - 1);
      else if (dir === 'right') p = Math.min(v.length, p + 1);
      else {
        const ls = v.lastIndexOf('\n', p - 1) + 1;
        const col = p - ls;
        if (dir === 'up') {
          if (ls === 0) p = 0;
          else {
            const pls = v.lastIndexOf('\n', ls - 2) + 1;
            p = Math.min(pls + col, ls - 1);
          }
        } else {
          const nl = v.indexOf('\n', p);
          if (nl < 0) p = v.length;
          else {
            let nle = v.indexOf('\n', nl + 1);
            if (nle < 0) nle = v.length;
            p = Math.min(nl + 1 + col, nle);
          }
        }
      }
    }
    ta.setSelectionRange(p, p);
    scrollToPos(p);
  }

  function goToLine(n) {
    const lines = ta.value.split('\n');
    const line = Math.max(1, Math.min(lines.length, n));
    let pos = 0;
    for (let i = 0; i < line - 1; i++) pos += lines[i].length + 1;
    ta.focus();
    ta.setSelectionRange(pos, pos);
    scrollToPos(pos);
  }

  function formatDocument() {
    if (lang !== 'json') { toast('Formatting is available for JSON files'); return; }
    try {
      const out = JSON.stringify(JSON.parse(ta.value), null, settings.tabSize) + '\n';
      ta.focus();
      ta.select();
      insertText(out);
      toast('Formatted');
    } catch (e) {
      toast('Invalid JSON: ' + e.message);
    }
  }

  ta.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (e.key === 'Tab' && !mod) { e.preventDefault(); indentLines(e.shiftKey ? -1 : 1); }
    else if (mod && e.key === 's') { e.preventDefault(); flushSave().then(() => toast('Saved')); }
    else if (mod && e.key === 'Enter') { e.preventDefault(); run(); }
    else if (mod && e.key === 'f') { e.preventDefault(); openFind(); }
    else if (mod && e.key === '/') { e.preventDefault(); toggleComment(); }
    else if (mod && e.key === 'g') { e.preventDefault(); promptGoToLine(); }
  });

  async function promptGoToLine() {
    const n = await ask('Go to line', '', { placeholder: `1 – ${lastLineCount}`, ok: 'Go' });
    if (n && Number(n)) goToLine(Number(n));
  }

  // ------------------------------------------------------------- suggestions

  let wordCache = { code: null, words: [] };
  function documentWords() {
    const code = ta.value;
    if (wordCache.code === code) return wordCache.words;
    const counts = new Map();
    for (const w of (KEYWORDS[lang] || '').split(' ')) if (w) counts.set(w, 0.5);
    const re = lang === 'css' ? /[A-Za-z_-][\w-]{2,}/g : /[A-Za-z_$][\w$]{2,}/g;
    let m;
    while ((m = re.exec(code))) counts.set(m[0], (counts.get(m[0]) || 0) + 1);
    const words = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);
    wordCache = { code, words };
    return words;
  }

  function clearSuggestions() { $('suggest').innerHTML = ''; }

  let suggestTimer = 0;
  function updateSuggestions() {
    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(() => {
      if (!settings.suggest || !settings.keybar || !project.active) return clearSuggestions();
      const s = ta.selectionStart;
      if (s !== ta.selectionEnd) return clearSuggestions();
      const v = ta.value;
      const after = v[s];
      if (after && /[\w$]/.test(after)) return clearSuggestions();
      const m = (lang === 'css' ? /[\w-]+$/ : /[\w$]+$/).exec(v.slice(Math.max(0, s - 60), s));
      const prefix = m ? m[0] : '';
      if (prefix.length < 2) return clearSuggestions();
      const lower = prefix.toLowerCase();
      const list = [];
      for (const w of documentWords()) {
        if (w !== prefix && w.toLowerCase().startsWith(lower)) list.push(w);
        if (list.length >= 12) break;
      }
      $('suggest').innerHTML = list.map((w) => `<button data-word="${escape(w)}" data-len="${prefix.length}">${escape(w)}</button>`).join('');
    }, 60);
  }

  $('suggest').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const s = ta.selectionStart;
    ta.setSelectionRange(s - Number(b.dataset.len), s);
    insertText(b.dataset.word);
    clearSuggestions();
  });

  // ------------------------------------------------------------------ key bar

  const KEYS = [
    ['⇥', () => indentLines(1), 'Indent'], ['⇤', () => indentLines(-1), 'Outdent'],
    ['←', () => moveCursor('left'), 'Left'], ['→', () => moveCursor('right'), 'Right'],
    ['↑', () => moveCursor('up'), 'Up'], ['↓', () => moveCursor('down'), 'Down'],
    '{', '}', '(', ')', '[', ']', '<', '>', '=', ';', ':', '"', "'", '`', '/', '.', ',',
    '+', '-', '*', '!', '&', '|', '_', '$', '#', '%', '\\', '?', '@',
    ['//', toggleComment, 'Toggle comment'], ['Find', () => openFind(), 'Find'],
  ];
  $('keys').innerHTML = KEYS.map((k, i) => {
    const label = Array.isArray(k) ? k[0] : k;
    const aria = Array.isArray(k) ? k[2] : `Insert ${k}`;
    return `<button data-key="${i}" class="${label.length > 2 ? 'wide' : ''}" aria-label="${escape(aria)}">${escape(label)}</button>`;
  }).join('');

  // Keep focus (and the soft keyboard) in the editor when tapping the bars.
  for (const bar of [$('keys'), $('suggest')]) bar.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) e.preventDefault(); });
  $('keys').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || !project.active) return;
    const k = KEYS[Number(b.dataset.key)];
    if (Array.isArray(k)) k[1]();
    else if (!typeChar(k)) insertText(k);
  });

  // --------------------------------------------------------------------- find

  let matches = [];
  let matchIndex = -1;
  const findMark = document.createElement('div');
  findMark.style.cssText = 'position:absolute;background:rgba(245,158,11,.35);outline:1px solid #f59e0b;border-radius:2px;pointer-events:none';
  findMark.hidden = true;
  layer.appendChild(findMark);
  function hideFindMark() { findMark.hidden = true; }

  function openFind() {
    $('findbar').hidden = false;
    const sel = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    if (sel && !sel.includes('\n')) $('find-input').value = sel;
    $('find-input').focus();
    $('find-input').select();
    computeMatches();
  }
  function closeFind() {
    $('findbar').hidden = true;
    hideFindMark();
    matches = [];
  }

  function computeMatches() {
    const q = $('find-input').value;
    matches = [];
    if (q) {
      const hay = ta.value.toLowerCase();
      const needle = q.toLowerCase();
      for (let i = hay.indexOf(needle); i >= 0; i = hay.indexOf(needle, i + needle.length)) matches.push(i);
    }
    matchIndex = -1;
    if (matches.length) {
      const from = ta.selectionStart;
      matchIndex = matches.findIndex((m) => m >= from);
      if (matchIndex < 0) matchIndex = 0;
      showMatch();
    } else {
      hideFindMark();
      $('find-count').textContent = q ? '0/0' : '';
    }
  }

  function showMatch() {
    const q = $('find-input').value;
    const pos = matches[matchIndex];
    $('find-count').textContent = `${matchIndex + 1}/${matches.length}`;
    ta.setSelectionRange(pos, pos + q.length);
    const v = ta.value;
    const ls = v.lastIndexOf('\n', pos - 1) + 1;
    const col = visualColumn(v.slice(ls, pos));
    findMark.style.top = PAD_TOP + lineOf(pos) * lineHeight + 'px';
    findMark.style.left = PAD_LEFT + col * charWidth + 'px';
    findMark.style.width = Math.max(4, visualColumn(v.slice(ls, pos + q.length)) - col) * charWidth + 'px';
    findMark.style.height = lineHeight + 'px';
    findMark.hidden = false;
    scrollToPos(pos);
    updateActiveLine();
  }

  function stepMatch(d) {
    if (!matches.length) return computeMatches();
    matchIndex = (matchIndex + d + matches.length) % matches.length;
    showMatch();
  }

  function replaceOne() {
    const q = $('find-input').value;
    if (!matches.length || !q) return;
    const pos = matches[matchIndex];
    ta.setSelectionRange(pos, pos + q.length);
    insertText($('replace-input').value);
    $('find-input').focus();
    computeMatches();
  }

  function replaceAll() {
    const q = $('find-input').value;
    if (!q || !matches.length) return;
    const count = matches.length;
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const rep = $('replace-input').value;
    const out = ta.value.replace(re, () => rep);
    ta.focus();
    ta.select();
    insertText(out);
    computeMatches();
    toast(`Replaced ${count} occurrence(s)`);
  }

  $('find-input').addEventListener('input', computeMatches);
  $('find-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); stepMatch(e.shiftKey ? -1 : 1); } else if (e.key === 'Escape') closeFind(); });
  $('find-next').onclick = () => stepMatch(1);
  $('find-prev').onclick = () => stepMatch(-1);
  $('replace-one').onclick = replaceOne;
  $('replace-all').onclick = replaceAll;
  $('find-close').onclick = closeFind;
  ta.addEventListener('input', () => { if (!$('findbar').hidden) { hideFindMark(); } });

  // ------------------------------------------------------------ run / output

  const panel = $('panel');
  const preview = $('preview');
  const logEl = $('console-log');
  let errorCount = 0;
  let replMode = 'js';
  let running = false;

  const panelOverlay = makeOverlay(() => { panel.hidden = false; }, () => { panel.hidden = true; });

  function showPanel(which) {
    panelOverlay.show();
    const isPreview = which === 'preview';
    $('tab-preview').setAttribute('aria-selected', isPreview);
    $('tab-console').setAttribute('aria-selected', !isPreview);
    preview.hidden = !isPreview;
    $('console').hidden = isPreview;
    if (!isPreview) { errorCount = 0; updateBadge(); logEl.scrollTop = logEl.scrollHeight; }
  }
  $('tab-preview').onclick = () => showPanel('preview');
  $('tab-console').onclick = () => showPanel('console');
  $('btn-close-panel').onclick = () => panelOverlay.hide();
  $('btn-clear').onclick = () => { logEl.innerHTML = ''; errorCount = 0; updateBadge(); };
  $('btn-reload').onclick = () => run();
  $('btn-stop').onclick = stopPython;

  function updateBadge() {
    const b = $('err-badge');
    b.hidden = errorCount === 0;
    b.textContent = errorCount;
  }

  function log(type, text) {
    const row = document.createElement('div');
    row.className = 'row ' + type;
    row.textContent = text;
    const stick = logEl.scrollTop + logEl.clientHeight >= logEl.scrollHeight - 30;
    logEl.appendChild(row);
    while (logEl.childElementCount > 1000) logEl.firstChild.remove();
    if (stick) logEl.scrollTop = logEl.scrollHeight;
    if (type === 'error' && $('console').hidden) { errorCount++; updateBadge(); }
  }

  // Injected into previewed pages: forwards console output and errors to the IDE
  // and evaluates expressions typed into the console.
  const BRIDGE = `<script>(function(){
var fmt=function(v){try{if(v instanceof Error)return v.stack||String(v);if(typeof v==='function')return String(v);if(typeof v==='object'&&v!==null){if(v instanceof Node)return '<'+(v.nodeName||'node').toLowerCase()+'>';var seen=new WeakSet();return JSON.stringify(v,function(k,x){if(typeof x==='object'&&x!==null){if(seen.has(x))return '[Circular]';seen.add(x)}return x},2)}if(typeof v==='string')return v;return String(v)}catch(e){return String(v)}};
var send=function(t,a){try{parent.postMessage({__ide:1,t:t,a:Array.prototype.map.call(a,fmt)},'*')}catch(e){}};
['log','info','warn','error','debug'].forEach(function(k){var o=console[k];console[k]=function(){send(k==='debug'?'log':k,arguments);return o.apply(console,arguments)}});
addEventListener('error',function(e){send('error',[e.message+(e.lineno?' (line '+e.lineno+')':'')])});
addEventListener('unhandledrejection',function(e){send('error',['Uncaught (in promise) '+fmt(e.reason)])});
addEventListener('message',function(e){if(!e.data||e.data.__ideEval===undefined)return;try{var r=(0,eval)(e.data.__ideEval);send('result',[r])}catch(err){send('error',[String(err)])}});
})();<\/script>`;

  function attr(tag, name) {
    const m = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(tag);
    return m ? m[1] ?? m[2] ?? m[3] : null;
  }

  function buildPage(entry) {
    const files = project.files;
    const dir = entry.includes('/') ? entry.slice(0, entry.lastIndexOf('/') + 1) : '';
    const resolve = (ref) => {
      if (!ref || /^(?:[a-z][\w+.-]*:|\/\/)/i.test(ref)) return null;
      const clean = ref.split(/[?#]/)[0];
      const p = normalizePath(clean.startsWith('/') ? clean : dir + clean);
      return p in files ? p : null;
    };
    let html = files[entry];
    html = html.replace(/<link\b[^>]*>/gi, (tag) => {
      if (!/\brel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
      const p = resolve(attr(tag, 'href'));
      return p ? `<style data-file="${p}">\n${files[p].replace(/<\/style/gi, '<\\/style')}\n</style>` : tag;
    });
    html = html.replace(/<script\b([^>]*)>\s*<\/script\s*>/gi, (tag, attrs) => {
      const p = resolve(attr(attrs, 'src'));
      if (!p) return tag;
      const rest = attrs.replace(/\bsrc\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i, '');
      return `<script${rest} data-file="${p}">\n${files[p].replace(/<\/script/gi, '<\\/script')}\n</script>`;
    });
    const head = /<head\b[^>]*>/i.exec(html);
    if (head) html = html.slice(0, head.index + head[0].length) + BRIDGE + html.slice(head.index + head[0].length);
    else html = BRIDGE + html;
    return html;
  }

  function runWebPage(html) {
    replMode = 'js';
    $('console-input').placeholder = 'JavaScript › evaluate in page';
    preview.srcdoc = html;
  }

  async function run() {
    if (!project) return;
    await flushSave();
    const path = project.active;
    const files = project.files;
    const l = path ? langOf(path) : 'text';
    if (l === 'py') return runPython(path);
    if (l === 'json') {
      showPanel('console');
      try { JSON.parse(files[path]); log('info', `✔ ${path} is valid JSON`); }
      catch (e) { log('error', `${path}: ${e.message}`); }
      return;
    }
    let entry = l === 'html' ? path : null;
    if (!entry && (l === 'css' || l === 'js' || !path)) {
      entry = ['index.html', ...Object.keys(files).filter((p) => /\.html?$/i.test(p))].find((p) => p in files) || null;
    }
    if (l === 'js' && entry && !new RegExp(`src\\s*=\\s*["']?(?:\\./|/)?${path.split('/').pop().replace(/\./g, '\\.')}`).test(files[entry])) {
      entry = null; // this script isn't used by the page — run it on its own
    }
    if (entry) {
      log('system', `▶ ${entry}`);
      runWebPage(buildPage(entry));
      showPanel('preview');
    } else if (l === 'js') {
      log('system', `▶ node-style run: ${path}`);
      runWebPage(`<!DOCTYPE html><html><head><meta charset="utf-8">${BRIDGE}</head><body style="font-family:system-ui;color:#555;padding:16px">Running <code>${escape(path)}</code> — see the Console tab.<script>\n${files[path].replace(/<\/script/gi, '<\\/script')}\n<\/script></body></html>`);
      showPanel('console');
    } else if (!path) {
      toast('Open a file to run');
    } else {
      toast(`Nothing to run for .${path.split('.').pop()} files — add an index.html`);
    }
  }

  window.addEventListener('message', (e) => {
    if (e.source !== preview.contentWindow) return;
    const d = e.data;
    if (!d || !d.__ide) return;
    if (d.t === 'result') log('log', '← ' + d.a.join(' '));
    else log(d.t, d.a.join(' '));
  });

  // Python runs in a worker with Pyodide.
  let pyWorker = null;
  function setRunning(on) {
    running = on;
    $('btn-stop').hidden = !on;
    $('btn-run').disabled = on;
    $('btn-run').style.opacity = on ? 0.6 : '';
  }
  function ensurePython() {
    if (pyWorker) return pyWorker;
    pyWorker = new Worker('py-worker.js');
    pyWorker.onmessage = (e) => {
      const d = e.data;
      if (d.t === 'done') {
        setRunning(false);
        if (d.ok && d.kind !== 'repl') log('system', '✔ finished');
      } else log(d.t, d.a.join(''));
    };
    pyWorker.onerror = (e) => {
      log('error', 'Python failed to start: ' + (e.message || 'network error') + '\nPython needs an internet connection the first time it runs.');
      setRunning(false);
      pyWorker.terminate();
      pyWorker = null;
    };
    return pyWorker;
  }
  function pyFiles() {
    const out = {};
    for (const [p, v] of Object.entries(project.files)) if (!/\.html?$/i.test(p)) out[p] = v;
    return out;
  }
  function runPython(path) {
    if (running) return;
    replMode = 'py';
    $('console-input').placeholder = 'Python › evaluate';
    showPanel('console');
    log('system', `▶ python ${path}`);
    setRunning(true);
    ensurePython().postMessage({ kind: 'run', code: project.files[path], files: pyFiles(), path });
  }
  function stopPython() {
    if (pyWorker) { pyWorker.terminate(); pyWorker = null; }
    setRunning(false);
    log('warn', '■ Stopped (Python state was reset)');
  }

  $('console-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('console-input');
    const code = input.value;
    if (!code.trim()) return;
    input.value = '';
    log('input', code);
    if (replMode === 'py') {
      if (running) { log('warn', 'Wait for the current run to finish.'); return; }
      setRunning(true);
      ensurePython().postMessage({ kind: 'repl', code });
    } else {
      if (!preview.srcdoc) runWebPage(`<!DOCTYPE html><html><head>${BRIDGE}</head><body></body></html>`);
      const send = () => preview.contentWindow.postMessage({ __ideEval: code }, '*');
      if (preview.contentDocument === null || preview.dataset.ready) send();
      else preview.addEventListener('load', send, { once: true });
    }
  });
  preview.addEventListener('load', () => { preview.dataset.ready = '1'; });

  // --------------------------------------------------------------- top level

  const drawer = makeOverlay(
    () => { $('drawer').classList.add('open'); $('scrim').classList.add('open'); ta.blur(); },
    () => { $('drawer').classList.remove('open'); $('scrim').classList.remove('open'); },
  );
  $('btn-menu').onclick = () => drawer.show();
  $('scrim').onclick = () => drawer.hide();
  $('btn-new-file').onclick = () => newFile();
  $('empty-new').onclick = () => newFile();
  $('btn-import').onclick = () => $('file-input').click();
  $('file-input').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    drawer.hide();
    await importFiles(files);
  });
  $('btn-project-menu').onclick = projectMenu;
  $('project-select').onchange = (e) => { switchProject(e.target.value); drawer.hide(); };
  $('btn-settings').onclick = () => { drawer.hide(); openSettings(); };
  $('btn-undo').addEventListener('pointerdown', (e) => e.preventDefault());
  $('btn-redo').addEventListener('pointerdown', (e) => e.preventDefault());
  $('btn-undo').onclick = () => { ta.focus(); document.execCommand('undo'); };
  $('btn-redo').onclick = () => { ta.focus(); document.execCommand('redo'); };
  $('btn-run').onclick = run;
  $('btn-more').onclick = () => menu('Actions', [
    { icon: '＋', label: 'New file…', run: () => newFile() },
    { icon: '🔍', label: 'Find & replace', run: openFind },
    { icon: '↧', label: 'Go to line…', run: promptGoToLine },
    { icon: '//', label: 'Toggle comment', run: toggleComment },
    lang === 'json' && { icon: '{ }', label: 'Format JSON', run: formatDocument },
    { icon: '⬇', label: 'Download this file', run: () => project.active && download(project.active.split('/').pop(), new Blob([ta.value], { type: 'text/plain' })) },
    { icon: '📦', label: 'Export project as .zip', run: exportZip },
    { icon: '⚙', label: 'Settings', run: openSettings },
    { icon: '?', label: 'Help & shortcuts', run: showHelp },
  ]);

  function showHelp() {
    openDialog(`
      <h3>Pocket IDE</h3>
      <p>Write HTML, CSS, JavaScript and Python on your phone. Everything is stored on this device and works offline (Python downloads once on first run).

• Run: HTML files open in Preview; JS/CSS run through index.html; .py files run with Python.
• Console: type expressions to evaluate them in the page or Python session.
• Key bar: indent, arrows and symbols that are awkward on phone keyboards. Tap a suggestion to complete a word.
• Files: tap ☰. Use “folder/name.ext” to create folders. Import/export whole projects as .zip.
• Install: use “Install app” in the ☰ menu (or Chrome ⋮ → Add to Home screen) for a full-screen app.

Hardware keyboard: Ctrl+Enter run · Ctrl+S save · Ctrl+F find · Ctrl+/ comment · Ctrl+G go to line · Tab / Shift+Tab indent.</p>
      <div class="dialog-actions"><button class="btn primary" value="ok">Got it</button></div>`);
  }

  // Autosave whenever the app goes to the background (Android may kill it).
  document.addEventListener('visibilitychange', () => { if (document.hidden) { captureView(); flushSave(); } });
  window.addEventListener('pagehide', () => flushSave());
  window.addEventListener('resize', () => { if (project && project.active && document.activeElement === ta) scrollToPos(ta.selectionStart); });

  // PWA install prompt
  let installEvent = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installEvent = e;
    $('btn-install').hidden = false;
  });
  $('btn-install').onclick = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice;
    installEvent = null;
    $('btn-install').hidden = true;
  };
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline mode unavailable */ });
  }

  // ---------------------------------------------------------------------- boot

  async function boot() {
    applySettings();
    try {
      await DB.open();
      projects = await DB.all();
    } catch (e) {
      toast('Storage unavailable — changes will not persist');
      DB.put = DB.del = async () => {};
      projects = [];
    }
    if (!projects.length) {
      projects = [newProjectFrom('web', 'Hello Web'), newProjectFrom('python', 'Python Playground'), newProjectFrom('js', 'JS Scratchpad')];
      for (const p of projects) await DB.put(p);
    }
    project = projects.find((p) => p.id === settings.lastProject) || projects[0];
    renderProjects();
    renderFiles();
    openFile(project.active);
    dirty = false;
    updateTitle();
  }
  boot();
})();
