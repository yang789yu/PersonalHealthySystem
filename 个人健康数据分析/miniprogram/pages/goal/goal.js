const app = getApp();
Page({
  data: {
    value: '',
    value1: '',
    gradientColor: {
      '0%': '#ffd01e',
      '100%': '#ee0a24',
    },
    id: app.globalData.userId,
    goalPhysicalData: [],
    actualPhysicalData: [],
    showProgress: false, // 控制进度条显示状态的变量
    progressPercent: 60
  },
  bindtest() {
    const that = this;
    wx.request({
      url: 'http://localhost:3000/getLatestData?userId=' + app.globalData.userId,
      method: 'GET',
      success(res) {
        console.log(res.data); // 打印后端返回的数据
        if (res.data.success) {
          that.setData({
            actualPhysicalData: res.data.data
          });
          console.log(that.data.actualPhysicalData.height)
        }
      },
      fail(err) {
        console.error(err);
      }
    });
  },

  onShow: function () {
    const that = this;
    // 发起第一个请求获取目标数据
    wx.request({
        url: 'http://localhost:3000/getGoalData?userId=' + app.globalData.userId,
        method: 'GET',
        success(res) {
            if (res.data.success) {
                that.setData({
                    goalPhysicalData: res.data.data
                });
                console.log('打印数据1');
                console.log(that.data.goalPhysicalData[0]?.height); // 添加有效性检查
                // 在第一个请求成功后再发起第二个请求
                wx.request({
                    url: 'http://localhost:3000/getLatestData?userId=' + app.globalData.userId,
                    method: 'GET',
                    success(res) {
                        if (res.data.success) {
                            that.setData({
                                actualPhysicalData: res.data.data
                            });
                            console.log('打印数据2');
                            console.log(that.data.actualPhysicalData?.height); // 添加有效性检查
                            // 确保数据已经设置后再进行进度条绘制
                            if (that.data.actualPhysicalData && that.data.goalPhysicalData) {
                              console.log('打印数据');
                              console.log(that.data.actualPhysicalData
                              ?.height);
                              console.log(that.data.goalPhysicalData[0]?.weight);
                              if (that.data.goalPhysicalData?.weight !== 0) {
                                  that.setData({
                                    value: (that.data.actualPhysicalData?.weight / that.data.goalPhysicalData[0]?.weight*100).toFixed(2),
                                    value1: (that.data.actualPhysicalData?.height / that.data.goalPhysicalData[0]?.height*100).toFixed(2)
                                  })
                                  console.log("-------------------");
                                  console.log(that.data.value1);
                              } else {
                                  console.error('目标数据为空');
                              }
                            } else {
                                console.error('目标数据或实际数据为空');
                            }
                        }
                    },
                    fail(err) {
                        console.error(err);
                    }
                });
            }
        },
        fail(err) {
            console.error(err);
        }
    });
  },

  onLoad: function(options) {
    
  },

});