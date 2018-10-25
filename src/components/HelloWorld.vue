<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>
      Radar Input
    </h3>
    <RadarInput v-model="values">
    </RadarInput>
    <div>
      {{JSON.stringify(values)}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      values: [
        {
          key: 'FIRST',
          value: 3,
        },
        {
          key: 'SECOND',
          value: 3,
        },
        {
          key: 'THIRD',
          value: 3,
        },
        {
          key: 'FOURTH',
          value: 3,
        },
        {
          key: 'FIFTH',
          value: 3,
        },
        {
          key: 'SIXTH',
          value: 3,
        },
        {
          key: 'SEVENTH',
          value: 3,
        },
        {
          key: 'EIGTH',
          value: 3,
        },
      ],
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
