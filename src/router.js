//? importiamo il router:
import { createRouter, createWebHistory } from "vue-router";

//? importiamo le pagine del progetto:
import HomePage from './pages/HomePage.vue';
import Servizi from "./pages/Servizi.vue";
import CreatePage from "./pages/CreatePage.vue";
import CreateForm from "./pages/CreateForm.vue";
// import ResultsPage from './pages/ResultsPage.vue';
// import DetailPage from "./pages/DetailPage.vue";
// import NotFoundPage from "./pages/NotFoundPage.vue";

//? creiamo rotte:
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/servizi",
      name: "servizi",
      component: Servizi,
    },
    {
      path: "/create",
      name: "create",
      component: CreatePage,
    },
    {
      path: "/create/form",
      name: "createform",
      component: CreateForm,
    },
    // {
    //   path: "/details/:slug", per usare il slug di backend
    //   name: "details",
    //   component: DetailPage,
    // },
    // {
    //   path: "/not-found",
    //   name: "not-found",
    //   component: NotFoundPage,
    // },
    
  ],
});
export { router };