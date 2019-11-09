<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">Admin Page</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">마이 페이지</h5>

      <div class="description">
        <h6 style="margin-top: 40px; margin-bottom:15px;">[관리자 정보]</h6>
        관리자 이름: <span class="user_info">{{ this.admin_name }}</span>
        <div class="crack" />
        관리자 이메일: <span class="user_info">{{ this.admin_email }}</span>
        <div class="crack" />
        관리자 비밀번호: <span class="user_info">{{ this.admin_pwd }}</span>
        <span>
          <span>
              <md-dialog :md-active.sync="showDialog">
                <md-dialog-title>관리자 정보 변경</md-dialog-title>

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

              <md-button class="md-dense md-accent md-raised" @click="showDialog = true" style="margin-left: 20px;">비밀번호 변경</md-button>
            </span>
        </span>

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
      pwd: null,
      pwd_trial: null,

      admin_name: null,
      admin_email: null,
      admin_pwd: null,
    };
  },

  created() {

    if(this.$session.get('type') != 'Admin'){

      this.$session.destroy();
      alert("관리자 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    this.uid = this.$session.get('uId');

    // axios POST
    axios({
        method: 'POST',
        url: baseurl + '/bakery_admin/_mget',
        headers: {
          Authorization: 'Basic S0IzSFZ4R2dIOmU5YjRkYzU4LTM1MjgtNDZiMi1hZDU3LTA5MDVjMzRmNjU2NA==',
          'Content-Type': 'application/json'
        },
        data: {
          "docs": [
            {
              "_id": this.uid,
            },
          ]
        }
      })
      .then((response) => {
        console.log(response);

        this.admin_name = response.data.docs[0]._source.name;
        this.admin_email = response.data.docs[0]._source.email;
        this.admin_pwd = response.data.docs[0]._source.password;

      }).catch((e) => {
        console.log(e.response)
      })
  },

  methods: {
    goto_home() {
      this.$router.replace('/admin_home')
    },

    change_pwd() {
      if(this.pwd == this.pwd_trial){

        // axios POST
        axios({
            method: 'POST',
            url: baseurl + '/bakery_admin/_doc/' + this.uid + '/_update',
            headers: {
              Authorization: 'Basic S0IzSFZ4R2dIOmU5YjRkYzU4LTM1MjgtNDZiMi1hZDU3LTA5MDVjMzRmNjU2NA==',
              'Content-Type': 'application/json'
            },
            data: {
              'doc': {
                'password': this.pwd,
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

.user_info{
  color: blue;
}
</style>
