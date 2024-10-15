<script >
export default {
    nome: "CardServizi",
    data() {
        return {
            
        };
    },
    methods: {
    }
};

</script>

<template>
    <div class="container my-5">
        <div class="row row-gap-5">
            <div class="col-4">
                <div class="card c-modifiche">
                    <img src="https://assets.codepen.io/3685267/timed-cards-1.jpg" class="rounded-3" alt="...">
                    <div class="card-body">
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                    <div class="icon">
                            <a href="#" class="iconBox">
                                ve
                            </a>
                        </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card c-modifiche">
                    <img src="https://assets.codepen.io/3685267/timed-cards-1.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card c-modifiche">
                    <img src="https://assets.codepen.io/3685267/timed-cards-1.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card c-modifiche">
                    <img src="https://assets.codepen.io/3685267/timed-cards-1.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card c-modifiche">
                    <img src="https://assets.codepen.io/3685267/timed-cards-1.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
            <div class="col-4">
                <div class="card c-modifiche">
                    <img src="https://assets.codepen.io/3685267/timed-cards-1.jpg" class="card-img-top" alt="...">
                    <div class="card-body">
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
.c-modifiche{
    border: 0;
    img{
        position: relative
    }
}
.icon {
    position: absolute;
    bottom: 25%;
    right: 0;
    width: 6rem;
    height: 6rem;
    background:white;
    border-top-left-radius: 50%;
}
.iconBox {
    position: absolute;
    inset: 0.7rem;
    background: #282828;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;
}

.iconBox:hover {
    transform: scale(1.2);
}
</style>
