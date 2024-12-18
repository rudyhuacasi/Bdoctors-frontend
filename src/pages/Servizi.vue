<script>
import axios from 'axios';
import CardServizi from '../components/CardServizi.vue';

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
		red: null,
		animating: false,
		direction: 'next',
		currentCard: null,
		specialtySuggestions: [],
		};
	},
	components: {
		CardServizi,
	},
	created() {
		// Recupera i profili sponsorizzati e, se non ci sono profili medici, ripristina lo stato della ricerca
		this.fetchSponsorshipProfiles();
		if (!this.medicalProfiles.length) {
			this.restoreSearchState();
			this.fetchMedicalProfiles();
		}
	},
  	methods: {
		// Recupera i profili sponsorizzati dagli utenti
		async fetchSponsorshipProfiles() {
			try {
				const response = await axios.get('/api/sponsorships-user');
				if (response.data.results && response.data.results.length > 0) {
					this.red = response.data.results;
					this.currentCard = this.red[0];
				} else {
					this.red = [];
					this.currentCard = null;
				}
			} catch (error) {
				console.error('Errore al caricare i profili:', error);
			}
		},
		// Cancella il criterio di ricerca della specializzazione
		clearSearch() {
			this.searchCriteria.specialization = '';
			localStorage.removeItem('searchCriteria');
			this.specialtySuggestions = []; 
		},
		// Cancella i criteri di ricerca per rating e recensioni
		clearModalSearch() {
            this.searchCriteria.minRating = null;
			this.searchCriteria.minReviews = null;
			this.applyFilters()
        },
		// Recupera le specializzazioni in base ai termini inseriti dall'utente
		async fetchSpecializations() {
			try {
				const term = this.searchCriteria.specialization;
				if (term.length > 2) {
					const response = await axios.get('/api/specializations/search', {
						params: { term }
					});
					this.specialtySuggestions = response.data;
				} else {
					this.specialtySuggestions = [];
				}
			} catch (error) {
				console.error('Errore al vedere di specialization:', error);
			}
		},
		// Seleziona una specializzazione dai suggerimenti
		selectSpecialization(specialty) {
			this.searchCriteria.specialization = specialty.name;
			this.specialtySuggestions = [];
			this.applyFilters();
		},
		// Applica i filtri per aggiornare i profili medici
		async applyFilters() {
			try {
				const params = {
					specialization: this.searchCriteria.specialization || '',
					min_rating: this.searchCriteria.minRating,
					min_reviews: this.searchCriteria.minReviews,
				};

				const response = await axios.get('/api/medical-profiles/search', { params });
				const baseUrl = 'http://localhost:8000/storage/';

				if (response.data) {
					this.medicalProfiles = response.data.map((profile) => {
						profile.photograph = profile.photograph.startsWith('http')
							? profile.photograph
							: baseUrl + profile.photograph;
						return profile;
					});
					this.saveSearchState();
				} else {
					this.medicalProfiles = [];
				}
			} catch (error) {
				console.error('Errore a fare la ricerca :', error);
			}
		},
		// Salva lo stato di ricerca nei dati locali
		saveSearchState() {
			localStorage.setItem('searchCriteria', JSON.stringify(this.searchCriteria));
			localStorage.setItem('medicalProfiles', JSON.stringify(this.medicalProfiles));
		},
		// Ripristina lo stato di ricerca dai dati locali
		restoreSearchState() {
			if (!this.searchCriteria.specialization) {
				const savedCriteria = localStorage.getItem('searchCriteria');
				const savedProfiles = localStorage.getItem('medicalProfiles');
				if (savedCriteria) this.searchCriteria = JSON.parse(savedCriteria);
				if (savedProfiles) this.medicalProfiles = JSON.parse(savedProfiles);
			}
		},
		
		// Formatta uno slug in un nome leggibile
		formatSlug(slug) {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('  ');
        },
		
		// animazione del cambio delle card
		updateCards(direction) {
			if (this.animating) return;
			this.animating = true;
			this.direction = direction;

			setTimeout(() => {
				if (direction === 'next') {
				this.red.push(this.red.shift());
				} else {
				this.red.unshift(this.red.pop());
				}

				this.currentCard = this.red[0] || null; 
				this.animating = false;
			}, 800);
		},
		// funzione d'avanti delle card
		showNextCard() {
			this.updateCards('next');
		},
		//funzione indietro delle card
		showPreviousCard() {
			this.updateCards('previous');
		},
		// Gestisce la fine della transizione
		handleTransitionEnd() {
			this.animating = false;
		},
		// funzione di chiamata API per la ricerca
        async fetchMedicalProfiles() {
			try {
				const params = {};
				if (this.searchCriteria.specialization) {
					params.specialization = this.searchCriteria.specialization;
				}
				if (this.searchCriteria.minRating !== null) {
					params.min_rating = this.searchCriteria.minRating;
				}
				if (this.searchCriteria.minReviews !== null) {
					params.min_reviews = this.searchCriteria.minReviews;
				}
				const response = await axios.get('/api/medical-profiles/search', { params });
				const baseUrl = "http://localhost:8000/storage/";
				if (response.data) {
					this.medicalProfiles = response.data.map(profile => {
					profile.photograph = profile.photograph.startsWith('http')
						? profile.photograph
						: baseUrl + profile.photograph;
					return profile;
					});
				}
				this.medicalProfiles = response.data || [];
				console.log(response.data);
				this.saveSearchState();
			} catch (error) {
				console.error("Errore a volere vedere i profili:", error);
			}
        },
	}
};
</script>
<template>
<div class="search-box py-3">
	<div class="container">
        <div class="d-flex align-items-center justify-content-between">
			<div class="">

				<div class="search-container">
					<label class="close-icon rounded-3" @click="clearSearch" v-show="searchCriteria.specialization">
						<i class="fas fa-xmark"></i>
					</label>
					<input
						type="text"
						id="search"
						class="search-input"
						placeholder="Buscar..."
						v-model="searchCriteria.specialization"
						@input="fetchSpecializations"
	
					/>
					<label for="search" class="search-icon" @click="applyFilters">
						<i class=" fondo-c fa fa-search"></i>
					</label>
					<!-- suggestions -->
						<div class="position-absolute absolute-suggestions bg-secondary-subtle">
							<div v-if="specialtySuggestions.length" class="border border-secondary-subtle col-12 suggestion">
								<div class="suggestions-list">
									<div 
										  v-for="suggestion in specialtySuggestions" 
										  :key="suggestion.id" 
										  @click="selectSpecialization(suggestion)"
										  class="suggestion-item p-2"
									>
										  {{ suggestion.name }}
									</div>
								</div>
							</div>
						</div>
				</div>
			</div>

            <button type="button" class="filtri" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                <em>Filtri</em>
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
                                <label>Media di voti</label>
                                <input type="number" v-model="searchCriteria.minRating" class="form-control"  @input="applyFilters">
                            </div>
                            <div class="mb-3">
                                <label>Numero minimo di recensioni</label>
                                <input type="number" v-model="searchCriteria.minReviews" class="form-control"  @input="applyFilters">
                            </div>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="resettare p-2" @click="clearModalSearch"><span class="position-relative lettera">Resettare</span></button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
	</div>
