Zepto(function($){
    $('.js-info').on('click', function() {
        window.location.href = './teacherInfo.html';
    });

    $('.js-eval').on('click', function() {
        window.location.href = './schoolSelect.html';
    })

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
                    } else if (data.teacherSuccess == false) {
                        alert("教师重置失败");
                    } else {
                        alert("重置成功，请手动删除对应Excel及图片");
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