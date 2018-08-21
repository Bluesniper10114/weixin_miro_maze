var game_message = require("./message/games.message").games,
    message_def = require("./message/msgdef"),
    byte_buffer = require("bytebuffer"),
    event = require("./utils/cb"),
    game_net = {
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
    },
    state_data = 3;

game_net.CreateWebSocket = function(socket_data) {
    cc.miroGame.ws = new WebSocket(socket_data),
        cc.miroGame.ws.binaryType = "arraybuffer",
        cc.miroGame.ws.onopen = function() {
            cc.miroGame.game_state = 1;
            game_net.MsgEnterRoomReq();
        };
    cc.miroGame.ws.onmessage = function(msg_data) {
        var on_msg = msg_data.data,
            msg_len = on_msg.byteLength;
        (msg_data = new byte_buffer(msg_len, !0)).append(on_msg, 0);

        var msg_uint32 = msg_data.readUInt32(0),
            msg_uint16 = msg_data.readUInt16(4),
            msg_copy = null;

        0 < msg_uint32 && (msg_copy = msg_data.copy(6));
        message_def.GAME_MSG_SERVER_PING;
        msg_uint16 == message_def.GAME_MSG_SERVER_PING && cc.miroGame.game_state == state_data && game_net.MsgRetweetData(game_net.SELF_READY, 1);
        game_net.msghandle[msg_uint16](msg_copy);
    };

    cc.miroGame.ws.onclose = function() {
        cc.miroGame.state && event.dispatchEvent("Self_outoLine", [ 0 ]);
        game_net.CloseWebSocket();
        cc.miroGame.game_state = 0;
    };
};

game_net.CloseWebSocket = function() {
    0 != cc.miroGame.game_state && null != cc.miroGame.ws && (
        cc.miroGame.ws = null, cc.miroGame.state = !1,
            game_net.isGameOver = !0,
            clearInterval(game_net.setIntervalID)
    );
};

game_net.MsgEnterRoomReq = function() {
    if (0 != cc.miroGame.game_state) {
        var game_token = "", game_id = "pvp",
            user_token = cc.miroGame.launchParams.token, user_id = cc.miroGame.launchParams.userId;
        "" != user_token && "" != user_id ? (game_id = user_token, game_token = user_id) : (game_token = "mwdLdFS9", game_id = "standalone1");
        var game_data = {
            userId: cc.miroGame.userId = game_token,
            token: game_id,
            gameTypeId: parseInt(cc.miroGame.launchParams.gameId)
        };

        var game_message = new game_message.MsgEnterRoomReq(game_data);
        game_message = game_message.encode().toBuffer();
        game_net.Send(message_def.GAME_MSG_ENTER_ROOM_REQ, game_message);
    }
};

game_net.MsgRetweetData = function(unit_data, data) {
    if (0 != cc.miroGame.game_state) {
        var t = new byte_buffer(12, !0), i = 0;
        t.writeUint32(6, i);
        i += 4;
        t.writeUint16(message_def.GAME_MSG_RETWEET_DATA_REQ, i);
        i += 2;
        t.writeUint16(unit_data, i);
        i += 2;
        t.writeInt32(data, i);

        game_net.Send(message_def.GAME_MSG_RETWEET_DATA_REQ, t.buffer);

        2 == unit_data && game_net.MID_SELECT_RET_Number_send++;
    }
};

game_net.MsgUserScoreReq = function(user_id, score_point) {
    if (0 != cc.miroGame.game_state) {
        var msg_data = {
                userId: user_id,
                score: score_point,
                time: game_net.deltaTime + new Date().getTime()
            },
            user_score = new game_message.MsgUserScoreReq(msg_data);
        user_score = user_score.encode().toBuffer();
        game_net.Send(message_def.GAME_MSG_USER_SCORE_REQ, user_score);
    }
};

game_net.GAME_MSG_USER_LIST_ACK = function(ack_data) {
    var decode_data = game_message.MsgUserListAck.decode(ack_data);

    if (1 == decode_data.userList.length) {
        if (cc.miroGame.game_state == state_data)
            return cc.miroGame.state = !1,
                event.dispatchEvent("Enemy_outoLine", [ 0 ]),
                void game_net.OverGame();
        if (4 <= cc.miroGame.game_state)
            return game_net.OverGame(),
                void cc.miroGame.that.openGameResult(1);
    }

    cc.miroGame.initUserList(decode_data.userList);
    cc.miroGame.b_isAI = 2 > decode_data.userList.length;

    2 <= decode_data.userList.length && (cc.miroGame.b_isAI = decode_data.userList[0].isAI || decode_data.userList[1].isAI);

    for (var t, a = 0; a < decode_data.userList.length; a++) t = decode_data.userList[a];

    4 != cc.miroGame.game_state && (
        cc.miroGame.game_state = state_data, game_net.MsgRetweetData(game_net.MID_GAME_START, -1),
            event.dispatchEvent("event_ready", [ 0 ])
    );
};

