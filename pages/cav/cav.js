var a = -1;
var b = -1;
var c = -1;
var d = -1;
Page({
    changeBoxBtn: function (e) {
      // console.log(e.target.dataset.num)
      var num = e.target.dataset.num;
      var states=null;
      if (num == 0) {
        states=0;
        a += 1;
        b = -1;
        c = -1;
        d = -1;
        if(a%2 == 1){
          states = 6;
        }
      } else if(num == 1) {
        states = 1;
        a = -1;
        b += 1;
        c = -1;
        d = -1;
        if (b % 2 == 1) {
          states = 6;
        }
      } else if (num == 2) {
        states = 2;
        a = -1;
        b = -1;
        c += 1;
        d = -1;
        if (c % 2 == 1) {
          states = 6;
        }
      } else if (num == 3) {
        states = 3;
        a = -1;
        b = -1;
        c = -1;
        d += 1;
        if (d % 2 == 1) {
          states = 6;
        }
      }
      // console.log(states)
      
      this.setData({
        states: states
      })
    }
})

