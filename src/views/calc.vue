<script setup lang="ts">
import {
    NInput, NForm, NDivider, NButton, NSpace, NRadio, NRadioGroup, NFormItem, NSelect,
    NInputNumber
} from 'naive-ui';
import { ref, watch } from 'vue';
import Card from '../components/Card.vue'
import { PDFDocument, StandardFonts } from 'pdf-lib';
import plano_ordinario from '../assets/docs/plano_de_trabalho_teletrabalho_ordinario_inicial_e_renovacao.pdf'
import plano_especial from '../assets/docs/plano_de_trabalho_teletrabalho_condicoes_especiais.pdf'
import requerimento_ordinário from '../assets/docs/requerimento_teletrabalho_ordinario.pdf'
import requerimento_especial from '../assets/docs/requerimento_teletrabalho_condicoes.pdf'
import { isSlotEmpty } from 'naive-ui/es/_utils';
//import relatorio_trimestral from '../assets/docs/relatorio_trimestral_de_produtividade.pdf'

const paradigmas = ref<{ nome: string, valor: number, matricular: number }[]>([]);
const valor = 0;
let valor_da_multiplicacao = 0.30;
const requerentInput = ref<number>(0);
const metaProdutividade = ref<string>('');
const selectedButton = ref<string>('ordinario'); // Inicialmente, definimos como 'ordinario'


// OPCAO DE PEDIDO ORDINARIO OU ESPECIAL (CARREGAR ARQUIVO DE MODIDIFACÇÃO BASEADO NO VALOR DE *valor_da_multiplicacao*)

const ordinario_especial = ref({
    valor_da_multiplicacao: 0.30,
    caminho_doc: plano_ordinario,
    ordinario_especial: [
        {
            value: 0.30,
            label: 'Ordinário',
            caminho_doc: plano_ordinario    // usar como variável quando for escolher o tipo de teletrabalho
        },
        {
            value: 0,
            label: 'Condições Especiais',
            caminho_doc: plano_especial     // usar como variável quando for escolher o tipo de teletrabalho
        }
    ]
})

// OPCAO DE RENOVAÇAO OU PEDIDO INICIAL

const inicial_renovacao = ref({
    tipo: 'inicial',
    inicial_renovacao: [
        {
            value: 'inicial',
            label: 'Pedido Inicial'
        },
        {
            value: 'renovacao',
            label: 'Renovação'
        }
    ]
});

// IDENTIFICAÇÃO DO(A) SERVIDOR(A): 

const nome = ref<string>('');
const matricula = ref<string>('');

const endereco = ref<string>('');
const cep = ref<string>('');
const email = ref<string>('');
const telefone = ref<string>('');

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

// REGIME DE TELETRABALHO ORDINÁRIO

const opcaoRegime = ref({
    content: '',
    options: [
        {
            label: "Integral",
            value: "integral"
        },
        {
            label: "Parcial",
            value: "parcial"
        }
    ]
})

// DIAS SE FOR REGIME PARCIAL

const diasParcial = ref({
    content: [],
    options: [
        {
            value: 'segunda',
            label: 'Segunda-feira',
            x: 256,
            y: 318
        },
        {
            value: 'terça',
            label: 'Terça-feira',
            x: 286,
            y: 319
        },
        {
            value: 'quarta',
            label: 'Quarta-feira',
            x: 315,
            y: 320
        },
        {
            value: 'quinta',
            label: 'Quinta-feira',
            x: 343,
            y: 320
        },
        {
            value: 'sexta',
            label: 'Sexta-feira',
            x: 371,
            y: 320
        }
    ]
})

// DESCRIÇÃO DAS ATIVIDADES A SEREM DESEMPENHADAS
var textoFormatado = ref('');
const descricao_atividades = ref<string>('')

function adicionarQuebrasDeLinha() {
    let resultado = '';
    for (let i = 0; i < descricao_atividades.value.length; i++) {
        resultado += descricao_atividades.value[i];
        if ((i + 1) % 70 === 0 && i !== 0) {
            resultado += '\n';
        }
    }
    return resultado;
}

watch(descricao_atividades, () => {
    textoFormatado.value = adicionarQuebrasDeLinha();
    console.log(textoFormatado.value);
});


// FORMA DE CONTATO DO(A) SERVIDOR

