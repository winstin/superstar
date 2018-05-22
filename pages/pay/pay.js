// pages/pay/pay.js
var baseUrl = getApp().globalData.server

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId: '',
    cardInfo: '',
    amount: '',
    index: 0,
    pickerindex: '0',
    array: [],
    objectArray: [],
    pointsType:'',
    hiddenmodalput:true,
    items:[],
    handle:true,
    Length:6,        //输入框个数  
    isFocus:false,    //聚焦  
    Value:"",        //输入的内容  
    ispassword:false, //是否密文显示 true为密文， false为明文。 
    data:"",
  },

  amountInput: function (e) {

    this.setData({
      amount: e.detail.value
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
    const that = this
    wx.request({
      url: baseUrl + '/mini/getChantAgentRate',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: { appId: getApp().globalData.appId },
      success(res) {
        console.log(res);
        if (res.data.isSuccess) {
          var a = [];
          var oa = [];
          var pt = res.data.data[0].pointsType
          for (var i = 0; i < res.data.data.length; i++) {
            var o = { 'id': res.data.data[i].pointsType, name: res.data.data[i].name }
            a[i] = res.data.data[i].name
            oa[i] = o
          }
          that.setData({
            array: a,
            objectArray: oa,
            pointsType: pt
          })
          console.log(that.data.pointsType)
        }
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    wx.request({
      url: baseUrl + '/mini/findCredit',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        phoneNumber: getApp().globalData.userInfo.tel
      },
      success(res) {
        console.log(res);
        if (res.data.isSuccess) {
          var card = res.data.data[that.data.index]
          var info = card.bankName + card.bankCardType + '(' + card.cardNumberLast4 + ')';

          let cardImg = getApp().globalData.banklogo;
          let cardData = res.data.data;
          for(let i in cardData){
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
          cardData[that.data.index].checked = true;
          that.setData({
            cardId: card.id,
            cardInfo: info,
            items:cardData
          })
        } else {
          wx.redirectTo({
            url: '../credit_add/credit_add',
          })
        }
      }
    })
  },

  bindPickerChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      pointsType: this.data.objectArray[e.detail.value].id,
      pickerindex: e.detail.value
    })
    console.log('pointsType:' + this.data.pointsType)
  },

  changeRadio:function(e){
    var info = "";
    let cardData = this.data.items;
    for(let i in cardData){
        if(cardData[i].id == e.currentTarget.id){
          cardData[i].checked = true;
          info = cardData[i].bankName + cardData[i].bankCardType + '(' + cardData[i].cardNumberLast4 + ')';
        }else{
          cardData[i].checked = false;
        }
    }
    this.setData({
        cardId: e.currentTarget.id,
        cardInfo: info,
        items:cardData
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

  selectCredit: function () {
    wx.navigateTo({
      url: '../pay_type/pay_type?amount=' + this.data.amount + '&index=' + this.data.index,
    })
  },



  submitPay: function () {
    const that = this
    if (this.data.amount == '') {
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
      return
    }
    wx.request({
      url: baseUrl + '/api/sms',
      method: 'POST',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        tel: getApp().globalData.userInfo.tel,
        appId: getApp().globalData.appId,
        bankCardId: this.data.cardId,
        money: this.data.amount * 100,
        pointsType:this.data.pointsType
      },
      success(res) {
        if (res.data.isSuccess) {
          that.setData({
              hiddenmodalput: true,
              handle: !that.data.handle,
              data:res.data.data,
              isFocus:true
          })
          // wx.navigateTo({
          //   url: '../pay_next/pay_next?bankCardId=' + that.data.cardId + '&amount=' + that.data.amount + '&orderNo=' + res.data.data + '&pointsType=' + that.data.ponitsType,
          // })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
          })
          return
        }
      }
    })

  },
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput:function(){  
    if (this.data.amount == '') {
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
      return
    }
    this.setData({  
       hiddenmodalput: !this.data.hiddenmodalput  
    })  
  },  
  //确认  
  confirm: function(){  
      this.setData({  
          hiddenmodalput: true,
          handle: !this.data.handle,
          isFocus:true
      })  
  },

  cancel:function(){
      this.setData({  
          hiddenmodalput: true,
      })  
  },

  handle:function(){
      this.setData({  
          handle: true,
      })  
  },
  
  addCard:function() {
    wx.navigateTo({
      url: '../credit_add/credit_add',
    })
  },
  Focus(e){  
    var that = this;  
    console.log(e.detail.value);  
    var inputValue = e.detail.value;  
    that.setData({  
      Value:inputValue,  
    })  
  },  
  Tap(){  
    var that = this;  
    that.setData({  
      isFocus:true,  
    })  
  },  
  formSubmit(){  
    console.log(this.data.Value);
    this.setData({  
        handle: true,
    });
    this.submitCode(); 
  },


  submitCode: function () {
    var baseUrl = getApp().globalData.server;
    const that = this
    if (this.data.Value == '') {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
    wx.showLoading({
      title: '正在支付，请稍候',
      mask:true
    })
    wx.request({
      url: baseUrl + '/api/pay',
      method: 'POST',
      header: {
        'Authorization': getApp().globalData.token
      },
      data: {
        appId: getApp().globalData.appId,
        outTradeNo: this.data.data,
        smsCode: this.data.Value
      },
      success(res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        if (res.data.isSuccess) {
          
          wx.navigateTo({
            url: '../pay_complete/pay_complete?success=true&amount=' + that.data.amount,
          })
        } else {
          if (res.data.code == 77) {
            wx.showModal({
              content: '此卡尚未开通快捷支付，是否前往开通',
              success: function (re) {
                if (re.confirm) {
                  wx.navigateTo({
                    url: '../openquick/openquick?bankCardId=' + that.data.cardId + '&pointsType=' + that.data.ponitsType,
                  })
                } else if (re.cancel) {
                  return
                }
              }
            })
            return
          }
          wx.navigateTo({
            url: '../pay_complete/pay_complete?success=false&amount=' + that.data.amount,
          })
        }
      }
    })
  }  


})