<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">제품 관리 내역</h5>

      <div id="app">
        <reactive-base app="bakery_history" credentials="egdX6dmlP:977e624b-6511-4dec-a466-2ae23dd33ab6">
          <reactive-list componentId="SearchResult" dataField="hDate" :showResultStats="false" :pagination="true" :from="0" :size="10"
           :defaultQuery="this.defaultQuery" sortBy="desc">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item.hDate">
                <div class="flex column justify-center ml20">
                  <div style="font-weight: bold;">
                    <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[날짜]</span> {{ item.hDate }}
                  </div>
                  <div class="inline-1" style="margin-bottom:10px; margin-left:10px; margin-top:5px;">
                    <span>{{ item.hContents }}</span>
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
      uid: '',

    };
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
            hManagerID: this.uid
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
</style>
