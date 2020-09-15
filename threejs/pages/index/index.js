import { createScopedThreejs } from "/miniprogram_npm/threejs-miniprogram/index";
// import { createScopedThreejs } from "/static/wx.js";
// import { createScopedThreejs } from "threejs-miniprogram";
// require  ('/static/three.js')
var THREE, camera, scene, renderer, skyBox;
Page({
  data: {
    THREE: {},
    canvas: {},
  },
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
    var offscreenCanvas = my.createOffscreenCanvas(100, 100);
    console.log(offscreenCanvas)
    this.canvas = offscreenCanvas;
      offscreenCanvas.width = 300;  
      offscreenCanvas.height = 300;  
      THREE = createScopedThreejs(offscreenCanvas)
      // console.log(THREE)
      this.init()
  },
  onShow() {
    // 页面显示
  },
  canvasOnReady() {
    // console.log(111111)
    let self = this;
    my.createCanvas({
      id: 'canvas',
      success: (canvas) => {
        console.log(canvas)
        // self.canvas = canvas;
        let gl = canvas.getContext('2d')
        console.log('222', gl)
        gl.drawImage(self.canvas, 0, 0)
        // // 创建一个与 canvas 绑定的 three.js
        // THREE = createScopedThreejs(canvas)
        // // console.log(THREE)
        // self.init()
      }
    });
  },
  init() {
    // 透视相机
        camera = new THREE.PerspectiveCamera(90, this.canvas.width / this.canvas.height, 1, 1000);
        camera.position.set(0, 0, 0);
        // 场景
        scene = new THREE.Scene();
        
        scene.background = new THREE.Color(0xFF0000);
        // 渲染器
        renderer = new THREE.WebGLRenderer({ antialias: true });
        var materials = []
        var urls = ['/static/right.right.jpg', '/static/right.left.jpg', '/static/right.top.jpg', '/static/right.bottom.jpg', '/static/right.front.jpg', '/static/right.back.jpg']
        // 循环创建立方体六个面的材质
        for (var i = 0; i < urls.length; i++) {
          // 加载贴图
          var texture = new THREE.TextureLoader().load(urls[i])
          // 
          var material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1
          })
          materials.push(material)
        }
        console.log(materials)
        var size = 100 // 立方体的长宽高
        skyBox = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), materials) // 创建一个立方体
        skyBox.geometry.scale(1, 1, -1) // 里外两侧的表面翻转
        scene.add(skyBox) // 添加立方体到场景中
        
        this.draw()
  },
  draw() {
    this.canvas.requestAnimationFrame(this.draw);
    renderer.render(scene, camera) // 渲染场景
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
