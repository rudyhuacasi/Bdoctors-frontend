//? importiamo il router:
import { createRouter, createWebHistory } from "vue-router";

//? importiamo le pagine del progetto:
import HomePage from './pages/HomePage.vue';
import Servizi from "./pages/Servizi.vue";
import CreatePage from "./pages/CreatePage.vue";
import CreateForm from "./pages/CreateForm.vue";
import MedicoPage from "./pages/MedicoPage.vue";
import UserProfilePage from "./pages/UserProfilePage.vue";
import UpdatePage from "./pages/UpdatePage.vue";

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
      path: "/user-profili",
      name: "create",
      component: CreatePage,
    },
    {
      path: "/create/form",
      name: "createform",
      component: CreateForm,
    },
    {
      path: "/medico/:slug", 
      name: "medico",
      component: MedicoPage,
    },
    {
      path: '/user-profile/:slug/:id',
      name: 'UserProfilePage',
      component: UserProfilePage
    },
    {
      path: '/edit/form/user-profile/:slug/:user_id/:id',
      name: 'PutchPage',
      component: UpdatePage
    },
    // {
    //   path: "/not-found",
    //   name: "not-found",
    //   component: NotFoundPage,
    // },
    
  ],
});
export { router };