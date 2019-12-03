<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a id="nav_home" class="navbar-brand" style="color:white;" v-on:click="goto_home()">Bakery Web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme" style="font-weight:bold;">
        <span style="color: #4463DC;">{{this.store_name}}</span>
        <span>매장 제품 확인하기</span>
      </h5>
      <md-button class="md-accent" v-on:click="goto_store()">이전 페이지</md-button>

      <div class="row">

        <div class="col-sm-6 border border-success rounded" style="margin-bottom:20px; padding-bottom:15px;">
          <h6 class="text-center">제일 많이 팔린 빵</h6>
          <hooper :itemsToShow="3" :infiniteScroll="true" :centerMode="true" :autoPlay="true" :playSpeed="2000">
            <slide v-for="(slide, indx) in this.recommend_by_sell" :key="indx" :index="indx">
                <img :src="slide.rImg" style="height:80%; width:100%; padding:10px; border-radius:1rem;">
                <p class="text-center recommend"><span class="font-weight-bold">{{indx + 1}} 위<br>{{slide.rName}}</span></p>
            </slide>
          </hooper>
        </div>


        <div class="col-sm-6 border border-primary rounded" style="margin-bottom:20px; padding-bottom:15px;">
          <h6 class="text-center">{{this.current_time_zone}}에 많이 팔려요</h6>
          <hooper :itemsToShow="3" :infiniteScroll="true" :centerMode="false" :autoPlay="true" :playSpeed="2000">
            <slide v-for="(slide, indx) in this.recommend_by_sell" :key="indx" :index="indx">
                <img :src="slide.rImg" style="height:80%; width:100%; padding:10px; border-radius:1rem;">
                <p class="text-center recommend"><span class="font-weight-bold">{{indx + 1}} 위<br>{{slide.rName}}</span></p>
            </slide>
          </hooper>
        </div>


      </div>


      <div class="grid-container" style="margin-top:20px;">
        <div id="app">
          <reactive-base app="bakery_product" class="base" credentials="rucxxdjm3:7d5fd3b6-f237-4c31-ad2b-5ab5ff3b3ae2">
            <div class="search-filter">
              <multi-list componentId="Category" dataField="pCategory.keyword" class="filter" title="카테고리를 선택" selectAllLabel="모두"
              :defaultQuery="this.defaultQuery" />
            </div>

            <reactive-list componentId="SearchResult" dataField="_id"  class="products" :showResultStats="false"
            :pagination="true" :from="0" :size="3" :react="{and: ['Category']}" :defaultQuery="this.defaultQuery">
              <div slot="renderData" slot-scope="{ item }">
                <div class="flex book-content" key="item._id">
                  <img :src="item.pImg" alt="Image" class="book-image" />
                  <div class="flex column justify-center ml20">

                    <div style="font-weight:bold; margin-bottom:10px;">{{ item.pName }}</div>
                    <div style="color:gray; font-size:smaller;">{{item.pDescription}}</div>
                    <table style="margin-bottom:5px; width:300px;">
                      <tr>
                        <td style="color: #4463DC;">[가격]</td>
                        <td>{{ item.pPrice }}</td>
                        <td style="color:blue;"><button class="btn btn-sm" style="font-weight:bold; color:red;" v-on:click="get_amount(item._id)">매장수량 확인</button></td>
                        <td id="amount_place" v-if="(get_now_id()==item._id) && (get_click_type() == 1)"></td>
                      </tr>
                    </table>

                    <div style="margin-bottom:5px; margin-top:5px;" class="input-group mb-3">
                      <div class="input-group-append">
                        <button type="button" class="btn btn-warning btn-sm" v-on:click="cart_clicked(item._id)">카트 추가</button>
                        <div class="input-group-append" style="margin-left:5px;" v-if="(get_now_id()==item._id) && (get_click_type() == 2)">
                          <input type="number" v-model="user_amount" placeholder="수량" style="width:50px;">
                          <button type="button" class="btn" v-on:click="add_cart(item._id, item.pName, item.pPrice, item.pImg)">추가</button>
                        </div>
                      </div>
                      <button type="button" class="btn btn-sm btn-danger" v-on:click="delete_cart(item.pName)">카트 삭제</button>
                    </div>


                  </div>
                </div>
              </div>
            </reactive-list>

          </reactive-base>
        </div>

        <div class="cart border-top">
          <div>
            <h4 style="font-weight: bold;">나의 장바구니</h4>
            <div>
              <md-button class="md-raised md-dense md-accent" v-on:click="cart_reset()">비우기</md-button>
              <md-button class="md-raised md-dense" style="background-color:#44DC72;" v-on:click="goto_pay()">예약하기</md-button>
            </div>

            <div style="margin-top:5px; font-weight:bold;">
              현재 금액: {{this.tot_price}}원
            </div>

            <div style="margin-top:20px;">
              <div v-if="this.cart_name.length == 0">장바구니가 비어있습니다.</div>
              <table id="cart_lists" style="width:200px;"></table>
            </div>

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
import 'vue-material/dist/vue-material.min.css'
import { Hooper, Slide } from 'hooper';
import 'hooper/dist/hooper.css';



