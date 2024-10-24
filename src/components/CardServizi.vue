<script >
import axios from 'axios';

export default {
    nome: "CardServizi",
    data() {
        return {
            medicalProfiles: [], // Aquí se almacenarán los perfiles médicos
            currentPage: 1,
            response: null
        };
    },
    created() {
        this.fetchMedicalProfiles();
    },
    updated() {
        // Llama a la función que activa el IntersectionObserver cuando el DOM se actualiza
        this.observeCards();
    },
    methods: {
        formatSlug(slug) {
        return slug
            .split('-')                   
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  
            .join(' ');                    
        },
        // Función para obtener los perfiles médicos desde el servidor
        async fetchMedicalProfiles() {
        try {
            // Pasa los params en el segundo argumento del método axios.get
            const response = await axios.get("/api/medical", {
                params: {
                    page: this.currentPage,
                },
            });
            
            if (response.data.results) {
                // Guarda los datos de los perfiles médicos
                this.medicalProfiles = response.data.results.data;
                this.response = response.data.results;
                console.log('Resultados de la respuesta:', this.response);
            } else {
                console.error('Error al recuperar los perfiles médicos');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud a la API:', error);
        }
    },

        observeCards() {
            // Selecciona todas las tarjetas que todavía no tienen la animación
            const cards = this.$el.querySelectorAll('.card:not(.scale-up-left)');
            
            // Crea un IntersectionObserver para detectar cuando las tarjetas entran en el viewport
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Añade la clase que activa la animación
                        entry.target.classList.add('scale-up-left');
                        observer.unobserve(entry.target);  // Deja de observar una vez que la animación se ha aplicado
                    }
                });
            }, { threshold: 0.5 });
            // Observa cada tarjeta
            cards.forEach(card => {
                observer.observe(card);
            });
        },
        showNextCard() {
            if (this.response && this.response.next_page_url) {
                this.currentPage++;
                this.fetchMedicalProfiles();  // Solicita la nueva página
                this.scrollToTop();
            }
        },
        // Muestra la página anterior
        showPreviousCard() {
            if (this.response && this.response.prev_page_url && this.currentPage > 1) {
                this.currentPage--;
                this.fetchMedicalProfiles();  // Solicita la nueva página
                this.scrollToTop();
            }
        },
        scrollToTop() {
            const container = this.$el.querySelector('.row');  // Selecciona el contenedor de las cartas
            if (container) {
                const containerPosition = container.offsetTop; // Posición del contenedor
                window.scrollTo({
                    top: containerPosition,  // Desplaza hasta el contenedor
                    behavior: 'smooth'       // Animación suave
                });
            }
        }
}
}
</script>

<template>
    <div class="container my-5">
        <div class="row row-gap-5">
            <div class="col-4" v-for="profile in medicalProfiles" :key="profile.id">
                <div class="card c-modifiche">
                    <div class="position-relative">
                        <img :src="profile.photograph" class="rounded-3 busta-img" alt="...">
                        <div class="icon">
                            <router-link :to="{ name: `medico`, params: {slug: profile.slug} }" class="iconBox">
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
        <div class="d-flex justify-content-between py-4">
          <!-- indietro-->
          <button  @click="showPreviousCard" v-if="response && response.prev_page_url">
            <i class="fas fa-arrow-left indietro"></i>
            <p class="previous">Indietro</p>
          </button>
          <!-- avanti -->
          <button  @click="showNextCard" v-if="response && response.next_page_url">
              <p>Avanti</p>
              <i class="fas fa-arrow-right avanti"></i>
          </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
/* Estado inicial de las tarjetas */
.card {
    opacity: 0;
    transform: scale(0.5); /* Escala inicial pequeña */
    transition: opacity 0.5s ease-out;
}

/* Clase para activar la animación cuando la tarjeta es visible */
.scale-up-left {
    opacity: 1;
    animation: scale-up-left 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) forwards;
}

@keyframes scale-up-left {
    0% {
        transform: scale(0.5);
        transform-origin: 0% 50%;
    }
    100% {
        transform: scale(1);
        transform-origin: 0% 50%;
    }
}
/* button di paginazione */
button {
  background-color: #fff;
  border: 1px solid #25D366;
  padding: 5px;
  position: relative;
  width: 6.2em;
  height: 2em;
  transition: 0.5s;
  font-size: 17px;
  border-radius: 0.4em;
}

button p {
  position: absolute;
  top: 0.4em;
  left: 1.15em;
  margin: 0;
  padding: 0;
  transition: .5s;
  color: #25D366;
}

button .avanti {
  position: absolute;
  bottom: 0.17em;
  right: 0.5em;
  margin: 0;
  padding: 0;
  opacity: 0;
  transition: 0.5s;
  height: 1em;
  fill: #fff;
  color: white;

}

button:hover p {
  left: 0.5em;
  color: #fff
}

button:hover .avanti {
  opacity: 1;
}

button:hover {
  background-color: #25D366;
}

button .previous {
  position: absolute;
  top: 0.4em;
  left: 1.15em;
  margin: 0;
  padding: 0;
  transition: .5s;
  color: #25D366;
}

button:hover .previous {
  left: 2em;
  color: #fff
}

button .indietro {
  position: absolute;
  bottom: 0.17em;
  left: 0.5em;
  margin: 0;
  padding: 0;
  opacity: 0;
  transition: 0.5s;
  height: 1em;
  fill: #fff;
  color: white;
}

button:hover .indietro {
  opacity: 1;
}


</style>
