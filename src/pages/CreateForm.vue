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
        this.fetchPerformances(); // Cargar prestaciones al montar el componente
    },
        methods: {
            async fetchPerformances() {
            try {
                const response = await axios.get('/api/medicine-performances'); // Ruta para obtener prestaciones
                this.performances = response.data;
            } catch (error) {
                console.error('Error fetching performances:', error);
            }
        },
            async fetchSpecializations() {
        try {
            const term = this.medicalProfile.specialty; // El término ingresado
            if (term.length > 2) { // Llama al backend solo si hay al menos 3 caracteres
                const response = await axios.get('/api/specializations/search', {
                    params: { term } // Pasa el término como parámetro
                });
                this.specialtySuggestions = response.data; // Lista de sugerencias
            } else {
                // this.medicalProfile.specialty = specialty.name;
                this.specialtySuggestions = []; // Limpia si el input es menor a 3 caracteres
            }
        } catch (error) {
            console.error('Error al obtener las especializaciones:', error);
        }
    },
    // Selecciona una sugerencia y la asigna al input
    selectSpecialization(specialty) {
    this.medicalProfile.specialty = specialty.name; // Muestra el nombre en el input
    this.medicalProfile.specialization_id = specialty.id; // Almacena el ID para enviarlo al backend
    this.specialtySuggestions = []; // Limpia las sugerencias
    },

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
 // Asegúrate de agregar cada valor del arreglo por separado
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
                } else {
                    this.message = 'Error al crear el perfil médico.';
                }
                } catch (error) {
                console.error('Error al enviar el formulario:', error);
                this.message = 'Ocurrió un error al crear el perfil.';
                }
            },
            handleFileUpload(event, field) {
                this.medicalProfile[field] = event.target.files[0];
            }
        },
        watch: {
            // Monitorizamos los cambios en los checkboxes para actualizar la validación
            'medicalProfile.selectedCheckboxes'(newValue) {
            // Si se selecciona al menos un checkbox, la validación es correcta
            this.isCheckboxValid = newValue.length > 0;
            },
        },
    }
</script>
<template>
    <div class="container">
        <div class="square my-5 rounded-5 p-5">
            
            <h1><em>Inserisci i tuoi dati</em></h1>
            <form class="row g-3 needs-validation" novalidate @submit.prevent="handleSubmit" >
            
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
                        required
                    >
                    <div class="invalid-feedback">
                        L'specialità è obbligatorio
                    </div>
                    
                    <!-- Lista de sugerencias -->
                    <ul v-if="specialtySuggestions.length" class="suggestions-list">
                        <li 
                            v-for="suggestion in specialtySuggestions" 
                            :key="suggestion.id" 
                            @click="selectSpecialization(suggestion)"
                            class="suggestion-item"
                        >
                            {{ suggestion.name }}
                        </li>
                    </ul>
                </div>
                <!-- Checkboxes para Prestaciones -->
                <div class="col-12">
                    <label class="form-label">Prestazioni Disponibili</label>
                    <div v-for="performance in performances" :key="performance.id" class="form-check">
                        <input
                            class="form-check-input"
                            type="checkbox"
                            :value="performance.id"
                            v-model="medicalProfile.selectedCheckboxes"
                            :class="{'is-invalid': !isCheckboxValid && checkboxTouched}"
                        >
                        <label class="form-check-label" 
                        :class="{'invalid-feedback': !isCheckboxValid && checkboxTouched}"
                        >{{ performance.name }}</label>
                    </div>
                    <div v-if="!isCheckboxValid && checkboxTouched" class="invalid-feedback d-block">
                        Por favor seleccione al menos una prestación.
                    </div>
                </div>
    
            <div>success</div>
            <div class="form-check">
                <input type="radio" class="form-check-input" id="validationFormCheck2" name="gender" v-model="medicalProfile.gender" value="Maschio" required>
                <label class="form-check-label" for="validationFormCheck2">Maschio</label>
            </div>
            <div class="form-check mb-3">
                <input type="radio" class="form-check-input" id="validationFormCheck3" name="gender" v-model="medicalProfile.gender" value="Femminile" required>
                <label class="form-check-label" for="validationFormCheck3">Femminile</label>
                <div class="invalid-feedback">Por favor selecciona el género</div>
            </div>
    
    
            
            <div class="col-12">
                <label for="validationCustom03" class="form-label">Indirizzo</label>
                <input type="text" class="form-control" id="validationCustom03" v-model="medicalProfile.address" required>
                <div class="invalid-feedback">
                Please provide a valid city.
                </div>
            </div>
            
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
                <div class="invalid-feedback">Example invalid form file feedback</div>
            </div>
    
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
                <div class="invalid-feedback">Example invalid form file feedback</div>
            </div>
            
            <div class="col-12">
                <button class="btn btn-primary" type="submit">Submit form</button>
            </div>
            </form>
        </div>
    </div>
</template>
<style lang="scss" scoped>

.is-invalid {
  border-color: red !important;
}
.invalid-feedback {
  color: red;
}
.square{
    background-color: white;
}
</style>