</div>
<div class="container bg-white rounded-5 my-5" v-if="medicalProfiles.length > 0 && searchCriteria.specialization">
	<div class="row">
 		<div class="col-4 p-5" v-for="profile in medicalProfiles" :key="profile.id">
			<div  class="profile-card">
				<div class="card c-modifiche">
					<div class="position-relative">
						<img :src="profile.photograph" class="rounded-3 busta-img" alt="...">
						<div class="icon">
							<router-link :to="{ name: `medico`, params: {slug: profile.slug, id: profile.id, searchCriteria } }" class="iconBox">
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

</div>

<!-- sponsorship di medici -->
<div class="body" v-else>
	<div class="bg-white container d-flex justify-content-center my-5 rounded-4" v-if="red === null">
		<div class="spinner-4"></div>
	</div>
	<div class="bg-white container d-flex justify-content-center my-5 rounded-4" v-else-if="red.length === 0">
		<div class="alert alert-primary d-flex align-items-center my-3 w-90" role="alert">
			<i class="fa-solid fa-circle-info pe-2"></i>
			<div>
				Non abbiamo raccomandazione per ora.
			</div>
		</div>
	</div>
	<div class="bg-white rounded-5  row my-4" v-else>
		<div class="cards-container col-5">
			<!-- immagine di fondo per vedere al dottore -->
			<div 
				v-if="currentCard?.medical_profile?.photograph"
				class="background-image rounded-start-5"
				:class="{
				'zoom-in': animating && direction === 'previous',
				'zoom-out': animating && direction === 'next'
				}"
				:style="{ backgroundImage: `url(http://localhost:8000/storage/${currentCard.medical_profile.photograph})` }"
				>		
			</div>



			<!-- freccie -->
			<div class="pagination">
				<div class="arrow arrow-left" @click="showPreviousCard">
					<!-- freccia sinistra -->
					<i class="fa-solid fa-chevron-left"></i>
				</div>
				<div class="arrow arrow-right" @click="showNextCard">
					<!-- freccia destra -->
					<i class="fa-solid fa-chevron-right"></i>
				</div>
			</div>
		</div>

		<!-- elenco delle carte -->

		<div class="col-7 d-flex flex-column justify-content-between">
			<div class="col-12 my-5">
				<div class="bg-primary rounded-5 p-5 mx-5 ">
					<h1 class="alex"><i class="fs-2 fa-solid fa-user-doctor"></i>:  {{ formatSlug(currentCard.medical_profile.slug) }}</h1>
					<router-link class="text-decoration-none"  :to="{ name: `medico`, params: {slug: currentCard.medical_profile.slug, id: currentCard.medical_profile.id} }">
						<button class="animated-button">
							<i class="arr-2 fa-solid fa-arrow-right"></i>
							<span class="text">Scopri Chi sono?</span>
							<span class="circle"></span>
							<i class="arr-1 fa-solid fa-arrow-right"></i>
						</button>
                    </router-link>
				</div>

			</div>
			<div class="col-12 position-relative">
				<div class="cards-wrapper position-absolute">
					<div
						v-for="(card, index) in red" 
						:key="card.id"
						class="carte"
						:class="{
						'zoom-out': animating && direction === 'next' && index === 0,
						'zoom-in': animating && direction === 'previous' && index === red.length - 1 || index === 0 && !animating,}"
						@transitionend="handleTransitionEnd"
					>
						<img :src="`http://localhost:8000/storage/${card.medical_profile.photograph}`" :alt="card.medical_profile.slug">
						<div class="card-content p-3">
							<h3 class="delius">{{ formatSlug(card.medical_profile.slug) }}</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="container">
		<CardServizi />
	</div>
