<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="page-header">
        <h1 id="theme">POS Web</h1><br><br>
        <p id="description" class="lead">
          <font color="black">
            <h3>Hi, store manager</h3>
          </font>
        </p>

        <div>
          <font color="black">
            <p>You have to login</p>
          </font>
        </div><br>

        <div>
          <button type="button" class="btn btn-warning" v-on:click="goto_login()">Login</button>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'Start',
  data() {
    return {}
  },
  methods: {
    goto_login() {
      this.$router.replace('/login')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';

.crack {
  margin-bottom: 10px;
}

.page-header {
  text-align: center;
}

#theme {
  padding-top: 60px;
}
</style>
