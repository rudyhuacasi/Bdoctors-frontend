<script>
import axios from 'axios';
// import { Chart } from 'chart.js';
import Chart from 'chart.js/auto';
import SponsorshipModal from '../components/SponsorshipModal.vue';

export default {
    name: 'UserProfilePage',
    data() {
        return {
            medico: null,
            showAllPerformances: false,
            showAllMessages: false,
            showAllReviews: false,
            sponsorshipEndTime: null, 
            timerInterval: null, 
            timeLeft: null,
            messageChart: null,
            reviewChart: null,
        };
    },
    components: {
		SponsorshipModal,
    },
    computed: {
        // funzione performances per il ordine e i limiti dei consulenze mediche per vedere
        visiblePerformances() {
        if (!this.medico || !this.medico.profile_performances) return [];
        return this.showAllPerformances 
            ? this.medico.profile_performances 
            : this.medico.profile_performances.slice(0, 2);
        },
        // funzione messages per il ordine e i limiti dei messagi per vedere
        visibleMessages() {
            if (!this.medico || !this.medico.messages) return [];
            return [...this.medico.messages]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, this.showAllMessages ? this.medico.messages.length : 3); 
        },
        // funzione reviews per il ordine e i limiti dei recensioni per vedere
        visibleReviews() { 
            if (!this.medico || !this.medico.reviews) return [];
            return [...this.medico.reviews]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Ordenar por fecha más reciente
                .slice(0, this.showAllReviews ? this.medico.reviews.length : 3); // Mostrar todas o limitar
        },
        // funzione del timer per mettere in formato HH:MM:SS
        formattedTimeLeft() {
            if (!this.timeLeft) {
            return { hours: "00", minutes: "00", seconds: "00" };
            }

        const hours = String(Math.floor(this.timeLeft / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((this.timeLeft % 3600) / 60)).padStart(2, '0');
        const seconds = String(this.timeLeft % 60).padStart(2, '0');

        return { hours, minutes, seconds };
        }
    },
    created() {
        this.fetchMedicalProfiles();  
    },
    methods: {
        // calcolare il tempo di tutte sponsorizzazione
        calculateTotalTimeLeft() {
            const currentTime = new Date();
            let totalTime = 0; 
            let addedOneHour = false;
            if (this.medico.payments && this.medico.payments.length > 0) {
                this.medico.payments.forEach(payment => {
                    const endDate = new Date(payment.end_date);
                    if (endDate > currentTime) { 
                        const timeLeft = Math.ceil((endDate - currentTime) / 1000);
                        totalTime += timeLeft;

                        if (!addedOneHour) {
                            totalTime += 3600; // Agregamos una hora en segundos (3600 segundos)
                            addedOneHour = true; // Marcamos que ya se agregó la hora
                        }
                    }
                });
            }
            this.timeLeft = totalTime;
        },

        // iniziare il timer 
        startTimer() {
            this.calculateTotalTimeLeft(); 

            this.timerInterval = setInterval(() => {
                if (this.timeLeft <= 0) {
                    clearInterval(this.timerInterval);
                    this.timeLeft = 0;
                } else {
                    this.timeLeft--; 
                }

                
                if (this.timeLeft % 60 === 0) {
                    this.calculateTotalTimeLeft();
                }
            }, 1000);
        },

        // funzione per la data di creazione di created_at
        formatDate(isoString) {
            const date = new Date(isoString);
            
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            
            const hours = String(date.getUTCHours()).padStart(2, '0');
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');

            return `${day}-${month}-${year} ${hours}:${minutes}`;
        },
        // volevo usare il nome con slug e cancellare(-)
        formatSlug(slug) {
        return slug
            .split('-')                   
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  
            .join(' ');                    
        },
        // funzione per la informazione del profilo medico
        async fetchMedicalProfiles() {
            try { 
                const slug = this.$route.params.slug;
                const id = this.$route.params.id;

                const url = `/api/user-profiles/${slug}/${id}`;

                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token de autenticación no disponible');
                    return;
                }
                console.log(token);

                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                });
                if (response.data && response.data.status === 'success') {
                    this.medico = response.data.results;  
                    const baseUrl = "http://localhost:8000/storage/";

                    if (this.medico.photograph) {
                        this.medico.photograph = baseUrl + this.medico.photograph;
                    }
                    if (this.medico.cv) {
                        this.medico.cv = baseUrl + this.medico.cv;
                    }
                    this.startTimer();
                    this.$nextTick(() => {
                        this.renderCombinedChart();
                    });                
                } else {
                console.log('Respuesta de la API:', response.data);                }
            } catch (error) {
                console.error('Error al hacer la solicitud a la API:', error);
            }
        },
        // funzione per il delete
        async deleteMedicalProfile() {
            try {
                const url = `/api/medical/${this.medico.id}`;
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token de autenticación no disponible');
                    return;
                }
                
                const response = await axios.delete(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data && response.data.status === 'success') {
                    console.log(response);
                    this.$router.push('/user-profili')
                } else {
                    console.error('Error al eliminar el perfil:', response.data.message);
                }
            } catch (error) {
                console.error('Error al hacer la solicitud de eliminación:', error);
            }
        },
        // grafico  per la quantità dei messagi e valutazione
        renderCombinedChart() {
            if (!this.medico) return;

            const ctx = document.getElementById('combinedChart').getContext('2d');

            const messageData = this.medico.statistics.map(stat => stat.messages_received);
            const reviewData = this.medico.statistics.map(stat => stat.reviews_received);
            const labels = this.medico.statistics.map(stat => stat.update_date.split('T')[0]);

            if (this.combinedChart) {
                this.combinedChart.destroy();
            }

            this.combinedChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Messagio ricevuto',
                            data: messageData,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',    
                            borderWidth: 1
                        },
                        {
                            label: 'Valutazione',
                            data: reviewData,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)', 
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }
};
</script>

