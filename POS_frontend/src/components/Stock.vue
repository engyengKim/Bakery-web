<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">재고 관리 시스템</h5>
      <div>'수량' 정보는 판매로 인한 수량 변동을 반영하지 않습니다.</div>
      <div>따라서, 매장 닫기 전에, 수량을 확인하시고 [현재 수량] 값에 맞추어 '수량'값을 조정해주세요</div>

      <div id="app">
        <reactive-base app="bakery_product" credentials="rucxxdjm3:7d5fd3b6-f237-4c31-ad2b-5ab5ff3b3ae2">
          <div class="filters-container">
            <multi-list componentId="Category" dataField="pCategory.keyword" class="filter" title="카테고리를 선택하세요" selectAllLabel="모든 제품" :defaultQuery="this.defaultQuery" />

            <div style="font-weight:bold; margin-left:auto; margin-right:auto;">[오늘] {{ this.today }} </div>
            <md-button class="md-dense" v-on:click="goto_Inventory()">이전 페이지</md-button>

            <div style="margin-left:auto; margin-right:auto;">
              <md-dialog :md-active.sync="showDialog">
                <md-dialog-title>메뉴 추가하기</md-dialog-title>

                <md-tabs md-dynamic-height>
                  <md-tab md-label="새 메뉴 정보">
                    <div class="form-group">
                      <div class="input-group mb-3">
                        <span style="font-weight: bold;">이름</span>
                        <input type="new_pName" v-model="new_pName" class="form-control" placeholder="이름">
                        <div style="margin-bottom: 5px;" />
                        <span style="font-weight: bold;">수량</span>
                        <input type="new_pAmount" v-model="new_pAmount" class="form-control" placeholder="수량">
                      </div>
                    </div>

                    <div class="form-group">
                      <div class="input-group mb-3">
                        <span style="font-weight: bold;">카테고리</span>
                        <input type="new_pCategory" v-model="new_pCategory" class="form-control" placeholder="카테고리">
                        <span style="font-weight: bold;">유통기한</span>
                        <input type="date" v-model="new_pExpire" class="form-control">
                      </div>
                    </div>

                    <div class="form-group">
                      <div class="input-group mb-3">
                        <span style="font-weight: bold;">원가</span>
                        <input type="new_pCost" v-model="new_pCost" class="form-control" placeholder="원가">
                        <span style="font-weight: bold;">가격</span>
                        <input type="new_pPrice" v-model="new_pPrice" class="form-control" placeholder="가격">
                        <span style="font-weight: bold;">바코드</span>
                        <input type="text" v-model="new_pBarcode" class="form-control" placeholder="바코드 번호">
                      </div>
                    </div>

                    <div class="form-group">
                      <span style="font-weight: bold;">설명</span>
                      <input type="text" v-model="new_pDescript" class="form-control" placeholder="설명">
                    </div>

                  </md-tab>
                </md-tabs>

                <md-dialog-actions>
                  <md-button class="md-primary" @click="showDialog = false">취소</md-button>
                  <md-button class="md-accent" @click="add_menu()">추가</md-button>
                </md-dialog-actions>
              </md-dialog>

              <md-button class="md-primary" @click="showDialog = true" style="font-weight:bold;">메뉴 추가</md-button>
            </div>

          </div>
          <reactive-list componentId="SearchResult" dataField="pName" className="result-list-container" :showResultStats="false" :pagination="true" :from="0" :size="5"
          :react="{and: ['Category']}" :defaultQuery="this.defaultQuery">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item.pName">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">{{ item.pName }}</span>

                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[가격]</span> {{ item.pPrice }}
                    </div>


                    <md-button class="md-primary md-dense" style="font-weight:bold;" @click="show_pDetail(item._id, item.pName)">수량/유통기한 확인</md-button>
                    <table id="detail_lists" style="width:500px;" v-if="(get_now_name() == item.pName)"></table>

                  </div>

                  <div class="form-group" style="margin-bottom:0px; margin-top:10px;">
                    <div class="input-group mb-3">
                      <md-button class="md-button md-raised md-dense md-primary" style="margin-right:10px;" @click="edit_clicked_1(item.pName)">수량 변경</md-button>
                      <div v-if="(get_now_name() == item.pName) && is_clicked && (get_what_change() == 1)">
                        <div class="input-group-append" style="margin-left:5px;">
                          <input type="text" v-model="user_amount" class="form-control" id="input_amount" style="width: 80px; margin-right: 5px;" placeholder="수량">
                          <input type="date" v-model="user_date" class="form-control" id="input_amount">
                          <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="save_db(item.pName, item._id, item.pPrice)" style="margin-left:5px; margin-right:5px;">저장</md-button>
                        </div>
                      </div>

                      <md-button class="md-button md-raised md-dense md-primary" style="margin-right:10px; background-color:green;" @click="edit_clicked_3(item.pName)">물품 입고</md-button>
                      <div v-if="(get_now_name() == item.pName) && is_clicked && (get_what_change() == 3)">
                        <div class="input-group-append" style="margin-left:5px;">
                          <input type="text" v-model="user_amount" class="form-control" id="input_amount" style="width: 80px; margin-right: 5px;" placeholder="수량">
                          <input type="date" v-model="user_date" class="form-control" id="input_amount">
                          <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="save_db(item.pName, item._id, item.pPrice)" style="margin-left:5px; margin-right:5px; background-color:green;">저장</md-button>
                        </div>
                      </div>


                      <md-button class="md-button md-raised md-dense md-accent" @click="edit_clicked_2(item.pName)">가격 변경</md-button>
                      <div v-if="(get_now_name() == item.pName) && is_clicked && (get_what_change() == 2)">
                        <div class="input-group-append" style="margin-left:5px;">
                          <input type="user_amount" v-model="user_amount" class="form-control" id="input_amount" style="width: 100px;">
                          <md-button class="md-icon-button md-raised md-dense md-accent" v-on:click="save_db(item.pName, item._id, item.pPrice)" style="margin-left:5px;">저장</md-button>
                        </div>
                      </div>

                      <md-dialog-confirm :md-active.sync="active" md-title="메뉴를 삭제하시겠습니까?" md-content="[확인]을 누르시면 작업을 취소할 수 없습니다." md-confirm-text="확인" md-cancel-text="취소"
                      @md-confirm="delete_menu(get_now_name())" />
                      <md-button class="md-accent md-dense" @click="delete_clicked(item.pName)" style="font-weight: bold;">메뉴 삭제</md-button>

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </reactive-list>
        </reactive-base>
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
      now_product_name: '',
      is_clicked: false,

      user_amount: null,
      user_date: null,
      user_detail: '',

      what_change: 0,
      active: false,
      showDialog: false,

      new_pName: '',
      new_pAmount: null,
      new_pPrice: null,
      new_pExpire: null,
      new_pCategory: null,
      new_pBarcode: '',
      new_pCost: null,
      new_pDescript: '',

      temp_length: 0,
      temp_arr_amount: [],
      temp_arr_date: [],
      temp_index: 0,
      temp_string: null,

      is_same: false,
      uid: null,
      storeName: '',
      today: null,
    };
  },

  created() {
    if (this.$session.get('type') != 'Manager' && this.$session.exists()) {
      this.$session.destroy()
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    this.uid = this.$session.get('uId');
    this.storeName = this.$session.get('storeName');

    var currentDate = new Date();
    var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    this.today = currentDateWithFormat;
  },

  methods: {

    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            pManagerID: this.uid
          }
        }
      }
    },

    goto_home() {
      this.$router.replace('/home')
    },

    save_db(name, product_id, old_price) {
      // pass [name, amount] to server

      // find input Date
      this.is_same = false;
      this.temp_index = 0;
      this.temp_length = 0;
      this.temp_arr_date = [];
      this.temp_arr_amount = [];
      this.user_detail = '';
      this.temp_string = '';

      if (this.what_change == 1) {
        axios({
            method: 'POST',
            url: baseurl + '/bakery_product/_mget',
            headers: {
              Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
              'Content-Type': 'application/json'
            },
            data: {
              "docs": [{
                "_id": product_id,
              }, ]
            }
          })
          .then((response) => {
            console.log(response);

            var old_amount = null;
            this.temp_length = response.data.docs[0]._source.pDetail.length;

            for (var i = 0; i < this.temp_length; i++) {
              this.temp_arr_amount.push(response.data.docs[0]._source.pDetail[i].pAmount);
              this.temp_arr_date.push(response.data.docs[0]._source.pDetail[i].pExpirationDate);

              if (this.user_date.toString() == (this.temp_arr_date[i])) {
                this.is_same = true;
                this.temp_index = i;
                old_amount = this.temp_arr_amount[i];
                this.temp_arr_amount[i] = this.user_amount;
                break;
              }
            }

            if (this.is_same && this.user_amount >= 0 && this.what_change == 1) {
              // change AMOUNT
              this.user_detail = '[';

              for (var i = 0; i < this.temp_length; i++) {
                this.user_detail += '{ "pAmount" : "';
                if (i == this.temp_index) {
                  this.user_detail += this.user_amount;
                } else {
                  this.user_detail += this.temp_arr_amount[i];
                }
                this.user_detail += '", "pExpirationDate" : "';
                this.user_detail += this.temp_arr_date[i];
                if (i != this.temp_length - 1) {
                  this.user_detail += '" },';
                } else {
                  this.user_detail += '" }]';
                }
              }


              axios({
                  method: 'POST',
                  url: baseurl + '/bakery_product/_doc/' + product_id + '/_update',
                  headers: {
                    Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
                    'Content-Type': 'application/json'
                  },
                  data: {
                    'doc': {
                      'pDetail': JSON.parse(this.user_detail),
                    }
                  }
                })
                .then((response) => {
                  //var hits_length = response.data.hits.hits.length
                  console.log(response);

                  // set hContents
                  var contents = '수량 변경 | 제품명: ';
                  contents += name;
                  contents += ' | 유통기한: ';
                  contents += this.temp_arr_date[this.temp_index];
                  contents += ' | 수량: ';
                  contents += old_amount;
                  contents += '에서 ';
                  contents += this.user_amount;


                  axios({
                      method: 'POST',
                      url: baseurl + '/bakery_history/_doc/',
                      headers: {
                        Authorization: 'Basic ZWdkWDZkbWxQOjk3N2U2MjRiLTY1MTEtNGRlYy1hNDY2LTJhZTIzZGQzM2FiNg==',
                        'Content-Type': 'application/json'
                      },
                      data: {
                        "hContents": contents,
                        "hDate": this.today,
                        "hManagerID": this.uid,
                      }
                    })
                    .then((response) => {
                      //var hits_length = response.data.hits.hits.length
                      console.log(response);
                      alert("[수량] 변경, 기록되었습니다");
                      this.is_clicked = false;
                      window.history.go(0);
                    }).catch((e) => {
                      console.log(e.response)
                    })
                }).catch((e) => {
                  console.log(e.response)
                })
            } else if (this.is_same == false && this.what_change == 1) {
              alert("에러: 유통기한에 해당하는 물품 없음");
            } else if (this.user_amount < 0) {
              alert("에러: 음수를 입력할 수 없습니다!");
            }
          }).catch((e) => {
            console.log(e.response)
          })
      }

      if (this.user_amount >= 0 && this.what_change == 2) {
        // change PRICE
        axios({
            method: 'POST',
            url: baseurl + '/bakery_product/_doc/' + product_id + '/_update',
            headers: {
              Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
              'Content-Type': 'application/json'
            },
            data: {
              'doc': {
                'pPrice': this.user_amount,
              }
            }
          })
          .then((response) => {
            //var hits_length = response.data.hits.hits.length
            console.log(response);

            // set hContents
            var contents = '가격 변경 | 제품명: ';
            contents += name;
            contents += ' | 가격: ';
            contents += old_price;
            contents += '에서 ';
            contents += this.user_amount;

            axios({
                method: 'POST',
                url: baseurl + '/bakery_history/_doc/',
                headers: {
                  Authorization: 'Basic ZWdkWDZkbWxQOjk3N2U2MjRiLTY1MTEtNGRlYy1hNDY2LTJhZTIzZGQzM2FiNg==',
                  'Content-Type': 'application/json'
                },
                data: {
                  "hContents": contents,
                  "hDate": this.today,
                  "hManagerID": this.uid,
                }
              })
              .then((response) => {
                //var hits_length = response.data.hits.hits.length
                console.log(response);
                alert("[가격] 변경, 기록되었습니다");
                this.is_clicked = false;
                window.history.go(0);
              }).catch((e) => {
                console.log(e.response)
              })
          }).catch((e) => {
            console.log(e.response)
          })
      }

      if (this.user_amount >= 0 && this.what_change == 3) {
        axios({
            method: 'POST',
            url: baseurl + '/bakery_product/_mget',
            headers: {
              Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
              'Content-Type': 'application/json'
            },
            data: {
              "docs": [{
                "_id": product_id,
              }, ]
            }
          })
          .then((response) => {
            console.log(response);
            this.temp_string = JSON.stringify(response.data.docs[0]._source.pDetail);
            var original_amount = response.data.docs[0]._source.pAmount;

            var new_string = ', { "pAmount" : "' + this.user_amount + '", "pExpirationDate" : "' + this.user_date + '"} ]';
            var i = this.temp_string.indexOf(']');
            this.temp_string = this.temp_string.substring(0, i);
            this.temp_string += new_string;

            axios({
                method: 'POST',
                url: baseurl + '/bakery_product/_doc/' + product_id + '/_update',
                headers: {
                  Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
                  'Content-Type': 'application/json'
                },
                data: {
                  'doc': {
                    'pDetail': JSON.parse(this.temp_string),
                  }
                }
              })
              .then((response) => {
                console.log(response);

                // set hContents
                var contents = '물품 입고 | 제품명: ';
                contents += name;
                contents += ' | 유통기한: ';
                contents += this.user_date;
                contents += ' | 수량: ';
                contents += parseInt(this.user_amount);

                axios({
                    method: 'POST',
                    url: baseurl + '/bakery_history/_doc/',
                    headers: {
                      Authorization: 'Basic ZWdkWDZkbWxQOjk3N2U2MjRiLTY1MTEtNGRlYy1hNDY2LTJhZTIzZGQzM2FiNg==',
                      'Content-Type': 'application/json'
                    },
                    data: {
                      "hContents": contents,
                      "hDate": this.today,
                      "hManagerID": this.uid,
                    }
                  })
                  .then((response) => {
                    //var hits_length = response.data.hits.hits.length
                    console.log(response);
                    alert("[물품] 입고, 기록되었습니다");
                    this.is_clicked = false;
                    window.history.go(0);
                  }).catch((e) => {
                    console.log(e.response)
                  })
              }).catch((e) => {
                console.log(e.response)
              })
          }).catch((e) => {
            console.log(e.response)
          })
      }
    },

    edit_clicked_1(name) {
      this.now_product_name = name;
      this.is_clicked = true;
      this.what_change = 1;
    },

    edit_clicked_2(name) {
      this.now_product_name = name;
      this.is_clicked = true;
      this.what_change = 2;
    },

    edit_clicked_3(name) {
      this.now_product_name = name;
      this.is_clicked = true;
      this.what_change = 3;
    },

    get_now_name() {
      return (this.now_product_name);
    },

    get_what_change() {
      return (this.what_change);
    },

    goto_Inventory() {
      this.$router.replace('/inventory')
    },

    delete_menu(product_name) {
      // axios POST
      axios({
          method: 'POST',
          url: baseurl + '/bakery_product/_delete_by_query',
          headers: {
            Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
            'Content-Type': 'application/json'
          },
          data: {
            "query": {
              "match": {
                "pName": product_name
              }
            }
          }
        })
        .then((response) => {
          //var hits_length = response.data.hits.hits.length
          console.log(response);
          alert("삭제되었습니다");
          this.is_clicked = false;
          window.history.go(0);
        }).catch((e) => {
          console.log(e.response)
        })
    },

    delete_clicked(name) {
      this.active = true;
      this.now_product_name = name;
    },

    add_menu() {
      // create 'amount'-'expire date' json object
      var temp_json = '[{ "pAmount" : "';
      temp_json += this.new_pAmount;
      temp_json += '", "pExpirationDate" : "';
      temp_json += this.new_pExpire;
      temp_json += '" }]';

      // post
      axios({
          method: 'POST',
          url: baseurl + '/bakery_product/_doc/',
          headers: {
            Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
            'Content-Type': 'application/json'
          },
          data: {
            "pName": this.new_pName,
            "pPrice": this.new_pPrice,
            "pCategory": this.new_pCategory,
            "pDescription": this.new_pDescript,
            "pBarcode": this.new_pBarcode,
            "pDetail": JSON.parse(temp_json),
            "pCost": this.new_pCost,
            "pStore": this.storeName,
          }
        })
        .then((response) => {
          //var hits_length = response.data.hits.hits.length
          console.log(response);
          alert("추가되었습니다");
          this.showDialog = false;
          window.history.go(0);
        }).catch((e) => {
          console.log(e.response)
        })

    },

    show_pDetail(id, name) {
      this.now_product_name = name;
      this.temp_length = 0;
      this.temp_arr_date = [];
      this.temp_arr_amount = [];
      var html = '';

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
          console.log(response);

          this.temp_length = response.data.docs[0]._source.pDetail.length;

          // sort by pExpirationDate
          var data = response.data.docs[0]._source.pDetail;

          function date_sort(a, b) {
            var dateA = new Date(a["pExpirationDate"]).getTime();
            var dateB = new Date(b["pExpirationDate"]).getTime();
            return dateA > dateB ? 1 : -1;
          }

          data.sort(date_sort);

          this.temp_length = data.length;

          // display oprtions about Expiration date
          var temp_expire = [];
          var temp_amount = [];
          var parts = this.today.split('-');
          var mydate = new Date(parts[0], parts[1] - 1, parts[2]);
          var red_point = [];

          var minutes = 1000 * 60;
          var hours = minutes * 60;
          var three_days = hours * 24 * 3;

          for (var i = 0; i < data.length; i++) {
            var part = (data[i].pExpirationDate).split('-');
            part = new Date(part[0], part[1] - 1, part[2]);

            if (part.getTime() >= mydate.getTime()) {
              // 유통기한 유효함
              temp_expire.push(data[i].pExpirationDate);
              temp_amount.push(data[i].pAmount);
              red_point.push(0);

              if (part.getTime() - mydate.getTime() <= three_days) {
                // 유통기한 임박, red point
                var temp_index = temp_expire.length - 1;
                red_point[temp_index] = 1;
              }

            } else {
              // 유통기한 지남
              continue;
            }
          }

          console.log(temp_expire);

          html = '<table><tr><td style="font-weight:bold;">수량</td><td style="font-weight:bold;">유통기한</td></tr>';

          for (var i = 0; i < temp_expire.length; i++) {
            if (red_point[i] == 1) {
              html += '<tr><td style="color: red;">';
              html += (temp_amount[i]);
              html += '</td><td style="color: red;">';
              html += (temp_expire[i]);
              html += '</td></tr>';
            } else {
              html += '<tr><td>';
              html += (temp_amount[i]);
              html += '</td><td>';
              html += (temp_expire[i]);
              html += '</td></tr>';
            }
          }
          html += '</table>';

          document.getElementById("detail_lists").innerHTML = html;

        }).catch((e) => {
          console.log(e.response)
        })

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

#nav_home {
  color: white;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}

.filters-container {
  width: 20%;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  margin-top: 140px;
  top: 0;
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
}

.result-list-container {
  width: 80%;
  position: absolute;
  right: 0;
  padding: 10px 40px;
  overflow-y: scroll;
  height: 100vh;
  display: inline-flex;
  flex-direction: column;
  scroll-behavior: smooth;
  transition: all ease 0.2s;
}

.inline-1 {
  display: inline-block;
}

.container {
  font-family: 'Noto Sans KR', sans-serif;
}

.product_info {
  margin-top: 2px;
}
</style>
