<script setup lang="ts">
import Calc from '../views/calc.vue';
import { NInput, NForm, NDivider, NButton, NSpace, NRadio, NRadioGroup, NFormItem, NSelect, NInputGroup, NInputGroupLabel, NInputNumber } from 'naive-ui';
import { ref, onMounted, watch } from 'vue';
import Card from '../components/Card.vue';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const nome = ref<string>('');
const matricula = ref<string>('');
const cargo = ref<string>('');
const cargoComissao = ref<string>('');
const lotacao = ref<string>('');
const orgao = ref<string>('');

// IDENTIFICAÇÃO DO GESTOR(A) TITULAR DA UNIDADE

const nomeGestor = ref<string>('');
const matriculaGestor = ref<string>('');
const cargoGestor = ref<string>('');
const cargoComissaoGestor = ref<string>('');

// Variáveis para a IDENTIFICAÇÃO DA CHEFIA IMEDIATA
const nomeChefia = ref<string>('');
const matriculaChefia = ref<string>('');
const cargoChefia = ref<string>('');
const cargoComissaoChefia = ref<string>('');

</script>

<template>
<Card>
    <template #form-content>
        
    </template> 
</Card>
</template>

<style scoped>
</style>