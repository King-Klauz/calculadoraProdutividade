<script setup lang="ts">
</script>

<template>
    <div class="card">
        <slot name="form-content"></slot>
    </div>
</template>

<style>
.card {
    border: 2px solid rgb(27, 0, 147);
    margin: 8% 5% 8% 5%;
    width: 60%;
    height: 100%;
    padding: 50px;
    border-radius: 20px;
    background-color: white;
    min-width: 390px;
}
</style>