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
    headUrl:'',
    nickname:'',
    userInfo: '',
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
  }
  scan=function(){
    wx.scanCode({
      success: (res) => {
        console.log(res)
        this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
        self.setData({
          show: this.show
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })

  }
    })
  }
}
Page(new PageController());
