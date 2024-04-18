// pages/register/register.js
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
submitForm() {
  const that = this;
  wx.request({
      url: 'http://localhost:3000/register',
      method: 'POST',
      data: {
          userId: that.data.userId,
          password: that.data.password
      },
      success(res) {
          console.log(res.data);
          wx.showToast({
            title: '注册成功！',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/login/login' // 跳转到目标页面的路径
                });
              }, 2000);
            }
          });
      }
  });
}
})