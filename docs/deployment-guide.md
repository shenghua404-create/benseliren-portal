# 本色丽人门户网站部署文档

日期：2026-05-15  
项目：本色丽人护肤品门户网站  
仓库：<https://github.com/shenghua404-create/benseliren-portal>  
线上地址：<https://shenghua404-create.github.io/benseliren-portal/>

这份文档面向前端开发工程师，重点解释从本地 React/Vite 项目到 GitHub Pages 线上站点的完整部署链路。

## 1. 当前部署结论

本项目已经完成自动化部署。

当前链路是：

```text
本地代码
  -> git commit
  -> git push origin main
  -> GitHub Actions 自动执行测试和构建
  -> 上传 dist 作为 GitHub Pages artifact
  -> GitHub Pages 发布到线上 URL
```

已验证：

- `npm test` 通过，当前 2 个测试。
- `npm run build` 通过，产物在 `dist/`。
- GitHub Actions 最新 Pages 部署成功。
- 线上首页、CSS、JS、favicon、首屏产品图均返回 HTTP 200。

## 2. 这个项目为什么适合 GitHub Pages

GitHub Pages 适合静态站点。

本项目是 React + Vite 构建出的静态网站。生产构建后，Vite 会输出：

```text
dist/
  index.html
  assets/*.css
  assets/*.js
  images/hero-product-still-life.png
  favicon.svg
```

这些文件不依赖 Node 服务端，不需要数据库，不需要后端运行时。因此 GitHub Pages 可以直接托管。

限制也要清楚：

- GitHub Pages 只能托管静态资源。
- 当前咨询表单只是前端状态提示，不会真实保存数据。
- 如果后续要真实收集表单，需要接后端、第三方表单服务，或迁移到 Netlify/Vercel/自有服务器。
- GitHub Pages 不适合 PHP、Ruby、Python 这类服务端语言运行环境。

## 3. 关键文件说明

### 3.1 `package.json`

部署依赖这些脚本：

```json
{
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run"
  }
}
```

常用命令：

```bash
npm install
npm test
npm run build
npm run dev
```

部署时 GitHub Actions 用的是：

```bash
npm ci
npm test
npm run build
```

`npm ci` 和 `npm install` 的区别：

- `npm install`：本地开发常用，会根据 `package.json` 和锁文件解析依赖。
- `npm ci`：CI 环境常用，严格按 `package-lock.json` 安装，结果更可复现。

### 3.2 `vite.config.js`

当前配置：

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```

这里最关键的是：

```js
base: './'
```

GitHub Pages 的项目站点 URL 是：

```text
https://shenghua404-create.github.io/benseliren-portal/
```

它不是根域名 `/`，而是挂在 `/benseliren-portal/` 这个子路径下。

如果 Vite 默认使用：

```js
base: '/'
```

构建后的资源可能会指向：

```text
/assets/index-xxx.js
```

浏览器会去请求：

```text
https://shenghua404-create.github.io/assets/index-xxx.js
```

这就错了，因为真实资源在：

```text
https://shenghua404-create.github.io/benseliren-portal/assets/index-xxx.js
```

所以这里用 `base: './'`，让构建后的资源采用相对路径，适配 GitHub Pages 项目站点。

### 3.3 `.github/workflows/deploy-pages.yml`

这是自动部署的核心文件。

当前 workflow：

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
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Configure Pages
        uses: actions/configure-pages@v5
        with:
          enablement: true

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 4. Workflow 每一步到底做什么

### 4.1 触发条件

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

含义：

- 推送到 `main` 分支时自动部署。
- 也可以在 GitHub Actions 页面手动点 Run workflow。

常见使用方式：

```bash
git add .
git commit -m "feat: update homepage"
git push
```

只要 push 到 `main`，GitHub Actions 就会自动跑。

### 4.2 权限

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

这三项很关键：

- `contents: read`：允许 workflow 读取仓库代码。
- `pages: write`：允许 workflow 写入 Pages 部署。
- `id-token: write`：允许部署动作使用 OIDC 令牌完成 Pages 发布。

如果缺少 `pages: write` 或 `id-token: write`，`deploy-pages` 通常会失败。

### 4.3 build job

`build` job 负责把源码变成静态产物。

步骤：

1. `actions/checkout@v4`：把仓库代码拉到 GitHub runner。
2. `actions/setup-node@v4`：安装 Node 环境。
3. `npm ci`：按锁文件安装依赖。
4. `npm test`：跑测试，测试失败就停止部署。
5. `npm run build`：生成 `dist/`。
6. `actions/configure-pages@v5`：准备 GitHub Pages 元信息。
7. `actions/upload-pages-artifact@v4`：把 `dist/` 打包上传为 Pages artifact。

### 4.4 deploy job

```yaml
deploy:
  needs: build
