import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";
// registerCanvas 注册canvas给PIXI 
const { registerCanvas, devicePixelRatio } = PIXI.miniprogram;
var offsetX, offsetY
Page({
  // 供pixi渲染的canvas
  pixiCanvas: null,
  onLoad(query) {
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
        this.application.stage.addChild(this.stage);
        this.initScenes()
        this.loadResource()
      },
    });
  },
  initScenes(){
    this.scenes = [
      {
        name: 'scene1',
        x: 0,
        y: 0,
        width: 1500,
        height: 750,
      },
      {
        name: 'scene2',
        x: 1500,
        y: 0,
        width: 1500,
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
  loadResource() {
    const loader = new PIXI.loaders.Loader();
    loader.add('bg1', '/static/right.jpg')
      .add('windows', '/static/child.png')

    loader.on("error", function (target, resource) {  // 加载进度
    });
    loader.on("progress", function (target, resource) {  // 加载进度
      console.log('加载中...', parseInt(target.progress) + "%")
    });
    loader.once('complete', function (target, resource) {  // 加载完成
      console.log('加载完成')
    })
    loader.load((loader, resources) => {
      Object.keys(resources).forEach((key) => {
        this.sprites[key] = new PIXI.Sprite(resources[key].texture)
      })
      
      this.addResourceToScene()
      // this.sprites.windows.interactive = true
      // this.stage.addChild(this.sprites.windows)
      // console.log('windowsssss', this.sprites.windows)
      this.sprites.windows
        .on('tap', (event) => {
          my.alert({
            content: '点击了图标'
          })
        })
        .on('click', () => {
          console.log(1111)
          my.alert({
            content: '点击了图标'
          })
        })
      this.application.stage.addChild(this.stage);
      this.animate()
    });

  },
  clickChild() {
    console.log(333)
    // console.log('click', e)
    my.alert({
      content: '点击了图标'
    })
  },
  addResourceToScene() {
    let spritesData = [
      {
        bg1: {
          x: 0,
          y: 0,
          width: 1500,
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
  // 监听小程序canvas的touch事件，并触发pixi内部事件  
  onTouchHandle(event) {
    if (this.pixiCanvas && event.changedTouches && event.changedTouches.length) {
      this.pixiCanvas.dispatchEvent(event);
    }
  },
  animate() {
    //渲染到渲染器
    this.application.ticker.add(() => {
      this.application.stage.addChild(this.stage);
    })
  },
  touchStart(e) {
    console.log('drag-start', e)
    // console.log(e.data.getLocalPosition(this.parent));
    let touch = e.changedTouches[0];
    offsetX = touch.clientX;
    offsetY = touch.clientY
  },
  touchMove(e) {
    // console.log('drag-move',  e)
    let touch = e.changedTouches[0];
    console.log(touch.clientX - offsetX)
    this.stage.x += touch.clientX - offsetX;
    offsetX = touch.clientX
    // 边界
    if (this.stage.x > 0) {
      this.stage.x = 0
    }
    if (this.stage.x < -this.stage.width + this.systemInfo.windowWidth) {
      this.stage.x = -this.stage.width + this.systemInfo.windowWidth
    }
    this.animate()
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
