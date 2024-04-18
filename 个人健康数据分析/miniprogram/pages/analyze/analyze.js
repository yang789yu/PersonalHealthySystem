const app = getApp();
Page({
  data: {
    id: app.globalData.userId,
    responsePhysicalData: [],
    responsePhysicalData1: [],
    responseExerciseData: [],
    responseExerciseData1: [],
    responseDietData: [],
    responseDietData1: [],
    responseSleepData: [],
    responseSleepData1: [],
    activeNames: [],
    option1: [
      { text: '体征数据', value: 0 },
      { text: '运动数据', value: 1 },
      { text: '睡眠数据', value: 2 },
      { text: '饮食数据', value: 3},
    ],
    option2: [
      { text: '按时间排序', value: 'a' },
      { text: '按类型排序', value: 'b' },
    ],
    value1: 3,
    value2: 'a'
  },

  onLoad(){
    const that = this;
      wx.request({
        url: 'http://localhost:3000/analyzeDietData1?userId=' + app.globalData.userId,
        method: 'GET',
        success(res) {
          console.log(res.data); // 打印后端返回的数据
          if (res.data.success) {
            that.setData({
              responseDietData: res.data.data
            });
            console.log(that.data.responseDietData)
          }
        },
        fail(err) {
          console.error(err);
        }
      });
  },

  // 实现排序
  handleDropdownChange(event) {
    const value = event.detail;
    const index = event.currentTarget.dataset.index;
    if(index === '1') {
      this.setData({
        value1: value
      })
    }else{
      this.setData({
        value2: value
      })
    }
    console.log("------------");
    console.log(value);
    console.log(index);
    if (this.data.value1 === 0 && this.data.value2 === 'a') {
      console.log('体征数据的时间排序');
      this.analyzePhycicalData1();
    } else if (this.data.value1 === 0 && this.data.value2 === 'b') {
      console.log('体征数据的类型排序');
      this.analyzePhycicalData2();
    } else if (this.data.value1 === 1 && this.data.value2 === 'a') {
      console.log('运动数据的时间排序');
      this.analyzeExerciseData1();
    } else if (this.data.value1 === 1 && this.data.value2 === 'b') {
      console.log('运动数据的类型排序');
      this.analyzeExerciseData2();
    } else if (this.data.value1 === 2 && this.data.value2 === 'a') {
      console.log('睡眠数据的时间排序');
      this.analyzeSleepData1();
    } else if (this.data.value1 === 2 && this.data.value2 === 'b') {
      console.log('睡眠数据的类型排序');
      this.analyzeSleepData2();
    } else if (this.data.value1 === 3 && this.data.value2 === 'a') {
      console.log('饮食数据的时间排序');
      this.analyzeDietData1();
    } else if (this.data.value1 === 3 && this.data.value2 === 'b') {
      console.log('饮食数据的类型排序');
      this.analyzeDietData2();
    }
  },


  // 查询体征数据（按时间）
  analyzePhycicalData1() {
    const that = this;
    wx.request({
      url: 'http://localhost:3000/analyzePhycicalData?userId=' + app.globalData.userId,
      method: 'GET',
      success(res) {
        console.log(res.data); // 打印后端返回的数据
        if (res.data.success) {
          that.setData({
            responsePhysicalData: res.data.data,
            responsePhysicalData1: [],
            responseExerciseData: [],
            responseExerciseData1: [],
            responseDietData: [],
            responseDietData1: [],
            responseSleepData: [],
            responseSleepData1: []
          });
          console.log(that.data.responseDietData)
        }
      },
      fail(err) {
        console.error(err);
      }
    });
  },

    // 查询体征数据2（按类型）
    analyzePhycicalData2() {
      const that = this;
      wx.request({
        url: 'http://localhost:3000/analyzePhycicalData?userId=' + app.globalData.userId,
        method: 'GET',
        success(res) {
          console.log(res.data); // 打印后端返回的数据
          if (res.data.success) {
            that.setData({
              responsePhysicalData1: res.data.data,
              responsePhysicalData: [],
              responseExerciseData: [],
              responseExerciseData1: [],
              responseDietData: [],
              responseDietData1: [],
              responseSleepData: [],
              responseSleepData1: [],
            });
            console.log(that.data.responseDietData1)
          }
        },
        fail(err) {
          console.error(err);
        }
      });
    },
  
  // 查询运动数据1（按时间）
  analyzeExerciseData1() {
    const that = this;
    wx.request({
      url: 'http://localhost:3000/analyzeExerciseData1?userId=' + app.globalData.userId,
      method: 'GET',
      success(res) {
        console.log(res.data); // 打印后端返回的数据
        if (res.data.success) {
          that.setData({
            responseExerciseData: res.data.data,
            responseExerciseData1: [],
            responsePhysicalData: [],
            responsePhysicalData1: [],
            responseDietData: [],
            responseDietData1: [],
            responseSleepData: [],
            responseSleepData1: []
          });
          console.log(that.data.responseExerciseData)
        }
      },
      fail(err) {
        console.error(err);
      }
    });
  },

  // 查询运动数据2(按类型)
  analyzeExerciseData2() {
    const that = this;
    wx.request({
      url: 'http://localhost:3000/analyzeExerciseData2?userId=' + app.globalData.userId,
      method: 'GET',
      success(res) {
        console.log(res.data); // 打印后端返回的数据
        if (res.data.success) {
          that.setData({
            responseExerciseData1: res.data.data,
            responsePhysicalData: [],
            responsePhysicalData1: [],
            responseExerciseData: [],
            responseDietData: [],
            responseDietData1: [],
            responseSleepData: [],
            responseSleepData1: []
          });
          console.log(that.data.responseExerciseData1)
        }
      },
      fail(err) {
        console.error(err);
      }
    });
  },

    // 查询饮食数据1(按时间)
    analyzeDietData1() {
      const that = this;
      wx.request({
        url: 'http://localhost:3000/analyzeDietData1?userId=' + app.globalData.userId,
        method: 'GET',
        success(res) {
          console.log(res.data); // 打印后端返回的数据
          if (res.data.success) {
            that.setData({
              responseDietData: res.data.data,
              responseDietData1: [],
              responsePhysicalData: [],
              responsePhysicalData1: [],
              responseExerciseData: [],
              responseExerciseData1: [],
              responseSleepData: [],
              responseSleepData1: []
            });
            console.log(that.data.responseDietData)
          }
        },
        fail(err) {
          console.error(err);
        }
      });
    },

        // 查询饮食数据2（按类型）
        analyzeDietData2() {
          const that = this;
          wx.request({
            url: 'http://localhost:3000/analyzeDietData2?userId=' + app.globalData.userId,
            method: 'GET',
            success(res) {
              console.log(res.data); // 打印后端返回的数据
              if (res.data.success) {
                that.setData({
                  responseDietData1: res.data.data,
                  responseDietData: [],
                  responsePhysicalData: [],
                  responsePhysicalData1: [],
                  responseExerciseData: [],
                  responseExerciseData1: [],
                  responseSleepData: [],
                  responseSleepData1: []
                });
                console.log(that.data.responseDietData1)
              }
            },
            fail(err) {
              console.error(err);
            }
          });
        },

    // 查询睡眠数据(按时间)
    analyzeSleepData1() {
      const that = this;
      wx.request({
        url: 'http://localhost:3000/analyzeSleepData?userId=' + app.globalData.userId,
        method: 'GET',
        success(res) {
          console.log(res.data); // 打印后端返回的数据
          if (res.data.success) {
            that.setData({
              responseSleepData: res.data.data,
              responseSleepData1: [],
              responsePhysicalData: [],
              responsePhysicalData1: [],
              responseExerciseData: [],
              responseExerciseData1: [],
              responseDietData: [],
              responseDietData1: []
            });
            console.log(that.data.responseSleepData)
          }
        },
        fail(err) {
          console.error(err);
        }
      });
    },

        // 查询睡眠数据(按类型)
        analyzeSleepData2() {
          const that = this;
          wx.request({
            url: 'http://localhost:3000/analyzeSleepData?userId=' + app.globalData.userId,
            method: 'GET',
            success(res) {
              console.log(res.data); // 打印后端返回的数据
              if (res.data.success) {
                that.setData({
                  responseSleepData1: res.data.data,
                  responseSleepData: [],
                  responsePhysicalData: [],
                  responsePhysicalData1: [],
                  responseExerciseData: [],
                  responseExerciseData1: [],
                  responseDietData: [],
                  responseDietData1: []
                });
                console.log(that.data.responseSleepData1)
              }
            },
            fail(err) {
              console.error(err);
            }
          });
        },

  // 切换
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
})