```

`needs: build` 表示 deploy 必须等 build 完成后再执行。

部署步骤：

```yaml
- name: Deploy to GitHub Pages
  id: deployment
  uses: actions/deploy-pages@v4
```

它会拿 build 阶段上传的 artifact，把里面的静态文件发布到 GitHub Pages。

## 5. 第一次从本地自动创建仓库并部署

下面是完整自动化流程。

### 5.1 安装 GitHub CLI

如果 Windows 有 `winget`：

```powershell
winget install --id GitHub.cli
```

如果没有 `winget`，可以下载 GitHub CLI 的 Windows MSI 安装包。

本项目实际安装的是：

```text
gh version 2.92.0
```

安装后检查：

```powershell
gh --version
```

### 5.2 登录 GitHub

检查登录状态：

```powershell
gh auth status
```

如果没登录：

```powershell
gh auth login
```

建议选择：

```text
GitHub.com
HTTPS
Login with a web browser
```

登录后应看到类似：

```text
Logged in to github.com account <your-user>
Token scopes: repo, workflow
```

需要的权限重点是：

- `repo`：创建/推送仓库。
- `workflow`：推送 GitHub Actions workflow 文件。

### 5.3 初始化本地仓库

如果项目还不是 Git 仓库：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

本项目已经完成初始化和提交。

### 5.4 创建 GitHub 仓库并推送

从当前本地仓库直接创建远程仓库：

```bash
gh repo create benseliren-portal --public --source . --remote origin --push
```

参数解释：

- `benseliren-portal`：仓库名。
- `--public`：创建公开仓库。GitHub Free 下公开仓库最适合 Pages。
- `--source .`：用当前目录作为仓库来源。
- `--remote origin`：自动添加远程名 `origin`。
- `--push`：创建完远程仓库后立刻推送本地提交。

如果远程仓库已经存在，只需要：

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

## 6. 首次启用 GitHub Pages

这是本次部署最容易踩坑的地方。

新仓库刚创建时，GitHub Pages 站点可能还不存在。此时 workflow 中的：

```yaml
- name: Configure Pages
  uses: actions/configure-pages@v5
```

可能报错：

```text
Get Pages site failed
Please verify that the repository has Pages enabled
```

我们给 `configure-pages` 加了：

```yaml
with:
  enablement: true
