import {monitorModel} from "./MonitorModel";
const {remote} = require('electron');
const {Menu, MenuItem} = remote;
declare var window;
export class MenuModel {
    menu;

    constructor() {
        // this.buildMenu();
    }

    buildMenu(topicItem?) {
        // if (!this.menu) {
        var menu = new Menu();
        this.menu = menu;
        // }
        // else {
        //     while (this.menu.popup()) {
        //
        //     }
        // }

        if (!topicItem)
            topicItem = new MenuItem({
                label: '话题', click() {
                    console.log('item 1 clicked');
                }
            });
        menu.append(topicItem);
        menu.append(new MenuItem({type: 'separator'}));
        menu.append(new MenuItem({
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload()
                    }
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click (item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                    }
                },
                {
                    type: 'separator'
                },
                {
                    role: 'resetzoom'
                },
                {
                    role: 'zoomin'
                },
                {
                    role: 'zoomout'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'togglefullscreen'
                }
            ]
        }));
        window.setMenu(menu);
    }

    setTopicArr(topicArr) {
        var for1 = (idx, topicArr)=> {
            if (idx < topicArr.length) {
                monitorModel.getLive(topicArr[idx].id, (roomArr)=> {
                    topicArr[idx].roomArr = roomArr;
                    for (var k = 0; k < roomArr.length; k++) {
                        var roomInfo = roomArr[k];
                        var urlLen = roomInfo.rtmp.length;
                        roomInfo.shortUrl = roomInfo.rtmp.substr(0, 30)
                            + "..." + roomInfo.rtmp.substr(urlLen - 11, 11);
                    }
                    for1(idx + 1, topicArr);
                });
            }
            else {
                var a = [];
                for (var i = 0; i < topicArr.length; i++) {
                    var topicObj = topicArr[i];
                    var rArr = [];
                    for (var j = 0; j < topicObj.roomArr.length; j++) {
                        var obj = topicObj.roomArr[j];
                        rArr.push({
                            label: '[' + obj.mc + ']' + obj.title
                        })
                    }
                    a.push({
                        label: topicObj.topic,
                        click (item, focusedWindow) {
                        },
                        submenu: rArr
                    });
                }
                var newTopic = new MenuItem({
                    label: '话题', click() {
                        console.log('item 1 clicked');
                    }, submenu: a
                });
                this.buildMenu(newTopic);
            }
        };
        for1(0, topicArr);
    }
}