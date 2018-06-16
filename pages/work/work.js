// 申请服务商页面

var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    email: '',
    tel:''
  },

  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  emailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },

  telInput: function (e) {
    this.setData({
      tel: e.detail.value
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

  submit: function (e) {
    var formId = e.detail.formId;
    if(formId!= "the formId is a mock one"){
        Tools.request({
            url: '/wx-mini-app/api/v1.0/user/click/'+formId,
            method: 'POST',
            data: {
              formId:formId
            },
            callback(res) {
              
            }
        })
    }
    Tools.fetch({
        url: '/userApply',
        method: 'POST',
        data: {
          "applyType": "MINI_APP_AGENT_USER_APPLY",
          "companyName": "",
          "email": this.data.email,
          "name": this.data.name,
          "tel": this.data.tel
        },
        callback(res) {
            // wx.showModal({
            //   content: "提交成功",
            //   showCancel: false
            // });
            let id = res.data.id;
            wx.navigateTo({
              url: '../set_amount/set_amount?id=' + id,
            })
        }
    })

  }
  })