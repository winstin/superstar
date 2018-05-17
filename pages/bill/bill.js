// pages/bill/bill.js
var app = getApp()
var baseUrl = app.globalData.server
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '',
    createTime: '',
    orderNo: '',
    rate: '',
    money: '',
    status:'',
    stateMsg:'',
    settleStatusMsg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo
    })
    console.log(this.data.orderNo)
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
    const that = this
    wx.request({
      url: baseUrl + '/mini/queryOrder',
      data: {
        outTradeNo: that.data.orderNo
      },
      header: {
        'Authorization': app.globalData.token
      },
      success(res) {
        if (res.data.isSuccess) {
          that.setData({
            status: res.data.data.orderState,
            amount: res.data.data.totalFee,
            createTime: res.data.data.createTime,
            bankName: res.data.data.bankName,
            stateMsg:res.data.data.result,
            settleStatusMsg: res.data.data.orderResult
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

  }
})