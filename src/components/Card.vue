<script setup lang="ts">
import { NInputNumber, NForm, NDivider, NButton } from 'naive-ui';
</script>

<template>
    <section class="background">
        <div class="conteiner">
            <div class="card">
                <slot name="form-content"></slot>
            </div>
        </div>
    </section>
</template>

<style scoped>
.conteiner {
    display: flex;
    align-items: center;
    justify-content: center;
}

.card {
    border: 5px solid rgb(0, 0, 55);
    margin: 150px 50px 50px 50px;
    width: 50%;
    height: 800px;
    border-radius: 5px;
    padding: 25px;
    border-radius: 25px;
    height: 100%;
    background-color: white;
}
</style>