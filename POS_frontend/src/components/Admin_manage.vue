<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">Admin Page</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">정보 변경 요청</h5>
      <p class="container">매니저가 관리자께 요쳥한 정보 변경을 확인하십시오</p>



      <h5 id="theme">매니저 현황</h5>

      <div id="app">
        <reactive-base app="bakery_manager" credentials="WQ73FJ2Me:93ebb63e-a51c-42f5-8b8e-69c0c664b7d3">

          <reactive-list componentId="SearchResult" dataField="_id" style="width: 600px;" :showResultStats="false" :pagination="true" :from="0" :size="5">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">{{ item.name }}</span>

                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[연락처]</span> {{ item.contact }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[이메일]</span> {{ item.email }}
                    </div>
                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold;">[가게 주소]</span> {{ item.address}}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[가게 이름]</span> {{ item.storeName }}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </reactive-list>
        </reactive-base>
      </div>


      <h5 id="theme">가입 고객 현황</h5>

      <div id="app">
        <reactive-base app="bakery_customer" credentials="1GnSwfXne:9ea005c6-da1d-4ab0-9516-52fbc31ecd9c">

          <reactive-list componentId="SearchResult" dataField="_id" style="width: 600px;" :showResultStats="false" :pagination="true" :from="0" :size="5">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">{{ item.name }}</span>

                    <div class="product_info">
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[연락처]</span> {{ item.contact }}
                      <span style="color: #425DC6; font-weight:bold; margin-left:10px;">[이메일]</span> {{ item.email }}
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

  created(){

    if(this.$session.get('type') != 'Admin' && this.$session.exists()){

      this.$session.destroy();
      alert("관리자 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }
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
