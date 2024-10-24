<template>
    <div class="body">

  <div class="cards-container">
    <!-- Fondo dinámico -->
    <div class="background-image" 
        :class="{
            'zoom-in': animating && direction === 'previous',  // Efecto de zoom-in al ir atrás
            'zoom-out': animating && direction === 'next'      // Efecto de zoom-out al avanzar
        }"
        :style="{ backgroundImage: 'url(' + currentCard.image + ')' }">
    </div>


    <!-- Wrapper para las tarjetas -->
    <div class="cards-wrapper">
      <div
        v-for="(card, index) in data"
        :key="index"
        class="card"
        :class="{
          'zoom-out': animating && direction === 'next' && index === 0,
'zoom-in': animating && direction === 'previous' && index === data.length - 1 || index === 0 && !animating,        }"
        @transitionend="handleTransitionEnd"
      >
        <img :src="card.image" :alt="card.title">
        <div class="card-content">
          <h1>{{ card.title }}<br>{{ card.title2 }}</h1>
          <p>{{ card.description }}</p>
        </div>
      </div>
    </div>

    <!-- Controles -->
    <div class="pagination">
      <div class="arrow arrow-left" @click="showPreviousCard">
        <!-- Icono de flecha izquierda -->
         i
      </div>
      <div class="arrow arrow-right" @click="showNextCard">
        <!-- Icono de flecha derecha -->
         d
      </div>
    </div>
  </div>

    <CardServizi />
  </div>
</template>

<script>
import CardServizi from '../components/CardServizi.vue';

// import

export default {
  data() {
    return {
      data: [
        {
          place: 'Switzerland Alps',
          title: 'SAINT',
          title2: 'ANTONIEN',
          description: 'Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike.',
          image: 'https://assets.codepen.io/3685267/timed-cards-1.jpg'
        },
        {
          place: 'Japan Alps',
          title: 'NANGANO',
          title2: 'PREFECTURE',
          description: 'Tucked away in the Japan Alps, Nagano offers breathtaking views and serene landscapes.',
          image: 'https://assets.codepen.io/3685267/timed-cards-2.jpg'
        },
        {
          place: 'Sahara Desert - Morocco',
          title: 'MARRAKECH',
          title2: 'MEROUGA',
          description: 'Experience the stunning beauty of the Sahara Desert in Morocco, a land of sand dunes and starry nights.',
          image: 'https://assets.codepen.io/3685267/timed-cards-3.jpg'
        },
        {
          place: 'Sierra Nevada - USA',
          title: 'YOSEMITE',
          title2: 'NATIONAL PARK',
          description: 'Yosemite National Park in the Sierra Nevada mountains is renowned for its giant, ancient sequoias, and Tunnel View.',
          image: 'https://assets.codepen.io/3685267/timed-cards-4.jpg'
        }
      ],
      animating: false,
      direction: 'next', // Para saber la dirección de la animación
      currentCard: {} // Tarjeta actual para la imagen de fondo
    };
  },
    components: {
      CardServizi,
    },
  mounted() {
    // Inicializar con la primera tarjeta
    this.currentCard = this.data[0];
  },
  methods: {
    updateCards(direction) {
      if (this.animating) return; // Evitar múltiples clics durante la animación
      this.animating = true;
      this.direction = direction;

      // Animar el cambio de tarjetas
      setTimeout(() => {
        if (direction === 'next') {
          // Mover la primera tarjeta al final
          this.data.push(this.data.shift());
        } else {
          // Mover la última tarjeta al principio
          this.data.unshift(this.data.pop());
        }

        // Actualizar la tarjeta actual para el fondo
        this.currentCard = this.data[0];

        // Finalizar la animación
        
    }, 800); // Duración de la animación
    },
    showNextCard() {
      this.updateCards('next');
    },
    showPreviousCard() {
      this.updateCards('previous');
    },
    handleTransitionEnd() {
      // Se llama cuando la transición CSS ha terminado
      this.animating = false;
    }
  }
};
</script>

<style scoped>
.cards-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  transition: transform 1s ease, opacity 1s ease;
  opacity: 1;
}

.cards-wrapper {
  position: absolute;
  bottom: 10%;
  left: 75%;
  display: flex;
  gap: 20px;
  z-index: 10;
  transform: translateX(-50%);
}

.card {
  width: 250px;
  height: 400px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, opacity 1s ease;
  position: relative;
  opacity: 1;
  transform: scale(0.8);
  border: 0;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 15px;
  background-color: #000000bb;
  color: white;
  flex-grow: 1;
  position: absolute;
  bottom: 0;
  height: 35%;
}

.card-content h1 {
  font-size: 18px;
  font-family: 'Oswald', sans-serif;
  margin: 0;
}

.card-content p {
  margin-top: 10px;
  font-size: 12px;
  color: #ffffffbb;
}

.zoom-in {
  transform: scale(0.7);
  transition: transform 0.8s ease;
}

.zoom-out {
  transform: scale(0.4);
  transition: transform 0.8s ease;
}

.arrow {
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ffffff55;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  z-index: 200;
}

.arrow svg {
  width: 24px;
  height: 24px;
  stroke-width: 2;
  color: #ffffff99;
}

.pagination{
    position: absolute;
    bottom: 10%;
    left: 20%;
}

.body{
  width: 100%;
  height: 100%;
  --s: 37px; /* control the size */

  --c: #0000, #282828 0.5deg 119.5deg, #0000 120deg;
  --g1: conic-gradient(from 60deg at 56.25% calc(425% / 6), var(--c));
  --g2: conic-gradient(from 180deg at 43.75% calc(425% / 6), var(--c));
  --g3: conic-gradient(from -60deg at 50% calc(175% / 12), var(--c));
  background: var(--g1), var(--g1) var(--s) calc(1.73 * var(--s)), var(--g2),
    var(--g2) var(--s) calc(1.73 * var(--s)), var(--g3) var(--s) 0,
    var(--g3) 0 calc(1.73 * var(--s)) #1e1e1e;
  background-size: calc(2 * var(--s)) calc(3.46 * var(--s));
}
</style>