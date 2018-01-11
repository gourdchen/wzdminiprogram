// pages/show/show.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    fj: '',
    fj_display: true,
    percent:[],
    down_open:[],
    bind:[],
    path:[],
    id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id//接收content页面跳转传入的文章id
    })
    console.log(options)
    var that = this;
    //把文章id传入这个接口，以获取文章的内容、标题、时间
    wx.request({
      url: app.articlecontent_url+'&tz_id='+that.data.id,
      success(res){
        that.setData({
          content:res.data.data
        })
      }
    })
    //把文章id传入这个接口，返回附件的数组，每个数组包含 文件名和文件的链接
    wx.request({
      url: app.articlefile_url+'&tz_id=' + that.data.id,
      success(res) {
        console.log(res)
        that.setData({
          fj: res.data.data,//保存附件数组
          percent:res.data.data,//创建附件数组长度的percent数组
          path:res.data.data,//创建附件数组长度的path数组
          fj_display:false//附件模块开启显示
        })
        if(res.data.data[0].length==0){
          that.setData({
            fj_display: true//附件模块开启显示
          })
        }
        for (var i = 0; i < that.data.fj.length; i++) {
          /*这是之前的写法
          var temp = "percent[" + i + "]"
          var temp1="down_open["+i+"]"
          var temp2="bind["+i+"]"
          that.setData({
            [temp]: 0,
            [temp1]:'下载',
            [temp2]:'download',
            
          })
          */
          //最新写法
          that.data.percent[i]=0;
          that.data.down_open[i]='下载';
          that.data.bind[i]='download';
        }
        that.setData({
          percent:that.data.percent,
          down_open:that.data.down_open,
          bind:that.data.bind,
        })
      }
    })
    console.log(this.data)
    
  },
  //下载函数，由按钮触发
  download: function (res) {
    var that = this;
    //获取触发函数的按钮id，即是附件在附件数组中的序号
    var fj_index=res.target.id;
    //downloadTask是一个监控下载的类
    const downloadTask=wx.downloadFile({
      url: this.data.fj[fj_index].Url,//设置url为附件数组对应元素的链接
      header: {},
      success: function (res) { 
        console.log('成功')
        //下载成功后调用savafile接口保存文件
        wx.saveFile({
          //res.tempFilePath是下载完成后返回的临时路径
          tempFilePath: res.tempFilePath,
          success(res){
            console.log(res.savedFilePath)
            /*此处我仿照上面再改写一次
            var temp="path["+source.target.id+"]"
            var temp1 = "down_open[" + source.target.id + "]"
            var temp2="bind["+source.target.id+"]"
            that.setData({
              [temp]:res.savedFilePath,
              [temp1]:"打开",
              [temp2]:"openfile"
            })
             */
            that.data.path[fj_index]=res.savedFilePath;
            that.data.down_open[fj_index]='打开';
            that.data.bind[fj_index]='openfile';
            that.setData({
              path:that.data.path,
              down_open:that.data.down_open,
              bind:that.data.bind,
            })
          }
        })
      },
      fail: function (res) { 
        console.log(11111)
      },
      complete: function (res) { },
    });
    downloadTask.onProgressUpdate((res) => {
      var temp="percent["+fj_index+"]"
      that.setData({
        [temp]:res.progress
      })
      console.log('已经下载的数据长度', res.totalBytesWritten)
      console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
    });
  },
  openfile: function(res){
    wx.openDocument({
      filePath: this.data.path[res.target.id]
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
  onShow: function (options) {
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