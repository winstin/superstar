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

  checkContent:function(e){
      let content = "";
      switch(e){
        case "MINI_APP_AGENT_PAY":
          content = "代理商服务费";
          break;
        case "B":
          content = 2;
          break;
        case "C":
          content = 3;
          break;
        case "D":
          content = 4;
          break;
        case "E":
          content = 5;
          break;
      }
      return content;
  },


  serachStatus:function(){
      let self = this;
      wx.showLoading({
        title:'加载中...'
      })


      let allMoney = 0;
      let allData = [];


      Tools.fetch({
          url: '/businessDebitNote',
          method: 'GET',
          data:{},
          callback(res) {
              wx.hideLoading();
              if(res.data){
                  let cardData = res.data;
                  let cardImg = app.globalData.banklogo;
                  for(let i in cardData){
                      cardData[i].createTime = Tools.formatting((cardData[i].createTime+''));
                      cardData[i].debitNoteEnum = self.checkContent(cardData[i].debitNoteEnum);

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
                    items:cardData
                  })
              }
          }

      })
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