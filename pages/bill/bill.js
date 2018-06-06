// pages/bill/bill.js
var app = getApp();
var baseUrl = app.globalData.server;
var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '',
    createTime: '',
    orderNo: '',
    rate: '',
    money: '',
    status:'',
    stateMsg:'',
    settleStatusMsg:'',
    orderData:{},
    cardNumber:"",
    tel:"",
    d0fee:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderNo: options.orderNo
    })
    // console.log(this.data.orderNo)
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
    const that = this;
    Tools.fetch({
          url: '/order/'+that.data.orderNo,
          method: 'GET',
          data:{},
          callback(res) {
              if (res.data.isSuccess) {
                let cardNumber="";
                let tel="";
                if(res.data.data.cardNumber){
                    cardNumber = res.data.data.cardNumber.substr(0,5)+"*******"+res.data.data.cardNumber.substr(res.data.data.cardNumber.length-5,res.data.data.cardNumber.length-1)
                }

                if(res.data.data.tel){
                    tel = res.data.data.tel.substr(0,3)+"*******"+res.data.data.tel.substr(res.data.data.tel.length-4,res.data.data.tel.length-1)
                }

                that.setData({
                    status: res.data.data.orderStatus,
                    amount: res.data.data.totalFee,
                    createTime: Tools.formatting(res.data.data.createTime+''),
                    bankName: res.data.data.bankName,
                    stateMsg: res.data.data.result,
                    settleStatusMsg: res.data.data.orderResult || "-",
                    tel:tel,
                    cardNumber:cardNumber,
                    orderData: res.data.data,
                    d0fee:(res.data.data.d0fee/100).toFixed(2)
                })
              }
          }
    })
  },


  copyOrderNo:function(){
      wx.setClipboardData({
        data: this.data.orderNo,
        success: function(res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 1000
            })
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
  onShareAppMessage: function () {
      let userInfo = wx.getStorageSync("userInfo");
      return {
        title: '千星钱包',
        path: 'pages/main/main?userId='+userInfo.id
      }
  }
})