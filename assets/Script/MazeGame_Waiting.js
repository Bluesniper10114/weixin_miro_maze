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
        a.width = t.width, a.height = t.height, this.getServerUrlAndConnnect(), cc.g_Game.that = this, 
        cc.g_Game.selfOnline = !0, cc.loader.loadResDir("MazeGame", function(t) {
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
        if (3 == cc.g_Game.game_state) {
            var t = cc.g_Game.that;
            i.OverGame(), t.scheduleOnce(CommonUtil.backToReadyGo, 4);
        }
    },
    onSelfOutline: function() {
        cc.g_Game.that.openGameResult(-1), !isWeChat() || cc.g_Game.is_single || wx.exitMiniProgram({});
    },
    getServerUrlAndConnnect: function() {
        var t = cc.g_Game.launchParams.serverHost + "/game/server/user/getaddress?token=" + cc.g_Game.launchParams.token;
        Http.get(t, function(n) {
            if (0 != n.code) throw new Error("获取服务器地址错误");
            var e = n.data.agreement + "://" + n.data.address + ":" + n.data.port;
            i.CreateWebSocket(e);
        });
    },
    playerReady: function() {
        cc.log("cc.g_Game.userList", cc.g_Game.userList, cc.g_Game.b_isAI);
        for (var n, t = 0; t < cc.g_Game.userList.length; t++) n = cc.g_Game.userList[t].userId == cc.g_Game.launchParams.userId ? "self_" : "enemy_", 
        cc.g_Game.Info[n + "id"] = cc.g_Game.userList[t].userId, cc.g_Game.Info[n + "name"] = cc.g_Game.userList[t].name, 
        cc.g_Game.Info[n + "sex"] = "MEN" == cc.g_Game.userList[t].gender ? 1 : 2, cc.g_Game.Info[n + "portraitUrl"] = cc.g_Game.userList[t].avatarUrl + "?aa=aa.jpg", 
        cc.g_Game.Info[n + "location"] = cc.g_Game.userList[t].locationInfo, cc.g_Game.Info[n + "isAI"] = cc.g_Game.userList[t].isAI, 
        cc.g_Game.Info[n + "extend"] = cc.g_Game.userList[t].extend;
        var e = cc.g_Game.that;
        e.self_init = !0, cc.g_Game.b_isAI && e.startGame();
    },
    EmenyReady: function() {
        var t = cc.g_Game.that;
        t.enemy_init = !0, t.self_init && t.enemy_init && t.startGame();
    },
    startGame: function() {
        console.log("265", cc.g_Game.game_state);
        var t = cc.g_Game.that;
        cc.g_Game.state && !t.loadstate && (t.loadstate = !0), cc.director.loadScene("MazeGame_Main");
    }
})