const reuniao = ref({
    eletronico: '',
    presencial: ''
})

// HORÁRIO EM QUE O(A) SERVIDOR(A) DEVERÁ ESTAR À DISPOSIÇÃO DA UNIDADE DE TRABALHO POR MEIO ELETRÔNICO

const disposicao = ref<string>('')

function adicionarParadigma() {
    paradigmas.value.push({
        valor,
        nome: '',
        matricular: 0
    });

}

function removerParadigma() {
    paradigmas.value.pop();

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
    return (resultado + (resultado * ordinario_especial.value.valor_da_multiplicacao)).toFixed(0)
}

function produtividade30porcentoRequente() {
    let resultado = requerentInput.value;
    return (resultado + (resultado * ordinario_especial.value.valor_da_multiplicacao)).toFixed(0)
}

function produtivadadeMeta() {
    let r = parseFloat(produtividade30porcentoRequente());
    let p = parseFloat(produtividade30porcentoParadigma());

    if (r > p) {
        return r;
    } else {
        return p;
    }
}


let pdfText: string = ''; // Inicializa pdfText como uma string vazia
async function modifyPdf() {

    let url = '';
    if (ordinario_especial.value.valor_da_multiplicacao == 0.30) {
        url = ordinario_especial.value.ordinario_especial[0].caminho_doc; // ordinario 
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];
        const { width, height } = firstPage.getSize();

        // PONTO PRETA PARA ID OS DOCS FEITOS NA C-PRO
        pdfText = '.'
        firstPage.drawText(pdfText, {
            x: 55,
            y: 800,
            size: 55,
            font: helveticaFont
        })

        // INICIAL OU RENOVAÇÃO
        pdfText = 'X'
        if (inicial_renovacao.value.tipo == 'inicial') {
            firstPage.drawText(pdfText, {
                x: 117,
                y: 688,
                size: 20,
                font: helveticaFont
            })
        } else {
            firstPage.drawText(pdfText, {
                x: 342,
                y: 686,
                size: 20,
                font: helveticaFont
            })
        }

        // IDENTIFICAÇÃO DO(A) SERVIDOR(A):
        pdfText = nome.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 643,
            size: 11,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = matricula.value;
        firstPage.drawText(pdfText, {
            x: 427,
            y: 643,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = cargo.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 618,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = cargoComissao.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 593,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = lotacao.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 568,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        // IDENTIFICAÇÃO DO GESTOR(A) 

        pdfText = nomeGestor.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 531,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = matriculaGestor.value;
        firstPage.drawText(pdfText, {
            x: 427,
            y: 531,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = cargoGestor.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 506,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = cargoComissaoGestor.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 481,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        // IDENTIFICAÇÃO DA CHEFIA IMEDIATA
        pdfText = nomeChefia.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 443,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = matriculaChefia.value;
        firstPage.drawText(pdfText, {
            x: 427,
            y: 443,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = cargoChefia.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 418,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        pdfText = cargoComissaoChefia.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 393,
            size: 13,
            font: helveticaFont
            // color: rgb(0.95, 0.1, 0.1),
        })

        // REGIME DE TELETRABALHO ORDINÁRIO

        pdfText = 'X';
        if (opcaoRegime.value.content == 'integral') {
            firstPage.drawText(pdfText, {
                x: 197.8,
                y: 359,
                size: 20,
                font: helveticaFont
            })
        } else if (opcaoRegime.value.content == 'parcial') {
            firstPage.drawText(pdfText, {
                x: 198,
                y: 340,
                size: 20,
                font: helveticaFont
            })

            // PREENCHIMENTO DOS DIAS DA SEMANA

            for (var i = 0; i < diasParcial.value.content.length; i++) {
                for (var j = 0; j < diasParcial.value.options.length; j++) {
                    if (diasParcial.value.content[i] == diasParcial.value.options[j].value) {
                        firstPage.drawText(pdfText, {
                            x: diasParcial.value.options[j].x,
                            y: diasParcial.value.options[j].y,
                            size: 20,
                            font: helveticaFont
                        })
                    }
                }
            }
        }

        // DESCRIÇÃO DAS ATIVIDADES A SEREM DESEMPENHADAS

        pdfText = textoFormatado.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 268,
            size: 11,
            font: helveticaFont
        })

        // PRODUTIVIDADE MENSAL
        // requente

        pdfText = nome.value;
        firstPage.drawText(pdfText, {
            x: 120,
            y: 145,
            size: 11,
            font: helveticaFont
        })

        pdfText = matricula.value;
        firstPage.drawText(pdfText, {
            x: 385,
            y: 145,
            size: 11,
            font: helveticaFont
        })

        pdfText = requerentInput.value.toString();
        firstPage.drawText(pdfText, {
            x: 485,
            y: 145,
            size: 11,
            font: helveticaFont
        })

        // paradigmas

        var auxY = 120;
        var flag = true
        for (i = 0; i < paradigmas.value.length && flag == true; i++) {
            pdfText = paradigmas.value[i].nome
            firstPage.drawText(pdfText, {
                x: 120,
                y: auxY,
                size: 9,
                font: helveticaFont
            })
            pdfText = paradigmas.value[i].matricular.toString()
            firstPage.drawText(pdfText, {
                x: 385,
                y: auxY,
                size: 11,
                font: helveticaFont
            })
            pdfText = paradigmas.value[i].valor.toString()
            firstPage.drawText(pdfText, {
                x: 485,
                y: auxY,
                size: 11,
                font: helveticaFont
            })
            auxY -= 26.5

            if (i > 2) {
                j = i + 1
                let y = 750; // Coordenada Y para a primeira linha
                const newPage = pdfDoc.addPage([width, height]);

                const colWidths = [120, 385, 485]; // Larguras das colunas "Nome", "Matrícula" e "Produtividade"

                // Defina os nomes das colunas
                const columnNames = ["Nome", "Matrícula", "Produtividade"];

                // Desenho do cabeçalho da tabela
                for (let i = 0; i < columnNames.length; i++) {
                    newPage.drawText(columnNames[i], {
                        x: colWidths[i],
                        y,
                        size: 12,
                        font: helveticaFont,
                    });

                }

                //baixar a linha 
                y -= 26.5

                // Desenho dos paradigmas
                for (j; j - paradigmas.value.length != 0; j++) {
                    newPage.drawText("Paradigma " + (j + 1), {
                        x: 50,
                        y: y,
                        size: 10,
                        font: helveticaFont
                    })

                    pdfText = paradigmas.value[j].nome
                    newPage.drawText(pdfText, {
                        x: 120,
                        y: y,
                        size: 9,
                        font: helveticaFont
                    })
                    pdfText = paradigmas.value[j].matricular.toString()
                    newPage.drawText(pdfText, {
                        x: 385,
                        y: y,
                        size: 11,
                        font: helveticaFont
                    })
                    pdfText = paradigmas.value[j].valor.toString()
                    newPage.drawText(pdfText, {
                        x: 485,
                        y: y,
                        size: 11,
                        font: helveticaFont
                    })
                    y -= 26.5
                }
                break;
            }
        }

        pdfText = produtividade30porcentoRequente().toString()
        secondPage.drawText(pdfText, {
            x: 485,
            y: 576,
            size: 13,
            font: helveticaFont
        })

        pdfText = produtividade30porcentoParadigma().toString()
        secondPage.drawText(pdfText, {

            x: 485,
            y: 674,
            size: 13,
            font: helveticaFont
        })

        pdfText = produtivadadeMeta().toString() + '/12 = ' + (produtivadadeMeta() / 12).toFixed();
        secondPage.drawText(pdfText, {
            x: 360,
            y: 473.5,
            size: 13,
            font: helveticaFont
        })

        pdfText = reuniao.value.eletronico;
        secondPage.drawText(pdfText, {
            x: 271,
            y: 377,
            size: 11,
            font: helveticaFont
        })

        pdfText = reuniao.value.presencial;
        secondPage.drawText(pdfText, {
            x: 215,
            y: 342,
            size: 11,
            font: helveticaFont
        })

        pdfText = disposicao.value;
        secondPage.drawText(pdfText, {
            x: 207,
            y: 307,
            size: 11,
            font: helveticaFont
        })
        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    } else {
        url = ordinario_especial.value.ordinario_especial[1].caminho_doc; // especial
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];
        const { width, height } = firstPage.getSize();

        // PONTO PRETA PARA ID OS DOCS FEITOS NA C-PRO
        pdfText = '.'
        firstPage.drawText(pdfText, {
            x: 55,
            y: 800,
            size: 55,
            font: helveticaFont
        })

        // INICIAL OU RENOVAÇÃO
        pdfText = 'X'
        if (inicial_renovacao.value.tipo == 'inicial') {
            firstPage.drawText(pdfText, {
                x: 117,
                y: 688,
                size: 20,
                font: helveticaFont
            })
        } else {
            firstPage.drawText(pdfText, {
                x: 347,
                y: 686,
                size: 20,
                font: helveticaFont
            })
        }

        // IDENTIFICAÇÃO DO(A) SERVIDOR(A):
        pdfText = nome.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 636, // 643 - 7
            size: 11,
            font: helveticaFont
        })

        pdfText = matricula.value;
        firstPage.drawText(pdfText, {
            x: 427,
            y: 636, // 643 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = cargo.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 611, // 618 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = cargoComissao.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 586, // 593 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = lotacao.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 561, // 568 - 7
            size: 13,
            font: helveticaFont
        })

        // IDENTIFICAÇÃO DO GESTOR(A) 

        pdfText = nomeGestor.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 524, // 531 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = matriculaGestor.value;
        firstPage.drawText(pdfText, {
            x: 427,
            y: 524, // 531 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = cargoGestor.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 499, // 506 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = cargoComissaoGestor.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 474, // 481 - 7
            size: 13,
            font: helveticaFont
        })

        // IDENTIFICAÇÃO DA CHEFIA IMEDIATA
        pdfText = nomeChefia.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 436, // 443 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = matriculaChefia.value;
        firstPage.drawText(pdfText, {
            x: 427,
            y: 436, // 443 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = cargoChefia.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 411, // 418 - 7
            size: 13,
            font: helveticaFont
        })

        pdfText = cargoComissaoChefia.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 386, // 393 - 7
            size: 13,
            font: helveticaFont
        })

        // REGIME DE TELETRABALHO ORDINÁRIO

        pdfText = 'X';
        if (opcaoRegime.value.content == 'integral') {
            firstPage.drawText(pdfText, {
                x: 197.8,
                y: 355, // 359 - 7
                size: 20,
                font: helveticaFont
            })
        } else if (opcaoRegime.value.content == 'parcial') {
            firstPage.drawText(pdfText, {
                x: 198,
                y: 336, // 340 - 7
                size: 20,
                font: helveticaFont
            })

            // PREENCHIMENTO DOS DIAS DA SEMANA

            for (var i = 0; i < diasParcial.value.content.length; i++) {
                for (var j = 0; j < diasParcial.value.options.length; j++) {
                    if (diasParcial.value.content[i] == diasParcial.value.options[j].value) {
                        firstPage.drawText(pdfText, {
                            x: diasParcial.value.options[j].x,
                            y: diasParcial.value.options[j].y - 4, // Subtrai 7 de 'y'
                            size: 20,
                            font: helveticaFont
                        })
                    }
                }
            }
        }

        // DESCRIÇÃO DAS ATIVIDADES A SEREM DESEMPENHADAS

        pdfText = textoFormatado.value;
        firstPage.drawText(pdfText, {
            x: 55,
            y: 261, // 268 - 7
            size: 11,
            font: helveticaFont
        })

        // PRODUTIVIDADE MENSAL
        // requente

        pdfText = nome.value;
        firstPage.drawText(pdfText, {
            x: 120,
            y: 145,
            size: 11,
            font: helveticaFont
        })

        pdfText = matricula.value;
        firstPage.drawText(pdfText, {
            x: 385,
            y: 145,
            size: 11,
            font: helveticaFont
        })

        pdfText = requerentInput.value.toString();
        firstPage.drawText(pdfText, {
            x: 485,
            y: 145,
            size: 11,
            font: helveticaFont
        })

        // paradigmas

        var auxY = 120;
        var flag = true
        for (i = 0; i < paradigmas.value.length && flag == true; i++) {
            pdfText = paradigmas.value[i].nome
            firstPage.drawText(pdfText, {
                x: 120,
                y: auxY,
                size: 9,
                font: helveticaFont
            })
            pdfText = paradigmas.value[i].matricular.toString()
            firstPage.drawText(pdfText, {
                x: 385,
                y: auxY,
                size: 11,
                font: helveticaFont
            })
            pdfText = paradigmas.value[i].valor.toString()
            firstPage.drawText(pdfText, {
                x: 485,
                y: auxY,
                size: 11,
                font: helveticaFont
            })
            auxY -= 26.5

            if (i > 2) {
                j = i + 1
                let y = 750; // Coordenada Y para a primeira linha
                const newPage = pdfDoc.addPage([width, height]);

                const colWidths = [120, 385, 485]; // Larguras das colunas "Nome", "Matrícula" e "Produtividade"

                // Defina os nomes das colunas
                const columnNames = ["Nome", "Matrícula", "Produtividade"];

                // Desenho do cabeçalho da tabela
                for (let i = 0; i < columnNames.length; i++) {
                    newPage.drawText(columnNames[i], {
                        x: colWidths[i],
                        y,
                        size: 12,
                        font: helveticaFont,
                    });

                }

                //baixar a linha 
                y -= 26.5

                // Desenho dos paradigmas
                for (j; j - paradigmas.value.length != 0; j++) {
                    newPage.drawText("Paradigma " + (j + 1), {
                        x: 50,
                        y: y,
                        size: 10,
                        font: helveticaFont
                    })

                    pdfText = paradigmas.value[j].nome
                    newPage.drawText(pdfText, {
                        x: 120,
                        y: y,
                        size: 9,
                        font: helveticaFont
                    })
                    pdfText = paradigmas.value[j].matricular.toString()
                    newPage.drawText(pdfText, {
                        x: 385,
                        y: y,
                        size: 11,
                        font: helveticaFont
                    })
                    pdfText = paradigmas.value[j].valor.toString()
                    newPage.drawText(pdfText, {
                        x: 485,
                        y: y,
                        size: 11,
                        font: helveticaFont
                    })
                    y -= 26.5
                }
                break;
            }
        }

        pdfText = produtividade30porcentoRequente().toString()
        secondPage.drawText(pdfText, {
            x: 485,
            y: 569,
            size: 13,
            font: helveticaFont
        })

        pdfText = produtividade30porcentoParadigma().toString()
        secondPage.drawText(pdfText, {
            x: 485,
            y: 674,
            size: 13,
            font: helveticaFont
        })

        pdfText = produtivadadeMeta().toString() + '/12 = ' + (produtivadadeMeta() / 12).toFixed();
        secondPage.drawText(pdfText, {
            x: 360,
            y: 466.5,
            size: 13,
            font: helveticaFont
        })

        pdfText = reuniao.value.eletronico;
        secondPage.drawText(pdfText, {
            x: 271,
            y: 370, // 377 - 7
            size: 11,
            font: helveticaFont
        })

        pdfText = reuniao.value.presencial;
        secondPage.drawText(pdfText, {
            x: 215,
            y: 335, // 342 - 7
            size: 11,
            font: helveticaFont
        })

        pdfText = disposicao.value;
        secondPage.drawText(pdfText, {
            x: 207,
            y: 300,
            size: 11,
            font: helveticaFont
        })

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    }
}


