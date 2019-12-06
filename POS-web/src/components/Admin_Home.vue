<template>
<div class="outer">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="page-header">
          <h1 id="theme">POS Web &<br> Bakery Web</h1>

          <p id="description" class="lead">
            <font color="black">
              <h3 style="margin-bottom:10px;">안녕하세요, 총괄 관리자님</h3>
              POS 웹과 BAKERY 웹에서 관리중인 고객 현황을 확인하세요
            </font>
          </p>

          <div style="margin-bottom:10px;">
            <button type="button" class="btn btn-danger" v-on:click="goto_mypage()">마이 페이지</button>
          </div>

          <div>
            <button type="button" class="btn btn-warning" v-on:click="goto_manage()">고객 현황 및 관리</button>
          </div>

          <md-button class="md-accent" v-on:click="logout()" style="font-weight:bold; margin-top:5px;">로그아웃</md-button>


        </div>
      </div>
    </div>

  </div>
</div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {}
  },

  created(){

    if(this.$session.get('type') != 'Admin'){

      this.$session.destroy();
      alert("관리자 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }
  },
  
  methods: {
    goto_manage() {
      this.$router.replace('/admin_manage')
    },
    goto_mypage(){
      this.$router.replace('/admin_mypage')
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
@import 'bootstrap.css';
@import url('https://fonts.googleapis.com/css?family=Luckiest+Guy|Noticia+Text&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');

.outer {
  background: url("../assets/bread_background.jpg");
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
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
  background-color: rgba(255, 255, 255, 0.8);
}

#theme {
  margin-top: 60px;
  font-family: 'Luckiest Guy', cursive;
}

#description {
  font-family: 'Noto Sans KR', sans-serif;
  margin-top: 20px;
}

.mypage_part {
}
</style>
