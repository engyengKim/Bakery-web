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
        매니저 이름: <span class="user_info">{{ this.user_name }}</span>
        <div class="crack" />
        매니저 이메일: <span class="user_info">{{ this.user_email }}</span>
        <div class="crack" />
        <span style="color:gray; font-weight:bold;">비밀번호를 변경하시겠습니까?</span>
        <span>
          <span>
              <md-dialog :md-active.sync="showDialog">
                <md-dialog-title>매니저 정보 변경</md-dialog-title>

                <md-tabs md-dynamic-height>
                  <md-tab md-label="비밀번호 변경">
                    <input type="origin_pwd" v-model="origin_pwd" class="form-control" placeholder="기존 비밀번호">
                    <input type="pwd" v-model="pwd" class="form-control" placeholder="새 비밀번호">
                    <input type="pwd_trial" v-model="pwd_trial" class="form-control" placeholder="새 비밀번호 재입력">
                  </md-tab>
                </md-tabs>

                <md-dialog-actions>
                  <md-button class="md-primary" @click="showDialog = false">취소</md-button>
                  <md-button class="md-primary" @click="change_pwd()">변경</md-button>
                </md-dialog-actions>
              </md-dialog>

              <button class="btn btn-danger btn-sm" @click="showDialog = true" style="margin-left:10px;">비밀번호 변경</button>
            </span>

        </span><br>
        <div class="crack" />

        <h6 style="margin-top: 30px; margin-bottom:10px;">[가게 정보]</h6>
        <div class="caution" style="color:gray; font-size:15px; margin-bottom:15px;">
          [가게 이름 변경]과 [주소 변경]의 경우, 반드시 사전에 Admin의 승인을
          받으셔야 합니다.
        </div>
        가게 이름: <span class="user_info">{{ this.$session.get('storeName') }}</span>
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
                  <md-button class="md-primary" @click="change_store_name()">변경 요청</md-button>
                </md-dialog-actions>
              </md-dialog>

              <button id="storeNameButton" class="btn btn-danger btn-sm" @click="showDialog_1 = true" style="margin-left:10px;">{{name_request_button_value}}</button> <!--id 추가 -->
            </span>

        </span>
        <div class="crack" />
        가게 주소: <span class="user_info">{{ this.user_addr }}</span>
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
                  <md-button class="md-primary" @click="change_store_location()">변경 요청</md-button>
                </md-dialog-actions>
              </md-dialog>

              <button id="storeLocationButton" class="btn btn-danger btn-sm" @click="showDialog_2 = true" style="margin-left:10px;">{{ location_request_button_value }}</button> <!--id 추가 -->
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

function makeDate(){ //현재 시간 만들기 함수
  var request_date;

      var nd = new Date()
      var yyyy = nd.getFullYear()
      var mm = nd.getMonth()+1
      var dd = nd.getDate()

      if((mm+"").length < 2)
        mm += "0"+mm;

      if((dd+"").length < 2)
        dd += "0"+dd;
      var hh = nd.getHours()
      var mm = nd.getMinutes()
      var ss = nd.getSeconds()

    request_date = yyyy+'-'+mm+'-'+dd+" "+hh+":"+mm+":"+ss;

  return request_date;
}

