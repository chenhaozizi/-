//index.js
//获取应用实例
import HttpUtil from '../../lib/trilobite/core/httputil.js'

var app = getApp();

let self;
let comp;
/**
 * 获取购物车的数量
 */
class CartNumAction{
   constructor(){
     this.http = new HttpUtil(app);
     this.http.addResultListener(this.result);
   }
   result=(res)=>{
     if(this.callback){
       this.callback(res);
     }
   }
   /**
    * 加载接口
    */
   load=()=>{
     this.http.post("/EsCart/cartNum", { memberId: app.globalData.userInfo.memberId})
   }
}

/**
 * 放入到购物车
 */
class CartSaveAction {
  constructor() {
    this.http = new HttpUtil(app);
    this.http.addResultListener(this.result);
  }
  result = (res) => {
    if (res.data.code === 412) {
      wx.showModal({
        title: '提示',
        content: res.data.message,
        showCancel: false
      })
    } else {
      if (this.callback) {
        this.callback(res);
      }
    }
    
  }
  /**
   * 加载接口
   */
  load = (productId) => {
    
    this.http.post("/EsCart/AddGoods", { memberId: app.globalData.userInfo.memberId, productId: productId,num:1 })
  }
}


class PageController {
  constructor()
  {
    comp=this;
    this.CartNumAction=new CartNumAction();
    this.CartNumAction.callback=(res)=>{
        self.setData({cartnum:res.data.data});
    }
    this.CartSaveAction=new CartSaveAction();
    this.CartSaveAction.callback=(res)=>{
     
     this.CartNumAction.load();
      
    }

    ///EsCart/cartNum ? memberId = 10022
  }
  goodsInfoCallback=function(e){
     
  }
  data={
    selected:false,
    pitem:{},
    cartnum:1,
  }
  /**
   * 选中的产品
   */
  selectProdcut=(item)=>{
    //console.log("选中的产品",item)
    comp.data.pitem=item;
  }
  specPrice=(iscomplet,data)=>{
    if(iscomplet){
      self.selectComponent("#goodsinfo").selectProduct = comp.selectProdcut;
      self.selectComponent("#goodsinfo").findSpecPrice(data);
      comp.data.selected = true;
    }else{
      comp.data.selected=false;
    }
    
  }
  /**
   * 加入到购物车
   */
  toAddShopCar=(e)=>{
     if(comp.data.selected){
       console.log(comp.data.pitem)
       comp.CartSaveAction.load(comp.data.pitem.product_id);
     }else{
       wx.showModal({
         title: '提示',
         content: '未完成选择商品，不能加入到购物车',
         showCancel: false
       })
     }
  }
  goShopCart=(e)=>{
    wx.switchTab({
      url: "/pages/shop-cart/index"
    })
  }

  onLoad=function(e){
    self=this;
    self.loadparam=e;
  }
  onShow=function(e){
    this.selectComponent("#goodsimages").load(self.loadparam.id);
    this.selectComponent("#goodsinfo").callback = (e) => {
      this.selectComponent("#goodsDetail").load(e.intro);
    }
    this.selectComponent("#goodsSpec").specPrice = comp.specPrice;
    this.selectComponent("#goodsSpec").load(self.loadparam);

    this.selectComponent("#goodsinfo").load(self.loadparam.id);
    comp.CartNumAction.load();
  }
}

Page(new PageController());


// function dispSpecDetail(item,fun){
//   ///EsSpecValues/FindByGoodsId
//   wx.request({
//     url: app.globalData.Domain + '/EsSpecValues/FindByGoodsId',
//     data: {
//       goodsId: item.goodsId,
//       specId:item.specId,
//     },
//     method: "POST",
//     header: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     success: function (res) {
//       item.detail=res.data.data;  
//       if(fun){
//         fun();
//       }
//     }
//   }
//   )
// }

// /**
//  * 显示规格
//  */
// function dispSpec(that,e){
//   wx.request({
//     url: app.globalData.Domain + '/EsSpecification/FindByGoodsId',
//     data: {
//       goodsId: e.id,
//     },
//     method: "POST",
//     header: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     success: function (res) {
      
//       var product = {};
//       var param={id:e.id,sid:0}
      
//       var items=res.data.data;

//       function callback(){
//         that.setData({
//           spec: items
//         })
//       }

