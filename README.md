# Node A03 — MongoDB Integration + Mini CMS

A portfolio web app built with Node.js, Express, EJS, and MongoDB (via Mongoose). Projects, categories, and contact submissions are stored in MongoDB Atlas. Includes a Mini CMS at `/admin` for managing all content.

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root (see variables below).

3. Start the server:
   ```bash
   npm run dev   # development (auto-restart)
   npm start     # production
   ```

Server runs at `http://localhost:3133` (configured via `PORT` in `.env`; code default is `3100` if `PORT` is not set).

## Environment Variables

Create a `.env` file in the project root:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/a03
PORT=3133
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string (required) |
| `PORT` | Port to run the server on (default: `3100`) |

> `.env` is listed in `.gitignore` but should be included in the Learning Hub zip upload.

## Route Overview

### Public HTML Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Home page |
| GET | `/about` | About page |
| GET | `/projects` | Active projects list |
| GET | `/projects?q=term` | Search filter |
| GET | `/projects?tag=name` | Filter by tag (case-insensitive) |
| GET | `/projects?q=term&tag=name` | Combined filter |
| GET | `/projects/category/:slug` | Projects in a category |
| GET | `/projects/:slug` | Project detail (shows category + tags) |
| GET | `/contact` | Contact form |
| POST | `/contact` | Save submission, re-render with result |
| * | unmatched non-API | Templated HTML 404 |

### Admin Routes (no auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin` | Dashboard |
| GET | `/admin/contacts` | List all contact submissions |
| PATCH | `/admin/contacts/:id/read` | Toggle isRead → JSON |
| DELETE | `/admin/contacts/:id` | Delete submission → JSON |
| GET | `/admin/categories` | List categories with project count |
| GET | `/admin/categories/new` | New category form |
| POST | `/admin/categories` | Create category |
| GET | `/admin/categories/:id/edit` | Edit form |
| POST | `/admin/categories/:id` | Update, redirect |
| DELETE | `/admin/categories/:id` | Delete (refused if referenced) → JSON |
| GET | `/admin/projects` | List all projects |
| GET | `/admin/projects/new` | New project form |
| POST | `/admin/projects` | Create project |
| GET | `/admin/projects/:id/edit` | Edit form |
| POST | `/admin/projects/:id` | Update, redirect |
| DELETE | `/admin/projects/:id` | Delete → JSON |

### API Routes (JSON)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | Active projects (supports `?q=` and `?tag=`) |
| GET | `/api/projects/:id` | Project by ID or JSON 404 |
| GET | `/api/projects/category/:slug` | Active projects for a category slug |
| GET | `/api/categories` | Full category list |
| * | `/api/*` unmatched | JSON `{ "error": "Not found" }` |

## Project Structure

```
server.js
models/
  Category.js
  Project.js
  Contact.js
services/
  projectService.js     ← centralized filtering logic
routes/
  pageRoutes.js         ← public HTML routes
  adminRoutes.js        ← admin HTML + JSON actions
  apiRoutes.js          ← JSON API routes
views/
  layouts/
    layout-full.ejs
    layout-sidebar.ejs
  partials/
    nav.ejs
    footer.ejs
    project-card.ejs
    other-projects-list.ejs
  admin/
    dashboard.ejs
    contacts.ejs
    categories.ejs
    category-form.ejs
    projects.ejs
    project-form.ejs
  index.ejs
  about.ejs
  projects.ejs
  project-details.ejs
  contact.ejs
  404.ejs
public/
  css/styles.css
  images/projects/<slug>/
data/
  projects.json         ← legacy A02 data (not used by server)
```
