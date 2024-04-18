const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
const excel = require('exceljs');
const fs = require('fs');
// const regression = require('regression')
// const { linearRegression } = require('simple-statistics'); // 导入线性回归模型
// const regression = require('regression');
app.use(bodyParser.json())


//处理post请求
app.post('/', (req, res) => {
  console.log(req.body)
  res.json(req.body)
})

app.post('/show', (req, res) => {
  console.log(req.body.name)
  const a = req.body.name
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  connection.query("select * from user", function (error, results, fields) {
    if (error) throw console.error;
    res.json(results)
    console.log(results)

  })
  connection.end();
})

//登录请求
app.post('/submit', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  const userId = req.body.userId;
  const password = req.body.password;
  // 查询数据库中是否存在对应的数据
  const query = 'SELECT * FROM user WHERE id = ? AND password = ?';
  connection.query(query, [userId, password], (error, results, fields) => {
    if (error) {
      res.status(500).send('Database query error');
    } else {
      if (results.length > 0) {
        // 数据库中有对应的数据，返回标识 true 给前端
        res.json({ success: true });
      } else {
        // 数据库中没有对应的数据，返回标识 false 给前端
        res.json({ success: false });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('登录请求连接已成功关闭');
      }
    });
  });
});


// 将注册信息插入到数据库中
app.post('/register', (req, res) => {
  const { userId, password } = req.body;
  const userData = {
    id: userId,
    password: password
  };

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });

  connection.connect();

  // 先查询数据库中是否已存在相同用户名的记录
  connection.query('SELECT * FROM user WHERE id = ?', [userId], function (error, results, fields) {
    if (error) {
      console.error('Error querying database: ' + error.stack);
      res.status(500).send('Error querying database');
    } else {
      // 如果存在相同用户名的记录，返回错误信息给前端
      if (results.length > 0) {
        res.status(400).send('Username already exists');
      } else {
        // 如果不存在相同用户名的记录，执行插入操作
        connection.query('INSERT INTO user SET ?', userData, function (error, results, fields) {
          if (error) {
            console.error('Error inserting data into database: ' + error.stack);
            res.status(500).send('Error inserting data into database');
          } else {
            console.log('Inserted a new user with ID ' + results.insertId);
            res.send('Data inserted successfully');
          }
        });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});


// 将运动数据插入到数据库中
app.post('/submitexercisedata', (req, res) => {
  const { userId, exercise_type, exercise_duration_minutes, exercise_distance, calories_burned, exercise_date } = req.body;
  // 将日期字符串转换为 Date 对象
  const parsedExerciseDate = new Date(exercise_date);
  const userData = {
    id: userId,
    exercise_type: exercise_type,
    exercise_duration_minutes: exercise_duration_minutes,
    exercise_distance: exercise_distance,
    calories_burned: calories_burned,
    exercise_date: parsedExerciseDate
  };
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  connection.query('INSERT INTO exercise_data SET ?', userData, function (error, results, fields) {
    if (error) {
      console.error('Error inserting data into database: ' + error.stack);
      res.status(500).send('Error inserting data into database');
    } else {
      console.log('Inserted a new data ');
      res.send('Data inserted successfully');
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 将体征数据插入到数据库中
app.post('/submitphysicaldata', (req, res) => {
  const { userId, height, weight, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar, blood_lipid, measurement_date } = req.body;
  // 将日期字符串转换为 Date 对象
  const parsedExerciseDate = new Date(measurement_date);
  const userData = {
    id: userId,
    height: height,
    weight: weight,
    blood_pressure_systolic: blood_pressure_systolic,
    blood_pressure_diastolic: blood_pressure_diastolic,
    blood_sugar: blood_sugar,
    blood_lipid: blood_lipid,
    measurement_date: parsedExerciseDate
  };
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  connection.query('INSERT INTO physical_data SET ?', userData, function (error, results, fields) {
    if (error) {
      console.error('Error inserting data into database: ' + error.stack);
      res.status(500).send('Error inserting data into database');
    } else {
      console.log('Inserted a new data ');
      res.send('Data inserted successfully');
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 将饮食数据插入到数据库中
app.post('/submitdietdata', (req, res) => {
  const { userId, food_name, food_quantity, calories, meal_time, meal_date } = req.body;
  // 将日期字符串转换为 Date 对象
  const parsedExerciseDate = new Date(meal_date);
  const parsedMealTime = meal_time + ':00'; // 添加秒数部分，形成 '18:30:00'
  const userData = {
    id: userId,
    food_name: food_name,
    food_quantity: food_quantity,
    calories: calories,
    meal_time: parsedMealTime,
    meal_date: parsedExerciseDate
  };
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  connection.query('INSERT INTO diet_data SET ?', userData, function (error, results, fields) {
    if (error) {
      console.error('Error inserting data into database: ' + error.stack);
      res.status(500).send('Error inserting data into database');
    } else {
      console.log('Inserted a new data ');
      res.send('Data inserted successfully');
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 将睡眠数据插入到数据库中
app.post('/submitsleepdata', (req, res) => {
  const { userId, sleep_time, sleep_quality, sleep_date } = req.body;
  // 将日期字符串转换为 Date 对象
  const parsedExerciseDate = new Date(sleep_date);
  const userData = {
    id: userId,
    sleep_quality: sleep_quality,
    sleep_time: sleep_time,
    sleep_date: parsedExerciseDate
  };
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  connection.query('INSERT INTO sleep_data SET ?', userData, function (error, results, fields) {
    if (error) {
      console.error('Error inserting data into database: ' + error.stack);
      res.status(500).send('Error inserting data into database');
    } else {
      console.log('Inserted a new data ');
      res.send('Data inserted successfully');
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});


// 将任务数据插入到数据库中
app.post('/taskdata', (req, res) => {
  const { userId, time, task } = req.body;
  // 将日期字符串转换为 Date 对象
  const parsedTaskDate = new Date(time);
  const userData = {
    id: userId,
    time: parsedTaskDate,
    task: task
  };
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  connection.query('INSERT INTO task_data SET ?', userData, function (error, results, fields) {
    if (error) {
      console.error('Error inserting data into database: ' + error.stack);
      res.status(500).send('Error inserting data into database');
    } else {
      console.log('Inserted a new data ');
      res.send('Data inserted successfully');
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 将体征数据的目标值加入到数据库中
app.post('/submitphygoal', (req, res) => {
  const { userId, height, weight, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar, blood_lipid, measurement_date } = req.body;
  const parsedMeasurementDate = new Date(measurement_date);
  const userData = {
    id: userId,
    height: height,
    weight: weight,
    blood_pressure_systolic: blood_pressure_systolic,
    blood_pressure_diastolic: blood_pressure_diastolic,
    blood_sugar: blood_sugar,
    blood_lipid: blood_lipid,
    measurement_date: parsedMeasurementDate
  };

  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });

  connection.connect();

  // 检查数据库中是否已存在相同ID的数据
  connection.query('SELECT * FROM physical_goal WHERE id = ?', userId, function (error, results, fields) {
    if (error) {
      console.error('Error checking existing data in database: ' + error.stack);
      res.status(500).send('Error checking existing data in database');
    } else {
      if (results && results.length > 0) {
        // 如果存在相同ID的数据，则执行更新操作
        connection.query('UPDATE physical_goal SET ? WHERE id = ?', [userData, userId], function (error, results, fields) {
          if (error) {
            console.error('Error updating data in database: ' + error.stack);
            res.status(500).send('Error updating data in database');
          } else {
            console.log('Updated existing data');
            res.send('Data updated successfully');
          }
        });
      } else {
        // 如果不存在相同ID的数据，则执行插入操作
        connection.query('INSERT INTO physical_goal SET ?', userData, function (error, results, fields) {
          if (error) {
            console.error('Error inserting data into database: ' + error.stack);
            res.status(500).send('Error inserting data into database');
          } else {
            console.log('Inserted a new data');
            res.send('Data inserted successfully');
          }
        });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });

});


// 获取后端的数据
app.get('/', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  //查找所有的人物名字返回给客户端。其实没必要（测试用的）
  connection.query('select * from user', function (error, results, fields) {
    if (error) throw error;
    res.json(results)
    // console.log(results)
  })
  connection.end();
})

// 查询体征数据数据

app.get('/analyzePhycicalData', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  const { userId } = req.query; // 从查询参数中获取 userId
  //const query = `SELECT * FROM physical_data WHERE id = '${userId}'`;
  const query = `SELECT id, height, weight, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar, blood_lipid, DATE_FORMAT(measurement_date, '%Y-%m-%d') AS measurement_date 
  FROM physical_data WHERE id = '${userId}' 
  ORDER BY measurement_date desc`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});



// 查询运动数据
app.get('/analyzeExerciseData', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  const { userId } = req.query;
  const query = `SELECT id, exercise_type, exercise_duration_minutes, exercise_distance, calories_burned, DATE_FORMAT(exercise_date, '%Y-%m-%d') AS exercise_date FROM exercise_data WHERE id = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});


// 查询任务数据
app.get('/analyzeTaskData', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  const { userId } = req.query;
  const query = `SELECT id, task, DATE_FORMAT(time, '%Y-%m-%d %H:%i:%s') AS time FROM task_data WHERE id = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('查询任务数据库连接已成功关闭');
      }
    });
  });
});

// 按时间字段排序运动数据
app.get('/analyzeExerciseData1', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  const { userId } = req.query;
  const query = `SELECT id, exercise_type, exercise_duration_minutes, exercise_distance, calories_burned, DATE_FORMAT(exercise_date, '%Y-%m-%d') AS exercise_date FROM exercise_data WHERE id = '${userId}' ORDER BY exercise_date desc`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 按运动类型字段排序运动数据
app.get('/analyzeExerciseData2', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  const { userId } = req.query;
  const query = `SELECT id, exercise_type, exercise_duration_minutes, exercise_distance, calories_burned, DATE_FORMAT(exercise_date, '%Y-%m-%d') AS exercise_date FROM exercise_data WHERE id = '${userId}' ORDER BY exercise_type`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});





// 查询饮食数据1(按时间类型排序)
app.get('/analyzeDietData1', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  const { userId } = req.query;
  const query = `SELECT id, food_name, food_quantity, calories, meal_time, DATE_FORMAT(meal_date, '%Y-%m-%d') AS meal_date FROM diet_data WHERE id = '${userId}' ORDER BY meal_date desc`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 查询饮食数据2(按食物类型排序)
app.get('/analyzeDietData2', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  const { userId } = req.query;
  const query = `SELECT id, food_name, food_quantity, calories, meal_time, DATE_FORMAT(meal_date, '%Y-%m-%d') AS meal_date FROM diet_data WHERE id = '${userId}' ORDER BY food_name`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});


// 查询睡眠数据
app.get('/analyzeSleepData', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  })
  connection.connect();
  const { userId } = req.query;
  const query = `SELECT id, sleep_quality, sleep_time, DATE_FORMAT(sleep_date, '%Y-%m-%d') AS sleep_date FROM sleep_data WHERE id = '${userId}' ORDER BY sleep_date desc`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});


// 查询目标数据
app.get('/getGoalData', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  const { userId } = req.query; // 从查询参数中获取 userId
  //const query = `SELECT * FROM physical_data WHERE id = '${userId}'`;
  const query = `SELECT id, height, weight, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar, blood_lipid, DATE_FORMAT(measurement_date, '%Y-%m-%d') AS measurement_date 
  FROM physical_goal WHERE id = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 获取最近一次体征数据
app.get('/getLatestData', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  const { userId } = req.query; // 从查询参数中获取 userId
  const query = `SELECT id, height, weight, blood_pressure_systolic, blood_pressure_diastolic, blood_sugar, blood_lipid, DATE_FORMAT(measurement_date, '%Y-%m-%d') AS measurement_date 
  FROM physical_data WHERE id = '${userId}' 
  ORDER BY measurement_date desc LIMIT 1`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results[0] }); // 返回第一条数据
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 获取身高

app.get('/getHeight', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  const { userId } = req.query; // 从查询参数中获取 userId
  //const query = `SELECT * FROM physical_data WHERE id = '${userId}'`;
  const query = `SELECT height FROM physical_data WHERE id = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});



// 获取体重


app.get('/getWeight', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  const { userId } = req.query; // 从查询参数中获取 userId
  //const query = `SELECT * FROM physical_data WHERE id = '${userId}'`;
  const query = `SELECT weight FROM physical_data WHERE id = '${userId}'`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error querying database: ' + err.stack);
      res.json({ success: false, message: '数据库查询出错' });
    } else {
      if (results.length > 0) {
        res.json({ success: true, data: results });
      } else {
        res.json({ success: false, message: '未找到相关数据' });
      }
    }
    // 查询完成后关闭连接
    connection.end(function (err) {
      if (err) {
        console.log('关闭连接时发生错误：', err.message);
      } else {
        console.log('数据库连接已成功关闭');
      }
    });
  });
});

// 导出数据
app.get('/exportData', (req, res) => {
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx141510',
    database: 'health'
  });
  connection.connect();
  const { userId } = req.query; // 从查询参数中获取 userId
  // 需要导出的表格
  const tables = ['diet_data', 'user', 'exercise_data', 'physical_data', 'physical_goal', 'sleep_data', 'task_data'];

  const exportPromises = tables.map(table => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${table} WHERE id = '${userId}'`;
      connection.query(query, (error, results) => {
        if (error) {
          console.error(`Error querying table ${table}: ${error}`);
          reject(error);
        } else {
          resolve({ table, data: results });
        }
      });
    });
  });

  // 等待所有查询完成
  Promise.all(exportPromises)
    .then(data => {
      // 创建一个新的工作簿
      const workbook = new excel.Workbook();
      // 添加工作表，并将查询结果写入工作表
      data.forEach(({ table, data }) => {
        // console.log(data)
        // const worksheet = workbook.addWorksheet(table);
        // worksheet.addRows(data);
        if (table && data && Array.isArray(data) && data.length > 0) {
          const worksheet = workbook.addWorksheet(table);
      
          const columns = Object.keys(data[0]);
          worksheet.addRow(columns);
      
          data.forEach(row => {
            const rowValues = columns.map(column => row[column]);
            worksheet.addRow(rowValues);
          });
        }
      });
      // 将工作簿写入到文件
      //console.log(workbook);
      const filePath = 'D:\\小程序项目\\导出的数据\\file.xlsx'; // 指定导出的文件路径
      workbook.xlsx.writeFile(filePath)
        .then(() => {
          console.log('Excel 文件已导出到：', filePath);
        })
        .catch(err => {
          console.error('导出 Excel 文件失败：', err);
        });
    })
    .catch(error => {
      // 错误处理
      console.error('导出数据失败：', error);
    });

  // 查询完成后关闭连接
  connection.end(function (err) {
    if (err) {
      console.log('关闭连接时发生错误：', err.message);
    } else {
      console.log('导出数据库数据库连接已成功关闭');
    }
  });
});


app.listen(3000, () => {
  console.log('server running at http://127.0.0.1:3000')
})
