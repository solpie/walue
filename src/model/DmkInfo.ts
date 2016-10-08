var ProtoBuf = require("protobufjs");
var builder = ProtoBuf.newBuilder({convertFieldsToCamelCase: true});
ProtoBuf.loadProtoFile("resources/app/static/pb/live_websocket.proto", builder);
var Message = builder.build("Message"); // Build the Message namespace
var Danmaku = builder.build("Danmaku"); // Build the Message namespace
// var dmk = new root.LiveEventBroadcast();
// console.log('dmk pb', dmk);
export var packDmk = (content, user)=> {
    var dmkMsg = new Danmaku();
    dmkMsg.content = content;
    // dmkMsg.encode().toArrayBuffer();
    var msg = new Message();
    msg.content = dmkMsg.encode().toArrayBuffer();
    msg.type = 20;
    msg.timestamp = new Date().getTime();
    // dmkMsg.user.id = user.id;
    // dmkMsg.user.avatar = user.avatar;
    // dmkMsg.user.displayName = user.displayName;
    var byteBuffer = msg.encode();
    return byteBuffer.toArrayBuffer();
};

export var decodeMsg = (msgBuf)=> {
    var msg = Message.decode(msgBuf);
    // console.log(msg);
    if (msg.type == 20) {
        var dmk = Danmaku.decode(msg.content);
        // console.log(dmk);
        return dmk.content;
    }
};

export class Danmaku2 {
    content: string;
    id: string;
    avatar: string;
    displayName: string;

    constructor() {

    }

    pack() {

    }
}