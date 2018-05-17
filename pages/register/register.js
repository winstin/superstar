// pages/register/register.js
var maxTime = 60
var currentTime = maxTime //倒计时的事件（单位：s）  
var interval = null  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    disabled: true,
    phone: '',
    captcha: '',
    code: '',
    message:'获取验证码',
    messageDisable:false
  },

  //获取用户输入的手机号
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
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

  getCode: function (e) {
    const page = this
    if (this.data.phone == '' || this.data.phone.length < 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon:'none'
      })
      return
    }
    var baseUrl = getApp().globalData.server;
    wx.request({
      url: baseUrl + "/mini/get",
      data: {
        phoneNumber: this.data.phone
      },
      success: function (res) {
        currentTime = maxTime
        page.setData({
          messageDisable: true
        });
        interval = setInterval(function () {
          currentTime--
          page.setData({
            message: currentTime + 's后重新发送'
          })

          if (currentTime <= 0) {
            currentTime = -1
            clearInterval(interval)
            page.setData({
              message: '获取验证码',
              messageDisable: false
            });
          }
        }, 1000)  
        if (res.data != null) {
          page.setData({
            captcha: res.data.data
          });
          page.setData({
            disabled: false
          });
        }

      }
    })
  },

  nextRegister: function (e) {
    if (this.data.code != this.data.captcha) {
      this.setData({
        hidden: false
      })
      return
    }
    wx.navigateTo({
      url: '../register_next/register_next?phone=' + this.data.phone,
    })
  },

})