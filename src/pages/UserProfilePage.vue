<script>
import axios from 'axios';

export default {
    name: 'UserProfilePage',
    data() {
        return {
            medico: null,  // Solo un objeto para almacenar el perfil médico
        };
    },
    created() {
        this.fetchMedicalProfiles();  // Llamar al método cuando se cree el componente
    },
    methods: {
        async fetchMedicalProfiles() {
            try { 
                // Obtenemos el slug y el user_id de los parámetros de la ruta
                const slug = this.$route.params.slug;
                const userId = this.$route.params.user_id;

                // Generamos la URL de la solicitud
                const url = `/api/user-profiles/${slug}/${userId}`;

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
                // Verificamos la respuesta
                if (response.data && response.data.status === 'success') {
                    this.medico = response.data.results;  // Asignamos los datos del médico
                    const baseUrl = "http://localhost:8000/storage/";

                    // Ajustamos las URLs de las imágenes y archivos si es necesario
                    if (this.medico.photograph) {
                        this.medico.photograph = baseUrl + this.medico.photograph;
                    }
                    if (this.medico.cv) {
                        this.medico.cv = baseUrl + this.medico.cv;
                    }
                } else {
console.log('Respuesta de la API:', response.data);                }
            } catch (error) {
                console.error('Error al hacer la solicitud a la API:', error);
            }
        },
    }
};
</script>

<template>
    <div class="container">
        <div v-if="medico">
            <h1>{{ medico.slug}}</h1>
            <img :src="medico.photograph" alt="Foto de perfil de {{ medico.slug }}" />

            <h2>Detalles del Médico</h2>
            <p><strong>Teléfono:</strong> {{ medico.phone }}</p>
            <p><strong>Dirección:</strong> {{ medico.address }}</p>
            <p><strong>CV:</strong> <a :href="medico.cv" target="_blank">Descargar CV</a></p>

            <h3>Especializaciones Médicas</h3>
            <ul>
                <li v-for="specialization in medico.medicalspecializations" :key="specialization.id">
                    {{ specialization.name }}
                </li>
            </ul>

            <h3>Mensajes</h3>
            <ul>
                <li v-for="message in medico.messages" :key="message.id">
                    <strong>De:</strong> {{ message.email_sender }} <br>
                    <strong>Contenido:</strong> {{ message.content }} <br>
                    <strong>Fecha:</strong> {{ message.data_sent }}
                </li>
            </ul>

            <h3>Reseñas</h3>
            <ul>
                <li v-if="medico.reviews.length === 0">No hay reseñas disponibles.</li>
                <li v-for="review in medico.reviews" :key="review.id">
                    <strong>{{ review.full_name }} ({{ review.email }})</strong> - Valoración: {{ review.valuation }}/5
                    <p>{{ review.comment }}</p>
                </li>
            </ul>

            <h3>Estadísticas</h3>
            <ul>
                <li v-if="medico.statistics.length === 0">No hay estadísticas disponibles.</li>
                <li v-for="stat in medico.statistics" :key="stat.id">
                    <!-- Asumiendo que tienes campos en las estadísticas -->
                    <strong>{{ stat.name }}:</strong> {{ stat.value }}
                </li>
            </ul>
        </div>
        <div v-else>
            <p>Cargando datos del perfil...</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    margin-top: 20px;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    margin-bottom: 20px;
}

h2, h3 {
    margin-top: 2rem;
    font-size: 1.5rem;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 1rem;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
