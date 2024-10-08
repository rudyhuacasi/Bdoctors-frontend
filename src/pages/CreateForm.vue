<script>
    export default{
        name: 'CreateForm',
        data(){
            return{
                firstName: '',
                lastName: '',
                username: '',
                city: '',
                state: '',
                zip: '',
                agreed: false
            }
        },
        methods: {
            checkForm(event) {
            // Referenciar el formulario
            const form = event.target;

            // Si el formulario es válido, envía los datos
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }

            // Añadir la clase `was-validated` para activar los estilos de validación de Bootstrap
            form.classList.add('was-validated');
            }
        }
    }
</script>
<template>
    <div class="container">
        <h1><em>Inserisci i tuoi dati</em></h1>
        <form class="row g-3 needs-validation" novalidate @submit.prevent="checkForm">
        <div class="col-12">
            <label for="validationCustom01" class="form-label">Nome</label>
            <input type="text" class="form-control" id="validationCustom01" required>
            <div class="invalid-feedback">
                Il nome è obbligatorio
            </div>
        </div>
        <div class="col-12">
            <label for="validationCustom02" class="form-label">Cognome</label>
            <input type="text" class="form-control" id="validationCustom02" required>
            <div class="invalid-feedback">
                Il cognome è obbligatorio
            </div>
        </div>
        <div class="col-12">
            <label for="validationCustom02" class="form-label">Indirizzo</label>
            <input type="text" class="form-control" id="validationCustom02" required>
            <div class="invalid-feedback">
                Il indirizzo è obbligatorio
            </div>
        </div>
        <div class="col-12">
            <label for="validationCustom02" class="form-label">Telefono</label>
            <input type="tel" class="form-control" id="validationCustom02" pattern="[0-9]{10}" required>
            <div class="invalid-feedback">
                Il numero telefonico è obbligatorio con 10 digiti
            </div>
        </div>
        <div class="col-12">
            <label for="validationCustomUsername" class="form-label">Username</label>
            <div class="input-group has-validation">
            <span class="input-group-text" id="inputGroupPrepend">@</span>
            <input type="text" class="form-control" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required>
            <div class="invalid-feedback">
                Please choose a username.
            </div>
            </div>
        </div>
        <div class="col-12">
            <label for="validationCustom03" class="form-label">City</label>
            <input type="text" class="form-control" id="validationCustom03" required>
            <div class="invalid-feedback">
            Please provide a valid city.
            </div>
        </div>
        <div class="col-12">
            <label for="validationCustom04" class="form-label">State</label>
            <select class="form-select" id="validationCustom04" required>
            <option selected disabled value="">Choose...</option>
            <option>...</option>
            </select>
            <div class="invalid-feedback">
            Please select a valid state.
            </div>
        </div>
        <div class="col-12">
            <label for="validationCustom05" class="form-label">Zip</label>
            <input type="text" class="form-control" id="validationCustom05" required>
            <div class="invalid-feedback">
            Please provide a valid zip.
            </div>
        </div>
        <div class="col-12 mb-3">
            <label for="cv" class="form-label">Curriculum vitae</label>
            <input 
            id="cv"
            type="file" 
            class="form-control" 
            aria-label="file example" 
            accept=".pdf, .doc, .docx, .xlsx, .txt" 
            required>
            <div class="invalid-feedback">Example invalid form file feedback</div>
        </div>

        <div class="col-12 mb-3">
            <label for="immagini" class="form-label">Fotografia</label>
            <input 
            id="immagini"
            type="file" 
            class="form-control" 
            aria-label="file example" 
            accept="image/*" 
            required>
            <div class="invalid-feedback">Example invalid form file feedback</div>
        </div>
        
        <div class="col-12">
            <button class="btn btn-primary" type="submit">Submit form</button>
        </div>
        </form>
    </div>
</template>
<style lang="scss" scoped>
</style>