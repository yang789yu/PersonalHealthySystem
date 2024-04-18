const app = getApp()
Page({
  data: {
    userId: app.globalData.userId,
    height:'',
    weight:'',
    blood_pressure_systolic:'', // 收缩压
    blood_pressure_diastolic:'', // 舒张压
    blood_sugar:'',
    blood_lipid:'',
    measurement_date:'',
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

  // 处理身高
inputHeight(event) {
  const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的身高',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  this.setData({
    height: value
  });
},

// 处理体重
inputWeight(event) {
  const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的体重',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  this.setData({
    weight: value
  });
},

// 处理血压-收缩压
inputSystolic(event) {
  const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的收缩压',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  this.setData({
    blood_pressure_systolic: value
  });
},


// 处理血压-舒张压
// 处理血压-舒张压
inputDiastolic(event) {
  const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的舒张压',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  this.setData({
    blood_pressure_diastolic: value
  });
},


// 处理血糖
inputSugar(event) {
  const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的血糖值',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  this.setData({
    blood_sugar: value
  });
},

// 处理血脂
inputLipid(event) {
  const value = event.detail.value;
  if (!this.isNumeric(value)) {
    wx.showToast({
      title: '请输入有效的血脂值',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  this.setData({
    blood_lipid: value
  });
},

isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
},

  // 处理记录日期
//   inputDate(event) {
//     this.setData({
//         measurement_date: event.detail.value
//     });
// },
submitForm() {
  const that = this; // 保存 this 到变量 that

  //检查身高是否为空
  if (!that.data.height) {
    wx.showToast({
      title: '请输入身高',
      icon: 'none',
      duration: 2000
    });
    return;
  }

//检查体重否为空
  if (!that.data.weight) {
    wx.showToast({
      title: '请输入体重',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查血压-收缩压是否为空
  if (!that.data.blood_pressure_systolic) {
    wx.showToast({
      title: '请输入血压收缩压',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查血压-舒张压是否为空
  if (!that.data.blood_pressure_diastolic) {
    wx.showToast({
      title: '请输入血压舒张压',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查血糖是否为空
  if (!that.data.blood_sugar) {
    wx.showToast({
      title: '请输入血糖值',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  //检查血脂是否为空
  if (!that.data.blood_lipid) {
    wx.showToast({
      title: '请输入血脂值',
      icon: 'none',
      duration: 2000
    });
    return; // 如果血脂为空，不执行后续提交操作
  }

  //检查记录日期是否为空
  if (!that.data.date) {
    wx.showToast({
      title: '请选择记录的日期',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  wx.request({
    url: 'http://localhost:3000/submitphygoal',
    method: 'POST',
    data: {
      userId: that.data.userId,
      height: that.data.height,
      weight: that.data.weight,
      blood_pressure_systolic: that.data.blood_pressure_systolic,
      blood_pressure_diastolic: that.data.blood_pressure_diastolic,
      blood_sugar: that.data.blood_sugar,
      blood_lipid: that.data.blood_lipid,
      measurement_date: that.data.date
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