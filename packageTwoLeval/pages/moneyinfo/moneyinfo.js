import HttpUtil from '../../../lib/trilobite/core/httputil.js'
// import goPage from '../../../lib/page.js'
//获取应用实例
var app = getApp();
let self, comp;
class FindFinanceDetail {

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
    this.http.post("/RsTradeDetail/FindDetail", { memberId: wx.getStorageSync("memberId"), tradeRecordId:e })
  }
}

/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.FindFinanceDetail = new FindFinanceDetail();
    comp.FindFinanceDetail.callback = this.FindFinanceDetail_callback;
  }
  FindFinanceDetail_callback = (res) =>{
      if(res.data.code == 200){
        self.setData({
          result:res.data.data
        })
      }
  }
  data = {
    userInfo: '',
    memberId: "",
    result:"", tradeRecordId:"",
  }
  onShow = function () {
  }

  onLoad = function (options) {
    self = this;
    wx.setNavigationBarTitle({
      title: JSON.parse(options.opdata).name+'详情'//页面标题为路由参数
    })
    self.FindFinanceDetail.load(JSON.parse(options.opdata).tradeRecordId)
  }
}
Page(new PageController());
