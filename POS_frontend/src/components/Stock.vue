<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5>Stock management system</h5>

    </div>

  </div>
</div>
</template>


<script>
export default {
  name: 'Stock',
  data() {
    return {}
  },
  methods: {
    goto_home() {
      this.$router.replace('/')
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';

.container {
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  width: auto;
}

#nav_home{
  color: white;
}

.text-field{
  margin-left: 40px;
  margin-top: 40px;
}
</style>
