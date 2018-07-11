import HttpUtil from '../../../lib/trilobite/core/rsHttps.js'
let comp, self;
const app = getApp();
/*
 * 会员认证查询
*/
class FindAuthorizeInfo {

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
    this.http.post("/RsMember/FindAuthorizeInfo", { memberId: 10040 })
  }
}

/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.FindAuthorizeInfo = new FindAuthorizeInfo();
    comp.FindAuthorizeInfo.callback = this.FindAuthorizeInfo_callback;
  }

  data = {
    result: {},
  }

  FindAuthorizeInfo_callback = (res) => {
    console.log(res, res.data.code)
    if (res.data.code==200) {
      // self.data.update=true;
      self.setData({ result: res.data.data})
      console.log(self.data)
    }

  }

  /**
   * 加载的时候
   */
  onLoad = function () {
    self = this;
    comp.FindAuthorizeInfo.load();
  }
}

Page(new PageController());
