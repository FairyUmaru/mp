// pages/product/product.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasActionBar: false,
    goodsPic:[
      "//img.alicdn.com/imgextra/i2/2208026037173/O1CN01opoxiZ22rHbgXebBf_!!2208026037173.jpg_760x760Q50s50.jpg_.webp",
      "//img.alicdn.com/imgextra/i1/2208026037173/O1CN01WgQQ8L22rHbgCJF6C_!!2208026037173.jpg_760x760Q50s50.jpg_.webp",
      "//img.alicdn.com/imgextra/i1/2208026037173/O1CN01OAsSPP22rHbgXdzp4_!!2208026037173.jpg_760x760Q50s50.jpg_.webp",
      "//img.alicdn.com/imgextra/i3/2208026037173/O1CN014KUTmx22rHbSol8pF_!!2208026037173.jpg_760x760Q50s50.jpg_.webp"
    ],
    img: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imageIndex:0,//swiper
    goodsDetails: {
      title: '迷你世界宇宙少女团娃娃摆件花小楼潮流玩具皮肤礼物',
      salePrice: '120',
      price: 130,
      detailImageList: [
        "//img.alicdn.com/imgextra/i4/2208026037173/O1CN01RylDJm22rHbgI0qen_!!2208026037173.jpg_760x760Q90s50.jpg_.webp"
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let id = options.id
    this.setData({
      hasActionBar: app.hasActionBar
    })
    // wx.startGyroscope({
    //   interval: "normal",
    // })
    // wx.onGyroscopeChange(this.gyroscope)
  },
  gyroscope(res) {
    console.log(res)
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
    wx.stopGyroscope()
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