<template>
    <div class="container bg-white p-5 rounded-5 my-5">
        <div>
            <div v-if="medico">
                <router-link :to="{ name: `create` }" class="btn btn-outline-info mb-3"
                    > <i class="fa-solid fa-arrow-left"></i> Indietro</router-link
                >
                <div class="d-flex justify-content-between mb-4 row">
                    <h1 class="merienda col-8">{{ formatSlug(medico.slug) }}</h1>
                    <div class="col-4 text-end">
                        <router-link :to="{ name: `PutchPage`, 
                        params: { slug: medico.slug, user_id: medico.user_id, id: medico.id  }
                        }">
                           <button type="button" class="btn btn-outline-warning">
                               <i class="fs-5 fa-solid fa-pen"></i>
                           </button>
                        </router-link>

                        <button type="button" class="btn btn-outline-danger mx-4" data-bs-toggle="modal" data-bs-target="#cancellare">
                            <i class="fs-5 fa-solid fa-trash-can"></i>
                        </button>

                        <div class="modal fade" id="cancellare" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body text-center">
                                    <h4 class="text-danger">Sei sicuro di voler cancellare?</h4>
                                    <p>La cancellazione è irreversibile</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-danger"  @click="deleteMedicalProfile" data-bs-dismiss="modal">
                                        Cancellare profilo
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>

                        <SponsorshipModal />
                    </div>
                </div>
                
                <div class="d-flex row">
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
                                <p class="fs-5 py-3">
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
                        <h2 class="charm"><i class="fa-solid fa-house-chimney-medical"></i> Consulenze Mediche:</h2>
                            <div class="row row-gap-3">
                                <div class="col-6" v-for="(performance, index) in visiblePerformances" :key="performance.id">
                                    <div class="p-3 border border-primary-subtle rounded-4">
                                        <h5 class="tinos">{{ performance.medicine_performance.name }}</h5>
                                        <p>{{ performance.medicine_performance.description }}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- buttons performances -->
                            <button 
                                v-if="medico.profile_performances.length > 2 && !showAllPerformances" 
                                @click="showAllPerformances = true" 
                                class="btn btn-primary mt-3"
                            >
                                Guarda tutti gli Consulenze Mediche
                            </button>
                            <button 
                                v-if="showAllPerformances" 
                                @click="showAllPerformances = false" 
                                class="btn btn-secondary mt-3"
                            >
                                Mostra meno
                            </button>
                    </div>
                    <div class="col-5">
                        <img class="w-100" :src="medico.photograph" alt="Foto de perfil de {{ medico.slug }}" />
                    </div>
                    <div class="col-12">
                        <h2 class="charm pt-5">
                            <i class="fa-solid fa-chart-column"></i> Sponsorizzazioni:
                        </h2>

                        <div v-if="timeLeft !== null" class="d-flex align-items-center justify-content-center gap-3">
                            <div class="time-box text-center border rounded-4 px-3 py-2  bg-dark text-white">
                                <div class="time-value fs-3">{{ formattedTimeLeft.hours }}</div>
                                <div class="time-label">Ore</div>
                            </div>

                            <strong class="fs-3">:</strong>

                            <div class="time-box text-center border rounded-4 px-3 py-2  bg-dark text-white">
                                <div class="time-value fs-3">{{ formattedTimeLeft.minutes }}</div>
                                <div class="time-label">Minuti</div>
                            </div>

                            <strong class="fs-3">:</strong>

                            <div class="time-box text-center border rounded-4 px-3 py-2  bg-dark text-white">
                                <div class="time-value fs-3">{{ formattedTimeLeft.seconds }}</div>
                                <div class="time-label">Secondi</div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="alert alert-primary d-flex align-items-center w-100" role="alert">
                                <i class="fa-solid fa-circle-info pe-3"></i>
                                <div>
                                    Non c'è nessuna sponsorizzazione attiva per il momento
                                </div>
                            </div>
                        </div>
                        <h3 class="charm pt-5"><i class="fa-solid fa-envelope"></i> Messaggio:</h3>
                        <div v-if="medico.messages.length === 0">
                            <div class="alert alert-primary d-flex align-items-center w-100" role="alert">
                                <i class="fa-solid fa-circle-info pe-3"></i>
                                <div>
                                    Non hai nessun messaggio
                                </div>
                            </div>
                        </div>
                        <div class="row row-gap-3">
                            <div class="col-4" v-for="message in visibleMessages" :key="message.id">
                                <div class="card fst-italic px-0">
                                    <div class="card-header bg-primary-subtle">
                                        <strong> <i class="fa-regular fa-user"></i>  Da:</strong> {{ message.email_sender }}
                                    </div>
                                    <div class="card-body bg-success bg-opacity-10">
                                        <p class="">
                                            <strong> <i class="fa-regular fa-file-lines"></i>  Contenuto:</strong> {{ message.content }}
                                        </p>
                                        <p class="">
                                            <strong><i class="fa-solid fa-calendar-days"></i>  Data:</strong> {{ formatDate(message.created_at) }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Button per i messagi -->
                        <button 
                            v-if="medico.messages.length > 3 && !showAllMessages" 
                            @click="showAllMessages = true" 
                            class="btn btn-primary mt-3"
                        >
                            Mostra tutti i messaggi
                        </button>
                        <button 
                            v-if="showAllMessages" 
                            @click="showAllMessages = false" 
                            class="btn btn-secondary mt-3"
                        >
                            Mostra meno messaggi
                        </button>

            
                        <h3 class="charm pt-5"><i class="fa-solid fa-star"></i> Recensioni:</h3>
                        <div v-if="medico.reviews.length === 0">
                            <div class="alert alert-primary d-flex align-items-center w-100" role="alert">
                                <i class="fa-solid fa-circle-info pe-3"></i>
                                <div>
                                    Non hai nessuna recensione
                                </div>
                            </div>
                        </div>
                        <div class="row row-gap-3">
                            <div class="col-4" v-for="review in visibleReviews" :key="review.id">
                                <div class="card bg-info-subtle text-center">
                                    <div class="card-header">
                                        <p class="mb-0"><strong>Nome:</strong> {{ review.full_name }}</p>
                                    </div>
                                    <div class="card-body bg-white">
                                        <p><strong><i class="fa-solid fa-at"></i> Email:</strong> {{ review.email }}</p>
                                        <p><strong><i class="fa-regular fa-comment"></i> Commentario:</strong> {{ review.comment }}</p>
                                    </div>
                                    <div class="card-footer text-body-secondary">
                                        <strong>Valutazione:</strong>
                                        <div class="rating">
                                            
                                            <label v-for="star in 5" :key="star">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
                                                    :class="{ 'selected': star <= review.valuation }">
                                                <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                                                </svg>
                                            </label>
                                        </div>
                                        {{ review.valuation }}/5
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Buttons rewiews -->
                        <button 
                            v-if="medico.reviews.length > 3 && !showAllReviews" 
                            @click="showAllReviews = true" 
                            class="btn btn-primary mt-3"
                        >
                            Mostra tutte le recensioni
                        </button>
                        <button 
                            v-if="showAllReviews" 
                            @click="showAllReviews = false" 
                            class="btn btn-secondary mt-3"
                        >
                            Mostra meno recensioni
                        </button>
            
                        <h3 class="charm pt-5"><i class="fa-solid fa-chart-column"></i> Statistiche:</h3>
                        <div class="" v-if="medico.statistics.length === 0">
                            <div class="alert alert-primary d-flex align-items-center w-100" role="alert">
                                <i class="fa-solid fa-circle-info pe-3"></i>
                                <div>
                                    Non ci sono dati per il grafico
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 class="charm pt-5"><i class="fa-solid fa-chart-column"></i> Gráficos:</h3>

                            <div>
                    <div class="chart-container my-5">
                        <canvas id="combinedChart"></canvas>
                    </div>
                </div>
                        </div>
                        <!-- <ul>
                            <li v-for="stat in medico.statistics" :key="stat.id">
                                <strong>:</strong> {{ stat.value }}
                            </li>
                        </ul> -->
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

#combinedChart {
    width: 100%;
}
.chart-container {
    position: relative;
    height: 400px;
    width: 100%;
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

.rating input {
  appearance: unset;
}

.rating svg {
  width: 2rem;
  height: 2rem;
  overflow: visible;
  fill: transparent;
  stroke: #666;
  stroke-linejoin: bevel;
  stroke-dasharray: 12;
  animation: idle 4s linear infinite;
  transition: stroke 0.2s, fill 0.5s;
}

@keyframes idle {
  from {
    stroke-dashoffset: 24;
  }
}

.rating input:checked ~ label svg {
  transition: 0s;
  animation: idle 4s linear infinite, yippee 0.75s backwards;
  fill: #ffc73a;
  stroke: #ffc73a;
  stroke-opacity: 0;
  stroke-dasharray: 0;
  stroke-linejoin: miter;
  stroke-width: 8px;
}

@keyframes yippee {
  0% {
    transform: scale(1);
    fill: #ffc73a;
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: #666;
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30% {
    transform: scale(0);
    fill: #ffc73a;
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: #666;
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30.1% {
    stroke: #ffc73a;
    stroke-dasharray: 0;
    stroke-linejoin: miter;
    stroke-width: 8px;
  }

  60% {
    transform: scale(1.2);
    fill: #ffc73a;
  }
}

.rating svg.selected {
  fill: #ffc73a;
  stroke: #ffc73a;
  stroke-opacity: 0;
}

.timer-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #ffffff;
    border: 2px solid #0d6efd; /* Azul */
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 250px;
    margin: auto;
    font-family: 'Arial', sans-serif;
}

.timer-title {
    color: #0d6efd;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.timer-value {
    color: #000; 
    font-size: 36px;
    font-weight: bold;
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