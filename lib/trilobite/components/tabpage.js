let self;
/**
 * tab 页组件
 */
class TabPageComponent {

  constructor() {

  }
  /**
   * 组件的属性列表
   */
  properties = {

  }

  /**
   * 组件的初始数据
   */
  data = {
    statusType: ["未定义"],
    currentType: 0,
  }
  /**
   * 加载图片列表
   */
  config = function (conf) {
    self.setData({
      statusType: conf
    });
  }
  ready=function()
  {  
      self=this;
  }

  statusTap=(e)=>{
    
     var curType = e.currentTarget.dataset.index;
     if (self.onTab){
       self.onTab(curType);
     }
    
     self.setData({
       currentType: curType
     });
  }
  /**
   * 组件的方法列表
   */
  methods = {
    config: this.config,  
    statusTap:this.statusTap
  }
}

Component(new TabPageComponent());
