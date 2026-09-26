// Runs Python with Pyodide inside a worker so long scripts don't freeze the UI.
// Pyodide is downloaded on first use (~10 MB) and then cached by the service worker.
'use strict';

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const PROJECT_DIR = '/home/pyodide/project';

let pyodide = null;
let loading = null;

function post(t, text) { postMessage({ t, a: [text] }); }

function load() {
  if (!loading) {
    loading = (async () => {
      post('system', 'Loading Python runtime (first run downloads ~10 MB)…');
      importScripts(PYODIDE_URL + 'pyodide.js');
      pyodide = await loadPyodide({ indexURL: PYODIDE_URL });
      pyodide.setStdout({ batched: (s) => post('log', s) });
      pyodide.setStderr({ batched: (s) => post('error', s) });
      pyodide.setStdin({ error: true });
      post('system', `Python ${pyodide.runPython('import sys; sys.version.split()[0]')} ready.`);
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}

function syncFiles(files) {
  const FS = pyodide.FS;
  try { FS.mkdirTree(PROJECT_DIR); } catch (e) { /* exists */ }
  for (const [path, text] of Object.entries(files)) {
    const full = `${PROJECT_DIR}/${path}`;
    const dir = full.slice(0, full.lastIndexOf('/'));
    try { FS.mkdirTree(dir); } catch (e) { /* exists */ }
    FS.writeFile(full, text);
  }
}

const PRELUDE = `
import os, sys
_d = ${JSON.stringify(PROJECT_DIR)}
os.chdir(_d)
if _d not in sys.path:
    sys.path.insert(0, _d)
for _m in [k for k, v in list(sys.modules.items()) if getattr(v, '__file__', None) and str(v.__file__).startswith(_d)]:
    del sys.modules[_m]
del _d
`;

self.onmessage = async (e) => {
  const { id, kind, code, files, path } = e.data;
  try {
    await load();
    if (files) syncFiles(files);
    pyodide.runPython(PRELUDE);
    await pyodide.loadPackagesFromImports(code, {
      messageCallback: (m) => post('system', m),
      errorCallback: (m) => post('warn', m),
    });
    if (kind === 'repl') {
      const result = await pyodide.runPythonAsync(code);
      if (result !== undefined) {
        const text = pyodide.globals.get('repr')(result);
        if (result && result.destroy) result.destroy();
        post('log', text);
      }
    } else {
      const globals = pyodide.globals.get('dict')();
      globals.set('__name__', '__main__');
      globals.set('__file__', `${PROJECT_DIR}/${path}`);
      await pyodide.runPythonAsync(code, { globals, filename: path });
      // Keep the script's names available to the console REPL afterwards.
      pyodide.globals.update(globals);
      globals.destroy();
    }
    postMessage({ t: 'done', id, ok: true });
  } catch (err) {
    const msg = String(err && err.message ? err.message : err);
    post('error', msg.includes('reading from stdin') ? msg + '\ninput() is not supported yet — set values in code instead.' : msg);
    postMessage({ t: 'done', id, ok: false });
  }
};
