# Simple Blog (BOOTCAMP1ST)

A React application with Auth0 authentication, a job board, and dynamic content pages loaded from Airtable (text, HTML, and video blocks).

## Prerequisites

- Node.js 18+
- npm
- Docker (optional, for containerized dev or production-like runs)

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

### Required

| Variable | Description |
| --- | --- |
| `REACT_APP_AUTH0_DOMAIN` | Auth0 tenant domain |
| `REACT_APP_AUTH0_CLIENT_ID` | Auth0 SPA client ID |
| `REACT_APP_AIRTABLE_API_KEY` | Airtable personal access token (use a read-only/scoped token) |
| `REACT_APP_AIRTABLE_BASE_ID` | Airtable base ID containing content tables |

### Optional Airtable schema overrides

Defaults match a `ContentItems` + `ContentBlocks` table layout. Override only if your base uses different names:

- `REACT_APP_AIRTABLE_CONTENT_ITEMS_TABLE` (default: `ContentItems`)
- `REACT_APP_AIRTABLE_CONTENT_BLOCKS_TABLE` (default: `ContentBlocks`)
- `REACT_APP_AIRTABLE_ITEM_TITLE_FIELD` (default: `Title`)
- `REACT_APP_AIRTABLE_ITEM_SLUG_FIELD` (default: `Slug`)
- `REACT_APP_AIRTABLE_ITEM_PUBLISHED_FIELD` (default: `Published`)
- `REACT_APP_AIRTABLE_BLOCK_ITEM_FIELD` (default: `ContentItem`)
- `REACT_APP_AIRTABLE_BLOCK_ORDER_FIELD` (default: `Order`)
- `REACT_APP_AIRTABLE_BLOCK_TYPE_FIELD` (default: `Type`)
- `REACT_APP_AIRTABLE_BLOCK_PAYLOAD_FIELD` (default: `Payload`)

**Security note:** Create React App embeds all `REACT_APP_*` variables in the client bundle at build time. The Airtable token is visible to end users in the shipped JavaScript. Use a read-only token scoped to the content base, and consider a server-side proxy for production if stronger protection is needed.

Never commit `.env` — it is listed in `.gitignore`.

## Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). Content list is at `/content`; the home route redirects there.

## Available scripts

| Script | Description |
| --- | --- |
| `npm start` | Development server with hot reload |
| `npm test` | Jest test runner |
| `npm run lint` | ESLint on `src/` |
| `npm run build` | Production build to `build/` |

## Docker

### Development (hot reload)

Requires a local `.env` file:

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up
```

The React dev server runs on [http://localhost:3000](http://localhost:3000).

### Production-like container

Build and run an nginx container serving the compiled SPA. All `REACT_APP_*` values must be supplied at **build** time:

```bash
export REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com
export REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
export REACT_APP_AIRTABLE_API_KEY=your-readonly-airtable-token
export REACT_APP_AIRTABLE_BASE_ID=your-airtable-base-id

docker compose up --build
```

Open [http://localhost:8080](http://localhost:8080) (override with `PORT=3000 docker compose up --build`).

Or build/run the image directly:

```bash
docker build \
  --build-arg REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com \
  --build-arg REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id \
  --build-arg REACT_APP_AIRTABLE_API_KEY=your-readonly-airtable-token \
  --build-arg REACT_APP_AIRTABLE_BASE_ID=your-airtable-base-id \
  -t simple-blog .

docker run --rm -p 8080:80 simple-blog
```

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on pushes to `main` and `factory/**`, and on pull requests to `main`:

1. `npm ci`
2. `npm run lint`
3. `CI=true npm test -- --watchAll=false`
4. `npm run build` (with CI placeholder env vars)
5. Client bundle secret scan (blocks accidental OpenAI/server key leaks)

## Deployment

This is a static SPA. Deployment requires:

1. **Build** with production `REACT_APP_*` values set in the build environment (GitHub Actions secrets, hosting provider env, or Docker build args).
2. **Host** the `build/` output (or the production Docker image) on any static file host or container platform.
3. **Configure Auth0** allowed callback/logout URLs for the production origin.
4. **Provision Airtable** credentials as build-time secrets — not as runtime server secrets unless you add a backend proxy.

Example static hosts: Netlify, Vercel, S3 + CloudFront, GitHub Pages, or the included nginx Docker image behind a load balancer.

### Deployment checklist

- [ ] Set `REACT_APP_AUTH0_DOMAIN` and `REACT_APP_AUTH0_CLIENT_ID` in the build environment
- [ ] Set `REACT_APP_AIRTABLE_API_KEY` (read-only) and `REACT_APP_AIRTABLE_BASE_ID` in the build environment
- [ ] Add production URL to Auth0 Application → Allowed Callback URLs and Allowed Logout URLs
- [ ] Confirm Airtable base has published content in `ContentItems` / `ContentBlocks` tables
- [ ] Verify `/content` list and `/content/:id` detail routes work (SPA fallback must serve `index.html`)

## Content architecture

- **Data layer:** `src/services/contentService.js` fetches from Airtable via `src/services/airtableClient.js`
- **Hook:** `src/hooks/useContentItems.js` provides loading/error/reload state
- **Routing:** `/content` (list), `/content/:id` (detail), `/jobs` (existing job board)
- **Blocks:** `ContentBlockRenderer` dispatches to `TextBlock`, `HtmlBlock` (DOMPurify), and `VideoBlock` (YouTube/Vimeo/MP4)
