//index.js
//获取应用实例
import HttpUtil from '../../lib/trilobite/core/httputil.js'
//获取应用实例
var app = getApp();
let comp, self;
Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false , // loading
    userInfo: {},
    swiperCurrent: 0,  
    selectCurrent:0,
    categories: [],
    activeCategoryId: 0,
    goods:[],
    scrollTop:"0",
    loadingMoreHidden:true,

    hasNoCoupons:true,
    coupons: [],
    searchInput: '',
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
      //console.log(e.detail.current)
       this.setData({  
        swiperCurrent: e.detail.current  
    })  
  },
  toDetailsTap:function(e){
    wx.navigateTo({
      url:"/pages/goods-details/index?id="+e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
     this.setData({  
        selectCurrent: e.index  
    })  
  },
  scroll: function (e) {
    //  console.log(e) ;
    var that = this,scrollTop=that.data.scrollTop;
    that.setData({
      scrollTop:e.detail.scrollTop
    })
    // console.log('e.detail.scrollTop:'+e.detail.scrollTop) ;
    // console.log('scrollTop:'+scrollTop)
  },
  //切换到授权页面
  move:function() {
    wx.reLaunch({
      url: '/pages/user_info/user_info',
    })
  },
  login: function (code) {
    var that = this;
    //再次请求用户数据
    wx.request({
      method: "POST",
      url: 'https://mjapi.pandahot.cn/EsMember/mjShopWxAutologin',
      data: {
        sex: app.globalData.userInfo.gender,
        city: app.globalData.userInfo.city,
        province: app.globalData.userInfo.province,
        nickname: app.globalData.userInfo.nickname,
        face: app.globalData.userInfo.avatarUrl,
        code:code,
        iv: app.globalData.userInfo.iv,
        encryptedData: app.globalData.userInfo.encryptedData
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.data.message == "ok") {
          //设置全局数据
          app.globalData.userInfo = res.data.data;
          app.globalData.userInfo.unionid = res.data.data.wxUnionid;
          console.log('登录成功 memberId = ' + app.globalData.userInfo.memberId);
          console.log('登录成功 wxUnionid = ' + app.globalData.userInfo.wxUnionid);
          console.log('登录成功 wxOpenid = ' + app.globalData.userInfo.wxOpenid);
        } else {
          setTimeout(function () {
            console.log('出错信息 = ' + res.data.message);
            that.move();
          }, 500)
        }
      },
    });
  },
  onLoad: function () {
    var that = this;
    self = this;
    
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    console.log("用户Id", wx.getStorageSync("memberId"))
    if (wx.getStorageSync("memberId")) {
    } else { that.move(); wx.clearStorageSync(); return }
   
    
    // 获取用户信息
    wx.getSetting({
      success: function(res) {
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
                  console.log("授权后，取数据成功iv：" + res.iv);
                  app.globalData.userInfo = res.userInfo;
                  app.globalData.userInfo.encryptedData = res.encryptedData;
                  app.globalData.userInfo.iv = res.iv;
                  console.log('缓存用户授权信息成功');
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res);
                  }
                  if (wx.getStorageSync('memberId ') && wx.getStorageSync('wxUnionid  ') && wx.getStorageSync('wxOpenid  '))
                   {return}else{
                    self.login(that.data.code);
                   }
                   
                }
              })

            }
          });
        } else {
          //未授权
          setTimeout(function () {
            console.log('未授权，跳转页面去授权');
            that.move();
          }, 500)
        }
      }
    });
   
    that.getGoodsList(0);
  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0) {
      categoryId = "";
    }
    console.log(categoryId)
    var that = this;
    wx.request({
      url: app.globalData.Domain+'/Goods/FindPerPageByTag',
      data: {
        tagId: 4,
        start: 1,
        pagesize:15,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res)
        that.setData({
          goods:[],
          loadingMoreHidden:true
        });
       
        if (res.data.code != 200 || res.data.data.length == 0) {
          that.setData({
            loadingMoreHidden:false,
          });
          return;
        }
        
        that.setData({
         
          goods: res.data.data,
        });
      
      }
    })
  },
 
  
  onShareAppMessage: function () {
    return {
      title: wx.getStorageSync('mallName') + '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getNotice: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/notice/list',
      data: { pageSize :5},
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            noticeList: res.data.data
          });
        }
      }
    })
  },
  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch : function (){
    this.getGoodsList(this.data.activeCategoryId);
  }
})
