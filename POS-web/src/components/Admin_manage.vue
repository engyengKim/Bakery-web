<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">Admin Page</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">정보 변경 요청</h5>
      <p class="container">매니저가 관리자께 요쳥한 정보 변경을 확인하십시오</p>

      <table class="table">
        <thead>
          <th scope="col">#</th>
          <th scope="col">매니저 이름</th>
          <th scope="col">요청 내용</th>
          <th scope="col">상세 내용</th>
          <th scope="col">확 인</th>
        </thead>

        <tbody id="table_list">

        </tbody>

      </table>


      <h5 id="theme">매니저 현황</h5>

      <div style="margin-left:auto; margin-right:auto;">
        <md-dialog :md-active.sync="showDialog" style="height:800px;">
          <!-- openDialogFunction 추가 !! -->
          <md-dialog-title>새로운 매니저 정보 입력</md-dialog-title>

          <md-tabs md-dynamic-height>
            <md-tab md-label="매니저 정보">
              <div class="form-group">
                <div class="input-group mb-3">
                  <span style="font-weight: bold;">이름</span>
                  <input type="text" v-model="m_name" class="form-control" placeholder="이름">
                </div>
              </div>

              <div class="form-group">
                <div class="input-group mb-3">
                  <span style="font-weight: bold;">연락처</span>
                  <input type="text" v-model="m_contact" class="form-control" placeholder="연락처">
                  <span style="font-weight: bold;">이메일</span>
                  <input type="text" v-model="m_email" class="form-control" placeholder="메일 주소">
                </div>
              </div>
            </md-tab>

            <md-tab md-label="가게 정보">
              <div class="form-group">
                <span style="font-weight: bold;">가게 이름</span>
                <input type="text" v-model="m_storeName" class="form-control" placeholder="가게 이름">
                <span style="font-weight: bold;">가게 주소</span>
                <input type="text" v-model="m_address" class="form-control" placeholder="가게 주소">
              </div>
            </md-tab>

          </md-tabs>

          <md-dialog-actions>
            <md-button class="md-primary" @click="showDialog = false">취소</md-button>
            <md-button class="md-accent" @click="add_manager()">등록</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-button class="md-primary" @click="showDialog = true" style="font-weight:bold;">매니저 등록</md-button>
      </div>

      <div id="app">
        <reactive-base app="bakery_manager" credentials="WQ73FJ2Me:93ebb63e-a51c-42f5-8b8e-69c0c664b7d3">

          <reactive-list componentId="SearchResult" dataField="_id" style="width:800px;" :showResultStats="false" :pagination="true" :from="0" :size="5" sortBy="asc">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <table>
                      <tr>
                        <td style="font-weight: bold;">{{ item.name }}</td>
                        <td><button class="btn btn-danger btn-sm" v-on:click="delete_manager(item._id)">탈퇴시키기</button></td>
                      </tr>

                      <tr>
                        <td style="color: #425DC6; font-weight:bold; width:100px;">[연락처]</td>
                        <td style="width:200px;">{{ item.contact }}</td>
                        <td style="color: #425DC6; font-weight:bold; width:100px;">[이메일]</td>
                        <td style="width:300px;">{{ item.email }}</td>
                      </tr>

                      <tr>
                        <td style="color: #425DC6; font-weight:bold;">[가게 이름]</td>
                        <td>{{ item.storeName }}</td>
                      </tr>


                      <tr>
                        <td style="color: #425DC6; font-weight:bold;">[가게 주소]</td>
                        <td>{{ item.address}}</td>
                      </tr>

                    </table>

                  </div>
                </div>
              </div>
            </div>
          </reactive-list>
        </reactive-base>
      </div>


      <h5 id="theme">고객 현황</h5>

      <div id="app">
        <reactive-base app="bakery_customer" credentials="1GnSwfXne:9ea005c6-da1d-4ab0-9516-52fbc31ecd9c">

          <reactive-list componentId="SearchResult" dataField="_id" style="width: 800px;" :showResultStats="false" :pagination="true" :from="0" :size="5" sortBy="asc">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <table>
                      <tr>
                        <td style="font-weight: bold;">{{ item.name }}</td>
                      </tr>
                      <tr>
                        <td style="color: #425DC6; font-weight:bold; width:100px;">[연락처]</td>
                        <td style="width:200px;"> {{ item.contact }}</td>
                        <td style="color: #425DC6; font-weight:bold; width:100px;">[이메일]</td>
                        <td style="width:300px;">{{ item.email }}</td>
                      </tr>
                    </table>

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

