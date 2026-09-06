# Logs

- `restructure-2026-09-06.json`: tracked record of moves performed during the restructuring.
- `build.log`: timestamped build successes, written by `npm run build`.
- `access.log`: local preview requests, written by `npm run preview`.
- `error.log`: build failures and local preview file/server errors.

Operational `.log` files are gitignored and excluded from `dist/`. They describe local tooling, not visitor analytics or production telemetry. Production hosting keeps its own logs. These files can be cleared when no longer needed; keep the tracked migration manifest.
