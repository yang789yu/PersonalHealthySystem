// index.js
const app = getApp();

Page({
  data: {
    id: '',
    password: '',
    login: false,
    progressPercent: 50
  },

  exportData: function() {
    wx.request({
      url: 'http://localhost:3000/exportData?userId=' + app.globalData.userId,
      method: 'GET', // 或者 'POST'，根据实际情况选择请求方法
      success: function(res) {
        console.log(res.data); // 输出后端返回的数据
      },
      fail: function(err) {
        console.error(err);
      }
    });
  },

  onLoad(option){
    this.setData({
      id: app.globalData.userId
    })
  },
  // 进度表
  onReady: function () {
    this.drawProgress(0.6); // 假设进度为60%
  },
  drawProgress: function (progress) {
    const ctx = wx.createCanvasContext('progressCanvas');
    const width = 200; // canvas 宽度
    const height = 200; // canvas 高度
    const radius = width / 2 - 10; // 圆环半径
    const strokeWidth = 10; // 圆环宽度
    const centerX = width / 2; // 圆心横坐标
    const centerY = height / 2; // 圆心纵坐标

    // 绘制底部灰色圆环
    ctx.setLineWidth(strokeWidth);
    ctx.setStrokeStyle('#f3f3f3');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.stroke();

    // 绘制进度条圆环
    ctx.setLineWidth(strokeWidth);
    ctx.setStrokeStyle('#00bb9c');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, 2 * Math.PI * progress - Math.PI / 2, false);
    ctx.stroke();

    // 绘制百分比文本
    ctx.setFontSize(20);
    ctx.setFillStyle('#000000');
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    ctx.fillText((progress * 100).toFixed(0) + '%', centerX, centerY);

    ctx.draw();
  },

  // 计时器
  start() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.start();
  },

  pause() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.pause();
  },

  reset() {
    const countDown = this.selectComponent('.control-count-down');
    countDown.reset();
  },

  finished() {
    Toast('倒计时结束');
  },

  redirectToAnalyze: function() {
  wx.redirectTo({
    url: '/pages/analyze/analyze' // 跳转到 tabbar 页面的路径
  });
},
  redirectToAnalyze1: function() {
  wx.switchTab({
    url: '/pages/lazyChart/lazyChart'
  });
},
redirectToGoal: function() {
  wx.switchTab({
    url: '/pages/goal/goal'
  });
}
})
