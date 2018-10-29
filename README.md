# vue-radar-input

## Install / Setup
Install with npm:
```
npm i --save @stout/vue-radar-input
```
Add to vue application (in main.js):
```
import '@stout/vue-radar-input';
```

## Usage
```
<template>
  <RadarInput
    v-model="values"
    :intervalCount="5"
    class="red-radar"
  />
</template>

<script>
export default {
  name: 'MyComponent',
  data: () => ({
    values: [
      {
        key: 'FIRST',
        value: 1,
      },
      {
        key: 'SECOND',
        value: 2,
      },
      {
        key: 'THIRD',
        value: 3,
      },
    ],
  }),
};
</script>

<style>
.red-radar .radar-highlight {
  fill: red;
  stroke: red;
  stroke-width: .5px;
}

.red-radar .radar-point {
  fill: red;
}
</style>
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
npm run bundle
```

## Publish
```
npm publish --access public
```

### Lints and fixes files
```
npm run lint
```
