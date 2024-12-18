<script>
import axios from 'axios';

export default {
    props: {
        loginError: {
        type: String,
        default: ''
        }
    },
    data() {
        return {
            isActive: false,      
            isLoginActive: true,
            submittedLogin: false,
            submittedRegister: false,
            loginData: {
                username: '',
                password: ''
            },
            registerData: {
                nome: '',
                cognome: '',
                indirizzo: '',
                specializzazione: '',
                email: '',
                password: '',
                password_confirmation: ''
            }
        };
    },
    methods: {
        // Mostra il modulo di registrazione
        showRegister() {
            this.isActive = true;
            this.isLoginActive = false;
        },
        // Mostra il modulo di login
        showLogin() {
            this.isActive = false;
            this.isLoginActive = true;
        },
        // Valida e invia il modulo di login
        validateAndLogin() {
            this.submittedLogin = true;
            const form = document.querySelector('.form-box.login form');
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }
            this.login();
        },
        // Valida e invia il modulo di registrazione
        validateAndRegister() {
            this.submittedRegister = true;
            const errors = [];

            // validazione
            if (!this.registerData.name.trim()) {
                errors.push("Il nome è obbligatorio.");
            }
            if (!this.registerData.last_name.trim()) {
                errors.push("Il cognome è obbligatorio.");
            }
            if (!this.registerData.address.trim()) {
                errors.push("L'indirizzo è obbligatorio.");
            }
            if (!this.registerData.specialization.trim()) {
                errors.push("La specializzazione è obbligatoria.");
            }
            if (!this.registerData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerData.email)) {
                errors.push("L'indirizzo email non è valido.");
            }
            if (!this.registerData.password.trim() || this.registerData.password.length < 8) {
                errors.push("La password deve contenere almeno 8 caratteri.");
            }
            if (this.registerData.password !== this.registerData.password_confirmation) {
                errors.push("Le password non corrispondono.");
            }


            // Mostrar errores si existen
            if (errors.length > 0) {
                console.log(errors.join("\n"));
                return;
            }

            // Si pasa la validación, se registra
            this.register();
        },

        // Registra un nuovo utente
        async register() {
        try {
            const response = await axios.post("/api/register", this.registerData);
            console.log("Registro exitoso:", response.data);
            // pulire tutti i dati di register
            this.registerData = {
                nome: '',
                cognome: '',
                indirizzo: '',
                specializzazione: '',
                email: '',
                password: '',
                password_confirmation: ''
            };
            // dopo va login
            this.showLogin();
            } catch (error) {
                console.error("Errore in registro:", error.response.data);
            }
        },
        // Effettua il login dell'utente
        async login() {
            try {
                this.$emit("login", this.loginData);
            } catch (error) {
                console.error("Errore in login:", error.response.data);
            }
        }
    }
};
</script>

