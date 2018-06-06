// pages/pay_complete/pay_complete.js
var Tools = require('../../utils/util.js');

Page({
// waiting
  /**
   * 页面的初始数据
   */
  data: {
    iconType: 'success',
    message: '支付成功',
    amount: '',
    agentOrderNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      amount: options.amount,
      agentOrderNo: options.agentOrderNo,
    })
    if (options.success == 'false') {
        this.setData({
          iconType: 'cancel',
          message: '支付失败',
        })
    }else if(options.success == 'waiting'){
        this.setData({
          iconType: 'waiting',
          message: '支付中',
        })
    }
    this.reLoad();
  },

  /**
   * @Author   Winstin
   * @DateTime 2018-06-02
   * @param    string
   * @license  刷新支付状态
   * @version  [version]
   * @return   {[type]}   [description]
   */
  reLoad: function (){
      const that = this;
      if(that.data.agentOrderNo != undefined && that.data.agentOrderNo != ""){
          Tools.fetch({
                url: '/order/'+that.data.agentOrderNo,
                method: 'GET',
                data:{},
                callback(res) {
                    if (res.data.isSuccess) {
                        if(res.data.data.orderStatus == "A"){
                            that.setData({
                                iconType: 'waiting',
                                message: '支付中',
                            })
                        }else if(res.data.data.orderStatus == "B"){
                            that.setData({
                                iconType: 'cancel',
                                message: '支付失败',
                            })
                        }else if(res.data.data.orderStatus == "C"){
                            that.setData({
                                iconType: 'success',
                                message: '已支付',
                            })
                        }else if(res.data.data.orderStatus == "D"){
                            that.setData({
                                iconType: 'success',
                                message: '结算中',
                            })
                        }else if(res.data.data.orderStatus == "E"){
                            that.setData({
                                iconType: 'success',
                                message: '结算成功',
                            })
                        }
                        
                    }
                }
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
      this.reLoad();
      wx.stopPullDownRefresh()
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
  },
  complete:function() {
    wx.switchTab({
      url: '../main/main'
    })
  }
})