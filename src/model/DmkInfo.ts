var ProtoBuf = require("protobufjs");
var builder = ProtoBuf.newBuilder({convertFieldsToCamelCase: true});
ProtoBuf.loadProtoFile("resources/app/static/pb/live_websocket.proto", builder);
var root = builder.build();
var dmk = new root.LiveEventBroadcast();
console.log('dmk pb', dmk);
export var packDmk = (content, user)=> {
    var dmkMsg = new root.Danmaku();
    dmkMsg.content = content;
    dmkMsg.user.id = user.id;
    dmkMsg.user.avatar = user.avatar;
    dmkMsg.user.displayName = user.displayName;
    return dmkMsg;
};
export class Danmaku {
    content: string;
    id: string;
    avatar: string;
    displayName: string;
    constructor() {

    }

    pack() {

    }
}