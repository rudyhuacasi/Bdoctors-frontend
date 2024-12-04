<script >
import axios from 'axios';

export default {
    nome: "CardServizi",
    data() {
        return {
            medicalProfiles: [],
            currentPage: 1,
            response: null
        };
    },
    created() {
        this.fetchMedicalProfiles();
    },
    updated() {
        this.observeCards();
    },
    methods: {
        //Converte una stringa "slug" in un formato leggibile, con le iniziali di ogni parola maiuscole.
        formatSlug(slug) {
        return slug
            .split('-')                   
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  
            .join(' ');                    
        },
        //  Recupera i profili medici da un'API tramite una richiesta HTTP
        async fetchMedicalProfiles() {
        try {
            const response = await axios.get("/api/medical", {
                params: {
                    page: this.currentPage,
                },
            });
            
            const baseUrl = "http://localhost:8000/storage/";
            if (response.data.results) {
                 this.medicalProfiles = response.data.results.data.map(profile => {
                profile.photograph = profile.photograph.startsWith('http')
                    ? profile.photograph
                    : baseUrl + profile.photograph;
                return profile;
            });
            this.response = response.data.results;
            } else {
                console.error('Errore al recuperare i perfili');
            }
        } catch (error) {
            console.error('Errore a fare la chiamata api:', error);
        }
        },
        // Aggiunge un'animazione ai "card" quando diventano visibili nello schermo.
        observeCards() {
            const cards = this.$el.querySelectorAll('.card:not(.scale-up-left)');
            
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scale-up-left');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            cards.forEach(card => {
                observer.observe(card);
            });
        },
        //Mostra i profili della pagina successiva e scorre verso l'alto.
        showNextCard() {
            if (this.response && this.response.next_page_url) {
                this.currentPage++;
                this.fetchMedicalProfiles();
                this.scrollToTop();
            }
        },
        //   Mostra i profili della pagina precedente e scorre verso l'alto.
        showPreviousCard() {
            if (this.response && this.response.prev_page_url && this.currentPage > 1) {
                this.currentPage--;
                this.fetchMedicalProfiles();
                this.scrollToTop();
            }
        },
        // Fa scorrere la finestra verso l'alto, posizionandola in corrispondenza del contenitore
        scrollToTop() {
            const container = this.$el.querySelector('.row');
            if (container) {
                const containerPosition = container.offsetTop;
                window.scrollTo({
                    top: containerPosition,
                    behavior: 'smooth'
                });
            }
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="my-5">
            <div class="row row-gap-5">
                <div class="col-4" v-for="profile in medicalProfiles" :key="profile.id">
                    <div class="card c-modifiche">
                        <div class="position-relative">
                            <img :src="profile.photograph" class="rounded-3 busta-img" alt="...">
                            <div class="icon">
                                <router-link :to="{ name: `medico`, params: {slug: profile.slug, id: profile.id } }" class="iconBox">
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
.card {
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.5s ease-out;
}

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
