// import './assets/main.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import { Quasar } from 'quasar';
import App from './App.vue';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'


const pinia = createPinia();
const app = createApp(App);

app.use(Quasar, {});
app.use(pinia);
app.mount('#app');