//       for(var item in items){
//         items[item].goodsId=e.id;
//         if(item==items.length){
//            dispSpecDetail(items[item])
//         }else{
//            dispSpecDetail(items[item],callback)
//         }
       
//       }
     
     
//       // if (res.data.data.length > 0) {
//       //   product = res.data.data[0];
//       // }
//       // that.setData({
//       //   goodsDetail: product,
//       //   selectSizePrice: product.price,
//       //   // totalScoreToPay: res.data.data.basicInfo.minScore,
//       //   // buyNumMax:res.data.data.basicInfo.stores,
//       //   //buyNumber:(res.data.data.basicInfo.stores>0) ? 1: 0
//       // });
     
//     }
//   }
//   )
// }


// Page({
//   data: {
//     autoplay: true,
//     interval: 3000,
//     duration: 1000,
//     goodsDetail:{},
//     swiperCurrent: 0,  
//     hasMoreSelect:false,
//     selectSize:"选择：",
//     selectSizePrice:0,
//     totalScoreToPay: 0,
//     shopNum:0,
//     hideShopPopup:true,
//     buyNumber:0,
//     buyNumMin:1,
//     buyNumMax:0,

//     propertyChildIds:"",
//     propertyChildNames:"",
//     canSubmit:false, //  选中规格尺寸时候是否允许加入购物车
//     shopCarInfo:{},
//     shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
//   },

//   //事件处理函数
//   swiperchange: function(e) {
//       //console.log(e.detail.current)
//        this.setData({  
//         swiperCurrent: e.detail.current  
//     })  
//   },
//   onLoad: function (e) {
//     if (e.inviter_id) {
//       wx.setStorage({
//         key: 'inviter_id_' + e.id,
//         data: e.inviter_id
//       })
//     }
//     var that = this;
//     // 获取购物车数据
//     wx.getStorage({
//       key: 'shopCarInfo',
//       success: function(res) {
//         that.setData({
//           shopCarInfo:res.data,
//           shopNum:res.data.shopNum
//         });
//       } 
//     })
//     wx.request({
//       url: app.globalData.Domain + '/Goods/FindGoodsImages',
//       data: {
//         goodsId: e.id,
//       },
//       method: "POST",
//       header: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       },
//       success: function(res) {
//         console.log("参数："+e.id);
//         var selectSizeTemp = "";
//         // if (res.data.data.properties) {
//         //   for(var i=0;i<res.data.data.properties.length;i++){
//         //     selectSizeTemp = selectSizeTemp + " " + res.data.data.properties[i].name;
//         //   }
//         //   that.setData({
//         //     hasMoreSelect:true,
//         //     selectSize:that.data.selectSize + selectSizeTemp,
//         //     selectSizePrice:res.data.data.basicInfo.minPrice,
//         //     totalScoreToPay: res.data.data.basicInfo.minScore
//         //   });
//         // }
//         //that.data.goodsDetail = res.data.data;
//         // if (res.data.data.basicInfo.videoId) {
//         //   that.getVideoSrc(res.data.data.basicInfo.videoId);
//         // }
//         that.setData({
//           goodsImages:res.data.data,
//           //selectSizePrice:res.data.data.basicInfo.minPrice,
//          // totalScoreToPay: res.data.data.basicInfo.minScore,
//          // buyNumMax:res.data.data.basicInfo.stores,
//           //buyNumber:(res.data.data.basicInfo.stores>0) ? 1: 0
//         });
        
//       }
//     })

//     wx.request({
//       url: app.globalData.Domain + '/Goods/FindGoodsById',
//       data: {
//         goodsId: e.id,
//       },
//       method: "POST",
//       header: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       },
//       success: function (res) {
//         console.log("商品价格", res.data.data)
//         var product={};
//         if (res.data.data.length>0){
//           product = res.data.data[0];
//         }
//         that.setData({
//           goodsDetail: product,
//           selectSizePrice: product.price,
//           // totalScoreToPay: res.data.data.basicInfo.minScore,
//           // buyNumMax:res.data.data.basicInfo.stores,
//           //buyNumber:(res.data.data.basicInfo.stores>0) ? 1: 0
//         });
//         WxParse.wxParse('article', 'html', product.intro, that, 5);
//       }
//     }
//     )
    
//     dispSpec(that, e);

