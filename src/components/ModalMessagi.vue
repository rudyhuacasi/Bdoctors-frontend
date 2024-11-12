<script>
import axios from 'axios';

    export default{
        name: 'ModalMessagi',
        props: {
        medicalProfileId: {
            type: Number,
            required: true,  // Para asegurarte de que se proporciona
        },
    },
        data() {
            return{
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
        created(){
    
        },
        updated(){

        },
        methods:{
            async handleSubmit(event) {
                const form = event.target;
                    if (form.checkValidity() === false ) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    this.starError = !this.starSelected;
                    
                    form.classList.add('was-validated');

                    if (this.isFirstModal) {
                        await this.storeApiMessage()
                    } else {
                        await this.storeApiValutazione()
                    }
            },
            selectStar(value) {
                this.starSelected = value;
                this.starError = false;
            },
            async storeApiMessage() {
                const data = {
                    email_sender: this.message.email_sender,
                    content: this.message.content,
                    medical_profile_id: this.medicalProfileId,
                }
                try{
                    const response = await axios.post(`/api/message/${this.medicalProfileId}`, data);
                    console.log('Messaggio:', response.data);

                }catch(error) {
                    console.error('Error al hacer la solicitud a la API:', error);
                }
            },
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

                }catch(error) {
                    console.error('Error al hacer la solicitud a la API:', error);
                }
            },
            openFirstModal() {
                this.isFirstModal = true;  
            },
            openSecondModal() {
                this.isFirstModal = false;  
            },
        }
    }
</script>
<template>

<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="openFirstModal">
  Launch static backdrop modal
</button>

<!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3 needs-validation" novalidate @submit.prevent="handleSubmit">
                    <div class="col-12">
                        <label for="validationCustomUsername" class="form-label">Username</label>
                        <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" v-model="message.email_sender" required>
                        <div class="invalid-feedback">
                            Please choose a username.
                        </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="validationTextarea" class="form-label">Textarea</label>
                        <textarea class="form-control" id="validationTextarea" placeholder="Required example textarea" rows="6" v-model="message.content" required></textarea>
                        <div class="invalid-feedback">
                        Please enter a message in the textarea.
                        </div>
                    </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button class="btn btn-primary" type="submit">Submit form</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

    <!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#valutazione" @click="openSecondModal">
  Launch static backdrop modal
</button>

<!-- Modal -->
<div class="modal fade" id="valutazione" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3 needs-validation" novalidate @submit.prevent="handleSubmit">
                    
                    <div class="col-12">
                        <label for="validationCustom01" class="form-label">Full name</label>
                        <input type="text" class="form-control" id="validationCustom01" v-model="valutazione.full_name" required>
                        <div class="invalid-feedback">
                        Looks good!
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="validationCustomUsername" class="form-label">Username</label>
                        <div class="input-group has-validation">
                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                        <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" v-model="valutazione.email" required>
                        <div class="invalid-feedback">
                            Please choose a username.
                        </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="validationTextarea" class="form-label">Textarea</label>
                        <textarea class="form-control" id="validationTextarea" placeholder="Required example textarea" rows="6" v-model="valutazione.comment" required></textarea>
                        <div class="invalid-feedback">
                        Please enter a message in the textarea.
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
                            Por favor selecciona al menos una estrella.
                        </div>
                    </div>
                     <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button class="btn btn-primary" type="submit">Submit form</button>
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
  --stroke: #666;
  --fill: #ffc73a;
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
  stroke: var(--stroke);
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
  stroke: var(--fill);
}

.rating input:checked ~ label svg {
  transition: 0s;
  animation: idle 4s linear infinite, yippee 0.75s backwards;
  fill: var(--fill);
  stroke: var(--fill);
  stroke-opacity: 0;
  stroke-dasharray: 0;
  stroke-linejoin: miter;
  stroke-width: 8px;
}

@keyframes yippee {
  0% {
    transform: scale(1);
    fill: var(--fill);
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: var(--stroke);
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30% {
    transform: scale(0);
    fill: var(--fill);
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: var(--stroke);
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }

  30.1% {
    stroke: var(--fill);
    stroke-dasharray: 0;
    stroke-linejoin: miter;
    stroke-width: 8px;
  }

  60% {
    transform: scale(1.2);
    fill: var(--fill);
  }
}

</style>