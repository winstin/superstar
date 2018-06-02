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
    orderData: [],
    version:getApp().globalData.version
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
                    resolve(res.data.data.total);
                  }else{
                  }
              }

          })
    })

    Promise
    .all([a,b])
    .then(function(results){
        // console.log(results)
        that.setData({
          name: getApp().globalData.userInfos.nickName,
          creditCount: results[0],
          orderCount: results[1]
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

  },
  exit: function () {
    wx.clearStorage()
    // wx.redirectTo({
    //   url: '../login/login',
    // })

  }
})