import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap/dist/js/bootstrap.min.js";
import "./assets/scss/app.scss";
import "vue-rate/dist/vue-rate.css";
import "vue-multiselect/dist/vue-multiselect.css";
import "vue3-simple-typeahead/dist/vue3-simple-typeahead.css";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import "vue3-timeline/dist/style.css";
import "@/plugins/axios";
import store from "@/store/index";

import VueFeather from "vue-feather";
import VueApexCharts from "vue3-apexcharts";
import { quillEditor } from "vue3-quill";
import Lightbox from "vue-easy-lightbox";
import rate from "vue-rate";
import VueNumber from "vue-number-animation";
import Multiselect from "vue-multiselect";
import AosVue from "aos-vue";
import SimpleTypeahead from "vue3-simple-typeahead";
import { VueMasonryPlugin } from "vue-masonry";
import { plugin } from "vue3-timeline";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import { VueMaskDirective } from "v-mask";

createApp(App)
  .use(router)
  .use(store)
  .use(createPinia())
  .use(VueApexCharts)
  .use(quillEditor)
  .use(rate)
  .use(AosVue)
  .use(VueMasonryPlugin)
  .use(Lightbox)
  .use(VueNumber)
  .use(plugin)
  .use(PerfectScrollbar)
  .use(SimpleTypeahead)
  .component(VueFeather?.name || "", VueFeather)
  .component("multiselect", Multiselect)
  .directive("mask", VueMaskDirective)
  .mount("#app");
