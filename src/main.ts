import './assets/theme.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {Quasar} from 'quasar';
import App from './App.vue';

// Import icon libraries
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css';
import iconSet from 'quasar/icon-set/material-symbols-rounded'

// Import Quasar css
import 'quasar/src/css/index.sass';


const pinia = createPinia();
const app = createApp(App);

app.use(Quasar, {
	iconSet,
});
app.use(pinia);
app.mount('#app');
