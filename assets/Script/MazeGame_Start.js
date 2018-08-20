cc.miroGame = {};
cc.miroGame.initData = function(list_data) {
    cc.miroGame.userList = list_data,
        cc.miroGame.userId = "",
        cc.miroGame.score = [ 0, 0 ],
        cc.miroGame.game_state = 0,
        cc.miroGame.b_isAI = !1,
        cc.miroGame.game_data = -1,
        cc.miroGame.seed = -1,
        cc.miroGame.state = !0,
        cc.miroGame.Info = [],
        cc.miroGame.selfOnline = !1;
};
cc.miroGame.initUserList = function(init_list) {
    cc.miroGame.userList = init_list;
};

window.query = null;
window.onShow = !1;

require("MazeGame_Ping");
require("base64");

var net_state = require("MazeGame_Net"),
    event = require("cb");

window.CommonUtil = require("h5game_CommonUtil");
window.Http = require("h5game_Http");


cc.Class({
    extends: cc.Component,
    properties: {
        eventSound: cc.AudioClip
    },
    onLoad: function() {
        cc.miroGame.that = this;
        cc.miroGame.initData([]);
        cc.miroGame.launchParams = CommonUtil.getLaunchParams();
        cc.miroGame.launchParams && (cc.miroGame.launchParams.serverHost = Base64.fromBase64(cc.miroGame.launchParams.serverHost));
        // cc.miroGame.launchParams && console.log("997", cc.miroGame.launchParams),
        cc.miroGame.launchParams ?
            (
                "fake" == cc.miroGame.launchParams.token.substring(0, 4) ?
                    (
                        cc.miroGame.userList = [],
                            cc.miroGame.userId = cc.miroGame.launchParams.userId, cc.miroGame.b_isAI = !0
                    )
                    :
                    (
                        cc.miroGame.userList = [],
                            cc.miroGame.userId = cc.miroGame.launchParams.userId, cc.miroGame.b_isAI = !1
                    ),
                    cc.director.loadScene("MatchingScene"),
                    this.node.opacity = 0
            )
            :
            (
                cc.miroGame.userList = [], cc.miroGame.b_isAI = !0, cc.miroGame.is_single = !0,
                !net_state.isConnect && isWeChat() && wx.showShareMenu({
                    withShareTicket: !0
                })
            );
        var mainScene = cc.director.getScene().getComponentInChildren(cc.Canvas),
            viewSize = cc.view.getVisibleSize();
        viewSize.width / viewSize.height < 9 / 16 ?
            (mainScene.fitWidth = !0, mainScene.fitHeight = !1)
            :
            (mainScene.fitWidth = !1, mainScene.fitHeight = !0);
        var windowSize = cc.director.getWinSize(),
            backgroundSize = cc.find("s_backgoud", this.node);
        backgroundSize.width = windowSize.width,
        backgroundSize.height = windowSize.height;
    },
    onEnable: function() {},
    onDisable: function() {},
    start: function() {
        cc.director.setDisplayStats(!1);
        this.initButtonHandler("Canvas/b_begin");
        this.initButtonHandler("Canvas/b_find");
        event.addEvent("event_ready", this.waitEnterGame);
        this.exit = this.node.getChildByName("exit");
        this.showEffet();
    },
    showEffet: function() {
        var top = cc.moveBy(.5, 0, -20),
            bottom = cc.moveBy(.5, 0, 20);
        this.exit.runAction(cc.repeatForever(cc.sequence(top, bottom)));
    },
    onOpenEWM: function() {
        wx.previewImage({
            urls: [ "https://h5game.gametall.com/chatgame/cocos_games_res/images/codeImage.jpg" ]
        });
    },
    playGame: function() {
        cc.director.loadScene("MazeGame_Main");
    },
    initButtonHandler: function(button_name) {
        var button_object = cc.find(button_name);
        this.addClickEvent(button_object, this.node, "MazeGame_Start", "onBtnClicked");
    },
    addClickEvent: function(btn, node, scene, clickevent) {
        var btn_handle = new cc.Component.EventHandler();
        btn_handle.target = node;
        btn_handle.component = scene;
        btn_handle.handler = clickevent;
        btn.getComponent(cc.Button).clickEvents.push(btn_handle);
    },
    onBtnClicked: function(btn_obj) {
        "b_begin" == btn_obj.target.name ?
            (this.onGameBegin())
            :
            "b_find" == btn_obj.target.name && this.onGameFindFriend();
    },
    onGameBegin: function() {
        cc.audioEngine.play(this.eventSound, !1, 1);
        cc.miroGame.userList = [];
        cc.miroGame.b_isAI = !0;
        cc.director.loadScene("MazeGame_Main");
    },
    onGameFindFriend: function() {
        null == cc.miroGame.ws && (
            cc.miroGame.b_isAI = !1,

            this.s_loading = "等待进入游戏...",

            net_state.CreateWebSocket({
                agreement: "ws",
                address: "47.96.144.235",
                port: "3300"
            })
        );
    },
    waitEnterGame: function() {}
});

window.isWeChat = function() {
    return "undefined" != typeof wx;
};
