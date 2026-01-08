# Contratto API

## Convenzioni API

- Base URL: `/api/v1`
- Content-Type: `application/json` (solo JSON)
- Naming risorse: plurale, kebab-case (`course-types`, `universities`, `courses`)
- ID: intero numerico (auto-increment DB)
- Formato errore (sempre):

```json
{"error": { "code": "...", "message": "...", "details": [...] } }
```

Esempio:

```json
{
  "error": {
    "code": "DUPLICATE_RESOURCE",
    "message": "Tipologia di corso già esistente",
    "details": []
  }
}
```

- Status code standard: `200`, `201`, `204`, `400`, `404`, `409`
- Errori da vincoli DB mappati a:
  - `409` per conflitti di duplicate/unique e PK composta
  - `409` per FK RESTRICT (delete bloccata da referenze)
  - `400` per dati non validi (tipi errati, payload malformato)
  - `500` per errori non previsti

---

## 1) Course Types

### 1.1 Creare una tipologia di corso

- Metodo + Path: `POST /api/v1/course-types`
- Query params: none
- Request body:
  - `name` (string, required, trimmed)
- Response:
  - `201`
  - Body: `{ "id": number, "name": string, "created_at": string, "updated_at": string }`
- Errori:
  - `400` `VALIDATION_ERROR` (nome mancante/vuoto)
  - `409` `DUPLICATE_RESOURCE` (nome già esistente)

### 1.2 Lista tipologie di corso

- Metodo + Path: `GET /api/v1/course-types`
- Query params: none
- Response:
  - `200`
  - Body: `[{ id, name, created_at, updated_at }]`

### 1.3 Aggiornare una tipologia di corso

- Metodo + Path: `PATCH /api/v1/course-types/:id`
- Query params: none
- Request body (at least one):
  - `name` (string)
- Response:
  - `200`
  - Body: `{ id, name, created_at, updated_at }`
- Errori:
  - `400` `VALIDATION_ERROR`
  - `404` `NOT_FOUND`
  - `409` `DUPLICATE_RESOURCE` (nome duplicato)

### 1.4 Eliminare una tipologia di corso

- Metodo + Path: `DELETE /api/v1/course-types/:id`
- Query params: none
- Response:
  - `204`
- Errori:
  - `404` `NOT_FOUND`
  - `409` `CONFLICT` (corsi associati a questa tipologia)

---

## 2) Universities

### 2.1 Creare un ateneo

- Metodo + Path: `POST /api/v1/universities`
- Query params: none
- Request body:
  - `name` (string, required, unique)
- Response:
  - `201`
  - Body: `{ id, name, created_at, updated_at }`
- Errori:
  - `400` `VALIDATION_ERROR`
  - `409` `DUPLICATE_RESOURCE`

### 2.2 Lista atenei

- Metodo + Path: `GET /api/v1/universities`
- Query params: none
- Response:
  - `200`
  - Body: `[{ id, name, created_at, updated_at }]`

### 2.3 Aggiornare un ateneo

- Metodo + Path: `PATCH /api/v1/universities/:id`
- Query params: none
- Request body:
  - `name` (string)
- Response:
  - `200`
  - Body: `{ id, name, created_at, updated_at }`
- Errori:
  - `400` `VALIDATION_ERROR`
  - `404` `NOT_FOUND`
  - `409` `DUPLICATE_RESOURCE`

### 2.4 Eliminare un ateneo

- Metodo + Path: `DELETE /api/v1/universities/:id`
- Query params: none
- Response:
  - `204`
- Errori:
  - `404` `NOT_FOUND`
  - `409` `CONFLICT` (ha associazioni)

---

## 3) Courses

### 3.1 Creare un corso

- Metodo + Path: `POST /api/v1/courses`
- Query params: none
- Request body:
  - `name` (string, required)
  - `course_type_id` (number, required, FK)
- Unicita: `name` e unico per `course_type_id` (composito)
- Response:
  - `201`
  - Body: `{ id, name, course_type_id, created_at, updated_at }`
- Errori:
  - `400` `VALIDATION_ERROR`
  - `404` `COURSE_TYPE_NOT_FOUND`

### 3.2 Lista corsi (con atenei + filtri)

- Metodo + Path: `GET /api/v1/courses`
- Query params (optional):
  - `name` (string, partial match)
  - `course_type` (string, match su `course_types.name`)
  - `course_type_id` (number, optional extra)
- Se presenti entrambi, `course_type_id` ha precedenza su `course_type`.
- Response:
  - `200`
  - Body: `[{ id, name, course_type: { id, name }, universities: [{ id, name }] }]`
- Errori:
  - `400` `VALIDATION_ERROR` (parametri query non validi)

### 3.3 Aggiornare un corso

- Metodo + Path: `PATCH /api/v1/courses/:id`
- Query params: none
- Request body (at least one):
  - `name` (string)
  - `course_type_id` (number)
- Response:
  - `200`
  - Body: `{ id, name, course_type_id, created_at, updated_at }`
- Errori:
  - `400` `VALIDATION_ERROR`
  - `404` `COURSE_NOT_FOUND`
  - `404` `COURSE_TYPE_NOT_FOUND`

### 3.4 Eliminare un corso

- Metodo + Path: `DELETE /api/v1/courses/:id`
- Query params: none
- Response:
  - `204`
- Errori:
  - `404` `COURSE_NOT_FOUND`

Nota: la delete deve gestire le associazioni nella join table (DB constraint, cascade o delete manuale).

---

## 4) Associazione Course <-> University (many-to-many)

### 4.1 Creare un'associazione

- Metodo + Path: `POST /api/v1/courses/:courseId/universities/:universityId`
- Query params: none
- Request body: none
- Response:
  - `201`
  - Body: `{ course_id, university_id }`
- Errori:
  - `404` `COURSE_NOT_FOUND`
  - `404` `UNIVERSITY_NOT_FOUND`
  - `409` `DUPLICATE_RESOURCE`

### 4.2 Eliminare un'associazione

- Metodo + Path: `DELETE /api/v1/courses/:courseId/universities/:universityId`
- Query params: none
- Response:
  - `204`
- Errori:
  - `404` `ASSOCIATION_NOT_FOUND`

---

## Fuori scope

- Auth/roles
- Pagination
- Upload files
- Cache

---

## Checklist requisiti

- CRUD completo per: course-types, courses, universities
- Endpoint N:N create + delete
- `GET /courses` ritorna corsi + atenei e supporta filtri per `name` e `course_type`
- Decisioni critiche definite (vedi sotto)

---

## Decisioni (esplicite)

- delete course_type con corsi: `409` (no cascade)
- delete university con associazioni: `409` (no cascade)
- delete association non esistente: `404` (non idempotente)
- delete course: rimuove prima le associazioni in `course_universities`, poi elimina il corso
