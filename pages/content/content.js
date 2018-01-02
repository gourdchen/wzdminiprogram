// content.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   list:'enpty',
   inputValue:'英语'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.start()
    
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../content/content'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    console.log('输入了' + this.data.inputValue)
  },
  bindsearchTap: function () {
    console.log('1'),
    wx.navigateTo({
      url: '../search/search?title=' + this.data.inputValue,
    })
  },
  start:function(){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.tz_list_url,
      data:{
        page:app.no
      },
      method:'GET',
      success: function (res) {
        console.log(res);
        app.index = res.data;
        that.setData({
          list: res.data
        })
        wx.hideLoading();
      }
    })
  },
  refresh:function(){
   app.index='';
   app.no=1;
   this.setData({
     list : ""
   })
   this.start();
  },
  update:function(e){
    console.log('2')
     app.no=app.no+1
     var that = this;
     wx.showLoading({
       title: '加载中',
     })
     wx.request({
       url: app.tz_list_url+'&page=' + app.no,
       success: function (res) {
         console.log(res);
         app.index =app.index.concat( res.data);
         that.setData({
           list: app.index
         })
         wx.hideLoading();
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