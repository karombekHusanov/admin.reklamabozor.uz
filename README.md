# AdSpace Admin

Vue 3 + TypeScript admin panel for the AdSpace marketplace. Talks to the Laravel API in `../adspace_backend`.

## Stack

- Vue 3 (Composition API) + TypeScript + Vite
- Vue Router + Pinia
- Tailwind CSS v4 + shadcn-vue primitives (reka-ui)
- @lucide/vue icons
- Axios

All dependencies installed at their latest stable versions at scaffold time.

## Getting started

```bash
cd adspace_admin
npm install
npm run dev
```

- Admin panel: `http://localhost:5174`
- Backend API: `http://localhost:8000` (proxied as `/api`)

## Default admin credentials

Seeded by `adspace_backend/database/seeders/SuperAdminSeeder.php`:

- email: `admin@reklamabozori.uz`
- password: `password`

## Modular architecture

Each feature module owns its **pages**, **components**, **routes**, **services**, **stores**, and **types**.
Global UI primitives (shared across all modules) live in `src/core/ui/`.

```
src/
├── app/                    # Application entry
│   ├── App.vue
│   ├── main.ts
│   └── router.ts
├── core/                   # Shared infrastructure
│   ├── api/                # axios client, error helpers
│   ├── composables/
│   ├── constants/
│   ├── lib/                # cn() helper, utils
│   ├── types/              # ApiSuccess / ApiError
│   └── ui/                 # Global components: Button, Card, Input, Label
└── modules/
    ├── auth/               # Login, store, API service
    │   ├── pages/
    │   ├── stores/
    │   ├── services/
    │   ├── types/
    │   ├── routes/
    │   └── index.ts        # barrel export
    ├── shell/              # AdminLayout, Sidebar, TopBar
    │   ├── layouts/
    │   ├── components/
    │   ├── constants/
    │   ├── routes/
    │   └── index.ts
    └── dashboard/          # Dashboard landing
        ├── pages/
        ├── routes/
        └── index.ts
```

### Adding a new module

1. Create `src/modules/{name}/` with the standard subfolders.
2. Export `routes` from `src/modules/{name}/routes/index.ts`.
3. Aggregate it into `src/modules/shell/routes/index.ts` as a child of `AdminLayout`.
4. Add the navigation entry to `src/modules/shell/components/Sidebar.vue` and `src/modules/shell/constants/routes.ts`.

Cross-module imports go through each module's `index.ts` barrel — don't deep-import another module's internals.

## Auth flow

1. Unauthenticated user hits any protected route → router guard redirects to `/login` with `?redirect=…`.
2. `LoginPage` posts to `POST /api/v1/auth/admin/login` (only `role=admin` accounts pass).
3. Backend returns Sanctum token → stored in `localStorage['adspace_admin_token']`.
4. axios request interceptor attaches `Authorization: Bearer …` on every request.
5. 401 response interceptor wipes the token; the next guard hit redirects back to `/login`.

On page refresh, the store calls `GET /api/v1/auth/me` to restore the user from the stored token.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 5174 |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |
