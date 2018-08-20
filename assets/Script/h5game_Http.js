module.exports = {
    get: function(n, a) {
        var t = new XMLHttpRequest();
        t.onreadystatechange = function() {
            if (4 == t.readyState && 200 <= t.status && 400 > t.status) {
                t.responseText;
                try {
                    var n = JSON.parse(t.responseText);
                    a && a(n);
                } catch (t) {
                    throw new Error("获取服务器地址时发生错误，请尝试重新登录游戏  详细信息：\n" + t);
                }
            }
        }, t.open("GET", n, !0), t.send();
    }
}