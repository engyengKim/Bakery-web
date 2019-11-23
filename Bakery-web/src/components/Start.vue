<template>
<div class="outer">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="page-header">
          <h1 id="theme">Bakery Web</h1><br>
          <p id="description" class="lead">
            <font color="black">
              <h6>매장의 제품의 종류와 수량을 확인할 수 있습니다.<br>
                고객 맞춤형 제품 추천과 온라인 예약 기능을 이용해보세요.</h6><br>
              <h6 style="font-weight:bold">로그인을 해주십시오</h6>
            </font>
          </p>

          <div>
            <md-button type="button" class="md-accent md-raised" v-on:click="login()">로그인</md-button>
            <md-button class="md-raised md-primary" style="background-color:#59BE84" v-on:click="signup()">등록</md-button>
          </div>
        </div>
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
  name: 'Start',
  data() {
    return {

    };
  },

  created() {

  },

  methods: {
    login() {
      this.$router.replace('/login');
    },

    signup() {
      this.$router.replace('/signup');
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');
@import url('https://fonts.googleapis.com/css?family=Luckiest+Guy|Noticia+Text&display=swap');
@import 'bootstrap.css';

.outer{
  background: url("../assets/bakery_background.jpg");
  height: 100%;
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
  font-family: 'Noto Sans KR', sans-serif;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
