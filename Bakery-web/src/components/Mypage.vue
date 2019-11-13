<template>
  <div class="container-start">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">Bakery Web</a>
    </nav>

    <div class="container">
      <div class="text-field">
        <h5 id="theme" style="color:red;">마이 페이지</h5>

        <div class="welcome">
          {{this.uName}}님의 개인정보
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import "./style.css";
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Mypage',
  data() {
    return {
      uName: '',
    };
  },

  created() {
    this.uName = this.$session.get('uName');
  },

  methods: {
    goto_home() {
      this.$router.replace('/home');
    },



  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');

</style>
