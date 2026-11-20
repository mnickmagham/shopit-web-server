### Change: version 0.1.0 date 2026-11-08

Add Dockerfile and .dockerignore for containerizing the ShopIt Next.js frontend.

- Dockerfile: node:20-slim, npm ci, next build + next start, NEXT_PUBLIC_BASE_URL build arg, expose 3000
- .dockerignore: exclude node_modules, .next, .git, .env from build context

### Commit: version 0.1.0 date 2026-11-08

Add Docker support for ShopIt frontend.