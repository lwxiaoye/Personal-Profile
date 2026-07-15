# 单域名路径式作品集部署实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将个人介绍网站发布到 `lwxiaoye.top/`，将服务器上现有 CareerForge-AI 无损迁移到 `lwxiaoye.top/career/`，并在个人主页增加“前往体验”入口。

**Architecture:** 1Panel OpenResty 继续作为唯一公网入口，根路径直接提供个人主页静态文件，`/career/` 反向代理到仅监听 `127.0.0.1:8080` 的 CareerForge 前端容器。CareerForge 使用 Vite 基路径、React Router basename 和统一公共请求前缀适配 `/career`，外层代理去掉该前缀后复用现有容器内 Nginx 与 FastAPI 路由。

**Tech Stack:** React 19、Vite、Vitest、React Router、TypeScript、Nginx/OpenResty、Docker Compose、1Panel、PowerShell、SSH

---

### Task 1：个人主页增加 CareerForge 体验入口

**Files:**
- Modify: `src/App.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/portfolio-data.js`

- [ ] **Step 1：先修改测试，描述最终交互**

将“未部署”测试改为断言 CareerForge 显示体验链接，同时断言客服和中医 RAG 仍无体验链接：

```jsx
it("only exposes the deployed CareerForge experience", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: "展开 CareerForge-AI 项目详情" }));
  expect(screen.getByRole("link", { name: "前往体验 CareerForge-AI" })).toHaveAttribute(
    "href",
    "/career/",
  );

  await user.click(screen.getByRole("button", { name: "展开 多智能体客服 项目详情" }));
  expect(screen.queryByRole("link", { name: "前往体验 多智能体客服" })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "展开 医疗 RAG 项目详情" }));
  expect(screen.queryByRole("link", { name: "前往体验 医疗 RAG" })).not.toBeInTheDocument();
});
```

- [ ] **Step 2：运行测试并确认先失败**

Run: `npm test -- --run`

Expected: FAIL，原因是 CareerForge 尚无“前往体验”链接。

- [ ] **Step 3：实现最小修改**

在 `src/portfolio-data.js` 中设置：

```js
livePath: "/career/",
```

在 `src/App.jsx` 中将体验入口改为：

```jsx
<a href={project.livePath} aria-label={`前往体验 ${project.title}`}>
  前往体验 <ArrowUpRight weight="bold" />
</a>
```

- [ ] **Step 4：运行个人主页验证**

Run: `npm test -- --run && npm run build`

Expected: 所有测试通过，Vite 构建成功，`dist/index.html` 存在。

- [ ] **Step 5：提交个人主页修改**

```bash
git add src/App.test.jsx src/App.jsx src/portfolio-data.js
git commit -m "feat: add CareerForge live experience link"
```

### Task 2：准备 CareerForge 路径迁移工作副本与基线测试

**Files:**
- Copy from server: `/opt/careerforge-ai/frontend`
- Create in temporary work area: `careerforge-path-migration/frontend/scripts/verify-career-base.mjs`

- [ ] **Step 1：记录生产基线**

Run:

```powershell
ssh -i $env:USERPROFILE\.ssh\id_ed25519_lwxiaoye_deploy root@47.109.182.152 "docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'; curl -fsS http://127.0.0.1:8080/ >/dev/null"
```

Expected: CareerForge 的五个容器正常，前端本机请求返回成功。

- [ ] **Step 2：复制不含密钥的前端源码到本地临时目录**

使用 `scp` 复制 `/opt/careerforge-ai/frontend`，明确排除服务器 `.env` 文件；本次只修改前端源码、Dockerfile 和 Nginx 配置，不复制 `backend/.env.docker`。

- [ ] **Step 3：创建路径验证脚本**

```js
import assert from "node:assert/strict";
import fs from "node:fs";

const vite = fs.readFileSync(new URL("../vite.config.ts", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8");
const dockerfile = fs.readFileSync(new URL("../Dockerfile", import.meta.url), "utf8");

assert.match(vite, /base:\s*["']\/career\/["']/);
assert.match(main, /<BrowserRouter\s+basename=["']\/career["']>/);
assert.match(dockerfile, /VITE_API_BASE_URL=["']?\/career["']?/);

const html = fs.readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
assert.match(html, /(?:src|href)=["']\/career\/assets\//);
assert.doesNotMatch(html, /(?:src|href)=["']\/assets\//);

console.log("CareerForge base path verified");
```

- [ ] **Step 4：运行脚本并确认先失败**

Run: `node scripts/verify-career-base.mjs`

Expected: FAIL，原因是 Vite、Router 和 Docker 构建参数仍使用根路径。

### Task 3：适配 CareerForge 前端基础路径与公共资源

