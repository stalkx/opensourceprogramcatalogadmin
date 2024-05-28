<script setup>


import { onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import TabMenu from 'primevue/tabmenu';
import Button from 'primevue/button'
import LeftSideBard from '@/components/LeftSideBard.vue'



const router = useRouter()

onMounted(() => {
  if(localStorage.getItem('token') == null){
    router.push('login')
  }else {
    if (localStorage.getItem('role').includes('ROLE_ADMIN') !== true){
      router.push("login")
    }
  }

})
</script>

<template>
  <div class="flex gap-2">
    <LeftSideBard/>
    <RouterView/>
  </div>
</template>

<style scoped>

</style>