const app = getApp();
Page({
  data: {
    userId: '',
    password: '',
    login: false
  },

// 处理输入id框
inputId(event) {
    this.setData({
        userId: event.detail.value
    });
    console.log(this.data.userId);
},

// 处理输入密码框
inputPassword(event) {
    this.setData({
        password: event.detail.value
    });
    console.log(this.data.password)
},

// 跳转
// redirectToNoTabBar: function() {
//   wx.switchTab({
//     url: '/pages/register/register' // 跳转到 tabbar 页面的路径
//   });
// },

// 注册跳转
redirectToNoTabBar: function() {
  wx.navigateTo({
    url: '/pages/register/register' // 跳转到目标页面的路径
  });
},

// 验证登录
submitForm() {
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
          duration: 2000
        });
      }
    },
    fail(err) {
      // 请求失败后的处理逻辑
      console.error(err);
      // 在这里进行相应的错误处理
    }
  });
}
})