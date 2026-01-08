# Requisiti di progetto

## 1. Scopo del progetto

Questo progetto implementa una REST API backend per la gestione di:

- tipologie di corsi
- corsi
- atenei
- associazioni corso–ateneo

L’API è sviluppata in Node.js + Express e utilizza un database MySQL-compatible (TiDB Cloud).

---

## 2. Requisiti funzionali

### 2.1 Tipologie di corso (`course_types`)

**Operazioni**

- Creare una tipologia di corso
- Ottenere la lista delle tipologie
- Modificare una tipologia
- Eliminare una tipologia

**Attributi**

- `name` (string, obbligatorio, univoco)

### 2.2 Corsi (`courses`)

**Operazioni**

- Creare un corso
- Ottenere la lista dei corsi
- Modificare un corso
- Eliminare un corso

**Attributi**

- `name` (string, obbligatorio)
- `course_type_id` (FK verso `course_types`)

Un corso appartiene a una sola tipologia.

### 2.3 Atenei (`universities`)

**Operazioni**

- Creare un ateneo
- Ottenere la lista degli atenei
- Modificare un ateneo
- Eliminare un ateneo

**Attributi**

- `name` (string, obbligatorio, univoco)

### 2.4 Associazione corsi–atenei

**Operazioni**

- Associare un corso a uno o più atenei
- Rimuovere l’associazione corso–ateneo

**Relazione**

- Un corso può essere presente in più atenei
- Un ateneo può offrire più corsi
- Relazione many-to-many

### 2.5 Visualizzazione avanzata

**Output**

- Ottenere l’elenco dei corsi con tipologia associata e atenei associati

**Filtri**

- nome del corso
- tipologia di corso

---

## 3. Requisiti REST

- Endpoint RESTful
- Risorse al plurale
- Metodi HTTP corretti:
  - POST (create)
  - GET (read)
  - PATCH (update)
  - DELETE (delete)
- Status code corretti:
  - 200 OK
  - 201 Created
  - 204 No Content
  - 400 Bad Request
  - 404 Not Found
  - 409 Conflict

---

## 4. Requisiti database

- Database relazionale MySQL-compatible
- Utilizzo di TiDB Cloud come database remoto
- Presenza di file `migrations.sql`
- Tutte le query devono usare prepared statements
- Vincoli di integrità referenziale (FK)
- Tabelle normalizzate
- Presenza di:
  - `created_at` e `updated_at` per le tabelle principali (`course_types`, `courses`, `universities`)
  - `created_at` per la join table `course_universities` (nessun `updated_at`)

---

## 5. Fuori scope (esplicitamente escluso)

- Autenticazione / autorizzazione
- Ruoli utente
- Paginazione
- Upload file
- Cache

---
