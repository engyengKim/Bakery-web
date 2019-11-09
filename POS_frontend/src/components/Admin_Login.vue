<template>
<div class="container" id="login-container">

  <div id="login">
    <h3 class="text-center text-white pt-5">Welcome to Bakery Admin Web!</h3>
    <div class="container">
      <div id="login-row" class="row justify-content-center align-items-center">
        <div id="login-column" class="col-md-6">
          <div id="login-box" class="col-md-12" style="height: 402px;">
            <form id="login-form" class="form" @submit.prevent="loginFunction">
              <h3 class="text-center text-info">관리자 로그인</h3>
              <div class="form-group">
                <label for="uEmail" class="text-info">이메일:</label><br>
                <input type="email" name="uEmail" id="uEmail" v-model="uEmail" class="form-control">
              </div>
              <div class="form-group">
                <label for="uPassword" class="text-info">비밀번호:</label><br>
                <input type="password" name="uPassword" id="uPassword" v-model="uPassword" class="form-control">
              </div>

              <div class="form-group">
                <p id="securityWarning">관리자 계정 보안에 유의하시기 바랍니다</p>
                <button class="btn btn-success">로그인</button>
                <div id="register-link" class="text-right">
                  <div style="margin-bottom: 10px;" />
                  <md-button class="md-accent" v-on:click="gotoHome()">이전 페이지</md-button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io/bakery_admin'
var currentUserId = ''

export default {
  name: 'Login',
  data() {
    return {
      'uEmail': '',
      'uPassword': ''
    }
  },
  created(){
    if(this.$session.exists() && this.$session.get('type') == 'Admin'){
      this.$router.replace('/Admin_Home')
    }
  },
  methods: {
    loginFunction: function(){
         axios({
               method: 'POST',
               url: baseurl+'/_search',
               headers: {
                   Authorization: 'Basic S0IzSFZ4R2dIOmU5YjRkYzU4LTM1MjgtNDZiMi1hZDU3LTA5MDVjMzRmNjU2NA==',
                   'Content-Type': 'application/json'
               },
               data: {
                   'query':{
                       'bool':{
                           'must':[
                               {'match_phrase':{ 'email':this.uEmail}},
                               {'match_phrase':{ 'password':this.uPassword}}
                           ]
                       }
                   }
               }
           }).then((response) => {
               console.log(response)

               if(response.data.hits.max_score != null){
                   currentUserId = response.data.hits.hits[0]._id
                   var currentUserName = response.data.hits.hits[0]._source.name
                   var currentUserType = response.data.hits.hits[0]._source.type
                   this.$session.set('uId', currentUserId)
                   this.$session.set('type', currentUserType)
                   console.log("CONFIRM!")
                   console.log("Current User ID is :"+currentUserId)
                   console.log("Current User TYPE is :"+currentUserType)
                   alert('어서오세요! '+currentUserName+'관리자 님')
                   this.$router.push('/Admin_Home')
               }
               else{
                   currentUserId = ''
                   console.log("NOT CONFIRM")
                   console.log("Current User ID is :"+currentUserId)
                   alert('로그인 실패! \n 이메일과 비밀번호를 확인하세요')
               }
               console.log(currentUserId)
               console.log(this.$session.type)

           }).catch((ex)=>{
               console.log(ex)
           })
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
#securityWarning {
   color: red;
}
</style>
