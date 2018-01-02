App({
  index: '',
  no: 1,
  file: '',
  check_id_url:,
  login_url:'',
  saveinfo_url:‘',
  getactivity_url: '',
  sign_club_url:'',
  applyactivity_url: '',
  tz_list_url: '',
  getclubuser_url: '',
  releaseactivity_url: '',
  articlecontent_url:'',
  articlefile_url:'',
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据  
    this.thirdid = wx.getStorageSync('thirdid')  
    // logs.unshift(Date.now())  
    // wx.setStorageSync('logs', logs)  
  },
  //定义函数，检测用户是否登陆并维护登陆状态
  checkstate:function(cb){
    var that = this;
    var thirdid=wx.getStorageSync('thirdid')
    //wx.showLoading({
    //  title: '登陆中，请稍后',
    //})
    wx.checkSession({
      success(){
        //success表示用户登陆态在微信维护中有效，只需要判断thirdid是否有效即可
        wx.request({
          url: that.check_id_url+'thirdid=' + thirdid,
          success(res) {
            console.log('apploginstate')
            if (res.data.code == 'unlogin') {
              that.userlogin(cb)
            }
            else{
              wx.getUserInfo({
                success(res){
                  typeof cb =='function' && cb(res.userInfo)  
                }
              })
              wx.hideLoading()
            }
          }
        })
      },
      //fail表示用户登陆态无效，不管thirdid是否有效，都调用登陆函数，重新获取信息
      fail: function (){
        that.userlogin(cb)
      }
    })
  },
  //用户登陆函数，用户用户登陆、获取用户信息
  userlogin:function(cb){
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.log(that.globalData.userInfo)
            typeof cb == "function" && cb(that.globalData.userInfo)
            if (that.thirdid == "") {
              wx.request({
                url: that.saveinfo_url+'code=' + code + '&nickname=' + res.userInfo.nickName + '&gender=' + res.userInfo.gender + '&city=' + res.userInfo.city + '&province=' + res.userInfo.province + '&country=' + res.userInfo.country,
                success(res) {
                  try {
                    var str = that.filter(res.data)
                    console.log(str)
                    wx.setStorageSync('thirdid', str)
                    that.thirdid = res.data
                    wx.hideLoading()
                  } catch (e) {
                    console.log(e)
                  }
                }
              })
            }
            else {
              wx.request({
                url: that.login_url+'code=' + code,
                success(res) {
                  try {
                    var str = that.filter(res.data)
                    console.log(str)
                    wx.setStorageSync('thirdid', str)
                    that.thirdid = res.data
                    wx.hideLoading()
                  } catch (e) {
                    console.log(e)
                  }
                }
              })
            }
          }
        })
      }
  })
  },
  filter:function(str)
{
    str = str.replace(/\+/g, "%2B");
    str = str.replace(/\&/g, "%26");
    return str;
  },
  globalData: {
    userInfo: null,
    thirdid: null
  }
})
