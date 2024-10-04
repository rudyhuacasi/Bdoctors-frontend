<script>
   // import:
   import HeaderComponent from './shared/HeaderComponent.vue';
   import FooterComponent from './shared/FooterComponent.vue';

   export default {
      nome: 'App',
      components: {
         HeaderComponent,
         FooterComponent,
      }
   }
</script>
<template>

   <header>
      <!-- header -->
      <HeaderComponent/>
   </header>

   <main>
      <!--? CONTENT -->
      <router-view></router-view>
   </main>

   <!-- footer -->
   <footer>
      <FooterComponent/>
   </footer>
   
</template>
<style lang="scss">
body{
   overflow-x: hidden;
   header{
      height: 155px;
   }
}
</style>