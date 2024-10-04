<script>
// import:
export default {
    nome: "RegisterButton",
    data() {
        return {
            isModalOpen: false,
            isVisible: false
        };
    },
    methods: {
        toggleVisibility() {
            this.isVisible = !this.isVisible;
        },
        openModal() {
        this.isModalOpen = true;
        document.body.classList.add('overflow-hidden'); 
        },
        closeModal() {
        this.isModalOpen = false;
        document.body.classList.remove('overflow-hidden'); 
        },
    }
};
</script>

<template>
    <div class="accesso d-flex align-items-start m-2">
      <button class="btn-login" @click="toggleVisibility">
        <i class="fas fa-bars font-s-25"></i>
        <i class="fa-solid fa-user-doctor font-s-25 ms-2"></i>
      </button>
      <div class="visible border border-secondary-subtle bg-light rounded" v-show="isVisible" @mouseleave="isVisible = false">
        <div>
          <a target="_blank" @click="openModal">
            <p class="accedi m-0">registrati</p>
          </a>
        </div>
        <div>
          <a target="_blank" @click="openModal">
            <p class="accedi m-0">Accedi</p>
          </a>
        </div>
    </div>
    <!-- Modal -->
<div v-if="isModalOpen" class="modale" @click.self="closeModal">
  <div class="modal-content">
    <div class="riga">
      <h2>Título del Modal</h2>
      <button class="close-btn" @click="closeModal">&times;</button>
    </div>
    <div class="modal-body">
      <p>Este es el contenido del modal. Aquí puedes añadir más información.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
      <p>Más contenido para demostrar el scroll interno del modal.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
      <p>Más contenido para demostrar el scroll interno del modal.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
      <p>Más contenido para demostrar el scroll interno del modal.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
    </div>
  </div>
</div>
      
    </div>
  </template>

<style lang="scss" scoped>
// import
@use "../assets/scss/partials/variables" as *;

.accesso {

    a {
        color: black
    }

    position: relative;

    .btn-login {
        border: 1px solid white;
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        background-color: transparent;

        // &:hover {
        //     background-color: $primary;
        //     color: white;
        // }

        // &:active {
        //     transform: scale(0.95);
        // }

    }

    .visible {
        position: absolute;
        top: 130%;
        right: 5%;
        font-size: 13px;
        z-index: 20;

        .registrati {
            padding: 20px 90px 20px 20px;
        }

        .accedi {
            padding: 20px 90px 20px 20px;
        }

        div:hover {
            background-color: rgba(0, 217, 166, 0.5);
            cursor: pointer;
        }
    }

    .open-modal-btn {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}



/* il modal */
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

/* Contenuto modal */
.modal-content {
    background-color: white;
    padding: 20px;
    width: 100vw;
    height: 100vh; 
    overflow-y: auto; 
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
}

/* buttone da chiudere */
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

/* cancellare il scroll in body */
.overflow-hidden {
    overflow: hidden;
}

.riga {
    display: flex;
    justify-content: space-between;
    align-items: baseline
}
}
</style>

