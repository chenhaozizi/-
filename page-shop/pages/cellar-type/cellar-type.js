// pages/cellar-detail/cellar-detail.js
var app = getApp()
var self, comp;
import HttpUtil from '../../lib/trilobite/core/httputil.js'


/*
 * 藏酒列表访问
*/
class cellarTypeListDao {
  //POST /EsCart/checkGoods//
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
  load = (status) => {
    this.http.post("/EsMemberCellarOrderExt/findList", { openId: app.globalData.userInfo.unionid, status: status})
  }
}
/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.cellarTypeListDao = new cellarTypeListDao();
    comp.cellarTypeListDao.callback = this.cellarTypeListDao_callback;
  }
  cellarTypeListDao_callback = (res) => {
    
     self.setData({ cellarTypeList: res.data.data });
     console.log(self.data.cellarTypeList)
  }
  // 初始化数据
  data={
    statusType: [ "待收货", "已发货"],
    currentType: 0,
    tabClass: ["", "", ""],
    cellarTypeList:[]
    
  }
  // 点击切换
  statusTap=(e)=> {
    var curType = e.currentTarget.dataset.index;
    self.data.currentType = curType
    self.setData({
      currentType: curType
    });
    if (self.data.currentType === 0) {
      comp.cellarTypeListDao.load(1);
    }
    if (self.data.currentType === 1) {
      comp.cellarTypeListDao.load(2);
    }
    
  }
  // 看详情
  toDetailsTap=(e)=> {
    wx.navigateTo({
      url: "/pages/cellar-type-detail/cellar-type-detail?id=" + e.currentTarget.dataset.id
    })
  }
  /**
   * 当页面显示的时候触发list对象的load方法
   */
  onShow = function () {

    //this.selectComponent("#list").load();
  }
  onLoad = function () {
    self = this;
    comp.cellarTypeListDao.load(1);
  }
}

Page(new PageController());