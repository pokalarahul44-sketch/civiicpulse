# Backend — requests, decisions and storage

- `src/server.mjs`: HTTP server, static-file allowlist, API endpoints, input checks and error responses.
- `src/logic.mjs`: synthetic district data, demo language examples, keyword classification, model-output validation, priority scores and brief generation.
- `src/services/google-auth.mjs`: local gcloud authentication, Cloud Run service identity and authenticated Google requests.
- `src/services/vertex-ai.mjs`: Gemini request analysis and audio transcription via Vertex AI.
- `src/storage/requests.mjs`: read/write abstraction, local JSON persistence and selection of the storage provider.
- `src/storage/firestore.mjs`: Firestore REST read/write operations.

Backend Developer 1 leads server/API and services. Backend Developer 2 leads storage, business logic and backend tests. Authentication for accessing Google APIs exists; authentication of application users is not implemented.

Run `npm start` or `npm run dev` from the project root. Node.js 22.9 or newer is required by the environment-file flag; Node 24 is used by the Dockerfile. No external Node dependencies are installed.

Local demo mode creates `data/requests.json` on first write if absent, using 24 synthetic seed requests as a starting point. The organized local copy preserves existing records. Cloud mode requires a Google project and a Firestore Native `(default)` database. The collection is `civicpulse_requests`; each document has a `payload` string containing serialized request JSON. This organization does not change that storage format.

See [environment variables](../docs/ENVIRONMENT.md), [API contract](../docs/API.md) and [Google setup](../docs/GOOGLE-SETUP.md). The application remains a private hackathon prototype, not a public production service.
