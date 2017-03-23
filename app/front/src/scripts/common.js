function load() {
    if (document.cookie.length < 0) {
        alert("您未登录");
        window.location.href = "./index.html";
        return;
    }

    var index = document.cookie.indexOf("username=");
    
    if (index == -1) {
        alert("您未登录");
        window.location.href = "./index.html";
        return;
    }
}