</div>
</template>

<style lang="scss" scoped>
@use "../assets/scss/partials/_variables" as *;

.cards-container {
	position: relative;
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
	bottom: 0;
}

.carte {
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

.carte img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.card-content {
	background-color: #000000bb;
	color: white;
	flex-grow: 1;
	position: absolute;
	bottom: 0;
	height: 25%;
	width: 100%;
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
	width: 3.1rem;
	height: 3.1rem;
	border-radius: 50%;
	border: 2px solid black;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20px;
	z-index: 200;
}

.arrow svg {
	width: 1rem;
	color: black;
}
.arrow svg:hover{
	height: 1.5rem;
	transition: ease 0.2s ;
}

.pagination{
	position: absolute;
	bottom: 10%;
	left: 20%;
}

.delius{
	font-family: "Delius";
}
.arrow:hover{
	background-color: #ff6800
}

.animated-button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 16px 36px;
  border: 4px solid;
  border-color: transparent;
  font-size: 16px;
  background-color: inherit;
  border-radius: 100px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 0 0 2px #fff;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button svg {
  position: absolute;
  width: 24px;
  fill: #fff;
  z-index: 9;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button .arr-1 {
  right: 16px;
}

.animated-button .arr-2 {
  left: -25%;
}

.animated-button .circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #ff0;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button .text {
  position: relative;
  z-index: 1;
  transform: translateX(-12px);
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}

