# NotebookLM Clone — Client

A React + TypeScript + Vite client for the NotebookLM-style project.

This document shows how to install, configure, run, build, and troubleshoot the client locally.

## Prerequisites

- Node.js 16+ (LTS recommended)
- npm 8+ or Yarn 1/2+
- A backend API (local or remote) that the client will call (optional for static UI work)

## Installation

1. Clone the repo:

   - git clone <repo-url>
   - cd notebookLM-clone-client

2. Install dependencies:

   - npm install
   - or
   - yarn

3. Inspect package.json for available scripts:
   - cat package.json | grep scripts || open package.json in an editor

## Environment variables

Vite exposes env variables that start with `VITE_`. Create a `.env` file in the project root for local settings.

Example `.env`:

```
# .env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE="NotebookLM Clone"
```

Notes:

- After adding or changing `.env`, restart the dev server.
- Do not commit secrets or production credentials. Use a separate .env.production for deploys if needed.

## Local development

Start the dev server with HMR:

- npm run dev
- or
- yarn dev

Open the URL printed by the dev server (usually http://localhost:5173).

When developing:

- Use the browser console and Network tab to inspect API calls.
- If TypeScript types change, your editor may need to re-index; restarting the dev server can help.

## Build for production

Create an optimized production build:

- npm run build
- or
- yarn build

Preview the production build locally:

- npm run preview
- or
- yarn preview

Deploy the contents of the `dist` directory to your static host (Netlify, Vercel, S3, etc.) or serve them from your backend.

## Common scripts (check package.json)

Typical scripts you may have or add:

- dev — start Vite dev server
- build — create production build
- preview — locally preview build
- lint — run ESLint
- format — run Prettier
- test — run unit tests

Example:

- npm run lint
- npm run format
- npm run test

If a script is missing, add it to package.json or run the corresponding CLI directly.

## Type checking & linting

- Run TypeScript checks with: npx tsc --noEmit (or an npm script)
- Run ESLint (if configured): npm run lint

Adjust tsconfig and ESLint settings to enable type-aware rules when needed.

## Docker (optional)

Simple Dockerfile approach:

1. Build
   - docker build -t notebooklm-client .
2. Run
   - docker run -p 4173:4173 notebooklm-client

(Adjust Dockerfile and ports to match your production setup.)

## Troubleshooting

- Blank page / runtime errors: check browser console for missing env vars or misconfigured API URLs.
- HMR not updating: restart dev server, clear browser cache, or delete node_modules + reinstall.
- Type errors on CI: ensure CI runs `npm ci` and `npx tsc --noEmit` if you enforce type checks.

## Contributing

- Fork the repo, create a branch, open a PR with a clear description.
- Keep commits small and focused. Add tests for new features where applicable.

## License & Contact

- Add your project license here (e.g., MIT).
- For questions, open an issue in the repository.
