const app = getApp()
Page({
  data: {
    userId: app.globalData.userId,
    food_name:'',
    food_quantity:'',
    calories:'',
    meal_time:'',
    meal_date:'',
    show: false,
    currentDate: '',
    minHour: 0,
    maxHour: 23,
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

  // 处理选择时间
  onInput(event) {
    this.setData({
      currentDate: event.detail,
    });
  },

  onConfirm(event){
    this.onClose();
  },

  // 处理弹出层
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },


  // 处理食物名字
  inputName(event) {
    this.setData({
        food_name: event.detail.value
    });
},
  // 处理食物数量
  inputQuantity(event) {
    const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的食物数量',
      icon: 'none',
      duration: 2000
    });
    return;
  }
    
    this.setData({
        food_quantity: event.detail.value
    });
},
  // 处理食物热量
  inputCalories(event) {
    const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的食物热量',
      icon: 'none',
      duration: 2000
    });
    return;
  }
    this.setData({
        calories: event.detail.value
    });
},
  // 处理用餐时间
  inputTime(event) {
    this.setData({
        meal_time: event.detail.value
    });
},
  // 处理用餐日期
  inputDate(event) {
    this.setData({
        meal_date: event.detail.value
    });
},

isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
},

submitForm() {
  const that = this; // 保存 this 到变量 that

  // 检查食物名称是否为空
  if (!that.data.food_name) {
    wx.showToast({
      title: '请输入食物名称',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 检查食物数量是否为空
  if (!that.data.food_quantity) {
    wx.showToast({
      title: '请输入食物数量',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 检查食物热量是否为空
  if (!that.data.calories) {
    wx.showToast({
      title: '请输入食物热量',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 检查用餐时间是否为空
  if (!that.data.currentDate) {
    wx.showToast({
      title: '请输入用餐时间',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 检查记录日期是否为空
  if (!that.data.date) {
    wx.showToast({
      title: '请输入记录日期',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  wx.request({
    url: 'http://localhost:3000/submitdietdata',
    method: 'POST',
    data: {
      userId: that.data.userId,
      food_name: that.data.food_name,
      food_quantity: that.data.food_quantity,
      calories: that.data.calories,
      meal_time: that.data.currentDate,
      meal_date: that.data.date
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