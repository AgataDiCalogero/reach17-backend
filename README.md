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

## Test

```bash
npm test
```

Test di integrazione su DB reale (richiede `.env` configurato):

```bash
npm run test:integration
```

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

- Endpoint previsto: `/api-docs`.
- Al momento non è attivo: verrà aggiunto con la documentazione OpenAPI.
