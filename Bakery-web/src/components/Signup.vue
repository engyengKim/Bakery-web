<template>
<div class="container" id="login-container">

  <div id="login">
    <h3 class="text-center text-white pt-5">Welcome to Bakery Web!</h3>
    <div class="container">
      <div id="login-row" class="row justify-content-center align-items-center">
        <div id="login-column" class="col-md-6">
          <div id="login-box" class="col-md-12" style="height: auto;">

              <h3 class="text-center text-info">회원 가입</h3>
                <div class="form-group">
                  <label for="uName" class="text-info">이름</label>
                  <input type="name" name="uName" id="uName" v-model="uName" class="form-control">
                </div>
                <div class="form-group">
                  <label for="uEmail" class="text-info">이메일</label>
                  <input type="email" name="uEmail" id="uEmail" v-model="uEmail" class="form-control">
                  <div class="row">
                    <div class="col-12">
                      <p class="text-danger">{{duplicate_true}}</p><p class="text-success">{{duplicate_false}}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 d-flex">
                    <button class="btn btn-sm btn-outline-danger ml-auto" v-on:click="duplicate_check">중복 확인</button>
                  </div>
                  </div>

                </div>
                <div class="form-group">
                  <label for="uPassword" class="text-info">비밀번호</label>
                  <input type="password" name="uPassword" id="uPassword" v-model="uPassword" class="form-control">
                </div>
                <div class="form-group">
                  <label for="uAddress" class="text-info">주소</label>
                  <input type="text" name="uAddress" id="uAddress" v-model="uAddress" class="form-control">
                </div>
                <div class="form-group">
                 <label for="uContact" class="text-info">연락처</label>
                 <input type="text" name="uContact" id="uContact" v-model="uContact" class="form-control">
                </div>

              <div class="form-group">
                <button class="btn btn-success" v-on:click="register">가입 하기</button>
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io/bakery_customer'
var currentUserId = ''
export default {
  name: 'Signup',
  data() {
    return {
      'uEmail': '',
      'uPassword': '',
      'uName' : '',
      'uAddress': '',
      'uContact':'',
      'duplicate_true':'중복 확인 버튼을 눌러주세요.',
      'duplicate_false':'',
    }
  },
  methods: {
    duplicate_check(){

      if(this.check_result = ''){
        alert("이메일을 입력해주세요.")
      }
      else{
        axios({
               method: 'POST',
               url: baseurl+'/_search',
               headers: {
                   Authorization: 'Basic anhaMFFSQzdhOjhlNDhjYzhlLWUxNmUtNDNiNy1hZjUyLTkzODBkZmU1NDVhNA==',
                   'Content-Type': 'application/json'
               },
               data: {
                   'query':{
                       'bool':{
                           'must':[
                               {'match_phrase':{ 'email':this.uEmail}},
                           ]
                       }
                   }
               }
           }).then((response) => {
               console.log(response)

               if(response.data.hits.max_score != null || this.uEmail == ''){
                   this.duplicate_false = ''
                   this.duplicate_true = '사용 불가능한 이메일입니다.'
                   this.$session.set("duplicate", true);
               }
               else{
                   this.duplicate_true = ''
                   this.duplicate_false = "사용 가능한 이메일입니다."
                   this.$session.set("duplicate", false);
                   this.$session.set("temp_email", this.uEmail)
               }

           }).catch((ex)=>{
               console.log(ex)
           })
      }
    },
    register() {

      if(this.$session.get("duplicate") || this.$session.get("temp_email") != this.uEmail){
        alert("이메일 중복 확인을 해주세요.")
      }
      else{
        // 회원가입
      axios({
          method: 'POST',
          url: baseurl + '/_doc/',
          headers: {
            Authorization: 'Basic anhaMFFSQzdhOjhlNDhjYzhlLWUxNmUtNDNiNy1hZjUyLTkzODBkZmU1NDVhNA==',
            'Content-Type': 'application/json'
          },
          data: {
            "email": this.uEmail,
            "password": this.uPassword,
            "name": this.uName,
            "address": this.uAddress,
            "contact": this.uContact,
            "bakeryCoin": 0,
            "barcode": "",
          }
        })
        .then((response) => {
          //var hits_length = response.data.hits.hits.length
          console.log(response);
          this.$session.destroy();
          alert("회원 가입이 완료 되었습니다!\n로그인 해 주세요.");
          this.showDialog = false;
          this.$router.push('/login')
        }).catch((e) => {
          console.log(e.response)
        })
      }
    },
    gotoHome() {
      this.$router.replace('/')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');
@import url("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css");
@import url("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js");
@import url("https://code.jquery.com/jquery-1.11.1.min.js");
.crack {
  margin-bottom: 10px;
}
.page-header {
  text-align: center;
}
#theme {
  padding-top: 60px;
}
body {
  font-family: "Lato", sans-serif;
}
.main-head {
  height: 150px;
  background: #FFF;
}
body {
  margin: 0;
  padding: 0;
  background-color: #17a2b8;
  height: 100vh;
}
#login .container #login-row #login-column #login-box {
  max-width: 600px;
  height: 320px;
  border: 1px solid #9C9C9C;
  background-color: #EAEAEA;
}
#login .container #login-row #login-column #login-box #login-form {
  padding: 20px;
}
#login-container {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
