// pages/my_club/my_club.js
var app=getApp();
Page({

  /**_
   * 页面的初始数据
   */
  data: {
  act_list:[
  ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  display(e){
    var i = e.target.id;
    this.data.act_list[i].display = !this.data.act_list[i].display
    this.setData({
      act_list: this.data.act_list
    })
  },
  newact(){
    var newact = { 'act_id':-1,'act_name': '新的活动', 'place': '', 'start_date': '2018-1-1', 'start_time': '8:00', 'end_date': '2018-1-1', 'end_time': '16:00', 'display': true };
    this.data.act_list.unshift(newact);//数组头部插入新的活动
    this.setData({
      act_list: this.data.act_list
    })
  },
  onLoad: function (options) {
    this.data.thirdid=wx.getStorageSync('thirdid');
    var that = this;
    wx.request({
      url: app.getactivity_url+'club_id=1',
      success(res){
        that.setData({
          act_list:res.data.data
        })
      }
    })
    wx.request({
      url: app.getclubuser_url+'&thirdid='+that.data.thirdid,
      success(res){
        that.setData({
          reply:res.data,
        })
      }
    })
  },
  input:function(e){
   this.data.id_number=e.detail.value;
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  submit_button:function(e){
    var that = this;
    if(that.data.act_list[0].act_id=='-1'){
    wx.request({
      url: app.releaseactivity_url,
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        club_id:'1',
        start_time:that.data.act_list[0].start_time,
        start_date:that.data.act_list[0].start_date,
        end_time:that.data.act_list[0].end_time,
        end_date:that.data.act_list[0].end_date,
        content:'车协活动',
        place:that.data.act_list[0].place,
        act_name:that.data.act_list[0].act_name,
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
      }
    })}
  }
  ,
  navigate:function(){
    wx.navigateTo({
      url: '/pages/apply_list/apply_list',
    })
  }
  ,
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
})