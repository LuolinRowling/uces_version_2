Zepto(function($){

    if (localStorage.getItem('teacherInfo') == null) {
        alert('请先选择一名老师！');
        window.location.href = "./teacherInfo.html";
        return;
    }

    var teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));

    var studentInfo_vm = new Vue({
        el: '#studentInfo',
        data: {
            teacherInfo: teacherInfo,
            students: {}
        },
        methods: {

        }
    });

    $.ajax({
        type: 'POST',
        url: 'http://localhost:8888/getStudentInfo',
        data: {
            teacherId: teacherInfo.id,
            name: teacherInfo.name,
            school: teacherInfo.school
        },
        dataType: 'json',
        success: function(data){
            studentInfo_vm._data.students = data;
        },
        error: function(xhr, type){
            console.log(xhr);
            alert('Ajax error!')
        }
    });


    $('.js-back').on('click', function() {
        localStorage.removeItem('teacherInfo');
        window.location.href = './teacherInfo.html';
    });

    $('.js-excel').on('click', function() {
        if (studentInfo_vm._data.students.length > 0) {
            alert('请先清空数据再进行excel导入，避免重复！');
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8888/importExcel',
            data: {
                teacherInfo: JSON.stringify(teacherInfo)
            },
            dataType: 'json',
            success: function(data){
                console.log(data)
                if (data.isSuccess == true) {
                    alert("导入成功！");
                } else if (data.hasFile == false){
                    alert("未找到对应的Excel表格")
                } else {
                    alert("导入失败，请检查excel表中数据（是否有学号重复），清空后重试！")
                }
                window.location.href = './studentInfo.html';
            },
            error: function(xhr, type){
                console.log(xhr);
                alert('Ajax error!')
                window.location.href = "./studentInfo.html";
            }
        });
    });

    $('.js-clear').on('click', function() {
        if (studentInfo_vm._data.students.length <= 0) {
            alert('无数据需要清空');
            return;
        }

        var checkQuestion = confirm("确认清空吗？");
        if (checkQuestion == true) {
             $.ajax({
                type: 'POST',
                url: 'http://localhost:8888/clearStudentInfo',
                data: {
                    teacherId: teacherInfo.id
                },
                dataType: 'json',
                success: function(data){
                    if (data.isSuccess == true) {
                        alert('成功清空！');
                        window.location.href = './studentInfo.html';
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
    });

    $('.js-delete').on('click', function() {
        var checkboxs = $('.js-selectOne').filter(function() {
            return this.checked == true;
        })

        if (checkboxs.length <= 0) {
            alert("您未选中至少一个学生！");
            return;
        }

        var ids = [],
            data = {};

        checkboxs.each(function() {
            ids.push($(this).parents('tr').data('id'));
        });
        
        data.ids = JSON.stringify(ids);
        console.log(data)
        var checkQuestion = confirm("确认删除吗？");
        if (checkQuestion == true) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8888/deleteStudent',
                data: data,
                dataType: 'json',
                success: function(data){
                    if (data.isSuccess == true) {
                        alert('删除成功！');
                        window.location.href = './studentInfo.html';
                    } else {
                        alert('添加失败，请重试！');
                    }
                },
                error: function(xhr, type){
                    console.log(xhr);
                    alert('Ajax error!')
                }
            });
        }
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

    $('.js-addStudent').on('click', function() {
        $('.modal').removeClass('js-modify');
        $('.modal').show();
    });

    $('.js-edit').on('click', function() {
        var student = $('.js-selectOne').filter(function() {
            return this.checked == true;
        });

        if (student.length > 1) {
            alert('仅能选择一个！');
            return;
        }

        if (student.length < 1) {
            alert('请选择一个要编辑的学生。');
            return;
        }

        var student_id = student.parents('tr').find('.js-studentId').html().trim();

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8888/searchStudentById',
            data: {
                student_id: student_id
            },
            dataType: 'json',
            success: function(data){
                $('.modal').addClass('js-modify');
                //插入查找到的内容
                if (data.isSuccess == true) {
                    var student = data.result[0];
                    
                    $('.modal').attr('data-id', student.id);
                    
                    $('.js-studentId').val(student.student_id);
                    $('.js-dormId').val(student.dorm_id);
                    $('.js-studentName').val(student.student_name);
                    $('.js-class').val(student.class);
                    $('.js-major').val(student.major);
                    $('.js-origin').val(student.origin);
                    $('.js-party').val(student.party);
                    $('.js-study').val(student.study);
                    $('.js-family').val(student.family);
                    $('.js-isLeader').val(student.isleader);
                    $('.js-others').val(student.others);
                    $('.js-guidance').val(student.guidance);

                    //显示modal
                    $('.modal').show();

                } else {
                    alert('学生信息有误!');
                }
                
            },
            error: function(xhr, type){
                console.log(xhr);
                alert('Ajax error!')
            }
        }); 
    });

    $('.js-cancel').on('click', function() {
        $('.modal').removeClass('js-modify');
        clearModal();
        $('.modal').hide();
    });

    //清空模态框内容
    function clearModal() {
        $('.modal').attr('data-id', '');
                    
        $('.js-studentId').val('');
        $('.js-dormId').val('');
        $('.js-studentName').val('');
        $('.js-class').val('');
        $('.js-major').val('');
        $('.js-origin').val('');
        $('.js-party').val('');
        $('.js-study').val('');
        $('.js-family').val('');
        $('.js-isLeader').val('');
        $('.js-others').val('');
        $('.js-guidance').val('');
    }

    $('.js-submit').on('click', function() {
        var data = {
            student_id: $('.js-studentId').val(),
            dorm_id: $('.js-dormId').val(),
            student_name: $('.js-studentName').val(),
            class: $('.js-class').val(),
            major: $('.js-major').val(),
            origin: $('.js-origin').val(),
            party: $('.js-party').val(),
            study: $('.js-study').val(),
            family: $('.js-family').val(),
            isLeader: $('.js-isLeader').val(),
            others: $('.js-others').val(),
            guidance: $('.js-guidance').val(),
            teacher_id: teacherInfo.id
        }
        
        if (data.student_id == '' 
            || data.dorm_id == '' 
            || data.student_name == '' 
            || data.class == '' 
            || data.major == '' 
            || data.origin == ''
            || data.party == ''
            || data.family == ''
            || data.isLeader == ''
            || data.others == ''
            || data.guidance == '') {
                alert('输入信息不完全！');
                return;
            }
        if ($('.modal').hasClass('js-modify')) {
            //成功后移除
            data.id =  $('.modal').data('id');

            $.ajax({
                type: 'POST',
                url: 'http://localhost:8888/modifyStudent',
                data: data,
                dataType: 'json',
                success: function(data){
                    if (data.isSuccess == true) {
                        alert('修改成功！');
                        window.location.href = './studentInfo.html';
                    } else {
                        alert('修改失败，请重试！');
                    }
                },
                error: function(xhr, type){
                    console.log(xhr);
                    alert('Ajax error!')
                }
            });
            $('.modal').attr('data-id', '');

        } else {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8888/insertStudent',
                data: data,
                dataType: 'json',
                success: function(data){
                    if (data.isSuccess == true) {
                        alert('添加成功！');
                        window.location.href = './studentInfo.html';
                    } else {
                        alert('添加失败，请重试！');
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