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
            loginError: '',
        };
    },
    components: {
        Registerloginform,
    },
    methods: {
        // Quando si vuole alternare la visibilità di un componente o un elemento della pagina.
        toggleVisibility() {
            this.isVisible = !this.isVisible;
        },
        // apre il modal
        openModal() {
            this.isModalOpen = true;
            document.body.classList.add("overflow-hidden");
        },
        // chiude il modal
        closeModal() {
            this.isModalOpen = false;
            document.body.classList.remove("overflow-hidden");
        },
        // Quando l'utente tenta di accedere al proprio account tramite credenziali valide.
        async login(loginData) {
            try {
            const response = await axios.post('/api/login', loginData);
            console.log('Login exitoso:', response.data);
            
            localStorage.setItem('token', response.data.token);
            this.isAuthenticated = true;
            
            // chiudere modal
            this.closeModal(); 
            
            window.location.reload();
            } catch (error) {
                this.loginError = error.response.data.message;
                console.error('Error en el login 2:', error.response.data);
            }
        },
        // Quando l'utente decide di uscire dal proprio account o terminare la sessione.
        logout() {
            // pulire il token e chiudere las sessione
            localStorage.removeItem('token');
            this.isAuthenticated = false; // L'utente non è autenticato
            this.$router.push({ name: 'home' });
            window.location.reload();
        }
    },
};
</script>
<template>
    <div class="accesso d-flex align-items-start m-2">
        <button v-if="!isAuthenticated" class="btn-login" @click="toggleVisibility">
            <i class="fas fa-bars font-s-25"></i>
            <i class="fa-solid fa-user-doctor font-s-25 ms-3"></i>
        </button>
        <button v-else class="logout" @click="logout">
            <i class="fas fa-sign-out-alt font-s-25"></i> Logout
        </button>

        <div
            class="visible border border-secondary-subtle bg-light rounded"
            v-show="isVisible && !isAuthenticated"  
            @mouseleave="isVisible = false"
        >
            <div class="py-3 px-4" v-if="!isAuthenticated">
                <a target="_blank" @click="openModal">
                    <p class="accedi m-0">Accedere</p>
                </a>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="isModalOpen" class="modale" @click.self="closeModal">
            <button class="close-btn" @click="closeModal">&times;</button>
            <div class="modal-content">
                <div class="modal-body">
                    <Registerloginform
                        @login="login"     
                        @register="register" 
                        @closeModal="closeModal"
                        :loginError="loginError"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "../assets/scss/partials/_variables" as *;

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
        top: 110%;
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
        border-radius: 5px;
        cursor: pointer;
        font-size: 4rem;
        background: transparent;
        position: absolute;
        right: 3%;
        top: -3%;
        z-index: 1500;
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

.logout {
    padding: .5rem;
    border: 4px solid white;
    position: relative;
    overflow: hidden;
    // background-color: transparent;
    text-align: center;
    text-transform: uppercase;
    font-size: 16px;
    transition: .3s;
    z-index: 1;
    font-family: inherit;
    color: #17C3B2;
}

.logout::before {
    content: '';
    width: 0;
    height: 300%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    background-color: $dettagli;
    transition: .5s ease;
    display: block;
    z-index: -1;
}

.logout:hover::before {
    width: 105%;
}

.logout:hover {
    color: white;
}

</style>
