
import HttpUtil from '../../../lib/trilobite/core/rsHttps.js'
// import goPage from '../../../lib/page.js'
//获取应用实例
var app = getApp();
let self, comp;
class selecBankDao {

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
    this.http.post("/BaseData/FindSupportBanks")

  }

}

class PageController {
  constructor() {
    comp = this;
    comp.selecBankDao = new selecBankDao();
    comp.selecBankDao.callback = this.selecBankDao_callback;
  }
  selecBankDao_callback = (res) =>{
    console.log(res)
  }
  data = {
    array: ['中国建设', '农业银行', '工商银行', '中国银行'],
    index: 0
  }
  onShow = function () {
   
  }
  onLoad = function () {
    self = this;
    comp.selecBankDao.load();
  }
  bindPickerChange = (e) => {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    self.setData({
      index: e.detail.value
    })
  }
}
Page(new PageController());