game_net.GAME_MSG_USER_SCORE_REQ = function(msg_data) {
    game_message.MsgUserScoreReq.decode(msg_data);
};

game_net.GAME_MSG_SERVER_PING = function(msg_data) {
    game_net.isConnect = !0;
    var data_id = {
            id: game_message.MsgServerPing.decode(msg_data).id
        },
        game_msg = new game_message.MsgServerPing(data_id);
    game_msg = game_msg.encode().toBuffer();
    game_net.Send(message_def.GAME_MSG_SERVER_PING, game_msg);
};

game_net.GAME_MSG_ENTER_ROOM_ACK = function(ack_data) {
    var decode_data = game_message.MsgEnterRoomAck.decode(ack_data);

    0 == decode_data.result && (cc.miroGame.game_state = 2);
    decode_data.time && (game_net.deltaTime = decode_data.time - new Date().getTime());
    game_net.isConnect = !0, game_net.connectDead = 0;
    game_net.setIntervalID = setInterval(function() {
        if (game_net.isConnect) game_net.isConnect = !1, game_net.connectDead = 0;
        else if (
            game_net.connectDead++,
            5 == game_net.connectDead && !game_net.isGameOver
        )
            return game_net.OverGame(),
                void cc.miroGame.that.openGameResult(-1);
    }, 1e3);
};

game_net.GAME_MSG_GAME_RESULT_ACK = function(game_data) {
    var result_ack = game_message.MsgGameResultAck.decode(game_data);
};

game_net.GAME_MSG_RETWEET_DATA = function(msg_data) {
    var tmp_1, tmp_2,
        data_uint = msg_data.readUInt16(0),
        data_int = msg_data.readInt32(2);
    if (
        2 == data_uint && game_net.MID_SELECT_RET_Number_Received++,
            tmp_2 = data_int,
            (tmp_1 = data_uint) == game_net.MID_GAME_START && cc.miroGame.game_state == state_data ? -1 == tmp_2 ? (cc.miroGame.game_data = Math.floor(10 * Math.random() + 1),
                game_net.MsgRetweetData(game_net.MID_GAME_START, cc.miroGame.game_data)) : cc.miroGame.game_data = tmp_2 : tmp_1 == game_net.MID_SELECT_RET ? event.dispatchEvent("event_select", [ tmp_2 ]) : tmp_1 == game_net.EMENY_OUT_ONLINE ? (cc.miroGame.state = !1,
                event.dispatchEvent("Enemy_outoLine", [ 0 ])) : tmp_1 == game_net.SELF_READY && event.dispatchEvent("Emeny_loading", [ 0 ]),
        data_uint == game_net.MID_ASK_MAIN_READY
    ) {
        var game_that = cc.miroGame.that;
        cc.miroGame.userId == cc.miroGame.userList[0].userId
            ?
            game_that.s_myName && "玩家1" == game_that.s_myName && game_that.miroTBover()
            :
            game_that.s_myName && "玩家1" == game_that.s_myName && 0 == game_net.isAnswer && game_net.MsgRetweetData(game_net.MID_ASK_MAIN_READY, 1), game_net.isAnswer = !0;
    }

    data_uint == game_net.MID_MAINSCENE_START && (
        cc.miroGame.seed = data_int, (game_that = cc.miroGame.that).fistInit()
    );
};

game_net.OverGame = function() {
    0 != cc.miroGame.game_state && (cc.miroGame.state = !1, game_net.Send(message_def.GAME_MSG_OVER_GAME_REQ));
};

game_net.Send = function(msg_req, data) {
    if (0 != cc.miroGame.game_state && null != cc.miroGame.ws) {
        var len = data ? data.byteLength : 0, i = 0;

        msg_req == message_def.GAME_MSG_RETWEET_DATA_REQ && (i = 8, len += 14);

        var byte_data = new byte_buffer(6 + len, !0);

        byte_data.writeUint32(len + 2 + i, 0);
        byte_data.writeUint16(msg_req, 4);

        i && byte_data.writeDouble(new Date().getTime() + game_net.deltaTime, 6);
        data && byte_data.append(data, 6 + i);
        cc.miroGame.ws.send(byte_data.buffer);
    }
};

game_net.msghandle = {};
game_net.msghandle[message_def.GAME_MSG_ENTER_ROOM_ACK] = game_net.GAME_MSG_ENTER_ROOM_ACK;
game_net.msghandle[message_def.GAME_MSG_USER_LIST_ACK] = game_net.GAME_MSG_USER_LIST_ACK;
game_net.msghandle[message_def.GAME_MSG_USER_SCORE_REQ] = game_net.GAME_MSG_USER_SCORE_REQ;
game_net.msghandle[message_def.GAME_MSG_SERVER_PING] = game_net.GAME_MSG_SERVER_PING;
game_net.msghandle[message_def.GAME_MSG_GAME_RESULT_ACK] = game_net.GAME_MSG_GAME_RESULT_ACK;
game_net.msghandle[message_def.GAME_MSG_RETWEET_DATA_REQ] = game_net.GAME_MSG_RETWEET_DATA;

module.exports = game_net;
