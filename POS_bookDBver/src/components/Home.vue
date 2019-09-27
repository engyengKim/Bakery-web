<template>
  <div class="container">
     <div class="row">
       <div class="col-12">
         <div class="page-header">
           <h1 id="theme">POS Web</h1><br><br>
             <p id="description" class="lead"><font color="black">
               <h3>Hi, store manager</h3></font>
             </p>

             <div><font color="black">
               <p>We will provide you with the best service so that<br>
               you can run the store well again today.</p>
               <p>POS web has 3 main systems.<br>
               </p></font>
             </div><br>

             <div class="btn-group-vertical" data-toggle="buttons">
               <button type="button" class="btn btn-warning" v-on:click="goto_stock()">Stock management</button><div class="crack"></div>
               <button type="button" class="btn btn-warning" v-on:click="goto_payment()">Payment system</button><div class="crack"></div>
               <button type="button" class="btn btn-warning" v-on:click="goto_order()">Advance order management</button>
             </div>
         </div>
       </div>
     </div>

   </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  },
  methods:{
    goto_order() {
      this.$router.replace('/order')
    },
    goto_stock() {
      this.$router.replace('/stock')
    },
    goto_payment() {
      this.$router.replace('/payment')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';

.crack{
  margin-bottom: 10px;
}

.page-header{
  text-align: center;
}

#theme{
  padding-top: 60px;
}

</style>
