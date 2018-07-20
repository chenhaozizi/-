// pages/edit_addr/edit_addr.js
var name = '';
var tel = '';
var detail_addr = "";
// var defAddr = "";
var province = '', city = '', region = '', town = '', addr = '';
var app = getApp();
var is_edit=1;
var addr_id='';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    region: ['省', '市', '区'],
    customItem: '全部',
    name: '',
    tel: '',
    namee: '',
    idd: '',
    tell: '',
    provincee: '',
    cityy: '',
    regionn: '',
    townn: '',
    addrr: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.id);
    if (options.id) {
      is_edit=0;
      addr_id = options.id;
      that.addr_ask(options.id);
    }

  },

  // 地区选择
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    province = e.detail.value[0];
    city = e.detail.value[1];
    region = e.detail.value[2];
    this.setData({
      region: e.detail.value
    });
    console.log(province, city, region)
  },
  // 用户名
  userNameInput: function (e) {
    name = e.detail.value;
  },
  mobileInput: function (e) {
    tel = e.detail.value;
  },
  addrInput: function (e) {
    addr = e.detail.value;
  },
  
  saveaddr: function (e) {
    if(is_edit==1){
      var warn = '';
      var flag = false;
      if (name == '') {
        warn = "请填写收货人"
      } else if (tel == "" || tel.length<11) {
          warn='请填写正确的手机号'
      } else if (province == "" || city == "" || region == "") {
        warn = "请选择地区"
      } else if (addr == "") {
        warn = "请填写详细地址"
      } else {
        flag = true;
        wx.request({
          method: 'POST',
          url: 'https://mingjiu-api.conpanda.cn/front_v1/EsMemberAddress/Add',
          data: {
            defAddr: 1,
            memberId: wx.getStorageSync("memberId"),
            name: name,
            mobile: tel,
            addr: addr,
            tel: tel,
            province: province,
            city: city,
            town: town,
            region: region
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res.data)
            wx.showToast({
              title: "提交成功",
              icon: 'success',
              duration: 1500,
              mask: true
            });
            setTimeout(function () {
              wx.navigateBack({
                delta:1
              })
            }, 2000)
          }

        })
      };
      if (flag == false) {
      
        wx.showModal({
          title: '提示',
          content: warn,
          showCancel: false,
          confirmColor: '#007aff'
        })
      };
    }else if(is_edit==0){
      wx.request({
        method: 'POST',
        url: 'https://mingjiu-api.conpanda.cn/front_v1/EsMemberAddress/Update',
        data: {
          defAddr: 1,
          memberId: wx.getStorageSync("memberId"),
          name: name,
          mobile: tel,
          addr:addr,
          addrId: addr_id,
          tel: tel,
          province: province,
          city: city,
          town: town,
          region: region
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data)
          wx.showToast({
            title: "修改成功",
            icon: 'success',
            duration: 1500,
            mask: true
          });
          setTimeout(function () {
            wx.navigateTo({
              url: "../order/order"
            })
          }, 2000)
        }
    })
    }
  },
  addr_ask: function (e) {
    var that = this;
    wx.request({
      method: "POST",
      url: 'https://mingjiu-api.conpanda.cn/front_v1/EsMemberAddress/FindById',
      data: {
        addrId: e,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success: function (res) {
        console.log(res.data.data)
        var b = res.data.data
        name = b.name;
        tel = b.mobile;
        province = b.province;
        city = b.city;
        region = b.region;
        addr = b.addr;
        town = b.town;
        that.setData({
          namee: b.name,
          tell: b.mobile,
          region: [province, city, region],
          townn: b.town,
          addrr: b.addr,
        })
      }
    })
  },
})