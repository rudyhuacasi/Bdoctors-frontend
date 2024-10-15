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
        <button class="effect mb-3 submit-checkbox" onclick="validateForm()" type="submit">
            Vieni con noi
        </button>
    </div>
   </div>

</template>
<style lang="scss" scoped>

    .fondo{
        position: relative;
        background-image: url('https://www.unidprofessional.com/wp-content/uploads/2023/04/Sanita-e-boom-di-medici-a-gettone-con-compensi-di-oro-1024x576.jpg');
        background-repeat: no-repeat;
        background-position: top;
        background-size: cover;
        width: 100%;
        height: 100vh;
    }
    .fondo::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: white; 
        opacity: 0.5; 
        z-index: 1;
    }
    // dancing script debo meterlo google fonts
    .dancing-script{
        z-index: 5;
       
    }
    .position{
         position: absolute;
        top: 10%;
        right: 5%;
    }

    // button 
.effect {
    background-color: transparent;
    color: red;
    padding: 13px 36px;
    border: 2px solid red;
    border-radius: 8px;
    position: relative;
    z-index: 1;
    overflow: hidden;
    transition: color 0.8s;
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
    background-color: red;
    border-radius: 50%;
    z-index: -1;
    transition: all 0.6s ease;
}

.effect:hover::before {
    top: -50%;
    left: -9%;
}
</style>