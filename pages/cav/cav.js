Page({
  data: {
    x: 0,
    y: 0,
    hidden: true,

  },

  onLoad:function(){
    this.drawSharePic('/img/card.png','/img/card.png')
  },

  // calculateWH:function(2, 620, realWidth, realHeight){

  // },

  start: function(e) {
    const ctx = wx.createCanvasContext('mycanvas')

    
    ctx.drawImage('/img/logo.png', 0, 0, 150, 100)
    ctx.draw();

    this.setData({
      hidden: false,
      x: e.touches[0].x,
      y: e.touches[0].y
    })
  },
  move: function(e) {
    this.setData({
      x: e.touches[0].x,
      y: e.touches[0].y
    })
  },
  end: function(e) {
    this.setData({
      hidden: true
    })
  },
  save:function(){
    wx.canvasToTempFilePath({
    　　　　//通过id 指定是哪个canvas
          canvasId: 'myCanvas',
          success(res) {
    　　　　　//成功之后保存到本地
            wx.saveImageToPhotosAlbum({
    　　　　　　
              filePath: res.tempFilePath,
              success: function (res) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (res) {
                console.log(res)
              }
            }) 
          }
        })
  },
   /**
 * 绘制分享的图片
 * @param goodsPicPath 商品图片的本地链接
 * @param qrCodePath 二维码的本地链接
 */
drawSharePic: function (goodsPicPath, qrCodePath) {
   try {
      var res = wx.getSystemInfoSync();
      console.log(res);
    } catch (e) {
      // Do something when catch error
    }
    const ctx = wx.createCanvasContext('mycanvas');
    ctx.clearRect(0, 0, 0, 0);
    const arr2 = ['/img/cancavs-bg.png', '/img/about.jpg'];    // 有图片海报背景图&&海报正文图片
    const WIDTH=res.windowWidth;
    const HEIGHT=res.windowHeight;
    ctx.drawImage(arr2[0], 0, 0, WIDTH, HEIGHT);
    // ctx.drawImage(arr2[1], 40,40, 670, 580);


    var height = res.windowWidth;
    var width = res.windowHeight;
    // 设置文字对应的半径
    var R = width / 2 ;
    // 把原点的位置移动到屏幕中间，及宽的一半，高的一半
    ctx.translate(width / 2-200, height / 2-200);

    // // 画外框
    // function drawBackground() {
    //   // 设置线条的粗细，单位px
    //   ctx.setLineWidth(8);
    //   // 开始路径
    //   ctx.beginPath();
    //   // 运动一个圆的路径
    //   // arc(x,y,半径,起始位置，结束位置，false为顺时针运动)
    //   ctx.arc(0, 0, width / 2 - 30, 0, 2 * Math.PI, false);
    //   ctx.closePath();
    //   // 描出点的路径
    //   ctx.stroke();
    // };
    ctx.save()
    ctx.beginPath()


    ctx.arc(100, 100, 50, 0, 2*Math.PI)
    ctx.clip()
    ctx.drawImage("https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK3ibLib5nC2C4rLQqQMQ0GhFj9FiayXGLCFNZDibZBfYYicRNTDc3RZbC4jqU24v3lL5EqmReSN2ckxLA/132", 25, 25)
    ctx.restore()

    ctx.draw();
    // ctx.save();
    
    // ctx.restore();
    }
})