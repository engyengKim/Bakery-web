<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">유통기한 마감 제품 확인</h5>

      <div id="app">
        <reactive-base app="bakery_product" credentials="rucxxdjm3:7d5fd3b6-f237-4c31-ad2b-5ab5ff3b3ae2">

          <reactive-list componentId="SearchResult" dataField="_id" :showResultStats="false" :pagination="true" :from="0" :size="5"
          :defaultQuery="this.defaultQuery">
            <div slot="renderData" slot-scope="{ item }" class="order-list">
              <div class="flex book-content" key="item.pName">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">{{ item.pName }}</span>
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
      storeName: '',
      today: null,
      manager_id: '',
    };
  },
  created() {

    if (this.$session.get('type') != 'Manager' && this.$session.exists()) {
      this.$session.destroy()
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    this.storeName = this.$session.get('storeName');
    this.manager_id = this.$session.get('uId');

    var currentDate = new Date();
    var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    this.today = currentDateWithFormat;


  },
  methods: {

    goto_home() {
      this.$router.replace('/home')
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
}

#nav_home {
  color: white;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}


.container {
  font-family: 'Noto Sans KR', sans-serif;
}

.order-list {
  padding-top: 5px;
  width: 50%;
}
</style>
