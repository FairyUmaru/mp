import * as PIXI from "@tbminiapp/pixi-miniprogram-engine";
// registerCanvas 注册canvas给PIXI 
const { registerCanvas, devicePixelRatio } = PIXI.miniprogram;
Page({
  // 供pixi渲染的canvas
  pixiCanvas: null,
  onLoad(query) {
    // 页面加载
    console.info(`Page onLoad with query: ${JSON.stringify(query)}`);
  },
  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onCanvasReady() {
    console.log('ready')
    my._createCanvas({
      id: "canvas",
      success: (c) => {
        console.log('1111111')
        const systemInfo = my.getSystemInfoSync();
        // 拿到当前设备像素密度
        const dpr = systemInfo.pixelRatio;
        // 拿到当前设备的宽高
        const windowWidth = systemInfo.windowWidth;
        const windowHeight = systemInfo.windowHeight;
        // 为canvas设定宽高（需要设备宽高* 像素密度）;
        c.width = windowWidth * dpr;
        c.height = windowHeight * dpr;
        this.pixiCanvas = c;
        console.log('2222', c)
        //为pixi引擎注册当前的canvas  
        registerCanvas(c);
        //计算application的宽高  
        const size = {
          width: c.width / devicePixelRatio,
          height: c.height / devicePixelRatio,
        };

        // 建立一个 CanvasRenderingContext2D 二维渲染上下文。
        const context = c.getContext('2d');

        // canvas.getContext('webgl')  
        console.log(PIXI)
        // 初始化创建画布
        const application = new PIXI.Application({
          width: size.width,
          height: size.height,
          context: context,
          view: c,
          transparent: true,
          forceCanvas: true, // 阻止选用webgl渲染
          resolution: dpr
        })
        console.log('0000', application)
        //Create the renderer 创建一个2d渲染器
        // 容器
        // let stageBox = PIXI.Container();
        // 精灵集合
        let sprites = {};
        // 创建资源加载器loader ，进行资源预加载
        const loader = new PIXI.loaders.Loader();
        console.log('444', loader)
        // 链式调用添加图片资源
        loader.add('bg1', '/static/back.jpg')
        // 开始加载资源
        loader.load((loader, resources) => {
          console.log('5555', loader, resources)
          // resources is an object where the key is the name of the resource loaded and the value is the resource object.
          // They have a couple default properties:
          // - `url`: The URL that the resource was loaded from
          // - `error`: The error that happened when trying to load (if any)
          // - `data`: The raw data that was loaded
          // also may contain other properties based on the middleware that runs.
          sprites.bg1 = new PIXI.extras.TilingSprite(resources.bg1.texture);
        });

        loader.onProgress.add((loader, resources)  => { 
          console.log(loader, resources)
        }); // called once per loaded/errored file
        loader.onError.add((loader, resources)  => { }); // called once per errored file
        loader.onLoad.add((loader, resources)  => { }); // called once per loaded file
        loader.onComplete.add((loader, resources)  => { 
          console.log('7777', sprites)
          // var container = new PIXI.Container();
          for (let key in sprites) {
            application.stage.addChild(sprites[key]);//精灵 添加进 容器
          }
          // application.stage.addChild(container); //添加至舞台
          application.renderer.render(application.stage); //舞台手动渲染
        }); // called once when the queued resources all load.

      }
    })
  },
  // 监听小程序canvas的touch事件，并触发pixi内部事件  
  onTouchHandle(event) {
    if (this.pixiCanvas && event.changedTouches && event.changedTouches.length) {
      this.pixiCanvas.dispatchEvent(event);
    }
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
