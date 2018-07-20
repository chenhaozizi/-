import HttpUtil from '../../../lib/trilobite/core/httputil.js'
let comp, self;
const app = getApp();
/*
 * 分页查询视频
*/
class FindPage {
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
  load = (e) => {
    this.http.post("/Video/FindPage", { pageNumber : e ,pageSize: 5 })
  }
}

/*
 * 点赞
*/
class DoFavor {
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
  load = (e) => {
    this.http.post("/Video/DoFavor", { memberId: wx.getStorageSync("memberId"), videoId: e })
  }
}

// wx.getStorageSync("memberId")
/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.FindPage = new FindPage();
    comp.FindPage.callback = this.FindPage_callback;
    comp.DoFavor = new DoFavor();
    comp.DoFavor.callback = this.DoFavor_callback;
  }

  videoplay = (e) => {
    console.log("进入播放")
    self.setData({
      curr_id: e.currentTarget.dataset.id,
    })
    self.videoContext.play()
  }

  zan = function(e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var videoId = self.data.items[index].id
    var favorCount = "items["+index+"].favorCount";
    self.setData({ [favorCount]: self.data.items[index].favorCount+1 })
    comp.DoFavor.load(videoId);
  }

  onShareAppMessage = function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '个性案例',
      path: 'packageTwoLeval/pages/case/case?id=123',
      success:function(res){
        console.log(res)
        // console.log
        // wx.getShareInfo({
        //   shareTicket: res.shareTickets[0],
        //   success: function (res) { console.log(res) },
        //   fail: function (res) { console.log(res) },
        //   complete: function (res) { console.log(res) }
        // })
      }
    }
  }

  startmake = function() {
    console.log("start")
    wx.navigateTo({
      url: '../../../pages/parameter/parameter'
    })
  }

  data= {
    curr_id: '',   //当前打开的视频id
    items: [],
    pages:1
  }

  FindPage_callback = (res) => {
    console.log(res, res.data.code)
    if (res.data.code == 200) {
      self.setData({ items: self.data.items.concat(res.data.data)  })
      console.log(self.data)
    }
  }

  /**
   * 加载的时候
   */
  onLoad = function () {
    self = this;
    comp.FindPage.load(self.data.pages);
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
  }

  onReady = function () {  //创建视频上下文对象
    self.videoContext = wx.createVideoContext('myVideo')
  }
  // 上拉事件
  searchScrollLower = function () {
    console.log("上拉")
    self.setData({ pages: self.data.pages + 1 })
    comp.FindPage.load(self.data.pages);
  }
}

Page(new PageController());
