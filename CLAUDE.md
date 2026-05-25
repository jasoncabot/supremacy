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
  - `MatchmakerDurableObject`, `UsersDurableObject`, `TokensDurableObject` — matchmaking, user/saved games, auth tokens.
- **React 19 + Vite** frontend (`src/`), Tailwind v4, React Router. Game UI lives in `src/game/`.
- Shared API types live in **`worker/api.ts`** and are imported by both worker and frontend. This is the contract — change it deliberately.
- Tests: `test/index.spec.ts` (Vitest + `@cloudflare/vitest-pool-workers`), uses snapshots and a seeded-determinism helper (`test/determinism.ts`).

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
