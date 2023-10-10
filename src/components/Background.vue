<template>
    <div class="background-img">
    </div>

    <div class="conteiner">
        <slot name="page-content"></slot>
    </div>
</template>

<style scoped>
.background-img {
    position: fixed;
    width: 100%;
    height: 109%;
    z-index: -1;
    background-image: url('../assets/PDV.svg');
    background-size: cover;
    background-repeat: none;
    background-position: center;

}

/* Estilo para a classe logotipo-conteiner */
.conteiner {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}
</style>