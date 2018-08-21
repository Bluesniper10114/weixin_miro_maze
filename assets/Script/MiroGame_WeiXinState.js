var netState = require("MiroGame_NetState");

"undefined" != typeof wx && (
    wx.onShow(function(common_window) {
        // console.log("==========wx SHOW==============", common_window.query, cc.miroGame.is_single, window.onShow);
        var window_query = common_window.query;
        window_query.token && window_query.userId && window_query.gameId && !window.onShow && (wx.hideShareMenu(),
        window.query = window_query,
        window.onShow = !0,
        cc.director.loadScene("MiroGame_Landing"));
    }),

    wx.onHide(function() {
        netState.MsgRetweetData(netState.EMENY_OUT_ONLINE, 1);
        isWeChat() && cc.miroGame.launchParams && wx.exitMiniProgram({});
    })
);
