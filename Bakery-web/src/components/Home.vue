<template>
<div class="outer">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="page-header">
          <h1 id="theme">Bakery Web</h1>
          <p id="description" class="lead">
            <font color="black">
              환영합니다! <span style="font-weight:bold;">{{this.uName}}</span>님!<br><br>
              <h6>
                [매장 찾기]에서 원하시는 매장을 선택하고 매장의 제품 정보를 확인해보세요.<br>
                매장 맞춤 빵 추천 기능과 온라인 예약 기능을 추가적으로 이용할 수 있습니다.<br><br>
                [마이페이지]에서 회원 정보를 확인하세요.<br>
                베이커리 코인을 충전하실 수도 있습니다.<br>
              </h6>
            </font>
          </p>

          <div class="btn-lists">
            <button class="btn btn-warning" v-on:click="goto_store()">매장 찾기</button>
            <button class="btn btn-warning" v-on:click="goto_mypage()">마이페이지</button><br>
            <md-button class="md-accent" v-on:click="logout()" style="font-weight:bold; margin-top:5px;">로그아웃</md-button>
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
    logout(){
      this.$session.destroy();
      alert("로그아웃 되셨습니다.");
      this.$router.replace('/');
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