```

但实际第二次仍失败了：

```text
Create Pages site failed.
Resource not accessible by integration
```

原因是：workflow 自带的 `GITHUB_TOKEN` 在新仓库首次创建 Pages site 时权限不足。

解决方式是用已登录的 `gh` CLI，也就是你的 GitHub 账号权限，调用 GitHub Pages API 启用 Pages：

```bash
gh api --method POST repos/shenghua404-create/benseliren-portal/pages -f build_type=workflow
```

成功后返回里会包含：

```json
{
  "html_url": "https://shenghua404-create.github.io/benseliren-portal/",
  "build_type": "workflow",
  "https_enforced": true
}
```

启用后，重新触发 workflow：

```bash
gh workflow run "Deploy to GitHub Pages" --repo shenghua404-create/benseliren-portal
```

查看运行：

```bash
gh run list --repo shenghua404-create/benseliren-portal --workflow "Deploy to GitHub Pages" --limit 3
```

等待完成：

```bash
gh run watch <run-id> --repo shenghua404-create/benseliren-portal --exit-status
```

## 7. 日常发布流程

以后你改代码，不需要重复创建仓库，也不需要重复启用 Pages。

日常流程：

```bash
npm test
npm run build
git status
git add .
git commit -m "feat: update site content"
git push
```

推送后自动部署。

检查部署：

```bash
gh run list --repo shenghua404-create/benseliren-portal --workflow "Deploy to GitHub Pages" --limit 3
```

看具体日志：

```bash
gh run view <run-id> --repo shenghua404-create/benseliren-portal --log-failed
```

打开线上：

```text
https://shenghua404-create.github.io/benseliren-portal/
```

## 8. 如何验证线上不是“空壳”

只看首页 HTTP 200 不够。需要确认 HTML、JS、CSS、图片都可访问。

首页：

```powershell
Invoke-WebRequest -Uri 'https://shenghua404-create.github.io/benseliren-portal/' -UseBasicParsing
```

资源：

```powershell
$base='https://shenghua404-create.github.io/benseliren-portal/'
$html=(Invoke-WebRequest -Uri $base -UseBasicParsing).Content
$paths=@()
$paths += [regex]::Matches($html,'(?:src|href)="([^"#]+)"') |
  ForEach-Object { $_.Groups[1].Value } |
  Where-Object { $_ -match '^(\./)?(assets|images|favicon)' }
$paths += 'images/hero-product-still-life.png'
$paths = $paths | Sort-Object -Unique
foreach ($path in $paths) {
  $uri = [System.Uri]::new([System.Uri]$base, $path).AbsoluteUri
  $res = Invoke-WebRequest -Uri $uri -UseBasicParsing
  [pscustomobject]@{ Uri=$uri; StatusCode=$res.StatusCode; Length=$res.RawContentLength }
}
```

正常结果应该看到：

```text
index css     200
index js      200
favicon.svg   200
hero image    200
```

## 9. 常见问题与排查

### 9.1 `Repository not found`

错误：

```text
remote: Repository not found.
fatal: repository 'https://github.com/...git/' not found
```

常见原因：

- GitHub 上还没创建这个仓库。
- remote URL 写错。
- 当前登录账号没有访问权限。

排查：

```bash
git remote -v
gh auth status
gh repo view <owner>/<repo>
```

修复：

```bash
gh repo create <repo> --public --source . --remote origin --push
```

或者改 remote：

```bash
git remote set-url origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

### 9.2 `Get Pages site failed`

错误：

```text
Get Pages site failed. Please verify that the repository has Pages enabled
```

含义：仓库还没有启用 Pages。

修复：

```bash
gh api --method POST repos/<owner>/<repo>/pages -f build_type=workflow
```

然后重新跑：

```bash
gh workflow run "Deploy to GitHub Pages" --repo <owner>/<repo>
```

### 9.3 `Resource not accessible by integration`

错误：

```text
Create Pages site failed. Resource not accessible by integration
```

含义：GitHub Actions 自带的 `GITHUB_TOKEN` 权限不够，尤其是新仓库首次创建 Pages site 时。

修复：用你的登录账号权限在本地执行：

```bash
gh api --method POST repos/<owner>/<repo>/pages -f build_type=workflow
```

这一步只需要首次启用时做一次。

### 9.4 页面打开了，但样式或 JS 丢失

症状：

- 页面只有 HTML，没有样式。
- 控制台 404：`/assets/index-xxx.js` 或 `/assets/index-xxx.css`。

常见原因：Vite `base` 配错。

GitHub Pages 项目站点通常在：

```text
https://<owner>.github.io/<repo>/
```

不是：

```text
https://<owner>.github.io/
```

修复：

```js
export default defineConfig({
  base: './'
});
```

或者更明确地写：

```js
export default defineConfig({
  base: '/benseliren-portal/'
});
```

本项目使用 `base: './'`，迁移仓库名时更省心。

### 9.5 Actions 测试通过但线上没变

可能原因：

