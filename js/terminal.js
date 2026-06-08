(function () {
  'use strict';

  const TASKS = [
    {
      title: 'refactor auth middleware',
      prompt: 'refactor this auth middleware to use async/await',
      thinkingMs: 900,
      output: [
        { type: 'out', text: 'Analyzing src/middleware/auth.js …' },
        { type: 'out', text: 'Found 4 callback-style handlers in 187 lines.' },
        { type: 'out', text: '' },
        { type: 'info', text: '  ~ src/middleware/auth.js' },
        { type: 'removed', text: '  - exports.verify = (token, cb) => {' },
        { type: 'removed', text: '  -   jwt.verify(token, SECRET, (e, d) => cb(e, d))' },
        { type: 'removed', text: '  - }' },
        { type: 'added', text: '  + exports.verify = async (token) => {' },
        { type: 'added', text: '  +   return await jwt.verify(token, SECRET);' },
        { type: 'added', text: '  + }' },
        { type: 'out', text: '' },
        { type: 'success', text: '✓ Refactored 4 handlers · 0 lint errors · 12 tests pass' }
      ]
    },
    {
      title: 'add error handling to fetchUser',
      prompt: 'add error handling to fetchUser',
      thinkingMs: 750,
      output: [
        { type: 'out', text: 'Inspecting src/api/users.js …' },
        { type: 'out', text: 'fetchUser has no try/catch — risk of unhandled rejection.' },
        { type: 'out', text: '' },
        { type: 'info', text: '  ~ src/api/users.js' },
        { type: 'added', text: '  + try {' },
        { type: 'added', text: '  +   const res = await fetch(`/users/${id}`);' },
        { type: 'added', text: '  +   if (!res.ok) throw new UserError(res.status);' },
        { type: 'added', text: '  +   return await res.json();' },
        { type: 'added', text: '  + } catch (e) {' },
        { type: 'added', text: '  +   logger.error({ err: e, id });' },
        { type: 'added', text: '  +   throw e;' },
        { type: 'added', text: '  + }' },
        { type: 'out', text: '' },
        { type: 'success', text: '✓ Added try/catch + UserError class · 3 new tests pass' }
      ]
    },
    {
      title: 'find all TODO comments',
      prompt: 'find all TODO comments in src/',
      thinkingMs: 600,
      output: [
        { type: 'out', text: 'Grepping 142 files for /TODO|FIXME|XXX/ …' },
        { type: 'out', text: '' },
        { type: 'info', text: '  src/api/users.js:42   // TODO: rate limit' },
        { type: 'info', text: '  src/api/posts.js:18   // FIXME: handle empty body' },
        { type: 'info', text: '  src/utils/parse.ts:91 // TODO: replace regex' },
        { type: 'info', text: '  src/db/index.js:7     // XXX: swap to prepared stmts' },
        { type: 'info', text: '  src/cli/run.ts:23     // TODO: surface errors' },
        { type: 'out', text: '' },
        { type: 'out', text: '5 matches across 5 files.' },
        { type: 'success', text: '✓ Done in 0.18s' }
      ]
    },
    {
      title: 'explain this regex',
      prompt: 'explain what this regex does',
      thinkingMs: 800,
      output: [
        { type: 'out', text: 'Pattern: /^(?:\+?(\\d{1,3}))?[-. ]?(\\d{3})[-. ]?(\\d{3})[-. ]?(\\d{4})$/' },
        { type: 'out', text: '' },
        { type: 'info', text: '  ^         start of string' },
        { type: 'info', text: '  (\\+?\\d{1,3})?   optional country code (1-3 digits, optional +)' },
        { type: 'info', text: '  [-. ]?    optional separator' },
        { type: 'info', text: '  (\\d{3})   area code' },
        { type: 'info', text: '  [-. ]?    optional separator' },
        { type: 'info', text: '  (\\d{3})   exchange code' },
        { type: 'info', text: '  [-. ]?    optional separator' },
        { type: 'info', text: '  (\\d{4})$  subscriber number, end of string' },
        { type: 'out', text: '' },
        { type: 'success', text: '✓ Matches US-style phone numbers (with optional +country)' }
      ]
    },
    {
      title: 'write unit tests for parse.ts',
      prompt: 'write unit tests for utils/parse.ts',
      thinkingMs: 1100,
      output: [
        { type: 'out', text: 'Reading utils/parse.ts — 3 exported functions.' },
        { type: 'out', text: 'Detected test runner: vitest.' },
        { type: 'out', text: '' },
        { type: 'info', text: '  + tests/parse.test.ts' },
        { type: 'added', text: '  + import { describe, it, expect } from "vitest";' },
        { type: 'added', text: '  + import { parseQuery, parseDate, safeJson } from "../utils/parse";' },
        { type: 'added', text: '  + describe("parseQuery", () => {' },
        { type: 'added', text: '  +   it("parses key=value pairs", () => {' },
        { type: 'added', text: '  +     expect(parseQuery("a=1&b=2")).toEqual({a:"1",b:"2"});' },
        { type: 'added', text: '  +   });' },
        { type: 'added', text: '  +   // … 11 more cases' },
        { type: 'out', text: '' },
        { type: 'success', text: '✓ Wrote 14 tests · 14 passing · coverage 100%' }
      ]
    }
  ];

  const TYPEWRITER_MS = 28;
  const LINE_STAGGER_MS = 55;
  const PAUSE_BETWEEN_MS = 2200;

  const body = document.getElementById('terminalBody');
  const title = document.getElementById('terminalTitle');
  if (!body) return;

  function escapeHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function addLine(text, cls) {
    const el = document.createElement('div');
    el.className = 'terminal-line' + (cls ? ' ' + cls : '');
    el.innerHTML = text;
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }

  function typeInto(el, text, ms) {
    return new Promise((resolve) => {
      let i = 0;
      el.innerHTML = '<span class="cursor"></span>';
      const tick = () => {
        if (i <= text.length) {
          const visible = escapeHtml(text.slice(0, i));
          el.innerHTML = visible + '<span class="cursor"></span>';
          i++;
          setTimeout(tick, ms);
        } else {
          el.innerHTML = escapeHtml(text);
          resolve();
        }
      };
      tick();
    });
  }

  function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

  function clearTerminal() {
    body.innerHTML = '';
  }

  function pickTask() {
    return TASKS[Math.floor(Math.random() * TASKS.length)];
  }

  async function runTask(task) {
    clearTerminal();
    title.textContent = '~/projects/arc-demo — arc ' + task.title;

    const promptLine = addLine('<span class="prompt">$</span>', '');
    await typeInto(promptLine, 'arc "' + task.prompt + '"', TYPEWRITER_MS);

    addLine('', '');

    const thinking = addLine('Thinking…', 'thinking');
    await delay(task.thinkingMs);
    thinking.remove();

    for (const out of task.output) {
      const escaped = escapeHtml(out.text);
      addLine(escaped, out.type);
      await delay(LINE_STAGGER_MS);
    }

    await delay(PAUSE_BETWEEN_MS);
  }

  let stopped = false;
  function stop() { stopped = true; }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    addLine('<span class="prompt">$</span> arc "hello"', '');
    addLine('Animation disabled (prefers-reduced-motion).', 'info');
    return;
  }

  (async function loop() {
    const seen = new Set();
    while (!stopped) {
      let task = pickTask();
      let guard = 0;
      while (seen.has(task) && guard < 10) { task = pickTask(); guard++; }
      seen.add(task);
      if (seen.size === TASKS.length) seen.clear();
      await runTask(task);
    }
  })();

  window.__arcTerminalStop = stop;
})();
