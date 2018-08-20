cc.Class({
    extends: cc.Component,
    properties: {
        _timeLabel: cc.Node
    },
    statics: {
        instance: null
    },
    onLoad: function() {
        CommonUI.instance = this;
    },
    start: function() {
        var t = this;
        this._setWidgetTarget(), this._getChildPath("gameStopBg").on(cc.Node.EventType.TOUCH_START, this._playBtnSound, this), 
        this._initUI(), this.showHelp(!0), this.scheduleOnce(function() {
            t.showHelp(!1), t.showReadyGoAnim();
        }, 3);
    },
    _playBtnSound: function() {
        var t = cc.url.raw("resources/MazeGame/sounds/start.mp3");
        cc.audioEngine.play(t, !1, 1), this._getChildPath("gameStopBg").off(cc.Node.EventType.TOUCH_START, this._playBtnSound, this), 
        this.showHelp(!1), console.log("播放声音");
    },
    _initUI: function() {
        // this.node.children.forEach(function(t) {
        //     return t.active = !1;
        // }), 
        this.node.getChildByName("bottomlogo").active = !0, this.node.getChildByName("toplogo").active = !0, 
        this.topUI = this.node.getChildByName("topUI"), this.topUI.active = !0, this._getChildPath("topUI/scoring1").active = !1, 
        this._getChildPath("topUI/score_heart").active = !1, this._getChildPath("topUI/score_texts").active = !1;
    },
    _setWidgetTarget: function() {
        var n = this.node.getComponentsInChildren(cc.Widget), a = cc.director.getScene().getComponentInChildren(cc.Canvas).node;
        n.forEach(function(t) {
            return t.target = a;
        });
    },
    setSelfInfo: function(a, e) {
        var t = this._getChildPath("topUI/player1");
        if (t.active = !0, this._getChildPath("man", t).active = 1 == e, this._getChildPath("female", t).active = 2 == e, 
        a) {
            var i = this;
            cc.loader.load(a, function(n, e) {
                n ? cc.error(n.message || n) : i._getChildPath("topUI/player1/head/headpic").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e);
            });
        }
    },
    setEnemyInfo: function(a, e) {
        var i = this._getChildPath("topUI/player2");
        if (i.active = !0, this._getChildPath("man", i).active = 1 == e, this._getChildPath("female", i).active = 2 == e, 
        a) {
            var r = this;
            cc.loader.load(a, function(n, e) {
                n ? cc.error(n.message || n) : r._getChildPath("head/headpic", i).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e);
            });
        }
    },
    setMyLife: function(n) {
        0 > n && (n = 0);
        var e = this._getChildPath("topUI/scoring1");
        e.active = !0, this._getChildPath("myProgress", e).getComponent(cc.ProgressBar).progress = n, 
        (e = this._getChildPath("topUI/score_texts")).active = !0, this._getChildPath("text1", e).getComponent(cc.Label).string = 100 * n >> 0;
    },
    setEnemyLife: function(n) {
        0 > n && (n = 0);
        var e = this._getChildPath("topUI/scoring1");
        e.active = !0, this._getChildPath("enemyProgress", e).getComponent(cc.ProgressBar).progress = n, 
        (e = this._getChildPath("topUI/score_texts")).active = !0, this._getChildPath("text2", e).getComponent(cc.Label).string = 100 * n >> 0;
    },
    setMyHearts: function(n) {
        var t = this._getChildPath("topUI/score_heart");
        t.active = !0;
        var e = t.getChildByName("myhearts").children;
        if (n > e.length) throw new Error("数值错误：count:" + n);
        e.forEach(function(t) {
            return t.active = parseInt(t.name) < n;
        }), this._getChildPath("myProgress", t).getComponent(cc.ProgressBar).progress = n / e.length;
    },
    setEnemyHearts: function(n) {
        var t = this._getChildPath("topUI/score_heart");
        t.active = !0;
        var e = t.getChildByName("enemyhearts").children;
        if (n > e.length) throw new Error("数值错误：count:" + n);
        e.forEach(function(t) {
            return t.active = parseInt(t.name) < n;
        }), this._getChildPath("enemyProgress", t).getComponent(cc.ProgressBar).progress = n / e.length;
    },
    setTimeRecord: function(n) {
        if (this._timeLabel || (this._timeLabel = this._getChildPath("topUI/time/text").getComponent(cc.Label)), 
        this._timeLabel.node.parent.active = !0, "string" == typeof n) this._timeLabel.string = n; else {
            if ("number" != typeof n) throw new Error("传入时间格式错误 ，无法显示");
            1e4 < n && (n /= 1e3);
            var a = n / 60 >> 0, t = n % 60 >> 0;
            a = 60 < a ? "99" : (10 > a ? "0" : "") + a, t = (10 > t ? "0" : "") + t, this._timeLabel.string = a + ":" + t, 
            this._timeLabel.string = n;
        }
    },
    showHelp: function(t) {
        this.node.getChildByName("help").active = t;
    },
    showReadyGoAnim: function() {
        var t = this._getChildPath("anim");
        t.active = !0, t.getComponent(cc.Animation).play("readygo");
    },
    showResult: function(a, e) {
        this.scheduleOnce(function() {
            var o = this, i = this._getChildPath("gameover");
            if (!i) throw new Error("无法找到节点：gameover");
            i.active = !0;
            var r = 0 == a ? "tie" : 0 < a ? "win" : "lose";
            i.children.forEach(function(a) {
                if (a.active = a.name == r, a.active) {
                    if (a.getComponent(cc.Animation).play(), !e) return;
                    cc.loader.load(e, function(n, e) {
                        n ? cc.error(n.message || n) : o._getChildPath("anim/head/headpic", a).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(e);
                    });
                }
            });
        }, .5);
    },
    setSelfScore: function(n) {
        var e = this._getChildPath("topUI/scoring1");
        (e = this._getChildPath("topUI/score_texts")).active = !0, this._getChildPath("text1", e).getComponent(cc.Label).string = n;
    },
    setEmenyScore: function(n) {
        var e = this._getChildPath("topUI/scoring1");
        (e = this._getChildPath("topUI/score_texts")).active = !0, this._getChildPath("text2", e).getComponent(cc.Label).string = n;
    },
    updateGameBgState: function(n) {
        var e = this._getChildPath("gameStopBg"), t = cc.director.getWinSize();
        e.width = t.width, e.height = t.height, e.active = n;
    },
    _getChildPath: function(n, e) {
        var t = n.split("/");
        e = e || this.node;
        for (var a = 0; a < t.length; a++) if (!(e = e.getChildByName(t[a]))) throw new Error("无法找到当前节点的子节点：" + n);
        return e;
    },
    setTopUIVisible: function(t) {
        this.topUI && (this.topUI.active = t);
    }
})