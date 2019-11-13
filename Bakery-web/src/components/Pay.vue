<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a id="nav_home" class="navbar-brand" style="color:white;" v-on:click="goto_home()">Bakery Web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h4 id="theme" style="font-weight:bold;">결제 및 예약하기</h4>

      <div class="welcome" style="margin-top:10px; margin-bottom: 30px;">
        환영합니다. {{this.uName}}님
      </div>

      <div style="margin-bottom:20px;">
        <h5>장바구니 목록</h5>
        <md-button v-if="is_clicked() == false" class="md-dense md-raised" style="background-color:#44DC72;" v-on:click="show_cart()">장바구니 불러오기</md-button>
      </div>
      <table id="cart_lists_2" style="width:200px;"></table>


    </div>
  </div>
</div>
</template>


<script>
import "./style.css";
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Pay',
  data() {
    return {
      uName: '',
      cart_array: null,
      is_click: false,

    };
  },

  created() {
    this.uName = this.$session.get('uName');
    this.cart_array = this.$session.get('cart_array');

    var html = '<table>';
    for (var i = 0; i < this.cart_array.length; i++) {
      html += '<tr><td>';
      html += this.cart_array[i].pName;
      html += '</td><td>';
      html += this.cart_array[i].pAmount;
      html += '</td></tr>';
    }
    html += '</table>';

    //console.log(document.getElementById("cart_lists_2"));
    console.log(html);
    //document.getElementById("cart_lists_2").innerHTML = html;
  },

  methods: {
    goto_home() {
      this.$router.replace('/home');
    },
    is_clicked(){
      return(this.is_click);
    },

    show_cart() {
      this.is_click = true;

      var html = '<table><tr><td style="font-weight:bold; color:#4463DC;">제품명</td><td style="font-weight:bold; color:#4463DC;">수량</td></tr>';
      for (var i = 0; i < this.cart_array.length; i++) {
        html += '<tr><td>';
        html += this.cart_array[i].pName;
        html += '</td><td>';
        html += this.cart_array[i].pAmount;
        html += '</td></tr>';
      }
      html += '</table>';

      document.getElementById("cart_lists_2").innerHTML = html;
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
