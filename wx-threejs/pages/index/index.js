//index.js
// import { createScopedThreejs } from './../../miniprogram_npm/threejs-miniprogram/index'
const { createScopedThreejs } = require('threejs-miniprogram');
import {throttle} from './../../utils/util.js';
var THREE, camera, scene, renderer, skyBox, target, raycaster, mouse;
var touchX, touchY, device = {},scale = 1;
var lon = -90, last_lon = 0, lat = 0, last_lat = 0;
var marks = [
  {
    id: 1,
    x:19,
    y: -6,
    z: -20,
    r: 2
  },
  {
    id: 2,
    x:15,
    y: -6,
    z: -22,
    r: 2
  },
  {
    id: 3,
    x: 11,
    y: -7,
    z: -24,
    r: 2
  },
  {
    id: 4,
    x:-18,
    y: -14,
    z: -50,
    r: 4
  },
  {
    id: 5,
    x:-28,
    y:-14,
    z:-48,
    r:4
  },
  {
    id: 6,
    x:-38,
    y:-12,
    z:-48,
    r:4
  }
]
Page({
  data: {
  },
  onLoad: function () {
  },
  onReady: function() {
    this.initTHREE('myCanvas', (THREE) => {
      this.initScene();
      this.loadPanorma(THREE)
    })
  },
  initTHREE(canvasId, callback) {
    let self = this;
    wx.createSelectorQuery()
      .select('#' + canvasId)
      .node()
      .exec((res) => {
        console.log(2322, res)
        const canvas = res[0].node
        self.canvas = canvas;
        // 创建一个与 canvas 绑定的 three.js
        THREE = createScopedThreejs(canvas)
        if(typeof callback == 'function'){
          callback(THREE)
        }
      })
  },
  initScene() {
    target = new THREE.Vector3()
    // 透视相机
    camera = new THREE.PerspectiveCamera(90, this.canvas.width / this.canvas.height, 1, 10000);
    camera.position.set(0, 0, 0);
    // 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector3()
    this.animate()

    scene.add(new THREE.AmbientLight(0xffffff));
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 20 );
    scene.add(light);
  },
  loadPanorma(THREE) {
    let materials = []
    var urls = ['/static/right.right.jpg', '/static/right.left.jpg', '/static/right.top.jpg', '/static/right.bottom.jpg', '/static/right.front.jpg', '/static/right.back.jpg']
    // 循环创建立方体六个面的材质
    for (var i = 0; i < urls.length; i++) {
      // 加载贴图
      let texture = new THREE.TextureLoader().load(urls[i])
      texture.minFilter = THREE.LinearFilter;
      console.log(texture)
      var material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1
      })
      materials.push(material)
    }
    var size = 100 // 立方体的长宽高
    skyBox = new THREE.Mesh(new THREE.BoxBufferGeometry(size, size, size), materials) // 创建一个立方体
    skyBox.geometry.scale(1, 1, -1) // 里外两侧的表面翻转
    scene.add(skyBox) // 添加立方体到场景中
    
    this.group = new THREE.Group();
    marks.forEach((item) => {
      var geometry = new THREE.SphereGeometry( item.r, 38, 38 );
      var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false} );
      var circle = new THREE.Mesh( geometry, material );
      circle.position.set(item.x, item.y, item.z);
      circle.name = item.id;
      this.group.add( circle );
    })
    scene.add(this.group)
  },
  tap(event) {
    console.log(event,  this.canvas.width,  this.canvas.height)
    mouse.x = (event.changedTouches[0].clientX/ this.canvas.width)*2 -1;
    mouse.y = -(event.changedTouches[0].clientY/this.canvas.height)*2 +1;
    console.log(mouse)
    raycaster.setFromCamera( mouse.clone(), camera );
    var intersects = raycaster.intersectObjects(this.group.children)
    console.log(intersects)
    if(intersects.length > 0) {
      let name = intersects[0].object.name;
      wx.navigateTo({
        url: `/pages/product/product?id=${name}`
      })
    }
  },
  touchStart(event) {
    var touch = event.touches[0];
    touchX = touch.x;
    touchY = touch.y;
  },
  touchMove: (event) => {
    // console.log(event)
    switch (event.changedTouches.length){
      case 1:
        var touch = event.changedTouches[0];
        var moveX = touch.x - touchX;
        var moveY = touch.y - touchY;
        lon -= moveX*0.2;
        lat += moveY*0.2;
        touchX = touch.x;
        touchY = touch.y;
        console.log(lon, lat)

        lat = Math.max( - 85, Math.min( 85, lat ) );
        let phi = THREE.Math.degToRad( 90 - lat );
        let theta = THREE.Math.degToRad( lon );

        target.x = Math.sin( phi ) * Math.cos( theta );
        target.y = Math.cos( phi );
        target.z = Math.sin( phi ) * Math.sin( theta );
        break;
      case 2:
        break;
    }
    
  },
  touchEnd(e) {

  },
  animate() {
    this.canvas.requestAnimationFrame(this.animate);
  //   if (lon !== last_lon ||
  //     lat !== last_lat) {
  //     last_lon = lon;
  //     last_lat = lat;

  //     deviceOrientationControl.camaraRotationControl(camera, lon, lat, THREE);
  // }

  // if (last_device.alpha !== device.alpha ||
  //     last_device.beta !== device.beta ||
  //     last_device.gamma !== device.gamma) {
  //     last_device.alpha = device.alpha;
  //     last_device.beta = device.beta;
  //     last_device.gamma = device.gamma;

  //     if (isDeviceMotion) {
  //         console.log(111111111111111)
  //         this.deviceControl(camera, device, THREE, isAndroid);
  //     }
  // }
    camera.lookAt( target );  
    renderer.render(scene, camera) // 渲染场景
  }
})