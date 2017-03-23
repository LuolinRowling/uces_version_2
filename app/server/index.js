'user strict'

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var util = require('./util.js');
var async = require('async');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.post('/login', function(req, res) {

	var username = req.body.username,
		password = req.body.password;

	var userQuerySql = "SELECT * FROM user WHERE username=? and password=?",
		userQuerySql_Params = [username, password];

	util.sqlQuery(userQuerySql, userQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			return;
		}

		if (result.length > 0) {
    		res.send({isSuccess:'true'});
		} else {
			res.send({isSuccess:'false'});
		}
	});


});

app.post('/getTeacherInfo', function(req, res) {
	var teacherQuerySql = 'SELECT * FROM teacher order by school_id',
		teacherQuerySql_Params = [];

	var array = require('lodash/array'),
		fs = require('fs');

	util.sqlQuery(teacherQuerySql, teacherQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			return;
		};

		var teachers = result;
		
		async.map(teachers, function(item, callback) {

			if (err) {
				callback(err);
			} else {
				item.count = '0 / 0';

				var dirName = '../pics/' + item.school + '_' + item.name,
					pics = [],
					studentCount = 0,
					imgCount = 0,
					data = {};

				try {
					fs.readdir(dirName, function(err, files) {

						if (err) {
							console.log(err);
						} else {
							
							pics = files;
							var teacherQuerySql = "SELECT student_id FROM student WHERE teacher_id=?",
								teacherQuerySql_Params = [item.id];

							util.sqlQuery(teacherQuerySql, teacherQuerySql_Params, function(err, result) {
								if (err) {
									console.log("[query error] - :" + err.message);
									res.send(data);
									return;
								} else {
									async.map(result, function(student, callback) {
										if (err) {
											callback(err);
										} else {
											studentCount++;
											if (pics.indexOf(student.student_id.trim() + ".jpg") != -1) {
												imgCount++;
											} 
											callback(err, student);
										}
									}, function(err, results) {
										if (err) {
											console.log(err);
										} else {
											item.count = studentCount + ' / ' + imgCount;
											callback(err, item);
										}
									})
								}
							});
						}
					});	
				} catch (err) {
					console.log(err);
				}
			}
		}, function (err, results) {
			if (err) {
				console.log(err);
			} else {
				teachers = results;
				res.send(teachers);
			}
		});
	})
});

function getStudentNum(picName) {
    var index = picName.indexOf('.')
    if (index) {
        return picName.substring(0, index)
    }
}

app.post('/insertTeacher', function(req, res) {
	var schools = ['', 
				   '电信学院', '计算机学院', '经管学院', '运输学院', 
				   '土建学院', '机电学院', '电气学院', '理学院', 
			       '法学院', '语传学院', '软件学院', '建艺学院'],
		school_id = schools.indexOf(req.body.school),
		school = req.body.school,
		name = req.body.name;

	var data = {
		isSuccess: false,
		validSchool: false
	};

	if (school_id == -1) {
		res.send(data);
		return;
	}

	data.validSchool = true;

	var teacherQuerySql = "INSERT INTO teacher(school, school_id, name) values(?, ?, ?)",
		teacherQuerySql_Params = [req.body.school, school_id, req.body.name];

	
	util.sqlQuery(teacherQuerySql, teacherQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			res.send(data);
			return;
		}

		if (result.affectedRows > 0) {
			data.isSuccess = true;
			//TODO:增加文件夹
			var fs = require('fs'),
				excelDirPath = "../excel/" + school + "_" + name,
				picsDirPath = "../pics/" + school + "_" + name;

			if (fs.existsSync(excelDirPath)) {
		        console.log('已经创建过此更新目录了');
		    } else {
		        fs.mkdirSync(excelDirPath);
		  
		        console.log('更新目录已创建成功\n');
		    }

			if (fs.existsSync(picsDirPath)) {
		        console.log('已经创建过此更新目录了');
		    } else {
		        fs.mkdirSync(picsDirPath);
		  
		        console.log('更新目录已创建成功\n');
		    }

			res.send(data);
		} else {
			res.send(data);
		}

	})
});


