<template>
  <nav>
    <ul>
        <li v-if="isLoggedIn">
          <a id="logout-link" href="#" @click.prevent="logout">Logout</a>
        </li>
    </ul>
  </nav>

</template>

<script>
export default {
   created() {

      if(!this.$session.exists()){
        alert("로그인이 돼 있지 않습니다.")
        this.$router.push("/Login")
      }
      else{
        if(confirm("로그아웃 하시겠습니까?")) {

         this.$session.destroy();
         alert("로그아웃 되었습니다.");
         this.$router.push("/");
        }
      }


         //axios.get('api/logout').then(response => {
         // localStorage.removeItem('auth_token');


          // axios.defaults.headers.common['Authorization'] = 'Bearer ' + auth_token ;
          //delete axios.defaults.headers.common['Authorization'];

          // If using 'vue-router' redirect to login page
          //this.$router.go('/login');
        //})
        //.catch(error => {
          // If the api request failed then you still might want to remove
          // the same data from localStorage anyways
          // perhaps this code should go in a finally method instead of then and catch
          // methods to avoid duplication.
          //localStorage.removeItem('auth_token');
          //delete axios.defaults.headers.common['Authorization'];
          //this.$router.go('/login');
        //});
   }
}
</script>
