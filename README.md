# reach17-backend

Reach17 - REST API Node/Express + MySQL (Start2Impact)

## Requisiti

- Node.js 20.x
- Database MySQL-compatible (es. TiDB Cloud)

## Installazione

```bash
npm install
cp .env.example .env
```

## Configurazione (.env)

Compila `.env` con le credenziali del database e, in produzione, `CORS_ORIGIN`.
Se `CORS_ORIGIN` è vuoto in produzione, nessun origin viene autorizzato.

Variabili principali:

- `PORT` (opzionale, default `3000`)
- `CORS_ORIGIN` (solo produzione; lista separata da virgola)
- `TIDB_HOST`
- `TIDB_PORT` (default `4000`)
- `TIDB_USER`
- `TIDB_PASSWORD`
- `TIDB_DATABASE`
- `TIDB_ENABLE_SSL` (`true`/`false`)

## Verifica database

```bash
npm run db:smoke
```

## Migrazioni

Lo schema e disponibile in `migrations.sql`. Esegui le migrazioni con il client
MySQL compatibile (es. TiDB Cloud) secondo il tuo ambiente.

## Test

```bash
npm test
```

Lint:

```bash
npm run lint
```

Test di integrazione su DB reale (richiede `.env` configurato):

```bash
npm run test:integration
```

Lo script imposta `RUN_INTEGRATION=true` ed esegue solo i test in `test/integration`
su Windows/macOS/Linux.

## Avvio

```bash
npm start
```

Per sviluppo con reload:

```bash
npm run dev
```

## Deploy su Vercel

- Importa il repository in Vercel.
- Imposta Node 20 e le variabili d'ambiente (stesse di `.env`).
- Configura `CORS_ORIGIN` con il dominio del front-end.
- Se usi funzioni serverless, valuta un adapter Express o un `vercel.json` dedicato.

## Swagger

- Swagger UI: `http://localhost:3000/api-docs`.
- Spec OpenAPI: `src/docs/openapi.yaml` (raw: `http://localhost:3000/openapi`).
- Per testare: avvia il server e apri l'URL `/api-docs` nel browser.

## Note operative

- `CORS_ORIGIN` in produzione accetta una lista separata da virgola.
- TiDB Cloud richiede TLS/SSL: imposta `TIDB_ENABLE_SSL=true` se richiesto.

## Documentazione

- Contratto API: `src/docs/api-contract.md`
- Schema DB: `src/docs/db-schema.md`
- Requisiti e casi d'uso: `src/docs/requirements.md`, `src/docs/use-cases.md`
