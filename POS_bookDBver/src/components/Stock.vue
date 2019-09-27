<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5>Stock management system</h5>

      <div id="app">
        <reactive-base app="good-books-yj" credentials="gBgUqs2tV:3456f3bf-ea9e-4ebc-9c93-08eb13e5c87c">
          <div class="filters-container">
            <multi-list componentId="Authors" dataField="authors.raw" class="filter" title="Select category" selectAllLabel="All breads" />
          </div>
          <reactive-list componentId="SearchResult" dataField="original_title.raw" className="result-list-container" :pagination="true" :from="0" :size="5" :react="{and: ['Ratings','Authors']}">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <span class="book-header">{{ item.original_title }}</span>
                  <span>amount</span>
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

export default {
  name: 'Stock',
  data() {
    return {
      showBooks: window.innerWidth <= 768 ? true : false
    };
  },
  methods: {
    switchContainer: function() {
      return (this.showBooks = !this.showBooks);
    },
    goto_home() {
      this.$router.replace('/')
    },

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

#nav_home {
  color: white;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}

.filters-container {
  width: 20%;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  margin-top: 100px;
  top: 0;
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
}

.result-list-container {
  width: 80%;
  position: absolute;
  right: 0;
  padding: 10px 40px;
  overflow-y: scroll;
  height: 100vh;
  display: inline-flex;
  flex-direction: column;
  scroll-behavior: smooth;
  transition: all ease 0.2s;
}

</style>
