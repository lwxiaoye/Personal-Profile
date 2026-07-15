# Path-based portfolio deployment design

## Goal

Turn `lwxiaoye.top` into a path-based portfolio hub without losing the existing CareerForge-AI deployment or its data:

- `/` serves Liang Weiye's personal landing page.
- `/career/` serves the existing CareerForge-AI application.
- `/service/` and `/medical/` are reserved for later deployments and are not implemented in this release.
- The expanded CareerForge-AI project card exposes a `前往体验` link to `/career/` while retaining its source-code link.

## Current production state

1Panel OpenResty currently proxies every request for `lwxiaoye.top` to the CareerForge frontend container on host port `8080`. CareerForge uses React, React Router, and Vite with root-relative routes and assets. Its frontend Nginx proxies root-level `/api/`, `/data/`, `/static/`, and related paths to the backend container. MySQL, Redis, backend, worker, and frontend containers are healthy.

## Architecture

The 1Panel-managed OpenResty vhost remains the only public HTTP entry point.

- Personal landing assets are built locally and deployed to the vhost document root at `/www/sites/lwxiaoye.top/index`.
- `/career` redirects permanently to `/career/`.
- `/career/` is reverse-proxied to the CareerForge frontend container on `127.0.0.1:8080`, stripping the public `/career/` prefix before the request reaches the container.
- CareerForge is rebuilt with Vite base `/career/`, React Router basename `/career`, and public API base `/career`. Browser requests therefore stay under the CareerForge namespace; the outer proxy strips the namespace and the existing inner Nginx/backend routes continue to work.
- Host port `8080` is bound to loopback only, preventing direct public access that bypasses TLS and the public path layout.

## CareerForge path handling

The frontend must produce `/career/assets/...` URLs and route internal navigation under `/career`. All calls made through the shared authenticated request helpers use `/career` as the public base. Streaming requests, uploads, downloads, feedback images, generated static files, and any backend-returned root-relative URLs are audited so they remain inside `/career/` in the browser.

The backend retains its existing `/api/v1` routes and storage configuration. No database schema, tenant data, credentials, Redis data, or model configuration is migrated.

## Landing-page behavior

The CareerForge-AI project data uses `livePath: "/career/"`. When expanded, the project links display `前往体验` and `查看源码` as separate actions. The experience link uses same-site navigation. The service and medical project cards continue to show that no deployment address is available.

## Rollout and rollback

Before changes, create timestamped backups of the 1Panel vhost/proxy files, CareerForge source files being edited, compose configuration, and the current landing document root. Build and validate new artifacts before switching traffic.

Deployment order:

1. Update and test CareerForge path behavior.
2. Build a new CareerForge frontend image without touching persistent services.
3. Build and stage the personal landing page.
4. Install and syntax-check the OpenResty path routing.
5. Switch traffic and run public smoke tests.

If validation fails, restore the prior proxy file and CareerForge frontend image/config, reload OpenResty, and verify the original root deployment. Database containers and volumes are never recreated during rollback.

## Verification

Required checks:

- Landing-page unit tests and production build pass.
- CareerForge frontend build and lint pass.
- OpenResty and inner Nginx configuration tests pass.
- `/` renders the personal landing page and refreshes correctly.
- `/career` redirects to `/career/`.
- `/career/`, `/career/auth`, `/career/student`, and `/career/admin` load without asset 404s.
- Login/refresh, authenticated API requests, file upload/download, SSE streaming, generated images/static files, and PDF export work through `/career/`.
- The landing-page `前往体验` action reaches `/career/`; the source action remains intact.
- HTTP redirects to HTTPS, Cloudflare access remains healthy, and port `8080` is no longer publicly bound.
- A mobile-width browser smoke test confirms both sites remain usable.

## Out of scope

- Deploying the multi-agent customer-service project.
- Deploying the Chinese-medicine RAG project.
- Changing CareerForge business behavior, database contents, prompts, or model credentials.
