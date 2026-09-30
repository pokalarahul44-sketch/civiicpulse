# Environment variables

Place local settings in `.env` at the project root. Copy `.env.example`, which contains no secrets. Run commands from the root so Node reads the expected environment file.

| Variable | Default | Purpose |
| --- | --- | --- |
| AI_MODE | demo behavior | `vertex` enables real Gemini analysis; other values use demo rules |
| STORAGE_MODE | local behavior | `firestore` enables Cloud Firestore; other values use local JSON |
| PORT | 8080 | HTTP listening port; use 8081 if another copy runs on 8080 |
| GOOGLE_CLOUD_PROJECT | unset | Required for either live Google service |
| GOOGLE_CLOUD_LOCATION | global | Vertex AI endpoint location |
| GEMINI_MODEL | unset | Exact available model ID; required in Vertex mode |
| DATA_DIR | project-root/data | Optional local data directory; relative values resolve from process working directory |
| K_SERVICE | set by Cloud Run | Platform signal for metadata authentication and listening on all interfaces; do not set locally |

No variables are mandatory for local demo mode. Live mode requires project access, API enablement, billing where applicable, suitable IAM roles and a valid model.

Local Google calls use the signed-in gcloud identity. Cloud Run uses its attached service account. No API keys or downloaded service-account private keys are needed by this implementation. Do not commit tokens, `.env` variants, or credential JSON files. Ignore patterns reduce accidental inclusion but are not a substitute for reviewing `git diff --cached`.

AI and storage modes are independent: demo analysis can be combined with Firestore. The current UI's generic sentence about demo mode using no Google services is inaccurate in that mixed configuration; it is retained during this structure-only reorganization and recorded as a known issue. The separate storage label identifies the configured provider.
