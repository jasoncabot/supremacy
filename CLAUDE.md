# Supremacy

A turn-based, hidden-information strategy game (Star Wars: Rebellion / Supremacy theme).
Two factions — **Empire** and **Rebellion** — play on a galaxy of sectors and planets.

The defining mechanic: there is a single **truthful game state**, but each player only
ever sees what their faction has discovered or owns. Players issue orders against what
they *believe* exists, which may be stale or wrong. Orders are submitted at the end of a
turn and resolved in a deterministic order.

## Stack & layout

- **Cloudflare Worker** backend (`worker/`), routed with `itty-router` (`worker/index.ts`).
- **Durable Objects** (`worker/durable-objects/`) hold all persistent state:
  - `GamesDurableObject` — one per game; owns the game state and view projection.
  - `UsersDurableObject`, `TokensDurableObject` — user/saved games, auth tokens.
- **React 19 + Vite** frontend (`src/`), Tailwind v4, React Router. Game UI lives in `src/game/`.
- Shared API types live in **`worker/api.ts`** and are imported by both worker and frontend. This is the contract — change it deliberately.
- Tests: `test/index.spec.ts` (Vitest + `@cloudflare/vitest-plugin`), uses snapshots and a seeded-determinism helper (`test/determinism.ts`).

## The hidden-information boundary (most important rule)

There are three data layers in `worker/api.ts`. Keep them distinct:

- **Metadata** (`PlanetMetadata`, `SectorMetadata`) — static, public, known to everyone.
- **State** (`GameState`, `PlanetState`, `FactionState`) — the **ground truth**. Required fields, concrete values. This is secret.
- **View** (`GameView`, `PlanetView`, `FactionView`) — what one faction is allowed to see. Fields are optional precisely because a faction may not know them.

Rules:

