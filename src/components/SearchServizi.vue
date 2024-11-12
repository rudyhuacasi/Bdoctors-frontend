<script>
import axios from 'axios';

    export default{
        name: 'SearchServizi',
        data() {
            return{
                 isExpanded: false,
                searchCriteria: {
                    specialization: '',
                    minRating: null,
                    minReviews: null,
                },
                medicalProfiles: []
            };
        },
        created(){
    
        },
        updated(){

        },
        methods:{
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
    }
</script>
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
        <div class="results mt-4" v-if="medicalProfiles.length > 0">
            <div v-for="profile in medicalProfiles" :key="profile.id" class="profile-card">
                <h3>{{ profile.name }}</h3>
                <p><strong>Especialización:</strong> {{ profile.specialization }}</p>
                <p><strong>Calificación:</strong> {{ profile.rating }} / 5</p>
                <p><strong>Reseñas:</strong> {{ profile.review_count }}</p>
            </div>
        </div>
	</div>
</div>
</template>
<style lang="scss" scoped>

// ricerca phone
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
    color: red;
    cursor: pointer;
}


// ricerca desktop
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

.close-icon{
    color: red;
    cursor: pointer;
}
</style>