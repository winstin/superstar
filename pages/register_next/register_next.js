// pages/register_next/register_next.js
var utilMd5 = require('../../utils/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: '',
    passwordConfirm: '',
    hidden: true,
    message: "该手机号已被注册"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        phone: options.phone
      }
    );
  },

  passwordInput: function (e) {
    this.setData(
      {
        password: e.detail.value
      }
    )
  },
  passwordConfirmInput: function (e) {
    this.setData(
      {
        passwordConfirm: e.detail.value
      }
    )
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
        title: getApp().globalData.title,
        path: 'pages/main/main?openId='+openid
      }
  },

  registerEvent: function (e) {
    var baseUrl = getApp().globalData.server
    if (this.data.password.length < 6 || this.data.password.length > 16) {
      wx.showToast({
        title: '请输入长度为6-16位的密码',
        icon: 'none'
      })
      return
    }
    if (this.data.password != this.data.passwordConfirm) {
      this.setData({
        hidden: false
      })
      return
    } else {
      this.setData({
        hidden: true
      })
    }
    var finalpassword = utilMd5.hexMD5(this.data.password);
    wx.request({
      url: baseUrl + '/mini/register',
      method: 'POST',
      data: {
        tel: this.data.phone,
        password: finalpassword
      },
      success(res) {
        if (res.data.isSuccess) {
          wx.showToast({
            title: '注册成功请登录',
          })
          // setTimeout(function () {
          //   wx.redirectTo({
          //     url: '../login/login',
          //   })
          // }, 2000)
         
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  }
})