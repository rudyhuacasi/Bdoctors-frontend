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

//? import bootstrap:
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//? import font-awesome tutte le icone:
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import dropin from 'braintree-web-drop-in';


//? append createApp in #app:
createApp(App)
    .use(router)
    .mount('#app');
    // .component("font-awesome-icon", FontAwesomeIcon) serve per fare una chiamata per ogni icona
