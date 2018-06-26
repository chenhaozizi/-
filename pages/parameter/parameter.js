// pages/parameter/parameter.js
var v = {};
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show1: "160rpx",
    show2: "160rpx",
    show3: "160rpx",
    show4: "0",
    brand: 3,
    parameter: {
      flavour: [2],//1浓香 2酱香
      degree: [38,53],//酒精度
      netwt: [500]//净含量
    },
    //  next_step:"disable"，
    next_step: "",
    _num: 3
  },
 

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('原有的纸套：', wx.getStorageSync("zt"), '原有祝福语:', app.globalData.pack.blessing);
    wx.setStorageSync("zt", '');
    app.globalData.pack.blessing ="祝福语区域";
    console.log("纸套清理以后:", wx.getStorageSync("zt"), '清空祝福语:', app.globalData.pack.blessing);
    app.globalData.pack.zy = '';
    
  },


  formSubmit: function (e) {
   
    var that = this;
    var warn = "";
    var flag = false;
    v = e.detail.value;
    if (v.brand == "") {
      warn = '请选择品牌'
    } else if (v.flavour == "") {
      warn = '请选择香型'
    } else if (v.degree == "") {
      warn = '请选择酒精度'
    } else if (v.netwt == "") {
      warn = '请选择净含量'
    } else {
      flag = true;
      console.log("选择的品牌是：" + v.brand);
      // console.log('form发生了submit事件，携带数据为：', e.detail.value);
      app.globalData.parameter = e.detail.value;
      console.log("定制酒参数", app.globalData.parameter);
      wx.showToast({
        title: '选择成功',
        icon: 'success',
        duration: 1000,
        mask: true
      });
      if (v.brand == 1) {
        setTimeout(function () {
          wx.navigateTo({
            url: '../pack/pack'
          })
        }, 1200)
      } else if (v.brand == 2) {
        setTimeout(function () {
          wx.navigateTo({
            url: '../pack2/pack2'
          })
        }, 1200)
      } else if (v.brand == 3) {
        setTimeout(function () {
          wx.navigateTo({
            url: '../pack3/pack3'
          })
        }, 1200)
      }
    };
    if (flag == false) {
      wx.showToast({
        title: warn,
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  menuClick: function (e) {
    var n = e.target.dataset.num;
    console.log(e);
    if (!app.globalData.style_img == '') {
      app.globalData.style_img = "";
    }
    console.log("品牌选择：", e.target.dataset.num),
      this.setData({
        _num: e.target.dataset.num,
      });
      if(n==1){
        this.setData({
          parameter: {
            flavour: [1],
            degree: [52],
            netwt: [500]
          } 
        });
      }else if(n==2){
        this.setData({
          parameter: {
            flavour: [1],
            degree: [38,42,52],
            netwt: [500]
          }
        });
      }else if(n==3){
        this.setData({
          parameter: {
            flavour: [2],
            degree: [38,53],
            netwt: [500]
          }
        });
      }
  },
  // 下拉菜单控制
  xz: function (e) {
    var that = this;
    let num = e.target.dataset.show;
    // console.log(num);
    if (num == 1) {
      if (this.data.show1 == "160rpx") {
        this.setData({
          show1: "0"
        })
      } else {
        this.setData({
          show1: "160rpx",
          show4: "0"
        })
      }
    } else if (num == 2) {
      if (this.data.show2 == "160rpx") {
        this.setData({
          show2: "0"
        })
      } else {
        this.setData({
          show2: "160rpx"
        })
      }
    } else if (num == 3) {
      if (this.data.show3 == "160rpx") {
        this.setData({
          show3: "0"
        })
      } else {
        this.setData({
          show3: "160rpx"
        })
      }
    } else if (num == 4) {
      if (this.data.show4 == "160rpx") {
        this.setData({
          show4: "0"
        })
      } else {
        this.setData({
          show1: "0",
          show4: "160rpx"
        })
      }
    }
  }
})