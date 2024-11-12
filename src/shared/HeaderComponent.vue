<script>
import RegisterButton from "../components/RegisterButton.vue";
export default {
    name: "Header",
    data() {
        return {
            isAuthenticated: false, // Estado para saber si el usuario está autenticado
        };
    },
    components: {
        RegisterButton,
    },
    methods: {
        // Método para manejar el logout
        handleLogout() {
            localStorage.removeItem("token"); // Borrar el token almacenado
            this.isAuthenticated = false; // Cambiar el estado de autenticación
        },
    },
    mounted() {
        // Verificamos si el usuario está autenticado al montar el componente
        const token = localStorage.getItem("token");
        this.isAuthenticated = !!token; // Si hay token, el usuario está autenticado
    },
};
</script>

<template>
    <nav class="navbar primario-b">
        <div class="container-fluid px-5">
            <a class="navbar-brand">Navbar</a>
            <div class="d-flex">
                <!-- Mostrar el botón de Accedere o Logout según el estado de autenticación -->
                <RegisterButton  />
            </div>
        </div>
    </nav>
    <nav class="testo-b">
        <ul class="nav justify-content-center">
            <li class="nav-item d-flex flex-column mt-3">
                <i class="fa-solid fa-house-chimney font-s-25"></i>
                <router-link
                    :to="{ name: `home` }"
                    class="nav-link active"
                    aria-current="page"
                    >Home</router-link
                >
            </li>
            <li class="nav-item d-flex flex-column mt-3">
                <i class="fa-solid fa-stethoscope font-s-25"></i>
                <router-link :to="{ name: `servizi` }" class="nav-link" 
                    >Attività e servizi</router-link
                >
            </li>
            <li class="nav-item d-flex flex-column mt-3" v-if="isAuthenticated">
                <i class="fas fa-plus font-s-25"></i>
                <router-link :to="{ name: `create` }" class="nav-link" 
                    >Aggiungere medico</router-link
                >
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" scoped>
@use "../assets/scss/partials/variables" as *;

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
</style>
