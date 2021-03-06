module.exports = require("protobufjs").newBuilder({}).import({
    package: "games",
    syntax: "proto2",
    messages: [ {
        name: "Extend",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "key",
            id: 1
        }, {
            rule: "required",
            type: "string",
            name: "value",
            id: 2
        } ]
    }, {
        name: "MsgEnterRoomReq",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "userId",
            id: 1
        }, {
            rule: "required",
            type: "string",
            name: "token",
            id: 2
        }, {
            rule: "required",
            type: "int32",
            name: "gameTypeId",
            id: 3
        }, {
            rule: "repeated",
            type: "Extend",
            name: "extend",
            id: 4
        } ]
    }, {
        name: "MsgEnterRoomAck",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "int32",
            name: "result",
            id: 1
        }, {
            rule: "required",
            type: "double",
            name: "time",
            id: 2
        }, {
            rule: "optional",
            type: "string",
            name: "roomMode",
            id: 3
        } ]
    }, {
        name: "UserInfo",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "userId",
            id: 1
        }, {
            rule: "required",
            type: "string",
            name: "name",
            id: 2
        }, {
            rule: "required",
            type: "string",
            name: "gender",
            id: 3
        }, {
            rule: "required",
            type: "string",
            name: "avatarUrl",
            id: 4
        }, {
            rule: "required",
            type: "string",
            name: "locationInfo",
            id: 5
        }, {
            rule: "required",
            type: "bool",
            name: "isAI",
            id: 6
        }, {
            rule: "repeated",
            type: "Extend",
            name: "extend",
            id: 7
        } ]
    }, {
        name: "MsgUserListAck",
        syntax: "proto2",
        fields: [ {
            rule: "repeated",
            type: "UserInfo",
            name: "userList",
            id: 1
        } ]
    }, {
        name: "MsgUserScoreReq",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "userId",
            id: 1
        }, {
            rule: "required",
            type: "int32",
            name: "score",
            id: 2
        }, {
            rule: "required",
            type: "double",
            name: "time",
            id: 3
        } ]
    }, {
        name: "MsgServerPing",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "int32",
            name: "id",
            id: 1
        } ]
    }, {
        name: "MsgNonsenseAck",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "data",
            id: 1
        } ]
    }, {
        name: "MsgNotifyCommonAck",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "type",
            id: 1
        }, {
            rule: "required",
            type: "string",
            name: "msg",
            id: 2
        } ]
    }, {
        name: "UserGameResult",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "userId",
            id: 1
        }, {
            rule: "required",
            type: "int32",
            name: "score",
            id: 2
        }, {
            rule: "required",
            type: "string",
            name: "status",
            id: 3
        } ]
    }, {
        name: "MsgGameResultAck",
        syntax: "proto2",
        fields: [ {
            rule: "required",
            type: "string",
            name: "type",
            id: 1
        }, {
            rule: "repeated",
            type: "UserGameResult",
            name: "userGameResultList",
            id: 2
        } ]
    } ],
    isNamespace: !0
}).build();