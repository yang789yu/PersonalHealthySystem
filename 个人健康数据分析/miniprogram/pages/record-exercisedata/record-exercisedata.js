const app = getApp()
Page({
  data: {
    userId: app.globalData.userId,
    exercise_type:'',
    exercise_duration_minutes:'',
    exercise_distance:'',
    calories_burned:'',
    exercise_date:'',
    date: '',
    show: false,
    minDate: new Date().getTime() - 365 * 24 * 60 * 60 * 1000, // 365天前的时间戳
  },

  onLoad() {
    // 初始化 minDate 属性为当前时间的一年前
    this.setData({
      minDate: new Date().getTime() - 365 * 24 * 60 * 60 * 1000
    });
  },


  // 处理运动类型
  inputType(event) {
    this.setData({
        exercise_type: event.detail.value
    });
},
  // 处理运动时长
  inputMinutes(event) {
    const value = event.detail.value;
    if (!this.isNumeric(value)) {
      wx.showToast({
        title: '请输入有效的运动时长',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    this.setData({
        exercise_duration_minutes: event.detail.value
    });
},
  // 处理运动距离
  inputDistance(event) {
    const value = event.detail.value;
    if (!this.isNumeric(value)) {
      wx.showToast({
        title: '请输入有效的运动距离',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    this.setData({
        exercise_distance: event.detail.value
    });
},
  // 处理运动消耗
  inputBurned(event) {
    const value = event.detail.value;
    if (!this.isNumeric(value)) {
      wx.showToast({
        title: '请输入有效的运动消耗',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    this.setData({
        calories_burned: event.detail.value
    });
},
  // 处理运动日期
  inputDate(event) {
    this.setData({
        exercise_date: event.detail.value
    });
},

isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
},

submitForm() {
  const that = this; // 保存 this 到变量 that

  //检查运动类型是否为空
  if (!that.data.exercise_type) {
    wx.showToast({
      title: '请输入运动类型',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查运动时长是否为空
  if (!that.data.exercise_duration_minutes) {
    wx.showToast({
      title: '请输入运动时长',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查运动距离是否为空
  if (!that.data.exercise_distance) {
    wx.showToast({
      title: '请输入运动距离',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查运动消耗是否为空
  if (!that.data.calories_burned) {
    wx.showToast({
      title: '请输入运动消耗',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查记录日期是否为空
  if (!that.data.date) {
    wx.showToast({
      title: '请选择记录日期',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  wx.request({
    url: 'http://localhost:3000/submitexercisedata',
    method: 'POST',
    data: {
      userId: that.data.userId,
      exercise_type: that.data.exercise_type,
      exercise_duration_minutes: that.data.exercise_duration_minutes,
      exercise_distance: that.data.exercise_distance,
      calories_burned: that.data.calories_burned,
      exercise_date: that.data.date
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
},

// 日期选择
onDisplay() {
  this.setData({ show: true });
},
onClose() {
  this.setData({ show: false });
},
formatDate(date) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return `${year}-${month}-${day}`;
},
onConfirm(event) {
  this.setData({
    show: false,
    date: this.formatDate(event.detail),
  });
  console.log(this.data.date);
},
})