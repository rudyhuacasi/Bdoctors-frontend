<template>
    <div class="container">
        <h1><em>Inserisci i tuoi dati</em></h1>
        <form class="row g-3 needs-validation" novalidate @submit.prevent="handleSubmit">
            <div class="col-12">
                <label for="validationCustom02" class="form-label">Telefono</label>
                <input type="tel" class="form-control" id="validationCustom02" pattern="[0-9]{10}" v-model="medicalProfile.phone" required>
                <div class="invalid-feedback">
                    Il numero telefonico è obbligatorio con 10 digitos
                </div>
            </div>

            <div class="col-12">
                <label for="validationCustom03" class="form-label">Indirizzo</label>
                <input type="text" class="form-control" id="validationCustom03" v-model="medicalProfile.address" required>
                <div class="invalid-feedback">
                    Please provide a valid city.
                </div>
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
    name: 'CreateForm',
    data() {
        return {
            medicalProfile: {
                address: '',
                phone: '',
            },
        };
    },
    methods: {
        async handleSubmit(event) {
            const form = event.target;

            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');

            await this.submitForm();
        },
        async submitForm() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
    console.error('Token no encontrado');
    this.message = 'No se pudo encontrar el token de autenticación.';
    return;
}else{
    console.log(token);
}

                // const formData = new FormData();
                // formData.append('phone', this.medicalProfile.phone);
                // formData.append('address', this.medicalProfile.address);

                const response = await axios.post('/api/medical', this.medicalProfile, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                });

                if (response.data.status === 'success') {
                    this.message = 'Perfil médico creado exitosamente.';
                    this.resetForm();
                } else {
                    this.message = 'Error al crear el perfil médico.';
                }
            } catch (error) {
                console.error('Error al enviar el formulario:', error.response);
                this.message = 'Ocurrió un error al crear el perfil.';
            }
        },
        resetForm() {
            this.medicalProfile = {
                phone: '',
                address: ''
            };
        },
    },
};
</script>

<style lang="scss" scoped>
.is-invalid {
    border-color: red !important; /* Asegura que el borde rojo se aplique */
}

.invalid-feedback {
    color: red;
}
</style>
