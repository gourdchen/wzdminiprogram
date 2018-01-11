/**
 * club变量说明
 * 主要变量：activity_list 活动列表
 * club_user_info 社团用户信息
 * club_info 社团信息
 * have_info 是否注册标志
 * club_isjoin 是否加入社团标志
 */
var app = getApp();
Page({
  data: {
    // tab切换
    currentTab: 0,
    //动画透明度
    rot:180,
    height:400,
    y:40,
    info: '征途自行车协会成立于2007年，十年来，致力于发展骑行事业。\n我们的常规活动时间为4月-10月每个周末\n远征时间为寒暑假期',
    club_name: '征途自行车协会',
    activity_list: [],
    showmask: false,//弹窗显示
    logo: '/image/zt.jpg',
    apply: 0,//加入社团按钮绑定内容
    apply_act: '申请参加',//参加活动按钮绑定内容
    date: "2017-12-12",
    birth: "2000-1-1",
    thirdid: 0,
    tap4: '我的资料',
    club_user_info:{}
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
  
  /*提交活动申请触发
  * 申请活动函数
  */
  bindtap_submit(e) {
    var that = this;
    var index=e.target.id;
    this.setData({
      apply_index:index
    })
    wx.showLoading({
      title: '加载中',
    })
    //若用户没有信息在数据库中，user_info便未定义，弹出窗口填写信息
    if (this.data.have_info != true) {
      this.setData({
        showmask: true
      })
      wx.hideLoading()
    }
    //若用户已有信息，无需填写，直接验证即可
    else {
      this.apply_act()
    }
  },
  //申请处理函数
  apply_act:function(){
    console.log('正在参加活动')
    var that=this;
    wx.request({
      url: app.applyactivity_url,
      method: 'GET',
      data: {
        thirdid: that.data.thirdid,
        act_id: that.data.activity_list[that.data.apply_index].act_id,
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == '200') {
          wx.showToast({
            title: '参加成功',
          })
          //var temp = 'activity_list[' + that.data.apply_index+'].isjoin'
          that.data.activity_list[that.data.apply_index].isjoin=true
          that.setData({
              activity_list:that.data.activity_list
             //[temp]: true
          })
        }
        else {
          wx.showToast({
            title: '发生未知错误',
            image: '/image/erro.png',
          })
        }
      }
    })
  },
  //弹框点击确定触发,此时发送用户注册信息到后台并且参加活动
  apply_send(index) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (typeof that.data.club_user_info.name == 'undefined' | typeof that.data.club_user_info.stu_id == 'undefined' | typeof that.data.club_user_info.phone == 'undefined') {
      wx.showToast({
        title: '请输入完整信息',
        image: '/image/erro.png',
        mask: true
      })
      return 0
    }
    //this.getinfo();//只有在信息表里面有信息时才返回0
    wx.showLoading({
      title: '发送请求中',
    })
    //循环等待 getinfo 请求成功
    var times = setInterval(function () {
      // 若login为真，则说明请求成功
      //var login = that.data.login_state
      clearTimeout(times)
     // console.log(login)
      if (true) {
        if(false) {
          /*that.setData({
            showmask: false,
          })
          that.apply_act()
          wx.hideLoading()
          wx.showLoading({
            title: '参加活动中',
          })
          clearTimeout(times)*/
        }
        else {
          console.log('开始注册流程')
          wx.request({
            url: app.club_register,
            data: {
              thirdid: that.data.thirdid,
              name: that.data.club_user_info.name,
              stu_id: that.data.club_user_info.stu_id,
              phone: that.data.club_user_info.phone,
              all: false,
            },
            method: 'POST',
            header: {
              'content-type': app.header
            },
            success(res) {
              console.log('注册完成，准备参加活动')
              console.log(res.data)
              if (res.data.code == 200) {
                that.apply_act()
                clearTimeout(times)
              }
            }
          })
        }   
      }
    },100)
    
  },
  submit_cancel() {
    this.setData({
      showmask: false
    })
  },
  apply_canel(e){
    wx.showLoading({
      title: '取消中',
    })
    var cancel_index=e.target.id;
    var that = this;
    wx.request({
      url: app.cancelactivity_url,
      data:{
        thirdid:that.data.thirdid,
        act_id:that.data.activity_list[cancel_index].act_id,
      },
      success(res){
        console.log(res.data)
        if(res.data.code==200){
          //var temp = 'activity_list[' + cancel_index + '].isjoin'
          that.data.activity_list[cancel_index].isjoin=false
          that.setData({
            activity_list:that.data.activity_list
            //[temp]:false
          })
          wx.hideLoading()
          wx.showToast({
            title: '取消成功',
          })
        
        }
      }
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
      url: app.lead_url,
      data: {
        stu_id: that.data.club_user_info.stu_id,
        name: that.data.club_user_info.name,
        thirdid: that.data.thirdid,
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.code == 200) {
          that.setData({
            club_user_info: res.data.data,
            login_state:0
          })
        }
        else if (res.data.code == 416) {
          wx.showModal({
            title: '请手动输入余下信息',
            content: '社团信息表中未能找到您的信息，可能由于社团管理员未能导入信息',
            showCancel: false
          })
          that.setData({
            login_state: 1
          })
        }
        else if (res.data.code == 406) {
          console.log('输入姓名和学号 在资料库中不匹配，请手动输入您的完整信息')
          that.setData({
            login_state:1
          })
        }
        else if (res.data.code == 403) {
          console.log('您的微信号已经绑定了一名用户，只需在 我的资料页面更改资料 即可')
          that.setData({
            login_state: 0
          })
        }
        else if(res.data.code== 401){
          app.checkstate()
          that.setData({
            login_state: 0
          })
        }
      }
    })
  },

  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.load(options)
  },
  load: function (op) {
    var club_index=op.club_index;
    var club=app.club_list[club_index]
    wx.setTopBarText({
      text: club.name,
    })
    this.setData({
      club:club
    })
    console.log(1)
    var that = this;
    //检查wxsession是否过期
    app.checkstate(function (userInfo) {
      //更新数据  
      that.setData({
        userInfo: userInfo
      })
      wx.setStorage({
        key: 'userinfo',
        data: that.data.userInfo,
      })
      console.log('onload 准备提取thirdid');
      that.data.thirdid = wx.getStorageSync('thirdid');
      console.log('onload 已提取thirdid'+that.data.thirdid);
      that.getact();
      console.log('onload 准备检测用户社团信息');
      that.check_club_id();
      console.log('onload 准备检测用户是否加入');
      that.isjoin();
      wx.request({
        url: app.get_join_act_count,
        data:{
          club_id: that.data.club.club_id,
          thirdid:that.data.thirdid
        },
        success(res){
          that.setData({
            join_count:res.data.data
  
          })
        }
      })
    })
    console.log(this.data.userInfo)
    
    console.log(that.data.thirdid);
    //通过下面的接口，检查本thirdid是否有效，检查用户是否注册车协账户  
  },
  check_club_id:function(){
    var that = this;
    wx.request({
      //
      url: app.check_club_id_url + '&thirdid=' + that.data.thirdid,
      //data: { thirdid: that.data.thirdid },
      header:{
        'Content-type': 'application/json;charset=gbk'
      },
      success(res) {
        console.log('club login发送的是'+that.data.thirdid)
        console.log('club login获取的thirdid是'+that.data.thirdid)
        console.log('login 返回'+res.data);
        //=200 有信息
        if (res.data.code == 200) {
        
          that.setData({
            club_user_info: res.data.data,
            apply: '修改资料',
            idi: true,
            getinfo: "",
            have_info: true,
          })
          if (res.data.data.home == null | res.data.data.school == null | res.data.data.class == null | res.data.data.birth == null | res.data.data.nation == null | res.data.data.gender == null){
          that.setData({
            have_all_info:false
          })
          if (res.data.data.birth == null){
            that.data.club_user_info.birth='2000-1-1'
            that.setData({
              club_user_info: that.data.club_user_info
            })
          }
          }
        }
        //=403数据库中无用户信息
        else if (res.data.code == 403) {
          that.setData({
            apply: '资料更新',
            getinfo: "getinfo",
            have_info: false,
          })
        }
        //thirdid失效
        //thirdid失效
        else if (res.data.code == 401) {
          app.userlogin()
          that.setData({
            have_info: false,
          })
        }
        else {
          that.setData({
            have_info: false,
          })
        }
      }
    })
  },
  isjoin:function(){
    var that =this
    wx.request({
      url: app.check_club_isjoin,
      data: {
        thirdid: that.data.thirdid,
        club_id: that.data.club.club_id
      },
      success(res) {
        console.log('isjoin 返回'+res.data.message)
        if(res.data.code==0){
          var p=false
        }
        else{
          var p=true
        }
        that.setData({
          club_isjoin: p
        })
      }
    })
  },
  getact:function(){
    var that = this;
    wx.request({
      url: app.getactivity_url + 'club_id='+that.data.club.club_id +'&thirdid='+that.data.thirdid,//目前车协id=1,故写死
      success(res) {
        console.log(res.data)
        if(res.data.code==200){
        that.data.activity_list = res.data.data;
        //处理时间 mysql中时间为xxxx-xx-xx xx:xx:xx 过于冗长
        for (var i = 0; i < res.data.data.length; i++) {
          //that.data.activity_list[i].isapply = '申请参加';
          //that.data.activity_list[i].bindtap = 'bindtap_submit';
          that.data.activity_list[i].start_time = that.data.activity_list[i].start_time.substring(0, 6);
          that.data.activity_list[i].end_time = that.data.activity_list[i].end_time.substring(0, 6);
          if (that.data.activity_list[i].end_date != that.data.activity_list[i].start_date) {
            that.data.activity_list[i].end_date = that.data.activity_list[i].end_date.substring(5, 10);
          }
          else {
            that.data.activity_list[i].end_date = ''
          }

        }
        that.setData({
          activity_list: that.data.activity_list
        })
        }
        else{
          wx.showModal({
            title: '该社团没有任何活动',
            content: '',
            showCancel:false
          })
        }
      }
    })
  },
  apply_join_club:function(){
    var that=this
    wx.showLoading({
      title: '加载中',
    })
    if (typeof that.data.club_user_info.name == 'undefined' | typeof that.data.club_user_info.stu_id == 'undefined' | typeof that.data.club_user_info.phone == 'undefined') {
      wx.showToast({
        title: '请输入完整信息',
        image: '/image/erro.png',
        mask: true
      })
      return 0
    }
    //have_info 从服务器端返回的信息，若有，则其肯定已注册
    if (this.data.have_info) {
      wx.request({
        url: app.apply_join_club,
        data:{
          club_id:that.data.club.club_id,
          thirdid:that.data.thirdid,
        },
        success(res){
          console.log(res.data)
          if(res.data.code==200){
            wx.hideLoading()
            wx.showToast({
              title: '成功',
            })
          }
          that.check_club_id();
          that.getact();
          that.isjoin();
        }
      })
    }
      //无信息则需调用 lead 方法尝试导入
      
    else {
       //this.getinfo();
       var times = setInterval(function () {
         clearTimeout(times)
         // 若login为真，则说明请求成功
         var login = that.data.login_state
         console.log(login)
         if (typeof login == 'undefined') {
           if (login == 0) {/*
             that.setData({
               showmask: false,
             })
             wx.hideLoading()
             wx.showLoading({
               title: '注册中',
             })
             clearTimeout(times)
             wx.request({
               url: app.apply_join_club,
               data: {
                 club_id: '1',
                 thirdid: that.data.thirdid,
               },
               success(res) {
                 console.log(res.data)
                 wx.hideLoading()
                 if(res.data.code==200){
                   wx.showToast({
                     title: '加入成功',
                   })
                   that.check_club_id();
                   that.getact();
                   that.isjoin();
                 }
               }
             })
           */}
           else {
             console.log('即将注册社团信息')
             wx.request({
               url: app.club_register,
               data: {
                 thirdid: that.data.thirdid,
                 name: that.data.club_user_info.name,
                 stu_id: that.data.club_user_info.stu_id,
                 phone: that.data.club_user_info.phone,
                 gender: that.data.club_user_info.gender,
                 nation: that.data.club_user_info.nation,
                 home: that.data.club_user_info.home,
                 birth: that.data.club_user_info.birth,
                 school: that.data.club_user_info.school,
                 'class': that.data.club_user_info.class,
                 phone: that.data.club_user_info.phone,
                 all: true,
               },
               method: 'POST',
               header: {
                 'content-type': app.header
               },
               success(res) {
                 console.log('注册社团信息完成')
                 console.log(res.data)
                 if (res.data.code == 200) {
                   clearTimeout(times)
                   wx.request({
                     url: app.apply_join_club,
                     data: {
                       club_id: that.data.club.club_id,
                       thirdid: that.data.thirdid,
                     },
                     success(res) {
                       console.log(res.data)
                       wx.hideLoading()
                       if (res.data.code == 200) {
                         wx.showToast({
                           title: '加入成功',
                         })
                         that.check_club_id();
                         that.getact();
                         that.isjoin();
                       }
                     }
                   })
                 }
                else if(res.data.code==402){
                   clearTimeout(times)
                   console.log('已存在')
                }
               }
             })
           }
         }
       }, 100)
    }
    this.setData({
      dis_info:true
    })
    
  },
  update :function(){
    var that = this;
    wx.request({
      url: app.edit_club_user_info,
      data: {
        thirdid: that.data.thirdid,
        name: that.data.club_user_info.name,
        stu_id: that.data.club_user_info.stu_id,
        phone: that.data.club_user_info.phone,
        gender: that.data.club_user_info.gender,
        nation: that.data.club_user_info.nation,
        home: that.data.club_user_info.home,
        birth: that.data.club_user_info.birth,
        school: that.data.club_user_info.school,
        'class': that.data.club_user_info.class,
        phone: that.data.club_user_info.phone,
        all: true,
      },
      method: 'POST',
      header: {
        'content-type': app.header
      },
      success(res){
        console.log(res.data)
        console.log('更新成功')
        if(res.data.code==200){
          wx.showToast({
            title: '更新成功',
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
    
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in',
      transformOrigin: "50% 50%",
    })
    var icon_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in',
      transformOrigin: "50% 50%",
    })
    this.animation = animation
    this.icon_animation=icon_animation

  },
  display_user_info:function(){
    if(!this.data.have_info){
      this.setData({
        ['club_user_info.birth']: '2000-1-1'
      })
    }
    console.log('触发动作函数')
    
    this.animation.height(this.data.height).step()
    this.data.height = 400 - this.data.height
    this.data.y=-this.data.y
    this.icon_animation.rotate(this.data.rot).step()
    this.data.rot = 180-this.data.rot
    var that=this;
    this.setData({
      animationdata: that.animation.export(),
      icon_animationdata: that.icon_animation.export()
    })
    
    

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
  },
  bindchange_date(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindchange_birth(e) {
    var that = this;
    this.data.club_user_info.birth = e.detail.value;
    this.setData({
      club_user_info: that.data.club_user_info
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
  input_apply_name(e) {
    this.setData({

      'club_user_info.name': e.detail.value
    })
  },
  input_apply_stu_id(e) {
    this.setData({

      'club_user_info.stu_id': e.detail.value
    })
  },
  input_apply_phone(e) {
    this.setData({

      'club_user_info.phone': e.detail.value
    })
  },
}) 