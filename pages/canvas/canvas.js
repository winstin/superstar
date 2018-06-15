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
    agentOrderNo:'',
    fee0:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      amount: options.amount,
      agentOrderNo: options.agentOrderNo,
      fee0:options.fee0
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
        title: getApp().globalData.title,
        path: 'pages/main/main?userId='+userInfo.id
      }
  },
  complete:function() {
    wx.switchTab({
      url: '../main/main'
    })
  },
  touchStart: function (e) {
      //得到触摸点的坐标
      this.startX = e.changedTouches[0].x
      this.startY = e.changedTouches[0].y
      this.context = wx.createContext()

      if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
         this.context.setStrokeStyle('#F8F8F8') //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果
         this.context.setLineCap('round') //设置线条端点的样式
         this.context.setLineJoin('round') //设置两线相交处的样式
         this.context.setLineWidth(20) //设置线条宽度
         this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
         this.context.beginPath() //开始一个路径
         this.context.arc(this.startX,this.startY,5,0,2*Math.PI,true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形
         this.context.fill();  //对当前路径进行填充
         this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
      }else{
         this.context.setStrokeStyle(this.data.color)
         this.context.setLineWidth(this.data.pen)
         this.context.setLineCap('round') // 让线条圆润
         this.context.beginPath()

      }
  },
  //手指触摸后移动
  touchMove: function (e) {

      var startX1 = e.changedTouches[0].x
      var startY1 = e.changedTouches[0].y

      if(this.isClear){ //判断是否启用的橡皮擦功能  ture表示清除  false表示画画

        this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
        this.context.moveTo(this.startX,this.startY);  //把路径移动到画布中的指定点，但不创建线条
        this.context.lineTo(startX1,startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
        this.context.stroke();  //对当前路径进行描边
        this.context.restore()  //恢复之前保存过的坐标轴的缩放、旋转、平移信息

        this.startX = startX1;
        this.startY = startY1;

      }else{
        this.context.moveTo(this.startX, this.startY)
        this.context.lineTo(startX1, startY1)
        this.context.stroke()

        this.startX = startX1;
        this.startY = startY1;

      }
      //只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
      wx.drawCanvas({
         canvasId: 'myCanvas',
         reserve: true,
         actions: this.context.getActions() // 获取绘图动作数组
      })
  }
})