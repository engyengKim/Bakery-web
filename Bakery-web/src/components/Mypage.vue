<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a id="nav_home" class="navbar-brand" style="color:white;" v-on:click="goto_home()">Bakery Web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme" style="font-weight:bold;">마이 페이지</h5>

      <div class="welcome" style="margin-bottom:10px;">
        <span style="color:blue;">{{this.uName}}</span>님의 개인정보를 확인하세요
      </div>

      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">이름</th>
            <th scope="col">연락처</th>
            <th scope="col">이메일</th>
            <th scope="col">주소</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-primary">
            <th scope="row">{{this.uName}}</th>
            <td>{{this.contact}}</td>
            <td>{{this.email}}</td>
            <td>{{this.addr}}</td>
          </tr>
        </tbody>
      </table>

      <span style="color:gray;">비밀번호를 변경하시겠습니까?</span>
      <span>
        <span>
          <md-dialog :md-active.sync="showDialog">
            <md-dialog-title>사용자 정보 변경</md-dialog-title>

            <md-tabs md-dynamic-height>
              <md-tab md-label="비밀번호 변경">
                <input type="origin_pwd" v-model="origin_pwd" class="form-control" placeholder="기존 비밀번호">
                <input type="pwd" v-model="new_pwd" class="form-control" placeholder="새 비밀번호">
                <input type="pwd_trial" v-model="new_pwd_trial" class="form-control" placeholder="새 비밀번호 재입력">
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

      <h5 id="theme" style="margin-top:40px; font-weight:bold;">나의 베이커리 코인</h5>
      <div class="sub-container" style="margin-bottom:20px; padding:10px;">

        <div class="my_coin">
          <h6 style="font-weight:bold;">베이커리 코인</h6>

          <div class="card border-info mb-3" style="max-width: 25rem;">
            <div class="card-header">{{this.uName}}님</div>
            <div class="card-body">
              <table>
                <tr>
                  <td>바코드</td>
                </tr>
                <tr>
                  <td>
                    <barcode v-bind:value="this.barcode" :options="{ format: 'EAN13', lastChar:'>' }" tag="svg">
                      Barcode error <!--오류시 출력 메세지-->
                    </barcode></td>
                </tr>
                <tr>
                  <td>현재 금액</td>
                  <td>{{this.bakery_coin}}원</td>
                </tr>
              </table>
            </div>
          </div>

        </div>

        <div class="coin_pay">
          <h6 style="font-weight:bold;">코인 충전하기</h6>
          <div>
            <span>
              <span>
                <md-dialog :md-active.sync="showDialog_2">
                  <md-dialog-title>베이커리 코인 충전하기</md-dialog-title>

                  <md-tabs md-dynamic-height>
                    <md-tab md-label="결제 진행">
                      <p><span style="font-weight:bold; color:red;">{{this.user_pay}}</span>원 결제 진행하시겠습니까?</p>
                    </md-tab>
                  </md-tabs>

                  <md-dialog-actions>
                    <md-button class="md-primary" @click="showDialog_2 = false">취소</md-button>
                    <md-button class="md-primary" @click="pay()">결제</md-button>
                  </md-dialog-actions>
                </md-dialog>

                <button type="button" class="btn btn-success" v-on:click="click_pay(5000)">5000원</button>
                <button type="button" class="btn btn-success" v-on:click="click_pay(10000)">10000원</button>
                <button type="button" class="btn btn-success" v-on:click="click_pay(20000)">20000원</button>
                <button type="button" class="btn btn-success" v-on:click="click_pay(50000)">50000원</button>

              </span>
            </span><br>
          </div>

        </div>

      </div>


    </div>
  </div>
</div>
</template>

<script>
import "./style.css";
import $ from 'jquery'
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'
var msg = ''

