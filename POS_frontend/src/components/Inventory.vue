<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">제품 관리 시스템</h5>

      <div style="margin-top: 20px;">
        <md-tabs md-sync-route>
          <md-tab id="tab-home" md-label="재고 관리" to="/Stock" exact>
            <div class="crack">[재고 관리]에서는 제품의 수량과 가격을 변경하고, 새로운 메뉴를 추가하거나 기존 메뉴를 삭제할 수 있습니다.</div>
            <div class="crack">[유통기한 마감 확인]에서는 오늘 매장 마감 전 폐기해야 할 물품을 확인할 수 있습니다.</div>
            <div class="crack">[제품 관리 내역]에서는 제품 관리 내역을 확인할 수 있습니다.</div>
          </md-tab>

          <md-tab id="tab-posts" md-label="유통기한 마감 확인" to="/Expire">
          </md-tab>

          <md-tab id="tab-favorites" md-label="제품 관리 내역" to="/History">
          </md-tab>

        </md-tabs>
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
      this.$router.replace('/home')
    }


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');
@import url('https://fonts.googleapis.com/css?family=Nanum+Gothic&display=swap');

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

.crack{
  margin-bottom: 15px;
}

.md-content md-tabs-content md-theme-default{
  height: 250px;
}

</style>
