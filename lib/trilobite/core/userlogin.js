import HttpUtil from './httputil.js'

let http;

export default class UserLogin{
   
   constructor(app){
     http = new HttpUtil(app);
     http.addResultListener(this.loginResult);
     this.app=app;
   }
   /**
    * 登录成功后对用户ID进行设定
    */
   loginResult=(res)=>{
     //console.log(res);
    // this.app.globalData.userInfo.memberId= res.data.data.memberId
     //console.log(this.app.globalData.userInfo)
     this.app.globalData.userInfo = { ...this.app.globalData.userInfo, ...res.data.data }
     console.log(this.app.globalData.userInfo)
   }



   serverlogin=(member)=>{
     
     this.app.globalData.userInfo = { ...this.app.globalData.userInfo, ...member}
     let param = { wxUnionid: member.unionid, wxOpenid: member.openid, province: member.province, face: member.avatarUrl, city: member.city, sex: member.gender, nickname:member.nickName}
     http.post("/EsMember/wxAutologin",{
       ...param
     }); 
     
   }

   /**
    * 微信登录，获取code
    */
   login_success=(res)=>{
      this.getOpendId(res);
   }
   /**
    * 获取openid
    */
   getOpendId=(res)=>{
     var _url = "https://api.weixin.qq.com/sns/jscode2session"
     //console.log(_url);
     wx.request({
       url: _url,
       method: 'GET',
       data: {
         appid: 'wx2c9e1dee210d58b4',
         secret: '657d8c549b2c3726052e8dd5ebf15c89',
         js_code: res.code,
         grant_type: 'authorization_code'
       },
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       success: (res) =>{
           if(this.callback){
              this.callback(res);
           }
       }
     })
   }

   login=()=>{
     wx.login({
       success:this.login_success
     });
   }
   
}