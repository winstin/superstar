// pages/credit_add/credit_add.js

var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idCard: '',
    tel: '',
    cardNumber: '',
    cvn: '',
    date: ''
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = wx.getStorageSync("name");
    let idCard = wx.getStorageSync("idCard");

    this.setData({
        name:name,
        idCard:idCard
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
        title: getApp().globalData.title,
        path: 'pages/main/main?userId='+userInfo.id
      }
  },

  submit: function () {
    var baseUrl = getApp().globalData.server;
    Tools.request({
        url: '/mini-api/api/v1.0/creditBankCard',
        method: 'POST',
        data: {
          "cardNumber": this.data.cardNumber,
          "cvn": this.data.cvn,
          "date": this.data.date,
          "idCard": this.data.idCard,
          "name": this.data.name,
          "tel": this.data.tel
        },
        isLogin:false,
        callback:(res)=> {
            if (res.data.isSuccess) {
                wx.navigateBack({ changed: true })
                // wx.navigateTo({
                //   url: '../pay/pay',
                // })
            }
        }
    })
    // wx.request({
    //   url: baseUrl + '/mini/addCredit',
    //   method: 'POST',
    //   header: {
    //     'Authorization': getApp().globalData.token
    //   },
    //   data: {
    //     userPhone: getApp().globalData.userInfo.tel,
    //     cardNumber: this.data.cardNumber,
    //     tel: this.data.tel,
    //     cvn: this.data.cvn,
    //     date: this.data.date
    //   },
    //   success(res) {
    //     if (res.data.isSuccess) {
    //       wx.navigateTo({
    //         url: '../pay/pay',
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