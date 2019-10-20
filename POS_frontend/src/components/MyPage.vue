<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">마이 페이지</h5>

      <div class="description">
        <h6 style="margin-top: 40px; margin-bottom:15px;">[매니저 정보]</h6>
        매니저 이름:
        <div class="crack" />
        매니저 이메일:
        <div class="crack" />
        매니저 비밀번호:
        <span>
          <span>
              <md-dialog :md-active.sync="showDialog">
                <md-dialog-title>매니저 정보 변경</md-dialog-title>

                <md-tabs md-dynamic-height>
                  <md-tab md-label="비밀번호 변경">
                    <input type="pwd" v-model="pwd" class="form-control" placeholder="새 비밀번호">
                    <input type="pwd_trial" v-model="pwd_trial" class="form-control" placeholder="새 비밀번호 재입력">
                  </md-tab>
                </md-tabs>

                <md-dialog-actions>
                  <md-button class="md-primary" @click="showDialog = false">취소</md-button>
                  <md-button class="md-primary" @click="change_pwd()">변경</md-button>
                </md-dialog-actions>
              </md-dialog>

              <md-button class="md-dense md-accent md-raised" @click="showDialog = true">비밀번호 변경</md-button>
            </span>

        </span><br>
        매니저 계좌번호:
        <div class="crack" />

        <h6 style="margin-top: 30px; margin-bottom:10px;">[가게 정보]</h6>
        <div class="caution" style="color:gray; font-size:15px; margin-bottom:15px;">
          [가게 이름 변경]과 [주소 변경]의 경우, 반드시 사전에 Admin의 승인을
          받으셔야 합니다.
        </div>
        가게 이름:
        <span>

          <span>
              <md-dialog :md-active.sync="showDialog_1">
                <md-dialog-title>가게 정보 변경</md-dialog-title>

                <md-tabs md-dynamic-height>
                  <md-tab md-label="가게 이름 변경">
                    <input type="store_name" v-model="store_name" class="form-control" placeholder="가게 이름">
                  </md-tab>
                </md-tabs>

                <md-dialog-actions>
                  <md-button class="md-primary" @click="showDialog_1 = false">취소</md-button>
                  <md-button class="md-primary" @click="change_store_name()">변경</md-button>
                </md-dialog-actions>
              </md-dialog>

              <md-button class="md-dense md-accent md-raised" @click="showDialog_1 = true">이름 변경</md-button>
            </span>

        </span>
        <div class="crack" />
        가게 주소:
        <span>

          <span>
              <md-dialog :md-active.sync="showDialog_2">
                <md-dialog-title>가게 정보 변경</md-dialog-title>

                <md-tabs md-dynamic-height>
                  <md-tab md-label="가게 주소 변경">
                    <input type="store_location" v-model="store_location" class="form-control" placeholder="가게 주소">
                  </md-tab>
                </md-tabs>

                <md-dialog-actions>
                  <md-button class="md-primary" @click="showDialog_2 = false">취소</md-button>
                  <md-button class="md-primary" @click="change_store_location()">변경</md-button>
                </md-dialog-actions>
              </md-dialog>

              <md-button class="md-dense md-accent md-raised" @click="showDialog_2 = true">주소 변경</md-button>
            </span>


        </span>
        <div class="crack" />



      </div>

    </div>

  </div>
</div>
</template>


<script>
import "./style.css";
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css';

import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'


export default {
  name: 'Stock',
  data() {
    return {
      showDialog: false,
      showDialog_1: false,
      showDialog_2: false,
      pwd: null,
      pwd_trial: null,
      uid: null,
      store_name: null,
      store_location: null,

      user_name: '',
      user_email: '',
      user_addr: '',
      user_pwd: '',


    };
  },
  created() {
    this.uid = this.$session.get('uId');


  },
  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    change_pwd() {
      if(this.pwd == this.pwd_trial){

        // axios POST
        axios({
            method: 'POST',
            url: baseurl + '/bakery_users/_doc/' + this.uid + '/_update',
            headers: {
              Authorization: 'Basic ZWRnZ1JBOVB2OjY3MzM3MjdiLWFlY2YtNGVlOS1iMmExLTBiNmFjN2RhMmMzYw==',
              'Content-Type': 'application/json'
            },
            data: {
              'doc': {
                'uPassword': this.pwd,
              }
            }
          })
          .then((response) => {
            //var hits_length = response.data.hits.hits.length
            console.log(response);
            alert("변경되었습니다");
            window.history.go(0);
          }).catch((e) => {
            console.log(e.response)
          })

        this.showDialog = false;
      }else{
        alert("비밀번호가 일치하지 않습니다!");
      }

    },

    change_store_name(){

      this.showDialog_1 = false;
    },

    change_store_location(){

      this.showDialog_2 = false;
    },



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

.crack {
  margin-bottom: 10px;
}
</style>
