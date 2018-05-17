// pages/my/my.js
var app = getApp()
var baseUrl = app.globalData.server
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    creditCount: 0,
    orderCount: 0,
    orderData: []
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
    var bankCards = getApp().globalData.userInfo.bankCards
    const that = this
    var count = 0
    for (var i = 0; i < bankCards.length; i++) {
      if (bankCards[i].bankCardType == '贷记卡') {
        count += 1
      }
    }
    this.setData({
      name: getApp().globalData.userInfo.nickName,
      creditCount: count
    })
    wx.request({
      url: baseUrl + '/mini/findOrder',
      data: {
        phoneNumber: app.globalData.userInfo.tel,
        type: '0'
      },
      header: {
        'Authorization': app.globalData.token
      },
      success(res) {
        if (res.data.isSuccess) {
          that.setData({
            orderCount: res.data.data
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
    wx.redirectTo({
      url: '../login/login',
    })

  }
})