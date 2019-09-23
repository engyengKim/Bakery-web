<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">

      <div class="grid-container">
        <div class="item1">Product list</div>
        <div class="item2">Menu</div>
        <div class="item3">Total price</div>
        <div class="item4">Pay or not</div>
      </div>



    </div>

  </div>
</div>
</template>


<script>
export default {
  name: 'Payment',
  data() {
    return {}
  },
  methods: {
    goto_home() {
      this.$router.replace('/')
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';

.container {
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
  width: auto;
}

#nav_home{
  color: white;
}

.text-field{
  margin-left: 40px;
  margin-top: 40px;
}

.item1 { grid-area: product_list; }
.item2 { grid-area: menu_field; }
.item3 { grid-area: tot_price; }
.item4 { grid-area: is_pay; }

.grid-container{
  display: grid;
  grid-template-areas:
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'product_list menu_field'
  'tot_price is_pay'
  'tot_price is_pay'
  'tot_price is_pay'
  'tot_price is_pay';
  grid-gap: 30px;
}

.grid-container > div{
  background-color: #DFF0F1;
  border: 1px solid #C8CDEE;
  font-size: 20px;
  text-align: center;
}
</style>
