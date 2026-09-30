# Frontend — what people see and interact with

Open `public/index.html` to explain the four screens: priority overview, citizen request form, request register and scoring methodology. Their layouts are sections of one page.

- `public/index.html`: page structure, labels and forms. Frontend Developer 1 leads.
- `public/app.js`: reusable rendering functions, navigation, request submission, search, filters and API integration. Frontend Developer 1 owns rendering functions; Frontend Developer 2 owns API calls and event handlers. Coordinate edits to this shared file.
- `public/style.css`: visual styling and responsive layouts. Frontend Developer 2 leads.

There is no React build, separate frontend package, or dependency installation. From the project root, run `npm start` and open http://localhost:8080. If the original demo is still using that port, set `PORT=8081` in a root `.env` file and use http://localhost:8081.

The backend serves these files and the API on the same origin. Do not open the HTML directly from Explorer to run the app: the request form needs the Node server. Browser requests use relative `/api/` URLs; no API keys belong in this directory.

API contract: [API documentation](../docs/API.md). Keep element IDs and endpoint paths stable when editing. Google Fonts is the only externally loaded visual asset; system fonts are the fallback.
