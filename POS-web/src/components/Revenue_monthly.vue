<template>
<div class="container-start">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a id="nav_home" class="navbar-brand" v-on:click="goto_home()">POS web</a>
  </nav>

  <div class="container">
    <div class="text-field">
      <h5>[월 단위] 판매 기록</h5>
      <p class="text-right"><button id="makeButton" class="btn btn-primary text-right" v-on:click="makeNewRevenue()">기록 업데이트</button></p>
      
      <div id="app">
        <reactive-base app="bakery_revenue" credentials="MMUklxhIZ:2f399b06-919d-4fa0-9f69-0b92d260dc33">
          <div class="filters-container">
            <multi-list componentId="rDate" dataField="yearmonth.keyword" class="filter" title="날짜를 선택하세요" selectAllLabel="전체" :showCount="false" :defaultQuery="this.defaultQuery" />
            <button class="btn btn-danger" style="margin: 10px;" v-on:click="goto_revenue()">일별 판매 관리</button>
            <button class="btn btn-primary" style="margin: 10px;" v-on:click="goto_revenue_daily()">당일 판매 통계</button>
          </div>

          <reactive-list componentId="SearchResult" dataField="yearmonth.keyword" className="result-list-container" :showResultStats="false" :pagination="true" :from="0" :size="5" :react="{and: ['rDate']}" :defaultQuery="this.defaultQuery"
            sortBy="desc">
            <div slot="renderData" slot-scope="{ item }">
              <div class="flex book-content" key="item._id">
                <div class="flex column justify-center ml20">
                  <div class="inline-1">
                    <span style="font-weight: bold; font-size:20px;"> {{ item.yearmonth }} </span>

                    <span>
                      <md-dialog :md-active.sync="showDialog">
                        <md-dialog-title>수정할 정보 입력</md-dialog-title>

                        <md-tabs md-dynamic-height>
                          <md-tab md-label="매출 기록 정보">
                            <div class="form-group">
                              <div class="input-group mb-3">
                                <span style="font-weight: bold;">현금 보유량</span>
                                <input type="text" v-model="user_cashAmount" class="form-control" placeholder="현금 보유량">
                              </div>
                            </div>

                            <div class="form-group">
                              <div class="input-group mb-3">
                                <span style="font-weight: bold;">제품 총비용</span>
                                <input type="text" v-model="user_costSum" class="form-control" placeholder="제품 총비용">
                                <span style="font-weight: bold;">가게 운영비</span>
                                <input type="text" v-model="user_opCost" class="form-control" placeholder="가게 운영비">
                              </div>
                            </div>

                            <div class="form-group">
                              <div class="input-group mb-3">
                                <span style="font-weight: bold;">판매 수익</span>
                                <input type="text" v-model="user_sales" class="form-control" placeholder="판매 수익">
                              </div>
                            </div>

                          </md-tab>
                        </md-tabs>

                        <md-dialog-actions>
                          <md-button class="md-primary" @click="showDialog = false">취소</md-button>
                          <md-button class="md-accent" v-on:click="change_revenue()">추가</md-button>
                        </md-dialog-actions>
                      </md-dialog>

                      <md-button class="md-primary md-dense" @click="clicked(item._id)" style="font-weight:bold;">정보 수정</md-button>
                      <button type="button" class="btn btn-outline-success" v-on:click="onexport(item._id)">Excel download</button>
                      
                    </span>


                    <table class="product_info" style="margin-top:10px; margin-bottom:12px; width:500px;">
                      <tr>
                        <td style="font-weight:bold; margin-left:10px;">[현금 보유량]</td>
                        <td> {{ item.cashAmount }}</td>
                      </tr>
                      <tr>
                        <td style="color: #EA4444; font-weight:bold; margin-left:10px;">[제품 총비용]</td>
                        <td>{{ item.costSum }}</td>
                        <td style="color: #EA4444; font-weight:bold; margin-left:10px;">[가게 운영비]</td>
                        <td>{{ item.operatingCost }}</td>
                      </tr>
                      <tr class="product_info" style="margin-bottom: 12px;">
                        <td style="color: #425DC6; font-weight:bold; margin-left:10px;">[판매 수익]</td>
                        <td>{{ item.sales }}</td>
                        <td style="color: #425DC6; font-weight:bold; margin-left:10px;">[이익]</td>
                        <td>{{ item.revenue }}</td>
                      </tr>
                    </table>

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

