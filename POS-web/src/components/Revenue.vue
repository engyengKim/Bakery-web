<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5>[일 단위] 판매 기록</h5>

      <div id="app">
        <reactive-base app="bakery_record" credentials="TqzgC7pxS:222d2517-2375-4324-bf75-13085ec4aa7d">
          <div class="filters-container">
            <multi-list componentId="rDate" dataField="rDate.keyword" class="filter" title="날짜를 선택하세요" selectAllLabel="전체" :defaultQuery="this.defaultQuery" />
            <button class="btn btn-danger" style="margin: 10px;" v-on:click="goto_revenue_monthly()">월별 판매 관리</button>
            <button class="btn btn-primary" style="margin: 10px;" v-on:click="goto_revenue_daily()">당일 판매 통계</button>
            <button class="btn btn-outline-success" style="margin:10px;" v-on:click="onexport()">Excel download</button>
          </div>
          <reactive-list componentId="SearchResult" dataField="pName" className="result-list-container" :showResultStats="false" :pagination="true" :from="0" :size="5" :react="{and: ['rDate']}" :defaultQuery="this.defaultQuery">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <div style="font-weight: bold; margin-bottom:10px;">날짜: {{ item.rDate + " | " + item.rTime }}</div>

                    <table>
                      <tr>
                        <td style="color: #425DC6; font-weight:bold; width:150px;">[고객 이름]</td>
                        <td style="width: 150px;">{{item.rBuyer}}</td>
                      </tr>
                      <tr>
                        <td style="color: #425DC6; font-weight:bold; width:150px;">[구매 금액]</td>
                        <td style="width: 150px;">{{ item.rPrice }}</td>
                      </tr>
                      <tr>
                        <td style="color: #425DC6; font-weight:bold; width:150px;">[구매 수단]</td>
                        <td style="width:80px; font-weight:bold;">현금</td>
                        <td style="width:150px;">{{ item.rType.cash }}</td>
                        <td style="width:150px; font-weight:bold;">베이커리 코인</td>
                        <td style="width:150px;">{{ item.rType.coin }}</td>
                      </tr>
                    </table>

                    <div style="margin-top:10px; margin-bottom:10px;">
                      <div>
                        <md-button class="md-primary md-dense" style="font-weight:bold;" @click="show_rDetail(item._id)">구매내역 확인</md-button>
                        <table id="detail_lists" style="width: 300px;" v-if="(get_now_id() == item._id)"></table>
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
import axios from 'axios'
import XLSX from 'xlsx'

const baseurl = 'https://scalr.api.appbase.io'
export default {
  name: 'Revenue',
  data() {
    return {
      uid: '',
      now_id: '',
    }
  },
  created() {
    //console.log("type:" + this.$session.type)
    if (this.$session.get('type') != 'Manager') {
      alert("매니저 계정으로 로그인 해주세요")
      this.$router.replace('/')
    }
    this.uid = this.$session.get('uId')
  },
  methods: {
    goto_home() {
      this.$router.replace('/home')
    },
    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            rManagerID: this.uid
          },
        }
      }
    },
    onexport(){
       //alert("동작")
       axios({
          method: 'POST',
          url: baseurl + '/bakery_record/_search',
          headers: {
            Authorization: 'Basic VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==',
            'Content-Type': 'application/json'
          },
          data: {
            'size': 10000
          }
        })
        .then((response) => {
          //console.log("onexport")
          
          //console.log(response)
          var data = response.data.hits.hits
          var reduce_by_date = new Array();
          var record_array = new Array();
          //console.log(data)
          var date = new Date()
          
          for(var i in data){
            var rDetail = data[i]._source.rDetail

            var detail_string = ' '
            for(var z in rDetail){
              detail_string += rDetail[z].rName.toString()+" : "+rDetail[z].rAmount.toString()+"개  "
            }

            var datum = data[i]._source
            var jsonData = new Object()
            jsonData.index = i
            jsonData.rBuyer = datum.rBuyer.toString().trim()
            jsonData.rDate = datum.rDate.toString().trim()
            jsonData.rPrice = datum.rPrice.toString().trim()
            jsonData.rTime = datum.rTime.toString().trim()
            jsonData.cash = datum.rType.cash.toString().trim()
            jsonData.coin = datum.rType.coin.toString().trim()
            jsonData.detail = detail_string
            record_array.push(jsonData)
           }
          //console.log("record_arry")
          //console.log(record_array)
          record_array = record_array.sort(function(a, b){
            a = new Date(a.rDate)
            b = new Date(b.rDate)
            return a>b ? -1 : a<b ? 1 : 0
          })
          //console.log("SORT")
          //console.log(record_array)

          record_array.reduce(function(res, value){
            if(!res[value.index]){
              res[value.index] = {"판매일": value.rDate, "판매 시간" : value.rTime, "구매자": value.rBuyer, "판매 금액":value.rPrice, "현금":value.cash, "코인":value.coin, "상세 내용": value.detail};
              reduce_by_date.push(res[value.index])
            }
            return res;

          }, {})
          
          //console.log(reduce_by_date)
          
          //console.log(record_array)
          
          var revenueWS = XLSX.utils.json_to_sheet([
            reduce_by_date[0]
          ])

          for(var i=1; i<reduce_by_date.length; i++){
            XLSX.utils.sheet_add_json(revenueWS, [
            reduce_by_date[i]
          ], {skipHeader: true, origin: -1});
          }
          
          
          var wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, revenueWS, date.getFullYear()+"-"+date.getMonth()*1+1+"-"+date.getDate())
          XLSX.writeFile(wb, 'daily_sell_record.xlsx')
        })
    },
    get_now_id() {
      return (this.now_id)
    },
    show_rDetail(id) {
      this.now_id = id;
      var temp_length = 0;
      var html = ''
      axios({
          method: 'POST',
          url: baseurl + '/bakery_record/_mget',
          headers: {
            Authorization: 'Basic VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==',
            'Content-Type': 'application/json'
          },
          data: {
            "docs": [{
              "_id": id,
            }, ]
          }
        })
        .then((response) => {
          //console.log(response);
          temp_length = response.data.docs[0]._source.rDetail.length;
          html = '<table><tr><td style="font-weight: bold;">제품명</td><td style="font-weight:bold;">수량</td></tr>';
          for (var i = 0; i < temp_length; i++) {
            html += '<tr><td>';
            html += (response.data.docs[0]._source.rDetail[i].rName);
            html += '</td><td>';
            html += (response.data.docs[0]._source.rDetail[i].rAmount);
            html += '</td></tr>';
          }
          html += '</table>';
          document.getElementById("detail_lists").innerHTML = html;
        }).catch((e) => {
          console.log(e.response)
        })
    },
    goto_revenue_monthly() {
      this.$router.replace('/revenue_monthly');
    },
    goto_revenue_daily() {
      this.$router.replace('/revenue_daily');
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
.filters-container {
  width: 20%;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  margin-top: 120px;
  top: 0;
  scroll-behavior: smooth;
  justify-content: center;
  transition: all ease 0.2s;
  overflow: hidden;
}
table {
  width: 700px;
}
td {
  padding: 10px;
  border: 1px solid #666666;
}
</style>