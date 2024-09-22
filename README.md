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

#### Prima di adoperare:

1. installase le dipendenze:
```
npm install
```

2. far partire il server:
```
npm run dev
```