<template>
    <div class="container wrapper" :class="{ 'active': isActive }">
            <span class="rotate-bg"></span>
            <span class="rotate-bg2"></span>

            <!--  Login -->
            <div class="form-box login" :class="{ 'mani': isLoginActive }" v-if="isLoginActive">
                <h1 class="title animation merienda">Login</h1>
                <form class="needs-validation" novalidate @submit.prevent="validateAndLogin">

                    <div class="input-box animation">
                        <input type="text" v-model="loginData.email" :class="{ 'is-invalid': !loginData.email && submittedLogin }" required>
                        <label for="" :class="{ 'rosso': !loginData.email && submittedLogin }">Username</label>
                        <i class="fas fa-user-doctor ps-3 fs-4"></i>
                    </div>

                    <div class="input-box animation">
                        <input type="password" v-model="loginData.password" :class="{ 'is-invalid': !loginData.password && submittedLogin }" required>
                        <label for="" :class="{ 'rosso': !loginData.password && submittedLogin }">Password</label>
                        <i class="fa-solid fa-lock ps-3 fs-4"></i>
                    </div>
                    <div v-if="loginError" class="alert alert-danger d-flex align-items-center" role="alert">
                        <div>
                            {{ loginError }}
                        </div>
                    </div>
                    <button type="submit" class="b-lo-register">Login</button>
                    
                    <div class="linkTxt animation">
                        <p>Non hai un account? 
                            <a href="#" @click.prevent="showRegister">Registrati</a>
                        </p>
                    </div>
                </form>
            </div>

            
            <!-- Registro -->
            <div class="form-box register" :class="{ 'd-none': isLoginActive, 'mani': !isLoginActive }" v-else>
                <h2 class="title animation merienda">Sign Up</h2>

                <form class="needs-validation" novalidate @submit.prevent="validateAndRegister">
                    <div class="input-box animation" >
                        <input type="text" v-model="registerData.name" :class="{ 'is-invalid': submittedRegister && !registerData.name }" required>
                        <label for="" :class="{ 'rosso': submittedRegister && !registerData.name }">Nome</label>
                        <i class="fa-solid fa-user ps-3 fs-4"></i>
                    </div>

                    <div class="input-box animation">
                        <input type="text" v-model="registerData.last_name" :class="{ 'is-invalid': submittedRegister && !registerData.last_name }" required>
                        <label for="" :class="{ 'rosso': submittedRegister && !registerData.last_name }">Cognome</label>
                        <i class="fa-solid fa-user ps-3 fs-4"></i>
                    </div>

                    <div class="input-box animation">
                        <input type="text" v-model="registerData.address" :class="{ 'is-invalid': submittedRegister && !registerData.address }" required>
                        <label for="" :class="{ 'rosso': submittedRegister && !registerData.address }">Indirizzo</label>
                        <i class="fa-solid fa-location-dot ps-3 fs-4"></i>
                    </div>

                    <div class="input-box animation">
                        <input type="text" v-model="registerData.specialization" :class="{ 'is-invalid': submittedRegister && !registerData.specialization }"  required>
                        <label for="" :class="{ 'rosso': submittedRegister && !registerData.specialization }">Specializzazione</label>
                        <i class="fa-solid fa-stethoscope ps-3 fs-4"></i>
                    </div>

                    <div class="input-box animation">
                        <input type="email" v-model="registerData.email" :class="{ 'is-invalid': submittedRegister && !registerData.email }" required>
                        <label for="" :class="{ 'rosso': submittedRegister && !registerData.email }">Email</label>
                        <i class="fa-solid fa-envelope ps-3 fs-4"></i>
                    </div>

                    <!-- password -->
                    <div class="input-box animation">
                        <input type="password" v-model="registerData.password" :class="{ 'is-invalid': submittedRegister && !registerData.password }" required>
                        <label for="" :class="{ 'rosso': submittedRegister && !registerData.password }">Password</label>
                        <i class="fa-solid fa-lock ps-3 fs-4"></i>
                    </div>

                     <!-- Confirm password -->
                    <div class="input-box animation">
                        <input type="password" v-model="registerData.password_confirmation" :class="{ 'is-invalid': submittedRegister && !registerData.password_confirmation }" required>
                        <label for="" :class="{ 'rosso': submittedRegister && !registerData.password_confirmation }">Confirm Password</label>
                        <i class="fa-solid fa-lock ps-3 fs-4"></i>
                    </div>

                    <button type="submit" class="b-lo-register">Sign Up</button>

                    <div class="linkTxt animation">
                        <p>Hai già un account? 
                            <a href="#" @click.prevent="showLogin">Accedi</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
</template>

<style lang="scss" scoped>
@use "../assets/scss/partials/_variables" as *;

.input-box input.is-invalid {
    border-bottom: 2px solid #dc3545;
    box-shadow: none;
}

.rosso{
    color: #dc3545;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.wrapper {
    position: relative;
    height: 700px;
    background: #fff;
    border: 2px solid #000;
    border-radius: 10px;
    box-shadow: 0 0 20px #000;
    overflow: hidden;
}

.wrapper .form-box {
    position: absolute;
    top: 1%;
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.wrapper .form-box.login {
    left: 0;
    padding: 0 60px 0 40px;
}

.form-box h2 {
    margin-bottom: 10px;
    position: relative;
    font-size: 32px;
    color: #000;
    text-align: center;
}

.form-box h2::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: #000;
}

.form-box .input-box {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 25px 0;
}

.input-box input {
    width: 90%;
    height: 100%;
    background: transparent;
    color: #000;
    font-size: 16px;
    font-weight: 500;
    border: none;
    outline: none;
    border-bottom: 2px solid #000;
    transition: .5s;
    padding-right: 23px;
}

.input-box input:focus,
.input-box input:valid {
    border-bottom-color: #17a;
}

.input-box label {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 16px;
    pointer-events: none;
    transition: 0.5s;
}

.input-box input:focus~label,
.input-box input:valid~label {
    top: -5px;
    color: #17a;
}

.input-box i {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    font-size: 18px;
    transition: 0.5s;
}

.input-box input:focus~i,
.input-box input:valid~i {
    color: #17a;
}

form button {
    width: 100%;
    outline: none;
    font-weight: 600;
}

form button:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

form .linkTxt {
    font-size: 14px;
    color: #000;
    text-align: center;
    margin: 20px 0 10px;
}

.linkTxt p a {
    color: blue;
    text-decoration: none;
    font-weight: 600;
}

.wrapper .form-box.login .animation {
    transform: translateX(0);
    transition: 0.7s ease;
    opacity: 1;
    filter: blur(0);
    transition-delay: calc(.1s * var(--j));
}

.wrapper.active .form-box.login .animation {
    transform: translateX(-120%);
    opacity: 0;
    filter: blur(10px);
    transition-delay: calc(.1s * var(--i));
}