.animated-button:hover {
  box-shadow: 0 0 0 12px transparent;
  color: #212121;
  border-radius: 12px;
}

.animated-button:hover .arr-1 {
  right: -25%;
}

.animated-button:hover .arr-2 {
  left: 16px;
}

.animated-button:hover .text {
  transform: translateX(12px);
}

.animated-button:hover svg {
  fill: #212121;
}

.animated-button:active {
  scale: 0.95;
  box-shadow: 0 0 0 4px greenyellow;
}

.animated-button:hover .circle {
  width: 220px;
  height: 220px;
  opacity: 1;
}

.alex{
	font-family: "Alex Brush";
	font-weight: 400;
  	font-style: normal;
	font-size: 4.3rem;
	text-align: center;
}

.search-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 50px;
    height: 50px;
    background-color: #eeeeee;
    border-radius: 8px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 5px 10px;
    cursor: pointer;
}

.search-container.expanded {
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
    transition: opacity 0.3s ease;
}

.search-icon {
    position: absolute;
    right: 15px;
    font-size: 18px;
    cursor: pointer;
    color: black;
}

.close-icon{
	padding: 0.8rem;
    color: red;
    cursor: pointer;
	margin-left: -0.7rem;
    // margin-top: -0.1rem;
}

.close-icon:hover{
	background-color: red;
    color: rgb(187, 199, 201);
}


.search-container {
    position: relative;
    display: flex;
    align-items: center;
    width: 500px;
    height: 50px;
    background-color: #eeeeee;
    border-radius: 8px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 5px 10px;
    cursor: pointer;
}

.search-container.expanded {
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
    transition: opacity 0.3s ease;
}

.search-icon {
    position: absolute;
    right: 15px;
    font-size: 18px;
    cursor: pointer;
    color: black;
}
.search-box{
	background-color: $primary;
}
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
.absolute-suggestions{
	top: 100%;
	z-index: 100;
	left: 0;
	width: 100%;
}

.suggestion-item:hover{
	background-color: white;
}

.filtri {
 padding: 15px 25px;
 border: unset;
 border-radius: 15px;
 color: #212121;
 z-index: 1;
 background: #e8e8e8;
 position: relative;
 font-weight: 1000;
 font-size: 17px;
 -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
 box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
 transition: all 250ms;
 overflow: hidden;
}

.filtri::before {
 content: "";
 position: absolute;
 top: 0;
 left: 0;
 height: 100%;
 width: 0;
 border-radius: 15px;
 background-color: #212121;
 z-index: -1;
 -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
 box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
 transition: all 250ms
}

.filtri:hover {
 color: #e8e8e8;
}

.filtri:hover::before {
 width: 100%;
}

.resettare {
  position: relative;
  font-family: inherit;
  font-weight: 500;
  font-size: 18px;
  letter-spacing: 0.05em;
  border-radius: 0.8em;
  cursor: pointer;
  border: none;
  background: linear-gradient(to right, $no-gradient, $primary);
  color: ghostwhite;
  overflow: hidden;
}

.resettare svg {
  width: 1.2em;
  height: 1.2em;
  margin-right: 0.5em;
}

.resettare span {
  position: relative;
  z-index: 10;
  transition: color 0.4s;
  display: inline-flex;
  align-items: center;
}

.resettare::before,
.resettare::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.resettare::before {
  content: "";
  background: #00d9a6;
  width: 120%;
  left: -10%;
  transform: skew(30deg);
  transition: transform 0.4s cubic-bezier(0.3, 1, 0.8, 1);
}

.resettare:hover::before {
  transform: translate3d(100%, 0, 0);
}

.resettare:active {
  transform: scale(0.95);
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

.w-90{
	width: 90%;
}

</style>