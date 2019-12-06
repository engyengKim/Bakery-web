<template>
<div class="container">
    <div class="row">
        <div class="col-sm-4">
            <input type="date" v-model="selected_date" class="form-control" v-on:change="fetchData(selected_date)">
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12">
            
            <table class="table table-hover table-bordered text-center">
            <colgroup>
                <col width="5%"/>
                <col width="25%"/>
                <col width="20%"/>
                <col width="20%"/>
                <col width="20%"/>
                <col width="10%"/>
            </colgroup>
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">상품명</th>
                    <th scope="col">상품 이미지</th>
                    <th scope="col">당일 판매량</th>
                    <th scope="col">당일 매출</th>
                    <th scope="col">현재 재고</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="isEmpty">
                    <td colspan="6"><h5>{{this.msg}}</h5></td>
                </tr>
                <tr v-else v-for="(data, index) in new_data" v-bind:key="index">
                    <th scope="row">{{index + 1}}</th>
                    <td>{{data.name}}</td>
                    <td><img :src="data.img" style="width:80px; height:80px;" alt="이미지"/></td>
                    <td>{{data.amount}} 개</td>
                    <td>{{data.amount * data.price}} 원</td>
                    <td>{{new_data.length}} 개</td>
                </tr>
            </tbody>
        </table>
        
        </div>
    </div>
    <div class="row">
        <button class="btn btn-danger" style="margin: 10px;" v-on:click="goto_revenue()">일별 판매 관리</button>
    </div>
    <div class="row">
        <button class="btn btn-primary" style="margin: 10px;" v-on:click="goto_revenue_monthly()">월별 판매 통계</button>
    </div>
    <!--name amount img stock-->
</div>
</template>
<script>
import axios from 'axios'
const baseurl = 'https://scalr.api.appbase.io'


function leadingZero(n, digits) {
  var zero = '';
  n = n.toString();
  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}
var date = new Date()
var mm = leadingZero(date.getMonth()*1+1, 2)
var dd = leadingZero(date.getDate(), 2)
var new_data = [];

export default {
  data() {
    return {
      uid : null,
      selected_date: "2019-12-02",
      new_data: [],
      msg:null,
      isEmpty:false
      //selected_date: mm+"-"+dd
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
  mounted() {
    this.fetchData(this.selected_date)
  },
  methods: {
      goto_revenue() {
      this.$router.replace('/revenue')
    },

    goto_revenue_monthly(){
      this.$router.replace('/revenue_monthly')
    },
      async fetchAmount(inputObj){
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
              "must": [{"match_phrase": {"pName": inputObj.name}},{"match_phrase": {"pManagerID": this.uid}}]
            }
          } 
        }
      }).then((response)=>{
        //console.log("fetch amount")
        //console.log(response)
        var stock = 0
        var pDetail = response.data.hits.hits[0]._source.pDetail
        var pPrice = response.data.hits.hits[0]._source.pPrice
        for(var i in pDetail){
            stock += (pDetail[i].pAmount*1)
        }
        inputObj.stock = stock
        inputObj.price = pPrice
        //console.log("STOCK : "+stock)
        this.new_data.push(inputObj)

      }).catch((ex)=> {
        console.log(ex)
      })
    },
    fetchData(selected_date) {
      this.new_data = [];
      const uid = this.uid
      //console.log(uid)
      //console.log(selected_date)

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
                {'match_phrase':{'rManagerID':uid}},{'match_phrase':{'rDate':selected_date}},
                ]
              }
            }
        }
      }).then((response) => {
        //console.log(response)
        var data = response.data.hits.hits
            
        this.record_data = data;
        var daily_array = new Array()
        var daily_array_by_name = new Array()


      for(var i in data){

        var rDetail = data[i]._source.rDetail
        //console.log(rDetail.length)
        for(var j in rDetail){
          var base_data = new Object()
          // rName + rAmount + rTime => create new json object
          base_data.rName = rDetail[j].rName
          base_data.rAmount = rDetail[j].rAmount
          base_data.rImg = rDetail[j].rImg
          //recommend_base_data.rTime = data[i]._source.rTime

          // push to new json array
          daily_array.push(base_data)
        }
      }

      daily_array.reduce(function(res, value){
        if(!res[value.rName]){
          res[value.rName] = {name: value.rName, amount : 0, img : value.rImg};
          daily_array_by_name.push(res[value.rName])
        }
        res[value.rName].amount += (value.rAmount*1);
        return res;

      }, {});
      if(response.data.hits.max_score != null){
        this.msg = null
        this.isEmpty = false
          for(var i in daily_array){
              this.fetchAmount(daily_array_by_name[i])
          }
      }
      else{
        this.msg = '선택 날짜의 해당 기록이 없습니다.'
        this.isEmpty = true;
      }

        //console.log(this.new_data)
      }).catch((ex)=>{
        console.log(ex)
      })
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import 'bootstrap.css';
@import url('https://fonts.googleapis.com/css?family=Arbutus+Slab&display=swap');
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR&display=swap');
table td, th {
  vertical-align: middle !important;
}
</style>
