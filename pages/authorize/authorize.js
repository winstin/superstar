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
    isPhoneNum:true,
    isShareId:'',
    isFirst:true,
    title:getApp().globalData.title
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
    
    if(options.userId!= undefined && options.userId!= ""){//分享用户进首页处理
        this.setData({
            isShareId:options.userId
        })   
    }

    let userId = wx.getStorageSync("userId");

    if(userId!=undefined && userId!=""){
        this.setData({
            isShareId:userId
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
      let userInfo = wx.getStorageSync("userInfo");
      return {
        title: getApp().globalData.title,
        path: 'pages/main/main?userId='+userInfo.id
      }
  },

  toRegister: function (e) {
    wx.navigateTo({
      url: '../register/register',
    })
  },

  bindGetUserInfo:function(e){
      wx.showLoading({
        title:'登录中'
      })
      let self = this;
      wx.login({
        success: result => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId 
          var code = result.code; //返回code
          Tools.request({
              url: '/wx-mini-app/api/v1.0/wechat/user/login',
              method: 'GET',
              data: {
                agentAppId: getApp().globalData.appId,
                code: code
              },
              isLogin:true,
              callback:(res)=> {
                  
                  if(res.data){
                      wx.setStorageSync("openid", res.data.openid);
                      wx.setStorageSync("sessionKey", res.data.sessionKey);
                      self.Authorization(e);
                  }
              }
          })
        }
      })
  },

  Authorization:function(e){
    // console.log(e.detail)
    let jsonData = {};
    // jsonData = e.detail;
    // jsonData.signature = e.detail.signature;
    // jsonData.encryptedData = e.detail.encryptedData;
    // jsonData.errMsg = e.detail.errMsg;
    
    // jsonData.rawData = e.detail.rawData;
    // jsonData.iv = e.detail.iv;
     
    let self = this;
    jsonData.openId = wx.getStorageSync("openid");
    jsonData.agentAppId = getApp().globalData.appId;
    jsonData.avatarUrl = e.detail.userInfo.avatarUrl;
    jsonData.city = e.detail.userInfo.city;

    jsonData.country = e.detail.userInfo.country;

    jsonData.gender = e.detail.userInfo.gender;
    jsonData.language = e.detail.userInfo.language;

    jsonData.nickName = e.detail.userInfo.nickName;
    jsonData.language = e.detail.userInfo.language;
    jsonData.province = e.detail.userInfo.province;
    jsonData.wxAppId = getApp().globalData.wxAppId;
    if(self.data.isShareId!=''){
      jsonData.parentId = self.data.isShareId;
    }

    let userInfo = jsonData;

    // Tools.request({
    //     url: '/wx-mini-app/api/v1.0/wechat/user/info',
    //     method: 'GET',
    //     data: jsonData,
    //     isLogin:true,
    //     callback:(res)=> {
    //       let userInfo = {};
    //       if(res.data){
    //           userInfo = res.data;
    //       }
    //       let jsonDatas =  res.data;
          
          // jsonDatas = {"id":null,"createTime":1528712292217,"updateTime":1528712292217,"agentAppId":"12059023","openId":"osNGG5FaZI0FuZb-caGHVW6orDNc","nickName":"老虎狗🐶","gender":"1","language":"zh_CN","city":"Los Angeles City","province":"California","country":"US","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK1DYjl04EduvRtG3oNzh0m1o7AZ3UD2EibMdNTyGDWyicH2EM2FYaQW8uAmqNaM1m0rh1pNMcib5q0Q/132","unionId":null,"wxAppId":"wx6f8a41209a8e13b3"}
          Tools.request({
              url: '/wxuser/auth',
              method: 'POST',
              data:jsonData,
              isLogin:true,
              callback:(res)=> {
                  wx.hideLoading();
                  if(res.data.token){
                      wx.setStorageSync("token", res.data.token);
                      wx.setStorageSync("roleName", res.data.roleName);
                      userInfo.id = res.data.userId;
                      getApp().globalData.userInfo = userInfo;
                      wx.setStorageSync("userInfo",userInfo);
                      // 获取用户信息
                      wx.switchTab({
                        url: '../main/main',
                      })
                  }else{
                      wx.showModal({
                        content: "授权失败，可以联系客服! ",
                        showCancel: false
                      })
                      
                  }
                                                    
              }
          })
    //     }
    // })
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