function updateRequestToTrue(rid){ // request isConfirm을 true로 바꿔주는 버튼 함수 //파라미터 : 변경 될 요청의 고유 id값
  axios({
    method: 'POST',
    url: baseurl + '/bakery_request/_doc/' + rid + '/_update',
    headers: {
      Authorization: 'Basic REhYMnAwS0VROjg2NGY1NDgxLTVkNTgtNDY1Yy1hMGY3LTkyYWZjYTQ5YmMwMw==',
      'Content-Type': 'application/json'
    },
    data: {
      'doc': {
        'isConfirm': true
      }
    }
  })
  .then((response) => {

    console.log("success update request db")


  }).catch((e) => {
    console.log("request DB update error")
    console.log(e)

  })
}

function updateManagerStoreName(mid,sName){ // 매니저의 정보를 업데이트해줌 파라미터 : 변경 될 매니저 고유 id값과 변경 될 가게 이름명
  axios({
    method: 'POST',
    url: baseurl + '/bakery_manager/_doc/' + mid + '/_update',
    headers: {
      Authorization: 'Basic eXVkeG5LSXFGOmM4NWFiNGE0LWQ0ZTktNDJjNC1iMDdkLTMzMTMwYTU1MzRhMw==',
      'Content-Type': 'application/json'
    },
    data: {
      'doc': {
        'storeName': sName,
      }
    }
  })
  .then((response) => {

    console.log(response);

    alert("매장 명 변경이 승인 되었습니다.");
    window.history.go(0);
  }).catch((e) => {
    console.log(e.response)

  })
}

function updateManagerStoreAddress(mid,sAddress){ // 매니저의 정보를 업데이트해줌 파라미터 : 변경 될 매니저 고유 id값과 변경 될 가게 주소
  axios({
    method: 'POST',
    url: baseurl + '/bakery_manager/_doc/' + mid + '/_update',
    headers: {
      Authorization: 'Basic eXVkeG5LSXFGOmM4NWFiNGE0LWQ0ZTktNDJjNC1iMDdkLTMzMTMwYTU1MzRhMw==',
      'Content-Type': 'application/json'
    },
    data: {
      'doc': {
        'address': sAddress,
      }
    }
  })
  .then((response) => {

    console.log(response);
    alert("매장 주소 변경이 승인 되었습니다.");
    window.history.go(0);

  }).catch((e) => {
    console.log(e.response)

  })
}


