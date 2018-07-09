//let app = getApp();
/**
 * 二级分销http 通信工具
 */
export default class rsHttpUtil {

  result = [];
  constructor(app) {
    //super(app);
    this.app = app;
  }
  /**
   * 执行Post表单
   */
  post = (url, data) => {
    this.url = url;
    this.data = data;
    this.method = "POST"
    this.load();
  }
  /**
   * 新增结果监听
   */
  addResultListener = (f) => {
    this.result.push(f);
  }
  load = () => {

    wx.request({
      url: this.app.globalData.rsDomain + this.url,
      data: this.data,
      method: this.method,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
       
        //item.detail = res.data.data;
        for (let f in this.result) {
          this.result[f](res);
        }
        if (this.then) {
          setTimeout(this.then, 500);
          //this.then();
        }
      }
    }
    )
  }
}
