// pages/my/my.js
var app = getApp();
var baseUrl = app.globalData.server;
var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    creditCount: 0,
    orderCount: 0,
    serviceCount:0,
    orderData: [],
    version:getApp().globalData.version,
    roleName:'',
    count:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // var bankCards = getApp().globalData.userInfo.bankCards
    const that = this
    var count = 0;

    let roleName = wx.getStorageSync("roleName");

    if(roleName == "省钱宝典"){
        roleName = "代理商"
    }else if(roleName == "赚钱宝典"){
        roleName = "服务商"
    }else{
        roleName = "普通用户"
    }

    let openId = wx.getStorageSync("openid");
    let a = new Promise(function(resolve,reject){
          Tools.fetch({
              url: '/creditBankCard',
              method: 'GET',
              isLogin:false,
              callback(res) {
                if (res.data.isSuccess) {
                  let cardData = res.data.data;
                  for (var i = 0; i < cardData.length; i++) {
                    count += 1
                  }
                  resolve(count);
                }
              }
          })
    })

    let b = new Promise(function(resolve,reject){
          Tools.fetch({
              url: '/order',
              method: 'GET',
              data:{},
              callback(res) {
                  if (res.data.isSuccess){
                    resolve(res.data.data.length);
                  }else{
                    resolve(0);
                  }
              }

          })
    })

    let c = new Promise(function(resolve,reject){
          Tools.fetch({
              url: '/businessDebitNote',
              method: 'GET',
              data:{},
              callback(res) {
                  if(res.data){
                    if (res.data.length>0){
                      resolve(res.data.length);
                    }else{
                      resolve(0);
                    }
                  }else{
                    resolve(0);
                  }
              }

          })
    })


    let d = new Promise(function(resolve,reject){
          Tools.request({
              url: '/wxuser/wxUsers/share/'+openId,
              method: 'GET',
              data:{},
              callback(res) {
                  if(res.data.data){
                    resolve(res.data.data.count);
                  }else{
                    resolve(0);
                  }
              }

          })
    })


    Promise
    .all([a,b,c,d])
    .then(function(results){

        that.setData({
          name: getApp().globalData.userInfos.nickName,
          creditCount: results[0],
          orderCount: results[1],
          serviceCount:results[2],
          roleName:roleName||"普通用户",
          count:results[3]
        })
    });
    
    

    
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
        title: getApp().globalData.title,
        path: 'pages/main/main?userId='+userInfo.id
      }
  },
  exit: function () {
    wx.clearStorage()
    // wx.redirectTo({
    //   url: '../login/login',
    // })

  }
})