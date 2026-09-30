# Four-person contribution workflow

Use one shared repository with `main` as the integration branch. Each developer uses their own GitHub account and local identity. Work on the assigned feature branch, open a pull request and ask a teammate to review it. Do not share credentials or create commits attributed to another person.

## Ownership

| Role | Branch | Primary responsibility |
| --- | --- | --- |
| Frontend 1 | feature/frontend-ui | frontend/public/index.html and rendering functions in app.js |
| Frontend 2 | feature/frontend-integration | frontend/public/style.css, forms, event handlers and API calls in app.js |
| Backend 1 | feature/backend-api | backend/src/server.mjs and services/ |
| Backend 2 | feature/backend-database | backend/src/storage/, logic.mjs and tests |

The frontend is small and both developers share app.js. Coordinate before editing overlapping functions. Review root configuration and API contract changes together. Authentication of application users is future work; Google service authentication already lives in services/google-auth.mjs.

## First developer: create and upload the repository

Create an empty repository named `civicpulse` on GitHub using your own account, without generated README, license or gitignore files. Choose its visibility deliberately. Invite the other three developers as collaborators; they must accept the invitation. The following PowerShell commands run from this project folder. Supply the repository owner's GitHub username and your own actual Git identity when prompted.

```powershell
$repoOwner = Read-Host 'GitHub repository owner username'
$authorName = Read-Host 'Your own Git commit name'
$authorEmail = Read-Host 'Your own Git commit email or GitHub noreply email'
git init -b main
git config user.name "$authorName"
git config user.email "$authorEmail"
git add .
git status --short
git diff --cached --stat
git diff --cached
```

Review the staged files before continuing. Confirm no local data, `.env` files, tokens or credentials are included. The current LICENSE is a pending-choice notice, not an open-source grant; choose a real license before advertising the project as open source.

```powershell
git commit -m "Import existing CivicPulse prototype with organized project structure"
git remote add origin "https://github.com/$repoOwner/civicpulse.git"
git push -u origin main
git switch -c feature/frontend-ui
```

The initial commit imports an existing assisted prototype; it should not claim all four developers independently authored it. Normal GitHub authentication may prompt through a credential manager. Never put a token in the remote URL.

## Other three developers: clone and create branches

Each developer runs this in their own development directory and signs in with their own GitHub account:

```powershell
$repoOwner = Read-Host 'GitHub repository owner username'
git clone "https://github.com/$repoOwner/civicpulse.git"
Set-Location civicpulse
$authorName = Read-Host 'Your own Git commit name'
$authorEmail = Read-Host 'Your own Git commit email or GitHub noreply email'
git config user.name "$authorName"
git config user.email "$authorEmail"
```

Then run only the command for your role:

```powershell
# Frontend Developer 2
git switch -c feature/frontend-integration

# Backend Developer 1
git switch -c feature/backend-api

# Backend Developer 2
git switch -c feature/backend-database
```

Use `npm start` and `npm test` from the root. No dependency installation is required.

## Daily work and pull requests

Start with a clean working tree; commit your existing work before merging updated main.

```powershell
git fetch origin
git merge origin/main
npm test
```

Make your change, then review and commit only the files belonging to it:

```powershell
git status
git diff
git add --patch
git diff --cached
npm test
git commit -m "Describe the actual change"
git push -u origin HEAD
```

For new files, stage their exact paths explicitly, because `git add --patch` does not add untracked files. Open a pull request to `main` in GitHub and include the problem, change and validation. After review, merge it and synchronize your branch. Configure main-branch protections and required test checks if available to the repository.

Do not commit generated archives, local saved requests, secrets, caches or build output. Preserve endpoint names, record fields and scoring behavior unless a separately reviewed feature requires a change. Keep credential and cloud tests out of public CI; current tests use synthetic data and temporary local storage.
