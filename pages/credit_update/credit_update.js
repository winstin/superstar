// pages/credit/credit.js
const app = getApp();
var baseUrl = app.globalData.server;
var Tools = require('../../utils/util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    btndisable: true,
    bankCardId: '',
    bankName: '',
    cardNumber: '',
    name: '',
    idcard: '',
    tel: '',
    cvn: '',
    date: '',
    items: null,
    x: 0,
    originCardNumber: '',
    id:'',
  },

  telInput: function (e) {
    this.setData({
      tel: e.detail.value,
      btndisable: false
    })

  },
  cardNumberInput: function (e) {
    this.setData({
      cardNumber: e.detail.value,
      btndisable: false
    })
  },
  cvnInput: function (e) {
    this.setData({
      cvn: e.detail.value,
      btndisable: false
    })
  },
  dateInput: function (e) {
    this.setData({
      date: e.detail.value,
      btndisable: false
    })
  },
  swiperEvent: function (e) {
    this.findCredit(e.detail.current)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        id: options.id
      })
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
    var that = this;
    Tools.fetch({
        url: '/creditBankCard',
        method: 'GET',
        isLogin:false,
        callback(res) {
          if (res.data.isSuccess) {
            let cardData = res.data.data;
            that.setData({
              items: cardData
            })
          }
          if (that.data.items == null || that.id == "") {
            wx.showToast({
              title: '未绑定信用卡',
              icon: 'none',
              duration: 3000
            })
          } else {
            that.findCredit(that.id)
          }
        }
    })
    // wx.request({
    //   url: baseUrl + '/mini/findCredit',
    //   header: {
    //     'Authorization': app.globalData.token
    //   },
    //   data: {
    //     phoneNumber: app.globalData.userInfo.tel
    //   },
    //   success(res) {
    //     if (res.data.isSuccess) {
    //       let cardData = res.data.data;
    //       that.setData({
    //         items: cardData
    //       })
    //     }
    //     if (that.data.items == null || that.id == "") {
    //       wx.showToast({
    //         title: '未绑定信用卡',
    //         icon: 'none',
    //         duration: 3000
    //       })
    //     } else {
    //       that.findCredit(that.id)
    //     }
    //   }
    // })
    this.setData({
      name: app.globalData.userInfo.name,
      idCard: app.globalData.userInfo.idCard,
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

  },

  findCredit: function (index) {
    for(let index in this.data.items){
      if(this.data.items[index].id == this.data.id){

          this.setData({
            bankCardId: this.data.items[index].id,
            bankName: this.data.items[index].bankName,
            cardNumber: this.data.items[index].cardNumber,
            cvn: this.data.items[index].cvn,
            date: this.data.items[index].date,
            tel: this.data.items[index].tel,
            originCardNumber: this.data.items[index].cardNumber
          })
      }
    }
  },
  updateCredit: function () {
    var that = this
    wx.showLoading({
      title: '修改中请稍候',
      mask: true,
    })

    Tools.fetch({
        url: '/creditBankCard/'+that.data.bankCardId,
        method: 'PUT',
        data: {
          "cardNumber": this.data.cardNumber,
          "cvn": this.data.cvn,
          "date": this.data.date,
          "tel": this.data.tel
        },
        isLogin:false,
        callback:(res)=> {
            wx.hideLoading()
            if (res.data.isSuccess) {
              wx.showToast({
                title: '修改成功',
              })
              that.setData({
                bankName: res.data.data.bankName,
                btndisable: true
              })
            } else {
              that.setData({
                cardNumber: that.data.originCardNumber,
                btndisable: true
              })
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000
              })
              return
            }
        }
    })
    // wx.request({
    //   url: baseUrl + '/mini/updateCredit',
    //   method: 'POST',
    //   header: {
    //     'Authorization': app.globalData.token
    //   },
    //   data: {
    //     id: that.data.bankCardId,
    //     tel: that.data.tel,
    //     cardNumber: that.data.cardNumber,
    //     cvn: that.data.cvn,
    //     date: that.data.date
    //   },
    //   success(res) {
    //     setTimeout(function () {
    //       wx.hideLoading()
    //     }, 2000)
    //     if (res.data.isSuccess) {
    //       that.setData({
    //         bankName: res.data.data.bankName
    //       })
    //       wx.showToast({
    //         title: '修改成功',
    //       })
    //       that.setData({
    //         btndisable: true
    //       })
    //     } else {
    //       that.setData({
    //         cardNumber: that.data.originCardNumber,
    //         btndisable: true
    //       })
    //       wx.showToast({
    //         title: res.data.message,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //       return
    //     }
    //   }
    // })

  },
  addCredit: function () {
    wx.navigateTo({
      url: '../credit_add/credit_add',
    })
  },

  orderDetail: function(e){
      console.log(this.data.items)
  },


  delCredit:function(){
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否确定删除该信用卡。',
      success: function(res) {
        if (res.confirm) {
          console.log("1")
          self.delete();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  delete:function(){

    Tools.fetch({
        url: '/creditBankCard/'+this.data.bankCardId,
        method: 'DELETE',
        isLogin:false,
        callback:(res)=> {
            wx.hideLoading()
            if (res.data.isSuccess) {
                wx.showToast({
                  title: '删除成功',
                })
                wx.navigateTo({
                  url: '../credit/credit',
                })
            }
        }
    })
  }

 
})