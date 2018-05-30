// pages/debit/debit.js
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
    originCardNumber: '',
    style:'',
    url:'',
    isHasCard:true
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

  nameInput: function (e) {
    this.setData({
      name: e.detail.value,
      btndisable: false
    })
  },

  idCardInput: function (e) {
    this.setData({
      idcard: e.detail.value,
      btndisable: false
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
    // this.setData({
    //   name: app.globalData.userInfo.name,
    //   idCard: app.globalData.userInfo.idCard,
    // })
    var that = this
    Tools.fetch({
        url: '/settleBankCard',
        method: 'GET',
        callback(res) {
            if (res.data.isSuccess && res.data.data.length>0) {
                let cardData = res.data.data[0];
                // console.log(cardData);
                let cardImg = app.globalData.banklogo;
                if(cardData.cardNumber){
                    cardData.cardNum = cardData.cardNumber.substr(cardData.cardNumber.length-4,cardData.cardNumber.length-1)
                }
                for(let j in cardImg){
                    if(cardImg[j].name==cardData.bankName){
                        cardData.url = cardImg[j].url;
                        cardData.style = cardImg[j].style;
                    }
                }
                if(cardData.url == undefined){
                    cardData.url = "/img/logo/default.png";
                }
                if(cardData.style == undefined){
                    cardData.style = 'card_info2';
                }
                that.setData({
                    bankCardId: cardData.id,
                    bankName: cardData.bankName,
                    cardNumber: cardData.cardNumber,
                    cardNum: cardData.cardNum,
                    tel: cardData.tel,
                    originCardNumber: cardData.cardNumber,
                    style:cardData.style,
                    url:cardData.url,
                    name: cardData.name,
                    idCard: cardData.idCard,
                    idcard: cardData.idCard,
                })
            } else {
              that.setData({isHasCard:false})
            }
        }
    })


    // wx.request({
    //   url: baseUrl + '/mini/findDebit',
    //   header: {
    //     'Authorization': app.globalData.token
    //   },
    //   data: {
    //     phoneNumber: app.globalData.userInfo.tel
    //   },
    //   success(res) {
    //     if (res.data.isSuccess) {
    //         let cardData = res.data.data;
    //         let cardImg = app.globalData.banklogo;
    //         cardData.cardNum = cardData.cardNumber.substr(cardData.cardNumber.length-4,cardData.cardNumber.length-1)
    //         for(let j in cardImg){
    //             if(cardImg[j].name==cardData.bankName){
    //                 cardData.url = cardImg[j].url;
    //                 cardData.style = cardImg[j].style;
    //             }
    //         }
    //         if(cardData.url == undefined){
    //             cardData.url = "/img/logo/default.png";
    //         }
    //         if(cardData.style == undefined){
    //             cardData.style = 'card_info2';
    //         }

    //         that.setData({
    //           bankCardId: cardData.id,
    //           bankName: cardData.bankName,
    //           cardNumber: cardData.cardNum,
    //           tel: cardData.tel,
    //           originCardNumber: cardData.cardNumber,
    //           style:cardData.style,
    //           url:cardData.url
    //         })

    //     } else {
    //       if(res.data.message == "尚未绑定借记卡"){
    //           that.setData({isHasCard:false})
    //       }else{
    //           wx.showToast({
    //             title: res.data.message,
    //             icon: 'none'
    //           })
    //       }
          
    //     }
    //   }

    // })
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
  updateDebit: function () {
    wx.showLoading({
      title: '修改中请稍候',
      mask: true,
    })
    var that = this;

    Tools.fetch({
        url: '/settleBankCard/'+that.data.bankCardId,
        method: 'PUT',
        data: {
          name: that.data.name,
          idCard: that.data.idcard,
          tel: that.data.tel,
          cardNumber: that.data.cardNumber
        },
        callback(res) {
            wx.hideLoading();
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
    //   url: baseUrl + '/mini/updateDebit',
    //   method: 'POST',
    //   header: {
    //     'Authorization': app.globalData.token
    //   },
    //   data: {
    //     id: that.data.bankCardId,
    //     tel: that.data.tel,
    //     cardNumber: that.data.cardNumber
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

  addCredit:function () {
      wx.redirectTo({
        url: '../debit_add/debit_add',
      })
  }
})