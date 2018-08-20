(function(n) {
    var o, t, i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t;
    } : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
    };
    o = "undefined" == typeof self ? "undefined" == typeof window ? void 0 === n ? void 0 : n : window : self, 
    t = function(b) {
        var t, i = b.Base64;
        if (void 0 !== module && module.exports) try {
            t = require("buffer").Buffer;
        } catch (t) {}
        var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", S = function(n) {
            for (var e = {}, t = 0, a = n.length; t < a; t++) e[n.charAt(t)] = t;
            return e;
        }(r), o = String.fromCharCode, n = function(n) {
            if (2 > n.length) return 128 > (e = n.charCodeAt(0)) ? n : 2048 > e ? o(192 | e >>> 6) + o(128 | 63 & e) : o(224 | 15 & e >>> 12) + o(128 | 63 & e >>> 6) + o(128 | 63 & e);
            var e = 65536 + 1024 * (n.charCodeAt(0) - 55296) + (n.charCodeAt(1) - 56320);
            return o(240 | 7 & e >>> 18) + o(128 | 63 & e >>> 12) + o(128 | 63 & e >>> 6) + o(128 | 63 & e);
        }, a = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, s = function(t) {
            return t.replace(a, n);
        }, f = function(n) {
            var e = [ 0, 2, 1 ][n.length % 3], t = n.charCodeAt(0) << 16 | (1 < n.length ? n.charCodeAt(1) : 0) << 8 | (2 < n.length ? n.charCodeAt(2) : 0);
            return [ r.charAt(t >>> 18), r.charAt(63 & t >>> 12), 2 <= e ? "=" : r.charAt(63 & t >>> 6), 1 <= e ? "=" : r.charAt(63 & t) ].join("");
        }, l = b.btoa ? function(t) {
            return b.btoa(t);
        } : function(t) {
            return t.replace(/[\s\S]{1,3}/g, f);
        }, T = t ? t.from && Uint8Array && t.from !== Uint8Array.from ? function(n) {
            return (n.constructor === t.constructor ? n : t.from(n)).toString("base64");
        } : function(n) {
            return (n.constructor === t.constructor ? n : new t(n)).toString("base64");
        } : function(t) {
            return l(s(t));
        }, u = function(n, e) {
            return e ? T(n + "").replace(/[+\/]/g, function(t) {
                return "+" == t ? "-" : "_";
            }).replace(/=/g, "") : T(n + "");
        }, R = new RegExp("[À-ß][-¿]|[à-ï][-¿]{2}|[ð-÷][-¿]{3}", "g"), d = function(n) {
            switch (n.length) {
              case 4:
                var e = ((7 & n.charCodeAt(0)) << 18 | (63 & n.charCodeAt(1)) << 12 | (63 & n.charCodeAt(2)) << 6 | 63 & n.charCodeAt(3)) - 65536;
                return o(55296 + (e >>> 10)) + o(56320 + (1023 & e));

              case 3:
                return o((15 & n.charCodeAt(0)) << 12 | (63 & n.charCodeAt(1)) << 6 | 63 & n.charCodeAt(2));

              default:
                return o((31 & n.charCodeAt(0)) << 6 | 63 & n.charCodeAt(1));
            }
        }, p = function(t) {
            return t.replace(R, d);
        }, A = function(a) {
            var e = a.length, t = (0 < e ? S[a.charAt(0)] << 18 : 0) | (1 < e ? S[a.charAt(1)] << 12 : 0) | (2 < e ? S[a.charAt(2)] << 6 : 0) | (3 < e ? S[a.charAt(3)] : 0), i = [ o(t >>> 16), o(255 & t >>> 8), o(255 & t) ];
            return i.length -= [ 0, 0, 2, 1 ][e % 4], i.join("");
        }, y = b.atob ? function(t) {
            return b.atob(t);
        } : function(t) {
            return t.replace(/[\s\S]{1,4}/g, A);
        }, P = t ? t.from && Uint8Array && t.from !== Uint8Array.from ? function(n) {
            return (n.constructor === t.constructor ? n : t.from(n, "base64")).toString();
        } : function(n) {
            return (n.constructor === t.constructor ? n : new t(n, "base64")).toString();
        } : function(t) {
            return p(y(t));
        }, w = function(t) {
            return P((t + "").replace(/[-_]/g, function(t) {
                return "-" == t ? "+" : "/";
            }).replace(/[^A-Za-z0-9\+\/]/g, ""));
        };
        if (b.Base64 = {
            VERSION: "2.4.3",
            atob: y,
            btoa: l,
            fromBase64: w,
            toBase64: u,
            utob: s,
            encode: u,
            encodeURI: function(t) {
                return u(t, !0);
            },
            btou: p,
            decode: w,
            noConflict: function() {
                var t = b.Base64;
                return b.Base64 = i, t;
            }
        }, "function" == typeof Object.defineProperty) {
            var M = function(t) {
                return {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                };
            };
            b.Base64.extendString = function() {
                Object.defineProperty(String.prototype, "fromBase64", M(function() {
                    return w(this);
                })), Object.defineProperty(String.prototype, "toBase64", M(function(t) {
                    return u(this, t);
                })), Object.defineProperty(String.prototype, "toBase64URI", M(function() {
                    return u(this, !0);
                }));
            };
        }
        return b.Meteor && (Base64 = b.Base64), void 0 !== module && module.exports ? module.exports.Base64 = b.Base64 : "function" == typeof define && define.amd && define([], function() {
            return b.Base64;
        }), {
            Base64: b.Base64
        };
    }, "object" === (void 0 === exports ? "undefined" : i(exports)) && void 0 !== module ? module.exports = t(o) : "function" == typeof define && define.amd ? define(t) : t(o);
}).call(this, "undefined" == typeof global ? "undefined" == typeof self ? "undefined" == typeof window ? {} : window : self : global);