function numberFormat(inputNumber) { // 정규식으로 숫자 천 단위로 콤마찍기
   return inputNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateCoin(result, id, after_coin){
  if(result){//결제 성공시
    axios({
      method: 'POST',
      url: baseurl + '/bakery_customer/_doc/' + id + '/_update',
      headers: {
        Authorization: 'Basic anhaMFFSQzdhOjhlNDhjYzhlLWUxNmUtNDNiNy1hZjUyLTkzODBkZmU1NDVhNA==',
        'Content-Type': 'application/json'
      },
      data: {
        'doc': {
          'bakeryCoin': after_coin
        }
      }
    })
    .then((response) => {
      //var hits_length = response.data.hits.hits.length

      console.log("바코드 유저 결제 완료")
      console.log(response);
    }).catch((e) => {
      console.log(e.response)
    })
  }
  else{//결제 실패 또는 취소시

  }
  alert(msg);
  msg = '';
  window.history.go(0);
}

export default {
  name: 'Mypage',
  data() {
    return {
      uName: '',
      barcode: '',
      bakery_coin: 0,
      contact: '',
      email: '',
      addr: '',
      before_coin: '',

      pwd: '',
      origin_pwd: '',
      new_pwd_trial: '',
      new_pwd: '',

      coupon_lists: null,
      uid: '',

      showDialog: false,
      showDialog_2: false,
      user_pay: null,
    };
  },

  created() {

    this.uName = this.$session.get('uName');
    this.uid = this.$session.get('uId');
    this.barcode = this.$session.get('uBarcode')

    axios({
        method: 'POST',
        url: baseurl + '/bakery_customer/_mget',
        headers: {
          Authorization: 'Basic anhaMFFSQzdhOjhlNDhjYzhlLWUxNmUtNDNiNy1hZjUyLTkzODBkZmU1NDVhNA==',
          'Content-Type': 'application/json'
        },
        data: {
          "docs": [{
            "_id": this.uid,
          }, ]
        }
      })
      .then((response) => {
        console.log(response);
        var data = response.data.docs[0]._source

        this.email = data.email;
        this.before_coin = data.bakeryCoin
        this.contact = data.contact;
        this.addr = data.address;
        this.pwd = data.password;
        this.bakery_coin = numberFormat(this.before_coin*1);

      }).catch((e) => {
        console.log(e.response)
    })



      this.$nextTick(() => {

      $(function(){
        var IMP = window.IMP
        IMP.init('imp13189297');
      })

    })
  },
  methods: {
    goto_home() {
      this.$router.replace('/home');
    },

    change_pwd() {
      if (this.pwd == this.origin_pwd) {
        if (this.new_pwd == this.new_pwd_trial) {

          // axios POST
          axios({
              method: 'POST',
              url: baseurl + '/bakery_customer/_doc/' + this.uid + '/_update',
              headers: {
                Authorization: 'Basic anhaMFFSQzdhOjhlNDhjYzhlLWUxNmUtNDNiNy1hZjUyLTkzODBkZmU1NDVhNA==',
                'Content-Type': 'application/json'
              },
              data: {
                'doc': {
                  'password': this.new_pwd,
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
        } else {
          alert("비밀번호가 일치하지 않습니다!");
        }
      } else {
        alert("현재 비밀번호가 잘못 입력되었습니다!");
      }
    },

    click_pay(pay_amount){
      this.showDialog_2 = true;
      // 결제할 금액
      this.user_pay = pay_amount;
    },

    pay(){
      var pg = 'html5_inicis'
      var pay_method = 'card'
      var merchant_uid = 'recharge_'+this.uid+'_'+new Date().getTime()
      var name = '베이커리 코인 : '+this.user_pay +"원"
      var amount = '100' //테스트 결제 시 백원으로 고정
      var buyer_name = this.uName
      var buyer_tel = this.contact
      var buyer_addr = this.addr
      var buyer_email = this.email
      var after_coin = this.before_coin*1 + this.user_pay*1;
      var id = this.uid

      $(function(){
          IMP.request_pay({
          pg : pg,
          pay_method : pay_method,
          merchant_uid : merchant_uid,
          name : name,
          amount : amount,
          buyer_email : buyer_email,
          buyer_name : buyer_name,
          buyer_tel : buyer_tel,
          buyer_addr : buyer_addr,

      }, function(rsp) {
          if ( rsp.success ) {
              msg = '결제가 완료되었습니다.\n';
              //msg += '고유ID : ' + rsp.imp_uid+"\n";
              //msg += '상점 거래ID : ' + rsp.merchant_uid+"\n";
              msg += '결제 금액 : ' + rsp.paid_amount+"\n";
              //msg += '카드 승인번호 : ' + rsp.apply_num+"\n";
              msg += '이용 해 주셔서 감사합니다.'
          } else {
              msg = '결제에 실패하였습니다.\n';
              msg += '에러내용 : ' + rsp.error_msg;
          }
          updateCoin(rsp.success, id, after_coin)
          });
      });
      this.showDialog_2 = false;

    },

  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');
@import 'bootstrap.css';

.container {
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  width: auto;
}

.sub-container {
  background-color: #EFEADB;
  display: grid;
  grid-template-areas:
    'my_coin coin_pay';
}

.my_coin {
  grid-area: my_coin;
  display: grid;
}

.coin_pay {
  grid-area: coin_pay;
  display: grid;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}

.container {
  font-family: 'Noto Sans KR', sans-serif;
}

.crack {
  margin-top:5px;
  margin-bottom: 5px;
}
</style>
