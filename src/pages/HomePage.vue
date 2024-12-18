<script>
    export default{
        name: 'HomePage',
    }
</script>
<template>
   <div class="fondo">
    <div class="position">
        <h1 class="dancing-script">
            Salvare una vita 
            <br> 
            è essere un eroe 
            <br>
            <br>
            Salvare centinaia di vite 
            <br> 
            è un medico
        </h1>
        <router-link :to="{name:`servizi`}">
            <button class="effect mb-3 submit-checkbox" onclick="validateForm()" type="submit">
                <strong>Vieni con noi</strong>
            </button>
        </router-link>
    </div>
   </div>

</template>
<style lang="scss" scoped>
@use "../assets/scss/partials/variables" as *;
.fondo{
    position: relative;
    background-image: url('https://www.unidprofessional.com/wp-content/uploads/2023/04/Sanita-e-boom-di-medici-a-gettone-con-compensi-di-oro-1024x576.jpg');
    background-repeat: no-repeat;
    background-position: top;
    background-size: cover;
    width: 100%;
    height: calc(100vh - 130px);
}

.dancing-script{
    z-index: 5;
    font-family: "Caveat Variable";
    font-optical-sizing: auto;
    font-weight: 700;
    color: #005dba;
    text-shadow: 2px 2px 0px rgba(0, 0, 0, 3.5);
    font-size: 55px;
}
.position{
    position: absolute;
    top: 10%;
    right: 5%;
}

.effect {
    color: $testo;
    padding: 13px 36px;
    border: 2px solid $primary;
    border-radius: 8px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transition: color 0.8s;
    text-shadow: 2px 2px 9px rgba(20, 0, 0, 8.5);
    box-shadow: 0px 0px 20px $primary;

}

.effect:hover {
    color: white
}

.effect:before {
    content: "";
    position: absolute;
    top: 100%;
    left: 100%;
    width: 120%;
    height: 220%;
    background-color: $primary;
    border-radius: 50%;
    z-index: -1;
    transition: all 0.6s ease;
}

.effect:hover::before {
    top: -50%;
    left: -9%;
}
</style>