app.post('/deleteTeacher', function(req, res) {

	var teachers = req.body.teachers;
	teachers = eval(teachers);

	var teacherQuerySql = "DELETE FROM teacher where id=?";

	var data = {
		isSuccess: false
	};

	for(var i = 0; i < teachers.length; i++) {
		var teacher = teachers[i].id,
			params = [];

		params.push(teacher);

		util.sqlQuery(teacherQuerySql, params, function(err, result) {
			if (err) {
				// console.log("[query error] - :" + err.message);
				res.send(data);
				return;
			}
		});

		//TODO:删除表
		var studentQuerySql = 'DELETE FROM student where teacher_id=?',
		studentQuerySql_Params = params;

		util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
			if (err) {
				// console.log("[query error] - :" + err.message);
				res.send(data);
				return;
			}
		});
	}

	data.isSuccess = true;
	res.send(data);
});

app.post('/getStudentInfo', function(req, res) {
	var teacherId = req.body.teacherId,
		name = req.body.name,
		school = req.body.school,
		fs = require('fs');
	
	var studentQuerySql = 'SELECT * FROM student where teacher_id=? order by student_id',
		studentQuerySql_Params = [teacherId];

	util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			return;
		}

		var dirName = '../pics/' + school + '_' + name,
			pics = [],
			students = result;

		try {
			fs.readdir(dirName, function(err, files) {
				if (err) {
					console.log(err);
				} else {
					pics = files;

					async.map(students, function(item, callback) {
						if (err) {
							callback(err);
						} else {
							// console.log(item.student_id + ".jpg")
							if (pics.indexOf(item.student_id.trim() + ".jpg") != -1) {
								item.hasPhoto = true;
							} else {
								item.hasPhoto = false;
							}
							callback(err, item);
						}
					}, function(err, results) {
						if (err) {
							console.log(err);
						} else {
							students = results;
							console.log(students[0])
							res.send(students);
						}
					})
				}
			});
		} catch (err) {
			console.log(err);
		}

		
		
	})
});

app.post('/clearStudentInfo', function(req, res) {
	var teacherId = req.body.teacherId;
	
	var studentQuerySql = 'DELETE FROM student where teacher_id=?',
		studentQuerySql_Params = [teacherId];

	util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			return;
		}

		var data = {};

		if (result.affectedRows > 0) {
			data.isSuccess = true;
		} else {
			data.isSuccess = false;
		}

		console.log(data);
		res.send(data);
	})
});

app.post('/insertStudent', function(req, res) {

	var data = {
		isSuccess: false
	};

	var studentQuerySql = "INSERT INTO student(student_id, dorm_id, student_name, class, major, origin, party, study, family, isleader, others, guidance, teacher_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		studentQuerySql_Params = [req.body.student_id, req.body.dorm_id, req.body.student_name, req.body.class, req.body.major, req.body.origin, req.body.party, req.body.study, req.body.family, req.body.isLeader, req.body.others, req.body.guidance, req.body.teacher_id];

	util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			res.send(data);
			return;
		}

		if (result.affectedRows > 0) {
			data.isSuccess = true;
			res.send(data);
		} else {
			res.send(data);
		}

	});
});

app.post('/searchStudentById', function(req, res) {
	var studentQuerySql = "SELECT * FROM student WHERE student_id=?",
		studentQuerySql_Params = [req.body.student_id];

	util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			return;
		}
		
		var data = {
			isSuccess: false,
			result: []
		}

		if (result.length > 0) {
			data.isSuccess = true;
			data.result = result;
			res.send(data);
		} else {
			res.send(data);
		}

	})
});

app.post('/modifyStudent', function(req, res) {

	var data = {
		isSuccess: false
	};

	var studentQuerySql = "UPDATE student set student_id=?, dorm_id=?, student_name=?, class=?, major=?, origin=?, party=?, study=?, family=?, isleader=?, others=?, guidance=? WHERE id=?",
		studentQuerySql_Params = [req.body.student_id, req.body.dorm_id, req.body.student_name, req.body.class, req.body.major, req.body.origin, req.body.party, req.body.study, req.body.family, req.body.isLeader, req.body.others, req.body.guidance, req.body.id];

	util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			res.send(data);
			return;
		}

		if (result.affectedRows > 0) {
			data.isSuccess = true;
			res.send(data);
		} else {
			res.send(data);
		}

	})
});

app.post('/deleteStudent', function(req, res) {
	var ids = eval(req.body.ids),
		data = {
			isSuccess: false
		};

	var studentQuerySql = "DELETE FROM student where id=?";

	for (var i = 0; i < ids.length; i++) {
		var params = [ids[i]];

		util.sqlQuery(studentQuerySql, params, function(err, result) {
			if (err) {
				console.log("[query error] - :" + err.message);
				res.send(data);
				return;
			}
		})
	}
	
	data.isSuccess = true;
	res.send(data);

});

