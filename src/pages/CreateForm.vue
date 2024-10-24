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
                    selectedCheckboxes: []
                },
                isCheckboxValid: true,
                checkboxTouched: false,
                errorMessage: ''
            }
        },
        methods: {
            async handleSubmit(event) {
                const form = event.target;
                    this.checkboxTouched = true;
                            // validazione di checkboxes
                            // this.isCheckboxValid = this.medicalProfile.selectedCheckboxes.length > 0;
                            if (form.checkValidity() === false ) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                            form.classList.add('was-validated');

                await this.submitForm();
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

                const response = await axios.post('/api/medical', formData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',                    
                    }
                });

                if (response.data.status === 'success') {
                    this.message = 'Perfil médico creado exitosamente.';
                    this.resetForm();
                } else {
                    this.message = 'Error al crear el perfil médico.';
                }
                } catch (error) {
                console.error('Error al enviar el formulario:', error);
                this.message = 'Ocurrió un error al crear el perfil.';
                }
            },
            resetForm() {
                this.medicalProfile = {
                    cv: null,
                    photograph: null,
                    phone: '',
                    address: ''
                };
            },
            handleFileUpload(event, field) {
                this.medicalProfile[field] = event.target.files[0];
            }
        },
        // watch: {
        //     // Monitorizamos los cambios en los checkboxes para actualizar la validación
        //     'medicalProfile.selectedCheckboxes'(newValue) {
        //     // Si se selecciona al menos un checkbox, la validación es correcta
        //     this.isCheckboxValid = newValue.length > 0;
        //     },
        // },
    }
</script>
<template>
    <div class="container">
        <h1><em>Inserisci i tuoi dati</em></h1>
        <form class="row g-3 needs-validation" novalidate @submit.prevent="handleSubmit" >
        
        <div class="col-12">
            <label for="validationCustom02" class="form-label">Telefono</label>
            <input type="tel" class="form-control" id="validationCustom02" pattern="[0-9]{10}" v-model="medicalProfile.phone" required>
            <div class="invalid-feedback">
                Il numero telefonico è obbligatorio con 10 digiti
            </div>
        </div>
        
            <!-- Checkboxes con validación -->
        <!-- <div class="col-12 mb-3">
            <label class="form-label">Seleziona almeno un checkbox:</label>

            <div class="form-check">
            <input 
                type="checkbox" 
                class="form-check-input" 
                id="validationFormCheck1" 
                value="checkbox1"
                v-model="medicalProfile.selectedCheckboxes"
                :class="{ 'is-invalid': !isCheckboxValid }" />
            <label class="form-check-label" 
            :class="{ 'text-danger': !isCheckboxValid }" 
            for="validationFormCheck1">Checkbox 1</label>
            </div>

            <div class="form-check">
            <input 
                type="checkbox" 
                class="form-check-input" 
                id="validationFormCheck2" 
                value="checkbox2"
                v-model="medicalProfile.selectedCheckboxes"
                :class="{ 'is-invalid': !isCheckboxValid }" />
            <label class="form-check-label" 
            :class="{ 'text-danger': !isCheckboxValid }" 
            for="validationFormCheck2">Checkbox 2</label>
            </div>

            <div v-if="!isCheckboxValid" class="invalid-feedback d-block">
            Debes seleccionar al menos un checkbox.
            </div>
        </div> -->


        
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
</template>
<style lang="scss" scoped>
.is-invalid {
  border-color: red !important; /* Asegura que el borde rojo se aplique */
}

.invalid-feedback {
  color: red;
}

</style>