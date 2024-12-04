<script>
import axios from 'axios';

    export default{
        name: 'ModalMessagi',
        props: {
        medicalProfileId: {
            type: Number,
            required: true,  
        },
    },
        data() {
            return{
                 isFirstModal: true,
                message:{
                    email_sender: "",
                    content: "",
                    medical_profile_id: this.medicalProfileId
                },
                valutazione:{
                    full_name: "",
                    email: "",
                    comment: "",
                    valuation: "",
                    medical_profile_id: this.medicalProfileId
                },
                starSelected: null,
                starError: false,
            };
        },
        methods:{
            // validazione d bootstrap 
            async handleSubmit(event) {
                const form = event.target;
                if (form.checkValidity() === false || (this.isFirstModal === false)) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.starError = !this.starSelected;
                }
                form.classList.add('was-validated');

                if (this.isFirstModal) {
                    await this.storeApiMessage();
                } else {
                    await this.storeApiValutazione();
                }
            },
            // funzione per le stelle 
            selectStar(value) {
                this.starSelected = value;
                this.starError = false;
            },

            // funzione per la chiamata api messagio
            async storeApiMessage() {
                const data = {
                    email_sender: this.message.email_sender,
                    content: this.message.content,
                    medical_profile_id: this.medicalProfileId,
                }
                try{
                    const response = await axios.post(`/api/message/${this.medicalProfileId}`, data);
                    console.log('Messaggio:', response.data);
                    this.resetMessaggio();
                    this.closeModal('#staticBackdrop');

                }catch(error) {
                    console.error('Errore alla chiamata dell Api:', error);
                }
            },

            // funzione per la chiamata api recensione
            async storeApiValutazione() {
                const data = {
                    full_name: this.valutazione.full_name,
                    email: this.valutazione.email,
                    comment: this.valutazione.comment,
                    valuation: this.starSelected,
                    medical_profile_id: this.medicalProfileId,
                }
                try{
                    const response = await axios.post(`/api/review/${this.medicalProfileId}`, data);
                    console.log('Messaggio:', response.data);
                    this.resetValutazione();
                    this.closeModal('#valutazione');

                }catch(error) {
                    console.error('Errore alla chiamata dell Api:', error);
                }
            },

            // cancella tutta la informazione inviata (messagio)
            resetMessaggio() {
                this.message.email_sender = '';
                this.message.content = '';
                this.message.medical_profile_id = this.medicalProfileId; 
            },

            // cancella tutta la informazione inviata (recensione)
            resetValutazione() {
                this.valutazione.full_name = '';
                this.valutazione.email = '';
                this.valutazione.comment = '';
                this.starSelected = null;
                this.valutazione.medical_profile_id = this.medicalProfileId;
            },

            // funzione per chiudere il modal 
            closeModal(modalId) {
                const modalElement = document.querySelector(modalId);

                if (!modalElement) {
                    console.error(`El modal con ID ${modalId} no existe.`);
                    return;
                }

                const modalInstance = bootstrap.Modal.getInstance(modalElement);

                if (modalInstance) {
                    modalInstance.hide();
                }

                const form = modalElement.querySelector('form');
                if (form) {
                    form.classList.remove('was-validated');
                }

                modalElement.addEventListener(
                    'hidden.bs.modal',
                    () => {
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';

                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) {
                            backdrop.remove();
                        }

                        if (modalId === '#staticBackdrop') {
                            this.resetMessaggio();
                        } else if (modalId === '#valutazione') {
                            this.resetValutazione();
                        }
                    },
                    { once: true }
                );
            },
            // funzione serve per reaprire el modal se voglio inviare el form
            reopenModal(modalId) {
                const modalElement = document.querySelector(modalId);

                if (!modalElement) {
                    console.error(`El modal con ID ${modalId} no existe.`);
                    return;
                }

                let modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.dispose(); 
                }

                modalInstance = new bootstrap.Modal(modalElement, { keyboard: true });
                modalInstance.show();

                modalElement.addEventListener(
                    'shown.bs.modal',
                    () => {
                        document.body.style.overflow = 'hidden';
                        document.body.style.paddingRight = '15px';
                    },
                    { once: true }
                );
            },
            // modal messagio
            openFirstModal() {
                this.closeModal('#staticBackdrop');
                    setTimeout(() => {
                        this.resetMessaggio();
                        this.isFirstModal = true;
                        this.reopenModal('#staticBackdrop');
                    }, 300);
            },
            // modal valutazione
            openSecondModal() {
                this.closeModal('#valutazione');
                    setTimeout(() => {
                        this.resetValutazione();
                        this.isFirstModal = false;
                        this.reopenModal('#valutazione');
                    }, 300);
            },
        }
    }
</script>
<template>

<button type="button" class="messagio" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="openFirstModal">
    Invia un messaggio
</button>

<!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-3 charm" id="staticBackdropLabel">Messaggio</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3 needs-validation text-start " novalidate @submit.prevent="handleSubmit">
                    <div class="col-12">
                        <label for="validationCustomUsername" class="form-label">Email</label>
                        <div class="input-group has-validation">
                        <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" v-model="message.email_sender" required>
                        <div class="invalid-feedback">
                            L'email è obbligatorio 
                        </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="validationTextarea" class="form-label">Messagio</label>
                        <textarea class="form-control" id="validationTextarea" placeholder="Required example textarea" rows="6" v-model="message.content" required></textarea>
                        <div class="invalid-feedback">
                            Il messaggio è obbligatorio 
                        </div>
                    </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiuso</button>
                        <button class="btn btn-primary" type="submit">Invio</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<button type="button" class="valutazione" data-bs-toggle="modal" data-bs-target="#valutazione" @click="openSecondModal">
    Invia una valutazione