async function onSavePdf() {
    console.log(ordinario_especial.value.caminho_doc + ' valor=> ' + ordinario_especial.value.valor_da_multiplicacao)
    const modifiedPdfBytes = await modifyPdf();

    // Crie uma nova janela do navegador com o PDF modificado
    const newWindow = window.open('', '_blank');
    if (newWindow) {
        // Crie um objeto Blob com os bytes do PDF
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Defina o URL da nova janela para o Blob criado
        newWindow.location.href = url;
    } else {
        alert('O bloqueio de pop-up pode estar impedindo a abertura da nova janela.');
    }
}

</script>

<template>
    <Card>
        <template #form-content>
            <n-divider class="title-form" title-placement="center" style="--n-color: rgb(0, 0, 122)">
                PLANO INDIVIDUAL DE TELETRABALHO
            </n-divider>

            <n-radio-group class="btn-escolha" v-model:value="ordinario_especial.valor_da_multiplicacao">
                <n-radio v-for="i in ordinario_especial.ordinario_especial" :key="i.value" :label="i.label"
                    :value="i.value">
                </n-radio>
            </n-radio-group>

            <n-radio-group class="btn-escolha" v-model:value="inicial_renovacao.tipo">
                <n-radio v-for="i in inicial_renovacao.inicial_renovacao" :key="i.value" :label="i.label" :value="i.value">
                </n-radio>
            </n-radio-group>

            <n-divider class="title-form" title-placement="center" style="--n-color: rgb(0, 0, 122)">
                DADOS DO REQUERENTE
            </n-divider>

            <div class="col">
                <n-form-item class="tamanho" label="Nome:">
                    <n-input v-model:value="nome" type="text" class="input-calc-form" label-field="NOME"
                        placeholder="Digite o nome" />
                </n-form-item>

                <n-form-item label="Matrícula:">
                    <n-input v-model:value="matricula" class="input-calc-form" placeholder="Digite a matrícula" />
                </n-form-item>
            </div>

            <n-form-item class="tamanho" label="Cargo Efetivo:">
                <n-input v-model:value="cargo" class="input-calc-form" label="CARGO" placeholder="Digite o cargo" />
            </n-form-item>

            <n-form-item class="tamanho" label="Cargo em comissão/função gratificada:">
                <n-input v-model:value="cargoComissao" class="input-calc-form" label="CARGO EM COMISSÃO/FUNÇÃO GRATIFICADA"
                    placeholder="Digite o cargo em comissão/função gratificada" />
            </n-form-item>

            <n-form-item class="tamanho" label="Lotação:">
                <n-input v-model:value="lotacao" class="input-calc-form" placeholder="Digite a lotação" />
            </n-form-item>

            <n-divider class="title-form" title-placement="center" style="--n-color: rgb(0, 0, 122)">
                GESTOR(A) TITULAR DA UNIDADE
            </n-divider>

            <div class="col">
                <n-form-item class="tamanho" label="Nome do gestor:">
                    <n-input v-model:value="nomeGestor" class="input-calc-form" label="NOME"
                        placeholder="Digite o nome do gestor" />
                </n-form-item>

                <n-form-item label="Matrícula do gestor:">
                    <n-input v-model:value="matriculaGestor" class="input-calc-form" label="MATRÍCULA"
                        placeholder="Digite a matrícula do gestor" />
                </n-form-item>
            </div>

            <n-form-item label="Cargo do gestor:">
                <n-input v-model:value="cargoGestor" class="input-calc-form" label="CARGO"
                    placeholder="Digite o cargo do gestor" />
            </n-form-item>

            <n-form-item label="Cargo em comissão/função gratificada:">
                <n-input v-model:value="cargoComissaoGestor" class="input-calc-form"
                    label="CARGO EM COMISSÃO/FUNÇÃO GRATIFICADA"
                    placeholder="Digite o cargo em comissão/função gratificada do gestor" />
            </n-form-item>

            <n-divider class="title-form" title-placement="center" style="--n-color: rgb(0, 0, 122)">
                CHEFIA IMEDIATA
            </n-divider>

            <div class="col">

                <n-form-item class="tamanho" label="Nome da chefia imediata:">
                    <n-input v-model:value="nomeChefia" type="text" class="input-calc-form" label="NOME"
                        placeholder="Digite o nome da chefia" />
                </n-form-item>

                <n-form-item label=" Matrícula da chefia:">
                    <n-input v-model:value="matriculaChefia" class="input-calc-form" label="MATRÍCULA"
                        placeholder="Digite a matrícula da chefia" />
                </n-form-item>

            </div>

            <n-form-item label="Cargo da chefia imediata: ">
                <n-input v-model:value="cargoChefia" class="input-calc-form" label="CARGO"
                    placeholder="Digite o cargo da chefia" />
            </n-form-item>

            <n-form-item label="Cargo em comissão/função gratificada:">
                <n-input v-model:value="cargoComissaoChefia" class="input-calc-form"
                    label="CARGO EM COMISSÃO/FUNÇÃO GRATIFICADA"
                    placeholder="Digite o cargo em comissão/função gratificada da chefia" />
            </n-form-item>

            <n-form-item class="radio-input-regime" label="REGIME DE TELETRABALHO ORDINÁRIO:">
                <n-radio-group v-model:value="opcaoRegime.content">
                    <n-radio v-for="i in opcaoRegime.options" :key="i.value" :label="i.label" :value="i.value">
                    </n-radio>
                </n-radio-group>
                <n-select v-model:value="diasParcial.content" multiple :options="diasParcial.options" filterable
                    placeholder="Selecione" :disabled="opcaoRegime.content === 'integral'">
                </n-select>
            </n-form-item>

            <n-form-item
                label="DESCRIÇÃO DAS ATIVIDADES A SEREM DESEMPENHADAS PELO(A) SERVIDOR(A), INCLUSIVE SE ATUARÁ EM PROCESSOS FÍSICOS E/OU ELETRÔNICOS:">
                <n-input v-model:value="descricao_atividades" size="large" type="textarea" maxlength="210" show-count
                    clearable @update:value="descricao_atividades = $event" placeholder="Digite">
                </n-input>
            </n-form-item>

            <n-form class="calc-form">
                <div>
                    <n-divider class="title-form" title-placement="center" style="--n-color: rgb(0, 0, 122)">
                        REQUERENTE
                    </n-divider>
                    <label class="calc-form-requerente">Produtividade do Requerente:</label>
                    <n-input-number v-model:value="requerentInput" @onUpdate:value="requerentInput = $event"
                        class="input-calc-form" label="Média de Produtividade do Requerente" :show-button="false"
                        placeholder="Digite" />
                </div>

                <n-divider class="title-form" title-placement="center" style="--n-color: rgb(0, 0, 122)">
                    PARADIGMAS
                </n-divider>

                <n-space class="produtividade-paradigmas" v-for="(paradigma, index) in paradigmas" :key="index">
                    <label class="calc-form-paradigma">Paradigma {{ index + 1
                    }}:</label>
                    <div class="col">
                        <n-form-item label="Nome: " class="tamanho">
                            <n-input v-model:value="paradigma.nome" placeholder="digite" label="Nome" style="width: 100%;">
                            </n-input>
                        </n-form-item>

                        <n-form-item label="Matrícula:">
                            <n-input-number v-model:value="paradigma.matricular" placeholder="digite" label="Matrícula"
                                :show-button="false">
                            </n-input-number>
                        </n-form-item>

                        <n-form-item label="Produtividade: ">
                            <n-input-number v-model:value="paradigma.valor" @onUpdate:value="paradigma.valor = $event"
                                label="Média de Produtividade do Paradigma" :show-button="false" placeholder="Digite" />
                        </n-form-item>
                    </div>
                </n-space>

                <n-space class="btn-paradigma">
                    <n-button class="btn" @click="adicionarParadigma">Adicionar paradigma</n-button>
                    <n-button class="btn" @click="removerParadigma">Remover paradigma</n-button>
                </n-space>

            </n-form>
            <br>
            <br>

            <div class="col">
                <n-form-item class="tamanho" label="REUNIÃO POR MEIO ELETRÔNICO: ">
                    <n-input v-model:value="reuniao.eletronico" placeholder="Ex: 1 vez por semana"></n-input>
                </n-form-item>
                <n-form-item class="tamanho" label="REUNIÃO PRESENCIAL: ">
                    <n-input v-model:value="reuniao.presencial" placeholder="Ex: 1 vez por mês"></n-input>
                </n-form-item>
            </div>

            <n-form-item class="horas-content"
                label="HORÁRIO EM QUE O(A) SERVIDOR(A) DEVERÁ ESTAR À DISPOSIÇÃO DA UNIDADE DE TRABALHO POR MEIO ELETRÔNICO (art. 31, IV): ">
                <n-input class="horas" v-model:value="disposicao" placeholder="Ex: 8h às 14h">
                </n-input>
            </n-form-item>

            <n-button class="btn" @click="onSavePdf">Salvar PDF modificado</n-button>

        </template>
    </Card>
</template>

<style>
.checkbox-column {
    display: flex;
    flex-direction: column;
}

.btn {
    float: right;
    color: white;
    background-color: #3b8cff;
    border-radius: 5px;
}

.produtividade-paradigmas {
    justify-content: center;
    align-items: center;
    width: 100%;
}

.tamanho {
    width: 100%;
}

.col {
    display: flex;
    gap: 40px;
    justify-content: space-around;
}

.produtividade {
    display: flex;
}

.btn-escolha {
    display: flex;
    align-items: center;
    justify-content: center;
}

.horas {
    display: flex;
    align-items: center;
}

.espaco-entre {
    display: flex;
    justify-content: center;
    align-items: center;
}

.title-form {
    font-size: flex 20px;
    display: flex;
    justify-content: center;
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