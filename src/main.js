//? iport istanza vue:
import { createApp } from 'vue';

//? import router:
import { router } from "./router";

//? import App Vue:
import App from './App.vue';

//? import style scss:
import './assets/scss/main.scss';

//? import bootstrap:
import * as bootstrap from 'bootstrap';

//? import font-awesome tutte le icone:
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


//? append createApp in #app:
createApp(App)
    .use(router)
    .mount('#app');
    // .component("font-awesome-icon", FontAwesomeIcon) serve per fare una chiamata per ogni icona
