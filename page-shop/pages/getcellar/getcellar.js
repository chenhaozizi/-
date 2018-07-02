import HttpUtil from '../../lib/trilobite/core/httputil.js'
let comp, self;
const app = getApp();
/*
 * 地址查詢
*/
class addListDao {
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
    this.http.post("/EsMemberCellarExt/getMemberAddr", { openId: app.globalData.userInfo.unionid })
  }

}
// 确认提酒
class getcallarDao {
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
    this.http.post("/EsMemberCellarExt/pickWine", {
      openId: app.globalData.userInfo.unionid,
      addrId: self.data.addrId,
      json:self.data.jsons,
      remark: self.data.remarks
    })
  }

}

/**
 * 页面控制器 
 */
class PageController {
  constructor() {
    comp = this;
    comp.addListDao = new addListDao();
    comp.addListDao.callback = this.addListDao_callback;
    comp.getcallarDao = new getcallarDao();
    comp.getcallarDao.callback = this.getcallarDao_callback;
   
  }
  data = {
    addList: {},
    curAdd:0,
    remarks:'',
    jsons:[],
    addrId:''
  }
  //读取地址数据处理
  addListDao_callback = (res) => {
    if (res.data.data.length > 0) {
      self.setData({ addList: res.data.data})
     }
  }
  // 选地址
  selectAdd = (e) =>{
    self.setData({
      curAdd: e.currentTarget.dataset.index,
      addrId: e.currentTarget.dataset.id
    });
  } 
  
  //获取文本域的内容
  bindTextAreaBlur = (e) =>{
    self.setData({
      remarks: e.detail.value
    });
  }
  //确认提酒处理数据
  getcallarDao_callback = (res) =>{
    if(res.data.code === 200){
      wx.showToast({
        title: '提取成功',
        icon: 'success',
        duration: 2000
      }) 
      setTimeout(function(){
        wx.navigateTo({
          url: '/pages/cellar-type/cellar-type'
        })
      },2000)
    }else{
      wx.showModal({
        title: '提示',
        content: '提取失败',
        showCancel: false
      })
    }
  }
  /**
     * 新增地址
     */
  addAddess = () => {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  }
//确认提酒
confirmGetcellar = () =>{
  comp.getcallarDao.load();
}
  onShow = function () {
    comp.addListDao.load();
  }
  /**
  * 加载的时候
  */
  onLoad = function (options) {
    self = this;
    self.setData({
      jsons: options.jsons
    })
  }
} 

Page(new PageController());
