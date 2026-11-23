### Change: version 0.1.8 date 2026-11-22

Auth hardening and test coverage for the ShopIt backend.

- auth.ts: added authUser() that responds 401 and returns null instead of `req.auth!` non-null assertion; all controllers fail closed when auth is missing
- signinController.ts/signupController.ts: email validation and per-IP rate limiting on password attempts
- utils/rateLimit.ts: new fixed-window rate limiter
- Tests: auth middleware (signSessionToken/requireAuth/authUser), rateLimit, signinController, signupController, cartUpdate, wishlistController — 35 tests passing


### Change: version 0.1.0 date 2026-11-08

Add Dockerfile and .dockerignore for containerizing the ShopIt Node/Express backend.

- Dockerfile: node:20-slim, npm ci, tsc build, node dist/server.js, expose 5000
- .dockerignore: exclude node_modules, dist, .git, .env from build context

### Commit: version 0.1.0 date 2026-11-08

Add Docker support for ShopIt backend.