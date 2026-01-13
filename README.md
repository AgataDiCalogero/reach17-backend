# reach17-backend

Reach17 e una REST API in Node.js + Express con database MySQL-compatible
(TiDB Cloud). Il dominio copre tipologie di corso, corsi, atenei e le
associazioni many-to-many tra corsi e atenei.

## Scopo dell'API

- Gestire CRUD di course types, courses e universities.
- Gestire associazioni corso-ateneo.
- Restituire corsi con tipologia e atenei associati.

## Requisiti

- Node.js 20.x
- Database MySQL-compatible (TiDB Cloud o MySQL locale)

## Setup locale

```bash
npm install
cp .env.example .env
```

Compila `.env`, poi:

```bash
npm run db:migrate
npm run db:seed
npm run db:smoke
```

Avvio server:

```bash
npm run dev
# oppure
npm start
```

## Configurazione ambiente (.env)

Variabili realmente usate:

- `PORT` (opzionale, default `3000`)
- `NODE_ENV` (opzionale; in `production` abilita CORS ristretto e disabilita i log)
- `CORS_ORIGIN` (solo `production`; lista separata da virgola)
- `TIDB_HOST` (host DB)
- `TIDB_PORT` (default `4000`)
- `TIDB_USER`
- `TIDB_PASSWORD`
- `TIDB_DATABASE`
- `TIDB_ENABLE_SSL` (`true`/`false` come stringa)

Note:

- In `production`, se `CORS_ORIGIN` e vuoto, nessun origin viene autorizzato.
- In `development`, CORS e aperto su tutti gli origin.
- `TIDB_ENABLE_SSL=true` abilita TLS (richiesto su TiDB Cloud).

## Database

Migrazioni:

```bash
npm run db:migrate
```

`migrations.sql` elimina e ricrea le tabelle (DROP + CREATE). Usalo solo su un
DB che puo' essere ricostruito.

Seed demo:

```bash
npm run db:seed
```

`seed.sql` inserisce dati di esempio ed e idempotente (`INSERT IGNORE`).

Smoke test:

```bash
npm run db:smoke
```

Esegue `SELECT 1` per verificare la connessione.

## SQL safety

- Le query API usano `mysql2.execute()` con placeholder `?` e parametri separati.
- Non c'e concatenazione di input utente nelle query esposte dalle API.
- Migrazioni e seed eseguono SQL statico da file (`migrations.sql`, `seed.sql`).

## Test

Unit test:

```bash
npm test
```

Integration test (usa il DB reale e scrive dati):

```bash
npm run test:integration
```

Lo script imposta `RUN_INTEGRATION=true` e richiede `.env` completo.

## API documentation

- Base URL (local): `/api/v1`
- Base URL (prod): `https://reach17-backend.vercel.app/api/v1`
- Health check: `GET /api/v1/health` (anche `GET /health`)
- Swagger UI (local): `http://localhost:3000/api-docs`
- Swagger UI (prod): `https://reach17-backend.vercel.app/api-docs`
- OpenAPI raw (local): `http://localhost:3000/openapi`
- OpenAPI raw (prod): `https://reach17-backend.vercel.app/openapi`

## Deploy (Vercel)

- Importa il repository in Vercel.
- Imposta Node 20.
- Configura le variabili d'ambiente: `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`,
  `TIDB_PASSWORD`, `TIDB_DATABASE`, `TIDB_ENABLE_SSL` (e `CORS_ORIGIN` se
  `NODE_ENV=production`).
- Esegui migrazioni/seed sul DB target prima del deploy.

Nota serverless:

- Il pool DB e creato a livello di modulo (`connectionLimit: 5`). In ambienti
  serverless possono esistere piu' istanze in parallelo: verifica i limiti di
  connessione del DB e adegua il piano/limitazioni.

## Scelte progettuali

- Architettura a livelli: routes -> controllers -> services -> repositories -> DB.
- Gestione errori centralizzata con `AppError` e formato risposta coerente.
- Vincoli DB (unique e FK) mappati a `409 CONFLICT`.
- Delete corso: rimuove prima le associazioni in `course_universities`.

## Documentazione tecnica

- Contratto API: `src/docs/api-contract.md`
- Schema DB: `src/docs/db-schema.md`
- Requisiti: `src/docs/requirements.md`
- Use cases: `src/docs/use-cases.md`
