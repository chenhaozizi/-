// pages/ent_info/ent_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: '',
    shipTime: '',
    orderTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      method: 'POST',
      url: 'https://mingjiu-api.conpanda.cn/front_v1/EsCustomizationOrder/FindById',
      data: {
        cuzOrderId: options.cuzOrderId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        that.setData({ orderInfo: res.data.data });
        that.setData({ shipTime: that.translate(res.data.data.shipTime) });
        that.setData({ orderTime: that.translate(res.data.data.orderTime) });
      }
    })
  },

  translate: function (data) {
    let date = new Date(data);
    let Y = date.getFullYear() + "-";
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "-";
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + "   ";
    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ":";
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ":";
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return Y + M + D + h + m + s;
    // return Y + M + D;
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
        //that.getOrderList(1, 0);
        wx.showToast({
          title: '付款',
          icon: 'loading',
          duration: 1000,
          mask: true
        });
        wx.redirectTo({ url: '../ent/ent' })
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
              //that.getOrderList(1, 0);
              wx.showToast({
                title: '删除成功',
                icon: 'loading',
                duration: 1000,
                mask: true
              });
              wx.redirectTo({url:'../ent/ent'})
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },

})  