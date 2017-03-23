Zepto(function($){
    
    localStorage.removeItem('teacherInfo');

    var teacherInfo_vm = new Vue({
        el: '#teacherInfo',
        data: {
            teachers: {}
        },
        methods: {
            input: function(e) {
                var teacher = $(e.target).parents('tr');
                var obj = {
                    id: teacher.data('id'),
                    name: teacher.find('.js-name').html(),
                    school: teacher.find('.js-school').html()
                };

                localStorage.setItem('teacherInfo', JSON.stringify(obj));
                window.location.href = './studentInfo.html';
            },
            clear: function(e) {
                var teacher = $(e.target).parents('tr');

                var checkQuestion = confirm("确认清空吗？");
                if (checkQuestion == true) {
                    $.ajax({
                        type: 'POST',
                        url: 'http://localhost:8888/clearStudentInfo',
                        data: {
                            teacherId: teacher.data('id')
                        },
                        dataType: 'json',
                        success: function(data){
                            if (data.isSuccess == true) {
                                alert('成功清空！');
                                window.location.href = './teacherInfo.html';
                            } else {
                                alert('清空失败，请重试！');
                            }
                        },
                        error: function(xhr, type){
                            console.log(xhr);
                            alert('Ajax error!')
                        }
                    });
                } else {

                }
            }
        }
    });

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8888/getTeacherInfo',
        data: { 
        },
        dataType: 'json',
        success: function(data){
            console.log(data)
            teacherInfo_vm._data.teachers = data;
        },
        error: function(xhr, type){
            console.log(xhr);
            alert('Ajax error!')
        }
    });

    $('.js-function').on('click', function() {
        window.location.href = './chooseFunc.html';
    });

    $('.js-addTeacher').on('click', function() {
        $('.modal').show();
    });

    $('.js-cancel').on('click', function() {
        $('.modal').hide();
    });

    $('.js-submit').on('click', function() {
        var data = {
            name: $('.teacher_name').val(),
            school: $('.school_name').val()
        }
     
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8888/insertTeacher',
            data: data,
            dataType: 'json',
            success: function(data){
                if (data.isSuccess == true) {
                    alert('添加成功！');
                    window.location.href = './teacherInfo.html';
                } else if (data.validSchool == false){
                    alert("学院输入有误，请重试。");
                } else {
                    alert("添加失败，请重试。");
                }
            },
            error: function(xhr, type){
                console.log(xhr);
                alert('Ajax error!')
            }
        });

    });

    $('.js-selectAll').on('click', function() {
        if ($(this).hasClass('js-all')) {
            $('.js-selectOne').each(function() {
                this.checked = false;
            });
            $(this).removeClass('js-all');
        } else {
            $('.js-selectOne').each(function() {
                this.checked = true;
            });
            $(this).addClass('js-all');
        }
    });

    $('.js-delete').on('click', function() {
        var teachers = $('.js-selectOne').filter(function() {
            return this.checked == true;
        }).parents('tr');

        if (teachers.length <= 0) {
            alert("您未选中至少一个老师。");
            return;
        }

        var checkQuestion = confirm("确认删除吗？");
        if (checkQuestion == true) {
            var data = {
                teachers: []
            };

            teachers.each(function() {
                var teacher = $(this);
                var obj = {
                    id: teacher.data('id'),
                    school: teacher.find('.js-school').html(),
                    name: teacher.find('.js-name').html()
                }
                data.teachers.push(obj);
            });

            data.teachers = JSON.stringify(data.teachers);
            console.log(data);

            $.ajax({
                type: 'POST',
                url: 'http://localhost:8888/deleteTeacher',
                data: data,
                dataType: 'json',
                success: function(data){
                    if (data.isSuccess == true) {
                        alert('删除成功！');
                        window.location.href = './teacherInfo.html';
                    } else {
                        alert('删除失败，请重试。');
                    }
                },
                error: function(xhr, type){
                    console.log(xhr);
                    alert('Ajax error!')
                }
            });
            
        } else {
            return;
        }
    });

    $('.js-reboot').on('click', function() {
        var checkQuestion = confirm("确认重置吗？");

        if (checkQuestion == true) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8888/reboot',
                dataType: 'json',
                success: function(data){
                    if (data.studentSuccess == false) {
                        alert("学生重置失败");
                        window.location.href = './teacherInfo.html';
                    } else if (data.teacherSuccess == false) {
                        alert("教师重置失败");
                        window.location.href = './teacherInfo.html';
                    } else {
                        alert("重置成功，请手动删除对应Excel及图片");
                        window.location.href = './chooseFunc.html';
                    }
                },
                error: function(xhr, type){
                    console.log(xhr);
                    alert('Ajax error!')
                }
            });
        }
    })

});