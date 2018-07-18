// pages/case/case.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      curr_id: '',   //当前打开的视频id
      items: [
        {
          id: 1, src: 'https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg',title:'演唱会定制酒·李宇春',paizi:'全兴大曲 99系列 52%vol 500ml',zan:'0000'
        }, {
          id: 2, src: 'https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg', title: '演唱会定制酒·李宇', paizi: '全兴大 99系列 52%vol 500ml', zan: '0003'
        },
        {
          id: 3, src: 'https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg', title: '演唱会定制酒·李', paizi: '全大曲 99系列 52%vol 500ml', zan: '0001'
        },
        {
          id: 4, src: 'https://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg', title: '演唱会定制酒·', paizi: '全兴曲 99系列 52%vol 500ml', zan: '0002'
        },
      ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {  //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo')
  },
  videoplay(e) {
    console.log("进入播放")
    this.setData({
      curr_id: e.currentTarget.dataset.id,
    })
    this.videoContext.play()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '个性案例',
      path: 'packageTwoLeval/pages/case/case?id=123'
    }
  },
  startmake:function(){
    console.log("start")
    wx.navigateTo({
      url: '../../../pages/parameter/parameter'
    })
  }

})