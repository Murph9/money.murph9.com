import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/main.css';
import "vue-toastification/dist/index.css";

import { createApp } from 'vue';
import App from './App.vue';
import Toast, { POSITION, type PluginOptions } from "vue-toastification";

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
  
import SimpleTypeahead from 'vue3-simple-typeahead';
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css'; //Optional default

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const app = createApp(App);

const options: PluginOptions = {
    position: POSITION.BOTTOM_LEFT,
    pauseOnFocusLoss: false,
    timeout: 2000
};
app.use(Toast, options);
app.use(SimpleTypeahead);

app.mount('#app');
