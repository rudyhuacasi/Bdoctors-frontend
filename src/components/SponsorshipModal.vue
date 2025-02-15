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
            errorMessage: ''
        };
    },
    mounted() {
        this.fetchSponsorships();
        this.getClientToken();
    },
    methods: {
        // funzione per sponsorships
        async fetchSponsorships() {
            try {
                const response = await axios.get('/api/sponsorships');
                if (response.data.status === 'success') {
                    this.packages = response.data.results; 
                } else {
                    console.error("Errore al vedere sponsorships:", response);
                }
            } catch (error) {
                console.error("Errore in fare la chiamata api:", error);
            }
        },
        // funzione per generare un token di pagamento
        async getClientToken() {
            try {
                const response = await axios.get('/api/generate-token');
                this.clientToken = response.data.clientToken;
                this.initializeBraintreeDropIn();
                
            } catch (error) {
                console.error("Il token di cliente non è disponibile:", error);
            }
        },
        // funzione per generare un input per form di pagamento
        initializeBraintreeDropIn() {
            if (!this.clientToken) {
                console.error("Il token di cliente non è disponibile");
                return;
            }

            dropin.create({
                authorization: this.clientToken,
                container: '#bt-dropin'
            }, (err, instance) => {
                if (err) {
                    console.error("Errore al'iniziare baintree drop in:", err);
                    return;
                }
                this.dropinInstance = instance;
            });
        },
        //funzione por il pagamento con la carta
        async makePayment() {
            if (!this.selectedPackage) {
                this.errorMessage = "Seleziona un pacchetto prima di effettuare il pagamento.";
                return;
            }

            this.errorMessage = '';

            try {
            const { nonce } = await this.dropinInstance.requestPaymentMethod();

            const medicalProfileId = this.$route.params.id ;

            const response = await axios.post('/api/process-payment', {
                package_id: this.selectedPackage.id,
                payment_method_nonce: nonce,
                medical_profile_id: medicalProfileId, 
            });
            console.log(window.bootstrap);
                if (response.status === 200) {
                    location.reload();
                } else {
                    alert("C'è un errore nel pagamento");
                }
            } catch (error) {
                console.error("C'è un problema con il pagamento:", error);
            }
        },
        // funzione per sceglire un pacchetto di sponsor
        selectPackage(pkg) {
            this.selectedPackage = pkg;
            this.errorMessage = '';
        }
    }
};
</script>

<template>
    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        <i class="fs-5 fa-solid fa-money-check-dollar"></i>
    </button>

    <div class="modal fade" id="staticBackdrop" ref="paymentModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-2 charm" id="staticBackdropLabel">Sponsorizzazioni</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="ag-format-container">
                        <div class="row ag-courses_box row-gap-3">
                            <div 
                            v-for="(pkg, index) in packages" 
                            :key="pkg.id" 
                            :class="['sponsor', 'col-md-12', 'col-lg-4',{ selected: selectedPackage && selectedPackage.id === pkg.id }]" 
                            @click="selectPackage(pkg, index)">
                                <div
                                class="ag-courses-item_link rounded-4 border border-secondary" 
                                :class="{ 'active-1': index === 0 && selectedPackage && selectedPackage.id === pkg.id,
                                            'active-2': index === 1 && selectedPackage && selectedPackage.id === pkg.id,
                                            'active-3': index === 2 && selectedPackage && selectedPackage.id === pkg.id }">
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="container">
                        <div class="text-danger text-center my-3" v-if="errorMessage">
                            <div class="alert alert-danger d-flex align-items-center" role="alert">
                                <div>
                                    {{ errorMessage }}
                                </div>
                            </div>
                        </div>
                        <div id="bt-dropin" class="text-start"></div> 
                        <button type="button" class="btn btn-primary" @click="makePayment">Pagamento</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>  
body {
    background-color: #000;
}

.charm{
    font-family: "Charm";
    font-weight: 700;
    font-style: normal;
}

.ag-courses_box {
    padding: 50px 0;
}

.ag-courses-item_link {
    padding: 30px 20px;
    overflow: hidden;
    position: relative;
    transition: background-color 0.3s ease, border 0.3s ease;
}

.ag-courses-item_link:hover{
    text-decoration: none;
    color: #FFF;
}
.sponsor:nth-child(3) .ag-courses-item_link:hover{
    color: black;
}

.ag-courses-item_link:hover .ag-courses-item_bg {
    -webkit-transform: scale(10);
    -ms-transform: scale(10);
    transform: scale(10);
}

.ag-courses-item_title {
    min-height: 87px;
    margin: 0 0 25px;
    font-weight: bold;
    font-size: 30px;
    z-index: 2;
    position: relative;
}

.ag-courses-item_date-box {
    font-size: 18px;
    z-index: 2;
    position: relative;
}

.ag-courses-item_date {
    font-weight: bold;
    transition: color .5s ease;
}

.ag-courses-item_bg {
    height: 40%;
    width: 30%;
    background-color: #CD7F32;
    position: absolute;
    top: -20%;
    left: -17%;
    border-radius: 50%;
    transition: all 1.5s ease;
}

.sponsor:nth-child(2) .ag-courses-item_bg {
    background-color: #FFD700;
    color: #fff;
    border: 2px solid #FFD700;
}

.sponsor:nth-child(3) .ag-courses-item_bg {
    background-color: #E5E4E2;
    color: #000;
    border: 2px solid #E5E4E2;
}

.ag-courses-item_link.active-1 {
    background-color: #CD7F32;
    color: #fff;
    border: 2px solid #CD7F32;
}

.ag-courses-item_link.active-2 {
    background-color: #FFD700;
    color: #fff;
    border: 2px solid #FFD700;
}

.ag-courses-item_link.active-3 {
    background-color: #E5E4E2;
    color: #000;
    border: 2px solid #E5E4E2;
}

</style>