<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">재고 관리 시스템</h5>

      <div id="app">
        <reactive-base app="bakery_product" credentials="5xTGpCL5N:ddd1d6b3-6022-4e2f-ba6f-13805e7b9659">
          <div class="filters-container">
            <multi-list componentId="Category" dataField="pCategory.keyword" class="filter" title="카테고리를 선택하세요" selectAllLabel="모든 제품" />
            <md-button class="md-dense" v-on:click="goto_Inventory()">이전 페이지</md-button>

            <div style="margin-left:auto; margin-right:auto;">
              <md-dialog :md-active.sync="showDialog">
                <md-dialog-title>메뉴 추가하기</md-dialog-title>

                <md-tabs md-dynamic-height>
                  <md-tab md-label="새 메뉴 정보">
                    <div class="form-group">
                      <div class="input-group mb-3">
                        <span style="font-weight: bold;">이름</span>
                        <input type="new_pName" v-model="new_pName" class="form-control" placeholder="이름"><div style="margin-bottom: 5px;"/>
                        <span style="font-weight: bold;">수량</span>
                        <input type="new_pAmount" v-model="new_pAmount" class="form-control" placeholder="수량">
                        <span style="font-weight: bold;">가격</span>
                        <input type="new_pPrice" v-model="new_pPrice" class="form-control" placeholder="가격">
                      </div>
                    </div>

                    <div class="form-group">
                      <div class="input-group mb-3">
                        <span style="font-weight: bold;">카테고리</span>
                        <input type="new_pCategory" v-model="new_pCategory" class="form-control" placeholder="카테고리">
                        <span style="font-weight: bold;">유통기한 년/월/일</span>
                        <input type="date" v-model="new_pExpire" class="form-control">
                      </div>
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
          <reactive-list componentId="SearchResult" dataField="pName" className="result-list-container" :showResultStats="false" :pagination="true" :from="0" :size="5" :react="{and: ['Category']}">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item.pName">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">{{ item.pName }}</span>

                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold;">[수량]</span> {{ item.pAmount }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[유통기한]</span> {{ item.pExpireDate }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[가격]</span> {{ item.pPrice }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[pTotal]</span> {{ item.pTotalAmount }}
                    </div>

                  </div>

                  <div class="form-group" style="margin-bottom:0px; margin-top:10px;">
                    <div class="input-group mb-3">
                      <md-button class="md-button md-raised md-dense md-primary" style="margin-right:10px;" @click="edit_clicked_1(item.pName)">수량 변경</md-button>
                      <div v-if="(get_now_name() == item.pName) && is_clicked && (get_what_change() == 1)">
                        <div class="input-group-append" style="margin-left:20px;">
                          <input type="user_amount" v-model="user_amount" class="form-control" id="input_amount" style="width: 80px;">
                          <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="save_db(item.pName, item._id)" style="margin-left:5px; margin-right:5px;">저장</md-button>
                        </div>
                      </div>

                      <md-button class="md-button md-raised md-dense md-accent" @click="edit_clicked_2(item.pName)" style="margin-right:10px;">가격 변경</md-button>
                      <div v-if="(get_now_name() == item.pName) && is_clicked && (get_what_change() == 2)">
                        <div class="input-group-append" style="margin-left:20px;">
                          <input type="user_amount" v-model="user_amount" class="form-control" id="input_amount" style="width: 80px;">
                          <md-button class="md-icon-button md-raised md-dense md-accent" v-on:click="save_db(item.pName, item._id)" style="margin-left:5px;">저장</md-button>
                        </div>
                      </div>

                      <md-dialog-confirm :md-active.sync="active" md-title="메뉴를 삭제하시겠습니까?"
                        md-content="[확인]을 누르시면 작업을 취소할 수 없습니다." md-confirm-text="확인" md-cancel-text="취소"
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
      what_change: 0,
      active: false,
      showDialog: false,

      new_pName: '',
      new_pAmount: null,
      new_pPrice: null,
      new_pExpire: null,
      new_pCategory: null,

      json_object: [],
    };
  },
  methods: {

    goto_home() {
      this.$router.replace('/home')
    },

    save_db(name, product_id) {
      // pass [name, amount] to server

      // first, check amount is valid
      if (this.user_amount >= 0 && this.what_change == 1) {
        // change AMOUNT
        axios({
            method: 'POST',
            url: baseurl + '/bakery_product/_doc/' + product_id + '/_update',
            headers: {
              Authorization: 'Basic SlhSQ09mclFnOjdiMWM1NmQ4LWZhNmEtNDlmNS1iZTIxLTEzNWJiY2VkZmExMA==',
              'Content-Type': 'application/json'
            },
            data: {
              'doc': {
                'pAmount': this.user_amount,
              }
            }
          })
          .then((response) => {
            //var hits_length = response.data.hits.hits.length
            console.log(response);
            alert("[수량] 변경되었습니다");
            this.is_clicked = false;
            window.history.go(0);
          }).catch((e) => {
            console.log(e.response)
          })

      } else if(this.user_amount >= 0 && this.what_change == 2) {
        // change PRICE
        axios({
            method: 'POST',
            url: baseurl + '/bakery_product/_doc/' + product_id + '/_update',
            headers: {
              Authorization: 'Basic T0RCbkduSHd6Ojg2ZTM0ZDBkLTA0M2YtNDY5Yy04NTdkLWY5ZDY1MGFhZmZjZQ==',
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
            alert("[가격] 변경되었습니다");
            this.is_clicked = false;
            window.history.go(0);
          }).catch((e) => {
            console.log(e.response)
          })
      } else if(this.user_amount < 0){
        alert("음수를 입력할 수 없습니다!");
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
            Authorization: 'Basic T0RCbkduSHd6Ojg2ZTM0ZDBkLTA0M2YtNDY5Yy04NTdkLWY5ZDY1MGFhZmZjZQ==',
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

    delete_clicked(name){
      this.active = true;
      this.now_product_name = name;
    },

    add_menu(){
      // post
      axios({
          method: 'POST',
          url: baseurl + '/bakery_product/_doc/',
          headers: {
            Authorization: 'Basic T0RCbkduSHd6Ojg2ZTM0ZDBkLTA0M2YtNDY5Yy04NTdkLWY5ZDY1MGFhZmZjZQ==',
            'Content-Type': 'application/json'
          },
          data: {
            "pName": this.new_pName,
            "pAmount": this.new_pAmount,
            "pPrice": this.new_pPrice,
            "pCategory": this.new_pCategory,
            "pExpireDate": this.new_pExpire,
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
  margin-top: 100px;
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
