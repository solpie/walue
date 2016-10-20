var fs = require("fs");
var zip = require("node-native-zip");

var archive = new zip();


var fileArr = ["resources/app/main.js",
    "resources/app/index.html",
    "resources/app/static/fonts/material-design-icons/Material-Design-Icons.woff2",
    "resources/app/static/css/general.css",
    "resources/app/static/js/wcjs-player/index.js",
    "resources/app/static/monitor/index.js"];
var fArr = [];
for (var i = 0; i < fileArr.length; i++) {
    var obj = fileArr[i];
    fArr.push({name: obj, path: obj});
}
archive.addFiles(fArr, function (err) {
    if (err) return console.log("err while adding files", err);

    var buff = archive.toBuffer();

    fs.writeFile("./update.zip", buff, function () {
        console.log("Finished");
    });
});