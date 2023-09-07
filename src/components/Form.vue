<template>
  <div>
    <n-radio-group v-model:value="value" name="radiogroup">
      <n-space>
        <n-radio
          v-for="song in songs"
          :key="song.value"
          :value="song.value"
          :label="song.label"
        />
      </n-space>
    </n-radio-group>

    <p>Selecionado: {{ value }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup () {
    const value = ref<string | null>(null)

    const songs = [
      {
        value: "Rock'n'Roll Star",
        label: "Rock'n'Roll Star"
      },
      {
        value: 'Shakermaker',
        label: 'Shakermaker'
      }
    ].map((s) => {
      s.value = s.value.toLowerCase()
      return s
    })

    return {
      value,
      songs
    }
  }
})
</script>
