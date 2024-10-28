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
            },
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
      return '';
    },
  },
  created() {
    this.fetchMedicalProfiles();
  },
  methods: {
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
                    phone: response.data.results.phone || "", // Asigna un valor vacío si `phone` no está presente
                    address: response.data.results.address || "",
                    cv: response.data.results.cv || null,
                    photograph: response.data.results.photograph || null,
                };
console.log(this.medicalProfile);
            } else {
                console.error("Datos no encontrados en la respuesta de la API");
            }
        },

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
        await this.updateMedicalProfile();
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
        console.log(response.data);
        // Verifica qué se está enviando al servidor
      
    } catch (error) {
        console.error('Error al actualizar el perfil médico:', error);
    }
},

  },
        // watch: {
        //     // Monitorizamos los cambios en los checkboxes para actualizar la validación
        //     'medicalProfile.selectedCheckboxes'(newValue) {
        //     // Si se selecciona al menos un checkbox, la validación es correcta
        //     this.isCheckboxValid = newValue.length > 0;
        //     },
        // },
  
};
</script>