app.post('/getTeachersBySchoolId', function(req, res) {
	var schoolId = req.body.schoolId;
	var teacherQuerySql = 'SELECT * FROM teacher WHERE school_id=?',
		teacherQuerySql_Params = [schoolId];

	util.sqlQuery(teacherQuerySql, teacherQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			return;
		};

		res.send(result);
	});	

});

app.post('/getEvalStudents', function(req, res) {
	var school = req.body.school,
		name = req.body.name,
		teacherId = req.body.teacherId;

	var fs = require('fs'),
		dirName = '../pics/' + school + '_' + name,
		pics = [],
		array = require('lodash/array');

	try {
		fs.readdir(dirName, function(err, files) {
			//选出jpg为结尾的
			pics = files.filter(function(item) {
				if (item.split('.').length == 2) {
					var postfix = item.split('.')[1];
					return (postfix == "jpg");
				}
				return false;
			});

			pics = pics.map(getStudentNum);

			//检查是否在数据库中是否有对应学号的信息
			var studentQuerySql = 'SELECT student_id FROM student WHERE teacher_id=?',
				studentQuerySql_Params = [teacherId];

			util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
				if (err) {
					console.log("[query error] - :" + err.message);
					res.send(null);
					return;
				};


				var studentIdsFromDB = [];
				for (var i = 0; i < result.length; i++) {
					studentIdsFromDB.push(result[i]['student_id'].trim());
				}

				var evalStudents = array.intersection(pics, studentIdsFromDB);
				res.send(evalStudents);
			});	

		});
	} catch (err) {
	}
});

app.post('/importExcel', function(req, res) {
	var teacherInfo = JSON.parse(req.body.teacherInfo);

	var XLSX = require('xlsx'),
		filePath = '../excel/',
		fs = require('fs'),
		// dirName = filePath + teacherInfo["school"] + '_' + teacherInfo["name"];
		filePath = filePath + teacherInfo["school"] + '_' + teacherInfo["name"] + "/" + teacherInfo["school"] + '_' + teacherInfo["name"] + ".xlsx";

		var data = {
			isSuccess: true,
			hasFile: true
		}

		try {
			var workbook = XLSX.readFile(filePath);

			// console.log(XLSX.utils.sheet_to_json(workbook))

			var sheet_name_list = workbook.SheetNames;
			
			sheet_name_list.forEach(function(y) { /* iterate through sheets */
				var worksheet = workbook.Sheets[y],
					students = XLSX.utils.sheet_to_json(worksheet),
					errorFlag = false;

				for (var i = 0; i < students.length; i++) {
					var student = students[i],
						studentQuerySql = "INSERT INTO student(student_id, dorm_id, student_name, class, major, origin, party, study, family, isleader, others, guidance, teacher_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
						studentQuerySql_Params = [student["学号"], student["宿舍号"], student["姓名"], student["班级"], student["专业"], student["生源地"], student["政治面貌"], student["学习排名情况"], student["家庭经济情况"], student["是否为学生干部"], student["辅导员了解的除基本信息外的其他情况"], student["开展教育辅导情况"], teacherInfo["id"]];

					util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
						if (err) {
							console.log("[query error] - :" + err.message);
							data.isSuccess = false;
							errorFlag = true;
							res.send(data);
							return;
						}

						if (result.affectedRows > 0) {

						} else {
							data.isSuccess = false;
						}
					});
				}

				if (errorFlag) {
					data.isSuccess = false;
					res.send(data);
				} 

				res.send(data);
				
			});

		} catch (err) {
			console.log(err);
			data.isSuccess = false;
			data.hasFile = false;
			res.send(data)
		}
	// });


});


app.post('/reboot', function(req, res) {
	var data = {
		studentSuccess: false,
		teacherSuccess: false
	}

	var studentQuerySql = 'TRUNCATE TABLE student',
		studentQuerySql_Params = [];

	util.sqlQuery(studentQuerySql, studentQuerySql_Params, function(err, result) {
		if (err) {
			console.log("[query error] - :" + err.message);
			res.send(data);
			return;
		} else {
			data.studentSuccess = true;

			var teacherQuerySql = 'TRUNCATE TABLE teacher',
				teacherQuerySql_Params = [];

			util.sqlQuery(teacherQuerySql, teacherQuerySql_Params, function(err, result) {
				if (err) {
					console.log("[query error] - :" + err.message);
					res.send(data);
					return;
				} else {
					data.teacherSuccess = true;
					res.send(data);
				}
			})
		}
	})
});

process.on('uncaughtException', function (err) {
  console.log(err);
});

app.listen(8888);
console.log('Listening on port 8888...');