.wrapper .info-text {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.wrapper .info-text.login {
    right: 0;
    text-align: right;
    padding: 0 40px 60px 150px;
}

.wrapper .info-text h2 {
    font-size: 36px;
    color: #fff;
    line-height: 1.3;
    text-transform: uppercase;
}

.wrapper .info-text p {
    font-size: 16px;
    color: #fff;
}

.wrapper .info-text.login .animation {
    transform: translateX(0);
    opacity: 1;
    filter: blur(0);
    transition: 0.7s ease;
    transition-delay: calc(.1s * var(--j));
}

.wrapper.active .info-text.login .animation {
    transform: translateX(120px);
    opacity: 0;
    filter: blur(10px);
    transition: 0.7s ease;
    transition-delay: calc(.1s * var(--i));
}

.wrapper .rotate-bg {
    position: absolute;
    top: -4px;
    right: 0;
    width: 500vw;
    height: 100%;
    background: #18a99c;
    transform: rotate(30deg) skewY(1deg);
    transform-origin: bottom right;
    transition: 1.5s ease;
    transition-delay: 1.6s;
}

.wrapper.active .rotate-bg {
    transform: rotate(0) skewY(0);
    transition-delay: 0.5s;
}

.wrapper .form-box.register {
    padding: 0 40px 0 60px;
    right: 0;
}

.wrapper.active .form-box.register {
    pointer-events: auto;
}

.wrapper .form-box.register .animation {
    transform: translateX(120%);
    opacity: 0;
    filter: blur(10px);
    transition: .7s ease;
    transition-delay: calc(.1s * var(--j));
}

.wrapper.active .form-box.register .animation {
    transform: translateX(0);
    opacity: 1;
    filter: blur(0);
    transition-delay: calc(.1s * var(--i));
    z-index: 1000;
}

.wrapper .info-text.register {
    left: 0;
    text-align: left;
    padding: 0 150px 60px 40px;
    pointer-events: none;
}

.wrapper.active .info-text.register {
    pointer-events: auto;
}

.wrapper .info-text.register .animation {
    transform: translateX(-120%);
    opacity: 0;
    filter: blur(10px);
    transition: .7s ease;
    transition-delay: calc(.1s * var(--j));
}

.wrapper.active .info-text.register .animation {
    transform: translateX(0);
    opacity: 1;
    filter: blur(0);
    transition-delay: calc(.1s * var(--i));
}

.wrapper .rotate-bg2 {
    position: absolute;
    top: 100%;
    left: 30%;
    width: 200vw;
    height: 220vh;
    background: white;
    transform: rotate(0) skewY(0);
    transform-origin: bottom left;
    transition: 1.5s ease;
    transition-delay: 0.5s;
}

.wrapper.active .rotate-bg2 {
    transform: rotate(-19deg) skewY(-24deg);
    transition-delay: 1.2s;
}

.mani {
    z-index: 1000;
}
.merienda {
  font-family: "Merienda", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  text-align: center;
}

/* From Uiverse.io by Brian-Pob */ 
.b-lo-register {
    position: relative;
    z-index: 1;
    overflow: hidden;
    border: none;
    border-radius: 5px;
    padding: .5rem 2rem;
    font-size: 20px;
    font-family: sans-serif;
    background-color: $primary;
    color: white;
    transition: all .7s ease-in-out;
}

.b-lo-register:hover {
    color: $primary;
}

.b-lo-register::before {
    position: absolute;
    display: inline-block;
    top: 0;
    left: 0;
    z-index: -1;
    border-radius: 5px;
    width: 0;
    height: 100%;
    content: "";
    background-color: white;
    transition: all 700ms ease-in-out;
}

.b-lo-register:hover::before {
    left: unset;
    right: 0;
    width: 100%;
    transform: rotate(180deg);
}

@media (max-width: 1000px){
    .wrapper .form-box{
        width: 100%;
    }
}

/* RESPONSIVE STYLES */
@media (max-width: 768px) {
    
    .wrapper .rotate-bg {
        transform: rotate(52deg) skewY(1deg);
    } 
    
    .wrapper .info-text {
        display: none;
    }
    
    .wrapper .form-box.login .animation {
        transform: translateX(0);
    }
    
    .wrapper.active .form-box.login .animation {
        transform: translateX(-100vw);
    }
    
    .wrapper .form-box.register .animation {
        transform: translateX(100vw);
    }
    
    .wrapper.active .form-box.register .animation {
        transform: translateX(0);
    }
}


@media (max-width: 480px) {

    .wrapper .rotate-bg{
        transform: rotate(52deg) skewY(1deg);
    }
    /* .wrapper .rotate-bg2 {
    } */
    .wrapper.active .rotate-bg2 {
        transform: rotate(-4deg) skewY(-50deg);
    }

    .wrapper .form-box.login .animation {
        transform: translateX(0);
    }

    .wrapper.active .form-box.login .animation {
        transform: translateX(-100vw);
    }

    .wrapper .form-box.register .animation {
        transform: translateX(100vw);
    }

    .wrapper.active .form-box.register .animation {
        transform: translateX(0);
    }
}
</style>
