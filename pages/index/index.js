//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    video_src: "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400",//引导视频地址
    video_hidden: true,//隐藏视频引导页
    _num: "1",
    xs: "-100%",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    code: ''
  },
  //事件处理函数
  bindViewTap: function () {
    // wx.navigateTo({
    //   url: '../logs/logs'
    // })
  },
  bindButtonTap: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },
  onLoad: function () {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //必须先调用wx.login，再调用wx.getUserInfo，否则无法解密encryptedData
          wx.login({
            success: function (res) {
              console.log('获取到的code：' + res.code);
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              that.setData({
                code: res.code
              })
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  //console.log("授权后，取数据成功：" + JSON.stringify(res));
                  console.log("授权后，取数据成功iv：" + res.iv);
                  wx.setStorageSync('nickname', res.userInfo.nickName);
                  wx.setStorageSync('sex', res.userInfo.gender);
                  wx.setStorageSync('city', res.userInfo.city);
                  wx.setStorageSync('province', res.userInfo.province);
                  wx.setStorageSync('face', res.userInfo.avatarUrl);
                  wx.setStorageSync('iv', res.iv);
                  wx.setStorageSync('encryptedData', res.encryptedData);
                  console.log('缓存用户授权信息成功');
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res);
                  }
                  console.log('开始进行登录 code = ' + that.data.code);
                  that.login(that.data.code);
                }
              })
            }
          });
        } else {
          //未授权
          setTimeout(function () {
            console.log('未授权，播放引导动画');
            that.setData({
              video_hidden: false,//隐藏视频引导
            });
            that.videoContext.play();
            that.videoContext.hideStatusBar();
            //跳转到授权页面
            // that.move();
          }, 10)
        }
      }
    });
  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo');
   
  },
  // 引导视频结束
  video_end: function () {
    this.setData({
      video_hidden: true,//隐藏视频引导
    });
    this.move();
  },
  close_video:function(){
    this.setData({
      video_hidden: true,//隐藏视频引导
    });
    this.videoContext.pause();
    this.move();
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    console.log(e.detail.userInfo)
  },
  viewTap: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      xs: "0px"
    })

  },
  menuClick: function (e) {
    var that = this;
    this.setData({
      _num: e.target.dataset.num
    })
    if (wx.getStorageSync("memberId")) {
    } else { that.move(); return }
    if (e.target.dataset.num == 1) {
      wx.navigateTo({
        url: "../parameter/parameter"
      })
    } else if (e.target.dataset.num == 2) {
      wx.navigateTo({
        url: "/packageTwoLeval/pages/case/case"
      })
    } else if (e.target.dataset.num == 3) {
      wx.navigateTo({
        url: "/packageTwoLeval/pages/usercenter/usercenter"
      })
    }
  },
  move: function () {
    wx.navigateTo({
      url: '../user_info/user_info',
    })
  },
  login: function (code) {
    var that = this;
    //再次请求用户数据
    wx.request({
      method: "POST",
      url: 'https://mjapi.pandahot.cn/EsMember/mjdzWxAutologin',
      data: {
        sex: wx.getStorageSync('sex'),
        city: wx.getStorageSync('city'),
        province: wx.getStorageSync('province'),
        nickname: wx.getStorageSync('nickname'),
        face: wx.getStorageSync('face'),
        code: code,
        iv: wx.getStorageSync('iv'),
        encryptedData: wx.getStorageSync('encryptedData')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.message == "ok") {
          wx.setStorageSync('memberId', res.data.data.memberId);
          wx.setStorageSync('wxUnionid', res.data.data.wxUnionid);
          wx.setStorageSync('wxOpenid', res.data.data.wxOpenid);
          console.log('登录成功 memberId = ' + wx.getStorageSync("memberId"));
          console.log('登录成功 wxUnionid = ' + wx.getStorageSync("wxUnionid"));
          console.log('登录成功 wxOpenid = ' + wx.getStorageSync("wxOpenid"));
        } else {
          setTimeout(function () {
            console.log('出错信息 = ' + res.data.message);
            that.move();
          }, 500)
        }
      },
    });
  }
})
