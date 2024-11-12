<template>
	
<div class="search-box">
	<div class="container">
		<div class="d-flex align-items-center d-md-none">
            <div :class="['search-container', { expanded: isExpanded }]">
				<label class="close-icon" @click="collapseSearch" v-show="isExpanded">
                    <i class="fas fa-xmark"></i>
                </label>
                <input
                    type="text"
                    id="search"
                    class="search-input"
                    placeholder="Buscar..."
					v-show="isExpanded"
					@focus="expandSearch"
                	@blur="collapseSearch"
                />
                <label for="search" class="search-icon" @click="toggleSearch" >
					<i class=" fondo-c" :class="isExpanded ? 'fas fa-xmark' : 'fa fa-search'"></i>
                </label>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-between">
            <div class="search-container">
				<label class="close-icon">
                    <i class="fas fa-xmark"></i>
                </label>
                <input
                    type="text"
                    id="search"
                    class="search-input"
                    placeholder="Buscar..."	
                    v-model="searchCriteria.specialization"
                    @input="fetchMedicalProfiles"
                    			
                />
                <label for="search" class="search-icon"  >
					<i class=" fondo-c fa fa-search"></i>
                </label>
            </div>
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Filtri
            </button>

            <!-- Modal -->
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Filtri per la ricerca</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                            <div class="mb-3">
                                <label>Calificación Mínima</label>
                                <input type="number" v-model="searchCriteria.minRating" class="form-control" placeholder="1 a 5">
                            </div>
                            <div class="mb-3">
                                <label>Mínimo de Reseñas</label>
                                <input type="number" v-model="searchCriteria.minReviews" class="form-control" placeholder="Número mínimo de reseñas">
                            </div>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="applyFilters">Understood</button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
	</div>
</div>
<div class="results mt-4" v-if="medicalProfiles.length > 0 && searchCriteria.specialization">
	<div v-for="profile in medicalProfiles" :key="profile.id" class="profile-card">
		<h3>{{ profile.name }}</h3>
		<p><strong>Especialización:</strong> {{ profile.specialization }}</p>
		<p><strong>Calificación:</strong> {{ profile.rating }} / 5</p>
		<p><strong>Reseñas:</strong> {{ profile.review_count }}</p>
	</div>
</div>

<!-- sponsorship di medici -->
<div class="body row" v-else>
	<div class="cards-container col-6">
		<!-- immagine di fondo per vedere al dottore -->
		<div class="background-image" 
			:class="{
			'zoom-in': animating && direction === 'previous',
			'zoom-out': animating && direction === 'next'
			}"
			:style="{ backgroundImage: `url(http://localhost:8000/storage/${currentCard.photograph})` }">
		</div>

		

		<!-- freccie -->
		<div class="pagination">
			<div class="arrow arrow-left" @click="showPreviousCard">
				<!-- freccia sinistra -->
				i
			</div>
			<div class="arrow arrow-right" @click="showNextCard">
				<!-- freccia destra -->
				d
			</div>
		</div>
	</div>

	<!-- elenco delle carte -->

	<div class="col-6">
		<div class="cards-wrapper">
			<div
				v-for="(card, index) in data"
				:key="index"
				class="card"
				:class="{
				'zoom-out': animating && direction === 'next' && index === 0,
				'zoom-in': animating && direction === 'previous' && index === data.length - 1 || index === 0 && !animating,}"
				@transitionend="handleTransitionEnd"
			>
				<img :src="`http://localhost:8000/storage/${card.photograph}`" :alt="card.title">
				<div class="card-content">
					<h1>{{ card.title }}<br>{{ card.title2 }}</h1>
					<p>{{ card.description }}</p>
				</div>
			</div>
		</div>
	</div>
		

    <CardServizi />
</div>
</template>

<script>
import CardServizi from '../components/CardServizi.vue';
import SearchServizi from '../components/SearchServizi.vue';
import axios from 'axios';

