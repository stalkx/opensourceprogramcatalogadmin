<script setup>
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'


const router = useRouter()
const userInfo = ref({})

async function getAdminInfo(){

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  userInfo.value = await fetch('http://localhost:8080/api/v1/user/user-info', options)
    .then(response => {
      if (response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        return response
      }
    })
    .then(response => response.json())
    .then(data => data)

  console.log(userInfo.value)
}

function goToProgram() {
  router.push({ path: '/program'})
}

function goToCategory() {
  router.push({ path: '/category'})
}

onMounted(() => {
  getAdminInfo()
})

</script>

<template>
  <div class="h-screen border p-5 flex flex-col justify-between">
    <div>
      <div class="border-b mb-5">
        <h1 class="text-center mb-2">ПАНЕЛЬ АДМІНІСТРАТОРА</h1>
      </div>
      <div class="flex flex-col gap-4">
        <Button label="Адміністрування Додатків" icon="pi pi-microsoft" @click="goToProgram()"/>
        <Button label="Адміністрування Користувачів" icon="pi pi-user" @click="goToProgram()"/>
        <Button label="Адміністрування Категорій" icon="pi pi-align-justify" @click="goToCategory"/>
        <Button label="Адміністрування Ролів" icon="pi pi-eye-slash" @click="goToProgram()"/>
      </div>
    </div>
    <div class="border-t w-full">
      <h1>{{ userInfo.login }}</h1>
      <Button class="mt-2" :label="userInfo.login" severity="danger" icon="pi pi-file-export" @click="go()"/>
      <Button class="mt-2" label="Вийти" severity="danger" icon="pi pi-file-export" @click="go()"/>
    </div>
  </div>
</template>

<style scoped>
</style>