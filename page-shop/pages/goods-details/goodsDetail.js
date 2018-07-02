
import HttpUtil from '../../lib/trilobite/core/httputil.js'
var WxParse = require('../../wxParse/wxParse.js');
//全局成员，解决小程序Es6 环境下function 和箭头函数不能相互调用问题，小程序事件写的稀烂，居然在Es6中必须使用function
let self;
let app = getApp();
let comp;
/**
 * 物品价格详细组件
 */
class goodDetailComponent {

  constructor() {
    comp=this;
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
    result: {},
    isdetail:true,
    isprop:false,
  }
  /**
   * 加载图片列表
   */
  load = function (introf) {
    WxParse.wxParse('article', 'html', introf, this, 5);
  }
  /**
   * 切换显示
   */
  onTab=(e)=>{
    if(e===0){
      self.setData({
        isdetail: true,
        isprop: false
        });
    }
    if (e === 1) {
      self.setData({
        isdetail: false,
        isprop: true
      });
    }
  }

  ready =function(){
    this.selectComponent("#tabPage").config(["商品介绍", "属性"]);
    this.selectComponent("#tabPage").onTab = comp.onTab;
    self=this;
  }
  /**
   * 组件的方法列表
   */
  methods = {
    load: this.load,
  }
}

Component(new goodDetailComponent());
