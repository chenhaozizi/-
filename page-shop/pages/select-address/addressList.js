
import HttpUtil from '../../lib/trilobite/core/httputil.js'

//全局成员，解决小程序Es6 环境下function 和箭头函数不能相互调用问题，小程序事件写的稀烂，居然在Es6中必须使用function

let http;
let addrlistload;
let app = getApp();
let comp;
let defaddr;
/**
 * 地址列表组件
 */
class addressListComponent{

  constructor(){
    comp=this;
    http=new HttpUtil(app);
    http.addResultListener(this.result);
    defaddr = new HttpUtil(app);
    defaddr.addResultListener(this.defaddrResult);
    
  }
  
  defaddrResult=(e)=>{
    if(e.data.code===200){
       wx.navigateBack()
    }

  }

  result=(e)=>{
     console.log(e.data.data);
     addrlistload.setData({ result: e.data.data });
  }
  /**
   * 组件的属性列表
   */
  properties= {
    
  }

  /**
   * 组件的初始数据
   */
  data ={
    result:{},
    saveHidden: true
  }
  /**
   * 加载地址列表
   */
  load=function(){
     addrlistload=this;
     http.post("/EsMemberAddress/FindByMemberId", 
     {
        memberId: app.globalData.userInfo.memberId
     });
  }
  /**
   * 进入修改
   */
  selectTap=(e)=>{
    // console.log(e);
    if(comp.backurl){
      defaddr.post("/EsMemberAddress/UpdateDefault", {
        memberId:app.globalData.userInfo.memberId,
        id: e.currentTarget.dataset.id,
        });
      
    }
  }

  editAddess=(e)=>{
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  }

  select=(e)=>{
    comp.backurl=e;
    
  }
  /**
   * 组件的方法列表
   */
  methods={
     load:this.load,
     editAddess:this.editAddess,
     selectTap:this.selectTap,
     select:this.select,
  }
}

Component(new addressListComponent());
