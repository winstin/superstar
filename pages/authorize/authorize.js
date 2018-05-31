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
    let jsonData = e.detail;
    let self = this;
    jsonData.sessionKey = wx.getStorageSync("sessionKey");
    jsonData.agentAppId = getApp().globalData.appId;

    wx.showLoading({
      title:'登录中'
    })
    Tools.request({
        url: '/wx-mini-app/api/v1.0/wechat/user/info',
        method: 'GET',
        data: jsonData,
        isLogin:true,
        callback:(res)=> {
          if(res.data){
              getApp().globalData.userInfo = res.data.data;
              wx.setStorageSync("userInfo",res.data);
          }
          Tools.request({
              url: '/wxuser/auth',
              method: 'POST',
              data: res.data,
              isLogin:true,
              callback:(res)=> {
                  wx.hideLoading();
                  wx.setStorageSync("token", res.data);
                  getApp().globalData.tokens = res.data;
                  // 获取用户信息
                  wx.switchTab({
                    url: '../main/main',
                  })
                                                    
              }
          })
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