**Files:**
- Modify: temporary `frontend/vite.config.ts`
- Modify: temporary `frontend/src/main.tsx`
- Modify: temporary `frontend/Dockerfile`
- Create: temporary `frontend/src/shared/publicPath.ts`
- Modify: temporary frontend files containing root-relative public assets
- Test: temporary `frontend/scripts/verify-career-base.mjs`

- [ ] **Step 1：设置 Vite 与页面路由基路径**

在 `vite.config.ts` 中加入：

```ts
export default defineConfig({
  base: "/career/",
  plugins: [react()],
  // 保留现有 server.proxy
});
```

在 `src/main.tsx` 中使用：

```tsx
<BrowserRouter basename="/career">
```

- [ ] **Step 2：设置生产服务请求前缀**

在 `Dockerfile` 中使用：

```dockerfile
ARG VITE_API_BASE_URL="/career"
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
```

保留 `src/shared/api.ts` 的统一请求拼接方式，使现有 `/api/v1/...` 请求构成为 `/career/api/v1/...`。

- [ ] **Step 3：集中处理 public 目录资源**

新增 `src/shared/publicPath.ts`：

```ts
export function publicPath(path: string): string {
  const relativePath = path.replace(/^\/+/, "")
  return `${import.meta.env.BASE_URL}${relativePath}`
}
```

将源码中用于页面展示的 `/activity-icons/...`、`/activity-icons-v2/...`、`/resume-template-thumbs/...`、`/favicon.svg` 等 public 目录绝对地址改为 `publicPath(...)`。API 路由字符串不使用此函数。

- [ ] **Step 4：构建并检查残留根路径**

Run:

```bash
npm install --no-audit --no-fund
npm run build
npm run lint
node scripts/verify-career-base.mjs
```

Expected: 构建、代码检查和路径验证全部成功。

- [ ] **Step 5：检查构建产物中的公共地址**

Run:

```bash
grep -RInE '(["'"'])/(assets|activity-icons|activity-icons-v2|resume-template-thumbs|api)/' dist
```

Expected: 不存在会绕过 `/career/` 的浏览器公共地址；允许后端内部响应内容中的业务文本，不允许 HTML、JS 或 CSS 主动请求根路径资源。

### Task 4：备份服务器并上传 CareerForge 修改

**Files:**
- Backup: `/opt/careerforge-ai/frontend`
- Backup: `/opt/careerforge-ai/docker-compose.1panel.yml`
- Backup: `/opt/1panel/www/conf.d/lwxiaoye.top.conf`
- Backup: `/opt/1panel/www/sites/lwxiaoye.top/proxy/root.conf`
- Backup: `/opt/1panel/www/sites/lwxiaoye.top/index`

- [ ] **Step 1：创建带时间戳的备份目录**

Run on server:

```bash
stamp=$(date +%Y%m%d-%H%M%S)
backup=/opt/deploy-backups/lwxiaoye-$stamp
install -d -m 700 "$backup"
cp -a /opt/careerforge-ai/frontend "$backup/careerforge-frontend"
cp -a /opt/careerforge-ai/docker-compose.1panel.yml "$backup/"
cp -a /opt/1panel/www/conf.d/lwxiaoye.top.conf "$backup/"
cp -a /opt/1panel/www/sites/lwxiaoye.top/proxy "$backup/"
cp -a /opt/1panel/www/sites/lwxiaoye.top/index "$backup/site-index"
docker image inspect careerforge-frontend:latest > "$backup/careerforge-frontend-image.json"
printf '%s\n' "$backup"
```

Expected: 输出唯一备份目录，所有复制命令成功。

- [ ] **Step 2：上传经过验证的前端文件**

仅上传本次修改的前端文件到 `/opt/careerforge-ai/frontend`，不上传任何 `.env` 或后端文件。

- [ ] **Step 3：在服务器再次构建前端代码**

Run: `cd /opt/careerforge-ai/frontend && npm install --no-audit --no-fund && npm run build && npm run lint`

Expected: 全部成功。

### Task 5：构建 CareerForge 镜像并限制 8080 暴露范围

**Files:**
- Modify: `/opt/careerforge-ai/docker-compose.1panel.yml`
- Use: `/opt/careerforge-ai/frontend/Dockerfile`

- [ ] **Step 1：构建带可回滚标签的新镜像**

Run on server:

```bash
docker tag careerforge-frontend:latest careerforge-frontend:pre-path-migration
docker build --build-arg VITE_API_BASE_URL=/career -t careerforge-frontend:path-migration /opt/careerforge-ai/frontend
```

Expected: 新镜像构建成功，旧镜像标签保留。

- [ ] **Step 2：先用临时容器验证镜像**

Run on server:

```bash
docker run --rm -d --name careerforge-path-check -p 127.0.0.1:18080:80 --network careerforge-ai_default careerforge-frontend:path-migration
curl -fsS http://127.0.0.1:18080/ | grep -q '/career/assets/'
docker exec careerforge-path-check nginx -t
docker rm -f careerforge-path-check
```

