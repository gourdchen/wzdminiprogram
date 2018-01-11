// pages/my_club/my_club.js
var app=getApp();
Page({

  /**_
   * 页面的初始数据
   */
  data: {
  act_list:[
  ],
  club_index:0,
  showmask:false,
  currentTab: 0,
  club_info:{'name':'征途自行车协会','info':'测试测试','logo':'/image/zt.jpg'}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      club_index: e.detail.value
    })
    this.changeclub()
    
  },
  swichNav: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current,
      })
    }
  },
  
  display(e){
    var i = e.target.id;
    this.data.act_list[i].display = !this.data.act_list[i].display
    this.setData({
      act_list: this.data.act_list
    })
  },
  add_act(){
    var newact = { 'act_id':-1,'act_name': '新的活动', 'place': '', 'start_date': '2018-1-1', 'start_time': '8:00', 'end_date': '2018-1-1', 'end_time': '16:00', 'display': true, 'dead_date':'2018-2-2'};
    this.data.act_list.unshift(newact);//数组头部插入新的活动
    this.setData({
      act_list: this.data.act_list,
      showmask:true
    })
  },
  cancel_button:function(){
    this.data.act_list.splice(0, 1)
    var that =this
    this.setData({
      showmask:false,
      act_list:that.data.act_list,
    })
    
  },
  update_club_info:function(){
    var that =this;
    var i=0;
    for(;i<100;i++){}
    wx.request({
      url: app.upload_img,
      data:{
        info:that.data.club_info.info,
        club_id:that.data.club_info.club_id
      },
      method:'POST',
      header:{
        'content-type':app.header
      },
      success(res){
        console.log(res.data)
      }
    })
  },
  input_info:function(e){
   this.data.club_info.info=e.detail.value
   var that=this
    this.setData({
       club_info:that.data.club_info
    })
  },
  onLoad: function (options) {
    
  },
  onShow:function(){
    this.load()
  },
  load:function(){
    this.data.thirdid = wx.getStorageSync('thirdid');
    var that = this;
    wx.request({
      url: app.manage_club,
      data:{
        thirdid:that.data.thirdid
      },
      success(res){
        if(res.data.code==401){
          app.userlogin()
        }
        console.log('获取管理列表')
        console.log(res.data)
        console.log(res.data.data.length)
        that.setData({
          club_list:res.data.data
        })
        if(res.data.data.length>=1){
          that.changeclub()
          wx.request({
            url: app.getactivity_url + 'club_id='+that.data.club_list[0].club_id + '&thirdid=' + that.data.thirdid,
            success(res) {
              console.log(res.data)
              console.log('my_club load（）函数')
              if(res.data.code==200){
              that.setData({
                act_list: res.data.data,
                thirdid: that.data.thirdid
              })}
              if (res.data.code == 401) {
                app.checkstate(that.load)
              }
              if(res.data.code==204){
                wx.showToast({
                  title: '没有活动',
                  image:'/image/erro.png'
                })
              }
            }
          })
        }
      }
    })
    
   
  },
  changeclub:function(){
    var that = this;
      wx.request({
        url: app.get_club_info,
        data:{
          club_id:that.data.club_list[that.data.club_index].club_id
        },
        success(res){
          console.log(res.data)
          that.setData({
            club_info:res.data.data
          })
        }
      })
      wx.request({
        url: app.getactivity_url + 'club_id=' + that.data.club_list[that.data.club_index].club_id + '&thirdid=' + that.data.thirdid,
        success(res) {
          that.setData({
            act_list:[]
          })
          console.log(res.data)
          console.log('my_club load（）函数')
          if (res.data.code == 200) {
            that.setData({
              act_list: res.data.data,
              thirdid: that.data.thirdid
            })
          }
          if (res.data.code == 401) {
            app.checkstate(that.load)
          }
          if (res.data.code == 204) {
            wx.showToast({
              title: '没有活动',
              image: '/image/erro.png'
            })
          }
        }
      })
  },
  delete_act:function(e){
    var that = this
    var index = e.target.id
    wx.request({
      url: app.delete_act,
      data:{
        act_id:that.data.act_list[index].act_id
      },
      success(res){
        if(res.data.code==200){
          wx.showToast({
            title: '成功',
          })
        }
      }
    })
  },
  submit_button:function(e){
    var that = this;
    if(that.data.act_list[0].act_id=='-1'){
    wx.request({
      url: app.add_act_url,
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        club_id:that.data.club_info.club_id,
        thirdid:that.data.thirdid,
        start_time:that.data.act_list[0].start_time,
        start_date:that.data.act_list[0].start_date,
        end_time:that.data.act_list[0].end_time,
        end_date:that.data.act_list[0].end_date,
        content: that.data.act_list[0].content,
        place:that.data.act_list[0].place,
        act_name:that.data.act_list[0].act_name,
        dead_date:that.data.act_list[0].dead_date,
      },
      method:'POST',
      success(res){
        if(res.data.code==200){
          wx.showToast({
            title: '成功',
          })
        }
        else{
          wx.showToast({
            title: '提交失败，请重试',
          })
        }
        that.setData({
          showmask:false
        })
      }
    })}
  }
  ,
