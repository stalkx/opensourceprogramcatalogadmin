<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext';
import { onMounted, reactive } from 'vue'


const router = useRouter()


onMounted(() => {
  router.push("login")
})

</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
