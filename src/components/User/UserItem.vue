<script setup>

import Avatar from 'primevue/avatar'
import { onMounted, ref } from 'vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext'

const showEditUser = ref(false)
const showEditUserPassword = ref(false)

const props = defineProps({
  userId: Number,
  login: String,
  password: String,
  roles: Array,
  removeFunction: Function,
  editFunction: Function
})
const removeUserData = ref({
  userId: Number(props.userId),
  login: props.login,
  password: props.password
})

const editUserDataLogin = ref({
  userId: Number(props.userId),
  login: props.login,
  password: props.password,
  roles: props.roles
})

const editUserDataPassword = ref({
  userId: Number(props.userId),
  login: props.login,
  password: '',
  roles: props.roles
})

</script>

<template>

  <Dialog v-model:visible="showEditUserPassword" modal header="Редагування" :style="{ width: '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Змінна пароля</span>
    <div class="flex items-center gap-3 mb-5">
      <label for="email" class="font-semibold w-[6rem]">Пароль</label>
      <InputText v-model:="editUserDataPassword.password" id="email" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" icon="pi pi-check" @click="props.editFunction(editUserDataPassword)"></Button>
    </div>
  </Dialog>

  <Dialog v-model:visible="showEditUser" modal header="Редагування" :style="{ width: '25rem' }">
    <span class="text-surface-600 dark:text-surface-0/70 block mb-5">Редагування користувача</span>
    <div class="flex items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-[6rem]">Лоігн</label>
      <InputText v-model:="editUserDataLogin.login" id="username" class="flex-auto" autocomplete="off" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Змінити пароль" @click="showEditUserPassword = true"></Button>
      <Button type="button" label="Зберегти" @click="props.editFunction(editUserDataLogin)"></Button>
    </div>
  </Dialog>

  <div class="border p-2 flex flex-row items-center justify-between">
    <div class="flex flex-row items-center">
      <Avatar :label="props.login[0]" class="mr-2" size="large" />
      <h1>{{props.login}}</h1>
    </div>
    <div class="flex flex-row gap-2">
      <Button icon="pi pi-times" severity="danger" @click="props.removeFunction(removeUserData)"/>
      <Button icon="pi pi-file-edit" severity="warning" @click="showEditUser = true"/>
    </div>
  </div>
</template>

<style scoped>

</style>