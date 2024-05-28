<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional
import InputText from 'primevue/inputtext'
import Image from 'primevue/image';
import Button from 'primevue/button'
import ProgramCard from '@/components/Program/ProgramCard.vue'
import {useRouter} from 'vue-router'
import { onMounted, reactive, ref, watch } from 'vue'
import Paginator from 'primevue/paginator';
import Dialog from 'primevue/dialog'
import FileUpload from 'primevue/fileupload'
import Tiptap from '@/components/Tiptap.vue'
import Dropdown from 'primevue/dropdown';

const router = useRouter()
let first = ref(0)
let programResponse = ref([])
const createProgramDialog = ref(false)
const text = ref('')
const categoryData = ref([])
let searchProgram = ref('')

const createProgramData = ref({
  programName: '',
  programDescription: '',
  programIconUrl: '',
  programVersion: '',
  programDeveloper: '',
  programSystemSupport: '',
  programDownloadUrl: '',
  programGitHubUrl: '',
  category: {}
})

const selectedSortByTime = ref({
  name: 'Спочатку старі',
  type: 'asc'
})
const typeSort = ref([
  { name: 'Спочатку старі', type: 'asc' },
  { name: 'Спочатку нові', type: 'desc' }
]);

async function searchProgramByName(){

  if (searchProgram.value != ''){
    const options = {
      method: 'GET'
    };

    programResponse.value = await fetch(`http://localhost:8080/api/v1/program/search/${searchProgram.value}?size=4&page=${first.value}&sort=addedAt,${selectedSortByTime.value.type}`, options)
      .then(response => response)
      .then(response => response.json())
      .then(data => data)
  }else {
    await getAllProgram()
  }
}

async function getAllProgram(){

  console.log(first.value)

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  programResponse.value = await fetch(`http://localhost:8080/api/v1/program?size=4&page=${first.value}&sort=addedAt,${selectedSortByTime.value.type}`, options)
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

async function getImageUrl (event) {
  if (event.xhr.status === 200) { // Check for successful upload (status code 200)
    const response = await JSON.parse(event.xhr.responseText);
    createProgramData.value.programIconUrl = response.data.display_url;
    console.log(response.data.display_url)
  } else {
    console.error("Upload failed! Status:", event.xhr.status);
  }
}

async function saveProgram(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(createProgramData.value),
  };

  await fetch('http://localhost:8080/api/v1/program/save', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        getAllProgram()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}

async function getAllCategory(){

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  categoryData.value = await fetch('http://localhost:8080/api/v1/category', options)
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
    createProgramData.value.category = categoryData.value.content[0]
  }
}

watch(first, () => {
  getAllProgram()
})

watch(text, () => {
  console.log(text.value)
})

watch(searchProgram, () => {
  searchProgramByName()
})

watch(selectedSortByTime, () => {
  if (searchProgram.value !== ''){
    searchProgramByName()
  }else {
    getAllProgram()
  }
})

onMounted(() => {
  getAllProgram()
  getAllCategory()
})

watch(programResponse, () => {
  console.log('HELLIO')
  console.log(programResponse.value.content)
})

</script>

<template>
  <div class="m-2 p-2 w-full flex flex-col justify-between border">
    <div class="border-b p-2">
      <span class="relative">
        <i class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
        <InputText v-model:="searchProgram" placeholder="Пошук" class="pl-10 w-full" />
      </span>
    </div>

    <div class="p-2 flex flex-row justify-between">
      <Button label="+ Додати нове програмне обезспечення" @click="createProgramDialog = true"/>
      <Dropdown v-model="selectedSortByTime" :options="typeSort" optionLabel="name" placeholder="Тип сортування" class="w-full md:w-[14rem]" />
    </div>

    <div class="p-2 m-2">
      <h1 class="text-center font-bold">Список додатків</h1>
      <div class="grid grid-cols-3 mt-5 gap-2">
        <ProgramCard v-for="program in programResponse.content" :key="program.programId" :program-id="program.programId"
                     :program-name="program.programName"
                     :program-icon-url="program.programIconUrl"
                     :added-at="program.addedAt"
                     :program-developer="program.programDeveloper"
                     :program-version="program.programVersion"
                     :program-system-support="program.programSystemSupport"
                     :program-git-hub-url="program.programGitHubUrl"
                     :program-description="program.programDescription"
                     :program-download-url="program.programDownloadUrl"
                     :category="program.category"
        />
      </div>
    </div>
    <Paginator class="mt-auto" v-model:first="first" :rows="1" :totalRecords="programResponse.totalPages" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
  </div>


  <Dialog v-model:visible="createProgramDialog" modal header="Створення додатку" class="w-5/6">
    <div class="flex flex-col gap-2">
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Ім'я додатку</h1>
        <InputText v-model:="createProgramData.programName" placeholder="Ім'я додатку"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Іконка додатку</h1>
        <FileUpload name="image" url="https://api.imgbb.com/1/upload?key=c12eb2f566894749ed00b6d52e41dc28" @upload="getImageUrl($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
          <template #empty>
            <p>Drag and drop files to here to upload.</p>
          </template>
        </FileUpload>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Опис додатку</h1>
        <Tiptap v-model:="createProgramData.programDescription"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Версія додатку</h1>
        <InputText v-model:="createProgramData.programVersion" placeholder="Версія додатку"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Розробник</h1>
        <InputText v-model:="createProgramData.programDeveloper" placeholder="Розробник"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Операційні системи додатку</h1>
        <InputText v-model:="createProgramData.programSystemSupport" placeholder="Операційні системи додатку"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Категорія</h1>
        <Dropdown v-model="createProgramData.category" :options="categoryData.content" optionLabel="categoryName" placeholder="Виберіть категорію" class="w-full" />
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Посилання на GitHUB</h1>
        <InputText v-model:="createProgramData.programGitHubUrl" placeholder="Посилання на файл GitHUB"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Посилання на файл завантаження</h1>
        <InputText v-model:="createProgramData.programDownloadUrl" placeholder="Посилання на файл завантаження"/>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <Button label="Зберегти" @click="saveProgram()" />
    </div>

    <div class="prose" v-html="text"></div>
  </Dialog>
</template>

<style scoped>
</style>