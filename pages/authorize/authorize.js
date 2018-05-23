// pages/login/login.js
var utilMd5 = require('../../utils/md5.js');

var Tools = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    telNumber: '',
    password: '',
    hidden: true,
    isPhoneNum:true
  },
  
  //用户名和密码输入框事件
  numberInput: function (e) {
    this.setData({
      telNumber: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let username = wx.getStorageSync('username');
      console.log(username)
      // if(username!=undefined && username!=""){
      //   this.setData({isPhoneNum:false})
      // }

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

  toRegister: function (e) {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  bindGetUserInfo:function(e){
    console.log(e.detail.userInfo);
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo
          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
          wx.switchTab({
            url: '../main/main',
          })
        }
      }
    })

  },





  wxClickEvent: function (e) {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: getApp().globalData.server + '/mini/wxLogin',
          data: {
            code: res.code
          },
          success: function (data) {
            wx.setStorageSync("openid", data.data.data.openid)
            wx.request({
              url: getApp().globalData.server + '/mini/getUserInfoByOpenid',
              data:{
                openid: wx.getStorageSync('openid')
              },
              success:function(res) {
                if(res.data.isSuccess) {
                  wx.setStorageSync("username", res.data.data.tel)
                  wx.setStorageSync("password", res.data.data.password)
                  wx.switchTab({
                    url: '../main/main',
                  })
                } else {
                  wx.redirectTo({
                    url: '../register/register',
                  })
                }
              }
            })
          }
        })
      }
    })
  },

  loginClickEvent: function (e) {
    const that = this
    var baseUrl = getApp().globalData.server;
    var finalpassword = utilMd5.hexMD5(this.data.password);  
    //发起网络请求
    Tools.api({
      url: '/login',
      method: 'POST',
      data: {
        username: this.data.telNumber,
        password: finalpassword
      },
      isLogin:true,
      callback:(res)=> {
        if (res.data.isSuccess) {
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2500
          })
          wx.setStorage({
            key: "username",
            data: that.data.telNumber
          })
          wx.setStorage({
            key: "password",
            data: finalpassword
          })
          getApp().globalData.token = res.header.Authorization
          Tools.api({
            url: '/mini/getUserInfo',
            data: { id: res.data.data },
            callback:(res)=> {
              getApp().globalData.userInfo = res.data.data;
              wx.switchTab({
                url: '../main/main',
              })
            }
          })
        } else {
          that.setData({
            hidden: false
          })
          return
        }

      }
    })

  },
  getuserInfo: function(e){
    console.log(e)
  },
  getPhoneNumber: function (e) {
    console.log(e);
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)

    if(e.detail.encryptedData != undefined){//用户允许获取手机号
        wx.showToast({
          title: '获取成功！',
          icon: 'success',
          duration: 2500
        })
        this.setData({
          isPhoneNum:false
        })
    }
    
  }
})