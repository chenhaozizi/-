import HttpUtil from '../../../lib/httputil.js'
var app = getApp();
let self, comp;

/**
 * 页面控制器
 */
class PageController {
  constructor() {
    comp = this;

  }
  data = {
    searchKeyword: '',  //需要搜索的字符
    searchSongList: [], //放置返回数据的数组
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次
    callbackcount: 5,      //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏

  }
  onShow = function () {
  }
  onLoad = function () {
    self = this;
    wx.request({
      url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
      data: {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        w: 'far away ',
        zhidaqu: 1,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: self.data.callbackcount,  //返回数据的个数
        p: self.data.pageindex,
        remoteplace: 'txt.mqq.all',
        _: Date.now()
      },
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res)
          var data = res.data;
          //判断是否有数据，有则取数据
          if (data.data.song.curnum != 0) {
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            self.data.isFromSearch ? searchList = data.data.song.list : searchList = self.data.searchSongList.concat(data.data.song.list)
            self.setData({
              searchSongList: searchList, //获取数据数组
              zhida: data.data.zhida, //存放歌手属性的对象
              searchLoading: true   //把"上拉加载"的变量设为false，显示
            });
            //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
          } else {
            console.log("没数据了了！！！")
            self.setData({
              searchLoadingComplete: true, //把“没有数据”设为true，显示
              searchLoading: false  //把"上拉加载"的变量设为false，隐藏
            });
          }
        }else{
          console.log("没数据"+res)
        }
      }
    }) 

  }

  fetchSearchList= function() {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
      callbackcount = that.data.callbackcount; //返回数据的个数
    //访问网络
    wx.request({
      url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
      data: {
        g_tk: 5381,
        uin: 0,
        format: 'json',
        inCharset: 'utf-8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        w: 'far away ',
        zhidaqu: 1,
        catZhida: 1,
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage: 20,
        n: self.data.callbackcount,  //返回数据的个数
        p: self.data.pageindex,
        remoteplace: 'txt.mqq.all',
        _: Date.now()
      },
      method: 'GET',
      header: { 'content-Type': 'application/json' },
      success: function (res) {
        if (res.statusCode == 200) {
          var data = res.data;
          //判断是否有数据，有则取数据
          if (data.data.song.curnum != 0) {
            console.log(data.data.song.curnum)
            let searchList = [];
            //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
            self.data.isFromSearch ? searchList = data.data.song.list : searchList = self.data.searchSongList.concat(data.data.song.list)
            self.setData({
              searchSongList: searchList, //获取数据数组
              zhida: data.data.zhida, //存放歌手属性的对象
              searchLoading: true   //把"上拉加载"的变量设为false，显示
            });
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
    }) 
    
   
  }
  searchScrollLower= function() {
    console.log("上拉")
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
    
    }

      that.fetchSearchList();
  }
 }

Page(new PageController());
