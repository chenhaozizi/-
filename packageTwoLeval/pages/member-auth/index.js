import HttpUtil from '../../../lib/trilobite/core/httputil.js'
let comp,self;
const app = getApp();
/*
 * 会员认证查询
*/
class MemberAuthSelectOneDao {
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
   * 
   * 
   * 加载接口
   */
  load = () => {
    this.http.post("/EsMemberIdcard/FindByMemeberId", { memberId:10308})
  }
}
/*
 * 会员认证修改
*/
class MemberAuthAddDao {
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
    this.http.post("/EsMemberIdcard/save", { memberId: 10308,...e })
  }
}

/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.memberAuthSelectOneDao = new MemberAuthSelectOneDao();
    comp.memberAuthSelectOneDao.callback =this. memberAuthSelectOneDao_callback;
    comp.memberAuthAddDao=new MemberAuthAddDao();
    comp.memberAuthAddDao.callback=this.save_callback;
  }

  save_callback=(e)=>{
    console.log(e)
    if(e.data.code==200){
      comp.showMessage(e.data.data);
      comp.memberAuthSelectOneDao.load();
    }

  }
  
  data={
    result:{},
    update1:false,
    update2:false
   // update:false
  }

  memberAuthSelectOneDao_callback=(res)=>{
    console.log(res)
    if (res.data.data[0]){
      console.log(res.data.data)
      // self.data.update=true;
      self.setData({ result: res.data.data[0], update1:true,update2:true})
    }
     
  }

  uploadImage=(e)=>{
    let imgCase=e.currentTarget.dataset.type;
    console.log(e.currentTarget.dataset);
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://mingjiu-api.conpanda.cn/fileserver/uploadImage', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = (JSON.parse(res.data)).remoteUrl;
            let rest = self.data.result;
            if (imgCase==="1"){
              rest.idcardFront = data;
              
              self.setData({ result: rest, update1: true })
            }else{
              rest.idcardBack = data;
            
              self.setData({ result: rest, update2: true })
            }
            
          }
        })
      }
    })
  }

  showMessage = (m) => {
    wx.showModal({
      title: '提示',
      content: m,
      showCancel: false
    })
  }

  onSave=(e)=>{
    let info= e.detail.value;
    console.log(info);
    if(info.name===""){
      comp.showMessage("身份证姓名不能为空")
      return;
    }
    console.log(info.idcardNo, info.tel,info)
    if (info.tel === "" || info.tel.length < 11) {
      comp.showMessage("请填写正确的手机号码")
      return;
    }
   
    if (info.idcardNo === "" || info.idcardNo.length<18) {
      comp.showMessage("请输入正确的身份证号")
      return;
    }
    if (info.idcartFront === "") {
      comp.showMessage("身份证正面未进行上传")
      return;
    }
    if (info.idcartBack === "") {
      comp.showMessage("身份证背面未进行上传")
      return;
    }
      comp.memberAuthAddDao.load(info);
  }

  onShow=function(){
    
  }
  /**
   * 加载的时候
   */
  onLoad=function(){
     self=this;
     comp.memberAuthSelectOneDao.load();
  }
  /**
   * 返回上个页面
   */
  toBack=(e)=>{
    wx.navigateBack();
  }

}

Page(new PageController());