//     this.reputation(e.id);
//     this.getKanjiaInfo(e.id);
//   },
//   goShopCar: function () {
//     wx.reLaunch({
//       url: "/pages/shop-cart/index"
//     });
//   },
//   toAddShopCar: function () {
//     this.setData({
//       shopType: "addShopCar"
//     })
//     this.bindGuiGeTap();
//   },
//   tobuy: function () {
//     this.setData({
//       shopType: "tobuy"
//     });
//     this.bindGuiGeTap();
//     /*    if (this.data.goodsDetail.properties && !this.data.canSubmit) {
//           this.bindGuiGeTap();
//           return;
//         }
//         if(this.data.buyNumber < 1){
//           wx.showModal({
//             title: '提示',
//             content: '暂时缺货哦~',
//             showCancel:false
//           })
//           return;
//         }
//         this.addShopCar();
//         this.goShopCar();*/
//   },  
//   /**
//    * 规格选择弹出框
//    */
//   bindGuiGeTap: function() {
//      this.setData({  
//         hideShopPopup: false 
//     })  
//   },
//   /**
//    * 规格选择弹出框隐藏
//    */
//   closePopupTap: function() {
//      this.setData({  
//         hideShopPopup: true 
//     })  
//   },
//   numJianTap: function() {
//      if(this.data.buyNumber > this.data.buyNumMin){
//         var currentNum = this.data.buyNumber;
//         currentNum--; 
//         this.setData({  
//             buyNumber: currentNum
//         })  
//      }
//   },
//   numJiaTap: function() {
//      if(this.data.buyNumber < this.data.buyNumMax){
//         var currentNum = this.data.buyNumber;
//         currentNum++ ;
//         this.setData({  
//             buyNumber: currentNum
//         })  
//      }
//   },
//   /**
//    * 选择商品规格
//    * @param {Object} e
//    */
//   labelItemTap: function(e) {
//     var that = this;
//     /*
//     console.log(e)
//     console.log(e.currentTarget.dataset.propertyid)
//     console.log(e.currentTarget.dataset.propertyname)
//     console.log(e.currentTarget.dataset.propertychildid)
//     console.log(e.currentTarget.dataset.propertychildname)
//     */
//     // 取消该分类下的子栏目所有的选中状态
//     var childs = that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods;
//     for(var i = 0;i < childs.length;i++){
//       that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
//     }
//     // 设置当前选中状态
//     that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[e.currentTarget.dataset.propertychildindex].active = true;
//     // 获取所有的选中规格尺寸数据
//     var needSelectNum = that.data.goodsDetail.properties.length;
//     var curSelectNum = 0;
//     var propertyChildIds= "";
//     var propertyChildNames = "";
//     for (var i = 0;i < that.data.goodsDetail.properties.length;i++) {
//       childs = that.data.goodsDetail.properties[i].childsCurGoods;
//       for (var j = 0;j < childs.length;j++) {
//         if(childs[j].active){
//           curSelectNum++;
//           propertyChildIds = propertyChildIds + that.data.goodsDetail.properties[i].id + ":"+ childs[j].id +",";
//           propertyChildNames = propertyChildNames + that.data.goodsDetail.properties[i].name + ":"+ childs[j].name +"  ";
//         }
//       }
//     }
//     var canSubmit = false;
//     if (needSelectNum == curSelectNum) {
//       canSubmit = true;
//     }
//     // 计算当前价格
//     if (canSubmit) {
//       wx.request({
//         url: 'https://api.it120.cc/'+ app.globalData.subDomain +'/shop/goods/price',
//         data: {
//           goodsId: that.data.goodsDetail.basicInfo.id,
//           propertyChildIds:propertyChildIds
//         },
//         success: function(res) {
//           that.setData({
//             selectSizePrice:res.data.data.price,
//             totalScoreToPay: res.data.data.score,
//             propertyChildIds:propertyChildIds,
//             propertyChildNames:propertyChildNames,
//             buyNumMax:res.data.data.stores,
//             buyNumber:(res.data.data.stores>0) ? 1: 0
//           });
//         }
//       })
//     }

    
//     this.setData({
//       goodsDetail: that.data.goodsDetail,
//       canSubmit:canSubmit
//     })  
//   },
//   /**
//   * 加入购物车
//   */
//   addShopCar:function(){
//     if (this.data.goodsDetail.properties && !this.data.canSubmit) {
//       if (!this.data.canSubmit){
//         wx.showModal({
//           title: '提示',
//           content: '请选择商品规格！',
//           showCancel: false
//         })       
//       }
//       this.bindGuiGeTap();
//       return;
//     }
//     if(this.data.buyNumber < 1){
//       wx.showModal({
//         title: '提示',
//         content: '购买数量不能为0！',
//         showCancel:false
//       })
//       return;
//     }
//     //组建购物车
//     var shopCarInfo = this.bulidShopCarInfo();

