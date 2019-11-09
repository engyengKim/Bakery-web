<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5>[일 단위] 판매 기록</h5>

      <div id="app">
        <reactive-base app="bakery_record" credentials="TqzgC7pxS:222d2517-2375-4324-bf75-13085ec4aa7d">
          <div class="filters-container">
            <multi-list componentId="rDate" dataField="rDate.keyword" class="filter" title="날짜를 선택하세요" selectAllLabel="전체" :defaultQuery="this.defaultQuery" />
            <md-button class="md-raised md-accent" style="margin-left: 15px; width:200px;" v-on:click="goto_revenue_monthly()">월별 판매 관리</md-button>
          </div>

          <reactive-list componentId="SearchResult" dataField="pName" className="result-list-container" :showResultStats="false" :pagination="true" :from="0" :size="5" :react="{and: ['rDate']}" :defaultQuery="this.defaultQuery">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">날짜: {{ item.rDate }}</span>

                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[고객 이름]</span> {{ item.rBuyer }} <br>
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[구매 금액]</span> {{ item.rPrice }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[구매 수단]</span> 현금: {{ item.rType.cash }}
                      <span style="margin-left:3px;">베이커리 코인: {{ item.rType.coin }}</span>

                      <div style="margin-top: 5px; margin-bottom: 5px;">
                        <md-button class="md-primary md-dense" style="font-weight:bold;" @click="show_rDetail(item._id)">구매내역 확인</md-button>
                        <div id="detail_lists" v-if="(get_now_id() == item._id)"></div>
                      </div>

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
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Revenue',
  data() {
    return {
      uid: '',
      now_id: '',
    }
  },
  created() {
    console.log("type:" + this.$session.type)
    if (this.$session.get('type') != 'Manager') {
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    this.uid = this.$session.get('uId')
  },

  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            rManagerID: this.uid
          }
        }
      }
    },

    get_now_id() {
      return (this.now_id)
    },

    show_rDetail(id) {
      this.now_id = id;

      var temp_length = 0;
      var html = ''

      axios({
          method: 'POST',
          url: baseurl + '/bakery_record/_mget',
          headers: {
            Authorization: 'Basic VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==',
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

          temp_length = response.data.docs[0]._source.rDetail.length;

          for (var i = 0; i < temp_length; i++) {
            html += "<div>"
            html += ' 제품명: ';
            html += (response.data.docs[0]._source.rDetail[i].rName);
            html += ' | 수량: ';
            html += (response.data.docs[0]._source.rDetail[i].rAmount);
            html += "</div>"
          }
          document.getElementById("detail_lists").innerHTML = html;

        }).catch((e) => {
          console.log(e.response)
        })
    },

    goto_revenue_monthly() {
      this.$router.replace('/revenue_monthly');
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';
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
  margin-top: 40px;
  margin-left: 40px;
}

.inline-1 {
  display: inline;
}

.order-list {
  padding-top: 15px;
}

.filters-container {
  width: 20%;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  margin-top: 120px;
  top: 0;
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
}
</style>
