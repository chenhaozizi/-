var app = getApp();
var comp, self;
//
import HttpUtil from '../../lib/trilobite/core/httputil.js'
import fmtDate from '../../lib/trilobite/core/fmtDate.js'


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
    this.http.post("/EsMemberCellarOrderExt/findDetail", { cellarOrderId: id, openId: app.globalData.userInfo.unionid })
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
    this.fmtDate = new fmtDate(app);

  }

  orderDetailDao_callback = (res) => {
    res.data.data[0].pickTime = this.fmtDate.fmtDate(res.data.data[0].pickTime,1)
    self.setData({ result: res.data.data[0] })
  }

  data = {
    result: {}
  }

  onLoad = function (e) {
    self = this;
    comp.OrderDetailDao.load(e.id);
  }
}

Page(new PageController());