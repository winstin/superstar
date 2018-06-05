// pages/log/log.js
var app = getApp();
var baseUrl = app.globalData.server;
var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    date1: getApp().getNowFormatDate(),
    date2: getApp().getNowFormatDate(),
    array: [
        '全部', 
        '支付中', 
        '支付失败', 
        '已支付', 
        '结算中', 
        '结算成功'
    ],
    status:[
        {name:'全部',index:'',checked:false},
        {name:'支付中',index:'A',checked:false},
        {name:'支付失败',index:'B',checked:false},
        {name:'已支付',index:'C',checked:true},
        {name:'结算中',index:'D',checked:true},
        {name:'结算成功',index:'E',checked:true},
    ],
    arrayFalg: ['','A', 'B', 'C', 'D', 'E'],
    index: 5,
    dateFalg:true,
    allMoney:0
  },


  //下拉刷新 
  // onPullDownRefresh:function() { 
  //   wx.showNavigationBarLoading() 
  //   //在标题栏中显示加载 
  //   //模拟加载 
  //   setTimeout(function(){ 
  //     complete wx.hideNavigationBarLoading() 
  //     //完成停止加载 
  //     wx.stopPullDownRefresh() 
  //     //停止下拉刷新 
  //   },1500); 
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.serachStatus();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  bindDateChange1: function(e) {
    this.setData({
      date1: e.detail.value,
      dateFalg:true
    })
    this.serachStatus();
  },

  bindDateChange2: function(e) {
    this.setData({
      date2: e.detail.value,
      dateFalg:true
    })
    this.serachStatus();
  },

  bindCancel1: function(e) {
    console.log(e.detail.value)
    this.setData({
      date1: getApp().getNowFormatDate(),
      dateFalg:false
    })
    this.serachStatus();
  },

  bindCancel2: function(e) {
    this.setData({
      date2: getApp().getNowFormatDate(),
      dateFalg:false
    })
    this.serachStatus();
  },


  bindPickerChange: function(e) {

    this.setData({
      index: e.detail.value
    })

    this.serachStatus();
  },

  checkState:function(e){
      let state = "";
      switch(e){
        case "A":
          state = 1;
          break;
        case "B":
          state = 2;
          break;
        case "C":
          state = 3;
          break;
        case "D":
          state = 4;
          break;
        case "E":
          state = 5;
          break;
      }

      if(this.data.index == 0 || state == this.data.index){
        return true
      }else{
        return false
      }
  },

  checkStatus:function(e){
      let state = "";
      switch(e.currentTarget.id){
        case "A":
          state = 1;
          break;
        case "B":
          state = 2;
          break;
        case "C":
          state = 3;
          break;
        case "D":
          state = 4;
          break;
        case "E":
          state = 5;
          break;
        default:
          state = 0;break;
      }
      this.data.status[state].checked = !this.data.status[state].checked;
      this.setData({status:this.data.status});

      this.serachStatus();
  },


  checkDate:function(e,date1){
      let newDate = e.split(" ")[0];
      let sArr = date1.split("-");
      let eArr = newDate.split("-");
      let sRDate = new Date(sArr[0], sArr[1], sArr[2]);
      let eRDate = new Date(eArr[0], eArr[1], eArr[2]);
      let days = (sRDate-eRDate)/(24*60*60*1000);
      return days;
  },

  serachData:function(){
      let self = this;
      wx.showLoading({
        title:'加载中...'
      })

      Tools.fetch({
          url: '/order',
          method: 'GET',
          data:{
            orderStatus:this.data.arrayFalg[this.data.index],
            startDate:this.data.date1,
            endDate:this.data.date2,
          },
          callback(res) {
              wx.hideLoading();
              if(res.data.data){
                  let itemData = res.data.data.data;
                  for(let i in itemData){
                      itemData[i].createTime = Tools.formatting((itemData[i].createTime+''))
                  }


                  self.setData({
                    allMoney:res.data.data.totalMoney,
                    items:itemData
                  })
              }
          }

      })
      
  },


  serachStatus:function(){
      let self = this;
      wx.showLoading({
        title:'加载中...'
      })


      let allMoney = 0;
      let allData = [];


      //选择全部的时候直接加载所有数据
      if(this.data.status[0].checked){
          Tools.fetch({
              url: '/order',
              method: 'GET',
              data:{
                orderStatus:"",
                startDate:this.data.date1,
                endDate:this.data.date2,
              },
              callback(res) {
                  wx.hideLoading();
                  if(res.data.data){
                      let cardData = res.data.data.data;
                      let cardImg = app.globalData.banklogo;
                      for(let i in cardData){
                          cardData[i].createTime = Tools.formatting((cardData[i].createTime+''));
                          cardData[i].cardNum = cardData[i].cardNumber.substr(cardData[i].cardNumber.length-4,cardData[i].cardNumber.length-1)
                          for(let j in cardImg){
                              if(cardImg[j].name==cardData[i].bankName){
                                  cardData[i].url = cardImg[j].url;
                                  cardData[i].style = cardImg[j].style;
                              }
                          }
                          if(cardData[i].url == undefined){
                              cardData[i].url = "/img/logo/default.png";
                          }
                          if(cardData[i].style == undefined){
                              cardData[i].style = 'card_info2';
                          }
                      }
                      self.setData({
                        allMoney:res.data.data.totalMoney,
                        items:cardData
                      })
                  }
              }

          })
      }else{

          for(let i in this.data.status){
              if(this.data.status[i].checked){
                  Tools.fetch({
                    url: '/order',
                    method: 'GET',
                    data:{
                      orderStatus:this.data.status[i].index,
                      startDate:this.data.date1,
                      endDate:this.data.date2,
                    },
                    callback(res) {
                        wx.hideLoading();
                        if(res.data.data){
                            let cardData = res.data.data.data;
                            let cardImg = app.globalData.banklogo;
                            for(let i in cardData){
                                cardData[i].createTime = Tools.formatting((cardData[i].createTime+''));
                                cardData[i].cardNum = cardData[i].cardNumber.substr(cardData[i].cardNumber.length-4,cardData[i].cardNumber.length-1)
                                for(let j in cardImg){
                                    if(cardImg[j].name==cardData[i].bankName){
                                        cardData[i].url = cardImg[j].url;
                                        cardData[i].style = cardImg[j].style;
                                    }
                                }
                                if(cardData[i].url == undefined){
                                    cardData[i].url = "/img/logo/default.png";
                                }
                                if(cardData[i].style == undefined){
                                    cardData[i].style = 'card_info2';
                                }
                            }

                      
                            if(res.data.data.totalMoney){
                                allMoney = allMoney + Number(res.data.data.totalMoney.replace(/\,/g,""));
                            }
                            allData = allData.concat(cardData);
                            // console.log(allData)
                        }

                        //数据加载完毕刷新数据
                        // if(i>= 5){
                            self.setData({
                                allMoney:allMoney.toFixed(2),
                                items:allData
                            })
                        // }
                    }

                  })
              }else{
                //数据加载完毕刷新数据
                
                // if(i>= 5){
                    wx.hideLoading();
                    // self.setData({
                    //     allMoney:allMoney,
                    //     items:allData
                    // })
                // }
              }
          }
          

      }


      
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.serachStatus();
      wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      let userInfo = wx.getStorageSync("userInfo");
      return {
        title: '千星钱包',
        path: 'pages/main/main?userId='+userInfo.id
      }
  },
  orderDetail: function (e) {
    var param = e.currentTarget.id
    wx.navigateTo({
      url: '../bill/bill?orderNo=' + param,
    })
  }

})