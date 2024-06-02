<script setup>
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'

const router = useRouter()
const userInfo = ref({})
const showAboutAdmin = ref(false)

async function getAdminInfo(){

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  userInfo.value = await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/user/user-info', options)
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

function goToUser() {
  router.push({ path: '/user'})
}

function unLogin(){
  localStorage.removeItem("token")
  router.push({ path: '/login'})
}

onMounted(() => {
  getAdminInfo()
})

</script>

<template>

  <Dialog v-model:visible="showAboutAdmin" modal header="Про Адміна" :style="{ width: '25rem' }">
    <div class="flex items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-[6rem]">Логін</label>
      <InputText readonly id="username" v-model:="userInfo.login"/>
    </div>
  </Dialog>

  <div class="h-screen border p-5 flex flex-col justify-between">
    <div>
      <div class="border-b mb-5">
        <h1 class="text-center mb-2">ПАНЕЛЬ АДМІНІСТРАТОРА</h1>
      </div>
      <div class="flex flex-col gap-4">
        <Button label="Адміністрування Додатків" icon="pi pi-microsoft" @click="goToProgram()"/>
        <Button label="Адміністрування Користувачів" icon="pi pi-user" @click="goToUser()"/>
        <Button label="Адміністрування Категорій" icon="pi pi-align-justify" @click="goToCategory"/>
      </div>
    </div>
    <div class="border-t w-full flex flex-col gap-2">
      <Button :label="userInfo.login" icon="pi pi-file-export" @click="showAboutAdmin = true"/>
      <Button label="Вийти" severity="danger" icon="pi pi-file-export" @click="unLogin()"/>
    </div>
  </div>
</template>

<style scoped>
</style>