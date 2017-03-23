Zepto(function($){

    if (localStorage.getItem('evalTeacher') == null) {
        window.location.href = './teacherSelect.html';
    }

    var evalTeacher = JSON.parse(localStorage.getItem('evalTeacher'));

    var evalStudent_vm = new Vue({
        el: '#evalStudent',
        data: {
            school: evalTeacher.school,
            name: evalTeacher.name,
            pics: [],
            rollOn: false,
            imgSrc: "",
            student_id: "",
            evalStudentInfo: {
                student_id: "",
                dorm_id: "",
                student_name: "",
                class: "",
                major: "",
                origin: "",
                party: "",
                study: "",
                family: "",
                isleader: "",
                others: "",
                guidance: ""
            },
            g_Interval: 100,
            g_Timer: ""
        },
        methods: {
            switchRoll: function(e) {
                this.rollOn = !this.rollOn;

                //开始滚动
                if (this.rollOn) {
                    this.startRoll();
                } else {
                    this.stopRoll();
                }
            },
            startRoll: function() {
                this.g_Timer = setInterval(this.rollPic, this.g_Interval);
            },
            stopRoll: function() {
                clearInterval(this.g_Timer);
                var index = this.pics.indexOf(this.student_id);
                this.pics.splice(index, 1);
            },
            rollPic: function() {
                var index = Math.floor(Math.random() * this.pics.length);
                // this.imgSrc = "../../../pics/" + this.school + '_' + this.name + '/' + this.pics[index] + ".jpg";
                this.student_id = this.pics[index];
                this.imgSrc = "http://localhost:7777/getImg?name=" + evalTeacher.name + '&' + "school=" + evalTeacher.school + '&' + "studentId=" + this.pics[index];
                
            },
            showMoreInfo: function() {
                var vm = this;
                if (this.student_id == "") {
                    alert("尚未选中学生");
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8888/searchStudentById',
                    data: {
                        student_id: this.student_id
                    },
                    dataType: 'json',
                    success: function(data){
                        
                        if (data.isSuccess == true) {
                            vm.evalStudentInfo = data.result[0];
                        }

                    },
                    error: function(xhr, type){
                        console.log(xhr);
                        alert('Ajax error!')
                    }
                });
            },
            backToTeacherSelect: function() {
                localStorage.removeItem("evalTeacher");
                window.location.href = "./teacherSelect.html";
            },
            searchStudentById: function() {

                var student_id = $('.inputStudentId').val(),
                    vm = this;

                if (student_id == "" || student_id.length < 8) {
                    alert("请输入正确的学号");
                    return;
                }

                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8888/searchStudentById',
                    data: {
                        student_id: student_id
                    },
                    dataType: 'json',
                    success: function(data){
                        
                        if (data.isSuccess == true) {
                             vm.evalStudentInfo = data.result[0];
                             this.imgSrc = "http://localhost:7777/getImg?name=" + evalTeacher.name + '&' + "school=" + evalTeacher.school + '&' + "studentId=" + student_id;
                        } else {
                            alert("查无此学号");
                        }

                    },
                    error: function(xhr, type){
                        console.log(xhr);
                        alert('Ajax error!')
                    }
                });
            }
        }
    });

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8888/getEvalStudents',
        data: {
            school: evalTeacher.school,
            name: evalTeacher.name,
            teacherId: evalTeacher.teacherId
        },
        dataType: 'json',
        success: function(data){
            if (data != null) {
                evalStudent_vm._data.pics = data;
                alert('考核数据准备就绪，请开始！');
            }
        },
        error: function(xhr, type){
            console.log(xhr);
            alert('Ajax error!')
        }
    });

});