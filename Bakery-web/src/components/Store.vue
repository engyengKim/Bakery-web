<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary" style="color:blue;">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">Bakery Web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">매장 선택하기</h5>

      <div id="app">
        <reactive-base app="bakery_manager" credentials="WQ73FJ2Me:93ebb63e-a51c-42f5-8b8e-69c0c664b7d3">
          <reactive-list componentId="SearchResult" dataField="_id" :showResultStats="false" :pagination="true" :from="0" :size="10">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div style="font-weight: bold;">
                    <button v-on:click="goto_store(item._id)">{{ item.storeName }}</button>
                  </div>
                  <div class="inline-1" style="margin-bottom:10px; margin-left:10px; margin-top:5px;">


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
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Store',
  data() {
    return {

    };
  },

  created() {

  },

  methods: {
    goto_home() {
      this.$router.replace('/home');
    },

    goto_store(manager_id) {
      this.$session.set('managerId', manager_id);
      this.$router.replace('/product');
    },


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
