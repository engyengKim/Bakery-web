<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a id="nav_home" class="navbar-brand" style="color:white;" v-on:click="goto_home()">Bakery Web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h4 id="theme" style="font-weight:bold;">결제 및 예약하기</h4>

      <div class="welcome" style="margin-top:10px; margin-bottom: 5px;">
        환영합니다. {{this.uName}}님
      </div>

      <div style="margin-bottom:10px;">
        <md-button class="md-accent" v-on:click="goto_product()">이전 페이지</md-button>
      </div>

      <div class="card border-info mb-3" style="max-width: 30rem;">
        <div class="card-header">장바구니 목록</div>
        <div class="card-body">
          <div>
            <md-button v-if="is_clicked() == false" class="md-dense md-raised" style="background-color:#44DC72;" v-on:click="show_cart()">장바구니 불러오기</md-button>
          </div>
          <table id="cart_lists_2" style="width:400px;"></table>
        </div>
      </div>

      <div style="margin-left:auto; margin-right:auto;">
        <md-dialog :md-active.sync="showDialog">
          <md-dialog-title>장바구니 목록 예약/결제하기</md-dialog-title>

          <md-tabs md-dynamic-height>

            <md-tab md-label="나의 베이커리 코인 확인">
              <div class="form-group">
                <div style="font-weight: bold;"><span style="color:blue;">{{this.uName}}</span>님의 베이커리 코인 금액</div>
                <div style="font-size: x-large; color:red; font-weight:bold; margin-top:10px;">{{this.user_coin}}</div>
              </div>
            </md-tab>

            <md-tab md-label="예약 정보 설정">
              <table style="width:400px; background-color:#E6E5D9; border-radius: 10px;">
                <tr>
                  <td style="font-weight:bold; padding:5px;">매장 이름</td>
                  <td style="padding:5px;">{{this.store_name}}</td>
                  <td style="font-weight:bold; padding:5px;">연락처</td>
                  <td style="padding:5px;">{{this.store_contact}}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold; padding:5px;">매장 주소</td>
                  <td style="padding:5px;">{{this.store_location}}</td>
                </tr>
              </table>

              <div class="form-group" style="margin-top:20px;">
                <div class="input-group mb-3" style="width:250px;">
                  <span style="font-weight: bold; margin-right:5px;">방문 날짜</span>
                  <input type="date" v-model="new_visitDate" class="form-control">
                </div>
                <div class="input-group mb-3">
                  <span style="font-weight: bold; margin-right:5px;">요구 사항</span>
                  <input type="text" v-model="new_request" class="form-control" placeholder="요구 사항">
                </div>
              </div>
            </md-tab>

          </md-tabs>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog = false">취소</md-button>
            <md-button class="md-accent" @click="pay()">결제</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-button class="md-accent md-raised" @click="showDialog = true" style="font-weight:bold;">예약하기</md-button>
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
  name: 'Pay',
  data() {
    return {
      uName: '',
      uid: '',
      cart_array: null,
      is_click: false,
      tot_price: 0,
      showDialog: false,
      user_coin: null,
      today: '',

      new_request: '',
      new_visitDate: null,

      store_name: '',
      store_location: '',
      store_contact: '',
      manager_id: '',

    };
  },

  created() {
    this.uName = this.$session.get('uName');
    this.uid = this.$session.get('uId');
    this.tot_price = this.$session.get('cart_price');
    this.cart_array = this.$session.get('cart_array');

    // get now store info.
    this.manager_id = this.$session.get('managerId');
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
        this.store_location = response.data.docs[0]._source.address;
        this.store_contact = response.data.docs[0]._source.contact;

        axios({
            method: 'POST',
            url: baseurl + '/bakery_customer/_mget',
            headers: {
              Authorization: 'Basic anhaMFFSQzdhOjhlNDhjYzhlLWUxNmUtNDNiNy1hZjUyLTkzODBkZmU1NDVhNA==',
              'Content-Type': 'application/json'
            },
            data: {
              "docs": [{
                "_id": this.uid,
              }, ]
            }
          })
          .then((response) => {
            console.log(response);
            this.user_coin = response.data.docs[0]._source.bakeryCoin;

          }).catch((e) => {
            console.log(e.response)
          })
      }).catch((e) => {
        console.log(e.response)
      })

  },

  methods: {
    goto_home() {
      this.$router.replace('/home');
    },
    goto_product() {
      var is_go = confirm("장바구니 목록이 저장되지 않습니다. 이전 페이지로 가시겠습니까?");
      if (is_go) {
        this.$router.replace('/product');
      }
    },
    is_clicked() {
      return (this.is_click);
    },

    show_cart() {
      this.is_click = true;

      var html = '<table><tr><td style="font-weight:bold; color:#4463DC;">제품명</td><td style="font-weight:bold; color:#4463DC;">수량</td><td style="font-weight:bold; color:#4463DC;">단품 가격</td></tr>';
      for (var i = 0; i < this.cart_array.length; i++) {
        html += '<tr><td>';
        html += this.cart_array[i].pName;
        html += '</td><td>';
        html += this.cart_array[i].pAmount;
        html += '</td><td>';
        html += this.cart_array[i].pPrice;
        html += '</td></tr>';
      }
      html += '<tr><td style="font-weight:bold; padding-top:10px;">총 금액</td><td style="font-weight:bold; color:red; padding-top:10px;">';
      html += this.tot_price;
      html += '</td></tr>';
      html += '</table>';

      document.getElementById("cart_lists_2").innerHTML = html;
    },

    leadingZeros(n, digits) {
      var zero = '';
      n = n.toString();

      if (n.length < digits) {
        for (var i = 0; i < digits - n.length; i++)
          zero += '0';
      }
      return zero + n;
    },

    pay() {
      // // get today
      var d = new Date();
      var s =
        this.leadingZeros(d.getFullYear(), 4) + '-' +
        this.leadingZeros(d.getMonth() + 1, 2) + '-' +
        this.leadingZeros(d.getDate(), 2) + ' ' +

        this.leadingZeros(d.getHours(), 2) + ':' +
        this.leadingZeros(d.getMinutes(), 2) + ':' +
        this.leadingZeros(d.getSeconds(), 2);

      this.today = s;
      console.log(this.today);

      // set aoDetail
      if (this.tot_price <= this.user_coin) {
        var temp_arr = '[';
        for (var i = 0; i < this.cart_array.length; i++) {
          temp_arr += '{ "aoAmount" : "';
          temp_arr += this.cart_array[i].pAmount;
          temp_arr += '", "aoProduct" : "';
          temp_arr += this.cart_array[i].pName;
          if (i != this.cart_array.length - 1) {
            temp_arr += '" },';
          } else {
            temp_arr += '" }]';
          }
        }

        alert(temp_arr);

        // axios write Advance Order
        axios({
            method: 'POST',
            url: baseurl + '/bakery_advancedorder/_doc/',
            headers: {
              Authorization: 'Basic aGt6d0l3MUVtOmI0MDJjZTU2LTliNjEtNDAyMS05OTdjLTliODU3Mzc5NDAxYg==',
              'Content-Type': 'application/json'
            },

            data: {
              "aoCustomer_id": this.uid,
              "aoDetail": JSON.parse(temp_arr),
              "aoManager_id": this.manager_id,
              "aoRequestContent": this.new_request,
              "aoReservationTime": this.today,
              "aoResult": "대기중",
              "aoVisitDate": this.new_visitDate,
              "aoCustomer_name": this.uName,
            }
          })
          .then((response) => {
            console.log(response);

            // update coin
            var temp_coin = this.user_coin - this.tot_price;
            axios({
                method: 'POST',
                url: baseurl + '/bakery_customer/_doc/' + this.uid + '/_update',
                headers: {
                  Authorization: 'Basic anhaMFFSQzdhOjhlNDhjYzhlLWUxNmUtNDNiNy1hZjUyLTkzODBkZmU1NDVhNA==',
                  'Content-Type': 'application/json'
                },
                data: {
                  'doc': {
                    'bakeryCoin': temp_coin,
                  }
                }
              })
              .then((response) => {
                console.log(response);
                alert("결제 및 예약되었습니다");
                this.$router.replace('/product');

              }).catch((e) => {
                console.log(e.response)
              })
          }).catch((e) => {
            console.log(e.response)
          })

      } else {
        alert("코인이 부족합니다!");
      }

    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';
@import 'vue-material/dist/vue-material.min.css';
@import 'vue-material/dist/theme/default.css';
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
