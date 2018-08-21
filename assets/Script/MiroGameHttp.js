module.exports = {
    get: function(data, arr) {
        var httpReq = new XMLHttpRequest();
        httpReq.onreadystatechange = function() {
            if (4 == httpReq.readyState && 200 <= httpReq.status && 400 > httpReq.status) {
                httpReq.responseText;
                try {
                    var res_txt = JSON.parse(httpReq.responseText);
                    arr && arr(res_txt);
                } catch (err) {
                    throw new Error("Error：\n" + err);
                }
            }
        };
        httpReq.open("GET", data, !0);
        httpReq.send();
    }
};
