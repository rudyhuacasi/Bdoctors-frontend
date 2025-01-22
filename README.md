# BoolDoctors

BoolDoctors è una web app che permette di cercare un medico specialista e chiedere un appuntamento.

---

## Descrizione Generale
BoolDoctors consente agli utenti di cercare un medico specialista nella propria città e di richiedere un appuntamento. Gli utenti possono interagire con la piattaforma come utenti non registrati o registrati.

---

## Tipi di Utenti
### 1. **Utente Interessato (UI)**:  
Un utente non registrato che visita il sito.

### 2. **Utente Registrato (UR)**:  
Un utente che ha effettuato la registrazione come medico.

---

## Lista delle Pagine

### **Homepage**
- Ricerca di un medico per specializzazione.
- Accesso veloce ai medici in evidenza.

### **Pagina di Ricerca Avanzata**
- Visualizzazione dei risultati di ricerca con accesso ai dettagli del medico.
- Raffinamento della ricerca tramite filtri senza refresh della pagina.

### **Pagina Dottore**
- Dettagli del medico, inclusi CV, indirizzo e numero di telefono.
- Invio di messaggi per richiedere disponibilità.
- Possibilità di scrivere recensioni e assegnare voti.
- Visualizzazione delle recensioni di altri utenti.

### **Dashboard Utente Registrato**
- **Pagina Informazioni**: Modifica dei propri dati personali e contatti.
- **Pagina Lista Messaggi Ricevuti**: Visualizzazione dei messaggi ricevuti dagli utenti.
- **Pagina Lista Recensioni Ricevute**: Visualizzazione delle recensioni ricevute dagli utenti.
- **Pagina Sponsorizzazione**: Acquisto di sponsorizzazioni tramite carta di credito.
- **Pagina Statistiche**: Visualizzazione delle proprie statistiche.

---

## Requisiti Tecnici

1. **Client-side Validation (RT1)**  
   Tutti i dati inseriti dall'utente sono controllati lato client (oltre che lato server).

2. **Sistema di Pagamento (RT2)**  
   Utilizzo del sistema di pagamento [Braintree](https://www.braintreepayments.com/) che permette di simulare transazioni.

3. **Responsività (RT3)**  
   Il sito è completamente responsive, visibile sia da desktop che da smartphone.

4. **Ricerca senza Refresh (RT4)**  
   La ricerca dei medici avviene senza il refresh della pagina.

---

## Requisiti Funzionali

### (RF1) Permettere ai medici di registrarsi alla piattaforma
- **Visibilità**: UI
- **Descrizione**:  
  I medici possono registrarsi e creare un profilo inserendo:  
  - Email *(obbligatorio)*  
  - Password *(obbligatorio)*  
  - Nome *(obbligatorio)*  
  - Cognome *(obbligatorio)*  
  - Indirizzo *(obbligatorio)*  
  - Specializzazione *(obbligatorio)*  

- **Risultato**: Creazione di un nuovo utente.  
- **Eccezioni**: L'email è già presente nel sistema.

---

### (RF2) Permettere ai medici di aggiungere il proprio profilo
- **Visibilità**: UR
- **Descrizione**:  
  I medici possono aggiungere al proprio profilo:  
  - Curriculum Vitae  
  - Una o più specializzazioni (es. Cardiologia, Dermatologia, etc.)  
  - Fotografia  
  - Indirizzo  
  - Telefono  
  - Prestazioni  

- **Risultato**: Aggiornamento delle informazioni.  
- **Eccezioni**: Nessuna.

---

### (RF3) Permettere ai visitatori di ricercare un medico specialista
- **Visibilità**: UI / UR  
- **Descrizione**:  
  Ricerca per specializzazione con possibilità di filtrare per:  
  - Media voti  
  - Numero di recensioni  

- **Risultato**: Lista di medici che corrispondono alla ricerca.  
- **Eccezioni**: Nessuna.

---

### (RF4) Permettere ai visitatori di vedere i dettagli di un medico
- **Visibilità**: UI  
- **Descrizione**:  
  Dettagli del medico, inclusi:  
  - CV  
  - Informazioni di contatto  
  - Recensioni  

- **Risultato**: Visualizzazione della pagina dettagliata.  
- **Eccezioni**: Nessuna.

---

### (RF5) Permettere ai medici di vedere i messaggi ricevuti
- **Visibilità**: UR  
- **Descrizione**:  
  Visualizzazione dei messaggi ricevuti dagli utenti.  
  Risposte da gestire via email.  

- **Risultato**: Visualizzazione dei messaggi.  
- **Eccezioni**: Nessuna.

---

### (RF6) Permettere ai medici di vedere le recensioni ricevute
- **Visibilità**: UR  
- **Descrizione**:  
  I medici possono vedere le recensioni ricevute.  

- **Risultato**: Visualizzazione delle recensioni.  
- **Eccezioni**: Nessuna.

---

### (RF7) Permettere ai medici di vedere le proprie statistiche
- **Visibilità**: UR  
- **Descrizione**:  
  Visualizzazione delle statistiche:  
  - Numero di messaggi e recensioni ricevute per mese/anno.  
  - Grafico a barre dei voti ricevuti per mese/anno.  

- **Risultato**: Visualizzazione delle statistiche.  
- **Eccezioni**: Nessuna.

---

### (RF8) Permettere ai medici di sponsorizzare il proprio profilo
- **Visibilità**: UR  
- **Descrizione**:  
  Possibilità di acquistare sponsorizzazioni tramite i seguenti pacchetti:  
  - 2,99 € per 24 ore  
  - 5,99 € per 72 ore  
  - 9,99 € per 144 ore  

  **Caratteristiche di un profilo sponsorizzato**:  
  - Appare nella sezione "Medici in Evidenza" nella homepage.  
  - Ha priorità nei risultati di ricerca.  

- **Risultato**: Il profilo del medico è sponsorizzato.  
- **Eccezioni**:  
  - Pagamento non processato correttamente.  
  - Dati della carta di credito non validi.

---

# TEMPLATE VUE VITE

> [!NOTE]
>
> nome repo: vue-vite-template

### Cosa c'è in questo template:
1. tutte le dipendenze `Vue + Vite`:
```
npm create vite@latest
```

2. pacchetto `sass`:
```
npm install sass
```

3. pacchetto `router`:
```
npm install vue-router@next
```

4. pacchetto `axios`:
```
npm install axios
```

5. pacchetto `Boostrap`:
```
npm i bootstrap
```

6. pacchetto `SASS`:
```
npm instal -g sass
```
devo importare in main.js
```
import './style.scss'
```
cambiare il style.scss per style.css:
```
style.scss
```
7. pacchetto `Font Awesome` scarica tutte le icone :
```
npm install --save @fortawesome/fontawesome-free
```
importare in main.js
```
import '@fortawesome/fontawesome-free/css/all.scss';
import '@fortawesome/fontawesome-free/js/all.js';
```
in html puoi mettere `<i class="fa-regular fa-star"></i>`

#### se vorrei cambiare il font awesome
1.  pacchetto `Font Awesome` scarica e chiamare ogni icona
```
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
```
debo importare in main.js
```
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library  adesso posso usare faUserSecret*/
library.add(faUserSecret)

createApp(App)
    .component("font-awesome-icon", FontAwesomeIcon) serve per fare una chiamata per ogni icona
    .use(router)
    .mount('#app');
```
in html devo chiamare `<font-awesome-icon :icon="['fas', 'user-secret']" />`

#### Prima di vedere:

1. installase le dipendenze:
```
npm install
```

2. far partire il server:
```
npm run dev
```


