 // pages/debit_add/debit_add.js
var isIdcard = new RegExp(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, 'g')
var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idCard: '',
    merchAddr: '',
    tel: '',
    cardNumber: '',
  },
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  idCardInput: function (e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  merchAddrInput: function (e) {
    this.setData({
      merchAddr: e.detail.value
    })
  },
  telInput: function (e) {
    this.setData({
      tel: e.detail.value
    })
  },
  cardNumberInput: function (e) {
    this.setData({
      cardNumber: e.detail.value
    })
  },

  cvnInput: function (e) {
    this.setData({
      cvn: e.detail.value
    })
  },
  dateInput: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getApp().globalData.userInfo == null) {
      wx.redirectTo({
        url: '../login/login',
      })
    }
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

  },

  submit: function (e) {
    var baseUrl = getApp().globalData.server;
    if (isIdcard.test(this.data.idCard) == false) {
      wx.showToast({
        title: '身份证格式不正确',
        icon: 'none',
        duration: 2000,
      })
      return
    }
    Tools.fetch({
        url: '/settleBankCard',
        method: 'POST',
        data: {
          "cardNumber": this.data.cardNumber,
          "idCard": this.data.idCard,
          "name": this.data.name,
          "tel": this.data.tel
        },
        callback(res) {
          // console.log(res)
          if (res.data.isSuccess) {
              wx.navigateTo({
                url: '../debit/debit',
              })
          }
        }
    })

    // wx.request({
    //   url: baseUrl + "/api/debit",
    //   method: 'POST',
    //   header: {
    //     'Authorization': getApp().globalData.token
    //   },
    //   data: {
    //     appId: getApp().globalData.appId,
    //     cardNumber: this.data.cardNumber,
    //     name: this.data.name,
    //     idCard: this.data.idCard,
    //     tel: this.data.tel,
    //     merchAddr: this.data.merchAddr,
    //     userId: getApp().globalData.userInfo.id
    //   },
    //   success(res) {
    //     console.log(res)
    //     if (res.data.isSuccess) {
    //       wx.request({
    //         url: baseUrl + '/mini/getUserInfo',
    //         header: {
    //           'Authorization': getApp().globalData.token
    //         },
    //         data: { id: getApp().globalData.userInfo.id },
    //         success(res) {
    //           getApp().globalData.userInfo = res.data.data;
    //         }
    //       })
    //       wx.navigateTo({
    //         url: '../credit_add/credit_add',
    //       })
    //     } else {
    //       wx.showToast({
    //         title: res.data.message,
    //         icon: 'none'
    //       })
    //     }
    //   }
    // })
  }
})