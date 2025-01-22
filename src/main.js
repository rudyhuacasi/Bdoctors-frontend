//? iport istanza vue:
import { createApp } from 'vue';

//? import router:
import { router } from "./router";

//? import App Vue:
import App from './App.vue';

//? import style scss:
import './assets/scss/main.scss';

import axios from 'axios';

//base URL
axios.defaults.baseURL = 'http://localhost:8000'; 

//font satisfy
import "@fontsource/satisfy"; // Defaults to weight 400
import "@fontsource/satisfy/400.css"; // Specify weight

import "@fontsource-variable/caveat"; // Defaults to wght axis
import "@fontsource-variable/caveat/wght.css"; // Specify axis

import  "@fontsource/playfair-display" ;  // Il valore predefinito è peso 400 
import  "@fontsource/playfair-display/400.css" ;  // Specificare peso 
import  "@fontsource/playfair-display/400-italic.css" ;

import "@fontsource/merienda"; // Defaults to weight 400
import "@fontsource/merienda/400.css"; // Specify weight

import "@fontsource/charm"; // Defaults to weight 400
import "@fontsource/charm/400.css"; // Specify weight

import "@fontsource/tinos"; // Defaults to weight 400
import "@fontsource/tinos/400.css"; // Specify weight
import "@fontsource/tinos/400-italic.css";

import "@fontsource/delius"; // Defaults to weight 400
import "@fontsource/delius/400.css"; // Specify weight

import "@fontsource/alex-brush"; // Defaults to weight 400
import "@fontsource/alex-brush/400.css"; // Specify weight

import dayjs from 'dayjs';

//? import bootstrap:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import * as bootstrap from 'bootstrap'; // Importa todo el paquete
window.bootstrap = bootstrap;

//? import font-awesome tutte le icone:
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import dropin from 'braintree-web-drop-in';

import IdleTimeout from './middleware/IdleTimeout';

const app = createApp(App);

const token = localStorage.getItem('token');

    if (token) {
    app.use(IdleTimeout, {
        idleTime: 30 * 60 * 1000, 
        onTimeout: () => {
        alert('Tu sesión ha expirado por inactividad.');
        localStorage.removeItem('token');
        window.location.href = '/not-login';
        },
    });
    }

app.use(router);

app.mount('#app');
// createApp(App)
//     .use(router)
//     .mount('#app');
//     // .component("font-awesome-icon", FontAwesomeIcon) serve per fare una chiamata per ogni icona
