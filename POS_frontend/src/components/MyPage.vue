<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">마이 페이지</h5>

      <div class="description">
        <h6 style="margin-top: 40px; margin-bottom:15px;">[매니저 정보]</h6>
        매니저 이름: <div class="crack"/>
        매니저 이메일: <div class="crack"/>
        매니저 비밀번호:
        <span>
          <md-button class="md-accent md-raised md-dense">비밀번호 변경</md-button>
        </span><br>
        매니저 계좌번호: <div class="crack"/>

        <h6 style="margin-top: 30px; margin-bottom:15px;">[가게 정보]</h6>
        가게 이름:
        <span>
          <md-button class="md-accent md-raised md-dense">가게 이름 변경</md-button>
        </span><div class="crack"/>
        가게 주소:
        <span>
          <md-button class="md-accent md-raised md-dense">주소 변경</md-button>
        </span><div class="crack"/>



      </div>

    </div>

  </div>
</div>
</template>


<script>
import "./style.css";
import 'vue-material/dist/vue-material.min.css'
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'



export default {
  name: 'Stock',
  data() {
    return {

    };
  },
  methods: {
    goto_home() {
      this.$router.replace('/home')
    }


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');
@import url('https://fonts.googleapis.com/css?family=Nanum+Gothic&display=swap');

.container {
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  width: auto;
}

#nav_home {
  color: white;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}


.container {
  font-family: 'Noto Sans KR', sans-serif;
}

.crack{
  margin-bottom: 10px;
}

</style>
