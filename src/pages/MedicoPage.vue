<script>
import axios from 'axios';
import ModalMessagi from '../components/ModalMessagi.vue';

export default {
    name: 'MedicoPage',
    data() {
        return {
            medico: null,
        };
    },
    components: {
      ModalMessagi,
    },
    created() {
        this.fetchMedicalProfiles();  
    },
    methods: {
        // funzione per andare una ruta
        goBack() {
			this.$router.push({
				name: 'search',
				params: { searchCriteria: this.$route.params.searchCriteria }
			});
		},
        // volevo usare il nome con slug e cancellare(-)
        formatSlug(slug) {
        return slug
            .split('-')                   
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  
            .join(' ');                    
        },
        // funzione per vedere l'informazione personale del medico
        async fetchMedicalProfiles() {
            try {
                const slug = "/api/medical/" + this.$route.params.slug + "/" + this.$route.params.id;
                const response = await axios.get(slug);
                
                if (response.data.results) {
                    this.medico = response.data.results;
                    const baseUrl = "http://localhost:8000/storage/";
                    
                        if (this.medico.photograph) {
                            if (this.medico.photograph.startsWith('http')) {
                                this.medico.photograph = this.medico.photograph;
                            } else {
                                this.medico.photograph = baseUrl + this.medico.photograph;
                            }
                        }
                        if (this.medico.cv) {
                            if (this.medico.cv.startsWith('http')) {
                                this.medico.cv = this.medico.cv;
                            } else {
                                this.medico.cv = baseUrl + this.medico.cv;
                            }
                        }
                        console.log(response.data);
                } else {
                    console.error('Error al recuperar los perfiles médicos');
                }
            } catch (error) {
                console.error('Error al hacer la solicitud a la API:', error);
            }
        },
    }
};
</script>

<template>
    <div class="container bg-white p-5 rounded-5 my-5">
        <div>
            <div v-if="medico">
                <button 
                    v-if="$route.params.searchCriteria" 
                    @click="goBack" 
                    class="btn btn-outline-info mb-3"
                >
                    <i class="fa-solid fa-arrow-left"></i> Indietro
                </button>
                <router-link 
                    v-else 
                    :to="{ name: `servizi` }" 
                    class="btn btn-outline-info mb-3"
                >
                    <i class="fa-solid fa-arrow-left"></i> Indietro
                </router-link>
                <div class="row">
                    <h1 class="merienda col-8">{{ formatSlug(medico.slug) }}</h1>
                    <div class="col-md-12 col-lg-4 text-center d-flex gap-3">
                        <ModalMessagi :medicalProfileId="medico.id"/>
                    </div>
                </div>   
                
                <div class="d-flex row py-4">
                    <div class="col-7">
                        <div class="row">
                            <div class="col-5">
                                <h2 class="charm pt-0"><i class="fa-solid fa-phone"></i>  Telefono:</h2>
                            </div>
                            <div class="col-7 text-center">
                                <p class="fs-5">
                                    {{ medico.phone }}
                                </p>
                            </div>
                            <div class="col-5">
                                <h2 class="charm"><i class="fa-solid fa-location-dot"></i>  Indirizzo:</h2>
                            </div>
                            <div class="col-7 text-center">
                                <p class="text-capitalize fs-5 py-3">
                                    {{ medico.address }}
                                </p>
                            </div>
                            <div class="col-5">
                                <h2 class="charm"><i class="fa-solid fa-file-pdf"></i> CV: </h2>
                            </div>
                            <div class="col-7 text-center">
                                <p class="fs-5 py-3" v-if="medico.user === null">
                                    <a :href="medico.cv" target="_blank">CV di {{ formatSlug(medico.slug) }}</a>
                                </p>
                                <p class="fs-5 py-3" v-else>
                                    <a :href="medico.cv" target="_blank">CV di {{ medico.user.name }}</a>
                                </p>
                            </div>
                            <div class="col-5">
                                <h2 class="charm"><i class="fa-solid fa-stethoscope"></i> Specialità: </h2>
                            </div>
                            <div class="col-7 text-center">
                                <p class="fs-5 py-3">
                                    {{ medico.specializations.name }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-5">
                        <img class="w-100" :src="medico.photograph" alt="Foto de perfil de {{ medico.slug }}" />
                    </div>
                    <div class="col-12">
                        <h2 class="charm"><i class="fa-solid fa-house-chimney-medical"></i> Consulenze Mediche:</h2>
                            <div class="row row-gap-3">
                                <div class="col-4" v-for="performance in medico.profile_performances" :key="performance.id">
                                    <div class="p-3 border border-primary-subtle rounded-4">
                                        <h5 class="tinos">{{ performance.medicine_performance.name }}</h5>
                                        <p>{{ performance.medicine_performance.description }}</p>
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
                
            </div>
            <div class="d-flex justify-content-center" v-else>
                <div class="spinner-4"></div>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "../assets/scss/partials/_variables" as *;

.container {
    margin-top: 20px;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
}

.container {
    margin-top: 20px;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
}


.merienda{
    font-family: "Merienda";
    font-weight: 600;
    font-style: normal;
    font-size: 2.8rem;
}
.charm{
    font-family: "Charm";
    font-weight: 700;
    font-style: normal;
    padding: 1.5rem 0;
}
.tinos{
    font-family: "Tinos", serif;
    font-weight: 700;
    font-style: italic;
}
.spinner-4 {
  scale: 0.65;
  width: 10rem;
  height: 10rem;
  display: grid;
  border-radius: 50%;
  -webkit-mask: radial-gradient(farthest-side, #0000 40%, $primary 41%);
  background: linear-gradient(
        0deg,
        rgb(143 68 253 / 50%) 50%,
        rgb(143 68 253 / 0%) 0
      )
      center/4.5px 100%,
    linear-gradient(90deg, $primary 50%, $primary 0)
      center/100% 4.5px;
  background-repeat: no-repeat;
  animation: spinner-d3o0rx 1s infinite steps(12);
}

.spinner-4::before,
.spinner-4::after {
  content: "";
  grid-area: 1/1;
  border-radius: 50%;
  background: inherit;
  opacity: 0.915;
  transform: rotate(30deg);
}

.spinner-4::after {
  opacity: 0.83;
  transform: rotate(60deg);
}

@keyframes spinner-d3o0rx {
  100% {
    transform: rotate(1turn);
  }
}

</style>
