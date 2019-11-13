<template>
<div class="container-start">
  <div class="container">
    <div class="text-field">
      <h5 id="theme" style="color:red;">시작화면</h5>

      <button v-on:click="login()">로그인</button>
      <button v-on:click="signup()">등록</button>

    </div>
  </div>
</div>
</template>


<script>
import "./style.css";
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Start',
  data() {
    return {

    };
  },

  created() {

  },

  methods: {
    login(){
      this.$router.replace('/login');
    },

    signup(){
      this.$router.replace('/signup');
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');

.container {
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  width: auto;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}

.container {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
