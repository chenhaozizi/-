import HttpUtil from '../../../lib/trilobite/core/httputil.js'
var app = getApp();
let self, comp;
//获取头部数据  
class getTopDao {
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
  load = () => {
    this.http.post("/RsMember/FindFriendsStat", { memberId: wx.getStorageSync("memberId") })

  }
}
//分页查询朋友圈
class getfriendsDao {
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
    this.http.post("/RsMember/FindFriendsPage", { memberId: wx.getStorageSync("memberId"),...e })

  }
}
/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;
    comp.getTopDao = new getTopDao();
    comp.getTopDao.callback = this.getTopDao_callback;
    comp.getfriendsDao = new getfriendsDao();
    comp.getfriendsDao.callback = this.getfriendsDao_callback
  }
  getTopDao_callback = (res) =>{
    if(res.data.code == 200){
      self.setData({
        agentCount: res.data.data.agentCount,
        friendCount: res.data.data.friendCount
      })
    }
  }
  getfriendsDao_callback = (res) =>{
        console.log(res)
        if (res.data.code == 200) {
          var data = res.data;
          //判断是否有数据，有则取数据
          if (data.data.length>0) {
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            self.data.isFromSearch ? searchList = data.data : searchList = self.data.searchSongList.concat(data.data)
           
            self.setData({
              searchSongList: searchList, //获取数据数组
              searchLoading: true   //把"上拉加载"的变量设为false，显示
            });
            if (data.data.length <5){
              self.setData({
                searchLoadingComplete: true, //把“没有数据”设为true，显示
                searchLoading: false  //把"上拉加载"的变量设为false，隐藏
              });
            }
            //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
          } else {
            console.log("没数据了")
            self.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏
            });
          }
        } else {
          console.log("没数据22" + res)
        }
  }
  data = {
    agentCount:0, friendCount:0,
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 5,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏
    ifhas:true

  }
  onShow = function () {
  }
  onLoad = function () {
    comp.getTopDao.load();
    var req_data={
      pageNumber: this.data.searchPageNum,
      pageSize: this.data.callbackcount
    }
    comp.getfriendsDao.load(req_data);
    self = this;
  }
 
  searchScrollLower= function() {
    console.log("上拉");
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      var req_data = {
        pageNumber: self.data.searchPageNum,
        pageSize: self.data.callbackcount
      }
      comp.getfriendsDao.load(req_data);
    }
   
     
  }
 }

Page(new PageController());
