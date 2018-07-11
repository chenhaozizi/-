
import HttpUtil from '../../../lib/trilobite/core/rsHttps.js'
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
    this.http.post("/RsMemberBank/FindAll", { memberId: wx.getStorageSync("memberId")})

  }
}
//查询可提现余额
class selecRecordDao {
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
    this.http.post("/RsWithdrawRecord/FindBalanceTotal", { memberId: wx.getStorageSync("memberId") })

  }

}
//提现
class AddRecordDao {
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
    this.http.post("/RsWithdrawRecord/Add", { memberId: wx.getStorageSync("memberId"),...e })

  }

}
class PageController {
  constructor() {
    comp = this;
    comp.selecBankDao = new selecBankDao();
    comp.selecBankDao.callback = this.selecBankDao_callback;
    comp.selecRecordDao = new selecRecordDao();
    comp.selecRecordDao.callback = this.selecRecordDao_callback;
    comp.AddRecordDao = new AddRecordDao();
    comp.AddRecordDao.callback = this.AddRecordDao_callback;
  }
 
  // 已添加银行
  selecBankDao_callback = (res) => {
   if(res.data.code == 200){
    self.setData({
      bankArr: res.data.data,
      cardId: res.data.data[0].id
    })
   }
  }
  //查询可提现余额
  selecRecordDao_callback = (res) =>{
    console.log(res.data.data)
    if(res.data.code == 200){
        self.setData({
          recordTotal: res.data.data.balanceTotal,
         
        })
    }
  }
  //提现
  AddRecordDao_callback = (res) =>{
    if (res.data.code === 200) {
      wx.showToast({
        title: res.data.data,
        success: () => {
          wx.redirectTo({
            url: '/packageTwoLeval/pages/myMoneyDetails/myMoneyDetails',
          })
        }
      })
    }
  }
  data = {
    bankArr: [],
    index: 0,
    cardId:"",
    recordTotal:0
  }
  onShow = function () {

  }
  onLoad = function (){
    self = this;
    comp.selecRecordDao.load()
    comp.selecBankDao.load();
  }
  //银行卡选择
  bindPickerChange = (e) => {
    self.setData({
      index: e.detail.value,
      cardId: self.data.bankArr[e.detail.value].id
    })
  }

  //提交数据
  onSave = (e) => {
    var formDatas = e.detail.value;
    formDatas.bankId = self.data.cardId;
    if (formDatas.amount > self.data.recordTotal){
      self.showMessage("输入金额大于最大提现额度");
      return;
    }
    comp.AddRecordDao.load(formDatas)
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
