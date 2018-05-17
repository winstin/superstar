// pages/main/main.js
var baseUrl = getApp().globalData.server
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
                        url = '../debit_add/debit_add'
                      } else if (res.data.data == 'credit') {
                        url = '../credit_add/credit_add'
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
            url = '../debit_add/debit_add'
          } else if (res.data.data == 'credit') {
            url = '../credit_add/credit_add'
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
  onShareAppMessage: function () {

  },
  getPhoneNumber: function (e) {
    console.log(e);
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  } 
})