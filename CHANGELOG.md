### Change: version 0.1.5 date 2026-11-20

Fix category filter not affecting search results.

- shopit-backend/src/controllers/productsController.ts: category filter now uses case-insensitive exact match so frontend Title-Case values (e.g. "Electronics") match lower-case stored DB values (e.g. "electronics")

### Commit: version 0.1.5 date 2026-11-20

Fix category filter not affecting search results via case-insensitive exact category match.

### Change: version 0.1.4 date 2026-11-20

Enable hot reload for frontend and backend via Docker Compose.

- shopit/Dockerfile: switched from `next build`+`next start` to `next dev --turbopack --hostname 0.0.0.0`, NODE_ENV=development, CHOKIDAR_USEPOLLING=true
- shopit-backend/Dockerfile: switched from `tsc build`+`node dist/server.js` to `npm run dev` (nodemon + ts-node), NODE_ENV=development
- shopit-backend/nodemon.json: added legacyWatch for Windows Docker file watching
- docker-compose.yml: volume mounts for shopit/ and shopit-backend/ source dirs, CHOKIDAR_USEPOLLING env, NODE_ENV=development

### Commit: version 0.1.4 date 2026-11-20

Enable hot reload via Docker Compose: frontend runs next dev, backend runs nodemon, both with source volume mounts.

### Change: version 0.1.3 date 2026-11-20

Remove "Project Under Development" banner from all pages.

- shopit/app/layout.tsx: deleted the top banner div showing "Project Under Development . . ."

### Commit: version 0.1.3 date 2026-11-20

Remove "Project Under Development" banner from the root layout so it no longer appears on any page.

### Change: version 0.1.2 date 2026-11-20

Consolidate frontend and backend into a single root git repository.

- Removed nested .git from shopit/ and shopit-backend/
- All project files now tracked under one root repo

### Commit: version 0.1.2 date 2026-11-20

Consolidate shopit and shopit-backend into a single root git repo.

### Change: version 0.1.1 date 2026-11-09

Add DB seed script with 120 initial products across 12 categories.

- shopit-backend/src/seed.ts: expanded to 120 products filling all Product fields (id, title, available, description, pictureUrls, categories, tags, info, options, comments, scores) with picsum.photos placeholder image URLs
- shopit-backend/package.json: seed script already wired as "ts-node src/seed.ts"
- Seeded 120 products into MongoDB and verified via POST /api/products (totalProducts: 120, pagination working)

### Change: version 0.1.0 date 2026-11-08

Add single root-level docker-compose.yml to run frontend, backend, and MongoDB together.

- docker-compose.yml: mongodb (mongo:7), backend (shopit-backend/Dockerfile), frontend (shopit/Dockerfile) on one bridge network
- shopit/Dockerfile: node:20-slim, next build + next start, NEXT_PUBLIC_BASE_URL build arg
- shopit/.dockerignore: exclude node_modules, .next, .git, .env from build context
- shopit-backend/Dockerfile: node:20-slim, tsc build, node dist/server.js
- shopit-backend/.dockerignore: exclude node_modules, dist, .git, .env from build context

### Commit: version 0.1.0 date 2026-11-08

Add Docker Compose setup for ShopIt frontend, backend, and MongoDB.

### Commit: version 0.1.1 date 2026-11-09

Add DB seed script with 120 initial products across 12 categories.
