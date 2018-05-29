// pages/main/main.js
var baseUrl = getApp().globalData.server
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
    if(options.openId){//分享用户进首页处理

    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
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
    const that = this
    var username = wx.getStorageSync('username')
    var password = wx.getStorageSync('password')
    if (getApp().globalData.userInfo == null) {
      if (username == '' || password == '') {
        wx.redirectTo({
          url: '../login/login',
        })
        return
      } else {
        wx.request({
          url: baseUrl + '/login',
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            username: username,
            password: password
          },
          success(res) {
            if (res.data.isSuccess) {
              getApp().globalData.token = res.header.Authorization
              wx.request({
                url: baseUrl + '/mini/getUserInfo',
                header: {
                  'Authorization': getApp().globalData.token
                },
                data: { id: res.data.data },
                success(res) {
                  getApp().globalData.userInfo = res.data.data;
                  wx.request({
                    url: baseUrl + '/mini/hasBindCard',
                    header: {
                      'Authorization': getApp().globalData.token
                    },
                    data: {
                      phoneNumber: getApp().globalData.userInfo.tel,
                    },
                    success(res) {
                      var url = ''
                      if (res.data.data == 'debit') {
                        // url = '../debit_add/debit_add'
                        url = '../pay/pay?type=debit'
                      } else if (res.data.data == 'credit') {
                        url = '../pay/pay?type=credit'
                        // url = '../credit_add/credit_add'
                      } else if (res.data.data == 'order') {
                        url = '../pay/pay'
                      }

                      that.setData({
                        payUrl: url
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    if (getApp().globalData.userInfo != null) {
      wx.request({
        url: baseUrl + '/mini/hasBindCard',
        header: {
          'Authorization': getApp().globalData.token
        },
        data: {
          phoneNumber: getApp().globalData.userInfo.tel,
        },
        success(res) {
          var url = ''
          if (res.data.data == 'debit') {
            // url = '../debit_add/debit_add'
            url = '../pay/pay?type=debit'
          } else if (res.data.data == 'credit') {
            url = '../pay/pay?type=credit'
            // url = '../credit_add/credit_add'
          } else if (res.data.data == 'order') {
            url = '../pay/pay'
          }
          that.setData({
            payUrl: url
          })
        }
      })
    }
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '千星钱包',
      path: 'pages/main/main?openId=123'
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