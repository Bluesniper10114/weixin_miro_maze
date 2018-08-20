cc.Class({
    extends: cc.Component,
    properties: {
        gezi: cc.Prefab,
        bg: cc.Node,
        mapWidth: 20,
        gzarray: null
    },
    start: function() {
        this.gzarray = [];
    },
    opengezi: function(t) {
        t.node.getChildByName("bg").active = !1, t.zt = 1;
    },
    hideline: function(n, e) {
        n.node.getChildByName(e).active = !1;
    },
    step1: function() {
        this.bg.destroyAllChildren(), this.gzarray = [];
        for (var a = 0; a < this.mapWidth; a++) {
            this.gzarray.push([]);
            for (var e, o = 0; o < this.mapWidth; o++) e = cc.instantiate(this.gezi), e.active = !0, 
            this.bg.addChild(e), this.gzarray[a].push({
                node: e,
                zt: 0,
                zhouwei: [],
                col: o,
                id: a + "" + o
            });
        }
        for (var s = 0; s < this.mapWidth; s++) for (var r = 0; r < this.mapWidth; r++) 0 < s && this.gzarray[s][r].zhouwei.push({
            wz: "up",
            gz: this.gzarray[s - 1][r],
            wz2: "bottom"
        }), s < this.mapWidth - 1 && this.gzarray[s][r].zhouwei.push({
            wz: "bottom",
            gz: this.gzarray[s + 1][r],
            wz2: "up"
        }), 0 < r && this.gzarray[s][r].zhouwei.push({
            wz: "left",
            gz: this.gzarray[s][r - 1],
            wz2: "right"
        }), r < this.mapWidth - 1 && this.gzarray[s][r].zhouwei.push({
            wz: "right",
            gz: this.gzarray[s][r + 1],
            wz2: "left"
        });
    },
    setp2: function() {
        var n = [];
        n.push(this.gzarray[9][0]), this.opengezi(n[0]), this.hideline(n[0], "left");
        for (var e = 0; ;) {
            for (var t, a = n[n.length - 1]; ;) {
                if (t = Math.floor(Math.random() * a.zhouwei.length), 0 == a.zhouwei[t].gz.zt) {
                    this.opengezi(a.zhouwei[t].gz), this.hideline(a, a.zhouwei[t].wz), this.hideline(a.zhouwei[t].gz, a.zhouwei[t].wz2), 
                    n.push(a.zhouwei[t].gz);
                    break;
                }
                if (a.zhouwei.splice(t, 1), 0 == a.zhouwei.length) {
                    n.pop();
                    break;
                }
            }
            if (60 <= ++e && n[n.length - 1].col == this.mapWidth - 1) {
                this.hideline(n[n.length - 1], "right");
                break;
            }
        }
    },
    setp3: function() {
        for (var a = 0; a < this.mapWidth; a++) for (var e = 0; e < this.mapWidth; e++) if (0 == this.gzarray[a][e].zt) for (var t, o = [ this.gzarray[a][e] ], i = [ this.gzarray[a][e].id ], r = !0; 0 != o.length && (t = o[o.length - 1], 
        1 != t.zt || 0 != r); ) for (this.opengezi(t); ;) {
            if (0 == t.zhouwei.length) {
                o.pop(), r = !0;
                break;
            }
            var n = Math.floor(Math.random() * t.zhouwei.length);
            if (!(0 <= i.indexOf(t.zhouwei[n].gz.id))) {
                r = !1, this.hideline(t, t.zhouwei[n].wz), this.hideline(t.zhouwei[n].gz, t.zhouwei[n].wz2), 
                o.push(t.zhouwei[n].gz), i.push(t.zhouwei[n].gz.id);
                break;
            }
            t.zhouwei.splice(n, 1);
        }
    }
})