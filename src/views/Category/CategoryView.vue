<script setup>

import Dropdown from 'primevue/dropdown'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog';


const visibleCreateCategory = ref(false);
const categoryData = ref([])
const selectedCategory = ref(null)
const router = useRouter()

const createCategory = ref({
  categoryName: null
})


function reloadPage() {
  router.push({ path: router.currentRoute.value.path, force: true })
}

async function getAllCategory(){

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  categoryData.value = await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/category', options)
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


  // Забезпечуємо, що selectedCategory має значення після завантаження даних
  if (categoryData.value && categoryData.value.content && categoryData.value.content.length > 0) {
    selectedCategory.value = categoryData.value.content[0]
  }
}

async function removeCategory(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(selectedCategory.value),
  };

  await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/category/remove', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        getAllCategory()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}


async function updateCategory(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(selectedCategory.value),
  };

  await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/category/update', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        reloadPage()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

async function saveCategory(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(createCategory.value),
  };

  await fetch('https://opensourcesoftcatalog-production.up.railway.app/api/v1/category/save', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        getAllCategory()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}


onMounted(()=>{
  getAllCategory()
  console.log('RELOAD PAGE')
})

watch(selectedCategory, () => {
  console.log(selectedCategory.value)
})

</script>

<template>
  <div class="m-2 p-2 w-full flex flex-col border">
    <div class="m-5">
      <h1 class="text-center">Категорії</h1>
      <div class="border-b mb-5 p-2">
        <Button @click="visibleCreateCategory = true" label="Створити"/>
      </div>
      <div class="flex flex-row items-center justify-between gap-2 p-2 border-b">
        <div>
          <h1>Список категорій: </h1>
          <Dropdown v-model="selectedCategory" :options="categoryData.content" optionLabel="categoryName" placeholder="Виберіть категорію" class="w-full md:w-[14rem]" />
        </div>
        <Button @click="removeCategory()" label="Видалити" icon="pi pi-delete-left" size="small" severity="danger" />
      </div>
      <div class="mt-5 p-2 flex flex-col gap-2" v-if="selectedCategory">
        <div>
          <h1>Редагування категорії</h1>
          <InputText v-model="selectedCategory.categoryName" placeholder="Ім'я категорії" class="w-full" />
        </div>
        <Button @click="updateCategory()" label="Редагувати" icon="pi pi-file-edit" size="small" severity="warning" />
      </div>
    </div>
  </div>


  <Dialog v-model:visible="visibleCreateCategory" modal header="Створення категорії" :style="{ width: '25rem' }">
    <div class="flex items-center gap-3 mb-3">
      <label for="username" class="font-semibold w-[6rem]">Ім'я категорії</label>
      <InputText v-model:="createCategory.categoryName" />
    </div>
    <div class="flex justify-end gap-2">
      <Button label="Зберегти" @click="saveCategory()" />
    </div>
  </Dialog>
</template>


<style scoped>
</style>