function leadingZero(n, digits){
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
        zero += '0';
    }
    return zero + n;
}

function gethh(){

  const today = new Date();
  var hh = today.getHours()
  if(hh == 0){
    hh = 24
  }
  return hh
}

const buildSlideMarkup = (array) => {
  console.log("buildmarkup")
  console.log(array.length)
  let slideMarkup = '';
  for (var i = 0; i <= array.length; i++) {

    //var rImg = array[i].rImg;
  	slideMarkup += '<slide><img src="'+" "+'" alt="dd" style="width: 300px; max-width: 100%;"></slide>'
  }
  this.slideMarkup = slideMarkup;
  //return slideMarkup;
};

export default {
  name: 'Product',
  data() {
    return {
      manager_id: '',
      store_name: '',
      now_id: '',
      user_amount: null,
      cart_name: [],
      cart_amount: [],
      cart_price:[],
      cart_img: [],
      now_tot_amount: 0,
      click_type: 0,
      recommend_by_time: [],
      recommend_by_sell: [],
      tot_price: 0,
      slideMarkup: null,
      current_time_zone: '',
      today : null
    };
  },
  components: {
    Hooper,
    Slide
  },

  created() {
    var serverhh = parseInt(gethh(), 10) // get only server time hours
    var currentDate = new Date();
    var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    this.today = currentDateWithFormat;
    this.manager_id = this.$session.get('managerId');

    if(6 <= serverhh && serverhh < 12){
      this.current_time_zone = "아침"
    }
    else if(12<= serverhh && serverhh < 18){
      this.current_time_zone = "점심"
    }
    else{
      this.current_time_zone = "저녁"
    }

    axios({
        method: 'POST',
        url: baseurl + '/bakery_manager/_mget',
        headers: {
          Authorization: 'Basic V1E3M0ZKMk1lOjkzZWJiNjNlLWE1MWMtNDJmNS04YjhlLTY5YzBjNjY0YjdkMw==',
          'Content-Type': 'application/json'
        },
        data: {
          "docs": [{
            "_id": this.manager_id,
          }, ]
        }
      })
      .then((response) => {
        console.log(response);
        this.store_name = response.data.docs[0]._source.storeName;

      }).catch((e) => {
        console.log(e.response)
      })
  },

  mounted(){
    //VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==
    axios({
      method: 'POST',
      url: baseurl+'/bakery_record/_search',
      headers: {
          Authorization: 'Basic VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==',
          'Content-Type': 'application/json'
      },
      data: {
        'size': 100, //가져올 레코드 갯수
        'query':{
          'bool':{
            'must':[
              {'match_phrase':{ 'rManagerID':this.manager_id}},
            ]
          }
        }
      }
    }).then((response) => {
      console.log("mounted response")
      console.log(response)
      var regex = /[\:\-\ ]/gi // :, -, 공백 제거 정규식

      var data = response.data.hits.hits

      //console.log(data)
      var recommend_array = new Array()
      var recommend_by_time_array = new Array()


      for(var i in data){

        var rDetail = data[i]._source.rDetail

        for(var j in rDetail){
          var recommend_base_data = new Object()
          // rName + rAmount + rDate => create new json object
          recommend_base_data.rName = rDetail[j].rName
          recommend_base_data.rAmount = rDetail[j].rAmount
          recommend_base_data.rImg = rDetail[j].rImg
          recommend_base_data.rDate = data[i]._source.rDate
          // push to new json array
          recommend_array.push(recommend_base_data)

          var hh = parseInt(data[i]._source.rDate.replace(regex, "").substring(8, 10), 10) // get only record hours
          var serverhh = parseInt(gethh(), 10) // get only server time hours

          if(6 <= serverhh && serverhh < 12){
            //console.log("6~12시")
            if(6<= hh && hh < 12){
              recommend_by_time_array.push(recommend_base_data)
            }
          }
          else if(12<= serverhh && serverhh < 18){
            //console.log("12~18시")
            if(12<= hh && hh < 18){
              recommend_by_time_array.push(recommend_base_data)
            }
          }
          else{
            //console.log("18시~6시")
            if(18 <= hh || hh < 6){
              recommend_by_time_array.push(recommend_base_data)
            }
          }
        }
      }
      //this.current_recommend_array = recommend_by_time_array
      console.log("recommend_array")
      console.log(recommend_array)

      console.log("recommend_by_time_array")
      console.log(recommend_by_time_array)
      //recommend array = array of { rName : value, rAmount : value, rDate : value }

      //////////////get best seller result json (reduce recommend array)
      var best_seller_result = [];
      recommend_array.reduce(function(res, value){
        if(!res[value.rName]){
          res[value.rName] = {rName: value.rName, rAmount : 0, rImg : value.rImg};
          best_seller_result.push(res[value.rName])
        }
        res[value.rName].rAmount += (value.rAmount*1);
        return res;

      }, {});
      //console.log(best_seller_result)
      //같은 이름끼리 json 합 구하기

      //내림차순 정렬
      //console.log("AFTER SORT")
      best_seller_result = best_seller_result.sort((a, b) => b.rAmount*1 - a.rAmount*1)
      this.recommend_by_sell = best_seller_result.slice(4)
      console.log("after reduce and sort")
      for(var key in this.recommend_by_sell){
        console.log(key + "=> rName : "+this.recommend_by_sell[key].rName+" rAmount : "+this.recommend_by_sell[key].rAmount + " rImg : "+ this.recommend_by_sell[key].rImg)
      }
      //////// 베스트셀러 구하기 끝

      /////시간대 별 추천 목록 합치기
      var recommend_by_time_result = [];
      recommend_by_time_array.reduce(function(res, value){
        if(!res[value.rName]){
          res[value.rName] = {rName: value.rName, rAmount : 0, rImg : value.rImg};
          recommend_by_time_result.push(res[value.rName])
        }
        res[value.rName].rAmount += (value.rAmount*1);
        return res;

      }, {});
      recommend_by_time_result = recommend_by_time_result.sort((a, b) => b.rAmount*1 - a.rAmount*1)
      //시간대별 추천 목록 정리 끝
      this.recommend_by_time = recommend_by_time_result.slice(4)
      console.log("after reduce and sort")
      console.log(this.recommend_by_time)
      for(var key in this.recommend_by_time){
        console.log(key + "=> rName : "+this.recommend_by_time[key].rName+" rAmount : "+this.recommend_by_time[key].rAmount + " rImg : "+ this.recommend_by_time[key].rImg)
      }

      buildSlideMarkup(best_seller_result)
      //buildSlideMarkup(this.recommend_by_time)

    }).catch((ex)=>{
      console.log(ex)
    })

  },

  methods: {

    goto_home() {
      this.$router.replace('/home');
    },
    goto_store() {
      this.$router.replace('/store');
    },

    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            pManagerID: this.manager_id
          }
        }
      }
    },
    cart_clicked(id) {
      this.now_id = id;
      this.click_type = 2;
    },

    get_now_id() {
      return (this.now_id);
    },

    get_click_type(){
      return(this.click_type);
    },

    add_cart(id, name, price, img) {
      console.log("카트추가ㅣ")
      if (this.user_amount <= 0) {
        alert("양수를 입력해주세요!");
      } else {
        var a = this.cart_name.indexOf(name);

        if (a == -1) {
          // newly add
          this.cart_name.push(name);
          this.cart_amount.push(this.user_amount);
          this.cart_price.push(price);
          this.cart_img.push(img);
          alert("추가되었습니다");
        } else {
          // change amount
          this.cart_amount[a] = this.user_amount;
          alert("수량 변경되었습니다");
        }

        this.user_amount = null;

        var html = '';

        html += '<table><tr><td style="font-weight:bold; color:blue;">제품명</td><td style="font-weight:bold; color:blue;">수량</td></tr>';
        var temp_price = 0;

        for (var i = 0; i < this.cart_name.length; i++) {
          html += '<tr><td>';
          html += this.cart_name[i];
          html += '</td><td>';
          html += this.cart_amount[i];
          html += '</td></tr>';

          // get tot_price
          temp_price += (this.cart_price[i]*this.cart_amount[i]);
        }

        html += '</table>';

        document.getElementById("cart_lists").innerHTML = html;
        this.tot_price = temp_price;
      }

    },

    cart_reset() {
      this.cart_name = [];
      this.cart_amount = [];
      this.cart_price = [];
      this.cart_img = [];
      this.tot_price = 0;
      document.getElementById("cart_lists").innerHTML = '';
    },

    delete_cart(name) {
      // check if in cart
      var i = this.cart_name.indexOf(name);

      if (i == -1) {
        alert("카트에 없습니다");
      } else {
        this.cart_name.splice(i, 1);
        this.cart_amount.splice(i, 1);
        this.cart_price.splice(i, 1);

        // update cart
        var html = '';
        var temp_price = 0;

        if (this.cart_name.length == 0) {
          html = '비어있습니다';
        } else {
          html += '<table>';

          for (var i = 0; i < this.cart_name.length; i++) {
            html += '<tr><td>';
            html += this.cart_name[i];
            html += '</td><td>';
            html += this.cart_amount[i];
            html += '</td></tr>';

            // get tot_price
            temp_price += (this.cart_price[i]*this.cart_amount[i]);
          }

          html += '</table>';
        }

        document.getElementById("cart_lists").innerHTML = html;
        this.tot_price = temp_price;
      }
    },

    goto_pay() {
      if (this.cart_name.length != 0) {
        // make cart array (JSON object array)
        var arr = '[';

        for (var i = 0; i < this.cart_name.length; i++) {
          arr += '{ "pName" : "';
          arr += this.cart_name[i];
          arr += '", "pAmount" : "';
          arr += this.cart_amount[i];
          arr += '", "pPrice" : "';
          arr += this.cart_price[i];
          arr += '", "pImg" : "';
          arr += this.cart_img[i];

          if (i != (this.cart_name.length - 1)) {
            arr += '" },';
          } else {
            arr += '" }]';
          }
        }

        var arr_final = JSON.parse(arr);
        this.$session.set('cart_array', arr_final);
        this.$session.set('cart_price', this.tot_price);

        this.$router.replace('/pay');
      } else {
        alert("장바구니가 비어있습니다!");
      }
    },

    get_amount(id){
      this.click_type = 1;
      this.now_id = id;

      // get total amount
      axios({
          method: 'POST',
          url: baseurl + '/bakery_product/_mget',
          headers: {
            Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
            'Content-Type': 'application/json'
          },
          data: {
            "docs": [{
              "_id": id,
            }, ]
          }
        })
        .then((response) => {
          //console.log(response);
          var detail = response.data.docs[0]._source.pDetail;
          var tot = 0;
          // do not count if expirationDate is over
          var part;
          var parts = this.today.split('-');
          var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
          for (var i = 0; i < detail.length; i++) {
            part = (detail[i].pExpirationDate).split('-');
            part = new Date(part[0], part[1] - 1, part[2]);
            if (part.getTime() < mydate.getTime()) {
              continue;
            }
            tot += parseInt(detail[i].pAmount);
          }

          this.now_tot_amount = tot;

          document.getElementById("amount_place").innerHTML = tot;

        }).catch((e) => {
          console.log(e.response)
        })
    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');
@import url('https://fonts.googleapis.com/css?family=Single+Day&display=swap');
@import 'bootstrap.css';

.grid-container {
  display: grid;
  grid-template-areas:
    'app'
    'cart';
}
.recommend {
  font-family: 'Noto Sans KR', sans-serif;
}

.base{
  display: grid;
  grid-template-areas:
  'search-filter products products';
}

.container {
  width: auto;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}

.container {
  font-family: 'Noto Sans KR', sans-serif;
}

.small-title {
  color: #425DC6;
  font-weight: bold;
}

.products {

  right: 0;

  overflow-y: scroll;
  height: 65vh;
  display: grid;
  grid-area: products;
  flex-direction: column;
  scroll-behavior: smooth;
  transition: all ease 0.2s;
}

.search-filter {
  display: grid;
  grid-area:filters-container;
  grid-area: search-filter;
  flex-direction: column;
  margin-left:10px;
  margin-right:50px;
  top: 100px;
}

.cart {
  grid-area: cart;
  display: grid;
  background-color: white;
  margin-bottom: 50px;
}

#app {
  display: grid;
  grid-area: app;
  right:0;
  grid-template-areas:
  'base';
}

.text-center{
  font-weight: bold;
  color: #3661C6;
}
</style>
