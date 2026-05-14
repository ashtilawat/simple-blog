# AGENTS.md

## Cursor Cloud specific instructions

This is a **Create React App** job board SPA ("BOOTCAMP1ST"). There is no backend — job data is hardcoded in `src/components/Content/Content.js`.

### Key commands

All commands are defined in `package.json`:

| Task | Command |
|------|---------|
| Dev server | `npm start` (port 3000) |
| Lint | `npm run lint` |
| Lint + autofix | `npm run lint:fix` |
| Format | `npm run format` |
| Tests | `CI=true npm test -- --watchAll=false --passWithNoTests` |
| Build | `npm run build` |

### Notes

- **No test files exist** in the repo. Use `--passWithNoTests` to avoid a non-zero exit.
- **Lint has 2 pre-existing errors** in `src/index.js` (`process` is not defined) because `.eslintrc.json` doesn't include the `node` env. These are CRA-injected `process.env` references and are harmless at runtime.
- Auth0 credentials are in `.env` (public client-side IDs, not secrets). The app works without a real Auth0 login — job listings render without authentication.
- The `airtable` dependency is installed but unused; it does not affect the dev workflow.
