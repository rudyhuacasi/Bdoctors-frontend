<script>
import Registerloginform from "./Registerloginform.vue";
import axios from 'axios'; 

export default {
  name: "RegisterButton",
  data() {
      return {
          isModalOpen: false,
          isVisible: false,
          isAuthenticated: !!localStorage.getItem('token'), // Controlla se l'utente è autenticato al caricamento
      };
  },
  components: {
      Registerloginform,
  },
  methods: {
      toggleVisibility() {
          this.isVisible = !this.isVisible;
      },
      openModal() {
          this.isModalOpen = true;
          document.body.classList.add("overflow-hidden");
      },
      closeModal() {
          this.isModalOpen = false;
          document.body.classList.remove("overflow-hidden");
      },
      async login(loginData) {
        try {
          const response = await axios.post('/api/login', loginData);
          console.log('Login exitoso:', response.data);
          
          // Guardare il token e aggiornare lo stato di autenticazione
          localStorage.setItem('token', response.data.token);
          this.isAuthenticated = true; // L'utente ora è autenticato
          
          // chiudere modal
          this.closeModal(); 
          
          window.location.reload(); // Ricaricare la pagina dopo un breve ritardo
        } catch (error) {
          console.error('Error en el login:', error.response.data);
        }
      },
      logout() {
        // pulire il token e chiudere las sessione
        localStorage.removeItem('token');
        this.isAuthenticated = false; // L'utente non è autenticato
        window.location.reload();
      }
  },
};
</script>
<template>
    <div class="accesso d-flex align-items-start m-2">
        <button v-if="!isAuthenticated" class="btn-login" @click="toggleVisibility">
            <i class="fas fa-bars font-s-25"></i>
            <i class="fa-solid fa-user-doctor font-s-25 ms-2"></i>
        </button>

        <button v-else class="btn-logout" @click="logout">
            <i class="fas fa-sign-out-alt font-s-25"></i> Logout
        </button>

        <div
            class="visible border border-secondary-subtle bg-light rounded"
            v-show="isVisible && !isAuthenticated"  
            @mouseleave="isVisible = false"
        >
            <div v-if="!isAuthenticated">
                <a target="_blank" @click="openModal">
                    <p class="accedi m-0">Accedere</p>
                </a>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="isModalOpen" class="modale" @click.self="closeModal">
            <div class="modal-content">
                <div class="riga">
                    <h2>Login o Registro</h2>
                    <button class="close-btn" @click="closeModal">&times;</button>
                </div>
                <div class="modal-body">
                    <Registerloginform
                        @login="login"     
                        @register="register" 
                        @closeModal="closeModal" 
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.accesso {
    a {
        color: black;
    }

    position: relative;

    .btn-login {
        border: 1px solid white;
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        background-color: transparent;
    }

    .visible {
        position: absolute;
        top: 130%;
        right: 5%;
        font-size: 13px;
        z-index: 20;

        div:hover {
            background-color: rgba(0, 217, 166, 0.5);
            cursor: pointer;
        }
    }

    /* Modal */
    .modale {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        width: 100vw;
        height: 100vh;
        overflow-y: auto;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .close-btn {
        color: gray;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 30px;
        background: transparent;
    }

    .close-btn:hover {
        color: #000;
    }

    .overflow-hidden {
        overflow: hidden;
    }

    .riga {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }
}
</style>
