App({
  header: 'application/x-www-form-urlencoded',
  index: '',
  no: 0,
  file: '',
  check_id_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php?r=user/user/checkthirdid&',
  login_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=user/user/login&',
  saveinfo_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=user/user/register',

  get_club_list:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/club/clublist',
  getactivity_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubact/actlist&',
  sign_club_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=user/club/register&',
  applyactivity_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/actjoin',
  cancelactivity_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/actnotjoin',
  lead_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/lead',
  check_club_id_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/login',
  check_club_isjoin: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/isjoinclub',
  getclubuser_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=clubs/getclubuser',
  edit_club_user_info:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/alter',
  manage_club:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/club/getmanageclub',

  get_join_act_count:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/actjoincount',
  
  get_club_info:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/club/clubinfo',
  add_act_url: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubact/addact',
  upload_img:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/club/alterclub',

  update_act:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubact/alteract',
  get_act_join_user:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubact/actjoininfo',
  club_register: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/register',
  apply_join_club: 'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubuser/joinclub',

  delete_act:'https://api.dxxywzd.cn/wzd_1.0/web/index.php/?r=club/clubact/deleteact',
  articlecontent_url: 'https://api.dxxywzd.cn/test_1.0/web/index.php?r=article/tz/content',
  articlefile_url: 'https://api.dxxywzd.cn/test_1.0/web/index.php?r=article/tz/file',
  tz_list_url: 'https://api.dxxywzd.cn/test_1.0/web/index.php?r=article/tz/index',


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
  //如果有thirdid，调用checkthirdid
  //如果没有thirdid，调用login
  checkstate: function (cb) {
    var that = this;
    var thirdid = wx.getStorageSync('thirdid')

    console.log('旧的third为 ' + thirdid)
    //wx.showLoading({
    //  title: '登陆中，请稍后',
    //})
    if (thirdid != '') {
      wx.checkSession({
        success() {
          //success表示用户登陆态在微信维护中有效，只需要判断thirdid是否有效即可
          console.log('登陆状态确认成功，获取本地thirdid成功')
          console.log('本地thirdid=' + thirdid)
          wx.getUserInfo({
            success(res) {
              typeof cb == 'function' && cb(res.userInfo)
            }
          })
          wx.hideLoading()
        },
        //fail表示用户登陆态无效，不管thirdid是否有效，都调用登陆函数，重新获取信息
        fail: function () {
          that.userlogin(cb)
        }
      })
    }
    else {
      that.register(cb)
      console.log('未找到thirdid，开始调用注册接口')
    }
  },
  register: function (cb) {
    var that = this;
    console.log('注册接口，开始运行')
    wx.login({
      success: function (res) {
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.log(that.globalData.userInfo)
            wx.request({
              url: that.login_url,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: code,
                nickname: res.userInfo.nickName,
                gender: res.userInfo.gender,
                city: res.userInfo.city,
                province: res.userInfo.province,
                country: res.userInfo.country,
              },
              method: 'POST',
              success(res) {
                try {
                  var str = that.filter(res.data.data)
                  console.log(str)
                  wx.setStorageSync('thirdid', str)
                  that.thirdid = res.data.data
                } catch (e) {
                  console.log(e)
                }
              }
            })
          },
          fail:function(){
            console.log('获取用户信息失败')
          }

        })
      },
      fail:function(){
        '登陆失败'
      }
    })

  },
  //用户登陆函数，用户用户登陆、获取用户信息
  userlogin: function (cb) {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo;
            console.log(that.globalData.userInfo)
            wx.request({
              url: that.login_url ,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method:'POST',
              data:{
                code: code,
              },
              success(res) {
                try {
                  console.log('app的登陆函数打印结果' + res.data)
                  var str = that.filter(res.data.data)
                  //console.log(str)
                  wx.setStorageSync('thirdid', str)
                  that.thirdid = res.data.data
                  typeof cb == "function" && cb(that.globalData.userInfo)
                  wx.hideLoading()
                  if (res.data.code == 401) {
                    that.register()
                  }
                } catch (e) {
                  console.log(e)
                }
              }
            })
          }

        })
      }
    })
  },
  filter: function (str) {
    str = str.replace(/\+/g, "%2B");
    str = str.replace(/\&/g, "%26");
    return str;
  },
  globalData: {
    userInfo: null,
    thirdid: null
  }
})
