Zepto(function($){

    window.G = window.G || {};
    
    var vm = new Vue({
        el: '#login',
        data: {

        }
    });

    $('.js-login').on('click', function(e) {
        var username = $('.js-username').val();
        var password = $('.js-password').val();

        if (username == '' || password == '') {
            alert("请输入用户名和密码");
            return;
        }

        $.ajax({
            type: 'POST',
            url: 'http://localhost:8888/login',
            // data to be added to query string:
            data: { 
                username: username,
                password: password
            },
            // type of data we are expecting in return:
            dataType: 'json',
            // jsonp: "jsoncallback",
            // context: $('body'),
            success: function(data){
                
                if (data.isSuccess == "true") {
                    var _date = new Date();
                    _date.setDate(_date.getDate() + 1);
                    _date.toGMTString();
                    document.cookie = "username=" + username + ";expires=" + _date;
                    window.location.href = "./chooseFunc.html";
                } else {
                    alert("用户名或密码输入错误");
                }
            },
            error: function(xhr, type){
                console.log(xhr);
                alert('Ajax error!')
            }
        });
    })
});

