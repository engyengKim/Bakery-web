<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">Advance order list</h5>
      <div>
        <reactive-base app="bakery_product" credentials="5xTGpCL5N:ddd1d6b3-6022-4e2f-ba6f-13805e7b9659">

          <reactive-list componentId="SearchResult" dataField="pName" :showResultStats="false" :pagination="true" :from="0" :size="5">
            <div slot="renderData" slot-scope="{ item }" class="order-list">
                  {{item.pName}}
            </div>
          </reactive-list>

        </reactive-base>
      </div>

    </div>



  </div>
</div>
</template>


<script>
export default {
  name: 'Order',
  data() {
    return {}
  },
  methods: {
    goto_home() {
      this.$router.replace('/home')
    }

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
  font-family: 'Noto Sans KR', sans-serif;
}

#nav_home {
  color: white;
}

.text-field {
  margin-top: 40px;
  margin-left: 40px;
}

.inline-1 {
  display: inline;
}

.order-list {
  padding-top: 15px;
}

</style>
