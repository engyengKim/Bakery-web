<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">Admin Page</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">정보 변경 요청</h5>
      <p class="container">매니저가 관리자께 요쳥한 정보 변경을 확인하십시오</p>



      <h5 id="theme">고객 관리</h5>

      <div id="app">
        <reactive-base app="bakery_users" credentials="edggRA9Pv:6733727b-aecf-4ee9-b2a1-0b6ac7da2c3c">

          <div class="filters-container">
            <multi-list componentId="Category" dataField="uType.keyword" class="filter" title="고객 유형" selectAllLabel="모든 고객" />
          </div>

          <reactive-list componentId="SearchResult" dataField="_id" className="result-list-container" :showResultStats="false" :pagination="true" :from="0" :size="5" :react="{and: ['Category']}">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">{{ item.uName }} </span>

                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold;">[주소]</span> {{ item.uAddress}}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[이메일]</span> {{ item.uEmail }}
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

    };
  },
  methods: {
    goto_home() {
      this.$router.replace('/admin_home')
    }


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

.filters-container{
  width: 20%;
  margin-left:30px;
  margin-top: 200px;
  display: inline-flex;
  flex-direction: column;
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
}
</style>
