
import HttpUtil from '../../../lib/trilobite/core/httputil.js'
// import goPage from '../../../lib/page.js'
//获取应用实例
var app = getApp();
let self, comp;
class selecAllBankDao {
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
    this.http.post("/RsMemberBank/FindAll", { memberId: wx.getStorageSync("memberId")})

  }

}
//设置默认提现银行卡
class setDefaultDao {
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
    this.http.post("/RsMemberBank/SetDefault", { memberId: wx.getStorageSync("memberId") ,bankId:e.id})
  }
}
//删除银行卡
class delBankDao {
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
    this.http.post("/RsMemberBank/Delete", { id: e.id })
  }
}


class PageController {
  constructor() {
    comp = this;
    comp.selecAllBankDao = new selecAllBankDao();
    comp.selecAllBankDao.callback = this.selecAllBankDao_callback;
    comp.setDefaultDao = new setDefaultDao();
    comp.setDefaultDao.callback = this.setDefaultDao_callback;
    comp.delBankDao = new delBankDao();
    comp.delBankDao.callback = this.delBankDao_callback;
  }

  // 查询银行l卡
  selecAllBankDao_callback = (res) => {
    console.log(res.data.data)
    for (var i = 0; i < res.data.data.length;i++){
      res.data.data[i].cardNumber = res.data.data[i].cardNumber.substring(-1, 4) + " ****"+""+"**** " + res.data.data[i].cardNumber.substring(14)
    }
    self.setData({
      bankList: res.data.data,
    })
  }
  //设置默认银行卡回调
  setDefaultDao_callback = (res) =>{
    if(res.data.code == 200){
      //self.showMessage(res.data.data);
        wx.showToast({
          title: res.data.data,
          success: (res) => {
            comp.selecAllBankDao.load();
          }
        })
    }
  }
  //删除银行卡回调
  delBankDao_callback = (res) =>{
    console.log(res);
    if (res.data.code == 200) {
      wx.showToast({
        title: res.data.data,
        success: (res) => {
          comp.selecAllBankDao.load();
        }
      })
    }
  }
  data = {
    bankList: []
  }
  onShow = function () {

  }
  //设置默认银行卡
  setDefault = (e) =>{
    //console.log(e.target.dataset.id);
    comp.setDefaultDao.load(e.target.dataset)

  }
  //删除银行卡
  delBank = (e) =>{
    wx.showModal({
      title: '删除提示',
      content: '你确定删除该条数据吗？',
      success: function (res) {
        if (res.confirm) {
          comp.delBankDao.load(e.target.dataset)
        } else {
          console.log('用户点击取消')
        }

      }
    })
   
  }
  onLoad = function () {
    self = this;
    comp.selecAllBankDao.load();
  }
 
  showMessage = (m) => {
    wx.showModal({
      title: '提示',
      content: m,
      showCancel: false
    })
  }
}
Page(new PageController());