/**
 * 更换logo方法
 */
  change_logo:function(){
    var that=this;
    count:1
    wx.chooseImage({
      success: function(res) {
        that.setData({
          logo_path:res.tempFilePaths
        })
        console.log('图片路径'+that.data.logo_path[0])
        const uploadTask =wx.uploadFile({
          url: app.upload_img,
          filePath: that.data.logo_path[0],
          name: 'logo',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData:{
              club_id:that.data.club_info.club_id
          },

          success(res){
            console.log(res.data)
          }
        })
        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          if(res.progress==100){
            wx.showModal({
              title: '上传成功',
              content: '请返回刷新',
              showCancel:false,
            })
          }
        })
      },
    })
  },
  update:function(e){
    wx.showLoading({
      title: '加载中',
    })
    var index=e.target.id
    console.log(e)
    console.log(index)
    var that=this
    wx.request({
      url: app.update_act,
      data:{
        club_id:that.data.club_info.club_id,
        thirdid: that.data.thirdid,
        act_id: that.data.act_list[index].act_id,
        start_time: that.data.act_list[index].start_time,
        start_date: that.data.act_list[index].start_date,
        end_time: that.data.act_list[index].end_time,
        end_date: that.data.act_list[index].end_date,
        content: that.data.act_list[index].content,
        place: that.data.act_list[index].place,
        act_name: that.data.act_list[index].act_name,
        dead_date: that.data.act_list[index].dead_date,
      },
      method:'POST',
      header:{
        'content-type':app.header
      },
      success(res){
        console.log(res.data)
        if(res.data.code==200){
          wx.hideLoading()
          wx.showToast({
            title: '更新成功',
          })
        }
      }
    })
  },
  navigate:function(e){
    var that=this
    wx.navigateTo({
      url: '/pages/apply_list/apply_list?act_id='+that.data.act_list[e.target.id].act_id,
    })
  }
  ,
  input_act_content:function(e){
    console.log(e)
    var index = e.target.id;
    var content = e.detail.value;
    this.data.act_list[index].content = content;
    var that = this;
    this.setData({
      act_list: that.data.act_list
    })
  },
  input_act_name :function(e){
    console.log(e)
    var index=e.target.id;
    var name=e.detail.value;
    this.data.act_list[index].act_name=name;
    var that = this;
    this.setData({
      act_list:that.data.act_list
    })
  },
  input_act_place: function (e) {
    var index = e.target.id;
    var place = e.detail.value;
    this.data.act_list[index].place = place;
    var that = this;
    this.setData({
      act_list: that.data.act_list
    })
  }, 
  change_start_date: function (e) {
    console.log(e)
    var index = e.target.id;
    var date = e.detail.value;
    this.data.act_list[index].start_date = date;
    var that = this;
    this.setData({
      act_list: that.data.act_list
    })
  }, 
  change_dead_date:function(e){
    var index = e.target.id;
    var time = e.detail.value;
    this.data.act_list[index].dead_date = time;
    var that = this;
    this.setData({
      act_list: that.data.act_list
    })
  },
 change_start_time: function (e) {
    var index = e.target.id;
    var time = e.detail.value;
    this.data.act_list[index].start_time = time;
    var that = this;
    this.setData({
      act_list: that.data.act_list
    })
  }, 
 change_end_date: function (e) {
   var index = e.target.id;
   var date = e.detail.value;
   this.data.act_list[index].end_date =date;
   var that = this;
   this.setData({
     act_list: that.data.act_list
   })
 }, 
 change_end_time: function (e) {
   var index = e.target.id;
   var time = e.detail.value;
   this.data.act_list[index].end_time = time;
   var that = this;
   this.setData({
     act_list: that.data.act_list
   })
 },
 change_dead_time: function (e) {
   var index = e.target.id;
   this.data.act_list[index].dead_date = e.detail.value;
   var that = this;
   this.setData({
     act_list: that.data.act_list
   })
 },
})