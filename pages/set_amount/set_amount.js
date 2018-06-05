
//服务商缴费页面

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
    amount: 60000,
    index: 0,
    pickerindex: '0',
    array: [],
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
    checked2:false,
    checked1:true,
    id:""

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.id){
          this.setData({
            id:options.id,
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
      // console.log(e.detail.value)
      this.setData({
        pointsType: this.data.objectArray[e.detail.value].id,
        pickerindex: e.detail.value
      })
      // console.log('pointsType:' + this.data.pointsType)
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

    self.setData({
        cardId: e.currentTarget.id,
    })

    self.submitPay();

  },


  changeRadios:function(e){
    if(e.currentTarget.id == "1"){
        this.setData({
          amount:60000,
          checked1:true,
          checked2:false
        })
    }else if(e.currentTarget.id == "2"){
        this.setData({
          amount:200000,
          checked1:false,
          checked2:true
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
      let userInfo = wx.getStorageSync("userInfo");
      return {
        title: '千星钱包',
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
      
      that.setData({flag:true});
     

      wx.showModal({
        title: '温馨提示',
        content: '是否确定付款？',
        success: function(res) {
          if (res.confirm) {
              that.goPay();
          } else if (res.cancel) {
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

      let url = '/businessDebitNote/agreementPay';
      if(this.data.id != ""){
          url = '/userApply/'+this.data.id+'/businessDebitNote/agreementPay';
      }
      // console.log(url);
      // console.log(this.data);
      // return
      Tools.fetch({
          url: url,
          method: 'POST',
          data: {
            "creditBankCardId": this.data.cardId,
            "debitNoteEnum": "MINI_APP_AGENT_PAY",
            "totalFee": this.data.amount
          },
          callback(res) {
            wx.hideLoading();
            if(res.data.code == '100029'){
                let agentOrderNo = res.data.data.debitNoteOrderNo;
                Tools.fetch({
                    url: '/businessDebitNote/'+res.data.data.debitNoteOrderNo+'/agreementPay/sms',
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
                wx.showModal({
                  content: "缴纳成功",
                  showCancel: false
                });
                return
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
  modalinput:function(){  
    
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

    Tools.fetch({
        url: '/businessDebitNote/'+this.data.agentOrderNo+'/agreementPay/sms/'+this.data.Value,
        method: 'POST',
        callback(res) {
            wx.hideLoading();
            if (!res.data.isSuccess) {
                wx.showModal({
                  content: "缴纳失败",
                  showCancel: false
                });
            } else {
                wx.showModal({
                  content: "缴纳成功",
                  showCancel: false
                });
            }
        }

    })
  
  }  


})