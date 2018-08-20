var l = require("MazeGame_Net"), s = require("cb");
window.CommonUI = {}, 
cc.Class({
    extends: cc.Component,
    properties: {
        _iMapCols: 19,
        _iMapRows: 25,
        _mapnode: cc.Node,
        _prefab_cell: cc.Prefab,
        _aMap: [],
        _vTouchStartPos: null,
        _player1: null,
        _player2: null,
        _ai: null,
        _aRightRoute: null,
        s_myName: "玩家1",
        s_oppositeName: "玩家2",
        _isBegin: !1,
        _timeLbl: null,
        _time: 120,
        music_win: cc.AudioClip,
        music_fail: cc.AudioClip,
        music_even: cc.AudioClip,
        music_touch: cc.AudioClip,
        music_timeout: cc.AudioClip,
        music_readygo: cc.AudioClip
    },
    onLoad: function() {
        this._time = 120, cc.g_Game.game_state = 4;
        var a = cc.g_Game.that = this;
        !cc.sys.isNative && cc.sys.isMobile && (this.node.getComponent(cc.Canvas).fitHeight = !0), 
        cc.g_Game.that = this, -1 == cc.g_Game.seed && (cc.g_Game.seed = cc.g_Game.game_data), 
        s.addEvent("event_select", this.oppPlayerMoveDir), cc.loader.loadRes("prefabs/prefab_cell", function(n, e) {
            var t = cc.find("Canvas/l_loading");
            return n ? (t.getComponent(cc.Label).string = "加载资源失败.", void setTimeout(function() {
                cc.director.loadScene("MazeGame_Start");
            }, 3e3)) : void (t.active = !1, a._prefab_cell = e, cc.g_Game.is_single || cc.g_Game.b_isAI ? a.initGame() : cc.g_Game.userId == cc.g_Game.userList[0].userId && (a.setIntervalID = setInterval(function() {
                l.MsgRetweetData(l.MID_ASK_MAIN_READY, 1);
            }, 10)));
        }), this.node.on("movePlayer2", function(t) {
            t = t.detail, a.movePlayer(a._player2, t);
        });
        var r = cc.director.getScene().getComponentInChildren(cc.Canvas), e = cc.view.getVisibleSize();
        e.width / e.height < 9 / 16 ? (r.fitWidth = !0, r.fitHeight = !1) : (r.fitWidth = !1, 
        r.fitHeight = !0);
        var t = cc.director.getWinSize(), i = cc.find("s_background", this.node);
        i.width = t.width, i.height = t.height;
        var n = cc.find("bg2", i);
        n.width = t.width, n.height = t.height, this.btn_back = cc.find("single_back", this.node), 
        this.btn_back.active = cc.g_Game.is_single;
    },
    start: function() {
        CommonUI.instance.updateGameBgState(!0), 
        this.showEffet(), 
        CommonUI.instance.setTimeRecord(this._time.toString()), 
        l.isConnect && (CommonUI.instance.setSelfInfo(cc.g_Game.Info.self_portraitUrl, cc.g_Game.Info.sex, cc.g_Game.Info.name), 
        CommonUI.instance.setEnemyInfo(cc.g_Game.Info.enemy_portraitUrl, cc.g_Game.Info.enemy_sex, cc.g_Game.Info.enemy_name)), 
        CommonUI.instance.setTopUIVisible(!cc.g_Game.is_single);
    },
    showEffet: function() {
        var n = cc.find("s_background/exit", this.node);
        cc.log(n);
        var e = cc.moveBy(.5, 0, -20), t = cc.moveBy(.5, 0, 20);
        n.runAction(cc.repeatForever(cc.sequence(e, t)));
    },
    onEnable: function() {
        s.addEvent("Enemy_outoLine", this.onEnemyOutline), s.addEvent("Self_outoLine", this.onSelfOutline), 
        s.addEvent("Self_outoLineShow", this.onGameToBack), cc.g_Game.state || this.onEnemyOutline();
    },
    onDisable: function() {
        s.removeEvent("Enemy_outoLine"), s.removeEvent("Self_outoLine"), s.removeEvent("Self_outoLineShow"), 
        this.unscheduleAllCallbacks();
    },
    onEnemyOutline: function() {
        l.MsgUserScoreReq(cc.g_Game.userId, 1), cc.g_Game.that.openGameResult(1), cc.log("onEnemyOutline");
    },
    onSelfOutline: function() {
        cc.g_Game.that.openGameResult(-1);
    },
    tongBuOver: function() {
        if (this.setIntervalID && clearInterval(this.setIntervalID), !cc.g_Game.is_single && !cc.g_Game.b_isAI) if (cc.g_Game.userId == cc.g_Game.userList[0].userId) {
            var n = Math.floor(1e3 * Math.random());
            cc.g_Game.seed = n, console.log("生成了随机数种子=", n), l.MsgRetweetData(l.MID_MAINSCENE_START, n);
        } else {
            var e = cc.g_Game.that;
            s.addEvent("event_myInit", e.myInit);
        }
    },
    myInit: function() {
        (console.log("只有客机进入这个函数，表明收到了主机发过来的随机种子", cc.g_Game.seed), cc.g_Game.userId != cc.g_Game.userList[0].userId) && cc.g_Game.that.initGame();
    },
    initGame: function() {
        this._player1 = {
            cell: null,
            node: null,
            canmove: !0
        }, this._player2 = {
            cell: null,
            node: null,
            canmove: !0
        }, this._mapnode = cc.find("Canvas/l_map"), this._player1.node = cc.find("Canvas/player1"), 
        this._player2.node = cc.find("Canvas/player2"), this._timeLbl = cc.find("Canvas/time/l_time"), 
        this._iMapRows = 23, this.createMap(), this.showReady();
        var t = require("MazeGame_AI");
        this._ai = new t(), this._ai.init(this._aMap, this._player2, 3), this._ai.autoPlay();
    },
    showReady: function() {
        var n = 0, e = this;
        CommonUI.instance.updateGameBgState(!0), this.schedule(function() {
            return 3 < n ? (CommonUI.instance.updateGameBgState(!1), void e.beginGame()) : void (2 == n && cc.g_Game.state && cc.audioEngine.play(this.music_readygo, !1, 1), 
            n++);
        }, 1, 4, 1);
    },
    beginGame: function() {
        this.node.on("touchstart", this.onTouchStart, this), this.node.on("touchend", this.onTouchEnd, this), 
        this.node.on("touchmove", this.onTouchMoved, this), this._player1.node.active = !0, 
        this._player2.node.active = !cc.g_Game.is_single, this.setPlayerPos(this._player1, this._aMap[this._iMapRows - 1][0]), 
        this.showPlayerRoute(this._player1), this.setPlayerPos(this._player2, this._aMap[this._iMapRows - 1][0]), 
        this.showPlayerRoute(this._player2, !0), this._isBegin = !0, this.btn_back.active = cc.g_Game.is_single;
    },
    openGameResult: function(n) {
        var e = cc.g_Game.that;
        e.showGameOver(e._player1, n);
    },
    showGameOver: function(n, e) {
        var t = this;
        this._isBegin = !1, console.log("发送游戏结束消息"), CommonUI.instance.showResult(e, cc.g_Game.Info.self_portraitUrl), 
        CommonUI.instance.updateGameBgState(!0);
        var a = cc.find("Canvas/b_return");
        a.active = !cc.g_Game.launchParams, l.MsgUserScoreReq(cc.g_Game.userId, e), l.isConnect && e && 0 == e && l.MsgUserScoreReq(cc.g_Game.Info.enemy_id, e), 
        l.OverGame(), 1 == e ? cc.audioEngine.play(this.music_win, !1, 1) : -1 == e ? cc.audioEngine.play(this.music_fail, !1, 1) : 0 == e && cc.audioEngine.play(this.music_even, !1, 1), 
        console.log("cc.g_Game.is_single", cc.g_Game.is_single, window.query), setTimeout(function() {
            isWeChat() && cc.g_Game.launchParams && wx.exitMiniProgram({});
        }, 3e3), a.on(cc.Node.EventType.TOUCH_START, function() {
            t.returnToMain();
        }, t);
    },
    onGameToBack: function() {
        var n = function() {
            isWeChat() && wx.exitMiniProgram({});
        }, e = null, t = 3;
        e = setInterval(function() {
            0 > t && (clearInterval(e), n()), t--;
        }, 1e3);
    },
    onTouchStart: function(t) {
        this._isBegin && (this._vTouchStartPos = t.touch.getLocation());
    },
    onTouchMoved: function() {},
    onTouchEnd: function(a) {
        if (this._isBegin && !(0 < this._player1.node.getNumberOfRunningActions())) {
            var e = a.touch.getLocation(), t = this._vTouchStartPos.x - e.x, i = this._vTouchStartPos.y - e.y, r = 0;
            Math.abs(t) > Math.abs(i) ? 0 < t ? (this.movePlayer(this._player1, "left"), r = 1) : (this.movePlayer(this._player1, "right"), 
            r = 2) : 0 < Math.abs(i) && (0 < i ? (this.movePlayer(this._player1, "bottom"), r = 3) : (this.movePlayer(this._player1, "up"), 
            r = 4)), !cc.g_Game.b_isAI && 0 < r && l.MsgRetweetData(l.MID_SELECT_RET, r);
        }
    },
    getCellPosForCanvas: function(n) {
        var e = n.node.getPosition();
        return e = n.node.parent.convertToWorldSpaceAR(e), this._mapnode.parent.convertToNodeSpaceAR(e);
    },
    setPlayerPos: function(n, e) {
        n.node.setPosition(this.getCellPosForCanvas(e)), n.cell = e;
    },
    showPlayerRoute: function(n) {
        for (var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1], a = 0; 4 > a; a++) n.node.children[a].active = !1;
        if (!e && n != this._player2) for (var i = 0; i < n.cell.route.length; i++) n.node.getChildByName(n.cell.route[i]).active = !0;
    },
    oppPlayerMoveDir: function(n) {
        var e = cc.g_Game.that, t = [ "", "left", "right", "bottom", "up" ];
        cc.log("oppPlayerMoveDir", n, t[n]), e.oppPlayerMoveArray || (e.oppPlayerMoveArray = []), 
        e.oppPlayerMoveArray.push(t[n]), 0 == e._player2.node.getNumberOfRunningActions() && e.movePlayer(e._player2, e.oppPlayerMoveArray.shift());
    },
    movePlayer: function(a, i) {
        var l = this;
        if (!(null == a.cell || 0 == a.canmove || 0 > a.cell.route.indexOf(i))) {
            var r = null, n = null;
            if ("left" === i ? (r = this._aMap[a.cell.row][a.cell.col - 1], n = "right") : "right" === i ? (r = this._aMap[a.cell.row][a.cell.col + 1], 
            n = "left") : "up" === i ? (r = this._aMap[a.cell.row - 1][a.cell.col], n = "bottom") : "bottom" === i ? (r = this._aMap[a.cell.row + 1][a.cell.col], 
            n = "up") : void 0, null != r) {
                var e = this.getCellPosForCanvas(r), o = this;
                this.showPlayerRoute(a, !0), a.cell = null, console.log("移动音效", a.node.name), "player1" == a.node.name && cc.audioEngine.play(this.music_touch, !1, 1), 
                a.node.runAction(cc.sequence(cc.moveTo(.1, e), cc.callFunc(function() {
                    if (0 == r.row && r.col == o._iMapCols - 1) {
                        var i = a == l._player1 ? 1 : -1;
                        o.showGameOver(a, i);
                    } else if (2 == (a.cell = r).route.length && a.canmove) {
                        var t = r.route.concat();
                        t.splice(t.indexOf(n), 1), o.movePlayer(a, t[0]);
                    } else l.oppPlayerMoveArray && 0 < l.oppPlayerMoveArray.length ? (console.log("检测到消息队列不为空"), 
                    o.movePlayer(l._player2, l.oppPlayerMoveArray.shift())) : o.showPlayerRoute(a);
                })));
            }
        }
    },
    createMap: function() {
        this._mapnode.destroyAllChildren(), this._mapnode.width = 32 * this._iMapCols + 6, 
        this._mapnode.scale = 700 / this._mapnode.width, this._aMap = [];
        for (var d = 0; d < this._iMapRows; d++) {
            this._aMap.push([]);
            for (var g, u = 0; u < this._iMapCols; u++) g = cc.instantiate(this._prefab_cell), 
            g.active = !0, this._mapnode.addChild(g), this._aMap[d].push({
                node: g,
                state: 0,
                around: [],
                route: [],
                col: u,
                row: d,
                id: u + "" + d
            });
        }
        for (var p = 0; p < this._iMapRows; p++) for (var r = 0; r < this._iMapCols; r++) 0 < p && this._aMap[p][r].around.push({
            wz: "up",
            cell: this._aMap[p - 1][r],
            wz2: "bottom"
        }), p < this._iMapRows - 1 && this._aMap[p][r].around.push({
            wz: "bottom",
            cell: this._aMap[p + 1][r],
            wz2: "up"
        }), 0 < r && this._aMap[p][r].around.push({
            wz: "left",
            cell: this._aMap[p][r - 1],
            wz2: "right"
        }), r < this._iMapCols - 1 && this._aMap[p][r].around.push({
            wz: "right",
            cell: this._aMap[p][r + 1],
            wz2: "left"
        });
        this._aRightRoute = this.findRoute(this._aMap[this._iMapRows - 1][0], !0);
        for (var n = !1, o = 0, s = 0; s < this._aRightRoute.length; s++) {
            for (var a = 0; a < this._aRightRoute[s].around.length; a++) 0 == this._aRightRoute[s].around[a].cell.state && (this.hideBorder(this._aRightRoute[s], this._aRightRoute[s].around[a].wz), 
            this.hideBorder(this._aRightRoute[s].around[a].cell, this._aRightRoute[s].around[a].wz2), 
            30 < this.findRoute(this._aRightRoute[s].around[a].cell, !1, 30, 50).length && o++, 
            1 < o && (n = !0));
            if (n) break;
        }
        for (var f = 0; f < this._iMapRows; f++) for (var m = 0; m < this._iMapCols; m++) 0 == this._aMap[f][m].state && this.findRoute(this._aMap[f][m], !1);
    },
    findRoute: function(d, e) {
        var p = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0, i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 0, r = [], n = [];
        r.push(d), n.push(d.id), r[0].state = 1;
        for (var o, s, a = 0; 5e3 > a && 0 < r.length; ) {
            for (var f = r[r.length - 1], h = f.around.concat(); ;) {
                if (0 == h.length) {
                    var l = r.pop();
                    if (e) {
                        var c = this.initBorder(l);
                        0 < r.length && (l = r[r.length - 1]).route.splice(l.route.indexOf(this.getContraryOrientation(c)), 1);
                    }
                    break;
                }
                var u = Math.floor((s = o = void 0, (cc.g_Game.b_isAI ? Math.random() : (o = o || 1, s = s || 0, 
                cc.g_Game.seed = (9301 * cc.g_Game.seed + 49297) % 233280, s + cc.g_Game.seed / 233280 * (o - s))) * h.length));
                if (0 == h[u].cell.state && 0 > n.indexOf(h[u].cell.id)) {
                    h[u].cell.state = 1, this.hideBorder(f, h[u].wz), this.hideBorder(h[u].cell, h[u].wz2), 
                    r.push(h[u].cell), n.push(h[u].cell.id);
                    break;
                }
                if (!e) if (0 < i) {
                    if (r.length >= i) {
                        a = 6666;
                        break;
                    }
                } else if (0 > n.indexOf(h[u].cell.id) && r.length >= p) {
                    this.hideBorder(f, h[u].wz), this.hideBorder(h[u].cell, h[u].wz2), a = 6666;
                    break;
                }
                h.splice(u, 1);
            }
            if (a++, e && r[r.length - 1].col == this._iMapCols - 1 && 0 == r[r.length - 1].row) {
                this.hideBorder(r[r.length - 1], "up");
                break;
            }
        }
        return r;
    },
    hideBorder: function(n, e) {
        n.node.getChildByName("s_border_" + e).active = !1, n.route.push(e);
    },
    initBorder: function(n) {
        n.state = 0;
        var e = n.route[0];
        n.route = [];
        for (var t = 0; 4 > t; t++) n.node.children[t].active = !0;
        return e;
    },
    getContraryOrientation: function(t) {
        return "left" === t ? "right" : "right" === t ? "left" : "up" === t ? "bottom" : "bottom" === t ? "up" : "";
    },
    showRoute: function() {
        for (var t = 0; t < this._aRightRoute.length; t++) this._aRightRoute[t].node.getChildByName("s_point").active = !0;
    },
    returnToMain: function() {
        CommonUI.instance = null, cc.director.loadScene("MazeGame_Start");
    },
    update: function(t) {
        if (this._isBegin && cc.g_Game.state && !cc.g_Game.is_single) {
            if (this._time -= t, 0 >= this._time) return void this.openGameResult(0);
            CommonUI.instance.setTimeRecord(Math.floor(this._time).toString());
        }
    }
})