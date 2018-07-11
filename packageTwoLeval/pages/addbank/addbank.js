
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
//添加银行卡
class AddBankDao {

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
    this.http.post("/RsMemberBank/Add", {memberId:wx.getStorageSync("memberId"),...e})

  }

}

class PageController {
  constructor() {
    comp = this;
    comp.selecBankDao = new selecBankDao();
    comp.selecBankDao.callback = this.selecBankDao_callback;
    comp.AddBankDao = new AddBankDao();
    comp.AddBankDao.callback = this.AddBankDao_callback;
  }
  //添加银行卡回调
  AddBankDao_callback = (e) =>{
        if (e.data.code === 200) {
          wx.showToast({
            title: e.data.data,
            success: () => {
              wx.redirectTo({
                url: '/packageTwoLeval/pages/bindbank/index',
              })
            }
          })
    }
}
  // 支持银行
  selecBankDao_callback = (res) =>{
    console.log(JSON.stringify(res.data.data));
    self.setData({
      bankArr:res.data.data,
    })
  }
  data = {
    bankArr:[],
    index: 0,
    carid:""
  }
  onShow = function () {
   
  }
  onLoad = function () {
    self = this;
    comp.selecBankDao.load();
  }
  //银行卡选择
  bindPickerChange = (e) => {
    console.log('picker发送选择改变，携带值为', e.detail.value, e)
    self.setData({
      index: e.detail.value,
      carid: self.data.bankArr[e.detail.value].code
    })
  }
 
  //提交数据
  onSave = (e) =>{
    var bankcode;
    var formDatas = e.detail.value;
    
    if (formDatas.cardNumber == "" || formDatas.cardNumber.length < 16 || formDatas.cardNumber.length > 19) {
        self.showMessage("请填写正确的银行卡号")
    return ;
     }
    if (formDatas.accountBank === ''){
      self.showMessage("开户行不能为空");
      return;
    }
    formDatas.bankCode = self.data.carid;
    if (formDatas.accountName === ''){
      self.showMessage("开户行姓名不能为空");
      return;
    }
    if (formDatas.isDefault){
      formDatas.isDefault = 1;
    }else{
      formDatas.isDefault = 0;
    }
    comp.AddBankDao.load(formDatas)

    console.log(formDatas)
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
