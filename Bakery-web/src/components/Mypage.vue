<template>
  <div class="container-start">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a id="nav_home" class="navbar-brand" style="color:white;" v-on:click="goto_home()">Bakery Web</a>
    </nav>

    <div class="container">
      <div class="text-field">
        <h5 id="theme" style="font-weight:bold;">마이 페이지</h5>

        <div class="welcome">
          {{this.uName}}님의 개인정보를 확인하세요
        </div>

        <table class="info-list" style="width:300px;">
          <tr>
            <td>이름</td>
            <td>{{this.uName}}</td>
            <td>바코드</td>
            <td>{{this.barcode}}</td>
          </tr>

        </table>


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
      barcode: '',
      bakery_coin: 0,
      contact: '',
      email: '',
      addr: '',
      pwd: '',
      coupon_lists: null,
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
@import 'bootstrap.css';

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
