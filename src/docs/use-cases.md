# Use cases

## Caso d’uso 1 – Creare una tipologia di corso

**Attore:** client API  
**Input:** nome tipologia

**Flusso**

- Il client invia il nome
- Il sistema valida il dato
- La tipologia viene salvata

**Errori**

- 400: nome mancante o vuoto
- 409: tipologia già esistente

---

## Caso d’uso 2 – Creare un corso

**Attore:** client API  
**Input:** nome corso, id tipologia

**Flusso**

- Il sistema verifica l’esistenza della tipologia
- Il corso viene salvato

**Errori**

- 400: dati mancanti
- 404: tipologia non trovata
- 409: corso gia' esistente

---

## Caso d’uso 3 – Creare un ateneo

**Attore:** client API  
**Input:** nome ateneo

**Flusso**

- Il nome viene validato
- L’ateneo viene salvato

**Errori**

- 400: nome non valido
- 409: ateneo già esistente

---

## Caso d’uso 4 – Associare corso e ateneo

**Attore:** client API  
**Input:** id corso, id ateneo

**Flusso**

- Il sistema verifica l’esistenza di corso e ateneo
- Crea l’associazione

**Errori**

- 404: corso o ateneo non trovati
- 409: associazione già esistente

---

## Caso d’uso 5 – Ottenere corsi con filtri

**Attore:** client API  
**Input:** filtri opzionali (nome corso, tipologia o id tipologia)

**Flusso**

- Il sistema applica i filtri
- Restituisce corsi con atenei e tipologia

**Output**

- lista corsi
- array atenei associati

---

## Caso d’uso 6 – Eliminare un corso

**Attore:** client API

**Flusso**

- Il sistema verifica l’esistenza
- Rimuove il corso e le associazioni

**Errori**

- 404: corso non trovato
- 409: corso in uso