export default {
  name: 'MyPage',
  data() {
    return {
      showDialog: false,
      showDialog_1: false,
      showDialog_2: false,
      pwd: null,
      pwd_trial: null,
      origin_pwd: null,
      uid: null,
      store_name: null,
      store_location: null,

      user_name: '',
      user_email: '',
      user_addr: '',
      user_pwd: '',
      user_bankinfo: '',
      location_request_button_value: '매장 주소 변경',
      name_request_button_value: '매장 이름 변경',

    };
  },

  created() {

    console.log("type:"+this.$session.type)
    if(this.$session.get('type') != 'Manager'){
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    this.uid = this.$session.get('uId');

    axios({ //변경 request 상태 불러오기
        method: 'POST',
        url: baseurl + '/bakery_request/_search',
        headers: {
          Authorization: 'Basic REhYMnAwS0VROjg2NGY1NDgxLTVkNTgtNDY1Yy1hMGY3LTkyYWZjYTQ5YmMwMw==',
          'Content-Type': 'application/json'
        },
        data: {
          'from':0,
          'size':2,
           'query':{

            'bool':{
                'must':[
                    {'match_phrase':{ 'managerID':this.uid}},
                    {'match_phrase':{ 'isConfirm':"false"}}

                ]
            }

          }
        }
      })
      .then((response) => {
        console.log("this is success response")
        console.log(response);

        var hits_array = response.data.hits.hits

        for(var i in hits_array){

          var data = hits_array[i]._source

          var isConfirm = data.isConfirm;
          var name_after = data.name_after;
          var name_before = data.name_before;
          var location_after = data.location_after;
          var location_before = data.location_before;
          var type = data.type;

          if(isConfirm == false && type == "name"){

            this.name_request_button_value = '매장 명 변경 요청 중'
            document.getElementById('storeNameButton').disabled = true;
          }
          else if(isConfirm == false && type == "location"){
            this.location_request_button_value = '매장 주소 변경 요청 중'
            document.getElementById('storeLocationButton').disabled = true;
          }
        }

      }).catch((e) => {
        console.log(e.response)
      })

    // axios POST
    axios({
        method: 'POST',
        url: baseurl + '/bakery_manager/_mget',
        headers: {
          Authorization: 'Basic V1E3M0ZKMk1lOjkzZWJiNjNlLWE1MWMtNDJmNS04YjhlLTY5YzBjNjY0YjdkMw==',
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

        this.user_name = response.data.docs[0]._source.name;
        this.user_email = response.data.docs[0]._source.email;
        this.user_addr = response.data.docs[0]._source.address;
        this.user_pwd = response.data.docs[0]._source.password;
        this.user_bankinfo = response.data.docs[0]._source.bankInfo;

        //this.store_name = response.data.docs[0]._source.storeName;

      }).catch((e) => {
        console.log(e.response)
      })



  },

  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    change_pwd() {
      if(this.user_pwd == this.origin_pwd){
        if(this.pwd == this.pwd_trial){

          // axios POST
          axios({
              method: 'POST',
              url: baseurl + '/bakery_manager/_doc/' + this.uid + '/_update',
              headers: {
                Authorization: 'Basic eXVkeG5LSXFGOmM4NWFiNGE0LWQ0ZTktNDJjNC1iMDdkLTMzMTMwYTU1MzRhMw==',
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
      }else{
        alert("현재 비밀번호가 잘못 입력되었습니다!");
      }


    },

    change_store_name(){
      var request_date = makeDate();

      axios({
          method: 'POST',
          url: baseurl + '/bakery_request/_doc/',
          headers: {
            Authorization: 'Basic REhYMnAwS0VROjg2NGY1NDgxLTVkNTgtNDY1Yy1hMGY3LTkyYWZjYTQ5YmMwMw==',
            'Content-Type': 'application/json'
          },

          data: {
            "managerID": this.$session.get("uId"),
            "managerName":this.user_name,
            "name_before": this.$session.get("storeName"),
            "name_after": this.store_name,
            "location_before":this.user_addr,
            "location_after":"null",
            "request_date": request_date,
            "isConfirm": false,
            "type":"name"
          }
        })
        .then((response) => {

          console.log(response);
          alert("변경 요청이 완료 되었습니다.\n관리자의 승인을 기다려주세요.");
          this.showDialog_1 = false;
          window.history.go(0);
        }).catch((e) => {
          console.log(e.response)
        })
    },

    change_store_location(){
      var request_date = makeDate();

      axios({
          method: 'POST',
          url: baseurl + '/bakery_request/_doc/',
          headers: {
            Authorization: 'Basic REhYMnAwS0VROjg2NGY1NDgxLTVkNTgtNDY1Yy1hMGY3LTkyYWZjYTQ5YmMwMw==',
            'Content-Type': 'application/json'
          },

          data: {
            "managerID": this.$session.get("uId"),
            "managerName":this.user_name,
            "name_before": this.$session.get("storeName"),
            "name_after": "null",
            "location_before":this.user_addr,
            "location_after":this.store_location,
            "request_date": request_date,
            "isConfirm": false,
            "type":"location"
          }
        })
        .then((response) => {

          console.log(response);
          alert("변경 요청이 완료 되었습니다.\n관리자의 승인을 기다려주세요.");
          this.showDialog_2 = false;
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
