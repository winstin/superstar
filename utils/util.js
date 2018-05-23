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

module.exports = {
  formatTime: formatTime,
  api:api
}
