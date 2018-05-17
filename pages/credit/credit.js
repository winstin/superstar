// pages/credit/credit.js
const app = getApp()
var baseUrl = app.globalData.server
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btndisable: true,
    bankCardId: '',
    bankName: '',
    cardNumber: '',
    name: '',
    idcard: '',
    tel: '',
    cvn: '',
    date: '',
    items: null,
    x: 0,
    originCardNumber: ''
  },

  telInput: function (e) {
    this.setData({
      tel: e.detail.value,
      btndisable: false
    })

  },
  cardNumberInput: function (e) {
    this.setData({
      cardNumber: e.detail.value,
      btndisable: false
    })
  },
  cvnInput: function (e) {
    this.setData({
      cvn: e.detail.value,
      btndisable: false
    })
  },
  dateInput: function (e) {
    this.setData({
      date: e.detail.value,
      btndisable: false
    })
  },
  swiperEvent: function (e) {
    this.findCredit(e.detail.current)
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
    var that = this
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
          that.setData({
            items: res.data.data
          })
        }
        if (that.data.items == null) {
          wx.showToast({
            title: '未绑定信用卡',
            icon: 'none',
            duration: 3000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../my/my',
            })
          }, 2000)

        } else {
          that.findCredit(0)
        }
      }
    })
    this.setData({
      name: app.globalData.userInfo.name,
      idCard: app.globalData.userInfo.idCard,
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

  findCredit: function (index) {
    this.setData({
      bankCardId: this.data.items[index].id,
      bankName: this.data.items[index].bankName,
      cardNumber: this.data.items[index].cardNumber,
      cvn: this.data.items[index].cvn,
      date: this.data.items[index].date,
      tel: this.data.items[index].tel,
      originCardNumber: this.data.items[index].cardNumber
    })
  },
  updateCredit: function () {
    var that = this
    wx.showLoading({
      title: '修改中请稍候',
      mask: true,
    })
    wx.request({
      url: baseUrl + '/mini/updateCredit',
      method: 'POST',
      header: {
        'Authorization': app.globalData.token
      },
      data: {
        id: that.data.bankCardId,
        tel: that.data.tel,
        cardNumber: that.data.cardNumber,
        cvn: that.data.cvn,
        date: that.data.date
      },
      success(res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        if (res.data.isSuccess) {
          that.setData({
            bankName: res.data.data.bankName
          })
          wx.showToast({
            title: '修改成功',
          })
          that.setData({
            btndisable: true
          })
        } else {
          that.setData({
            cardNumber: that.data.originCardNumber,
            btndisable: true
          })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
          return
        }
      }
    })

  },
  addCredit: function () {
    wx.navigateTo({
      url: '../credit_add/credit_add',
    })
  }  
})