import HttpUtil from '../../lib/trilobite/core/httputil.js'
import fmtDate from '../../lib/trilobite/core/fmtDate.js'
let comp, self;
const app = getApp();
/*
 * 藏酒查詢
*/
class cellarDao {

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
    this.http.post("/EsMemberCellarExt/findList", { openId: app.globalData.userInfo.unionid })

  }

}




/**
 * 页面控制器 
 */
class PageController {
  constructor() {
    comp = this;
    comp.cellarDao = new cellarDao();
    comp.cellarDao.callback = this.cellarDao_callback;

    this.fmtDate = new fmtDate(app);
    
  }
  data = {
    allNum:"",
    allMoney:'',
    cellarList:{},
    getflag:false,
    falgtetx:'藏酒提取',
    btntetx:'添加藏酒'
    
  }
  //数据渲染
  cellarDao_callback = (res) => {
    if (res.data.data.esMemberCellarList.length>0) {
       var datearr = res.data.data.esMemberCellarList;
   
      for (var i =0;i<datearr.length;i++) {
         datearr[i].keepTime =this.fmtDate.fmtDate(datearr[i].keepTime);
         datearr[i].inputnum=1;
         datearr[i].isCheck = false;
      }
      self.setData({ cellarList: res.data.data.esMemberCellarList, allMoney: res.data.data.totalPrice,allNum:res.data.data.totalStore })
    }
  }
//  提取藏酒按钮
  getcell=()=>{
    if (self.data.getflag == true){
      self.setData({ getflag: false, btntetx: '添加藏酒', falgtetx:'藏酒提取'})
    } else { 
      self.setData({ getflag: true, btntetx: '确认提取', falgtetx:'取消提取' })

    }
  }
  //选择商品
  checkgood = (e) => {
    var index = e.currentTarget.dataset.index;
    var list = self.data.cellarList;
    if (index !== "" && index != null) {
      list[parseInt(index)].isCheck = !list[parseInt(index)].isCheck;
        self.setData({ cellarList: self.data.cellarList })
    }
  }
  //减少商品
  desnum = (e) => {
    var index = e.currentTarget.dataset.index;
    var list = self.data.cellarList;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].inputnum > 1) {
        list[parseInt(index)].inputnum = list[parseInt(index)].inputnum -1;
          self.setData({ cellarList: self.data.cellarList })
        }
      }
    }
  //添加商品
  addnum = (e) => {
    var index = e.currentTarget.dataset.index;
    var list = self.data.cellarList;
    if (index !== "" && index != null) {
      if (list[parseInt(index)].inputnum < list[parseInt(index)].store )  {
        list[parseInt(index)].inputnum = list[parseInt(index)].inputnum + 1;
        self.setData({ cellarList: self.data.cellarList })
      }
    }
  }
  

  onShow = function () {
    comp.cellarDao.load();
  }
  /**
 * 到首页
 */

  okbtnfn = () => {
    if (!self.data.getflag){
    wx.switchTab({
      url: "/pages/index/index"
    });
    }
    var jsondata =[];
    var list = self.data.cellarList;
    for(var i = 0 ;i<list.length;i++){
      if (list[i].isCheck){
        let checkarr = { "cellarId": list[i].cellarId, "num": list[i].inputnum };
        jsondata.push(checkarr);
       
      }
    }
    jsondata = JSON.stringify(jsondata);
    if (self.data.getflag == true && jsondata.length>0){
      wx.navigateTo({
        url: '/pages/getcellar/getcellar?jsons='+jsondata
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请至少选择一件商品',
        showCancel: false
      })
    }
  }
  /**
   * 加载的时候
   */
  onLoad = function () {
    self = this;

  }
  

}

Page(new PageController());
