# HTTP API

Frontend and backend share the same origin, normally http://localhost:8080. JSON POST requests use `Content-Type: application/json`. Errors return `{ "error": "message" }`; exact duplicates also return the existing `id`.

| Method | Path | Input | Success |
| --- | --- | --- | --- |
| GET | `/api/state` | None | 200: requests, districts, priorities, examples, aiMode, storage, audioEnabled |
| POST | `/api/requests` | district, text; optional audio | 201: saved request |
| POST | `/api/status` | id, status | 200: updated request |
| GET | `/api/brief?district=mysuru` | district query parameter | 200: plain text review brief |

Supported district IDs: `raichur`, `kalaburagi`, `mysuru`, `bengaluru`. Status values: `New`, `Under review`, `Resolved`.

Example request:

```json
{"district":"mysuru","text":"Please repair the village water supply."}
```

Audio uses `{ "mimeType": "audio/wav", "data": "BASE64_AUDIO" }` and requires live Vertex AI mode. Supported types: audio/webm, audio/wav, audio/mpeg, audio/mp4, audio/ogg. The browser limits files to 5 MiB; the server separately validates a base64 length limit of 7,000,000 characters and an overall body limit of 8 MiB. These existing limits are preserved.

Request fields: id, district, text, category, summary, language, urgency, reason, transcript, source, status, createdAt, synthetic. A new submission has `synthetic: false`; that indicates it was submitted rather than seeded, not that its content was verified.

Relevant errors: 400 validation failure; 403 cross-origin write rejection; 404 unknown route or missing status-update record; 409 exact duplicate; 413 oversized body; 500 operation failure. This prototype does not have user authorization. Deploy privately until role-based access is implemented. Duplicate checks are not transactional and do not guarantee uniqueness under concurrent submissions.
