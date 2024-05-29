<script setup>

import Image from 'primevue/image'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { format } from 'date-fns'
import Tiptap from '@/components/Tiptap.vue'
import InputText from 'primevue/inputtext'
import FileUpload from 'primevue/fileupload'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Rating from 'primevue/rating'
import Paginator from 'primevue/paginator'
import Dropdown from 'primevue/dropdown';


const averageRating = ref(0)

const props = defineProps({
  programId: Number,
  programName: String,
  programDescription: String,
  programIconUrl: String,
  programVersion: String,
  programDeveloper: String,
  programSystemSupport: String,
  programDownloadUrl: String,
  programGitHubUrl: String,
  addedAt: [String, Date],
  category: Object,
  removeFunction: Function,
  editFunction: Function
})
const editProgramData = ref({
  programId: props.programId,
  programName: props.programName,
  programDescription: props.programDescription,
  programIconUrl: props.programIconUrl,
  programVersion: props.programVersion,
  programDeveloper: props.programDeveloper,
  programSystemSupport: props.programSystemSupport,
  programDownloadUrl: props.programDownloadUrl,
  programGitHubUrl: props.programGitHubUrl,
  addedAt: props.addedAt,
  category: props.category
})

const createComment = ref({
  commentBody: '',
  rating: 0,
  user:{},
  program:{
    programId:props.programId
  }
})

const router = useRouter()
const formattedAddedAt = ref('')
const readMoreProgramDialog = ref(false)
const showAddComment = ref(false)
const commentResponse = ref([])
const commentPage = ref(0)
const selectedSortByTime = ref({
  name: 'Спочатку старі',
  type: 'asc'
})
const typeSort = ref([
  { name: 'Спочатку старі', type: 'asc' },
  { name: 'Спочатку нові', type: 'desc' }
]);
const editProgramDialog = ref(false)
const currentUser = ref({})
const categoryData = ref([])



// Додайте нову функцію для форматування дати
function formatCommentDate(date) {
  return format(new Date(date), 'dd-MM-yyyy HH:mm');
}


async function getAverageRating() {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  const response = await fetch(`http://localhost:8080/api/v1/comment/average/${props.programId}`, options);
  const data = await response.json();
  averageRating.value = data.averageRating;
}

async function getAdminInfo(){

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  createComment.value.user = await fetch('http://localhost:8080/api/v1/user/user-info', options)
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

  currentUser.value = createComment.value.user // Set the current user

}

