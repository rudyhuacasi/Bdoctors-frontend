<template>
    <div id="app">
        <div class="container wrapper" :class="{ 'active': isActive }">
            <span class="rotate-bg"></span>
            <span class="rotate-bg2"></span>

            <!-- Formulario de Login -->
            <div class="form-box login" :class="{ 'mani': isLoginActive }">
                <h2 class="title animation" style="--i:0; --j:21">Login</h2>
                <form action="#">

                    <div class="input-box animation" style="--i:1; --j:22">
                        <input type="text" required>
                        <label for="">Username</label>
                        <i class='bx bxs-user'></i>
                    </div>

                    <div class="input-box animation" style="--i:2; --j:23">
                        <input type="password" required>
                        <label for="">Password</label>
                        <i class='bx bxs-lock-alt'></i>
                    </div>
                    <button type="submit" class="btn animation" style="--i:3; --j:24">Login</button>
                    
                    <div class="linkTxt animation" style="--i:5; --j:25">
                        <p>Don't have an account? 
                            <a href="#" @click.prevent="showRegister">Sign Up</a>
                        </p>
                    </div>
                </form>
            </div>

            <!-- Texto informativo de Login -->
            <div class="info-text login d-md-none">
                <h2 class="animation" style="--i:0; --j:20">Welcome Back!</h2>
                <p class="animation" style="--i:1; --j:21">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Deleniti,rem?</p>
            </div>

            <!-- Formulario de Registro -->
            <div class="form-box register" :class="{ 'd-none': isLoginActive, 'mani': !isLoginActive }">
                <h2 class="title animation" style="--i:17; --j:0">Sign Up</h2>

                <form action="#">
                    <div class="input-box animation" style="--i:15; --j:1">
                        <input type="text" required>
                        <label for="">Nome</label>
                        <i class='bx bxs-user'></i>
                    </div>

                    <div class="input-box animation" style="--i:16; --j:2">
                        <input type="text" required>
                        <label for="">Cognome</label>
                        <i class='bx bxs-user'></i>
                    </div>

                    <div class="input-box animation" style="--i:17; --j:3">
                        <input type="text" required>
                        <label for="">Indirizzo</label>
                        <i class='bx bxs-user'></i>
                    </div>

                    <div class="input-box animation" style="--i:18; --j:4">
                        <input type="text" required>
                        <label for="">Specializzazione</label>
                        <i class='bx bxs-user'></i>
                    </div>

                    <div class="input-box animation" style="--i:19; --j:5">
                        <input type="email" required>
                        <label for="">Email</label>
                        <i class='bx bxs-envelope'></i>
                    </div>

                    <div class="input-box animation" style="--i:20; --j:6">
                        <input type="password" required>
                        <label for="">Password</label>
                        <i class='bx bxs-lock-alt'></i>
                    </div>

                    <button type="submit" class="btn animation" style="--i:21;--j:4">Sign Up</button>

                    <div class="linkTxt animation" style="--i:22; --j:5">
                        <p>Already have an account? 
                            <a href="#" @click.prevent="showLogin">Login</a>
                        </p>
                    </div>
                </form>
            </div>

            <!-- Texto informativo de Registro -->
            <div class="info-text register d-md-none">
                <h2 class="animation" style="--i:17; --j:0;">Welcome Back!</h2>
                <p class="animation" style="--i:18; --j:1;">Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Deleniti,rem?</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isActive: false,      
            isLoginActive: true   
        };
    },
    methods: {
        // Muestra el formulario de registro
        showRegister() {
            this.isActive = true;
            this.isLoginActive = false;
        },
        // Muestra el formulario de login
        showLogin() {
            this.isActive = false;
            this.isLoginActive = true;
        }    
    }
};
</script>

<style lang="scss" scoped>

:root {
    --white: #fff;
    --black: #000;
    --lightBulue: #17a;
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
    height: 650px;
    background: var(--white);
    border: 2px solid var(--black);
    border-radius: 10px;
    box-shadow: 0 0 20px var(--black);
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
    color: var(--black);
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
    background: var(--black);
}

.form-box .input-box {
    position: relative;
    width: 100%;
    height: 50px;
    margin: 25px 0;
}

.input-box input {
    width: 100%;
    height: 100%;
    background: transparent;
    color: var(--black);
    font-size: 16px;
    font-weight: 500;
    border: none;
    outline: none;
    border-bottom: 2px solid var(--black);
    transition: .5s;
    padding-right: 23px;
}

.input-box input:focus,
.input-box input:valid {
    border-bottom-color: var(--lightBulue);
}

.input-box label {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    font-size: 16px;
    color: var(--black);
    pointer-events: none;
    transition: 0.5s;
}

.input-box input:focus~label,
.input-box input:valid~label {
    top: -5px;
    color: var(--lightBulue);
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
    color: var(--lightBulue);
}

form button {
    width: 100%;
    height: 45px;
    background-color: var(--black);
    color: var(--white);
    border: none;
    outline: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: .3s;
}

form button:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

form .linkTxt {
    font-size: 14px;
    color: var(--black);
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
    color: var(--white);
    line-height: 1.3;
    text-transform: uppercase;
}

.wrapper .info-text p {
    font-size: 16px;
    color: var(--white);
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
    height: 65vh;
    background: #000;
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
    height: 140vh;
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
    
    /* Ajustar animación para pantallas medianas */
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


/* Ajustes para pantallas muy pequeñas (móviles) */
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
