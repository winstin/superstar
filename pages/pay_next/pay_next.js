// pages/pay_next/pay_next.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    idcard: '',
    tel: '',
    cardNumber: '',
    cvn: '',
    date: '',
    amount: '',
    totalfee:'',
    code: '',
    orderNo: '',
    bankCardId:'',
    pointsType:''
  },

  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      amount: '\n' + options.amount,
      totalfee: options.amount,
      name: '\n' + getApp().globalData.userInfo.name,
      idcard: '\n' + getApp().globalData.userInfo.idCard,
      orderNo: options.orderNo,
      bankCardId: options.bankCardId,
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
        id: options.bankCardId
      },
      success(res) {
        if (res.data.isSuccess) {
          that.setData({
            tel: '\n' + res.data.data.tel,
            cardNumber: '\n' + res.data.data.cardNumber,
            cvn: '\n' + res.data.data.cvn,
            date: '\n' + res.data.data.date,
          })
        }
      }
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
    const that = this
    if (this.data.code == '') {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
    wx.showLoading({
      title: '正在支付，请稍候',
      mask:true
    })
    wx.request({
      url: baseUrl + '/api/pay',
      method: 'POST',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        appId: getApp().globalData.appId,
        outTradeNo: this.data.orderNo,
        smsCode: this.data.code
      },
      success(res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        if (res.data.isSuccess) {
          
          wx.navigateTo({
            url: '../pay_complete/pay_complete?success=true&amount=' + that.data.totalfee,
          })
        } else {
          if (res.data.code == 77) {
            wx.showModal({
              content: '此卡尚未开通快捷支付，是否前往开通',
              success: function (re) {
                if (re.confirm) {
                  wx.navigateTo({
                    url: '../openquick/openquick?bankCardId=' + that.data.bankCardId + '&pointsType=' + that.data.ponitsType,
                  })
                } else if (re.cancel) {
                  return
                }
              }
            })
            return
          }
          wx.navigateTo({
            url: '../pay_complete/pay_complete?success=false&amount=' + that.data.totalfee,
          })
        }
      }
    })
  }
})