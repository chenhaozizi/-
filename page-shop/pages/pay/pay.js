var app = getApp();
var comp, self;
//
import HttpUtil from '../../lib/trilobite/core/httputil.js'

  
/*
 * 订单列表访问
*/
class OrderDetailDao {
  //POST /EsCart/checkGoods//
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
  load = (id) => {
    this.http.post("/EsOrder/FindById", { orderId: id })
  }
}

/*
 * 支付接口
*/
class PayDao {
  //POST /EsCart/checkGoods//
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
  load = (id) => {
    this.http.post("/Weixin/shopPay", { orderId: id, openid: app.globalData.userInfo.wxOpenid })
  }
}



/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.OrderDetailDao = new OrderDetailDao();
    comp.OrderDetailDao.callback = this.orderDetailDao_callback;
    comp.PayDao=new PayDao();
    comp.PayDao.callback=this.paydao_callback;
  }
  paydao_callback=(res)=>{
    let pp=res.data.data;
    console.log(pp.package);
    wx.requestPayment(
      {
         ...pp,
        'success': function (res) { 
          wx.showModal({
            title: '提示',
            content: '支付成功'
          })
        },
        'fail': function (res) {
          wx.showModal({
            title: '提示',
            content: '支付失败'
          })
         },
        'complete': function (res) { 
          self.data.result.isComp=true;
          self.setData({result:self.data.result})
        }
      })
  }

  orderDetailDao_callback = (res) => {
    self.setData({ result: res.data.data[0] })
  }

  data = {
    result: {}
  }

  onLoad = function (e) {
    console.log(app.globalData.userInfo)
    self = this;
    comp.OrderDetailDao.load(e.id);
  }
  payTap =(e)=>{
    comp.PayDao.load(e.currentTarget.dataset.id);
    
  }
  toIndex=(e)=>{
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
}

Page(new PageController());
