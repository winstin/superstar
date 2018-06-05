// pages/pay_type/pay_type.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    index: 0,
    amount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.index != null) {
      this.setData({
        index:options.index
      })
    }
    this.setData({
      amount: options.amount
    })
    var that = this
    var baseUrl = getApp().globalData.server
    wx.request({
      url: baseUrl + '/mini/findCredit',
      header: {
        'Authorization': app.globalData.token
      },
      data: {
        phoneNumber: app.globalData.userInfo.tel
      },
      success(res) {
        if (res.data.isSuccess) {
          var carditems = [];
          for (var i = 0; i < res.data.data.length; i++) {
            var card = res.data.data[i]
            var info = card.bankName + card.bankCardType + '(' + card.cardNumberLast4 + ')'
            var carditem = { name: '', value: '' };
            carditem.name = info
            carditem.value = i
            if (i == that.data.index) {
              carditem.checked = true
            }
            carditems.push(carditem)
          }

          that.setData({
            items: carditems
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
      let userInfo = wx.getStorageSync("userInfo");
      return {
        title: '千星钱包',
        path: 'pages/main/main?userId='+userInfo.id
      }
  },
  radioChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  selectCard:function() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      index: this.data.index,
      amount: this.data.amount
    })
    wx.navigateBack({
      delta:1
    })
  },
  addCard:function() {
    wx.navigateTo({
      url: '../credit_add/credit_add',
    })
  }
})