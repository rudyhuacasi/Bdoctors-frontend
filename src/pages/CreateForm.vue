<script>
import axios from 'axios';
    export default{
        name: 'CreateForm',
        data(){
            return{
                medicalProfile: {
                    address: '',
                    phone: '',
                    cv: '',
                    photograph: '',
                    gender: '',
                    specialty: '',
                    specialization_id: '',
                    selectedCheckboxes: []
                },
                specialtySuggestions: [],
                performances: [],
                isCheckboxValid: true,
                checkboxTouched: false,
                errorMessage: ''
            }
        },
    mounted() {
        this.fetchPerformances(); 
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

        // funzione per fare la validacion del input con bootstrap
        async handleSubmit(event) {
            const form = event.target;
            this.checkboxTouched = true;
            this.isCheckboxValid = this.medicalProfile.selectedCheckboxes.length > 0;

            if (form.checkValidity() === false || !this.isCheckboxValid) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                await this.submitForm();
            }
            form.classList.add('was-validated');
        },
        // funzione per creare un profilo 
        async submitForm() {
            try {
                const token = localStorage.getItem('token');
                
                console.log(token);
                const formData = new FormData();
                formData.append('phone', this.medicalProfile.phone);
                formData.append('address', this.medicalProfile.address);
                formData.append('cv', this.medicalProfile.cv);
                formData.append('photograph', this.medicalProfile.photograph);
                formData.append('gender', this.medicalProfile.gender);
                formData.append('specialization_id', this.medicalProfile.specialization_id);
                this.medicalProfile.selectedCheckboxes.forEach(performance => {
                formData.append('performances[]', performance);
                });
                const response = await axios.post('/api/medical', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',                    
                }
                });
                if (response.data.status === 'success') {
                    this.message = 'Perfil médico creado exitosamente.';
                    this.$router.push({ name: 'create' });
                } else {
                    this.message = 'Error al crear el perfil médico.';
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error);
                this.message = 'Ocurrió un error al crear el perfil.';
            }
        },
        // funzione per le immagini e il cv
        handleFileUpload(event, field) {
            this.medicalProfile[field] = event.target.files[0];
        }
    },
    watch: {
        // validazione dovrà selezzionare almeno un checkbox
        'medicalProfile.selectedCheckboxes'(newValue) {
        this.isCheckboxValid = newValue.length > 0;
        },
    },
}
</script>
<template>
    <div class="container">
        <div class="square my-5 rounded-5">
            <div class="header-form  px-5 py-3">
                <h1 class="title">
                    <em>Inserisci i tuoi dati</em>
                </h1>
            </div>
            <div class="px-5 py-2 ">

                <router-link :to="{name:`create`}">
                    <button class="btn animated-button">Indietro</button>
                </router-link>
            </div>
            <form class="row g-3 needs-validation px-5 pb-5 pt-4" novalidate @submit.prevent="handleSubmit" >
            
            <div class="col-12">
                <label for="validationCustom02" class="form-label">Telefono</label>
                <input type="tel" class="form-control" id="validationCustom02" pattern="[0-9]{10}" v-model="medicalProfile.phone" required>
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
                        <div v-if="specialtySuggestions.length" class="border border-secondary-subtle rounded-2 col-12 suggestion">
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
    
            <label>Genere:</label>
            <div class="form-check">
                <input type="radio" class="form-check-input" id="validationFormCheck2" name="gender" v-model="medicalProfile.gender" value="Maschio" required>
                <label class="form-check-label" for="validationFormCheck2">Maschio</label>
            </div>
            <div class="form-check mb-3">
                <input type="radio" class="form-check-input" id="validationFormCheck3" name="gender" v-model="medicalProfile.gender" value="Femminile" required>
                <label class="form-check-label" for="validationFormCheck3">Femminile</label>
                <div class="invalid-feedback">Seleziona il genere</div>
            </div>
    
    
            
            <div class="col-12">
                <label for="validationCustom03" class="form-label">Indirizzo</label>
                <input type="text" class="form-control" id="validationCustom03" v-model="medicalProfile.address" required>
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
                required>
                <div class="invalid-feedback">Il cv è obbligatorio</div>
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
                required>
                <div class="invalid-feedback">La fotografia è obbligatorio</div>
            </div>
            
            <div class="col-12">
                <button class="btn create" type="submit">Submit form</button>
            </div>
            </form>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@use "../assets/scss/partials/_variables" as *;

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
    animation: change-color 5s forwards;
    color: white;
}


</style>