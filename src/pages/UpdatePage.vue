<template>
  <div class="container">
        <h1><em>Inserisci i tuoi dati</em></h1>
        <form class="row g-3 needs-validation" novalidate @submit.prevent="handleSubmit" enctype="multipart/form-data">
        
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


        
        <div class="col-12">
            <label for="validationCustom03" class="form-label">Indirizzo</label>
            <input type="text" class="form-control" name="address" id="validationCustom03" v-model="medicalProfile.address" required>
            <div class="invalid-feedback">
            Please provide a valid city.
            </div>
        </div>
        
        <div v-if="medicalProfile.cv">
            <p><strong>Archivo actual:</strong> {{ fileName }}</p>
        </div>

    <!-- Input para subir un nuevo archivo -->

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
            <p><strong>Imagen actual:</strong></p>
            <img :src="medicalProfile.photograph" alt="Imagen actual" style="max-width: 200px; max-height: 200px;"/>
        </div>
        
        <div class="col-12">
            <button class="btn btn-primary" type="submit">Submit form</button>
        </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
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

        profileId: this.$route.params.id, // Supongamos que tienes el ID en la ruta
        selectedFile: null,
        selectedPhotograph: null,
    };
  },
  computed: {
    // Computed property para extraer solo el nombre del archivo del CV cargado
    fileName() {
      if (this.medicalProfile.cv) {
        return this.medicalProfile.cv.split('/').pop(); // Extraer el nombre del archivo desde la URL
      }
    },
    
  },
  mounted(){
    this.fetchPerformances();
    this.fetchMedicalProfiles();
  },
  created() {
    this.fetchPerformances();
    this.fetchMedicalProfiles();
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
        async fetchMedicalProfiles() {
            // Obtenemos el slug y el user_id de los parámetros de la ruta
            const slug = this.$route.params.slug;
            const id = this.$route.params.id;

            // Generamos la URL de la solicitud
            const url = `/api/user-profiles/${slug}/${id}`;

            // Obtenemos el token desde localStorage (asegúrate de haberlo guardado antes)
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token de autenticación no disponible');
                return;
            }
            console.log(token);
            // Realizamos la solicitud GET a la API usando el token para la autenticación
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`  // Incluye el token en los encabezados
                }
            });
            if (response.data && response.data.results) {
                this.medicalProfile = {
                    phone: response.data.results.phone, // Asigna un valor vacío si `phone` no está presente
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
    
    handleFileUpload(event, field) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (field === 'photograph') {
            this.selectedPhotograph = reader.result.split(',')[1]; // Almacena solo la parte base64
          } else if (field === 'cv') {
            this.selectedFile = reader.result.split(',')[1]; // Almacena solo la parte base64
          }
        };
        reader.readAsDataURL(file);
    }
  },

    async updateMedicalProfile() {
    const data = {
        phone: this.medicalProfile.phone,
        address: this.medicalProfile.address,
        specialization_id: this.medicalProfile.specialization_id,
        performances: [...this.medicalProfile.selectedCheckboxes],
      };

      // Si el usuario seleccionó un nuevo archivo CV, se ha convertido a base64
      if (this.selectedFile) {
        data.cv = this.selectedFile; // Contendrá la cadena base64 del CV
      }

      // Si el usuario seleccionó una nueva imagen, se ha convertido a base64
      if (this.selectedPhotograph) {
        data.photograph = this.selectedPhotograph; // Contendrá la cadena base64 de la imagen
      }
    try {
        const token = localStorage.getItem('token'); // Asegúrate de tener el token
        const response = await axios.put(`/api/medical/${this.$route.params.id}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
        console.log('Datos a enviar:', data);
        console.log(response.data.results);
        // Verifica qué se está enviando al servidor
      
    } catch (error) {
        console.error('Error al actualizar el perfil médico:', error);
    }
},

  },
    watch: {
        // Monitorizamos los cambios en los checkboxes para actualizar la validación
        'medicalProfile.selectedCheckboxes'(newValue) {
        // Si se selecciona al menos un checkbox, la validación es correcta
        this.isCheckboxValid = newValue.length > 0;
        },
    },
  
};
</script>
