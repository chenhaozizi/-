var wxpay = require('../../utils/pay.js')
var app = getApp()
var self,comp;
import HttpUtil from '../../lib/trilobite/core/httputil.js'


/*
 * 订单列表访问
*/
class OrderListDao {
  //POST /EsCart/checkGoods//
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
  load = (status) => {
    this.http.post("/EsOrder/findByMemberIdAndStatus", {start:1,pagesize:100, memberId: app.globalData.userInfo.memberId ,status:status})
  }
}

/**
 * 页面控制器
 */
class PageController {
  constructor(){
    comp=this;
    comp.OrderListDao=new OrderListDao();
    comp.OrderListDao.callback=this.orderlistDao_callback;
  }
  orderlistDao_callback=(res)=>{
    self.setData({orderList:res.data.data});
  }

  data={
    statusType: ["待付款", "已完成"],
    currentType:0,
    orderList:[]
  }
  orderDetail=(e)=>{
    wx.navigateTo({
      url: '/pages/order-details/index?id=' + e.currentTarget.dataset.id,
    })
  }

  statusTap=(e)=>{
     var curType =  e.currentTarget.dataset.index;
     self.data.currentType = curType
     self.setData({
       currentType:curType
     });
     if(self.data.currentType===0){
       comp.OrderListDao.load(1);
     }
     if (self.data.currentType === 1) {
       comp.OrderListDao.load(5);
     }
     //this.onShow();
  }
  /**
   * 当页面显示的时候触发list对象的load方法
   */
  onShow = function () {

    //this.selectComponent("#list").load();
  }
  onLoad=function(){
     self=this;
     comp.OrderListDao.load(1);
  }

  toPayTap=(e)=>{
    wx.navigateTo({
      url: '/pages/pay/pay?id=' + e.currentTarget.dataset.id
    })
  }
  
}

Page(new PageController());

// Page({
//   data:{
//     statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
//     currentType:0,
//     tabClass: ["", "", "", "", ""]
//   },
//   statusTap:function(e){
//      var curType =  e.currentTarget.dataset.index;
//      this.data.currentType = curType
//      this.setData({
//        currentType:curType
//      });
//      this.onShow();
//   },
//   orderDetail : function (e) {
//     var orderId = e.currentTarget.dataset.id;
//     wx.navigateTo({
//       url: "/pages/order-details/index?id=" + orderId
//     })
//   },
//   cancelOrderTap:function(e){
//     var that = this;
//     var orderId = e.currentTarget.dataset.id;
//      wx.showModal({
//       title: '确定要取消该订单吗？',
//       content: '',
//       success: function(res) {
//         if (res.confirm) {
//           wx.showLoading();
//           wx.request({
//             url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/close',
//             data: {
//               token: app.globalData.token,
//               orderId: orderId
//             },
//             success: (res) => {
//               wx.hideLoading();
//               if (res.data.code == 0) {
//                 that.onShow();
//               }
//             }
//           })
//         }
//       }
//     })
//   },
//   toPayTap:function(e){
//     var that = this;
//     var orderId = e.currentTarget.dataset.id;
//     var money = e.currentTarget.dataset.money;
//     wx.request({
//       url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/amount',
//       data: {
//         token: app.globalData.token
//       },
//       success: function (res) {
//         if (res.data.code == 0) {
//           // res.data.data.balance
//           money = money - res.data.data.balance;
//           if (money <= 0) {
//             // 直接使用余额支付
//             wx.request({
//               url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/pay',
//               method:'POST',
//               header: {
//                 'content-type': 'application/x-www-form-urlencoded'
//               },
//               data: {
//                 token: app.globalData.token,
//                 orderId: orderId
//               },
//               success: function (res2) {
//                 that.onShow();
//               }
//             })
//           } else {
//             wxpay.wxpay(app, money, orderId, "/pages/order-list/index");
//           }
//         } else {
//           wx.showModal({
//             title: '错误',
//             content: '无法获取用户资金信息',
//             showCancel: false
//           })
//         }
//       }
//     })    
//   },
//   onLoad:function(options){
//     // 生命周期函数--监听页面加载
   
//   },
//   onReady:function(){
//     // 生命周期函数--监听页面初次渲染完成
 
//   },
//   getOrderStatistics : function () {
//     var that = this;
//     wx.request({
//       url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
//       data: { token: app.globalData.token },
//       success: (res) => {
//         wx.hideLoading();
//         if (res.data.code == 0) {
//           var tabClass = that.data.tabClass;
//           if (res.data.data.count_id_no_pay > 0) {
//             tabClass[0] = "red-dot"
//           } else {
//             tabClass[0] = ""
//           }
//           if (res.data.data.count_id_no_transfer > 0) {
//             tabClass[1] = "red-dot"
//           } else {
//             tabClass[1] = ""
//           }
//           if (res.data.data.count_id_no_confirm > 0) {
//             tabClass[2] = "red-dot"
//           } else {
//             tabClass[2] = ""
//           }
//           if (res.data.data.count_id_no_reputation > 0) {
//             tabClass[3] = "red-dot"
//           } else {
//             tabClass[3] = ""
//           }
//           if (res.data.data.count_id_success > 0) {
//             //tabClass[4] = "red-dot"
//           } else {
//             //tabClass[4] = ""
//           }

//           that.setData({
//             tabClass: tabClass,
//           });
//         }
//       }
//     })
//   },
//   onShow:function(){
//     // 获取订单列表
//     wx.showLoading();
//     var that = this;
//     var postData = {
//       token: app.globalData.token
//     };
//     postData.status = that.data.currentType;
//     this.getOrderStatistics();
//     wx.request({
//       url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/list',
//       data: postData,
//       success: (res) => {
//         wx.hideLoading();
//         if (res.data.code == 0) {
//           that.setData({
//             orderList: res.data.data.orderList,
//             logisticsMap : res.data.data.logisticsMap,
//             goodsMap : res.data.data.goodsMap
//           });
//         } else {
//           this.setData({
//             orderList: null,
//             logisticsMap: {},
//             goodsMap: {}
//           });
//         }
//       }
//     })
    
//   },
//   onHide:function(){
//     // 生命周期函数--监听页面隐藏
 
//   },
//   onUnload:function(){
//     // 生命周期函数--监听页面卸载
 
//   },
//   onPullDownRefresh: function() {
//     // 页面相关事件处理函数--监听用户下拉动作
   
//   },
//   onReachBottom: function() {
//     // 页面上拉触底事件的处理函数
  
//   }
// })
