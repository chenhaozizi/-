// pages/parameter/parameter.js
var v = {};
var app = getApp();
var wly_degree = '',
  wly_family = '',
  wly_price = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://mingjiu-api.conpanda.cn/upload/2018/07/19/b2e5dc17a8244ba98dec6942063864b8.jpg',
      'https://mingjiu-api.conpanda.cn/upload/2018/07/19/e3420a4e1d6c47aebec3a91d8aea27d6.jpg',
      'https://mingjiu-api.conpanda.cn/upload/2018/07/19/dc488f0155ff4591a2b7963c1d01cf4c.jpg',
      'https://mingjiu-api.conpanda.cn/upload/2018/07/19/1486c625ae5944d6a6656ed3039be662.jpg',
    ],
    indicatorDots: true, //控点
    autoplay: true,
    interval: 4000, //自动播放间隔
    duration: 300, //过渡时间
    indicatorActiveColor: "#A314B0",
    family_change: '', //酒体
    vinosity_change: '', //酒质
    deree_change: '', //度数
    flavour_change: '', //香型
    img_show: '/images/mt_pwj.jpg', //默认参数中头部图片
    sp_price: '请选择酒类型',
    brand: '', //品牌
    _num: '',
    // 控制参数弹窗显示
    parameter_show: "none",
    maskFlag: true,
    maskFlag2: false
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('原有的纸套：', wx.getStorageSync("zt"), '原有祝福语:', app.globalData.pack.blessing);
    wx.setStorageSync("zt", '');
    app.globalData.pack.blessing = "祝福语区域";
    console.log("纸套清理以后:", wx.getStorageSync("zt"), '清空祝福语:', app.globalData.pack.blessing);
    app.globalData.pack.zy = '';
  },
  formSubmit: function(e) {
    var that = this;
    var warn = "";
    var flag = false;
    v = e.detail.value;
    console.log(v);
    if (v.flavour == "") {
      warn = '请选择香型'
    } else if (v.degree == "") {
      warn = '请选择酒精度'
    } else if (v.family == '') {
      warn = '请选择酒类型'
    } else {
      flag = true;
      console.log("选择的品牌是：" + v.brand);
      app.globalData.parameter = v;
      app.globalData.parameter.netwt = "500";
      console.log("定制酒参数", app.globalData.parameter);
      wx.showToast({
        title: '选择成功',
        icon: 'success',
        duration: 1000,
        mask: true
      });
      if (v.brand == 1) {
        setTimeout(function() {
          that.def(); //恢复默认
          wx.navigateTo({
            url: '../pack/pack'
          })
        }, 1200)
      } else if (v.brand == 2) {
        setTimeout(function() {
          that.def(); //恢复默认
          if (v.family == "银坛" || v.family == 1) {
            wx.navigateTo({
              url: '../pack2/pack2'
            })
          } else if (v.family == "金樽" || v.family == 2) {
            wx.navigateTo({
              url: '/pagesA/pack2_1/pack2_1'
            })
          }
        }, 1200)
      } else if (v.brand == 3) {
        setTimeout(function() {
          that.def(); //恢复默认
          if (v.family == "品味级" || v.family == 1) {
            wx.navigateTo({
              url: '../pack3/pack3'
            })
          } else if (v.family == "鉴赏级" || v.family == 2) {
            wx.navigateTo({
              url: '/pagesA/pack3_1/pack3_1'
            })
          } else if (v.family == "尊享级" || v.family == 3) {
            wx.navigateTo({
              url: '/pagesA/pack3_2/pack3_2'
            })
          }
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
  formReset: function() {
    console.log('form发生了reset事件')
  },
  // 品牌选择
  menuClick: function(e) {
    // 弹出参数选择框
    this.setData({
      parameter_show: "block",
      maskFlag: false,
      maskFlag2: true
    })
    var n = e.target.dataset.num;
    console.log(e);
    if (!app.globalData.style_img == '') {
      app.globalData.style_img = "";
    }
    console.log("品牌选择：", e.target.dataset.num),
      this.setData({
        _num: e.target.dataset.num,
      });
    if (n == 1) {
      // 全兴大曲
      this.setData({
        parameter: {
          brand: 1,
          flavour: [1],
          degree: [52],
          family: [{
            name: '99系列',
            price: '268',
            img: '/images/qx_99.jpg'
          }],
          info: ['四川六朵金花之一，距今已有二百多年的历史，酒香醇甜、爽口尾净。']
        },
        sp_price: '268',
        img_show: '/images/qx_99.jpg'
      });
    } else if (n == 2) {
      // 五粮液
      this.setData({
        parameter: {
          brand: 2,
          flavour: [1],
          degree: [42, 52],
          family: [{
            name: '银坛',
            price: '',
            img: '/images/wly_yt.jpg'
          }, {
            name: '金樽',
            price: '',
            img: '/images/wly_hs.jpg'
          }],
          info: ['中国最高档白酒之一，酒体醇厚，入口甘美，入喉净爽，酒味全面。']
        },
        img_show: '/images/wly_yt.jpg'
      });
    } else if (n == 3) {
      // 茅台
      this.setData({
        parameter: {
          brand: 3,
          flavour: [2], //1浓香 2酱香
          degree: [53], //酒精度
          family: [{
            name: '品味级',
            price: '198',
            img: '/images/mt_pwj.jpg'
          }, {
            name: '鉴赏级',
            price: '298',
            img: '/images/mt_jsj.jpg'
          }, {
            name: '尊享级',
            price: '398',
            img: '/images/mt_zxj.jpg'
          }], //酒质
          info: ['世界三大蒸馏名酒之一，至今已有800多年的历史，酱香突出，优雅细腻，酒体醇厚。']
        },
        img_show: '/images/mt_pwj.jpg'
      });
    } else if (n == 4) {

    } else if (n == 5) {

    }
  },
  // 参数选择  样式改变
  type_change: function(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    if (e.currentTarget.dataset.price && e.currentTarget.dataset.brand !== 2) {
      this.setData({
        sp_price: e.currentTarget.dataset.price
      })
    }
    if (e.currentTarget.dataset.imgsrc) {
      this.setData({
        img_show: e.currentTarget.dataset.imgsrc
      })
    }
    if (type == 1) {
      this.setData({
        flavour_change: e.currentTarget.dataset.num
      })
    } else if (type == 2) {
      if(e.currentTarget.dataset.brand==2){
        wly_degree = e.currentTarget.dataset.degree; //五粮液
        that.wly_pri();
      };
      this.setData({
        deree_change: e.currentTarget.dataset.num
      })
    } else if (type == 3) {
      this.setData({
        vinosity_change: e.currentTarget.dataset.num
      })
    } else if (type == 4) {
      if (e.currentTarget.dataset.brand == 2) {
        wly_family = e.currentTarget.dataset.family; //五粮液
        that.wly_pri();
      }
      this.setData({
        family_change: e.currentTarget.dataset.num
      })
    }
  },
  //关闭参数弹窗 重置数据
  parameter_close: function() {
    app.globalData.parameter = '';
    this.def();
  },
  def: function() {
    var that = this;
    wly_degree = '';
    wly_family = '';
    wly_price = '';
    that.setData({
      parameter_show: "none",
      maskFlag: true,
      maskFlag2: false,
      family_change: '',
      vinosity_change: '',
      deree_change: '',
      flavour_change: '',
      sp_price: '请选择酒类型',
    })
  },
  //品牌4.5的提示
  wait: function() {
    wx.showToast({
      title: '敬请期待',
      duration: 1000,
      icon: 'loading'
    })
  },
  wly_pri: function() {
    if (wly_degree == '42' && wly_family == '银坛') {
      wly_price = 188
    }
    if (wly_degree == '52' && wly_family == '银坛') {
      wly_price = 208
    }
    if (wly_degree == '42' && wly_family == '金樽') {
      wly_price = 268
    }
    if (wly_degree == '52' && wly_family == '金樽') {
      wly_price = 288
    }
    if (wly_price !== "") {
      this.setData({
        sp_price: wly_price
      })
    }
  }
})