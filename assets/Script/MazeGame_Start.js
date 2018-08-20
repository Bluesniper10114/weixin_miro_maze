cc.g_Game = {};
cc.g_Game.initData = function(t) {
    cc.g_Game.userList = t, cc.g_Game.userId = "", cc.g_Game.score = [ 0, 0 ], cc.g_Game.game_state = 0, 
    cc.g_Game.b_isAI = !1, cc.g_Game.game_data = -1, cc.g_Game.seed = -1, cc.g_Game.state = !0, 
    cc.g_Game.Info = [], cc.g_Game.selfOnline = !1;
};
cc.g_Game.initUserList = function(t) {
    cc.g_Game.userList = t;
};
window.query = null, window.onShow = !1, require("MazeGame_Ping");
var o = require("MazeGame_Net"), t = require("cb");
require("base64"), window.CommonUtil = require("h5game_CommonUtil"), window.Http = require("h5game_Http");


cc.Class({
    extends: cc.Component,
    properties: {
        eventSound: cc.AudioClip
    },
    onLoad: function() {
        console.log("START场景加载", window.query), cc.g_Game.that = this, cc.g_Game.initData([]), 
        cc.g_Game.launchParams = CommonUtil.getLaunchParams(), console.log("cc.g_Game.launchParams.serverHost", cc.g_Game.launchParams), 
        cc.g_Game.launchParams && (cc.g_Game.launchParams.serverHost = Base64.fromBase64(cc.g_Game.launchParams.serverHost)), 
        cc.g_Game.launchParams && console.log("997", cc.g_Game.launchParams), cc.g_Game.launchParams ? ("fake" == cc.g_Game.launchParams.token.substring(0, 4) ? (cc.g_Game.userList = [], 
        cc.g_Game.userId = cc.g_Game.launchParams.userId, cc.g_Game.b_isAI = !0) : (cc.g_Game.userList = [], 
        cc.g_Game.userId = cc.g_Game.launchParams.userId, cc.g_Game.b_isAI = !1), cc.director.loadScene("MatchingScene"), 
        this.node.opacity = 0) : (cc.g_Game.userList = [], cc.g_Game.b_isAI = !0, cc.g_Game.is_single = !0, 
        !o.isConnect && isWeChat() && wx.showShareMenu({
            withShareTicket: !0
        }));
        var n = cc.director.getScene().getComponentInChildren(cc.Canvas), e = cc.view.getVisibleSize();
        e.width / e.height < 9 / 16 ? (n.fitWidth = !0, n.fitHeight = !1) : (n.fitWidth = !1, 
        n.fitHeight = !0);
        var t = cc.director.getWinSize(), a = cc.find("s_backgoud", this.node);
        a.width = t.width, a.height = t.height;
    },
    onEnable: function() {},
    onDisable: function() {},
    start: function() {
        cc.director.setDisplayStats(!1), this.initButtonHandler("Canvas/b_begin"), this.initButtonHandler("Canvas/b_find"), 
        t.addEvent("event_ready", this.waitEnterGame), this.exit = this.node.getChildByName("exit"), 
        this.showEffet();
    },
    showEffet: function() {
        var n = cc.moveBy(.5, 0, -20), e = cc.moveBy(.5, 0, 20);
        this.exit.runAction(cc.repeatForever(cc.sequence(n, e)));
    },
    onOpenEWM: function() {
        wx.previewImage({
            urls: [ "https://h5game.gametall.com/chatgame/cocos_games_res/images/codeImage.jpg" ]
        });
    },
    playGame: function() {
        cc.director.loadScene("MazeGame_Main");
    },
    initButtonHandler: function(n) {
        var e = cc.find(n);
        this.addClickEvent(e, this.node, "MazeGame_Start", "onBtnClicked");
    },
    addClickEvent: function(a, e, t, i) {
        console.log(t + ":" + i);
        var r = new cc.Component.EventHandler();
        r.target = e, r.component = t, r.handler = i, a.getComponent(cc.Button).clickEvents.push(r);
    },
    onBtnClicked: function(t) {
        "b_begin" == t.target.name ? (console.log("b_begin"), this.onGameBegin()) : "b_find" == t.target.name && (console.log("b_find"), 
        this.onGameFindFriend());
    },
    onGameBegin: function() {
        cc.audioEngine.play(this.eventSound, !1, 1), cc.g_Game.userList = [], cc.g_Game.b_isAI = !0, 
        cc.director.loadScene("MazeGame_Main");
    },
    onGameFindFriend: function() {
        null == cc.g_Game.ws && (cc.g_Game.b_isAI = !1, console.log("onGameFindFriend"), 
        this.s_loading = "等待进入游戏...", o.CreateWebSocket({
            agreement: "ws",
            address: "47.96.144.235",
            port: "3300"
        }));
    },
    waitEnterGame: function() {}
});

window.isWeChat = function() {
    return "undefined" != typeof wx;
}