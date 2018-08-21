function i(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}
function n(e) {
    console.log(e);
    var n = 0;
    (function a() {
        wx.request({
            url: "https://h5game-log.kuaiyugo.com/dataAnalysis/saveUserBehaviorLog",
            data: e,
            method: "POST",
            header: {
                "content-type": "application/json"
            },
            success: function() {},
            fail: function() {
                2 > n && (n++, e.retryTimes = n, a());
            }
        });
    })();
}
function l(n) {
    try {
        var a = function(n) {
            try {
                if ("sign_in" == n) return wx.setStorageSync("regtime", new Date().getTime()), 0;
                var e = wx.getStorageSync("regtime");
                return ((new Date().getTime() - e) / 1e3 / 60 / 60 / 24).toFixed(0);
            } catch (t) {
                console.log(t);
            }
        }(n);
        return {
            appKey: v.default.appKey,
            channelCode: wx.getStorageSync("channelCode") || "",
            channelId: wx.getStorageSync("channelId") || "",
            createDateTime: new Date().getTime(),
            path: "",
            query: {},
            retain: a,
            shareId: wx.getStorageSync("shareId") || "",
            scene: "",
            type: n,
            userId: wx.getStorageSync("userId")
        };
    } catch (t) {
        console.log(t);
    }
}
function c(a, o, s) {
    try {
        return new Promise(function(n, t) {
            wx.request({
                url: v.default.api + s,
                data: a,
                method: o,
                header: {
                    "content-type": "application/json"
                },
                success: function(t) {
                    n(t);
                },
                fail: function(n) {
                    t(n);
                }
            });
        });
    } catch (t) {
        console.log(t);
    }
}
function u(t) {
    return console.log(t), {
        code: -10110,
        data: t,
        msg: "request fail"
    };
}
function g(t) {
    return console.log(t), {
        code: -10111,
        data: "",
        msg: t
    };
}
function d(a, n, o) {
    try {
        wx.login({
            success: function(s) {
                var e = s.code, l = {
                    appId: v.default.appId,
                    code: e
                };
                if (1 == b(l)) c(l, "POST", "user/standAloneLogin").then(function(i) {
                    if (console.log(i, "登录信息"), 0 == i.data.code) try {
                        var e = i.data.data.openId;
                        console.log("获取" + e), wx.setStorageSync("userId", e), y(a, n, o);
                    } catch (t) {
                        Math.log(a, n, o);
                    } else p(a, n, o);
                }).catch(function() {
                    Math.log(a, n, o);
                }); else {
                    var i = g("前端检查参数不正确" + JSON.stringify(l));
                    o(i);
                }
            },
            fail: function() {
                console.log("微信Login失败"), Math.log(a, n, o);
            }
        });
    } catch (t) {
        console.log(t), wx.hideLoading();
    }
}
function p(e, t, n) {
    try {
        2 == (o += 1) && (wx.hideLoading(), wx.showLoading({
            title: "登录中...",
            mask: !1
        })), 4 > o ? E(e, t, n) : (wx.hideLoading(), wx.showModal({
            title: "提示",
            content: "网络异常，是否重新登录",
            showCancel: !1,
            success: function(a) {
                if (a.confirm) try {
                    wx.showLoading({
                        title: "登录中...",
                        mask: !1
                    }), E(e, t, n);
                } catch (a) {
                    wx.showLoading({
                        title: "登录中...",
                        mask: !1
                    }), E(e, t, n);
                }
            },
            fail: function() {
                E(e, t, n);
            }
        }));
    } catch (t) {
        console.log(t);
    }
}
function E(n, e, t) {
    try {
        setTimeout(function() {
            32e3 < (f *= 2) && (f = 32e3), d(n, e, t);
        }, f);
    } catch (t) {
        console.log(t);
    }
}
function y(a, e) {
    try {
        var t = l("login_in");
        t.query = a.query, function(t) {
            try {
                if (!wx.navigateToMiniProgram) return;
                (t.query.goto || t.referrerInfo) && c("", "GET", "game/getGotoConfig?id=" + (t.query.goto || t.referrerInfo.extraData.goto)).then(function(n) {
                    var e = n.data.data;
                    if (e.is_open) {
                        var t = e.appid, a = e.next_id;
                        wx.navigateToMiniProgram({
                            appId: t,
                            envVersion: "release",
                            extraData: {
                                goto: a
                            },
                            success: function(t) {
                                console.log(t);
                            }
                        });
                    }
                }).catch(function(t) {
                    console.log(t);
                });
            } catch (t) {
                console.log(t);
            }
        }(a), a.query.channelId && (t.channelId = a.query.channelId);
        try {
            wx.setStorageSync("channelId", t.channelId);
        } catch (n) {
            wx.setStorageSync("channelId", t.channelId);
        }
        a.query.channelCode && (t.channelCode = a.query.channelCode);
        try {
            wx.setStorageSync("channelCode", t.channelCode);
        } catch (n) {
            wx.setStorageSync("channelCode", t.channelCode);
        }
        a.query.shareId && (t.shareId = a.query.shareId);
        try {
            wx.setStorageSync("shareId", t.shareId);
        } catch (n) {
            wx.setStorageSync("shareId", t.shareId);
        }
        a.scene && (t.scene = a.scene), e({
            data: "success"
        }), wx.hideLoading(), n({
            userLog: JSON.stringify(t)
        });
    } catch (t) {
        wx.hideLoading(), console.log(t);
    }
}
function b(n) {
    for (var e in console.log(n), n) if (null == n[e] || "" == n[e] || "undefined" == n[e]) return -1;
    return 1;
}

