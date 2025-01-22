<script>
    export default{
        name: 'CloseLoginPage',
        data() {
            return{
            };
        },
        created(){
    
        },
        updated(){

        },
        methods:{

        }
    }
</script>
<template>
    
    <div class="container mt-5 p-5">
        <div class="alert alert-primary d-flex align-items-center" role="alert">
            <i class="fas fa-triangle-exclamation pe-2"></i>
        <div>
            La tua sezione è scaduta—<router-link :to="{ name: `home` }" class="alert-link">Clicca per tornare a home</router-link>.
        </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
</style>