- 浏览器缓存。
- 看的不是最新 Pages URL。
- workflow 还没部署完成。
- push 到了非 `main` 分支。

排查：

```bash
git branch --show-current
git status --short --branch
gh run list --repo <owner>/<repo> --workflow "Deploy to GitHub Pages" --limit 3
```

GitHub 官方说明，Pages 更新可能需要等待一段时间。实际项目里通常几十秒到几分钟。

### 9.6 Actions 里出现 Node.js 20 deprecation annotation

本次最新 workflow 成功，但 GitHub Actions 日志里出现过提示：

```text
Node.js 20 actions are deprecated...
Actions will be forced to run with Node.js 24...
```

这不是项目 Node 版本失败，也不影响当前部署。它提示的是某些 GitHub Action 自身运行时未来会切换到 Node 24。

当前处理策略：

- 部署已成功，可以先接受这个 annotation。
- 后续可以关注 `actions/checkout`、`actions/setup-node`、`actions/configure-pages`、`actions/upload-pages-artifact` 是否发布新主版本。
- 如果 GitHub 要求，也可以在 workflow 里设置官方提示的环境变量进行提前适配。

## 10. GitHub Pages 与 Vercel / Netlify 的区别

### GitHub Pages

适合：

- 静态官网。
- 文档站。
- 不需要服务端 API 的展示型网站。
- 直接和 GitHub 仓库绑定。

优点：

- 免费、简单。
- 和 GitHub Actions 集成自然。
- 对当前项目足够。

短板：

- 没有内置表单收集。
- 没有服务端函数。
- 复杂 SPA 路由需要额外处理。

### Vercel

适合：

- Next.js。
- React 应用预览环境。
- SSR、边缘函数、动态 API。

优点：

- 前端工程体验强。
- PR preview 很好用。
- 适合产品型应用。

短板：

- 需要 Vercel 账号授权。
- 免费额度和商业使用要关注策略。

### Netlify

适合：

- 静态站。
- 营销页。
- 需要表单收集、redirect、轻量函数的站点。

优点：

- 表单能力开箱更好。
- 静态站部署体验也很成熟。

短板：

- 也需要账号授权。
- 团队和商业功能同样要看套餐。

当前本色丽人官网首版是展示型门户，所以 GitHub Pages 是合理选择。

## 11. 当前仓库部署状态

仓库：

```text
https://github.com/shenghua404-create/benseliren-portal
```

线上：

```text
https://shenghua404-create.github.io/benseliren-portal/
```

当前 Pages 配置：

```json
{
  "build_type": "workflow",
  "html_url": "https://shenghua404-create.github.io/benseliren-portal/",
  "https_enforced": true
}
```

最新验证命令：

```bash
npm test
npm run build
gh run list --repo shenghua404-create/benseliren-portal --workflow "Deploy to GitHub Pages" --limit 2
```

## 12. 后续维护建议

### 12.1 修改页面内容

大部分文案集中在：

```text
src/data/siteContent.js
```

改完后：

```bash
npm test
npm run build
git add .
git commit -m "content: update company contact info"
git push
```

### 12.2 替换产品图片

当前首屏图片：

```text
public/images/hero-product-still-life.png
```

替换同名文件即可。注意：

- 保持图片大小不要过大，建议压缩到 500KB - 1.5MB。
- 文件名不变时，不需要改代码。
- 如果文件名变化，需要同步修改 `src/components/Hero.jsx`。

### 12.3 接真实表单

当前表单不提交到后端。

后续可选方案：

1. Netlify Forms：如果迁到 Netlify，最快。
2. Formspree / Basin 等第三方表单服务。
3. 自建 API：Cloudflare Workers、Vercel Functions、Supabase Edge Functions 等。
4. 企业微信/飞书 Webhook：适合把咨询推送到内部群。

如果继续用 GitHub Pages，要记住它只能托管静态文件，不能自己处理表单 POST。

## 13. 参考资料

- GitHub Pages custom workflows：<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>
- GitHub Pages 创建站点：<https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>
- GitHub CLI `gh repo create`：<https://cli.github.com/manual/gh_repo_create>
