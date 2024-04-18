App({
  onLaunch(){
    setInterval(this.checkAlarms.bind(this), 10000);
  },

    checkAlarms: function () {
      var that = this; // 存储this到that变量
      // 获取当前时间
      var now = new Date().getTime();
      // 获取用户设置的闹钟数组，假设从 Node.js 后端获取并存储在全局变量 alarms 中

      wx.request({
        url: 'http://localhost:3000/analyzeTaskData?userId=' + that.globalData.userId,
        method: 'GET',
        success(res) {
          console.log("打印后端返回的数据");
          console.log(res.data); // 打印后端返回的数据  
          console.log(res.data.data);    
          if (res.data.success) {
            var alarms = [];
            var tasks = [];
            // 遍历 res.data.data 数组
            res.data.data.forEach(function (item) {
              // console.log("打印时间和任务")
              // console.log(item.time);
              // console.log(item.task);
              alarms.push(item.time);
              tasks.push(item.task);
            });  
            // console.log("打印alarm数组------------------");
            // console.log(alarms);
            // console.log("打印tasks数组------------------");
            // console.log(tasks);
            // 遍历所有闹钟
            alarms.forEach(function (alarm, index) {
              // var alarmTime = new Date(alarm.year, alarm.month - 1, alarm.day, alarm.hour, alarm.minute, alarm.second).getTime();
              // 将日期时间字符串转换为 Date 对象
              var alarmTime = new Date(alarm).getTime();
              
              console.log("打印当前时间");
              console.log(now);
              console.log("打印设定时间");
              console.log(alarmTime);
              var timeDiff = Math.abs(now - alarmTime);

              if (timeDiff <= 10000) {
                // 弹出提示框，显示当前时间对应的任务
                wx.showModal({
                  title: '闹钟提醒',
                  content: '时间到了，请注意：' + tasks[index],
                  showCancel: false
                });
              }
            });
          }
        },
        fail(err) {
          console.error(err);
        }
      });
      
    },
  
  globalData:{
    Login: true,
    userId:''
  }
})