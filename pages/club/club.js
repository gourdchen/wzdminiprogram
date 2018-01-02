/**
 * club变量说明
 * 主要变量：activity_list 活动列表
 * club_user_info 社团用户信息
 * club_info 社团信息
 * 
 */
var app = getApp();
Page({
  data: {
    // tab切换
    currentTab: 0,
    info: '征途自行车协会成立于2007年，十年来，致力于发展骑行事业。\n我们的常规活动时间为4月-10月每个周末\n远征时间为寒暑假期',
    club_name: '征途自行车协会',
    activity_list: [],
    showmask: false,
    logo: '/image/zt.jpg',
    apply: 0,//加入社团按钮绑定内容
    apply_act:'申请参加',//参加活动按钮绑定内容
    date: "2017-12-12",
    birth: "2000-1-1",
    thirdid: 0,
    reply: null,
    tap4: '加入征途'
  },
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })

  },
  bindinput_id: function (e) {
    this.setData({
      id: e.detail.value
    })
  },
  bindinput_phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindinput_nation: function (e) {
    this.setData({
      nation: e.detail.value
    })
  },
  /*提交活动申请触发
  * 申请活动函数
  */
  bindtap_submit(e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //若用户没有信息在数据库中，user_info便未定义，弹出窗口填写信息
    if (typeof this.data.club_user_info == 'undefined') {
      this.setData({
        showmask: true
      })
      wx.hideLoading()
    }
    //若用户已有信息，无需填写，直接验证即可
    else {
      wx.request({
        url: app.applyactivity_url,
        method: 'GET',
        data: {
          thirdid: that.data.thirdid,
          act_id:that.data.activity_list[e.target.id].act_id,
        },
        success(res){
          wx.hideLoading()
          if(res.data.code=='200'){
            wx.showToast({
              title: '成功',
            })
            that.setData({
              apply_act:'取消参加'
            })
          }
          else{
            wx.showToast({
              title: '发生未知错误',
              image:'/image/erro.png',
            })
          }
        }
      })
    }
  },
  //弹框点击确定触发,此时发送用户注册信息到后台
  apply_send() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (typeof that.data.apply_name == 'undefined' |typeof that.data.apply_stu_id == 'undefined' | typeof that.data.apply_phone == 'undefined'){
      wx.showToast({
        title: '请输入完整信息',
        image:'/image/erro.png',
        mask:true
      })
      return 0
    }
    wx.request({
      url: '',
    })
    this.setData({
      showmask: false
    })
    wx.showToast({
      title: '申请成功',
      
    })
  },
  apply_cancel() {
    this.setData({
      showmask: false
    })
  },
  bindchange_date(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindchange_birth(e) {
    var that=this;
    this.data.club_user_info.birth=e.detail.value;
    this.setData({
      club_user_info:that.data.club_user_info
    })
  },
  input_id(e) {
    var that = this;
    
    this.setData({
      'club_user_info.stu_id': e.detail.value
    })
  },
  input_name(e) {
    var that = this;
    
    this.setData({
      'club_user_info.name': e.detail.value
    })
  },
  input_phone(e) {
    var that = this;
    
    this.setData({
      'club_user_info.phone': e.detail.value
    })
  },
  input_gender(e) {
  
    this.setData({
      'club_user_info.gender': e.detail.value
    })
  },
  input_home(e) {
    var that = this;
    
    this.setData({
      'club_user_info.home': e.detail.value
    })
  },
  input_school(e) {
    var that = this;
   
    this.setData({
      'club_user_info.school': e.detail.value
    })
  },
  input_class(e) {
  
    this.setData({
      'club_user_info.class': e.detail.value
    })
  },
  input_nation(e) {
    var that = this;
    
    this.setData({
      'club_user_info.nation': e.detail.value 
    })
  },
  input_apply_name(e){
    this.setData({
      apply_name:e.detail.value,
      'club_user_info.name':e.detail.value
    })
  },
  input_apply_stu_id(e) {
    this.setData({
      apply_stu_id:e.detail.value,
      'club_user_info.stu_id':e.detail.value
    })
  },
  input_apply_phone(e) {
    this.setData({
      apply_phone:e.detail.value,
      'club_user_info.phone':e.detail.value
    })
  },
  //第一次注册时获取信息使用
  getinfo: function () {
    var that = this
    wx.showLoading({
      title: '验证中，请稍后',
    })
    wx.request({
      //用学号去验证用户,返回信息
      url: 'https://api.dxxywzd.cn/basic/web/index.php/?r=user/getinfo',
      data:{
        stu_id:that.data.apply_stu_id,
        name:that.data.apply_name
        },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 'isbutnoconnect') {
          that.setData({
            club_user_info: res.data.info
          })
        }
        else {
          wx.showModal({
            title: '请手动输入余下信息',
            content: '社团信息表中未能找到您的信息，可能由于社团管理员未能导入信息',
            showCancel: false
          })
          that.setData({
            ismember: true,
            
          })
        }

      }
    })
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.load()
  },
  load: function () {
    console.log(1)
    var that = this;
    //检查wxsession是否过期
    wx.checkSession({
      success: function () {
        wx.getUserInfo({
          success(res) {
            console.log(2)
          }
        })
      },
      fail: function () {
        app.checkstate(function (userInfo) {
          //更新数据  
          that.setData({
            userInfo: userInfo
          })
          wx.setStorage({
            key: 'userinfo',
            data: that.data.userInfo,
          })
        })
        console.log(3)
      }
    });

    that.data.thirdid = wx.getStorageSync('thirdid');

    console.log(that.data.thirdid);
    //通过下面的接口，检查本thirdid是否有效，检查用户是否注册车协账户
    wx.request({
      //
      url: app.check_id_url + 'thirdid=' + that.data.thirdid,
      success(res) {
        console.log(5);
        that.setData({
          reply: res.data,
        })
        console.log(res.data)
        if (res.data.code == 'unlogin') {
          app.userlogin();
          wx.showLoading({
            title: '登陆中',
          })
        }
        else if (res.data.code == 'notmember') {
          that.setData({
            apply: '提交注册申请',
            getinfo: "getinfo"
          })
        }
        //若是会员，则
        else if (res.data.code == "ismember") {
          that.setData({
            show: '',
            apply: '修改资料',
            club_user_info: res.data.info,
            idi: true,
            getinfo: "",
            tap4: '我的资料',
          })
        }
      }
    })
    //获取该社团的活动列表
    wx.request({
      url: app.getactivity_url + 'club_id=1',//目前车协id=1,故写死
      success(res) {
        that.data.activity_list=res.data.data;
        for(var i=0;i<res.data.data.length;i++){
          that.data.activity_list.start_time = that.data.activity_list[i].start_time.substring(0,10);
          that.data.activity_list.end_time = that.data.activity_list[i].end_time.substring(0, 10);
        }
        that.setData({
          activity_list: that.data.activity_list
        })

      }
    })
  },
  sign: function () {
    var that = this;
    var u = 'https://api.dxxywzd.cn/basic/web/index.php/?r=user/signclub&thirdid=' + that.data.thirdid + '&name=' + that.data.name + '&gender=' + that.data.gender + '&id_number=' + that.data.id + '&school=' + that.data.school + '&home=' + that.data.home + '&class=' + that.data.class + '&birth=' + that.data.birth + '&phone=' + that.data.phone + '&nation=' + that.data.nation;
    console.log(u)
    wx.request({
      url: u,
      success(res) {
        if (res.data == 'success') {
          wx.showToast({
            title: '注册成功',
          })
          that.setData({
            tap4: '我的资料'
          })
        }
      }
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成  
  },
  onShow: function () {
    // 生命周期函数--监听页面显示  
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏  
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载  
  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作  
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数  
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享  
    return {
      title: '华北电力大学征途车协', // 分享标题  
      desc: 'desc', // 分享描述  
      path: '/pages/club/club' // 分享路径  
    }
  }
}) 