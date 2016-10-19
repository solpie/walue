import {EventDispatcher} from "../utils/EventDispatcher";
export enum CommandId{
    ShowConsoleWin = 100000
}
class CommandItem {
    id: number;
    name: string;
    desc: string;

    constructor(id) {
        this.id = id;
    }
}
export class Command extends EventDispatcher {
    cmdArr: Array<CommandItem>;

    constructor() {
        super();
        // this.cmdArr = [];
        // for (var k in CommandId) {
        //     CommandId[k] = k;
        // }
        console.log("CommandId", CommandId);
    }

}

