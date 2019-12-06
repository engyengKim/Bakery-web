<template>
<div class="container" id="login-container">

  <div id="login">
    <h3 class="text-center text-white pt-5">Welcome to Bakery POS Web!</h3>
    <div class="container">
      <div id="login-row" class="row justify-content-center align-items-center">
        <div id="login-column" class="col-md-6">
          <div id="login-box" class="col-md-12" style="height: 420px;">
            <form id="login-form" class="form" @submit.prevent="loginFunction">
              <h3 class="text-center text-info">로그인</h3>
              <div class="form-group">
                <label for="uEmail" class="text-info">이메일:</label><br>
                <input type="email" name="uEmail" id="uEmail" v-model="uEmail" class="form-control">
              </div>
              <div class="form-group">
                <label for="uPassword" class="text-info">비밀번호:</label><br>
                <input type="password" name="uPassword" id="uPassword" v-model="uPassword" class="form-control">
              </div>

              <div class="form-group">
                <button class="btn btn-success">로그인</button>
                <div id="register-link" class="text-right">
                  <md-button class="md-accent" style="font-weight:bold;" v-on:click="gotoHome()">이전 페이지</md-button>
                </div>

                <div style="text-align:right">
                  <md-button class="md-dense" v-on:click="ask_help()">매니저 계정을 잊어버리셨나요?</md-button>
                  <div id="help" style="font-size:small; color:blue;"></div>
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
const baseurl = 'https://scalr.api.appbase.io/bakery_manager'
var currentUserId = ''

export default {
  name: 'Login',
  data() {
    return {
      'uEmail': '',
      'uPassword': '',
      admin_email: '',
    }
  },
  created() {
    if(this.$session.get('type') == 'Manager'){
      this.$router.replace('/home')
    }

    // get admin contact
    axios({
        method: 'POST',
        url: 'https://scalr.api.appbase.io/bakery_admin/_mget',
        headers: {
          Authorization: 'Basic ak55SHdjYXBtOmU2NmJkMjFlLWYxYzUtNDNjMS04NjkxLTI0MThmYTg2YzNjZA==',
          'Content-Type': 'application/json'
        },
        data: {
          "docs": [{
            "_id": 'sK5KIm4BvBPhFQgpKRNe',
          }, ]
        }
      })
      .then((response) => {
        console.log(response);
        this.admin_email = response.data.docs[0]._source.email;

      }).catch((e) => {
        console.log(e.response)
      })

  },
  methods: {
    loginFunction: function(){
         axios({
               method: 'POST',
               url: baseurl+'/_search',
               headers: {
                   Authorization: 'Basic V1E3M0ZKMk1lOjkzZWJiNjNlLWE1MWMtNDJmNS04YjhlLTY5YzBjNjY0YjdkMw==',
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
                   var currentStoreName = response.data.hits.hits[0]._source.storeName
                   this.$session.set('uId', currentUserId)
                   this.$session.set('type', currentUserType)
                   this.$session.set('storeName', currentStoreName)
                   this.$session.set('manager_name', currentUserName)
                   console.log("CONFIRM!")
                   console.log("Current User ID is :"+currentUserId)
                   alert('어서오세요! '+currentUserName+'님')
                   this.$router.push('/home')
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

    ask_help() {
      // show admin contact
      var html = '';
      html += 'Admin 연락처는 <span style="font-weight:bold;">';
      html += this.admin_email;
      html += '</span>입니다. <br>이곳으로 연락해보세요.';
      document.getElementById("help").innerHTML = html;
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
  height: 420px;
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