var new_data = [];
var newDate = new Date()
var newYY = newDate.getFullYear()
var newDD = newDate.getDate()
var newMM = newDate.getMonth()+1

export default {
  name: 'Revenue_monthly',
  data() {
    return {
      new_json:'',
      uid: '',
      now_id: '',
      showDialog: false,
      is_revenue_change: false,

      user_cashAmount: null,
      user_costSum: null,
      user_opCost: null,
      user_sales: null,
      downloadData : []
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
  mounted(){
    
    
      //console.log(newDD)
      //console.log("5일임")
      this.calcNew(this.uid)//매월 1일 새로운 월별 매출 기록 계산 데이터 구하기
      
    
  },
  methods: {
     async fetchCost(uid, pName, inputObj){
       await axios({
        method: 'POST',
        url: baseurl+'/bakery_product/_search',
        headers: {
          Authorization: 'Basic cnVjeHhkam0zOjdkNWZkM2I2LWYyMzctNGMzMS1hZDJiLTVhYjVmZjNiM2FlMg==',
          'Content-type' : 'application/json'
        },
        data: {
          'size': 10000,
          "query": {
            "bool": {
              "must": [{"match_phrase": {"pName": pName}},{"match_phrase": {"pManagerID": uid}}]
            }
          } 
        }
      }).then((response)=>{
        //console.log("fetch cost")
        //console.log(response)
        var cost = response.data.hits.hits[0]._source.pCost
        var price = response.data.hits.hits[0]._source.pPrice

        inputObj.price = (inputObj.rAmount*1) * (price*1)
        inputObj.costSum = (inputObj.rAmount*1) * (cost*1)
        inputObj.revenue = (inputObj.price*1) - (inputObj.costSum*1)
        new_data.push(inputObj)

      }).catch((ex)=> {
        console.log(ex)
      })
    },
    calcNew(uid){

      var date = new Date()
      var month = date.getMonth() + 1
      var year = date.getFullYear()
      var record_array = new Array()
      var reduce_by_name = new Array();
      var cost_arr = new Array();

       axios({
        method: 'POST',
        url: baseurl+'/bakery_record/_search',
        headers: {
            Authorization: 'Basic VHF6Z0M3cHhTOjIyMmQyNTE3LTIzNzUtNDMyNC1iZjc1LTEzMDg1ZWM0YWE3ZA==',
            'Content-Type': 'application/json'
        },
        data: {
            'size': 10000, //가져올 레코드 갯수
            'query':{
            'bool':{
                'must':[
                {'match_phrase':{ 'rManagerID':uid}},
                {'match_phrase':{'rDate':year+'-'+month}},
                ]
              }
            }
        }
      }).then((response) => {
        var data = response.data.hits.hits
        
        for(var i in data){
            var rDetail = data[i]._source.rDetail
            for(var j in rDetail){
                var base_data = new Object()
                base_data.rName = rDetail[j].rName
                base_data.rAmount = rDetail[j].rAmount
                base_data.rPrice = data[i]._source.rPrice
                record_array.push(base_data)
            }
        }

        //console.log(record_array)

        record_array.reduce(function(res, value){
        if(!res[value.rName]){
          res[value.rName] = {rName: value.rName, rAmount : 0};
          reduce_by_name.push(res[value.rName])
        }
        res[value.rName].rAmount += (value.rAmount*1);
        return res;

      }, {});

      //console.log(reduce_by_name)

      for(var i in reduce_by_name){
        this.fetchCost(uid, reduce_by_name[i].rName, reduce_by_name[i])
        //console.log("코스트 추가중")
      }
      //console.log("for문 끝")
      
      }).catch((ex)=>{
        console.log(ex)
      })
      
    },
    makeNewRevenue(){
      
        axios({
        method: 'POST',
        url: baseurl + '/bakery_revenue/_search/',
        headers: {
          Authorization: 'Basic TU1Va2x4aElaOjJmMzk5YjA2LTkxOWQtNGZhMC05ZjY5LTBiOTJkMjYwZGMzMw==',
          'Content-Type': 'application/json'
        },
        data: {
          "query": {
            "bool": {
              "must": [{"match_phrase": {"yearmonth": newYY+"-"+newMM}},{"match_phrase": {"manager_id": this.uid}}]
            }
          }
        }
      })
      .then((response) => {
        //console.log(response)
        
        var manager_id = this.uid
        var yearmonth = newYY+"-"+newMM
        var cashAmount = 0
        var operatingCost = 0
        var costSum = 0
        var revenue = 0
        var sales = 0
        var isUpdated = false;
        for(var i in new_data){

          costSum += new_data[i].costSum*1
          sales += new_data[i].price*1
          revenue += new_data[i].revenue*1
        }

        if(response.data.hits.max_score == null){
          isUpdated = false //생성된 이번 달의 기록이 없을 경우
          axios({
            method: 'POST',
            url: baseurl + '/bakery_revenue/_doc/',
            headers: {
              Authorization: 'Basic TU1Va2x4aElaOjJmMzk5YjA2LTkxOWQtNGZhMC05ZjY5LTBiOTJkMjYwZGMzMw==',
              'Content-Type': 'application/json'
            },
            data: {
              "manager_id":manager_id,
              "yearmonth":yearmonth,
              "cashAmount":cashAmount,
              "operatingCost":operatingCost,
              "costSum":costSum,
              "revenue":revenue,
              "sales":sales
            }
          })
          .then((response) => {
            //var hits_length = response.data.hits.hits.length
            //console.log(response);
            //window.history.go(0);
            
          }).catch((e) => {
            console.log(e.response)
          })
        }
        else{ //생성된 이번달 기록이 이미 존재하는 경우 업데이트만 해줌
          isUpdated = true;
          var data = response.data.hits.hits[0]
          var currentRevenueId = data._id
          cashAmount = data._source.cashAmount
          operatingCost = data._source.operatingCost

          axios({
              method: 'POST',
              url: baseurl + '/bakery_revenue/_doc/' + currentRevenueId + '/_update',
              headers: {
                Authorization: 'Basic TU1Va2x4aElaOjJmMzk5YjA2LTkxOWQtNGZhMC05ZjY5LTBiOTJkMjYwZGMzMw==',
                'Content-Type': 'application/json'
              },
              data: {
                'doc': {
                  'cashAmount': cashAmount,
                  'costSum': costSum,
                  'operatingCost': operatingCost,
                  'revenue': revenue,
                  'sales': sales,
                }
              }
            })
            .then((response) => {
              //console.log(response)
              //alertmsg = newMM+'월 기록이 업데이트 되었습니다.'
              //alert("기록 업데이트")
              //window.history.go(0);
            }).catch((e) => {
              console.log(e.response)
            })
        }
        if(isUpdated)
            alert(newMM+"월 기록이 업데이트 되었습니다.")
          else
            alert(newMM+"월 기록이 생성 되었습니다")

          window.history.go(0)
        
      }).catch((e) => {
         console.log(e.response)
      })

    },
    onexport(item_id){
       //alert("동작")
       axios({
          method: 'POST',
          url: baseurl + '/bakery_revenue/_mget',
          headers: {
            Authorization: 'Basic TU1Va2x4aElaOjJmMzk5YjA2LTkxOWQtNGZhMC05ZjY5LTBiOTJkMjYwZGMzMw==',
            'Content-Type': 'application/json'
          },
          data: {
            "docs": [{
              "_id": item_id,
            }, ]
          }
        })
        .then((response) => {
          //console.log("onexport")
          
          var data = response.data.docs[0]._source

          var jsonData = new Object()

          jsonData.현금보유량 = data.cashAmount
          jsonData.제품총비용 = data.costSum
          jsonData.가게운영비 = data.operatingCost
          jsonData.이익 = data.revenue
          jsonData.판매수익 = data.sales
          
          var revenueWS = XLSX.utils.json_to_sheet([
            jsonData
          ])
          var wb = XLSX.utils.book_new()
          XLSX.utils.book_append_sheet(wb, revenueWS, data.yearmonth)
          XLSX.writeFile(wb, data.yearmonth+'.xlsx')
        })
    },
    clicked(id) {
      this.now_id = id;
      this.showDialog = true;
    },
    goto_home() {
      this.$router.replace('/home')
    },

    goto_revenue() {
      this.$router.replace('/revenue')
    },

    goto_revenue_daily(){
      this.$router.replace('/revenue_daily')
    },

    defaultQuery: function(value, props) {
      return {
        query: {
          match: {
            manager_id: this.uid
          }
        }
      }
    },

    change_revenue() {

      // update revenue DB
      var origin_cashAmount;
      var origin_costSum;
      var origin_opCost;
      var origin_revenue;
      var origin_sales;

      axios({
          method: 'POST',
          url: baseurl + '/bakery_revenue/_mget',
          headers: {
            Authorization: 'Basic TU1Va2x4aElaOjJmMzk5YjA2LTkxOWQtNGZhMC05ZjY5LTBiOTJkMjYwZGMzMw==',
            'Content-Type': 'application/json'
          },
          data: {
            "docs": [{
              "_id": this.now_id,
            }, ]
          }
        })
        .then((response) => {
          //console.log(response);

          origin_cashAmount = response.data.docs[0]._source.cashAmount;
          origin_costSum = response.data.docs[0]._source.costSum;
          origin_opCost = response.data.docs[0]._source.operatingCost;
          origin_revenue = response.data.docs[0]._source.revenue;
          origin_sales = response.data.docs[0]._source.sales;

          if (this.user_cashAmount != null) {
            origin_cashAmount = this.user_cashAmount;
          }
          if (this.user_costSum != null) {
            origin_costSum = this.user_costSum;
            this.is_revenue_change = true;
          }
          if (this.user_opCost != null) {
            origin_opCost = this.user_opCost;
            this.is_revenue_change = true;
          }
          if (this.user_sales != null) {
            origin_sales = this.user_sales;
            this.is_revenue_change = true;
          }
          if (this.is_revenue_change) {
            var int_revenue = (parseInt(origin_sales) - parseInt(origin_costSum) - parseInt(origin_opCost));
            origin_revenue = String(int_revenue);
          }


          axios({
              method: 'POST',
              url: baseurl + '/bakery_revenue/_doc/' + this.now_id + '/_update',
              headers: {
                Authorization: 'Basic TU1Va2x4aElaOjJmMzk5YjA2LTkxOWQtNGZhMC05ZjY5LTBiOTJkMjYwZGMzMw==',
                'Content-Type': 'application/json'
              },
              data: {
                'doc': {
                  'cashAmount': origin_cashAmount,
                  'costSum': origin_costSum,
                  'operatingCost': origin_opCost,
                  'revenue': origin_revenue,
                  'sales': origin_sales,
                }
              }
            })
            .then((response) => {
              //console.log(response);

              // reset all the user data as null
              this.is_revenue_change = false;
              this.user_cashAmount = null;
              this.user_costSum = null;
              this.user_opCost = null;
              this.user_sales = null;

              alert("매출 기록 변경되었습니다.");
              window.history.go(0);
            }).catch((e) => {
              console.log(e.response)
            })
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

td {
  text-align: right;
  padding: 5px;
}
</style>
