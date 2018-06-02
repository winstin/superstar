// pages/log/log.js
var app = getApp();
var baseUrl = app.globalData.server;
var Tools = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    date1: getApp().getNowFormatDate(),
    date2: getApp().getNowFormatDate(),
    array: ['全部', '支付中', '支付失败', '已支付', '结算中', '结算成功'],
    arrayFalg: ['','A', 'B', 'C', 'D', 'E'],
    index: 5,
    dateFalg:true,
    allMoney:0
  },


  //下拉刷新 
  // onPullDownRefresh:function() { 
  //   wx.showNavigationBarLoading() 
  //   //在标题栏中显示加载 
  //   //模拟加载 
  //   setTimeout(function(){ 
  //     complete wx.hideNavigationBarLoading() 
  //     //完成停止加载 
  //     wx.stopPullDownRefresh() 
  //     //停止下拉刷新 
  //   },1500); 
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.serachData();
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
    // const that = this
    // setTimeout(function () {
    //   if (that.data.items.length == 0) {
    //     wx.showToast({
    //       title: '暂无交易记录',
    //       icon: 'none',
    //       duration: 3000
    //     })
    //     setTimeout(function () {
    //       wx.switchTab({
    //         url: '../my/my',
    //       })
    //     }, 2000)

    //   }
    // }, 2000)
  },
  bindDateChange1: function(e) {
    this.setData({
      date1: e.detail.value,
      dateFalg:true
    })
  },

  bindDateChange2: function(e) {
    this.setData({
      date2: e.detail.value,
      dateFalg:true
    })
  },

  bindCancel1: function(e) {
    console.log(e.detail.value)
    this.setData({
      date1: getApp().getNowFormatDate(),
      dateFalg:false
    })
  },

  bindCancel2: function(e) {
    this.setData({
      date2: getApp().getNowFormatDate(),
      dateFalg:false
    })
  },


  bindPickerChange: function(e) {

    this.setData({
      index: e.detail.value
    })

    this.serachData();
  },

  checkState:function(e){
      let state = "";
      switch(e){
        case "A":
          state = 1;
          break;
        case "B":
          state = 2;
          break;
        case "C":
          state = 3;
          break;
        case "D":
          state = 4;
          break;
        case "E":
          state = 5;
          break;
      }

      if(this.data.index == 0 || state == this.data.index){
        return true
      }else{
        return false
      }
  },

  checkDate:function(e,date1){
      let newDate = e.split(" ")[0];
      let sArr = date1.split("-");
      let eArr = newDate.split("-");
      let sRDate = new Date(sArr[0], sArr[1], sArr[2]);
      let eRDate = new Date(eArr[0], eArr[1], eArr[2]);
      let days = (sRDate-eRDate)/(24*60*60*1000);
      return days;
  },
  newDate:function (UnixTime) { 
      if(UnixTime== undefined){
          return;
      }
      var a = UnixTime.replace("/Date(", "").replace(")/", "");  
      var date = new Date(parseInt(a));  
      var y = date.getFullYear();  
      var m = date.getMonth() + 1;  
      m = m < 10 ? ('0' + m) : m;  
      var d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      var h = date.getHours();  
      h = h < 10 ? ('0' + h) : h;  
      var minute = date.getMinutes();  
      var second = date.getSeconds();  
      minute = minute < 10 ? ('0' + minute) : minute;  
      second = second < 10 ? ('0' + second) : second;  
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;  
  },
  serachData:function(){
      let self = this;
      wx.showLoading({
        title:'加载中...'
      })

      Tools.fetch({
          url: '/order',
          method: 'GET',
          data:{
            orderStatus:this.data.arrayFalg[this.data.index],
            startDate:this.data.date1,
            endDate:this.data.date2,
          },
          callback(res) {
              wx.hideLoading();

              let itemData = res.data.data.data;
              for(let i in itemData){
                  itemData[i].createTime = self.newDate((itemData[i].createTime+''))
              }

              
              self.setData({
                allMoney:res.data.data.totalMoney,
                items:itemData
              })
          }

      })



      // Tools.fetch({
      //     url: '/order',
      //     method: 'GET',
      //     data:{
      //       orderStatus:"B"
      //     },
      //     callback(res) {
      //         // console.log(res);
      //         if (res.data.isSuccess){
      //           let allMoney = 0;
      //           let itemData = res.data.data.data;

      //           for(let i in itemData){
      //               itemData[i].createTime = self.newDate((itemData[i].createTime+''))
      //           }

      //           let newData = [];
      //           if(self.data.dateFalg){
      //             for(let i in itemData){
      //                 if(self.checkDate(itemData[i].createTime,self.data.date1)<=0 && self.checkDate(itemData[i].createTime,self.data.date2)>=0 && self.checkState(itemData[i].orderState)){
      //                     newData.push(itemData[i]);
      //                     allMoney=allMoney+itemData[i].totalFee;
      //                 }
      //             }
      //           }else{
      //             for(let i in itemData){
      //                 if(self.checkState(itemData[i].orderState)){
      //                     allMoney=allMoney+itemData[i].totalFee;
      //                     newData.push(itemData[i]);
      //                 }
      //             }
      //           }
      //           wx.hideLoading();
      //           allMoney = (allMoney/100).toFixed(2);
      //           self.setData({
      //             items:newData,
      //             allMoney:allMoney
      //           })
      //         }else{
      //           wx.hideLoading();
      //         }
      //     }

      // })
      
  },


  // onPullDownRefresh: function(){
  //     console.log("下拉刷新")
  //     // wx.startPullDownRefresh({
  //     //   success:function(e){
  //     //     console.log(e)
  //     //   }
  //     // })
  //     // setTimeout(function(){wx.stopPullDownRefresh()},1000)
      
  // },


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
      this.serachData();
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

  },
  orderDetail: function (e) {
    var param = e.currentTarget.id
    wx.navigateTo({
      url: '../bill/bill?orderNo=' + param,
    })
  }

})