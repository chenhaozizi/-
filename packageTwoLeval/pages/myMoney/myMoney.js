import HttpUtil from '../../../lib/trilobite/core/rsHttps.js'
let comp, self;
const app = getApp();

/*
 * 会员认证查询
*/
class FindTradeRecordsPage {

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
  load = () => {
    this.http.post("/RsTradeRecord/FindTradeRecordsPage", { memberId: 1, pageNumber: 1, pageSize: 4,tradeTypeCode:''})
  }
}

/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.FindTradeRecordsPage = new FindTradeRecordsPage();
    comp.FindTradeRecordsPage.callback = this.FindTradeRecordsPage_callback;

   
  }
  bindPickerChange = (e) => {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }
  /**
   * 页面的初始数据
   */
  data ={
    a: [1, 2, 3],
    index: 0,
    array: ['选择账单类型', '提成', '返利', '提现'],
    result:{}
  }

  FindTradeRecordsPage_callback = (res) => {
    console.log(res)
    if (res.data.data[0]) {
      console.log(res.data.data)
      // self.data.update=true;
      self.setData({ result: res.data.data[0]})
    }

  }

  /**
   * 加载的时候
   */
  onLoad = function () {
    self = this;
    comp.FindTradeRecordsPage.load();
  }
}

Page(new PageController());