//     this.setData({
//       shopCarInfo:shopCarInfo,
//       shopNum:shopCarInfo.shopNum
//     });

//     // 写入本地存储
//     wx.setStorage({
//       key:'shopCarInfo',
//       data:shopCarInfo
//     })
//     this.closePopupTap();
//     wx.showToast({
//       title: '加入购物车成功',
//       icon: 'success',
//       duration: 2000
//     })
//     //console.log(shopCarInfo);

//     //shopCarInfo = {shopNum:12,shopList:[]}
//   },
// 	/**
// 	  * 立即购买
// 	  */
//   buyNow:function(){
//     if (this.data.goodsDetail.properties && !this.data.canSubmit) {
//       if (!this.data.canSubmit) {
//         wx.showModal({
//           title: '提示',
//           content: '请选择商品规格！',
//           showCancel: false
//         })
//       }
//       this.bindGuiGeTap();
//       wx.showModal({
//         title: '提示',
//         content: '请先选择规格尺寸哦~',
//         showCancel:false
//       })
//       return;
//     }    
//     if(this.data.buyNumber < 1){
//       wx.showModal({
//         title: '提示',
//         content: '购买数量不能为0！',
//         showCancel:false
//       })
//       return;
//     }
//     //组建立即购买信息
//     var buyNowInfo = this.buliduBuyNowInfo();
//     // 写入本地存储
//     wx.setStorage({
//       key:"buyNowInfo",
//       data:buyNowInfo
//     })
//     this.closePopupTap();

//     wx.navigateTo({
//       url: "/pages/to-pay-order/index?orderType=buyNow"
//     })    
//   },
//   /**
//    * 组建购物车信息
//    */
//   bulidShopCarInfo: function () {
//     // 加入购物车
//     var shopCarMap = {};
//     //shopCarMap.goodsId = this.data.goodsDetail.id;
//     shopCarMap.pic = this.data.goodsDetail.small;
//     shopCarMap.name = this.data.goodsDetail.name;
//     // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
//     shopCarMap.propertyChildIds = this.data.propertyChildIds;
//     shopCarMap.label = this.data.propertyChildNames;
//     shopCarMap.price = this.data.selectSizePrice;
//     shopCarMap.score = this.data.totalScoreToPay;
//     shopCarMap.left = "";
//     shopCarMap.active = true;
//     shopCarMap.number = this.data.buyNumber;
//     shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
//     shopCarMap.logistics = this.data.goodsDetail.logistics;
//     shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

//     var shopCarInfo = this.data.shopCarInfo;
//     if (!shopCarInfo.shopNum) {
//       shopCarInfo.shopNum = 0;
//     }
//     if (!shopCarInfo.shopList) {
//       shopCarInfo.shopList = [];
//     }
//     var hasSameGoodsIndex = -1;
//     for (var i = 0; i < shopCarInfo.shopList.length; i++) {
//       var tmpShopCarMap = shopCarInfo.shopList[i];
//       if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
//         hasSameGoodsIndex = i;
//         shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
//         break;
//       }
//     }

//     shopCarInfo.shopNum = shopCarInfo.shopNum + this.data.buyNumber;
//     if (hasSameGoodsIndex > -1) {
//       shopCarInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
//     } else {
//       shopCarInfo.shopList.push(shopCarMap);
//     }
//     return shopCarInfo;
//   },
// 	/**
// 	 * 组建立即购买信息
// 	 */
//   buliduBuyNowInfo: function () {
//     var shopCarMap = {};
//     shopCarMap.goodsId = this.data.goodsDetail.basicInfo.id;
//     shopCarMap.pic = this.data.goodsDetail.basicInfo.pic;
//     shopCarMap.name = this.data.goodsDetail.basicInfo.name;
//     // shopCarMap.label=this.data.goodsDetail.basicInfo.id; 规格尺寸 
//     shopCarMap.propertyChildIds = this.data.propertyChildIds;
//     shopCarMap.label = this.data.propertyChildNames;
//     shopCarMap.price = this.data.selectSizePrice;
//     shopCarMap.score = this.data.totalScoreToPay;
//     shopCarMap.left = "";
//     shopCarMap.active = true;
//     shopCarMap.number = this.data.buyNumber;
//     shopCarMap.logisticsType = this.data.goodsDetail.basicInfo.logisticsId;
//     shopCarMap.logistics = this.data.goodsDetail.logistics;
//     shopCarMap.weight = this.data.goodsDetail.basicInfo.weight;

