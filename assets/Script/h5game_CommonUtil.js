module.exports = {
    showTips: function(e, a) {
        cc.loader.loadRes("common/prefabs/h5game_Tips", function(n, r) {
            if (n) cc.error(n); else {
                var t = cc.instantiate(r);
                t.getComponent("h5game_Tips").setText(e, a), t.parent = cc.director.getScene();
            }
        });
    },
    shakeScreen: function(n) {
        var e = .02, t = n;
        t.stopAllActions(), t.runAction(cc.sequence(cc.moveBy(e, cc.p(20, 0)), cc.moveBy(.04, cc.p(-40)), cc.moveBy(e, cc.p(20)), cc.moveBy(e, cc.p(0, 20)), cc.moveBy(.04, cc.p(0, -40)), cc.moveBy(e, cc.p(0, 20)), cc.moveBy(e, cc.p(10, 0)), cc.moveBy(.04, cc.p(-20, 0)), cc.moveBy(e, cc.p(10, 0)), cc.moveBy(e, cc.p(0, 10)), cc.moveBy(.04, cc.p(0, -20)), cc.moveBy(e, cc.p(0, 10))));
    },
    getResolutionPolicy: function() {
        return cc.ResolutionPolicy.SHOW_ALL;
    },
    backToReadyGo: function() {
        console.log("cc.miroGame.launchParams", cc.miroGame.launchParams, cc.miroGame);
        var t = cc.miroGame.launchParams.serverHost + "/game/server/getGameFinishUrl";
        Http.get(t, function(n) {
            var e = n.data.address;
            window.location.href = e, window.open(e);
        });
    },
    showAD: function() {},
    imgStr: function(t) {
        return t;
    },
    txtStr: function(t) {
        return t;
    },
    getLaunchParams: function() {
        if (cc.sys.isNative) return null;
        if (isWeChat()) {
            var n = wx.getLaunchOptionsSync().query;
            return n.token && n.userId && n.gameId && n.serverHost ? n : window.query;
        }
        var e = window.location.href, t = null, a = e.lastIndexOf("?");
        return 0 <= a && (t = e.substring(a)), function(a) {
            if (!a) return null;
            for (var o, n = {}, t = (a = a.substr(1)).split("&"), i = 0; i < t.length; i++) o = t[i].split("="),
            n[o[0]] = o[1];
            return n.token && n.userId && n.gameId && n.serverHost ? n : null;
        }(t);
    }
}
