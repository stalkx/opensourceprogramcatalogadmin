<script setup>


import { onMounted, ref, watch } from 'vue'
import Paginator from 'primevue/paginator';
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Avatar from 'primevue/avatar'
import UserItem from '@/components/User/UserItem.vue'
import Dialog from 'primevue/dialog';
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown';



let userResponse = ref([])
let first = ref(0)
const router = useRouter()
const showAddUser = ref(false)
const selectedRole = ref({})
const roleData = ref([])
const userLoginSearch = ref()

const createUserData = ref({
  login: '',
  password: '',
  role: {},
})

async function saveUser(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(createUserData.value),
  };

  await fetch('http://localhost:8080/api/v1/auth/register', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        getAllUser()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

async function getAllRole(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  roleData.value = await fetch(`http://localhost:8080/api/v1/role?size=4&page=0`, options)
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
}

// Function to delete a comment
async function removeUser(user) {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
  myHeaders.append('Content-Type', 'application/json')

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(user),
  }

  await fetch(`http://localhost:8080/api/v1/user/remove`, options)
    .then(response => {
      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/')
      } else {
        getAllUser()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

async function editUser(editUserData){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(editUserData),
  };

  await fetch('http://localhost:8080/api/v1/user/update', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        getAllUser()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

async function editUserPassword(editUserData){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(editUserData),
  };

  await fetch('http://localhost:8080/api/v1/user/update-password', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        getAllUser()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

async function getAllUser(){

  console.log(first.value)

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  userResponse.value = await fetch(`http://localhost:8080/api/v1/user?size=6&page=${first.value}`, options)
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

  console.log(userResponse.value.content)
}

async function searchUserByLogin(){

  if (userLoginSearch.value != ''){
    const options = {
      method: 'GET'
    };

    userResponse.value = await fetch(`http://localhost:8080/api/v1/user/search/${userLoginSearch.value}?size=6&page=${first.value}`, options)
      .then(response => response)
      .then(response => response.json())
      .then(data => data)
  }else {
    await getAllUser()
  }
}

onMounted(() => {
  getAllUser()
  getAllRole()
})

watch(first, () => {
  getAllUser()
})

watch(userLoginSearch, () => {
  searchUserByLogin()
})

</script>

<template>

  <Dialog v-model:visible="showAddUser" modal header="Додаванян користувача" :style="{ width: '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Створення нового користувача.</span>
    <div class="flex items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-[6rem]">Логін</label>
      <InputText v-model:="createUserData.login" id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-3 mb-5">
      <label for="password" class="font-semibold w-[6rem]">Пароль</label>
      <InputText v-model:="createUserData.password" id="password" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex items-center gap-3 mb-5">
      <label for="email" class="font-semibold w-[6rem]">Email</label>
      <Dropdown v-model="createUserData.role" :options="roleData.content" optionLabel="roleName" placeholder="Виберіть категорію" class="w-full" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Зберегти" @click="saveUser()"></Button>
    </div>
  </Dialog>


  <div class="m-2 p-2 w-full flex flex-col justify-between border">
    <div class="border-b p-2">
      <span class="relative">
        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
        <InputText v-model:="userLoginSearch" placeholder="Пошук" class="pl-10 w-full" />
      </span>
    </div>

    <div class="m-5">
      <Button @click="showAddUser = true" label="Створири користувача"/>
    </div>

    <div class="flex flex-col gap-2 m-5">
      <UserItem v-for="user in userResponse.content" :key="user.userId"
                :user-id="user.userId"
                :login="user.login"
                :password="user.password"
                :roles="user.roles"
                :remove-function="removeUser"
                :edit-function="editUser"
                :edit-password-function="editUserPassword"
      />
    </div>
    <Paginator class="mt-auto" v-model:first="first" :rows="1" :totalRecords="userResponse.totalPages" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
  </div>
</template>

<style scoped>

</style>