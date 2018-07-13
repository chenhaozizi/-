import HttpUtil from '../../../lib/trilobite/core/rsHttps.js'
import ymdDatejw from '../../../lib/trilobite/core/ymdDatejw.js'

let comp, self;
const app = getApp();

/*
 * 单子详情查询
*/
class FindDetails {

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
  load = (e) => {
    console.log(e)
    console.log(wx.getStorageSync("memberId"))
    this.http.post("/RsWithdrawRecord/FindDetails", { id: e, withdrawId: e })
  }
}


/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.FindDetails = new FindDetails();
    comp.FindDetails.callback = this.FindDetails_callback;
    comp.jw = new ymdDatejw(app);
  }

  FindDetails_callback = (res) => {
    console.log(res.data)
    if (res.data.code == 200) {
      res.data.data.startDate = self.jw.fmtDate(res.data.data.startDate)
      res.data.data.bankName = res.data.data.bankName + ' ' + res.data.data.cardNumber
      self.setData({ result: res.data.data })
      console.log(self.data.result)
    }
  }

  /**
   * 页面的初始数据
   */
  data = {
    result:[]
  }

  /**
   * 加载的时候
   */
  onLoad = function (options) {
    self = this;
    console.log(options.currentdata)
    comp.FindDetails.load(options.currentdata);
  }
}

Page(new PageController());
