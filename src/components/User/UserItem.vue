<script setup>

import Avatar from 'primevue/avatar'
import { ref } from 'vue'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const props = defineProps({
  userId: Number,
  login: String,
  password: String
})
const removeUserData = ref({
  userId: props.userId,
  login: props.login,
  password: props.password
})

const router = useRouter()

// Function to delete a comment
async function removeUser() {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
  myHeaders.append('Content-Type', 'application/json')

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(removeUserData),
  }

  await fetch(`http://localhost:8080/api/v1/user/remove`, options)
    .then(response => {
      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/')
      } else {
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

</script>

<template>
  <div class="border p-2 flex flex-row items-center justify-between">
    <div class="flex flex-row items-center">
      <Avatar :label="props.login[0]" class="mr-2" size="large" />
      <h1>{{props.login}}</h1>
    </div>
    <div>
      <Button @click="removeUser" label="Видалити"/>
    </div>
  </div>
</template>

<style scoped>

</style>