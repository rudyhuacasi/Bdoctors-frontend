<script>
import axios from 'axios';
import dropin from 'braintree-web-drop-in';

export default {
    name: 'SponsorshipModal',
    data() {
        return {
            packages: [],
            selectedPackage: null,
            clientToken: null,
            dropinInstance: null,
        };
    },
    mounted() {
        this.fetchSponsorships();
        this.getClientToken();
    },
    methods: {
        async fetchSponsorships() {
            try {
                const response = await axios.get('/api/sponsorships');
                if (response.data.status === 'success') {
                    this.packages = response.data.results; 
                } else {
                    console.error("Error al obtener los datos de patrocinio:", response);
                }
            } catch (error) {
                console.error("Error en la solicitud de patrocinio:", error);
            }
        },
        async getClientToken() {
            try {
                const response = await axios.get('/api/generate-token');
                this.clientToken = response.data.clientToken;
                this.initializeBraintreeDropIn();
            } catch (error) {
                console.error("Error al obtener el token de cliente:", error);
            }
        },
        initializeBraintreeDropIn() {
            if (!this.clientToken) {
                console.error("El token de cliente no está disponible");
                return;
            }

            dropin.create({
                authorization: this.clientToken,
                container: '#bt-dropin'
            }, (err, instance) => {
                if (err) {
                    console.error("Error al inicializar Braintree Drop-in:", err);
                    return;
                }
                this.dropinInstance = instance;
            });
        },
        async makePayment() {
            if (!this.selectedPackage) {
                alert("Por favor selecciona un paquete.");
                return;
            }

            try {
            // Obtener el nonce de método de pago
            const { nonce } = await this.dropinInstance.requestPaymentMethod();

            // Asegúrate de reemplazar `yourMedicalProfileId` con el ID real que quieres enviar
            const medicalProfileId = this.$route.params.id ; // Asumiendo `1` como un valor por defecto, pero reemplázalo según tu lógica

            // Enviar la solicitud a la API
            const response = await axios.post('/api/process-payment', {
                package_id: this.selectedPackage.id,
                payment_method_nonce: nonce,
                medical_profile_id: medicalProfileId, 
            });

            if (response.status === 200) {
                alert("Pago realizado con éxito");
            } else {
                alert("Error en el pago");
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            alert("Error en el pago. Inténtalo de nuevo.");
        }
        },
        selectPackage(pkg) {
            this.selectedPackage = pkg;
        }
    }
};
</script>

<template>
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Sponsorship
    </button>

    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="ag-format-container">
                        <div class="row ag-courses_box row-gap-3">
                            <div v-for="pkg in packages" :key="pkg.id" :class="['sponsor', 'col-4', { selected: selectedPackage && selectedPackage.id === pkg.id }]" @click="selectPackage(pkg)">
                                <a href="#" class="ag-courses-item_link rounded-4">
                                    <div class="ag-courses-item_bg"></div>
                                    <div class="ag-courses-item_title">
                                        {{ pkg.package }}
                                    </div>
                                    <div class="ag-courses-item_date-box">
                                        Prezzo:
                                        <span class="ag-courses-item_date">
                                            ${{ pkg.price }}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div id="bt-dropin"></div> <!-- Contenedor para Drop-in de Braintree -->
                        <button type="button" class="btn btn-primary" @click="makePayment">Realizar Pago</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>  
  body {
    background-color: #000;
  }
  .ag-courses_box {
    display: flex;
    -webkit-box-align: start;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 50px 0;
  }
  .ag-courses_item {
    -ms-flex-preferred-size: calc(33.33333% - 30px);
    flex-basis: calc(33.33333% - 30px);
  
    margin: 0 15px 30px;
  
    overflow: hidden;
  
    border-radius: 28px;
  }
  .ag-courses-item_link {
    display: block;
    padding: 30px 20px;
    background-color: #121212;
  
    overflow: hidden;
  
    position: relative;
  }
  .ag-courses-item_link:hover,
  .ag-courses-item_link:hover .ag-courses-item_date {
    text-decoration: none;
    color: #FFF;
  }
  .ag-courses-item_link:hover .ag-courses-item_bg {
    -webkit-transform: scale(10);
    -ms-transform: scale(10);
    transform: scale(10);
  }
  .ag-courses-item_title {
    min-height: 87px;
    margin: 0 0 25px;
  
    overflow: hidden;
  
    font-weight: bold;
    font-size: 30px;
    color: #FFF;
  
    z-index: 2;
    position: relative;
  }
  .ag-courses-item_date-box {
    font-size: 18px;
    color: #FFF;
  
    z-index: 2;
    position: relative;
  }
  .ag-courses-item_date {
    font-weight: bold;
    color: #f9b234;
  
    -webkit-transition: color .5s ease;
    -o-transition: color .5s ease;
    transition: color .5s ease
  }
  .ag-courses-item_bg {
    height: 40%;
    width: 30%;
    background-color: #f9b234;
  
    z-index: 1;
    position: absolute;
    top: -20%;
    left: -17%;
  
    border-radius: 50%;
    transition: all 1.5s ease;
  }
  .sponsor:nth-child(2n) .ag-courses-item_bg {
    background-color: #3ecd5e;
  }
  .sponsor:nth-child(3n) .ag-courses-item_bg {
    background-color: #e44002;
  }

#card-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    margin: auto;
}

.hosted-field {
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
    font-size: 16px;
    background-color: #f8f8f8;
}

input.hosted-field::placeholder {
    color: #888;
}
  
  @media only screen and (max-width: 979px) {
    .ag-courses_item {
      -ms-flex-preferred-size: calc(50% - 30px);
      flex-basis: calc(50% - 30px);
    }
    .ag-courses-item_title {
      font-size: 24px;
    }
  }
  
  @media only screen and (max-width: 767px) {
    .ag-format-container {
      width: 96%;
    }
  
  }
  @media only screen and (max-width: 639px) {
    .ag-courses_item {
      -ms-flex-preferred-size: 100%;
      flex-basis: 100%;
    }
    .ag-courses-item_title {
      min-height: 72px;
      line-height: 1;
  
      font-size: 24px;
    }
    .ag-courses-item_link {
      padding: 22px 40px;
    }
    .ag-courses-item_date-box {
      font-size: 16px;
    }
  }
</style>