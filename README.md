# CivicPulse

A hackathon prototype that collects citizen infrastructure requests, classifies them, and helps officials compare district needs using an explained priority score. The pilot covers four Karnataka districts and includes English, Hindi and Kannada examples.

This is an independent prototype, not an official BRICS product or a certified Digital Public Good. Baseline data and initial requests are synthetic. Live Google integrations require configuration and account-level verification.

## Explain the project in File Explorer

Open the folders in this order:

1. **frontend** — “This is what citizens and officials see: the form, dashboard and request register.”
2. **backend** — “This receives requests, calls Gemini when enabled, calculates priorities and saves records.”
3. **tests** — “These checks verify scoring, API behavior and saved data after a restart.”
4. **docs** — “These guides explain setup, Google services, the API and how the project was organized.”
5. **data** — “These are local saved requests. They stay on this computer and are excluded from Git.”
6. **.github** — “This runs our tests when the team pushes code or opens a pull request.”

At the root, `package.json` defines commands, `Dockerfile` describes the hosted container, `.env.example` lists settings without secrets, and `CONTRIBUTING.md` explains the four-person workflow. `LICENSE` is currently a notice that a license has not been chosen.

## Technology

- Plain HTML, CSS and JavaScript frontend; no frontend build step.
- Node.js HTTP server with ES modules and native fetch; no external npm dependencies.
- Local JSON storage for the demo; optional Cloud Firestore REST integration.
- Optional Gemini on Vertex AI for multilingual analysis and audio transcription.
- Docker configuration for Cloud Run; Google API access through gcloud locally or service identity when hosted.
- Node's built-in test runner and GitHub Actions.

## Structure

```text
civicpulse-github-ready/
├── frontend/
│   ├── public/{index.html,app.js,style.css}
│   └── README.md
├── backend/
│   ├── src/
│   │   ├── server.mjs
│   │   ├── logic.mjs
│   │   ├── storage/{requests.mjs,firestore.mjs}
│   │   └── services/{google-auth.mjs,vertex-ai.mjs}
│   └── README.md
├── tests/{logic.test.mjs,api.test.mjs}
├── docs/
│   ├── API.md
│   ├── ENVIRONMENT.md
│   ├── GOOGLE-SETUP.md
│   ├── AI-STUDIO-PROMPT.md
│   ├── VALIDATION.md
│   ├── ORGANIZATION-REPORT.md
│   └── examples/SAMPLE-BRIEF.txt
├── .github/workflows/test.yml
├── data/                         # Ignored local records
├── package.json
├── Dockerfile
├── .env.example
├── .gitignore
├── .dockerignore
├── README.md
├── CONTRIBUTING.md
└── LICENSE                       # License not yet selected
```

## Install and run

Install Node.js 22.9 or newer (Node 24 recommended), then open a terminal in this folder. There are no npm packages to install.

```text
npm start
```

Open http://localhost:8080. For server auto-restart during editing, use `npm run dev`; refresh the browser after frontend edits. Run `npm test` before submitting changes.

If the original demo already occupies port 8080, copy `.env.example` to `.env`, change `PORT=8081`, restart, and open http://localhost:8081. Do not stop the original app merely to run this copy.

Frontend and backend use one server: the browser loads `/`, `/app.js` and `/style.css`, then calls relative `/api/` endpoints. Do not run the HTML directly from File Explorer. See [frontend setup](frontend/README.md) and [backend setup](backend/README.md).

## Configuration and database

No configuration is required for the local demo. The environment template defaults to `AI_MODE=demo`, `STORAGE_MODE=local`, and `PORT=8080`. Optional settings are `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GEMINI_MODEL` and `DATA_DIR`. Cloud Run sets `K_SERVICE`; do not set it locally. See [all variables](docs/ENVIRONMENT.md).

Local records are saved under `data/requests.json`. This organized copy preserves the existing local records. A fresh clone has no local records file and begins with 24 synthetic samples; its first save creates the file automatically.

For cloud storage, create a Firestore Native `(default)` database and enable the required Google APIs and IAM roles as described in [Google setup](docs/GOOGLE-SETUP.md). The collection is `civicpulse_requests`; its existing JSON payload format is preserved. No schema migration is required. Never commit credentials or private runtime records.

## API

| Endpoint | Purpose |
| --- | --- |
| GET `/api/state` | Dashboard data and configured modes |
| POST `/api/requests` | Analyze and save a request |
| POST `/api/status` | Change review status |
| GET `/api/brief?district=mysuru` | Download a district review brief |

See [request formats and errors](docs/API.md).

## Team

| Developer | Primary files | Branch |
| --- | --- | --- |
| Frontend 1 | index.html; rendering functions in app.js | feature/frontend-ui |
| Frontend 2 | style.css; forms, event handlers and API calls in app.js | feature/frontend-integration |
| Backend 1 | server.mjs; services/ | feature/backend-api |
| Backend 2 | storage/; logic.mjs; backend tests | feature/backend-database |

Each person uses their own GitHub account and commits only their actual work. Coordinate changes to shared files and use pull requests into `main`. See [contribution and Git commands](CONTRIBUTING.md). No developer identities, commits or contributions have been fabricated.

## Verification and limits

Seven tests passed after reorganization, including frontend serving, request creation, duplicate rejection, review status, restart persistence and brief consistency. See [organization report](docs/ORGANIZATION-REPORT.md).

Google cloud calls and deployment have not been tested against your account. There are no application user roles, production rate limits, verified government datasets or project cost estimates. Keep hosted demos private. The license has not been selected; `LICENSE` does not grant an open-source license.
