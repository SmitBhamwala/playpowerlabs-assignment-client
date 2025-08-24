# NotebookLM Clone — Client (PDF Chat)

A React + TypeScript + Vite frontend that lets users upload a PDF and chat with its contents. No environment file is required — upload a PDF and the app will process it and enable a chat interface on successful upload.

## Quick summary

- Purpose: Upload a PDF and ask questions about its contents via a chat UI.
- No .env or VITE\_\* variables required for local usage of the frontend.
- Backend API: If your deployment uses a backend, configure it separately; for local UI work the upload flow should work against the integrated backend if present.

## Live demo

The frontend is deployed and accessible here:
https://playpowerlabs-assignment.vercel.app/

You can open the URL, upload a PDF, and start chatting immediately — no local environment variables are required.

## Deploying to Vercel

To deploy the app to Vercel:

- Connect the repository to Vercel and enable automatic deployments.
- Ensure the build command is `npm run build` (or `yarn build`) and the output directory is `dist`.
- No `.env` is required for the frontend; the upload/chat UI works out of the box. If your production setup requires a backend, configure any backend endpoints separately in that deployment environment.

## Prerequisites

- Node.js 16+ (LTS recommended)
- npm 8+ (or yarn)
- Modern browser (Chrome, Edge, Firefox)

## Installation

1. Clone the repository:

   - git clone <repo-url>
   - cd notebookLM-clone-client

2. Install dependencies:
   - npm install
   - or
   - yarn

## Run locally (development)

Start the Vite dev server:

- npm run dev
- or
- yarn dev

Open the local URL shown by Vite (commonly http://localhost:5173). No additional configuration or .env file is required.

## Usage — upload a PDF and chat

1. Open the app in your browser.
2. Click the "Upload PDF" button (or drag-and-drop) and choose a PDF file.
   - Supported formats: PDF
   - Recommended file size: up to ~20–50 MB (depends on backend and browser memory)
3. Wait for the upload and processing to complete. The UI should show an upload progress indicator and a confirmation on success.
4. After successful upload, a chat input appears. Type questions about the PDF (e.g., "Summarize page 3", "What are the main findings?") and submit.
5. The app will display responses extracted from the uploaded PDF. Use follow-up questions as needed.

Notes:

- If the app integrates with a remote backend for parsing or embeddings, network errors will appear in the UI; see troubleshooting below.
- For large PDFs or many pages, processing can take longer — be patient and check for progress indications.

## Build & preview

Create a production build:

- npm run build
- or
- yarn build

Preview the production build locally:

- npm run preview
- or
- yarn preview

Deploy the contents of the `dist` folder to your chosen static host or serve them via your backend.

## Common scripts

Check package.json for available scripts. Typical ones:

- dev — start Vite dev server
- build — production build
- preview — preview build
- lint — run ESLint (if present)
- format — run Prettier
- test — run tests

Run e.g.:

- npm run lint
- npm run test

## Troubleshooting

- Upload fails / network error: Check browser console and network tab. Ensure any required backend is running if the app depends on it.
- No chat after upload: Verify the upload completed successfully and the app returned a success response. Reload and try again with a smaller PDF if needed.
- Large PDFs cause performance issues: Try splitting the PDF or reduce size/resolution before upload.
- Blank page / runtime errors: open the console, then restart the dev server and try again.

## Contributing

- Fork, branch, implement changes, open a PR with a clear description.
- Add tests for new features where applicable.

## License

Add the project license here (e.g., MIT). For questions, open an issue in the repository.
