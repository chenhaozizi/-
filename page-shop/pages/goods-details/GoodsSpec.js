
import HttpUtil from '../../lib/trilobite/core/httputil.js'

let self;
let app = getApp();
let comp;
let specurl ="/EsSpecification/FindByGoodsId";
let specvalurl ="/EsSpecValues/FindByGoodsId";
let spechttp;
let specvaluehttp;
/**
 * 物品价格详细组件
 */
class GoodsSpecComponent {

  constructor() {
    comp = this;
    spechttp = new HttpUtil(app);
    spechttp.addResultListener(this.specresult);
    
  }
  /**
   * 规格数据
   */
  specresult=(res)=>{
    let items = res.data.data;
   
    function callback(){
       console.log(items);
        self.setData({
          spec: items
        })
    }

    for(let item in items){
        items[item].goodsId = this.goodsId;
        comp.mustselect = items.length;
        if(item==items.length){
           this.dispSpecDetail(items[item])
        }else{
           this.dispSpecDetail(items[item],callback)
        }
    }
  }
  /**
   * 显示规格详细数据
   */
  dispSpecDetail= (item,callback) => {
    specvaluehttp = new HttpUtil(app);
    specvaluehttp.addResultListener((res)=>{
      item.detail = res.data.data;
      if (callback){
          callback();
      }
    }); 
    specvaluehttp.post(specvalurl, {
      goodsId: parseInt(item.goodsId),
      specId: parseInt(item.specId)
     });
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
    spec: {},
  }
  /**
   * 加载规格列表
   */
  load = function (e) {
     self = this;
     comp.goodsId=e.id;
     comp.spids={};
     comp.selected={};
     spechttp.post(specurl, {goodsId: e.id})
  }
  /**
   * 当规格按钮点击时执行规格的组合算法
   */
  onTap=(e)=>{
    let svid=e.currentTarget.dataset.spacvalueid;
    let spid = e.currentTarget.dataset.specid;
    comp.spids[spid] = svid
    
    
    if (!comp.selected[spid]){
      comp.selected[spid] = {};
    }
    let len = 0;
    for (let s in comp.spids) {
      len++;
    }
    if (comp.selected[spid][svid]===undefined){
      comp.selected[spid]={};
      comp.selected[spid][svid] = "active"
    }else{
      comp.selected[spid] = undefined;
      len=0;
    }
   
    self.setData({ selected: comp.selected});
    if(self.specPrice){
      self.specPrice(len === comp.mustselect, comp.spids);
    }
  }

  /**
   * 组件的方法列表
   */
  methods = {
    load: this.load,
    onTap:this.onTap,
  }
}

Component(new GoodsSpecComponent());
