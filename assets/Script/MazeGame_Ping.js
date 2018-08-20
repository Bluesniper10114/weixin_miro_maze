var t = require("MazeGame_Net");
"undefined" != typeof wx && (wx.onShow(function(n) {
    console.log("==========wx SHOW==============", n.query, cc.g_Game.is_single, window.onShow);
    var e = n.query;
    e.token && e.userId && e.gameId && !window.onShow && (wx.hideShareMenu(), window.query = e, 
    window.onShow = !0, console.log("window.query", window.query), cc.director.loadScene("MazeGame_Start"));
}), wx.onHide(function() {
    console.log("exitMiniProgram", cc.g_Game.launchParams), t.MsgRetweetData(t.EMENY_OUT_ONLINE, 1), 
    isWeChat() && cc.g_Game.launchParams && wx.exitMiniProgram({});
}))