Expected: HTML 引用 `/career/assets/`，Nginx 配置检查成功。

- [ ] **Step 3：修改 1Panel compose 的前端服务**

将前端端口改为：

```yaml
ports:
  - "127.0.0.1:8080:80"
```

并使用：

```yaml
image: careerforge-frontend:path-migration
```

- [ ] **Step 4：只重建前端容器**

Run:

```bash
cd /opt/careerforge-ai
docker compose -f docker-compose.1panel.yml up -d --no-deps --force-recreate frontend
docker inspect careerforge-frontend --format '{{json .NetworkSettings.Ports}}'
curl -fsS http://127.0.0.1:8080/ | grep -q '/career/assets/'
```

Expected: 数据库、Redis、后端和 worker 未重建；8080 仅绑定 `127.0.0.1`。

### Task 6：部署个人主页并切换 OpenResty 路由

**Files:**
- Deploy: local `dist/**` to `/opt/1panel/www/sites/lwxiaoye.top/index/`
- Replace: `/opt/1panel/www/sites/lwxiaoye.top/proxy/root.conf`

- [ ] **Step 1：暂存个人主页构建产物**

将本地 `dist` 上传到服务器临时目录 `/opt/deploy-staging/lwxiaoye-landing`，核对 `index.html` 和 `assets/` 存在。

- [ ] **Step 2：准备新的路径代理配置**

`root.conf` 使用：

```nginx
location = /career {
    return 308 /career/;
}

location ^~ /career/ {
    proxy_pass http://127.0.0.1:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Prefix /career;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $http_connection;
    proxy_http_version 1.1;
    proxy_connect_timeout 10s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    proxy_buffering off;
    proxy_request_buffering off;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

- [ ] **Step 3：先在临时文件中检查 OpenResty 配置**

写入临时配置后，使用 1Panel OpenResty 容器执行 `openresty -t`；只有成功后才替换正式配置。

- [ ] **Step 4：原子切换个人主页与代理配置**

将暂存目录移动为正式网站目录，将已验证的代理配置移动到 `root.conf`，然后向 OpenResty 发送 reload。不得重启数据库或 CareerForge 后端。

- [ ] **Step 5：立即执行健康检查**

Run:

```bash
curl -kfsS --resolve lwxiaoye.top:443:127.0.0.1 https://lwxiaoye.top/ | grep -q '梁伟业'
curl -kfsSI --resolve lwxiaoye.top:443:127.0.0.1 https://lwxiaoye.top/career | grep -q '308'
curl -kfsS --resolve lwxiaoye.top:443:127.0.0.1 https://lwxiaoye.top/career/ | grep -q '/career/assets/'
docker ps --format 'table {{.Names}}\t{{.Status}}'
```

Expected: 根站、跳转和 CareerForge 均正确，全部持久化容器仍健康。

### Task 7：公网与浏览器验收

**Files:**
- Create local screenshots under `artifacts/` only when needed for QA evidence

- [ ] **Step 1：验证公网状态与资源**

Run:

```powershell
curl.exe -I https://lwxiaoye.top/
curl.exe -I https://lwxiaoye.top/career
curl.exe -I https://lwxiaoye.top/career/
curl.exe -I https://lwxiaoye.top/career/auth
```

Expected: 根路径 200，`/career` 跳转到 `/career/`，CareerForge 页面 200，资源没有 404。

- [ ] **Step 2：使用浏览器检查个人主页**

打开 `https://lwxiaoye.top/`，展开 CareerForge-AI，确认“前往体验”和“查看源码”同时存在；点击“前往体验”，确认进入 `/career/`。

- [ ] **Step 3：使用浏览器检查 CareerForge**

检查登录页、学生端刷新、管理端路由、移动端宽度和浏览器控制台；执行一个不修改生产数据的登录或公开页面检查。若已有可安全使用的测试账号，再验证登录续期、上传下载和 SSE；没有测试账号时只验证未认证请求的响应结构，不尝试猜测凭据。

- [ ] **Step 4：验证端口和容器状态**

Run on server:

```bash
ss -lntp | grep ':8080'
docker ps --format 'table {{.Names}}\t{{.Status}}'
docker logs --since 10m careerforge-frontend 2>&1 | tail -n 100
docker logs --since 10m careerforge-backend 2>&1 | tail -n 100
```

Expected: 8080 仅监听 `127.0.0.1`，容器健康，日志中没有新增的持续 404 或 5xx。

- [ ] **Step 5：完成或回滚**

如果所有验收通过，记录备份目录和部署镜像标签。如果任一核心检查失败，立即恢复 Task 4 的代理、个人主页目录、compose 文件及 `careerforge-frontend:pre-path-migration` 镜像，然后重新加载 OpenResty并重复基线检查。
