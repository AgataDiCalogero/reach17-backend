# DB Schema

## Entita e relazioni

**Entita**

- `course_types` (tipologie)
- `courses` (corsi)
- `universities` (atenei)
- `course_universities` (tabella ponte N:N)

**Relazioni**

- `course_types` (1) -> (N) `courses`
- `courses` (N) <-> (N) `universities` tramite `course_universities`

---

## Tabelle

### `course_types`

**Colonne**

- `id` BIGINT UNSIGNED PK AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL UNIQUE
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Vincoli / indici**

- UNIQUE(`name`)

### `courses`

**Colonne**

- `id` BIGINT UNSIGNED PK AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL
- `course_type_id` BIGINT UNSIGNED NOT NULL (FK -> `course_types.id`)
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Vincoli / indici**

- FK `course_type_id` -> `course_types.id` (RESTRICT / NO ACTION)
- UNIQUE(`name`, `course_type_id`)
- INDEX (`course_type_id`)
- INDEX (`name`)

### `universities`

**Colonne**

- `id` BIGINT UNSIGNED PK AUTO_INCREMENT
- `name` VARCHAR(255) NOT NULL UNIQUE
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

**Vincoli / indici**

- UNIQUE(`name`)

### `course_universities`

**Colonne**

- `course_id` BIGINT UNSIGNED NOT NULL (FK -> `courses.id`)
- `university_id` BIGINT UNSIGNED NOT NULL (FK -> `universities.id`)
- `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP (timestamp di creazione; nessun `updated_at`)

**Chiavi / vincoli / indici**

- PK (`course_id`, `university_id`)
- FK `course_id` -> `courses.id` (RESTRICT / NO ACTION)
- FK `university_id` -> `universities.id` (RESTRICT / NO ACTION)
- INDEX (`university_id`)

---

## Delete policies

- No cascade: eliminazioni gestite a livello applicativo.
- FKs con RESTRICT/NO ACTION per `courses` e `universities` in `course_universities`.

---

## Unicita

- `course_types.name` unico
- `universities.name` unico
- `courses` unico per (`name`, `course_type_id`)

---

## Nota TiDB

DB target: TiDB Cloud (MySQL-compatible). Schema e migrations sono in sintassi MySQL.