async function saveComment(){
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(createComment.value),
  };

  await fetch('http://localhost:8080/api/v1/comment/save', options)
    .then(response => {
      if(response.status === 401){
        localStorage.removeItem('token')
        router.push('/')
      }else {
        getAverageRating()
        getAllComment()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
}


async function getAllComment() {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
  myHeaders.append('Content-Type', 'application/json');

  const options = {
    method: 'GET',
    headers: myHeaders
  };

  const response = await fetch(`http://localhost:8080/api/v1/comment/program/${props.programId}?size=6&page=${commentPage.value}&sort=addedAt,${selectedSortByTime.value.type}`, options);
  if (response.status === 401) {
    localStorage.removeItem('token');
    router.push('/');
  } else {
    const data = await response.json();
    // Форматування дати для кожного коментаря
    data.content.forEach(comment => {
      comment.formattedAddedAt = formatCommentDate(comment.addedAt);
    });
    commentResponse.value = data;
  }
}

async function getImageUrl (event) {
  if (event.xhr.status === 200) { // Check for successful upload (status code 200)
    const response = await JSON.parse(event.xhr.responseText);
    editProgramData.value.programIconUrl = response.data.display_url;
    console.log(response.data.display_url)
  } else {
    console.error("Upload failed! Status:", event.xhr.status);
  }
}

// Function to delete a comment
async function deleteComment(comment) {
  const myHeaders = new Headers()
  myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
  myHeaders.append('Content-Type', 'application/json')

  const options = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(comment),
  }

  await fetch(`http://localhost:8080/api/v1/comment/remove`, options)
    .then(response => {
      if (response.status === 401) {
        localStorage.removeItem('token')
        router.push('/')
      } else {
        getAllComment()
        return response.json()
      }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error))
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
}

onMounted(() => {
  getAverageRating()
  getAdminInfo()
  getAllComment()
  getAllCategory()

  if (props.addedAt) {
    const date = new Date(props.addedAt)
    formattedAddedAt.value = format(date, 'dd-MM-yyyy HH:mm')
  }

})

watch(selectedSortByTime, () => {
  getAllComment()
  console.log(selectedSortByTime.value.type)
})

watch(commentPage, () => {
  getAllComment()
})

</script>

<template>

  <Dialog v-model:visible="editProgramDialog" modal header="Створення додатку" :style="{ width: '83.333333%' }">
    <div class="flex flex-col gap-2">
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Ім'я додатку</h1>
        <InputText v-model:="editProgramData.programName" placeholder="Ім'я додатку"/>
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
        <Tiptap v-model:="editProgramData.programDescription"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Версія додатку</h1>
        <InputText v-model:="editProgramData.programVersion" placeholder="Версія додатку"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Розробник</h1>
        <InputText v-model:="editProgramData.programDeveloper" placeholder="Розробник"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Операційні системи додатку</h1>
        <InputText v-model:="editProgramData.programSystemSupport" placeholder="Операційні системи додатку"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Категорія</h1>
        <Dropdown v-model="editProgramData.category" :options="categoryData.content" optionLabel="categoryName" placeholder="Виберіть категорію" class="w-full" />
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Посилання на GitHUB</h1>
        <InputText v-model:="editProgramData.programGitHubUrl" placeholder="Посилання на файл GitHUB"/>
      </div>
      <div class="flex border-b mt-2 p-2 flex-col gap-2">
        <h1>Посилання на файл завантаження</h1>
        <InputText v-model:="editProgramData.programDownloadUrl" placeholder="Посилання на файл завантаження"/>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <Button label="Зберегти" @click="editFunction(editProgramData)" />
    </div>

    <div class="prose" v-html="text"></div>
  </Dialog>


  <Dialog v-model:visible="readMoreProgramDialog" modal :header="props.programName" :style="{ width: '83.333333%' }">
    <div class="flex flex-row gap-5 border-b w-full p-2">
      <div class="border rounded p-2">
        <Image :src="props.programIconUrl" width="250" alt="Image" preview />
      </div>
      <div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-book"></i>
          <h1 class="font-bold">Ім'я додатку:</h1>
          <p>{{ props.programName }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-server"></i>
          <h1 class="font-bold">Версія додатку:</h1>
          <p>{{ props.programVersion }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-user"></i>
          <h1 class="font-bold">Розробник додатку:</h1>
          <p>{{ props.programDeveloper }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-microsoft"></i>
          <h1 class="font-bold">Операційні системи які підримує додаток:</h1>
          <p>{{ props.programSystemSupport }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-microsoft"></i>
          <h1 class="font-bold">Категорія:</h1>
          <p>{{ props.category.categoryName }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-github"></i>
          <h1 class="font-bold">Посиланян на GitHub:</h1>
          <p>{{ props.programGitHubUrl }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-calendar-plus"></i>
          <h1 class="font-bold">Дата додавання додатку на сайт:</h1>
          <p>{{ formattedAddedAt }}</p>
        </div>
        <div class="flex flex-row gap-2 items-center">
          <i class="pi pi-star-fill"></i>
          <h1 class="font-bold">Рейтнг:</h1>
          <Rating v-model:="averageRating" readonly  :cancel="false" />
        </div>
      </div>
    </div>
    <div>
      <TabView>
        <TabPanel header="Опис додатку">
          <div class="prose" v-html="props.programDescription"></div>
        </TabPanel>
        <TabPanel header="Відгуки">

          <div class="mb-5 flex flex-row justify-between">
            <Button @click="showAddComment = true" icon="pi pi-plus" label="Додати відгук" />
            <Dropdown v-model="selectedSortByTime" :options="typeSort" optionLabel="name" placeholder="Тип сортування" class="w-full md:w-[14rem]" />
          </div>

          <Dialog v-model:visible="showAddComment" modal header="Додати відгук" class="w-4/5">
            <div class="flex flex-col gap-5">
              <div>
                <h1>Відгук</h1>
                <Tiptap v-model:="createComment.commentBody"/>
              </div>
              <div class="flex flex-row gap-2">
                <h1>Рейтинг</h1>
                <Rating v-model="createComment.rating"  :cancel="false" />
              </div>
              <Button @click="saveComment()" label="Зберегти"/>
            </div>
          </Dialog>

          <div class="flex flex-col gap-2">
            <div v-for="comment in commentResponse.content" :key="comment.commentId" class="flex flex-col gap-4">
              <div class="border p-2">
                <div class="flex flex-row items-center justify-between">
                  <div class="flex flex-row items-center gap-2">
                    <Avatar :label="comment.user.login[0]" class="mr-2" size="large" />
                    <h1>{{ comment.user.login + " " + "( " + comment.formattedAddedAt + " )"}}</h1>
                  </div>
                  <div>
                    <Rating v-model="comment.rating" readonly  :cancel="false" />
                  </div>
                </div>
                <div class="prose" v-html="comment.commentBody"></div>
<!--                <div v-if="currentUser && comment.user.userId === currentUser.userId" class="flex justify-end">-->
<!--                </div>-->
                <Button @click="deleteComment(comment)" icon="pi pi-trash" label="Видалити" class="p-button-danger p-button-text"/>
              </div>
            </div>
          </div>
          <Paginator class="mt-auto" v-model:first="commentPage" :rows="1" :totalRecords="commentResponse.totalPages" template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink" />
        </TabPanel>
      </TabView>
    </div>
  </Dialog>

  <div class="card flex flex-col gap-3 p-2 border max-w-72">
    <div class="p-2 flex flex-col align-middle justify-center">
      <div class="max-h-64 min-h-64 flex flex-col justify-center">
        <Image :src="props.programIconUrl" width="250" alt="Image" preview />
      </div>
      <h1>{{props.programName}}</h1>
      <h1>{{formattedAddedAt}}</h1>
    </div>
    <div class="flex justify-between border-t p-2">
      <Button @click="readMoreProgramDialog = true" icon="pi pi-download" size="small" />
      <Button @click="editProgramDialog = true" icon="pi pi-file-edit" size="small" severity="warning" />
      <Button @click="removeFunction(props.programId)" icon="pi pi-delete-left" size="small" severity="danger" />
    </div>
  </div>
</template>

<style scoped>
</style>