export default {
	data() {
		return {
		 isExpanded: false,
                searchCriteria: {
                    specialization: '',
                    minRating: null,
                    minReviews: null,
                },
                medicalProfiles: [],
		data:[],
		animating: false,
		direction: 'next', // indirizzo dell'animazione
		currentCard: {}, // card attuale come immaggine di fondo
		};
	},
		components: {
			CardServizi,
			SearchServizi,
		},
	mounted() {
		this.fetchSponsorshipProfiles();
		// // Inizia con la prima card
		// this.currentCard = this.data[0];
	},
  	methods: {
		async fetchSponsorshipProfiles() {
			try {
				const response = await axios.get('/api/sponsorships-user');
				this.data = response.data.results; // Guarda los perfiles patrocinados en la propiedad sponsorshipProfiles
				// Inicia con la primera tarjeta como fondo si existen perfiles
				if (this.data.length > 0) {
					this.currentCard = this.data[0];
				}
			} catch (error) {
				console.error('Error al cargar los perfiles patrocinados:', error);
			}
		},
		// animazione del cambio delle card 
		updateCards(direction) {
		if (this.animating) return; 
		this.animating = true;
		this.direction = direction;

		setTimeout(() => {
			if (direction === 'next') {
			// la prima card cambis con l'ultimo
			this.data.push(this.data.shift());
			} else {
			// l'ultima card cambia con la prima
			this.data.unshift(this.data.pop());
			}

			// aggiornare la card
			this.currentCard = this.data[0];

			
		}, 800); // tempo della animazione
		},
		// funzione d'avanti delle cad
		showNextCard() {
			this.updateCards('next');
		},
		//funzione indietro delle cad
		showPreviousCard() {
			this.updateCards('previous');
		},
		handleTransitionEnd() {
			this.animating = false;
		},
		
            toggleSearch() {
                this.isExpanded = !this.isExpanded;
            },
            expandSearch() {
                this.isExpanded = true;
            },
            collapseSearch() {
                this.isExpanded = false;
            },
            async fetchMedicalProfiles() {
            try {
                // Construir dinámicamente los parámetros para la solicitud
                const params = {};

                // Añadir siempre la especialización como filtro base
                if (this.searchCriteria.specialization) {
                    params.specialization = this.searchCriteria.specialization;
                }

                // Añadir filtros opcionales solo si tienen valores
                if (this.searchCriteria.minRating !== null) {
                    params.min_rating = this.searchCriteria.minRating;
                }

                if (this.searchCriteria.minReviews !== null) {
                    params.min_reviews = this.searchCriteria.minReviews;
                }

                // Realizar la llamada a la API
                const response = await axios.get('/api/medical-profiles/search', { params });
                this.medicalProfiles = response.data || [];
            } catch (error) {
                console.error("Error al obtener perfiles médicos:", error);
            }
        },
        applyFilters() {
            this.fetchMedicalProfiles();
        }
	}
};
</script>

<style scoped>
.cards-container {
	position: relative;
	width: 50%;
	height: 50em;
	overflow: hidden;
}

.background-image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-size: cover;
	transition: transform 1s ease, opacity 1s ease;
	opacity: 1;
}

.cards-wrapper {
	display: flex;
	gap: 20px;
}

.card {
	width: 250px;
	height: 400px;
	background-color: #fff;
	border-radius: 15px;
	overflow: hidden;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	transition: transform 0.3s ease, opacity 1s ease;
	position: relative;
	opacity: 1;
	transform: scale(0.8);
	border: 0;
}

.card img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.card-content {
	padding: 15px;
	background-color: #000000bb;
	color: white;
	flex-grow: 1;
	position: absolute;
	bottom: 0;
	height: 35%;
}

.card-content h1 {
	font-size: 18px;
	font-family: 'Oswald', sans-serif;
	margin: 0;
}

.card-content p {
	margin-top: 10px;
	font-size: 12px;
	color: #ffffffbb;
}

.zoom-in {
	transform: scale(0.7);
	transition: transform 0.8s ease;
}

.zoom-out {
	transform: scale(0.4);
	transition: transform 0.8s ease;
}

.arrow {
	cursor: pointer;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	border: 2px solid #ffffff55;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20px;
	z-index: 200;
}

.arrow svg {
	width: 24px;
	height: 24px;
	stroke-width: 2;
	color: #ffffff99;
}

.pagination{
	position: absolute;
	bottom: 10%;
	left: 20%;
}

</style>		