import HttpUtil from '../../../lib/httputil.js'
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
    nickname:''
  }
  onShow=function(){
    
  }
  onLoad=function(){
    self = this;
    self.setData({
      headUrl: app.globalData.userInfo.face,
      nickname: app.globalData.userInfo.nickname
    })
    console.log(app.globalData.userInfo)
  }
}
Page(new PageController());
