# Connect the demo to Google Cloud

No cloud resources have been created. Perform these steps in your own account when ready. Billing may be required; set a budget alert before running live services. Budget alerts do not cap spending.

## 1. Project and APIs

Create a dedicated hackathon project in the Google Cloud console and link billing. Note the project ID. Enable Vertex AI API (`aiplatform.googleapis.com`), Firestore API (`firestore.googleapis.com`), Cloud Run Admin API (`run.googleapis.com`), Cloud Build API (`cloudbuild.googleapis.com`) and Artifact Registry API (`artifactregistry.googleapis.com`).

In Firestore, create the `(default)` database in Native mode. Choose a suitable region before creating it. Do not enable open client access. This app talks to Firestore only from its server using IAM, not browser Firebase credentials; server IAM access is not restricted by Firestore client security rules.

In Vertex AI Model Garden, choose an available Gemini Flash model that supports text, audio and structured JSON output. Copy the exact model ID and check supported regions. The template leaves the model ID blank deliberately, so it cannot assume access to a retired or unavailable model. `global` is convenient for a synthetic demo; use a supported regional endpoint if residency is required.

## 2. Try live mode locally

Install the official Google Cloud CLI. Sign in to your project:

```text
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

Your signed-in identity needs Vertex AI User (`roles/aiplatform.user`) and Cloud Datastore User (`roles/datastore.user`) access. An administrator may need to grant these roles. Do not use or download a service-account private key.

Copy `.env.example` to `.env` and set:

```text
AI_MODE=vertex
STORAGE_MODE=firestore
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
GOOGLE_CLOUD_LOCATION=global
GEMINI_MODEL=YOUR_AVAILABLE_GEMINI_MODEL_ID
PORT=8080
```

Restart `npm start`. The badge should read “Gemini on Vertex AI”; the method page should show Cloud Firestore. The Firestore database starts empty; the local sample requests are not silently uploaded. District baselines still use synthetic data. Submit several synthetic requests across the four districts to populate the dashboard.

Test a new Hindi or Kannada request, then a short WAV/MP3/WebM recording under 5 MB. The server sends that text/audio to Vertex AI. Audio bytes are not stored; the transcript, summary and classification are saved in Firestore. Review the transcript before using its meaning in a demo.

If a call fails, check API enablement, IAM roles, billing, the model ID, quota and location. Live mode does not fall back to fake AI results. Local authentication uses `gcloud auth print-access-token`; on Cloud Run it uses the service identity's metadata token.

## 3. Private Cloud Run deployment

Use Google Cloud Shell so the following Bash commands run in a known environment. Upload the source folder without `.env`, `data/`, or secrets, and run from its root. Replace the three placeholders first.

```bash
PROJECT_ID='YOUR_PROJECT_ID'
REGION='YOUR_CLOUD_RUN_REGION'
MODEL_ID='YOUR_AVAILABLE_GEMINI_MODEL_ID'
gcloud config set project "$PROJECT_ID"
gcloud services enable aiplatform.googleapis.com firestore.googleapis.com run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
gcloud iam service-accounts create civicpulse-runtime --display-name='CivicPulse runtime'
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:civicpulse-runtime@$PROJECT_ID.iam.gserviceaccount.com" --role=roles/aiplatform.user
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:civicpulse-runtime@$PROJECT_ID.iam.gserviceaccount.com" --role=roles/datastore.user
gcloud run deploy civicpulse --source=. --region="$REGION" --service-account="civicpulse-runtime@$PROJECT_ID.iam.gserviceaccount.com" --no-allow-unauthenticated --max-instances=1 --concurrency=10 --memory=512Mi --set-env-vars="AI_MODE=vertex,STORAGE_MODE=firestore,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,GOOGLE_CLOUD_LOCATION=global,GEMINI_MODEL=$MODEL_ID"
```

The deploying identity needs appropriate deployment, source-build, and service-account-use permissions. Organization policies can also restrict source builds. The deployment may prompt you to enable APIs or create a source repository; inspect these account-specific prompts. The commands are a setup template, not a record of a completed deployment.

The service is intentionally private because this prototype has no application-level user roles. An authenticated Cloud Run URL is not a public share link. To view it locally using an authorized identity:

```bash
gcloud run services proxy civicpulse --region="$REGION" --port=8081
```

Open http://localhost:8081. A separate judge identity needs Cloud Run Invoker access if they run their own proxy. Add Firebase Authentication and verify officer roles server-side before a public citizen-facing launch. Do not remove Cloud Run authentication just to make the current prototype shareable.

Cloud Run's local disk is ephemeral: always use `STORAGE_MODE=firestore` for live hosted mode. The container has no installed gcloud CLI and uses its attached service identity instead.

## 4. Develop with Google AI Studio

Open [Google AI Studio](https://aistudio.google.com/) and use its app-building experience. Use `AI-STUDIO-PROMPT.md` as the initial specification. If importing an existing repository is available in your workspace, import this project; otherwise provide its files through the supported workspace flow. Do not paste `.env` or credentials into prompts.

AI Studio may generate its own Gemini Developer API integration by default. Ask it to preserve the server-side Vertex AI route if the submission specifically requires Vertex AI. This repository was prepared locally and has not been imported into an AI Studio workspace for you.

## 5. Before presenting the live version

- Confirm a fresh multilingual request produces a sensible summary and category.
- Confirm audio transcription with your chosen model and audio format.
- Confirm a saved request survives a Cloud Run restart through Firestore.
- Confirm one district's brief agrees with the dashboard count and score.
- Confirm only authorized judges can access the private service.
- Show the synthetic-data label and explain what has not yet been connected.
- Check Cloud Billing after the session and remove unneeded resources through the console when finished.
