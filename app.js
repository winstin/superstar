var Tools = require('./utils/util.js');


//app.js

App({
  onLaunch: function (info) {
    // console.log(info);
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId 
        var code = res.code; //返回code
        // console.log(code);
        // var appId = 'wx8c6f42443cd0a870';
        // var secret = '30fa8f082badce3f5f532a1b321f7351';
        // wx.request({
        //   url: getApp().globalData.server + '/mini/wxLogin',
        //   data: {
        //     code: code
        //   },
        //   success: function (data) {
        //     console.log(data)
        //   }
        // })
        // https://api.xjpay.cc/wx-mini-app/api/v1.0/wechat/user/login?agentAppId=xxxxx&code=xxxxx
        Tools.request({
            url: '/wx-mini-app/api/v1.0/wechat/user/login',
            method: 'GET',
            data: {
              agentAppId: getApp().globalData.appId,
              code: code
            },
            isLogin:true,
            callback:(res)=> {
              // console.log(res);
              if(res.data){
                  wx.setStorageSync("openid", res.data.openid);
                  wx.setStorageSync("sessionKey", res.data.sessionKey)
              }
            }
        })
        // wx.request({
        //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
        //   data: {},
        //   header: {
        //     'content-type': 'json'
        //   },
        //   success: function (res) {
        //     console.log(res);
        //     var openid = res.data.openid; //返回openid
        //     wx.setStorageSync("openid", res.data.openid);
        //     wx.setStorageSync("session_key", res.data.session_key)
        //     console.log('openid为' + openid);
            
        //   }
        // })
          
      }
    })
   
  },
  globalData: {
    version:'00003',//小程序版本号
    userInfo: null,//用户信息
    server: "https://www.51xjbuy.com",
    newserver:"https://api.xjpay.cc",
    token:'',
    appId:'11058973',
    tokens:'',
    banklogo:[
      {
        name:"招商银行",
        url:"/img/logo/zsyh.png",
        style:"card_info3"
      },
      {
        name:"浦发银行",
        url:"/img/logo/pfyh.png",
        style:"card_info2"
      },
      {
        name:"民生银行",
        url:"/img/logo/msyh.png",
        style:"card_info5"
      },
      {
        name:"交通银行",
        url:"/img/logo/jtyh.png",
        style:"card_info2"
      },

      {
        name:"平安银行",
        url:"/img/logo/payh.png",
        style:"card_info4"
      },

      {
        name:"邮储银行",
        url:"/img/logo/yzyh.png",
        style:"card_info7"
      },

      {
        name:"中信银行",
        url:"/img/logo/zxyh.png",
        style:"card_info3"
      },

      {
        name:"光大银行",
        url:"/img/logo/gdyh.png",
        style:"card_info3"
      },

      {
        name:"华夏银行",
        url:"/img/logo/hxyh.png",
        style:"card_info3"
      },

      {
        name:"上海银行",
        url:"/img/logo/shyh.png",
        style:"card_info6"
      },
      {
        name:"广发银行",
        url:"/img/logo/gfyh.png",
        style:"card_info3"
      },
      {
        name:"工商银行",
        url:"/img/logo/gsyh.png",
        style:"card_info3"
      },
      {
        name:"中国银行",
        url:"/img/logo/zgyh.png",
        style:"card_info3"
      },

      {
        name:"农业银行",
        url:"/img/logo/nyyh.png",
        style:"card_info1"
      },

      {
        name:"建设银行",
        url:"/img/logo/jsyh.png",
        style:'card_info2'
      },

      {
        name:"兴业银行",
        url:"/img/logo/xyyh.png",
        style:'card_info2'
      },

      {
        name:"北京银行",
        url:"/img/logo/bjyh.png",
        style:"card_info3"
      },
    ]
  },
  getNowFormatDate:function() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
  }
})