<script setup lang="ts">
import { NInputNumber, NForm, NDivider, NButton } from 'naive-ui';
import { ref } from 'vue';
import Card from '../components/Card.vue'

const paradigmas = ref<{ valor: number }[]>([]);
const valor = 0;
let valor_da_multiplicacao = 0.30;
const requerentInput = ref<number>(0);
const metaProdutividade = ref<string>('');
const selectedButton = ref<string>('ordinario'); // Inicialmente, definimos como 'ordinario'


function adicionarParadigma() {
    paradigmas.value.push({ valor });
    console.log(paradigmas.value)
    console.log(requerentInput)
}

function removerParadigma() {
    paradigmas.value.pop();
    console.log(paradigmas.value)
}

function calcularMediaSimplesParadigmas() {
    if (paradigmas.value.length === 0) {
        return 0;
    }

    let soma = 0;
    for (const paradigma of paradigmas.value) {
        soma += paradigma.valor;
    }

    return (soma / paradigmas.value.length);
}

function produtividade30porcentoParadigma() {
    let resultado = calcularMediaSimplesParadigmas();
    return (resultado + (resultado * valor_da_multiplicacao)).toFixed(0)
}

function produtividade30porcentoRequente() {
    let resultado = requerentInput.value;
    return (resultado + (resultado * valor_da_multiplicacao)).toFixed(0)
}


function produtivadadeMeta() {
    let r = parseFloat(produtividade30porcentoRequente());
    let p = parseFloat(produtividade30porcentoParadigma());
    console.log(r);
    console.log(p);

    if (r > p) {
        metaProdutividade.value = "Sua meta de produtividade é: " + r;
    } else {
        metaProdutividade.value = "Sua meta de produtividade é: " + p;
    }
}

var cor_ordinario = ".";
var cor_especial = ".";

function escolhaDoPedido(escolha: boolean) {
    if (escolha) {
        valor_da_multiplicacao = 0.30;
        selectedButton.value = 'ordinario';
        cor_ordinario = "blue"
        cor_especial = ""
    } else {
        valor_da_multiplicacao = 0;
        selectedButton.value = 'especial';
        cor_ordinario = "."
        cor_especial = "blue"
    }
}
var text = []

function texts(escolha: boolean) {
    if (escolha) {
        text = [" +30%:", "Média de produtivadade dos Paradigmas + 30% "]
    } else {
        text = []
    }
}
</script>

<template>
    <Card>
        <template #form-content>
            <n-form class="calc-form">
                <div class="btn-ordinario-especial">
                    <n-button class="btn-choice" id="ordinario" @click="escolhaDoPedido(true)"
                        :class="{ 'selected-button': selectedButton === 'ordinario' }">Teletrabalho
                        Ordinário</n-button>
                    <n-button class="btn-choice" id="especial" @click="escolhaDoPedido(false)"
                        :class="{ 'selected-button': selectedButton === 'especial' }">Teletrabalho
                        Especial</n-button>
                </div>
                <div>
                    <n-divider class="title-form" title-placement="center">
                        REQUERENTE
                    </n-divider>
                    <label class="calc-form-requerente">Média de Produtividade do Requerente:</label>
                    <n-input-number v-model:value="requerentInput" @onUpdate:value="requerentInput = $event"
                        class="input-calc-form" label="Média de Produtividade do Requerente" :show-button="false"
                        placeholder="Digite" />
                </div>
                <div class="result-30-requerent">
                    Média de Produtividade: {{ produtividade30porcentoRequente() }}
                </div>

                <n-divider class="title-form" title-placement="center" color="blue">
                    PARADIGMAS
                </n-divider>
                <div class="conteiner-requerente">
                    <div class="calc-col">
                        <div>
                            <div v-for="(paradigma, index) in paradigmas" :key="index">
                                <label class="calc-form-paradigma">Média de Produtividade do Paradigma {{ index + 1
                                }}:</label>
                                <n-input-number v-model:value="paradigma.valor" @onUpdate:value="paradigma.valor = $event"
                                    class="input-calc-form" label="Média de Produtividade do Paradigma" :show-button="false"
                                    placeholder="Digite" />
                            </div>
                        </div>
                        <div class="btn-paradigma">
                            <n-button class="btn-add" @click="adicionarParadigma">Adicionar paradigma</n-button>
                            <n-button class="btn-remove" @click="removerParadigma">Remover paradigma</n-button>
                        </div>
                    </div>

                    <div class="resultado-media-col">
                        Média de produtivadade dos Paradigmas: {{ produtividade30porcentoParadigma() }}
                    </div>
                </div>
            </n-form>
            <div class="btn-calc-form">
                <n-button @click="produtivadadeMeta">Calcular Meta de Produtividade</n-button>
            </div>

            <div class="meta-produtividade" @onUpdate:value="metaProdutividade = $event">
                {{ metaProdutividade }}
            </div>
        </template>
    </Card>
</template>
<style scoped>
.title-form {
    font-size: 20px;
}

.btn-ordinario-especial {
    align-items: center;
    display: flex;
    justify-content: center;
}

.btn-choice {
    margin: 3px;
    font-size: 15px;
}

.calc-form-requerente {
    font-weight: bold;
}

.conteiner-requerente {
    display: flex;
}

.calc-form-paradigma {
    font-weight: bold;
}

.calc-form {
    justify-content: center;
    align-items: center;
}

.calc-col {
    width: 45%;
}

.resultado-media-col {
    margin-left: 10%;
    font-weight: bold;
}

.input-calc-form {
    width: 50%;
    justify-content: center;
    align-items: center;
}

.btn-paradigma {
    margin-top: 5px;
}

.btn-remove {
    margin-left: 5px;
}

.btn-calc-form {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.result-30-requerent {
    margin-top: 5px;
    font-weight: bold;
}

.meta-produtividade {
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 20px;
    font-weight: bold;
}
</style>