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
    this.http.post("/Video/FindPage", { memberId: wx.getStorageSync("memberId"),pageNumber : e ,pageSize: 5 })
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

/*
 * 分享
*/
class SaveShareRecord {
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
    this.http.post("/Video/SaveShareRecord", { memberId: wx.getStorageSync("memberId"), videoId: e.vidid, shareTo:e.sharemsg })
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
    comp.SaveShareRecord = new SaveShareRecord();
    comp.SaveShareRecord.callback = this.SaveShareRecord_callback;
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
    var favorCount = "items["+index+"].favorCount"
    var isFavor = "items["+index+"].isFavor"
    console.log(self.data.items[index].isFavor,55)
    if(self.data.items[index].isFavor == 0){
      self.setData( { [favorCount]: self.data.items[index].favorCount + 1 })
      self.setData( { [isFavor]: 1 })
      console.log(self.data.items[index].isFavor,66)
      console.log(self.data.items[index].favorCount)

    }
    comp.DoFavor.load(videoId);
  }

  onShareAppMessage = function (res) {
    let datasetid = res.target.dataset.vindex
    if (res.from === 'button') {
      // 来自页面内转发分享按钮
      console.log(res.target.dataset.vindex)
      self.setData({ vidid : self.data.items[res.target.dataset.vindex].id})
    }
    return {
      title: '个性案例',
      path: 'packageTwoLeval/pages/case/case?id=123',
      success:function(res){
        // console.log(res.shareTickets[0])
        var sharedCount = "items[" + datasetid + "].sharedCount"
        self.setData({ sharemsg : res.shareTickets })
        console.log(datasetid,89898)
        self.setData({ [sharedCount]: self.data.items[datasetid].sharedCount+1 })
        comp.SaveShareRecord.load(self.data);
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
    pages:1,
    vidid:0,
    sharemsg:''
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
  onReachBottom = function() {
    console.log("上拉2")
    self.setData({ pages: self.data.pages + 1 })
    comp.FindPage.load(self.data.pages);
  }
}

Page(new PageController());
