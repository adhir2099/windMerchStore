# windMerchStore Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a clean, responsive, accessible static storefront with working navigation, cart feedback, and newsletter validation.

**Architecture:** Replace template utility markup with semantic HTML, a focused CSS token system, and a small ES module. Product records live in one array and generate the product cards. Pure interaction helpers are exported for Node tests, while DOM binding stays private to the browser module.

**Tech Stack:** HTML5, CSS3, browser-native ES modules, Node.js built-in test runner.

**Spec:** `docs/superpowers/specs/2026-09-12-wind-merch-store-redesign-design.md`

## Global Constraints

- Preserve `index.html`, the root route, the `windMerchStore` wordmark, and Home, Store, Contact labels.
- Use no external JavaScript libraries, inline event handlers, or production build step.
- Use a light theme with one raspberry accent, 16px surface radii, system sans-serif typography, and no em-dashes in page copy.
- Controls require accessible names, visible focus styles, and keyboard operation.
- Multi-column layouts collapse to one column below 768px and transitions disable under reduced motion.

---

### Task 1: Establish testable interaction contracts

**Files:**
- Create: `tests/app.test.mjs`
- Create: `assets/js/app.js`

**Interfaces:**
- Produces: `isValidEmail(value: string): boolean`, `nextCartCount(current: number): number`, and `menuShouldClose(key: string): boolean` exports for browser behavior and tests.

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, menuShouldClose, nextCartCount } from '../assets/js/app.js';

test('accepts a normal customer email and rejects incomplete addresses', () => {
  assert.equal(isValidEmail('hello@windmerch.store'), true);
  assert.equal(isValidEmail('hello@'), false);
  assert.equal(isValidEmail(''), false);
});

test('increments a cart count from its current value', () => {
  assert.equal(nextCartCount(0), 1);
  assert.equal(nextCartCount(4), 5);
});

test('closes expandable menus when Escape is pressed', () => {
  assert.equal(menuShouldClose('Escape'), true);
  assert.equal(menuShouldClose('Enter'), false);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/app.test.mjs`

Expected: FAIL because `assets/js/app.js` does not yet exist.

- [ ] **Step 3: Write minimal implementation**

```js
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function nextCartCount(current) {
  return current + 1;
}

export function menuShouldClose(key) {
  return key === 'Escape';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/app.test.mjs`

Expected: PASS with 3 tests and 0 failures.

### Task 2: Rebuild semantic storefront structure

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `assets/js/app.js` as a module loaded with `<script type="module">`.
- Produces: stable `#home`, `#store`, and `#contact` section anchors; `[data-menu-toggle]`, `[data-mobile-menu]`, `[data-cart-count]`, `[data-product-grid]`, and `[data-newsletter-form]` DOM hooks.

- [ ] **Step 1: Write the failing structural test**

```js
import fs from 'node:fs/promises';

test('exposes the storefront anchors and an accessible newsletter field', async () => {
  const page = await fs.readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(page, /id="home"/);
  assert.match(page, /id="store"/);
  assert.match(page, /id="contact"/);
  assert.match(page, /<label[^>]+for="newsletter-email"/);
  assert.doesNotMatch(page, /onclick=/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/app.test.mjs`

Expected: FAIL because the original page lacks stable section anchors and includes inline click handlers.

- [ ] **Step 3: Replace `index.html` with semantic storefront markup**

Create one header, main landmark, five content sections, and footer. Use buttons for expandable menus, `aria-expanded` state, a labelled cart counter, meaningful image alt text, an `aria-live="polite"` status message, and a labelled newsletter email field. Load only `assets/css/style.css` and `assets/js/app.js`.

- [ ] **Step 4: Run structural test to verify it passes**

Run: `node --test tests/app.test.mjs`

Expected: PASS with all tests green.

### Task 3: Implement responsive visual system and accessible states

**Files:**
- Modify: `assets/css/style.css`

**Interfaces:**
- Consumes: semantic class names and data hooks from `index.html`.
- Produces: responsive layout, high-contrast interactive states, one-theme token system, and reduced-motion fallback.

- [ ] **Step 1: Add a failing static style assertion**

```js
test('includes mobile and reduced-motion fallbacks', async () => {
  const styles = await fs.readFile(new URL('../assets/css/style.css', import.meta.url), 'utf8');
  assert.match(styles, /@media \(max-width: 767px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /:focus-visible/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/app.test.mjs`

Expected: FAIL because the original stylesheet has no mobile, reduced-motion, or focus-visible rules.

- [ ] **Step 3: Build the CSS token and layout system**

Define semantic color, spacing, radius, and shadow custom properties. Implement the editorial hero, asymmetric category collection, product grid, value list, newsletter block, responsive header and menu, tactile hover/active states, and explicit one-column mobile rules.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/app.test.mjs`

Expected: PASS with all tests green.

### Task 4: Bind product rendering and interactions

**Files:**
- Modify: `assets/js/app.js`

**Interfaces:**
- Consumes: product grid, menus, cart, and newsletter DOM hooks from `index.html`.
- Produces: rendered product cards, controlled menu state, cart updates, and newsletter feedback.

- [ ] **Step 1: Add failing DOM-independent tests**

```js
test('does not treat whitespace-only input as a valid email', () => {
  assert.equal(isValidEmail('   '), false);
});

test('increments cart count from a non-zero cart', () => {
  assert.equal(nextCartCount(9), 10);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/app.test.mjs`

Expected: FAIL until the exported helpers handle the new input cases.

- [ ] **Step 3: Implement browser initialization**

Render the four product records into `[data-product-grid]`, attach events after DOM load, synchronize `aria-expanded`, close menus on Escape and outside pointer interaction, increment and announce cart changes, and validate newsletter submission without network submission.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/app.test.mjs`

Expected: PASS with 5 tests and 0 failures.

### Task 5: Verify the static site end-to-end

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: final page, styles, and browser module.
- Produces: concise local-preview and test instructions.

- [ ] **Step 1: Update README usage instructions**

Document the static-site architecture, browser module behavior, and test command:

```text
node --test tests/app.test.mjs
```

- [ ] **Step 2: Run the complete automated suite**

Run: `node --test tests/app.test.mjs`

Expected: PASS with 5 tests and 0 failures.

- [ ] **Step 3: Validate markup and source hygiene**

Run: `node --check assets/js/app.js; rg -n "onclick=|javascript:;|animate__|tailwindcss\.js" index.html assets/css/style.css assets/js/app.js`

Expected: JavaScript syntax check succeeds and `rg` reports no matches.

- [ ] **Step 4: Inspect in a browser**

Open the page at desktop and a 390px-wide viewport. Verify header navigation, menus, add-to-cart feedback, newsletter validation, keyboard focus, and the one-column mobile fallback.
