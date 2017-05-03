//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  },
  onHide:function(){
  },
  getUserInfo:function(cb){
   cb(this.globalData.testName);
  },
  globalData:{
    testName:123
  }
})