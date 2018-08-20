cc.Class({
    extends: cc.Component,
    properties: {
        _aMap: null,
        _player: null,
        _iMapCols: 0,
        _iMapRows: 0,
        _node: null,
        _IQ: 5
    },
    init: function(n, e, t) {
        switch (this._aMap = n, this._player = e, t) {
          case 1:
            this._IQ = 5;
            break;

          case 3:
            this._IQ = 9;
            break;

          default:
            this._IQ = 7;
        }
        this._iMapRows = this._aMap.length, this._iMapCols = this._aMap[0].length, this._IQ = Math.floor(13 * Math.random() + 1),
        this._player.route || (e.route = [], e.exclude = []);
    },
    thinkMove: function(a, e) {
        if (0 > a.route.indexOf(e)) return null;
        var o = null, s = null;
        if ("left" === e ? (o = this._aMap[a.row][a.col - 1], s = "right") : "right" === e ? (o = this._aMap[a.row][a.col + 1],
        s = "left") : "up" === e ? (o = this._aMap[a.row - 1][a.col], s = "bottom") : "bottom" === e ? (o = this._aMap[a.row + 1][a.col],
        s = "up") : void 0, null == o) return null;
        if (2 == o.route.length && "180" != o.id) {
            var r = o.route.concat();
            return r.splice(r.indexOf(s), 1), this.thinkMove(o, r[0]);
        }
        return {
            cell: o,
            orientation: e
        };
    },
    autoPlay: function() {
        if (!cc.miroGame.b_isAI) return null;
        var l = this._player;
        if (l.canmove) {
            this._IQ = 13 < this._IQ ? 13 : this._IQ;
            var t = Math.floor(3 * Math.random() + 1) * (1500 - 100 * this._IQ), a = this;
            setTimeout(function() {
                if (null != l.cell) {
                    var n = "";
                    0 < l.route.length && (n = l.route[l.route.length - 1].last);
                    var e = function d(e, t, i) {
                        t = a.getContraryOrientation(t);
                        for (var r, o = e.route.concat(); 0 < o.length; ) {
                            if (r = Math.floor(Math.random() * o.length), t != o[r]) {
                                var n;
                                if (null == (n = a.thinkMove(e, o[r])) || 0 <= l.exclude.indexOf(n.cell.id) || "180" != n.cell.id && 2 > n.cell.route.length) {
                                    o.splice(r, 1);
                                    continue;
                                }
                                if (++i >= a._IQ || "180" == n.cell.id) return {
                                    orientation: o[r],
                                    last: n.orientation
                                };
                                if (null != d(n.cell, n.orientation, i)) return {
                                    orientation: o[r],
                                    last: n.orientation
                                };
                            }
                            o.splice(r, 1);
                        }
                        return null;
                    }(l.cell, n, 0);
                    if (null != e) l.route.push({
                        cell: l.cell,
                        orientation: e.orientation,
                        last: e.last
                    }), cc.miroGame.that.node.emit("movePlayer2", e.orientation); else {
                        var t = l.route.pop();
                        l.exclude.push(l.cell.id), cc.miroGame.that.node.emit("movePlayer2", a.getContraryOrientation(t.last));
                    }
                }
                null != l.cell && "180" == l.cell.id || a.autoPlay();
            }, t);
        }
    },
    getContraryOrientation: function(t) {
        return "left" === t ? "right" : "right" === t ? "left" : "up" === t ? "bottom" : "bottom" === t ? "up" : "";
    }
})
