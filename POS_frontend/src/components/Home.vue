<template>
<div class="outer">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="page-header">
          <h1 id="theme">POS Web</h1>

          <p id="description" class="lead">
            <font color="black">
              <h3>안녕하세요, 매장 관리자님</h3>
              저희는 매장 관리자의 운영/판매 작업을 위하여<br>
              다음 4가지의 시스템을 제공하고 있습니다<br><br>
              당신의 완벽한 비지니스 파트너가 되도록 노력하겠습니다<br>
            </font>
          </p>

          <div style="margin-bottom:10px;">
            <button type="button" class="btn btn-danger" v-on:click="goto_mypage()">마이 페이지</button>
          </div>

          <div>
            <button type="button" class="btn btn-warning" v-on:click="goto_stock()">재품 관리 시스템</button>
            <button type="button" class="btn btn-warning" v-on:click="goto_payment()">결제 시스템</button>
            <div class="crack"></div>
            <button type="button" class="btn btn-warning" v-on:click="goto_order()">예약 관리 시스템</button>
            <button type="button" class="btn btn-warning" v-on:click="goto_revenue()">매출 관리 시스템</button>
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
  methods: {
    goto_order() {
      this.$router.replace('/order')
    },
    goto_stock() {
      this.$router.replace('/inventory')
    },
    goto_payment() {
      this.$router.replace('/payment')
    },
    goto_revenue() {
      this.$router.replace('/revenue')
    },
    goto_mypage(){
      this.$router.replace('/my_page')
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
}

.mypage_part {
}
</style>