1. **`GameState` never leaves the Durable Object.** Every byte sent to a client must be a
   `GameView` produced by `projectView`. Do not add a response type or endpoint that
   serializes `GameState` (a `GetGameResponse`-style "view + full state" type was removed
   for this reason — don't reintroduce it).
2. **`projectView(faction, gameState)` in `GamesDurableObject.ts` is the only crossing**
   from truth to view. It is written **default-deny**: it builds a fresh object literal
   naming exactly the fields a faction may see. Adding a field to `PlanetState` leaves it
   hidden until you *explicitly* add it to `projectPlanetView`. Keep it that way — never
   assign a whole `*State` object into a view slot (TypeScript allows it structurally and
   it will silently leak secrets over JSON).
3. **Views are derived on read, never stored.** `view()` loads `gameState` and calls
   `projectView`. Do not persist pre-computed views — that reintroduces stale-data and
   leak risks and must be regenerated on every mutation.

## Turn / command model (in progress)

Current target flow (not all implemented yet — don't assume the resolution loop exists):

1. Game starts: `create()` builds the truthful `GameState` and stores it.
2. Players queue orders client-side against their **view** (orders embed a snapshot of what
   the player believed — treat that as a *claim*, not fact).
3. On end-of-turn, orders are applied to `gameState` in a **deterministic order**, mutating
   the truth in place.
4. Clients re-fetch; `view()` re-derives each faction's view from the new truth.

When you build resolution: mutate `gameState` only, then `storage.put("gameState", …)`.
Views need no maintenance — they recompute from truth. An order may target something that
no longer exists or never did; resolve that against the truth (destroyed / already moved /
decoy), don't trust the order's embedded snapshot.

## Error handling across boundaries

There is **one error type** (`ApiError` in `worker/api.ts`: `status`, `code`, `message`)
and **one place** errors become HTTP responses: `errorResponse` in `worker/errors.ts`,
wired as the `catch` and `missing` handler on the routers in `worker/index.ts`. Every
error funnels through it: `ApiError`s pass through as `{ error: { code, message } }` with
their status; anything else is logged server-side and returned as an opaque 500 (or 503 if
the failure carries Cloudflare's `.overloaded` flag) so internal detail never leaks.

The hard rule that makes this work:

1. **Durable Object RPC methods never throw — they return `Result<T>`.** Build it with
   `ok(value)` / `err(status, code, message)` from `worker/errors.ts`. This is not style:
   RPC serialization reconstructs a thrown `Error` as a bare `Error`, **dropping `status`,
   `code`, and the prototype** (only `message` and the prototype `name` survive). A plain
   `Result` object survives structured clone intact, so error metadata crosses the boundary.
   Returning `{ error: new ApiError(...) }` does **not** work — an `Error` *instance* loses
   its own properties the same way. There is no throw to leak, by construction.
2. **Convert `Result` → throw only on the worker side, with `unwrap`.** Routers and
   middleware call `unwrap(await stub.method(...))`; it re-throws the `ApiError` *in the
   worker isolate*, where properties are intact and `errorResponse` can format it. A DO
   that calls another DO propagates a failure as a value (`if (!r.ok) return r;`), never by
   unwrapping mid-chain.
3. **Throwing `ApiError` directly is fine in worker-side code** (request handlers,
   middleware, helpers) — it never crosses RPC there, so it reaches `errorResponse` intact.
4. **`message` is shown to the user; keep it client-safe.** No stack traces, storage keys,
   or upstream errors — log those instead. Auth failures stay deliberately opaque (a missing
   user and a wrong password both return the same 401, so usernames don't leak).

## Game storage

A game's truth is stored as rows in its `GamesDurableObject` (SQLite): `game`, one `planets`
row per planet (everything planet-based stays inside it as JSON), `factions`, and
`notifications` (one row each, tagged with the faction it is for). Planets and factions are
loaded whole each turn; notifications are the part that grows over a long game, so a view only
reads its own faction's latest `VIEW_NOTIFICATIONS`. Sectors are static metadata and aren't
stored, and a faction's controlled planets are derived from planet owners, not stored.
`loadGameState` assembles a `GameState` for `projectView`; the hidden-information rules above
are unchanged. Changing a table needs a migration plan: existing games keep their old shape.

## Games and links

`GamesDurableObject` is the single source of truth for a game (state, players, factions).
`UsersDurableObject.games` is only a cached link per game so listing is one indexed query;
it can always be rebuilt. Two objects can't share a transaction, so link changes go through
an outbox: the Games DO records `players.link_state` in the same SQL transaction as the
change, pushes it inline, and retries from `alarm()` if that fails. Link operations must stay
idempotent and order-independent (deleted games leave a tombstone, and an older link never
overwrites a newer one). `alarm()` must not throw: the runtime gives up on a failing alarm
after a few retries, so it reschedules itself instead. Deleting a game hard-deletes it (`deleteAll`) only after every link is removed.
Anything that changes a game's listed fields (name, last played, completed) should mark the
players `pending` and reuse `syncLinks`, not call the Users DO directly.

WebSockets aren't used yet; when added, apply the same rule at that boundary (a single
error shape, converted at the edge, never leaking internals).

## Public repository: no secrets, no private data

This repository is public. Never commit or publish secrets or anything private.

- Secrets (API keys, tokens, passwords) live in `.dev.vars` locally (git-ignored) and `wrangler secret put` when deployed. Never in `.env`, `wrangler.jsonc`, source, tests, docs or logs.
- `.dev.vars.example` lists every secret name with empty values. Update it whenever a secret is added.
- Don't log tokens, reset links or personal data (emails, passwords) in deployed code.
- Check `git diff` for credentials, personal emails and internal URLs before committing.

## Types and environments

- Never hand-write `Env` or binding types. Run `npm run cf-typegen` (`wrangler types`) after changing `wrangler.jsonc` and commit `worker-configuration.d.ts`.
- Environments are `dev`, `test` and `production` only, defined in `wrangler.jsonc`. Select one with `CLOUDFLARE_ENV` at build time, not `wrangler deploy -e`.
- Tests access bindings via `cloudflare:workers` (`env`, `exports`).

## Code comments

- British English, concise, and only where the code isn't self-explanatory. Explain why, not what.
- Match the style of the surrounding code.

## Conventions

- **Indentation: tabs** (see `.editorconfig` / `.prettierrc`). LF, final newline, no trailing whitespace.
- Node version pinned in `.nvmrc` (v22.14.0).
- Keep shared types in `worker/api.ts`; the frontend imports worker types directly via relative paths.
- Stub/unimplemented seams are marked with `TODO` (e.g. `submitActions` in `src/game/GameContext.tsx`). Real behavior is still being built — check before assuming a feature works end-to-end.

## Commands

```bash
npm run dev         # vite dev server (CLOUDFLARE_ENV=dev)
npm run typecheck   # tsc -b
npm run lint        # eslint .
npm test            # vitest run (worker pool)
npm run build       # vite build
npm run deploy:dev  # build + wrangler deploy to dev
```

Run `npm run typecheck`, `npm run lint`, and `npm test` before considering a change done.
The snapshot test creates a game and depends on seeded randomness — if you change
generation logic, the snapshot will need an intentional update.
