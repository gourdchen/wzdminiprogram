// look/look.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: '/image/chexie.jpg',
    findlist: [
      { id: 1, title: '征途自行车协会相关公示和申请', word: '', price: '', cont: '' }
    ]

   
  },
navigate:function(e){
  var that = this
  console.log(e)
  app.club_list=that.data.club_list
  wx.navigateTo({
    url: '/pages/club/club?club_index='+e.target.id,
  })
},
  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function (options) {
      var that = this
      //调用应用实例的方法获取全局数据  
      app.checkstate();
      this.data.type=options.type;
      wx.request({
        url: app.get_club_list,
        success(res){
          that.setData({
            club_list:res.data.data
          })
        }
      })
  }
  ,
  onPullDownRefresh:function(){
    console.log('下拉刷新')
      this.setData(
        {
          club_list:[]
        }
      )
      wx.request({
        url: app.get_club_list,
        success(res) {
          that.setData({
            club_list: res.data.data
          })
          wx.stopPullDownRefresh()
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
  
  }
})