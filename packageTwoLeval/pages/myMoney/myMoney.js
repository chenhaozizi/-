import HttpUtil from '../../../lib/trilobite/core/httputil.js'
import ymdDatejw from '../../../lib/trilobite/core/ymdDatejw.js'
let comp, self;
const app = getApp();

/*
 * 单子查询
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
  load = (e) => {
    if(e){
      this.http.post("/RsTradeRecord/FindTradeRecordsPage", { memberId: wx.getStorageSync("memberId"), pageNumber: e.pages, pageSize: 5, tradeTypeCode:e.recordid})
    }else{
      // this.http.post("/RsTradeRecord/FindTradeRecordsPage", { memberId: wx.getStorageSync("memberId"), pageNumber: self.data.pages, pageSize: 4})
    }
  }
}

/*
 * 收益查询
*/
class FindFinanceStat {

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
    this.http.post("/RsMember/FindFinanceStat", { memberId: wx.getStorageSync("memberId")})
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
    comp.FindFinanceStat = new FindFinanceStat();
    comp.FindFinanceStat.callback = this.FindFinanceStat_callback;
    comp.jw = new ymdDatejw(app);
  }
  bindPickerChange = (e) => {
    console.log('picker发送选择改变，携带值为', e.detail.value,e)
    self.setData({result:[]})
    if (e.detail.value == 0){
      self.setData({
        index: e.detail.value,
        recordid: '',
        pages: 1
      })
    }else{
      self.setData({
        index: e.detail.value,
        recordid: self.data.array[e.detail.value].id,
        pages: 1
      })
    }
    comp.FindTradeRecordsPage.load(self.data);
  }
  moreinfo = (e) => {
    console.log(self.data.result[e.currentTarget.dataset.everyone].targetId,77777)
    if(self.data.result[e.currentTarget.dataset.everyone].tradeName == '提现'){
      wx.navigateTo({
        url: '../myMoneyDetails/myMoneyDetails?currentdata=' + self.data.result[e.currentTarget.dataset.everyone].targetId,
      })
    }
  }

  /**
   * 页面的初始数据
   */
  data ={
    a: [1, 2, 3],
    index: 0,
    array: [{ id:0,name: '选择账单类型' }, { id:2002,name: '提成' }, { id:2003,name: '返利' }, { id:2001,name: '提现'}],
    recordid:'',
    result:[],
    money:[],
    pages:1
  }

  FindTradeRecordsPage_callback = (res) => {
    console.log(res)
    if (res.data.code == 200) {
      console.log(res.data.data)
      for (let i = 0; i < res.data.data.length; i++){
        res.data.data[i].createDate = self.jw.fmtDate(res.data.data[i].createDate)
      }
      
      self.setData({ result: self.data.result.concat(res.data.data) })
      console.log(self.data.result)
    }
  }

  FindFinanceStat_callback = (res) => {
    // console.log(res)
    if (res.data.code == 200) {
      // console.log(res.data.data)
      self.setData({ money: res.data.data })
    }
  }

  /**
   * 加载的时候
   */
  onLoad = function () {
    self = this;
    comp.FindTradeRecordsPage.load(self.data);
    comp.FindFinanceStat.load();
  }
  // 上拉事件
  searchScrollLower = function () {
    console.log("上拉")
    self.setData({ pages:self.data.pages+1 })
    comp.FindTradeRecordsPage.load(self.data);
  }
}

Page(new PageController());
