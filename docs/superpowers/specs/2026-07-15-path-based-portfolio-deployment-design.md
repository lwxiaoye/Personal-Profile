# 单域名路径式作品集部署设计

## 一、目标

将 `lwxiaoye.top` 调整为路径式个人作品集中心，同时保留服务器上已经运行的 CareerForge-AI 及其现有数据：

- `/`：展示梁伟业的个人介绍网站。
- `/career/`：展示现有 CareerForge-AI 应用。
- `/service/` 和 `/medical/`：留给后续部署，本次不实现。
- 展开个人主页中的 CareerForge-AI 项目后，显示“前往体验”入口并跳转至 `/career/`；原有“查看源码”入口继续保留。

## 二、服务器现状

目前，1Panel 管理的 OpenResty 会把 `lwxiaoye.top` 的全部请求转发到 CareerForge 前端容器的宿主机 `8080` 端口。因此，访问根路径或任意其他路径时，都会返回 CareerForge 页面。

CareerForge 前端使用 React、React Router 和 Vite，当前所有页面地址、静态资源地址和服务请求都以根路径 `/` 为起点。CareerForge 的 MySQL、Redis、后端、异步任务和前端容器目前均正常运行。

## 三、整体架构

继续使用 1Panel 管理的 OpenResty 作为唯一公网入口：

- 在本地构建个人介绍网站，并把构建结果部署到服务器网站目录 `/www/sites/lwxiaoye.top/index`。
- 访问 `/career` 时，自动跳转到 `/career/`，避免浏览器错误计算页面资源地址。
- 访问 `/career/` 及其下级地址时，由 OpenResty 转发到 CareerForge 前端容器的 `127.0.0.1:8080`，并在转发时去掉公网地址中的 `/career/` 前缀。
- CareerForge 使用 `/career/` 作为前端资源基础路径，使用 `/career` 作为页面路由和服务请求的公共前缀。
- 将 CareerForge 的宿主机 `8080` 端口限制为仅本机访问，防止外部用户绕过 HTTPS 和正式域名直接访问容器。

## 四、CareerForge 路径调整

CareerForge 构建后的脚本、样式和图片地址统一为 `/career/assets/...`，登录页、学生端和管理端等页面统一位于 `/career` 下。

浏览器发起的普通请求、登录续期、文件上传下载、SSE 流式输出、反馈图片和生成文件请求都必须位于 `/career/...` 下。请求抵达 OpenResty 后会去掉 `/career/` 前缀，再交给 CareerForge 容器内原有的前端代理和后端服务处理。

CareerForge 后端继续使用现有 `/api/v1` 接口，不修改数据库结构、租户数据、用户数据、Redis 数据、模型配置或密钥。

## 五、个人主页交互

CareerForge-AI 项目的 `livePath` 设置为 `/career/`。展开项目详情后，右侧操作区同时显示：

- “前往体验”：在当前网站中进入 `/career/`。
- “查看源码”：继续前往现有源码仓库。

多智能体客服和中医 RAG 尚未部署，暂时继续显示未提供部署地址，不添加无效的体验链接。

## 六、发布与回滚

修改前创建带时间标记的备份，备份范围包括：

- 1Panel 网站和代理配置。
- CareerForge 本次需要修改的源码及容器编排配置。
- 当前 CareerForge 前端镜像信息。
- 个人主页服务器目录。

发布顺序：

1. 调整并测试 CareerForge 的路径行为。
2. 构建新的 CareerForge 前端镜像，不重建持久化服务。
3. 构建并暂存个人介绍网站。
4. 安装新的 OpenResty 路由配置并检查语法。
5. 切换公网流量并执行完整验收。

如果验证失败，立即恢复原代理配置、原 CareerForge 前端镜像和相关配置，然后重新加载 OpenResty。数据库容器和数据卷在发布及回滚过程中都不会被重建。

## 七、验收标准

以下项目必须全部通过：

- 个人主页自动化测试和正式构建成功。
- CareerForge 前端构建及代码检查成功。
- OpenResty 与 CareerForge 容器内 Nginx 配置检查成功。
- `/` 正确显示个人介绍网站，刷新页面正常。
- `/career` 自动跳转到 `/career/`。
- `/career/`、`/career/auth`、`/career/student` 和 `/career/admin` 均能加载，脚本、样式和图片没有 404。
- 登录与续期、需要登录的服务请求、文件上传下载、SSE 流式输出、生成图片、静态文件和 PDF 导出均能通过 `/career/` 正常工作。
- 个人主页的“前往体验”能进入 `/career/`，“查看源码”继续有效。
- HTTP 自动跳转到 HTTPS，Cloudflare 访问正常，`8080` 不再直接向公网开放。
- 使用移动端宽度检查个人主页和 CareerForge 的基本可用性。

## 八、本次不包含的工作

- 部署多智能体客服项目。
- 部署中医 RAG 项目。
- 修改 CareerForge 的业务功能、数据库内容、提示词或模型密钥。
