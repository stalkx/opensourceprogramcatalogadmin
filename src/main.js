import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Lara from './presets/lara';      //import preset
import ToastService from 'primevue/toastservice';


const app = createApp(App)

app.use(router)
app.use(ToastService);
app.use(PrimeVue, {
  unstyled: true,
  pt: Lara
});

app.mount('#app')
