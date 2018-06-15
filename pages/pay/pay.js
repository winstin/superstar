// pages/pay/pay.js
var baseUrl = getApp().globalData.server;
var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardId: '',
    settleBankCardId: '',
    mchId:'',
    cardInfo: '',
    amount: '',
    index: 0,
    pickerindex: '0',
    array: ['新无卡','商旅类'],
    objectArray: [],
    pointsType:3,
    hiddenmodalput:true,
    items:[],
    handle:true,
    Length:6,        //输入框个数  
    isFocus:false,    //聚焦  
    Value:"",        //输入的内容  
    ispassword:false, //是否密文显示 true为密文， false为明文。 
    data:"",
    isNoCard:false,
    isNoCards:true,
    flag: true,
    agentOrderNo:'',
    smstel:'',
    fee0:'7',
    d0fee:200,
    
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;

    //获取借记卡数据
    Tools.fetch({
        url: '/creditBankCard',
        method: 'GET',
        isLogin:false,
        callback:(res)=> {
            if (res.data.isSuccess) {
              if(res.data.data.length>0){
                  wx.setStorageSync("name",res.data.data[0].name);
                  wx.setStorageSync("idCard",res.data.data[0].idCard);
                  var card = res.data.data[that.data.index];
                  let  last4 = card.cardNumber.substr(card.cardNumber.length-4,card.cardNumber.length-1);
                  var info = card.bankName + card.bankCardType + '(' + last4 + ')';
                  let cardImg = getApp().globalData.banklogo;
                  let cardData = res.data.data;
                  for(let i in cardData){
                      cardData[i].cardNumberLast4 = cardData[i].cardNumber.substr(cardData[i].cardNumber.length-4,cardData[i].cardNumber.length-1);
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
              }
            } else {
              that.setData({isNoCard:true})
            }
        }
    })

    this.choose();
    
  },


  choose:function(type = ''){
    let that = this;
    Tools.fetch({
        url: '/settleBankCard',
        method: 'GET',
        callback(res) {
            if (res.data.isSuccess && res.data.data.length>0) {
                if(res.data.data.length>0){
                    let cardData = res.data.data[0];
                    let mchId = "";
                    let merchants = cardData.merchants;
                    for(let i in merchants){
                        if(merchants[i].pointsType == that.data.pointsType){
                            mchId = merchants[i].mchId
                        }
                    }
                    that.setData({
                        settleBankCardId: cardData.id,
                        mchId:mchId,
                        pointsType: that.data.pointsType,
                    });
                    if(type == "0"){
                      that.goPay2();
                    }else if(type == "3"){
                      that.goPay();
                    }
                }
            } else {
              
            }
        }
    })
  },
  /**
   * 弹出层函数
   */
  //出现
  show: function () {

    this.setData({ flag: false })

  },
  //消失

  hide: function () {

    this.setData({ flag: true })

  },

  bindPickerChange: function (e) {
      if(e.detail.value == "0"){
          this.setData({
            pointsType: 3,
            pickerindex:e.detail.value
          })
      }else if(e.detail.value == "1"){
          this.setData({
            pointsType: 0,
            pickerindex:e.detail.value
          })
      }
      this.choose();
  },

  changeRadio:function(e){
    let self = this;
    let info = "";
    let cardData = this.data.items;
    let cardNumber = "";
    for(let i in cardData){
        if(cardData[i].id == e.currentTarget.id){
          cardData[i].checked = true;
          info = cardData[i].tel;
          cardNumber = cardData[i].cardNumber;
        }else{
          cardData[i].checked = false;
        }
    }

    let openId = wx.getStorageSync("openid");
    if(openId == undefined || openId == ""){
      openId = wx.getStorageSync("userInfo").openId
    }

    // info = "正在和您签约协议支付"
    // self.setData({
    //     cardId: e.currentTarget.id,
    //     flag:true,
    //     smstel:info,
    //     fee0:7,
    //     d0fee:200
    // })
    // self.submitPay();
    // if(this.data.pointsType == 0){
    //     info = "请输入短信验证码"
    //     self.setData({
    //         cardId: e.currentTarget.id,
    //         flag:true,
    //         smstel:info,
    //     })
    //     self.submitPay();
    // }else{
        Tools.request({
            url: '/wxuser/rates/'+openId+'/'+cardNumber,
            method: 'GET',
            callback(res) {
              if(res.data.isSuccess){
                  info = "正在和您签约协议支付"
                  self.setData({
                      cardId: e.currentTarget.id,
                      flag:true,
                      smstel:info,
                      fee0:res.data.data.fee0,
                      d0fee:res.data.data.d0fee
                  })
                  self.submitPay();
              }else{
                  wx.showToast({
                    title: '费率获取失败！',
                    icon:'none'
                  })
                  return
              }
            }
        })
    // }

   
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
      that.setData({flag:true});
      if(this.data.settleBankCardId == "" || this.data.settleBankCardId == undefined){
          that.setData({isNoCards:false})
          return;
      }


      wx.showModal({
        title: '温馨提示',
        content: '请选择交易通道',
        confirmText:'商旅类',
        cancelText:'新无卡',
        success: function(res) {
          if (res.confirm) {
              that.setData({
                pointsType: 0,
              })
              that.choose('0');
              // that.goPay2();
          } else if (res.cancel) {
              that.setData({
                pointsType: 3,
              })
              that.choose('3');
              // that.goPay();
              console.log('用户点击取消')
          }
        }
      })
      
  },


  goPay:function(){
      const that = this;
      wx.showLoading({
        title: '正在支付，请稍候',
        mask:true
      })
      Tools.fetch({
          url: '/order',
          method: 'POST',
          data: {
            "creditBankCardId": this.data.cardId,
            "d0fee": this.data.d0fee,
            "fee0": this.data.fee0,
            "mchId": this.data.mchId,
            "settleBankCardId": this.data.settleBankCardId,
            "totalFee": this.data.amount*100
          },
          callback(res) {
            wx.hideLoading();
            if (res.data.isSuccess) {
                if(res.data.code == '100029'){
                    let agentOrderNo = res.data.data.agentOrderNo;
                    Tools.fetch({
                        url: '/order/'+res.data.data.agentOrderNo+'/agreementSms',
                        method: 'POST',
                        data: {},
                        callback(res) {
                            that.setData({
                              handle:false,
                              agentOrderNo:agentOrderNo
                            })
                        }
                    })
                }else{
                    let agentOrderNo = res.data.data.agentOrderNo;
                    wx.navigateTo({
                      url: '../pay_complete/pay_complete?success=waiting&amount=' + that.data.amount+'&agentOrderNo=' + agentOrderNo+'&fee0=' + that.data.fee0,
                    })
                }
            }else{
                if(res.data.code == '100029'){
                    let agentOrderNo = res.data.data.agentOrderNo;
                    Tools.fetch({
                        url: '/order/'+res.data.data.agentOrderNo+'/agreementSms',
                        method: 'POST',
                        data: {},
                        callback(res) {
                            that.setData({
                              handle:false,
                              agentOrderNo:agentOrderNo
                            })
                        }
                    })
                }else{
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none',
                    })
                    return
                }
            }
          }
      })
  },


  goPay2:function(){
      const that = this;
      // let newData =  {
      //       "creditBankCardId": this.data.cardId,
      //       "d0fee": this.data.d0fee,
      //       "fee0": this.data.fee0,
      //       "mchId": this.data.mchId,
      //       "settleBankCardId": this.data.settleBankCardId,
      //       "totalFee": this.data.amount*100
      //     };
      // console.log(newData);
      wx.showLoading({
        title: '正在支付，请稍候',
        mask:true
      })
      Tools.fetch({
          url: '/order',
          method: 'POST',
          data: {
            "creditBankCardId": this.data.cardId,
            "d0fee": 100,
            "fee0": 4.5,
            "mchId": this.data.mchId,
            "settleBankCardId": this.data.settleBankCardId,
            "totalFee": this.data.amount*100
          },
          callback(res) {
            wx.hideLoading();
            if (res.data.isSuccess) {
                  let agentOrderNo = res.data.data.agentOrderNo;
                  that.setData({
                    handle:false,
                    agentOrderNo:agentOrderNo,
                    smstel:'请输入短信验证码',
                    fee0:4.5
                  })
            }else{

                wx.showModal({
                  title: '温馨提示',
                  content: res.data.message,
                  showCancel: false,
                  success: function(res) {
                    
                  }
                })
                // let agentOrderNo = res.data.data.agentOrderNo;
                // that.setData({
                //   handle:false,
                //   agentOrderNo:agentOrderNo,
                //   smstel:'请输入短信验证码'
                // })
            }
          }
      })
  },

  addDebit:function(){
      wx.navigateTo({
        url: '../debit_add/debit_add',
      })
      this.setData({  
         isNoCards: true 
      })  
  },
  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinput:function(e){  
    var formId = e.detail.formId;

    wx.showModal({
      title: formId,
      icon:'none'
    })
    if (this.data.amount == '') {
      wx.showToast({
        title: '请输入金额',
        icon:'none'
      })
      return
    }
    if(this.data.isNoCard){
      this.setData({  
         isNoCards: false 
      })  
    }else{
      this.setData({  
         // hiddenmodalput: !this.data.hiddenmodalput;
         flag:false  
      })  
    }
   
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
          isNoCards:true,
          handle:true,
          isNoCards:true,
          flag:true
      })  
  },

  addCards:function(){
      this.setData({  
          isNoCards:true
      });
      wx.redirectTo({
        url: '../debit_add/debit_add',
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
    // console.log(e.detail.value);  
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
    if (this.data.Value == '') {
      wx.showToast({
        title: '请输入短信验证码',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
      return;
    } 
    this.setData({  
        handle: true,
    });
    this.submitCode(); 
  },


  submitCode: function () {
    var baseUrl = getApp().globalData.server;
    const that = this
    
    wx.showLoading({
      title: '正在支付，请稍候',
      mask:true
    })
    if(that.data.pointsType == 3){
      Tools.fetch({
          url: '/order/'+this.data.agentOrderNo+'/agreementSms/'+this.data.Value,
          method: 'POST',
          callback(res) {
              setTimeout(function () {
                wx.hideLoading()
              }, 500)
              if (res.data.isSuccess) {
                  wx.navigateTo({
                    url: '../pay_complete/pay_complete?success=true&amount=' + that.data.amount+'&fee0=' + that.data.fee0,
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
                    url: '../pay_complete/pay_complete?success=false&amount=' + that.data.amount+'&fee0=' + that.data.fee0,
                  })
              }
          }

      })
    }else if (that.data.pointsType == 0){
      Tools.fetch({
          url: '/order/'+this.data.agentOrderNo+'/sms/'+this.data.Value,
          method: 'POST',
          callback(res) {
              setTimeout(function () {
                wx.hideLoading()
              }, 500)
              if (res.data.isSuccess) {
                  wx.navigateTo({
                    url: '../pay_complete/pay_complete?success=true&amount=' + that.data.amount+'&fee0=' + that.data.fee0,
                  })
              } else {
                  if (res.data.code == 77) {
                    wx.showModal({
                      content: '此卡尚未开通快捷支付，是否前往开通',
                      success: function (re) {
                        if (re.confirm) {
                          wx.navigateTo({
                            url: '../openquick/openquick?bankCardId=' + that.data.cardId + '&pointsType=' + that.data.ponitsType+'&fee0=' + that.data.fee0,
                          })
                        } else if (re.cancel) {
                          return
                        }
                      }
                    })
                    return
                  }
                  wx.navigateTo({
                    url: '../pay_complete/pay_complete?success=false&amount=' + that.data.amount+'&fee0=' + that.data.fee0,
                  })
              }
          }

      })
    }
    
  }  


})