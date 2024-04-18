import * as echarts from '../../ec-canvas/echarts'
const app = getApp();

Page({
  data: {
    id: app.globalData.userId,
    lazyEc: {
      lazyLoad: true
    },
    type: 'Height',
    heightTrend: '暂无数据', // 假设初始值为上升，实际根据业务逻辑设置
    heightTrendTexts: { // 不同趋势对应的文字内容
      '上升趋势': '上升趋势',
      '下降趋势': '随着年龄的增长，人体的骨骼和软组织可能会发生退化或压缩，导致身高逐渐减少。此外，一些健康问题，如骨质疏松症、脊柱问题或姿势不良，也可能影响身高并导致身高下降。',
      '保持不变': '保持不变',
      '暂无数据': '暂无数据'
    },
    heightTrendText: '暂无数据',
    weightTrend: '暂无数据',
    weightTrendTexts: { // 不同趋势对应的文字内容
      '上升趋势': '上升趋势',
      '下降趋势': '体重下降趋势的速度和持续时间因人而异，取决于个体的生活习惯、健康状况以及采取的减重方法。维持适当的饮食和运动习惯可以有助于保持健康的体重并改善整体健康状况。',
      '保持不变': '保持不变',
      '暂无数据': '暂无数据'
    },
    weightTrendText: '暂无数据',
    chartOptionData: {
      Height: [],
      Weight: [],
      xData: []
    },
    BMI: '',
    responseExerciseData:'',
    cntExercise: '',
    blood_pressure_systolic: '', // 收缩压
    blood_pressure_diastolic: '', // 舒张压
    blood_sugar: '',
    blood_lipid: '',
    diabetes_probability: '', // 糖尿病
    risk_level: '',
    lipid_probability: '', // 血脂
    lipid_risk_level: '',
    blood_pressure_probability: '', //血压
    blood_pressure_risk_level: ''
  },

  
  onLoad: function(options) {
    const that = this;
    // 获取组件
    that.lazyComponent = that.selectComponent('#lazy-mychart-dom')
    // 后端请求数据
    wx.request({
      url: 'http://localhost:3000/getHeight?userId=' + app.globalData.userId,
      method: 'GET',
      success: (res) => {
        console.log(res.data)
        //const Height = res.data.data
        let Height = [];
        let theFinallyHeight;
            for (var index in res.data.data) {
              Height[index] = res.data.data[index].height
              theFinallyHeight = res.data.data[index].height
            }

        wx.request({
          url: 'http://localhost:3000/getWeight?userId=' + app.globalData.userId,
          method: 'GET',
          success: (res) => {
            console.log(res.data)
            let Weight = [];
            let theFinallyWeight;
            for (var index in res.data.data) {
              Weight[index] = res.data.data[index].weight
              theFinallyWeight = res.data.data[index].weight
            }
            console.log("测试取出数据")
            console.log(Weight)
            // 返回数据的长度
            const xData = Array.from({ length: res.data.data.length }, (_, i) => `第${i + 1}次测试`); // 使用 res.data.length 获取数组长度
            console.log(xData);
            that.setData({
              BMI: ((theFinallyWeight/2) / (theFinallyHeight*theFinallyHeight/10000)).toFixed(3),
              // Height: Height,
              // Weight: Weight,
              chartOptionData: {
                Height: Height,
                Weight: Weight,
                xData: xData
              }
            });

            // 数据初始化
            let hTrend = that.calculateTrend(Height);
            that.setData({
              heightTrend: hTrend
            })
            that.setHeightTrendText(hTrend);
            let wTrend = that.calculateTrend(Weight);
            that.setData({
              weightTrend: wTrend
            })
            that.setWeightTrendText(wTrend);

            console.log("打印数据");
            console.log(that.data.chartOptionData.Height[0].height);
            console.log(that.data.chartOptionData.Weight);
            console.log(that.data.chartOptionData.xData);
            that.init(); // 初始化图表
          },
          fail: (err) => {
            console.error('Failed to fetch data from backend:', err);
          }
        });
      },
      fail: (err) => {
        console.error('Failed to fetch data from backend:', err);
      }
    });
    
    // 渲染运动数据
    wx.request({
      url: 'http://localhost:3000/analyzeExerciseData?userId=' + app.globalData.userId,
      method: 'GET',
      success(res) {
        console.log(res.data); // 打印后端返回的数据
        if (res.data.success) {
          that.setData({
            responseExerciseData: res.data.data
          });
          let cnt=0;
          for (var index in res.data.data) {
            cnt += 1;
          }
          that.setData({
            cntExercise: cnt
          })
          console.log(that.data.responseExerciseData)
        }
      },
      fail(err) {
        console.error(err);
      }
    });

        // 获取最近一次体征数据来进行数据分析
        wx.request({
          url: 'http://localhost:3000/getLatestData?userId=' + app.globalData.userId,
          method: 'GET',
          success(res) {
            console.log(res.data); // 打印后端返回的数据
            if (res.data.success) {
              that.setData({
                blood_lipid: res.data.data.blood_lipid,
                blood_sugar: res.data.data.blood_sugar,
                blood_pressure_diastolic: res.data.data.blood_pressure_diastolic,
                blood_pressure_systolic: res.data.data.blood_pressure_systolic
              });

              // 对血糖进行处理
              if (that.data.blood_sugar <= 5.6) {
                that.setData({
                    diabetes_probability: 0,
                    risk_level: "低风险",
                })
              } else if (that.data.blood_sugar <= 7.0) {
                const lowRange = 5.6; // 正常血糖范围下限
                const highRange = 7.0; // 正常血糖范围上限
                const lowerBound = 0; // 低风险下限
                const upperBound = 50; // 低风险上限

                const lowerPercentage = lowerBound + ((that.data.blood_sugar - lowRange) / (highRange - lowRange)) * (upperBound - lowerBound);
                const diabetesProbability = Math.min(upperBound, Math.max(lowerBound, lowerPercentage)); // 限制百分比在0到50之间

                that.setData({
                    diabetes_probability: diabetesProbability.toFixed(2),
                    risk_level: "中风险",
                })
              } else if (that.data.blood_sugar <= 11.1) {
                const lowRange = 7.0; // 正常血糖范围下限
                const highRange = 11.1; // 正常血糖范围上限
                const lowerBound = 50; // 中风险下限
                const upperBound = 75; // 中风险上限

                const lowerPercentage = lowerBound + ((that.data.blood_sugar - lowRange) / (highRange - lowRange)) * (upperBound - lowerBound);
                const diabetesProbability = Math.min(upperBound, Math.max(lowerBound, lowerPercentage)); // 限制百分比在50到75之间

                that.setData({
                    diabetes_probability: diabetesProbability.toFixed(2),
                    risk_level: "高风险",
                })
              } else {
                const lowerBound = 75; // 高风险下限
                const upperBound = 100; // 高风险上限

                const diabetesProbability = lowerBound + ((that.data.blood_sugar - 11.1) / (20)) * (upperBound - lowerBound); // 将高血糖范围线性映射到75%到100%的风险范围

                that.setData({
                    diabetes_probability: diabetesProbability.toFixed(2),
                    risk_level: "高风险",
                })
              };
               
               // 对血脂进行处理
              if (that.data.blood_lipid <= 129) {
                that.setData({
                    lipid_probability: 0,
                    lipid_risk_level: '低风险'
                })
              } else if (that.data.blood_lipid <= 159) {
                const lowRange = 129; // 正常血脂范围下限
                const highRange = 159; // 正常血脂范围上限
                const lowerBound = 0; // 低风险下限
                const upperBound = 50; // 低风险上限

                const lowerPercentage = lowerBound + ((that.data.blood_lipid - lowRange) / (highRange - lowRange)) * (upperBound - lowerBound);
                const lipidProbability = Math.min(upperBound, Math.max(lowerBound, lowerPercentage)); // 限制百分比在0到50之间

                that.setData({
                    lipid_probability: lipidProbability.toFixed(2),
                    lipid_risk_level: '低风险'
                })
              } else if (that.data.blood_lipid <= 318) {
                const lowRange = 159; // 正常血脂范围下限
                const highRange = 318; // 正常血脂范围上限
                const lowerBound = 50; // 中风险下限
                const upperBound = 75; // 中风险上限

                const lowerPercentage = lowerBound + ((that.data.blood_lipid - lowRange) / (highRange - lowRange)) * (upperBound - lowerBound);
                const lipidProbability = Math.min(upperBound, Math.max(lowerBound, lowerPercentage)); // 限制百分比在50到75之间

                that.setData({
                    lipid_probability: lipidProbability.toFixed(2),
                    lipid_risk_level: '中风险'
                })
              } else {
                const lowerBound = 75; // 高风险下限
                const upperBound = 100; // 高风险上限

                const lipidProbability = lowerBound + ((that.data.blood_lipid - 318) / (100)) * (upperBound - lowerBound); // 将高血脂范围线性映射到75%到100%的风险范围

                that.setData({
                    lipid_probability: lipidProbability.toFixed(2),
                    lipid_risk_level: '高风险'
                })
              };

              // 对血压进行评估
              const systolic = that.data.blood_pressure_systolic;
              const diastolic = that.data.blood_pressure_diastolic;

              // 计算收缩压和舒张压的比例，用于评估血压风险
              const systolicRatio = (systolic - 90) / 30; // 计算收缩压比例
              const diastolicRatio = (diastolic - 60) / 20; // 计算舒张压比例

              // 综合考虑收缩压和舒张压的比例来评估血压风险
              const probability = Math.min(Math.max(systolicRatio, diastolicRatio), 1);

              if (probability <= 0.33) {
                  that.setData({
                      blood_pressure_probability: (probability * 100).toFixed(2),
                      blood_pressure_risk_level: '低风险'
                  })
              } else if (probability <= 0.67) {
                  that.setData({
                      blood_pressure_probability: (probability * 100).toFixed(2),
                      blood_pressure_risk_level: '中风险'
                  })
              } else {
                  that.setData({
                      blood_pressure_probability: (probability * 100).toFixed(2),
                      blood_pressure_risk_level: '高风险'
                  })
              }
              console.log("-----------血压风险");
              console.log(that.data.blood_pressure_probability)
            }
          },
          fail(err) {
            console.error(err);
          }
        });

  },
  init() { //手动初始化
    this.lazyComponent.init((canvas, width, height, dpr) => {
      let chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr
      })
      let option = getOption(this.data.chartOptionData.Height, [], this.data.chartOptionData.xData); // 修改这里传入的数据
      chart.setOption(option)
      this.chart = chart // 将图表实例绑定到this上
      return chart
    })
  },
  
  changeType(e) {
    const type = e.currentTarget.dataset.type;
    const chartOptionData = this.data.chartOptionData;
    let option;
    if (type === 'Weight') {
      option = getOption([], chartOptionData.Weight, chartOptionData.xData);
    } else if (type === 'Height') {
      option = getOption(chartOptionData.Height, [], chartOptionData.xData);
    }
    this.setData({
      type: type,
    });
    this.chart.setOption(option);
  },

    // 根据 trend 设置 trendText
    setHeightTrendText(trend) {
      this.setData({
        heightTrendText: this.data.heightTrendTexts[trend] || '暂无数据'
      });
    },

    setWeightTrendText(trend) {
      this.setData({
        weightTrendText: this.data.weightTrendTexts[trend] || '暂无数据' // 默认为暂无数据
      });
    },

  calculateTrend(data) {
    const length = data.length;
    if (length === 0) {
      return '无数据'; // 没有数据，无法计算趋势
    }
    let trend = '保持不变'; // 默认为保持不变
    // 检查数据变化趋势
    for (let i = 1; i < length; i++) {
      if (data[i] > data[i - 1]) {
        trend = '上升趋势';
      } else if (data[i] < data[i - 1]) {
        trend = '下降趋势';
      } else {
        trend = '保持不变';
      }
    }
    return trend;
  }
})

function getOption(Height, Weight, xData) {
  return {
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Height', // 添加身高数据
        data: Height,
        type: 'line'
      },
      {
        name: 'Weight', // 添加体重数据
        data: Weight,
        type: 'line'
      }
    ]
  };
}