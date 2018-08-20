var t = function() {
    function l() {}
    var o = [], s = [];
    l.addEvent = function(d, e, t) {
        t = null == t ? 100 : t, o[d] || (o[d] = []);
        var i = l.getIndex(d, e);
        if (-1 != i) o[d][i].depth = t || i; else {
            var g = s.length ? s.shift() : new r();
            g.func = e, g.depth = t, o[d].push(g);
        }
        o[d].sort(a);
    }, l.removeEvent = function(n, e) {
        if (o[n] && o[n].length) {
            var t = l.getIndex(n, e);
            -1 != t && s.push(o[n].splice(t, 1));
        }
    }, l.dispatchEvent = function(n, e) {
        if (e = null == e ? null : e, o[n]) for (var t = o[n].length - 1; 0 <= t; t--) o[n] && o[n][t] && o[n][t].func.apply(null, e); else trace("[Warn] CBM没有对应的回调类型 - " + n);
    };
    var a = function(n, e) {
        return e.depth - n.depth;
    };
    return l.getIndex = function(n, e) {
        for (var t = 0, a = o[n].length; t < a; t++) if (e == o[n][t].func) return t;
        return -1;
    }, l;
}(), r = function() {
    this.func, this.depth;
};
module.exports = t;