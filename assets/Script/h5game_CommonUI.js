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
        var self = this;
        this._setWidgetTarget();
        this._getChildPath("gameStopBg").on(cc.Node.EventType.TOUCH_START, this._playBtnSound, this);
        this._initUI(), this.showHelp(!0);
        this.scheduleOnce(function() {
            self.showHelp(!1);
            self.showReadyGoAnim();
        }, 3);
    },
    _playBtnSound: function() {
        var get_sound = cc.url.raw("resources/MazeGame/sounds/start.mp3");
        cc.audioEngine.play(get_sound, !1, 1);
        this._getChildPath("gameStopBg").off(cc.Node.EventType.TOUCH_START, this._playBtnSound, this);
        this.showHelp(!1);
    },
    _initUI: function() {
        // this.node.children.forEach(function(t) {
        //     return t.active = !1;
        // }),
        this.node.getChildByName("bottomlogo").active = !0;
        this.node.getChildByName("toplogo").active = !0;

        this.topUI = this.node.getChildByName("topUI");
        this.topUI.active = !0;

        this._getChildPath("topUI/scoring1").active = !1;
        this._getChildPath("topUI/score_heart").active = !1;
        this._getChildPath("topUI/score_texts").active = !1;
    },
    _setWidgetTarget: function() {
        var ch_widget = this.node.getComponentsInChildren(cc.Widget),
            _scene = cc.director.getScene().getComponentInChildren(cc.Canvas).node;

        ch_widget.forEach(function(t) {
            return t.target = _scene;
        });
    },
    setSelfInfo: function(cell_res, val) {
        var player_1 = this._getChildPath("topUI/player1");
        if (
            player_1.active = !0,
            this._getChildPath("man", player_1).active = 1 == val,
            this._getChildPath("female", player_1).active = 2 == val,
            cell_res
        ) {
            var self = this;
            cc.loader.load(cell_res, function(cell_data, _val) {
                cell_data ?
                    cc.error(cell_data.message || cell_data)
                    :
                    self._getChildPath("topUI/player1/head/headpic").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(val);
            });
        }
    },
    setEnemyInfo: function(cell_ress, val) {
        var player_2 = this._getChildPath("topUI/player2");
        if (
            player_2.active = !0,
            this._getChildPath("man", player_2).active = 1 == val,
            this._getChildPath("female", player_2).active = 2 == val,
            cell_ress
        ) {
            var self = this;
            cc.loader.load(cell_ress, function(cell_data, val) {
                cell_data ? cc.error(cell_data.message || cell_data) : self._getChildPath("head/headpic", player_2).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(val);
            });
        }
    },
    setMyLife: function(life_val) {
        0 > life_val && (life_val = 0);
        var _score = this._getChildPath("topUI/scoring1");
        _score.active = !0;

        this._getChildPath("myProgress", _score).getComponent(cc.ProgressBar).progress = life_val;

        (_score = this._getChildPath("topUI/score_texts")).active = !0;
        this._getChildPath("text1", _score).getComponent(cc.Label).string = 100 * life_val >> 0;
    },
    setEnemyLife: function(life_val) {
        0 > life_val && (life_val = 0);
        var _score = this._getChildPath("topUI/scoring1");

        _score.active = !0, this._getChildPath("enemyProgress", _score).getComponent(cc.ProgressBar).progress = life_val;

        (_score = this._getChildPath("topUI/score_texts")).active = !0;
        this._getChildPath("text2", _score).getComponent(cc.Label).string = 100 * life_val >> 0;
    },
    setMyHearts: function(val) {
        var _heart = this._getChildPath("topUI/score_heart");
        _heart.active = !0;
        var heart_ch = _heart.getChildByName("myhearts").children;
        if (val > heart_ch.length) throw new Error("数值错误：count:" + val);

        heart_ch.forEach(function(t) {
            return t.active = parseInt(t.name) < val;
        });

        this._getChildPath("myProgress", _heart).getComponent(cc.ProgressBar).progress = val / heart_ch.length;
    },
    setEnemyHearts: function(val) {
        var _heart = this._getChildPath("topUI/score_heart");
        _heart.active = !0;
        var heart_ch = _heart.getChildByName("enemyhearts").children;
        if (val > heart_ch.length) throw new Error("数值错误：count:" + val);

        heart_ch.forEach(function(t) {
            return t.active = parseInt(t.name) < val;
        });

        this._getChildPath("enemyProgress", _heart).getComponent(cc.ProgressBar).progress = val / heart_ch.length;
    },
    setTimeRecord: function(time_val) {
        if (
            this._timeLabel || (this._timeLabel = this._getChildPath("topUI/time/text").getComponent(cc.Label)),
            this._timeLabel.node.parent.active = !0,
            "string" == typeof time_val
        ) this._timeLabel.string = time_val;
        else {
            if ("number" != typeof time_val) throw new Error("传入时间格式错误 ，无法显示");
            1e4 < time_val && (time_val /= 1e3);
            var min = time_val / 60 >> 0,
                sec = time_val % 60 >> 0;
            min = 60 < min ? "99" : (10 > min ? "0" : "") + min, sec = (10 > sec ? "0" : "") + sec, this._timeLabel.string = min + ":" + sec,
            this._timeLabel.string = time_val;
        }
    },
    showHelp: function(bool) {
        this.node.getChildByName("help").active = bool;
    },
    showReadyGoAnim: function() {
        var anim_node = this._getChildPath("anim");
        anim_node.active = !0;
        anim_node.getComponent(cc.Animation).play("readygo");
    },
    showResult: function(game_val, _bool) {
        this.scheduleOnce(function() {
            var self = this,
                gameover_node = this._getChildPath("gameover");

            if (!gameover_node) throw new Error("无法找到节点：gameover");

            gameover_node.active = !0;
            var r = 0 == game_val ? "tie" : 0 < game_val ? "win" : "lose";

            gameover_node.children.forEach(function(item) {
                if (item.active = item.name == r, item.active) {
                    if (item.getComponent(cc.Animation).play(), !_bool) return;
                    cc.loader.load(_bool, function(cell_item, _val) {
                        cell_item ? cc.error(cell_item.message || cell_item) : self._getChildPath("anim/head/headpic", item).getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(_val);
                    });
                }
            });
        }, .5);
    },
    setSelfScore: function(score_val) {
        var score_node = this._getChildPath("topUI/scoring1");
        (score_node = this._getChildPath("topUI/score_texts")).active = !0;
        this._getChildPath("text1", score_node).getComponent(cc.Label).string = score_val;
    },
    setEmenyScore: function(score_val) {
        var score_node = this._getChildPath("topUI/scoring1");
        (score_node = this._getChildPath("topUI/score_texts")).active = !0;
        this._getChildPath("text2", score_node).getComponent(cc.Label).string = score_val;
    },
    updateGameBgState: function(_bool) {
        var stopbg = this._getChildPath("gameStopBg"),
            win_size = cc.director.getWinSize();

        stopbg.width = win_size.width;
        stopbg.height = win_size.height;
        stopbg.active = _bool;
    },
    _getChildPath: function(route_str, _node) {
        var t = route_str.split("/");
        _node = _node || this.node;
        for (var a = 0; a < t.length; a++)
            if (!(_node = _node.getChildByName(t[a]))) throw new Error("无法找到当前节点的子节点：" + route_str);
        return _node;
    },
    setTopUIVisible: function(_bool) {
        this.topUI && (this.topUI.active = _bool);
    }
})
