Zepto(function($){
    var teacherSelect_vm;

    //进入teacherSelect页面
    if (location.href.indexOf('teacherSelect') != -1) {
        if (localStorage.getItem('schoolId') == null) {
            window.location.href = './schoolSelect.html';
            return;
        };

        localStorage.removeItem('evalTeacher');

        teacherSelect_vm = new Vue({
            el: '#teacherSelect',
            data: {
                teachers: []
            },
            methods: {
                evalTeacher: function(e) {
                    var teacher = $(e.target).parents('.school-item');
                    var obj = {
                        teacherId: teacher.data('id'),
                        school: teacher.data('school'),
                        name: teacher.find('.school-name').html().trim()
                    }
                    localStorage.setItem('evalTeacher', JSON.stringify(obj));
                    window.location.href = './evalStudent.html';
                }
            }
        }); 

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8888/getTeachersBySchoolId',
            data: {
                schoolId: localStorage.getItem('schoolId')
            },
            dataType: 'json',
            success: function(data){
                if (data.length > 0) {
                    teacherSelect_vm._data.teachers = data;
                } else {
                    alert("您选择的学院无需要考核的老师。");
                    window.location.href = './schoolSelect.html';   
                }
            },
            error: function(xhr, type){
                console.log(xhr);
                alert('Ajax error!')
            }
        });
    } else {
        //进入schoolSelect页面
        localStorage.removeItem('schoolId');
    }

    $('.js-back').on('click', function() {
        window.location.href = './chooseFunc.html';
    });

    $('.school-item').on('click', function() {
        var schoolId = $(this).data("schoolid");
        
        localStorage.setItem('schoolId', schoolId);
        window.location.href = './teacherSelect.html';   
    });

    $('.backToSelect').on('click', function() {
        window.location.href = './schoolSelect.html';   
    })


});