// pages/openquick/openquick.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idCard: '',
    bankCardId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bankCardId: options.bankCardId,
      name: getApp().globalData.userInfo.name,
      idCard: getApp().globalData.userInfo.idCard,
      pointsType: options.pointsType
    })
    var baseUrl = getApp().globalData.server;
    const that = this
    wx.request({
      url: baseUrl + '/mini/findCreditById',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        id: 8
      },
      success(res) {
        if (res.data.isSuccess) {
          that.setData({
            tel: res.data.data.tel,
            cardNumber: res.data.data.cardNumber,
            cvn: res.data.data.cvn,
            date: res.data.data.date,
          })
        }
      }
    })
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
  onShareAppMessage: function () {
      let openid = wx.getStorageSync("openid");
      return {
        title: '千星钱包',
        path: 'pages/main/main?openId='+openid
      }
  },
  openquick: function () {
    var baseUrl = getApp().globalData.server;
    const that = this
    wx.request({
      url: baseUrl + '/api/open',
      method: 'POST',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        tel: getApp().globalData.userInfo.tel,
        bankCardId: that.data.bankCardId,
        pointsType: that.data.pointsType
      },
      success(res) {
        if (res.data.isSuccess) {
          wx.showToast({
            title: '开通成功',
            duration: 2000
          })
          setTimeout(
            wx.navigateBack({
              delta: 1
            }), 2000)
        }
      }
    })
  }
})