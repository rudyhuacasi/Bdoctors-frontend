<script>
import RegisterButton from "../components/RegisterButton.vue";
export default {
	nome: "Header",
    data() {
        return {

        }
    },
    components: {
      RegisterButton,
    },
}

</script>
<template>
    <nav class="navbar primario-b">
    <div class="container-fluid px-5">
        <a class="navbar-brand">Navbar</a>
        <div class="d-flex">
            <div class="d-flex align-items-center">
                <div class="search-container">
                    <input type="text" id="search" class="search-input" placeholder="Buscar...">
                    <label for="search" class="search-icon">
                        <i class="fa fa-search fondo-c"></i>
                    </label>
                </div>
            </div>
            
            <RegisterButton />
        </div>
    </div>
    </nav>
    <nav class="testo-b">
        <ul class="nav justify-content-center">
            <li class="nav-item d-flex flex-column mt-3">
                <i class="fa-solid fa-house-chimney font-s-25"></i>
                <router-link :to="{name:`home`}" class="nav-link active" aria-current="page">Home</router-link>
            </li>
            <li class="nav-item d-flex flex-column mt-3">
                <i class="fa-solid fa-stethoscope font-s-25"></i>
                <router-link :to="{name:`servizi`}" class="nav-link" href="#">Attività e servizi</router-link>
            </li>
            <li class="nav-item d-flex flex-column mt-3">
                <i class="fas fa-plus font-s-25"></i>
                <router-link :to="{name:`create`}" class="nav-link" href="#">Aggiungere medico</router-link>
            </li>
            
            </ul>
    </nav>
</template>
<style lang="scss" scoped >
@use '../assets/scss/partials/variables' as *;


.primario-c{
    color: $primary;
}

.primario-b{
    background-color: $primary;
}
.fondo-c{
    color: $fondo;
}

.testo-b{
    background-color: $testo;
}
// ricerca
.search-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 50px;
    height: 50px;
    background-color: #EEEEEE;
    border-radius: 8px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 5px 10px;
}

.search-container:focus-within {
    width: 500px;
}

.search-input {
    flex-grow: 1;
    border: none;
    outline: none;
    background-color: transparent;
    color: #6528f7;
    font-size: 16px;
    padding-left: 10px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.search-container:focus-within .search-input {
    opacity: 1;
}

.search-icon {
    position: absolute;
    right: 15px;
    font-size: 18px;
    cursor: pointer;
    color: black;
}

.search-icon label {
    cursor: pointer;
}

.font-s-25{
    font-size: 25px
}
</style>