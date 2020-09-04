import AliTouchEvent from '/static/touch-event.js'
let infoListTouchEvent = new AliTouchEvent();
Page({
  data: {},
  onLoad() {
    this.infoListTouchEvent = infoListTouchEvent;
    console.log(AliTouchEvent)
    this.infoListTouchEvent.bind({//绑定事件
      swipe: function (e) {
        console.log(e);
      },
      doubleTap: function (e) {
        console.log(e);
      },
      tap: function (e) {
        console.log(e);
      }.bind(this),
      longTap: function (e) {
        console.log(e);
      },
      rotate: function (e) {
        console.log(e)
      }.bind(this),
      pinch: function (e) {
        console.log(e);
      }

    })
  },
  touchStart: infoListTouchEvent.start.bind(infoListTouchEvent),
  touchMove: infoListTouchEvent.move.bind(infoListTouchEvent),
  touchEnd: infoListTouchEvent.end.bind(infoListTouchEvent),
  touchCancel: infoListTouchEvent.cancel.bind(infoListTouchEvent),

});
