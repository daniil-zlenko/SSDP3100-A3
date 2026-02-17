# Node A01 - Portfolio Launchpad

## Install

```bash
npm install
```

## Run

Development mode (watch):

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

## Routes

Pages:

- `GET /`
- `GET /about`
- `GET /projects`
- `GET /contact`

Contact:

- `POST /contact` (JSON response)

API:

- `GET /api/projects`
- `GET /api/projects?q=keyword`
- `GET /api/projects/:id`

## Notes / Assumptions

- Static assets are served from `public`.
- HTML pages are served via `res.sendFile()` from `pages`.
- `/api/projects` returns projects where `active === true`.
- `/api/projects/:id` can return both active and inactive projects by id.
- Unknown `/api/*` routes return JSON 404; other routes return text 404.