</button>

<!-- Modal -->
<div class="modal fade" id="valutazione" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-3 charm" id="staticBackdropLabel">Valutazione</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3 needs-validation text-start" novalidate @submit.prevent="handleSubmit">
                    
                    <div class="col-12">
                        <label for="validationCustom01" class="form-label">Nome e cognome</label>
                        <input type="text" class="form-control" id="validationCustom01" v-model="valutazione.full_name" required>
                        <div class="invalid-feedback">
                            Il nome e cognome è obbligatorio
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="validationCustomUsername" class="form-label">Email</label>
                        <div class="input-group has-validation">
                        <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" v-model="valutazione.email" required>
                        <div class="invalid-feedback">
                            L'email è obbligatorio
                        </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="validationTextarea" class="form-label">Recensione</label>
                        <textarea class="form-control" id="validationTextarea" rows="6" v-model="valutazione.comment" required></textarea>
                        <div class="invalid-feedback">
                            La recensione è obbligatorio
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="rating">
                            <input type="radio" id="star-1" name="star-radio" value="star-1" @click="selectStar(5)">
                            <label for="star-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                            </label>
                            <input type="radio" id="star-2" name="star-radio" value="star-1" @click="selectStar(4)">
                            <label for="star-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                            </label>
                            <input type="radio" id="star-3" name="star-radio" value="star-1" @click="selectStar(3)">
                            <label for="star-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                            </label>
                            <input type="radio" id="star-4" name="star-radio" value="star-1" @click="selectStar(2)">
                            <label for="star-4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                            </label>
                            <input type="radio" id="star-5" name="star-radio" value="star-1" @click="selectStar(1)">
                            <label for="star-5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                            </label>
                        </div>
                        <div v-if="starError" class="text-danger">
                            Seleziona almeno una stella.
                        </div>
                    </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiuso</button>
                        <button class="btn btn-primary" type="submit">Invio</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
</template>
<style lang="scss" scoped>
.rating {
  display: flex;
  flex-direction: row-reverse;
  gap: 0.3rem;
  justify-content: flex-end;
}

.rating input {
  appearance: unset;
}

.rating label {
  cursor: pointer;
}

.rating svg {
  width: 2rem;
  height: 2rem;
  overflow: visible;
  fill: transparent;
  stroke: #666;
  stroke-linejoin: bevel;
  stroke-dasharray: 12;
  animation: idle 4s linear infinite;
  transition: stroke 0.2s, fill 0.5s;
}

@keyframes idle {
  from {
    stroke-dashoffset: 24;
  }
}

.rating label:hover svg {
  stroke: #ffc73a;
}

.rating input:checked ~ label svg {
  transition: 0s;
  animation: idle 4s linear infinite, yippee 0.75s backwards;
  fill: #ffc73a;
  stroke: #ffc73a;
  stroke-opacity: 0;
  stroke-dasharray: 0;
  stroke-linejoin: miter;
  stroke-width: 8px;
}

@keyframes yippee {
  0% {
    transform: scale(1);
    fill: #ffc73a;
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: #666;
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30% {
    transform: scale(0);
    fill: #ffc73a;
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: #666;
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30.1% {
    stroke: #ffc73a;
    stroke-dasharray: 0;
    stroke-linejoin: miter;
    stroke-width: 8px;
  }

  60% {
    transform: scale(1.2);
    fill: #ffc73a;
  }
}

.messagio {
  position: relative;
  display: inline-block;
  padding: .5rem;
  text-align: center;
  font-size: 18px;
  letter-spacing: 1px;
  text-decoration: none;
  color: #1ba2bd;
  background: transparent;
  cursor: pointer;
  transition: ease-out 0.5s;
  border: 2px solid #1ba2bd;
  border-radius: 10px;
  box-shadow: inset 0 0 0 0 #1ba2bd;
}

.messagio:hover {
  color: white;
  box-shadow: inset 0 -100px 0 0 #1ba2bd;
}

.messagio:active {
  transform: scale(0.9);
}


.valutazione {
    padding: .5rem;
    background-color: transparent;
    border-radius: .3em;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    transition: .5s;
    font-weight: 400;
    font-size: 17px;
    border: 1px solid;
    font-family: inherit;
    color: #00A97F;
    z-index: 1;
}

.valutazione::before, .valutazione::after {
    content: '';
    display: block;
    width: 50px;
    height: 50px;
    transform: translate(-50%, -50%);
    position: absolute;
    border-radius: 50%;
    z-index: -1;
    background-color: #00A97F;
    transition: 1s ease;
}

.valutazione::before {
    top: -1em;
    left: -1em;
}

.valutazione::after {
    left: calc(100% + 1em);
    top: calc(100% + 1em);
}

.valutazione:hover::before, .valutazione:hover::after {
    height: 410px;
    width: 410px;
}

.valutazione:hover {
    color: white;
}

// .valutazione:active {
//     filter: brightness(.8);
// }

.charm{
    font-family: "Charm";
    font-weight: 700;
    font-style: normal;
}
</style>