# Project organization report

Prepared September 30, 2026. The existing project was copied into `civicpulse-github-ready`. Original files and the original ZIP were not moved, overwritten or deleted. No repository was created or uploaded and no commits were made.

## Structure and file mapping

See the complete tree in the root [README](../README.md).

| Original file | Location in organized copy |
| --- | --- |
| public/index.html | frontend/public/index.html |
| public/app.js | frontend/public/app.js |
| public/style.css | frontend/public/style.css |
| server.mjs | backend/src/server.mjs; storage functions extracted to storage/requests.mjs |
| logic.mjs | backend/src/logic.mjs |
| google.mjs | backend/src/services/google-auth.mjs, services/vertex-ai.mjs and storage/firestore.mjs |
| logic.test.mjs | tests/logic.test.mjs |
| GOOGLE-SETUP.md | docs/GOOGLE-SETUP.md |
| AI-STUDIO-PROMPT.md | docs/AI-STUDIO-PROMPT.md |
| VALIDATION.md | docs/VALIDATION.md, with organization validation appended |
| SAMPLE-BRIEF.txt | docs/examples/SAMPLE-BRIEF.txt |
| data/requests.json | data/requests.json, preserved locally and ignored |
| package.json, Dockerfile, ignore files, .env.example | Root files updated for the organized copy |
| README.md | Replaced in the copy with team-oriented overview; original remains intact |

New files: frontend and backend README files, API and environment references, this report, CONTRIBUTING.md, API integration tests, GitHub Actions workflow, and a LICENSE status notice. `google.mjs` was divided by responsibility rather than duplicated. Nothing was removed from the original project.

## Implementation changes

Updated module imports, the static frontend path, root-relative local data path, startup/watch commands and Docker COPY/CMD paths. Extracted existing code into modules without changing the scoring formula, public API, UI files or stored-record format. The declared Node minimum is now 22.9 to match the environment-file flag. No third-party dependencies or new database schema were introduced.

## Keep out of GitHub

Exclude local data/, .env and its private variants, credential JSON, private key files, node_modules/, logs, caches, coverage, build output and generated ZIP files. Keep .env.example committed. The original screenshot and ZIP remain outside this project. The supplied sample brief contains demo data and may remain as a documented example; it is not a current live report.

## Configuration and technology

HTML/CSS/browser JavaScript; Node.js ES modules and native HTTP/fetch; local JSON; optional Vertex AI and Firestore REST; Docker/Cloud Run; Node test runner and GitHub Actions. See [environment variables](ENVIRONMENT.md) for AI_MODE, STORAGE_MODE, PORT, GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, GEMINI_MODEL, DATA_DIR and the platform-set K_SERVICE.

## Team and Git workflow

See [CONTRIBUTING.md](../CONTRIBUTING.md) for ownership, exact initial Git commands and clone/branch workflows for all four developers. No names or contribution history have been invented. License selection remains the owner's decision; LICENSE is explicitly a notice, not a license grant.

## Verification

Seven tests passed, including the six original logic tests and a new integration test. The integration test starts the reorganized server using temporary storage; verifies all three frontend assets; creates a request; rejects duplicate, empty and invalid input; updates status; blocks access to .env and backend source; restarts the server; and confirms persisted records and matching brief figures. Local user records are not touched by these tests.

Live Google calls, Docker builds, GitHub Actions execution and Cloud Run deployment were not run in the user's account. Existing limitations include missing application-user authorization, non-transactional duplicate checks, synthetic baselines, and a misleading generic connection sentence when demo analysis is paired with Firestore. These are documented rather than silently rewritten as part of a structure-only task.
