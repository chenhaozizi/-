// pages/pack/pack.js
import WeCropper from '../../lib/we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50;
var tempp;//原图图片 
var bg_url;
var pack = [];//纸套信息
let This;
var img_a = "";//原图路径
//var img_b="";//截图路径
//获取应用实例
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    },
    self_word:"",
    hide_canvas: true,//绘图层显示控制变量 
    tempfp: "/images/add.png",
    showModal: false,
    // blessing: "祝福语区域",
    blessing: "",
    zy: "",
    style_imgs: [
      { "pack": "/images/pack8.png", "pack_show": "/images/pack8.png" }
    ],
    pack_show: '/images/pack8.png',
    bottom1: "450rpx",
    bottom2: "0",
    _num: 8,//纸套
    crop: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    This = this;
    // var oplist = JSON.parse(options.src);
    const { cropperOpt } = this.data.cropperOpt;

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas();
      //截取的图片
    if (options.src) {
      this.setData({
        tempfp: options.src
      })
    }
    //初始化纸套样式
    if (app.globalData.style_img) {
      this.setData({
        pack_show: app.globalData.style_img
      })
    }
    //初始化想说的话选择
    if (app.globalData.pack.zy   ) {
      this.setData({
        zy: app.globalData.pack.zy
      })
    }
   //初始化提交的blessing文字
    if (app.globalData.pack.blessing) {
      this.setData({
        blessing: app.globalData.pack.blessing
      })
    }
    //初始化输入框文字
    if (app.globalData.pack.self_word) {
      this.setData({
        self_word: app.globalData.pack.self_word
      })
    }
  },

  //选择并将图片输出到canvas  
  change_cover: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '选择定制图片',
      confirmColor: '#ffb700',
      success: function (res) {
        if (res.confirm) {
          const self = this
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
              const src = res.tempFilePaths[0]
              // 上传的原图上传到后台
              wx.uploadFile({
                url: 'https://mjapi.pandahot.cn/upload/upload-image/', //仅为示例，非真实的接口地址
                filePath: src,
                name: 'image',
                formData: {
                  'subFolder': 'customize'
                },
                success: function (res) {
                  var img_a = (JSON.parse(res.data)).fsimg;
                  wx.setStorage({
                    key: "orimg",
                    data: img_a
                  });
                }
              })
              //  获取裁剪图片资源后，给data添加src属性及其值
              //跳转到截取页面

              wx.navigateTo({
                url: '../../pages/cutInside/cutInside?src=' + src,
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 纸套选择
  zt_xz: function () {
    this.setData({
      bottom1: "0",
      bottom2: "450rpx"
    })
  },
  // 纸套选择，设置模板背景
  img_src: function (e) {
    var that = this;
    var nums = e.target.dataset.nums;
    var style_imgs = that.data.style_imgs[nums];
    // console.log(style_imgs.pack_show);
    app.globalData.style_img = style_imgs.pack_show;
    that.setData({
      _num:8,
      pack_show: style_imgs.pack_show
    });
    console.log(this.data._num);
    wx.setStorageSync("zt", this.data._num);
  },
  // 纸套选择完毕
  zt_ok: function () {
    this.setData({
      bottom1: "450rpx",
      bottom2: "0"
    })
  },
  // 模态对话框
  submit: function () {
    this.setData({
      showModal: true
    })
  },
  preventTouchMove: function () {

  },
  go: function () {
    app.globalData.pack.zy = this.data.zy;
    app.globalData.pack.blessing = this.data.blessing;
    app.globalData.pack.self_word = this.data.self_word;
    this.setData({
      showModal: false
    })
  },
  // 默认祝福语
  blessing: function (e) {
    console.log(e.target.dataset.text);
    console.log(e.target.dataset.num);
    this.setData({
      zy: e.target.dataset.num,
      blessing: e.target.dataset.text
    })

  },
  // 自定义祝福语
  zd_blessing: function (e) {
    this.setData({
      blessing: e.detail.value,
      self_word: e.detail.value
    })
  },
  //下一步
  next_step: function () {
    var warn = "";
    var flag = false;
    console.log(this.data._num);
    if (wx.getStorageSync("zt")) {
      this.setData({
        _num: wx.getStorageSync("zt")
      })
    };
    if (this.data._num === "") {
      warn = "请选择底纹"
    } else if (this.data.tempfp == "/images/add.png") {
      warn = "请选择自定义图片"
    } else if (this.data.blessing == '祝福语区域') {
      warn = "请填写祝福语"
    } else {
      flag = true;
      let zt = this.data._num;
      let blessing = this.data.blessing;
      //  pack = { zt, original, darw, blessing};
      pack = { zt, blessing };
      wx.showModal({
        title: '完成提示',
        content: '尊敬的客户，确认提交定制吗',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            // console.log(pack);
            // 定制信息 存储在全局变量里
            app.globalData.pack = pack;
            console.log("提交的自定义参数为", app.globalData.pack);
            wx.navigateTo({
              url: '/pages/order/order'
            })

          } else {
            console.log('用户点击取消')
          }

        }
      })


    };
    if (flag == false) {
      wx.showToast({
        title: warn,
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    }
  }
  ,
})