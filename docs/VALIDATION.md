# Validation record

Checked locally on September 30, 2026 using Node.js 24.20.0.

## Passed

- JavaScript syntax checks for server, Google integration and browser code.
- Six automated tests: multilingual sample categories; unknown-category handling; score bounds and population-normalized demand; consistent brief counts/scores; model-output validation; unique sample records and valid districts.
- Browser inspection at the available narrow preview width: dashboard, responsive navigation, request form and saved-request confirmation rendered without visible overlap in the inspected views.
- Submitted a synthetic English water request through the browser. The app confirmed Water classification and a saved request reference.
- Refreshed the browser and verified the stored request remained visible, count changed from 24 to 25, and Raichur's score changed from 75 to 77.
- API checks for invalid district, empty request, duplicate rejection, status update, brief consistency and invalid brief district.
- Changed the test record to Under review, then confirmed that status after refresh.
- `.env` is not served by the web server's explicit static-file allowlist.
- Exported `SAMPLE-BRIEF.txt` from the running application.

## Not yet verified

- Authenticated Vertex AI text/audio calls, model availability, IAM configuration and quotas.
- Cloud Firestore read/write operations in the user's project.
- Cloud Run build, deployment, private access and persistence across instance restarts.
- Google AI Studio workspace import/build; the supplied prompt has not been run there.
- Broad browser/device, accessibility, load, security and multilingual quality evaluation.

The local preview has one clearly labeled test submission. The source ZIP excludes local data and starts with the original 24 synthetic seed requests. No cloud resources, billing configuration, or external user accounts were created.

## Organized copy validation
Seven tests passed after module extraction and path updates, including a new API integration test with server restart and temporary storage. See ORGANIZATION-REPORT.md for the complete scope. The original validation above describes the earlier flat-layout demo; its 25-record observation is historical. Existing local records were preserved in this copy.

