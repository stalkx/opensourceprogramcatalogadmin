<script setup>
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown';
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const programData = ref({
  programName: '',
  programDescription: '',
  programIconUrl: '',
  programVersion: '',
  programDeveloper: '',
  programSystemSupport: '',
  programDownloadUrl: '',
  category: {},
  programRating: 1
})

const categoryData = ref([])
const selectedCategory = ref()

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
}

async function getImageUrl (event) {
  if (event.xhr.status === 200) { // Check for successful upload (status code 200)
    const response = await JSON.parse(event.xhr.responseText);
    programData.value.programIconUrl = response.data.display_url;
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
    body: JSON.stringify(programData.value),
  };

  await fetch('http://localhost:8080/api/v1/program/save', options)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

}

onMounted(() => {
  getAllCategory()
})

</script>

<template>
  <div class="w-full border m-2 p-2">
    <h1 class="text-center border-b p-2 font-bold">Додавання нового додатку до бази даних</h1>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Ім'я додатка</h1>
      <InputText type="text" placeholder="Ім'я додатка" v-model="programData.programName" />
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
      <h1>Скріншоти з додатку</h1>
      <FileUpload name="image" url="https://api.imgbb.com/1/upload?key=c12eb2f566894749ed00b6d52e41dc28" @upload="getImageUrl($event)" :multiple="true" accept="image/*" :maxFileSize="1000000">
        <template #empty>
          <p>Drag and drop files to here to upload.</p>
        </template>
      </FileUpload>
    </div>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Опис додатку</h1>
      <Textarea v-model="programData.programDescription" rows="5" cols="30" />
    </div>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Версія додатку</h1>
      <InputText type="text" placeholder="Версія додатку" v-model="programData.programVersion" />
    </div>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Розробник</h1>
      <InputText type="text" placeholder="Розробник" v-model="programData.programDeveloper" />
    </div>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Операційні системи</h1>
      <InputText type="text" placeholder="Операційні системи" v-model="programData.programSystemSupport" />
    </div>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Категорія</h1>
      <Dropdown v-model="selectedCategory" :options="categoryData.content" optionLabel="categoryName" placeholder="Select a City" class="w-full md:w-[14rem]" />
    </div>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Посилання на GitHUB</h1>
      <InputNumber v-model="programData.programRating" inputId="minmax" :min="0" :max="5" />
    </div>
    <div class="flex border-b mt-2 p-2 flex-col gap-2">
      <h1>Файл додатку</h1>
      <InputText type="text" placeholder="Посилання на завантаження" v-model="programData.programDownloadUrl" />
    </div>
    <div class="mt-5 p-2 flex justify-between">
      <div></div>
      <Button label="Зберегти" @click="saveProgram()"/>
    </div>
  </div>

</template>

<style scoped>

</style>