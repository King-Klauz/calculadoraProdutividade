<script setup lang="ts">
import { ref } from 'vue';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const pdfText = ref('este texto foi modificado'); // Variável para armazenar o texto a ser inserido

async function modifyPdf() {
  const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
  const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText(pdfText.value, {
    x: 5,
    y: height / 2 + 300,
    size: 50,
    font: helveticaFont,
    color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(-45),
  })

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

async function onSavePdf() {
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
  <div>
    <textarea v-model="pdfText" rows="4" cols="50" placeholder="Digite o texto a ser inserido no PDF"></textarea>
    <button @click="onSavePdf">Salvar PDF Modificado</button>
  </div>
</template>
