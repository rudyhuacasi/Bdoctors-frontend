<script>
import axios from 'axios';

export default{
    name: 'CreatePage',
    data(){
        return{
            medicalProfiles: [], // Aquí se almacenarán los perfiles médicos
            currentPage: 1,
        }
    },
    methods:{
        formatSlug(slug) {
        return slug
            .split('-')                   
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  
            .join(' ');                    
        },
        async fetchMedicalProfiles() {
            try {
                const token = localStorage.getItem('token');
                console.log(token);
                // Pasa los params en el segundo argumento del método axios.get
                const response = await axios.get("/api/user-profiles", {
                    params: {
                        page: this.currentPage,
                    },
                    headers: {
                        Authorization: `Bearer ${token}` // Incluye el token en los encabezados
                    }
                });
                
                if (response.data.results) {

                    this.medicalProfiles = response.data.results;

                    const baseUrl = "http://localhost:8000/storage/";
                    this.medicalProfiles = this.medicalProfiles.map(profile => {
                        if (profile.photograph) {
                            profile.photograph = baseUrl + profile.photograph;
                        }
                        return profile;
                    });
                    this.response = response.data.results;
                    console.log('Resultados de la respuesta:', this.response);
                } else {
                    console.error('Error al recuperar los perfiles médicos');
                }
            } catch (error) {
                console.error('Error al hacer la solicitud a la API:', error);
            }
        },
         showNextCard() {
            if (this.response && this.response.next_page_url) {
                this.currentPage++;
                this.fetchMedicalProfiles();  // Solicita la nueva página
            }
        },
        // Muestra la página anterior
        showPreviousCard() {
            if (this.response && this.response.prev_page_url && this.currentPage > 1) {
                this.currentPage--;
                this.fetchMedicalProfiles();  // Solicita la nueva página
            }
        },
    },
    mounted() {
const token = localStorage.getItem('token'); // o el método que uses para almacenar el token
        if (token) {
            this.fetchMedicalProfiles(); // Solo llama si hay un token
        }    }
}
</script>
<template>
    <div class="container">
        <div class="banner my-4">
            <h1 class="my-2 px-5 title">
                <em>Inserisci il medico</em>
            </h1>
        </div>
        <div class="row row-gap-5 my-5">
            <div class="col-4 h-601">
                <router-link :to="{name:`createform`}">
                    <div class="card p-5 d-flex align-items-center justify-content-center h-100 border-5">
                        <i class="fa-solid fa-plus font-s-5"></i>                   
                    </div>
                </router-link>
            </div>
            <div class="col-4" v-for="profile in medicalProfiles" :key="profile.id">
                <div class="card c-modifiche">
                    <div class="position-relative">
                        <img :src="profile.photograph" class="rounded-3 busta-img" alt="...">
                        <div class="icon">
                            <router-link :to="{ name: 'UserProfilePage', params: { slug: profile.slug, id: profile.id } }" class="iconBox">
                                <i class="fas fa-arrow-up-right-from-square fs-4"></i>
                            </router-link>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="card-text nome fs-1">{{ formatSlug(profile.slug) }}</p>                    
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@use "../assets/scss/partials/variables" as *;

.c-modifiche{
    border: 0;
    img{
        position: relative
    }
}
.icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 6rem;
    height: 6rem;
    background:white;
    border-top-left-radius: 50%;
}
.iconBox {
    position: absolute;
    inset: 0.7rem;
    background: #282828;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
}

.iconBox:hover {
    transform: scale(1.2);
}
.busta-img{
    width: 100%;
    height: 450px;
    object-fit: cover;
}
.h-601{
    height: 601px;
}
.font-s-5{
    font-size: 5rem;
    color: #B197FC;
}
.h-100:hover{
    background-color: #00004d;
    transition: 0.5s ease all;
}

.banner {
    background-color: #fff3c2; 
    width: 40%; 
    clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);
    display: flex;
    align-items: center;
    margin: 0 auto;
}
.title{
    font-size: 3.3rem;
    font-family: "Playfair Display";
    font-weight: 700;
    font-style: normal;
    background: linear-gradient(90deg, $primary, $testo, $secondary);
    background-size: 200%;
    background-clip: text;
    color: transparent;
}
</style>