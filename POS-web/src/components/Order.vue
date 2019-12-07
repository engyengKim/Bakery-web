<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5 id="theme">예약 주문 목록</h5>
      <div>
        <reactive-base app="bakery_advancedorder" credentials="hkzwIw1Em:b402ce56-9b61-4021-997c-9b857379401b">

          <reactive-list componentId="SearchResult" dataField="aoVisitDate" sortBy="asc" :showResultStats="false" :pagination="true" :from="0" :size="5" :defaultQuery="this.defaultQuery">
            <div slot="renderData" slot-scope="{ item }" class="order-list">
              <div class="flex book-content" key="item._id" style="width:900px;">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <table class="table table-hover" style="width:500px;">
                      <thead>
                        <tr>
                          <th scope="col">고객 이름</th>
                          <th scope="col">방문 날짜</th>
                          <th scope="col"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">{{item.aoCustomer_name}}</th>
                          <td>{{item.aoVisitDate}}</td>
                          <td rowspan="2">
                            <button type="button" class="btn btn-danger btn-sm" v-on:click="deal_complete(item._id, item.aoCustomer_name, item.aoDetail, item.aoPrice)">
                              처리 완료
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div>
                      <span style="font-weight:bold; margin-left:10px;">요구사항</span>
                      {{item.aoRequestContent}}
                    </div>

                    <div style="margin-bottom:10px;">
                      <md-button class="md-dense" style="color:green; font-weight:bold;" v-on:click="detail_clicked(item._id)">제품 목록 확인</md-button>
                      <table id="aoDetail" style="width:300px; background-color:#E6E5D9; border-radius: 10px;" v-if="(get_now_id() == item._id)"></table>
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
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'

export default {
  name: 'Order',
  data() {
    return {
      now_id: '',
      today: '',
    }
  },

  created() {
    if (this.$session.get('type') != 'Manager') {
      this.$session.destroy()
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }

    var currentDate = new Date();

    var currentDateWithFormat = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
    this.today = currentDateWithFormat;
  },

  methods: {
    goto_home() {
      this.$router.replace('/home')
    },

    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            aoManager_id: this.$session.get('uId'),
          }
        }
      }
    },

    detail_clicked(id) {
      this.now_id = id;

      // axios
      axios({
          method: 'POST',
          url: baseurl + '/bakery_advancedorder/_mget',
          headers: {
            Authorization: 'Basic aGt6d0l3MUVtOmI0MDJjZTU2LTliNjEtNDAyMS05OTdjLTliODU3Mzc5NDAxYg==',
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
          var detail = response.data.docs[0]._source.aoDetail;

          var html = '<table><tr><td style="font-weight:bold; padding:5px;">제품명</td><td style="font-weight:bold; padding:5px;">수량</td></tr>';
          for (var i = 0; i < detail.length; i++) {
            html += '<tr><td style="padding:5px;">';
            html += detail[i].aoProduct;
            html += '</td><td style="padding:5px;">';
            html += detail[i].aoAmount;
            html += '</td></tr>';
          }
          html += '</table>';

          console.log(html);
          console.log(document.getElementById("aoDetail"));

          document.getElementById("aoDetail").innerHTML = html;

        }).catch((e) => {
          console.log(e.response)
        })

    },

    get_now_id() {
      return (this.now_id);
    },

    deal_complete(id, name, detail, tot_price) {
      // axios: update 'aoResult' to "완료"
      var is_complete = confirm("거래를 완료하시겠습니까?");
      if (is_complete) {
        // change aoDetail to rDetail
        var user_detail = '[';

        for (var i = 0; i < detail.length; i++) {
          user_detail += '{ "rAmount" : "';
          user_detail += detail[i].aoAmount;
          user_detail += '", "rName" : "';
          user_detail += detail[i].aoProduct;
          user_detail += '", "rImg" : "';
          user_detail += detail[i].aoImg;

          if (i != detail.length - 1) {
            user_detail += '" },';
          } else {
            user_detail += '" }]';
          }
        }

        var user_type;
        user_type = '{ "cash" : "0", "coin" : "';
        user_type += tot_price;
        user_type += '" }';

        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        // saved in the bakery_record
        axios({
            method: 'POST',
            url: baseurl + '/bakery_record/_doc/',
            headers: {
              Authorization: 'Basic VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==',
              'Content-Type': 'application/json'
            },

            data: {
              "rBuyer": name,
              "rDate": this.today,
              "rDetail": JSON.parse(user_detail),
              "rManagerID": this.$session.get('uId'),
              "rPrice": tot_price,
              "rStore": this.$session.get('storeName'),
              "rTime": time,
              "rType": JSON.parse(user_type),
            }
          })
          .then((response) => {
            //var hits_length = response.data.hits.hits.length
            console.log(response);
            axios({
                method: 'POST',
                url: baseurl + '/bakery_advancedorder/_delete_by_query',
                headers: {
                  Authorization: 'Basic aGt6d0l3MUVtOmI0MDJjZTU2LTliNjEtNDAyMS05OTdjLTliODU3Mzc5NDAxYg==',
                  'Content-Type': 'application/json'
                },
                data: {
                  "query": {
                    "match": {
                      "_id": id
                    }
                  }
                }
              })
              .then((response) => {
                console.log(response);
                alert("거래 완료되었습니다.");
                window.history.go(0);

              }).catch((e) => {
                console.log(e.response)
              })
          }).catch((e) => {
            console.log(e.response)
          })
      }
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
