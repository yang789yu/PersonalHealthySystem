const app = getApp()
Page({
  data: {
    userId: app.globalData.userId,
    sleep_quality:'',
    sleep_time: '',
    sleep_date:'',
    date: '',
    Cshow: false,
    minDate: new Date().getTime() - 365 * 24 * 60 * 60 * 1000, // 365天前的时间戳
  },

  onLoad() {
    // 初始化 minDate 属性为当前时间的一年前
    this.setData({
      minDate: new Date().getTime() - 365 * 24 * 60 * 60 * 1000
    });
  },

    // 日期选择
onDisplay() {
  this.setData({ Cshow: true });
},
ConClose() {
  this.setData({ Cshow: false });
},
formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return `${year}-${month}-${day}`;
},
ConConfirm(event) {
  this.setData({
    Cshow: false,
    date: this.formatDate(event.detail),
  });
  console.log(this.data.date);
},




  // 处理睡眠质量
  inputQuality(event) {
    const value = event.detail.value;
    console.log(value);
  if (!this.isNumeric(value)||value<1||value>10) {
    wx.showToast({
      title: '请输入有效的睡眠质量，范围为1到10',
      icon: 'none',
      duration: 2000
    });
    return;
  }
    this.setData({
        sleep_quality: event.detail.value
    });
},

  // 处理睡眠时间
  inputSleeptime(event) {
    const value = event.detail.value;
    console.log(value);
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的睡眠时间',
      icon: 'none',
      duration: 2000
    });
    return;
  }
    this.setData({
        sleep_time: event.detail.value
    });
},

isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
},

submitForm() {
  const that = this; // 保存 this 到变量 that
    // 检查睡眠时间是否为空
    if (!that.data.sleep_time) {
      wx.showToast({
        title: '请输入睡眠时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // 检查睡眠质量是否为空
    if (!that.data.sleep_quality) {
      wx.showToast({
        title: '请输入睡眠质量',
        icon: 'none',
        duration: 2000
      });
      return;
    }
      // 检查记录日期是否为空
  if (!that.data.date) {
    wx.showToast({
      title: '请输入记录时间',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  wx.request({
    url: 'http://localhost:3000/submitsleepdata',
    method: 'POST',
    data: {
      userId: that.data.userId,
      sleep_quality: that.data.sleep_quality,
      sleep_time: that.data.sleep_time,
      sleep_date: that.data.date
    },
    success(res) {
      console.log(res.data);
          wx.showToast({
            title: '提交成功！',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1 // 返回的层数，1表示返回上一层
                });
              }, 2000);
            }
          });
    },
    fail(err) {
      // 请求失败后的处理逻辑
      console.error(err);
      // 在这里进行相应的错误处理
    }
  });
}
})