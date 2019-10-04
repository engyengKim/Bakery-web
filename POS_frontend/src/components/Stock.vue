<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">Stock management system</h5>

      <div id="app">
        <reactive-base app="bakery_product" credentials="5xTGpCL5N:ddd1d6b3-6022-4e2f-ba6f-13805e7b9659">
          <div class="filters-container">
            <multi-list componentId="Category" dataField="pCategory.keyword" class="filter" title="Select category" selectAllLabel="All breads" />
          </div>
          <reactive-list componentId="SearchResult" dataField="pName" className="result-list-container" :pagination="true" :from="0" :size="5" :react="{and: ['Category']}">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold;">{{ item.pName }}</span>
                    <span style="margin-left:20px;">amount:</span>
                  </div>

                  <div class="form-group" style="margin-bottom:0px; margin-top:10px;">
                    <div class="input-group mb-3">
                      <md-button class="md-icon-button md-raised md-dense md-primary" @click="edit_clicked(item.pName)">Edit</md-button>
                      <div v-if="(get_now_name() == item.pName) && is_clicked">
                        <div class="input-group-append" style="margin-left:20px;">
                          <input type="user_amount" v-model="user_amount" class="form-control" id="input_amount" style="width: 80px;">
                          <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="save_db(item.pName)" style="margin-left:5px;">Save</md-button>
                        </div>
                      </div>
                    </div>
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

export default {
  name: 'Stock',
  data() {
    return {
      now_product_name: '',
      is_clicked: false,
      user_amount: null,
    };
  },
  methods: {

    goto_home() {
      this.$router.replace('/home')
    },

    save_db(name) {
      // pass [name, amount] to server

      // first, check amount is valid
      if (this.user_amount > 0) {
        alert("Success");
        this.is_clicked = false;
      } else {
        alert("Type positive integer!");
      }
    },

    edit_clicked(name) {
      this.now_product_name = name;
      this.is_clicked = true;
    },

    get_now_name() {
      return (this.now_product_name);
    },

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');

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

.inline-1 {
  display: inline-block;
}

#theme {
  font-family: 'Arbutus Slab', serif;
}
</style>
