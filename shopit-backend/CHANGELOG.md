### Change: version 0.1.0 date 2026-11-08

Add Dockerfile and .dockerignore for containerizing the ShopIt Node/Express backend.

- Dockerfile: node:20-slim, npm ci, tsc build, node dist/server.js, expose 5000
- .dockerignore: exclude node_modules, dist, .git, .env from build context

### Commit: version 0.1.0 date 2026-11-08

Add Docker support for ShopIt backend.