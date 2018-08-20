var net_state = require("MazeGame_Net"), event = require("cb");
window.CommonUI = {};

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
        this._time = 120;
        cc.miroGame.game_state = 4;
        var game_this = cc.miroGame.that = this;
        !cc.sys.isNative && cc.sys.isMobile && (this.node.getComponent(cc.Canvas).fitHeight = !0);
        cc.miroGame.that = this;
        -1 == cc.miroGame.seed && (cc.miroGame.seed = cc.miroGame.game_data);

        event.addEvent("event_select", this.oppPlayerMoveDir);

        cc.loader.loadRes("prefabs/prefab_cell", function(res, cell_data) {
            var loading_node = cc.find("Canvas/l_loading");
            return res ? (
                loading_node.getComponent(cc.Label).string = "加载资源失败.",
                void setTimeout(function() {
                    cc.director.loadScene("MazeGame_Start");
                }, 3e3)
            ) : void (
                loading_node.active = !1, game_this._prefab_cell = cell_data,
                cc.miroGame.is_single || cc.miroGame.b_isAI ?
                    game_this.initGame()
                    :
                    cc.miroGame.userId == cc.miroGame.userList[0].userId &&
                    (
                        game_this.setIntervalID = setInterval(function() {
                            net_state.MsgRetweetData(net_state.MID_ASK_MAIN_READY, 1);
                        }, 10)
                    )
            );
        });

        this.node.on("movePlayer2", function(player2) {
            player2 = player2.detail, game_this.movePlayer(game_this._player2, player2);
        });

        var canvas_scene = cc.director.getScene().getComponentInChildren(cc.Canvas),
            view_size = cc.view.getVisibleSize();

        view_size.width / view_size.height < 9 / 16 ?
            (
                canvas_scene.fitWidth = !0,
                canvas_scene.fitHeight = !1
            ) : (
                canvas_scene.fitWidth = !1, canvas_scene.fitHeight = !0
            );

        var win_size = cc.director.getWinSize(),
            back_node = cc.find("s_background", this.node);

        back_node.width = win_size.width;
        back_node.height = win_size.height;

        var bg_node = cc.find("bg2", back_node);

        bg_node.width = win_size.width;
        bg_node.height = win_size.height;
        this.btn_back = cc.find("single_back", this.node);
        this.btn_back.active = cc.miroGame.is_single;
    },
    start: function() {
        CommonUI.instance.updateGameBgState(!0);
        this.showEffet();
        CommonUI.instance.setTimeRecord(this._time.toString());
        net_state.isConnect && (
            CommonUI.instance.setSelfInfo(cc.miroGame.Info.self_portraitUrl, cc.miroGame.Info.sex, cc.miroGame.Info.name),
            CommonUI.instance.setEnemyInfo(cc.miroGame.Info.enemy_portraitUrl, cc.miroGame.Info.enemy_sex, cc.miroGame.Info.enemy_name)
        );
        CommonUI.instance.setTopUIVisible(!cc.miroGame.is_single);
    },
    showEffet: function() {
        var exit_node = cc.find("s_background/exit", this.node);

        cc.log(exit_node);
        var top = cc.moveBy(.5, 0, -20),
            bottom = cc.moveBy(.5, 0, 20);

        exit_node.runAction(cc.repeatForever(cc.sequence(top, bottom)));
    },
    onEnable: function() {
        event.addEvent("Enemy_outoLine", this.onEnemyOutline);
        event.addEvent("Self_outoLine", this.onSelfOutline);
        event.addEvent("Self_outoLineShow", this.onGameToBack);
        cc.miroGame.state || this.onEnemyOutline();
    },
    onDisable: function() {
        event.removeEvent("Enemy_outoLine");
        event.removeEvent("Self_outoLine");
        event.removeEvent("Self_outoLineShow");
        this.unscheduleAllCallbacks();
    },
    onEnemyOutline: function() {
        net_state.MsgUserScoreReq(cc.miroGame.userId, 1);
        cc.miroGame.that.openGameResult(1);
        cc.log("onEnemyOutline");
    },
    onSelfOutline: function() {
        cc.miroGame.that.openGameResult(-1);
    },
    tongBuOver: function() {
        if (this.setIntervalID && clearInterval(this.setIntervalID), !cc.miroGame.is_single && !cc.miroGame.b_isAI)
            if (cc.miroGame.userId == cc.miroGame.userList[0].userId) {
                var random_val = Math.floor(1e3 * Math.random());
                cc.miroGame.seed = random_val;
                net_state.MsgRetweetData(net_state.MID_MAINSCENE_START, random_val);
            } else {
                var game_that = cc.miroGame.that;
                event.addEvent("event_myInit", game_that.myInit);
            }
    },
    myInit: function() {
        cc.miroGame.userId != cc.miroGame.userList[0].userId && cc.miroGame.that.initGame();
    },
    initGame: function() {
        this._player1 = {
            cell: null,
            node: null,
            canmove: !0
        };

        this._player2 = {
            cell: null,
            node: null,
            canmove: !0
        };

        this._mapnode = cc.find("Canvas/l_map");
        this._player1.node = cc.find("Canvas/player1");
        this._player2.node = cc.find("Canvas/player2");
        this._timeLbl = cc.find("Canvas/time/l_time");
        this._iMapRows = 23, this.createMap();

        this.showReady();

        var game_AI = require("MazeGame_AI");
        this._ai = new game_AI();
        this._ai.init(this._aMap, this._player2, 3);
        this._ai.autoPlay();
    },
    showReady: function() {
        var count = 0,
            self = this;
        CommonUI.instance.updateGameBgState(!0),
        this.schedule(function() {
            return 3 < count ?
                (
                    CommonUI.instance.updateGameBgState(!1), void self.beginGame()
                ) : void (
                    2 == count && cc.miroGame.state && cc.audioEngine.play(this.music_readygo, !1, 1),
                    count++
                );
        }, 1, 4, 1);
    },
    beginGame: function() {
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchend", this.onTouchEnd, this);
        this.node.on("touchmove", this.onTouchMoved, this);

        this._player1.node.active = !0;
        this._player2.node.active = !cc.miroGame.is_single;

        this.setPlayerPos(this._player1, this._aMap[this._iMapRows - 1][0]);
        this.showPlayerRoute(this._player1);
        this.setPlayerPos(this._player2, this._aMap[this._iMapRows - 1][0]);
        this.showPlayerRoute(this._player2, !0);

        this._isBegin = !0;
        this.btn_back.active = cc.miroGame.is_single;
    },
    openGameResult: function(result_data) {
        var self_that = cc.miroGame.that;
        self_that.showGameOver(self_that._player1, result_data);
    },
    showGameOver: function(player, result_data) {
        var self = this;
        this._isBegin = !1;

        CommonUI.instance.showResult(result_data, cc.miroGame.Info.self_portraitUrl);
        CommonUI.instance.updateGameBgState(!0);

        var return_node = cc.find("Canvas/b_return");
        return_node.active = !cc.miroGame.launchParams;

        net_state.MsgUserScoreReq(cc.miroGame.userId, result_data);
        net_state.isConnect && result_data && 0 == result_data && net_state.MsgUserScoreReq(cc.miroGame.Info.enemy_id, result_data);
        net_state.OverGame();

        1 == result_data ?
            cc.audioEngine.play(this.music_win, !1, 1)
            :
            -1 == result_data ?
                cc.audioEngine.play(this.music_fail, !1, 1)
                :
                0 == result_data && cc.audioEngine.play(this.music_even, !1, 1);

        setTimeout(function() {
            isWeChat() && cc.miroGame.launchParams && wx.exitMiniProgram({});
        }, 3e3);

        return_node.on(cc.Node.EventType.TOUCH_START, function() {
            self.returnToMain();
        }, self);
    },
    onGameToBack: function() {
        var return_func = function() {
                isWeChat() && wx.exitMiniProgram({});
            },
            interval_val = null,
            count = 3;

        interval_val = setInterval(function() {
            0 > count && (clearInterval(interval_val), return_func()), count--;
        }, 1e3);
    },
    onTouchStart: function(scene_scr) {
        this._isBegin && (this._vTouchStartPos = scene_scr.touch.getLocation());
    },
    onTouchMoved: function() {},
    onTouchEnd: function(scene_scr) {
        if (this._isBegin && !(0 < this._player1.node.getNumberOfRunningActions())) {
            var location = scene_scr.touch.getLocation(),
                x_pos = this._vTouchStartPos.x - location.x,
                y_pos = this._vTouchStartPos.y - location.y,
                r = 0;

            Math.abs(x_pos) > Math.abs(y_pos) ?
                0 < x_pos ?
                    (
                        this.movePlayer(this._player1, "left"),
                        r = 1
                    ) : (
                        this.movePlayer(this._player1, "right"),
                        r = 2
                    )
                :
                    0 < Math.abs(y_pos) && (
                        0 < y_pos ?
                            (
                                this.movePlayer(this._player1, "bottom"),
                                r = 3
                            ) : (
                                this.movePlayer(this._player1, "up"
                            ),
                        r = 4)
                    ),
            !cc.miroGame.b_isAI && 0 < r && net_state.MsgRetweetData(net_state.MID_SELECT_RET, r);
        }
    },
    getCellPosForCanvas: function(canvas_node) {
        var pos = canvas_node.node.getPosition();
        return pos = canvas_node.node.parent.convertToWorldSpaceAR(pos), this._mapnode.parent.convertToNodeSpaceAR(pos);
    },
    setPlayerPos: function(player, p_cell) {
        player.node.setPosition(this.getCellPosForCanvas(p_cell)), player.cell = p_cell;
    },
    showPlayerRoute: function(scene_scr) {
        for (var e = 1 < arguments.length && void 0 !== arguments[1] && arguments[1], a = 0; 4 > a; a++)
            scene_scr.node.children[a].active = !1;

            if (!e && scene_scr != this._player2)
                for (var i = 0; i < scene_scr.cell.route.length; i++)
                    scene_scr.node.getChildByName(scene_scr.cell.route[i]).active = !0;
    },
    oppPlayerMoveDir: function(index) {
        var self_that = cc.miroGame.that,
            arrow = [ "", "left", "right", "bottom", "up" ];
        cc.log("oppPlayerMoveDir", index, arrow[index]);

        self_that.oppPlayerMoveArray || (self_that.oppPlayerMoveArray = []);
        self_that.oppPlayerMoveArray.push(arrow[index]);

        0 == self_that._player2.node.getNumberOfRunningActions() && self_that.movePlayer(self_that._player2, self_that.oppPlayerMoveArray.shift());
    },
    movePlayer: function(player, arrow) {
        var self = this;
        if (!(null == player.cell || 0 == player.canmove || 0 > player.cell.route.indexOf(arrow))) {
            var cell_pos = null,
                tmp_arrow = null;
            if (
                "left" === arrow ?
                    (
                        cell_pos = this._aMap[player.cell.row][player.cell.col - 1],
                        tmp_arrow = "right"
                    ) : "right" === arrow ? (
                                        cell_pos = this._aMap[player.cell.row][player.cell.col + 1],
                                        tmp_arrow = "left"
                                    ) : "up" === arrow ?
                                            (
                                                cell_pos = this._aMap[player.cell.row - 1][player.cell.col], tmp_arrow = "bottom"
                                            ) : "bottom" === arrow ?
                                                (
                                                    cell_pos = this._aMap[player.cell.row + 1][player.cell.col],
                                                    tmp_arrow = "up"
                                                ) : void 0, null != cell_pos
            ) {
                var cell_canvas = this.getCellPosForCanvas(cell_pos),
                    self_this = this;
                this.showPlayerRoute(player, !0);
                player.cell = null;

                "player1" == player.node.name && cc.audioEngine.play(this.music_touch, !1, 1);

                player.node.runAction(
                    cc.sequence(
                        cc.moveTo(.1, cell_canvas),
                        cc.callFunc(
                            function() {
                                if (0 == cell_pos.row && cell_pos.col == self_this._iMapCols - 1) {
                                    var sel_player = player == self._player1 ? 1 : -1;
                                    self_this.showGameOver(player, sel_player);
                                } else if (2 == (player.cell = cell_pos).route.length && player.canmove) {
                                    var cel_route = cell_pos.route.concat();
                                    cel_route.splice(cel_route.indexOf(tmp_arrow), 1), self_this.movePlayer(player, cel_route[0]);
                                } else
                                    self.oppPlayerMoveArray && 0 < self.oppPlayerMoveArray.length ?
                                        self_this.movePlayer(self._player2, self.oppPlayerMoveArray.shift())
                                        :
                                        self_this.showPlayerRoute(player);
                            }
                        )
                    )
                );
            }
        }
    },
    createMap: function() {
        this._mapnode.destroyAllChildren();
        this._mapnode.width = 32 * this._iMapCols + 6;
        this._mapnode.scale = 700 / this._mapnode.width, this._aMap = [];

        for (var d = 0; d < this._iMapRows; d++) {
            this._aMap.push([]);
            for (var g, u = 0; u < this._iMapCols; u++)
                g = cc.instantiate(this._prefab_cell),
                g.active = !0, this._mapnode.addChild(g), this._aMap[d].push(
                    {
                        node: g,
                        state: 0,
                        around: [],
                        route: [],
                        col: u,
                        row: d,
                        id: u + "" + d
                    }
                );
        }

        for (var p = 0; p < this._iMapRows; p++)
            for (var r = 0; r < this._iMapCols; r++)
                0 < p && this._aMap[p][r].around.push({
                    wz: "up",
                    cell: this._aMap[p - 1][r],
                    wz2: "bottom"
                }),
                p < this._iMapRows - 1 && this._aMap[p][r].around.push({
                    wz: "bottom",
                    cell: this._aMap[p + 1][r],
                    wz2: "up"
                }),
                0 < r && this._aMap[p][r].around.push({
                    wz: "left",
                    cell: this._aMap[p][r - 1],
                    wz2: "right"
                }),
                r < this._iMapCols - 1 && this._aMap[p][r].around.push({
                    wz: "right",
                    cell: this._aMap[p][r + 1],
                    wz2: "left"
                });

        this._aRightRoute = this.findRoute(this._aMap[this._iMapRows - 1][0], !0);

        for (var n = !1, o = 0, s = 0; s < this._aRightRoute.length; s++) {
            for (var a = 0; a < this._aRightRoute[s].around.length; a++)
                0 == this._aRightRoute[s].around[a].cell.state && (
                    this.hideBorder(this._aRightRoute[s], this._aRightRoute[s].around[a].wz),
                    this.hideBorder(this._aRightRoute[s].around[a].cell, this._aRightRoute[s].around[a].wz2),
                    30 < this.findRoute(this._aRightRoute[s].around[a].cell, !1, 30, 50).length && o++,
                    1 < o && (n = !0)
                );
            if (n) break;
        }

        for (var f = 0; f < this._iMapRows; f++)
            for (var m = 0; m < this._iMapCols; m++)
                0 == this._aMap[f][m].state && this.findRoute(this._aMap[f][m], !1);
    },
    findRoute: function(_cell, state) {
        var sec_arg = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
            thd_arg = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 0,
            cell_arr = [],
            id_arr = [];

        cell_arr.push(_cell), id_arr.push(_cell.id), cell_arr[0].state = 1;

        for (var o, s, a = 0; 5e3 > a && 0 < cell_arr.length; ) {
            for (var f = cell_arr[cell_arr.length - 1], h = f.around.concat(); ;) {
                if (0 == h.length) {
                    var l = cell_arr.pop();
                    if (state) {
                        var c = this.initBorder(l);
                        0 < cell_arr.length && (l = cell_arr[cell_arr.length - 1]).route.splice(l.route.indexOf(this.getContraryOrientation(c)), 1);
                    }
                    break;
                }
                var u = Math.floor((s = o = void 0, (cc.miroGame.b_isAI ? Math.random() : (o = o || 1, s = s || 0,
                cc.miroGame.seed = (9301 * cc.miroGame.seed + 49297) % 233280, s + cc.miroGame.seed / 233280 * (o - s))) * h.length));
                if (0 == h[u].cell.state && 0 > id_arr.indexOf(h[u].cell.id)) {
                    h[u].cell.state = 1, this.hideBorder(f, h[u].wz), this.hideBorder(h[u].cell, h[u].wz2),
                    cell_arr.push(h[u].cell), id_arr.push(h[u].cell.id);
                    break;
                }
                if (!state) if (0 < thd_arg) {
                    if (cell_arr.length >= thd_arg) {
                        a = 6666;
                        break;
                    }
                } else if (0 > id_arr.indexOf(h[u].cell.id) && cell_arr.length >= sec_arg) {
                    this.hideBorder(f, h[u].wz), this.hideBorder(h[u].cell, h[u].wz2), a = 6666;
                    break;
                }
                h.splice(u, 1);
            }
            if (a++, state && cell_arr[cell_arr.length - 1].col == this._iMapCols - 1 && 0 == cell_arr[cell_arr.length - 1].row) {
                this.hideBorder(cell_arr[cell_arr.length - 1], "up");
                break;
            }
        }
        return cell_arr;
    },
    hideBorder: function(_cell, arrow) {
        _cell.node.getChildByName("s_border_" + arrow).active = !1, _cell.route.push(arrow);
    },
    initBorder: function(_cell) {
        _cell.state = 0;
        var route = _cell.route[0];

        _cell.route = [];
        for (var t = 0; 4 > t; t++) _cell.node.children[t].active = !0;

        return route;
    },
    getContraryOrientation: function(t) {
        return "left" === t ?
            "right" : "right" === t ?
                    "left" : "up" === t ?
                            "bottom" : "bottom" === t ?
                                        "up" : "";
    },
    showRoute: function() {
        for (var t = 0; t < this._aRightRoute.length; t++)
            this._aRightRoute[t].node.getChildByName("s_point").active = !0;
    },
    returnToMain: function() {
        CommonUI.instance = null;
        cc.director.loadScene("MazeGame_Start");
    },
    update: function(time) {
        if (this._isBegin && cc.miroGame.state && !cc.miroGame.is_single) {
            if (this._time -= time, 0 >= this._time) return void this.openGameResult(0);
            CommonUI.instance.setTimeRecord(Math.floor(this._time).toString());
        }
    }
});
