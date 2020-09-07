import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";
import { Tweener, Easing } from "pixi-tweener";
// import { pixi_projection } from "/static/pixi-projection.js"
// require('/static/pixi-projection.js');
// require("pixi-projection");
// registerCanvas 注册canvas给PIXI 
const { registerCanvas, devicePixelRatio } = PIXI.miniprogram;
var offsetX, offsetY
var that = null;
Page({
  // 供pixi渲染的canvas
  pixiCanvas: null,
  onLoad(query) {
    that = this
    // console.log('333333', projection)
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
    this.systemInfo = my.getSystemInfoSync();
    console.log(this.systemInfo)
    this.stage = new PIXI.Container();
     
    // 存储精灵图
    this.sprites = {}
  },
  onShow() {
    // 页面显示
  },
  onCanvasReady() {
    // 建立canvas引用
    my._createCanvas({
      id: "canvas",
      success: (canvas) => {
        // 拿到当前设备像素密度
        const dpr = this.systemInfo.pixelRatio;
        // 拿到当前设备的宽高
        const windowWidth = this.systemInfo.windowWidth;
        const windowHeight = this.systemInfo.windowHeight;
        // 为canvas设定宽高（需要设备宽高* 像素密度）;
        canvas.width = windowWidth * dpr;
        canvas.height = windowHeight * dpr;
        this.pixiCanvas = canvas;
        //为pixi引擎注册当前的canvas  
        registerCanvas(canvas);
        //初始化PIXI.Application  
        //计算application的宽高  
        const size = {
          width: canvas.width / devicePixelRatio,
          height: canvas.height / devicePixelRatio,
        };
        console.log(size, canvas)
        // const context = canvas.getContext('2d');
        const context = canvas.getContext('webgl')
        this.application = new PIXI.Application({
          width: size.width,
          height: size.height,
          view: canvas,
          context,
          transparent: true,
          // 强制使用2d上下文进行渲染，如果为flase,则默认使用webgl渲染  
          forceCanvas: false,
          // 设置resolution 为像素密度  
          resolution: devicePixelRatio,
        });
        // 添加根舞台到this.application.stage
        this.application.stage.addChild(this.stage);
        Tweener.init(this.application.ticker)
        this.initScenes()
        this.loadResource()
      },
    });
  },
  // 初始化场景，为每个场景创建一个container
  initScenes() {
    this.scenes = [
      {
        name: 'scene1',
        x: 0,
        y: 0,
        width: 750,
        height: 750,
      },
      {
        name: 'scene2',
        x: 750,
        y: 0,
        width: 750,
        height: 750,
      },
      {
        name: 'scene3',
        x: 1500,
        y: 0,
        width: 750,
        height: 750,
      },
      {
        name: 'scene4',
        x: 2250,
        y: 0,
        width: 750,
        height: 750,
      }
    ];
    this.scenesContainer = {}
    //创建场景
    this.scenes.forEach((item) => {
      var container = new PIXI.Container();
      container.width = item.width;
      container.height = item.height;
      container.position.set(item.x, item.y)
      this.scenesContainer[item.name] = container;
      this.stage.addChild(container)
    })
  },
  // 加载资源
  loadResource() {
    const loader = new PIXI.loaders.Loader();
    loader.add('bg1', '/static/right/right.left.jpg')
    .add('bg2', '/static/right/right.front.jpg')
    .add('bg3', '/static/right/right.right.jpg')
    .add('bg4', '/static/right/right.back.jpg')
      .add('windows', '/static/child.png')

    loader.on("error", function (target, resource) {  // 加载进度
    });
    loader.on("progress", function (target, resource) {  // 加载进度
      console.log('加载中...', parseInt(target.progress) + "%")
    });
    loader.once('complete', function (target, resource) {  // 加载完成
      console.log('加载完成')
    })
    // 执行loader
    loader.load( async(loader, resources) => {
      Object.keys(resources).forEach((key) => {
        this.sprites[key] = new PIXI.Sprite(resources[key].texture)
      })

      this.addResourceToScene()
      // this.sprites.windows.interactive = true
      // this.stage.addChild(this.sprites.windows)
      // console.log('windowsssss', this.sprites.windows)
      console.log('8888', this.stage)
      this.stage.interactive = true
      this.stage.on('touchstart', this.touchStart)
      this.stage.on('touchmove', this.touchMove)

      // 添加点击事件
      this.sprites.windows
        .on('tap', (event) => {
          my.alert({
            content: '点击了图标'
          })
        })
     await Tweener.add({ target: this.sprites.windows, duration: 3, ease: Easing.easeInOutCubic }, { x: 100, alpha: 0.5});
      this.animate()
    });

  },
  // 为每个场景添加资源
  addResourceToScene() {
    let spritesData = [
      {
        bg1: {
          x: 0,
          y: 0,
          width: 750,
          height: 750
        },
        windows: {
          x: 130,
          y: 400,
          width: 60,
          height: 60,
          //启用交互事件
          interactive: true,
          buttonMode: true
        }
      },
      {
        bg2: {
          x: 0,
          y: 0,
          width: 750,
          height: 750
        },
      },
      {
        bg3: {
          x: 0,
          y: 0,
          width: 750,
          height: 750
        },
      },
      {
        bg4: {
          x: 0,
          y: 0,
          width: 750,
          height: 750
        },
      }
    ]
    //给场景添加图
    spritesData.forEach((item, index) => {
      let obj = spritesData[index]
      console.log(obj)
      for (let key in obj) {
        console.log(key)
        let props = obj[key]
        console.log(props, this.sprites, this.sprites[key])
        for (let k in props) {
          if (props.hasOwnProperty(k)) {
            this.sprites[key][k] = props[k];
          }
        }
        this.scenesContainer['scene' + (index + 1)].addChild(this.sprites[key]);
      }
    })
  },
  animate() {
    //渲染到渲染器
    this.application.ticker.add(() => {
      this.application.stage.addChild(this.stage);
    })
  },
  // 监听小程序canvas的touch事件，并触发pixi内部事件  
  onTouchHandle(event) {
    if (this.pixiCanvas && event.changedTouches && event.changedTouches.length) {
      // console.log(this.pixiCanvas)
      this.pixiCanvas.dispatchEvent(event);
    }
  },

  touchStart(e) {
    console.log('drag-start', e)
    // console.log(e.data.getLocalPosition(this.parent));
    let touch =  e.data.getLocalPosition(this.parent)
    console.log(touch)
    offsetX = touch.x;
    offsetY = touch.y;
  },
  async touchMove(e) {
    console.log('drag-move',  e)
    let touch = e.data.getLocalPosition(this.parent)
    console.log(touch.x - offsetX, that.stage)
    that.stage.x += touch.x - offsetX;
    offsetX = touch.x
    // 边界
    if (that.stage.x > 0) {
      // that.stage.x = -that.stage.width + that.systemInfo.windowWidth
      let x = -that.stage.width + that.systemInfo.windowWidth;
      await Tweener.add({ target: that.stage, duration: 2, ease: Easing.easeInOutCubic }, { x: x});
    }
    if (that.stage.x < -that.stage.width + that.systemInfo.windowWidth) {
      // that.stage.x = 0
       await Tweener.add({ target: that.stage, duration: 2, ease: Easing.easeInOutCubic }, { x: 0});
    }
    // this.animate()
  },
  touchEnd(e) {
    console.log('drag-end', e)
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
