<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">

      <div class="grid-container">
        <div class="item1">
          <h6>Product list</h6>
          <md-button class="md-raised md-accent" v-on:click="reset()">Reset</md-button>
          <div id="lists"></div>


        </div>
        <div class="item2">
          <reactive-base app="good-books-yj" credentials="gBgUqs2tV:3456f3bf-ea9e-4ebc-9c93-08eb13e5c87c">
            <div class="item5">
              <single-list componentId="Authors" dataField="authors.raw" class="filter" title="Select category" selectAllLabel="All breads" :showSearch="false" :showCount="false" />
            </div>

            <reactive-list componentId="SearchResult" dataField="original_title.raw" className="item6" :pagination="true" :from="0" :size="5" :react="{and: ['Authors']}">
              <div slot="renderData" slot-scope="{ item }">
                <div class="flex book-content" key="item._id">
                  <div class="fSlex column justify-center ml20">
                    <md-button v-on:click='get_name(item.original_title)'>{{ item.original_title }}</md-button>
                    <md-button class="md-fab md-mini md-primary" v-on:click="change_amount(item.original_title)">
                      <md-icon>edit</md-icon>
                    </md-button>
                    <md-button class="md-fab md-mini md-plain" v-on:click="delete_product(item.original_title)">
                      <md-icon>X</md-icon>
                    </md-button>

                  </div>
                </div>
              </div>
            </reactive-list>
          </reactive-base>
        </div>
        <div class="item3">Total price</div>
        <div class="item4">
          <h6>Pay or not</h6>
          <md-button class="md-primary md-raised" v-on:click="pay()">Pay</md-button>

          <md-dialog-confirm :md-active.sync="active" md-title="Cancel payment?" md-content="If you confirm, all the product list will be initialized" md-confirm-text="Agree" md-cancel-text="Disagree" @md-cancel="onCancel" @md-confirm="onConfirm" />
          <md-button class="md-primary md-raised" @click="active = true">Confirm</md-button>
        </div>
      </div>



    </div>

  </div>
</div>
</template>


<script>
export default {
  name: 'Payment',
  data() {
    return {
      product_name: '',
      product_list: [],
      product_amount: [],
      product_price: [],
      active: false,
    }
  },
  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    get_name(name) {
      this.product_name = name
      if (this.product_list.includes(name)) {
        alert("This is already added")
      } else {
        this.product_list.push(name)
        this.product_amount.push(1)
      }

      var html = '<table>';
      for (var i = 0; i < this.product_list.length; i++) {
        html += '<tr>';
        html += '<td>' + this.product_list[i] + '</td>';
        html += '<td>' + this.product_amount[i] + '</td>';
        html += '</tr>';

      }
      html += '</table>';
      document.getElementById("lists").innerHTML = html;
    },

    reset() {
      this.product_list = []
      document.getElementById("lists").innerHTML = this.product_list
    },

    delete_product(name) {
      var a = this.product_list.indexOf(name);
      if (a != -1) {
        this.product_list.splice(a, 1);
        this.product_amount.splice(a, 1);

        var html = '<table>';
        for (var i = 0; i < this.product_list.length; i++) {
          html += '<tr>';
          html += '<td>' + this.product_list[i] + '</td>';
          html += '<td>' + this.product_amount[i] + '</td>';
          html += '</tr>';

        }
        html += '</table>';
        document.getElementById("lists").innerHTML = html;
      }
    },

    pay() {

    },

    onConfirm() {
      window.history.go(0);
    },
    onCancel() {},

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';
@import 'vue-material/dist/vue-material.min.css';
@import 'vue-material/dist/theme/default.css';


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
  margin-top: 40px;
}

.item1 {
  grid-area: product_list;
  width: 300px;
  overflow-y: scroll;
}

.item3 {
  grid-area: tot_price;
  margin-bottom: 20px;
}

.item4 {
  grid-area: is_pay;
  margin-bottom: 20px;
}

.item2 {
  grid-area: set;
}


.grid-container {
  display: grid;
  grid-template-areas:
    'product_list set'
    'tot_price is_pay';
  grid-gap: 30px;
}

.grid-container>div {
  background-color: #DFF0F1;
  border: 1px solid #C8CDEE;
  text-align: center;
}

.item5 {
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
  display: inline-grid;
  width: 35%;
}

.item6 {
  overflow-y: hidden;
  overflow-x: hidden;
  scroll-behavior: smooth;
  transition: all ease 0.2s;
  display: inline-grid;
  width: 60%;
}
</style>
