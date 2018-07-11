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
    this.http.post("/RsMember/FindMemberType", { memberId: wx.getStorageSync("memberId")})

  }
}
class addNewvipDao {
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
  load = (e) => {
    this.http.post("/RsMember/SetParent", { memberId: wx.getStorageSync("memberId"),...e})

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
    comp.addNewvipDao = new addNewvipDao();
    comp.addNewvipDao.callback = this.addNewvipDao_callback;
  }
  findInfoDao_callback = (res) =>{
    console.log(res)
    if(res.data.code == 200){
      self.setData({
        memberType: res.data.data.memberTypeName,
        memberTypeCode: res.data.data.memberTypeCode
      })
    }
  }
  addNewvipDao_callback = (res) =>{
    if (res.data.code == 200) {
      wx.showModal({
        title: '提示',
        content: res.data.data,
        showCancel: false
      })
    }
  }
  data={
    headUrl:'',
    nickname:'',
    userInfo: '',
    memberType:"",
    memberTypeCode:""
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
  //二维码扫描
  scan=function(){
    wx.showModal({
      title: '提示',
      content: '是否使用该功能扫码成为高级会员？',
      success: function (res) {
        if (res.confirm) {
          wx.scanCode({
            success: (res) => {
              let pardata = {
                parentId: JSON.parse(res.result).memberId,
                memberTypeCode: '0003'
              }
              comp.addNewvipDao.load(pardata);

            },
            fail: (res) => {
              wx.showToast({
                title: '失败',
                icon: 'success',
                duration: 2000
              })

            }
          })
        } else {
          console.log('用户点击取消')
        }

      }
    })

  }
  //成为经销商
  scan1 = function () {
    wx.showModal({
      title: '提示',
      content: '是否使用该功能扫码成为经销商？',
      success: function (res) {
        if (res.confirm) {
          wx.scanCode({
            success: (res) => {
              console.log(res.result)
              let pardatas = {
                parentId: JSON.parse(res.result).memberId,
                memberTypeCode: ''
              };
              console.log(JSON.parse(res.result).memberId)
              if (JSON.parse(res.result).memberTypeCode == '0000') {
                console.log("平台二维码")
                pardatas.memberTypeCode = '0001'
              }
              if (JSON.parse(res.result).memberTypeCode == '0001') {
                console.log("一级经销商")
                pardatas.memberTypeCode = '0002'
              }
              comp.addNewvipDao.load(pardatas);

            },
            fail: (res) => {
              wx.showToast({
                title: '失败',
                icon: 'success',
                duration: 2000
              })

            }
          })
        } else {
          console.log('用户点击取消')
        }

      }
    })
    
  }
}
Page(new PageController());
