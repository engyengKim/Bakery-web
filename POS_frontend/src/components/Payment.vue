<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">

      <div class="grid-container">
        <div class="item1">
          <h6 id="theme">결제할 품목</h6>
          <md-button class="md-raised md-accent" v-on:click="reset()">초기화</md-button>
          <div id="lists"></div>


        </div>

        <div class="item2">
          <reactive-base app="bakery_product" credentials="rucxxdjm3:7d5fd3b6-f237-4c31-ad2b-5ab5ff3b3ae2">
            <div class="item5">
              <single-list componentId="Category" dataField="pCategory.keyword" class="filter" title="카테고리 선택" selectAllLabel="모두" :showSearch="false"
              :showCount="false" :defaultQuery="this.defaultQuery" />
            </div>

            <reactive-list componentId="SearchResult" dataField="pName" className="item6" :showResultStats="false" :pagination="true" :from="0" :size="5"
            :react="{and: ['Category']}" :defaultQuery="this.defaultQuery">
              <div slot="renderData" slot-scope="{ item }">
                <div class="flex book-content" key="item._id">
                  <div class="fSlex column justify-center ml20">
                    <md-button v-on:click='get_name(item.pName, item.pPrice, item._id)'>{{ item.pName }}</md-button>
                    <span>
                      <font style="color:gray;">{{item.pPrice}}</font>
                    </span>

                    <div class="buttons-inline" style="display:inline;">
                      <md-button class="md-icon-button md-raised md-dense md-accent" v-on:click="delete_product(item.pName, item.pPrice)">X</md-button>
                      <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="edit_clicked(item.pName)">수정</md-button>
                    </div>


                    <form v-if="(get_now_name() == item.pName) && is_clicked" class="form-inline">
                      <div class="form-group mx-sm-3 mb-2">
                        <input type="user_amount" v-model="user_amount" class="form-control" id="input_amount">
                      </div>
                      <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="change_amount(item.pName, item.pPrice)">확인</md-button>
                    </form>

                  </div>
                </div>
              </div>
            </reactive-list>
          </reactive-base>
        </div>


        <div class="item3">
          <h6 id="theme">총 금액</h6>
          <div class="price_result">{{this.tot_price}}</div>
        </div>


        <div class="item4">
          <h6 id="theme">거래 진행 및 취소</h6>

          <span>
            <md-dialog :md-active.sync="showDialog">
              <md-dialog-title>결제 창</md-dialog-title>

              <md-tabs md-dynamic-height>
                <md-tab md-label="현금">
                  <div style="font-weight:bold;">가격: {{this.tot_price}}</div>
                  <span>받은 돈</span>
                  <input type="user_money" v-model="user_money" class="form-control">
                  <md-button class="md-accent md-dense md-raised" @click="got_money()">현금 받음</md-button>
                  <p v-if="remain" style="color:red; font-weight:bold; font-size:20px;">잔돈: {{this.remain}}</p>
                </md-tab>

                <md-tab md-label="베이커리 코인">
                  <div style="font-weight:bold;">가격: {{this.tot_price}}</div>
                  <span>사용자 바코드</span>
                  <input type="user_barcode" v-model="user_barcode" class="form-control">
                  <md-button class="md-accent md-dense md-raised" @click="check_creidt()">결제</md-button>
                </md-tab>

              </md-tabs>

              <md-dialog-actions>
                <md-button class="md-primary" @click="close_pay()">닫기</md-button>
                <md-button class="md-primary" @click="pay()">완료</md-button>
              </md-dialog-actions>
            </md-dialog>

            <md-button class="md-primary md-raised" @click="showDialog = true">결제</md-button>
          </span>


          <md-dialog-confirm :md-active.sync="active" md-title="결제를 취소하시겠습니까?" md-content="확인을 누르시면, 결제 창이 초기화됩니다" md-confirm-text="확인" md-cancel-text="취소" @md-cancel="onCancel" @md-confirm="close_pay" />
          <md-button class="md-primary md-raised" @click="active = true">취소</md-button>
        </div>
      </div>



    </div>

  </div>
</div>
</template>


