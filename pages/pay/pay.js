// pages/pay/pay.js
var baseUrl = getApp().globalData.server

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId: '',
    cardInfo: '',
    amount: '',
    index: 0,
    pickerindex: '0',
    array: [],
    objectArray: [],
    pointsType:''
  },

  amountInput: function (e) {
    this.setData({
      amount: e.detail.value
    })
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
    const that = this
    wx.request({
      url: baseUrl + '/mini/getChantAgentRate',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: { appId: getApp().globalData.appId },
      success(res) {
        if (res.data.isSuccess) {
          var a = [];
          var oa = [];
          var pt = res.data.data[0].pointsType
          for (var i = 0; i < res.data.data.length; i++) {
            var o = { 'id': res.data.data[i].pointsType, name: res.data.data[i].name }
            a[i] = res.data.data[i].name
            oa[i] = o
          }
          that.setData({
            array: a,
            objectArray: oa,
            pointsType: pt
          })
          console.log(that.data.pointsType)
        }
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    wx.request({
      url: baseUrl + '/mini/findCredit',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        phoneNumber: getApp().globalData.userInfo.tel
      },
      success(res) {
        if (res.data.isSuccess) {
          var card = res.data.data[that.data.index]
          var info = card.bankName + card.bankCardType + '(' + card.cardNumberLast4 + ')'
          that.setData({
            cardId: card.id
          })
          that.setData({
            cardInfo: info
          })

        } else {
          wx.redirectTo({
            url: '../credit_add/credit_add',
          })
        }
      }
    })
  },

  bindPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      pointsType: this.data.objectArray[e.detail.value].id,
      pickerindex: e.detail.value
    })
    console.log('pointsType:' + this.data.pointsType)
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

  selectCredit: function () {
    wx.navigateTo({
      url: '../pay_type/pay_type?amount=' + this.data.amount + '&index=' + this.data.index,
    })
  },

  submitPay: function () {
    const that = this
    if (this.data.amount == '') {
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
      return
    }
    wx.request({
      url: baseUrl + '/api/sms',
      method: 'POST',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        tel: getApp().globalData.userInfo.tel,
        appId: getApp().globalData.appId,
        bankCardId: this.data.cardId,
        money: this.data.amount * 100,
        pointsType:this.data.pointsType
      },
      success(res) {
        if (res.data.isSuccess) {
          wx.navigateTo({
            url: '../pay_next/pay_next?bankCardId=' + that.data.cardId + '&amount=' + that.data.amount + '&orderNo=' + res.data.data + '&pointsType=' + that.data.ponitsType,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
          return
        }
      }
    })

  }
})