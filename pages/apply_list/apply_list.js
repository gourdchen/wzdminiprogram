// pages/apply_list/apply_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    apply_list:[{'name':'晓东','stu_id':'1234567890','phone':'0987654321'},
      { 'name': '晓东', 'stu_id': '1234567890', 'phone': '0987654321' },
      { 'name': '晓东', 'stu_id': '1234567890', 'phone': '0987654321' },
      { 'name': '晓东', 'stu_id': '1234567890', 'phone': '0987654321' },]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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