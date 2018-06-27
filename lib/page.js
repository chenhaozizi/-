/*
* desc:
*  1、如果目标页面已经在栈中，那么wx.navigateBack({delta: xx})到目标页面
*  2、如果目标页面不在栈中，
*    （1）如果栈大小<5，那么wx.navigateTo(目标页面)
*    （2）否则，wx.redirectTo(目标页面)
*  3、所有页面间的数据传输，通过缓存携带
*  4、跳转目标页，用goPage()
*  5、在目标页，通过inPage()接收数据。接收后，数据会被删除
*/
export default class goPage{
  goPage=(obj)=>{
    console.log(obj)
    let MAX_VALUE = 5;
    var pages = getCurrentPages(),  //页面栈
      len = pages.length,
      dlt = '',
      target = '/' + obj.url.replace(/^\//, ''), //如果有，将第一个‘/’去掉，然后再补上（开发者习惯不同，有些人会给url加/，有些则忘了，兼容处理
      navigation_key = target.replace(/\//g, '_'); //存储数据的下标，每个页面由自己的存储key，保证了页面间数据不会相互污染
    //查找目标页在页面栈的位置
    for (var i = 0; i < len; i++) {
      if (pages[i].route == target) { //
        dlt = i + 1; //目标页在栈中的位置
        break;
      }
    }
    //保存数据
    //由于navigateBack()回到指定页面，不会重新执行onLoad事件，所以加个标兵。
    //只有在isLoad = true;时，才会接收参数并执行类onLoad事件
    var nData = Object.assign({ referer: pages[len - 1].route, _is_load: true }, obj.data || {});
    wx.setStorageSync(navigation_key, JSON.stringify(nData));
    if (!dlt) { //页面不在栈中
      if (len < this.MAX_VALUE) {
        wx.navigateTo({
          url: target
        });
      } else {
        wx.redirectTo({
          url: target
        });
      }
    } else {
      wx.navigateBack({
        delta: len - dlt
      });
    }
  } 
} 
