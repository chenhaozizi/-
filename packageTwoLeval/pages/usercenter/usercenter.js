import HttpUtil from '../../../lib/trilobite/core/rsHttps.js'
// import goPage from '../../../lib/page.js'
//获取应用实例
var app = getApp();
let self,comp;
class findInfoDao {
  constructor() {
    this.http = new HttpUtil(app);
    this.http.addResultListener(this.result);

  }
  result = (res) => {
    if (this.callback) {
      this.callback(res);
    }
  }
  /**
   * 加载接口
   */
  load = () => {
    this.http.post("/RsMember/FindMemberInfo", { memberId: wx.getStorageSync("memberId") })

  }
}
/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.findInfoDao = new findInfoDao();
    comp.findInfoDao.callback = this.findInfoDao_callback;
  }
  findInfoDao_callback = (res) =>{
    if(res.data.code == 200){
      // self.setData({
      //   memberType: res.data.data.memberTypeName
      // })
    }
  }
  data={
    headUrl:'',
    nickname:'',
    userInfo: '',
    memberType:""
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
            comp.findInfoDao.load()
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
