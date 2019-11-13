<template>
<div class="container-start">
  <div class="container">
    <div class="text-field">
      <h5 id="theme" style="color:red;">홈페이지</h5>

      <div class="welcome">
        환영합니다! {{this.uName}}님!
      </div>

      <button v-on:click="goto_store()">매장 찾기</button>
      <button v-on:click="goto_mypage()">마이페이지</button>

    </div>
  </div>
</div>
</template>


<script>
import "./style.css";
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Home',
  data() {
    return {
      uName: '',

    };
  },

  created() {
    this.uName = this.$session.get('uName');

  },

  methods: {
    goto_store(){
      this.$router.replace('/store');
    },
    goto_mypage(){
      this.$router.replace('/mypage');
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
