### Change: version 0.1.0 date 2026-11-08

Add single root-level docker-compose.yml to run frontend, backend, and MongoDB together.

- docker-compose.yml: mongodb (mongo:7), backend (shopit-backend/Dockerfile), frontend (shopit/Dockerfile) on one bridge network
- shopit/Dockerfile: node:20-slim, next build + next start, NEXT_PUBLIC_BASE_URL build arg
- shopit/.dockerignore: exclude node_modules, .next, .git, .env from build context
- shopit-backend/Dockerfile: node:20-slim, tsc build, node dist/server.js
- shopit-backend/.dockerignore: exclude node_modules, dist, .git, .env from build context

### Commit: version 0.1.0 date 2026-11-08

Add Docker Compose setup for ShopIt frontend, backend, and MongoDB.