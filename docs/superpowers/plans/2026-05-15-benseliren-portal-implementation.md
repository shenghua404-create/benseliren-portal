# 本色丽人门户网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a high-end single-page React portal website for 本色丽人 with OEM/ODM lead generation and owned product presentation.

**Architecture:** The app is a static React + Vite site with componentized sections, centralized content data, CSS design tokens, and a GitHub Pages workflow. Tests cover key rendered content, navigation targets, and the consultation form success state.

**Tech Stack:** React, Vite, Vitest, Testing Library, CSS modules via plain CSS, GitHub Actions, GitHub Pages.

---

## File Structure

- Create `package.json`: npm scripts and dependencies.
- Create `vite.config.js`: React plugin, Vitest config, relative asset base for GitHub Pages.
- Create `index.html`: Vite app root and Chinese metadata.
- Create `.github/workflows/deploy-pages.yml`: build and deploy static site to GitHub Pages.
- Create `src/main.jsx`: React entry.
- Create `src/App.jsx`: page composition and form state.
- Create `src/data/siteContent.js`: navigation, services, products, process, philosophy, contact data.
- Create `src/components/*.jsx`: focused presentational components.
- Create `src/styles/global.css`: design tokens, layout, responsive styles, motion, form states.
- Create `src/test/setup.js`: Vitest DOM matchers.
- Create `src/App.test.jsx`: behavior tests for page content, anchor navigation, and form status.
- Modify `.gitignore`: keep build, dependencies, and local-only files ignored.

## Task 1: Project Scaffold And Test Harness

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/test/setup.js`

- [ ] **Step 1: Create npm and Vite configuration**

Add scripts:

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Use `base: './'` in `vite.config.js` so built assets work under any GitHub Pages project path.

- [ ] **Step 2: Install dependencies**

Run: `npm install`

Expected: dependency tree is installed and `package-lock.json` is created.

- [ ] **Step 3: Verify test harness has no tests yet**

Run: `npm test -- --passWithNoTests`

Expected: Vitest starts successfully and reports no tests.

- [ ] **Step 4: Commit scaffold**

Run:

```bash
git add package.json package-lock.json vite.config.js index.html src/test/setup.js
git commit -m "chore: scaffold React portal app"
```

## Task 2: RED Tests For Portal Behavior

**Files:**
- Create: `src/App.test.jsx`

- [ ] **Step 1: Write failing render and form tests**

Create tests that import `App` and assert:

```jsx
expect(screen.getByRole('heading', { name: /以东方肤感与现代配方/ })).toBeInTheDocument();
expect(screen.getByRole('link', { name: '开启品牌共创' })).toHaveAttribute('href', '#contact');
expect(screen.getByText('OEM/ODM 代加工')).toBeInTheDocument();
expect(screen.getByText('舒缓修护系列')).toBeInTheDocument();
expect(screen.getByText('1. 需求沟通')).toBeInTheDocument();
```

Also test filling the consultation form and submitting it shows:

```text
咨询信息已记录在当前页面，请通过下方联系方式继续沟通。
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test`

Expected: FAIL because `src/App.jsx` does not exist yet.

## Task 3: Implement Page Components And Content

**Files:**
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/data/siteContent.js`
- Create: `src/components/NavBar.jsx`
- Create: `src/components/Hero.jsx`
- Create: `src/components/DualEntry.jsx`
- Create: `src/components/CapabilitySection.jsx`
- Create: `src/components/ProductSeries.jsx`
- Create: `src/components/ProcessSection.jsx`
- Create: `src/components/PhilosophyContact.jsx`

- [ ] **Step 1: Add centralized content data**

Define arrays for nav items, capabilities, product series, process steps, and philosophy text using the approved Chinese copy.

- [ ] **Step 2: Add React components**

Implement each section as a focused component that receives data via props. Keep visible text code-native and do not place critical content inside images.

- [ ] **Step 3: Add form state**

In `App.jsx`, manage a local `submitted` state. On form submit, call `preventDefault()` and render the approved success message.

- [ ] **Step 4: Run tests and verify GREEN**

Run: `npm test`

Expected: all tests pass.

- [ ] **Step 5: Commit page behavior**

Run:

```bash
git add src
git commit -m "feat: build portal content and form behavior"
```

## Task 4: Visual System And Responsive Styling

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/main.jsx`
- Modify: `src/components/*.jsx`

- [ ] **Step 1: Add design tokens**

Set CSS custom properties for:

```css
--ink: #1b1714;
--paper: #fbfaf7;
--surface: #f4eee8;
--clay: #bd8177;
--jade: #647866;
--gold: #c8a86a;
--muted: #756a62;
```

- [ ] **Step 2: Style desktop layout**

Implement the approved Eastern skincare aesthetic: dark warm hero, product still-life visual, dual entry module, capability strip, product grid, rose-clay process band, green philosophy panel, and consultation form.

- [ ] **Step 3: Style mobile layout**

Use responsive grids, prevent horizontal overflow, keep buttons stacked when needed, and ensure every form control has stable height and readable text.

- [ ] **Step 4: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: tests and build pass.

- [ ] **Step 5: Commit visual implementation**

Run:

```bash
git add src
git commit -m "style: add responsive skincare visual system"
```

## Task 5: GitHub Pages Deployment Configuration

**Files:**
- Create: `.github/workflows/deploy-pages.yml`
- Modify: `package.json` if needed

- [ ] **Step 1: Add GitHub Pages workflow**

Use official Pages deployment actions:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: false
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Run final local verification**

Run:

```bash
npm test
npm run build
```

Expected: both pass.

- [ ] **Step 3: Commit deployment configuration**

Run:

```bash
git add .github package.json package-lock.json vite.config.js
git commit -m "ci: configure GitHub Pages deployment"
```

## Task 6: Push And Deploy

**Files:**
- No code files expected.

- [ ] **Step 1: Confirm GitHub auth**

Run: `gh auth status`

Expected: GitHub CLI is authenticated.

- [ ] **Step 2: Create or connect repository**

If no remote exists, create a public repo named `benseliren-portal`:

```bash
gh repo create benseliren-portal --public --source . --remote origin --push
```

If `origin` already exists, push:

```bash
git push -u origin main
```

- [ ] **Step 3: Enable Pages workflow deployment**

Use GitHub repo settings or GitHub API to enable Pages with workflow deployment if it is not already enabled.

- [ ] **Step 4: Trigger and inspect deployment**

Run:

```bash
gh workflow run "Deploy to GitHub Pages"
gh run list --workflow "Deploy to GitHub Pages" --limit 1
```

Expected: workflow starts and eventually reports success.

## Self-Review

- Spec coverage: all requested single-page sections, React/Vite stack, GitHub Pages deployment, no fake credentials or fake certifications are covered.
- Placeholder scan: no TBD/TODO/fill-later steps remain.
- Type consistency: tests expect `App`, visible Chinese copy, and local form status implemented in Task 3.
