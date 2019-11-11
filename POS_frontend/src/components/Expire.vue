<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">폐기 제품 관리</h5>
      <div style="margin-bottom:20px;">
        유통 기한이 지난 제품들을 확인하시고 관리해주세요.
      </div>

      <div id="app">
        <reactive-base app="bakery_product" credentials="rucxxdjm3:7d5fd3b6-f237-4c31-ad2b-5ab5ff3b3ae2">

          <reactive-list componentId="SearchResult" dataField="_id" :showResultStats="false" :pagination="true" :from="0" :size="5" :defaultQuery="this.defaultQuery">
            <div slot="renderData" slot-scope="{ item }" class="order-list">
              <div class="flex book-content" key="item.pName">
                <div class="flex column justify-center ml20">

                  <div class="inline-1" v-if="is_over(item._id) == true">
                    <md-button v-on:click="is_over_expire(item._id, item.pName)"></md-button>
                    <div id="detail_lists" v-if="get_now_name()==item.pName"></div>
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
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'



export default {
  name: 'Stock',
  data() {
    return {
      storeName: '',
      today: null,
      manager_id: '',
      now_name: '',
    };
  },
  created() {

    if (this.$session.get('type') != 'Manager' && this.$session.exists()) {
      this.$session.destroy()
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    this.storeName = this.$session.get('storeName');
    this.manager_id = this.$session.get('uId');

    var currentDate = new Date();
    var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    this.today = currentDateWithFormat;


  },
  methods: {

    goto_home() {
      this.$router.replace('/home')
    },

    get_now_name(){
      return(this.now_name);
    },

    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            pManagerID: this.manager_id
          }
        }
      }
    },

    is_over(id) {
      var result = false;

      axios({
          method: 'POST',
          url: baseurl + '/bakery_product/_mget',
          headers: {
            Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
            'Content-Type': 'application/json'
          },
          data: {
            "docs": [{
              "_id": id,
            }, ]
          }
        })
        .then((response) => {
          console.log(response);

          var temp = response.data.docs[0]._source.pDetail;
          console.log("---------------------------");

          // display oprtions about Expiration date
          var temp_expire = [];
          var temp_amount = [];
          var parts = this.today.split('-');
          var mydate = new Date(parts[0], parts[1] - 1, parts[2]);

          for (var i = 0; i < temp.length; i++) {
            var part = (temp[i].pExpirationDate).split('-');
            part = new Date(part[0], part[1] - 1, part[2]);

            if (part.getTime() < mydate.getTime()) {
              // 유통기한 지남
              temp_expire.push(data[i].pExpirationDate);
              temp_amount.push(data[i].pAmount);
            } else {
              // 유통기한 유효함
              continue;
            }
          }

          console.log(temp_expire);

          if(temp_expire.length != 0){
            result = true;
          }

        }).catch((e) => {
          console.log(e.response)
        })

        return(result);
    },

    is_over_expire(id, name) {
      this.temp_length = 0;
      this.now_name = name;
      var html = '';

      axios({
          method: 'POST',
          url: baseurl + '/bakery_product/_mget',
          headers: {
            Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
            'Content-Type': 'application/json'
          },
          data: {
            "docs": [{
              "_id": id,
            }, ]
          }
        })
        .then((response) => {
          console.log(response);

          this.temp_length = response.data.docs[0]._source.pDetail.length;

          // sort by pExpirationDate
          var data = response.data.docs[0]._source.pDetail;

          function date_sort(a, b) {
            var dateA = new Date(a["pExpirationDate"]).getTime();
            var dateB = new Date(b["pExpirationDate"]).getTime();
            return dateA > dateB ? 1 : -1;
          }

          data.sort(date_sort);

          this.temp_length = data.length;

          // display oprtions about Expiration date
          var temp_expire = [];
          var temp_amount = [];
          var parts = this.today.split('-');
          var mydate = new Date(parts[0], parts[1] - 1, parts[2]);

          for (var i = 0; i < data.length; i++) {
            var part = (data[i].pExpirationDate).split('-');
            part = new Date(part[0], part[1] - 1, part[2]);

            if (part.getTime() < mydate.getTime()) {
              // 유통기한 지남
              temp_expire.push(data[i].pExpirationDate);
              temp_amount.push(data[i].pAmount);
            } else {
              // 유통기한 유효함
              continue;
            }
          }

          html = '<div style="font-weight:bold; color:blue;">';
          html += name;
          html += '</div>'

          html += '<table><tr><td style="font-weight:bold;">수량</td><td style="font-weight:bold;">지난 유통기한</td></tr>';
          for (var i = 0; i < temp_expire.length; i++) {
            html += '<tr><td>';
            html += (temp_amount[i]);
            html += '</td><td>';
            html += (temp_expire[i]);
            html += '</td></tr>';
          }
          html += '</table>';

          console.log(html);

          document.getElementById("detail_lists").innerHTML = html;

        }).catch((e) => {
          console.log(e.response)
        })

    },

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
}

#nav_home {
  color: white;
}

.text-field {
  margin-left: 40px;
  margin-top: 10px;
}


.container {
  font-family: 'Noto Sans KR', sans-serif;
}

.order-list {
  padding-top: 5px;
  width: 50%;
}
</style>