exports.default = void 0;

var S = function() {
    function n(n, e) {
        for (var t, a = 0; a < e.length; a++) t = e[a], t.enumerable = t.enumerable || !1, 
        t.configurable = !0, "value" in t && (t.writable = !0), Object.defineProperty(n, t.key, t);
    }
    return function(a, e, t) {
        return e && n(a.prototype, e), t && n(a, t), a;
    };
}(), 
v = i(require("./dataStatistics.config.js")), 
r = i(require("./EChannelPrefix")), 
f = 1e3, 
o = 0, 
s = function() {
    function t() {
        (function(n, e) {
            if (!(n instanceof e)) throw new TypeError("Cannot call a class as a function");
        })(this, t);
    }
    return S(t, null, [ {
        key: "shareAppMsg",
        value: function(a) {
            try {
                var e = l("share");
                e.shareId = e.userId, a.query && "" != a.query ? a.query += "&shareId=" + e.shareId + "&channelCode=" + e.channelCode : a.query = "shareId=" + e.shareId + "&channelCode=" + e.channelCode, 
                console.log(a, "options"), wx.shareAppMessage(a), n({
                    userLog: JSON.stringify(e)
                });
            } catch (t) {}
        }
    }, {
        key: "onShareAppMsg",
        value: function(a) {
            try {
                var e = l("share");
                return e.query = a.query, e.shareId = e.userId, e.channelCode = wx.getStorageSync("passivechannelcode"), 
                a.query && "" != a.query ? a.query += "&shareId=" + e.shareId + "&channelCode=" + e.channelCode : a.query = "shareId=" + e.shareId + "&channelCode=" + e.channelCode, 
                n({
                    userLog: JSON.stringify(e)
                }), console.log(a, "options"), a;
            } catch (t) {
                console.log(t);
            }
        }
    }, {
        key: "shareSuccess",
        value: function(a) {
            try {
                var e = l("sharesuccess");
                if ("initiative" == a) try {
                    e.channelCode = wx.getStorageSync("channelCode");
                } catch (t) {
                    e.channelCode = wx.getStorageSync("channelCode");
                } else try {
                    e.channelCode = wx.getStorageSync("passivechannelcode");
                } catch (t) {
                    e.channelCode = wx.getStorageSync("passivechannelcode");
                }
                e.shareId = e.userId, n({
                    userLog: JSON.stringify(e)
                });
            } catch (t) {
                console.log(t);
            }
        }
    }, {
        key: "onShowInfo",
        value: function(a, e, t) {
            var i = e || function() {}, r = t || function() {};
            try {
                if (wx.navigateToMiniProgram) {
                    y(a, i, r);
                    var n = function() {
                        try {
                            var t = "" + Date.now() + Math.floor(1e7 * Math.random());
                            return t;
                        } catch (t) {
                            console.log(t);
                        }
                    }();
                    wx.setStorageSync("userId", n);
                } else "" == wx.getStorageSync("userId") || null == wx.getStorageSync("userId") ? function n(e, t, a) {
                    try {
                        wx.showLoading({
                            title: "登录中...",
                            mask: !0,
                            success: function() {
                                d(e, t, a);
                            },
                            fail: function() {
                                n(e, t, a);
                            }
                        });
                    } catch (t) {
                        console.log(t);
                    }
                }(a, i, r) : y(a, i, r);
            } catch (t) {
                console.log(t);
            }
        }
    }, {
        key: "onHideInfo",
        value: function() {
            try {
                var t = l("login_out");
                n({
                    userLog: JSON.stringify(t)
                });
            } catch (t) {
                console.log(t);
            }
        }
    }, {
        key: "getShareInfo",
        value: function(l, d, t) {
            try {
                var i = d || function() {}, f = t || function() {}, p = {
                    channelPrefix: l,
                    appKey: v.default.appKey
                };
                if (1 == b(p)) (s = l, new Promise(function(n, a) {
                    wx.request({
                        url: v.default.api + "backendManager/getMaterialInfoByAppkey?channelPrefix=" + s + "&appKey=" + v.default.appKey,
                        method: "GET",
                        header: {
                            "content-type": "application/json"
                        },
                        success: function(a) {
                            console.log(a, "服务器返回分享信息");
                            var e = "";
                            try {
                                e = wx.getStorageSync("channelId");
                            } catch (t) {
                                e = wx.getStorageSync("channelId");
                            }
                            if (a.data.data.channel_code) {
                                var t = a.data.data.channel_code + "-" + e;
                                if (s == r.default.regular) try {
                                    wx.setStorageSync("passivechannelcode", t);
                                } catch (n) {
                                    wx.setStorageSync("passivechannelcode", t);
                                } else wx.setStorageSync("channelCode", t);
                            }
                            n(a);
                        },
                        fail: function(t) {
                            a(t);
                        }
                    });
                })).then(function(t) {
                    "function" == typeof i && i(t);
                }).catch(function(a) {
                    var e = u(a);
                    "function" == typeof f && f(e);
                }); else {
                    var o = g("前端检查参数不正确" + JSON.stringify(p));
                    f(o);
                }
            } catch (t) {
                console.log(t);
            }
            var s;
        }
    }, {
        key: "setKVUserData",
        value: function(a, l, t) {
            try {
                var i = {
                    appKey: v.default.appKey,
                    user: wx.getStorageSync("userId"),
                    value: a
                }, r = l || function() {}, d = t || function() {};
                if (1 == b(i)) c(i, "POST", "game/setKVUserData").then(function(t) {
                    console.log(t), "function" == typeof r && r(t);
                }).catch(function(n) {
                    console.log(n);
                    var e = u(n);
                    "function" == typeof d && d(e);
                }); else {
                    var f = g("前端检查参数不正确" + JSON.stringify(i));
                    d(f);
                }
            } catch (t) {
                console.log(t);
            }
        }
    }, {
        key: "getKVUserData",
        value: function(a, e) {
            try {
                var t = a || function() {}, l = e || function() {}, d = wx.getStorageSync("userId"), f = {
                    appKey: v.default.appKey,
                    user: d
                };
                if (1 == b(f)) c("", "GET", "game/getKVUserData?appKey=" + v.default.appKey + "&user=" + d).then(function(n) {
                    console.log(n), "function" == typeof t && t(n);
                }).catch(function(n) {
                    var e = u(n);
                    "function" == typeof l && l(e);
                }); else {
                    var o = g("前端检查参数不正确" + JSON.stringify(f));
                    l(o);
                }
            } catch (t) {
                console.log(t);
            }
        }
    }, {
        key: "getGameConfigByAppkey",
        value: function(a, e) {
            try {
                var t = a || function() {}, o = e || function() {};
                if ("" == v.default.appKey || null == v.default.appKey) {
                    var s = g("前端检查参数不正确appkey=" + v.default.appKey);
                    o(s);
                } else c("", "GET", "game/getGameConfigByAppkey?appKey=" + v.default.appKey).then(function(n) {
                    console.log(n), "function" == typeof t && t(n);
                }).catch(function(n) {
                    var e = u(n);
                    "function" == typeof o && o(e);
                });
            } catch (t) {
                console.log(t);
            }
        }
    } ]), t;
}();
export default s;