<template>
    <div class="logotipo-conteiner">
        <div class="background-img-container">
            <slot name="page-content"></slot>
        </div>
    </div>
</template>

<style scoped>


.background-img-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 109%;
    z-index: -1;
    background-image: url('../assets/PDV.svg');
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center;
}

/* Estilo para a classe logotipo-conteiner */
.logotipo-conteiner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

</style>