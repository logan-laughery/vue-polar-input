import Vue from "vue";
import RadarInput from "./RadarInput.vue";

const Components = {
  RadarInput,
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;
