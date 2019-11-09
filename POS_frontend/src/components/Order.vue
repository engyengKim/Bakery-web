<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">예약 주문 목록</h5>
      <div>
        <reactive-base app="bakery_advancedorder" credentials="hkzwIw1Em:b402ce56-9b61-4021-997c-9b857379401b">

          <reactive-list componentId="SearchResult" dataField="aoVisitDate" sortBy="asc" :showResultStats="false" :pagination="true" :from="0" :size="5"
          :defaultQuery="this.defaultQuery">
            <div slot="renderData" slot-scope="{ item }" class="order-list">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[고객 ID]</span> {{ item.aoCustomer_id }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[방문 날짜]</span> {{ item.aoVisitDate }}<br>
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[제품]</span> {{ item.aoProduct }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[수량]</span> {{ item.aoAmount }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[요구사항]</span> {{ item.aoRequestContent }}
                    </div>

                    <md-button class="md-primary md-raised md-dense" v-on:click="deal_complete(item._id)" style="margin-left:10px; margin-top:10px; margin-bottom:5px;">처리 완료</md-button>
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
  name: 'Order',
  data() {
    return {}
  },

  created() {
    if (this.$session.get('type') != 'Manager') {
      this.$session.destroy()
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }
  },

  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            aoResult: '대기중'
          }
        }
      }
    },

    deal_complete(id) {
      // axios: update 'aoResult' to "완료"
      axios({
          method: 'POST',
          url: baseurl + '/bakery_advancedorder/_doc/' + id + '/_update',
          headers: {
            Authorization: 'Basic aGt6d0l3MUVtOmI0MDJjZTU2LTliNjEtNDAyMS05OTdjLTliODU3Mzc5NDAxYg==',
            'Content-Type': 'application/json'
          },
          data: {
            'doc': {
              'aoResult': '완료',
            }
          }
        })
        .then((response) => {
          console.log(response);
          alert("처리되었습니다");

          // update record DB


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
</style>
