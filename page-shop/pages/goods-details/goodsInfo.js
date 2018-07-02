
import HttpUtil from '../../lib/trilobite/core/httputil.js'

//全局成员，解决小程序Es6 环境下function 和箭头函数不能相互调用问题，小程序事件写的稀烂，居然在Es6中必须使用function

let http;
let findgoodload;
let app = getApp();
/**
 * 物品价格详细组件
 */
class goodInfoComponent {

  constructor() {
    http = new HttpUtil(app);
    http.addResultListener(this.result);
  }

  result = (e) => {
    
    if (findgoodload.callback){
      findgoodload.callback(e.data.data[0]);
    }
    findgoodload.setData({ result: e.data.data[0] });
    findgoodload.setData({selectSizePrice:e.data.data[0].price});
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
    selectSizePrice:0,
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

    http.post("/Goods/FindGoodsById",
      {
        goodsId: id
      });
  }

  findSpecPrice=(item)=>{
    
    findgoodload.data.result.specs.map((items)=>{
       
        let a = 0;
        items.specList.map((specitem)=>{
          let bl = false;
          for (let i in item){
            bl=(item[i] === specitem.spec_value_id);
            if(bl){
              a++;
            }
          }
        });
        //当数据比较后数量和规格一致表示匹配
        //console.log(a, items.specList.length);
        if (a === items.specList.length) {
          if (findgoodload.selectProduct) {
            findgoodload.selectProduct(items);
          }
          findgoodload.setData({ selectSizePrice: items.price });
        }
    });
  }

  /**
   * 组件的方法列表
   */
  methods = {
    load: this.load,
    callback:this.callback,
    findSpecPrice: this.findSpecPrice
  }
}

Component(new goodInfoComponent());
