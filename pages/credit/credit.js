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
    style:'card_info_blue'
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
    var that = this


    Tools.fetch({
        url: '/creditBankCard',
        method: 'GET',
        isLogin:false,
        callback:(res)=> {
            if (res.data.isSuccess) {
            let cardData = res.data.data;
            // cardData = cardData.concat(cardData);

            let cardImg = app.globalData.banklogo;
            for(let i in cardData){
                cardData[i].cardNum = cardData[i].cardNumber.substr(cardData[i].cardNumber.length-4,cardData[i].cardNumber.length-1)
                for(let j in cardImg){
                    if(cardImg[j].name==cardData[i].bankName){
                        cardData[i].url = cardImg[j].url;
                        cardData[i].style = cardImg[j].style;
                    }
                }
                if(cardData[i].url == undefined){
                    cardData[i].url = "/img/logo/default.png";
                }
                if(cardData[i].style == undefined){
                    cardData[i].style = 'card_info2';
                }
            }
            that.setData({
              items: cardData
            })
          }
          if (that.data.items == null) {
            
          } else {
            that.findCredit(0)
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
  onShareAppMessage: function () {
      let userInfo = wx.getStorageSync("userInfo");
      return {
        title: getApp().globalData.title,
        path: 'pages/main/main?userId='+userInfo.id
      }
  },

  findCredit: function (index) {
    if(this.data.items[index]){
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
  },
  addCredit: function () {
    
    wx.navigateTo({
      url: '../credit_add/credit_add',
    })
  },

  orderDetail: function(e){
      let id = e.currentTarget.id;
      // console.log(id)
      wx.navigateTo({
        url: '../credit_update/credit_update?id=' + id,
      })
  }

 
})