export default {
  name: 'Stock',
  data() {
    return {
      showDialog: false,

      m_address: '',
      m_bankinfo: '',
      m_contact: '',
      m_email: '',
      m_name: '',
      m_pwd: '123',
      m_storeName: '',
      m_type:'Manager',

    };
  },

  created() {

    if (this.$session.get('type') != 'Admin' && this.$session.exists()) {

      this.$session.destroy();
      alert("관리자 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }
  },

  mounted(){ // 중요 mounted()에 구현

    axios({ //변경 request 상태 불러오기
        method: 'POST',
        url: baseurl + '/bakery_request/_search',
        headers: {
          Authorization: 'Basic REhYMnAwS0VROjg2NGY1NDgxLTVkNTgtNDY1Yy1hMGY3LTkyYWZjYTQ5YmMwMw==',
          'Content-Type': 'application/json'
        },
        data: {
          'query':{
            'bool':{
                'must':[
                     {'match_phrase':{ 'isConfirm':'false'}},
                ]
            }

          }
        }
      })
      .then((response) => {
        console.log("this is success response")
        console.log(response);

        var hits_array = response.data.hits.hits
        var html = "";

        if(hits_array.length == 0){
          html += '<tr class="text-center"><td colspan="5">현재 요청이 없습니다.</td></tr>'
        }

        for(var i in hits_array){

          var data = hits_array[i]._source

          var isConfirm = data.isConfirm;
          var name_after = data.name_after;
          var name_before = data.name_before;
          var location_after = data.location_after;
          var location_before = data.location_before;
          var manager_name = data.managerName;
          var manager_id = data.managerID;
          var request_id = hits_array[i]._id;
          var type = data.type

          if(isConfirm == false && type == "name"){ //매장 이름 변경 승인시

            var value = manager_id + '/'+name_after
            html += '<tr><th scope="row">'+ (i*1+1)+'</th>'
            html += '<td>'+manager_name+'</td>'
            html += '<td>'+'매장 명 변경</td>'
            html += '<td>'+name_before+' → '+name_after+'</td>'
            html += '<td><button name="nameChangeButton" value="'+value+'" id="'+request_id+'">승 인</button></td>'
            html += '</tr>'
          }
          else if(isConfirm == false && type == "location"){ // 매장 주소 변경 승인시

            var value = manager_id +'/'+ location_after
            html += '<tr><th scope="row">'+ (i*1+1)+'</th>';
            html += '<td>'+manager_name+'</td>'
            html += '<td>'+'매장 주소 변경</td>'
            html += '<td>'+location_before+' → '+location_after+'</td>'
            html += '<td><button name="LocationChangeButton" value="'+value+'" id="'+request_id+'">승 인</button></td>'
            html += '</tr>'
          }
        }

        document.getElementById("table_list").innerHTML = html;

        ///////////// 동적 버튼 이벤트 할당
        var locationChangeButtons = document.getElementsByName("LocationChangeButton");
        var nameChangeButtons = document.getElementsByName("nameChangeButton");

          for(var i = 0; i <nameChangeButtons.length; i++){

            var v = nameChangeButtons[i].value.split('/');
            var rid = nameChangeButtons[i].id;
            console.log(rid);
            var mid = v[0];
            console.log(mid);
            var sname = v[1];
            console.log(sname);

            nameChangeButtons[i].addEventListener('click', function(e){
              var a = confirm("승인 하시겠습니까?")
              if(a == true){
                updateRequestToTrue(rid);
                updateManagerStoreName(mid, sname);
              }
              else {
                alert("변경 작업이 취소 되었습니다.")
              }
            })
          }

          for(var i = 0; i<locationChangeButtons.length; i++){

             var v = locationChangeButtons[i].value.split('/')
             var rid = locationChangeButtons[i].id
             console.log(rid)
             var mid = v[0]
             console.log(mid)
             var sAddress = v[1]
             console.log(sAddress)

            locationChangeButtons[i].addEventListener('click', function(e){
              var a = confirm("승인 하시겠습니까?")
              if(a == true){
                updateRequestToTrue(rid);
                updateManagerStoreAddress(mid, sAddress);
              }
            })
          }
      }).catch((e) => {
        console.log(e.response)
      });
  },

  methods: {
    goto_home() {
      this.$router.replace('/admin_home')
    },

    delete_manager(id){
      var is_confirm = confirm("매니저를 탈퇴시키겠습니까?");
      if(is_confirm){
        axios({
            method: 'POST',
            url: baseurl + '/bakery_manager/_delete_by_query',
            headers: {
              Authorization: 'Basic eXVkeG5LSXFGOmM4NWFiNGE0LWQ0ZTktNDJjNC1iMDdkLTMzMTMwYTU1MzRhMw==',
              'Content-Type': 'application/json'
            },
            data: {
              "query": {
                "match": {
                  "_id": id
                }
              }
            }
          })
          .then((response) => {
            //var hits_length = response.data.hits.hits.length
            console.log(response);
            alert("탈퇴 처리되었습니다.");
            window.history.go(0);
          }).catch((e) => {
            console.log(e.response)
          })
      }
    },

    add_manager(){
      axios({
          method: 'POST',
          url: baseurl + '/bakery_manager/_doc/',
          headers: {
            Authorization: 'Basic eXVkeG5LSXFGOmM4NWFiNGE0LWQ0ZTktNDJjNC1iMDdkLTMzMTMwYTU1MzRhMw==',
            'Content-Type': 'application/json'
          },

          data: {
            "address": this.m_address,
            "contact": this.m_contact,
            "email": this.m_email,
            "name": this.m_name,
            "password": this.m_pwd,
            "storeName": this.m_storeName,
            "type": this.m_type
          }
        })
        .then((response) => {
          //var hits_length = response.data.hits.hits.length
          console.log(response);
          alert("매니저가 등록되었습니다.");
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

.filters-container {
  width: 20%;
  margin-left: 30px;
  margin-top: 200px;
  display: inline-flex;
  flex-direction: column;
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
}

</style>
