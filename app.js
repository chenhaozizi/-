//app.js
/**
 * 程序启动控制器
 */
class AppController {
  /**
   * 程序启动的时候执行
   */
  onLaunch = () => {

  }
  globalData= {
    subDomain: "tz", // 如果你的域名是： https://api.it120.cc/abcd 那么这里只要填写 abcd
    Domain: "https://mingjiu-api.conpanda.cn/front_v1",
    rsDomain:"https://mingjiu-api.conpanda.cn/front_v1",
    userInfo: null,
    userInfoNew: [],//用户信息
    parameter: [],//定制酒参数
    pack: [],//包装定制信息
    addr_default: {},//默认地址
    style_img: ""//定制风格
  }
getUserInfo = (f) => {
  console.log(this.globalData.userInfo)
  return this.globalData.userInfo;
}}

App(new AppController());
