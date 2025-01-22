let idleTimeout;

export default {
  install(Vue, options = {}) {
    const { idleTime = 30 * 60 * 1000, onTimeout = () => {} } = options;

    // Resetear el temporizador de inactividad
    const resetTimer = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        onTimeout();
      }, idleTime);
    };

    // Detectar eventos de interacción (movimiento del mouse o teclas presionadas)
    Vue.mixin({
      mounted() {
        resetTimer();
        window.addEventListener("mousemove", resetTimer);
        window.addEventListener("keypress", resetTimer);
      },
      beforeDestroy() {
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keypress", resetTimer);
        clearTimeout(idleTimeout);
      }
    });
  }
};
