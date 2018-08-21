var t, l = require("./dataStatistics"), 
d = (t = l) && t.__esModule ? t : {
    default: t
};
window.EChannelPrefix = require("EChannelPrefix");
var n = function() {
    wx.showToast({
        title: "联网超时",
        icon: "none",
        image: "",
        duration: 0
    }), setTimeout(function() {
        return wx.hideToast();
    }, 2e3);
};
if ("undefined" != typeof wx) {
    wx.showShareMenu({
        withShareTicket: !0
    });
    var a = null;
    d.default.getShareInfo(EChannelPrefix.regular, function(t) {
        return a = t;
    }, n), wx.onShareAppMessage(function() {
        if (a) try {
            return d.default.onShareAppMsg({
                title: a.data.data.title,
                imageUrl: a.data.data.image,
                success: function(t) {
                    console.log("被动转发  成功：", t);
                },
                complet: function(t) {
                    console.log("被动转发完成：", t);
                }
            });
        } catch (t) {
            throw new Error("未能成功获得有效的分享信息    详细信息：", t);
        } else n();
    });
}
module.exports = {
    onShow: function(t) {
        d.default.onShowInfo(t, function() {
            console.log("success");
        }, function() {
            console.log("fail");
        });
    },
    onHide: function() {
        d.default.onHideInfo();
    },
    share: function(a, s, e, t, i, r) {
        d.default.getShareInfo(a, function(n) {
            console.log("getShareInfo 返回：", n), d.default.shareAppMsg({
                title: n.data.data.title,
                imageUrl: n.data.data.image,
                query: s || "",
                success: function(n) {
                    d.default.shareSuccess(EChannelPrefix.invitation), t && t(n);
                },
                fail: i || null,
                complete: r || null
            });
        }, function() {
            n(), e && e();
        });
    }
}