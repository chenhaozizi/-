/**
 * Created by sail on 2017/6/1.
 */
var app=getApp();
import WeCropper from '../../lib/we-cropper/we-cropper.js'

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50;
let op_arr ;

Page({
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
    }
  },
  touchStart (e) {
  
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    console.log(e)
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  //生成图片处理
  getCropperImage () {
    this.wecropper.getCropperImage((src) => {
      if (src) {
        op_arr.src = src;
        console.log("截图的图"+src)
        // 截图上传
         const img_two= wx.uploadFile({
           url: 'https://mingjiu-api.conpanda.cn/fileserver/uploadImage', 
            filePath: src,
            name: 'file',
            success: function (res) {
              console.log(res)
              var img_b = (JSON.parse(res.data)).remoteUrl;
              
              console.log(img_b)
              //跳转到选图页面
              wx.setStorage({
                key: "tempfs",
                data: img_b
              });
              var src = op_arr.src;
              if (app.globalData.parameter.brand==1){
                // console.log(op_arr);
                wx.redirectTo({
                  url: '../../pages/pack/pack?src=' +src,
                })
              } else if (app.globalData.parameter.brand == 2){
                if (app.globalData.parameter.family == "金樽" || app.globalData.parameter.family == 2) {
                  wx.redirectTo({
                    url: '../../pagesA/pack2_1/pack2_1?src=' + src,
                  })
                } else if (app.globalData.parameter.family == "银坛" || app.globalData.parameter.family == 1) {
                  wx.redirectTo({
                    url: '../../pages/pack2/pack2?src=' + src,
                  })
                }
              } else if (app.globalData.parameter.brand == 3){
                if (app.globalData.parameter.family == "品味级" || app.globalData.parameter.family == 1) {
                  wx.redirectTo({
                    url: '../../pages/pack3/pack3?src=' + src,
                  })
                } else if (app.globalData.parameter.family == "鉴赏级" || app.globalData.parameter.family == 2) {
                  wx.redirectTo({
                    url: '../../pagesA/pack3_1/pack3_1?src=' + src,
                  })
                } else if (app.globalData.parameter.family == "尊享级" || app.globalData.parameter.family == 3) {
                  wx.redirectTo({
                    url: '../../pagesA/pack3_2/pack3_2?src=' + src,
                  })
                }
              }
            
            },
            fail:function(res){
             wx.showToast({
               title: '网络不畅，请稍后重试',
               icon:'none',
               mask:true,
               duration:2000,
             });
             return;
            }
          });
         //uploading
         img_two.onProgressUpdate((res) => {
           console.log('上传进度', res.progress)
           wx.showToast({
             title: '上传中:' + res.progress + '%',
             icon: "loading",
             mask: true
           });
         });
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  //上传图片处理
  uploadTap () {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
     op_arr = option
    var that=this;
    if (app.globalData.parameter.brand == 2) {
      console.log("品牌：",app.globalData.parameter.brand)
      that.setData({
        cropperOpt: {
          id: 'cropper',
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width-378) / 2,
            y: (height - 150) / 2,
            width: 378,
            height: 150
          }
        }

      })
    } else if (app.globalData.parameter.brand == 3){
      console.log("品牌：", app.globalData.parameter.brand)
      that.setData({
        cropperOpt: {
          id: 'cropper',
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 235) / 2,
            y: (height - 400) / 2,
            width: 235,
            height: 400
          }
        }

      })

    };
    console.log(op_arr)
    const imgsrc = op_arr.src;
   
    const { cropperOpt } = this.data;
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        // console.log(`before picture loaded, i can do something`)
        // console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        // console.log(`picture loaded`)
        // console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        // console.log(`before canvas draw,i can do something`)
        // console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
    this.wecropper.pushOrign(imgsrc)
  }
})
