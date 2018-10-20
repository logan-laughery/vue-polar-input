import Vue from "vue";
import PolarInput from "./PolarInput.vue";

const Components = {
  PolarInput,
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;