<script>
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Payment',
  data() {
    return {
      product_name: '',
      product_list: [],
      product_amount: [],
      product_price: [],
      product_id: [],

      now_product_name: '',
      is_clicked: false,
      active: false,
      showDialog: false,
      tot_price: 0,
      remain: null,
      ok_pressed: false,
      gift_number: null,
      is_remain: false,
      is_partial_pay: false,

      buying_date: null,
      buying_store: null,
      buying_manager: null,

      user_barcode: null,
      user_money: null,
      user_amount: null,
      user_name: null,


    }
  },

  created() {

    console.log("type:" + this.$session.type)
    if (this.$session.get('type') != 'Manager') {
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    this.uid = this.$session.get('uId');

    // axios POST
    axios({
        method: 'POST',
        url: baseurl + '/bakery_manager/_mget',
        headers: {
          Authorization: 'Basic V1E3M0ZKMk1lOjkzZWJiNjNlLWE1MWMtNDJmNS04YjhlLTY5YzBjNjY0YjdkMw==',
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

        this.buying_manager = response.data.docs[0]._source.name;
        this.buying_store = response.data.docs[0]._source.address;
      }).catch((e) => {
        console.log(e.response)
      })

    var currentDate = new Date();
    var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    this.buying_date = currentDateWithFormat;

  },

  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    defaultQuery: function(value, props){
      return {
        query: {
          match: {
            pManagerID: this.uid
          }
        }
      }
    },

    get_name(name, price, id) {
      this.product_name = name

      if (this.product_list.includes(name)) {
        alert("이미 품목에 추가되었습니다")
      } else {
        this.product_list.push(name)
        this.product_amount.push(1)
        this.product_id.push(id)

        this.tot_price += parseInt(price)
      }

      var html = '<table>';
      for (var i = 0; i < this.product_list.length; i++) {
        html += '<tr>';
        html += '<td>' + this.product_list[i] + '</td>';
        html += '<td>' + this.product_amount[i] + '</td>';
        html += '</tr>';

      }
      html += '</table>';
      document.getElementById("lists").innerHTML = html;
    },

    reset() {
      this.product_list = []
      this.product_amount = []
      this.product_id = []

      this.tot_price = 0
      document.getElementById("lists").innerHTML = this.product_list
    },

    delete_product(name, price) {
      var a = this.product_list.indexOf(name);
      if (a != -1) {
        var temp = (this.product_amount[a]) * parseInt(price);


        this.product_list.splice(a, 1);
        this.product_amount.splice(a, 1);
        this.product_id.splice(a, 1);

        this.tot_price -= temp;

        var html = '<table>';
        for (var i = 0; i < this.product_list.length; i++) {
          html += '<tr>';
          html += '<td>' + this.product_list[i] + '</td>';
          html += '<td>' + this.product_amount[i] + '</td>';
          html += '</tr>';
        }

        html += '</table>';
        document.getElementById("lists").innerHTML = html;
      }
    },

    change_amount(name, price) {

      var a = this.product_list.indexOf(name);
      if (a != -1) {
        if (this.user_amount > 0) {

          if (this.user_amount > this.product_amount[a]) {
            // add (input-original)
            this.tot_price += (this.user_amount - this.product_amount[a]) * parseInt(price);
          } else if (this.user_amount < this.product_amount[a]) {
            // gap
            this.tot_price -= (this.product_amount[a] - this.user_amount) * parseInt(price);
          }

          this.product_amount[a] = this.user_amount;
          this.user_amount = null;

          var html = '<table>';
          for (var i = 0; i < this.product_list.length; i++) {
            html += '<tr>';
            html += '<td>' + this.product_list[i] + '</td>';
            html += '<td>' + this.product_amount[i] + '</td>';
            html += '</tr>';

          }
          html += '</table>';
          document.getElementById("lists").innerHTML = html;

          this.is_clicked = false;
        } else {
          alert("숫자를 입력하세요!");
        }
      } else {
        alert("메뉴를 먼저 선택하세요!");
      }
    },

    pay() {

      var bakery_coin = 0;

      if (this.ok_pressed) {
        this.remain = null;
        this.showDialog = false;

        if (this.user_money == null){
          // only user BakeryCoin
          this.user_money = 0;
        }
        if (this.user_barcode == null){
          // only use CASH
          this.user_name = '익명';
        }

        // set rDetail: rAmount, rName
        var user_detail = '[';
        var length = this.product_list.length;

        for (var i = 0; i < length; i++) {
          user_detail += '{ "rAmount" : "';
          user_detail += this.product_amount[i];
          user_detail += '", "rName" : "';
          user_detail += this.product_list[i];
          if (i != length - 1) {
            user_detail += '" },';
          } else {
            user_detail += '" }]';
          }
        }

        // set rType: cash, coin
        var user_type = '{ "cash" : "';
        user_type += '0';
        user_type += '", "coin" : "';
        user_type += this.user_money;
        user_type += '" }';


        //axios POST
        axios({
            method: 'POST',
            url: baseurl + '/bakery_record/_doc',
            headers: {
              Authorization: 'Basic VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==',
              'Content-Type': 'application/json'
            },
            data: {
              "rStore": this.buying_store,
              "rDate": this.buying_date,
              "rBuyer": this.user_name,
              "rPrice": this.tot_price,
              "rDetail": JSON.parse(user_detail),
              "rType": JSON.parse(user_type),
              "rManagerID": this.uid,
            }
          })
          .then((response) => {
            console.log(response);
            alert("record DB에 입력 완료!");
            alert("결제가 성공적으로 진행되었습니다");
            window.history.go(0);

          }).catch((e) => {
            console.log(e.response)
          })

      } else {
        alert("에러: 승인 거부");
      }

    },

    onCancel() {},

    edit_clicked(name) {
      var a = this.product_list.indexOf(name);

      if (a != -1) {
        this.now_product_name = name;
        this.is_clicked = true;
      } else {
        alert("메뉴를 먼저 선택하세요!");
      }

    },

    get_now_name() {
      return (this.now_product_name);
    },

    got_money() {
      // when using CASH
      this.remain = null;
      if (this.user_money) {
        if (this.user_money < this.tot_price) {
          alert("잔금 " + (this.tot_price - this.user_money) + "원은 베이커리 코인으로 결제하세요.");
          this.tot_price = this.tot_price - this.user_money;
          this.is_remain = true;
          this.is_partial_pay = true;
        } else {
          // big or same Money --> remain!
          this.remain = this.user_money - this.tot_price;
          this.ok_pressed = true;
        }
      } else {
        alert("에러: 받은 현금이 없습니다!");
      }
    },

    check_creidt() {
      // bakery coin

    },

    close_pay() {
      this.remain = null;
      this.user_money = null;
      this.card_number = null;
      this.showDialog = false;
      this.tot_price = 0;

      this.product_list = [];
      this.product_amount = [];
      this.product_price = [];
      this.product_id = [];

      document.getElementById("lists").innerHTML = this.product_list
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
  font-family: 'Noto Sans KR', sans-serif;
}

#nav_home {
  color: white;
}

.text-field {
  margin-left: 40px;
  margin-top: 40px;
}

.item1 {
  grid-area: product_list;

  overflow-y: scroll;
}

.item3 {
  grid-area: tot_price;
  margin-bottom: 20px;
}

.item4 {
  grid-area: is_pay;
  margin-bottom: 20px;
}

.item2 {
  grid-area: set;
}


.grid-container {
  display: grid;
  grid-template-areas:
    'product_list set'
    'tot_price is_pay';
  grid-gap: 30px;
}

.grid-container>div {
  background-color: #DFF0F1;
  border: 1px solid #C8CDEE;
  text-align: center;
}

.item5 {
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
  display: inline-grid;
  padding: 0px;
  margin: 0px;
}

.item6 {
  overflow-y: hidden;
  overflow-x: hidden;
  scroll-behavior: smooth;
  transition: all ease 0.2s;
  display: inline-grid;
}

#input_amount {
  width: 60px;
}

.price_result {
  color: red;
  font-weight: bold;
  font-size: 30px;
}

.filter.css-m1gst5 {
  width: 120px;
  padding: 0px;
  margin-right: 5px;
}
</style>
