var i = require("MazeGame_Net"), t = require("cb");
cc.Class({
    extends: cc.Component,
    properties: {
        self_init: !1,
        enemy_init: !1,
        loadstate: !1,
        readygologo: cc.Node,
        readygologo2: cc.Node,
        readygologo3: cc.Node
    },
    onLoad: function() {},
    start: function() {
        var n = cc.director.getScene().getComponentInChildren(cc.Canvas), e = cc.view.getVisibleSize();
        e.width / e.height < 9 / 16 ? (n.fitWidth = !0, n.fitHeight = !1) : (n.fitWidth = !1,
        n.fitHeight = !0);
        var t = cc.director.getWinSize(), a = cc.find("bg", this.node);
        a.width = t.width, a.height = t.height, this.getServerUrlAndConnnect(), cc.miroGame.that = this,
        cc.miroGame.selfOnline = !0, cc.loader.loadResDir("MazeGame", function(t) {
            t && console.log("加载资源出现错误", t);
        }), this.readygologo2.runAction(cc.sequence(cc.fadeIn(1), cc.fadeOut(1), cc.callFunc(this.onShowEffect, this))),
        this.readygologo.active = !1, this.readygologo3.active = !1;
    },
    onShowEffect: function() {
        var t = cc.rotateBy(1, 360);
        this.readygologo.active = !0, this.readygologo3.active = !0, this.readygologo.runAction(cc.repeatForever(t));
    },
    onEnable: function() {
        t.addEvent("Enemy_outoLine", this.onEnemyOutline), t.addEvent("Self_outoLine", this.onSelfOutline),
        t.addEvent("event_ready", this.playerReady), t.addEvent("Emeny_loading", this.EmenyReady),
        t.addEvent("Self_outoLineShow", this.onGameToBack), isWeChat();
    },
    onDisable: function() {
        t.removeEvent("Enemy_outoLine"), t.removeEvent("event_ready"), t.removeEvent("Self_outoLine"),
        t.removeEvent("Emeny_loading"), t.removeEvent("Self_outoLineShow");
    },
    onGameToBack: function() {},
    onEnemyOutline: function() {
        if (3 == cc.miroGame.game_state) {
            var t = cc.miroGame.that;
            i.OverGame(), t.scheduleOnce(CommonUtil.backToReadyGo, 4);
        }
    },
    onSelfOutline: function() {
        cc.miroGame.that.openGameResult(-1), !isWeChat() || cc.miroGame.is_single || wx.exitMiniProgram({});
    },
    getServerUrlAndConnnect: function() {
        var t = cc.miroGame.launchParams.serverHost + "/game/server/user/getaddress?token=" + cc.miroGame.launchParams.token;
        Http.get(t, function(n) {
            if (0 != n.code) throw new Error("获取服务器地址错误");
            var e = n.data.agreement + "://" + n.data.address + ":" + n.data.port;
            i.CreateWebSocket(e);
        });
    },
    playerReady: function() {
        cc.log("cc.miroGame.userList", cc.miroGame.userList, cc.miroGame.b_isAI);
        for (var n, t = 0; t < cc.miroGame.userList.length; t++) n = cc.miroGame.userList[t].userId == cc.miroGame.launchParams.userId ? "self_" : "enemy_",
        cc.miroGame.Info[n + "id"] = cc.miroGame.userList[t].userId, cc.miroGame.Info[n + "name"] = cc.miroGame.userList[t].name,
        cc.miroGame.Info[n + "sex"] = "MEN" == cc.miroGame.userList[t].gender ? 1 : 2, cc.miroGame.Info[n + "portraitUrl"] = cc.miroGame.userList[t].avatarUrl + "?aa=aa.jpg",
        cc.miroGame.Info[n + "location"] = cc.miroGame.userList[t].locationInfo, cc.miroGame.Info[n + "isAI"] = cc.miroGame.userList[t].isAI,
        cc.miroGame.Info[n + "extend"] = cc.miroGame.userList[t].extend;
        var e = cc.miroGame.that;
        e.self_init = !0, cc.miroGame.b_isAI && e.startGame();
    },
    EmenyReady: function() {
        var t = cc.miroGame.that;
        t.enemy_init = !0, t.self_init && t.enemy_init && t.startGame();
    },
    startGame: function() {
        console.log("265", cc.miroGame.game_state);
        var t = cc.miroGame.that;
        cc.miroGame.state && !t.loadstate && (t.loadstate = !0), cc.director.loadScene("MazeGame_Main");
    }
})
