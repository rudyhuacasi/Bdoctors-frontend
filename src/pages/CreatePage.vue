<script>
    export default{
        name: 'CreatePage',
    }
</script>
<template>
    <div class="container">
        <h1><em>Inserisci il medico</em></h1>
        <div class="row row-gap-5">
            <div class="col-4">
                <router-link :to="{name:`createform`}">
                    <div class="card p-5 d-flex align-items-center justify-content-center">
                        +                    
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
</style>