//     var buyNowInfo = {};
//     if (!buyNowInfo.shopNum) {
//       buyNowInfo.shopNum = 0;
//     }
//     if (!buyNowInfo.shopList) {
//       buyNowInfo.shopList = [];
//     }
//     /*    var hasSameGoodsIndex = -1;
//         for (var i = 0; i < toBuyInfo.shopList.length; i++) {
//           var tmpShopCarMap = toBuyInfo.shopList[i];
//           if (tmpShopCarMap.goodsId == shopCarMap.goodsId && tmpShopCarMap.propertyChildIds == shopCarMap.propertyChildIds) {
//             hasSameGoodsIndex = i;
//             shopCarMap.number = shopCarMap.number + tmpShopCarMap.number;
//             break;
//           }
//         }
//         toBuyInfo.shopNum = toBuyInfo.shopNum + this.data.buyNumber;
//         if (hasSameGoodsIndex > -1) {
//           toBuyInfo.shopList.splice(hasSameGoodsIndex, 1, shopCarMap);
//         } else {
//           toBuyInfo.shopList.push(shopCarMap);
//         }*/

//     buyNowInfo.shopList.push(shopCarMap);
//     return buyNowInfo;
//   },   
//   onShareAppMessage: function () {
//     return {
//       title: this.data.goodsDetail.basicInfo.name,
//       path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + app.globalData.uid,
//       success: function (res) {
//         // 转发成功
//       },
//       fail: function (res) {
//         // 转发失败
//       }
//     }
//   },
//   reputation: function (goodsId) {
//     var that = this;
//     wx.request({
//       url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/reputation',
//       data: {
//         goodsId: goodsId
//       },
//       success: function (res) {
//         if (res.data.code == 0) {
//           //console.log(res.data.data);
//           that.setData({
//             reputation: res.data.data
//           });
//         }
//       }
//     })
//   },
//   getVideoSrc: function (videoId) {
//     // var that = this;
//     // wx.request({
//     //   url: 'https://api.it120.cc/' + app.globalData.subDomain + '/media/video/detail',
//     //   data: {
//     //     videoId: videoId
//     //   },
//     //   success: function (res) {
//     //     if (res.data.code == 0) {
//     //       that.setData({
//     //         videoMp4Src: res.data.data.fdMp4
//     //       });
//     //     }
//     //   }
//     // })
//   },
//   getKanjiaInfo: function (gid) {
//     var that = this;
//     if (!app.globalData.kanjiaList || app.globalData.kanjiaList.length == 0){
//       that.setData({
//         curGoodsKanjia: undefined
//       });
//       return;
//     }
//     let curGoodsKanjia = app.globalData.kanjiaList.find(ele => {
//       return ele.goodsId == gid
//     });
//     if (curGoodsKanjia) {
//       that.setData({
//         curGoodsKanjia: curGoodsKanjia
//       });
//     } else {
//       that.setData({
//         curGoodsKanjia: undefined
//       });
//     }
//   },
//   goKanjia: function () {
//     var that = this;
//     if (!that.data.curGoodsKanjia) {
//       return;
//     }
//     wx.request({
//       url: 'https://api.it120.cc/' + app.globalData.subDomain + '/shop/goods/kanjia/join',
//       data: {
//         kjid: that.data.curGoodsKanjia.id,
//         token: app.globalData.token
//       },
//       success: function (res) {
//         if (res.data.code == 0) {
//           console.log(res.data);
//           wx.navigateTo({
//             url: "/pages/kanjia/index?kjId=" + res.data.data.kjId + "&joiner=" + res.data.data.uid + "&id=" + res.data.data.goodsId
//           })
//         } else {
//           wx.showModal({
//             title: '错误',
//             content: res.data.msg,
//             showCancel: false
//           })
//         }
//       }
//     })
//   },
// })
