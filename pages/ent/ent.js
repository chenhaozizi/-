// pages/ent/ent.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab:['待付款','待发货','已发货'],
    currentTab: 0,
    hidden1: '',
    hidden2: 'hidden',
    hidden3: 'hidden',
    unpayArr: '',//待付款
    pay:"",//待发货
    send:''//已发货
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(2222,options)
    if(options.currentTab !=null){
      that.setData({
        currentTab: options.currentTab
      });
      this.getOrderList(2, 1);
    }else{
      // console.log('用户ID',app.globalData.userInfoNew.memberId);
      this.getOrderList(1, 0);
    }
  },
  onUnload: function (e) {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    this.setData({
      currentTab: cur
    })
    if (cur == 0) {
      this.getOrderList(1, 0);
    } else if (cur == 1) {
      this.getOrderList(2, 1);
    } else if (cur == 2) {
      this.getOrderList(2, 2);
    }
    console.log(cur);
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  getOrderList: function (payStatus, shipStatus) {
    console.log("ztai", payStatus, shipStatus)
    var that = this;
    wx.request({
      method: 'POST',
      url: 'https://mingjiu-api.conpanda.cn/front_v1/EsCustomizationOrder/FindByStatus', //仅为示例，并非真实的接口地址
      data: {
        memberId: wx.getStorageSync("memberId"),
        payStatus: payStatus,
        shipStatus: shipStatus
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (payStatus == 1){
          that.setData({ unpayArr: res.data.data })//未付款
        } else if (payStatus == 2 && shipStatus ==1){
          that.setData({ pay: res.data.data })//待发货
        } else if (payStatus == 2 && shipStatus == 2) {
          that.setData({ send: res.data.data })//已发货
        }
       
          console.log(res.data,that.data)
      }
    })
  },
  delOrder: function (e) {
    var id = e.target.dataset.current;
    var that = this;
    wx.showModal({
      title: '删除提示',
      content: '确认要删除吗',
      success: function (res) {
        if (res.confirm) { 
          wx.request({
            method: 'POST',
            url: 'https://mingjiu-api.conpanda.cn/front_v1/EsCustomizationOrder/Delete',
            data: {
              id: id,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: function (res) {
              that.getOrderList(1, 0);
              wx.showToast({
                title: '删除成功',
              })
            }
          })
        } else { 
          console.log('用户点击取消')
        }
      }
    })
  },
  confirmPay: function (e) {
    var id = e.target.dataset.current;
    var that = this;
    wx.request({
      method: "POST",
      url: 'https://mingjiu-api.conpanda.cn/front_v1/CuzWeixin/Pay',
      data: {
        openid: wx.getStorageSync('wxOpenid'),
        cuzOrderId: id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data.data);
        var x = res.data.data;
        console.log('返回的：', x.nonceStr, x.package, x.paySign, x.timeStamp);
        that.pay_show(x.nonceStr, x.package, x.paySign, x.timeStamp);
      }
    });
  },
  pay_show: function (a, b, c, d) {
    var that = this;
    console.log(a, b, c, d);
    wx.requestPayment({
      'nonceStr': a,
      'package': b,
      'paySign': c,
      'signType': 'MD5',
      'timeStamp': d,
      'success': function (res) {
        that.getOrderList(1, 0);
        wx.showToast({
          title: '支付成功',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      }
    })
  }

})