
import HttpUtil from '../../lib/trilobite/core/httputil.js'

//全局成员，解决小程序Es6 环境下function 和箭头函数不能相互调用问题，小程序事件写的稀烂，居然在Es6中必须使用function

let http;
let findgoodload;
let app = getApp();
/**
 * 地址列表组件
 */
class goodImagesComponent {

  constructor() {
    http = new HttpUtil(app);
    http.addResultListener(this.result);
  }
  result = (e) => {
    findgoodload.setData({ result: e.data.data });
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
    autoplay: true,
    interval: 3000,
    duration: 1000,
    swiperCurrent: 0,
  }
  /**
   * 加载图片列表
   */
  load = function (id) {
    findgoodload = this;
    
    http.post("/Goods/FindGoodsImages",
    {
        goodsId: id
    });
  }
  swiperchange=(e)=>{
    findgoodload.setData({
        swiperCurrent: e.detail.current  
    })  
  }
  
  /**
   * 组件的方法列表
   */
  methods = {
    load: this.load,
    swiperchange:this.swiperchange
  }
}

Component(new goodImagesComponent());
