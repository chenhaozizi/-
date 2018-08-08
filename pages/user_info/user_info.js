// pages/getuserInfo/user_info.js
let self;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video_src: "", //引导视频地址
    video_hidden: true, //隐藏视频引导页

  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    that.videoContext = wx.createVideoContext('myVideo');
    if (app.globalData.userInfo) {
      console.log(app.globalData.userInfo);
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      });
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };

  },
  onLoad: function () {
    self = this;
    wx.request({
      method: "POST",
      url: 'https://mingjiu-api.conpanda.cn/front_v1/Video/FindHome',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res)
       if(res.data.code == 200){
         self.setData({
           video_src: res.data.data.videoUrl
         })
        }
      }
    })
  },
  // 引导视频结束
  video_end: function() {
    this.setData({
      video_hidden: true, //隐藏视频引导
    });
    wx.redirectTo({
      url: '../index/index',
    })
  },
  close_video: function() {
    this.setData({
      video_hidden: true, //隐藏视频引导
    });
    this.videoContext.pause();
  },




  getUserInfo: function(e) {
    var that = this;
    // 新用户授权后进行注册，并获取memberId
    wx.login({
      success: function(res) {
        console.log('获取到的code：' + res.code);
        if (res.code) {
          //授权后取一次微信用户信息
          that.getWxSysUserInfo(res.code);
        }
      }
    });

  },
  getWxSysUserInfo: function(code) {
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
        // var xx = res.userInfo;
        //console.log("授权后，取数据成功：" +JSON.stringify(res));
        console.log("授权后，取数据成功");
       
        wx.setStorageSync('nickname', res.userInfo.nickName);
        wx.setStorageSync('sex', res.userInfo.gender);
        wx.setStorageSync('city', res.userInfo.city);
        wx.setStorageSync('province', res.userInfo.province);
        wx.setStorageSync('face', res.userInfo.avatarUrl);
        wx.setStorageSync('iv', res.iv);
        wx.setStorageSync('encryptedData', res.encryptedData);
        wx.setStorageSync('headimg', res.avatarUrl);
        //向服务器提交注册数据
        that.regster(code);
      },
      fail: function(res) {
        console.log("未授权，取数据失败了" + JSON.stringify(res));
      }
    })
  },
  regster: function(code) {
    var that = this;
    console.log("注册时，sex：" + wx.getStorageSync('sex'));
    console.log("注册时，city：" + wx.getStorageSync('city'));
    console.log("注册时，province：" + wx.getStorageSync('province'));
    console.log("注册时，nickname：" + wx.getStorageSync('nickname'));
    console.log("注册时，face：" + wx.getStorageSync('face'));
    wx.request({
      method: "POST",
      url: 'https://mingjiu-api.conpanda.cn/front_v1/EsMember/mjdzWxAutologin',
      data: {
        sex: wx.getStorageSync('sex'),
        city: wx.getStorageSync('city'),
        province: wx.getStorageSync('province'),
        nickname: wx.getStorageSync('nickname'),
        face: wx.getStorageSync('face'),
        code: code,
        iv: wx.getStorageSync('iv'),
        encryptedData: wx.getStorageSync('encryptedData'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function(res) {
        if (res.data.message == "ok") {
          wx.setStorageSync("memberId", res.data.data.memberId);
          wx.setStorageSync('wxUnionid', res.data.data.wxUnionid);
          wx.setStorageSync('wxOpenid', res.data.data.wxOpenid);
          console.log('注册成功 memberId = ' + res.data.data.memberId);
          console.log('注册成功 wxUnionid = ' + wx.getStorageSync("wxUnionid"));
          console.log('注册成功 wxOpenid = ' + wx.getStorageSync("wxOpenid"));
          //跳回首页
          console.log('刚授权，播放引导动画');
          that.setData({
            video_hidden: false, //隐藏视频引导
          });
          that.videoContext.play();
          that.videoContext.hideStatusBar();
          //跳转到授权页面
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 3000,
          })
        }
        if (res.data.message == "微信code不能为空") {
          console.log("注册，微信code不能为空");
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '未取到用户信息2',
          duration: 3000,
        })
      }
    });
  }
})