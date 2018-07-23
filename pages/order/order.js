// pages/order/order.js
var price = 0;//商品单价
var app = getApp();
let This;
var de_addr=false;
let flag = true;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    captions: [
      { "cnt": "感谢您对合润汇名酒定制中心的认可及厚爱！您参与本次定制购买的活动，按照定制流程将您需要上传的图片及想说的话表达出来，即可为您生成只属于您独一无二的专属定制酒。" },
      {
        "cnt": "1）您同意将您自己的网络名称、头像、地理位置、原创语录等私人信息授权给我们，用于您专属定制产品的设计与包装。"
      },
      { "cnt": "2）您在本商城购买的产品只能用于您自己使用或与亲朋好友之间的分享及品尝，不可进行二次销售。" },
      { "cnt": "3）我们保证为您私人定制的产品质量符合国家相关法律法规的规定，因是您私人定制产品，非产品质量问题，我们不接受您的退换，望请谅解" },
      { "cnt": "4）对于因物流服务（包括但不限于商品出现漏酒、破损、错发、交货延迟等特殊原因）等而造成您的损失，我们将第一时间为您协调处理。" },
      { "cnt": "5）若您对本次活动有任何建议或意见，您可以与我们的客服联系，我们将在第一时间为您解答。" }
    ],
    showModal: false,
    isaddr: false,
    brand: "",
    flavour: "",
    degree: '',
    netwt: '',
    addr_choose_id: "",
    id: '',
    name: '',
    tel: '',
    addr: '',
    addrId: '',
    // 商品数量input默认是1  
    num: 3,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    price: 1608,//一箱的价格
    total_price: "",//总价
    orgimg: '',
    tmpimg: '',
    logo: '',
    ok:true,btnflag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      logo:wx.getStorageSync("compimg")
    })
    console.log(app.globalData.parameter)
    that.parameter();
    //截图
    This = this;
    wx.getStorage({
      key: 'tempfs',
      success: function (res) {
        This.setData({
          tmpimg: res.data
        })
      }
    })
    //原图
    wx.getStorage({
      key: 'orimg',
      success: function (res) {
        This.setData({
          orgimg: res.data
        })
      }
    })
    console.log('全局储存的', app.globalData)
    // 请求默认地址
    // this.ask_addr();
    if (options.add_choose_id) {
      this.setData({
        addr_choose_id: options.add_choose_id
      });
      console.log(this.data.addr_choose_id)
    }
  },
  onShow:function(){
     var that=this;
    // 请求默认地址
    that.ask_addr();
   console.log("我出现了");
  },

  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 3) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 3 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.total_price(num)
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 3 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
    this.total_price(num)
  },
  /*总价计算*/
  total_price: function (e) {
    console.log(this.data.price)
    price = this.data.price;
    var to = (e * price * 6).toFixed(2);
    console.log(e, this.data.price);
    this.setData({
      total_price: to
    })
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    if (num < 3) {
      this.setData({
        num: 3
      });
      wx.showModal({
        title: '温馨提示',
        content: '数量不能小于3箱',
        success: function (sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      });
      this.total_price(this.data.num);
      return;
    } else {
      // 将数值与状态写回  
      this.setData({
        num: num
      });
      this.total_price(num)
    }
  },
  add_addr: function () {
    wx.navigateTo({
      url: "../add_addr/add_addr?backUrl=" + '/pages/order/order'
    })
  },
  // 默认地址
  ask_addr: function () {
    var that = this;
    console.log(wx.getStorageSync("memberId"));
    that.setData({
      total_price: ((that.data.price) * (that.data.num) * 6).toFixed(2)
    });
    wx.request({
      method: "POST",
      url: 'https://mingjiu-api.conpanda.cn/front_v1/EsMemberAddress/findDefault',
      data: {
        memberId: wx.getStorageSync("memberId")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var dd = res.data.data;
          console.log('默认地址返回的：',dd);
          if (dd) {
            de_addr=true;
            let addrId = dd.addrId
            let name = dd.name;
            let tel = dd.mobile;
            let addr = dd.province + dd.city + dd.region + dd.town + dd.addr;
            app.globalData.addr_default = { name, tel, addr, addrId };
            console.log(app.globalData.addr_default);
            that.setData({
              isaddr: true,
              name: app.globalData.addr_default.name,
              tel: app.globalData.addr_default.tel,
              addr: app.globalData.addr_default.addr,
              addrId: app.globalData.addr_default.addrId,
            });
          } else {
            de_addr = false;
            that.setData({
              isaddr: false,
              name: '',
              tel:'',
              addr:'',
              addrId: ''
            });
            console.log("没有默认地址")
          }
        } else {
          console.log("请求错误")
        }
      }
    });
  },
 
  pick_up: function () {
    console.log(1111)
    this.setData({
      btnflag:true
    })
    var that = this;
    if (this.data.num < 3) {
      wx.showModal({
        title: '提示',
        content: '最少3箱起订，请检查商品箱数',
        showCancel: false
      })
      return;
    }
  
    if (de_addr){
      console.log('是否选择同意特别说明：', that.data.ok)
      if (that.data.ok == false) {
        wx.showToast({
          title: '未同意特别说明',
          icon: 'loading'
        });
        return;
      }

    wx.request({
      method: "POST",
      url: 'https://mingjiu-api.conpanda.cn/front_v1/EsCustomizationOrder/Add',
      data: {
        paper: app.globalData.pack.zt,
        num: this.data.num,
        totalAmount: this.data.total_price,
        shippingId: 1,
        memberId: wx.getStorageSync("memberId"),
        name: this.data.brand,
        addrId: this.data.addrId,
        flavor: app.globalData.parameter.flavour,
        netContent: app.globalData.parameter.netwt,//所有类型暂时默认500ml
        original: This.data.orgimg,
        thumbnail: This.data.tmpimg,
        message: app.globalData.pack.blessing,
        brand: app.globalData.parameter.brand,
        alcohol: app.globalData.parameter.degree,
        compositeImg: wx.getStorageSync("compimg")
        // price: app.globalData.parameter.price,//2期版本新增价格
        // family: app.globalData.parameter.family//2期版本新增酒类型
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
       
        var dd = res.data.data;
        var cuzOrderId = dd.cuzOrderId;
        console.log(dd);
        console.log("订单号", cuzOrderId);
        // // 调试收益
        // setTimeout(function () {
        //   wx.redirectTo({
        //     url: '../ent/ent?currentTab=1',
        //   })
        //   that.setData({
        //     btnflag: false
        //   })
        // }, 1000)
        that.pay(dd.cuzOrderId);
      }
    })
   
    }else{
      wx.showToast({
        title:'请先填写地址',
          icon: 'loading'
      });
      return;
    }
   
  },
  pay: function (e) {
    var that = this;
    wx.request({
      method: "POST",
      url: 'https://mingjiu-api.conpanda.cn/front_v1/CuzWeixin/Pay',
      data: {
        openid: wx.getStorageSync('wxOpenid'),
        cuzOrderId: e,
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
    console.log(a, b, c, d)
    wx.requestPayment({
      'nonceStr': a,
      'package': b,
      'paySign': c,
      'signType': 'MD5',
      'timeStamp': d,
      'success': function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'succes',
          duration: 1000,
          mask: true
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '../ent/ent?currentTab=1',
          })
        }, 1000)

      },
      'fail': function (res) {
        wx.showToast({
          title: '支付失败',
          icon: 'loading',
          duration: 1000,
          mask: true
        });
        setTimeout(function () {
          wx.redirectTo({
            url: '../ent/ent',
          })
        }, 1000);

      }

    })
  },
  parameter: function () {
    var that = this;
    that.setData({
      degree: app.globalData.parameter.degree,
      netwt: app.globalData.parameter.netwt,
    })
    // 判断品牌
    if (app.globalData.parameter.brand == 1) {
      that.setData({
        brand: "全兴大曲·99系列",
        price: 268
      })
    } else if (app.globalData.parameter.brand == 2) {
      if (app.globalData.parameter.family == "金樽" || app.globalData.parameter.family == 2){
        that.setData({
          brand: "五粮液·金樽",
          price: 188
        })
      } else if (app.globalData.parameter.family == "银坛" || app.globalData.parameter.family == 1){
        that.setData({
          brand: "五粮液·银坛",
          price: 188
        })
      }
      
    } else if (app.globalData.parameter.brand == 3) {
      if (app.globalData.parameter.family == "品味级" || app.globalData.parameter.family == 1) {
        that.setData({
          brand: "贵州茅台·品味级",
          price: 198
        })
      } else if (app.globalData.parameter.family == "鉴赏级" || app.globalData.parameter.family == 2){
        that.setData({
          brand: "贵州茅台·鉴赏级",
          price: 198
        })
      } else if (app.globalData.parameter.family == "尊享级" || app.globalData.parameter.family == 3) {
        that.setData({
          brand: "贵州茅台·尊享级",
          price: 198
        })
      }
     
    };
    if (app.globalData.parameter.flavour == 1) {
      that.setData({
        flavour: "浓香型"
      })
    } else if (app.globalData.parameter.flavour == 2) {
      that.setData({
        flavour: "酱香型"
      })
    }
  },
  preventTouchMove: function () {

  },
 caption: function () {
    this.setData({
      showModal: true
    })
  },
 go: function () {
   this.setData({
     showModal: false
   })
 },
 ok: function (e) {
   var that = this;
   console.log(e.detail.value[0]);
   if (e.detail.value[0] == "ok") {
     this.setData({
       ok: true
     })
   } else {
     this.setData({
       ok: false
     })
   }
 },

})