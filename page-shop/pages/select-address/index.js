/**
 * 页面控制器
 */
class PageController{
  /**
   * 当页面显示的时候触发list对象的load方法
   */
  onShow=function(){
    this.selectComponent("#list").load();
  }

  onLoad=function(e){
    self=this;
    if(e.select!==""){
      self.selectComponent("#list").select(e.select);
    }
  }

  /**
   * 新增地址
   */
  addAddess= () =>{
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  }
  /**
   * 修改地址
   */
  editAddess= (e)=> {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  }
}

Page(new PageController());
