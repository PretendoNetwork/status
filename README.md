# Pretendo status page

This repository contains the source code for the work-in-progress status page for Pretendo.

# Running locally for development

Prerequisites:
- Clone the repository
- Have Docker Desktop installed (or Docker engine)
- Have NodeJS 24 or higher installed

Then follow these steps:
- Run `docker compose up -d` inside `/.docker`
- Create a file called `.env` in the root, fill it with the contents of `example.env`
- Install dependencies with `npm i`
- Run latest migrations with `npm run migration:deploy`
- Run the app with `npm run dev`

If you need to make database changes, you can use `npm run migration:create` followed by a `npm run migration:deploy`.

# Configuration

The application can be configured with environment variables. `.env` files are available for development.

To have the application check anything you need to configure checks and services. They have to be configured with a `checks.json` (see `example.checks.json` for an example).

| Variable                        | Description                             | Default                    |
| ------------------------------- | --------------------------------------- | -------------------------- |
| `PN_STATUS_PUBLIC_HOMEPAGE_URL` | Homepage of the main website            | `https://pretendo.network` |
| `PN_STATUS_DATABASE_URL`        | Postgres connection URL of the database | -                          |
| `PN_STATUS_CHECK_CONFIG_FILE`   | Location of the `checks.json` file      | -                          |
| `PN_STATUS_API_KEY`             | API key for the admin API               | -                          |

# Todos

Frontend:
- [x] View status
- [ ] View incidents
- [x] Realtime updates (with tanstack query)
- [x] Historic uptime view
- [ ] Improve navbar
- [ ] Improve loading spinner
- [ ] Implement error page + 404 page

Backend:
- [x] HTTP checks
- [x] UDP echo checks
- [ ] Incident CRUD endpoints
- [x] Caching
- [ ] Clear old data
- [x] Historic uptime data
