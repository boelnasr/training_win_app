// Lightweight regex-based syntax highlighter.
// Every rule regex must use only non-capturing groups, because the rules are
// joined into one alternation and matched by capture-group index.
(function (global) {
  'use strict';

  const esc = (s) => s.replace(/[&<>]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'));
  const span = (cls, text) => `<span class="tk-${cls}">${esc(text)}</span>`;
  const words = (list) => `\\b(?:${list.split(' ').join('|')})\\b`;

  function compile(rules) {
    return { re: new RegExp(rules.map(([, r]) => `(${r})`).join('|'), 'gm'), classes: rules.map(([c]) => c) };
  }

  function tokenize(code, lang) {
    const { re, classes } = lang;
    re.lastIndex = 0;
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(code))) {
      if (m[0] === '') { re.lastIndex++; continue; }
      out += esc(code.slice(last, m.index));
      let i = 1;
      while (m[i] === undefined) i++;
      out += span(classes[i - 1], m[0]);
      last = m.index + m[0].length;
    }
    return out + esc(code.slice(last));
  }

  const STR_DQ = '"(?:\\\\.|[^\\\\"\\n])*"?';
  const STR_SQ = "'(?:\\\\.|[^\\\\'\\n])*'?";
  const NUM = '\\b(?:0[xXbBoO][\\da-fA-F_]+|\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?n?)\\b';

  const JS = compile([
    ['comment', '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?(?:\\*\\/|$(?![\\s\\S]))'],
    ['string', '`(?:\\\\[\\s\\S]|[^\\\\`])*`?|' + STR_DQ + '|' + STR_SQ],
    ['number', NUM],
    ['keyword', words('async await break case catch class const continue debugger default delete do else export extends finally for from function if import in instanceof let new of return static super switch throw try typeof var void while with yield get set')],
    ['literal', words('true false null undefined this NaN Infinity')],
    ['func', '\\b[A-Za-z_$][\\w$]*(?=\\s*\\()'],
    ['type', '\\b[A-Z][\\w$]*\\b'],
    ['op', '=>|[-+*/%=!<>&|^~?:]+'],
  ]);

  const PY = compile([
    ['comment', '#[^\\n]*'],
    ['string', '(?:\\b[rRbBfFuU]{1,2})?(?:"""[\\s\\S]*?(?:"""|$(?![\\s\\S]))|\'\'\'[\\s\\S]*?(?:\'\'\'|$(?![\\s\\S]))|' + STR_DQ + '|' + STR_SQ + ')'],
    ['decorator', '@[\\w.]+'],
    ['number', NUM + 'j?'],
    ['keyword', words('and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case')],
    ['literal', words('True False None self cls')],
    ['builtin', words('print len range int str float list dict set tuple bool type isinstance enumerate zip map filter sorted sum min max abs open input super object Exception ValueError TypeError KeyError IndexError round any all reversed repr hasattr getattr setattr')],
    ['func', '\\b[A-Za-z_]\\w*(?=\\s*\\()'],
    ['type', '\\b[A-Z]\\w*\\b'],
    ['op', '[-+*/%=!<>&|^~:]+'],
  ]);

  const CSS = compile([
    ['comment', '\\/\\*[\\s\\S]*?(?:\\*\\/|$(?![\\s\\S]))'],
    ['string', STR_DQ + '|' + STR_SQ],
    ['keyword', '@[\\w-]+|!important'],
    ['attr', '(?<=[{;]\\s*)--?[\\w-]+(?=\\s*:)|(?<=[{;]\\s*)[a-zA-Z-]+(?=\\s*:)'],
    ['number', '#[\\da-fA-F]{3,8}\\b|-?(?:\\d*\\.)?\\d+(?:px|em|rem|%|vh|vw|dvh|vmin|vmax|s|ms|deg|fr|ch|pt)?\\b'],
    ['func', '[\\w-]+(?=\\()'],
    ['tag', '[.#][\\w-]+|::?[\\w-]+'],
  ]);

  const JSON_ = compile([
    ['attr', STR_DQ.replace(/\?$/, '') + '(?=\\s*:)'],
    ['string', STR_DQ],
    ['number', '-?' + NUM],
    ['literal', words('true false null')],
  ]);

  const MD = compile([
    ['comment', '^```[\\s\\S]*?(?:^```|$(?![\\s\\S]))'],
    ['keyword', '^#{1,6} [^\\n]*'],
    ['string', '`[^`\\n]+`'],
    ['type', '\\*\\*[^*\\n]+\\*\\*|__[^_\\n]+__'],
    ['func', '\\[[^\\]\\n]*\\]\\([^)\\n]*\\)'],
    ['op', '^\\s*(?:[-*+]|\\d+\\.)(?= )|^>'],
  ]);

  function highlightTag(tag) {
    const m = /^(<\/?)([\w:-]*)([\s\S]*?)(\/?>)?$/.exec(tag);
    if (!m) return esc(tag);
    let out = span('op', m[1]) + span('tag', m[2]);
    out += m[3].replace(/([^\s=]+)(\s*=\s*)?("[^"]*"?|'[^']*'?|[^\s"'>]+)?|([^\S\n]+|\n)/g, (all, name, eq, val, ws) => {
      if (ws !== undefined) return ws;
      return span('attr', name) + (eq ? esc(eq) : '') + (val ? span('string', val) : '');
    });
    return out + (m[4] ? span('op', m[4]) : '');
  }

  function highlightHTML(code) {
    const re = /<!--[\s\S]*?(?:-->|$(?![\s\S]))|<(script|style)\b[^>]*>[\s\S]*?(?:<\/\1\s*>|$(?![\s\S]))|<!doctype[^>]*>|<\/?[A-Za-z][^<>]*>?|&[#\w]+;/gi;
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      const t = m[0];
      if (t.startsWith('<!--')) out += span('comment', t);
      else if (t[0] === '&') out += span('literal', t);
      else if (/^<!doctype/i.test(t)) out += span('keyword', t);
      else if (m[1]) {
        const openEnd = t.indexOf('>') + 1;
        const closeRe = new RegExp(`</${m[1]}\\s*>$`, 'i');
        const close = closeRe.exec(t);
        const bodyEnd = close ? close.index : t.length;
        out += highlightTag(t.slice(0, openEnd));
        const body = t.slice(openEnd, bodyEnd);
        out += tokenize(body, m[1].toLowerCase() === 'style' ? CSS : JS);
        if (close) out += highlightTag(close[0]);
      } else out += highlightTag(t);
      last = m.index + t.length;
    }
    return out + esc(code.slice(last));
  }

  const LANGS = {
    js: JS, mjs: JS, cjs: JS, ts: JS, jsx: JS, tsx: JS,
    py: PY, css: CSS, json: JSON_, md: MD, markdown: MD,
  };

  function langOf(path) {
    const ext = (path.split('.').pop() || '').toLowerCase();
    if (ext === 'html' || ext === 'htm' || ext === 'svg' || ext === 'xml') return 'html';
    return LANGS[ext] ? ext : 'text';
  }

  function highlight(code, lang) {
    if (lang === 'html') return highlightHTML(code);
    const l = LANGS[lang];
    return l ? tokenize(code, l) : esc(code);
  }

  const KEYWORDS = {
    js: 'const let function return async await class extends import export default document window console querySelector addEventListener forEach length push true false null undefined',
    py: 'def return class import from print range len self True False None elif else while for lambda yield with except finally raise',
    css: 'display flex grid color background margin padding border width height position absolute relative font-size font-weight justify-content align-items transition transform',
    html: 'div span section header footer main button input label script style class href src',
  };

  global.Highlighter = { highlight, langOf, escape: esc, KEYWORDS };
})(self);
