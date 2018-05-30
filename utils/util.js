const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
   /**
   * 把json解析成字符串
   * author 张文
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
const  childStr= function (data) {
    let childArr = [];
    if(typeof(data) == 'object'){
      for (let key in data) {
        for (let i in childStr(data[key])) {
          childArr.push('[' + key + ']' + childStr(data[key])[i]);
        }
      }
    } else {
      childArr.push(('=' + encodeURIComponent(data)));
    }
    return childArr;
  }
  /**
   * 把json解析成字符串
   * author 张文
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
const buildStr = function (data){
    let str = '';
    for (let key in data) {
      for (let i in childStr(data[key])) {
        str += (key + childStr(data[key])[i] + '&');
      }
    }
    return str.substr(0, str.length-1);
  }

const api = function({url,method='GET',data='',isLogin=false,callback,errCallback = undefined}){

    let headers = {} ;
    if(!isLogin){
        headers = {
          'Authorization': getApp().globalData.token
        }
    }else{
        headers = {
          'content-type': 'application/x-www-form-urlencoded'
        }
    }

    wx.request({
      url: getApp().globalData.server + url,
      method: method,
      header: headers,
      data: data,
      success(res) {
        callback(res)
      },
      error(err){
        errCallback(err)
      }
    })
}


const request = function({url,method='GET',data='',isLogin=false,callback,errCallback = undefined}){

    let headers = {} ;
    if(!isLogin){
        headers = {
          'Authorization': "Bearer "+getApp().globalData.tokens
        }
    }

    if(method=='GET'){
        data = buildStr(data);
        if(data!=''){
            data = '?'+data;
        }
        url = url+data;
    }
    wx.request({
      url: getApp().globalData.newserver + url,
      method: method,
      header: headers,
      data: data,
      success(res) {
        callback(res)
      },
      error(err){
        errCallback(err)
      }
    })
}

module.exports = {
  formatTime: formatTime,
  api:api,
  request:request
}
