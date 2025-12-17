# @zanadeal/api

## oRPC : exemple concret (feature test)

Ce package expose un `appRouter` oRPC consommé par `apps/server`.

Un exemple complet (store en mémoire + routes GET/POST + test) est disponible dans `src/features/hotel/` :

- `hotel.schemas.ts` : schémas Zod (input/output)
- `hotel.store.ts` : stockage en mémoire (variables en module scope)
- `hotel.router.ts` : procédures oRPC avec `.route({ method, path })`
- `hotel.openapi.test.ts` : test qui démarre un `OpenAPIHandler` et appelle les routes HTTP via `fetch`

### Pourquoi `.route()` ?

- `RPCHandler` sert le protocole RPC propriétaire (client `RPCLink`).
- `OpenAPIHandler` sert de vraies routes HTTP (GET/POST/...) basées sur `.route({ method, path })`.

### Lancer le test

Depuis la racine du monorepo :

- `npm -w @zanadeal/api test`

Le test vérifie :

- `POST /hotels` crée un hôtel
- `GET /hotels/{id}` récupère le même hôtel
