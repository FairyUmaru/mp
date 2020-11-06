const start = { pageX: 0, pageY: 0, cssX: 0, cssY: 0 }
const last = { disY: 0, cssY: 0, time: 0, disTime: 0 }
let isMove = false
Page({
  data: {
    imageWidth: 1252,
    rotateX: 0,
    rotateY: 0,
    animation: null,
    boxViewStyles: [

    ]
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    // 页面加载完成
    const images = [
      'http://static.webfed.cn/panorama/1/cf_0.jpg?imageslim',
      'http://static.webfed.cn/panorama/1/cf_1.jpg?imageslim',
      'http://static.webfed.cn/panorama/1/cf_2.jpg?imageslim',
      'http://static.webfed.cn/panorama/1/cf_3.jpg?imageslim',
      'http://static.webfed.cn/panorama/1/cf_4.jpg?imageslim',
      'http://static.webfed.cn/panorama/1/cf_5.jpg?imageslim',
    ]
    // const images = [
    //   '/static/right.front.jpg',  '/static/right.left.jpg','/static/right.right.jpg', '/static/right.top.jpg', '/static/right.back.jpg','/static/right.bottom.jpg', , 
    // ]
    images.forEach((url,i) => {
      let style = `background-image: url('${url}'); background-repeat: no-repeat; transform: ${this.getRotate(i)} translateZ(-${this.data.imageWidth / 2 - 3}px);`;
      this.setData({
        [`boxViewStyles[${i}]`]: style
      })
    })
    console.log(this.data.boxViewStyles)
  },
  getRotate (i) {
    return i < 4 ? `rotateY(-${i * 90}deg)` : `rotateX(${i === 4 ? -90 : 90}deg)`
  },
  onReady() {
    
  },
  onShow() {
    // 页面显示
  },
  touchStart(e) {
    isMove = true
    // 动画停止
    start.pageX = e.pageX || e.touches[0].pageX
    start.pageY = e.pageY || e.touches[0].pageY

    start.cssY = this.data.rotateX
    start.cssX = this.data.rotateY
    console.log(start.cssY, start.cssX)
    // last.time = Date.parse(new Date()) 
    last.time = ~~new Date()
    console.log(last.time)
    last.disX = 0
    last.disY = 0

    last.cssX = start.cssX
    last.cssY = start.cssY
    last.disTime = 0
  },
  touchMove(e) {
    if(!isMove) return;
    console.log('move', e)
    let disX = ((e.pageX || e.touches[0].pageX) - start.pageX) / 10
    let disY = ((e.pageY || e.touches[0].pageY) - start.pageY) / 10

    let cssX = start.cssX - disX
    let cssY = start.cssY + disY
    if(cssY < -90){
        cssY = -90
      }
      if(cssY > 90){
        cssY = 90
      }
    // const nowTime = Date.parse(new Date()) 
    const nowTime = ~~new Date()

    this.setData({
      rotateX: cssY,
      rotateY: cssX
    })

    last.disX = cssX - last.cssX
    last.disY = cssY - last.cssY

    last.cssX = cssX
    last.cssY = cssY

    last.disTime = nowTime - last.time
    last.time = nowTime
  },
  touchEnd(e) {
    isMove = false;
    const speedY = last.disX / last.disTime
    const speedX = last.disY / last.disTime

    console.log(speedY, speedX, last.cssY, start.cssY)

    if (last.cssY === start.cssY) return
    let disX = parseInt(speedX * 500)
    let disY = parseInt(speedY * 500)
    console.log('rotateX', disX, disY)
    let rotateX = last.cssY + disX
    let rotateY = last.cssX + disY
    let style = ''
    let speed = 0
    console.log('rotateX', rotateX)
    if (rotateX > 45) {
      rotateX = 45
    } else if (rotateX < -45) {
      rotateX = -45
    }

    if (Math.abs(disY) > Math.abs(disX)) {
      style = 'rotateY'
      speed = speedY
    } else {
      style = 'rotateX'
      speed = speedX
    }
    console.log(speed)
    if (Math.abs(speed) > 0.1) {
      
      // this.rotate(style, speed)
    }

  },
  rotate(style, speed) {
    console.log(11111)
    const animation = my.createAnimation({
      duration: Math.abs(parseInt(speed * 300)) * 15,
      timeFunction: "ease-out",
      delay: 0,
    })
    if(style == 'rotateY'){
      animation.rotateY(this.data.rotateY).step()
    }else{
      animation.rotateX(this.data.rotateX).step()
    }
    this.setData({ animation: animation.export() })
    
  },
  clickCover(e){
    console.log('rwerewrwr')
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
