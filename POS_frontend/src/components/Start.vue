<template>
<div class="outer">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="page-header">
          <h1 id="theme">POS Web</h1><br><br>
          <p id="description" class="lead">
            <font color="black">
              <h3>Hi, store manager</h3><br>
              <h6>You have to login</h6>
            </font>
          </p>

          <div>
            <button type="button" class="btn btn-warning" v-on:click="goto_login()">Login</button>
          </div>
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
@import url('https://fonts.googleapis.com/css?family=Luckiest+Guy|Noticia+Text&display=swap');

.outer{
  background: url("../assets/bread_background.jpg");
  height: 600px;
  background-repeat: no-repeat;
  background-size:cover;
}

.crack {
  margin-bottom: 10px;
}

.page-header {
  text-align: center;
  width: 600px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 20px;
  background-color: rgba( 255, 255, 255, 0.6 );
}


#theme {
  margin-top: 60px;
  font-family: 'Luckiest Guy', cursive;
}


#description{
  font-family: 'Noticia Text', serif;
}


</style>
