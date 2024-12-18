<script>
import axios from 'axios';

export default {
    data() {
        return {
            baseUrl: 'http://localhost:8000/storage/',
            medicalProfile: {
                phone: "",
                address: "",
                cv: null,
                photograph: null,
                specialty: '',
                specialization_id: '',
                selectedCheckboxes: []
            },
            performances: [], 
            specialtySuggestions: [],
            isCheckboxValid: true,
            checkboxTouched: false,

            profileId: this.$route.params.id,
            selectedFile: null,
            selectedPhotograph: null,
        };
    },
    created() {
        this.fetchPerformances();
        this.fetchMedicalProfiles();
    },
    methods: {
    // funzione per le prestazione del checkbox
    async fetchPerformances() {
        try {
            const response = await axios.get('/api/medicine-performances');
            this.performances = response.data;
        } catch (error) {
            console.error('Error fetching performances:', error);
        }
    },
    // funzione per la ricerca della specialità che abbiamo creato se vogliamo cambiare
    async fetchSpecializations() {
    try {
        const term = this.medicalProfile.specialty; 
        if (term.length > 2) { 
            const response = await axios.get('/api/specializations/search', {
                params: { term } 
            });
            this.specialtySuggestions = response.data;
        } else {
            this.specialtySuggestions = [];
        }
    } catch (error) {
        console.error('Error al obtener las especializaciones:', error);
    }
    },
    // Seleziona un suggerimento e assegnalo all'input
    selectSpecialization(specialty) {
        this.medicalProfile.specialty = specialty.name; 
        this.medicalProfile.specialization_id = specialty.id; 
        this.specialtySuggestions = [];
    },
    // funzione per fare la chiamata del profilo medico in dettaglio
    async fetchMedicalProfiles() {
        
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
        if (response.data && response.data.results) {
            this.medicalProfile = {
                phone: response.data.results.phone, 
                address: response.data.results.address,
                cv: response.data.results.cv,
                photograph: response.data.results.photograph,
                specialty: response.data.results.specializations.name,
                specialization_id: response.data.results.specialization_id,
                selectedCheckboxes: response.data.results.profile_performances.map(performance => performance.medicine_performance_id),
            };
              console.log( response.data.results);
        } else {
            console.error("Datos no encontrados en la respuesta de la API");
        }
    },
    // funzione per fare la validacion del input con bootstrap
    async handleSubmit(event) {
        const form = event.target;

        this.checkboxTouched = true;
        this.isCheckboxValid = this.medicalProfile.selectedCheckboxes.length > 0;

        if (form.checkValidity() === false || !this.isCheckboxValid) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            await this.updateMedicalProfile();
        }

        form.classList.add('was-validated');
    },
    // funzione per le immagini e il cv
    handleFileUpload(event, field) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
        if (field === 'photograph') {
            this.selectedPhotograph = reader.result.split(',')[1]; 
        } else if (field === 'cv') {
            this.selectedFile = reader.result.split(',')[1];
        }
        };
        reader.readAsDataURL(file);
    }
    },
    // funzione per fare un cambiamento nel profilo 
    async updateMedicalProfile() {
        const data = {
            phone: this.medicalProfile.phone,
            address: this.medicalProfile.address,
            specialization_id: this.medicalProfile.specialization_id,
            performances: [...this.medicalProfile.selectedCheckboxes],
        };

        if (this.selectedFile) {
            data.cv = this.selectedFile;
        }

        
        if (this.selectedPhotograph) {
            data.photograph = this.selectedPhotograph; 
        }
        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.put(`/api/medical/${this.$route.params.id}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log('Inviato:', data);
            console.log(response.data.results);
            this.$router.push({
                name: 'UserProfilePage',
                params: {
                    slug: this.$route.params.slug, 
                    id: this.$route.params.id
                }
            });
        } catch (error) {
            console.error('errore al aggioranre il profilo medico:', error);
        }
    },

    },
    watch: {
        // validazione dovrà selezzionare almeno un checkbox
        'medicalProfile.selectedCheckboxes'(newValue) {
        this.isCheckboxValid = newValue.length > 0;
        },
    },
};
</script>
<template>
<div class="container">    
    <div class="square my-5 rounded-5" v-if="medicalProfile.cv === null">
        <div class="spinner-4"></div>
    </div>
    
    <div class="square my-5 rounded-5" v-else >
        <div class="header-form px-5 py-3">
            <h1>
                <em>Aggiorna i tuoi dati</em>
            </h1>
        </div>
        <div class="px-5 py-2">
            <router-link :to="{name:`UserProfilePage`}">
                <button class="btn animated-button">Indietro</button>
            </router-link>
        </div>
        <form class="row g-3 needs-validation px-5 pb-5 pt-4" novalidate @submit.prevent="handleSubmit" enctype="multipart/form-data">
        
        <div class="col-12">
            <label for="validationCustom02" class="form-label">Telefono</label>
            <input type="tel" class="form-control" name="phone" id="validationCustom02" pattern="[0-9]{10}" v-model="medicalProfile.phone" required>
            <div class="invalid-feedback">
                Il numero telefonico è obbligatorio con 10 digiti
            </div>
        </div>
        
        <div class="col-12">
                <label for="specialtyInput" class="form-label">Specialità</label>
                <input
                    type="text"
                    id="specialtyInput"
                    class="form-control"
                    v-model="medicalProfile.specialty"
                    @input="fetchSpecializations"
                    autocomplete="off"
                    required
                >
                <div class="invalid-feedback">
                    L'specialità è obbligatorio
                </div>
                
                <!-- suggestions -->
                <div class="position-relative">
                    <div v-if="specialtySuggestions.length" class=" border border-secondary-subtle rounded-2 col-12 suggestion">
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
            <!-- Checkboxes per prestazioni -->
            <div>
                <label class="form-label">Prestazioni Disponibili</label>
                <div class="row row-gap-3">
                    <div v-for="performance in performances" :key="performance.id" class="col-4 d-flex">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :value="performance.id"
                            v-model="medicalProfile.selectedCheckboxes"
                            :class="{'border border-danger': !isCheckboxValid && checkboxTouched}"
                        >
                        <label class="form-check-label ps-2" 
                        :class="{'text-danger': !isCheckboxValid && checkboxTouched}"
                        >{{ performance.name }}</label>
                    </div>
                </div>
                <div v-if="!isCheckboxValid && checkboxTouched" class="invalid-feedback d-block">
                    Seleziona almeno una prestazione
                </div>
            </div>
        <div class="col-12">
            <label for="validationCustom03" class="form-label">Indirizzo</label>
            <input type="text" class="form-control" name="address" id="validationCustom03" v-model="medicalProfile.address" required>
            <div class="invalid-feedback">
                L'indirizzo è obbligatorio
            </div>
        </div>
        
        

        <!-- input per il cv -->
        <div class="col-12 mb-3">
            <label for="cv" class="form-label">Curriculum vitae</label>
            <input 
            id="cv"
            type="file" 
            class="form-control" 
            aria-label="file example" 
            accept=".pdf, .doc, .docx, .xlsx, .txt" 
            @change="handleFileUpload($event, 'cv')" 
            >
        </div>
        
        <div v-if="medicalProfile.cv">
            <p><strong>cv del profilo:</strong> <a :href="`${baseUrl}${medicalProfile.cv}`">CV del Profilo medico</a></p>
        </div>

        <!-- input per la fotografia -->
        <div class="col-12 mb-3">
            <label for="immagini" class="form-label">Fotografia</label>
            <input 
            id="immagini"
            type="file" 
            class="form-control" 
            aria-label="file example" 
            accept="image/*" 
            @change="handleFileUpload($event, 'photograph')" 
            >
        </div>

        <div v-if="medicalProfile.photograph">
            <p><strong>Immagini del profilo:</strong></p>
            <img class="actual" :src="`${baseUrl}${medicalProfile.photograph}`" alt="profile medici"/>
        </div>
        
        <div class="col-12">
            <button class="btn create" type="submit">Submit form</button>
        </div>
        </form>
    </div>
</div>
</template>

<style lang="scss" scoped>
@use "../assets/scss/partials/variables" as *;

.is-invalid {
    border-color: red;
}
.invalid-feedback {
    color: red;
}
.square{
    background-color: white;
}
.header-form{
    background: linear-gradient(45deg, rgba(155,225,93,1) 25%, rgba(0,217,166,1) 100%);
     border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;
}
.suggestion{
    position: absolute;
    z-index: 10;
    background-color: white;
    max-width: 100%;
}
.suggestions-list{
    cursor: pointer;
}
.suggestion-item:hover{
    background-color: rgba(233, 236, 239, 1);
    transition: 0.5s ease all;
}
.title{
    font-size: 3.3rem;
    font-family: "Playfair Display";
    font-weight: 700;
    font-style: normal;
}
@keyframes circle-in-hesitate {
    0% {
      clip-path: circle(0%);
    }
    40% {
      clip-path: circle(40%);
    }
    100% {
      clip-path: circle(125%);
    }
}

.create {
    position: relative;
    overflow: hidden; 
    background-color: $testo;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.create::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background-color: #2ECC71; 
    border-radius: 50%;
    transform: translate(-50%, -50%);
    clip-path: circle(0%);
    z-index: -5;
    transition: none;
}

.create:hover::after {
    animation: circle-in-hesitate .8s cubic-bezier(.25, 1, .30, 1) both;
}

@keyframes change-color {
    0% {
        background-color: #2ECC71;
    }
    100% {
        background-color: red;
    }
}

.animated-button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    background-color: #2ECC71;
    color: black;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.animated-button:hover {
    animation: change-color .5s forwards;
    color: white;
}

.actual{
    width: 200px;
    height: 200px;
}

</style>