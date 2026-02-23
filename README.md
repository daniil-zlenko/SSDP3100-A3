# Node A02 — View Engine Refactor

A portfolio web app built with Node.js and Express, refactored from A01 to use **EJS** as a server-side view engine with layout templates, shared partials, and a centralized project repository.

## Setup

```bash
npm install
npm run dev   # development (auto-restart on file change)
npm start     # production
```

Server runs at `http://localhost:3000` by default.

## View Engine

**EJS** via [`express-ejs-layouts`](https://www.npmjs.com/package/express-ejs-layouts).

Two layouts:
- `views/layouts/layout-full.ejs` — header + nav + full-width main + footer (used by all standard pages)
- `views/layouts/layout-sidebar.ejs` — header + nav + main content + sidebar + footer (used by `/projects/:slug`)

## Routes

### HTML Pages

| Method | Path | View | Description |
|--------|------|------|-------------|
| GET | `/` | `index.ejs` | Welcome page |
| GET | `/about` | `about.ejs` | About page |
| GET | `/projects` | `projects.ejs` | Server-rendered project list; supports `?q=` search |
| GET | `/projects/:slug` | `project-details.ejs` | Project detail with sidebar layout |
| GET | `/contact` | `contact.ejs` | Contact form |
| POST | `/contact` | `contact-success.ejs` | Logs submission, renders success view |
| * | any unmatched | `404.ejs` | Templated 404 page |

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | Active projects as JSON; supports `?q=` search |
| GET | `/api/projects/:id` | Single project by ID as JSON, or 404 |
| * | `/api/*` (unmatched) | JSON `{ "error": "Not found" }` |

## Search

`?q=term` filters by partial, case-insensitive match against: `title`, `tagline`, `description`, `stack[]`, `tags[]`.

Works on both `/projects?q=` (HTML) and `/api/projects?q=` (JSON).

## Project Structure

```
/server.js
/src/server/routes/pages.routes.js
/src/server/routes/api.routes.js
/src/server/lib/projects.repository.js
/views/layouts/layout-full.ejs
/views/layouts/layout-sidebar.ejs
/views/partials/nav.ejs
/views/partials/footer.ejs
/views/partials/project-card.ejs
/views/partials/other-projects-list.ejs
/views/index.ejs
/views/about.ejs
/views/projects.ejs
/views/project-details.ejs
/views/contact.ejs
/views/contact-success.ejs
/views/404.ejs
/data/projects.json
/public/css/styles.css
/public/images/projects/<slug>/
```

## Data

Projects loaded from `/data/projects.json`. Top-level shape: `{ "projects": [...] }`. Each project has an `active` boolean field; only active projects appear on the HTML and API list endpoints.

## Key Changes from A01

- `res.sendFile()` replaced by `res.render()` with EJS views
- `/routers/` moved to `/src/server/routes/`
- Contact POST renders a success page instead of returning JSON
- Projects list is now server-rendered (no client-side fetch)
- `/projects/:slug` detail page uses sidebar layout with server-rendered "Other Projects"
- All data access logic centralized in `projects.repository.js`

## Notes / Assumptions

- Static assets served from `public/`.
- `/api/projects` and `/projects` return only projects where `active === true`.
- `/api/projects/:id` can return active or inactive projects by ID.
- Unknown `/api/*` routes return JSON 404; other unmatched routes return a templated HTML 404.
