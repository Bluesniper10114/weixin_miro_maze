module.exports = {
    showTips: function(_cell, _val) {
        cc.loader.loadRes("common/prefabs/h5game_Tips", function(res, _data) {
            if (res) cc.error(res); else {
                var _instance = cc.instantiate(_data);
                _instance.getComponent("h5game_Tips").setText(_cell, _val);
                _instance.parent = cc.director.getScene();
            }
        });
    },
    shakeScreen: function(obj) {
        var s_val = .02, shake_obj = obj;
        shake_obj.stopAllActions(),
        shake_obj.runAction(cc.sequence(cc.moveBy(s_val, cc.p(20, 0)), cc.moveBy(.04, cc.p(-40)), cc.moveBy(s_val, cc.p(20)), cc.moveBy(s_val, cc.p(0, 20)), cc.moveBy(.04, cc.p(0, -40)), cc.moveBy(s_val, cc.p(0, 20)), cc.moveBy(s_val, cc.p(10, 0)), cc.moveBy(.04, cc.p(-20, 0)), cc.moveBy(s_val, cc.p(10, 0)), cc.moveBy(s_val, cc.p(0, 10)), cc.moveBy(.04, cc.p(0, -20)), cc.moveBy(s_val, cc.p(0, 10))));
    },
    getResolutionPolicy: function() {
        return cc.ResolutionPolicy.SHOW_ALL;
    },
    backToReadyGo: function() {
        var host_url = cc.miroGame.launchParams.serverHost + "/game/server/getGameFinishUrl";

        Http.get(host_url, function(res) {
            var addr = res.data.address;
            window.location.href = addr, window.open(addr);
        });
    },
    showAD: function() {},
    imgStr: function(_val) {
        return _val;
    },
    txtStr: function(_val) {
        return _val;
    },
    getLaunchParams: function() {
        if (cc.sys.isNative) return null;
        if (isWeChat()) {
            var wx_sync_query = wx.getLaunchOptionsSync().query;
            return wx_sync_query.token && wx_sync_query.userId && wx_sync_query.gameId && wx_sync_query.serverHost ? wx_sync_query : window.query;
        }
        var current_url = window.location.href,
            _str = null,
            ques_pos = current_url.lastIndexOf("?");
        return 0 <= ques_pos && (_str = current_url.substring(ques_pos)), function(str_val) {
            if (!str_val) return null;
            for (var o, n = {}, t = (str_val = str_val.substr(1)).split("&"), i = 0; i < t.length; i++) o = t[i].split("="),
            n[o[0]] = o[1];
            return n.token && n.userId && n.gameId && n.serverHost ? n : null;
        }(_str);
    }
};
