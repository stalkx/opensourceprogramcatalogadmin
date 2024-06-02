<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext';
import { onMounted, reactive } from 'vue'
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';


const toast = useToast();
const router = useRouter()


const loginData = reactive({
  login: '',
  password: ''
})

const showMassage = (text, severity) => {
  toast.add({ severity: severity, summary: 'Повідомлення', detail: text, life: 3000 });
};

function sendData(){

  if (loginData.login === '' && loginData.password === ''){
    showMassage('Поля не можуть бути пустими!!!!', 'error')
  }else {
    const jsonData = JSON.stringify(loginData)

    fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/auth/authenticate', {
      method: 'POST',
      body: jsonData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if( data.status === 401){
          showMassage('Некоректні дані', 'error')
        }else {
          if(data.rolesList.includes('ROLE_ADMIN')){
            console.log('Success:', data);
            localStorage.setItem("token", data.token)
            localStorage.setItem("role", data.rolesList)
            router.push('admin')
          }else {
            showMassage('Некоректні дані', 'error')
          }

        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

onMounted(() => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role && role.includes('ROLE_ADMIN')) {
    router.push('admin');
  }
})
</script>

<template>
  <Toast />
  <div class="grid place-items-center h-screen">
    <div class="flex gap-4 flex-col">
      <div>
        <h1 class="text-center">Авторизація Адміна</h1>
      </div>
      <div class="flex flex-col gap-4">
        <InputText type="text" v-model="loginData.login" placeholder="Логін"/>
        <InputText type="password" v-model="loginData.password" placeholder="Пароль"/>
      </div>
      <div class="flex justify-center">
        <Button label="Увійти" @click="sendData()"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>