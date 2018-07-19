// pages/case/case.js
let self;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      curr_id: '',   //当前打开的视频id
      items: [
        {
          id: 1, zan: 123, src: 'http://www.w3school.com.cn//i/movie.mp4', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg',title:'演唱会定制酒·李宇春',paizi:'全兴大曲 99系列 52%vol 500ml'
        }, {
          id: 2, zan: 23, src: 'http://www.w3school.com.cn//i/movie.mp4', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg', title: '演唱会定制酒·李宇', paizi: '全兴大 99系列 52%vol 500ml'
        },
        {
          id: 3, zan: 345, src: 'http://www.w3school.com.cn//i/movie.mp4', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg', title: '演唱会定制酒·李', paizi: '全大曲 99系列 52%vol 500ml'
        },
        {
          id: 4, zan: 567, src: 'http://www.w3school.com.cn//i/movie.mp4', poster: 'http://ow74m25lk.bkt.clouddn.com/shilan.jpg', title: '演唱会定制酒·', paizi: '全兴曲 99系列 52%vol 500ml'
        },
      ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  self = this
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
  zan:function(e){
    console.log();
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i < self.data.items.length;i++){
      if (i == e.currentTarget.dataset.index)

      self.data.items[index].zan+=1;
    }
    self.setData({
      items: self.data.items
    })
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