<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">

      <div class="grid-container">
        <div class="item1">
          <h6 id="theme">Product list</h6>
          <md-button class="md-raised md-accent" v-on:click="reset()">Reset</md-button>
          <div id="lists"></div>


        </div>

        <div class="item2">
          <reactive-base app="bakery_product" credentials="5xTGpCL5N:ddd1d6b3-6022-4e2f-ba6f-13805e7b9659">
            <div class="item5">
              <single-list componentId="Category" dataField="pCategory.keyword" class="filter" title="Select category" selectAllLabel="All breads" :showSearch="false" :showCount="false" />
            </div>

            <reactive-list componentId="SearchResult" dataField="pName" className="item6" :pagination="true" :from="0" :size="5" :react="{and: ['Category']}">
              <div slot="renderData" slot-scope="{ item }">
                <div class="flex book-content" key="item._id">
                  <div class="fSlex column justify-center ml20">
                    <md-button v-on:click='get_name(item.pName, item.pPrice)'>{{ item.pName }}</md-button>
                    <span><font style="color:gray;">{{item.pPrice}}</font></span>

                    <div class="buttons-inline" style="display:inline;">
                      <md-button class="md-icon-button md-raised md-dense md-accent" v-on:click="delete_product(item.pName, item.pPrice)">X</md-button>
                      <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="edit_clicked(item.pName)">Edit</md-button>
                    </div>


                    <form v-if="(get_now_name() == item.pName) && is_clicked" class="form-inline">
                      <div class="form-group mx-sm-3 mb-2">
                        <input type="user_amount" v-model="user_amount" class="form-control" id="input_amount">
                      </div>
                      <md-button class="md-icon-button md-raised md-dense md-primary" v-on:click="change_amount(item.pName, item.pPrice)">OK</md-button>
                    </form>

                  </div>
                </div>
              </div>
            </reactive-list>
          </reactive-base>
        </div>


        <div class="item3">
          <h6 id="theme">Total price</h6>
          <div class="price_result">{{this.tot_price}}</div>
        </div>


        <div class="item4">
          <h6 id="theme">Pay or not</h6>
          <md-button class="md-primary md-raised" v-on:click="pay()">Pay</md-button>

          <md-dialog-confirm :md-active.sync="active" md-title="Cancel payment?" md-content="If you confirm, all the product list will be initialized" md-confirm-text="Agree" md-cancel-text="Disagree" @md-cancel="onCancel" @md-confirm="onConfirm" />
          <md-button class="md-primary md-raised" @click="active = true">CANCEL</md-button>
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
      user_amount: null,
      now_product_name: '',
      is_clicked: false,
      active:false,
      tot_price: 0,
    }
  },
  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    get_name(name, price) {
      this.product_name = name

      if (this.product_list.includes(name)) {
        alert("This is already added")
      } else {
        this.product_list.push(name)
        this.product_amount.push(1)
        this.tot_price += parseInt(price)
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
      this.product_amount = []
      this.tot_price = 0
      document.getElementById("lists").innerHTML = this.product_list
    },

    delete_product(name, price) {
      var a = this.product_list.indexOf(name);
      if (a != -1) {
        var temp = (this.product_amount[a])*parseInt(price);


        this.product_list.splice(a, 1);
        this.product_amount.splice(a, 1);
        this.tot_price -= temp;

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

    change_amount(name, price) {

      var a = this.product_list.indexOf(name);
      if (a != -1) {
        if (this.user_amount > 0) {

          if(this.user_amount > this.product_amount[a]){
            // add (input-original)
            this.tot_price += (this.user_amount - this.product_amount[a])*parseInt(price);
          }else if(this.user_amount < this.product_amount[a]){
            // gap
            this.tot_price -= (this.product_amount[a] - this.user_amount)*parseInt(price);
          }

          this.product_amount[a] = this.user_amount;
          this.user_amount = null;

          var html = '<table>';
          for (var i = 0; i < this.product_list.length; i++) {
            html += '<tr>';
            html += '<td>' + this.product_list[i] + '</td>';
            html += '<td>' + this.product_amount[i] + '</td>';
            html += '</tr>';

          }
          html += '</table>';
          document.getElementById("lists").innerHTML = html;

          this.is_clicked = false;
        } else {
          alert("Type number!");
        }
      } else {
        alert("Select the menu first!");
      }
    },

    pay() {

    },

    onConfirm() {
      window.history.go(0);
    },
    onCancel() {
    },

    edit_clicked(name) {
      var a = this.product_list.indexOf(name);

      if (a != -1) {
        this.now_product_name = name;
        this.is_clicked = true;
      } else {
        alert("Select the menu first!");
      }

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
@import 'vue-material/dist/vue-material.min.css';
@import 'vue-material/dist/theme/default.css';
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');

#theme {
  font-family: 'Arbutus Slab', serif;
}

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

#input_amount {
  width: 60px;
}

.price_result{
  color: red;
  font-weight: bold;
  font-size: 30px;
}

</style>
