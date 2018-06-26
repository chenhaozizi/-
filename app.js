//app.js

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.hideTabBar({
      
    })
  },
  globalData: {
    userInfo:null,
    userInfoNew:[],//用户信息
    parameter:[],//定制酒参数
    pack:[],//包装定制信息
    addr_default:{},//默认地址
    style_img: ""//定制风格
  }
})