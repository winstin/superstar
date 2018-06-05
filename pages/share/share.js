// pages/login/login.js
var utilMd5 = require('../../utils/md5.js');

var Tools = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textInput:'千星钱包'
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    let userInfo = wx.getStorageSync("userInfo");
    return {
      title: this.data.textInput,
      path: 'pages/main/main?userId='+userInfo.id
    }
  },

  textInput:function (e) {
    this.setData({
      textInput: e.detail.value
    })
  },

 
})