// pages/add_addr/add_addr.js
var addr_list = [];
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr_list: '',
    backUrl:""
  },
  onShow:function(){
    this.addr_ask();
  },
  onLoad: function (e) { 
    
    if (e.backUrl){
      this.setData({ backUrl: e.backUrl })
    } },
  // 请求地址

  addr_ask: function () {
    console.log(11111)
    var that=this;
    wx.request({
      method: "POST",
      url: 'https://mjapi.pandahot.cn/EsMemberCellarExt/getMemberAddr',
      data: {
        openId: wx.getStorageSync('wxUnionid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        wx.setStorageSync("addr_list", JSON.stringify(res.data.data))
        // console.log(JSON.parse(wx.getStorageSync("addr_list")))
        var pp = JSON.parse(wx.getStorageSync("addr_list"));
        that.setData({
          addr_list: pp
        })
      }
    })
  },

  // 新建地址
  add_new_addr: function () {
    wx.navigateTo({
      url: "../edit_addr/edit_addr"
    })
  },
  callBack: function (res) {
    console.log(res);
  },
  // 选择地址
  add_choose: function (e) {
    console.log(e,this.data.backUrl);
   if(this.data.backUrl){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.request({
      method: "POST",
      url: 'https://mjapi.pandahot.cn/EsMemberAddress/UpdateDefault',
      data: {
        id: id,
        memberId: wx.getStorageSync("memberId")
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        wx.redirectTo({
          url: '../order/order',
          success: (res) => {
            console.log("执行了");
          }
        })
      }
    })
  }
  },
  // 删除地址
  del_addr: function (e) {
    var that=this;
    var id = e.target.dataset.did;
    wx.showModal({
      title: '地址删除',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            method: "POST",
            url: 'https://mjapi.pandahot.cn/EsMemberAddress/Delete',
            data: {
              id: id,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res.data);
              wx.showToast({
                title: '删除成功',
                success:(res)=>{
                  that.addr_ask();
                }
              })
              
            }
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })

  },
  // 编辑地址
  edit_addr:function(e){
    var id = e.target.dataset.eid;
    wx.redirectTo({
      url: '../edit_addr/edit_addr?id='+id
    })
  }

})
