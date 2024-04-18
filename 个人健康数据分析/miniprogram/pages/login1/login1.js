const app = getApp();
Page({
  data: {
    tabIndex: 0,//登录注册下标,
    userId: '',
    password: '',
    newUserId: '',
    newPassword: ''
  },
  tabChange(e) {
    this.setData({
      tabIndex: parseInt(e.currentTarget.dataset.id)
    });
  },
  // 处理输入id框
  inputId_login(event) {
    this.setData({
        userId: event.detail.value
    });
    console.log(this.data.userId);
},
// 处理输入密码框
inputPassword_login(event) {
  this.setData({
      password: event.detail.value
  });
  console.log(this.data.password)
},

// 处理输入注册id框
inputId_register(event) {
  this.setData({
      newUserId: event.detail.value
  });
  console.log(this.data.newUserId);
},

// 处理注册输入密码框
inputPassword_register(event) {
  this.setData({
      newPassword: event.detail.value
  });
  console.log(this.data.newPassword)
},


  login() {
    const that = this; // 保存 this 到变量 that
    wx.request({
      url: 'http://localhost:3000/submit',
      method: 'POST',
      data: {
        userId: that.data.userId,
        password: that.data.password
      },
      success(res) {
        // 请求成功后的处理逻辑
        console.log(res.data); // 打印后端返回的数据
        if (res.data.success) {
          app.globalData.userId=that.data.userId;
          that.setData({
            login: true
          });
          // 如果后端返回 success 为 true，表示数据库中有对应的数据
          // 在这里进行相应的逻辑处理
          if (that.data.login) {
            wx.showToast({
              title: '登录成功！',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/index/index' // 跳转到 tabbar 页面的路径
                  });
                }, 2000);
              }
            });
          }
        } else {
          // 如果后端返回 success 为 false，表示数据库中没有对应的数据
          // 在这里进行相应的逻辑处理
          wx.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 1000
          });
        }
      },
      fail(err) {
        // 请求失败后的处理逻辑
        console.error(err);
        // 在这里进行相应的错误处理
      }
    });
  },
  getCode() {
    console.log('获取验证码');
  },

  // 注册输入逻辑
  register() {
    const that = this;
    wx.request({
        url: 'http://localhost:3000/register',
        method: 'POST',
        data: {
            userId: that.data.newUserId,
            password: that.data.newPassword
        },
        success(res) {
          console.log(res.data);
          if (res.data === 'Data inserted successfully') {
              wx.showToast({
                  title: '注册成功！',
                  icon: 'none',
                  duration: 1000,
                  success: function () {
                      that.setData({
                          tabIndex: 0
                      })
                  }
              });
          } else {
              // 注册失败，用户名已存在
              wx.showModal({
                  title: '注册失败',
                  content: '用户名已存在，请重新输入',
                  showCancel: false
              });
          }
      },
      fail(err) {
          console.error(err);
          // 请求失败的处理逻辑
      }
    });
}
});