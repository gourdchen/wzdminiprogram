// pages/apply_list/apply_list.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var act_id=options.act_id
    var that = this
    wx.request({
      url: app.get_act_join_user,
      data:{
        act_id:act_id
      },
      success(res){
        console.log(res.data)
        that.setData({
          apply_list:res.data.data
        })
      }
    })
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
  phone:function(e){
    console.log(e)
    var index=e.target.id;
    var that=this;
    wx.makePhoneCall({
      phoneNumber:that.data.apply_list[index].phone
    })
  }
})