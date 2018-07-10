import HttpUtil from '../../../lib/trilobite/core/httputil.js'
// import goPage from '../../../lib/page.js'
//获取应用实例
var app = getApp();
let self,comp;

/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;

  }

  data={
    userInfo: '',
    memberId :""
  }
  onShow=function(){
    this.getUserInfo();
  }
  // 获取用户信息
  getUserInfo=function (cb) {
    var that = this
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            that.setData({
              userInfo: res.userInfo
             
            });
          }
        })
      }
    })
  }
  onLoad=function(){
    self = this;
    self.setData({
      memberId: wx.getStorageSync("memberId")
    })
  }
}
Page(new PageController());
