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

Compila `.env` con le credenziali del database e, in produzione, `CORS_ORIGIN`.

## Verifica database

```bash
npm run db:smoke
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

- Quando aggiunto, Swagger sara disponibile all'endpoint configurato (es. `/api-docs`).
