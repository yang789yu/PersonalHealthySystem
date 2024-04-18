const app = getApp()
Page({

  data: {
    userId: app.globalData.userId,
    time: '',
    task: '',
    minHour: 10,
    maxHour: 20,
    minDate: new Date(2022, 10, 1).getTime(),
    maxDate: new Date(2025, 10, 1).getTime(),
    currentDate: '',
    show: false,
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  // 处理时间
  onInput(event) {
    this.setData({
      currentDate: event.detail,
      time: event.detail
    });
    // console.log(this.data.time);
    // console.log(this.data.currentDate);
    // console.log(event.detail);
  },

    // 输入任务
    inputTask(event) {
      this.setData({
          task: event.detail.value
      });
      //console.log(this.data.task)
  },

  onDatetimeChange(event) {
    console.log('选择的日期时间为：', event.detail);
    this.setData({
      time: event.data.detail
    })
    // console.log(this.data.time)
  },

  onConfirm(event){
    this.onClose();
  },

  submitForm() {
    const that = this; // 保存 this 到变量 that
    if (!that.data.time) {
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!that.data.task) {
      wx.showToast({
        title: '请输入任务',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.request({
      url: 'http://localhost:3000/taskdata',
      method: 'POST',
      data: {
        userId: that.data.userId,
        time: that.data.time,
        task: that.data.task
      },
      success(res) {
        //console.log(res.data);
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

function formatMilliseconds(milliseconds) {
  const date = new Date(milliseconds);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}