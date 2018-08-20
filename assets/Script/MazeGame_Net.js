var d = require("./message/games.message").games, 
    s = require("./message/msgdef"), 
    a = require("bytebuffer"), 
    g = require("./utils/cb"), 
    u = {
        MID_GAME_START: 1,
        MID_SELECT_RET: 2,
        MID_MAINSCENE_START: 8,
        MID_ASK_MAIN_READY: 9,
        isAnswer: !1,
        MID_SELECT_RET_Number_Received: 0,
        MID_SELECT_RET_Number_send: 0,
        EMENY_OUT_ONLINE: 10,
        SELF_READY: 11,
        isGameOver: !1,
    }, l = 3;

u.Send = function(o, e) {
    if (0 != cc.g_Game.game_state && null != cc.g_Game.ws) {
        var t = e ? e.byteLength : 0, i = 0;
        o == s.GAME_MSG_RETWEET_DATA_REQ && (i = 8, t += 14);
        var r = new a(6 + t, !0);
        r.writeUint32(t + 2 + i, 0), r.writeUint16(o, 4), i && r.writeDouble(new Date().getTime() + u.deltaTime, 6), 
        e && r.append(e, 6 + i), cc.g_Game.ws.send(r.buffer);
    }
}, u.MsgRetweetData = function(n, e) {
    if (0 != cc.g_Game.game_state) {
        var t = new a(12, !0), i = 0;
        t.writeUint32(6, i), i += 4, t.writeUint16(s.GAME_MSG_RETWEET_DATA_REQ, i), i += 2, 
        t.writeUint16(n, i), i += 2, t.writeInt32(e, i), console.log("send MsgRetweetData", n, e, t.buffer.byteLength), 
        u.Send(s.GAME_MSG_RETWEET_DATA_REQ, t.buffer), 2 == n && (u.MID_SELECT_RET_Number_send++, 
        console.log("MID_SELECT_RET_Number_send", u.MID_SELECT_RET_Number_send));
    }
}, u.MsgUserScoreReq = function(n, a) {
    if (0 != cc.g_Game.game_state) {
        var o = {
            userId: n,
            score: a,
            time: u.deltaTime + new Date().getTime()
        }, i = new d.MsgUserScoreReq(o);
        i = i.encode().toBuffer(), console.log("send MsgUserScoreReq", o), u.Send(s.GAME_MSG_USER_SCORE_REQ, i);
    }
}, u.OverGame = function() {
    0 != cc.g_Game.game_state && (cc.g_Game.state = !1, console.log("send OverGame"), 
    u.Send(s.GAME_MSG_OVER_GAME_REQ));
}, u.GAME_MSG_ENTER_ROOM_ACK = function(n) {
    var e = d.MsgEnterRoomAck.decode(n);
    console.log("recv GAME_MSG_ENTER_ROOM_ACK", e), 0 == e.result && (cc.g_Game.game_state = 2), 
    e.time && (u.deltaTime = e.time - new Date().getTime()), u.isConnect = !0, u.connectDead = 0, 
    u.setIntervalID = setInterval(function() {
        if (u.isConnect) u.isConnect = !1, u.connectDead = 0; else if (u.connectDead++, 
        5 == u.connectDead && (console.log("与服务器断开，请检查你的网络"), !u.isGameOver)) return u.OverGame(), 
        void cc.g_Game.that.openGameResult(-1);
    }, 1e3), console.log("开启定时器Net.setIntervalID=", u.setIntervalID);
}, u.GAME_MSG_USER_LIST_ACK = function(n) {
    var e = d.MsgUserListAck.decode(n);
    if (console.log("recv player data玩家列表改动", e), 1 == e.userList.length) {
        if (cc.g_Game.game_state == l) return cc.g_Game.state = !1, g.dispatchEvent("Enemy_outoLine", [ 0 ]), 
        void u.OverGame();
        if (4 <= cc.g_Game.game_state) return u.OverGame(), void cc.g_Game.that.openGameResult(1);
    }
    cc.g_Game.initUserList(e.userList), cc.g_Game.b_isAI = 2 > e.userList.length, 2 <= e.userList.length && (cc.g_Game.b_isAI = e.userList[0].isAI || e.userList[1].isAI);
    for (var t, a = 0; a < e.userList.length; a++) t = e.userList[a], console.log(t.name, t.userId, t.gender);
    4 != cc.g_Game.game_state && (cc.g_Game.game_state = l, u.MsgRetweetData(u.MID_GAME_START, -1), 
    g.dispatchEvent("event_ready", [ 0 ]));
}, u.GAME_MSG_USER_SCORE_REQ = function(t) {
    d.MsgUserScoreReq.decode(t), console.log("recv score data", t);
}, u.GAME_MSG_RETWEET_DATA = function(a) {
    var e, t, i = a.readUInt16(0), r = a.readInt32(2);
    if (console.log("recv retweet data", i, r), 2 == i && (u.MID_SELECT_RET_Number_Received++, 
    console.log("MID_SELECT_RET_Number_Received", u.MID_SELECT_RET_Number_Received)), 
    t = r, (e = i) == u.MID_GAME_START && cc.g_Game.game_state == l ? -1 == t ? (cc.g_Game.game_data = Math.floor(10 * Math.random() + 1), 
    u.MsgRetweetData(u.MID_GAME_START, cc.g_Game.game_data)) : cc.g_Game.game_data = t : e == u.MID_SELECT_RET ? g.dispatchEvent("event_select", [ t ]) : e == u.EMENY_OUT_ONLINE ? (cc.g_Game.state = !1, 
    g.dispatchEvent("Enemy_outoLine", [ 0 ])) : e == u.SELF_READY && g.dispatchEvent("Emeny_loading", [ 0 ]), 
    i == u.MID_ASK_MAIN_READY) {
        var n = cc.g_Game.that;
        cc.g_Game.userId == cc.g_Game.userList[0].userId ? n.s_myName && "玩家1" == n.s_myName && (console.log("主机收到询问回应"), 
        n.tongBuOver()) : n.s_myName && "玩家1" == n.s_myName && 0 == u.isAnswer && (console.log("客机收到询问"), 
        u.MsgRetweetData(u.MID_ASK_MAIN_READY, 1), u.isAnswer = !0);
    }
    i == u.MID_MAINSCENE_START && (cc.g_Game.seed = r, (n = cc.g_Game.that).myInit(), 
    console.log("Net收到随机数种子that=", n));
}, u.MsgEnterRoomReq = function() {
    if (0 != cc.g_Game.game_state) {
        var a = "", e = "pvp", l = cc.g_Game.launchParams.token, i = cc.g_Game.launchParams.userId;
        "" != l && "" != i ? (e = l, a = i) : (a = "mwdLdFS9", e = "standalone1"), console.log("userId", e, a);
        var r = {
            userId: cc.g_Game.userId = a,
            token: e,
            gameTypeId: parseInt(cc.g_Game.launchParams.gameId)
        };
        console.log("send MsgEnterRoomReq", r);
        var n = new d.MsgEnterRoomReq(r);
        n = n.encode().toBuffer(), console.log("length", n.byteLength), u.Send(s.GAME_MSG_ENTER_ROOM_REQ, n);
    }
}, u.GAME_MSG_SERVER_PING = function(n) {
    u.isConnect = !0;
    var e = {
        id: d.MsgServerPing.decode(n).id
    }, t = new d.MsgServerPing(e);
    t = t.encode().toBuffer(), u.Send(s.GAME_MSG_SERVER_PING, t);
}, u.GAME_MSG_GAME_RESULT_ACK = function(n) {
    var e = d.MsgGameResultAck.decode(n);
    console.log("返回结果", e);
}, u.CloseWebSocket = function() {
    0 != cc.g_Game.game_state && null != cc.g_Game.ws && (cc.g_Game.ws = null, cc.g_Game.state = !1, 
    u.isGameOver = !0, console.log("清除定时器Net.setIntervalID=", u.setIntervalID), clearInterval(u.setIntervalID));
}, u.CreateWebSocket = function(t) {
    console.log("url", t), cc.g_Game.ws = new WebSocket(t), cc.g_Game.ws.binaryType = "arraybuffer", 
    cc.g_Game.ws.onopen = function() {
        console.log("connection open ..."), cc.g_Game.game_state = 1, u.MsgEnterRoomReq();
    }, cc.g_Game.ws.onmessage = function(d) {
        var e = d.data, t = e.byteLength;
        (d = new a(t, !0)).append(e, 0);
        var i = d.readUInt32(0), r = d.readUInt16(4), n = null;
        0 < i && (n = d.copy(6)), s.GAME_MSG_SERVER_PING, r == s.GAME_MSG_SERVER_PING && cc.g_Game.game_state == l && u.MsgRetweetData(u.SELF_READY, 1), 
        u.msghandle[r](n);
    }, cc.g_Game.ws.onclose = function() {
        console.log("Connection closed."), cc.g_Game.state && g.dispatchEvent("Self_outoLine", [ 0 ]), 
        u.CloseWebSocket(), cc.g_Game.game_state = 0;
    };
}, u.msghandle = {}, u.msghandle[s.GAME_MSG_ENTER_ROOM_ACK] = u.GAME_MSG_ENTER_ROOM_ACK, 
u.msghandle[s.GAME_MSG_USER_LIST_ACK] = u.GAME_MSG_USER_LIST_ACK, u.msghandle[s.GAME_MSG_USER_SCORE_REQ] = u.GAME_MSG_USER_SCORE_REQ, 
u.msghandle[s.GAME_MSG_SERVER_PING] = u.GAME_MSG_SERVER_PING, u.msghandle[s.GAME_MSG_GAME_RESULT_ACK] = u.GAME_MSG_GAME_RESULT_ACK, 
u.msghandle[s.GAME_MSG_RETWEET_DATA_REQ] = u.GAME_MSG_RETWEET_DATA, 
module.exports = u;