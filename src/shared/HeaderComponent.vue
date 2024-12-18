<script>
import RegisterButton from "../components/RegisterButton.vue";
export default {
    name: "Header",
    data() {
        return {
            isAuthenticated: false, 
        };
    },
    components: {
        RegisterButton,
    },
    methods: {
        // Gestisce la disconnessione dell'utente
        handleLogout() {
            localStorage.removeItem("token"); 
            this.isAuthenticated = false; 
        },
        // Verifica se la rotta corrente è attiva
        isActive(routes) {
            const currentRoute = this.$route.name;
            return routes.includes(currentRoute) ? 'active-route' : '';
        },
    },
    mounted() {
        
        const token = localStorage.getItem("token");
        this.isAuthenticated = !!token; 
    },
};
</script>

<template>
    <nav class="navbar primario-b">
        <div class="container-fluid px-5">
            <router-link :to="{ name: `home` }" class="navbar-brand">
                <img class="w-20"  src="/public/img/bnbdoctor.png" alt="logo-bnb-doctor">
            </router-link>
            <div class="d-flex">
                <!-- button accedere e logout -->
                <RegisterButton  />
            </div>
        </div>
    </nav>
    <nav class="testo-b">
        <ul class="nav justify-content-center">
            <li class="nav-item" :class="{ activado: isActive('home') }">
                <router-link
                    :to="{ name: `home` }"
                    class="nav-link d-flex text-white flex-column pt-3"
                    aria-current="page"
                >
                <i class="fa-solid fa-house-chimney font-s-25 pb-2"></i>
                Home
                </router-link>
            </li>
            <li class="nav-item mx-4" :class="{ activado: isActive(['servizi', 'medico']) }">
                <router-link :to="{ name: `servizi` }" class="nav-link d-flex text-white flex-column pt-3" >
                    <i class="fa-solid fa-stethoscope font-s-25 pb-2"></i>
                    Attività e servizi
                </router-link>
            </li>
            <li class="nav-item" :class="{ activado: isActive(['create', 'createform', 'UserProfilePage', 'PutchPage']) }" v-if="isAuthenticated">
                <router-link :to="{ name: `create` }" class="nav-link d-flex text-white flex-column pt-3" >
                    <i class="fas fa-plus font-s-25 pb-2"></i>
                    Aggiungere medico
                </router-link>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
@use "../assets/scss/partials/_variables" as *;

.primario-c {
    color: $primary;
}

.primario-b {
    background-color: $primary;
}
.fondo-c {
    color: $fondo;
}

.testo-b {
    background-color: $testo;
}
.nav-item:hover{
    background-color: #000039;
}
.nav-item{
    &.activado{
        background-color: #000039;
    }
}
.w-20{
    width: 20%;
}
</style>
