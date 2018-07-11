import HttpUtil from '../../../lib/trilobite/core/rsHttps.js'
let comp, self;
const app = getApp();

/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
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
    console.log(options)
    self.setData({result:JSON.parse(options.currentdata)})
    console.log(self.data.result)
  }
}

Page(new PageController());
