// pages/main/main.js
var baseUrl = getApp().globalData.server;
var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payUrl: '',
    canIUse: false,
    isPhoneNum:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.checkIsSupportSoterAuthentication({
    //     success: res => {
    //         wx.showModal({
    //           content: JSON.stringify(res),
    //           showCancel: false
    //         })
    //         console.log(res)
    //         // res.supportMode = [] 不具备任何被SOTER支持的生物识别方式
    //         // res.supportMode = ['fingerPrint'] 只支持指纹识别
    //         // res.supportMode = ['fingerPrint', 'facial'] 支持指纹识别和人脸识别
    //     },
    //     fail:err =>{
    //         console.log(err)
    //     } 
    // })

    let weixin_token = wx.getStorageSync("token");
    let userInfo = wx.getStorageSync("userInfo");
    if(weixin_token == undefined || weixin_token == "" ||userInfo == undefined || userInfo == "" ){
        wx.redirectTo({
          url: '../authorize/authorize',
        })
        return
    }else{
       getApp().globalData.tokens = weixin_token;
       getApp().globalData.userInfos = userInfo;
    }

    if(options.userId){//分享用户进首页处理
        // wx.showModal({
        //   content: options.userId,
        //   showCancel: false
        // });
        let JsonData= wx.getStorageSync("userInfo");
        JsonData.parentId = '1';
        Tools.request({
            url: '/wxuser/auth',
            method: 'POST',
            data: JsonData,
            isLogin:true,
            callback:(res)=> {
                wx.setStorageSync("token", res.data.token);
                getApp().globalData.tokens = res.data.token;
            }
        })
    }
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     console.log(res.userInfo)
          //     // 可以将 res 发送给后台解码出 unionId
          //     this.globalData.userInfo = res.userInfo
          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
        }else{
          wx.redirectTo({
            url: '../authorize/authorize',
          })
          return
        }
      }
    })


    /*wx.getSystemInfo({
      success: res => {
        console.log(res)
        this.setData({
          scrollheight: res.windowHeight - heightAll
        })
        
      }
    })*/
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
    const that = this
    Tools.fetch({
        url: '/creditBankCard',
        method: 'GET',
        isLogin:false,
        callback(res) {
          if (res.data.isSuccess) {
              if(res.data.data && res.data.data.length>0){
                  wx.setStorageSync("name",res.data.data[0].name);
                  wx.setStorageSync("idCard",res.data.data[0].idCard);
              }
          }
        }
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
  onShareAppMessage: function (res) {
    let userInfo = wx.getStorageSync("userInfo");
    return {
      title: '千星钱包',
      path: 'pages/main/main?userId='+userInfo.id
    }
  },

  getPhoneNumber: function (e) {
    console.log(e);
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    this.setData({isPhoneNum:false})
  },

  cancel:function(){
      this.setData({isPhoneNum:false})
  },

  concat:function(){
    wx.request({
          url: "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token="+getApp().globalData.token,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
              "touser":"OPENID",
              "msgtype":"text",
              "text":
              {
                   "content":"Hello World"
              }
          },
          success(res) {
            
          }
        })
  },
  bindGetUserInfo: function(e) {
    console.log(e.detail.userInfo);
    this.setData({canIUse:false});
  }
})